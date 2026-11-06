/* Atlas branching tree (PACK_FORMAT section 21).
   A "family tree" of traditions on a year axis: each tradition is a bar from the year it began, joined to the
   tradition it branched from. Used by Track A packs (for example how Judaism, Christianity and Islam diverge).
   The top half is pure (normalise, lay out, draw an SVG string) and is unit-tested in a vm context; createView()
   in tree-view.js is the small DOM controller the engine calls when a pack has `tree`.
   Loaded by atlas/index.html after tree-rel.js and before tree-view.js. */
(function (root) {
  'use strict';

  const ARR = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
  const ESC = (s) =>
    String(s == null ? '' : s).replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );
  const ID_RE = /^[a-z0-9_-]+$/;
  const DEF_C = '#c9b27a';
  const ROW = 30;
  const TOP = 46;
  const PAD_L = 18;
  const PAD_R = 28;
  const ZOOMS = [1, 1.6, 2.5, 4, 6.5, 10];

  /* continuous axis without a year zero (1 BC = 0), same as layers.js */
  const toAxis = (y) => (y < 0 ? y + 1 : y);
  const fromAxis = (v) => {
    const r = Math.round(v);
    return r <= 0 ? r - 1 : r;
  };

  const pair = (w) => {
    if (w == null) return null;
    const a = Array.isArray(w) ? +w[0] : +w;
    const b = Array.isArray(w) && w.length > 1 ? +w[1] : a;
    if (!isFinite(a) || !isFinite(b)) return null;
    return a <= b ? [a, b] : [b, a];
  };

  /* A node's dates: {from, to, sol, undated}. `when` is a start year or a [from, to] lifespan; `emerge:[a, b]`
     is an uncertain window (drawn as a ramp from a to b, solid after b, ending at `until` or b);
     `undated:true` has no defensible date at all (placed by its relations, never given a year). */
  function span(n) {
    if (!n) return null;
    if (n.undated) return { from: null, to: null, sol: null, undated: true };
    const e = pair(n.emerge);
    if (e && Array.isArray(n.emerge) && n.emerge.length === 2) {
      const u = n.until != null && isFinite(+n.until) ? Math.max(+n.until, e[1]) : e[1];
      return { from: e[0], to: u, sol: e[1], undated: false };
    }
    const s = pair(n.when);
    return s ? { from: s[0], to: s[1], sol: null, undated: false } : null;
  }

  /* does following parent and merge links up from `start` reach `target`? (guards against loops) */
  function reaches(by, start, target) {
    const seen = new Set();
    const stack = [start];
    while (stack.length) {
      const id = stack.pop();
      if (id === target) return true;
      if (seen.has(id) || !by[id]) continue;
      seen.add(id);
      if (by[id].parent) stack.push(by[id].parent);
      by[id].merge.forEach((m) => stack.push(m));
    }
    return false;
  }

  /* An undated node is drawn only so the chart can show it; it is never given that year in text, aria labels or
     filters. With a parent (or merge predecessor) it sits where that node is drawn, so it never looks as if it
     began with a much later descendant; a root sits where its earliest dated branch begins, else at the axis start. */
  function placeUndated(nodes, by, min) {
    const kids = {};
    nodes.forEach((n) => {
      if (n.parent) (kids[n.parent] = kids[n.parent] || []).push(n);
      n.merge.forEach((m) => (kids[m] = kids[m] || []).push(n));
    });
    const earliest = (id, seen) => {
      let best = Infinity;
      (kids[id] || []).forEach((c) => {
        if (seen.has(c.id)) return;
        seen.add(c.id);
        best = Math.min(best, c.undated ? earliest(c.id, seen) : c.from);
      });
      return best;
    };
    const at = (n, seen) => {
      if (n.from != null) return n.from;
      const up = n.parent || n.merge[0];
      if (up && by[up] && !seen.has(up)) {
        seen.add(up);
        return at(by[up], seen);
      }
      const e = earliest(n.id, new Set([n.id]));
      return isFinite(e) ? e : min;
    };
    nodes.forEach((n) => {
      if (n.undated && n.from == null) n.from = n.to = at(n, new Set([n.id]));
    });
  }

  /* ---------- normalise ---------- */

  const FAM = (t, d) => (root.AtlasTreeRel ? root.AtlasTreeRel.family(t, d) : d);

  /* pack.tree → {title, intro, nodes, by, kids, links, min, max} (nodes in drawing order); null without nodes */
  function normTree(pack, timeline, layers) {
    const src = pack && pack.tree;
    if (!src) return null;
    const raw = ARR(src.nodes).filter((n) => n && n.id != null && ID_RE.test(String(n.id)) && span(n));
    if (!raw.length) return null;
    const by = {};
    const nodes = [];
    raw.forEach((n) => {
      const id = String(n.id);
      if (by[id]) return;
      const s = span(n);
      const node = {
        id,
        name: n.name || id,
        from: s.from,
        to: s.to,
        sol: s.sol,
        undated: s.undated,
        whenText: n.whenText ? String(n.whenText) : '',
        kind: n.kind ? String(n.kind) : '',
        ongoing: !!n.ongoing,
        approx: !!n.approx,
        parent: n.parent != null ? String(n.parent) : null,
        ptype: FAM(n.parentType, 'branch'),
        prel: n.parentRel ? String(n.parentRel) : '',
        merge: ARR(n.merge).map(String),
        notSame: ARR(n.notSame)
          .filter((x) => x && (x.t || x.id))
          .map((x) => ({ id: x.id != null ? String(x.id) : null, t: x.t ? String(x.t) : '' })),
        also: ARR(n.also).map(String),
        c: n.c || null,
        layers: ARR(n.layers != null ? n.layers : n.layer).map(String),
        books: n.books ? ARR(n.books).map(Number) : null,
        first: n.first != null ? +n.first : null,
        blurb: n.blurb || '',
        notes: ARR(n.notes).filter((x) => x && x.t),
        world: n.world || null,
        site: n.site || null,
        sites: ARR(n.sites).map(String),
      };
      by[id] = node;
      nodes.push(node);
    });
    /* drop parents that do not exist or would make a loop */
    nodes.forEach((n) => {
      if (n.parent && !by[n.parent]) n.parent = null;
      const seen = new Set([n.id]);
      let p = n.parent;
      while (p) {
        if (seen.has(p)) {
          n.parent = null;
          break;
        }
        seen.add(p);
        p = by[p].parent;
      }
      n.also = n.also.filter((a) => by[a] && a !== n.id && a !== n.parent);
      n.merge = n.merge.filter((m, i, a) => by[m] && m !== n.id && a.indexOf(m) === i);
    });
    /* merge predecessors must not loop back through the node either */
    nodes.forEach((n) => {
      n.merge = n.merge.filter((m) => !reaches(by, m, n.id));
    });
    let min = Infinity;
    let max = -Infinity;
    nodes.forEach((n) => {
      if (n.undated) return;
      min = Math.min(min, n.from);
      max = Math.max(max, n.to);
    });
    if (timeline) {
      min = Math.min(min, timeline.min);
      max = Math.max(max, timeline.max);
    }
    if (src.max != null && isFinite(+src.max)) max = Math.max(max, +src.max);
    if (!isFinite(min) || !isFinite(max)) {
      min = -1000;
      max = 2000;
    }
    placeUndated(nodes, by, min);
    /* colour: own, else the parent's, else the first layer's */
    const colour = (n, depth) => {
      if (n.c) return n.c;
      if (n.parent && depth < 50) return colour(by[n.parent], depth + 1);
      if (n.merge.length && depth < 50) return colour(by[n.merge[0]], depth + 1);
      const l = layers && n.layers.length && layers.by[n.layers[0]];
      return l ? l.c : DEF_C;
    };
    nodes.forEach((n) => (n.col = colour(n, 0)));
    nodes.forEach((n) => {
      if (n.ongoing) n.to = max;
      /* undated nodes carry no year for the filters, so the year filter never fades them */
      n.when = n.undated ? null : n.from === n.to ? n.from : [n.from, n.to];
    });
    const links = ARR(src.links)
      .filter((l) => l && by[String(l.from)] && by[String(l.to)] && String(l.from) !== String(l.to))
      .map((l) => ({
        from: String(l.from),
        to: String(l.to),
        label: l.label || l.rel || '',
        type: FAM(l.type, 'overlap'),
        at: l.when != null && isFinite(+l.when) ? +l.when : null,
      }));
    nodes.forEach((n) =>
      n.also.forEach((a) => links.push({ from: a, to: n.id, label: '', type: 'overlap', at: null })),
    );
    return {
      title: src.title || 'Family tree',
      button: src.button || 'Tree',
      intro: src.intro || '',
      view: src.view === 'relationship' ? 'relationship' : 'date',
      nodes,
      by,
      links,
      min,
      max,
    };
  }

  /* ---------- visibility ---------- */

  /* the nodes a reader may see (spoiler gate), each hooked to its nearest visible ancestor */
  function visibleTree(T, isVisible) {
    const ok = (n) => !isVisible || isVisible(n);
    const vis = T.nodes.filter(ok);
    const set = new Set(vis.map((n) => n.id));
    const parentOf = {};
    const mergeOf = {};
    const up = (p) => {
      while (p && !set.has(p)) p = T.by[p].parent || T.by[p].merge[0] || null;
      return p || null;
    };
    vis.forEach((n) => {
      /* merge predecessors (each resolved to its nearest visible ancestor); a node formed by merger and
         without a parent is placed under its first predecessor, but every predecessor is drawn and listed */
      const ms = [];
      n.merge.forEach((m) => {
        const v = up(m);
        if (v && v !== n.id && ms.indexOf(v) < 0) ms.push(v);
      });
      if (ms.length) mergeOf[n.id] = ms;
      parentOf[n.id] = up(n.parent) || ms[0] || null;
    });
    const kids = {};
    vis.forEach((n) => {
      const p = parentOf[n.id] || '';
      (kids[p] = kids[p] || []).push(n);
    });
    const order = (a, b) => a.from - b.from || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    Object.keys(kids).forEach((k) => kids[k].sort(order));
    /* depth-first: every branch sits just below the tradition it came from */
    const out = [];
    const walk = (n) => {
      out.push(n);
      (kids[n.id] || []).forEach(walk);
    };
    (kids[''] || []).forEach(walk);
    return { nodes: out, parentOf, mergeOf, kids, ids: set };
  }

  /* ancestors and descendants of a node (its lineage, through parents and mergers), for highlighting */
  function lineage(V, id) {
    const out = new Set();
    if (!id || !V.ids.has(id)) return out;
    const ups = (k) =>
      [V.parentOf[k]].concat(V.mergeOf ? V.mergeOf[k] || [] : []).forEach((p) => {
        if (!p || out.has(p) || p === id) return;
        out.add(p);
        ups(p);
      });
    ups(id);
    const below = {};
    Object.keys(V.mergeOf || {}).forEach((c) => V.mergeOf[c].forEach((m) => (below[m] = below[m] || []).push(c)));
    const down = (k) => {
      (V.kids[k] || []).map((c) => c.id).concat(below[k] || []).forEach((c) => {
        if (out.has(c) || c === id) return;
        out.add(c);
        down(c);
      });
    };
    down(id);
    return out;
  }

  /* ---------- layout ---------- */

  /* pixels per year so the whole axis fits `width`, times a zoom level */
  function fitScale(T, width, zoom) {
    const yrs = Math.max(1, toAxis(T.max) - toAxis(T.min));
    const usable = Math.max(240, width - PAD_L - PAD_R);
    return (usable / yrs) * (ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, zoom | 0))] || 1);
  }

  function layout(T, V, ppy) {
    const a0 = toAxis(T.min);
    const x = (y) => PAD_L + (toAxis(y) - a0) * ppy;
    const row = {};
    V.nodes.forEach((n, i) => (row[n.id] = i));
    const w = Math.ceil(x(T.max) + PAD_R);
    const h = TOP + V.nodes.length * ROW + 14;
    return { x, row, w, h, ppy, y: (id) => TOP + row[id] * ROW + 20 };
  }

  /* a tick step that keeps year labels at least ~80 px apart */
  function tickStep(ppy) {
    const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000];
    for (let i = 0; i < steps.length; i++) if (steps[i] * ppy >= 80) return steps[i];
    return steps[steps.length - 1];
  }

  /* tick years: round numbers on the historical axis (… 1000 BC, 500 BC, AD 1, 500, 1000 …) */
  function ticks(T, ppy) {
    const st = tickStep(ppy);
    const out = [];
    const a = Math.ceil(T.min / st) * st;
    for (let v = a; v <= T.max; v += st) out.push(v === 0 ? 1 : v);
    return out;
  }

  /* ---------- drawing ---------- */

  /* short date text for a node (tree-rel.js knows uncertain windows and undated nodes) */
  function dateText(n, fmt, long) {
    if (root.AtlasTreeRel) return root.AtlasTreeRel.dateText(n, fmt, long);
    const a = fmt(n.from, n.approx);
    if (n.ongoing) return a + (long ? ' – today' : ' –');
    return n.from === n.to ? a : a + ' – ' + fmt(n.to);
  }

  /* SVG markup for the tree. o = {sel, dim(node)→bool, fmt(year,approx)→string, eras:[{name,from,to}]} */
  function render(T, V, P, o) {
    o = o || {};
    const fmt = o.fmt || ((y) => String(y));
    const sel = o.sel && V.ids.has(o.sel) ? o.sel : null;
    const kin = lineage(V, sel);
    const f1 = (v) => Math.round(v * 10) / 10;
    let s =
      '<svg class="tr-svg" xmlns="http://www.w3.org/2000/svg" width="' +
      P.w +
      '" height="' +
      P.h +
      '" viewBox="0 0 ' +
      P.w +
      ' ' +
      P.h +
      '" role="group" aria-label="' +
      ESC(T.title) +
      '">' +
      '<defs><linearGradient id="trRamp"><stop offset="0" stop-color="currentColor" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="currentColor" stop-opacity=".85"/></linearGradient></defs>';
    /* eras: faint bands with their names */
    ARR(o.eras).forEach((e, i) => {
      const x0 = Math.max(PAD_L, P.x(e.from));
      const x1 = Math.min(P.x(T.max), P.x(e.to));
      if (x1 <= x0) return;
      s +=
        '<rect class="tr-era' +
        (i % 2 ? ' odd' : '') +
        '" x="' +
        f1(x0) +
        '" y="' +
        (TOP - 12) +
        '" width="' +
        f1(x1 - x0) +
        '" height="' +
        (P.h - TOP + 12) +
        '"/>';
      if (x1 - x0 > 60)
        s += '<text class="tr-eran" x="' + f1(x0 + 5) + '" y="' + (TOP - 2) + '">' + ESC(e.name) + '</text>';
    });
    /* year axis: grid lines, then the year labels in their own group so the view can keep them in sight */
    const tk = ticks(T, P.ppy);
    s += '<g class="tr-grid">';
    tk.forEach((y) => {
      const xx = f1(P.x(y));
      s += '<line x1="' + xx + '" x2="' + xx + '" y1="22" y2="' + P.h + '"/>';
    });
    s += '</g>';
    let ax = '<g class="tr-ticks"><rect class="tr-tickbg" x="0" y="0" width="' + P.w + '" height="22"/>';
    /* the first and last labels lean inwards so they are never cut off; labels that would overlap the one
       before them (about 7 px per character at 10 px with letter spacing) are skipped */
    let lastEnd = -Infinity;
    tk.forEach((y) => {
      const xx = P.x(y);
      const lbl = fmt(y);
      const wd = lbl.length * 7;
      const mode = xx < 40 ? 'start' : xx > P.w - 40 ? 'end' : 'middle';
      const x0 = mode === 'start' ? xx : mode === 'end' ? xx - wd : xx - wd / 2;
      if (x0 < lastEnd + 14) return;
      lastEnd = x0 + wd;
      ax += '<text x="' + f1(xx) + '" y="15" text-anchor="' + mode + '">' + ESC(lbl) + '</text>';
    });
    ax += '</g>';
    /* cross-links (influence, shared roots): dashed arcs */
    T.links.forEach((l) => {
      if (!V.ids.has(l.from) || !V.ids.has(l.to)) return;
      const a = T.by[l.from];
      const b = T.by[l.to];
      const yr = l.at != null ? l.at : Math.max(a.from, b.from);
      const xx = f1(P.x(Math.max(a.from, Math.min(a.to, yr))));
      const xb = f1(P.x(Math.max(b.from, Math.min(b.to, yr))));
      const ya = P.y(a.id);
      const yb = P.y(b.id);
      const bend = Math.min(40, Math.abs(yb - ya) / 3 + 10);
      const on = sel && (sel === a.id || sel === b.id);
      s +=
        '<path class="tr-link f-' +
        l.type +
        (on ? ' on' : sel ? ' fade' : '') +
        '" d="M' +
        xx +
        ' ' +
        ya +
        ' C' +
        f1(+xx + bend) +
        ' ' +
        ya +
        ' ' +
        f1(+xb + bend) +
        ' ' +
        yb +
        ' ' +
        xb +
        ' ' +
        yb +
        '"><title>' +
        ESC(a.name + ' · ' + b.name + (l.label ? ': ' + l.label : '')) +
        '</title></path>';
    });
    /* branch connectors: from the parent's bar at the year the branch began, curving into the child (up or
       down); a node formed by merger gets one from each predecessor */
    V.nodes.forEach((n) => {
      const ms = (V.mergeOf && V.mergeOf[n.id]) || [];
      const ps = ms.slice();
      const p0 = V.parentOf[n.id];
      if (p0 && ps.indexOf(p0) < 0) ps.unshift(p0);
      ps.forEach((p) => {
        const pn = T.by[p];
        const fam = ms.indexOf(p) >= 0 ? 'merger' : n.ptype;
        const yr = Math.max(pn.from, Math.min(pn.to, n.from));
        const xp = P.x(yr);
        const xc = P.x(n.from);
        const yp = P.y(p);
        const yc = P.y(n.id);
        const k = Math.max(-16, Math.min(16, (yc - yp) / 2));
        const on = sel && (n.id === sel || p === sel || (kin.has(n.id) && (kin.has(p) || p === sel)));
        const dim = o.dim && o.dim(n);
        s +=
          '<path class="tr-br f-' +
          fam +
          (on ? ' on' : sel ? ' fade' : '') +
          (dim ? ' dim' : '') +
          '" style="--tc:' +
          ESC(n.col) +
          '" d="M' +
          f1(xp) +
          ' ' +
          yp +
          ' C' +
          f1(xp) +
          ' ' +
          f1(yc - k) +
          ' ' +
          f1(xp) +
          ' ' +
          yc +
          ' ' +
          f1(Math.max(xc, xp + 1)) +
          ' ' +
          yc +
          '">' +
          (n.prel || fam !== 'branch'
            ? '<title>' + ESC(pn.name + ' → ' + n.name + (n.prel ? ': ' + n.prel : '')) + '</title>'
            : '') +
          '</path>';
        /* a division is marked by a short cross-stroke where it leaves the parent */
        if (fam === 'division')
          s +=
            '<path class="tr-cut' +
            (dim ? ' dim' : '') +
            '" style="--tc:' +
            ESC(n.col) +
            '" d="M' +
            f1(xp - 4) +
            ' ' +
            f1(yp + (yc > yp ? 6 : -6)) +
            ' L' +
            f1(xp + 4) +
            ' ' +
            f1(yp + (yc > yp ? 10 : -10)) +
            '"/>';
      });
    });
    /* the traditions */
    V.nodes.forEach((n) => {
      const x0 = P.x(n.from);
      const x1 = Math.max(P.x(n.to), x0 + 6);
      const yy = P.y(n.id);
      const dim = o.dim && o.dim(n);
      const cls =
        'tr-n' +
        (n.id === sel ? ' sel' : kin.has(n.id) ? ' kin' : sel ? ' fade' : '') +
        (dim ? ' dim' : '') +
        (n.ongoing ? ' go' : '') +
        (n.undated ? ' und' : '');
      const dates = dateText(n, fmt);
      /* an uncertain window is a ramp from its earliest to its latest year, then the solid bar */
      const xs = n.sol != null ? P.x(n.sol) : x0;
      const bar = n.undated
        ? (n.ongoing ? '<path class="tr-bar und" d="M' + f1(x0) + ' ' + yy + ' H' + f1(x1) + '"/>' : '') +
          '<circle class="tr-dot und" cx="' + f1(x0) + '" cy="' + yy + '" r="4.5"/>'
        : (xs > x0
            ? '<rect class="tr-ramp" x="' + f1(x0) + '" y="' + (yy - 3) + '" width="' + f1(xs - x0) + '" height="6"/>'
            : '') +
          '<rect class="tr-bar" x="' + f1(xs) + '" y="' + (yy - 3) + '" width="' + f1(Math.max(x1 - xs, 6)) +
          '" height="6" rx="3"/><circle class="tr-dot" cx="' + f1(xs) + '" cy="' + yy + '" r="4.5"/>';
      /* names near the right edge go to the left of the start dot so they stay on the chart */
      const right = x0 > P.w - 190;
      const tx = right ? x0 - 9 : x0 + 2;
      const ty = right ? yy + 5 : yy - 8;
      s +=
        '<g class="' +
        cls +
        '" style="--tc:' +
        ESC(n.col) +
        '" data-node="' +
        ESC(n.id) +
        '" tabindex="0" role="button" aria-pressed="' +
        (n.id === sel) +
        '" aria-label="' +
        ESC(n.name + ', ' + dates + (dim ? ' (outside the current filters)' : '')) +
        '">' +
        '<rect class="tr-hit" x="' +
        f1(right ? x0 - 178 : x0 - 4) +
        '" y="' +
        (yy - 19) +
        '" width="' +
        f1(Math.max(x1 - x0, 170) + 8) +
        '" height="' +
        ROW +
        '"/>' +
        bar +
        '<text class="tr-name" x="' +
        f1(tx) +
        '" y="' +
        ty +
        '"' +
        (right ? ' text-anchor="end"' : ' data-x0="' + f1(tx) + '" data-x1="' + f1(x1) + '"') +
        '>' +
        ESC(n.name) +
        '</text></g>';
    });
    return s + ax + '</svg>';
  }

  root.AtlasTree = {
    normTree,
    visibleTree,
    lineage,
    fitScale,
    layout,
    ticks,
    tickStep,
    render,
    dateText,
    ESC,
    toAxis,
    fromAxis,
    ZOOMS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
