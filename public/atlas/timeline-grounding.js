/* Relationship grounding for timeline edges (timeline checkpoints 15 and 17).

   A codex card's `src` cites the card, not each of its `see` links, so the Standard Works adapter leaves every
   link's `src` empty and keeps the card's citation as `cardSrc`. This module reviews each relationship on its own.

   Checkpoint 17 (TL-R14/TL-R15) makes the parser and the containment test fail closed:

   * `parseLocator({t, u})` reads one citation into components, or returns { ok: false, why }. The URL must be an
     official scripture URL (exact origin and /study/scriptures/ path); the label's book must name the URL's book
     and the label's chapter must equal the URL's chapter. The whole label must be consumed: unsupported residue,
     reversed ranges, verse 0 and unknown books are rejected, never widened to the whole chapter. Components:
       verses   explicit verses of one chapter               ("Alma 34:7", "D&C 52:36–37 and 40")
       chapter  an explicit whole chapter or chapter range   ("Moses 3", "Genesis 11–12")
       heading  a chapter's heading, its own passage         ("D&C 52 heading"; "D&C 11 heading, 1" = heading ∪ 1)
       doc      a front-matter or dictionary document        ("Testimony of Eight Witnesses", "Bible Dictionary: X")
   * `groundLink(fromSrc, toSrc)` keeps the COMPLETE intersection of the two endpoints' components (every citation
     pair, unioned per chapter or document) and classes the relationship:
       shared-verse    both cards cite at least one identical verse explicitly;
       shared-chapter  the intersection is non-empty, but only through a whole chapter, a heading or a document;
       same-chapter    both cite the same chapter or document, with no common passage;
       cross-text      both cite something valid, but no common chapter or document;
       no-locator      one card or both have no valid citation (invalid citations are listed in `invalid`).
     A class is evidence for a reviewer, never a source by itself.
   * `eligibility(model, edgeId, src)` is the mechanical test: every component of every proposed locator lies inside
     the matching shared component (verses within verses or a whole chapter; a heading only within a heading; a
     whole chapter only within a whole chapter; a document only within that document). Passing it is mechanical
     eligibility only.
   * `applyEdgeSources(model, reviewed)` promotes an edge only when a version-1 review entry for it is `accepted`,
     binds the edge's own endpoints, type and claim, names its source version and rationale, and its locators are
     eligible. A cross-text entry may use `mode: 'independent'` with paired evidence: each side's locators must lie
     inside that endpoint's own citations, and a scope caveat is required. Every call reconciles: an edge promoted
     by an earlier call that is not accepted in this one loses its promoted source, so a revoked or rejected review
     can never leave a stale source behind.

   Checkpoint 18 (TL-R14 residual, TL-R16): Bible Dictionary titles must name the URL entry in full (slug or an
   explicit validated alias), chapter zero is rejected, the review mode must be stated and supported, and every row
   must carry a current binding (see bindingFor) and, where it declares one, current supplementary support.

   Checkpoint 19 (TL-R16 residual): the binding also covers the stated support requirement and the exact support
   manifest, each reviewed citation's exact URL, label and language (unknown provenance defers), and each endpoint's
   explanatory content (text, claim kinds, scoped notes, identity guards). `supportRequired` must be stated on every
   row. The one validated dictionary alias is "Elath or Eloth" → bd/elath. */
