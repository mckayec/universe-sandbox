import pathlib,json,re,csv,hashlib
p=pathlib.Path('docs/universes/packs/lds-standard-works/supplementary-review-s11')
luke={23:'Jesus Joseph Heli',24:'Matthat Levi Melchi Janna Joseph',25:'Mattathias Amos Naum Esli Nagge',26:'Maath Mattathias Semei Joseph Juda',27:'Joanna Rhesa Zorobabel Salathiel Neri',28:'Melchi Addi Cosam Elmodam Er',29:'Jose Eliezer Jorim Matthat Levi',30:'Simeon Juda Joseph Jonan Eliakim',31:'Melea Menan Mattatha Nathan David',32:'Jesse Obed Booz Salmon Naasson',33:'Aminadab Aram Esrom Phares Juda',34:'Jacob Isaac Abraham Thara Nachor',35:'Saruch Ragau Phalec Heber Sala',36:'Cainan Arphaxad Sem Noe Lamech',37:'Mathusala Enoch Jared Maleleel Cainan',38:'Enos Seth Adam God'}
matt={2:'Abraham Isaac Jacob Judas',3:'Phares Esrom Aram',4:'Aminadab Naasson Salmon',5:'Booz Obed Jesse',6:'David Solomon',7:'Roboam Abia Asa',8:'Josaphat Joram Ozias',9:'Joatham Achaz Ezekias',10:'Manasses Amon Josias',11:'Jechonias',12:'Salathiel Zorobabel',13:'Abiud Eliakim Azor',14:'Sadoc Achim Eliud',15:'Eleazar Matthan Jacob',16:'Joseph'}
# Independent retained fallback consistency check after manual transcription from freshly inspected official pages.
result={}
for book,ch,groups in [('matt',1,matt),('luke',3,luke)]:
 f=pathlib.Path('/workspace/lds-source-evidence/20261026/nt/fallback')/(book+'.json');d=json.loads(f.read_text());verses={int(x['verse']):x['text'] for x in d['chapters'][ch-1]['verses']}
 for v,names in groups.items():
  text=verses[v];pos=0
  for name in names.split():
   found=re.search(r'\b'+name+r'\b',text[pos:]);assert found,(book,v,name);pos+=found.end()
 result[book]={'ordered_name_occurrences':sum(len(n.split()) for n in groups.values()),'fallback_capture_sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'per_verse_name_order_matches_retained_fallback':True}
 with (p/(book+'-genealogy-names.csv')).open('w',newline='') as out:
  w=csv.writer(out,lineterminator='\n');w.writerow(['verse','names_in_source_order'])
  for v,names in groups.items():w.writerow([v,names.replace(' ','; ')])
(p/'genealogy-check.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
