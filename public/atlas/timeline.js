/* Atlas synchronoptic timeline: pure model (docs/reviews/synchronoptic-timelines/proposal.md §2).
   Adapters read a pack's existing fields and emit read-only records, edges and lanes; no pack gains dates it does
   not have. Gating, calendar arithmetic, coverage gaps and URL-state validation live here too, so the DOM view
   (timeline-view.js, next unit) only draws what this module returns. No DOM. Unit-tested in a vm context
   (tests/atlas-timeline.test.ts).

   Rules carried from the proposal review (parallel-handoff-review.md, corrections 1–6):
   * Every record keeps whenText, date precision (approx / window / range) and its claim kinds through adaptation.
   * An emergence window is a window, never a lifespan: `presence` records with `when.window` keep the window
     separate from the continued presence after it, and an open end stays open (no invented end year).
   * Nothing becomes a travel edge unless the pack gives ordered, dated stops with a source; none do yet.
   * An edge is displayed only when it carries a source locator (`src`). Edges without one are kept in the model
     and reported as coverage gaps, not drawn as factual relationships.
   * Institutional branching is not family genealogy, succession or migration: those are reported as gaps.
   * Gates filter both endpoints and the edge's own gate before layout, counts, search, list, selection and URL. */
(function (root) {
  'use strict';

  const EDGE_TYPES = [
    'parent',
    'spouse',
    'succession',
    'branch',
    'within',
    'division',
    'merge',
    'overlap',
    'context',
    'contact',
    'history',
    'travel',
    'quotation',
    'vision',
    'composition',
    'transmission',
    'same-entity',
    'describes',
  ];
  /* tree relation families (PACK_FORMAT §21.1) map one-to-one; `merger` is the tree's name for `merge` */
  const TREE_TYPE = { merger: 'merge' };
  const edgeType = (t, dflt) => {
    const k = TREE_TYPE[t] || t || dflt;
    return EDGE_TYPES.includes(k) ? k : dflt;
  };

  /* ---------- calendar (gregorian-ce, BCE/CE, no year 0) ---------- */
  /* 1 BCE is -1 and 1 CE is 1. The axis runs on astronomical years (1 BCE = 0) so that 1 BCE → 1 CE is one year */
  const astro = y => (y < 0 ? y + 1 : y);
  const fromAstro = a => (a <= 0 ? a - 1 : a);
  const yearsBetween = (a, b) => astro(b) - astro(a);
  const yearLabel = y => (y < 0 ? -y + ' BCE' : y + ' CE');

  /* ---------- helpers ---------- */
  const arr = x => (Array.isArray(x) ? x : x == null ? [] : [x]);
  const claimsOf = notes => {
    const k = [];
    arr(notes).forEach(n => {
      if (n && n.k && !k.includes(n.k)) k.push(n.k);
    });
    return k;
  };
  /* Citation sources are only explicit `src` entries. An internal `ref` (a codex/place-card id) is NOT a citation:
     it is kept separately as `atlasRef` for navigation (TL-R01). */
  const srcOf = o => {
    const s = [];
    arr(o && o.src).forEach(x => s.push(typeof x === 'string' ? { t: x } : x));
    return s;
  };
  /* the record's own wording, carried verbatim: each note keeps its claim kind, text and its locator (`ref` on a
     note is a text/citation locator such as "Gen. 12; Exod. 19"); identity guards keep their wording and target */
  const notesOf = notes =>
    arr(notes)
      .filter(n => n && n.t)
      .map(n => ({ k: n.k || null, t: n.t, loc: n.ref || null }));
  const notSameOf = ns =>
    arr(ns)
      .filter(n => n && n.t)
      .map(n => ({ id: n.id || null, t: n.t }));
  /* Gate fields the atlas understands (PACK_FORMAT §6): layers, a `books` list, a first book, and an event's single
     `book` (shown iff event.book <= selected book, i.e. a first book). An optional `chapter` is carried so a
     chapter-aware host can gate on it; the atlas host has no chapter selector, so nothing here is chapter-safe yet. */
  const gateOf = o => {
    const first = o.first != null ? o.first : o.book != null ? o.book : null;
    return { layers: arr(o.layers), books: o.books || null, first, chapter: o.chapter == null ? null : o.chapter };
  };
  const NARRATIVE = /narrative|no (modern|calendar|BCE)/i;

  /* ---------- adapter: tree (Religious Traditions, PACK_FORMAT §21/§21.1) + Chronicle events ---------- */
  function nodeWhen(n) {
    if (n.undated || (n.when == null && !n.emerge)) return null;
    if (n.emerge) {
      const [a, b] = n.emerge;
      return { window: [a, b], from: a, to: n.until != null ? n.until : null, toOpen: !!n.ongoing && n.until == null };
    }
    if (Array.isArray(n.when)) return { from: n.when[0], to: n.when[1], approx: !!n.approx };
    return { from: n.when, to: null, toOpen: !!n.ongoing, approx: !!n.approx };
  }

  /* Relationship source locators (an optional `relationship-sources` data part, PACK_FORMAT §1.1): keyed
     `<p|m|l>:<from>><to>`. A sourced entry names the research ledger row (`loc`) and its evidence keys (`ev`), which
     become the edge's citations; an `editorial` entry marks an overview grouping, which is never a historical claim
     and is neither drawn nor counted as a missing source. A relationship's own `src` always wins. */
  function relSourcesOf(pack) {
    const parts = (root.ATLAS_PACK_PARTS || {})[pack.id] || {};
    const rs = parts['relationship-sources'];
    return rs && rs.edges ? rs : null;
  }
  function withLocator(edge, key, rs) {
    const hit = rs && rs.edges[key];
    edge.key = key;
    edge.locator = null;
    edge.editorial = false;
    if (!hit || edge.src.length) return edge;
    if (hit.editorial) {
      edge.editorial = true;
      edge.why = hit.why || null;
      return edge;
    }
    edge.locator = hit.loc || null;
    edge.src = arr(hit.ev)
      .filter(k => rs.sources[k])
      .map(k => ({
        key: k,
        t: k + ' · ' + rs.sources[k].t,
        u: rs.sources[k].u || null,
        alt: arr(rs.sources[k].alt).filter(x => x && x.u),
        scope: rs.sources[k].scope || null,
      }));
    return edge;
  }

  function adaptTree(pack) {
    const T = pack.tree || { nodes: [], links: [] };
    const rs = relSourcesOf(pack);
    const records = [];
    const edges = [];
    const lanes = [];
    const layerName = {};
    arr(pack.layers).forEach(l => (layerName[l.id] = l.name || l.id));
    const laneFor = layers => 'lane-' + (arr(layers)[0] || 'other');
    const seenLane = {};
    const addLane = (id, title, group, gate) => {
      if (seenLane[id]) return;
      seenLane[id] = true;
      lanes.push({ id, title, group, gate });
    };

    T.nodes.forEach((n, i) => {
      const lane = laneFor(n.layers);
      addLane(lane, layerName[arr(n.layers)[0]] || 'Other', 'tradition', { layers: arr(n.layers).slice(0, 1) });
      const when = nodeWhen(n);
      records.push({
        id: 'n:' + n.id,
        sourceId: n.id,
        source: 'tree',
        label: n.name,
        lane,
        kind: when ? 'presence' : 'undated',
        chron:
          !when && (NARRATIVE.test(n.whenText || '') || /textual/i.test(n.kind || '')) ? 'narrative' : 'historical',
        claim: claimsOf(n.notes),
        text: n.blurb || null,
        notes: notesOf(n.notes),
        notSame: notSameOf(n.notSame),
        atlasRef: null,
        calendar: 'gregorian-ce',
        when,
        order: i,
        whenText: n.whenText || null,
        nodeKind: n.kind || null,
        src: srcOf(n),
        gate: gateOf(n),
      });
      if (n.parent)
        edges.push(
          withLocator(
            {
              id: 'p:' + n.id,
              from: 'n:' + n.parent,
              to: 'n:' + n.id,
              type: edgeType(n.parentType, 'branch'),
              label: n.parentRel || null,
              src: arr(n.parentSrc).length ? srcOf({ src: n.parentSrc }) : [],
              gate: gateOf(n),
            },
            'p:' + n.parent + '>' + n.id,
            rs,
          ),
        );
      arr(n.merge).forEach(m =>
        edges.push(
          withLocator(
            {
              id: 'm:' + m + '>' + n.id,
              from: 'n:' + m,
              to: 'n:' + n.id,
              type: 'merge',
              label: n.parentRel || null,
              src: arr(n.mergeSrc).length ? srcOf({ src: n.mergeSrc }) : [],
              gate: gateOf(n),
            },
            'm:' + m + '>' + n.id,
            rs,
          ),
        ),
      );
    });
    arr(T.links).forEach((l, i) =>
      edges.push(
        withLocator(
          {
            id: 'l:' + i + ':' + l.from + '>' + l.to,
            from: 'n:' + l.from,
            to: 'n:' + l.to,
            type: edgeType(l.type, 'overlap'),
            label: l.rel || l.label || null,
            when: l.when == null ? null : l.when,
            src: srcOf(l),
            gate: gateOf(l),
          },
          'l:' + l.from + '>' + l.to,
          rs,
        ),
      ),
    );

    arr(pack.events).forEach((e, i) => {
      const lane = 'chron-' + (arr(e.layers)[0] || 'other');
      addLane(lane, 'Chronicle · ' + (layerName[arr(e.layers)[0]] || 'Other'), 'events', {
        layers: arr(e.layers).slice(0, 1),
      });
      let when = null;
      if (Array.isArray(e.when)) when = { from: e.when[0], to: e.when[1], range: true, approx: !!e.approx };
      else if (e.when != null) when = { from: e.when, to: null, approx: !!e.approx };
      const narrative = !when && NARRATIVE.test(e.whenText || '');
      records.push({
        id: 'e:' + e.id,
        sourceId: e.id,
        source: 'events',
        label: e.title,
        lane,
        kind: when ? 'event' : 'undated',
        chron: narrative ? 'narrative' : 'historical',
        claim: claimsOf(e.notes),
        text: e.text || null,
        notes: notesOf(e.notes),
        notSame: notSameOf(e.notSame),
        atlasRef: e.ref || null,
        calendar: 'gregorian-ce',
        when,
        order: i,
        whenText: e.whenText || null,
        src: srcOf(e),
        gate: gateOf(e),
      });
    });
    return { calendar: 'gregorian-ce', records, edges, lanes, journeys: arr(journeysOf(pack)) };
  }
  function journeysOf(pack) {
    const out = [];
    arr(pack.codex).forEach(c => {
      if (c.id === 'journeys') arr(c.list).forEach(j => out.push(j));
    });
    return out;
  }

  /* ---------- gating ---------- */
  /* `ok(gate)` is the atlas's own filter (layers.js + book gate). Records first, then edges whose endpoints both
     survive and whose own gate passes; lanes that keep at least one record. Everything downstream uses this. */
  function visible(model, ok) {
    const recs = model.records.filter(r => ok(r.gate));
    const ids = new Set(recs.map(r => r.id));
    const edges = model.edges.filter(e => ids.has(e.from) && ids.has(e.to) && ok(e.gate));
    const laneIds = new Set(recs.map(r => r.lane));
    const lanes = model.lanes.filter(l => laneIds.has(l.id));
    return {
      calendar: model.calendar,
      records: recs,
      edges,
      drawnEdges: edges.filter(e => e.src.length > 0),
      unsourcedEdges: edges.filter(e => e.src.length === 0 && !e.editorial),
      editorialEdges: edges.filter(e => e.editorial),
      lanes,
      dated: recs.filter(r => r.when),
      undated: recs.filter(r => !r.when).sort((a, b) => a.order - b.order),
      byId: new Map(recs.map(r => [r.id, r])),
    };
  }
  /* a pending or restored selection survives only if it is still visible */
  const revalidate = (view, id) => (id && (view.byId.has(id) || view.edges.some(e => e.id === id)) ? id : null);
  /* search only ever sees the gated view */
  function search(view, q) {
    const s = String(q || '')
      .trim()
      .toLowerCase();
    if (!s) return [];
    return view.records.filter(r => r.label.toLowerCase().includes(s) || (r.whenText || '').toLowerCase().includes(s));
  }

  /* ---------- extent and coverage ---------- */
  function extent(view, axis) {
    let lo = Infinity;
    let hi = -Infinity;
    view.dated.forEach(r => {
      const w = r.when;
      lo = Math.min(lo, w.window ? w.window[0] : w.from);
      hi = Math.max(hi, w.to != null ? w.to : w.window ? w.window[1] : w.from);
    });
    if (axis && axis.max != null && view.dated.some(r => r.when.toOpen)) hi = Math.max(hi, axis.max);
    return lo === Infinity ? null : [lo, hi];
  }
  /* what the brief asks for that this data cannot support honestly; shown in the view, never filled in */
  function coverage(view, model) {
    const has = t => view.drawnEdges.some(e => e.type === t);
    const gaps = [];
    if (!has('parent')) gaps.push({ id: 'family', t: 'Family genealogy: no accepted parent/child records yet.' });
    if (!has('succession')) gaps.push({ id: 'succession', t: 'Succession: no accepted succession records yet.' });
    if (!has('travel'))
      gaps.push({
        id: 'migration',
        t:
          'Migration or travel: ' +
          (model.journeys.length
            ? model.journeys.length + ' journeys are described in text only, without ordered dated stops.'
            : 'no routes with ordered, dated stops.'),
      });
    if (view.unsourcedEdges.length)
      gaps.push({
        id: 'edge-sources',
        t:
          view.unsourcedEdges.length +
          ' relationships have no source locator on the relationship itself; listed, not drawn as fact.',
      });
    return {
      records: view.records.length,
      dated: view.dated.length,
      windows: view.dated.filter(r => r.when.window).length,
      approx: view.dated.filter(r => r.when.approx).length,
      undated: view.undated.length,
      narrative: view.undated.filter(r => r.chron === 'narrative').length,
      edges: view.edges.length,
      /* candidates for a connector (sourced relationships); how many are actually rendered depends on which
         endpoints are dated and in expanded lanes, so the view counts rendered paths itself */
      drawable: view.drawnEdges.length,
      sourced: view.drawnEdges.length,
      editorial: view.editorialEdges.length,
      unsourced: view.unsourcedEdges.length,
      gaps,
    };
  }

  /* ---------- relationship connectors ----------
     Relationships carry no date of their own, so a connector must not be placed on the time axis (TL-R07: an end
     drawn at the target's start year read as a dated event before its source existed). Connectors are brackets in
     a non-temporal gutter left of the axis, joining the two rows' heights only. Columns are assigned greedily so
     brackets whose row spans overlap never share a column. spans: [{id, y0, y1}] → {cols: {id: column}, count}. */
  function bracketColumns(spans) {
    const ends = [];
    const cols = {};
    spans
      .map(s => ({ id: s.id, a: Math.min(s.y0, s.y1), b: Math.max(s.y0, s.y1) }))
      .sort((p, q) => p.a - q.a || p.b - q.b || (p.id < q.id ? -1 : p.id > q.id ? 1 : 0))
      .forEach(s => {
        let c = ends.findIndex(e => e < s.a - 2);
        if (c < 0) c = ends.push(0) - 1;
        ends[c] = s.b;
        cols[s.id] = c;
      });
    return { cols, count: ends.length };
  }
  const GUTTER_STEP = 6;
  const GUTTER_PAD = 6;
  const gutterWidth = count => (count ? GUTTER_PAD * 2 + count * GUTTER_STEP : 0);
  /* bracket path for one connector: short nub at each row, vertical join; x never enters the time axis */
  function bracketPath(col, count, ya, yb) {
    const xr = GUTTER_PAD + (count - 1 - col) * GUTTER_STEP;
    const nub = xr + 4;
    return { d: 'M' + nub + ' ' + ya + ' H' + xr + ' V' + yb + ' H' + nub, x0: xr, x1: nub };
  }

  /* ---------- lane arrangement ---------- */
  /* Reorder lanes by a (possibly stale or partial) id list: known ids first in the given order, then every other
     lane in its default order. Unknown ids are dropped, so a stale link never invents or hides a lane. */
  function arrangeLanes(lanes, order) {
    const byId = new Map(lanes.map(l => [l.id, l]));
    const seen = new Set();
    const out = [];
    (order || []).forEach(id => {
      if (byId.has(id) && !seen.has(id)) {
        seen.add(id);
        out.push(byId.get(id));
      }
    });
    lanes.forEach(l => {
      if (!seen.has(l.id)) out.push(l);
    });
    return out;
  }
  /* move one lane up (-1) or down (+1) within the full order; returns a new order array */
  function moveLane(order, id, dir) {
    const o = order.slice();
    const i = o.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= o.length) return o;
    o[i] = o[j];
    o[j] = id;
    return o;
  }
  /* the time span a collapsed lane summarises: earliest start to latest stated end (or start) of its dated records */
  function laneSpan(view, laneId) {
    let lo = Infinity;
    let hi = -Infinity;
    let open = false;
    view.dated.forEach(r => {
      if (r.lane !== laneId) return;
      const w = r.when;
      lo = Math.min(lo, w.window ? w.window[0] : w.from);
      hi = Math.max(hi, w.to != null ? w.to : w.window ? w.window[1] : w.from);
      if (w.toOpen) open = true;
    });
    return lo === Infinity ? null : { from: lo, to: hi, toOpen: open };
  }

  /* ---------- URL state: #tl=lane,lane&tlc=lane,lane&tlsel=id ----------
     tl = lane order (1 = default order), tlc = collapsed lanes, tlsel = selection. Validated and always re-gated;
     keys kept apart from the atlas's own book/world/site/layers/yr keys. The published contract is exactly these
     three keys (TL-R05): chart zoom and a time range are not URL state, and an old `tlt` key is ignored. */
  function parseState(hash, view, axis) {
    const p = new URLSearchParams(String(hash || '').replace(/^#/, ''));
    const st = { open: p.has('tl'), lanes: null, collapsed: [], sel: null };
    if (!st.open) return st;
    const laneIds = new Set(view.lanes.map(l => l.id));
    const ls = (p.get('tl') || '').split(',').filter(x => laneIds.has(x));
    st.lanes = ls.length ? ls : null;
    st.collapsed = [...new Set((p.get('tlc') || '').split(',').filter(x => laneIds.has(x)))];
    st.sel = revalidate(view, p.get('tlsel'));
    return st;
  }
  function stateHash(st) {
    const p = ['tl=' + (st.lanes ? st.lanes.join(',') : '1')];
    if (st.collapsed && st.collapsed.length) p.push('tlc=' + st.collapsed.join(','));
    if (st.sel) p.push('tlsel=' + encodeURIComponent(st.sel));
    return '#' + p.join('&');
  }

  root.AtlasTimeline = {
    EDGE_TYPES,
    astro,
    fromAstro,
    yearsBetween,
    yearLabel,
    adaptTree,
    visible,
    revalidate,
    search,
    extent,
    coverage,
    bracketColumns,
    gutterWidth,
    bracketPath,
    arrangeLanes,
    moveLane,
    laneSpan,
    parseState,
    stateHash,
  };
})(typeof window !== 'undefined' ? window : globalThis);
