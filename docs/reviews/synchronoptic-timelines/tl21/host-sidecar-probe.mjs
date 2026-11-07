// Checkpoint 21 probe: the committed proposed pilot sidecar (tl20) loaded through the host loader (loadSidecar)
// against the actual Standard Works pack at PR33 and the actual timeline modules on this branch.
// usage: node host-sidecar-probe.mjs <lds-standard-works.js at PR33 3e3701f>
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const here = new URL('.', import.meta.url);
const atlas = new URL('../../../../public/atlas/', here);
const packPath = process.argv[2];
const bytes = readFileSync(packPath);
const blob = createHash('sha1')
  .update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes]))
  .digest('hex');
const sidecar = JSON.parse(readFileSync(new URL('../tl20/pilot-sidecar.v1.json', here), 'utf8'));

function fresh() {
  const ctx = { URLSearchParams };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(bytes.toString('utf8'), ctx);
  for (const f of ['timeline.js', 'timeline-grounding.js'])
    vm.runInContext(readFileSync(new URL(f, atlas), 'utf8'), ctx);
  const P = ctx.ATLAS_PACKS['lds-standard-works'];
  return { P, model: ctx.AtlasTimeline.adapterFor(P)(P), G: ctx.AtlasTimelineGrounding };
}
const hostVersion = 'lds-standard-works/timeline-pilot@r1;pack-blob:' + blob;
console.log('pack blob ' + blob);
console.log('host sourceVersion ' + hostVersion);
console.log('manifest sourceVersion ' + sidecar.manifest.sourceVersion);

const runs = [
  ['current host version', s => s, { sourceVersion: hostVersion }],
  ['absent sidecar', () => null, { sourceVersion: hostVersion }],
  ['host declares no version', s => s, {}],
  ['host version differs (stale)', s => s, { sourceVersion: hostVersion + '-next' }],
  ['other pack', s => ({ ...s, pack: 'other' }), { sourceVersion: hostVersion }],
];
for (const [name, make, host] of runs) {
  const { P, model, G } = fresh();
  const out = G.loadSidecar(model, make(sidecar), { packId: P.id, ...host });
  const grounded = model.edges.filter(e => e.grounding).length;
  const why = {};
  out.rejected.forEach(r => (why[r.why] = (why[r.why] || 0) + 1));
  console.log(
    `${name}: status=${out.status} promoted=${out.promoted.length} rejected=${out.rejected.length} ` +
      `revoked=${out.revoked.length} changed=${out.changed.length} groundedEdges=${grounded}` +
      (out.why ? ` why="${out.why}"` : ''),
  );
  Object.keys(why).forEach(k => console.log('  ' + why[k] + ' × ' + k));
}
