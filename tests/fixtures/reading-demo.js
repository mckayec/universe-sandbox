/* SYNTHETIC fixture for tests/atlas-reading.test.ts (COS-BB-001 helper infrastructure).
   Work IDs, titles, buckets and preset orders here are illustrative only. They are NOT researched Cosmere data
   and must never be copied into a production pack. */
window.ATLAS_PACKS = window.ATLAS_PACKS || {};
window.ATLAS_PACKS['reading-demo'] = {
  id: 'reading-demo',
  spoilers: {
    mode: 'cumulative',
    works: [
      { id: 'fx-a1', title: 'Fixture A1', y: 1, pub: 1, bucket: 2 },
      { id: 'fx-a2', title: 'Fixture A2', y: 2, pub: 2, bucket: 2 },
      { id: 'fx-a3', title: 'Fixture A3', y: 3, pub: 3, bucket: 2 },
      { id: 'fx-b1', title: 'Fixture B1', y: 4, pub: 4, bucket: 3 },
      { id: 'fx-c1', title: 'Fixture C1', y: 5, pub: 5 },
    ],
    presets: [
      {
        id: 'pub',
        label: 'Publication order',
        versions: [
          { v: 1, seq: ['fx-a1', 'fx-a2', 'fx-a3', 'fx-b1'] },
          { v: 2, seq: ['fx-a1', 'fx-a2', 'fx-c1', 'fx-a3', 'fx-b1'] },
        ],
      },
    ],
  },
};
