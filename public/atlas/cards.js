/* Atlas card view for world-only packs (PACK_FORMAT section 22, `layout:"cards"`).
   Draws places, the Chronicle, journeys and the codex as linked reference cards, with no galaxy, no surface pins and
   no distances, so a pack never has to invent coordinates. Spoiler gating (cumulative, "completed through book k")
   and the reading-gate chooser come from gate.js. Plain DOM and CSS: crisp at any resolution, light on phones.
   Loaded by atlas/index.html; engine.js hands a pack with layout:"cards" to AtlasCards.start(). */
(function (root) {
  'use strict';

  const ARR = v => (Array.isArray(v) ? v : v == null ? [] : [v]);
  const ESC = s =>
    String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const NUMW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const DEF_COLS = ['#c9a45a', '#8fb0e0', '#c46a52', '#8cc49a', '#b892e0', '#e0a0b8', '#9ad0d8'];
  const THEME = {
    void: '--ca-void',
    deep: '--ca-deep',
    panel: '--ca-panel',
    accent: '--ca-accent',
    accentHi: '--ca-accent-hi',
    accentLo: '--ca-accent-lo',
    chrome: '--ca-chrome',
    ember: '--ca-ember',
    text: '--ca-text',
    muted: '--ca-muted',
    faint: '--ca-faint',
    line: '--ca-line',
    lineStrong: '--ca-line-strong',
    ink: '--ca-ink',
    chromeGrad: '--ca-chrome-grad',
    fontDisplay: '--ca-f-display',
    fontTitle: '--ca-f-title',
    fontBody: '--ca-f-body',
    fontHud: '--ca-f-hud',
  };

  /* Tooltip for an "Editorial label" badge. The default only says the atlas chose the label or grouping; it
     never claims the source is silent about a name. A record's own `editorialNote` wins over `ui.editorialNote`. */
  const DEF_EDITORIAL_NOTE = 'This atlas supplies this grouping or display label.';
  function editorialNote(x, ui) {
    if (x && typeof x.editorialNote === 'string' && x.editorialNote.trim()) return x.editorialNote;
    return (ui && ui.editorialNote) || DEF_EDITORIAL_NOTE;
  }

  function fanNotice(M) {
    if (M.notice) return M.notice;
    return (
      'Unofficial fan project for personal, non-commercial use. ' +
      (M.series || 'This series') +
      ' and related names are the property of ' +
      (M.author || 'their author') +
      ' and ' +
      (M.publisher || 'the publishers') +
      '. Places are shown as reference cards, not mapped positions.'
    );
  }

  /* pack → normalised model (defaults filled in, nothing mutated) */
  function model(P, Gt) {
    const meta = Object.assign({ series: '', author: '', years: '', tagline: '' }, P.meta || {});
    meta.title = meta.title || P.id || 'Atlas';
    meta.series = meta.series || meta.title;
    const books = {};
    Object.keys(P.books || {})
      .map(Number)
      .filter(b => b >= 1)
      .sort((a, b) => a - b)
      .forEach((b, i) => (books[b] = Object.assign({ n: String(b), title: 'Book ' + b }, P.books[b], {})));
    Object.keys(books).forEach((b, i) => (books[b].c = books[b].c || DEF_COLS[i % DEF_COLS.length]));
    const bookIds = Object.keys(books).map(Number);
    if (!bookIds.length) throw new Error('The pack lists no books.');
    const N = Gt.normSpoilers(P.spoilers, bookIds);
    const ui = Object.assign({}, P.ui || {});
    const nW = NUMW[bookIds.length] || String(bookIds.length);
    ui.bookLabel = ui.bookLabel == null ? 'Completed through' : ui.bookLabel;
    ui.booksAria = ui.booksAria || 'The last book you have completed';
    ui.allTitle = ui.allTitle || 'All ' + nW + ' books, with spoilers';
    ui.backHref = ui.backHref || '../';
    ui.backLabel = ui.backLabel || 'Gravity Lab';
    ui.tabs = Object.assign(
      { places: 'Places', chron: 'Chronicle', journeys: 'Journeys', codex: 'Codex', about: 'About' },
      ui.tabs || {},
    );
    ui.placesTitle = ui.placesTitle || 'Places';
    ui.editorialLabel = ui.editorialLabel || 'Editorial label';
    ui.editorialNote = ui.editorialNote || DEF_EDITORIAL_NOTE;
    ui.lockedLink = ui.lockedLink || 'That link points past the book you chose, so it stays hidden.';
    ui.gateTitle = ui.gateTitle || 'Which book have you finished?';
    ui.gateText =
      ui.gateText ||
      'Nothing is listed until you choose. You will only see places, events and ideas from the books you have completed. You can change this at any time in the header.';
    ui.moreNote = ui.moreNote || 'More appears as you finish later books.';
    const worlds = ARR(P.worlds).filter(w => w && w.id != null);
    const idx = Gt.placeIndex(worlds);
    const events = ARR(P.events)
      .filter(e => e && books[e.book])
      .map((e, i) => Object.assign({}, e, { id: String(e.id == null ? 'ev' + i : e.id) }));
    const journeys = ARR(P.journeys)
      .filter(j => j && j.id != null)
      .map(j => Object.assign({}, j, { id: String(j.id) }));
    const codex = ARR(P.codex)
      .filter(t => t && t.id)
      .map(t => ({ id: String(t.id), title: t.title || t.id, list: ARR(t.list).filter(x => x && x.name) }));
    const groups = ARR(P.groups).filter(g => g && g.id);
    return { P, meta, books, bookIds, N, ui, worlds, idx, events, journeys, codex, groups, intro: P.intro || {} };
  }

  function start(P) {
    const Gt = root.AtlasGate;
    if (!Gt) throw new Error('gate.js is not loaded.');
    const K = model(P, Gt);
    const { meta: M, books: BOOKS, bookIds: BOOK_IDS, N, ui: UI, idx: IDX } = K;
    const ID = String(P.id || M.title);
    const BOOK_KEY = 'atlas-book:' + ID;
    const ORDER_KEY = 'atlas-order:' + ID;
    const CHRON = Gt.hasChron(BOOKS, BOOK_IDS);
    const S = { book: null, tab: 'places', place: null, ev: null, j: null, cx: null, order: 'publication' };
    const $ = q => document.querySelector(q);
    const store = (k, v) => {
      try {
        localStorage.setItem(k, String(v));
      } catch (e) {
        /* private mode: the choice lasts for this visit */
      }
    };
    const load = k => {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    };

    /* ---------- gating ---------- */
    const k = () => (S.book == null ? -1 : S.book);
    const openGate = g => S.book != null && Gt.open(g, k());
    const placeSeen = key => !!IDX.by[key] && openGate(IDX.by[key].gate);
    const evSeen = e => openGate(e.book) && Gt.eventPlaces(e).every(placeSeen);
    const jrSeen = j => S.book != null && Gt.journeyOpen(IDX, j, k());
    const cxSeen = x => openGate(Gt.firstOf(x));
    const orderIds = () => Gt.bookOrder(BOOKS, BOOK_IDS, S.order);

    /* ---------- shell ---------- */
    document.title = M.title;
    const rootEl = document.documentElement;
    const T = P.theme || {};
    Object.keys(THEME).forEach(key => {
      if (T[key] != null) rootEl.style.setProperty(THEME[key], String(T[key]));
    });
    let css = '';
    BOOK_IDS.forEach(b => {
      css += '.ca-bk' + b + '{background:' + BOOKS[b].c + (BOOKS[b].ink ? ';color:' + BOOKS[b].ink : '') + '}\n';
    });
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    document.body.classList.add('cards-body');
    const app = document.createElement('div');
    app.id = 'app';
    app.className = 'cards-app';
    app.innerHTML =
      '<header class="top ca-top">' +
      '<a class="gl-home" href="' +
      ESC(UI.backHref) +
      '" title="Back to the Gravity Lab sandbox"><span aria-hidden="true">←</span> ' +
      ESC(UI.backLabel) +
      '</a>' +
      '<div class="ca-brand"><h1>' +
      ESC(M.title) +
      '</h1>' +
      (M.tagline ? '<p>' + M.tagline + '</p>' : '') +
      '</div>' +
      '<div class="ca-controls">' +
      (UI.bookLabel ? '<span class="ca-seglbl" id="caBkLbl">' + ESC(UI.bookLabel) + '</span>' : '') +
      '<div class="ca-seg" id="books" role="group" aria-labelledby="caBkLbl" aria-label="' +
      ESC(UI.booksAria) +
      '"></div>' +
      (CHRON ? '<div class="ca-seg ca-order" id="order" role="group" aria-label="Book order"></div>' : '') +
      '</div></header>' +
      '<nav class="ca-tabs" id="tabs" aria-label="Sections"></nav>' +
      '<main class="ca-main" id="view" tabindex="-1"></main>' +
      '<footer class="ca-foot"><span>' +
      (M.credits || '') +
      ' ' +
      ESC(fanNotice(M)) +
      '</span></footer>' +
      '<div class="ca-toast" id="toast" role="status" aria-live="polite" hidden></div>';
    document.body.appendChild(app);

    /* ---------- small renderers ---------- */
    const badge = b =>
      BOOKS[b]
        ? '<span class="ca-badge ca-bk' + b + '" title="' + ESC(BOOKS[b].title) + '">' + ESC(BOOKS[b].n) + '</span>'
        : '';
    const badges = x => {
      const bs = ARR(x.books).length ? ARR(x.books) : [Gt.firstOf(x)];
      return (
        '<span class="ca-badges">' +
        bs
          .filter(b => openGate(b))
          .map(badge)
          .join('') +
        '</span>'
      );
    };
    const more = x =>
      ARR(x.more)
        .filter(m => m && openGate(m[0]))
        .map(m => '<p>' + badge(m[0]) + ' ' + ESC(m[1]) + '</p>')
        .join('');
    const editorial = x =>
      x.editorial
        ? ' <span class="ca-ed" title="' + ESC(editorialNote(x, UI)) + '">' + ESC(UI.editorialLabel) + '</span>'
        : '';
    const placeName = key => {
      const e = IDX.by[key];
      return e ? e.item.name : key;
    };
    const placeBtn = key =>
      '<button class="ca-link" data-place="' + ESC(key) + '">' + ESC(placeName(key)) + '</button>';
    const facts = x =>
      ARR(x.facts).length
        ? '<dl class="ca-facts">' +
          ARR(x.facts)
            .map(f => '<dt>' + ESC(f[0]) + '</dt><dd>' + ESC(f[1]) + '</dd>')
            .join('') +
          '</dl>'
        : '';
    const src = x => (x.src ? '<p class="ca-src">Source: ' + ESC(x.src) + '</p>' : '');

    /* ---------- header ---------- */
    function renderBooks() {
      const ids = orderIds();
      let h = N.all
        ? '<button data-b="0" aria-pressed="' + (S.book === 0) + '" title="' + ESC(UI.allTitle) + '">All</button>'
        : '';
      h += ids
        .map(
          b =>
            '<button data-b="' +
            b +
            '" aria-pressed="' +
            (S.book === b) +
            '" title="' +
            ESC('Completed ' + BOOKS[b].title + (BOOKS[b].y ? ' (' + BOOKS[b].y + ')' : '')) +
            '">' +
            ESC(BOOKS[b].n) +
            '</button>',
        )
        .join('');
      $('#books').innerHTML = h;
      if (CHRON)
        $('#order').innerHTML = ['publication', 'chronological']
          .map(
            o =>
              '<button data-order="' +
              o +
              '" aria-pressed="' +
              (S.order === o) +
              '">' +
              (o === 'publication' ? 'Published' : 'Chronological') +
              '</button>',
          )
          .join('');
    }
    function renderTabs() {
      const tabs = ['places', 'chron'];
      if (K.journeys.length) tabs.push('journeys');
      if (K.codex.length) tabs.push('codex');
      tabs.push('about');
      $('#tabs').innerHTML = tabs
        .map(
          t =>
            '<button data-tab="' +
            t +
            '" aria-current="' +
            (S.tab === t ? 'page' : 'false') +
            '"' +
            (S.book == null && t !== 'about' ? ' disabled' : '') +
            '>' +
            ESC(UI.tabs[t]) +
            '</button>',
        )
        .join('');
    }

    /* ---------- the reading gate (EC-1) ---------- */
    function gateHtml() {
      const ids = orderIds();
      return (
        '<section class="ca-gate" aria-labelledby="caGateT"><h2 id="caGateT">' +
        ESC(UI.gateTitle) +
        '</h2><p>' +
        ESC(UI.gateText) +
        '</p><div class="ca-gate-books">' +
        ids
          .map(
            b =>
              '<button class="ca-gate-b" data-b="' +
              b +
              '"><span class="ca-badge ca-bk' +
              b +
              '">' +
              ESC(BOOKS[b].n) +
              '</span><b>' +
              ESC(BOOKS[b].title) +
              '</b><em>' +
              ESC((UI.bookLabel || 'Completed through') + ' ' + BOOKS[b].n) +
              '</em></button>',
          )
          .join('') +
        (N.all
          ? '<button class="ca-gate-b" data-b="0"><span class="ca-badge">All</span><b>' +
            ESC(UI.allTitle) +
            '</b></button>'
          : '') +
        '</div></section>'
      );
    }

    /* ---------- places (EC-2) ---------- */
    function treeHtml(key, depth) {
      const kids = Gt.children(IDX, key).filter(e => placeSeen(e.key));
      if (!kids.length) return '';
      return (
        '<ul class="ca-tree' +
        (depth ? '' : ' ca-tree-top') +
        '">' +
        kids
          .map(
            e =>
              '<li><button class="ca-node' +
              (e.kind === 'world' ? ' ca-world' : '') +
              '" data-place="' +
              ESC(e.key) +
              '" aria-current="' +
              (S.place === e.key) +
              '"><span>' +
              ESC(e.item.name) +
              '</span>' +
              (e.item.type || e.item.status
                ? '<em>' + ESC(e.item.type || e.item.status) + '</em>'
                : '') +
              '</button>' +
              treeHtml(e.key, depth + 1) +
              '</li>',
          )
          .join('') +
        '</ul>'
      );
    }
    function groupedTree() {
      const tops = Gt.children(IDX, null).filter(e => placeSeen(e.key));
      if (!K.groups.length) return treeHtml(null, 0);
      let h = '';
      const used = new Set();
      K.groups.forEach(g => {
        const ws = tops.filter(e => e.item.group === g.id);
        ws.forEach(e => used.add(e.key));
        if (!ws.length) return;
        h += '<h3 class="ca-grp">' + ESC(g.name || g.id) + '</h3>' + listOf(ws);
      });
      const rest = tops.filter(e => !used.has(e.key));
      if (rest.length) h += listOf(rest);
      return h;
    }
    function listOf(ws) {
      return (
        '<ul class="ca-tree ca-tree-top">' +
        ws
          .map(
            e =>
              '<li><button class="ca-node ca-world" data-place="' +
              ESC(e.key) +
              '" aria-current="' +
              (S.place === e.key) +
              '"><span>' +
              ESC(e.item.name) +
              '</span>' +
              (e.item.type || e.item.status ? '<em>' + ESC(e.item.type || e.item.status) + '</em>' : '') +
              '</button>' +
              treeHtml(e.key, 1) +
              '</li>',
          )
          .join('') +
        '</ul>'
      );
    }
    function placeDetail(key) {
      const e = IDX.by[key];
      const x = e.item;
      const crumbs = Gt.chain(IDX, key);
      let h =
        '<nav class="ca-crumbs" aria-label="Where this is"><button class="ca-link ca-back" data-place="">' +
        ESC(UI.placesTitle) +
        '</button>' +
        crumbs
          .slice(0, -1)
          .map(c => '<i aria-hidden="true">›</i>' + placeBtn(c.key))
          .join('') +
        '</nav>';
      h +=
        '<p class="ca-eyebrow">' +
        ESC(x.type || x.status || (e.kind === 'world' ? 'World' : 'Place')) +
        editorial(x) +
        '</p><h2 class="ca-h" tabindex="-1" id="caDetailT">' +
        ESC(x.name) +
        '</h2>' +
        badges(x);
      h += '<p class="ca-desc">' + ESC(x.desc || x.blurb || '') + '</p>' + more(x) + facts(x) + src(x);
      if (x.note) h += '<p class="ca-note">' + ESC(x.note) + '</p>';
      const kids = Gt.children(IDX, key).filter(c => placeSeen(c.key));
      if (kids.length)
        h +=
          '<h3 class="ca-sub">Within ' +
          ESC(x.name) +
          '</h3><ul class="ca-chips">' +
          kids.map(c => '<li>' + placeBtn(c.key) + '</li>').join('') +
          '</ul>';
      const evs = K.events.filter(ev => evSeen(ev) && Gt.eventPlaces(ev).includes(key));
      if (evs.length)
        h += '<h3 class="ca-sub">Events here</h3>' + evs.map(ev => eventCard(ev, true)).join('');
      const js = K.journeys.filter(j => jrSeen(j) && ARR(j.path).map(Gt.placeKey).includes(key));
      if (js.length)
        h +=
          '<h3 class="ca-sub">Journeys through here</h3><ul class="ca-chips">' +
          js
            .map(j => '<li><button class="ca-link" data-journey="' + ESC(j.id) + '">' + ESC(j.title) + '</button></li>')
            .join('') +
          '</ul>';
      return h;
    }
    function placesView() {
      const sel = S.place && placeSeen(S.place) ? S.place : null;
      return (
        '<div class="ca-places' +
        (sel ? ' has-sel' : '') +
        '"><section class="ca-pane ca-index" aria-label="' +
        ESC(UI.placesTitle) +
        '"><h2 class="ca-eyebrow">' +
        ESC(UI.placesTitle) +
        '</h2>' +
        groupedTree() +
        (S.book !== 0 && IDX.list.some(e => !placeSeen(e.key)) ? '<p class="ca-more">' + ESC(UI.moreNote) + '</p>' : '') +
        '</section><section class="ca-pane ca-detail" aria-live="polite">' +
        (sel ? placeDetail(sel) : introCard()) +
        '</section></div>'
      );
    }
    function introCard() {
      const IN = K.intro;
      return (
        '<p class="ca-eyebrow">' +
        ESC([M.author, M.years].filter(Boolean).join(' · ')) +
        '</p><h2 class="ca-h">' +
        ESC(M.series) +
        '</h2><p class="ca-desc">' +
        ESC(IN.text || '') +
        '</p>' +
        (IN.coverage ? '<p class="ca-note">' + ESC(IN.coverage) + '</p>' : '') +
        '<p class="ca-hint">' +
        ESC(UI.pickHint || 'Pick a place from the list to open its card.') +
        '</p>'
      );
    }

    /* ---------- the Chronicle ---------- */
    function eventCard(e, compact) {
      const pl = Gt.eventPlaces(e);
      return (
        '<article class="ca-card ca-ev' +
        (S.ev === e.id ? ' is-sel' : '') +
        '" id="ev-' +
        ESC(e.id) +
        '"><header>' +
        (compact ? badge(e.book) : '') +
        (e.locator ? '<span class="ca-loc">' + ESC(e.locator) + '</span>' : '') +
        '</header><h3>' +
        ESC(e.title) +
        '</h3><p>' +
        ESC(e.text || '') +
        '</p>' +
        (e.note ? '<p class="ca-note">' + ESC(e.note) + '</p>' : '') +
        '<p class="ca-meta">' +
        (compact ? '' : pl.map(placeBtn).join('<span aria-hidden="true"> · </span>')) +
        (ARR(e.who).length ? '<span class="ca-who">' + ESC(ARR(e.who).join(', ')) + '</span>' : '') +
        '</p></article>'
      );
    }
    function chronView() {
      let h = '<div class="ca-col"><h2 class="ca-eyebrow">' + ESC(UI.tabs.chron) + '</h2>';
      if (UI.chronNote) h += '<p class="ca-note">' + ESC(UI.chronNote) + '</p>';
      orderIds().forEach(b => {
        const evs = K.events.filter(e => e.book === b);
        if (!evs.length) return;
        h +=
          '<section class="ca-book"><h3 class="ca-bookh">' +
          badge(b) +
          ' ' +
          ESC(BOOKS[b].title) +
          (BOOKS[b].y ? ' <em>' + ESC(BOOKS[b].y) + '</em>' : '') +
          '</h3>';
        if (!openGate(b)) h += '<p class="ca-locked">Hidden until you have finished ' + ESC(BOOKS[b].title) + '.</p>';
        else h += evs.filter(evSeen).map(e => eventCard(e, false)).join('');
        h += '</section>';
      });
      return h + '</div>';
    }

    /* ---------- journeys (EC-3) ---------- */
    function journeyCard(j) {
      const stops = ARR(j.path).map(Gt.placeKey);
      return (
        '<article class="ca-card ca-jr' +
        (S.j === j.id ? ' is-sel' : '') +
        '" id="jr-' +
        ESC(j.id) +
        '"><header>' +
        badge(j.book || 1) +
        (j.locator ? '<span class="ca-loc">' + ESC(j.locator) + '</span>' : '') +
        '</header><h3>' +
        ESC(j.title || j.id) +
        '</h3>' +
        (ARR(j.who).length ? '<p class="ca-who">' + ESC(ARR(j.who).join(', ')) + '</p>' : '') +
        '<ol class="ca-steps">' +
        stops
          .map((s, i) => {
            const leg = ARR(j.legs)[i];
            return '<li>' + placeBtn(s) + (leg ? '<span class="ca-leg">' + ESC(leg) + '</span>' : '') + '</li>';
          })
          .join('') +
        '</ol>' +
        (j.text ? '<p>' + ESC(j.text) + '</p>' : '') +
        (j.note ? '<p class="ca-note">' + ESC(j.note) + '</p>' : '') +
        '</article>'
      );
    }
    function journeysView() {
      const js = K.journeys.filter(jrSeen);
      return (
        '<div class="ca-col"><h2 class="ca-eyebrow">' +
        ESC(UI.tabs.journeys) +
        '</h2>' +
        (UI.journeysNote ? '<p class="ca-note">' + ESC(UI.journeysNote) + '</p>' : '') +
        (js.length ? js.map(journeyCard).join('') : '<p class="ca-more">' + ESC(UI.moreNote) + '</p>') +
        '</div>'
      );
    }

    /* ---------- codex ---------- */
    function codexView() {
      const tab = K.codex.find(t => t.id === S.cx) || K.codex[0];
      const list = tab.list.filter(cxSeen);
      return (
        '<div class="ca-col"><h2 class="ca-eyebrow">' +
        ESC(UI.tabs.codex) +
        '</h2>' +
        (K.codex.length > 1
          ? '<div class="ca-seg ca-cxtabs">' +
            K.codex
              .map(
                t =>
                  '<button data-cx="' + ESC(t.id) + '" aria-pressed="' + (t === tab) + '">' + ESC(t.title) + '</button>',
              )
              .join('') +
            '</div>'
          : '') +
        (UI.codexNote ? '<p class="ca-note">' + ESC(UI.codexNote) + '</p>' : '') +
        '<div class="ca-grid">' +
        list
          .map(
            x =>
              '<article class="ca-card"' +
              (x.id ? ' id="cx-' + ESC(x.id) + '"' : '') +
              '><header>' +
              badges(x) +
              (x.role ? '<span class="ca-loc">' + ESC(x.role) + '</span>' : '') +
              '</header><h3>' +
              ESC(x.name) +
              editorial(x) +
              '</h3><p>' +
              ESC(x.desc) +
              '</p>' +
              more(x) +
              (x.note ? '<p class="ca-note">' + ESC(x.note) + '</p>' : '') +
              src(x) +
              '</article>',
          )
          .join('') +
        '</div>' +
        (S.book !== 0 && tab.list.length > list.length ? '<p class="ca-more">' + ESC(UI.moreNote) + '</p>' : '') +
        '</div>'
      );
    }

    /* ---------- about ---------- */
    function aboutView() {
      const IN = K.intro;
      return (
        '<div class="ca-col ca-about">' +
        introCard().replace('<p class="ca-hint">', '<p class="ca-hint" hidden>') +
        (ARR(IN.legend).length
          ? '<dl class="ca-facts">' +
            ARR(IN.legend)
              .map(l => '<dt>' + ESC(l[0]) + '</dt><dd>' + ESC(l[1]) + '</dd>')
              .join('') +
            '</dl>'
          : '') +
        '<h3 class="ca-sub">Reading gate</h3><p>' +
        ESC(
          UI.gateAbout ||
            'The buttons in the header say which book you have finished. Everything first met in a later book stays hidden, including in links.',
        ) +
        '</p>' +
        (M.srcnote ? '<p class="ca-src">' + ESC(M.srcnote) + '</p>' : '') +
        '<p class="ca-src">' +
        ESC(fanNotice(M)) +
        '</p></div>'
      );
    }

    /* ---------- render + state ---------- */
    function render(focus) {
      renderBooks();
      renderTabs();
      const v = $('#view');
      if (S.book == null) v.innerHTML = '<div class="ca-col">' + gateHtml() + aboutView() + '</div>';
      else if (S.tab === 'chron') v.innerHTML = chronView();
      else if (S.tab === 'journeys' && K.journeys.length) v.innerHTML = journeysView();
      else if (S.tab === 'codex' && K.codex.length) v.innerHTML = codexView();
      else if (S.tab === 'about') v.innerHTML = aboutView();
      else v.innerHTML = placesView();
      app.dataset.tab = S.book == null ? 'gate' : S.tab;
      syncURL();
      if (focus) {
        const el = document.getElementById(focus);
        if (el) {
          el.scrollIntoView({ block: 'nearest' });
          if (el.focus) el.focus({ preventScroll: true });
        }
      }
    }
    function toast(msg) {
      const t = $('#toast');
      t.textContent = msg;
      t.hidden = false;
      clearTimeout(toast.t);
      toast.t = setTimeout(() => (t.hidden = true), 5200);
    }
    function setBook(b) {
      S.book = b;
      store(BOOK_KEY, b);
      if (S.place && !placeSeen(S.place)) S.place = null;
      render();
    }
    function openPlace(key) {
      S.tab = 'places';
      S.place = key && placeSeen(key) ? key : null;
      render(S.place ? 'caDetailT' : null);
      if (S.place) $('#view').scrollTop = 0;
    }

    /* ---------- address bar ---------- */
    function syncURL() {
      const q = new URLSearchParams();
      if (S.book != null && S.book !== 0) q.set('book', S.book);
      if (S.book != null && S.tab !== 'places') q.set('tab', S.tab);
      if (S.place && S.tab === 'places') q.set('place', S.place);
      if (S.j && S.tab === 'journeys') q.set('journey', S.j);
      if (S.cx && S.tab === 'codex') q.set('cx', S.cx);
      const h = q.toString();
      const u = location.pathname + location.search + (h ? '#' + h : '');
      if (u !== location.pathname + location.search + location.hash) {
        try {
          history.replaceState(history.state, '', u);
        } catch (e) {
          /* file:// or sandboxed frame */
        }
      }
    }
    function parseHash() {
      const q = new URLSearchParams((location.hash || '').replace(/^#/, ''));
      const b = q.get('book');
      return {
        book: b == null || b === '' ? null : parseInt(b, 10),
        tab: q.get('tab'),
        place: q.get('place'),
        journey: q.get('journey'),
        cx: q.get('cx'),
      };
    }

    /* ---------- events ---------- */
    app.addEventListener('click', ev => {
      const t = ev.target.closest('button');
      if (!t || t.disabled) return;
      if (t.dataset.b != null) {
        setBook(+t.dataset.b);
        if (t.classList.contains('ca-gate-b')) $('#view').focus({ preventScroll: true });
      } else if (t.dataset.order) {
        S.order = t.dataset.order;
        store(ORDER_KEY, S.order);
        render();
      } else if (t.dataset.tab) {
        S.tab = t.dataset.tab;
        render();
        $('#view').scrollTop = 0;
      } else if (t.dataset.place != null) openPlace(t.dataset.place || null);
      else if (t.dataset.journey) {
        S.tab = 'journeys';
        S.j = t.dataset.journey;
        render('jr-' + S.j);
      } else if (t.dataset.cx) {
        S.cx = t.dataset.cx;
        render();
      }
    });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && S.place && S.tab === 'places') openPlace(null);
    });

    /* ---------- start ---------- */
    const so = load(ORDER_KEY);
    if (CHRON && (so === 'chronological' || so === 'publication')) S.order = so;
    else if (CHRON && UI.order === 'chronological') S.order = 'chronological';
    const raw = load(BOOK_KEY);
    const stored = raw == null || raw === '' ? null : parseInt(raw, 10);
    const st = parseHash();
    const r = Gt.resolveBook({ N, bookIds: BOOK_IDS, url: st.book, stored });
    S.book = r.book;
    if (S.book != null && r.book !== stored) store(BOOK_KEY, S.book);
    let locked = r.capped && st.book != null;
    if (st.tab && ['places', 'chron', 'journeys', 'codex', 'about'].includes(st.tab)) S.tab = st.tab;
    if (st.place) {
      if (S.book != null && placeSeen(st.place)) S.place = st.place;
      else if (IDX.by[st.place]) locked = true;
    }
    if (st.journey) {
      const j = K.journeys.find(x => x.id === st.journey);
      if (j && jrSeen(j)) S.j = j.id;
      else if (j) locked = true;
    }
    if (st.cx && K.codex.some(t => t.id === st.cx)) S.cx = st.cx;
    render(S.j ? 'jr-' + S.j : null);
    if (locked && S.book != null) toast(UI.lockedLink);
    const api = { pack: P, S, setBook, openPlace, model: K };
    root.__atlas = api;
    return api;
  }

  root.AtlasCards = { version: 1, start, model, fanNotice, editorialNote };
})(typeof window !== 'undefined' ? window : globalThis);
