/* Atlas layers and timeline (PACK_FORMAT section 20).
   Pure helpers for Track A (Earth-historical) packs: switchable content layers, a year-range timeline,
   year formatting without a year zero, and the address-bar state for both. No DOM, no THREE: the engine
   draws the controls from renderBar() and asks layerOk()/timeOk() which items to show.
   Loaded by atlas/index.html before engine.js; tests load it in a vm context. */
(function (root) {
  'use strict';

  const ARR = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
  const ESC = (s) =>
    String(s == null ? '' : s).replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );
  const ID_RE = /^[a-z0-9_-]+$/;
  const DEF_COLS = ['#d9b45a', '#7fa8e8', '#c9785a', '#8cc49a', '#b892e0', '#e0a0b8', '#9ad0d8'];

  /* ---------- layers ---------- */

  /* pack.layers → {list:[{id,name,c,tip,on}], by:{id:layer}}; null when the pack has no layers */
  function normLayers(pack) {
    const src = ARR(pack && pack.layers).filter((l) => l && l.id != null && ID_RE.test(String(l.id)));
    if (!src.length) return null;
    const seen = new Set();
    const list = [];
    src.forEach((l, i) => {
      const id = String(l.id);
      if (seen.has(id)) return;
      seen.add(id);
      list.push({
        id,
        name: l.name || id,
        short: l.short || l.name || id,
        c: l.c || DEF_COLS[i % DEF_COLS.length],
        tip: l.tip || '',
        on: l.on !== false,
      });
    });
    const by = {};
    list.forEach((l) => (by[l.id] = l));
    return { list, by };
  }

  /* the layer ids an item belongs to (`layers:[..]` or `layer:".."`) */
  function itemLayers(it) {
    if (!it) return [];
    return ARR(it.layers != null ? it.layers : it.layer).map(String);
  }

  /* the starting set of switched-on layers (null = every layer on) */
  function defaultActive(L) {
    if (!L) return null;
    const on = L.list.filter((l) => l.on).map((l) => l.id);
    return on.length === L.list.length ? null : new Set(on);
  }

  /* an item with no layers is always shown; otherwise one of its layers must be on */
  function layerOk(it, active) {
    if (!active) return true;
    const ls = itemLayers(it);
    if (!ls.length) return true;
    return ls.some((id) => active.has(id));
  }

  /* toggle one layer; returns the new active set (null when all are on). Never switches the last one off. */
  function toggleLayer(L, active, id) {
    if (!L || !L.by[id]) return active;
    const cur = new Set(active || L.list.map((l) => l.id));
    if (cur.has(id)) {
      if (cur.size === 1) return active;
      cur.delete(id);
    } else cur.add(id);
    return cur.size === L.list.length ? null : cur;
  }

  /* ---------- timeline ---------- */
  /* Years are historical: negative = BC/BCE, positive = AD/CE, and there is no year 0
     (1 BC is followed by AD 1). A `when` is a year or a [from, to] pair. */

  function whenRange(it) {
    if (!it || it.when == null) return null;
    const w = it.when;
    if (Array.isArray(w)) {
      const a = +w[0];
      const b = w.length > 1 ? +w[1] : a;
      if (!isFinite(a) || !isFinite(b)) return null;
      return a <= b ? [a, b] : [b, a];
    }
    const y = +w;
    return isFinite(y) ? [y, y] : null;
  }

  /* convert to a continuous axis (astronomical year numbering: 1 BC = 0) and back */
  const toAxis = (y) => (y < 0 ? y + 1 : y);
  const fromAxis = (v) => {
    const r = Math.round(v);
    return r <= 0 ? r - 1 : r;
  };

  function normTimeline(pack, items) {
    const T = pack && pack.timeline;
    if (!T) return null;
    let min = isFinite(+T.min) ? +T.min : null;
    let max = isFinite(+T.max) ? +T.max : null;
    if (min == null || max == null) {
      let lo = Infinity;
      let hi = -Infinity;
      ARR(items).forEach((it) => {
        const r = whenRange(it);
        if (r) {
          lo = Math.min(lo, r[0]);
          hi = Math.max(hi, r[1]);
        }
      });
      if (min == null) min = isFinite(lo) ? lo : -1000;
      if (max == null) max = isFinite(hi) ? hi : 2000;
    }
    if (min > max) [min, max] = [max, min];
    if (min === 0) min = -1;
    if (max === 0) max = 1;
    const style = T.style === 'BCE/CE' ? 'BCE/CE' : 'BC/AD';
    const eras = ARR(T.eras)
      .filter((e) => e && e.name && isFinite(+e.from) && isFinite(+e.to))
      .map((e) => ({ name: String(e.name), from: +e.from, to: +e.to, layer: e.layer || null }));
    return {
      min,
      max,
      step: Math.max(1, Math.round(+T.step || 1)),
      style,
      label: T.label || 'Years',
      eras,
    };
  }

  /* items without a date always show; otherwise the item's span must overlap the selected range */
  function timeOk(it, range) {
    if (!range) return true;
    const r = whenRange(it);
    if (!r) return true;
    return r[1] >= range[0] && r[0] <= range[1];
  }

  function fmtYear(y, style, approx) {
    if (!isFinite(y) || y === 0) return '';
    const c = approx ? 'c. ' : '';
    const ce = style === 'BCE/CE';
    if (y < 0) return c + -y + (ce ? ' BCE' : ' BC');
    if (ce) return c + y + (y < 1000 ? ' CE' : '');
    return c + (y < 1000 ? 'AD ' + y : String(y));
  }

  function fmtWhen(it, style) {
    const r = whenRange(it);
    if (!r) return '';
    const ap = !!(it && it.approx);
    if (r[0] === r[1]) return fmtYear(r[0], style, ap);
    /* "1446–1406 BC", "AD 30–33" / "30–33 CE", "1830–1844", "4 BC – AD 30" */
    const c = ap ? 'c. ' : '';
    const ce = style === 'BCE/CE';
    if (r[0] < 0 && r[1] < 0) return c + -r[0] + '–' + fmtYear(r[1], style);
    if (r[0] >= 1000) return c + r[0] + '–' + r[1];
    if (r[0] > 0 && r[1] < 1000) return ce ? c + r[0] + '–' + r[1] + ' CE' : c + 'AD ' + r[0] + '–' + r[1];
    return fmtYear(r[0], style, ap) + ' – ' + fmtYear(r[1], style);
  }

  function fmtRange(range, T) {
    if (!range || !T) return 'All years';
    return fmtWhen({ when: range }, T.style);
  }

  /* clamp and order a requested range; null when it covers the whole timeline */
  function clampRange(T, a, b) {
    if (!T) return null;
    let lo = Math.max(T.min, Math.min(T.max, +a));
    let hi = Math.max(T.min, Math.min(T.max, +b));
    if (!isFinite(lo)) lo = T.min;
    if (!isFinite(hi)) hi = T.max;
    if (lo > hi) [lo, hi] = [hi, lo];
    if (lo === 0) lo = -1;
    if (hi === 0) hi = 1;
    return lo <= T.min && hi >= T.max ? null : [lo, hi];
  }

  /* the era names that overlap a range (for the readout) */
  function erasIn(T, range) {
    if (!T) return [];
    const r = range || [T.min, T.max];
    return T.eras.filter((e) => e.to >= r[0] && e.from <= r[1]);
  }

  /* ---------- address bar ---------- */

  function encodeState(L, T, active, range) {
    const out = {};
    if (L && active) out.layers = L.list.filter((l) => active.has(l.id)).map((l) => l.id).join(',');
    if (T && range) out.yr = range[0] + '_' + range[1];
    return out;
  }

  function decodeState(L, T, q) {
    const get = (k) => (q && typeof q.get === 'function' ? q.get(k) : q && q[k]);
    let active;
    const lv = get('layers');
    if (L && lv != null) {
      const ids = String(lv)
        .split(',')
        .filter((id) => L.by[id]);
      active = ids.length && ids.length < L.list.length ? new Set(ids) : null;
    }
    let range;
    const yv = get('yr');
    if (T && yv != null) {
      const m = /^(-?\d+)_(-?\d+)$/.exec(String(yv));
      range = m ? clampRange(T, +m[1], +m[2]) : null;
    }
    return { active, range };
  }

  /* ---------- controls ---------- */
  /* HTML for the filter bar: layer toggles and a two-handle year range. The engine wires the events. */
  function renderBar(L, T, active, range) {
    let h = '';
    if (L) {
      h +=
        '<div class="seg lyrs" role="group" aria-label="Layers">' +
        L.list
          .map((l) => {
            const on = !active || active.has(l.id);
            return (
              '<button data-layer="' +
              ESC(l.id) +
              '" aria-pressed="' +
              on +
              '" style="--lc:' +
              ESC(l.c) +
              '" title="' +
              ESC(l.tip || l.name) +
              '"><span class="lsw" aria-hidden="true"></span>' +
              ESC(l.short) +
              '</button>'
            );
          })
          .join('') +
        '</div>';
    }
    if (T) {
      const r = range || [T.min, T.max];
      const a = toAxis(r[0]);
      const b = toAxis(r[1]);
      const mn = toAxis(T.min);
      const mx = toAxis(T.max);
      const pct = (v) => (mx === mn ? 0 : ((v - mn) / (mx - mn)) * 100).toFixed(2);
      const eras = erasIn(T, range);
      h +=
        '<div class="tl" role="group" aria-label="' +
        ESC(T.label) +
        '"><div class="tl-read"><span class="tl-y" aria-live="polite">' +
        ESC(fmtRange(range, T)) +
        '</span>' +
        (eras.length && range ? '<span class="tl-era">' + ESC(eras.map((e) => e.name).join(' · ')) + '</span>' : '') +
        (range ? '<button class="tl-all" data-tl="all" title="Show every year">All years</button>' : '') +
        '</div><div class="tl-track" style="--a:' +
        pct(a) +
        '%;--b:' +
        pct(b) +
        '%">' +
        '<input type="range" data-tl="from" min="' +
        mn +
        '" max="' +
        mx +
        '" step="' +
        T.step +
        '" value="' +
        a +
        '" aria-label="From year" aria-valuetext="' +
        ESC(fmtYear(r[0], T.style)) +
        '">' +
        '<input type="range" data-tl="to" min="' +
        mn +
        '" max="' +
        mx +
        '" step="' +
        T.step +
        '" value="' +
        b +
        '" aria-label="To year" aria-valuetext="' +
        ESC(fmtYear(r[1], T.style)) +
        '"></div></div>';
    }
    return h;
  }

  /* layer swatches and the date line for a place or event, for the details panel */
  function itemMeta(L, T, it) {
    const parts = [];
    if (L)
      itemLayers(it).forEach((id) => {
        const l = L.by[id];
        if (l) parts.push('<span class="lchip" style="--lc:' + ESC(l.c) + '">' + ESC(l.short) + '</span>');
      });
    const w = fmtWhen(it, T ? T.style : 'BC/AD');
    if (w) parts.push('<span class="lwhen">' + ESC(w) + '</span>');
    return parts.join('');
  }

  /* ---------- compact work picker (packs with many books) ---------- */

  /* More than 12 books do not fit as a row of buttons, so the chooser becomes one select. */
  const PICKER_MIN = 13;
  function usePicker(bookIds, ui) {
    if (ui && ui.bookPicker === true) return true;
    if (ui && ui.bookPicker === false) return false;
    return ARR(bookIds).length >= PICKER_MIN;
  }

  /* consecutive runs of books sharing books[b].group → [{label, ids}] (label '' = ungrouped) */
  function pickerGroups(books, bookIds) {
    const out = [];
    ARR(bookIds).forEach((b) => {
      const g = (books[b] && books[b].group) || '';
      const last = out[out.length - 1];
      if (last && last.label === g) last.ids.push(b);
      else out.push({ label: g, ids: [b] });
    });
    return out;
  }

  /* the next/previous book id from cur (0 = All); stays put at either end */
  function stepBook(bookIds, cur, dir) {
    const ids = [0].concat(ARR(bookIds));
    const i = ids.indexOf(cur);
    const j = Math.max(0, Math.min(ids.length - 1, (i < 0 ? 0 : i) + (dir < 0 ? -1 : 1)));
    return ids[j];
  }

  function bookOption(books, b) {
    const k = books[b] || {};
    const label = (k.n && k.n !== k.title ? k.n + ' · ' : '') + (k.title || k.n || String(b));
    return '<option value="' + b + '">' + ESC(label) + '</option>';
  }

  /* markup placed inside #books: step buttons and a select; the hidden data-b buttons stay for the engine */
  function renderBookPicker(books, bookIds, opts) {
    const o = opts || {};
    let h = '<button type="button" class="bkstep" data-step="-1" aria-label="' + ESC(o.prevLabel || 'Previous') + '">‹</button>';
    h += '<select class="bkpick" aria-label="' + ESC(o.label || 'Choose') + '">';
    h += '<option value="0">' + ESC(o.allLabel || 'All') + '</option>';
    pickerGroups(books, bookIds).forEach((g) => {
      const opts2 = g.ids.map((b) => bookOption(books, b)).join('');
      h += g.label ? '<optgroup label="' + ESC(g.label) + '">' + opts2 + '</optgroup>' : opts2;
    });
    h += '</select>';
    h += '<button type="button" class="bkstep" data-step="1" aria-label="' + ESC(o.nextLabel || 'Next') + '">›</button>';
    return h;
  }

  const api = {
    normLayers,
    itemLayers,
    defaultActive,
    layerOk,
    toggleLayer,
    whenRange,
    toAxis,
    fromAxis,
    normTimeline,
    timeOk,
    fmtYear,
    fmtWhen,
    fmtRange,
    clampRange,
    erasIn,
    encodeState,
    decodeState,
    renderBar,
    usePicker,
    pickerGroups,
    stepBook,
    renderBookPicker,
    itemMeta,
  };
  root.AtlasLayers = api;
})(typeof window !== 'undefined' ? window : globalThis);
