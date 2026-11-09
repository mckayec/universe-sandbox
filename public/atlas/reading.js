/* Atlas per-work reading state (COS-BB-001, design revision 3 in docs/reviews/cosmere-book-by-book/).
   Pure helpers, unit-tested in a vm context (tests/atlas-reading.test.ts):
   - a validated work registry (works, buckets, versioned presets) read from pack.spoilers;
   - gate validation (DNF `req`, narrowing `needs`, descriptive `in`, explicit `public`) and ONE visibility
     function that intersects ancestor, record and field gates;
   - reading-state parsing for the URL hash and storage, failing closed into a safe state;
   - checklist / preset transitions.
   A pack without `spoilers.works` has no registry; the engine then keeps its numeric (legacy) behaviour
   unchanged. Nothing here touches the DOM. */
(function (root) {
  'use strict';

  const ID_RE = /^[a-z0-9][a-z0-9_-]*$/;
  const INT_RE = /^(0|[1-9][0-9]*)$/;
  const READ_PARAMS = ['book', 'upto', 'read'];
  const STORE_V2 = 'atlas-read:v2:';
  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  /* ---------- registry ---------- */

  /* Returns null when the pack has no `spoilers.works` (legacy-only pack). Otherwise returns the registry with an
     `errors` list; a registry with errors is not usable for per-work modes (ok === false). */
  function normRegistry(pack) {
    const sp = pack && pack.spoilers;
    if (!sp || sp.works === undefined) return null;
    const errors = [];
    const works = new Map();
    const order = [];
    if (!Array.isArray(sp.works) || !sp.works.length) errors.push('spoilers.works must be a nonempty array');
    (Array.isArray(sp.works) ? sp.works : []).forEach((w, i) => {
      if (!isObj(w) || typeof w.id !== 'string' || !ID_RE.test(w.id)) {
        errors.push('works[' + i + '] has no valid id');
        return;
      }
      if (works.has(w.id)) {
        errors.push('duplicate work id ' + w.id);
        return;
      }
      if (typeof w.title !== 'string' || !w.title) errors.push('work ' + w.id + ' has no title');
      const bucket = w.bucket === undefined ? null : w.bucket;
      if (bucket !== null && !(Number.isInteger(bucket) && bucket > 0))
        errors.push('work ' + w.id + ' has an invalid bucket');
      works.set(w.id, { id: w.id, title: String(w.title || w.id), y: w.y, pub: w.pub, bucket: bucket });
      order.push(w.id);
    });

    /* buckets: explicit `spoilers.buckets` ({"2": ["mb1", ...]}) when given, else derived from works[].bucket.
       A bucket that is empty or names an unknown work is recorded as invalid (no fallback for its records). */
    const buckets = new Map();
    const badBuckets = new Set();
    if (sp.buckets !== undefined) {
      if (!isObj(sp.buckets)) errors.push('spoilers.buckets must be an object');
      else
        Object.keys(sp.buckets).forEach((k) => {
          const list = sp.buckets[k];
          const key = INT_RE.test(k) ? Number(k) : NaN;
          const okList =
            Number.isInteger(key) &&
            key > 0 &&
            Array.isArray(list) &&
            list.length > 0 &&
            list.every((id) => typeof id === 'string' && works.has(id)) &&
            new Set(list).size === list.length;
          if (okList) buckets.set(key, list.slice());
          else if (Number.isInteger(key)) badBuckets.add(key);
        });
    } else {
      order.forEach((id) => {
        const b = works.get(id).bucket;
        if (b === null) return;
        if (!buckets.has(b)) buckets.set(b, []);
        buckets.get(b).push(id);
      });
    }

    /* presets: [{id, label, versions: [{v, seq: [workIds]}]}]; old versions are kept so saved links never gain
       a newly inserted work. */
    const presets = new Map();
    (Array.isArray(sp.presets) ? sp.presets : []).forEach((p, i) => {
      if (!isObj(p) || typeof p.id !== 'string' || !ID_RE.test(p.id) || presets.has(p.id)) {
        errors.push('presets[' + i + '] has no valid unique id');
        return;
      }
      const versions = new Map();
      (Array.isArray(p.versions) ? p.versions : []).forEach((ver) => {
        const okVer =
          isObj(ver) &&
          Number.isInteger(ver.v) &&
          ver.v > 0 &&
          !versions.has(ver.v) &&
          Array.isArray(ver.seq) &&
          ver.seq.length > 0 &&
          ver.seq.every((id) => typeof id === 'string' && works.has(id)) &&
          new Set(ver.seq).size === ver.seq.length;
        if (okVer) versions.set(ver.v, ver.seq.slice());
        else errors.push('preset ' + p.id + ' has an invalid version');
      });
      if (!versions.size) {
        errors.push('preset ' + p.id + ' has no valid version');
        return;
      }
      const latest = Math.max.apply(null, Array.from(versions.keys()));
      presets.set(p.id, { id: p.id, label: String(p.label || p.id), versions: versions, latest: latest });
    });
    if (sp.presets !== undefined && !Array.isArray(sp.presets)) errors.push('spoilers.presets must be an array');

    return {
      ok: errors.length === 0,
      errors: errors,
      works: works,
      order: order,
      buckets: buckets,
      badBuckets: badBuckets,
      presets: presets,
    };
  }

  /* ---------- gates ---------- */

  /* A DNF expression is valid only if every clause is a nonempty array of known work IDs (design 2a). A string is
     shorthand for [[id]]. Returns the normalised DNF or null (invalid). */
  function normExpr(expr, reg) {
    if (typeof expr === 'string') return reg.works.has(expr) ? [[expr]] : null;
    if (!Array.isArray(expr) || !expr.length) return null;
    const out = [];
    for (const clause of expr) {
      if (!Array.isArray(clause) || !clause.length) return null;
      for (const id of clause) if (typeof id !== 'string' || !reg.works.has(id)) return null;
      out.push(Array.from(new Set(clause)));
    }
    return out;
  }

  const INVALID = Object.freeze({ kind: 'invalid' });
  const NONE = Object.freeze({ kind: 'none' }); // absent field gate: adds no restriction

  /* Compile a gate object. `in` is descriptive and never affects visibility, but must name known works. */
  function compileGate(g, reg) {
    if (!isObj(g)) return INVALID;
    if (g.in !== undefined && normExpr(Array.isArray(g.in) ? [g.in] : g.in, reg) === null) return INVALID;
    const hasReq = own(g, 'req');
    const hasNeeds = own(g, 'needs');
    if (own(g, 'public')) {
      if (g.public !== true || hasReq || hasNeeds) return INVALID;
      return { kind: 'public' };
    }
    if (!hasReq) return INVALID;
    const req = normExpr(g.req, reg);
    if (!req) return INVALID;
    let needs = null;
    if (hasNeeds) {
      needs = normExpr(g.needs, reg);
      if (!needs) return INVALID;
    }
    return { kind: 'expr', req: req, needs: needs, unreviewed: false };
  }

  /* A record's own gate: its `gate` when present (an invalid present gate is NOT rescued by the bucket), else
     the whole-bucket fallback from its numeric `book`, marked unreviewed. No valid gate and no valid bucket →
     invalid (hidden). */
  function recordGate(rec, reg) {
    if (!isObj(rec)) return INVALID;
    if (own(rec, 'gate')) return compileGate(rec.gate, reg);
    const b = rec.book;
    if (!Number.isInteger(b) || b <= 0 || reg.badBuckets.has(b) || !reg.buckets.has(b)) return INVALID;
    return { kind: 'expr', req: [reg.buckets.get(b).slice()], needs: null, unreviewed: true };
  }

  /* A field's gate: absent → NONE (inherits), present → compiled (invalid hides only the field). */
  function fieldGate(holder, field, reg) {
    const fg = isObj(holder) && isObj(holder.gates) && own(holder.gates, field) ? holder.gates[field] : undefined;
    return fg === undefined ? NONE : compileGate(fg, reg);
  }

  function evalDNF(dnf, readSet) {
    return dnf.some((clause) => clause.every((id) => readSet.has(id)));
  }

  /* THE visibility function. `chain` is every gate that applies (ancestors…, record, field); all must pass.
     An empty chain is not "public": something must grant visibility. */
  function visible(chain, readSet) {
    if (!Array.isArray(chain) || !chain.length || !readSet || typeof readSet.has !== 'function') return false;
    let granted = false;
    for (const g of chain) {
      if (!g || g.kind === 'invalid') return false;
      if (g.kind === 'none') continue;
      if (g.kind === 'public') {
        granted = true;
        continue;
      }
      if (!evalDNF(g.req, readSet)) return false;
      if (g.needs && !evalDNF(g.needs, readSet)) return false;
      granted = true;
    }
    return granted;
  }

  /* Ancestor chain for an id through parentOf(id) → parent id | null. Returns ids root-first, or null on a cycle
     or a missing parent (callers hide the record). */
  function ancestry(id, parentOf, exists) {
    const seen = new Set([id]);
    const out = [];
    let p = parentOf(id);
    while (p != null) {
      if (seen.has(p) || (exists && !exists(p))) return null;
      seen.add(p);
      out.unshift(p);
      p = parentOf(p);
    }
    return out;
  }

  function anyUnreviewed(chain) {
    return chain.some((g) => g && g.kind === 'expr' && g.unreviewed);
  }

  /* ---------- reading state ---------- */
  /* States: {mode:'all'} | {mode:'legacy', book} | {mode:'preset', preset, v, work} | {mode:'set', ids}
     | {mode:'safe', reason}. 'all' and 'legacy' keep today's numeric rules; 'safe' reveals only public content. */

  function readSetOf(state, reg) {
    if (!state || !reg) return null;
    if (state.mode === 'safe') return new Set();
    if (state.mode === 'set') return new Set(state.ids);
    if (state.mode === 'preset') {
      const seq = reg.presets.get(state.preset).versions.get(state.v);
      return new Set(seq.slice(0, seq.indexOf(state.work) + 1));
    }
    return null; // all / legacy: numeric semantics
  }

  function validState(s, reg, maxBook) {
    if (!isObj(s)) return false;
    if (s.mode === 'all') return true;
    if (s.mode === 'legacy') return Number.isInteger(s.book) && s.book > 0 && s.book <= maxBook;
    if (!reg || !reg.ok) return false;
    if (s.mode === 'set')
      return (
        Array.isArray(s.ids) &&
        s.ids.length > 0 &&
        s.ids.every((id) => typeof id === 'string' && reg.works.has(id)) &&
        new Set(s.ids).size === s.ids.length
      );
    if (s.mode === 'preset') {
      const p = typeof s.preset === 'string' && reg.presets.get(s.preset);
      const seq = p && Number.isInteger(s.v) && p.versions.get(s.v);
      return !!seq && typeof s.work === 'string' && seq.indexOf(s.work) >= 0;
    }
    return false;
  }

  const safe = (reason) => ({ mode: 'safe', reason: reason });

  /* Parse the reading part of a hash ("#book=2&world=x" or a URLSearchParams). Returns
     {present:false} when no reading parameter is present, else {present:true, state} where state may be safe.
     Every rule of design §3 (GATE-03): repeated or conflicting parameters, strict integers, whole-list rejection. */
  function parseReadingParams(q, reg, maxBook) {
    const params = typeof q === 'string' ? new URLSearchParams(q.replace(/^#/, '')) : q;
    const present = READ_PARAMS.filter((k) => params.has(k));
    if (!present.length) return { present: false };
    for (const k of present) if (params.getAll(k).length > 1) return { present: true, state: safe('repeated ' + k) };
    if (present.length > 1) return { present: true, state: safe('conflict ' + present.join('+')) };
    const k = present[0];
    const val = params.get(k);
    if (k === 'book') {
      if (!INT_RE.test(val)) return { present: true, state: safe('malformed book') };
      const n = Number(val);
      if (n === 0) return { present: true, state: { mode: 'all' } };
      if (n > maxBook) return { present: true, state: safe('book out of range') };
      return { present: true, state: { mode: 'legacy', book: n } };
    }
    if (!reg || !reg.ok) return { present: true, state: safe(k + ' without a registry') };
    if (k === 'read') {
      const ids = val.split(',');
      const s = { mode: 'set', ids: ids };
      return { present: true, state: validState(s, reg, maxBook) ? s : safe('invalid read') };
    }
    const parts = val.split(':');
    if (parts.length !== 3 || !INT_RE.test(parts[1])) return { present: true, state: safe('malformed upto') };
    const s = { mode: 'preset', preset: parts[0], v: Number(parts[1]), work: parts[2] };
    return { present: true, state: validState(s, reg, maxBook) ? s : safe('invalid upto') };
  }

  /* Storage: v2 record (JSON) wins over the old numeric v1 key. Missing both → All. Invalid either → safe. */
  function parseStored(v2raw, v1raw, reg, maxBook) {
    if (v2raw != null) {
      let s;
      try {
        s = JSON.parse(v2raw);
      } catch (e) {
        return safe('unparseable stored state');
      }
      return validState(s, reg, maxBook) ? cleanState(s) : safe('invalid stored state');
    }
    if (v1raw != null) {
      if (!INT_RE.test(String(v1raw))) return safe('malformed stored book');
      const n = Number(v1raw);
      if (n === 0) return { mode: 'all' };
      if (n > maxBook) return safe('stored book out of range');
      return { mode: 'legacy', book: n };
    }
    return { mode: 'all' };
  }

  function cleanState(s) {
    if (s.mode === 'legacy') return { mode: 'legacy', book: s.book };
    if (s.mode === 'set') return { mode: 'set', ids: s.ids.slice() };
    if (s.mode === 'preset') return { mode: 'preset', preset: s.preset, v: s.v, work: s.work };
    return { mode: s.mode };
  }

  /* Start-up state: an explicit URL reading parameter wins (even an invalid one, which is safe); else storage. */
  function initialState(hash, v2raw, v1raw, reg, maxBook) {
    const fromUrl = parseReadingParams(hash || '', reg, maxBook);
    if (fromUrl.present) return { state: fromUrl.state, source: 'url' };
    return { state: parseStored(v2raw, v1raw, reg, maxBook), source: 'storage' };
  }

  /* Hash parameters for a state ({} for All). Safe state writes nothing: the invalid parameter stays until the
     reader makes a deliberate choice. */
  function hashParams(state) {
    if (!state) return {};
    if (state.mode === 'legacy') return { book: String(state.book) };
    if (state.mode === 'preset') return { upto: state.preset + ':' + state.v + ':' + state.work };
    if (state.mode === 'set') return { read: state.ids.join(',') };
    return {};
  }

  /* Storage value for a state, or null when nothing may be written (safe state). */
  function storeValue(state) {
    if (!state || state.mode === 'safe') return null;
    return JSON.stringify(cleanState(state));
  }

  /* ---------- controls ---------- */

  /* Checklist toggle. Starting from a preset, the explicit selection is the preset's read prefix; the result is
     always a custom set (never relabelled as a preset). Ticking a work never ticks any other work. Unticking the
     last work returns to All only by an explicit separate choice: an empty selection is the safe state. */
  function toggleWork(state, id, reg) {
    if (!reg || !reg.ok || !reg.works.has(id)) return state;
    const cur = readSetOf(state, reg) || new Set();
    const next = new Set(cur);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    if (!next.size) return safe('nothing selected');
    return { mode: 'set', ids: reg.order.filter((w) => next.has(w)) };
  }

  function choosePreset(reg, presetId, workId) {
    const p = reg && reg.ok && reg.presets.get(presetId);
    if (!p) return null;
    const seq = p.versions.get(p.latest);
    return seq.indexOf(workId) >= 0 ? { mode: 'preset', preset: p.id, v: p.latest, work: workId } : null;
  }

  /* What the bar shows: a label and the actual selected works (titles in registry order). */
  function describe(state, reg, bookTitle) {
    if (!state || state.mode === 'all') return { kind: 'all', label: 'All books', works: [] };
    if (state.mode === 'safe')
      return {
        kind: 'safe',
        label: 'This reading link could not be read — choose how far you’ve read',
        works: [],
      };
    if (state.mode === 'legacy')
      return {
        kind: 'legacy',
        label: 'Book ' + state.book + (bookTitle ? ': ' + bookTitle : '') + ' (series grouping)',
        works: [],
      };
    const rs = readSetOf(state, reg);
    const works = reg.order.filter((id) => rs.has(id)).map((id) => reg.works.get(id).title);
    if (state.mode === 'preset') {
      const p = reg.presets.get(state.preset);
      return {
        kind: 'preset',
        label: p.label + ': through ' + reg.works.get(state.work).title,
        works: works,
      };
    }
    return { kind: 'set', label: 'Custom selection: ' + works.length + ' read', works: works };
  }

  root.AtlasReading = {
    STORE_V2: STORE_V2,
    READ_PARAMS: READ_PARAMS,
    normRegistry: normRegistry,
    normExpr: normExpr,
    compileGate: compileGate,
    recordGate: recordGate,
    fieldGate: fieldGate,
    visible: visible,
    ancestry: ancestry,
    anyUnreviewed: anyUnreviewed,
    readSetOf: readSetOf,
    validState: validState,
    parseReadingParams: parseReadingParams,
    parseStored: parseStored,
    initialState: initialState,
    hashParams: hashParams,
    storeValue: storeValue,
    toggleWork: toggleWork,
    choosePreset: choosePreset,
    describe: describe,
  };
})(typeof window !== 'undefined' ? window : this);
