/* Timeline / source-vision crosswalk for the LDS standard works pack (supplementary checkpoint 40).
   Reads public/atlas/packs/lds-standard-works.js and writes timeline-source-vision.csv beside this folder:
   - every item that carries a numeric `when` (feeds the year filter) or an attributed `date` (text only),
     with the kind of date it is, so documentary, narrated, synthesis and site-period years stay distinct;
   - every Chronicle event without a year, with the reason its date stays out of the filter;
   - every event and codex card whose own wording matches the vision keyword screen (candidate discovery only), each
     with a semantic class from SEM below, plus every child of a vision family (a card whose key is a vision parent's
     key plus a number) carried by inheritance even when its own wording lacks the keyword (S40-C1);
   - every card in EXPLICIT below, included from its cited source rather than its display wording (VIS-R1, checkpoint
     53): lexical discovery is one input, not the whole membership rule, and no display keyword is added to a card.
   Fails if a dated item is not classified, if a keyword candidate has no semantic class, or if a vision family is
   unreconciled, so a new year or vision card cannot enter unexamined. The keyword screen is not exhaustive: a
   semantic class is a reading of the card's own built wording, not new evidence about the source.
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

/* Semantic classes for keyword candidates (S40-C1). The keyword screen only finds candidates; each is read here:
   vision-content: the record is about a vision or a part of one. vision-reception: an event pinned at the narrated
   place where a vision is received. vision-setting: a place named as a vision's setting or inside it.
   vision-participant: a person or figure the card names in a vision among other roles. vision-record: the
   recording or acceptance of a vision account. mixed: a vision is one part of a card about other things.
   theme: a topical/method card about visions. not-vision: the keyword appears only in a contrast, a category
   label or a See-also title; the card makes no vision claim of its own. */
