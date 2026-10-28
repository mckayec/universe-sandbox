/* Atlas tree relations (PACK_FORMAT section 21.1).
   Typed relations, uncertain dates and the "by relationship" outline for the branching tree in tree.js.
   Pure helpers only (no DOM), unit-tested in a vm context. Loaded by atlas/index.html before tree.js. */
(function (root) {
  'use strict';

  const ESC = (s) =>
    String(s == null ? '' : s).replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );

  /* The fixed vocabulary of relation families. A pack gives each link (and each node's parent link) one of
     these as `type`, and may keep its research's exact wording in `rel`, which is shown on hover and in the
     details. `up` is how the details panel names the relation seen from the child. */
  const FAMILIES = {
    branch: { name: 'Branch or development', up: 'Developed from', down: 'Developments' },
    within: { name: 'Within or member of', up: 'Within', down: 'Includes' },
    division: { name: 'Succession or division', up: 'Divided from', down: 'Divisions' },
    merger: { name: 'Merger', up: 'Formed by merging', down: 'Merged into' },
    overlap: { name: 'Overlap or cross-cutting', up: 'Overlaps', down: 'Overlaps' },
    contact: { name: 'Contact, comparison or influence', up: 'Contact', down: 'Contact' },
    history: { name: 'Separation and reconciliation', up: 'History with', down: 'History with' },
    context: { name: 'Historical context', up: 'Context', down: 'Context for' },
  };
  const ORDER = Object.keys(FAMILIES);

  /* a relation type → its family key; unknown or missing types fall back to `dflt` */
  function family(type, dflt) {
    const t = type == null ? '' : String(type);
    return FAMILIES[t] ? t : dflt || null;
  }

  /* Century and period wording is the pack's job (whenText); this only formats what the node carries:
     - undated: "No single founding date" (plus whenText when given)
     - emerge:  "Emerged c. 1501–1600" or the whenText ("Emerged: sixteenth century")
     - otherwise the normal year range. fmt(year, approx) formats one year. */
  function dateText(n, fmt, long) {
    if (!n) return '';
    const tail = n.ongoing ? (long ? ' – today' : ' –') : '';
    if (n.undated) return n.whenText ? n.whenText : 'No single founding date';
    if (n.sol != null && n.sol !== n.from) {
      const win = n.whenText || fmt(n.from) + ' – ' + fmt(n.sol);
      const end = !n.ongoing && n.to !== n.sol ? ' – ' + fmt(n.to) : '';
      return (long ? 'Emerged: ' : 'Emerged ') + win + end + tail;
    }
    const a = fmt(n.from, n.approx);
    const one = n.from === n.to || n.ongoing ? a : a + ' – ' + fmt(n.to);
    return (n.whenText && long ? n.whenText + ' (' + one + ')' : one) + tail;
  }

  /* the families a tree uses, in the fixed order (for the legend) */
  function used(T) {
    const s = new Set();
    T.nodes.forEach((n) => {
      if (n.parent) s.add(n.ptype);
      if (n.merge.length) s.add('merger');
    });
    T.links.forEach((l) => s.add(l.type));
    return ORDER.filter((k) => s.has(k));
  }

  /* a small key: one line per family the pack uses, drawn with the same stroke classes as the chart */
  function legend(T) {
    const fam = used(T);
    const dates = [];
    if (T.nodes.some((n) => n.sol != null && n.sol !== n.from)) dates.push(['ramp', 'Emerged over a period']);
    if (T.nodes.some((n) => n.undated)) dates.push(['und', 'No single founding date']);
    if (!fam.length && !dates.length) return '';
    const line = (k) =>
      '<svg width="34" height="10" aria-hidden="true"><path class="tr-key f-' + k + '" d="M2 5 H32"/></svg>';
    return (
      '<div class="tr-legend"><b>Key</b><ul>' +
      fam.map((k) => '<li>' + line(k) + ESC(FAMILIES[k].name) + '</li>').join('') +
      dates
        .map(
          (d) => '<li><svg width="34" height="10" aria-hidden="true"><rect class="tr-key k-' + d[0] + '" x="2" y="2" width="30" height="6" rx="3"/></svg>' + ESC(d[1]) + '</li>',
        )
        .join('') +
      '</ul></div>'
    );
  }

  /* every typed tie of a node, seen from that node: [{n, fam, rel, dir:'up'|'down'}] (parents and merges
     first, then children, then cross-links). V gives the visible tree; T the full one. */
  function ties(T, V, id) {
    const out = [];
    const n = T.by[id];
    if (!n || !V.ids.has(id)) return out;
    const p = V.parentOf[id];
    if (p && n.merge.indexOf(p) < 0) out.push({ n: T.by[p], fam: n.ptype, rel: n.prel, dir: 'up' });
    (V.mergeOf[id] || []).forEach((m) => out.push({ n: T.by[m], fam: 'merger', rel: n.prel, dir: 'up' }));
    (V.kids[id] || []).forEach((c) => {
      if (c.merge.indexOf(id) >= 0 || (V.mergeOf[c.id] || []).indexOf(id) >= 0) return;
      out.push({ n: c, fam: c.ptype, rel: c.prel, dir: 'down' });
    });
    V.nodes.forEach((c) => {
      if (c.id !== id && (V.mergeOf[c.id] || []).indexOf(id) >= 0)
        out.push({ n: c, fam: 'merger', rel: c.prel, dir: 'down' });
    });
    T.links.forEach((l) => {
      if (!V.ids.has(l.from) || !V.ids.has(l.to)) return;
      if (l.from === id) out.push({ n: T.by[l.to], fam: l.type, rel: l.label, dir: 'up' });
      else if (l.to === id) out.push({ n: T.by[l.from], fam: l.type, rel: l.label, dir: 'down' });
    });
    return out;
  }

  /* The "by relationship" view: an indented outline of every visible node (dated or not) under the node it
     is placed beneath, each with its typed ties. Collapsible with <details>; no horizontal scrolling.
     o = {sel, dim(node), fmt(year, approx)} */
  function outline(T, V, o) {
    o = o || {};
    const fmt = o.fmt || ((y) => String(y));
    /* a branch opens when the picked node is somewhere inside it */
    const holds = (n) => !!o.sel && (V.kids[n.id] || []).some((c) => c.id === o.sel || holds(c));
    const item = (n, depth) => {
      const kids = V.kids[n.id] || [];
      const t = ties(T, V, n.id).filter((x) => !(x.dir === 'down' && kids.indexOf(x.n) >= 0) && !(x.dir === 'up' && x.n.id === V.parentOf[n.id] && x.fam === 'branch' && !x.rel));
      const dim = o.dim && o.dim(n);
      const head =
        '<button class="tr-oi' +
        (n.id === o.sel ? ' sel' : '') +
        (dim ? ' dim' : '') +
        '" data-go="' +
        ESC(n.id) +
        '" aria-pressed="' +
        (n.id === o.sel) +
        '" style="--tc:' +
        ESC(n.col) +
        '"><span class="tr-od" aria-hidden="true"></span><b>' +
        ESC(n.name) +
        '</b><i>' +
        ESC(dateText(n, fmt, false)) +
        '</i>' +
        (n.kind ? '<em>' + ESC(n.kind) + '</em>' : '') +
        '</button>';
      const tieHtml = t.length
          ? '<span class="tr-oties">' +
            t
              .map(
                (x) =>
                  '<span class="tr-otie f-' +
                  x.fam +
                  '">' +
                  ESC((x.dir === 'up' ? FAMILIES[x.fam].up : FAMILIES[x.fam].down) + ': ' + x.n.name) +
                  (x.rel ? ' <i>(' + ESC(x.rel) + ')</i>' : '') +
                  '</span>',
              )
              .join('') +
            '</span>'
          : '';
      if (!kids.length) return '<li>' + head + tieHtml + '</li>';
      return (
        '<li><details' +
        (depth < 1 || o.openAll || holds(n) ? ' open' : '') +
        '><summary>' +
        head +
        '<span class="tr-ocount" title="' +
        kids.length +
        ' below">' +
        kids.length +
        '</span></summary>' +
        tieHtml +
        '<ul>' +
        kids.map((c) => item(c, depth + 1)).join('') +
        '</ul></details></li>'
      );
    };
    return '<ul class="tr-outline">' + (V.kids[''] || []).map((n) => item(n, 0)).join('') + '</ul>';
  }

  root.AtlasTreeRel = { FAMILIES, ORDER, family, dateText, used, legend, ties, outline };
})(typeof window !== 'undefined' ? window : globalThis);
