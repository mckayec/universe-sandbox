import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {stripTypeScriptTypes} from 'node:module';
const root=process.env.SIM_REVIEW_ROOT||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const kids=read('src/ui/kids.ts'),pointer=read('src/ui/pointer.ts'),controls=read('src/ui/controls.ts');
const pure=await import(pathToFileURL(path.resolve(root,'src/kids-mode.ts')));
function body(source,marker){
 const start=source.indexOf(marker);if(start<0)throw Error('missing '+marker);
 const open=source.indexOf('{',start+marker.length);let depth=1,end=open+1;
 while(depth&&end<source.length){if(source[end]==='{')depth++;if(source[end]==='}')depth--;end++;}
 if(depth)throw Error('unclosed '+marker);return source.slice(open+1,end-1);
}
const results=[];
const element=()=>({classList:{toggle(){},add(){},remove(){}},hidden:true,setAttribute(){},querySelector:()=>({}),textContent:''});
for(const mode of ['normal','escape','disarm','cancel','escape-rearm']){
 let placed=0;
 const app={kidsMode:true,kidsArmed:true,placementMode:true,placementEpoch:0,pendingTouchPlacement:{pointerId:7,epoch:0},selectedBuilder:'body',touchGesture:null,longPressTimer:0};
 const c=vm.createContext({app,activePointers:new Map([[7,{}]]),dialog:{hidden:true},renderer:{domElement:{hasPointerCapture:()=>false}},world:{clone:()=>({})},document:{querySelector:element},container:element(),
 setPointer(){},placeSelected(){placed++;},clearGuides(){},liveDragBody:()=>null,syncKidsBar(){},clearTimeout,...pure});
 let code='';
 for(const [src,marker,name,args] of [
 [controls,'export function setInteractionMode(add: boolean)','setInteractionMode','add'],
 [kids,'function setArmed(armed: boolean)','setArmed','armed'],
 [kids,'export function kidsPlacementDone()','kidsPlacementDone',''],
 [kids,"document.addEventListener('keydown', e =>",'onEscape','e'],
 [pointer,"addEventListener('pointerup', e =>",'onUp','e'],
 [pointer,"addEventListener('pointercancel', e =>",'onCancel','e']]){
 code+='function '+name+'('+args+'){'+body(src,marker)+'}\n';}
 for(const [src,marker,name] of [[controls,'export function cancelPendingPlacement()','cancelPendingPlacement'],[pointer,'function placementGate()','placementGate']]){
 if(src.includes(marker))code+='function '+name+'(){'+body(src,marker)+'}\n';}
 vm.runInContext(stripTypeScriptTypes(code),c);
 if(mode.startsWith('escape'))vm.runInContext('onEscape({key:"Escape"})',c);
 if(mode==='disarm')vm.runInContext('setArmed(false)',c);
 if(mode==='cancel')vm.runInContext('onCancel({pointerId:7})',c);
 if(mode==='escape-rearm')vm.runInContext('setArmed(true)',c);
 vm.runInContext('onUp({pointerType:"touch",pointerId:7})',c);
 const expected=mode==='normal'?1:0;
 results.push({id:'held-touch-'+mode,expected,actual:placed,armedAfter:app.kidsArmed,pass:placed===expected&&(mode!=='escape-rearm'||app.kidsArmed)});
}
// The actual capture handlers must bind authorization to the click's own pointer, not a different latest press.
class ElementAdapter{
 constructor(region){this.region=region;}
 closest(selector){if(selector==='canvas')return this.region==='canvas'?this:null;if(selector.includes('#kids-dialog'))return this.region==='kids-dialog'?{id:'kids-dialog'}:null;return this.region==='kids-dialog'?this:null;}
}
for(const [id,presses,clickId,detail,expectedBlocked] of [
 ['canvas press released over dialog',[['canvas',7]],7,1,true],
 ['dialog press and click',[['kids-dialog',8]],8,1,false],
 ['keyboard activation',[],0,0,false],
 ['canvas pointer 7 after dialog pointer 8 press',[['canvas',7],['kids-dialog',8]],7,1,true],
 ['dialog pointer 7 after canvas pointer 8 press',[['kids-dialog',7],['canvas',8]],7,1,false],
 ]){
 const c=vm.createContext({app:{kidsMode:true,kidsPressInDialog:false},Element:ElementAdapter,...pure});
 let code='function regionOf(target){'+body(kids,'function regionOf(target: EventTarget | null)')+'}\nfunction gate(e){'+body(kids,'function gate(e: Event)')+'}\n';
 if(kids.includes('function notePress(e: Event)'))code+='function notePress(e){'+body(kids,'function notePress(e: Event)')+'}';else code+='function notePress(e){}';
 vm.runInContext(stripTypeScriptTypes(code),c);
 for(const [region,pointerId] of presses){c.e={target:new ElementAdapter(region),pointerId};vm.runInContext('notePress(e)',c);}
 let prevented=false,stopped=false;
 c.e={type:'click',target:new ElementAdapter('kids-dialog'),pointerId:clickId,detail,preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}};
 vm.runInContext('gate(e)',c);
 const actualBlocked=prevented&&stopped;
 results.push({id:'dialog-'+id,expectedBlocked,actualBlocked,pass:actualBlocked===expectedBlocked});
}
const inputs=['src/ui/kids.ts','src/ui/pointer.ts','src/ui/controls.ts','src/kids-mode.ts'].map(p=>{const b=fs.readFileSync(path.join(root,p));return {path:p,sha:crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')};});
console.log(JSON.stringify({head:process.env.SIM_REVIEW_HEAD||'unspecified',scope:'Actual handlers and helper; state/DOM adapters, not browser; dialog cases explicitly distinguish two pointer identities',inputs,passed:results.filter(x=>x.pass).length,total:results.length,results},null,2));
process.exitCode=results.some(x=>!x.pass)?1:0;
