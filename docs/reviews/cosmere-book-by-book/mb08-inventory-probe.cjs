// Read-only inventory. Usage: node mb08-inventory-probe.cjs PR48.js PR24.js PR37.js
// Lexical matches are discovery evidence, not canon or runtime validation.
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const inputs = [
  ['PR48', '52534d0975af39e620e05a43c2f4f05dc6b4b1fc', '0fd66c7cca0085872e8f8a3d2154e4010356b9e6'],
  ['PR24', 'cf25cda66e91c573c421a0f3712623db72737a3b', '3ff0aab059fa54e00f6e2ccc7b849d4bd206d958'],
  ['PR37', '03394c32816fcb5c95261bf6a9ea4520381a5838', '5a74e300eaf88b2d3c81fa9bc957584cd4708e33']
];
if (process.argv.length !== 5) throw Error('Provide three pinned cosmere.js inputs, PR48/24/37 order');
const output = inputs.map(([branch, commit, expectedBlob], i) => {
  const bytes = fs.readFileSync(process.argv[i + 2]);
  const blob = crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
  if (blob !== expectedBlob) throw Error(`${branch}: wrong input blob ${blob}`);
  const context = {window: {}};
  vm.runInNewContext(bytes.toString('utf8'), context, {timeout: 2000});
  const pack = context.window.ATLAS_PACKS.cosmere;
  const named = [], sharedContext = [];
  function walk(value, path, parent) {
    if (typeof value === 'string') {
      const item = {path, value, parentId: parent && parent.id || null};
      if (/\bjak\b|eltania|handerwym/i.test(value)) named.push(item);
      if (/\bkoloss(?:-blooded)?\b|\broughs\b/i.test(value)) sharedContext.push(item);
    } else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`, value);
    }
  }
  walk(pack, 'pack', null);
  return {branch, commit, blob, blobVerified: true,
    counts: {namedStringHits: named.length, sharedContextStringHits: sharedContext.length},
    named, sharedContext};
});
console.log(JSON.stringify({scope: 'MB08 lexical inventory; no semantic completeness or runtime claim', inputs: output}, null, 2));
