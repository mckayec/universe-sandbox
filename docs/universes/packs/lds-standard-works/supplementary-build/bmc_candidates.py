import re,sys,csv,collections
root=sys.argv[1]; pack=open(root+'/public/atlas/packs/lds-standard-works.js',encoding='utf-8').read()
cards=re.findall(r"\{ key: '((?:OHP|NTP|OTM|OTL|OTW|OHR|OH|NTE|NTJ|OHJ|OTS)[^']*)', name: '((?:[^'\\]|\\.)*)', books: \[([\d, ]+)\]",pack)
names=collections.defaultdict(list)
for k,n,b in cards:
    base=re.sub(r' \(.*\)$','',n.replace("\\'","'"))
    if len(base.split())<=3: names[base].append((k,b))
led=open(root+'/docs/universes/packs/lds-standard-works/coverage-bom.md',encoding='utf-8').read().splitlines()
rows=[]
for l in led:
    m=re.match(r'\| \[([^\]]+)\]\((https://[^)]+)\) \| \*\*(BMC-\d+); [a-z-]+\.\*\* (.*?) \| (.*) \|$',l)
    if not m: continue
    ch,url,bmc,find,excl=m.groups()
    mode=[w for w in ('vision','quot','Isaiah','prophe','dream','allegor','sermon','recount','remember') if re.search(w,find+' '+excl,re.I)]
    for n,ks in names.items():
        if re.search(r'\b'+re.escape(n)+r'\b',find):
            rows.append((bmc,ch,n,';'.join(k for k,_ in ks),'|'.join(mode),find[:160]))
w=csv.writer(sys.stdout); w.writerow(['bmc','chapter','name','candidate_cards','mode_words','finding_excerpt'])
for r in rows: w.writerow(r)
