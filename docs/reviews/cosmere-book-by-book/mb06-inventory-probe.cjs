/* Read-only MB06 selected-record inventory. Run with the exact same input directory as mb04-inventory-probe.cjs. */
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path'),assert=require('node:assert/strict');
const dir=process.argv[2]||'.';
const specs=[
 [48,'88dc6627423a65eb117a10663b4f91551fb3cc70','a76929639d9cc848e2c52bcaa39622fde3cf239c'],
 [24,'cf25cda66e91c573c421a0f3712623db72737a3b','3ff0aab059fa54e00f6e2ccc7b849d4bd206d958'],
 [37,'03394c32816fcb5c95261bf6a9ea4520381a5838','5a74e300eaf88b2d3c81fa9bc957584cd4708e33']
];
const proposed='Wax investigates murders in Elendel as labor unrest grows.';
const out={scope:'MB06 e27 plus selected overlap inventory, not exhaustive full-work audit',snapshots:[]};
for(const [pr,head,want]of specs){
 const b=fs.readFileSync(path.join(dir,'pack'+pr+'.js'));
 const sha=crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');assert.equal(sha,want);
 const c={window:{}};vm.runInNewContext(b.toString('utf8'),c);
 const p=c.window.ATLAS_PACKS.cosmere,w=p.worlds.find(w=>w.id==='scadrial'),city=w.sites.find(s=>s.id==='elendel'),e=p.events.find(e=>e.id==='e27');
 const select=id=>(city.scene?.landmarks||[]).find(x=>x.id===id)||null;
 out.snapshots.push({pr,head,sha,records:{scadrial:{id:w.id,first:w.first,books:w.books,gate:w.gate||null},elendel:city,e27:e,e92:p.events.find(e=>e.id==='e92')||null,governor:select('governor'),eastbridge:select('eastbridge')}});
 if(pr===48){
  const before=JSON.stringify(p),old=e.text;
  e.text=proposed;
  const candidate=JSON.stringify(p);
  assert.notEqual(candidate,before);
  e.text=old;assert.equal(JSON.stringify(p),before);
  out.proposal={target:'events[id=e27].text',old,proposed,implemented:false,oneFieldRoundTripRestoresWholeParsedPack:true,gatePresent:Object.hasOwn(e,'gate')};
 }
}
out.counts={inputHashes:'3/3',selectedRecordSlots:'18/18 (including explicit absence)',proposedTextFields:1,remoteApplicationEdits:0};
console.log(JSON.stringify(out,null,2));
