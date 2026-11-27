// Node 24+, SIMULATOR_REVIEW_ROOT points to exact 8de9128 checkout.
// Actual extracted handlers with small DOM/scene/audio adapters; not browser evidence.
import fs from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(process.env.SIMULATOR_REVIEW_ROOT);
const read=p=>fs.readFileSync(resolve(root,p),'utf8');
const F=await import(pathToFileURL(resolve(root,'src/feedback.ts')).href);
const feed=read('src/ui/feed.ts'),flow=read('src/ui/exhibit-flow.ts');
const extract=(s,a,b)=>stripTypeScriptTypes(s.slice(s.indexOf(a),s.indexOf(b)).replaceAll('export function','function'));
const elements=new Map();
const document={querySelector(s){if(!elements.has(s)){const classes=new Set();elements.set(s,{hidden:true,textContent:'',setAttribute(k,v){this[k]=v},classList:{toggle(k,v){if(v===undefined)v=!classes.has(k);v?classes.add(k):classes.delete(k);return v},contains:k=>classes.has(k)}})}return elements.get(s)}};
const app={feedbackMode:'quiet',effectsMode:'full',selectedBody:null,attractMode:false,idleSeconds:120,speed:1,paused:false};
let banners=[],sounds=[],vibrations=[],rendered=0;
const log=[],audio={play(...a){sounds.push(a)}};
const museumCode=extract(feed,'export function museumEvent','/** Matches the compact');
const museumEvent=new Function('recordEvent','presentEvent','exhibitEvents','app','renderExhibitEvents','updateInspector','toast','audio','navigator',museumCode+';return museumEvent;')(F.recordEvent,F.presentEvent,log,app,()=>rendered++,()=>{},s=>banners.push(s),audio,{vibrate:x=>vibrations.push(x)});
const noop=()=>{};
const loadCode=extract(flow,'export function loadExhibit','/**\n * A Slow Feast');
const names=['resetSimulation','app','exhibitById','THREE','addBody','registerCosmicGroup','select','document','showGuide','museumEvent','exhibitLoadOrigin'];
const values=[noop,app,()=>({title:'Feeding',objective:'Observe',accent:'#fff'}),{Vector3:class{}},(kind,p,v,data)=>({kind,...data}),noop,b=>{app.selectedBody=b},document,noop,museumEvent,F.exhibitLoadOrigin];
const loadExhibit=new Function(...names,loadCode+';return loadExhibit;')(...values);
const session={preAttract:null};
const attractCode=extract(feed,'function startAttractMode','export function toast');
const updateAttractMode=new Function('session','snapshotUniverse','app','exhibitEvents','document','loadExhibit','showNarration','setSimulationSpeed','reducedMotion',attractCode+';return updateAttractMode;')(session,()=>({}),app,log,document,loadExhibit,noop,s=>{app.speed=s},{matches:false});
const results=[];const check=(name,fn)=>{try{fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}};
check('quiet simulation records and updates body without presentation',()=>{const body={};museumEvent('Planetary fragmentation','detail','#fff',body);assert.equal(log.length,1);assert.equal(rendered,1);assert.equal(body.lastEvent,'Planetary fragmentation: detail');assert.equal(banners.length+sounds.length+vibrations.length,0)});
check('direct exhibit action remains audible and visible in quiet',()=>{loadExhibit('feed-black-hole',false);assert.deepEqual(banners,['Guided exhibit']);assert.equal(sounds.length,1)});
banners=[];sounds=[];
check('quiet idle start and repeated attract restart produce no unsolicited banner or sound',()=>{updateAttractMode(.1);updateAttractMode(49);assert.equal(app.attractMode,true);assert.equal(banners.length+sounds.length,0)});
const idleEvidence={banners:[...banners],sounds:[...sounds],attractMode:app.attractMode};
check('full feedback simulation presents and vibrates',()=>{app.feedbackMode='full';banners=[];sounds=[];vibrations=[];museumEvent('Planetary fragmentation','detail');assert.equal(banners.length,1);assert.equal(sounds.length,1);assert.equal(vibrations.length,1)});
check('history remains bounded after repeated quiet events',()=>{app.feedbackMode='quiet';for(let i=0;i<20;i++)museumEvent('Event '+i,'d');assert.equal(log.length,8);assert.equal(log[0].title,'Event 19')});
// select and setDetailsExpanded are the final functions in this exact source.
const select=new Function('app','document','detailsAfterSelect','updateLifeZoneButton','selectionRing','updateInspector','updateScienceOverlays',stripTypeScriptTypes(feed.slice(feed.indexOf('export function select')).replaceAll('export function','function'))+';return {select,setDetailsExpanded};')(app,document,F.detailsAfterSelect,noop,{},noop,noop);
check('actual selection resets sheet for rebuilt object with same ID',()=>{const a={id:1};select.select(a);select.setDetailsExpanded(true);select.select(a);assert.equal(document.querySelector('#info-expand')['aria-expanded'],'true');select.select({id:1});assert.equal(document.querySelector('#info-expand')['aria-expanded'],'false');assert.equal(document.querySelector('#info-expand').textContent,'Details')});