const SEM = {
  'event:patmos-vision': 'vision-reception',
  'event:lehi-jerusalem': 'vision-reception',
  'event:vision-celestial-kingdom': 'vision-reception',
  'codex:Woods near the Smith home|pgp': 'vision-setting',
  'codex:PP09': 'vision-setting',
  'codex:First Vision account|dc': 'vision-content',
  'codex:First Vision account|pgp': 'vision-content',
  'codex:AE14': 'vision-content',
  'codex:PE01': 'vision-content',
  'codex:PC09': 'vision-setting',
  'codex:BXP01': ['not-vision', 'contrast only: distinct from the river in Lehi’s dream'],
  'codex:BMV-001-jerusalem-destruction-vision': 'vision-content',
  'codex:BMV-012-twelve-ministers-apostles-vision': 'vision-content',
  'codex:BMV-049-isaiah-29-comparison': [
    'not-vision',
    'keyword only in a safeguard: the comparison does not locate the chapter’s dream imagery as a vision scene',
  ],
  'codex:BMV-161-abraham-isaac-jacob-fellowship': [
    'not-vision',
    'keyword only in a safeguard: teaching about the hereafter, “not a vision, journey or genealogy”',
  ],
  'codex:BMV-011-nazareth-jerusalem-vision': 'vision-content',
  'codex:BMV-014-john-revelation-vision': 'vision-content',
  'codex:BMV-023-jerusalem-destruction-known': 'vision-content',
  'codex:BMV-038-isaiah-throne-vision': 'vision-content',
  'codex:BMV-202-three-disciples-john': ['not-vision', 'contrast only: “not John’s vision on Patmos”'],
  'codex:BMV-013-record-jews-gentiles-vision': 'vision-content',
  'codex:NTE-stephen': 'mixed',
  'codex:NTE-cornelius': 'mixed',
  'codex:NTC-love-discernment': ['not-vision', 'cross-reference to “vision texts”; the card is about 1 John 4'],
  'codex:NTC-seven-churches': ['not-vision', 'recipients of the letters; names the Patmos event only as scene-setting'],
  'codex:NTC-vision-sequence': 'vision-content',
  'codex:NTC-vision-sequence-01': 'vision-content',
  'codex:NTC-vision-sequence-15': 'vision-content',
  'codex:OHC-PROPHECY': 'theme',
  'codex:OTM-jerusalem': 'theme',
  'codex:OTM-assyria-region': 'mixed',
  'codex:OTM-chebar': 'vision-setting',
  'codex:OTM-ezekiel-valley-vision': 'vision-content',
  'codex:OTM-ezekiel-temple-vision': 'vision-content',
  'codex:OTM-ezekiel-restored-land': 'vision-content',
  'codex:OTM-temple-river-vision': 'vision-content',
  'codex:OTM-en-gedi': 'vision-setting',
  'codex:OTM-en-eglaim': 'vision-setting',
  'codex:OTM-hamath': 'mixed',
  'codex:OTM-j18-ezekiel-transport': 'vision-content',
  'codex:OTM-j19-departing-glory': 'vision-content',
  'codex:OTM-j22-temple-tour': 'vision-content',
  'codex:OTM-j22-temple-tour-40': 'vision-content',
  'codex:OTM-j22-temple-tour-43': 'vision-content',
  'codex:OTM-j23-healing-water': 'vision-content',
  'codex:OTM-r17-prince-vision': 'vision-content',
  'codex:OTM-c12-future-sanctuary': 'vision-content',
  'codex:OTW-p06-shushan-vision': 'vision-setting',
  'codex:OTW-p07-ulai': 'vision-setting',
  'codex:OTW-r02-zechariah-joshua': 'vision-participant',
  'codex:OTW-c04-vision-settings': 'theme',
  'codex:OTW-a12-daniel-10-11-notes': 'vision-content',
  'codex:DCM-dp01-hiram': 'vision-setting',
  'codex:DCM-de02-kingdoms-of-glory': 'vision-content',
  'codex:DCM-de06-kirtland-dedication-vision': 'mixed',
  'codex:DCM-dr01-smith-rigdon': 'vision-participant',
  'codex:DCM-dr02-smith-cowdery': 'vision-participant',
  'codex:DCM-dr06-joseph-alvin': 'vision-participant',
  'codex:DCM-dx11-prophecy-vision-parable': 'theme',
  'codex:DCM-dx20-section-138': 'vision-content',
  'codex:DCM-dcp-alvin-smith': 'vision-participant',
  'codex:DCM-dcp-joseph-f-smith': 'vision-participant',
  'codex:DCM-dca-adam-eve': 'vision-participant',
  'codex:DCM-dca-abel-to-noah': 'vision-participant',
  'codex:DCM-dca-isaiah-ezekiel-daniel-malachi': 'vision-participant',
  'codex:DCM-dca-lucifer': 'vision-participant',
  'codex:DCM-de06b-kirtland-vision': 'vision-content',
  'codex:DCM-dd061-mcilwaines-bend': 'mixed',
  'codex:DCM-dd076-the-vision': 'vision-content',
  'codex:DCM-dd110-temple-vision': 'vision-content',
  'codex:DCM-dd137-alvin-vision': 'vision-content',
  'codex:DCM-dd138-redemption-of-dead': 'vision-content',
  'codex:PGM-qg01-moses-vision-purpose': 'vision-content',
  'codex:PGM-qg10-heavenly-order': 'vision-content',
  'codex:PGM-qg14-js-history-moves': 'mixed',
  'codex:AC03': 'vision-setting',
  'codex:RE15': 'vision-content',
  'codex:RE16': 'vision-record',
};
// Section cards whose only keyword hit is the See-also title “Prophecy, vision and parable” (or “… reported vision”).
for (const n of ['001-preface', '002-elijah', '007-john-ministry', '027-sacrament-gathering', '029-millennium',
  '045-mount-of-olives', '065-stone-of-daniel', '077-revelation-questions', '086-wheat-tares', '087-prophecy-war',
  '088-olive-leaf', '097-missouri-school', '098-renouncing-war', '101-jackson-expulsion', '107-priesthood-organization',
  '109-dedication-prayer', '113-isaiah-questions', '116-spring-hill', '133-appendix'])
  SEM['codex:DCM-dd' + n] = ['not-vision', 'keyword only in a See-also title; this card makes no vision claim (not a finding about the section)'];

