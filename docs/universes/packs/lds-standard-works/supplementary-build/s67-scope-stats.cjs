const fs=require('fs'),crypto=require('crypto');const src=fs.readFileSync(process.argv[2],'utf8');const w={};new Function('window','self',src)(w,w);let p=w.ATLAS_PACK; if(!p||!p.codex){const a=w.ATLAS_PACKS; p=Array.isArray(a)?a[a.length-1]:Object.values(a||{}).pop();}
const rows=[];for(const s of p.codex)for(const [i,it] of (s.list||[]).entries())rows.push({sec:s.id,i,key:it.key||null,name:it.name,src:(it.src||[]).length,desc:it.desc});
const nosrc=rows.filter(r=>!r.src);const bySec={};for(const r of nosrc)bySec[r.sec]=(bySec[r.sec]||0)+1;console.log('cards',rows.length,'nosrc',nosrc.length,bySec);
const nokey=rows.filter(r=>!r.key);const bk={};for(const r of nokey)bk[r.sec]=(bk[r.sec]||0)+1;console.log('nokey',nokey.length,bk);
const unc=/\b(uncertain|unknown|not identif|does not (identify|locate|name|say)|unlocated|traditional(ly)?|proposed|disputed|debated|scholars|may have|possibly|perhaps|no (house|location|date|site))/i;
const u=rows.filter(r=>unc.test(r.desc));const bu={};for(const r of u)bu[r.sec]=(bu[r.sec]||0)+1;console.log('qualified-language cards',u.length,bu);
const head=process.argv[3];const keyed=rows.filter(r=>r.key&&r.src);
const pick=keyed.map(r=>({r,h:crypto.createHash('sha256').update(head+':'+r.key).digest('hex')})).sort((a,b)=>a.h<b.h?-1:1).slice(0,20);
for(const {r,h} of pick)console.log(`| ${h.slice(0,8)} | ${r.sec}[${r.i}] | ${r.key} |`);
const ev=p.events.length, sites=p.worlds[0].sites.length; const evNoSite=p.events.filter(e=>!(e.site||e.place||e.at||e.sites||e.where));console.log('events',ev,'sites',sites,'events lacking place field',evNoSite.length, Object.keys(p.events[0]));
for(const r of rows.filter(r=>!r.src))console.log(`NOSRC | ${r.sec}[${r.i}] | ${r.key||'-'} | ${r.name.slice(0,70)} | ${r.desc.slice(0,90).replace(/\|/g,'/')}`);
