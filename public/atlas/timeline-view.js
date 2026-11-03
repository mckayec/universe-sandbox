/* Atlas synchronoptic timeline: the DOM view (docs/reviews/synchronoptic-timelines/proposal.md §3).
   Draws only what AtlasTimeline (timeline.js) returns after gating: a shared BCE/CE axis with era bands, one lane
   per tradition plus a Chronicle lane per layer, an undated / relative-order strip, an equivalent list view, a
   details panel and the coverage gaps. SVG and DOM (crisp at 4K, every mark focusable); no WebGL.
   Loaded by atlas/index.html after timeline.js and before engine.js. The engine calls createView(env). */
(function (root) {
  'use strict';

  const TLM = root.AtlasTimeline;
  if (!TLM) return;
  const ESC = s =>
    String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ZOOMS = [1, 1.6, 2.5, 4, 6.5];
  const ROW = 26;
  const LANE_HEAD = 30;
  const AXIS_H = 48;
  const ERA_Y = 14;
  const PRECISION = {
    window: 'Emergence window: the source gives a period, not a year',
    range: 'A range or separate episodes, as the source gives them',
    approx: 'Approximate date',
    exact: 'Year given by the source',
  };
  /* presence after a window is stated only when the record gives an end year or says it is ongoing */
  const presence = w =>
    w.window
      ? w.toOpen
        ? '; continued presence after it, still ongoing'
        : w.to != null
          ? '; continued presence after it until the end year given'
          : '; no continued presence is stated'
      : w.toOpen
        ? '; still ongoing'
        : '';
  const precisionOf = w => (w.window ? 'window' : w.range ? 'range' : w.approx ? 'approx' : 'exact');
  /* a relationship's own citation line: the research ledger row, then each evidence source (linked when it has a
     URL); overview groupings say so instead; anything else is flagged as missing a locator */
  const link = (u, t) => '<a href="' + ESC(u) + '" target="_blank" rel="noopener noreferrer">' + ESC(t) + '</a>';
  function edgeCite(e, short) {
    if (e.editorial) return ' <span class="tl-why tl-ed">overview grouping, not a historical claim</span>';
    if (!e.src.length)
      return (
        ' <span class="tl-gap">' + (short ? 'no source locator' : 'no source locator on this relationship') + '</span>'
      );
    return (
      '<span class="tl-cite">Source: ' +
      (e.locator ? ESC(e.locator) + ' — ' : '') +
      e.src
        .map(x => {
          let h = x.u ? link(x.u, x.t) : ESC(x.t);
          /* other routes named in the research register (e.g. the copy actually inspected) and its page/section scope */
          if (!short && x.alt && x.alt.length) h += ' (also: ' + x.alt.map(a => link(a.u, a.t)).join(', ') + ')';
          if (!short && x.scope) h += ' <span class="tl-scope">Scope: ' + ESC(x.scope) + '</span>';
          return h;
        })
        .join('; ') +
      '</span>'
    );
  }
  const EDGE_WORD = {
    branch: 'Developed from',
    within: 'Within',
    division: 'Divided from',
    merge: 'Formed by merging',
    overlap: 'Overlaps',
    contact: 'Contact',
    history: 'History with',
    context: 'Context',
  };

  /* env: {el, pack, axis, ok(gate), fmt(year, approx), onChange(), colorFor(layerId)} */
  function createView(env) {
    const model = TLM.adaptTree(env.pack);
    if (!model.records.length || !env.el) return null;
    const el = env.el;
    const axis = env.axis || {};
    let open = false;
    let mode = 'chart';
    let zoom = 0;
    let sel = null;
    let V = null;
    let lastFocus = null;
    let gut = 0;
    const defaultOrder = model.lanes.map(l => l.id);
    let order = defaultOrder.slice();
    const collapsed = new Set();
    const fmt = (y, ap) => (env.fmt ? env.fmt(y, ap) : (ap ? 'c. ' : '') + TLM.yearLabel(y));
    const whenText = r =>
      r.whenText ||
      (r.when ? fmt(r.when.from, r.when.approx) + (r.when.to != null ? ' – ' + fmt(r.when.to) : '') : 'No date');

    el.innerHTML =
      '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="tlT"><div class="cx-head tl-head">' +
      '<h2 id="tlT" class="chrome">Timeline</h2><span class="tl-note">Simplified view · dates only where the sources give them · relationship brackets at the left are undated</span>' +
      '<div class="tl-mode" role="group" aria-label="Arrangement">' +
      '<button class="btn" data-mode="chart" aria-pressed="true">Chart</button>' +
      '<button class="btn" data-mode="list" aria-pressed="false">List</button></div>' +
      '<div class="tl-zoom" role="group" aria-label="Zoom">' +
      '<button class="btn" data-z="-1" aria-label="Zoom out" title="Zoom out">−</button>' +
      '<button class="btn" data-z="1" aria-label="Zoom in" title="Zoom in">+</button>' +
      '<button class="btn" data-z="0" title="Reset zoom">Reset</button></div>' +
      '<button class="btn" data-tl="close">Close</button></div>' +
      '<div class="tl-lanes" role="group" aria-label="Lanes: collapse, expand or reorder"></div>' +
      '<div class="tl-main"><div class="tl-scroll" tabindex="-1"></div><aside class="tl-info" aria-live="polite"></aside></div></div>';
    const scrollEl = el.querySelector('.tl-scroll');
    const info = el.querySelector('.tl-info');
    const laneBar = el.querySelector('.tl-lanes');
    const arranged = () => TLM.arrangeLanes(V.lanes, order);

    function compute() {
      V = TLM.visible(model, env.ok);
      sel = TLM.revalidate(V, sel);
    }

    /* ---------- chart ---------- */
    function chart() {
      const ext = TLM.extent(V, axis);
      if (!ext) return '<p class="tl-empty">Nothing dated is visible with the current filters.</p>';
      const lo = Math.max(axis.min != null ? axis.min : ext[0], ext[0] - 20);
      const hi = Math.min(axis.max != null ? axis.max : ext[1], ext[1] + 10);
      const a0 = TLM.astro(lo);
      const a1 = TLM.astro(hi);
      const avail = Math.max(320, scrollEl.clientWidth - 24);
      const W = Math.round(avail * ZOOMS[zoom]);
      const lanes = arranged()
        .map(l => ({
          l,
          rows: V.dated
            .filter(r => r.lane === l.id)
            .sort(
              (p, q) =>
                TLM.astro(p.when.window ? p.when.window[0] : p.when.from) -
                  TLM.astro(q.when.window ? q.when.window[0] : q.when.from) || p.order - q.order,
            ),
        }))
        .filter(x => x.rows.length);
      let y = AXIS_H;
      const rowY = {};
      lanes.forEach(x => {
        x.y = y;
        y += LANE_HEAD;
        if (collapsed.has(x.l.id)) {
          x.sumY = y + ROW / 2;
          y += ROW + 8;
          return;
        }
        x.rows.forEach(r => {
          rowY[r.id] = y + ROW / 2;
          y += ROW;
        });
        y += 8;
      });
      const H = y + 6;
      /* relationships are undated: draw them as brackets in a gutter outside the time axis (TL-R07) */
      const links = V.drawnEdges.filter(e => rowY[e.from] != null && rowY[e.to] != null && e.from !== e.to);
      const cols = TLM.bracketColumns(links.map(e => ({ id: e.id, y0: rowY[e.from], y1: rowY[e.to] })));
      gut = TLM.gutterWidth(cols.count);
      const X = y => gut + 12 + ((TLM.astro(y) - a0) / (a1 - a0)) * (W - gut - 24);
      let s =
        '<svg class="tl-svg" width="' +
        W +
        '" height="' +
        H +
        '" viewBox="0 0 ' +
        W +
        ' ' +
        H +
        '" role="group" aria-label="Timeline chart">' +
        '<defs><pattern id="tlHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
        '<rect width="2.4" height="6" fill="currentColor"/></pattern>' +
        '<linearGradient id="tlFade"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<mask id="tlFadeMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#tlFade)"/></mask></defs>';
      (axis.eras || []).forEach((e, i) => {
        const x0 = X(Math.max(e.from, lo));
        const x1 = X(Math.min(e.to, hi));
        if (x1 > x0)
          s +=
            '<rect class="tl-era' +
            (i % 2 ? ' odd' : '') +
            '" x="' +
            x0 +
            '" y="' +
            AXIS_H +
            '" width="' +
            (x1 - x0) +
            '" height="' +
            (H - AXIS_H) +
            '"><title>' +
            ESC(e.name) +
            '</title></rect>' +
            eraLabel(e.name, x0, x1);
      });
      const span = hi - lo;
      const step = [10, 25, 50, 100, 200, 250, 500].find(k => (span / k) * 70 <= W) || 1000;
      for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) {
        const yr = t === 0 ? 1 : t;
        if (X(yr) < gut + 34 || X(yr) > W - 34) continue;
        s +=
          '<line class="tl-tick" x1="' +
          X(yr) +
          '" x2="' +
          X(yr) +
          '" y1="' +
          (AXIS_H - 6) +
          '" y2="' +
          H +
          '"/>' +
          '<text class="tl-tick-t" x="' +
          X(yr) +
          '" y="' +
          (AXIS_H - 9) +
          '">' +
          ESC(TLM.yearLabel(yr)) +
          '</text>';
      }
      lanes.forEach(x => {
        const c = collapsed.has(x.l.id);
        s +=
          '<text class="tl-lane" x="' +
          (gut + 12) +
          '" y="' +
          (x.y + 20) +
          '">' +
          ESC(x.l.title) +
          ' · ' +
          x.rows.length +
          ' dated' +
          (c ? ' · collapsed' : '') +
          '</text>';
        if (c) s += summary(x, X, hi);
        else x.rows.forEach(r => (s += mark(r, rowY[r.id], X, hi)));
      });
      if (cols.count)
        s +=
          '<rect class="tl-gut" x="0" y="' +
          AXIS_H +
          '" width="' +
          (gut - 2) +
          '" height="' +
          (H - AXIS_H) +
          '"><title>Relationship links: undated, joined by row only</title></rect>';
      links.forEach(e => {
        const a = V.byId.get(e.from);
        const b = V.byId.get(e.to);
        const p = TLM.bracketPath(cols.cols[e.id], cols.count, rowY[a.id], rowY[b.id]);
        s +=
          '<path class="tl-edge t-' +
          e.type +
          '" data-edge="' +
          ESC(e.id) +
          '" d="' +
          p.d +
          '"><title>' +
          ESC(
            b.label +
              ' — ' +
              (EDGE_WORD[e.type] || e.type) +
              ' — ' +
              a.label +
              ' (relationship not dated; the bracket joins the two rows, its position is not a year)',
          ) +
          '</title></path>';
      });
      return s + '</svg>';
    }
    /* era names sit on their own row above the year ticks and are shortened to fit the era's width */
    function eraLabel(name, x0, x1) {
      const room = Math.floor((x1 - x0 - 8) / 6.9);
      if (room < 4) return '';
      const t = name.length > room ? name.slice(0, room - 1).trimEnd() + '…' : name;
      return '<text class="tl-era-t" x="' + (x0 + 4) + '" y="' + ERA_Y + '">' + ESC(t) + '</text>';
    }
    /* a collapsed lane: one band from its earliest start to its latest stated end; activating it expands the lane */
    function summary(x, X, hi) {
      const sp = TLM.laneSpan(V, x.l.id);
      if (!sp) return '';
      const cy = x.sumY;
      const x0 = X(sp.from);
      const x1 = Math.max(X(sp.toOpen ? hi : sp.to), x0 + 3);
      const lbl =
        x.rows.length + ' dated records · ' + fmt(sp.from) + ' – ' + (sp.toOpen ? 'still ongoing' : fmt(sp.to));
      /* keep the label inside the chart: left-aligned at the band start when it fits, else right-aligned at the edge */
      const right = X(hi);
      const fits = x0 + 10 + lbl.length * 7.4 <= right;
      const lx = fits ? x0 + 10 : Math.max(right, x0 + 10);
      const anchorEnd = !fits;
      const c = env.colorFor ? env.colorFor(x.rows[0].gate.layers[0]) : '#9db8ff';
      return (
        '<g class="tl-sum" style="--tc:' +
        ESC(c) +
        '" tabindex="0" role="button" data-lane-t="' +
        ESC(x.l.id) +
        '" aria-expanded="false" aria-label="' +
        ESC('Expand ' + x.l.title + ': ' + lbl) +
        '">' +
        '<rect class="tl-sum-bar" x="' +
        x0 +
        '" y="' +
        (cy - 5) +
        '" width="' +
        (x1 - x0) +
        '" height="10"' +
        (sp.toOpen ? ' mask="url(#tlFadeMask)"' : '') +
        '/>' +
        '<text class="tl-lbl" x="' +
        lx +
        '" y="' +
        (cy - 9) +
        '"' +
        (anchorEnd ? ' text-anchor="end"' : '') +
        '>' +
        ESC(lbl) +
        '</text></g>'
      );
    }
    function laneControls() {
      const ls = arranged();
      if (ls.length < 2) return '';
      const changed =
        collapsed.size ||
        ls.map(l => l.id).join(',') !== defaultOrder.filter(id => ls.some(l => l.id === id)).join(',');
      return (
        ls
          .map((l, i) => {
            const c = collapsed.has(l.id);
            return (
              '<span class="tl-lb" data-lane-box="' +
              ESC(l.id) +
              '">' +
              '<span class="tl-grip" data-lane-grip="' +
              ESC(l.id) +
              '" aria-hidden="true" title="Drag to reorder (or use the arrow buttons)">⠿</span>' +
              '<button class="btn tl-lt" data-lane-t="' +
              ESC(l.id) +
              '" aria-expanded="' +
              !c +
              '" title="' +
              (c ? 'Expand' : 'Collapse') +
              ' this lane">' +
              '<span aria-hidden="true">' +
              (c ? '▸' : '▾') +
              '</span> ' +
              ESC(l.title) +
              '</button>' +
              '<button class="btn tl-mv" data-lane-mv="-1" data-lane="' +
              ESC(l.id) +
              '" aria-label="Move ' +
              ESC(l.title) +
              ' up"' +
              (i === 0 ? ' disabled' : '') +
              '>↑</button>' +
              '<button class="btn tl-mv" data-lane-mv="1" data-lane="' +
              ESC(l.id) +
              '" aria-label="Move ' +
              ESC(l.title) +
              ' down"' +
              (i === ls.length - 1 ? ' disabled' : '') +
              '>↓</button>' +
              '</span>'
            );
          })
          .join('') +
        '<button class="btn tl-lr" data-lanes="reset"' +
        (changed ? '' : ' disabled') +
        '>Reset lanes</button>'
      );
    }
    function mark(r, cy, X, hi) {
      const w = r.when;
      const c = env.colorFor ? env.colorFor(r.gate.layers[0]) : '#9db8ff';
      const end = w.to != null ? w.to : w.toOpen ? hi : null;
      let g = '';
      if (r.kind === 'event' && !w.range) {
        const x = X(w.from);
        g += '<path class="tl-pt' + (w.approx ? ' ap' : '') + '" d="M' + x + ' ' + (cy - 6) + 'l6 6l-6 6l-6 -6z"/>';
      } else if (w.window) {
        const x0 = X(w.window[0]);
        const x1 = Math.max(X(w.window[1]), x0 + 3);
        g +=
          '<rect class="tl-win-bg" x="' +
          x0 +
          '" y="' +
          (cy - 6) +
          '" width="' +
          (x1 - x0) +
          '" height="12"/>' +
          '<rect class="tl-win" x="' +
          x0 +
          '" y="' +
          (cy - 6) +
          '" width="' +
          (x1 - x0) +
          '" height="12" fill="url(#tlHatch)"/>';
        if (end != null && X(end) > x1)
          g +=
            '<rect class="tl-bar' +
            (w.toOpen ? ' open' : '') +
            '" x="' +
            x1 +
            '" y="' +
            (cy - 4) +
            '" width="' +
            (X(end) - x1) +
            '" height="8"' +
            (w.toOpen ? ' mask="url(#tlFadeMask)"' : '') +
            '/>';
      } else {
        const x0 = X(w.from);
        const x1 = end != null ? Math.max(X(end), x0 + 3) : x0 + 3;
        g +=
          '<rect class="tl-bar' +
          (w.range ? ' rng' : '') +
          (w.approx ? ' ap' : '') +
          (w.toOpen ? ' open' : '') +
          '" x="' +
          x0 +
          '" y="' +
          (cy - (w.range ? 2 : 4)) +
          '" width="' +
          (x1 - x0) +
          '" height="' +
          (w.range ? 4 : 8) +
          '"' +
          (w.toOpen ? ' mask="url(#tlFadeMask)"' : '') +
          '/>';
      }
      const lx = X(w.window ? w.window[0] : w.from);
      /* labels stay inside the chart: after the mark when they fit, else before it, else from the left edge */
      const tw = r.label.length * 7.6;
      const right = X(hi);
      const after = lx + 10 + tw <= right;
      const before = !after && lx - 10 - tw >= gut + 4;
      const tx = after ? lx + 10 : before ? lx - 10 : gut + 4;
      g +=
        '<text class="tl-lbl" x="' +
        tx +
        '" y="' +
        (cy - 8) +
        '"' +
        (before ? ' text-anchor="end"' : '') +
        '>' +
        ESC(r.label) +
        '</text>';
      return (
        '<g class="tl-m' +
        (sel === r.id ? ' sel' : '') +
        '" style="--tc:' +
        ESC(c) +
        '" tabindex="0" role="button" data-id="' +
        ESC(r.id) +
        '" aria-pressed="' +
        (sel === r.id) +
        '" aria-label="' +
        ESC(r.label + ', ' + whenText(r)) +
        '">' +
        g +
        '</g>'
      );
    }

    /* ---------- undated strip, list, coverage ---------- */
    function item(r) {
      return (
        '<li><button class="tl-it' +
        (sel === r.id ? ' sel' : '') +
        '" data-id="' +
        ESC(r.id) +
        '" aria-pressed="' +
        (sel === r.id) +
        '"><b>' +
        ESC(r.label) +
        '</b> <span>' +
        ESC(whenText(r)) +
        '</span></button></li>'
      );
    }
    /* In the list arrangement every gated record is listed (TL-R02): lane collapse is a chart arrangement only.
       In the chart, a collapsed lane's undated records are summarised with a button that expands the lane. */
    function undated() {
      if (!V.undated.length) return '';
      let h =
        '<section class="tl-und"><h3>Undated or in source order · ' +
        V.undated.length +
        '</h3><p class="tl-why">No calendar year in the source; kept off the axis, in the order the pack gives them.</p>';
      arranged().forEach(l => {
        const rs = V.undated.filter(r => r.lane === l.id);
        if (!rs.length) return;
        if (mode === 'chart' && collapsed.has(l.id))
          h +=
            '<h4>' +
            ESC(l.title) +
            ' <button class="btn tl-ux" data-lane-t="' +
            ESC(l.id) +
            '" aria-expanded="false">Show ' +
            rs.length +
            ' undated · expand lane</button></h4>';
        else h += '<h4>' + ESC(l.title) + '</h4><ol>' + rs.map(item).join('') + '</ol>';
      });
      return h + '</section>';
    }
    function list() {
      const dated = V.dated
        .slice()
        .sort(
          (p, q) =>
            TLM.astro(p.when.window ? p.when.window[0] : p.when.from) -
              TLM.astro(q.when.window ? q.when.window[0] : q.when.from) || p.order - q.order,
        );
      let h =
        '<section class="tl-list"><h3>Dated · ' +
        dated.length +
        '</h3><ol>' +
        dated.map(item).join('') +
        '</ol></section>' +
        undated();
      h +=
        '<section class="tl-list"><h3>Relationships · ' +
        V.edges.length +
        '</h3><ul class="tl-edges">' +
        V.edges
          .map(e => {
            const a = V.byId.get(e.from);
            const b = V.byId.get(e.to);
            return (
              '<li>' +
              ESC(b.label) +
              ' — <i>' +
              ESC(EDGE_WORD[e.type] || e.type) +
              '</i> — ' +
              ESC(a.label) +
              (e.label ? ' <span class="tl-why">(' + ESC(e.label) + ')</span>' : '') +
              edgeCite(e, false) +
              '</li>'
            );
          })
          .join('') +
        '</ul></section>';
      return h;
    }
    function coverageHtml() {
      const c = TLM.coverage(V, model);
      return (
        '<div class="tl-cov"><b>Coverage</b><p>' +
        c.dated +
        ' dated (' +
        c.windows +
        ' as windows, ' +
        c.approx +
        ' approximate), ' +
        c.undated +
        ' undated, ' +
        c.edges +
        ' relationships: ' +
        c.sourced +
        ' with a source locator, ' +
        c.editorial +
        ' overview groupings (not historical claims), ' +
        c.unsourced +
        ' without a locator.</p><b>Not shown, because the data does not support it yet</b><ul>' +
        c.gaps.map(g => '<li>' + ESC(g.t) + '</li>').join('') +
        '</ul></div>'
      );
    }
    function details() {
      const r = sel && V.byId.get(sel);
      if (!r)
        return (
          '<h3 class="tl-ov" tabindex="-1">Overview</h3><p class="tl-intro">Each lane is a tradition or its Chronicle. Hatched marks are emergence windows; fading bars are still ongoing; diamonds are dated events. <span class="tl-undated">Brackets in the left gutter join related traditions; they are not dated.</span> Pick any mark or row for its source wording.</p>' +
          coverageHtml()
        );
      const w = r.when;
      let h =
        '<h3 style="--tc:' +
        ESC(env.colorFor ? env.colorFor(r.gate.layers[0]) : '#9db8ff') +
        '">' +
        ESC(r.label) +
        '</h3>' +
        '<p class="tl-meta">' +
        ESC(whenText(r)) +
        (r.nodeKind ? ' · ' + ESC(r.nodeKind) : '') +
        '</p>' +
        '<p>' +
        ESC(
          w
            ? PRECISION[precisionOf(w)] + presence(w)
            : r.chron === 'narrative'
              ? 'Narrative chronology: no calendar year'
              : 'No defensible date in the source',
        ) +
        '</p>';
      h += evidence(r);
      const es = V.edges.filter(e => e.from === r.id || e.to === r.id);
      if (es.length)
        h +=
          '<b class="tl-k">Relationships</b><ul class="tl-edges">' +
          es
            .map(e => {
              const o = V.byId.get(e.from === r.id ? e.to : e.from);
              return (
                '<li><button class="tl-chip" data-id="' +
                ESC(o.id) +
                '">' +
                ESC(o.label) +
                '</button> <i>' +
                ESC(EDGE_WORD[e.type] || e.type) +
                (e.from === r.id ? ' (from this)' : '') +
                '</i>' +
                (e.label ? ' <span class="tl-why">' + ESC(e.label) + '</span>' : '') +
                /* full citation in record details too (TL-R08): inspected alternate routes and page scope */
                edgeCite(e, false) +
                '</li>'
              );
            })
            .join('') +
          '</ul>';
      return h + '<p><button class="btn" data-tl="clear">Back to the overview</button></p>';
    }

    /* The record's own wording and evidence (TL-R01): blurb/event text, each note with its claim kind and locator,
       identity guards, explicit citations, and an internal atlas cross-reference shown as navigation, not as a
       source. Missing locators are said plainly, never filled in. */
    function evidence(r) {
      let h = '';
      if (r.text) h += '<p class="tl-text">' + ESC(r.text) + '</p>';
      if (r.notes.length)
        h +=
          '<b class="tl-k">Notes in the record</b><ul class="tl-notes">' +
          r.notes
            .map(
              n =>
                '<li>' +
                (n.k ? '<span class="tl-kind">' + ESC(n.k) + '</span> ' : '') +
                ESC(n.t) +
                (n.loc
                  ? ' <span class="tl-loc">Locator: ' + ESC(n.loc) + '</span>'
                  : ' <span class="tl-gap">no locator on this note</span>') +
                '</li>',
            )
            .join('') +
          '</ul>';
      if (r.notSame.length)
        h +=
          '<b class="tl-k">Not the same as</b><ul class="tl-notes">' +
          r.notSame
            .map(n => {
              const o = n.id && V.byId.get('n:' + n.id);
              return (
                '<li>' +
                (o ? '<button class="tl-chip" data-id="' + ESC(o.id) + '">' + ESC(o.label) + '</button> ' : '') +
                ESC(n.t) +
                '</li>'
              );
            })
            .join('') +
          '</ul>';
      if (r.src.length) h += '<p class="tl-why">Citation: ' + r.src.map(s => ESC(s.t)).join('; ') + '</p>';
      const hasLoc = r.src.length || r.notes.some(n => n.loc);
      if (!hasLoc) h += '<p class="tl-gap">No citation locator in this record.</p>';
      if (r.atlasRef) {
        const nm = env.refName ? env.refName(r.atlasRef) : null;
        h +=
          '<p class="tl-why">Atlas cross-reference (not a citation): ' +
          (nm && env.openRef
            ? '<button class="tl-chip" data-tl-ref="' + ESC(r.atlasRef) + '">Open ' + ESC(nm) + ' in the codex</button>'
            : ESC(nm || r.atlasRef)) +
          '</p>';
      }
      return h;
    }

    /* which control has focus, as a selector that survives a rerender */
    function focusKey() {
      const a = document.activeElement;
      if (!a || !el.contains(a) || a === el) return null;
      for (const k of ['data-id', 'data-mode', 'data-z', 'data-tl', 'data-lanes', 'data-tl-ref']) {
        if (a.hasAttribute(k)) return '[' + k + '="' + CSS.escape(a.getAttribute(k)) + '"]';
      }
      if (a.hasAttribute('data-lane-mv'))
        return '[data-lane="' + CSS.escape(a.dataset.lane) + '"][data-lane-mv="' + a.dataset.laneMv + '"]';
      if (a.hasAttribute('data-lane-t')) return '.tl-lt[data-lane-t="' + CSS.escape(a.dataset.laneT) + '"]';
      return null;
    }
    /* After a rerender, focus never falls out of the dialog (TL-R03): the same control if it survives (in the same
       region where possible), else the selected record, else the overview heading, else Close. */
    function restoreFocus(key, region) {
      const a = document.activeElement;
      if (a && a !== document.body && el.contains(a) && a.isConnected) return;
      let t = null;
      if (key) t = (region && region.querySelector(key)) || el.querySelector(key);
      if (t && (t.disabled || (t.offsetParent === null && !(t instanceof SVGElement)))) t = null;
      if (!t && sel) t = el.querySelector('[data-id="' + CSS.escape(sel) + '"]');
      if (!t) t = info.querySelector('.tl-ov, h3');
      if (!t) t = el.querySelector('[data-tl="close"]');
      if (t) {
        if (t.tagName === 'H3' && !t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
      }
    }

    function render() {
      const key = open ? focusKey() : null;
      const a = document.activeElement;
      const region =
        a && (scrollEl.contains(a) ? scrollEl : info.contains(a) ? info : laneBar.contains(a) ? laneBar : null);
      draw();
      if (open && (key || (a && el.contains(a))))
        restoreFocus(key, region && (region === scrollEl ? scrollEl : region === info ? info : laneBar));
    }
    function draw() {
      compute();
      el.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
      el.querySelectorAll('[data-z]').forEach(
        b =>
          (b.disabled =
            mode !== 'chart' ||
            (b.dataset.z === '-1' && zoom === 0) ||
            (b.dataset.z === '1' && zoom === ZOOMS.length - 1)),
      );
      laneBar.innerHTML = mode === 'chart' ? laneControls() : '';
      laneBar.hidden = !laneBar.innerHTML;
      const left = scrollEl.scrollLeft;
      scrollEl.innerHTML = mode === 'chart' ? chart() + undated() : list();
      scrollEl.scrollLeft = left;
      info.innerHTML = details();
    }
    /* collapse or expand a lane; focus goes to that lane's control in the lane bar (an expanded band no longer
       exists). Collapsing the lane of the selected record clears the selection rather than hiding it. */
    function toggleLane(id, fromBand) {
      if (collapsed.has(id)) collapsed.delete(id);
      else collapsed.add(id);
      if (sel && collapsed.has(id) && V.byId.get(sel) && V.byId.get(sel).lane === id) sel = null;
      render();
      const b = laneBar.querySelector('.tl-lt[data-lane-t="' + CSS.escape(id) + '"]');
      if (b) b.focus({ preventScroll: !fromBand });
      if (env.onChange) env.onChange();
    }
    function moveLane(id, dir) {
      const ids = arranged().map(l => l.id);
      const moved = TLM.moveLane(ids, id, dir);
      /* lanes hidden by the current gates keep their place after the visible ones */
      order = TLM.arrangeLanes(model.lanes, moved.concat(order)).map(l => l.id);
      render();
      const b = laneBar.querySelector('[data-lane="' + CSS.escape(id) + '"][data-lane-mv="' + dir + '"]');
      const alt = laneBar.querySelector('[data-lane="' + CSS.escape(id) + '"][data-lane-mv="' + -dir + '"]');
      const f = b && !b.disabled ? b : alt;
      if (f) f.focus();
      if (env.onChange) env.onChange();
    }
    /* pointer drag of a lane chip by its grip (mouse, pen or touch). Keyboard and switch users keep the ↑/↓
       buttons, which do the same thing one step at a time. The drop lands in the slot nearest the pointer. */
    let drag = null;
    function dragBoxes() {
      return [...laneBar.querySelectorAll('.tl-lb')];
    }
    function dragMark(to) {
      dragBoxes().forEach((b, k) => b.classList.toggle('tl-drop', k === to && to !== drag.from));
    }
    function endDrag(commit) {
      if (!drag) return;
      const d = drag;
      drag = null;
      dragBoxes().forEach(b => b.classList.remove('tl-drop', 'tl-drag'));
      laneBar.classList.remove('tl-dragging');
      if (!commit || d.to < 0 || d.to === d.from) return;
      const ids = arranged().map(l => l.id);
      const moved = TLM.dropLane(ids, d.id, d.to);
      order = TLM.arrangeLanes(model.lanes, moved.concat(order)).map(l => l.id);
      render();
      const b = laneBar.querySelector('.tl-lt[data-lane-t="' + CSS.escape(d.id) + '"]');
      if (b) b.focus({ preventScroll: true });
      if (env.onChange) env.onChange();
    }
    laneBar.addEventListener('pointerdown', e => {
      const g = e.target.closest('[data-lane-grip]');
      if (!g || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const boxes = dragBoxes();
      const from = boxes.findIndex(b => b.dataset.laneBox === g.dataset.laneGrip);
      if (from < 0) return;
      e.preventDefault();
      drag = { id: g.dataset.laneGrip, from, to: from, pid: e.pointerId };
      try {
        g.setPointerCapture(e.pointerId);
      } catch (err) {
        /* capture is best-effort; moves still arrive while the pointer is over the bar */
      }
      boxes[from].classList.add('tl-drag');
      laneBar.classList.add('tl-dragging');
    });
    laneBar.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.pid) return;
      /* the compact lane bar scrolls sideways: nudge it when the pointer nears either edge */
      const r = laneBar.getBoundingClientRect();
      if (laneBar.scrollWidth > laneBar.clientWidth) {
        if (e.clientX < r.left + 28) laneBar.scrollLeft -= 12;
        else if (e.clientX > r.right - 28) laneBar.scrollLeft += 12;
      }
      const boxes = dragBoxes().map(b => b.getBoundingClientRect());
      drag.to = TLM.nearestSlot(boxes, e.clientX, e.clientY);
      dragMark(drag.to);
    });
    laneBar.addEventListener('pointerup', e => {
      if (drag && e.pointerId === drag.pid) endDrag(true);
    });
    laneBar.addEventListener('pointercancel', e => {
      if (drag && e.pointerId === drag.pid) endDrag(false);
    });
    laneBar.addEventListener('lostpointercapture', e => {
      if (drag && e.pointerId === drag.pid) endDrag(true);
    });
    function pick(id) {
      sel = sel === id ? null : id;
      render();
      const t =
        scrollEl.querySelector('[data-id="' + CSS.escape(id) + '"]') ||
        el.querySelector('[data-id="' + CSS.escape(id) + '"]');
      if (t) t.focus({ preventScroll: true });
      else restoreFocus(null, null);
      if (env.onChange) env.onChange();
    }
    el.addEventListener('click', e => {
      const m = e.target.closest('[data-mode]');
      if (m) {
        mode = m.dataset.mode;
        render();
        return;
      }
      const z = e.target.closest('[data-z]');
      if (z) {
        zoom = z.dataset.z === '0' ? 0 : Math.max(0, Math.min(ZOOMS.length - 1, zoom + +z.dataset.z));
        render();
        return;
      }
      const lt = e.target.closest('[data-lane-t]');
      if (lt) {
        toggleLane(lt.dataset.laneT, lt.classList.contains('tl-sum'));
        return;
      }
      const mv = e.target.closest('[data-lane-mv]');
      if (mv) {
        if (!mv.disabled) moveLane(mv.dataset.lane, +mv.dataset.laneMv);
        return;
      }
      if (e.target.closest('[data-lanes="reset"]')) {
        order = defaultOrder.slice();
        collapsed.clear();
        render();
        const f = laneBar.querySelector('.tl-lt');
        if (f) f.focus();
        if (env.onChange) env.onChange();
        return;
      }
      const a = e.target.closest('[data-tl]');
      if (a) {
        if (a.dataset.tl === 'close') close();
        else {
          /* back to the overview: focus returns to the record that was selected, else the overview heading */
          const was = sel;
          sel = null;
          render();
          const t = was && scrollEl.querySelector('[data-id="' + CSS.escape(was) + '"]');
          if (t) t.focus({ preventScroll: true });
          else restoreFocus(null, null);
          if (env.onChange) env.onChange();
        }
        return;
      }
      const rf = e.target.closest('[data-tl-ref]');
      if (rf) {
        const id = rf.dataset.tlRef;
        close();
        if (env.openRef) env.openRef(id);
        return;
      }
      const it = e.target.closest('[data-id]');
      if (it) pick(it.dataset.id);
      else if (e.target === el) close();
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        close();
        return;
      }
      const sm = e.target.closest && e.target.closest('.tl-sum');
      if (sm && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleLane(sm.dataset.laneT, true);
        return;
      }
      const it = e.target.closest && e.target.closest('.tl-m');
      if (it && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        pick(it.dataset.id);
        return;
      }
      if (it && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const all = [...el.querySelectorAll('.tl-m')];
        const n = all[all.indexOf(it) + (e.key === 'ArrowDown' ? 1 : -1)];
        if (n) n.focus();
        return;
      }
      if (e.key === 'Tab') {
        const f = [...el.querySelectorAll('button,[tabindex="0"]')].filter(x => !x.disabled && x.offsetParent !== null);
        if (!f.length) return;
        const a = document.activeElement;
        if (f.indexOf(a) < 0) {
          /* focus is on a programmatic target (the tabindex=-1 Overview heading or scroll pane after a gate refresh):
             move to the neighbouring tabbable control inside the dialog ourselves, so Tab never walks out (TL-R03) */
          e.preventDefault();
          const after = f.filter(x => a.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING);
          const before = f.filter(x => a.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_PRECEDING);
          const t = e.shiftKey ? before[before.length - 1] || f[f.length - 1] : after[0] || f[0];
          t.focus();
          return;
        }
        if (e.shiftKey && a === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && a === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    });
    addEventListener('resize', () => {
      if (open && mode === 'chart') render();
    });

    function show(id) {
      if (!open) lastFocus = document.activeElement;
      open = true;
      el.hidden = false;
      compute();
      sel = TLM.revalidate(V, id || null);
      if (sel && V.byId.get(sel)) collapsed.delete(V.byId.get(sel).lane);
      render();
      const t = sel && el.querySelector('[data-id="' + CSS.escape(sel) + '"]');
      (t || el.querySelector('[data-tl="close"]')).focus({ preventScroll: !!t });
      if (t) t.scrollIntoView({ block: 'center', inline: 'center' });
      if (env.onChange) env.onChange();
    }
    function close() {
      if (!open) return;
      open = false;
      el.hidden = true;
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
      lastFocus = null;
      if (env.onChange) env.onChange();
    }
    return {
      model,
      show,
      close,
      refresh() {
        if (open) render();
      },
      get open() {
        return open;
      },
      get sel() {
        return sel;
      },
      /* URL params for the lane arrangement: tl=1 for the default order, else the order; tlc = collapsed lanes */
      get laneParams() {
        const o = order.join(',');
        return { tl: o === defaultOrder.join(',') ? '1' : o, tlc: [...collapsed].join(',') };
      },
      restore(hash) {
        compute();
        const st = TLM.parseState(hash, V, axis);
        /* tl=1 (or only unknown ids) means the default order, so a link always replaces the current order (TL-R05) */
        order = st.lanes ? TLM.arrangeLanes(model.lanes, st.lanes).map(l => l.id) : defaultOrder.slice();
        collapsed.clear();
        st.collapsed.forEach(x => collapsed.add(x));
        if (st.open) show(st.sel);
      },
    };
  }

  root.AtlasTimelineView = { createView };
})(typeof window !== 'undefined' ? window : globalThis);
