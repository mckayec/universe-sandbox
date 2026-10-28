// Atlas pack validator: loads every pack in public/atlas/packs/ in a Node vm sandbox and cross-checks it against
// docs/atlas/PACK_FORMAT.md (ids, references, books, spoiler ordering, gfx, sites). Adapted from the 2026 audit's validate.js.
// validatePacks() returns {file: {stats, issues, warn}}; tests/atlas-packs.test.ts fails on any issue.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const PACK_DIR = new URL('../public/atlas/packs/', import.meta.url).pathname;
const FEAT_MAX = 18; // matches FEAT_MAX in public/atlas/engine.js
// relation families for tree links and parent links; matches FAMILIES in public/atlas/tree-rel.js
export const TREE_FAMILIES = ['branch', 'within', 'division', 'merger', 'overlap', 'contact', 'history', 'context'];
// the years a tree node spans for ordering checks: when, or the emergence window; none when undated
function treeYears(n) {
  if (!n || n.undated) return [];
  if (n.emerge != null) return [].concat(n.emerge);
  return n.when == null ? [] : [].concat(n.when);
}

export function loadRegistry(dir = PACK_DIR) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(dir, 'registry.js'), 'utf8'), ctx);
  return ctx.window.ATLAS_REGISTRY || [];
}

export function validatePacks(dir = PACK_DIR) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'registry.js');
  const REG = loadRegistry(dir);
  const DIR = dir;
  const out = {};
  const TYPES = 'terran ocean archipelago desert forest ice gas city barren lava hive toxic dyson'.split(' ');
  const FK = 'continent range biome basin peak river'.split(' ');
  const TOP =
    'id meta theme books spoilers ui intro groups worlds events codex galaxy legend hooks realms layers timeline start tree'.split(
      ' ',
    );
  const finite = v => typeof v === 'number' && isFinite(v);
  for (const f of files) {
    const issues = [],
      warn = [],
      stats = {};
    const ctx = { window: {}, console };
    ctx.window.window = ctx.window;
    vm.createContext(ctx);
    try {
      vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), ctx, { filename: f });
    } catch (e) {
      out[f] = { error: 'LOAD ERROR: ' + e.message };
      continue;
    }
    const packs = ctx.window.ATLAS_PACKS || {};
    const keys = Object.keys(packs);
    const id = f.replace(/\.js$/, '');
    if (!packs[id]) issues.push(`file ${f} registers ${JSON.stringify(keys)}, not "${id}"`);
    const P = packs[id] || packs[keys[0]];
    if (!P) {
      out[f] = { error: 'no pack registered' };
      continue;
    }
    if (P.id !== id) warn.push(`pack.id=${P.id} != file id ${id}`);
    if (f !== '_template.js' && !REG.find(r => r.id === id)) issues.push('not in registry.js');
    Object.keys(P).forEach(k => {
      if (!TOP.includes(k)) warn.push(`unknown top-level key "${k}" (ignored by engine)`);
    });
    const books = P.books || {};
    const bookIds = Object.keys(books).map(Number);
    const okBook = b => books[b] != null;
    const worlds = P.worlds || [];
    stats.worlds = worlds.length;
    stats.events = (P.events || []).length;
    const wid = new Map();
    worlds.forEach((w, i) => {
      if (w.id == null) {
        issues.push(`world #${i} has no id`);
        return;
      }
      if (wid.has(w.id)) issues.push(`duplicate world id "${w.id}"`);
      wid.set(w.id, w);
      if (!/^[a-z0-9_-]+$/.test(w.id)) warn.push(`world id "${w.id}" not [a-z0-9_-]`);
    });
    const groups = new Set((P.groups || []).map(g => g.id));
    const gdup = (P.groups || []).map(g => g.id).filter((g, i, a) => a.indexOf(g) !== i);
    if (gdup.length) issues.push('duplicate group ids ' + gdup);
    (P.groups || []).forEach(g => {
      if (g.anchor && !wid.has(g.anchor)) issues.push(`group ${g.id}.anchor -> missing world ${g.anchor}`);
    });
    let siteTotal = 0,
      noSites = [],
      polar = [];
    worlds.forEach(w => {
      const tag = `world ${w.id}`;
      ['name', 'group', 'books', 'blurb', 'gfx'].forEach(k => {
        if (w[k] == null || w[k] === '') issues.push(`${tag}: missing required "${k}"`);
      });
      if (w.group && !groups.has(w.group))
        warn.push(`${tag}: group "${w.group}" not declared in groups[] (auto-created, appended at end of index)`);
      (w.books || []).forEach(b => {
        if (!okBook(b)) issues.push(`${tag}: books has unknown book ${b}`);
      });
      if (w.first != null && !okBook(w.first)) issues.push(`${tag}: first=${w.first} unknown book`);
      if (w.first != null && w.books && w.books.length && w.first > Math.min(...w.books))
        warn.push(`${tag}: first=${w.first} > min(books)=${Math.min(...w.books)}`);
      if (w.books && !w.books.length) warn.push(`${tag}: empty books[]`);
      // placement
      const pl = ['map', 'gal', 'at', 'pos3', 'dir'].filter(k => w[k] != null);
      if (w.star && w.star.ra != null) pl.push('star.ra');
      if (!pl.length && !(P.galaxy && P.galaxy.sectors && P.galaxy.sectors[w.group]))
        warn.push(`${tag}: no placement (falls back to Sol)`);
      if (pl.length > 1) warn.push(`${tag}: multiple placements ${pl} (engine precedence pos3>map>gal>at>star>dir)`);
      if (w.map && !w.map.slice(0, 2).every(finite)) issues.push(`${tag}: map not numeric ${JSON.stringify(w.map)}`);
      if (w.gal && !(finite(w.gal.l) && finite(w.gal.b))) issues.push(`${tag}: gal l/b not numeric`);
      if (w.star && w.star.ra != null && !(finite(w.star.ra) && finite(w.star.dec || 0)))
        issues.push(`${tag}: star ra/dec not numeric`);
      if (w.at) {
        if (!wid.has(w.at.of)) issues.push(`${tag}: at.of -> missing world "${w.at.of}" (falls back to Sol)`);
        if (w.at.of === w.id) issues.push(`${tag}: at.of self`);
      }
      if (w.realmAnchor && !wid.has(w.realmAnchor)) issues.push(`${tag}: realmAnchor -> missing ${w.realmAnchor}`);
      // gfx
      const checkGfx = (g, where) => {
        if (!g) return;
        if (g.type && !TYPES.includes(g.type))
          issues.push(`${where}: unknown gfx.type "${g.type}" (renders as terran)`);
        (g.feat || []).forEach((ft, i) => {
          if (!FK.includes(ft.k)) issues.push(`${where}: feat[${i}].k "${ft.k}" unknown (dropped)`);
          const pts = [ft.at, ft.from, ft.to].filter(Boolean);
          pts.forEach(p => {
            if (!(finite(p[0]) && finite(p[1])) || Math.abs(p[0]) > 90)
              issues.push(`${where}: feat[${i}] bad lat/lon ${JSON.stringify(p)}`);
          });
        });
        if ((g.feat || []).filter(ft => FK.includes(ft.k) && (ft.at || ft.from)).length > FEAT_MAX)
          issues.push(`${where}: ${g.feat.length} feat > ${FEAT_MAX} cap (extras dropped)`);
        if (g.pal && g.pal.length < 6) warn.push(`${where}: pal has ${g.pal.length} < 6 colours`);
        if (g.map) {
          const M = g.map;
          const chk = (arr, nm) =>
            (arr || []).forEach((q, i) => {
              const pts = q.line || q.poly || q;
              (pts || []).forEach(p => {
                if (!(finite(p[0]) && finite(p[1])) || Math.abs(p[0]) > 90)
                  issues.push(`${where}: map.${nm}[${i}] bad point ${JSON.stringify(p)}`);
              });
            });
          chk(M.land, 'land');
          chk(M.water, 'water');
          chk(M.ranges, 'ranges');
          chk(M.rivers, 'rivers');
          chk(M.regions, 'regions');
        }
      };
      checkGfx(w.gfx, tag);
      Object.keys(w.eras || {}).forEach(k => {
        if (!okBook(+k)) issues.push(`${tag}: eras key ${k} not a book`);
        checkGfx(w.eras[k].gfx, `${tag} eras[${k}]`);
      });
      (w.moons || []).forEach((m, i) => {
        checkGfx(m.gfx, `${tag} moon[${i}]`);
        const r = m.size || 0.18,
          d = m.dist || 2.4 + i * 1.1;
        if (d - r < 1.08)
          issues.push(`${tag}: moon[${i}] ${m.name} dist ${d} - size ${r} intersects planet/atmosphere`);
      });
      if (w.ring && w.ring.inner != null && w.ring.inner < 1.1)
        warn.push(`${tag}: ring.inner ${w.ring.inner} inside atmosphere`);
      if (w.hero && !(w.sites || []).find(s => s.id === w.hero)) issues.push(`${tag}: hero "${w.hero}" not a site`);
      const sids = new Set();
      (w.sites || []).forEach((s, i) => {
        const st = `${tag} site ${s.id}`;
        if (s.id == null) {
          issues.push(`${tag}: site #${i} no id`);
          return;
        }
        if (sids.has(s.id)) issues.push(`${tag}: duplicate site id ${s.id}`);
        sids.add(s.id);
        ['name', 'desc'].forEach(k => {
          if (!s[k]) issues.push(`${st}: missing ${k}`);
        });
        if (s.rel) {
          if (!(w.sites || []).find(x => x.id === s.rel.to))
            issues.push(`${st}: rel.to -> missing site "${s.rel.to}" (placed at 0,0)`);
        } else if (!(finite(s.lat) && finite(s.lon)))
          issues.push(`${st}: lat/lon not numeric (${s.lat},${s.lon}) -> placed at 0,0`);
        else {
          if (Math.abs(s.lat) > 90 || Math.abs(s.lon) > 180)
            issues.push(`${st}: lat/lon out of range ${s.lat},${s.lon}`);
          if (Math.abs(s.lat) >= 70) polar.push(`${w.id}/${s.id}@${s.lat}`);
        }
        (s.books || []).forEach(b => {
          if (!okBook(b)) issues.push(`${st}: unknown book ${b}`);
        });
        if (s.realm && !['physical', 'cognitive', 'spiritual'].includes(s.realm))
          issues.push(`${st}: bad realm ${s.realm}`);
      });
      siteTotal += (w.sites || []).length;
      if (!(w.sites || []).length) noSites.push(w.id);
    });
    stats.sites = siteTotal;
    stats.worldsWithoutSites = noSites;
    stats.polarSites = polar;
    // positions: compute map coordinates proximity duplicates
    const pos = worlds.filter(w => w.map).map(w => [w.id, w.map]);
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i][1],
          b = pos[j][1];
        if (a[0] === b[0] && a[1] === b[1] && (a[2] || 0) === (b[2] || 0))
          warn.push(`worlds ${pos[i][0]} and ${pos[j][0]} share identical map position ${JSON.stringify(a)}`);
      }
    // events
    const evid = new Set();
    (P.events || []).forEach((e, i) => {
      const t = `event ${e.id || '#' + i}`;
      if (e.id != null) {
        if (evid.has(e.id)) issues.push(`duplicate event id ${e.id}`);
        evid.add(e.id);
      } else warn.push(`event #${i} has no id`);
      if (!wid.has(e.world)) issues.push(`${t}: world -> missing "${e.world}" (event silently dropped)`);
      if (!okBook(e.book)) issues.push(`${t}: unknown book ${e.book} (silently dropped)`);
      if (e.site && wid.has(e.world) && !(wid.get(e.world).sites || []).find(s => s.id === e.site))
        issues.push(`${t}: site -> missing "${e.site}" on ${e.world}`);
      const w = wid.get(e.world);
      if (w && okBook(e.book)) {
        const fo = w.first || (w.books && w.books.length ? Math.min(...w.books) : 1);
        if (e.book < fo)
          issues.push(
            `${t}: book ${e.book} earlier than world ${w.id} first ${fo} (event on hidden world in cumulative mode)`,
          );
      }
      if (w && e.site) {
        const s = (w.sites || []).find(x => x.id === e.site);
        if (s && s.books && s.books.length && Math.min(...s.books) > e.book)
          warn.push(
            `${t}: site ${e.site} first book ${Math.min(...s.books)} > event book ${e.book} (pin hidden when event shown)`,
          );
        if (s && s.since && e.book < s.since) warn.push(`${t}: site ${s.id} since ${s.since} > event book`);
        if (s && s.until && e.book >= s.until) warn.push(`${t}: site ${s.id} until ${s.until} <= event book`);
      }
      if (!e.title) warn.push(`${t}: no title`);
    });
    // ui
    const U = P.ui || {};
    if (U.go && !wid.has(U.go.id)) issues.push(`ui.go.id -> missing world ${U.go.id}`);
    // codex
    (P.codex || []).forEach(t =>
      (t.list || []).forEach(x => {
        if (!x.name) issues.push(`codex ${t.id}: entry without name`);
        if (!x.desc) warn.push(`codex ${t.id}/${x.name}: no desc`);
        (x.books || []).forEach(b => {
          if (!okBook(b)) issues.push(`codex ${t.id}/${x.name}: unknown book ${b}`);
        });
      }),
    );
    // galaxy point specs
    const G = P.galaxy || {};
    const checkPoint = (p, where) => {
      if (p == null) return;
      if (typeof p === 'string') {
        if (!wid.has(p)) issues.push(`${where}: point -> missing world "${p}"`);
        return;
      }
      if (p.world != null && !wid.has(p.world)) issues.push(`${where}: point.world -> missing "${p.world}"`);
      if (p.sat && !['lmc', 'smc', 'andromeda', 'core'].includes(p.sat)) issues.push(`${where}: unknown sat ${p.sat}`);
      const known = ['world', 'map', 'xyz', 'sol', 'gal', 'lb', 'sat', 'arm'];
      if (!known.some(k => p[k] != null))
        issues.push(`${where}: point spec has none of ${known} -> ${JSON.stringify(p)}`);
    };
    (G.links || []).forEach((L, i) => {
      const w = `link ${L.id || i}`;
      if (L.id == null) warn.push(`link #${i} no id`);
      (L.path || []).forEach(p => checkPoint(p, w));
      (L.pairs || []).forEach(pr => pr.forEach(p => checkPoint(p, w)));
      if (L.network) {
        if (L.network.hub && !wid.has(L.network.hub)) issues.push(`${w}: network.hub missing ${L.network.hub}`);
        const fl = L.network.flag || 'web';
        const n = worlds.filter(x => x[fl]).length;
        if (n < 2) issues.push(`${w}: network flag "${fl}" matches ${n} worlds`);
      }
      if (!L.path && !L.pairs && !L.network) issues.push(`${w}: no geometry`);
      if (L.book != null && !okBook(L.book)) issues.push(`${w}: unknown book ${L.book}`);
      (L.books || []).forEach(b => {
        if (!okBook(b)) issues.push(`${w}: unknown book ${b}`);
      });
      // path through worlds first-seen later than link book (spoiler)
      if (L.book != null)
        (L.path || []).forEach(p => {
          const id = typeof p === 'string' ? p : p && p.world;
          const x = wid.get(id);
          if (x) {
            const fo = x.first || Math.min(...(x.books || [1]));
            if (fo > L.book)
              warn.push(`${w} (book ${L.book}) passes through ${id} first seen in book ${fo} (spoiler line)`);
          }
        });
    });
    const lids = (G.links || []).map(l => l.id).filter(Boolean);
    const ld = lids.filter((x, i) => lids.indexOf(x) !== i);
    if (ld.length) issues.push('duplicate link ids ' + ld);
    (G.labels || []).forEach((l, i) => checkPoint(l.at, `galaxy.labels[${i}] ${l.text || ''}`));
    (G.glows || []).forEach((l, i) => checkPoint(l.at, `galaxy.glows[${i}]`));
    if (G.home) checkPoint(G.home.at, 'galaxy.home');
    if (G.homeMob) checkPoint(G.homeMob.at, 'galaxy.homeMob');
    if (G.overview) checkPoint(G.overview.at, 'galaxy.overview');
    if (G.localField && G.localField.at) checkPoint(G.localField.at, 'galaxy.localField');
    // realms
    if (P.realms) {
      const R = P.realms;
      checkPoint(R.center, 'realms.center');
      const sh = new Set(((R.spiritual || {}).shards || []).map(s => s.id));
      ((R.cognitive || {}).subastrals || []).forEach(s => {
        if (!wid.has(s.world)) issues.push(`realms.cognitive.subastrals -> missing world ${s.world}`);
      });
      ((R.cognitive || {}).perps || []).forEach(s => {
        if (!wid.has(s.world)) issues.push(`realms.cognitive.perps -> missing world ${s.world}`);
      });
      worlds.forEach(w => {
        const own = (w.realms && w.realms.spiritual && w.realms.spiritual.shards) || w.spirit;
        (own || []).forEach(id => {
          if (!sh.has(id)) issues.push(`world ${w.id} spirit -> missing shard ${id}`);
        });
      });
      (P.groups || []).forEach(g =>
        (g.spirit || []).forEach(id => {
          if (!sh.has(id)) issues.push(`group ${g.id} spirit -> missing shard ${id}`);
        }),
      );
      const nonPhysOnly = worlds.filter(w => w.realm && w.realm !== 'physical');
      stats.realmOnlyWorlds = nonPhysOnly.map(w => w.id + ':' + w.realm);
      // events on realm-only sites
      (P.events || []).forEach(e => {
        const w = wid.get(e.world);
        if (!w) return;
        if (w.realm && w.realm !== 'physical') warn.push(`event ${e.id} on realm-only world ${w.id} (${w.realm})`);
      });
    }
    // layers, timeline and start view (PACK_FORMAT 20)
    {
      const lids = new Set();
      (P.layers || []).forEach((l, i) => {
        if (!l || l.id == null || !/^[a-z0-9_-]+$/.test(String(l.id)))
          issues.push(`layers[${i}] needs an id of [a-z0-9_-]`);
        else if (lids.has(String(l.id))) issues.push(`duplicate layer id "${l.id}"`);
        else lids.add(String(l.id));
      });
      const items = [];
      worlds.forEach(w => {
        items.push([`world ${w.id}`, w]);
        (w.sites || []).forEach(s => items.push([`world ${w.id} site ${s.id}`, s]));
      });
      (P.events || []).forEach(e => items.push([`event ${e.id}`, e]));
      ((P.galaxy && P.galaxy.links) || []).forEach(l => items.push([`link ${l && l.id}`, l]));
      items.forEach(([tag, it]) => {
        if (!it) return;
        const ls = it.layers != null ? it.layers : it.layer;
        if (ls != null) {
          if (!lids.size) issues.push(`${tag}: has layers but the pack declares no layers[]`);
          [].concat(ls).forEach(id => {
            if (lids.size && !lids.has(String(id))) issues.push(`${tag}: unknown layer "${id}"`);
          });
        }
        if (it.when != null) {
          const ys = [].concat(it.when);
          if (!ys.length || ys.length > 2 || !ys.every(finite))
            issues.push(`${tag}: when must be a year or [from, to]`);
          else if (ys.includes(0)) issues.push(`${tag}: when uses year 0 (there is none: 1 BC is -1, AD 1 is 1)`);
          if (!P.timeline) warn.push(`${tag}: has when but the pack has no timeline (no year filter is shown)`);
        }
        if (it.notes != null && !Array.isArray(it.notes)) issues.push(`${tag}: notes must be an array of {k, t, ref}`);
      });
      const T = P.timeline;
      if (T) {
        if ((T.min != null && !finite(T.min)) || (T.max != null && !finite(T.max)))
          issues.push('timeline min/max not numeric');
        (T.eras || []).forEach((e, i) => {
          if (!e || !e.name || !finite(e.from) || !finite(e.to))
            issues.push(`timeline.eras[${i}] needs name, from and to`);
        });
      }
      // family tree (PACK_FORMAT 21)
      if (P.tree) {
        const nodes = Array.isArray(P.tree.nodes) ? P.tree.nodes : [];
        if (!nodes.length) issues.push('tree.nodes must be a non-empty array');
        const nid = new Map();
        nodes.forEach((n, i) => {
          if (!n || n.id == null || !/^[a-z0-9_-]+$/.test(String(n.id)))
            issues.push(`tree.nodes[${i}] needs an id of [a-z0-9_-]`);
          else if (nid.has(String(n.id))) issues.push(`duplicate tree node "${n.id}"`);
          else nid.set(String(n.id), n);
        });
        nid.forEach((n, id) => {
          const tag = `tree node ${id}`;
          if (!n.name) issues.push(`${tag}: needs a name`);
          // dates: `when`, an uncertain `emerge:[a, b]` window, or `undated:true` (PACK_FORMAT 21.1)
          const ys = treeYears(n);
          const kinds = [n.when != null, n.emerge != null, !!n.undated].filter(Boolean).length;
          if (kinds > 1) issues.push(`${tag}: use one of when, emerge or undated`);
          if (n.undated) {
            if (n.until != null) issues.push(`${tag}: an undated node cannot have until`);
          } else if (n.emerge != null) {
            const e = Array.isArray(n.emerge) ? n.emerge : [];
            if (e.length !== 2 || !e.every(finite) || e[0] > e[1])
              issues.push(`${tag}: emerge must be [earliest, latest] years`);
            else if (e.includes(0) || n.until === 0) issues.push(`${tag}: emerge uses year 0`);
            if (n.until != null && (!finite(n.until) || (e.length === 2 && n.until < e[1])))
              issues.push(`${tag}: until must be a year after the emergence window`);
            if (!n.whenText) warn.push(`${tag}: emerge without whenText (show the source's own wording)`);
          } else if (!ys.length || ys.length > 2 || !ys.every(finite))
            issues.push(`${tag}: when must be a year or [from, to] (or use emerge / undated)`);
          else if (ys.includes(0)) issues.push(`${tag}: when uses year 0 (there is none: 1 BC is -1, AD 1 is 1)`);
          if (n.parent != null && !nid.has(String(n.parent)))
            issues.push(`${tag}: parent -> missing node "${n.parent}"`);
          if (n.parentType != null && !TREE_FAMILIES.includes(String(n.parentType)))
            issues.push(`${tag}: parentType "${n.parentType}" is not one of ${TREE_FAMILIES.join(', ')}`);
          if (n.parentType != null && n.parent == null) warn.push(`${tag}: parentType without a parent`);
          [].concat(n.merge || []).forEach(m => {
            if (!nid.has(String(m))) issues.push(`${tag}: merge -> missing node "${m}"`);
            else if (String(m) === id) issues.push(`${tag}: merges with itself`);
          });
          if (n.merge != null && [].concat(n.merge).length < 2 && n.parent == null)
            warn.push(`${tag}: merge lists fewer than two predecessors`);
          if (n.notSame != null && !Array.isArray(n.notSame))
            issues.push(`${tag}: notSame must be an array of {id, t}`);
          (Array.isArray(n.notSame) ? n.notSame : []).forEach((x, j) => {
            if (!x || (!x.t && x.id == null)) issues.push(`${tag}: notSame[${j}] needs t (and optionally id)`);
            else if (x.id != null && !nid.has(String(x.id)))
              issues.push(`${tag}: notSame[${j}] -> missing node "${x.id}"`);
          });
          [].concat(n.also || []).forEach(a => {
            if (!nid.has(String(a))) issues.push(`${tag}: also -> missing node "${a}"`);
          });
          const ls = n.layers != null ? n.layers : n.layer;
          [].concat(ls == null ? [] : ls).forEach(l => {
            if (!lids.has(String(l))) issues.push(`${tag}: unknown layer "${l}"`);
          });
          if (n.notes != null && !Array.isArray(n.notes)) issues.push(`${tag}: notes must be an array of {k, t, ref}`);
          const places = [].concat(n.site == null ? [] : n.site, n.sites || []);
          if (places.length && n.world == null) issues.push(`${tag}: site/sites need a world`);
          if (n.world != null) {
            const w = wid.get(n.world);
            if (!w) issues.push(`${tag}: world -> missing world "${n.world}"`);
            else
              places.forEach(sid => {
                if (!(w.sites || []).find(x => x.id === sid))
                  issues.push(`${tag}: site -> missing site "${sid}" on ${w.id}`);
              });
          }
          // a branch should not begin before the tradition it came from
          const p = n.parent != null && nid.get(String(n.parent));
          const py = p ? treeYears(p) : [];
          if (p && ys.length && py.length && ys.every(finite) && py.every(finite) && Math.min(...ys) < Math.min(...py))
            warn.push(`${tag}: begins before its parent ${p.id}`);
        });
        // no loops through parent
        nid.forEach((n, id) => {
          const seen = new Set([id]);
          let p = n.parent != null ? String(n.parent) : null;
          while (p && nid.has(p)) {
            if (seen.has(p)) {
              issues.push(`tree node ${id}: parent chain loops`);
              break;
            }
            seen.add(p);
            p = nid.get(p).parent != null ? String(nid.get(p).parent) : null;
          }
        });
        // merge chains must not loop either
        nid.forEach((n, id) => {
          const seen = new Set();
          const stack = [].concat(n.merge || []).map(String);
          while (stack.length) {
            const m = stack.pop();
            if (m === id) {
              issues.push(`tree node ${id}: merge chain loops`);
              break;
            }
            if (seen.has(m) || !nid.has(m)) continue;
            seen.add(m);
            const q = nid.get(m);
            if (q.parent != null) stack.push(String(q.parent));
            [].concat(q.merge || []).forEach(x => stack.push(String(x)));
          }
        });
        if (P.tree.view != null && !['date', 'relationship'].includes(P.tree.view))
          issues.push(`tree.view must be "date" or "relationship"`);
        (P.tree.links || []).forEach((l, i) => {
          if (!l || !nid.has(String(l.from)) || !nid.has(String(l.to)))
            issues.push(`tree.links[${i}] needs from and to node ids`);
          if (l && l.type != null && !TREE_FAMILIES.includes(String(l.type)))
            issues.push(`tree.links[${i}]: type "${l.type}" is not one of ${TREE_FAMILIES.join(', ')}`);
          if (l && l.when === 0) issues.push(`tree.links[${i}]: when uses year 0`);
        });
      }
      if (P.start) {
        if (!wid.has(P.start.world)) issues.push(`start.world -> missing world "${P.start.world}"`);
        else if (P.start.site && !(wid.get(P.start.world).sites || []).find(x => x.id === P.start.site))
          issues.push(`start.site -> missing site "${P.start.site}"`);
      }
    }
    out[f] = { stats, issues, warn };
  }
  return out;
}
