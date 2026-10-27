/* Atlas branching tree (PACK_FORMAT section 21).
   A "family tree" of traditions on a year axis: each tradition is a bar from the year it began, joined to the
   tradition it branched from. Used by Track A packs (for example how Judaism, Christianity and Islam diverge).
   The top half is pure (normalise, lay out, draw an SVG string) and is unit-tested in a vm context; createView()
   at the bottom is the small DOM controller the engine calls when a pack has `tree`.
   Loaded by atlas/index.html after layers.js and before engine.js. */
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

  function span(n) {
    const w = n && n.when;
    if (w == null) return null;
    const a = Array.isArray(w) ? +w[0] : +w;
    const b = Array.isArray(w) && w.length > 1 ? +w[1] : a;
    if (!isFinite(a) || !isFinite(b)) return null;
    return a <= b ? [a, b] : [b, a];
  }

  /* ---------- normalise ---------- */

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
        from: s[0],
        to: s[1],
        ongoing: !!n.ongoing,
        approx: !!n.approx,
        parent: n.parent != null ? String(n.parent) : null,
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
    });
    let min = Infinity;
    let max = -Infinity;
    nodes.forEach((n) => {
      min = Math.min(min, n.from);
      max = Math.max(max, n.to);
    });
    if (timeline) {
      min = Math.min(min, timeline.min);
      max = Math.max(max, timeline.max);
    }
    if (src.max != null && isFinite(+src.max)) max = Math.max(max, +src.max);
    /* colour: own, else the parent's, else the first layer's */
    const colour = (n, depth) => {
      if (n.c) return n.c;
      if (n.parent && depth < 50) return colour(by[n.parent], depth + 1);
      const l = layers && n.layers.length && layers.by[n.layers[0]];
      return l ? l.c : DEF_C;
    };
    nodes.forEach((n) => (n.col = colour(n, 0)));
    nodes.forEach((n) => {
      if (n.ongoing) n.to = max;
      n.when = n.from === n.to ? n.from : [n.from, n.to];
    });
    const links = ARR(src.links)
      .filter((l) => l && by[String(l.from)] && by[String(l.to)] && String(l.from) !== String(l.to))
      .map((l) => ({
        from: String(l.from),
        to: String(l.to),
        label: l.label || '',
        at: l.when != null && isFinite(+l.when) ? +l.when : null,
      }));
    nodes.forEach((n) => n.also.forEach((a) => links.push({ from: a, to: n.id, label: '', at: null })));
    return {
      title: src.title || 'Family tree',
      button: src.button || 'Tree',
      intro: src.intro || '',
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
    vis.forEach((n) => {
      let p = n.parent;
      while (p && !set.has(p)) p = T.by[p].parent;
      parentOf[n.id] = p || null;
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
    return { nodes: out, parentOf, kids, ids: set };
  }

  /* ancestors and descendants of a node (its lineage), for highlighting */
  function lineage(V, id) {
    const out = new Set();
    if (!id || !V.ids.has(id)) return out;
    let p = V.parentOf[id];
    while (p) {
      out.add(p);
      p = V.parentOf[p];
    }
    const down = (k) =>
      (V.kids[k] || []).forEach((c) => {
        out.add(c.id);
        down(c.id);
      });
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
      '">';
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
        '<path class="tr-link' +
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
    /* branch connectors: from the parent's bar at the year the branch began, curving down into the child */
    V.nodes.forEach((n) => {
      const p = V.parentOf[n.id];
      if (!p) return;
      const pn = T.by[p];
      const yr = Math.max(pn.from, Math.min(pn.to, n.from));
      const xp = P.x(yr);
      const xc = P.x(n.from);
      const yp = P.y(p);
      const yc = P.y(n.id);
      const k = Math.min(16, (yc - yp) / 2);
      const on = sel && (n.id === sel || p === sel || (kin.has(n.id) && (kin.has(p) || p === sel)));
      const dim = o.dim && o.dim(n);
      s +=
        '<path class="tr-br' +
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
        '"/>';
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
        (n.ongoing ? ' go' : '');
      const dates = n.ongoing ? fmt(n.from, n.approx) + ' –' : n.from === n.to ? fmt(n.from, n.approx) : fmt(n.from, n.approx) + ' – ' + fmt(n.to);
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
        '<rect class="tr-bar" x="' +
        f1(x0) +
        '" y="' +
        (yy - 3) +
        '" width="' +
        f1(x1 - x0) +
        '" height="6" rx="3"/>' +
        '<circle class="tr-dot" cx="' +
        f1(x0) +
        '" cy="' +
        yy +
        '" r="4.5"/>' +
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

  /* ---------- DOM controller (used by engine.js) ---------- */
  /* env: {el, pack, LY, LAY, TL, esc, noteLabels, visible(node), filterOk(item), onShow(node, siteId),
           onChange(), placeName(worldId, siteId)} */
  function createView(env) {
    const LY = env.LY;
    const T = normTree(env.pack, env.TL, env.LAY);
    if (!T || !env.el) return null;
    const style = env.TL ? env.TL.style : 'BC/AD';
    const fmt = (y, ap) => (LY ? LY.fmtYear(y, style, ap) : String(y));
    const el = env.el;
    let sel = null;
    let zoom = 0;
    let open = false;
    let V = null;
    let lastFocus = null;
    el.innerHTML =
      '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="trT"><div class="cx-head tr-head">' +
      '<h2 id="trT" class="chrome">' +
      ESC(T.title.toUpperCase()) +
      '</h2><span class="tr-note"></span><div class="tr-zoom" role="group" aria-label="Zoom the years">' +
      '<button class="btn" data-z="-1" aria-label="Zoom out" title="Zoom out">−</button>' +
      '<button class="btn" data-z="1" aria-label="Zoom in" title="Zoom in">+</button></div>' +
      '<button class="btn" data-tr="close">Close</button></div>' +
      '<div class="tr-main"><div class="tr-scroll"></div><div class="tr-info"></div></div></div>';
    const scroll = el.querySelector('.tr-scroll');
    const info = el.querySelector('.tr-info');
    const note = el.querySelector('.tr-note');
    const dimOf = (n) => !env.filterOk(n);

    function draw() {
      const ae = document.activeElement;
      const had = ae && scroll.contains(ae) && ae.dataset ? ae.dataset.node : null;
      V = visibleTree(T, env.visible);
      if (sel && !V.ids.has(sel)) sel = null;
      const P = layout(T, V, fitScale(T, scroll.clientWidth || 900, zoom));
      scroll.innerHTML = V.nodes.length
        ? render(T, V, P, { sel, dim: dimOf, fmt, eras: env.TL ? env.TL.eras : [] })
        : '<p class="locked-note">Nothing in the tree yet for this reading position.</p>';
      names = [...scroll.querySelectorAll('text[data-x0]')].map((t) => ({
        t,
        x0: +t.getAttribute('data-x0'),
        x1: +t.getAttribute('data-x1'),
        w: 0,
      }));
      stick();
      if (had) {
        const g = scroll.querySelector('[data-node="' + had + '"]');
        if (g) g.focus({ preventScroll: true });
      }
      const nd = V.nodes.filter(dimOf).length;
      note.textContent = nd ? nd + ' faded: outside the selected years or layers' : '';
      el.querySelectorAll('[data-z]').forEach((b) => {
        const z = zoom + +b.dataset.z;
        b.disabled = z < 0 || z >= ZOOMS.length;
      });
      drawInfo();
    }

    /* keep the year labels at the top and each name inside the visible part of its bar while scrolling */
    let names = [];
    function stick() {
      const tk = scroll.querySelector('.tr-ticks');
      if (tk) tk.setAttribute('transform', 'translate(0,' + scroll.scrollTop + ')');
      const left = scroll.scrollLeft + 8;
      names.forEach((o) => {
        if (!o.w) {
          try {
            o.w = o.t.getComputedTextLength();
          } catch (e) {
            o.w = 120;
          }
        }
        const x = Math.max(o.x0, Math.min(left, o.x1 - o.w - 4));
        o.t.setAttribute('x', String(Math.round(Math.max(o.x0, x))));
      });
    }
    let sp = 0;
    scroll.addEventListener(
      'scroll',
      () => {
        if (sp) return;
        sp = requestAnimationFrame(() => {
          sp = 0;
          stick();
        });
      },
      { passive: true },
    );

    function chip(n) {
      return (
        '<button class="tr-chip" data-go="' +
        ESC(n.id) +
        '" style="--tc:' +
        ESC(n.col) +
        '"><span aria-hidden="true"></span>' +
        ESC(n.name) +
        '</button>'
      );
    }

    function drawInfo() {
      const n = sel && T.by[sel];
      if (!n) {
        info.innerHTML =
          (T.intro ? '<p class="tr-intro">' + ESC(T.intro) + '</p>' : '') +
          '<p class="tr-hint">Pick a tradition to see where it came from and what branched from it.</p>';
        return;
      }
      const meta = LY ? LY.itemMeta(env.LAY, env.TL, { layers: n.layers }) : '';
      const dates = n.ongoing ? fmt(n.from, n.approx) + ' – today' : LY ? LY.fmtWhen(n, style) : '';
      const p = V.parentOf[n.id] ? T.by[V.parentOf[n.id]] : null;
      const kids = V.kids[n.id] || [];
      const rel = T.links
        .filter((l) => (l.from === n.id || l.to === n.id) && V.ids.has(l.from) && V.ids.has(l.to))
        .map((l) => ({ n: T.by[l.from === n.id ? l.to : l.from], label: l.label }));
      const labels = env.noteLabels || {};
      let h =
        '<p class="eyebrow">' +
        ESC(dates) +
        '</p><h3 style="--tc:' +
        ESC(n.col) +
        '">' +
        ESC(n.name) +
        '</h3>' +
        (meta ? '<p class="tr-meta">' + meta + '</p>' : '') +
        (n.blurb ? '<p>' + ESC(n.blurb) + '</p>' : '');
      if (n.notes.length)
        h +=
          '<div class="pnotes">' +
          n.notes
            .map(
              (x) =>
                '<span class="pnote"><b>' +
                ESC(labels[x.k] || x.k || labels.note || 'Note') +
                '</b>' +
                ESC(x.t) +
                (x.ref ? ' <i>' + ESC(x.ref) + '</i>' : '') +
                '</span>',
            )
            .join('') +
          '</div>';
      if (p) h += '<p class="tr-rel"><b>Branched from</b>' + chip(p) + '</p>';
      if (kids.length) h += '<p class="tr-rel"><b>Branches</b>' + kids.map(chip).join('') + '</p>';
      if (rel.length)
        h +=
          '<p class="tr-rel"><b>Ties</b>' +
          rel.map((r) => chip(r.n) + (r.label ? '<i class="tr-why">' + ESC(r.label) + '</i>' : '')).join('') +
          '</p>';
      const places = [];
      if (n.site) places.push(n.site);
      n.sites.forEach((s) => places.indexOf(s) < 0 && places.push(s));
      if (n.world && places.length)
        h +=
          '<p class="tr-rel"><b>On the map</b>' +
          places
            .map((s) => {
              const nm = env.placeName ? env.placeName(n.world, s) : '';
              return nm ? '<button class="btn tr-map" data-site="' + ESC(s) + '">' + ESC(nm) + '</button>' : '';
            })
            .join('') +
          '</p>';
      else if (n.world) h += '<p class="tr-rel"><button class="btn tr-map" data-site="">Show on the map</button></p>';
      info.innerHTML = h;
    }

    function focusNode(id) {
      const g = scroll.querySelector('[data-node="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
      if (!g) return;
      const r = g.getBoundingClientRect();
      const b = scroll.getBoundingClientRect();
      if (r.left < b.left + 20 || r.right > b.right - 20 || r.top < b.top || r.bottom > b.bottom)
        scroll.scrollBy({ left: r.left - b.left - 60, top: r.top - b.top - b.height / 3, behavior: 'smooth' });
      try {
        g.focus({ preventScroll: true });
      } catch (e) {
        g.focus();
      }
    }

    function select(id, keepFocus) {
      sel = id && T.by[id] ? id : null;
      draw();
      if (sel && !keepFocus) focusNode(sel);
      env.onChange();
    }

    el.addEventListener('click', (e) => {
      if (e.target === el) return api.close();
      const t = e.target;
      if (t.closest('[data-tr="close"]')) return api.close();
      const z = t.closest('[data-z]');
      if (z) {
        const c = scroll.scrollLeft + scroll.clientWidth / 2;
        const before = scroll.scrollWidth || 1;
        zoom = Math.max(0, Math.min(ZOOMS.length - 1, zoom + +z.dataset.z));
        draw();
        scroll.scrollLeft = (c / before) * scroll.scrollWidth - scroll.clientWidth / 2;
        return;
      }
      const g = t.closest('[data-node]') || t.closest('[data-go]');
      if (g) return select(g.dataset.node || g.dataset.go, !!g.dataset.node);
      const m = t.closest('[data-site]');
      if (m && sel) {
        const n = T.by[sel];
        api.close(true);
        env.onShow(n, m.dataset.site || null);
      }
    });
    el.addEventListener('keydown', (e) => {
      const g = e.target.closest && e.target.closest('[data-node]');
      if (g && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        select(g.dataset.node, true);
        return;
      }
      if (g && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const i = V.nodes.findIndex((n) => n.id === g.dataset.node) + (e.key === 'ArrowDown' ? 1 : -1);
        if (V.nodes[i]) focusNode(V.nodes[i].id);
        return;
      }
      /* keep Tab inside the dialog */
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll('button,[tabindex="0"]')].filter((x) => !x.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    });
    let rz = 0;
    addEventListener('resize', () => {
      if (!open) return;
      cancelAnimationFrame(rz);
      rz = requestAnimationFrame(draw);
    });

    const api = {
      T,
      get open() {
        return open;
      },
      get sel() {
        return sel;
      },
      show(id) {
        lastFocus = document.activeElement;
        open = true;
        el.hidden = false;
        sel = id && T.by[id] ? id : sel;
        draw();
        if (sel) focusNode(sel);
        else {
          const c = el.querySelector('[data-tr="close"]');
          if (c) c.focus();
        }
        env.onChange();
      },
      close(quiet) {
        if (!open) return;
        open = false;
        el.hidden = true;
        if (!quiet && lastFocus && lastFocus.focus) lastFocus.focus();
        env.onChange();
      },
      refresh() {
        if (open) draw();
      },
      select,
      /* the tree node whose home place this is (for a "Show in the tree" link) */
      nodeFor(worldId, siteId) {
        return T.nodes.find((n) => n.world === worldId && n.site === siteId) || null;
      },
    };
    return api;
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
    createView,
    toAxis,
    fromAxis,
    ZOOMS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
