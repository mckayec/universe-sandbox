// Synthetic predicate controls for PR45 1ceb4b224b5343f06116ccd581cb1ceb10ad9f5f.
// Exact judge/near and note assertions extracted from the pinned builder probe.
// No browser, DOM measurement, canon or application behavior is simulated as verified.
const assert=require('node:assert/strict');
const EPS = 0.01;
const near = (a, b) => a != null && b != null && Math.abs(a - b) < EPS;
/* the per-lane predicate: compares rendered geometry only, in root SVG user space */
function judge(base, s, laneId) {
  const drawn = new Map(s.paths.map(x => [x.id, x]));
  const bar = s.sumY[laneId];
  let ok = true;
  let folded = 0;
  let inside = 0;
  const bad = [];
  /* no summary bar is acceptable only for a lane with no dated record on the chart; any folded end then fails below */
  if (bar == null && base.markLanes.includes(laneId)) (ok = false), bad.push('no rendered summary bar for dated ' + laneId);
  for (const x of base.paths) {
    const e = base.edges[x.id];
    const inA = e.fromLane === laneId;
    const inB = e.toLane === laneId;
    const d = drawn.get(x.id);
    if (inA && inB) {
      inside++;
      if (d) (ok = false), bad.push(x.id + ' drawn although inside');
      continue;
    }
    if (!d) {
      ok = false;
      bad.push(x.id + ' dropped');
      continue;
    }
    const ringA = s.rings.find(r => r.id === x.id && r.end === 'from');
    const ringB = s.rings.find(r => r.id === x.id && r.end === 'to');
    if (inA || inB) folded++;
    if (d.folded !== (inA || inB)) (ok = false), bad.push(x.id + ' folded class');
    if (!!ringA !== inA || !!ringB !== inB) (ok = false), bad.push(x.id + ' ring');
    if (inA && !near(d.ya, bar)) (ok = false), bad.push(x.id + ' from end ' + d.ya + ' off summary ' + bar);
    if (inB && !near(d.yb, bar)) (ok = false), bad.push(x.id + ' to end ' + d.yb + ' off summary ' + bar);
    if (ringA && !near(ringA.cy, bar)) (ok = false), bad.push(x.id + ' from ring ' + ringA.cy + ' off summary ' + bar);
    if (ringB && !near(ringB.cy, bar)) (ok = false), bad.push(x.id + ' to ring ' + ringB.cy + ' off summary ' + bar);
    if (!inA && !near(d.ya, s.edges[x.id].fromRow)) (ok = false), bad.push(x.id + ' from row moved');
    if (!inB && !near(d.yb, s.edges[x.id].toRow)) (ok = false), bad.push(x.id + ' to row moved');
    if ((inA || inB) && !/inside the collapsed .* lane; expand it for the exact row/.test(d.title))
      (ok = false), bad.push(x.id + ' title');
  }
  return { ok, folded, inside, bad };
}

const baseline={paths:[{id:'cross'}],edges:{cross:{fromLane:'A',toLane:'B'}},markLanes:['A','B']};
function snapshot(){return {paths:[{id:'cross',ya:100,yb:200,folded:true,title:'R is inside the collapsed A lane; expand it for the exact row'}],rings:[{id:'cross',end:'from',cy:100}],edges:{cross:{fromRow:null,toRow:200}},sumY:{A:100}}}
let n=0;
function test(name,change,want){const s=snapshot();change(s);assert.equal(judge(baseline,s,'A').ok,want,name);n++;console.log('PASS '+name);}
test('valid folded geometry',()=>{},true);
test('paired 26px shift rejected',s=>{s.paths[0].ya+=26;s.rings[0].cy+=26},false);
test('ring-only shift rejected',s=>s.rings[0].cy+=26,false);
test('path-only shift rejected',s=>s.paths[0].ya+=26,false);
test('missing summary rejected',s=>delete s.sumY.A,false);
test('wrong-lane summary rejected',s=>{s.sumY.B=100;delete s.sumY.A},false);
test('expanded end displacement rejected',s=>s.paths[0].yb+=26,false);
test('missing folded ring rejected',s=>s.rings=[],false);
function notePass(text){let result;const s={note:text};const folded=1,inside=2,tag='fixture',laneId='A';const check=(name,pass)=>result=pass;
    const nf = (s.note.match(/(\d+) brackets? ends? in an open ring/) || [])[1];
    const ni = (s.note.match(/(\d+) relationships? (?:is|are) inside one collapsed lane/) || [])[1];
    check(tag + ' collapse ' + laneId + ': Overview note numbers equal the folded/inside counts', +(nf || 0) === folded && +(ni || 0) === inside, {
      folded,
      inside,
      noteFolded: nf ?? null,
      noteInside: ni ?? null,
    });

return result;}
assert.equal(notePass('1 bracket ends in an open ring. 2 relationships are inside one collapsed lane'),true);n++;console.log('PASS correct numeric note');
assert.equal(notePass('7 brackets end in an open ring. 8 relationships are inside one collapsed lane'),false);n++;console.log('PASS wrong numeric note rejected');
console.log(n+'/'+n+' independent synthetic predicate checks passed');
