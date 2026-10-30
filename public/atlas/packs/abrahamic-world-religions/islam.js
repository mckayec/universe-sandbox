/* Religious Traditions atlas — data part: Islam (PACK_FORMAT §1.1; read by ../abrahamic-world-religions.js).
   Research: docs/universes/packs/abrahamic-world-religions/islam-research.md §2–§6 (with the corrections in
   islam-record-audit.md: ISJ03 as a network without route, ISP17 without Rae Bareli, ISH03/ISH04 cited to IS08,
   each record's own date precision); ids are the canonical ids of identity-and-edges.csv (IST01 → islam,
   ISP04 → jerusalem, ISP09 → cairo; tree node ids are those ids in lower case, the tree's id rule). Builder review: research-review.md (checkpoint 5).

   Rules followed here:
   * Islam is a tradition node, not a child of Judaism or Christianity (islam-research.md §2). The one tie to the
     Judaism layer is the Abraham textual reference (AI302), drawn as context, never as descent.
   * Sunni and Shia are not drawn as two denominations appearing in 632; the succession question is a Chronicle
     event. No tradition, legal school or order gets a founding year the research does not give.
   * Legal schools, Sufi orders and modern movements are different node types from the traditions; homonymous
     tradition and legal-school nodes (Zaydi, Ibadi) are kept apart with "Not the same as" notes (AI317, AI318).
   * Sufism is a cross-cutting devotional stream, not a fourth branch (AI319). Modern movements overlap the
     major-tradition graph; they are not another exclusive partition.
   * Ahmadi identity keeps two attributed fields: the Community's self-description and Pakistan's dated 1974
     classification as recorded by USCIRF. Neither is the atlas's verdict.
   * Places have no coordinates (§3); events open reference cards or say why there is no place. No populations,
     territories, conversion animations or routes. */
