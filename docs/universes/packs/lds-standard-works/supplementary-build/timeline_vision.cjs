/* Timeline / source-vision crosswalk for the LDS standard works pack (supplementary checkpoint 40).
   Reads public/atlas/packs/lds-standard-works.js and writes timeline-source-vision.csv beside this folder:
   - every item that carries a numeric `when` (feeds the year filter) or an attributed `date` (text only),
     with the kind of date it is, so documentary, narrated, synthesis and site-period years stay distinct;
   - every Chronicle event without a year, with the reason its date stays out of the filter;
   - every event and codex card whose own wording is visionary, with how it is represented.
   Fails if a dated item is not classified below, so a new year cannot enter the filter unexamined.
   Usage: node supplementary-build/timeline_vision.cjs  (from docs/universes/packs/lds-standard-works) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const here = __dirname;
const root = path.resolve(here, '../../../../..');
const packFile = path.join(root, 'public/atlas/packs/lds-standard-works.js');
const outFile = path.join(here, '..', 'timeline-source-vision.csv');

function loadPack() {
  const ctx = { window: {} };
  ctx.self = ctx.window;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(packFile, 'utf8'), ctx);
  const w = ctx.window;
  const all = Object.values(w.ATLAS_PACKS || {}).concat(Object.values(w));
  return all.find(x => x && x.id === 'lds-standard-works' && x.worlds);
}

/* Date classes. documentary: the date comes from a dated revelation, prayer or record heading.
   narrated: the year is the one an account reports for what it describes (the account itself is later).
   synthesis: a historical/archival synthesis supplies the date. site-period: a place's filter years
   (the years the atlas's dated events or routes there belong to), not a dated occurrence. */
const CLASS = {
  // sites (filter years for the place)
  'site:winter-quarters': ['site-period', 'camp years of the Winter Quarters events (1846 camp, 1847 departure)'],
  'site:independence': ['site-period', 'year of the D&C 57 designation event'],
  'site:kirtland-temple': ['site-period', 'year of the D&C 109 and D&C 137 events'],
  'site:nauvoo': ['site-period', 'Nauvoo settlement to departure years of the events there'],
  'site:carthage-jail': [
    'site-period',
    'year of the deaths D&C 135 reports at the jail (place note; no separate Chronicle event)',
  ],
  'site:harmony': ['site-period', 'year of the Aaronic Priesthood account'],
  'site:palmyra': ['site-period', 'year of the first-edition availability event'],
  'site:salt-lake-temple': [
    'site-period',
    'year of the Official Declaration 2 event; not the building’s construction dates',
  ],
  'site:garden-grove': [
    'site-period',
    'year of the 1846 settlement its note describes; marker is the modern town, not the camp',
  ],
  'site:mount-pisgah': ['site-period', 'year of the 1846 Iowa camps on the iowa-migration route'],
  'site:chimney-rock': ['site-period', 'year of the 1847 journey route that passes it'],
  'site:fort-bridger': ['site-period', 'year of the 1847 journey route that passes it'],
  // routes
  'route:dictation-move': [
    'synthesis',
    'June 1829 move to the Whitmer home (documentary history); no day-by-day itinerary',
  ],
  'route:iowa-migration': ['synthesis', '1846 crossing of Iowa; first departures dated, not every family’s'],
  'route:valley-migration': ['synthesis', '1847 pioneer company journey; later companies separate'],
  // events
  'event:winter-quarters-camp': ['synthesis', 'autumn 1846 settlement (historical synthesis)'],
  'event:dc136-camp-instructions': ['documentary', 'D&C 136 heading date, January 14, 1847'],
  'event:departure-winter-quarters': ['synthesis', 'first group’s April 5, 1847 departure; later companies separate'],
  'event:aaronic-priesthood-account': [
    'narrated',
    'year reported in Joseph Smith’s history (JS—H 1:68–72; D&C 13 heading)',
  ],
  'event:translation-fayette': ['synthesis', 'June 1829 final dictation phase (documentary history)'],
  'event:book-mormon-publication': ['synthesis', 'copies available by the end of March 1830'],
  'event:organization': ['documentary', 'April 6, 1830 (D&C 20–21 context); place per documentary editors'],
  'event:zion-designation': ['documentary', 'D&C 57 heading date, July 20, 1831'],
  'event:vision-celestial-kingdom': [
    'documentary',
    'D&C 137 heading date, January 21, 1836 (date the vision was recorded)',
  ],
  'event:kirtland-dedication': ['documentary', 'D&C 109 heading date, March 27, 1836'],
  'event:nauvoo-revelation': ['documentary', 'D&C 124 heading date, January 19, 1841'],
  'event:departure-nauvoo': ['synthesis', 'first wagons February 4, 1846; not every family’s departure'],
  'event:1978-temple-confirmation': [
    'documentary',
    'Official Declaration 2 heading reports June 1, 1978; announcement and sustaining dated separately',
  ],
  // codex cards with a year or an attributed date
  'codex:First Vision account|dc': [
    'narrated',
    'D&C introduction reports spring 1820; shown as “spring 1820, as narrated”',
  ],
  'codex:First Vision account|pgp': [
    'narrated',
    'JS—H 1:14 narrates early spring 1820; shown as “spring 1820, as narrated”',
  ],
  'codex:RE02': ['narrated', 'date as reported in Joseph Smith’s history; text only, not in the filter'],
  'codex:RE05': ['synthesis', 'archival order date; text only, not in the filter'],
  'codex:RE06': ['synthesis', 'documentary historical span; text only, not in the filter'],
  'codex:RE07': ['documentary', 'dates of the two Liberty letters; text only; not the imprisonment span'],
  'codex:RE13': ['synthesis', 'NPS historical synthesis; text only, not in the filter'],
};

