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
     chapter-aware host can gate on it; the atlas host offers a chapter selector only for books that declare
     `chapters` (chapterCount below), otherwise a current-book chapter-gated record stays hidden. */
  const gateOf = o => {
    const first = firstBook(o);
    return { layers: arr(o.layers), books: o.books || null, first, chapter: o.chapter == null ? null : o.chapter };
  };
  /* The first book a record is seen in, per PACK_FORMAT §6 schema defaults: explicit `first`, else an event's
     `book`, else the smallest entry of `books`; null when none is given (TL-R11). */
  function firstBook(o) {
    if (!o) return null;
    if (o.first != null) return o.first;
    if (o.book != null) return o.book;
    const bs = Array.isArray(o.books) ? o.books.filter(b => typeof b === 'number' && isFinite(b)) : [];
    return bs.length ? Math.min(...bs) : null;
  }
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

  /* ---------- adapter: Standard Works (places pack: events, sites, routes, codex; proposal §2) ----------
     Isolated: no host is wired to it yet (the pack lives on its own branch). What it does, and does not, emit:
     * events with `when` → `institutional` records on one Church-history lane; every other event, site, route and
       codex card without a numeric `when` → an undated record on its work's lane (Bible OT/NT, BoM, D&C, PGP), in
       pack order, so each work and any combination stays selectable. A card's `date` text is kept as `whenText`
       and is never parsed into a year.
     * a site's `when` (a year or [from, to] as given for the atlas year filter) is a dated `span`, not a lifespan
       or a founding: no wording is added to it.
     * a dated route yields `travel` edges only between consecutive stops that are mapped sites; the route itself
       carries no source locator, so those edges are listed as unsourced, never drawn. Undated routes stay undated
       journeys with no travel edges (proposal correction: no travel without ordered, dated stops).
     * codex `see` links → typed edges with the link's own wording as label; reciprocal pairs are kept once and
       links to a key that is not in the pack are counted, not invented. Office relations (“member of the Twelve”,
       “appointed to …”) are `context`, never `succession`. A card's citation is the card's, not the link's, so the
       link's `src` stays empty and it is reported as unsourced (kept for review as `cardSrc`). */
  const SW_LANE_HISTORY = 'sw-history';
  const SW_LANE_PLACES = 'sw-places';
  const SW_LANE_JOURNEYS = 'sw-journeys';
  function seeType(r) {
    const t = String(r || '');
    if (/in another account|^same\b/i.test(t)) return 'same-entity';
    if (/^describes$|^described in$/i.test(t)) return 'describes';
    if (/^within$|within it$/i.test(t)) return 'within';
    if (/quot/i.test(t)) return 'quotation';
    return 'context';
  }
  function swWhen(w, approx) {
    if (w == null) return null;
    if (Array.isArray(w)) return { from: w[0], to: w[1], range: true, approx: !!approx };
    return { from: w, to: null, approx: !!approx };
  }
  function adaptStandardWorks(pack) {
    const records = [];
    const edges = [];
    const lanes = [];
    const layerName = {};
    arr(pack.layers).forEach(l => (layerName[l.id] = l.name || l.id));
    const seenLane = {};
    const addLane = (id, title, group, gate) => {
      if (seenLane[id]) return;
      seenLane[id] = true;
      lanes.push({ id, title, group, gate });
    };
    const workLane = layers => {
      const l = arr(layers)[0] || 'other';
      const id = 'work-' + l;
      /* cards with no layer are the pack's own overview pages, not another work */
      addLane(id, layerName[l] || 'Standard Works overview', 'work', { layers: [l] });
      return id;
    };
    let order = 0;
    const base = (o, extra) =>
      Object.assign(
        {
          claim: claimsOf(o.notes),
          notes: notesOf(o.notes),
          notSame: notSameOf(o.notSame),
          atlasRef: null,
          calendar: 'gregorian-ce',
          order: order++,
          src: srcOf(o),
          gate: gateOf(o),
        },
        extra,
      );
    /* fixed lanes first so the default order reads history → dated places → dated journeys → works */
    const dated = {
      ev: arr(pack.events).some(e => e.when != null),
      site: arr(pack.worlds).some(w => arr(w.sites).some(s => s.when != null)),
      route: arr(pack.worlds).some(w => arr(w.routes).some(r => r.when != null)),
    };
    if (dated.ev) addLane(SW_LANE_HISTORY, 'Church history · dated events', 'institution', {});
    if (dated.site) addLane(SW_LANE_PLACES, 'Places · years given', 'region', {});
    if (dated.route) addLane(SW_LANE_JOURNEYS, 'Journeys · dated', 'region', {});

    arr(pack.events).forEach(e => {
      const when = swWhen(e.when, e.approx);
      records.push(
        base(e, {
          id: 'e:' + e.id,
          sourceId: e.id,
          source: 'events',
          label: e.title,
          lane: when ? SW_LANE_HISTORY : workLane(e.layers),
          kind: when ? 'event' : 'undated',
          chron: when ? 'institutional' : 'narrative',
          text: e.text || null,
          place: e.site ? { world: e.world || null, site: e.site } : null,
          when,
          whenText: e.whenText || null,
        }),
      );
    });
    const siteIds = new Set();
    arr(pack.worlds).forEach(w =>
      arr(w.sites).forEach(s => {
        siteIds.add(s.id);
        const when = swWhen(s.when, s.approx);
        records.push(
          base(s, {
            id: 's:' + s.id,
            sourceId: s.id,
            source: 'sites',
            label: s.name,
            lane: when ? SW_LANE_PLACES : workLane(s.layers),
            kind: when ? 'span' : 'undated',
            chron: when ? 'historical' : 'narrative',
            text: s.desc || null,
            place: { world: w.id, site: s.id },
            when,
            whenText: s.whenText || null,
          }),
        );
      }),
    );
    let omittedLegs = 0;
    arr(pack.worlds).forEach(w =>
      arr(w.routes).forEach(r => {
        const when = swWhen(r.when, r.approx);
        const id = 'r:' + r.id;
        records.push(
          base(r, {
            id,
            sourceId: r.id,
            source: 'routes',
            label: r.name,
            lane: when ? SW_LANE_JOURNEYS : workLane(r.layers),
            kind: when ? 'event' : 'undated',
            chron: when ? 'historical' : 'narrative',
            text: r.desc || null,
            textRef: r.ref || null,
            place: null,
            when,
            whenText: r.whenText || null,
          }),
        );
        if (!when) return;
        const stops = arr(r.stops).map(st => (typeof st === 'string' ? { site: st } : st));
        for (let k = 0; k + 1 < stops.length; k++) {
          const a = stops[k];
          const b = stops[k + 1];
          if (!a.site || !b.site || !siteIds.has(a.site) || !siteIds.has(b.site)) {
            omittedLegs++;
            continue;
          }
          edges.push({
            id: 't:' + r.id + ':' + k,
            from: 's:' + a.site,
            to: 's:' + b.site,
            type: 'travel',
            label: a.note || null,
            route: id,
            when: r.when,
            src: [],
            locator: null,
            editorial: false,
            gate: gateOf(r),
          });
        }
      }),
    );
    const cardIds = new Map();
    const cards = [];
    arr(pack.codex).forEach(sec =>
      arr(sec.list).forEach((c, i) => {
        const id = 'c:' + (c.key || sec.id + '#' + i);
        if (c.key) cardIds.set(c.key, id);
        cards.push({ c, id });
        const when = swWhen(c.when, c.approx);
        records.push(
          base(c, {
            id,
            sourceId: c.key || null,
            source: 'codex',
            section: sec.id,
            label: c.name || c.title || '',
            lane: workLane(c.layers),
            kind: when ? 'event' : 'undated',
            chron: when ? 'historical' : c.date ? 'historical' : 'narrative',
            text: c.desc || null,
            place: null,
            when,
            whenText: c.whenText || c.date || null,
          }),
        );
      }),
    );
    let danglingLinks = 0;
    const pair = new Set();
    cards.forEach(({ c, id }) =>
      arr(c.see).forEach(s => {
        const k = typeof s === 'string' ? s : s && s.k;
        const label = typeof s === 'string' ? null : (s && s.r) || null;
        const to = cardIds.get(k);
        if (!to) {
          danglingLinks++;
          return;
        }
        const type = seeType(label);
        const key = [id, to].sort().join('|') + '|' + type + '|' + (label || '');
        if (pair.has(key)) return;
        pair.add(key);
        edges.push({
          id: 'x:' + id + '>' + to,
          from: id,
          to,
          type,
          label,
          src: [],
          cardSrc: srcOf(c),
          locator: null,
          editorial: false,
          gate: gateOf(c),
        });
      }),
    );
    return {
      calendar: 'gregorian-ce',
      records,
      edges,
      lanes,
      journeys: [],
      omitted: { travelLegs: omittedLegs, danglingLinks },
      /* overview wording for this host (the tree adapter's default speaks of traditions) — checkpoint 22 */
      intro:
        'The first lanes hold dated church-history events, places with years given and dated journeys; then one lane per book of scripture holds its undated records. Diamonds are dated events; bars are year spans.',
      relatedWord: 'records',
    };
  }
  /* which adapter a pack uses; null = the pack has no timeline adapter (the view is not offered) */
  function adapterFor(pack) {
    if (pack && pack.tree) return adaptTree;
    if (pack && pack.id === 'lds-standard-works') return adaptStandardWorks;
    return null;
  }

  /* ---------- chapter-aware spoiler gate ----------
     A record may carry `chapter` with its first book. In a cumulative (“read up to book k”) host, a record first
     seen in an earlier book is safe; one first seen in book k is safe only when the host knows the reader's chapter
     and it has reached the record's chapter. A host with no chapter selector passes `chapter: null`, so such
     records stay hidden until the next book (fail closed). No book selected, or a non-cumulative host, hides
     nothing here (the host's own book gate still applies). pos: {book, chapter, cumulative}. */
  function chapterOk(gate, pos) {
    if (!gate || gate.chapter == null) return true;
    if (!pos || !pos.book || !pos.cumulative) return true;
    /* resolve the first book from `first`/`book`/`books` (TL-R11); a chapter with no book at all is ambiguous:
       withhold it rather than guess */
    const first = firstBook(gate);
    if (first == null) return false;
    if (first < pos.book) return true;
    if (first > pos.book) return false;
    return pos.chapter != null && pos.chapter >= gate.chapter;
  }

  /* ---------- chapter selector (checkpoint 25) ----------
     A book may declare how many chapters it has (`books[b].chapters`, a positive integer). Only such a book in a
     cumulative host gets a chapter selector. chapterCount() is 0 for any other value, so a pack that declares no
     chapters keeps the no-selector, fail-closed behaviour of chapterOk(). */
  function chapterCount(books, b) {
    const n = books && books[b] ? books[b].chapters : null;
    return Number.isInteger(n) && n > 0 && n <= 9999 ? n : 0;
  }
  /* A reader's chapter position from a selector value or a URL `ch`: an integer 1..chapterCount of that book, given
     as plain decimal digits; anything else (missing, empty, 0, negative, fractional, out of range, a book with no
     chapters) is null, i.e. "not set", which hides that book's chapter-gated records. */
  function chapterPos(books, b, raw) {
    const n = chapterCount(books, b);
    if (!n || raw == null) return null;
    const s = String(raw);
    if (!/^[1-9][0-9]{0,3}$/.test(s)) return null;
    const c = Number(s);
    return c <= n ? c : null;
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

  /* ---------- folded undated panels ----------
     A lane with more than `max` undated records is shown as a collapsed per-work panel in the chart (the list
     arrangement keeps every row, TL-R02). Every gated record stays in the panel, in pack order; the count is the
     gated count; a panel opens when the user opened it or when it holds the selected (or deep-linked) record.
     Search runs over the gated view, so entries inside a closed panel are still found. */
  const FOLD_MAX = 12;
  function foldUndated(view, laneIds, opts) {
    const o = opts || {};
    const max = o.max == null ? FOLD_MAX : o.max;
    const opened = o.opened || new Set();
    return laneIds
      .map(id => {
        const recs = view.undated.filter(r => r.lane === id);
        const folded = recs.length > max;
        const holdsSel = !!o.sel && recs.some(r => r.id === o.sel);
        return { lane: id, recs, count: recs.length, folded, open: !folded || opened.has(id) || holdsSel };
      })
      .filter(g => g.count);
  }
  /* search restricted to undated records (the folded panels), in pack order */
  const searchUndated = (view, q) => search(view, q).filter(r => !r.when).sort((a, b) => a.order - b.order);

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
          (view.unsourcedEdges.some(e => e.type === 'travel')
            ? view.unsourcedEdges.filter(e => e.type === 'travel').length +
              ' legs of dated routes have no source locator on the route; listed, not drawn.'
            : model.journeys.length
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
  /* Folded-row connectors. An endpoint in an expanded lane joins at its own row (rowY). An endpoint inside a
     collapsed lane joins at that lane's summary row (foldY[lane]) and is flagged folded, so the view marks it as
     "somewhere in this lane", never as a specific row. `laneOf(id)` returns a lane only for records that would have
     a chart row when the lane is expanded (dated records), so expanding a lane never makes a connector vanish.
     Edges come from the gated view only (record and edge gates already applied), so book/chapter/layer
     downgrades remove them here too. Not drawn, but counted: both ends folded into the same lane (`inside`), or
     an end with no chart row at all, e.g. an undated record (`offChart`; those stay in the list and panels).
     → {links: [{id, ya, yb, fa, fb}], inside, offChart} */
  function connectorEnds(edges, rowY, foldY, laneOf) {
    const links = [];
    let inside = 0;
    let offChart = 0;
    const end = id => {
      if (rowY[id] != null) return { y: rowY[id], folded: false, lane: null };
      const lane = laneOf(id);
      if (lane != null && foldY[lane] != null) return { y: foldY[lane], folded: true, lane };
      return null;
    };
    edges.forEach(e => {
      if (e.from === e.to) return;
      const a = end(e.from);
      const b = end(e.to);
      if (!a || !b) offChart++;
      else if (a.folded && b.folded && a.lane === b.lane) inside++;
      else links.push({ id: e.id, ya: a.y, yb: b.y, fa: a.folded, fb: b.folded });
    });
    return { links, inside, offChart };
  }
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
  /* drag-and-drop: take one lane out and put it at position `to` of the resulting order (clamped); returns a new
     order array. An unknown id or a drop on its own place returns the order unchanged. */
  function dropLane(order, id, to) {
    const o = order.slice();
    const i = o.indexOf(id);
    if (i < 0) return o;
    o.splice(i, 1);
    const j = Math.max(0, Math.min(o.length, Math.round(+to) || 0));
    o.splice(j, 0, id);
    return o;
  }
  /* which slot a dragged lane would land in: the index of the chip whose centre is nearest the pointer
     (chips may wrap onto several rows, so both axes count; rows weigh more so a wrap is not crossed by accident) */
  function nearestSlot(boxes, x, y) {
    let best = -1;
    let bd = Infinity;
    (boxes || []).forEach((b, k) => {
      const dx = x - (b.left + b.width / 2);
      const dy = (y - (b.top + b.height / 2)) * 3;
      const d = dx * dx + dy * dy;
      if (d < bd) {
        bd = d;
        best = k;
      }
    });
    return best;
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
    adaptStandardWorks,
    adapterFor,
    chapterOk,
    chapterCount,
    chapterPos,
    firstBook,
    visible,
    revalidate,
    search,
    searchUndated,
    foldUndated,
    FOLD_MAX,
    extent,
    coverage,
    bracketColumns,
    connectorEnds,
    gutterWidth,
    bracketPath,
    arrangeLanes,
    moveLane,
    dropLane,
    nearestSlot,
    laneSpan,
    parseState,
    stateHash,
  };
})(typeof window !== 'undefined' ? window : globalThis);