/* Vision families: every child (parent key + '-' + number) inherits the parent's vision membership. Families whose
   parent is not a vision are listed so the reconciliation is explicit. */
const VISION_FAMILIES = {
  'NTC-vision-sequence': 'Revelation vision sequence',
  'OTM-j22-temple-tour': 'Ezekiel 40–48 temple vision',
};
// Source-grounded inclusions (VIS-R1, HANDOFF_PLAN 2026-11-03 bounded semantic dispositions): cards whose cited passage
// explicitly introduces a vision although their display wording lacks the screen's keywords and they are not a numbered
// family child. [class, source basis, note]. Each must exist, must not already be a keyword candidate (it would belong
// in SEM) and is checked below.
const EXPLICIT = {
  'codex:NTC-heavenly-experience': [
    'mixed',
    '2 Corinthians 12:1',
    'the cited passage opens with “visions and revelations of the Lord”; the card also carries the thorn, which is ' +
      'not diagnosed. Paul’s uncertainty about the body is kept; the fourteen years are relative wording, not a ' +
      'numeric year',
  ],
};
const NONVISION_FAMILIES = ['NTE-jerusalem-community', 'NTE-arrest-hearings'];

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

const src = it => ((it.src || [])[0] || {}).t || '';
const semOf = id => {
  const v = SEM[id];
  return v == null ? null : Array.isArray(v) ? v : [v, ''];
};

