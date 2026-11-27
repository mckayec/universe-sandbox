// Test-only places opt-in fixture (deep worlds R0-1). NOT shipped: it lives under tests/, is never copied to dist,
// and is applied only by tests/atlas-places-fixture.mjs, which appends this file to the Dune pack response in the
// browser (route interception). No file under public/atlas/packs is changed.
//
// It turns the dormant places engine on for one pack and gives it:
//   - two eligible book-1 destinations on Arrakis with scenes: Arrakeen (landmark fxres) and Sietch Tabr (fxcave);
//   - a later-book landmark/event: Arrakeen's fxlater (first book 2) and event m4 (book 2) pointing at it;
//   - a later-book enterable site: Paul's Keep (books 2-3, landmark fxkeep), event m3 (book 2).
// The names are deliberately fixture-labelled so a leak of later-book copy is easy to detect in rendered text.
// The pack has no `tree`, so this fixture is not tree-bearing (the DWT-03-R1 tree requirement is not triggered).
(function () {
  var P = window.ATLAS_PACKS && window.ATLAS_PACKS.dune;
  if (!P) throw new Error('places fixture: dune pack not registered');
  P.places = {};
  var arrakis = P.worlds.find(function (w) {
    return w.id === 'arrakis';
  });
  function site(id) {
    var s = arrakis.sites.find(function (x) {
      return x.id === id;
    });
    if (!s) throw new Error('places fixture: no site ' + id);
    return s;
  }
  function ev(id) {
    var e = P.events.find(function (x) {
      return x.id === id;
    });
    if (!e) throw new Error('places fixture: no event ' + id);
    return e;
  }
  site('arrakeen').scene = {
    kind: 'city',
    arch: 'desert',
    size: 'medium',
    landmarks: [
      {
        id: 'fxres',
        name: 'Fixture Residency',
        desc: 'Fixture landmark, book 1.',
        kind: 'palace',
        at: [0.15, 0.1],
        books: [1],
      },
      {
        id: 'fxlater',
        name: 'Fixture Later Hall',
        desc: 'Fixture landmark first seen in book 2.',
        kind: 'hall',
        at: [-0.35, 0.2],
        first: 2,
        books: [2],
      },
    ],
  };
  site('tabr').scene = {
    kind: 'sietch',
    landmarks: [
      { id: 'fxcave', name: 'Fixture Cave', desc: 'Fixture landmark, book 1.', kind: 'cave', at: [0, 0.1], books: [1] },
    ],
  };
  site('keep').scene = {
    kind: 'fortress',
    landmarks: [
      {
        id: 'fxkeep',
        name: 'Fixture Keep Tower',
        desc: 'Fixture landmark, book 2.',
        kind: 'keep',
        at: [0, 0],
        books: [2],
      },
    ],
  };
  ev('d4').lm = 'fxres';
  ev('d6').lm = 'fxcave';
  ev('m4').lm = 'fxlater';
  ev('m3').lm = 'fxkeep';
})();
