"""Reproduce old-to-current mapping from Git objects; no network or source rereading.
Run from repository checkout: python docs/reviews/deep-worlds/reconcile-ledger.py
Outputs are separate from immutable historical sample-ledger.csv.
"""
import collections,csv,hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parent
OLD='f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49'
NEW='9a09dbce1e777d3255e058e11d2b81c53cae8d98'
loader="""const cp=require('child_process'),vm=require('vm');const packs={};for(const id of ['sun-eater','hyperion','expanse','dune','foundation','cosmere']){const c={window:{}};vm.runInNewContext(cp.execFileSync('git',['show',process.argv[1]+':public/atlas/packs/'+id+'.js'],{encoding:'utf8'}),c);packs[id]=c.window.ATLAS_PACKS[id];}console.log(JSON.stringify(packs));"""
def load(sha):return json.loads(subprocess.check_output(['node','-e',loader,sha],text=True))
def flatten(ps):
 out={}
 for pid,p in ps.items():
  for e in p['events']:out[(pid,'event','','',e['id'])]=e
  for w in p['worlds']:
   out[(pid,'world',w['id'],'',w['id'])]={k:v for k,v in w.items() if k in ['name','blurb','books']}
   for s in w.get('sites',[]):
    out[(pid,'site',w['id'],s['id'],s['id'])]={k:v for k,v in s.items() if k!='scene'}
    for l in s.get('scene',{}).get('landmarks',[]):out[(pid,'landmark',w['id'],s['id'],l['id'])]=l
 return out
def dump(v):return json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':'))
def digest(v):return hashlib.sha256(dump(v).encode()).hexdigest() if v is not None else ''
a,b=flatten(load(OLD)),flatten(load(NEW))
ledger=list(csv.DictReader((ROOT/'sample-ledger.csv').open()));assert len(ledger)==210
# Reused dispositions from sources.md and remediation-review.md. No new primary reading.
notes={
'SM01':('DW04','source-backed-copy-repair','S01 heir/child inversion repaired; spatial model and comprehensive first-appearance proof not certified.'),
'SM19':('DW06','narrowed-evidence-hold','Duarte/marines/reactor action removed; retained Free Navy/slow-zone railgun identity and setting still need relevant passage.'),
'SM30':('DW05','source-backed-copy-repair','S02 supports before-move timing/test narrative; no modeled-location certification.'),
'SM49':('DW06','deleted-by-omission','Dungeon landmark removed; b1j/b1n retained narratives remain separate evidence holds.'),
'SM52':('DW06','narrowed-evidence-hold','Balian given name removed; Mataro household/Anais/Valka and setting still need passages.'),
'SM64':('DW06','untied-evidence-hold','Dungeon tie removed; retained event narrative and other metadata unverified.'),
'SM75':('DW06','narrowed-evidence-hold','Colosso basement/torture precision and lm removed; retained Borosevo capture/questioning/secret visit still unverified.'),
'SM79':('DW06','narrowed-evidence-hold','Repaired return clause removed here; initial ship landing/abandonment unverified; independent b4f remains.'),
'SM111':('DW06','deleted-by-omission','Conference landmark removed; b6i still names world ceres and retains union narrative without primary support.'),
'SM119':('DW06','narrowed-evidence-hold','Duarte/reactor/decoy sequence removed; Bobbie assault, railgun tie and effect remain unverified.'),
'SM120':('DW06','narrowed-evidence-hold','Conference room/site and leadership succession removed; world ceres, timing and Holden union narrative still unverified.'),
'SM135':('DW05','source-backed-clause-repair','S02 timing repair closes exact-eve issue only; do not infer all architecture/generation-count/room assertions verified.'),
'SM139':('DW06','narrowed-evidence-hold','Specific rescue/death scene removed from landmark; hidden-station identity/parent site still require text; d5 retained separately.'),
'SM141':('DW07','spoiler-clause-omitted','Explicit book-II departure removed from book-I copy; retained entrance construction/identity still lacks primary passage.'),
'SM146':('DW06','narrowed-evidence-hold','Named rescuers and station lm removed; retained station/death/flight narrative plus battle effect unverified.'),
'SM157':('DW06','narrowed-evidence-hold','Encyclopedia/Terminus narrative removed here; Zenow office identification still unsupported; f7f0/f7g retain distinct claims.'),
'SM162':('DW06','deleted-by-omission','Board-room landmark removed; f1d narrative retained without lm and still unverified.'),
'SM164':('DW06','source-backed-copy-repair','S06 narrow arrival/taxi/follower narrative conforms; affiliation removed; modeled terminal geometry/earliest gates not certified.'),
'SM172':('DW06','untied-evidence-hold','Board-room tie removed; event text and remaining world/site/gate still need passage.'),
'SM173':('DW06','untied-evidence-hold','Zenow-room tie removed; Terminus choice narrative still needs passage.'),
'SM198':('DW06','deleted-by-omission','Orphanage landmark removed; separate Yeddaw/Indicium claims not validated by deletion.'),
'SM199':('DW06','source-backed-copy-repair','S03 opening Yeddaw journey narrowing conforms; ending/victim/Ideal assertions and lm/fx removed, not verified.'),
}
rows=[];samplekeys=set()
for r in ledger:
 k=(r['pack'],r['kind'],'' if r['kind']=='event' else r['world'],'' if r['kind']=='event' else r['site'],r['object_id']);samplekeys.add(k);old=a[k];new=b.get(k)
 assert old.get('text',old.get('desc',''))==r['current_text'],r['sample_id']
 if r['kind']=='event':assert old.get('world','')==r['world'] and old.get('site','')==r['site']
 state='deleted' if new is None else 'unchanged' if old==new else 'edited'
 finding,disposition,limit=notes.get(r['sample_id'],('', 'prior-evidence-status-retained',r['correction_or_next_check']))
 assert (state!='unchanged')==(r['sample_id'] in notes)
 fields=sorted(k for k in set(old)|set(new or {}) if old.get(k)!=(new or {}).get(k))
 rows.append(dict(sample_id=r['sample_id'],pack=r['pack'],kind=r['kind'],historical_world=r['world'],historical_site=r['site'],object_id=r['object_id'],old_sha=OLD,current_sha=NEW,record_state=state,changed_fields=';'.join(fields),old_payload_sha256=digest(old),current_payload_sha256=digest(new),historical_text=r['current_text'],current_text='' if new is None else new.get('text',new.get('desc','')),current_structure='' if new is None else dump({k:v for k,v in new.items() if k in ['world','site','lm','book','books','first','fx','at','rel','name','title']}),historical_primary_comparison=r['comparison'],reused_source_ids=r['source_ids'],finding=finding,disposition=disposition,remaining_limit=limit))
