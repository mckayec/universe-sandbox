/* Religious Traditions atlas — data part: Christianity (PACK_FORMAT §1.1; read by ../abrahamic-world-religions.js).
   Research: docs/universes/packs/abrahamic-world-religions/christianity-research.md §1–§6a (with the
   ch-african-instituted correction from christianity-record-audit.md); ids are the canonical ids of
   identity-and-edges.csv (ch-christianity → christianity; ch-jewish-context → jud-second-temple, reused).
   Builder review: research-review.md (checkpoint 4).

   Rules followed here:
   * A tie says what the research says and no more (christianity-research.md §2, §6): the "Western
     Christianity", "Reformation context", "English Separatist context", revival, Stone, Campbell, Millerite,
     Bible Student, Chalcedonian and Kyivan Byzantine records are named historical contexts, not denominations.
   * Dates: a year only where the source gives one; centuries become literal windows (research-review Q02) with
     the source's words in whenText; otherwise `undated`. No family gets a founding year (no 1054 Catholic or
     Orthodox birthday; no 1517 Lutheran creation).
   * Early Jesus communities have Second Temple Judaism as context, not as an extinct parent (AI290).
   * Non-merges AI312–AI316 are "Not the same as" notes. No numeric adherents (dossier §7). */
((window.ATLAS_PACK_PARTS = window.ATLAS_PACK_PARTS || {})['abrahamic-world-religions'] =
  window.ATLAS_PACK_PARTS['abrahamic-world-religions'] || {}).christianity = function (h) {
  const SCH = h.SCH;
  const TRAD = h.TRAD;
  const SELF = h.SELF;
  const ev = h.ev('chr');

  function chr(id, name, kind, extra, blurb, notes) {
    return Object.assign({ id, name, kind, layers: ['chr'], world: 'earth', blurb }, extra, notes ? { notes } : {});
  }
  /* placement under a node: `within` with the research's own label; the overview hub groups, it does not classify */
  const IN = (p, rel) => ({
    parent: p,
    parentType: 'within',
    parentRel: p === 'christianity' ? 'grouped in this overview' : rel,
  });
  const FROM = (p, type, rel) => ({ parent: p, parentType: type, parentRel: rel });
  const CONTEXT = (whenText) => ({ undated: true, whenText: whenText || 'No single date' });

  const NODES = [
    chr(
      'ch-early-communities',
      'Early Jesus communities',
      'historical communities',
      { emerge: [1, 100], whenText: 'First century CE', site: 'jerusalem' },
      'Early Jesus communities developed within a Jewish setting and included increasingly gentile audiences.',
      [
        SCH('The Gospel accounts preserve differing perspectives rather than a harmonized biography.'),
        SCH('A long development within and beside Jewish life, not a one-day separation of Judaism and Christianity.'),
        TRAD('The resurrection is Christian proclamation; this atlas does not establish it.'),
      ],
    ),
    chr(
      'christianity',
      'Christianity',
      'overview',
      Object.assign(FROM('ch-early-communities', 'branch', 'historical-development (a long development)'), {
        undated: true,
        ongoing: true,
        whenText: 'No single founding date',
      }),
      '“Christianity” is an overview category, not one denomination founded at a single meeting. Families below are shown by historical association and self-identification; inclusion is not theological agreement among all churches.',
      [
        { k: 'note', t: 'Evangelical, charismatic and Pentecostal affiliations overlap denominational families; the families are not mutually exclusive population categories.' },
        { k: 'note', t: 'Outside this bounded pass: every national church and modern schism, detailed doctrinal disputes, all missionary routes, and full histories of missions, colonialism and slavery. No membership numbers are shown.' },
      ],
    ),

    /* families of communion (christianity-research.md §6) */
    chr(
      'ch-catholic',
      'Catholic communion',
      'communion',
      Object.assign(IN('christianity'), { parentRel: 'family-membership', undated: true, ongoing: true, whenText: 'No single founding date (not 1054)', site: 'gaz-rome-centre' }),
      'Catholic communion is centred on communion with the bishop of Rome; it includes Western and Eastern churches.',
      [SELF('Apostolic continuity is the church’s own self-understanding; the tree does not award it.')],
    ),
    chr(
      'ch-eastern-catholic',
      'Eastern Catholic churches',
      'churches within a communion',
      Object.assign(IN('ch-catholic', 'communion-membership'), { undated: true, ongoing: true, whenText: 'Several Eastern traditions; no single rupture date' }),
      'Eastern Catholic churches retain distinct rites and disciplines within Catholic communion.',
      [SELF('Catholic teaching (Vatican II, 1964) holds the Eastern and Western Catholic traditions to be of equal dignity.')],
    ),
    chr(
      'ch-ukrainian-greek-catholic',
      'Ukrainian Greek Catholic Church',
      'Eastern Catholic church',
      Object.assign(IN('ch-eastern-catholic', 'communion-membership'), { undated: true, ongoing: true, whenText: 'Union of Brest (1595–96) and later regional receptions' }),
      'Ukrainian Greek Catholic history includes the 1595–96 Union of Brest and later regional receptions, while retaining Byzantine traditions in communion with Rome.',
      [SCH('Not all Orthodox accepted the union, and not all Eastern Catholics began at Brest. Source: a Catholic institutional account.')],
    ),
    chr(
      'ch-old-catholic',
      'Old Catholic churches',
      'churches of differing origins',
      Object.assign(FROM('ch-catholic', 'division', 'multiple institutional separations'), { undated: true, ongoing: true, whenText: 'Differing origins; no single founding date' }),
      'Old Catholic churches have differing origins: German and Swiss opposition to Vatican I is distinct from the older Utrecht history.',
      [SCH('There is no single 1870 founding for every Old Catholic church.')],
    ),
    chr(
      'ch-union-utrecht',
      'Union of Utrecht',
      'communion of churches',
      Object.assign(IN('ch-old-catholic', 'communion-association'), { when: 1889, ongoing: true, whenText: '24 September 1889' }),
      'The Union of Utrecht brought Dutch, German and Swiss Old Catholic churches into communion in 1889.',
      [{ k: 'notsame', t: 'Every church that calls itself Old Catholic: not every self-described Old Catholic body is included.' }],
    ),
    chr(
      'ch-eastern-orthodox',
      'Eastern Orthodox churches',
      'family of self-governing churches',
      Object.assign(IN('christianity'), { parentRel: 'family-membership', undated: true, ongoing: true, whenText: 'No single founding date (not 1054)', notSame: [{ id: 'ch-oriental-orthodox', t: 'Oriental Orthodoxy: different communion families with different council reception.' }, { id: 'jud-orthodox', t: 'Orthodox Judaism: a shared English word does not identify the same religion.' }, { id: 'ch-eastern-catholic', t: 'The Eastern Catholic churches, which are in communion with Rome.' }] }),
      'Eastern Orthodoxy comprises self-governing churches sharing the faith of seven ecumenical councils.',
    ),
    chr(
      'ch-chalcedonian-context',
      'Chalcedonian traditions',
      'council-reception category',
      Object.assign(IN('christianity'), CONTEXT('From 451 onward')),
      'Churches that received the Council of Chalcedon’s formulation (451). A council-reception category, not one present church.',
    ),
    chr(
      'ch-oriental-orthodox',
      'Oriental Orthodox churches',
      'family of churches',
      Object.assign(IN('christianity'), { parentRel: 'family-membership', undated: true, ongoing: true, whenText: 'No single founding date', notSame: [{ id: 'ch-eastern-orthodox', t: 'Eastern Orthodoxy.' }, { id: 'ch-east-syriac', t: 'The Church of the East tradition.' }] }),
      'The Coptic, Armenian, Syriac, Ethiopian, Eritrean and Indian Oriental Orthodox churches accept the first three councils and reject Chalcedon’s formulation.',
      [SCH('No verdict that either side of the Chalcedon disagreement lacked belief in Christ’s humanity.')],
    ),
    chr(
      'ch-east-syriac',
      'Church of the East tradition',
      'historical family',
      Object.assign(IN('christianity'), { parentRel: 'historical-family', undated: true, ongoing: true, whenText: 'No single founding date', notSame: [{ id: 'ch-oriental-orthodox', t: 'Oriental Orthodoxy.' }, { id: 'ch-eastern-orthodox', t: 'Eastern Orthodoxy.' }] }),
      'The Church of the East tradition developed in Mesopotamian and Persian settings, east of the Roman-Byzantine world.',
      [
        TRAD('Apostolic founders are tradition.'),
        SCH('“Nestorian” is not a neutral universal label for this family. The council of Ephesus (431) did not create every East Syriac church.'),
      ],
    ),
    chr(
      'ch-kyivan-byzantine-context',
      'Kyivan Byzantine context',
      'historical context',
      Object.assign(IN('christianity'), CONTEXT()),
      'The historical context of the Union of Brest. Not all Orthodox jurisdictions.',
    ),

    /* Western reform families (christianity-research.md §6) */
    chr(
      'ch-western-context',
      'Western Christianity',
      'historical context',
      Object.assign(IN('christianity'), CONTEXT()),
      'The context of the sixteenth-century reforms. Not the same as one modern Catholic organization.',
    ),
    chr(
      'ch-lutheran',
      'Lutheran churches',
      'family of churches',
      Object.assign(FROM('ch-western-context', 'branch', 'reform / institutional development'), { emerge: [1501, 1600], whenText: 'Sixteenth century', ongoing: true, site: 'gaz-wittenberg-luther-hall' }),
      'Lutheran churches developed from the sixteenth-century reform movement associated with Luther.',
      [SCH('1517 is a controversy marker, not an instantaneous creation. The later division developed beyond Luther’s original intention (joint Lutheran–Catholic account, 2016).')],
    ),
    chr(
      'ch-reformed',
      'Reformed and Presbyterian churches',
      'family of churches',
      Object.assign(FROM('ch-western-context', 'branch', 'reform / institutional development'), { emerge: [1501, 1600], whenText: 'Sixteenth century', ongoing: true }),
      'Reformed and Presbyterian traditions draw on Swiss and French reformers including Zwingli, Bullinger and Calvin.',
      [SCH('Not simply a Lutheran daughter; no single polity or founding date is imposed.')],
    ),
    chr(
      'ch-anglican',
      'Anglican churches',
      'family of churches',
      Object.assign(FROM('ch-western-context', 'branch', 'reform / institutional development'), { emerge: [1501, 1700], whenText: 'Sixteenth–seventeenth centuries', ongoing: true, site: 'gaz-canterbury-cathedral' }),
      'Anglican identity took distinctive form through the British Reformations and later autonomous churches.',
      [SCH('Later communion ties: not every province is a direct schism, and the global network is not one permanent English jurisdiction.')],
    ),
    chr(
      'ch-methodist',
      'Methodist churches',
      'family of churches',
      Object.assign(FROM('ch-anglican', 'division', 'renewal, then institutional separation'), { emerge: [1701, 1800], whenText: 'Eighteenth century', ongoing: true }),
      'Methodism grew from John and Charles Wesley’s renewal work within the Church of England.',
    ),
    chr(
      'ch-reformation-context',
      'Reformation context',
      'historical context',
      Object.assign(IN('christianity'), CONTEXT()),
      'The wider Reformation, including several movements. Not a single institutional parent.',
    ),
    chr(
      'ch-anabaptist',
      'Anabaptist traditions',
      'family of movements',
      Object.assign(FROM('ch-reformation-context', 'branch', 'movement-emergence'), { emerge: [1501, 1600], whenText: 'Sixteenth century; 1525 Zurich marker', ongoing: true }),
      'Anabaptist traditions developed within the Radical Reformation, emphasizing believers’ baptism.',
      [SCH('Zurich, 21 January 1525, is the commonly recognized symbolic beginning (Mennonite World Conference), not every group’s sole birthplace. Mennonite identity is not synonymous with all Anabaptism.')],
    ),
    chr(
      'ch-english-separatist-context',
      'English Separatist context',
      'historical context',
      Object.assign(IN('christianity'), CONTEXT()),
      'The named origin context of the Baptist movement. Not all Anabaptists.',
    ),
    chr(
      'ch-baptist',
      'Baptist churches',
      'family of churches',
      Object.assign(FROM('ch-english-separatist-context', 'branch', 'movement-emergence'), { emerge: [1601, 1630], whenText: 'Early 1600s', ongoing: true }),
      'Baptist traditions emphasize professed faith and congregational life.',
      [SCH('An earlier 1609 setting in the Netherlands precedes the 1612 London congregation. No universal Anabaptist institutional parent is asserted.')],
    ),
    chr(
      'ch-evangelical',
      'Evangelical movements',
      'cross-cutting affiliation',
      Object.assign(IN('christianity'), { undated: true, ongoing: true, whenText: 'Revival and later developments; no single church or founder' }),
      '“Evangelical” identifies movements and commitments crossing Protestant and Anglican institutions.',
      [SCH('A changing term; no universal political stereotype is implied.')],
    ),
    chr(
      'ch-revival-contexts',
      'Wesleyan-Holiness and Reformed revival contexts',
      'historical contexts',
      Object.assign(IN('christianity'), CONTEXT()),
      'Several revival contexts that influenced Pentecostal movements. Not a single denomination.',
    ),
    chr(
      'ch-pentecostal',
      'Pentecostal movements',
      'movements',
      Object.assign(FROM('ch-revival-contexts', 'branch', 'multiple influences'), { emerge: [1901, 1930], whenText: 'Early 1900s', ongoing: true }),
      'Pentecostal movements emphasize the Holy Spirit and spiritual gifts.',
      [SCH('Azusa Street (1906) was a major centre, not proof that every Pentecostal movement descends from it. Charismatic renewal within existing churches is not automatic institutional departure.')],
    ),

    /* nineteenth-century movements (christianity-research.md §6, §6a) */
    chr('ch-stone-movement', 'Stone movement', 'historical movement', Object.assign(IN('christianity'), CONTEXT('Before 1832')), 'One of the two movements whose union formed the Stone–Campbell movement.'),
    chr('ch-campbell-movement', 'Campbell movement', 'historical movement', Object.assign(IN('christianity'), CONTEXT('Before 1832')), 'One of the two movements whose union formed the Stone–Campbell movement.'),
    chr(
      'ch-stone-campbell',
      'Stone–Campbell movement',
      'movement (union)',
      { merge: ['ch-stone-movement', 'ch-campbell-movement'], parentRel: 'merger', when: 1832, whenText: '31 December 1831 handshake; 1 January 1832 union', notSame: [{ id: 'ch-latter-day-saint', t: 'Joseph Smith’s restoration movement: shared restoration language does not establish a common institutional parent.' }] },
      'The Stone and Campbell movements sought Christian unity and restoration through their nineteenth-century movement.',
      [SCH('The Disciples’ chronology keeps the 31 December handshake and the 1 January union as two dates in one merger history.')],
    ),
    chr('ch-millerite-context', 'Advent (Millerite) movement', 'historical movement', Object.assign(IN('christianity'), CONTEXT('Nineteenth century')), 'The nineteenth-century Advent movement: antecedent context, not an institutional parent of every Adventist or Witness body.'),
    chr(
      'ch-adventist',
      'Seventh-day Adventist Church',
      'church',
      Object.assign(FROM('ch-millerite-context', 'branch', 'movement-development'), { when: 1863, ongoing: true, whenText: 'Name adopted 1860; General Conference organized May 1863' }),
      'Seventh-day Adventists developed from the nineteenth-century Advent movement and organized their General Conference in 1863.',
      [SELF('The 1844 expectation and the later sanctuary interpretation are the church’s beliefs and history of interpretation, not predictions certified here.')],
    ),
    chr('ch-bible-student-context', 'Bible Students', 'historical movement', Object.assign(IN('christianity'), CONTEXT('Late 1800s, Pittsburgh area')), 'Bible Students near Pittsburgh, including Charles Taze Russell: antecedent context of the modern Jehovah’s Witnesses.'),
    chr(
      'ch-jehovahs-witnesses',
      'Jehovah’s Witnesses',
      'religious organization',
      Object.assign(FROM('ch-bible-student-context', 'branch', 'institutional development; name adoption'), { undated: true, ongoing: true, whenText: 'Modern organization from late-1800s Bible Students; name adopted 1931' }),
      'Jehovah’s Witnesses trace their modern organization to Bible Students near Pittsburgh, including Charles Taze Russell; they adopted their distinctive name in 1931.',
      [
        SELF('They regard Jesus as their founder; that religious claim is kept apart from the modern organization.'),
        SCH('No Seventh-day Adventist institutional parent is asserted.'),
      ],
    ),

    /* Latter Day Saint movement and successors (christianity-research.md §6, §6a; the LDS atlas covers the scriptures) */
    chr(
      'ch-latter-day-saint',
      'Latter Day Saint movement',
      'movement',
      Object.assign(IN('christianity'), { parentRel: 'self-identified Christian / restoration movement', emerge: [1801, 1900], whenText: 'Nineteenth century', ongoing: true, notSame: [{ id: 'ch-lds-utah', t: 'The Church of Jesus Christ of Latter-day Saints: the movement is broader than one present institution.' }, { id: 'ch-stone-campbell', t: 'The Stone–Campbell movement.' }] }),
      'The Latter-day Saint movement understands its origin as restoration through Joseph Smith.',
      [SELF('Restored priesthood authority through heavenly messengers is the movement’s belief; no claim that other churches accept it. Not a branch of the Stone–Campbell movement.')],
    ),
    chr(
      'ch-lds-utah',
      'The Church of Jesus Christ of Latter-day Saints',
      'successor church',
      Object.assign(FROM('ch-latter-day-saint', 'division', 'successor tradition'), { when: 1844, ongoing: true, whenText: '1844 leadership of the Twelve; First Presidency reconstituted 1847' }),
      'The Church of Jesus Christ of Latter-day Saints follows the leadership succession through Brigham Young and the Twelve after Joseph Smith’s death.',
      [SELF('Claims about the divine mantle of succession remain the church’s own.')],
    ),
    chr(
      'ch-community-christ',
      'Community of Christ',
      'successor church',
      Object.assign(FROM('ch-latter-day-saint', 'division', 'successor tradition'), { when: 1860, ongoing: true, whenText: 'Reorganized Church: 1860 (Joseph Smith III); named Community of Christ in 2001' }),
      'The Reorganized Church’s 1860 development included Joseph Smith III’s presidency; it adopted the name Community of Christ in 2001.',
      [SCH('1860 and 2001 are reorganization and name dates of one institution, not two origins; not drawn as an 1860 departure from the Utah church.')],
    ),
    chr(
      'ch-jesus-christ-bickerton',
      'The Church of Jesus Christ (Bickertonite)',
      'church',
      Object.assign(FROM('ch-latter-day-saint', 'within', 'historical family'), { when: 1862, ongoing: true, whenText: '1862' }),
      'The Church of Jesus Christ, identified in scholarly catalogues as Bickertonite, was organized by William Bickerton at Green Oak, Pennsylvania, in 1862.',
      [{ k: 'notsame', t: 'The Church of Jesus Christ of Latter-day Saints, or the Stone–Campbell Churches of Christ: a shared church name does not identify the same body. “Bickertonite” is a catalogue disambiguator, not the church’s preferred name.' }],
    ),
    chr(
      'ch-strang-movement',
      'Strangite movement',
      'successor movement',
      Object.assign(FROM('ch-latter-day-saint', 'division', 'successor claim / movement'), { emerge: [1844, 1847], whenText: '1844–47 succession period' }),
      'James J. Strang led a distinct movement following the 1844 succession debate.',
      [SCH('A historical node: no claim that all present Strangite congregations form one organization. Source: the history of a different successor church; no succession claim is adjudicated.')],
    ),

    /* African Instituted Churches (christianity-research.md §6a) */
    chr(
      'ch-african-instituted',
      'African Instituted Churches',
      'varied family',
      Object.assign(IN('christianity'), { parentRel: 'family category', undated: true, ongoing: true, whenText: 'Multiple origins; no family-wide foundation period' }),
      'African Instituted Churches is a varied family of churches initiated by Africans, not one denomination.',
      [SCH('Some churches overlap spiritual or Pentecostal categories. No universal founder or single missionary-parent tie.')],
    ),
    chr(
      'ch-african-church',
      'The African Church (Nigeria)',
      'church',
      Object.assign(IN('ch-african-instituted', 'family classification'), { when: 1901, ongoing: true, whenText: '1901' }),
      'The African Church in Nigeria developed in 1901 from a disagreement within Anglican Christianity over indigenous leadership.',
      [SCH('Neither its Anglican separation nor its AIC classification means that all AICs have Anglican ancestry.')],
    ),
    chr(
      'ch-oaic',
      'Organization of African Instituted Churches',
      'association',
      Object.assign(FROM('ch-african-instituted', 'context', 'representative association'), { when: 1978, ongoing: true, whenText: '1978', site: 'gaz-cairo-historic' }),
      'The Organization of African Instituted Churches was founded at a 1978 Cairo conference to support fellowship and training.',
      [SCH('An association, not a merged denomination or universal governance. No absorption into the Coptic Church is implied.')],
    ),
  ];

  /* typed ties beyond placement (christianity-research.md §6, §6a; identity-and-edges.csv AI290) */
  const LINKS = [
    { from: 'jud-second-temple', to: 'ch-early-communities', type: 'context', rel: 'historical context: a Jewish setting; living Judaism is not a superseded parent' },
    { from: 'ch-catholic', to: 'ch-eastern-orthodox', type: 'history', rel: 'estrangement and reconciliation history: prolonged, with 1054 as a marker', when: 1054 },
    { from: 'ch-oriental-orthodox', to: 'ch-chalcedonian-context', type: 'history', rel: 'divergent council reception, 451 onward', when: 451 },
    { from: 'ch-kyivan-byzantine-context', to: 'ch-ukrainian-greek-catholic', type: 'branch', rel: 'historical development' },
    { from: 'ch-anglican', to: 'ch-african-church', type: 'division', rel: 'institutional separation over indigenous leadership', when: 1901 },
    { from: 'ch-pentecostal', to: 'ch-evangelical', type: 'overlap', rel: 'overlapping affiliation' },
  ].concat(
    /* "crossing Protestant and Anglican institutions": the Protestant and Anglican family nodes of this pack */
    ['ch-anglican', 'ch-lutheran', 'ch-reformed', 'ch-baptist', 'ch-methodist'].map((to) => ({
      from: 'ch-evangelical',
      to,
      type: 'overlap',
      rel: 'cross-cutting affiliation',
    })),
  );

  /* Chronicle (christianity-research.md §4 and §6a). Events open the place's reference card (E4); only the
     first-century origins use the shared Jerusalem city marker, as the Judaism layer does. */
  const EVENTS = [
    ev('che-origins', 'The Jesus movement', 'The Jesus movement arose in a Jewish context. Its communities preserved several Gospel accounts and expanded among non-Jews. The resurrection is Christian proclamation, not something this map establishes.', { when: [1, 100], whenText: 'First century CE', site: 'jerusalem' }),
    ev('che-nicaea', 'Council of Nicaea', 'Constantine convened the Council of Nicaea. It did not invent Christianity or create the complete biblical canon.', { when: 325, whenText: '325', ref: 'chp-nicaea' }),
    ev('che-constantinople', 'Council of Constantinople', 'Constantinople 381 belongs to the councils accepted by the Oriental Orthodox family, alongside Nicaea and Ephesus.', { when: 381, whenText: '381', ref: 'chp-constantinople' }),
    ev('che-ephesus', 'Council of Ephesus', 'Ephesus 431 is the third council accepted by the Oriental Orthodox churches. It did not create every East Syriac church.', { when: 431, whenText: '431', ref: 'chp-ephesus' }),
    ev('che-chalcedon', 'Council of Chalcedon', 'Disagreement over Chalcedon’s Christological formulation contributed to the separation of the churches now called Oriental Orthodox from the Chalcedonian churches. No verdict that either party lacked belief in Christ’s humanity.', { when: 451, whenText: '451 and later reception', ref: 'chp-chalcedon' }),
    ev('che-1054', 'Censures of 1054', 'Roman legates and Constantinople’s patriarchal synod exchanged censures against named persons, within a longer estrangement. The 1965 joint declaration distinguished these acts from their later consequences for communion.', { when: 1054, whenText: '1054', ref: 'chp-constantinople' }),
    ev('che-1965', 'Joint Catholic–Orthodox declaration', 'Paul VI and Athenagoras I removed the historical censures from ecclesial memory while explicitly acknowledging unresolved differences. This was not a merger.', { when: 1965, whenText: '7 December 1965 (read in Rome and Istanbul)', ref: 'chp-rome' }),
    ev('che-luther', 'Luther and the indulgence controversy', 'Luther publicly opposed indulgence sales in Wittenberg. The later division developed beyond his original intention. The door-nailing scene is not needed for this account.', { when: 1517, whenText: '1517', ref: 'chp-wittenberg' }),
    ev('che-anabaptist', 'Believers’ baptism in Zurich', 'Conrad Grebel baptized George Blaurock, who baptized others, in Felix Manz’s house; Mennonite World Conference identifies this as the commonly recognized beginning. A symbolic origin, not every Anabaptist group’s sole birthplace.', { when: 1525, whenText: '21 January 1525', ref: 'chp-zurich' }),
    ev('che-baptist-london', 'A Baptist congregation in London', 'Followers of John Smyth formed a London Baptist congregation led by Thomas Helwys. The earlier 1609 setting was in the Netherlands.', { when: 1612, whenText: '1612', ref: 'london' }),
    ev('che-brest', 'Union of Brest', 'A synod proclaimed union with Rome; reception was contested and some dioceses joined later. Not a universal Orthodox–Catholic reunion.', { when: [1595, 1596], whenText: '1595–1596', ref: 'chp-brest' }),
    ev('che-methodist-us', 'Methodist Episcopal Church constituted', 'American Methodists constituted the Methodist Episcopal Church following United States independence. No city is given by the source.', { when: 1784, whenText: '1784', side: 'North America · regional context, no map point' }),
    ev('che-lds', 'Organization at Fayette', 'The Church’s official account places the organization by Joseph Smith and associates at Fayette. The claimed restoration of priesthood through heavenly messengers is the church’s belief.', { when: 1830, whenText: '6 April 1830 (the church’s official account)', ref: 'chp-fayette' }),
    ev('che-stone-campbell', 'Stone–Campbell union', 'The Disciples’ chronology distinguishes a 31 December handshake from the 1 January union of the Stone and Campbell movements: one merger history with two documentary dates.', { when: [1831, 1832], whenText: '31 December 1831 and 1 January 1832', ref: 'chp-lexington' }),
    ev('che-rlds', 'Joseph Smith III and the Reorganized Church', 'Joseph Smith III became president of the Reorganized Church. It took the name Community of Christ in 2001.', { when: 1860, whenText: '6 April 1860', ref: 'chp-amboy' }),
    ev('che-bickerton', 'Bickerton organizes a church', 'William Bickerton organized The Church of Jesus Christ.', { when: 1862, whenText: '1862 (year only)', ref: 'chp-green-oak' }),
    ev('che-adventist', 'General Conference organized', 'Delegates gathered on 20 May; the church commemorates 21 May 1863 as its organization.', { when: 1863, whenText: '20–21 May 1863', ref: 'chp-battle-creek' }),
    ev('che-utrecht', 'Union of Utrecht', 'Five bishops established their conference and affirmed communion among the represented Old Catholic churches. An association date, not every church’s founding date.', { when: 1889, whenText: '24 September 1889', ref: 'chp-utrecht' }),
    ev('che-african-church', 'The African Church', 'An indigenous-leadership disagreement within Anglican Christianity produced The African Church. The source gives no local venue.', { when: 1901, whenText: '1901', side: 'Nigeria · regional context, no map point' }),
    ev('che-azusa', 'Azusa Street revival', 'William J. Seymour led a prominent Pentecostal revival at the Azusa Street mission: a major centre, not proof that every Pentecostal movement descends from it.', { when: 1906, whenText: 'April 1906', ref: 'chp-azusa' }),
    ev('che-jw-name', 'The name Jehovah’s Witnesses', 'A convention led by J. F. Rutherford adopted the name Jehovah’s Witnesses. This names a modern community, not the first use of biblical witness language.', { when: 1931, whenText: '26 July 1931', ref: 'chp-columbus' }),
    ev('che-oaic', 'Organization of African Instituted Churches founded', 'Leaders invited by Coptic Pope Shenouda III established OAIC. No conversion or absorption into the Coptic Church is implied.', { when: 1978, whenText: '1978', ref: 'cairo' }),
  ];

  /* spread (christianity-research.md §5): regional summaries, never drawn routes */
  const J = (id, name, desc) => ({ id, name, role: 'Regional spread · Christianity', first: 1, layers: ['chr'], desc: desc + h.JOURNEY_NOTE });
  const JOURNEYS = [
    J('ch-spread-early', 'Early Mediterranean communities', 'Paul and early communities connected Jewish and gentile audiences across the Mediterranean. No itinerary is reconstructed.'),
    J('ch-spread-east', 'Church of the East into Asia', 'Church of the East missions extended into Asia; its WCC profile describes Christian presence in China in the seventh century. Apostolic founding traditions are not mapped as verified travel.'),
    J('ch-spread-methodist', 'International Methodist growth', 'Missionary activity from Britain and the United States contributed to international Methodist growth.'),
    J('ch-spread-anglican', 'A global Anglican network', 'Overseas mission and later provincial autonomy formed a global Anglican network, not one permanent English jurisdiction.'),
  ];

  return { nodes: NODES, links: LINKS, events: EVENTS, journeys: JOURNEYS, people: [] };
};
