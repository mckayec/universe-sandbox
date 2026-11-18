const cp=require('child_process'),vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const H='4aa6571c45bd6cc9063e77c57f7a40156e0a4c26',B='d84599cd2e67abc9265cc00873bd9eb482a0ce14';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8',maxBuffer:20000000});
const changed=cp.execFileSync('git',['diff','--name-only',B,H],{encoding:'utf8'}).trim().split('\n');assert.deepEqual(changed.filter(p=>p.startsWith('public/')),['public/atlas/engine.css']);
const hex=h=>h.slice(1).match(/../g).map(x=>parseInt(x,16));
const lum=c=>c.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const over=(a,b,t)=>a.map((x,i)=>x*t+b[i]*(1-t));
const rows=[];for(const id of ['sun-eater','hyperion','expanse','foundation','dune','cosmere','lds-standard-works']){
 const c={window:{}};vm.createContext(c);vm.runInContext(read(H,'public/atlas/packs/'+id+'.js'),c);
 const p=Object.values(c.window).flatMap(v=>[v,...Object.values(v||{})]).find(v=>v&&v.id===id&&v.worlds);assert.ok(p,id);const t=p.theme;
 const shade=(t.shadeRgb||'8,6,5').split(',').map(Number),muted=hex(t.muted||'#a89e8a'),hi=hex(t.accentHi||'#e8cd8a'),hover=hex(t.chrome||'#efe6d2');
 for(const back of [0,255]){const bg=over(shade,[back,back,back],.88);const r={id,back,link:ratio(muted,bg),here:ratio(hi,bg),hover:ratio(hover,bg),separator:ratio(over(muted,bg,.75),bg),focus:ratio(hi,bg)};assert.ok(r.link>=4.5&&r.here>=4.5&&r.hover>=4.5&&r.separator>=3&&r.focus>=3);rows.push(r);}
}
const out={head:H,base:B,changedFiles:changed,packAndEngineJSUnchanged:true,rows,minimums:Object.fromEntries(['link','here','hover','separator','focus'].map(k=>[k,Math.min(...rows.map(r=>r[k]))])),assumptions:'source theme colors and alpha compositing; no screenshot pixel measurement or browser execution',result:'pass'};
fs.writeFileSync(__dirname+'/verification-result.json',JSON.stringify(out,null,2)+'\n');console.log(out.minimums);
