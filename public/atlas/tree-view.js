/* Atlas branching tree: the DOM controller (PACK_FORMAT section 21).
   The engine calls AtlasTree.createView(env) when a pack has `tree`; the pure normalise, layout and drawing
   code is in tree.js, typed relations and the "by relationship" outline in tree-rel.js.
   Loaded by atlas/index.html after tree.js and before engine.js. */
(function (root) {
  'use strict';

  const TR = root.AtlasTree;
  if (!TR) return;
  const { normTree, visibleTree, layout, fitScale, render, dateText, ESC, ZOOMS } = TR;

  /* env: {el, pack, LY, LAY, TL, esc, noteLabels, visible(node), filterOk(item), onShow(node, siteId),
           onChange(), placeName(worldId, siteId)} */
  function createView(env) {
    const LY = env.LY;
    const T = normTree(env.pack, env.TL, env.LAY);
    if (!T || !env.el) return null;
    const style = env.TL ? env.TL.style : 'BC/AD';
    const fmt = (y, ap) => (LY ? LY.fmtYear(y, style, ap) : String(y));
    const el = env.el;
    const REL = root.AtlasTreeRel || null;
    let mode = REL ? T.view : 'date';
    let sel = null;
    let zoom = 0;
    let open = false;
    let V = null;
    let lastFocus = null;
    el.innerHTML =
      '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="trT"><div class="cx-head tr-head">' +
      '<h2 id="trT" class="chrome">' +
      ESC(T.title.toUpperCase()) +
      '</h2><span class="tr-note"></span>' +
      (REL
        ? '<div class="tr-mode" role="group" aria-label="Arrange the tree">' +
          '<button class="btn" data-mode="date" aria-pressed="true">By date</button>' +
          '<button class="btn" data-mode="relationship" aria-pressed="false">By relationship</button></div>'
        : '') +
      '<div class="tr-zoom" role="group" aria-label="Zoom the years">' +
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
      const had = ae && scroll.contains(ae) && ae.dataset ? ae.dataset.node || ae.dataset.go : null;
      V = visibleTree(T, env.visible);
      if (sel && !V.ids.has(sel)) sel = null;
      const P = layout(T, V, fitScale(T, scroll.clientWidth || 900, zoom));
      const rel = mode === 'relationship';
      scroll.classList.toggle('rel', rel);
      scroll.innerHTML = !V.nodes.length
        ? '<p class="locked-note">Nothing in the tree yet for this reading position.</p>'
        : rel
          ? REL.outline(T, V, { sel, dim: dimOf, fmt })
          : render(T, V, P, { sel, dim: dimOf, fmt, eras: env.TL ? env.TL.eras : [] });
      el.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
      names = [...scroll.querySelectorAll('text[data-x0]')].map((t) => ({
        t,
        x0: +t.getAttribute('data-x0'),
        x1: +t.getAttribute('data-x1'),
        w: 0,
      }));
      stick();
      if (had) {
        const g = scroll.querySelector('[data-node="' + had + '"],.tr-oi[data-go="' + had + '"]');
        if (g) g.focus({ preventScroll: true });
      }
      const nd = V.nodes.filter(dimOf).length;
      const nu = V.nodes.filter((n) => n.undated).length;
      note.textContent = [
        nd ? nd + ' faded: outside the selected years or layers' : '',
        nu && !rel ? nu + ' without a single founding date' : '',
      ]
        .filter(Boolean)
        .join(' · ');
      el.querySelectorAll('[data-z]').forEach((b) => {
        const z = zoom + +b.dataset.z;
        b.disabled = rel || z < 0 || z >= ZOOMS.length;
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
          '<p class="tr-hint">Pick a tradition to see where it came from and what branched from it.</p>' +
          (REL ? REL.legend(T) : '');
        return;
      }
      const meta = LY ? LY.itemMeta(env.LAY, env.TL, { layers: n.layers }) : '';
      const dates = dateText(n, fmt, true);
      const labels = env.noteLabels || {};
      let h =
        '<p class="eyebrow">' +
        ESC(dates) +
        (n.kind ? ' · ' + ESC(n.kind) : '') +
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
      h += relations(n);
      const ns = n.notSame.filter((x) => !x.id || !T.by[x.id] || V.ids.has(x.id));
      if (ns.length)
        h +=
          '<p class="tr-rel tr-ns"><b>' +
          ESC(labels.notsame || 'Not the same as') +
          '</b>' +
          ns
            .map((x) => (x.id && T.by[x.id] ? chip(T.by[x.id]) : '') + (x.t ? '<i class="tr-why">' + ESC(x.t) + '</i>' : ''))
            .join('') +
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
      else if (n.world) h += '<p class="tr-rel"><button class="btn tr-map" data-site="">Open the map</button> <i class="tr-why">no single map point for this entry</i></p>';
      info.innerHTML = h;
    }

    /* "Branched from", "Branches" and "Ties", or (with tree-rel.js) one group per relation family */
    function relations(n) {
      const why = (t) => (t ? '<i class="tr-why">' + ESC(t) + '</i>' : '');
      if (!REL) {
        const p = V.parentOf[n.id] ? T.by[V.parentOf[n.id]] : null;
        const kids = V.kids[n.id] || [];
        const rel = T.links
          .filter((l) => (l.from === n.id || l.to === n.id) && V.ids.has(l.from) && V.ids.has(l.to))
          .map((l) => ({ n: T.by[l.from === n.id ? l.to : l.from], label: l.label }));
        let h = '';
        if (p) h += '<p class="tr-rel"><b>Branched from</b>' + chip(p) + '</p>';
        if (kids.length) h += '<p class="tr-rel"><b>Branches</b>' + kids.map(chip).join('') + '</p>';
        if (rel.length) h += '<p class="tr-rel"><b>Ties</b>' + rel.map((r) => chip(r.n) + why(r.label)).join('') + '</p>';
        return h;
      }
      const groups = [];
      const gi = {};
      REL.ties(T, V, n.id).forEach((x) => {
        const f = REL.FAMILIES[x.fam] || REL.FAMILIES.overlap;
        const k = x.fam + ':' + x.dir;
        if (!gi[k]) groups.push((gi[k] = { title: x.dir === 'up' ? f.up : f.down, items: [] }));
        gi[k].items.push(chip(x.n) + why(x.rel));
      });
      return groups.map((g) => '<p class="tr-rel"><b>' + ESC(g.title) + '</b>' + g.items.join('') + '</p>').join('');
    }

    function focusNode(id, instant) {
      const q = window.CSS && CSS.escape ? CSS.escape(id) : id;
      const g = scroll.querySelector('[data-node="' + q + '"],.tr-oi[data-go="' + q + '"]');
      if (!g) return;
      const r = g.getBoundingClientRect();
      const b = scroll.getBoundingClientRect();
      if (r.left < b.left + 20 || r.right > b.right - 20 || r.top < b.top || r.bottom > b.bottom)
        scroll.scrollBy({
          left: r.left - b.left - 60,
          top: r.top - b.top - b.height / 3,
          behavior: instant ? 'auto' : 'smooth',
        });
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
      const md = t.closest('[data-mode]');
      if (md) {
        if (md.dataset.mode !== mode) {
          mode = md.dataset.mode;
          draw();
          if (sel) focusNode(sel);
        }
        return;
      }
      const z = t.closest('[data-z]');
      if (z && !z.disabled) {
        const c = scroll.scrollLeft + scroll.clientWidth / 2;
        const before = scroll.scrollWidth || 1;
        zoom = Math.max(0, Math.min(ZOOMS.length - 1, zoom + +z.dataset.z));
        draw();
        scroll.scrollLeft = (c / before) * scroll.scrollWidth - scroll.clientWidth / 2;
        return;
      }
      const g = t.closest('[data-node]') || t.closest('[data-go]');
      if (g) {
        if (g.closest('summary')) e.preventDefault();
        return select(g.dataset.node || g.dataset.go, !!g.dataset.node || !!g.closest('.tr-outline'));
      }
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
      get mode() {
        return mode;
      },
      show(id) {
        lastFocus = document.activeElement;
        open = true;
        el.hidden = false;
        sel = id && T.by[id] ? id : sel;
        draw();
        /* after the dialog has its size (a deep link opens it during start-up): jump, then focus */
        if (sel) requestAnimationFrame(() => open && sel && focusNode(sel, true));
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

  TR.createView = createView;
})(typeof window !== 'undefined' ? window : globalThis);
