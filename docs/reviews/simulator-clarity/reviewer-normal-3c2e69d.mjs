// Node 24+, exact checkout in SIMULATOR_REVIEW_ROOT; Three r180 in THREE_REVIEW_MODULE.
// CPU evaluation of the guarded GLSL expression using actual extracted tidal transform, not GPU execution.
import fs from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(process.env.SIMULATOR_REVIEW_ROOT);
const T=await import(pathToFileURL(resolve(process.env.THREE_REVIEW_MODULE)).href);
const {tidalVisualScale}=await import(pathToFileURL(resolve(root,'src/tidal-visual.ts')).href);
const read=p=>fs.readFileSync(resolve(root,p),'utf8');
assert.match(read('src/visuals/key-light-glsl.ts'),/vWN = normalize\(\(vec4\(n, 0\.\) \* viewMatrix\)\.xyz\)/);
const u=read('src/visuals/update-visuals.ts');
const code=stripTypeScriptTypes(u.slice(u.indexOf('function tidalFrameFor'),u.indexOf('// Module-scope temporaries')));
const apply=new Function('THREE','tidalVisualScale',code+';return setTidalVisualScale;')(T,tidalVisualScale);
let cases=0,maxError=0,oldFailures=0;const strains=[0,.5,.88],spins=[0,.8],angles=[0,.6];
for(const strain of strains)for(const spin of spins)for(const angle of angles){
 const mesh=new T.Group(),surface=new T.Object3D();surface.name='bodySurface';mesh.add(surface);mesh.position.set(4,2,-3);
 apply({mesh,kind:'gas',tidalStretch:strain,tidalAngle:angle,spinAngle:spin},2);mesh.updateMatrixWorld(true);
 for(const pos of [[0,0,40],[-20,18,12],[7,-30,5]]){
  const camera=new T.PerspectiveCamera();camera.position.set(...pos);camera.lookAt(4,2,-3);camera.rotateZ(.4);camera.updateMatrixWorld(true);
  const mv=new T.Matrix4().multiplyMatrices(camera.matrixWorldInverse,surface.matrixWorld);
  for(const v of [[1,0,1],[.3,.8,-.52],[-.9,-.2,.39]]){
   const n=new T.Vector3(...v).normalize();const view=n.clone().applyMatrix3(new T.Matrix3().getNormalMatrix(mv)).normalize();
   const got=view.applyMatrix3(new T.Matrix3().setFromMatrix4(camera.matrixWorldInverse).transpose()).normalize();
   const want=n.clone().applyMatrix3(new T.Matrix3().getNormalMatrix(surface.matrixWorld)).normalize();
   const e=got.distanceTo(want);assert(e<1e-12);maxError=Math.max(e,maxError);cases++;
   const old=n.clone().applyMatrix3(new T.Matrix3().setFromMatrix4(surface.matrixWorld)).normalize();if(old.distanceTo(want)>1e-6)oldFailures++;
  }
 }
}
assert.equal(cases,108);assert.equal(oldFailures,72);
console.log(JSON.stringify({head:'3c2e69d1cf11187717d919a03fd0051b963ca82d',three:T.REVISION,actualTidalFunctionCases:cases,passed:cases,maxNormalDistance:maxError,oldExpressionNegativeControls:{failed:oldFailures,total:cases},limitation:'CPU matrix evaluation, not GPU/compiler/rendered acceptance'},null,2));
