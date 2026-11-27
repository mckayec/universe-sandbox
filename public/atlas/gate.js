/* Atlas reading gate and world-only helpers (PACK_FORMAT sections 6.1 and 22).
   Pure functions shared by engine.js (galactic packs) and cards.js (layout:"cards" packs):
   - EC-1: a pack-declared starting gate (`spoilers.start`), an optional "All" (`spoilers.all`), the stored per-pack
     choice and guarded deep links;
   - EC-2/EC-3: nonspatial places (worlds with nested sites, no coordinates) and journeys between named places;
   - EC-4: publication or chronological book order without changing any gate.
   No DOM, no THREE. Loaded by atlas/index.html before engine.js; tests load it in a vm context. */
(function (root) {
  'use strict';

  const ARR = v => (Array.isArray(v) ? v : v == null ? [] : [v]);
  const RANK = b => (b === 0 ? Infinity : b);

  /* ---------- EC-1: the reading gate ---------- */

  /* spoilers → {start: "choose" | 0 | book, all: bool, guard: bool}
     start "choose": the visitor must pick before anything is listed; a number: that book; default: "All" (0) when
     All is allowed, else the first book. guard: deep links may never raise the gate above the stored choice. */
  function normSpoilers(sp, bookIds) {
    sp = sp || {};
    const ids = ARR(bookIds).map(Number);
    const all = sp.all !== false;
    let start;
    if (sp.start === 'choose') start = 'choose';
    else if (ids.includes(Number(sp.start))) start = Number(sp.start);
    else if (sp.start === 0 && all) start = 0;
    else start = all ? 0 : ids.length ? Math.min(...ids) : 1;
    const guard = sp.guardLinks != null ? !!sp.guardLinks : start === 'choose';
    return { start, all, guard };
  }

  /* is b a book the chooser offers? (0 = "All", only when allowed) */
  function validBook(b, N, bookIds) {
    if (b === 0) return N.all;
    return ARR(bookIds).map(Number).includes(b);
  }

  /* Decide the starting gate.
     url: book number from the address (or null), stored: value from localStorage (or null).
     → {book: number | null, choose: bool, capped: bool}. book null + choose true = show the chooser first. */
  function resolveBook(opts) {
    const N = opts.N;
    const ids = opts.bookIds;
    const stored = opts.stored != null && validBook(opts.stored, N, ids) ? opts.stored : null;
    const url = opts.url != null && validBook(opts.url, N, ids) ? opts.url : null;
    const base = stored != null ? stored : N.start === 'choose' ? null : N.start;
    if (url == null) return { book: base, choose: base == null, capped: false };
    if (!N.guard) return { book: url, choose: false, capped: false };
    if (base == null) return { book: null, choose: true, capped: true, suggest: url };
    if (RANK(url) <= RANK(base)) return { book: url, choose: false, capped: false };
    return { book: base, choose: false, capped: true };
  }

  /* ---------- EC-4: book order ---------- */

  /* book ids in publication order (the keys) or by books[k].chron (ties keep publication order) */
  function bookOrder(books, bookIds, order) {
    const ids = ARR(bookIds).map(Number);
    if (order !== 'chronological') return ids.slice();
    const ch = b => (books[b] && typeof books[b].chron === 'number' ? books[b].chron : Infinity);
    return ids.slice().sort((a, b) => ch(a) - ch(b) || a - b);
  }
  function hasChron(books, bookIds) {
    return ARR(bookIds).some(b => books[b] && typeof books[b].chron === 'number');
  }

  /* ---------- EC-2/EC-3: nonspatial places ---------- */

  const firstOf = (x, def) => {
    if (x && typeof x.first === 'number') return x.first;
    const b = ARR(x && x.books).filter(n => typeof n === 'number');
    return b.length ? Math.min(...b) : def == null ? 1 : def;
  };

  /* Flatten worlds and their sites into one place index: key "world" or "world/site".
     Each entry: {key, kind:"world"|"site", world, site, item, parentKey, gate, depth}.
     A site's parent is another site (`parent`) or its world. The effective gate is the largest gate on the chain, so
     a child never shows before its parent. */
  function placeIndex(worlds) {
    const by = {};
    const list = [];
    ARR(worlds).forEach(w => {
      if (!w || w.id == null) return;
      const wk = String(w.id);
      const we = { key: wk, kind: 'world', world: w, site: null, item: w, parentKey: null, gate: firstOf(w), depth: 0 };
      by[wk] = we;
      list.push(we);
      const sites = ARR(w.sites).filter(s => s && s.id != null);
      const sb = {};
      sites.forEach(s => (sb[String(s.id)] = s));
      const resolve = (s, seen) => {
        const k = wk + '/' + s.id;
        if (by[k]) return by[k];
        const pid = s.parent != null && sb[String(s.parent)] && !seen.has(String(s.parent)) ? String(s.parent) : null;
        seen.add(String(s.id));
        const pe = pid ? resolve(sb[pid], seen) : we;
        const e = {
          key: k,
          kind: 'site',
          world: w,
          site: s,
          item: s,
          parentKey: pe.key,
          gate: Math.max(pe.gate, firstOf(s, pe.gate)),
          depth: pe.depth + 1,
        };
        by[k] = e;
        list.push(e);
        return e;
      };
      sites.forEach(s => resolve(s, new Set()));
    });
    return { by, list };
  }

  /* is a gate open at book k (cumulative; 0 = All)? */
  function open(gate, k) {
    return k === 0 || gate <= k;
  }

  /* ancestors of a place, outermost first (for breadcrumbs) */
  function chain(idx, key) {
    const out = [];
    let e = idx.by[key];
    const seen = new Set();
    while (e && !seen.has(e.key)) {
      seen.add(e.key);
      out.unshift(e);
      e = e.parentKey ? idx.by[e.parentKey] : null;
    }
    return out;
  }

  /* direct children of a place (or the worlds, for null), in pack order */
  function children(idx, key) {
    return idx.list.filter(e => (key == null ? e.kind === 'world' : e.parentKey === key));
  }

  /* "world" | "world/site" | {world, site} → key */
  function placeKey(p) {
    if (p == null) return null;
    if (typeof p === 'string') return p;
    return p.site != null ? p.world + '/' + p.site : String(p.world);
  }

  /* the places an event names: `world` + optional `site`, plus optional `places:[...]` */
  function eventPlaces(e) {
    const out = [];
    if (e && e.world != null) out.push(placeKey({ world: e.world, site: e.site }));
    ARR(e && e.places).forEach(p => {
      const k = placeKey(p);
      if (k && !out.includes(k)) out.push(k);
    });
    return out;
  }

  /* a journey is shown at book k when its book is reached and every stop is open */
  function journeyOpen(idx, j, k) {
    if (!open(j.book || 1, k)) return false;
    return ARR(j.path).every(p => {
      const e = idx.by[placeKey(p)];
      return !!e && open(e.gate, k);
    });
  }

  const api = {
    normSpoilers,
    validBook,
    resolveBook,
    bookOrder,
    hasChron,
    firstOf,
    placeIndex,
    open,
    chain,
    children,
    placeKey,
    eventPlaces,
    journeyOpen,
  };
  root.AtlasGate = api;
})(typeof window !== 'undefined' ? window : globalThis);