const simulationToast=new Function('presentEvent','app','toast',extract(feed,'export function simulationToast','export function renderExhibitEvents')+';return simulationToast;')(F.presentEvent,app,s=>banners.push(s));
check('actual simulationToast hides quiet banners and preserves full banners',()=>{banners=[];app.feedbackMode='quiet';simulationToast('Accretion');simulationToast('Slow motion');assert.equal(banners.length,0);app.feedbackMode='full';simulationToast('Accretion');assert.deepEqual(banners,['Accretion'])});
const registry=read('src/bodies/registry.ts'),loop=read('src/app/loop.ts');
const updateBodyLabel=new Function('canvasLabelText','app','formatMass','TYPES',extract(registry,'export function updateBodyLabel','function trailMaterial')+';return updateBodyLabel;')(F.canvasLabelText,app,String,{blackhole:{radius:3}});
const nodes={strong:{},span:{},em:{classList:{toggle:noop}}};
const body={id:5,name:'Quiet Black Hole',kind:'blackhole',mass:3,radius:3,lifeLevel:'none',label:{element:{querySelector:s=>nodes[s],setAttribute(k,v){this[k]=v}},position:{set:noop}}};
let compact=true;const bodies=[body];
const updateLabels=new Function('camera','viewTarget','compactLayout','labelRenderer','app','bodies','updateBodyLabel','labelVisible','isEscortShip','bodyGroupIds',extract(loop,'function updateLabels','/** Reset frame-rate')+';return updateLabels;')({position:{distanceTo:()=>30}},{},()=>compact,{domElement:{classList:{toggle:noop}}},app,bodies,updateBodyLabel,F.labelVisible,()=>false,new Map());
check('actual label handlers preserve long names across compact desktop compact',()=>{app.compactLabels=false;app.selectedBody=body;app.selectedGroupId=null;updateLabels();assert.equal(nodes.strong.textContent,'Quiet Black H…');assert.equal(body.label.element['aria-label'],body.name);assert.equal(body.label.element.title,body.name);assert.equal(body.label.visible,true);compact=false;updateLabels();assert.equal(nodes.strong.textContent,body.name);compact=true;updateLabels();assert.equal(nodes.strong.textContent,'Quiet Black H…');assert.equal(body.label.visible,true)});
check('resize updates hidden unselected labels before a later selection',()=>{app.selectedBody=null;compact=false;updateLabels();assert.equal(nodes.strong.textContent,body.name);compact=true;updateLabels();assert.equal(body.label.visible,false);assert.equal(nodes.strong.textContent,'Quiet Black H…');app.selectedBody=body;updateLabels();assert.equal(body.label.visible,true)});

console.log(JSON.stringify({head:'8de912810c3fe029b79623f762b5eab325bc1236',passed:results.filter(x=>x.pass).length,total:results.length,results,idleEvidence,limitation:'Extracted actual handlers with adapters, no renderer, physical device or audio output'},null,2));
process.exitCode=results.every(x=>x.pass)?0:1;
