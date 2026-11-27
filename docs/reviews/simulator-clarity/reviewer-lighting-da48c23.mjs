// Independent item-5 source/controller and normal-transform review.
// Node 24+; SIMULATOR_REVIEW_ROOT points to exact PR47 da48c23 checkout.
// THREE_REVIEW_MODULE may point to a local Three.js ESM module; otherwise imports installed "three".
// This runner characterizes the audited GLSL expression in CPU matrix math, not GPU rendering.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(process.env.SIMULATOR_REVIEW_ROOT||'.');
const THREE=await import(process.env.THREE_REVIEW_MODULE?pathToFileURL(resolve(process.env.THREE_REVIEW_MODULE)).href:'three');
const {keyLightFor,relativeLuminosity,daylight,NO_STAR_LIGHT}=await import(pathToFileURL(resolve(root,'src/key-light.ts')).href);
const {STAGES}=await import(pathToFileURL(resolve(root,'src/celestial-catalog.ts')).href);
const read=p=>readFileSync(resolve(root,p),'utf8');
const controllerSource=read('src/visuals/planet-lighting.ts');
const clean=s=>stripTypeScriptTypes(s.replace(/^import[\s\S]*?;\n/gm,'')).replace(/export /g,'');
const bodies=[];
const api=new Function('THREE','STAGES','keyLightFor','relativeLuminosity','bodies',clean(controllerSource)+';return {updatePlanetLighting,emitterTemperature,isLitWorld};')(THREE,STAGES,keyLightFor,relativeLuminosity,bodies);
const glsl=read('src/visuals/key-light-glsl.ts');
assert.match(glsl,/vWN = normalize\(mat3\(modelMatrix\) \* normal\)/,'Update runner expression if shader implementation changes.');
const updateSource=read('src/visuals/update-visuals.ts');
const transformSource=updateSource.slice(updateSource.indexOf('function tidalFrameFor'),updateSource.indexOf('// Module-scope temporaries'));
const setTidalVisualScale=new Function('THREE',clean(transformSource)+';return setTidalVisualScale;')(THREE);
const mat=()=>new THREE.ShaderMaterial({uniforms:{keyDir:{value:new THREE.Vector3()},fillDir:{value:new THREE.Vector3()},fillAmount:{value:0}}});
function body(id,kind,x=0,y=0,z=0){const mesh=new THREE.Group();mesh.position.set(x,y,z);const m=mat(),surface=new THREE.Mesh(new THREE.SphereGeometry(1,16,8),m);surface.name='bodySurface';mesh.add(surface);return {id,kind,mesh,radius:1,spinAngle:0,tidalStretch:0,tidalAngle:0,material:m,surface};}
let pass=0,fail=0;const results=[];
function check(name,fn){try{const detail=fn();pass++;results.push({name,pass:true,detail});}catch(e){fail++;results.push({name,pass:false,error:e.message});}}
const near=(a,b,eps=1e-10)=>assert.ok(Math.abs(a-b)<eps,a+' != '+b);
check('actual controller updates nested surface/atmosphere for all four world kinds',()=>{bodies.length=0;const star=body(1,'star',10,0,0);bodies.push(star);for(const [i,kind]of ['rocky','dwarf','moon','gas'].entries()){const b=body(i+2,kind);const frame=new THREE.Group(),atmosphere=new THREE.Mesh(new THREE.SphereGeometry(),mat());frame.add(atmosphere);b.mesh.add(frame);bodies.push(b);}api.updatePlanetLighting();for(const b of bodies.slice(1)){assert.equal(b.mesh.userData.keyLightId,1);b.mesh.traverse(o=>{if(o.material?.uniforms?.keyDir)near(o.material.uniforms.keyDir.value.x,1);});}return {worlds:4};});
check('moving and removed star update key and reset fallback, including fill',()=>{const star=bodies[0],world=bodies[1];star.mesh.position.set(0,0,-20);api.updatePlanetLighting();near(world.material.uniforms.keyDir.value.z,-1);bodies.shift();api.updatePlanetLighting();assert.equal(world.mesh.userData.keyLightId,null);near(world.material.uniforms.keyDir.value.x,NO_STAR_LIGHT.x);assert.equal(world.material.uniforms.fillAmount.value,0);});
check('actual controller ranks flux, fills second and does not light excluded kinds',()=>{bodies.length=0;const nearStar=body(1,'star',2,0,0),bright=body(2,'star',0,0,10),world=body(3,'rocky'),dark=body(4,'asteroid');bright.radius=10;bodies.push(nearStar,bright,world,dark);api.updatePlanetLighting();assert.equal(world.mesh.userData.keyLightId,2);near(world.material.uniforms.fillAmount.value,.25);near(world.material.uniforms.fillDir.value.x,1);assert.equal(dark.mesh.userData.keyLightId,undefined);});
check('new visual uses fresh materials rather than cached old mesh',()=>{const world=bodies[2],replacement=body(3,'rocky');world.mesh=replacement.mesh;world.material=replacement.material;api.updatePlanetLighting();assert.equal(world.mesh.userData.keyLightId,2);near(world.material.uniforms.keyDir.value.z,1);});
check('emitter temperatures and excluded kinds follow actual catalog/controller',()=>{for(const stage of STAGES)assert.equal(api.emitterTemperature({kind:'star',stage:stage.stage}),stage.temperature);assert.equal(api.emitterTemperature({kind:'brown'}),1300);assert.equal(api.emitterTemperature({kind:'protostar'}),3500);for(const kind of ['pulsar','blackhole','nebula','rocky','gas'])assert.equal(api.emitterTemperature({kind}),0);});
function normalCase(strain,spin=0,angle=0){const b=body(50,'rocky');b.tidalStretch=strain;b.spinAngle=spin;b.tidalAngle=angle;setTidalVisualScale(b,2);b.mesh.updateMatrixWorld(true);const M=b.surface.matrixWorld,N=new THREE.Vector3(Math.SQRT1_2,0,Math.SQRT1_2),linear=new THREE.Matrix3().setFromMatrix4(M),normalMatrix=new THREE.Matrix3().getNormalMatrix(M);const actual=N.clone().applyMatrix3(linear).normalize(),expected=N.clone().applyMatrix3(normalMatrix).normalize(),L=new THREE.Vector3(Math.SQRT1_2,0,-Math.SQRT1_2);return {strain,spin,angle,actual:actual.toArray(),expected:expected.toArray(),errorDegrees:Math.acos(Math.min(1,actual.dot(expected)))*180/Math.PI,dayActual:daylight(actual.dot(L),0,0),dayExpected:daylight(expected.dot(L),0,0)};}
check('uniform-scale normal control with body spin',()=>{const r=normalCase(0,.7,.2);assert.ok(r.errorDegrees<1e-5);return r;});
for(const strain of [.5,.88])check('SC5-T1 nonuniform tidal normal matches inverse-transpose at strain '+strain,()=>{const r=normalCase(strain);assert.ok(r.errorDegrees<1e-5,JSON.stringify(r));return r;});
check('inverse-transpose correction control remains perpendicular to transformed tangent',()=>{for(const strain of [.5,.88]){const b=body(60,'gas');b.tidalStretch=strain;setTidalVisualScale(b,2);b.mesh.updateMatrixWorld(true);const N=new THREE.Vector3(Math.SQRT1_2,0,Math.SQRT1_2),T=new THREE.Vector3(Math.SQRT1_2,0,-Math.SQRT1_2),normal=N.applyMatrix3(new THREE.Matrix3().getNormalMatrix(b.surface.matrixWorld)).normalize(),tangent=T.applyMatrix3(new THREE.Matrix3().setFromMatrix4(b.surface.matrixWorld)).normalize();near(normal.dot(tangent),0);}return {cases:2};});
console.log(JSON.stringify({threeRevision:THREE.REVISION,pass,fail,total:pass+fail,results},null,2));
process.exitCode=fail?1:0;
