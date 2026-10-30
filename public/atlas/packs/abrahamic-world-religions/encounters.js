/* Religious Traditions atlas — data part: Encounters and population estimates (PACK_FORMAT §1.1; read by
   ../abrahamic-world-religions.js).
   Research: docs/universes/packs/abrahamic-world-religions/comparative-evidence.md (XD01–07, XE01–06, XC01–04,
   XJ01) with comparative-record-audit.md, and the comparative rows of identity-and-edges.csv (AI210–AI250,
   AI292–AI301, AI322). Builder review: research-review.md (checkpoint 6).

   Rules followed here:
   * Encounters are contacts, not branches: no node here has a parent. Sikh and Bahá'í traditions are their own
     traditions (AI245, AI246); Buddhism, Daoism, Confucian thought, Zoroastrianism and Hindu philosophy appear
     only as the subjects of a sourced contact, with no internal history (AI244, AI247–AI250).
   * The crosswalk's Sikh and Bahá'í edges point to places and regions (AI295–AI298), not to other traditions, so
     no tradition-to-tradition tie is drawn for them; the places are named on the cards and events.
   * Ties that are drawn are `contact` (comparison, textual engagement), with the research's exact label.
   * Different kinds of date stay apart: 781 inscription vs 635 reported arrival; 1655 comparison vs 1657
     translation; 1844/1863 religious claims vs 1963 institution; 2020 measurement vs 2025 publication.
   * Population estimates are a codex list with the year and measure beside every number: no map shading,
     no totals, no current or denominational counts (research-review.md R7). */