assert collections.Counter(r['record_state'] for r in rows)=={'unchanged':188,'edited':18,'deleted':4}
assert collections.Counter(r['historical_primary_comparison'] for r in rows)=={'not-compared':202,'partial-or-corrective':6,'narrative-supported':2}
extra=[]
for k in sorted(set(a)|set(b)):
 if a.get(k)==b.get(k) or k in samplekeys:continue
 old,new=a.get(k),b.get(k)
 extra.append(dict(pack=k[0],kind=k[1],world=k[2],site=k[3],object_id=k[4],old_sha=OLD,current_sha=NEW,old_payload_sha256=digest(old),current_payload_sha256=digest(new),field_changes=dump({f:[(old or {}).get(f),(new or {}).get(f)] for f in set(old or {})|set(new or {}) if (old or {}).get(f)!=(new or {}).get(f)}),disposition='Conservative omission/narrowing only; no new primary verification; see reconciliation narrative'))
assert len(extra)==4
for name,data in [('sample-reconciliation.csv',rows),('outside-sample-content-delta.csv',extra)]:
 with (ROOT/name).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=data[0],lineterminator='\n');w.writeheader();w.writerows(data)
print(json.dumps({'historical_samples':210,'states':dict(collections.Counter(r['record_state'] for r in rows)),'surviving_samples':206,'surviving_historically_not_compared':sum(r['record_state']!='deleted' and r['historical_primary_comparison']=='not-compared' for r in rows),'outside_sample_content_deltas':len(extra),'new_primary_comparisons':0},indent=2))
