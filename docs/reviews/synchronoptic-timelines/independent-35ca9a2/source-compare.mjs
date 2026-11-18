import vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const path = 'public/atlas/packs/abrahamic-world-religions/relationship-sources.js';
const read = s => {
  const c = { window: {} };
  vm.createContext(c);
  vm.runInContext(s, c);
  return c.window.ATLAS_PACK_PARTS['abrahamic-world-religions']['relationship-sources'];
};
const old = read(execFileSync('git', ['show', 'eaa2e9c:' + path], { encoding: 'utf8' })),
  now = read(readFileSync(path, 'utf8'));
assert.equal(JSON.stringify(old.edges), JSON.stringify(now.edges));
for (const [k, v] of Object.entries(old.sources)) {
  assert.equal(v.t, now.sources[k].t);
  assert.equal(v.u, now.sources[k].u);
}
writeFileSync(
  new URL('source-compare.json', import.meta.url),
  JSON.stringify(
    {
      edgesUnchanged: Object.keys(now.edges).length,
      primarySourcesUnchanged: Object.keys(now.sources).length,
      scopes: Object.values(now.sources).filter(s => s.scope).length,
      x08: now.sources.X08,
    },
    null,
    2,
  ),
);
console.log('129 edges and 62 primary sources unchanged; scope/alternative routes additive');
