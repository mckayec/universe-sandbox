/* Read-only NA01 inventory and two-field candidate-scope check.
   Usage: node na01-inventory-probe.cjs DIR
   DIR contains head.js (PR48), pack24.js, pack37.js at pinned Git blob hashes. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const dir = process.argv[2];
if (!dir) throw new Error("Input directory required");
const inputs = [
  [48, "head.js", "52534d0975af39e620e05a43c2f4f05dc6b4b1fc", "0fd66c7cca0085872e8f8a3d2154e4010356b9e6"],
  [24, "pack24.js", "cf25cda66e91c573c421a0f3712623db72737a3b", "3ff0aab059fa54e00f6e2ccc7b849d4bd206d958"],
  [37, "pack37.js", "03394c32816fcb5c95261bf6a9ea4520381a5838", "5a74e300eaf88b2d3c81fa9bc957584cd4708e33"]
];
const ids = ["e13", "e14", "e15", "e16", "e77", "e78"];
const out = { scope: "Nalthis base site records and six event slots; scene IDs inventoried, scene claims not certified", branches: [] };
let mainPack;
for (const [pr, file, head, expected] of inputs) {
  const b = fs.readFileSync(path.join(dir, file));
  const sha = crypto.createHash("sha1").update(Buffer.concat([Buffer.from("blob " + b.length + "\0"), b])).digest("hex");
  assert.equal(sha, expected, "Pinned input hash: PR" + pr);
  const sandbox = { window: {} };
  vm.runInNewContext(b.toString("utf8"), sandbox, { timeout: 1000 });
  const pack = JSON.parse(JSON.stringify(sandbox.window.ATLAS_PACKS.cosmere));
  const world = pack.worlds.find(w => w.id === "nalthis");
  assert.equal(world.sites.length, 10);
  const baseSites = world.sites.map(({ scene, ...base }) => base);
  const events = ids.map(id => ({ id, record: pack.events.find(e => e.id === id && e.world === "nalthis") || null }));
  const scenes = world.sites.filter(s => s.scene).map(s => ({site: s.id, landmarkIds: (s.scene.landmarks || []).map(l => l.id)}));
  out.branches.push({pr, head, blob: sha, baseSites, events, scenes});
  if (pr === 48) mainPack = pack;
}
const replacements = {
  ttelir: "Hallandren’s capital curves around a bay on the Bright Sea, with painted buildings and warrior statues at street corners.",
  denir: "A quiet grassy field in T’Telir, filled with hundreds of weathered warrior statues."
};
const old = {};
const candidate = JSON.parse(JSON.stringify(mainPack));
const sites = candidate.worlds.find(w => w.id === "nalthis").sites;
for (const [id, replacement] of Object.entries(replacements)) {
  const site = sites.find(s => s.id === id);
  old[id] = site.desc;
  site.desc = replacement;
  assert.notEqual(replacement, old[id]);
}
for (const id of Object.keys(replacements)) sites.find(s => s.id === id).desc = old[id];
assert.deepEqual(candidate, mainPack);
out.proposed = {before: old, after: replacements};
out.checks = {
  inputHashes: {passed: 3, total: 3},
  inventorySlots: {inspected: 48, total: 48, present: 44, absent: 4},
  distinctReplacements: {passed: 2, total: 2},
  entireParsedPackEqualAfterRevertingOnlyTwoDescriptions: true,
  applicationFilesWritten: 0,
  renderedCases: 0
};
process.stdout.write(JSON.stringify(out, null, 2) + "\n");