(function (root) {
  'use strict';

  const arr = v => (Array.isArray(v) ? v : v == null ? [] : [v]);
  const ORIGIN = 'https://www.churchofjesuschrist.org';
  const REVIEW_VERSION = 1;

  /* label book name → [volume, URL book]. Approved identities only; anything else is unsupported. */
  const BOOKS = {};
  function add(vol, list) {
    list.split(';').forEach(pair => {
      const [names, slug] = pair.split('=');
      names.split('|').forEach(n => (BOOKS[n.trim().toLowerCase()] = [vol, slug.trim()]));
    });
  }
  add(
    'ot',
    'Genesis=gen;Exodus=ex;Leviticus=lev;Numbers=num;Deuteronomy=deut;Joshua=josh;Judges=judg;Ruth=ruth;' +
      '1 Samuel=1-sam;2 Samuel=2-sam;1 Kings=1-kgs;2 Kings=2-kgs;1 Chronicles=1-chr;2 Chronicles=2-chr;Ezra=ezra;' +
      'Nehemiah=neh;Esther=esth;Job=job;Psalm|Psalms=ps;Proverbs=prov;Ecclesiastes=eccl;Song of Solomon=song;' +
      'Isaiah=isa;Jeremiah=jer;Lamentations=lam;Ezekiel=ezek;Daniel=dan;Hosea=hosea;Joel=joel;Amos=amos;' +
      'Obadiah=obad;Jonah=jonah;Micah=micah;Nahum=nahum;Habakkuk=hab;Zephaniah=zeph;Haggai=hag;Zechariah=zech;' +
      'Malachi=mal',
  );
  add(
    'nt',
    'Matthew=matt;Mark=mark;Luke=luke;John=john;Acts=acts;Romans=rom;1 Corinthians=1-cor;2 Corinthians=2-cor;' +
      'Galatians=gal;Ephesians=eph;Philippians=philip;Colossians=col;1 Thessalonians=1-thes;2 Thessalonians=2-thes;' +
      '1 Timothy=1-tim;2 Timothy=2-tim;Titus=titus;Philemon=philem;Hebrews=heb;James=james;1 Peter=1-pet;' +
      '2 Peter=2-pet;1 John=1-jn;2 John=2-jn;3 John=3-jn;Jude=jude;Revelation=rev',
  );
  add(
    'bofm',
    '1 Nephi=1-ne;2 Nephi=2-ne;3 Nephi=3-ne;4 Nephi=4-ne;Jacob=jacob;Enos=enos;Jarom=jarom;Omni=omni;' +
      'Words of Mormon=w-of-m;Mosiah=mosiah;Alma=alma;Helaman=hel;Mormon=morm;Ether=ether;Moroni=moro',
  );
  add('dc-testament', 'D&C|Doctrine and Covenants=dc;Official Declaration=od');
  add(
    'pgp',
    'Moses=moses;Abraham=abr;Joseph Smith—Matthew|Joseph Smith-Matthew=js-m;' +
      'Joseph Smith—History|Joseph Smith-History=js-h;Articles of Faith=a-of-f',
  );
  /* front matter: exact document titles → URL document paths */
  const DOCS = {
    'book of mormon title page': ['bofm/bofm-title', 'bofm/title-page'],
    'book of mormon introduction': ['bofm/introduction'],
    'brief explanation about the book of mormon': ['bofm/explanation'],
    'testimony of three witnesses': ['bofm/three'],
    'testimony of eight witnesses': ['bofm/eight'],
    'testimony of the prophet joseph smith': ['bofm/js'],
    'd&c introduction': ['dc-testament/introduction'],
    'pearl of great price introduction': ['pgp/introduction'],
    'official pgp introduction': ['pgp/introduction'],
  };

  /* Bible Dictionary: a full title maps to its URL entry by slug ("Galilee, Sea of" → galilee-sea-of). A title whose
     slug differs needs an explicit alias here, validated against the official entry by a reviewer first. Each alias
     is a complete heading, never a first word. Validated: "Elath or Eloth" is the full heading of the official English
     entry bd/elath (ChatGPT, HANDOFF_PLAN 2026-11-04; current title/URL identity, not an immutable edition). */
  const BD_ALIASES = { 'elath or eloth': 'elath' };
  const slug = s =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const bad = why => ({ ok: false, why });
  const DASH = '[–-]';
  const RANGE = new RegExp('^(\\d+)(?:\\s*' + DASH + '\\s*(\\d+))?$');

  /* "1–3, 5 and 7" → [1,2,3,5,7]; null when anything is unsupported (residue, reversed range, verse 0) */
  function verseList(s) {
    const text = String(s == null ? '' : s).trim();
    if (!text) return null;
    const out = [];
    for (const raw of text.split(/\s*,\s*(?:and\s+)?|\s+and\s+/)) {
      const m = raw.trim().match(RANGE);
      if (!m) return null;
      const a = +m[1];
      const b = m[2] ? +m[2] : a;
      if (a < 1 || b < a || b - a > 500) return null;
      for (let v = a; v <= b; v++) if (!out.includes(v)) out.push(v);
    }
    return out.sort((x, y) => x - y);
  }

  /* the URL's identity: { path: 'bofm/alma', ch: 34 } or { path: 'bofm/eight', ch: null }; null if not official */
  function urlIdentity(u) {
    /* parsed by pattern, not `new URL`, so the module runs unchanged in node vm contexts without a URL global */
    const s = String(u || '');
    if (s.slice(0, ORIGIN.length + 1) !== ORIGIN + '/') return null;
    const pathname = s.slice(ORIGIN.length).split(/[?#]/)[0];
    const m = pathname.match(/^\/study\/scriptures\/([a-z0-9-]+)\/([a-z0-9-]+)(?:\/(\d+))?\/?$/);
    if (!m) return null;
    /* chapter zero is never a chapter (TL-R14) */
    if (m[3] != null && +m[3] < 1) return null;
    return { vol: m[1], book: m[2], path: m[1] + '/' + m[2], ch: m[3] ? +m[3] : null };
  }

  function parseLocator(c) {
    if (!c) return bad('empty citation');
    const t = String(c.t || '')
      .trim()
      .replace(/\s+/g, ' ');
    const id = urlIdentity(c.u);
    if (!id) return bad('not an official scripture URL');
    /* front matter and dictionary entries: a document identity, never an invented chapter */
    if (id.ch == null) {
      const docs = DOCS[t.toLowerCase()];
      if (docs) {
        if (!docs.includes(id.path)) return bad('document title does not match the URL');
        return { ok: true, id: id.path, parts: [{ key: id.path, kind: 'doc' }] };
      }
      const bd = t.match(/^Bible Dictionary:\s*(.+)$/i);
      if (bd && id.vol === 'bd') {
        /* the complete title must name the URL's entry: its own slug, or an explicit validated alias (TL-R14) */
        const title = bd[1].trim().toLowerCase();
        const alias = Object.prototype.hasOwnProperty.call(BD_ALIASES, title) ? BD_ALIASES[title] : null;
        if (slug(title) !== id.book && alias !== id.book) return bad('dictionary entry does not match the URL');
        return { ok: true, id: id.path, parts: [{ key: id.path, kind: 'doc' }] };
      }
      return bad('unsupported document citation');
    }
    const m = t.match(/^(.+?)\s+(\d+)(.*)$/);
    if (!m) return bad('no chapter in the label');
    const named = BOOKS[m[1].toLowerCase()];
    if (!named) return bad('unknown book "' + m[1] + '"');
    if (named[0] + '/' + named[1] !== id.path) return bad('label book does not match the URL book');
    const ch = +m[2];
    if (ch < 1) return bad('chapter zero is not a chapter');
    if (ch !== id.ch) return bad('label chapter does not match the URL chapter');
    const key = id.path + '#' + ch;
    const rest = m[3].trim();
    if (!rest) return { ok: true, id: id.path, parts: [{ key, kind: 'chapter' }] };
    /* chapter range: "Genesis 11–12" (the URL names the first chapter) */
    const cr = rest.match(new RegExp('^' + DASH + '\\s*(\\d+)$'));
    if (cr) {
      const last = +cr[1];
      if (last <= ch || last - ch > 200) return bad('invalid chapter range');
      const parts = [];
      for (let k = ch; k <= last; k++) parts.push({ key: id.path + '#' + k, kind: 'chapter' });
      return { ok: true, id: id.path, parts };
    }
    /* verses: "34:7", "52:36–37 and 40" */
    if (rest[0] === ':') {
      const vs = verseList(rest.slice(1));
      if (!vs) return bad('unsupported verse list "' + rest.slice(1).trim() + '"');
      return { ok: true, id: id.path, parts: [{ key, kind: 'verses', verses: vs }] };
    }
    /* heading, optionally with verses: "52 heading", "11 heading, 1", "110 heading, 11–16" */
    const hm = rest.match(/^heading(?:\s*,\s*(.+))?$/i);
    if (hm) {
      const parts = [{ key, kind: 'heading' }];
      if (hm[1] != null) {
        const vs = verseList(hm[1]);
        if (!vs) return bad('unsupported verse list after heading "' + hm[1] + '"');
        parts.push({ key, kind: 'verses', verses: vs });
      }
      return { ok: true, id: id.path, parts };
    }
    return bad('unsupported locator text "' + rest + '"');
  }

  /* union of components per chapter or document */
  function unionOf(parts) {
    const map = new Map();
    parts.forEach(p => {
      let u = map.get(p.key);
      if (!u) map.set(p.key, (u = { key: p.key, chapter: false, heading: false, doc: false, verses: new Set() }));
      if (p.kind === 'chapter') u.chapter = true;
      else if (p.kind === 'heading') u.heading = true;
      else if (p.kind === 'doc') u.doc = true;
      else p.verses.forEach(v => u.verses.add(v));
    });
    return map;
  }

  function partsOf(src, side, invalid) {
    const parts = [];
    arr(src).forEach(c => {
      const p = parseLocator(c);
      if (p.ok) p.parts.forEach(x => parts.push(Object.assign({ c }, x)));
      else if (invalid) invalid.push({ side, t: c && c.t, why: p.why });
    });
    return parts;
  }

  /* intersection of two components of the same key, or null. `exact` marks a verse cited explicitly by both. */
  function meet(x, y) {
    if (x.kind === 'doc' || y.kind === 'doc')
      return x.kind === y.kind ? { kind: 'doc', exact: false } : null;
    if (x.kind === 'heading' || y.kind === 'heading')
      return x.kind === y.kind ? { kind: 'heading', exact: false } : null;
    if (x.kind === 'chapter' && y.kind === 'chapter') return { kind: 'chapter', exact: false };
    if (x.kind === 'chapter') return { kind: 'verses', verses: y.verses, exact: false };
    if (y.kind === 'chapter') return { kind: 'verses', verses: x.verses, exact: false };
    const vs = x.verses.filter(v => y.verses.includes(v));
    return vs.length ? { kind: 'verses', verses: vs, exact: true } : null;
  }

  function groundLink(fromSrc, toSrc) {
    const invalid = [];
    const a = partsOf(fromSrc, 'from', invalid);
    const b = partsOf(toSrc, 'to', invalid);
    if (!a.length || !b.length) return { cls: 'no-locator', shared: [], invalid };
    const pieces = [];
    let sameKey = false;
    let exact = false;
    a.forEach(x =>
      b.forEach(y => {
        if (x.key !== y.key) return;
        sameKey = true;
        const r = meet(x, y);
        if (!r) return;
        if (r.exact) exact = true;
        pieces.push(Object.assign({ key: x.key }, r));
      }),
    );
    /* the complete intersection, unioned per key; a summary class never discards any of it */
    const shared = [...unionOf(pieces).values()].map(u => ({
      key: u.key,
      chapter: u.chapter,
      heading: u.heading,
      doc: u.doc,
      verses: u.chapter ? null : [...u.verses].sort((p, q) => p - q),
    }));
    const cls = exact ? 'shared-verse' : shared.length ? 'shared-chapter' : sameKey ? 'same-chapter' : 'cross-text';
    return { cls, shared, invalid };
  }

  /* every component of `loc` lies inside the matching component of `shared` (array from groundLink, or a Map) */
  function insideShared(loc, shared) {
    const p = parseLocator(loc);
    if (!p.ok) return false;
    const map = shared instanceof Map ? shared : new Map(arr(shared).map(s => [s.key, s]));
    return p.parts.every(x => {
      const s = map.get(x.key);
      if (!s) return false;
      if (x.kind === 'doc') return !!s.doc;
      if (x.kind === 'heading') return !!s.heading;
      if (x.kind === 'chapter') return !!s.chapter;
      if (s.chapter) return true;
      const vs = s.verses instanceof Set ? [...s.verses] : arr(s.verses);
      return x.verses.every(v => vs.includes(v));
    });
  }

  function endpoints(model, id) {
    const e = model.edges.find(x => x.id === id);
    if (!e) return null;
    const recs = new Map(model.records.map(r => [r.id, r]));
    return { e, from: recs.get(e.from), to: recs.get(e.to) };
  }

  /* mechanical eligibility only: proposed locators inside the endpoints' complete shared passage */
  function eligibility(model, id, src) {
    const ep = endpoints(model, id);
    if (!ep) return { ok: false, why: 'no such edge' };
    const g = groundLink(ep.from && ep.from.src, ep.to && ep.to.src);
    const locs = arr(src);
    if (!locs.length) return { ok: false, why: 'no locator in the reviewed entry', cls: g.cls };
    for (const c of locs) {
      const p = parseLocator(c);
      if (!p.ok) return { ok: false, why: 'proposed locator invalid: ' + p.why, cls: g.cls };
      if (!insideShared(c, g.shared))
        return { ok: false, why: 'locator is not cited by both cards (' + g.cls + ')', cls: g.cls };
    }
    return { ok: true, why: null, cls: g.cls };
  }

  /* independent evidence for a cross-text relationship: each side inside that endpoint's own citations */
  function independentEligibility(model, id, evidence) {
    const ep = endpoints(model, id);
    if (!ep) return { ok: false, why: 'no such edge' };
    const ev = evidence || {};
    for (const side of ['from', 'to']) {
      const locs = arr(ev[side]);
      if (!locs.length) return { ok: false, why: 'independent evidence needs a ' + side + ' locator' };
      const own = unionOf(partsOf(ep[side] && ep[side].src));
      for (const c of locs) {
        const p = parseLocator(c);
        if (!p.ok) return { ok: false, why: side + ' evidence invalid: ' + p.why };
        if (!insideShared(c, own)) return { ok: false, why: side + ' evidence is not cited by that card' };
      }
    }
    return { ok: true, why: null };
  }

  const filled = v => typeof v === 'string' && v.trim().length > 0;
  const MODES = ['shared', 'independent'];
  const SUPPORT_ROLE = 'support';

  /* ---------- current bindings (TL-R16) ----------
     A review row is approved against what the reviewer saw. Stable IDs are not enough: the row carries `binding`, a
     fingerprint the module recomputes from the CURRENT model on every call — the edge's endpoints, direction, type
     and label; each endpoint's id, label, source id, section and citations; the model's declared source version —
     together with the row's own claim, mode, scope and locators. Any change on either side makes the stored
     fingerprint stale and the row is deferred. The comparison is against the live model, never against a copy of
     the approval. A model without a declared `sourceVersion` cannot bind anything. */
  function hash(str) {
    /* two 32-bit FNV-1a lanes → 16 hex digits; deterministic, no platform crypto needed */
    let a = 0x811c9dc5;
    let b = 0x01000193 ^ 0x5bd1e995;
    for (let i = 0; i < str.length; i++) {
      const k = str.charCodeAt(i);
      a = Math.imul(a ^ k, 0x01000193) >>> 0;
      b = Math.imul(b ^ k, 0x5bd1e995) >>> 0;
      b = (b ^ (b >>> 13)) >>> 0;
    }
    return ('00000000' + a.toString(16)).slice(-8) + ('00000000' + b.toString(16)).slice(-8);
  }
  const citesOf = src => arr(src).map(c => [String((c && c.t) || ''), String((c && c.u) || '')]);
  /* an endpoint as the reviewer saw it: identity, citations and the explanatory content a claim rests on (its own
     text, claim kinds, scoped notes with their locators, and identity guards). A stable id or label alone never
     preserves a reviewed claim (TL-R16). */
  const noteSnap = ns => arr(ns).map(n => [n && n.k != null ? n.k : null, String((n && n.t) || ''), n && n.loc != null ? n.loc : null]);
  const guardSnap = ns => arr(ns).map(n => [n && n.id != null ? n.id : null, String((n && n.t) || '')]);
  const recordSnap = r =>
    r
      ? {
          id: r.id,
          label: r.label || '',
          sourceId: r.sourceId || null,
          section: r.section || null,
          src: citesOf(r.src),
          text: r.text == null ? null : String(r.text),
          claim: r.claim == null ? null : r.claim,
          notes: noteSnap(r.notes),
          notSame: guardSnap(r.notSame),
        }
      : null;
  /* provenance of a reviewed citation: the exact label and URL, and the page language. The URL's only query must be
     one `lang` code; anything else is unknown provenance and defers the row (canonical components alone would let
     ?lang=eng become ?lang=spa unnoticed). */
  function provenanceOf(c) {
    const u = String((c && c.u) || '');
    const q = u.split('#')[0].split('?');
    if (q.length !== 2) return null;
    const m = q[1].match(/^lang=([a-z]{3})$/);
    if (!m) return null;
    return { t: String((c && c.t) || '').trim().replace(/\s+/g, ' '), u, lang: m[1] };
  }
  const provKey = src =>
    arr(src).map(c => {
      const p = provenanceOf(c);
      return p ? [p.t, p.u, p.lang] : ['unknown', String((c && c.u) || '')];
    });
  /* the support the reviewer approved: requirement and the exact item manifest (ids, purposes, claims, citations
     with provenance). Removing, substituting or weakening it changes the row binding. State and item fingerprints
     are checked separately, so a revoked item reports itself. */
  const supportManifest = en => ({
    required: en.supportRequired === true ? true : en.supportRequired === false ? false : null,
    items: arr(en.support).map(it => {
      const x = it || {};
      return [x.id || null, x.role || null, x.purpose || '', x.claim || '', partsKey(x.src), provKey(x.src)];
    }),
  });
  /* canonical components of locators: what they mean, not how they are spelled */
  const partsKey = src =>
    arr(src).map(c => {
      const p = parseLocator(c);
      return p.ok ? p.parts.map(x => x.kind + ' ' + x.key + (x.verses ? ':' + x.verses.join(',') : '')) : ['invalid'];
    });

  function currentSnapshot(model, id) {
    const ep = endpoints(model, id);
    if (!ep) return null;
    return {
      sourceVersion: model.sourceVersion || null,
      edge: { id: ep.e.id, from: ep.e.from, to: ep.e.to, type: ep.e.type, label: ep.e.label || null },
      from: recordSnap(ep.from),
      to: recordSnap(ep.to),
    };
  }

  /* the fingerprint a review row must carry to bind the edge as it is now */
  function bindingFor(model, id, entry) {
    const snap = currentSnapshot(model, id);
    if (!snap || !snap.sourceVersion) return null;
    const en = entry || {};
    const ev = en.evidence || {};
    return hash(
      JSON.stringify({
        v: REVIEW_VERSION,
        snap,
        claim: en.claim || '',
        mode: en.mode || null,
        scope: en.scope || null,
        src: partsKey(en.src),
        evidence: { from: partsKey(ev.from), to: partsKey(ev.to) },
        prov: { src: provKey(en.src), from: provKey(ev.from), to: provKey(ev.to) },
        support: supportManifest(en),
      }),
    );
  }

  /* the first reviewed citation (primary, evidence or support) whose provenance is unknown, or null */
  function unknownProvenance(entry) {
    const ev = entry.evidence || {};
    const all = arr(entry.src)
      .concat(arr(ev.from), arr(ev.to))
      .concat(...arr(entry.support).map(it => arr(it && it.src)));
    const c = all.find(x => !provenanceOf(x));
    return c ? 'unknown provenance for "' + String((c && c.t) || '') + '" (URL needs exactly one lang code)' : null;
  }

  /* ---------- supplementary support (pilot rows 3 and 9) ----------
     Context a bounded claim needs that lies outside the endpoints' own citations (e.g. a section heading that names
     a person in full). Support is a separate role: it is never containment-checked against the endpoint cards, never
     enters `edge.src` or `locator`, and never widens the primary locator. Each item names its purpose and claim, its
     citations must parse to canonical identities, its state must be `accepted`, and its own fingerprint binds it to
     the current edge binding, its citations and the model's source version. A row that declares
     `supportRequired: true` is deferred unless every support item is current and at least one exists; any present
     item that is stale, invalid or not accepted defers the row in either case. */
  function supportFingerprint(model, id, entry, item) {
    const edge = bindingFor(model, id, entry);
    if (!edge) return null;
    const it = item || {};
    return hash(
      JSON.stringify({
        v: REVIEW_VERSION,
        role: SUPPORT_ROLE,
        edge,
        sourceVersion: model.sourceVersion,
        purpose: it.purpose || '',
        claim: it.claim || '',
        src: partsKey(it.src),
        prov: provKey(it.src),
      }),
    );
  }

  function supportProblem(model, id, entry) {
    const items = entry.support == null ? [] : entry.support;
    if (!Array.isArray(items)) return 'support must be a list';
    if (entry.supportRequired !== true && entry.supportRequired !== false)
      return items.length ? 'support is present but supportRequired is not stated' : 'supportRequired is not stated';
    for (const it of items) {
      const name = 'support ' + ((it && it.id) || '?');
      if (!it || it.role !== SUPPORT_ROLE) return name + ' has no support role';
      if (it.state !== 'accepted') return name + ' state is ' + (it.state || 'missing') + ', not accepted';
      if (!filled(it.purpose)) return name + ' has no purpose';
      if (!filled(it.claim)) return name + ' has no claim';
      const locs = arr(it.src);
      if (!locs.length) return name + ' has no citation';
      for (const c of locs) {
        const p = parseLocator(c);
        if (!p.ok) return name + ' citation invalid: ' + p.why;
      }
      if (it.fingerprint !== supportFingerprint(model, id, entry, it)) return name + ' binding is stale or missing';
    }
    if (entry.supportRequired === true && !items.length) return 'required support is missing';
    return null;
  }

  /* the per-row semantic acceptance a promotion requires (review sidecar row, version 1) */
  function acceptance(model, entry, e) {
    if (!entry || entry.v !== REVIEW_VERSION) return 'no version-' + REVIEW_VERSION + ' review entry';
    if (entry.state !== 'accepted') return 'review state is ' + (entry.state || 'missing') + ', not accepted';
    if (!MODES.includes(entry.mode)) return 'review mode is not stated';
    if (entry.from !== e.from || entry.to !== e.to) return 'review endpoints/direction do not match the edge';
    if (entry.type !== e.type) return 'review type does not match the edge';
    if (!filled(entry.claim)) return 'review has no claim';
    if (!filled(entry.basis)) return 'review has no rationale';
    if (!filled(entry.sourceVersion)) return 'review has no source version';
    if (!model.sourceVersion) return 'the model declares no current source version';
    if (entry.sourceVersion !== model.sourceVersion) return 'review source version is not the current source version';
    if (entry.mode === 'independent' && !filled(entry.scope)) return 'independent evidence needs a scope caveat';
    if (entry.supportRequired !== true && entry.supportRequired !== false)
      return arr(entry.support).length ? 'support is present but supportRequired is not stated' : 'supportRequired is not stated';
    const prov = unknownProvenance(entry);
    if (prov) return prov;
    if (!filled(entry.binding) || entry.binding !== bindingFor(model, e.id, entry))
      return 'review binding is stale or missing (edge, endpoints or sources changed since review)';
    return supportProblem(model, e.id, entry);
  }

  function clearPromotion(e) {
    e.src = [];
    e.locator = null;
    e.basis = null;
    delete e.grounding;
  }

  /* reviewed: { [edgeId]: review entry } — see the header. Returns { promoted, rejected, revoked }.
     `rejected[].eligible` is true when the locators pass mechanically and only the review blocks promotion. */
  function applyEdgeSources(model, reviewed) {
    const promoted = [];
    const rejected = [];
    const revoked = [];
    const byId = new Map(model.edges.map(e => [e.id, e]));
    const accepted = new Map();
    Object.keys(reviewed || {}).forEach(id => {
      const entry = reviewed[id];
      const e = byId.get(id);
      if (!e) return rejected.push({ id, why: 'no such edge' });
      const mode = entry && entry.mode;
      if (mode != null && !MODES.includes(mode))
        return rejected.push({ id, why: 'unsupported review mode "' + mode + '"', eligible: false });
      const independent = mode === 'independent';
      const src = independent
        ? arr(entry.evidence && entry.evidence.from).concat(arr(entry.evidence && entry.evidence.to))
        : arr(entry && entry.src);
      /* a row without a mode is checked as shared for the report only; acceptance() still refuses it */
      const mech = independent ? independentEligibility(model, id, entry.evidence) : eligibility(model, id, src);
      if (!mech.ok) return rejected.push({ id, why: mech.why, eligible: false });
      const sem = acceptance(model, entry, e);
      if (sem) return rejected.push({ id, why: sem, eligible: true });
      accepted.set(id, { entry, src });
    });
    model.edges.forEach(e => {
      const a = accepted.get(e.id);
      /* every call starts from nothing: a promotion exists only if this call accepts it */
      const was = !!e.grounding;
      if (was) clearPromotion(e);
      if (!a) {
        if (was) revoked.push(e.id);
        return;
      }
      e.src = a.src.map(c => ({ t: c.t, u: c.u }));
      e.locator = a.src.map(c => c.t).join('; ');
      e.basis = a.entry.basis;
      e.grounding = {
        v: REVIEW_VERSION,
        mode: a.entry.mode,
        claim: a.entry.claim,
        sourceVersion: a.entry.sourceVersion,
        binding: a.entry.binding,
        scope: a.entry.scope || null,
        support: arr(a.entry.support).map(it => ({
          id: it.id || null,
          purpose: it.purpose,
          claim: it.claim,
          src: arr(it.src).map(c => ({ t: c.t, u: c.u })),
        })),
      };
      promoted.push(e.id);
    });
    return { promoted, rejected, revoked };
  }

  /* every relationship with its class, for the review ledger */
  function ledger(model) {
    const recs = new Map(model.records.map(r => [r.id, r]));
    return model.edges.map(e => {
      const from = recs.get(e.from);
      const to = recs.get(e.to);
      const g =
        e.type === 'travel'
          ? { cls: 'travel', shared: [], invalid: [] }
          : groundLink(from && from.src, to && to.src);
      return { edge: e, from, to, cls: g.cls, shared: g.shared, invalid: g.invalid };
    });
  }

  /* ---------- host loading of a review sidecar (checkpoint 21) ----------
     The host passes the sidecar file it shipped (or nothing) and the source version it declares for the pack it is
     showing. The sidecar never supplies the model's source version: a host that declares none promotes nothing.
     Every outcome reconciles the model (applyEdgeSources is always called), so a previous promotion can never survive
     a missing, invalid, stale or changed sidecar. Statuses:
       absent   no sidecar: every relationship stays unsourced;
       invalid  wrong kind, review version or pack, or rows that are not a map: nothing is read from it;
       stale    the sidecar's manifest names another source version than the host's: nothing is read from it;
       ok       rows are applied; a row whose binding no longer matches the current edge is listed in `changed`
                and is rejected by acceptance() like any other stale row.
     Recommendations are never states: a `proposed` row with recommendation `accept` stays rejected. */
  const SIDECAR_KIND = 'atlas-timeline-review-sidecar';
  function sidecarProblem(sc, packId) {
    if (!sc || typeof sc !== 'object') return 'sidecar is not an object';
    if (sc.kind !== SIDECAR_KIND) return 'sidecar kind is not ' + SIDECAR_KIND;
    if (sc.reviewVersion !== REVIEW_VERSION) return 'sidecar review version is not ' + REVIEW_VERSION;
    if (packId != null && sc.pack !== packId) return 'sidecar is for another pack';
    if (!sc.rows || typeof sc.rows !== 'object' || Array.isArray(sc.rows)) return 'sidecar rows are not a map';
    if (!sc.manifest || !filled(sc.manifest.sourceVersion)) return 'sidecar manifest names no source version';
    return null;
  }
  function loadSidecar(model, sidecar, host) {
    const h = host || {};
    model.sourceVersion = filled(h.sourceVersion) ? h.sourceVersion : null;
    const out = (status, why, res, changed) =>
      Object.assign({ status, why: why || null, changed: changed || [] }, res);
    if (sidecar == null) return out('absent', null, applyEdgeSources(model, {}));
    const bad = sidecarProblem(sidecar, h.packId);
    if (bad) return out('invalid', bad, applyEdgeSources(model, {}));
    if (sidecar.manifest.sourceVersion !== model.sourceVersion)
      return out('stale', 'sidecar source version is not the current source version', applyEdgeSources(model, {}));
    const changed = Object.keys(sidecar.rows).filter(id => {
      const row = sidecar.rows[id];
      return !row || row.binding !== bindingFor(model, id, row);
    });
    return out('ok', null, applyEdgeSources(model, sidecar.rows), changed);
  }

  root.AtlasTimelineGrounding = {
    REVIEW_VERSION,
    parseLocator,
    verseList,
    groundLink,
    insideShared,
    eligibility,
    independentEligibility,
    applyEdgeSources,
    currentSnapshot,
    bindingFor,
    supportFingerprint,
    provenanceOf,
    ledger,
    loadSidecar,
  };
})(typeof window !== 'undefined' ? window : globalThis);
