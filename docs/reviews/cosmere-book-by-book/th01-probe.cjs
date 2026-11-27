// Read-only TH01 source inventory and one-sentence candidate scope check.
// Usage: node th01-probe.cjs PR24-cosmere.js PR37-cosmere.js PR48-cosmere.js
// Inputs must be the exact GitHub UTF-8 blobs below; no application files are written.
const fs = require("node:fs");
const vm = require("node:vm");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const inputs = [
  {pr:24,head:"cf25cda66e91c573c421a0f3712623db72737a3b",blob:"3ff0aab059fa54e00f6e2ccc7b849d4bd206d958"},
  {pr:37,head:"03394c32816fcb5c95261bf6a9ea4520381a5838",blob:"5a74e300eaf88b2d3c81fa9bc957584cd4708e33"},
  {pr:48,head:"0636b08ad9096274c793e045cc601324945844d9",blob:"7850087a03ff82650632d28015c755568f8d784f"}
];
const oldSentence = "No fire, no blood: the Simple Rules keep you alive.";
const newSentence = "To avoid drawing shades, the Simple Rules prohibit kindling flame, shedding another’s blood, and running at night.";
const parse = source => {
  const context = {window:{}};
  vm.runInNewContext(source, context, {timeout:5000});
  return JSON.parse(JSON.stringify(context.window.ATLAS_PACKS.cosmere));
};
assert.equal(process.argv.length, 5, "Supply exactly three immutable pack snapshots");
const output = inputs.map((input, i) => {
  const source = fs.readFileSync(process.argv[i+2], "utf8");
  const blob = crypto.createHash("sha1").update("blob " + Buffer.byteLength(source) + "\0").update(source).digest("hex");
  assert.equal(blob, input.blob, "Input Git blob mismatch");
  assert.equal(source.split(oldSentence).length-1, 1, "Old sentence must occur exactly once");
  assert.equal(source.includes(newSentence), false, "Candidate sentence unexpectedly present");
  const before = parse(source);
  const candidateSource = source.replace(oldSentence, newSentence);
  const candidate = parse(candidateSource);
  const world = before.worlds.find(w=>w.id==="threnody");
  const site = world.sites.find(s=>s.id==="forests");
  const changed = candidate.worlds.find(w=>w.id==="threnody").sites.find(s=>s.id==="forests");
  assert.equal(changed.desc, site.desc.replace(oldSentence,newSentence));
  changed.desc = site.desc;
  assert.deepEqual(candidate,before,"Another parsed field changed");
  assert.equal(candidateSource.replace(newSentence,oldSentence),source,"Another source byte changed");
  const worlds = before.worlds.filter(w=>w.group==="threnodite");
  const landmarks = world.sites.flatMap(s=>(s.scene?.landmarks||[]).map(l=>({site:s.id,...l})));
  return {...input,hashVerified:true,sourceReversalEqual:true,parsedPackReversalEqual:true,
    totalWorlds:before.worlds.length,totalEvents:before.events.length,
    threnoditeWorlds:worlds.map(w=>({id:w.id,books:w.books,first:w.first,req:w.req||null,needs:w.needs||null})),
    sites:world.sites.map(s=>({id:s.id,books:s.books,req:s.req||null,needs:s.needs||null,desc:s.desc})),
    nestedLandmarks:landmarks,
    events:before.events.filter(e=>e.world==="threnody"),
    candidate:{field:"worlds[threnody].sites[forests].desc",oldSentence,newSentence},
    limitations:["in-memory candidate only","no selector helper or rendered test","no full-work canon approval"]
  };
});
console.log(JSON.stringify({checkedAt:"2026-11-20",inputs:output,summary:{
  verifiedBlobs:3,expectedBlobs:3,matchingOldSentences:3,expectedOldSentences:3,
  sourceReversals:3,parsedReversals:3,renderedCases:0,fullWorkApprovals:0,fullWorkDenominator:33
}},null,2));
