// Post-build step: stamp dist/sw.js with a hash of the built files, so each deploy gets its own service-worker
// cache (old caches are deleted on activate). Run after `vite build`; see package.json "build".
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const swPath = join(dist, 'sw.js');

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const hash = createHash('sha256');
for (const file of walk(dist).sort()) {
  if (file === swPath) continue;
  hash.update(relative(dist, file));
  hash.update(readFileSync(file));
}
const id = hash.digest('hex').slice(0, 12);
const sw = readFileSync(swPath, 'utf8');
if (!sw.includes('__BUILD_ID__')) throw new Error('dist/sw.js has no __BUILD_ID__ placeholder');
writeFileSync(swPath, sw.replaceAll('__BUILD_ID__', id));
console.log(`sw.js stamped with build ${id}`);