function main() {
  const p = loadPack();
  if (!p) throw new Error('pack not found');
  const rows = [];
  const missing = [];
  const unsem = [];
  const row = (id, kind, name, it, when, dateText, dateClass, kw, basis, vclass, disp) =>
    rows.push([id, kind, name, gate(it), src(it), when, dateText, dateClass, kw, basis, vclass, disp]);
  const vis = (id, kw) => {
    if (!kw) return ['', ''];
    const s = semOf(id);
    if (!s) unsem.push(id);
    return s || ['', ''];
  };
  const take = (id, kind, name, it) => {
    if (it.when == null && !it.date) return false;
    const c = CLASS[id];
    if (!c) missing.push(id);
    const kw = VISION.test((it.title || it.name || '') + ' ' + (it.text || it.desc || ''));
    const [vc, vnote] = vis(id, kw);
    row(id, kind, name, it, yr(it.when), it.date || '', c ? c[0] : '', kw ? 'yes' : '', kw ? 'keyword' : '', vc,
      (c ? c[1] : '') + (vnote ? '; ' + vnote : ''));
    return true;
  };
  for (const w of p.worlds) for (const s of w.sites || []) take('site:' + s.id, 'site', s.name, s);
  for (const w of p.worlds) for (const r of w.routes || []) take('route:' + r.id, 'route', r.name || r.title, r);
  for (const e of p.events) {
    if (take('event:' + e.id, 'event', e.title, e)) continue;
    const kw = VISION.test(e.title + ' ' + e.text);
    const [vc] = vis('event:' + e.id, kw);
    row('event:' + e.id, 'event', e.title, e, '', '', 'no-year', kw ? 'yes' : '', kw ? 'keyword' : '', vc,
      kw
        ? 'ancient/scriptural setting of reception at site ' +
          e.site +
          '; the text’s own dating stays in words, not in the filter; the vision’s content is not pinned'
        : 'ancient/scriptural narrative; any dating stays in the event text (e.g. regnal years), not in the filter');
  }
  const cards = p.codex.flatMap(sec => sec.list.map(e => [sec, e]));
  const keys = new Set(cards.map(([, e]) => e.key).filter(Boolean));
  const familyOf = k => {
    const m = /^(.*)-(\d+[a-z]?)$/.exec(k || '');
    return m && keys.has(m[1]) ? m[1] : null;
  };
  const famSeen = new Set();
  const explicitSeen = new Set();
  for (const [sec, e] of cards) {
    const lay = (e.layers || []).join('/');
    const id = 'codex:' + (e.key || e.name + '|' + lay);
    const fam = familyOf(e.key);
    if (fam) famSeen.add(fam);
    if (fam && !VISION_FAMILIES[fam] && !NONVISION_FAMILIES.includes(fam))
      throw new Error('unreconciled codex family: ' + fam);
    const inherited = fam && VISION_FAMILIES[fam];
    if (take(id, 'codex', e.name, e)) continue;
    const kw = VISION.test((e.name || '') + ' ' + (e.desc || ''));
    const explicit = EXPLICIT[id];
    if (explicit && kw) throw new Error('explicit inclusion is already a keyword candidate (move it to SEM): ' + id);
    if (explicit && inherited) throw new Error('explicit inclusion is already a family child: ' + id);
    if (explicit) {
      if (!src(e).startsWith(explicit[1].replace(/:.*/, ''))) throw new Error('explicit source not cited: ' + id);
      explicitSeen.add(id);
      row(id, 'codex:' + sec.id, e.name, e, '', '', 'no-year', '', 'source:' + explicit[1], explicit[0],
        'nonspatial card (' + explicit[2] + '): no coordinates, no year; retain ' + src(e) + ' and ' + gate(e) +
          ' gate');
      continue;
    }
    if (!kw && !inherited) continue;
    let [vc, vnote] = vis(id, kw);
    if (inherited) {
      if (kw && vc !== 'vision-content') throw new Error('family child not classed as vision content: ' + id);
      vc = 'vision-content';
    }
    const basis = (kw ? 'keyword' : '') + (inherited ? (kw ? '+' : '') + 'inherited:' + fam : '');
    const disp = inherited
      ? 'Part of the ' + inherited + '; scene content remains nonspatial and undated in the year filter; retain this' +
        ' child’s cited passage (' + src(e) + ') and ' + gate(e) + ' gate'
      : vc === 'not-vision'
        ? vnote + '; no coordinates, no year'
        : 'nonspatial card' + (vnote ? ' (' + vnote + ')' : '') + ': no coordinates, no year; links follow the See-also gates';
    row(id, 'codex:' + sec.id, e.name, e, '', '', 'no-year', kw ? 'yes' : '', basis, vc, disp);
  }
  for (const f of Object.keys(VISION_FAMILIES).concat(NONVISION_FAMILIES))
    if (!famSeen.has(f)) throw new Error('listed family not in the pack: ' + f);
  const unusedExplicit = Object.keys(EXPLICIT).filter(k => !explicitSeen.has(k));
  if (unusedExplicit.length) throw new Error('explicit inclusions not in the pack: ' + unusedExplicit.join(', '));
  if (missing.length) throw new Error('unclassified dated items: ' + missing.join(', '));
  if (unsem.length) throw new Error('keyword candidates without a semantic class: ' + unsem.join(', '));
  const unused = Object.keys(CLASS).filter(k => !rows.some(r => r[0] === k));
  if (unused.length) throw new Error('classified items not in the pack: ' + unused.join(', '));
  const unusedSem = Object.keys(SEM).filter(k => !rows.some(r => r[0] === k && r[8] === 'yes'));
  if (unusedSem.length) throw new Error('semantic classes for records that are not keyword candidates: ' + unusedSem.join(', '));
  const head = [
    'record',
    'kind',
    'name',
    'gate',
    'source',
    'filter_years',
    'date_text',
    'date_class',
    'vision_keyword',
    'vision_basis',
    'vision_class',
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
  const classes = [...new Set(rows.map(r => r[10]).filter(Boolean))].sort();
  console.log(
    JSON.stringify({
      rows: rows.length,
      filterYears: count(r => r[5] !== ''),
      textDates: count(r => r[5] === '' && r[6] !== ''),
      byClass: ['documentary', 'narrated', 'synthesis', 'site-period', 'no-year']
        .map(c => c + ':' + count(r => r[7] === c))
        .join(' '),
      keywordCandidates: count(r => r[8] === 'yes'),
      inheritedOnly: count(r => r[8] !== 'yes' && r[9].startsWith('inherited:')),
      sourceOnly: count(r => r[9].startsWith('source:')),
      visionClasses: classes.map(c => c + ':' + count(r => r[10] === c)).join(' '),
      visionClassWithYear: count(r => r[10] && r[10] !== 'not-vision' && r[5] !== ''),
    }),
  );
}
main();
