// Independent bounded source/controller review; no browser or rendering executed.
import assert from 'node:assert/strict';
import {
  readFileSync }
  from 'node:fs';
  import {
    stripTypeScriptTypes }
    from 'node:module';
    import test from 'node:test';
    import {
      resolve, join }
      from 'node:path';
      import {
        pathToFileURL }
        from 'node:url';
        // Run with Node 24+. Point source root at PR47 920f76e and evidence root at main 6a25703.
        const root = resolve(process.env.SIMULATOR_REVIEW_ROOT || process.cwd());
        const evidenceRoot = resolve(process.env.SIMULATOR_REVIEW_EVIDENCE_ROOT || root);
        const {
          QUIET_ENCOUNTER, diskEncounter, relaxEncounter }
          = await import(pathToFileURL(join(root, 'src/disk-encounter.ts')));
          const read = p => readFileSync(join(p.startsWith('docs/') ? evidenceRoot : root, p), 'utf8');
          const source=read('src/visuals/disk-encounters.ts');
          const fragment=source.slice(source.indexOf('function applyTide('),source.indexOf('export function diskEncounterOf('));
          const tmpLocal={
            copy(v){
              Object.assign(this,v);
              return this;
            }
          }
          ;
          const controller = new Function('QUIET_ENCOUNTER','diskEncounter','relaxEncounter','tmpLocal',stripTypeScriptTypes(fragment).replaceAll('export ', '')+'; return {updateTransferDiskTide,transferDiskEncounterOf};')(QUIET_ENCOUNTER,diskEncounter,relaxEncounter,tmpLocal);
          function layer(outer, origin={
            x:0,y:0,z:0}
            ,scale=1,tilt=0){
              return {
                userData:{
                }
                ,material:{
                  uniforms:{
                    outer:{
                      value:outer}
                      ,tideCut:{
                        value:1e5}
                        ,tideAngle:{
                          value:0}
                          ,tideAmp:{
                            value:0}
                          }
                        }
                        ,updateWorldMatrix(a,b){
                          assert.equal(a,true);
                          assert.equal(b,false);
                        }
                        ,worldToLocal(v){
                          const x=(v.x-origin.x)/scale,y=(v.y-origin.y)/scale,z=(v.z-origin.z)/scale;
                          v.x=x;
                          v.y=Math.cos(tilt)*y+Math.sin(tilt)*z;
                          v.z=-Math.sin(tilt)*y+Math.cos(tilt)*z;
                          return v;
                        }
                      }
                      ;
                    }
                    function setup(opts={
                    }
                    ){
                      const stream={
                        disk:layer(3.55),outerDisk:layer(4.75,opts.origin,opts.scale,opts.tilt)}
                        ,receiver={
                          id:1,mass:2}
                          ,donor={
                            id:2,mass:3,kind:'star',mesh:{
                              position:{
                                x:7,y:0,z:0}
                              }
                            }
                            ;
                            return{
                              stream,receiver,donor}
                              ;
                            }
                            const state=s=>controller.transferDiskEncounterOf(s.stream);
                            const update=(s,dt=1)=>controller.updateTransferDiskTide(s.stream,s.receiver,s.donor,dt);
                            test('transfer actual controller updates both layer uniforms and stores donor identity',()=>{
                              const s=setup();
                              update(s);
                              const e=state(s);
                              assert.ok(e.strength>0);
                              assert.equal(e.companionId,2);
                              for(const l of [s.stream.disk,s.stream.outerDisk]){
                                assert.equal(l.material.uniforms.tideCut.value,e.cut*4.75);
                                assert.equal(l.material.uniforms.tideAngle.value,e.angle);
                                assert.equal(l.material.uniforms.tideAmp.value,e.strength);
                              }
                            }
                            );
                            test('translated scaled tilted local donor frame matches independent analytic transform',()=>{
                              const origin={
                                x:13,y:4,z:-9}
                                ,scale=2,tilt=.7,s=setup({
                                  origin,scale,tilt}
                                  );
                                  const local={
                                    x:3,y:5,z:2}
                                    ;
                                    s.donor.mesh.position={
                                      x:origin.x+scale*local.x,y:origin.y+scale*(Math.cos(tilt)*local.y-Math.sin(tilt)*local.z),z:origin.z+scale*(Math.sin(tilt)*local.y+Math.cos(tilt)*local.z)}
                                      ;
                                      update(s,100);
                                      const expected=diskEncounter(local,4.75,2,3);
                                      for(const key of ['cut','strength','angle']) assert.ok(Math.abs(state(s)[key]-expected[key])<1e-12,key);
                                    }
                                    );
                                    test('zero timestep does not advance strength or cut',()=>{
                                      const s=setup();
                                      update(s,0);
                                      assert.equal(state(s).strength,0);
                                      assert.equal(state(s).cut,1);
                                      assert.equal(state(s).companionId,undefined);
                                    }
                                    );
                                    test('small steps and equivalent one step produce same transfer strength and cut',()=>{
                                      const a=setup(),b=setup();
                                      for(let i=0;
                                      i<100;
                                      i++)update(a,.01);
                                      update(b,1);
                                      for(const k of ['strength','cut','angle'])assert.ok(Math.abs(state(a)[k]-state(b)[k])<1e-12,k);
                                    }
                                    );
                                    test('separate stream state does not leak through shared scratch vector',()=>{
                                      const a=setup(),b=setup();
                                      b.donor.id=3;
                                      b.donor.mesh.position={
                                        x:0,y:8,z:0}
                                        ;
                                        update(a);
                                        const before=structuredClone(state(a));
                                        update(b);
                                        assert.deepEqual(state(a),before);
                                        assert.notEqual(state(a),state(b));
                                        assert.equal(state(b).companionId,3);
                                      }
                                      );
                                      test('nebula and debris donors are quiet from initialization',()=>{
                                        for(const change of [{
                                          kind:'nebula'}
                                          ,{
                                            debris:true}
                                            ]){
                                              const s=setup();
                                              Object.assign(s.donor,change);
                                              update(s);
                                              assert.equal(state(s).strength,0);
                                              assert.equal(state(s).companionId,undefined);
                                              assert.equal(s.stream.disk.material.uniforms.tideCut.value,1e5);
                                            }
                                          }
                                          );
                                          test('tide recovers to quiet for a far donor and clears material masks',()=>{
                                            const s=setup();
                                            update(s,100);
                                            assert.ok(state(s).strength>0);
                                            s.donor.mesh.position.x=1000;
                                            for(let i=0;
                                            i<500;
                                            i++)update(s,.1);
                                            assert.equal(state(s).strength,0);
                                            assert.equal(state(s).companionId,undefined);
                                            for(const l of [s.stream.disk,s.stream.outerDisk]){
                                              assert.equal(l.material.uniforms.tideCut.value,1e5);
                                              assert.equal(l.material.uniforms.tideAmp.value,0);
                                            }
                                          }
                                          );
                                          test('invalid outer radius leaves untouched material and state',()=>{
                                            const s=setup();
                                            s.stream.outerDisk.material.uniforms.outer.value=0;
                                            update(s);
                                            assert.equal(state(s),undefined);
                                            assert.equal(s.stream.disk.material.uniforms.tideCut.value,1e5);
                                          }
                                          );
                                          test('close and above-plane donor results remain bounded and finite',()=>{
                                            for(const position of [{
                                              x:.01,y:0,z:0}
                                              ,{
                                                x:7,y:0,z:12}
                                                ]){
                                                  const s=setup();
                                                  s.donor.mesh.position=position;
                                                  update(s,100);
                                                  const e=state(s);
                                                  for(const key of ['strength','cut','angle'])assert.ok(Number.isFinite(e[key]));
                                                  assert.ok(e.strength>=0&&e.strength<=1);
                                                  assert.ok(e.cut>=.25&&e.cut<=1);
                                                }
                                              }
                                              );
                                              const probeSource=stripTypeScriptTypes(read('src/ui/test-probe.ts').replace(/^import .*;\n/gm,'')).replaceAll('export ', '');
                                              function probeSetup(query){
                                                const app={
                                                  paused:true,speed:5,selectedBody:{
                                                    id:1}
                                                  }
                                                  ,bodies=[{
                                                    id:1,kind:'star',name:'Original'}
                                                    ],streams=new Map([[1,{
                                                      donorId:2,receiverId:1,outerDisk:{
                                                        visible:true}
                                                      }
                                                      ]]),window={
                                                      }
                                                      ;
                                                      const funcs=new Function('app','bodies','matterStreams','diskEncounterOf','transferDiskEncounterOf','location','window',probeSource+';return {probeSnapshot,installTestProbe};')(app,bodies,streams,()=>({
                                                        strength:.3}
                                                        ),()=>({
                                                          strength:.5,cut:.6}
                                                          ),{
                                                            search:query}
                                                            ,window);
                                                            return{
                                                              app,bodies,streams,window,...funcs}
                                                              ;
                                                            }
                                                            test('probe installed only by exact explicit opt-in query value',()=>{
                                                              for(const query of ['', '?probe=0','?probe=true','?other=1']){
                                                                const p=probeSetup(query);
                                                                p.installTestProbe();
                                                                assert.equal(p.window.__sandboxProbe,undefined);
                                                              }
                                                              const p=probeSetup('?other=1&probe=1');
                                                              p.installTestProbe();
                                                              assert.equal(typeof p.window.__sandboxProbe,'function');
                                                            }
                                                            );
                                                            test('probe returns copied primitives, no mutable simulation references',()=>{
                                                              const p=probeSetup('?probe=1'),snapshot=p.probeSnapshot();
                                                              snapshot.bodies[0].name='Changed';
                                                              snapshot.transferDisks[0].visible=false;
                                                              snapshot.paused=false;
                                                              snapshot.speed=10;
                                                              snapshot.bodies.push({
                                                                id:8}
                                                                );
                                                                assert.equal(p.bodies[0].name,'Original');
                                                                assert.equal(p.bodies.length,1);
                                                                assert.equal(p.streams.get(1).outerDisk.visible,true);
                                                                assert.equal(p.app.paused,true);
                                                                assert.equal(p.app.speed,5);
                                                                assert.equal(p.probeSnapshot().selectedId,1);
                                                              }
                                                              );
                                                              const harness=read('docs/reviews/simulator-clarity/evidence-harness-4b2.mjs');
                                                              const helpers=harness.slice(harness.indexOf('export function survivorCheck'),harness.indexOf('async function waitForServer'));
                                                              const {
                                                                survivorCheck,settles}
                                                                =new Function(helpers.replaceAll('export ', '')+';return{survivorCheck,settles};')();
                                                                test('survivor rule independently rejects swallowed/missing selection and extra remnants',()=>{
                                                                  assert.equal(survivorCheck([4,9],{
                                                                    bodies:[{
                                                                      id:9}
                                                                      ],selectedId:9}
                                                                      ).ok,true);
                                                                      for(const after of [{
                                                                        bodies:[{
                                                                          id:9}
                                                                          ],selectedId:4}
                                                                          ,{
                                                                            bodies:[{
                                                                              id:9}
                                                                              ],selectedId:null}
                                                                              ,{
                                                                                bodies:[{
                                                                                  id:9}
                                                                                  ,{
                                                                                    id:4}
                                                                                    ],selectedId:9}
                                                                                    ,{
                                                                                      bodies:[{
                                                                                        id:99}
                                                                                        ],selectedId:99}
                                                                                        ,{
                                                                                          bodies:[],selectedId:null}
                                                                                          ])assert.equal(survivorCheck([4,9],after).ok,false);
                                                                                        }
                                                                                        );
                                                                                        test('settling helper rejects quiet, oscillation, acceleration and invalid samples',()=>{
                                                                                          assert.equal(settles([.9,.94,.96]),true);
                                                                                          for(const series of [[0,0,0],[.5,.6,.5],[.5,.51,.53],[.5,undefined,.6],[NaN,.5,.6],[.5,.6,.7]])assert.equal(settles(series),false,String(series));
                                                                                        }
                                                                                        );
                                                                                        test('builder JSONL receipt has 45 scenario checks; all true; reported failures zero',()=>{
                                                                                          const rows=read('docs/reviews/simulator-clarity/evidence-920f76e.jsonl').trim().split('\n').map(JSON.parse);
                                                                                          const checks=rows.flatMap(r=>r.checks??[]);
                                                                                          assert.equal(checks.length,45);
                                                                                          assert.ok(checks.every(c=>c.ok===true));
                                                                                          assert.equal(rows.at(-1).failures,0);
                                                                                        }
                                                                                        );