((window.ATLAS_PACK_PARTS = window.ATLAS_PACK_PARTS || {})['abrahamic-world-religions'] =
  window.ATLAS_PACK_PARTS['abrahamic-world-religions'] || {}).islam = function (h) {
  const SCH = h.SCH;
  const TRAD = h.TRAD;
  const SELF = h.SELF;
  const ev = h.ev('isl');

  function isl(id, name, kind, extra, blurb, notes) {
    return Object.assign({ id, name, kind, layers: ['isl'], world: 'earth', blurb }, extra, notes ? { notes } : {});
  }
  const IN = (p, rel) => ({ parent: p, parentType: 'within', parentRel: rel });
  const FROM = (p, type, rel) => ({ parent: p, parentType: type, parentRel: rel });
  const NODATE = (whenText, more) => Object.assign({ undated: true, ongoing: true, whenText }, more);
  const NOT = (id, t) => ({ id, t });

  /* traditions (islam-research.md §6, IST01–IST11) */
  const TRADITIONS = [
    isl(
      'islam',
      'Islam',
      'tradition',
      NODATE('No single founding date; tradition dates the first revelation to 610 (see the Chronicle)'),
      'Muslims regard the Qur’an as divine revelation and Muhammad as God’s messenger.',
      [
        TRAD('The Qur’an presents Muhammad as God’s messenger and seal of the prophets (Qur’an 33:40). Revelation is a religious claim; no source here proves it.'),
        { k: 'note', t: 'A tradition node, not a branch of Judaism or Christianity. One branch does not represent every Muslim, and the groups below are a research classification, not a verdict on anyone’s legitimacy.' },
        { k: 'note', t: 'Outside this bounded pass: full Sunni theological schools, Usuli/Akhbari distinctions, Dawudi/Sulaymani/Alavi subdivisions, Alevis and Alawis, Quranist and non-denominational identifications, complete Sufi order histories. Their absence is not a judgment about whether their adherents are Muslim. No membership numbers are shown.' },
      ],
    ),
    isl(
      'ist02',
      'Sunni Islam',
      'tradition',
      Object.assign(IN('islam', 'tradition-within'), NODATE('Developed after the 632 succession question; no single founding date')),
      'Sunni interpretation gives authority to the Qur’an, prophetic practice and scholarly consensus.',
      [SCH('A classification, not a shared founding-date claim. Not two complete modern denominations appearing in 632.')],
    ),
    isl(
      'ist03',
      'Shia (Shi’i) Islam',
      'tradition',
      Object.assign(IN('islam', 'tradition-within'), NODATE('Developed after the 632 succession question; no single founding date')),
      'Shi’i traditions give a central role to Ali and the Prophet’s family in religious leadership.',
      [TRAD('Shi’i tradition locates rightful succession in Ali. The atlas does not adjudicate legitimacy.')],
    ),
    isl(
      'ist04',
      'Ibadi Islam',
      'tradition',
      Object.assign(IN('islam', 'tradition-within'), {
        emerge: [601, 700],
        ongoing: true,
        whenText: 'Seventh century (a formation process, not one founding day)',
        notSame: [NOT('isl07', 'The Ibadi legal school: a tradition and a legal school are different kinds of record.')],
      }),
      'A distinct Islamic tradition with communities in Oman and parts of North Africa.',
      [
        SCH('Ibadi Islam developed in early Islamic disputes and is neither Sunni nor Shia. Modern Ibadis are not to be equated with every group historically labelled Kharijite.'),
        { k: 'note', t: 'Settings named by the source: Oman, the M’zab Valley (Algeria), Djerba (Tunisia) and the Nafusa Mountains (Libya). No population share is given.' },
      ],
    ),
    isl(
      'ist05',
      'Twelver (Ithna’ashari) Shi’ism',
      'Shia tradition',
      Object.assign(IN('ist03', 'tradition-within'), NODATE('No single founding date; disputes after 765 contributed to its formation')),
      'Twelvers recognize twelve Imams and await the concealed twelfth Imam’s return.',
      [
        TRAD('Twelver belief understands the twelfth Imam’s concealment in lesser and greater phases (874–941, then 941 onward). A belief, never a present location.'),
        SCH('Historical scholarship (Amir-Moezzi, Iranica) describes gradual doctrinal consolidation.'),
      ],
    ),
    isl(
      'ist06',
      'Ismaili Shi’ism',
      'Shia tradition',
      Object.assign(IN('ist03', 'tradition-within'), NODATE('No single founding date; disputes after 765 contributed to its formation')),
      'An Imami tradition whose historical development includes different lines of allegiance.',
      [SCH('Sources IS08 and IS09 share an author (Farhad Daftary) and are not independent corroboration.')],
    ),
    isl(
      'ist07',
      'Zaydi Shi’ism',
      'Shia tradition',
      Object.assign(IN('ist03', 'tradition-within'), NODATE('No single founding date; Zayd’s revolt (740) is formative', {
        notSame: [NOT('isl06', 'The Zaydi legal school: a tradition and a legal school are different kinds of record.')],
      })),
      'Named for Zayd ibn Ali, with a distinct tradition of law and theology.',
      [SCH('A Zaydi imamate was established in Yemen in 897; later rule was intermittent, with no uninterrupted territory.')],
    ),
    isl(
      'ist08',
      'Nizari Ismailis',
      'Ismaili tradition',
      Object.assign(FROM('ist06', 'division', 'succession-division'), { when: 1094, ongoing: true, whenText: '1094 / 487 AH succession dispute' }),
      'The Nizari line emerged from the 1094 succession dispute.',
    ),
    isl(
      'ist09',
      'Musta’li Ismailis',
      'Ismaili tradition',
      Object.assign(FROM('ist06', 'division', 'succession-division'), { when: 1094, ongoing: true, whenText: '1094 / 487 AH succession dispute' }),
      'The Musta’li line supported al-Musta’li in the same dispute.',
    ),
    isl(
      'ist10',
      'Tayyibi Musta’lis',
      'Musta’li tradition',
      Object.assign(FROM('ist09', 'division', 'succession-division'), NODATE('After 1130 / 524 AH')),
      'Tayyibis affirm a concealed imamate and leadership by the da’i mutlaq.',
      [TRAD('The hidden-imam belief is not a recovered itinerary.')],
    ),
    isl(
      'ist11',
      'Hafizi Musta’lis',
      'historical Musta’li tradition',
      Object.assign(FROM('ist09', 'division', 'succession-division'), { undated: true, whenText: 'After 1130 / 524 AH' }),
      'Hafizi allegiance supported al-Hafiz and later Fatimid imams.',
      [SCH('A historical node, not a current population estimate.')],
    ),
  ];

  /* legal schools (ISL01–ISL08): named in the Amman Message; edges only where the research gives them */
  const SUNNI_SCHOOL = (id, name) =>
    isl(
      id,
      name,
      'legal school',
      Object.assign(IN('ist02', 'legal-school-within'), NODATE('No founding date given by the source')),
      name + ': one of four separately named Sunni schools of jurisprudence in the Amman Message.',
      [SCH('Legal-school ties, not four mutually exclusive genealogical religions. No polity or ethnicity ties are implied.')],
    );
  const OTHER_SCHOOL = (id, name, extra) =>
    isl(
      id,
      name,
      'legal school',
      Object.assign(IN('islam', 'legal school named in the Amman Message (no further classification given)'), NODATE('No founding date given by the source', extra)),
      name + ': one of the other schools of jurisprudence named in the Amman Message.',
    );
  const SCHOOLS = [
    SUNNI_SCHOOL('isl01', 'Hanafi school'),
    SUNNI_SCHOOL('isl02', 'Maliki school'),
    SUNNI_SCHOOL('isl03', 'Shafi’i school'),
    SUNNI_SCHOOL('isl04', 'Hanbali school'),
    OTHER_SCHOOL('isl05', 'Ja’fari school', { notSame: [{ t: 'Ja’far al-Sadiq the person (see People).' }] }),
    OTHER_SCHOOL('isl06', 'Zaydi school', { notSame: [NOT('ist07', 'Zaydi Shi’ism, the tradition.')] }),
    OTHER_SCHOOL('isl07', 'Ibadi school', { notSame: [NOT('ist04', 'Ibadi Islam, the tradition.')] }),
    OTHER_SCHOOL('isl08', 'Zahiri school'),
  ];

  /* Sufism, orders and practices (ISC01–ISC04, ISO01–ISO06) */
  const ORDER = (id, name, notes) =>
    isl(
      id,
      name,
      'Sufi order',
      Object.assign(IN('isc01', 'order-associated-with'), NODATE('No founder date given by the source')),
      'A named Sufi order documented by Harvard’s Pluralism Project.',
      [SCH('No complete lineage or uniform affiliation is implied, and not every order shares the same creed.')].concat(notes || []),
    );
  const SUFI = [
    isl(
      'isc01',
      'Sufism (tasawwuf)',
      'devotional stream',
      Object.assign(FROM('islam', 'overlap', 'devotional-stream-in (cross-cutting, not a fourth branch)'), NODATE('No single founding date', {
        notSame: [NOT('ist02', 'Sunni Islam: Sufism is not a synonym for Sunni, nor an exclusive fourth branch.')],
      })),
      'Sufism emphasizes spiritual cultivation and devotion; it is not a separate mutually exclusive denomination.',
    ),
    ORDER('iso01', 'Shadhili order'),
    ORDER('iso02', 'Naqshbandi order'),
    ORDER('iso03', 'Qadiri order'),
    ORDER('iso04', 'Chishti order'),
    ORDER('iso05', 'Mevlevi order', [{ k: 'note', t: 'Devotionally associated with Jalal al-Din Rumi. No full order genealogy is supplied.' }]),
    ORDER('iso06', 'Tijani order'),
    isl(
      'isc02',
      'Dhikr',
      'practice',
      Object.assign(FROM('isc01', 'context', 'practice in Sufi communities'), { undated: true, whenText: 'A practice, not a dated event' }),
      'Remembrance of God takes different devotional forms in Sufi communities.',
    ),
    isl(
      'isc03',
      'Silsila',
      'relationship concept',
      Object.assign(FROM('isc01', 'context', 'teaching chain in Sufi traditions'), { undated: true, whenText: 'A concept, not a dated event' }),
      'Sufi traditions transmit teaching through master–disciple chains.',
      [SCH('A claimed spiritual chain is not automatically a biological genealogy.')],
    ),
    isl(
      'isc04',
      'Abraham and Ishmael (Qur’an 2:127)',
      'textual reference',
      Object.assign(FROM('islam', 'context', 'textual reference'), { undated: true, whenText: 'No date: a textual account, not a building date' }),
      'Qur’an 2:127 narrates Abraham and Ishmael raising the foundations of the House.',
      [TRAD('A textual claim, not an archaeological building date or historical proof.')],
    ),
  ];

  /* selected modern movements (ISM01–ISM05): overlapping records, not an exclusive partition */
  const MOVEMENTS = [
    isl(
      'ism01',
      'Ahmadiyya Muslim Community',
      'self-identified Islamic revival movement',
      Object.assign(IN('islam', 'self-identifies-with (the Community’s own description)'), { when: 1889, ongoing: true, whenText: '1889 (the Community’s own dating)' }),
      'The Community identifies itself as Muslim and dates its founding by Mirza Ghulam Ahmad to 1889.',
      [
        SELF('The Community’s self-name and self-identification as Muslim. Its Messiah claim is adherents’ belief.'),
        { k: 'note', t: 'External classification: USCIRF’s 2026 report records Pakistan’s 1974 constitutional classification of Ahmadis as non-Muslims. A dated state classification in one jurisdiction, not a worldwide consensus and not this atlas’s verdict.' },
      ],
    ),
    isl(
      'ism02',
      'Salafi orientations',
      'reform and theological category',
      Object.assign(IN('islam', 'selected modern movement (overlapping)'), NODATE('No single founder or founding day', {
        notSame: [NOT('ism03', 'The Wahhabi label: the two overlap, but are not one timeless identity.')],
      })),
      'Salafi and Wahhabi labels overlap, but their historical meanings and boundaries vary.',
      [SCH('No automatic legal school or political affiliation is assigned.')],
    ),
    isl(
      'ism03',
      'Wahhabi (Najdi) reform tradition',
      'historical movement label',
      Object.assign(IN('islam', 'selected modern movement (overlapping)'), {
        emerge: [1701, 1800],
        ongoing: true,
        whenText: 'Eighteenth-century reform',
        notSame: [NOT('ism02', 'Salafi orientations.')],
      }),
      'Associated with Muhammad ibn Abd al-Wahhab’s eighteenth-century reform and Najd.',
      [SCH('A historical analytical label, not an insult and not a synonym for all Sunni Islam.')],
    ),
    isl(
      'ism04',
      'Deobandi movement',
      'scholarly and reform network',
      Object.assign(IN('islam', 'selected modern movement (overlapping)'), NODATE('Associated with the Deoband seminary (1866 in its own dating; 1867 in Metcalf)')),
      'A movement associated with the Deoband seminary that combines religious learning with projects of moral reform.',
      [SCH('Its criticism of some devotional practices does not mean rejection of all Sufism.')],
    ),
    isl(
      'ism05',
      'Barelvi (Barelwi) movement',
      'devotional and scholarly movement',
      Object.assign(IN('islam', 'selected modern movement (overlapping)'), NODATE('No single founding date')),
      'Associated with Ahmad Riza Khan of Bareilly, combining Hanafi scholarship and Sufi devotion.',
      [
        { k: 'notsame', t: 'Ahl al-Sunna wa’l-Jama’a as a general label: the movement uses it in this South Asian context, but the broader term does not mean only this movement.' },
        SCH('Ahmad Riza Khan’s Qadiri affiliation is his own; it is not projected onto every member, and not every South Asian shrine is attached to this movement.'),
      ],
    ),
  ];

  const NODES = TRADITIONS.concat(SCHOOLS, SUFI, MOVEMENTS);

  /* typed ties beyond placement (islam-research.md §6 "Explicit graph edges"; identity-and-edges.csv AI302) */
  const LINKS = [
    { from: 'isc04', to: 'jud-covenant-tradition', type: 'context', rel: 'shared named figure (Abraham): distinct scriptural claims, not descent' },
    { from: 'ism02', to: 'ism03', type: 'overlap', rel: 'overlaps-with: the labels’ meanings changed over time (Lauzière)' },
    { from: 'ism04', to: 'isc01', type: 'overlap', rel: 'engages-and-reforms: seminary and Sufi-lodge practice (Ingram)' },
    { from: 'ism05', to: 'isl01', type: 'overlap', rel: 'legal-affinity (Hanafi scholarship)' },
  ];

  /* Chronicle (islam-research.md §4 and added events). No coordinates: events open a reference card or say why
     there is no place. */
  const EVENTS = [
    ev('ISE01', 'The first revelation (tradition)', 'Muslims understand Muhammad’s revelations as God’s communication through Gabriel; 610 is the conventional first-revelation date. A religious assertion, not empirical authentication.', { when: 610, whenText: 'Traditionally 610', ref: 'ISP03' }),
    ev('ISE02', 'The Hijra', 'The Hijra moved the community from Mecca to Medina; the migration anchors the Islamic calendar.', { when: 622, whenText: '622', ref: 'ISJ01' }),
    ev('ISE03', 'The succession question', 'Muhammad’s death raised the question of community leadership. Abu Bakr became first caliph; Shi’i tradition locates rightful succession in Ali. No verdict on legitimacy.', { when: 632, whenText: '632', side: 'Community succession · no place given' }),
    ev('ISE04', 'Husayn at Karbala', 'Husayn’s death at Karbala became central to Shi’i mourning in Muharram.', { when: 680, whenText: '680', ref: 'ISP05' }),
    ev('ISE12', 'Ibadi formation', 'Ibadi Islam developed in early Islamic disputes and is neither Sunni nor Shia: a formation process, not one founding day.', { when: [601, 700], whenText: 'Seventh century', side: 'A formation process · no single site' }),
    ev('ISE05', 'Zayd’s revolt', 'Zayd’s unsuccessful revolt is a formative event in Zaydi history.', { when: 740, whenText: 'January 740 (Safar 122 AH)', ref: 'ISP06' }),
    ev('ISE06', 'After Ja’far al-Sadiq', 'Disputes after Ja’far’s death contributed to the eventual formation of Twelver and Ismaili communities. Not every faction of the time bore its later name.', { when: 765, whenText: '765', side: 'Succession controversy · no site asserted' }),
    ev('ISE07', 'The concealment of the twelfth Imam (Twelver belief)', 'The twelfth Imam’s concealment is understood in lesser and greater phases. Historical scholarship describes gradual doctrinal consolidation, not proof of a concealed person’s present location.', { when: [874, 941], whenText: 'Traditionally 874–941, then 941 onward', side: 'A belief · no place' }),
    ev('ISE08', 'A Zaydi imamate in Yemen', 'Al-Hadi ila’l-Haqq Yahya established a Zaydi imamate in Yemen. Later rule was intermittent.', { when: 897, whenText: '897 / 284 AH', ref: 'ISP07' }),
    ev('ISE09', 'The Fatimid caliphate', 'The Fatimid caliphate was established in Ifriqiya.', { when: 909, whenText: '909 / 297 AH', ref: 'ISP08' }),
    ev('ISE10', 'Nizari and Musta’li', 'A Fatimid succession dispute divided Nizari and Musta’li allegiances.', { when: 1094, whenText: '1094 / 487 AH', ref: 'cairo' }),
    ev('ISE11', 'Tayyibi and Hafizi', 'A further succession division produced Tayyibi and Hafizi communities. Settings named by the source: Cairo and Yemen.', { when: 1130, whenText: 'After 1130 / 524 AH', ref: 'cairo' }),
    ev('ISE13', 'The Ahmadiyya Muslim Community founded', 'Mirza Ghulam Ahmad founded the Ahmadiyya Muslim Community. Qadian is his associated town, not asserted as the founding site.', { when: 1889, whenText: '1889', side: 'India · precise founding site not adopted' }),
    ev('ISE14', 'Darul Uloom Deoband', 'Darul Uloom Deoband dates its foundation to 31 May 1866; Metcalf (Iranica) gives 1867. The two dates are both shown, not averaged.', { when: 1866, whenText: '31 May 1866 (the institution’s dating; 1867 in Metcalf)', ref: 'ISP16' }),
    ev('ISE15', 'Pakistan’s 1974 classification', 'Pakistan’s constitutional amendment classified Ahmadis as non-Muslims. A state action, not a change in adherents’ self-identification.', { when: 1974, whenText: '1974', side: 'Pakistan · jurisdiction-level reference' }),
  ];

  /* journeys and connections (islam-research.md §5): ordered references, never drawn routes */
  const J = (id, name, role, desc) => ({ id, name, role: role + ' · Islam', first: 1, layers: ['isl'], desc: desc + h.JOURNEY_NOTE });
  const JOURNEYS = [
    J('ISJ01', 'The Hijra: Mecca → Medina', 'Historical migration', 'Muhammad and migrating followers, Mecca → Medina, 622. An endpoint sequence only: no reconstructed road or caravan timing, and no claim that everyone travelled together.'),
    J('ISJ02', 'The Night Journey (religious narrative)', 'Religious narrative', 'Qur’an 17:1 describes a night journey from the Sacred Mosque to the Farthest Mosque; the identification with Jerusalem comes separately from Muslim tradition. No date and no physical flight path.'),
    {
      id: 'ISJ03',
      name: 'Ibadi and Sunni scholars in Zanzibar',
      role: 'Scholarly network · Islam',
      first: 1,
      layers: ['isl'],
      desc: 'Nineteenth to early twentieth centuries: Ibadi and Sunni scholars interacted in Zanzibar; Oman is an associated regional context, not a verified travel end point. A reference-network card with no route geometry: no individual journeys between Oman and Zanzibar are documented, and no change of affiliation by all residents is implied.',
    },
  ];

  /* people (ISH01–ISH14): source-qualified roles; kinship notes are not a complete family tree */
  const P = (id, name, role, desc) => ({ id, name, role: role + ' · Islam', first: 1, layers: ['isl'], desc });
  const PEOPLE = [
    P('ISH01', 'Muhammad', 'Messenger (Qur’an 33:40)', 'God’s messenger in the Qur’an; the religious title stays attributed to the tradition.'),
    P('ISH02', 'Khadija', 'Early supporter', 'Muhammad’s wife and early supporter.'),
    P('ISH03', 'Ali', 'Successor in Shi’i tradition', 'Married Muhammad’s daughter Fatima. Marriage is a family tie; recognition as Imam is a separate, tradition-specific claim.'),
    P('ISH04', 'Fatima', 'Daughter of Muhammad', 'Muhammad’s daughter, married to Ali.'),
    P('ISH05', 'Husayn', 'Grandson of Muhammad', 'Muhammad’s grandson; his death at Karbala in 680 is central to Shi’i remembrance.'),
    P('ISH06', 'Abu Bakr', 'First caliph', 'The first caliph. Political succession is not prophetic succession.'),
    P('ISH07', 'Zayd ibn Ali', 'Eponym of the Zaydis', 'His revolt in 740 is formative in Zaydi history. Not automatically numbered fifth in every Shia lineage.'),
    P('ISH08', 'Ja’far al-Sadiq', 'Eighth century', 'Disputes after his death in 765 contributed to the formation of Twelver and Ismaili communities. A different record from the Ja’fari legal school.'),
    P('ISH09', 'Muhammad al-Mahdi', 'Twelver belief', 'The concealed twelfth Imam of Twelver belief. No modern physical location is given.'),
    P('ISH10', 'al-Hadi ila’l-Haqq Yahya', 'Ninth century', 'Established a Zaydi imamate in Yemen in 897: a historical founder role, not the sole founder of all Zaydi thought.'),
    P('ISH11', 'Jalal al-Din Rumi', 'Mevlevi association', 'Devotionally associated with the Mevlevi order. No full order genealogy is supplied.'),
    P('ISH12', 'Mirza Ghulam Ahmad', 'Founder, Ahmadiyya', 'Founder of the Ahmadiyya Muslim Community (1889, the Community’s dating).'),
    P('ISH13', 'Muhammad ibn Abd al-Wahhab', 'Eighteenth century', 'The reformer associated with the Wahhabi (Najdi) reform tradition.'),
    P('ISH14', 'Ahmad Riza Khan', 'Scholar of Bareilly', 'Scholar associated with the Barelvi movement, in a Hanafi and Qadiri setting; his Qadiri affiliation is his own. Not the same person as Sayyid Ahmad Barelwi, whom the source distinguishes.'),
  ];

  return { nodes: NODES, links: LINKS, events: EVENTS, journeys: JOURNEYS, people: PEOPLE };
};
