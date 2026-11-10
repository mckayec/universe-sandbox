#!/usr/bin/env node
'use strict';
/* COS-BB-001 key-2 exposure inventory (source inventory only; not an implementation test).
   Usage: node key2-exposure-inventory.cjs path/to/cosmere.js [key]
   Lists every record and field that becomes visible at numeric book key K (default 2) and its ancestor chain,
   plus records whose numeric bucket is earlier but carry K-keyed era overrides. Prints JSON. */
const fs = require('node:fs');
const vm = require('node:vm');
const file = process.argv[2];
const K = Number(process.argv[3] || 2);
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { timeout: 5000 });
const p = ctx.window.ATLAS_PACKS.cosmere;
const TEXT = ['name', 'short', 'status', 'desc', 'text', 'blurb', 'facts', 'aka', 'role', 'title', 'star', 'more'];
const fieldsOf = (o) => Object.keys(o).filter((k) => TEXT.includes(k) || k === 'gfx' || k === 'eras' || k === 'gate' || k === 'gates');
const firstOf = (o) => (o.first !== undefined ? o.first : o.book !== undefined ? o.book : Array.isArray(o.books) ? Math.min(...o.books) : null);
const out = { key: K, worlds: [], worldEras: [], sites: [], landmarks: [], events: [], codex: [], realms: [], routes: [], groupEras: [] };
const worlds = new Map(p.worlds.map((w) => [w.id, w]));
for (const w of p.worlds) {
  const f = firstOf(w);
  if (f === K) out.worlds.push({ id: w.id, group: w.group, fields: fieldsOf(w) });
  if (w.eras && w.eras[K]) out.worldEras.push({ id: w.id, worldFirst: f, fields: Object.keys(w.eras[K]) });
  for (const s of w.sites || []) {
    const sf = firstOf(s);
    if (sf === K || (sf === null && f === K)) out.sites.push({ id: s.id, world: w.id, worldFirst: f, own: sf, fields: fieldsOf(s) });
    for (const l of s.landmarks || (s.scene && s.scene.landmarks) || []) {
      const lf = firstOf(l);
      if (lf === K || (lf === null && (sf === K || (sf === null && f === K))))
        out.landmarks.push({ id: l.id, site: s.id, world: w.id, own: lf, fields: fieldsOf(l) });
    }
  }
  for (const l of w.landmarks || []) {
    const lf = firstOf(l);
    if (lf === K || (lf === null && f === K)) out.landmarks.push({ id: l.id, world: w.id, own: lf, fields: fieldsOf(l) });
  }
}
for (const g of p.groups || []) if (g.eras && g.eras[K]) out.groupEras.push({ id: g.id, fields: Object.keys(g.eras[K]) });
for (const e of p.events || []) if (e.book === K) {
  const anc = [];
  if (e.world) anc.push('world:' + e.world + '(first ' + (worlds.has(e.world) ? firstOf(worlds.get(e.world)) : '?') + ')');
  if (e.site) anc.push('site:' + e.site);
  if (e.lm) anc.push('lm:' + e.lm);
  out.events.push({ id: e.id, title: e.title, ancestors: anc, fields: fieldsOf(e) });
}
for (const sec of p.codex || []) for (const c of sec.list || []) {
  const cf = firstOf(c);
  const more = Array.isArray(c.more) ? c.more.map((m, i) => ({ i, book: Array.isArray(m) ? m[0] : m.book })).filter((m) => m.book === K) : [];
  if (cf === K || more.length) out.codex.push({ section: sec.id, name: c.name, own: cf, moreAtK: more.map((m) => m.i), fields: fieldsOf(c) });
}
const realms = p.realms || {};
for (const [rk, rv] of Object.entries(realms)) {
  if (!rv || typeof rv !== 'object') continue;
  if (rv.first === K) out.realms.push({ realm: rk, id: 'realm', fields: fieldsOf(rv) });
  for (const r of rv.subastrals || []) if (firstOf(r) === K) out.realms.push({ realm: rk, id: r.world + ':' + r.name, fields: fieldsOf(r) });
}
for (const r of (p.galaxy && p.galaxy.links) || []) if (r.book === K) out.routes.push({ id: r.id, pairs: r.pairs });
out.carriedIntoK = p.worlds.filter((w) => firstOf(w) !== null && firstOf(w) < K && Array.isArray(w.books) && w.books.includes(K)).map((w) => w.id);
out.counts = Object.fromEntries(Object.entries(out).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length]));
out.registry = { works: p.spoilers && p.spoilers.works ? p.spoilers.works.length : 0, mode: p.spoilers && p.spoilers.mode };
console.log(JSON.stringify(out, null, 1));
