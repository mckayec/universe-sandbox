/* Placeholder world-only pack (PACK_FORMAT section 22) for tests. No real series: names are invented test data. */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})['cards-demo'] = {
  id: 'cards-demo',
  layout: 'cards',
  meta: { title: 'Cards Demo', series: 'Demo Series', author: 'Nobody' },
  books: {
    1: { n: 'I', title: 'First', y: 2001, chron: 2 },
    2: { n: 'II', title: 'Second', y: 2003, chron: 1 },
    3: { n: 'III', title: 'Third', y: 2005, chron: 3 },
  },
  spoilers: { mode: 'cumulative', start: 'choose', all: false },
  groups: [{ id: 'main', name: 'Main' }],
  worlds: [
    {
      id: 'setting',
      name: 'Book-one setting',
      group: 'main',
      first: 1,
      editorial: true,
      blurb: 'Container.',
      sites: [
        { id: 'city', name: 'City', type: 'city', first: 1, desc: 'A city.' },
        { id: 'tower', name: 'Tower', parent: 'city', first: 1, desc: 'In the city.' },
        { id: 'vault', name: 'Vault', parent: 'tower', first: 3, desc: 'Under the tower.' },
      ],
    },
    {
      id: 'other',
      name: 'Other world',
      group: 'main',
      first: 2,
      blurb: 'Revealed later.',
      sites: [{ id: 'gate', name: 'Gate', desc: 'Inherits gate 2.' }],
    },
  ],
  events: [
    { id: 'e1', book: 1, world: 'setting', site: 'tower', title: 'Climb', text: 'Up.' },
    { id: 'e2', book: 2, world: 'other', site: 'gate', places: ['setting/city'], title: 'Cross', text: 'Over.' },
  ],
  journeys: [
    { id: 'j1', book: 1, title: 'Walk', path: ['setting/city', 'setting/tower'] },
    {
      id: 'j2',
      book: 3,
      title: 'Descent',
      path: [
        { world: 'setting', site: 'tower' },
        { world: 'setting', site: 'vault' },
      ],
    },
  ],
  codex: [
    {
      id: 'ideas',
      title: 'Ideas',
      list: [{ id: 'x1', name: 'Idea', first: 1, desc: 'An idea.', more: [[2, 'Later.']] }],
    },
  ],
};