const VISION = /\bvisions?\b|\bvisionary\b|\bdreams?\b|\bdreamed\b/i;
const q = s => {
  const t = s == null ? '' : String(s);
  return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};
const gate = it => {
  const L = (it.layers || (it.layer ? [it.layer] : [])).join('/');
  const b = it.book || it.first || (it.books || []).join('/');
  return (b ? b + '/' : '') + (L || 'all');
};
const yr = w => (w == null ? '' : Array.isArray(w) ? w.join('–') : String(w));

function main() {
  const p = loadPack();
  if (!p) throw new Error('pack not found');
  const rows = [];
  const missing = [];
  const take = (id, kind, name, it) => {
    if (it.when == null && !it.date) return false;
    const c = CLASS[id];
    if (!c) missing.push(id);
    rows.push([
      id,
      kind,
      name,
      gate(it),
      yr(it.when),
      it.date || '',
      c ? c[0] : '',
      VISION.test((it.title || it.name || '') + ' ' + (it.text || it.desc || '')) ? 'yes' : '',
      c ? c[1] : '',
    ]);
    return true;
  };
  for (const w of p.worlds) for (const s of w.sites || []) take('site:' + s.id, 'site', s.name, s);
  for (const w of p.worlds) for (const r of w.routes || []) take('route:' + r.id, 'route', r.name || r.title, r);
  for (const e of p.events) {
    if (take('event:' + e.id, 'event', e.title, e)) continue;
    const vis = VISION.test(e.title + ' ' + e.text);
    rows.push([
      'event:' + e.id,
      'event',
      e.title,
      gate(e),
      '',
      '',
      'no-year',
      vis ? 'yes' : '',
      vis
        ? 'ancient/scriptural setting of reception at site ' +
          e.site +
          '; the text’s own dating stays in words, not in the filter; the vision’s content is not pinned'
        : 'ancient/scriptural narrative; any dating stays in the event text (e.g. regnal years), not in the filter',
    ]);
  }
  for (const sec of p.codex)
    for (const e of sec.list) {
      const lay = (e.layers || []).join('/');
      const id = 'codex:' + (e.key || e.name + '|' + lay);
      if (take(id, 'codex', e.name, e)) continue;
      if (!VISION.test((e.name || '') + ' ' + (e.desc || ''))) continue;
      rows.push([
        id,
        'codex:' + sec.id,
        e.name,
        gate(e),
        '',
        '',
        'no-year',
        'yes',
        'visionary wording on a nonspatial card: no coordinates, no year; links follow the See-also gates',
      ]);
    }
  if (missing.length) throw new Error('unclassified dated items: ' + missing.join(', '));
  const unused = Object.keys(CLASS).filter(k => !rows.some(r => r[0] === k));
  if (unused.length) throw new Error('classified items not in the pack: ' + unused.join(', '));
  const head = [
    'record',
    'kind',
    'name',
    'gate',
    'filter_years',
    'date_text',
    'date_class',
    'visionary',
    'disposition',
  ];
  fs.writeFileSync(
    outFile,
    [head]
      .concat(rows)
      .map(r => r.map(q).join(','))
      .join('\n') + '\n',
  );
  const count = f => rows.filter(f).length;
  console.log(
    JSON.stringify({
      rows: rows.length,
      filterYears: count(r => r[4] !== ''),
      textDates: count(r => r[4] === '' && r[5] !== ''),
      byClass: ['documentary', 'narrated', 'synthesis', 'site-period', 'no-year']
        .map(c => c + ':' + count(r => r[6] === c))
        .join(' '),
      visionary: count(r => r[7] === 'yes'),
      visionaryWithYear: count(r => r[7] === 'yes' && r[4] !== ''),
    }),
  );
}
main();