((window.ATLAS_PACK_PARTS = window.ATLAS_PACK_PARTS || {})['abrahamic-world-religions'] =
  window.ATLAS_PACK_PARTS['abrahamic-world-religions'] || {}).encounters = function (h) {
  const SCH = h.SCH;
  const TRAD = h.TRAD;
  const SELF = h.SELF;
  const NOTE = (t) => ({ k: 'note', t });
  const ev = h.ev('enc');

  function enc(id, name, kind, whenText, blurb, notes) {
    return { id, name, kind, layers: ['enc'], world: 'earth', undated: true, ongoing: true, whenText, blurb, notes };
  }
  const SUBJECT = 'Not dated here: it appears only as the subject of a sourced contact';
  const NO_HISTORY = (what) =>
    NOTE('No internal ' + what + ' history was researched for this atlas. It appears only where a sourced contact names it; its absence elsewhere is not a judgment about it.');

  /* tree nodes (identity-and-edges.csv AI244–AI250) */
  const NODES = [
    enc(
      'sikh-tradition',
      'Sikh tradition',
      'tradition',
      'Begins with Guru Nanak’s teaching (Guru Nanak, 1469–1539)',
      'A distinct tradition beginning with the teaching of Guru Nanak, who engaged a Hindu and Muslim setting.',
      [
        SCH('The Pluralism Project presents Guru Nanak’s 1469–1539 life and his teaching as the beginning of a distinct Sikh tradition, engaging a Hindu and Muslim setting.'),
        TRAD('Traditional accounts of journeys with Mardana, and the Makkah episode, are tradition: no verified itinerary is drawn from the narrative alone.'),
        NOTE('Its own tradition, not a branch of Hinduism or Islam and not a two-parent denomination. Talwandi and Sultanpur are sourced settings in his life, listed as reference cards, not event pins.'),
      ],
    ),
    enc(
      'bahai-faith',
      'Bahá’í Faith',
      'tradition',
      'Origins traced to 1844; announcement 1863 (Bahá’í sources)',
      'Bahá’í sources trace the faith’s origins to the Báb’s 1844 announcement in Shiraz and identify Bahá’u’lláh as its founder.',
      [
        SELF('Bahá’í sources trace the faith’s origins to the Báb’s 1844 announcement in Shiraz and identify Bahá’u’lláh as founder. The forerunner and founder claims are the faith’s own.'),
        NOTE('Its historical religious context is not present membership in another religion: not shown as a branch or denomination of Islam.'),
        NOTE('Three different kinds of date: the 1844 and 1863 accounts are religious claims; the Universal House of Justice, first elected in 1963, is an institution (see the Chronicle).'),
      ],
    ),
    enc(
      'hindu-philosophy',
      'Hindu philosophy',
      'intellectual context',
      SUBJECT,
      'The scope of Dara Shikoh’s comparison with Islamic Sufism, not every Hindu tradition.',
      [NO_HISTORY('Hindu')],
    ),
    enc(
      'buddhism-reference',
      'Buddhism',
      'tradition (contact subject)',
      SUBJECT,
      'Named in two sourced contacts: an 845 prohibition described in a museum account, and Chinese Muslim writers’ use of Buddhist writings and expressions.',
      [NO_HISTORY('Buddhist')],
    ),
    enc(
      'daoism-reference',
      'Daoism',
      'tradition (contact subject)',
      SUBJECT,
      'Named in sourced textual contacts: Chinese Muslim writers’ use of Daoist writings and expressions.',
      [NO_HISTORY('Daoist')],
    ),
    enc(
      'confucian-reference',
      'Confucian tradition',
      'intellectual context',
      SUBJECT,
      'The intellectual setting of Liu Zhi’s and Wang Daiyu’s Islamic writing in Chinese. Not an Abrahamic denomination.',
      [NO_HISTORY('Confucian')],
    ),
    enc(
      'zoroastrian-reference',
      'Zoroastrianism',
      'tradition (contact subject)',
      SUBJECT,
      'Named with Christianity and Buddhism among the traditions affected by an 845 prohibition, in a museum account. Shared policy context only.',
      [NO_HISTORY('Zoroastrian')],
    ),
  ];

  /* typed ties (AI293/AI294, AI299–AI301): contact, never descent */
  const LINKS = [
    {
      from: 'hindu-philosophy',
      to: 'isc01',
      type: 'contact',
      rel: 'authored-comparison: Dara Shikoh’s Majmaʿ al-baḥrayn (1655). His interpretation, not doctrinal identity',
      when: 1655,
    },
    {
      from: 'islam',
      to: 'daoism-reference',
      type: 'contact',
      rel: 'scholarly-textual-contact (Liu Zhi, Wang Daiyu): neither religion descends from the other',
    },
    {
      from: 'islam',
      to: 'buddhism-reference',
      type: 'contact',
      rel: 'scholarly-textual-contact (Liu Zhi, Wang Daiyu): shared terminology or critique is not total agreement',
    },
    {
      from: 'islam',
      to: 'confucian-reference',
      type: 'contact',
      rel: 'scholarly-textual-contact: Sino-Islamic intellectual context, not institutional union',
    },
  ];

  /* Chronicle (XE01–XE06), in date order */
  const EVENTS = [
    ev(
      'XE01',
      'The Xi’an stele',
      'A stele erected in 781 records a Christian arrival at Xi’an in 635. The inscription’s date and the date of the arrival it reports are two different dates; no travel road is drawn.',
      { when: 781, whenText: 'Erected 781; reports an arrival in 635', ref: 'xian', layers: ['enc', 'chr'] },
    ),
    ev(
      'XE02',
      'An 845 prohibition',
      'A museum account places Christianity, Buddhism and Zoroastrianism among the traditions affected by Wuzong’s 845 prohibition. Shared policy, not descent or doctrinal equivalence.',
      { when: 845, whenText: '845', side: 'State policy · no single site', layers: ['enc', 'chr'] },
    ),
    ev(
      'XE03',
      'Dara Shikoh’s comparison',
      'Dara Shikoh’s Majmaʿ al-baḥrayn compares Hindu thought and Islamic Sufism. The unity he proposes is his interpretation, not the atlas’s verdict about all religions.',
      { when: 1655, whenText: '1655', ref: 'lahore', layers: ['enc', 'isl'] },
    ),
    ev(
      'XE04',
      'The Persian Upanishads',
      'A Persian rendering of 52 Upanishads was completed under Dara Shikoh with Brahman and pandit consultation. His own Sanskrit contribution is disputed. A translation, not a sign that Hinduism is a branch of Islam.',
      { when: 1657, whenText: '1657', ref: 'lahore', layers: ['enc', 'isl'] },
    ),
    ev(
      'XE05',
      'Bahá’u’lláh’s announcement',
      'The official Bahá’í history places Bahá’u’lláh’s announcement in Baghdad in 1863. A declared religious claim, not independently certified revelation.',
      { when: 1863, whenText: '1863 (official Bahá’í history)', ref: 'baghdad' },
    ),
    ev(
      'XE06',
      'The Universal House of Justice',
      'The Universal House of Justice was first elected in 1963, according to the official history: an institution, distinct from the 1844 and 1863 origin accounts.',
      { when: 1963, whenText: '1963', side: 'Institutional election · no place given' },
    ),
  ];

  /* journeys (XJ01): an ordered reference sequence, not a drawn route */
  const JOURNEYS = [
    {
      id: 'XJ01',
      name: 'Exile to Acre (official Bahá’í history)',
      role: 'Source-qualified sequence · Encounters',
      first: 1,
      layers: ['enc'],
      desc: 'The official history describes exile from Iran through Baghdad and onward confinement at Acre, reached in 1868. No intermediate port or exact path is added.' + h.JOURNEY_NOTE,
    },
  ];

  /* people (AI243) */
  const PEOPLE = [
    {
      id: 'dara-shikoh',
      name: 'Dara Shikoh',
      role: 'Author and translation patron · Encounters',
      first: 1,
      layers: ['enc', 'isl'],
      desc: 'Wrote Majmaʿ al-baḥrayn (1655), comparing Hindu thought and Islamic Sufism; a Persian rendering of 52 Upanishads was completed under him in 1657. His intellectual claims are his own interpretation; his individual Sanskrit contribution is disputed.',
    },
  ];

  /* encounter records (XC01–XC04): attributed statements, kept as cards */
  const C = (id, name, role, desc) => ({ id, name, role, first: 1, layers: ['enc'], desc });
  const ENCOUNTERS = [
    C('XC01', 'Guru Nanak and the Sikh tradition', 'Identity and encounter · Pluralism Project', 'The Pluralism Project presents Guru Nanak’s 1469–1539 life and his teaching as the beginning of a distinct Sikh tradition, engaging a Hindu and Muslim setting. Contextual engagement, not a two-parent denomination; the journey and Makkah accounts are labelled tradition.'),
    C('XC02', 'Bahá’í self-description', 'Self-description · official Bahá’í history', 'Bahá’í sources trace the faith’s origins to the Báb’s 1844 announcement in Shiraz and identify Bahá’u’lláh as founder. The claims are attributed; a historical religious context is not present membership in another religion.'),
    C('XC03', 'Liu Zhi’s integration', 'Scholarly interpretation · James Frankel', 'James Frankel describes Liu Zhi’s use of Daoist and Buddhist writings within an Islamic and Confucian intellectual project, in the early Qing period. Textual engagement, not institutional descent; Frankel also notes Liu’s criticism of those traditions. Nanjing is the biographical setting, not a meeting point.'),
    C('XC04', 'Wang Daiyu’s vocabulary', 'Scholarly interpretation · Kristian Petersen', 'Kristian Petersen describes Wang Daiyu’s Han Kitab writing (published 1642) as using Confucian, Daoist and Buddhist expressions to discuss Islam. A textual analysis, not evidence that Islam originated in Daoism.'),
  ];

  /* population estimates (XD01–XD07; X01–X03): year and measure beside every number, never summed */
  const EST = 'Pew estimate for 2020 (published June 2025)';
  const D = (id, name, figure, extra) => ({
    id,
    name,
    role: EST,
    first: 1,
    desc: figure + ' in 2020. A rounded estimate of religious identification, not a count of active practitioners.' + (extra ? ' ' + extra : ''),
  });
  const POPULATION = [
    {
      id: 'xd-about',
      name: 'About these estimates',
      role: 'Method · Pew Research Center (2025)',
      first: 1,
      desc: 'Pew’s June 2025 report estimates affiliation in 2020, not today. It codes identities into seven broad categories from more than 2,700 data sources; belief and practice can differ from identification, Chinese formal religious identification misses some practice, and its Jewish classification has country-specific limits. The figures are not added together, not shaded on the map, and say nothing about any denomination or about who is a legitimate believer.',
    },
    D('XD01', 'Christians', '2.3 billion, 28.8% of the world’s population,', 'Pew places 30.7% of Christians in sub-Saharan Africa and 22.3% in Europe.'),
    D('XD02', 'Muslims', '2.0 billion, 25.6% of the world’s population,', 'Asia-Pacific holds the largest number of Muslims, although Muslims are a minority in that region.'),
    D('XD03', 'Jews', '14.8 million, about 0.2% of the world’s population,'),
    D('XD04', 'Hindus', '1.2 billion, 14.9% of the world’s population,'),
    D('XD05', 'Buddhists', '324 million, 4.1% of the world’s population,'),
    D('XD06', 'Religiously unaffiliated', '1.9 billion, 24.2% of the world’s population,'),
    D('XD07', 'Other religions combined', '2.2% of the world’s population (no single-tradition count),', 'Daoists, Sikhs and Bahá’ís are among this combined category; its share is not assigned to any one tradition.'),
  ];

  return {
    nodes: NODES,
    links: LINKS,
    events: EVENTS,
    journeys: JOURNEYS,
    people: PEOPLE,
    encounters: ENCOUNTERS,
    population: POPULATION,
  };
};
