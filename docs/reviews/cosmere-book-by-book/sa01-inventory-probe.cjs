/* Read-only SA01 inventory; no canon or rendering certification.
Usage: node sa01-inventory-probe.cjs DIR
DIR contains head.js (PR48), pack24.js and pack37.js at the pinned blobs. */
"use strict";
const fs = require("node:fs"), vm = require("node:vm"), path = require("node:path");
const crypto = require("node:crypto"), assert = require("node:assert/strict");
const dir = process.argv[2];
if (!dir) throw Error("Input directory required");
const inputs = [
 [48,"head.js","fccfe2c7023b93a91b52df1f812a17f0e94e3ed3","0d1dddaec48658936ab7a99225a9b089837a1f94"],
 [24,"pack24.js","cf25cda66e91c573c421a0f3712623db72737a3b","3ff0aab059fa54e00f6e2ccc7b849d4bd206d958"],
 [37,"pack37.js","03394c32816fcb5c95261bf6a9ea4520381a5838","5a74e300eaf88b2d3c81fa9bc957584cd4708e33"]
];
const eventIds=["e17","e18","e19","e20","e21","e79","e80","e81","e82","e83","e84","e85","e86"];
const siteIds=["shatteredplains","warcamps","tower","kholinar","kharbranth"];
const out={scope:"13 key-4 event slots, five base sites, Roshar parent prose/metadata (geometry omitted); scene IDs only",branches:[]};
let present=0,absent=0;
for (const [pr,file,head,expected] of inputs) {
 const b=fs.readFileSync(path.join(dir,file));
 const sha=crypto.createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\0"),b])).digest("hex");
 assert.equal(sha,expected,"Pinned input PR"+pr);
 const c={window:{}};vm.runInNewContext(b.toString("utf8"),c,{timeout:1000});
 const p=JSON.parse(JSON.stringify(c.window.ATLAS_PACKS.cosmere));
 const w=p.worlds.find(w=>w.id==="roshar");assert.ok(w);
 const events=eventIds.map(id=>{const record=p.events.find(e=>e.id===id&&e.book===4&&e.world==="roshar")||null;record?present++:absent++;return {id,record};});
 assert.deepEqual(p.events.filter(e=>e.book===4).map(e=>e.id).sort(),events.filter(x=>x.record).map(x=>x.id).sort(),"All actual key-4 events accounted");
 const sites=siteIds.map(id=>{const s=w.sites.find(s=>s.id===id);assert.ok(s);present++;const {scene,...base}=s;return {record:base,landmarkIds:(scene?.landmarks||[]).map(l=>l.id)};});
 const {gfx,map,sites:ignored,...parent}=w;present++;
 out.branches.push({pr,head,blob:sha,events,sites,parent});
}
out.counts={inputHashes:{matched:3,total:3},recordSlots:{inspected:present+absent,total:57,present,absent},completeWorksApproved:0,fullWorkLedger:33};
assert.equal(present+absent,57);
process.stdout.write(JSON.stringify(out,null,2)+"\n");
