/* Galactic Atlas engine (v1).
   One shared renderer and UI for galactic-scale book atlases (Sun Eater, Hyperion, ...). Everything
   series-specific comes from a data pack: see PACK_FORMAT.md. Plain browser JavaScript, no build step.
   Needs THREE r128 as a global. Usage: AtlasEngine.start(window.ATLAS_PACKS[id]).
   Generalised from the Sun Eater Atlas and the Hyperion Atlas single-file pages. */
(function(){
"use strict";
const ENGINE_BASE=(function(){try{const s=document.currentScript&&document.currentScript.src;return s?new URL(".",s).href:"";}catch(e){return "";}})();

/* ===================== SHADERS ===================== */
/* ===================== SHADERS ===================== */
/* 3D simplex noise (Gustavson / Ashima) shared by every procedural pass */
const GLSL_NOISE=`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,int oct){float a=.5,s=0.,n=0.;for(int i=0;i<12;i++){if(i>=oct)break;s+=a*snoise(p);n+=a;p=p*2.03+vec3(17.1,3.7,9.3);a*=.5;}return s/n;}
float ridged(vec3 p,int oct){float a=.5,s=0.,n=0.,w=1.;for(int i=0;i<10;i++){if(i>=oct)break;float r=1.-abs(snoise(p));r*=r;r*=w;w=clamp(r*1.6,0.,1.);s+=a*r;n+=a;p=p*2.11+vec3(5.3,11.9,1.7);a*=.5;}return s/n;}
vec3 hash33(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}
/* crater field: returns depth-ish profile in [−1,1] */
float craters(vec3 p){vec3 i=floor(p),f=fract(p);float r=0.;
  for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){vec3 o=vec3(float(x),float(y),float(z));vec3 h=hash33(i+o);
    if(h.z>.55)continue;float rad=.18+h.x*.3;float d=length(o+h-f)/rad;
    if(d<1.4){float bowl=d<1.?(d*d-1.):0.;float rim=exp(-pow((d-1.)*5.,2.))*.6;r+=bowl*.8+rim;}}
  return r;}
`;

/* ---- bake pass: renders an equirectangular map for one world ---- */
const BAKE_VS=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const BAKE_FS=`
precision highp float;
varying vec2 vUv;
uniform int uPass;      /* 0 albedo+spec  1 normal+lights  2 clouds */
uniform int uType;
uniform int uOct;
uniform vec3 uSeed;
uniform float uFreq,uWarp,uRough,uSea,uIce,uLights,uBump,uCloud,uCloudScale,uBands,uDune,uMoist,uWall;
uniform vec3 uP0,uP1,uP2,uP3,uP4,uP5;
uniform float uEps;
uniform int uNF;uniform vec4 uFA[14];uniform vec4 uFB[14];uniform vec4 uFC[14];uniform vec4 uFD[14];
uniform sampler2D tBase;uniform float uBase;
uniform sampler2D tMapHi,tMapLo,tMapReg;uniform float uMapOn,uMapMtn;
${GLSL_NOISE}
const float PI=3.14159265359;
/* feature kinds: 1 continent  2 mountain range  3 biome  4 basin  5 peak  6 river/gorge */
float arcDist(vec3 p,vec3 A,vec3 B){vec3 n=normalize(cross(A,B));float perp=abs(asin(clamp(dot(p,n),-1.,1.)));
  bool inside=dot(cross(A,p),n)>0.&&dot(cross(p,B),n)>0.;
  return inside?perp:min(acos(clamp(dot(p,A),-1.,1.)),acos(clamp(dot(p,B),-1.,1.)));}
float featHeight(vec3 p,vec3 q){float add=0.;
  for(int i=0;i<14;i++){if(i>=uNF)break;vec4 A=uFA[i],B=uFB[i],D=uFD[i];int k=int(B.x+.5);
    if(k==3)continue;
    if(k==1||k==4||k==5){float ang=acos(clamp(dot(p,A.xyz),-1.,1.));if(ang>A.w*1.6)continue;
      float en=fbm(p*5.+float(i)*3.1,3);
      if(k==5){float t=clamp(1.-ang/A.w,0.,1.);add+=B.y*t*t*(.8+.2*en);}
      else{float s=1.-smoothstep(A.w*.55,A.w*1.12,ang+en*A.w*.38);add+=(k==1?1.:-1.)*B.y*s;}}
    else{float d0=arcDist(p,A.xyz,D.xyz);if(d0>D.w*(k==2?3.5:5.))continue;
      if(k==2){float en=fbm(p*5.+float(i)*3.1,3);float dd=d0+en*D.w*.6;float s=exp(-pow(dd/D.w,2.));add+=B.y*s*(.45+.9*ridged(q*4.2+float(i),5));}
      else{float dd=d0+snoise(p*40.+float(i))*D.w*.9+fbm(p*14.,3)*D.w*1.4;float s=1.-smoothstep(D.w*.35,D.w,abs(dd));add-=B.y*s;}}
  }return add;}
vec3 biomeStyle(int st,vec3 c,vec3 q,vec3 p){
  if(st==0){float str=snoise(vec3(q.x*34.,q.y*7.,q.z*34.))*.5+.5;float g=fbm(q*9.,4)*.5+.5;return mix(c,c*vec3(1.18,1.1,.72),g*.6)*(.86+.26*str);}
  if(st==1){float cl=fbm(q*28.,5)*.5+.5;float cl2=fbm(q*90.,3)*.5+.5;return c*(.62+.55*cl)*(.85+.3*cl2);}
  if(st==2){float st2=fbm(vec3(q.x*5.,q.y*40.,q.z*5.),4)*.5+.5;return c*(.72+.5*st2)*(.85+.3*(fbm(q*20.,4)*.5+.5));}
  if(st==3){float f=fbm(q*16.,5)*.5+.5;float burn=smoothstep(.55,.7,fbm(q*7.+3.,4)*.5+.5);vec3 c2=mix(c,c*vec3(1.35,.75,.35),f);return mix(c2,vec3(.08,.06,.05),burn*.55);}
  if(st==4){vec3 cell=floor(q*55.);vec3 h=hash33(cell);return c*(.75+.45*h.x)*vec3(1.+.15*(h.y-.5),1.,1.-.1*h.z);}
  if(st==5){return mix(c,vec3(1.),.6)*(.9+.1*(fbm(q*20.,3)*.5+.5));}
  return c;}
vec3 dirFromUv(vec2 uv){float lon=(uv.x-.5)*6.28318530718;float lat=(uv.y-.5)*PI;return vec3(cos(lat)*cos(lon),sin(lat),-cos(lat)*sin(lon));}
/* types: 0 terran 1 ocean 2 archipelago 3 desert 4 forest 5 ice 6 gas 7 city 8 barren 9 lava 10 hive 11 toxic 12 star-swamp/garden */
float height(vec3 p){
  vec3 q=p*uFreq+uSeed;
  if(uType==6){return 0.;}
  vec3 w=vec3(fbm(q*.8+1.7,4),fbm(q*.8+9.2,4),fbm(q*.8+4.4,4));
  q+=w*uWarp;
  float h=fbm(q,uOct)*.5+.5;
  h=pow(h,1.15)*1.08;
  if(uBase>.5){float lon=atan(-p.z,p.x);float la=asin(clamp(p.y,-1.,1.));float b=texture2D(tBase,vec2(lon/6.28318530718+.5,la/PI+.5)).r;
    h=uSea+(b-.5)*.3+(h-.5)*.12;}
  if(uMapOn>.5){float lon=atan(-p.z,p.x);float la=asin(clamp(p.y,-1.,1.));vec2 muv=vec2(lon/6.28318530718+.5,la/PI+.5);
    vec4 Hi=texture2D(tMapHi,muv);vec4 Lo=texture2D(tMapLo,muv);float ml=Hi.r;
    h=uSea+(ml-.5)*.05+Lo.r*.07*ml+(h-.5)*(.05+.1*ml);
    h+=(Lo.g*.75+Hi.g*.35)*uMapMtn*(.4+.9*ridged(q*4.6+2.,6))*ml;
    if(Hi.b>.55)h=min(h,uSea-.015);}
  h+=featHeight(p,q);
  float land=smoothstep(uSea-.02,uSea+.18,h);
  float r=ridged(q*1.9+3.1,uOct-2);
  h+=uRough*r*land*.35;
  if(uType==2){h=fbm(q*2.6,uOct)*.5+.5;h+=fbm(q*.6+5.,3)*.18;}
  if(uType==8||uType==5){h+=craters(p*7.+uSeed)*.05*uRough+craters(p*19.+uSeed*2.)*.02*uRough;}
  if(uType==3){float d=snoise(vec3(q.x*uDune,q.y*uDune*.25,q.z*uDune)+w*2.);h+=abs(d)*.06;}
  return h;
}
vec3 lerp3(vec3 a,vec3 b,float t){return mix(a,b,clamp(t,0.,1.));}
vec3 ramp6(float t){t=clamp(t,0.,1.)*5.;
  if(t<1.)return mix(uP0,uP1,t);if(t<2.)return mix(uP1,uP2,t-1.);if(t<3.)return mix(uP2,uP3,t-2.);if(t<4.)return mix(uP3,uP4,t-3.);return mix(uP4,uP5,t-4.);}
void main(){
  vec3 p=dirFromUv(vUv);
  float lat=asin(clamp(p.y,-1.,1.));float alat=abs(lat)*57.2958;
  vec3 q=p*uFreq+uSeed;
  if(uPass==2){ /* clouds */
    vec3 c=p*uCloudScale+uSeed*1.7;
    vec3 w=vec3(fbm(c*.7+2.,3),fbm(c*.7+7.,3),fbm(c*.7+12.,3));
    float band=sin(lat*6.+w.x*3.)*.12;
    float n=fbm(c+w*1.4+vec3(0.,lat*2.,0.),7)*.5+.5+band;
    float cov=smoothstep(1.-uCloud,1.-uCloud+.35,n);
    float wisp=fbm(c*3.+w*2.,5)*.5+.5;
    cov*=.65+.35*wisp;
    if(uType==6)cov*=.0;
    gl_FragColor=vec4(vec3(cov),1.);return;}
  float h=height(p);
  bool water=false;vec3 col;float spec=0.;float lights=0.;
  float m=fbm(q*1.3+11.,5)*.5+.5;m=clamp(m+uMoist,0.,1.);
  float det=fbm(q*14.,4);
  if(uType==6){ /* gas giant */
    vec3 w=vec3(fbm(q*.9,5),fbm(q*.9+4.,5),0.);
    float t=sin(lat*uBands+w.x*2.2+fbm(vec3(q.x*3.,lat*30.,q.z*3.),6)*1.1)*.5+.5;
    t=mix(t,fbm(q*2.+w*3.,6)*.5+.5,.25);
    col=ramp6(t);
    float storm=fbm(q*1.2+30.,4);if(storm>.42)col=mix(col,uP5,smoothstep(.42,.6,storm)*.7);
  } else if(uType==3){ /* desert */
    float t=clamp((h-.25)*1.6,0.,1.);
    col=ramp6(.15+t*.75+det*.05);
    float dune=abs(snoise(vec3(q.x*uDune,q.y*uDune*.22,q.z*uDune)+vec3(fbm(q,3)*3.)));
    col*=.9+.18*smoothstep(.0,.25,dune);
    if(uMapOn>.5&&h>=uSea){float lon=atan(-p.z,p.x);float la=asin(clamp(p.y,-1.,1.));vec2 muv=vec2(lon/6.28318530718+.5,la/PI+.5);
      float rw=texture2D(tMapLo,muv).b;vec3 rc=texture2D(tMapReg,muv).rgb;col=mix(col,rc*(.9+.18*smoothstep(.0,.25,dune))*(.92+det*.1),clamp(rw*1.1,0.,1.));}
    if(h<uSea){water=true;col=mix(uP0,uP1,smoothstep(uSea-.06,uSea,h));spec=1.;}
    if(alat>uIce)col=mix(col,vec3(.93,.92,.88),smoothstep(uIce,uIce+6.,alat));
  } else if(uType==5){ /* ice */
    float crack=1.-abs(snoise(q*4.+fbm(q*2.,4)*2.));crack=pow(crack,18.);
    col=ramp6(.3+h*.5+det*.06);
    col=mix(col,uP1,crack*.8);
    if(h<uSea){col=mix(uP0,uP2,.5+det*.3);spec=.3;}
  } else if(uType==12){ /* living Dyson shell: woven canopy with gaps of starlight */
    float cell=ridged(q*2.6+fbm(q*1.5,3)*.8,7);
    float lattice=smoothstep(.5,.78,cell);
    col=mix(uP1,uP3,lattice)*(.75+.5*(fbm(q*34.,4)*.5+.5));
    col=mix(col,uP4,smoothstep(.2,.7,fbm(q*5.,4)*.5+.5)*.45);
    col=mix(col,uP5,smoothstep(.85,.97,cell)*.35);
    float gap=(1.-smoothstep(.1,.2,cell))*.85;
    lights=gap;col*=1.-gap*.6;
  } else if(uType==8||uType==9){ /* barren / lava */
    col=ramp6(clamp(h*.9+det*.08,0.,1.)*.95);
    if(uType==9){float crack=1.-abs(snoise(q*3.+fbm(q*2.,5)*2.5));crack=pow(crack,12.);lights=crack*smoothstep(.55,.3,h)+smoothstep(uSea,uSea-.1,h);col*=1.-lights*.5;}
    if(h<uSea&&uType==8){col=mix(uP0,uP1,.6);}
    if(alat>uIce)col=mix(col,vec3(.9,.9,.92),smoothstep(uIce,uIce+5.,alat)*.9);
  } else {
    float sea=uSea;
    if(h<sea){water=true;
      float dpt=smoothstep(sea-.22,sea,h);
      col=mix(uP0,uP1,pow(dpt,2.2));
      if(uType==11){col=mix(col,uP3*.6,fbm(q*5.,4)*.5+.4);}
      spec=1.;
    } else {
      float e=clamp((h-sea)/.42,0.,1.);
      float temp=1.-alat/90.*1.05-e*.35+det*.05;float bw=0.;
      vec3 low=lerp3(uP2,uP3,smoothstep(.3,.75,m+det*.1));
      for(int i=0;i<14;i++){if(i>=uNF)break;if(int(uFB[i].x+.5)!=3)continue;
        float ang=acos(clamp(dot(p,uFA[i].xyz),-1.,1.));if(ang>uFA[i].w*1.6)continue;float en=fbm(p*6.+float(i)*2.3,4);
        float w=1.-smoothstep(uFA[i].w*.5,uFA[i].w*1.1,ang+en*uFA[i].w*.45);
        low=mix(low,biomeStyle(int(uFB[i].z+.5),uFC[i].rgb,q,p),w*uFB[i].y);bw=max(bw,w*uFB[i].y*(int(uFB[i].z+.5)==2?.0:1.));}
      if(uMapOn>.5){float lon=atan(-p.z,p.x);float la=asin(clamp(p.y,-1.,1.));vec2 muv=vec2(lon/6.28318530718+.5,la/PI+.5);
        float rw=texture2D(tMapLo,muv).b;vec3 rc=texture2D(tMapReg,muv).rgb;
        if(rw>.004){low=mix(low,biomeStyle(0,rc,q,p)*.5+biomeStyle(1,rc,q,p)*.5,clamp(rw*1.15,0.,1.));bw=max(bw,rw*.92);}}
      col=lerp3(low,uP4,smoothstep(.4,.8,e+det*.05)*(1.-bw*.85));
      if(uType==4){ /* world-forest: dense canopy with clumps */
        float cl=fbm(q*22.,5)*.5+.5;float cl2=fbm(q*70.,3)*.5+.5;
        col=mix(uP2,uP3,smoothstep(.35,.7,cl))*(.82+.3*cl2);
        col=mix(col,uP4,smoothstep(.55,.9,e)*.6);
        float riv=abs(snoise(q*3.3+fbm(q*2.,4)*1.5));if(riv<.025&&e<.5){col=mix(col,uP1,.85);water=true;spec=.6;}
      }
      if(uType==7||uType==10){ /* city & hive worlds: built-up land */
        float grid=step(.92,max(abs(sin(q.x*260.+det*4.)),abs(sin(q.z*260.+q.y*120.))));
        float urb=smoothstep(.35,.6,fbm(q*3.+20.,4)*.5+.5+uLights*.4);
        col=mix(col,uP5*.85+det*.06,urb*.75);col=mix(col,col*.7,grid*urb*.6);
      }
      if(uType==11){col=mix(col,uP3,smoothstep(.3,.6,fbm(q*8.,4)*.5+.5)*.5);}
      col=mix(col,uP5,clamp(smoothstep(.06,-.04,temp)+smoothstep(.88,.98,e),0.,1.)*(1.-bw));
    }
    if(alat>uIce)col=mix(col,vec3(.94,.96,1.),smoothstep(uIce,uIce+4.,alat+det*6.));
  }
  if(uPass==0){gl_FragColor=vec4(pow(clamp(col,0.,1.),vec3(1./2.2)),water?spec:0.);return;}
  /* pass 1: object-space normal + city lights */
  vec3 t1=normalize(cross(vec3(0.,1.,0.),p)+vec3(1e-4,0.,0.));vec3 t2=normalize(cross(p,t1));
  float e=uEps;
  float hx=height(normalize(p+t1*e)),hy=height(normalize(p+t2*e));
  float k=water?0.:uBump;
  if(uType==6)k=0.;
  vec3 n=normalize(p-(t1*(hx-h)+t2*(hy-h))/e*k*.02);
  if(uType!=9&&uType!=12&&uLights>0.&&!water){
    float pop=fbm(q*2.2+40.,4)*.5+.5;float pop2=fbm(q*7.+60.,4)*.5+.5;
    float cityness=smoothstep(.62-uLights*.5,.9-uLights*.4,pop)*smoothstep(.45,.7,pop2+uLights*.3);
    float e2=clamp((h-uSea)/(1.-uSea),0.,1.);
    cityness*=1.-smoothstep(.25,.6,e2);
    float sp=snoise(p*420.+uSeed)*.5+.5;float sp2=snoise(p*1500.)*.5+.5;
    lights=cityness*(smoothstep(.45,.8,sp)*.7+smoothstep(.6,.95,sp2)*.6);
    if(uType==7||uType==10)lights=max(lights,smoothstep(.4,.7,pop)*(.35+.65*smoothstep(.5,.9,sp2)));
    if(alat>uIce)lights=0.;
  }
  if(uWall>0.){vec3 wn=normalize(vec3(.18,.96,.2));vec3 wc=normalize(vec3(1.,.21,0.));
    float dd=abs(dot(p,wn));float span=smoothstep(cos(.5),cos(.42),dot(p,wc));
    lights=max(lights,exp(-dd*dd*90000.)*span);}
  if(uType==1&&uLights>0.){float sp=snoise(p*300.+uSeed)*.5+.5;lights=smoothstep(.93,.97,sp)*uLights;}
  gl_FragColor=vec4(n*.5+.5,clamp(lights,0.,1.));
}`;

/* ---- planet surface: samples the baked maps, lights them, adds close-up detail ---- */
const PLANET_VS=`
varying vec3 vObj;varying vec3 vNW;varying vec3 vWP;
void main(){vObj=normalize(position);vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;vNW=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`;
const PLANET_FS=`
uniform sampler2D tAlb,tNrm,tCld,tMapHi;
uniform float uMapOn,uRealm,uRStyle;uniform vec3 uRC1,uRC2,uRC3;
uniform vec3 uSun,uSunCol,uAtmo,uLightCol,uLava,uSeed;
uniform float uAtmoK,uCloudShift,uDetail,uAmb,uHasCld,uLavaOn,uTime,uHasSea;
uniform vec3 uWaterCol,uLandCol;
uniform mat3 uRot;
varying vec3 vObj;varying vec3 vNW;varying vec3 vWP;
${GLSL_NOISE}
vec2 seamUv(vec3 d){float lon=atan(-d.z,d.x);float lat=asin(clamp(d.y,-1.,1.));
  float u1=fract(lon/6.28318530718+.5);float u2=fract(lon/6.28318530718)-.5;
  float u=fwidth(u1)<fwidth(u2)-.001?u1:u2;return vec2(u,lat/3.14159265359+.5);}
void main(){
  vec3 d=normalize(vObj);
  vec2 uv=seamUv(d);
  vec4 A=texture2D(tAlb,uv);vec4 B=texture2D(tNrm,uv);
  vec3 alb=pow(A.rgb,vec3(2.2));
  vec3 nO=normalize(B.rgb*2.-1.);
  float wat=A.a;
  if(uDetail>.001){ /* live procedural detail: resolves past the baked 4K map as you zoom in */
    vec3 dp=d*240.+uSeed;
    float n1=snoise(dp),n2=snoise(dp*2.7+7.),n3=snoise(dp*7.3+3.),n4=snoise(dp*19.+11.);
    float fine=n1*.5+n2*.28+n3*.15+n4*.07;
    /* fractal coastlines: re-threshold the water mask with fine noise */
    if(uHasSea>.5&&A.a>.02&&A.a<.98){float w2=step(.5,A.a+fine*.42*uDetail);
      if(w2>.5&&A.a<.5)alb=uWaterCol;if(w2<.5&&A.a>=.5)alb=uLandCol*(.85+.3*n2);wat=w2;}
    if(uMapOn>.5){vec4 Hm=texture2D(tMapHi,uv);float lm=Hm.r+fine*.16*uDetail;bool wm=lm<.5||Hm.b>.55;
      if(wm&&A.a<.5)alb=uWaterCol;if(!wm&&A.a>=.5)alb=uLandCol*(.85+.3*n2);wat=wm?1.:0.;}
    float land=1.-wat;
    alb*=1.+fine*.22*uDetail*land;
    vec3 g=vec3(snoise(dp*3.+1.),snoise(dp*3.+5.),snoise(dp*3.+9.))*.6+vec3(snoise(dp*9.+2.),snoise(dp*9.+6.),snoise(dp*9.+10.))*.4;
    nO=normalize(nO+(g-d*dot(g,d))*.16*uDetail*land);
    A.a=wat;
  }
  vec3 N=normalize(uRot*nO);
  vec3 Ng=normalize(vNW);
  vec3 L=normalize(uSun);vec3 V=normalize(cameraPosition-vWP);
  float ndlG=dot(Ng,L);
  float day=smoothstep(-.06,.2,ndlG);
  float diff=max(dot(N,L),0.);
  diff=mix(diff,max(ndlG,0.),.25)*day;
  float cld=0.;
  if(uHasCld>.5){vec2 cu=seamUv(d);cu.x+=uCloudShift;vec3 Lo=transpose(uRot)*L;
    cld=texture2D(tCld,vec2(cu.x+Lo.x*.004,cu.y+Lo.y*.004)).r;}
  vec3 col=alb*(uAmb+diff*uSunCol*(1.-cld*.45));
  if(A.a>.01){vec3 H=normalize(L+V);float s=pow(max(dot(normalize(Ng+(N-Ng)*.25),H),0.),70.);col+=uSunCol*s*.55*A.a*day*(1.-cld);
    col+=uAtmo*.05*A.a*day;}
  float night=1.-smoothstep(-.2,.06,ndlG);
  col+=uLightCol*B.a*night*1.6*(1.-cld*.75);
  if(uLavaOn>.5)col+=uLava*B.a*(1.3+.3*sin(uTime*1.3+d.x*40.));
  float fr=pow(1.-max(dot(Ng,V),0.),3.);
  col=mix(col,uAtmo*(.15+.85*day),clamp(fr*uAtmoK*.55,0.,1.)*smoothstep(-.35,.25,ndlG));
  col+=uAtmo*uAtmoK*.035*day;
  if(uRealm>.5&&uRealm<1.5){ /* Cognitive Realm: the subastral over the same ground */
    float pl=1.-wat;vec3 cs;
    vec3 g=d*620.;vec3 ci=floor(g);vec3 f=fract(g)-.5;vec3 hh=fract(sin(vec3(dot(ci,vec3(127.1,311.7,74.7)),dot(ci,vec3(269.5,183.3,246.1)),dot(ci,vec3(113.5,271.9,124.6))))*43758.5453);
    float sw=snoise(d*5.+vec3(uTime*.03))*.5+.5;float sw2=snoise(d*17.-vec3(uTime*.05))*.5+.5;
    if(uRStyle<.5){float r=length(f);float bead=smoothstep(.5,.28,r);vec3 bc=mix(uRC1*.18,mix(uRC1,uRC2,hh.x)*(.5+.5*hh.y),bead);bc+=vec3(1.)*pow(max(0.,1.-length(f-vec3(-.12,.14,0.))*5.),6.)*bead*.6;cs=mix(mix(uRC1*.45,uRC2*.55,sw*.6+sw2*.4),bc,clamp(uDetail*1.6,0.,1.));}
    else if(uRStyle<1.5){cs=mix(uRC1,uRC2,smoothstep(.2,.8,sw*.7+sw2*.3));}
    else if(uRStyle<2.5){float t=snoise(d*3.+vec3(uTime*.12))*.5+.5;float t2=snoise(d*9.+vec3(-uTime*.2))*.5+.5;cs=mix(uRC1,uRC2,smoothstep(.3,.7,t))*(.6+.8*t2);pl=1.;}
    else if(uRStyle<3.5){float st=sin(d.x*40.+sw*9.)*.5+.5;cs=mix(mix(uRC1,uRC2,sw),uRC3*1.6+.2,smoothstep(.6,1.,st)*.6)*(.8+.4*sw2);}
    else{cs=mix(uRC1*.25,uRC2,smoothstep(.55,.95,sw2)*.8);}
    float sheen=pow(max(0.,1.-length(f)*2.),3.)*hh.z;
    vec3 gr=uRC3*(.55+.45*(snoise(d*60.)*.5+.5))+vec3(.05)*sheen;
    vec3 base=mix(gr,cs,pl);
    float lt=.3+.7*max(dot(N,L),0.);
    col=base*lt;
    float flame=B.a*smoothstep(.55,.95,hh.x)*(.7+.3*sin(uTime*6.+hh.y*30.));
    col+=vec3(1.,.72,.38)*flame*1.4;
    col=mix(col,uRC2*.35,clamp(fr*.6,0.,1.));}
  else if(uRealm>1.5){ /* Spiritual Realm: Investiture and Connection, not a landscape */
    float n1=abs(snoise(d*4.+vec3(uTime*.05)));float n2=abs(snoise(d*11.-vec3(uTime*.08)));
    float web=pow(1.-smoothstep(0.,.08,n1),2.)+pow(1.-smoothstep(0.,.06,n2),2.)*.6;
    float edge=1.-smoothstep(.0,.25,abs((1.-wat)-.5)*2.);
    col=uRC3*.05+mix(uRC1,uRC2,smoothstep(-.5,.5,snoise(d*2.)))*web*1.2+uRC1*.08*(1.-wat)+vec3(1.,.95,.8)*edge*.12;
    col+=mix(uRC1,uRC2,.5)*fr*1.2;}
  gl_FragColor=vec4(col,1.);
  #include <tonemapping_fragment>
  #include <encodings_fragment>
}`;
const CLOUD_FS=`
uniform sampler2D tCld;uniform vec3 uSun,uSunCol,uCloudCol,uAtmo;uniform float uCloudShift,uOpacity;uniform mat3 uRot;
varying vec3 vObj;varying vec3 vNW;varying vec3 vWP;
vec2 seamUv(vec3 d){float lon=atan(-d.z,d.x);float lat=asin(clamp(d.y,-1.,1.));
  float u1=fract(lon/6.28318530718+.5);float u2=fract(lon/6.28318530718)-.5;
  float u=fwidth(u1)<fwidth(u2)-.001?u1:u2;return vec2(u,lat/3.14159265359+.5);}
void main(){vec3 d=normalize(vObj);vec2 uv=seamUv(d);uv.x+=uCloudShift;
  float c=texture2D(tCld,uv).r;
  vec3 Ng=normalize(vNW);float ndl=dot(Ng,normalize(uSun));float day=smoothstep(-.12,.25,ndl);
  vec3 V=normalize(cameraPosition-vWP);float fr=pow(1.-max(dot(Ng,V),0.),2.);
  vec3 col=uCloudCol*(.025+uSunCol*max(ndl,0.)*day*.95);
  col=mix(col,uAtmo*day,fr*.35);
  gl_FragColor=vec4(col,c*uOpacity*(.25+.75*smoothstep(-.3,.1,ndl)));
  #include <tonemapping_fragment>
  #include <encodings_fragment>
}`;
const ATMO_VS=`varying vec3 vN;varying vec3 vV;varying vec3 vNW;
void main(){vN=normalize(normalMatrix*normal);vNW=normalize(mat3(modelMatrix)*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
const ATMO_FS=`uniform vec3 uC,uSun;uniform float uK,uEdge;varying vec3 vN;varying vec3 vV;varying vec3 vNW;
void main(){float d=dot(vN,vV);float a=pow(clamp(-d*uEdge,0.,1.),1.8)*(1.-pow(clamp(-d*uEdge,0.,1.),8.)*.0);
  float l=smoothstep(-.45,.5,dot(-vNW,normalize(uSun))*-1.);
  float lit=smoothstep(-.5,.45,dot(normalize(vNW),normalize(uSun)));
  vec3 c=uC*a*uK*(.1+.9*lit);gl_FragColor=vec4(c,1.);}`;
const RING_FS=`uniform vec3 uC1,uC2,uSun;uniform float uIn,uOut,uSeed;varying vec2 vUv;varying vec3 vWP;
${GLSL_NOISE}
void main(){float r=vUv.x;float b=snoise(vec3(r*60.+uSeed,uSeed,0.))*.5+.5;float b2=snoise(vec3(r*230.,uSeed*2.,1.))*.5+.5;
  float gap=smoothstep(.0,.05,abs(r-.62))*smoothstep(.0,.03,abs(r-.83));
  float a=(.25+.75*b)*(.6+.4*b2)*gap*smoothstep(0.,.06,r)*smoothstep(1.,.85,r);
  vec3 c=mix(uC1,uC2,b2);gl_FragColor=vec4(c*(.35+.65*b),a*.85);
  #include <tonemapping_fragment>
  #include <encodings_fragment>
}`;
const RING_VS=`varying vec2 vUv;varying vec3 vWP;void main(){vUv=uv;vWP=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

/* ---- galaxy points ---- */
const GAL_VS=`attribute float aSize;attribute vec3 aCol;varying vec3 vC;varying float vA;uniform float uScale,uNear;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float z=-mv.z;
  float raw=aSize*uScale/z;
  gl_PointSize=clamp(raw,1.,7.);
  vA=smoothstep(uNear*.3,uNear,z)*clamp(raw/1.6,.25,1.)*(1.-smoothstep(5.,40.,raw)*.9);
  vC=aCol;gl_Position=projectionMatrix*mv;}`;
const GAL_FS=`varying vec3 vC;varying float vA;uniform float uAlpha;
void main(){vec2 c=gl_PointCoord-.5;float d=dot(c,c);float a=exp(-d*14.)*vA*uAlpha;if(a<.003)discard;gl_FragColor=vec4(vC*a,a);}`;
const DUST_FS=`varying vec3 vC;varying float vA;uniform float uAlpha;
void main(){vec2 c=gl_PointCoord-.5;float d=dot(c,c);float a=exp(-d*10.)*vA*uAlpha;if(a<.003)discard;gl_FragColor=vec4(vC,a);}`;
/* farcaster / river links: a pulse travels along each segment */
const LINK_VS=`attribute float aT;attribute float aW;varying float vT;varying float vW;void main(){vT=aT;vW=aW;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const LINK_FS=`uniform vec3 uC;uniform float uTime,uA,uSpeed,uDash,uBase,uGain;varying float vT;varying float vW;
void main(){float p=fract(vT*uDash-uTime*uSpeed+vW*.37);float pulse=smoothstep(.0,.08,p)*smoothstep(.35,.08,p);
  float a=uA*(uBase+(1.-uBase)*pulse);gl_FragColor=vec4(uC*a*uGain,a);}`;

/* ===================== HELPERS ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TAU=Math.PI*2,DEG=Math.PI/180;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function isMob(){return matchMedia("(max-width:820px), (max-height:520px) and (pointer:coarse)").matches;}
function rng(seed){let s=seed>>>0||1;return()=>{s=Math.imul(s^(s>>>15),2246822507);s=Math.imul(s^(s>>>13),3266489909);s^=s>>>16;return (s>>>0)/4294967296;};}
function hashStr(s){s=String(s);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function gauss(R){return (R()+R()+R()+R()-2)/2;}
const NUMW=["no","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];
const ROMAN=["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
const DEF_BOOK_COL=["#e0b85c","#86a6ea","#efe8da","#d24a40","#b2a898","#7cc6a2","#b88cec","#e8a948","#6ab0d0","#c8a8f0","#9ad08a","#f08a7c"];
const DEF_SIGIL='<circle cx="24" cy="24" r="17" fill="none" stroke="url(#cg)" stroke-width="1.5"/><circle cx="24" cy="24" r="10" fill="none" stroke="url(#cg)" stroke-width="1" opacity=".7"/><circle cx="24" cy="24" r="2.4" fill="url(#cg)"/>';
const ARR=x=>Array.isArray(x)?x:(x==null?[]:[x]);

/* theme key → CSS variable */
const THEME_VARS={void:"--void",deep:"--deep",panel:"--panel",accent:"--lapis",accentHi:"--lapis-hi",accentLo:"--lapis-lo",chrome:"--chrome",ember:"--ember",amber:"--amber",
  text:"--text",muted:"--muted",faint:"--faint",line:"--line",lineStrong:"--line-strong",fontDisplay:"--f-display",fontTitle:"--f-title",fontBody:"--f-body",fontHud:"--f-hud",
  chromeGrad:"--chromegrad",panelRgb:"--panel-rgb",panelRgb2:"--panel-rgb2",insetRgb:"--inset-rgb",btnRgb:"--btn-rgb",ink:"--ink",glowRgb:"--glow-rgb",hiRgb:"--hi-rgb",
  swRgb:"--sw-rgb",pipRgb:"--pip-rgb",title:"--title",title2:"--title2",title3:"--title3",shadeRgb:"--shade-rgb",tip1:"--tip1",tip2:"--tip2",voidRgb:"--void-rgb",
  codexRgb:"--codex-rgb",splashGlow:"--splash-glow",brandSpacing:"--brand-ls"};

/* ===================== PACK NORMALISATION ===================== */
function normalise(P){
  if(!P||typeof P!=="object")throw new Error("No atlas pack was loaded.");
  const meta=Object.assign({title:"Atlas"},P.meta||{});meta.series=meta.series||meta.title;
  const theme=Object.assign({},P.theme||{});
  const mode=(P.spoilers&&P.spoilers.mode)==="single"?"single":"cumulative";
  const books={};const src=P.books&&Object.keys(P.books).length?P.books:{1:{title:meta.series}};
  Object.keys(src).map(Number).filter(k=>k>=1&&isFinite(k)).sort((a,b)=>a-b).forEach(k=>{const b=Object.assign({},src[k]);
    b.n=b.n||ROMAN[k]||String(k);b.title=b.title||("Book "+b.n);b.c=b.c||DEF_BOOK_COL[(k-1)%DEF_BOOK_COL.length];books[k]=b;});
  const bookIds=Object.keys(books).map(Number);
  const worlds=ARR(P.worlds).filter(w=>w&&w.id!=null).map(w=>{w.id=String(w.id);w.name=w.name||w.id;w.group=w.group||"other";
    w.books=ARR(w.books).map(Number).filter(n=>books[n]);w.blurb=w.blurb||"";if(!w.gfx)w.gfx={type:"terran"};w.sites=ARR(w.sites).filter(s=>s&&s.id!=null);return w;});
  if(!worlds.length)throw new Error("This pack has no worlds.");
  const ids=new Set(worlds.map(w=>w.id));
  const events=ARR(P.events).filter(e=>e&&ids.has(e.world)&&books[e.book]).map((e,i)=>{if(e.id==null)e.id="ev"+i;e.id=String(e.id);e.title=e.title||"";e.text=e.text||"";return e;});
  let groups=ARR(P.groups).filter(g=>g&&g.id).map(g=>Object.assign({},g,{name:g.name||g.id}));
  worlds.forEach(w=>{if(!groups.some(g=>g.id===w.group))groups.push({id:w.group,name:w.group==="other"?"Other":w.group.charAt(0).toUpperCase()+w.group.slice(1)});});
  const G=Object.assign({},P.galaxy||{});
  const ui=Object.assign({},P.ui||{});
  ui.homeButton=ui.homeButton||"Home";ui.homeAction=ui.homeAction||("Fly to "+ui.homeButton.toLowerCase());ui.homeLink=ui.homeLink||ui.homeButton;ui.homeCrumb=ui.homeCrumb||ui.homeButton;ui.galaxyCrumb=ui.galaxyCrumb||"Milky Way";
  ui.indexTitle=ui.indexTitle||("Worlds of "+meta.series);ui.crumbGroups=ui.crumbGroups!==false;ui.galaxyButton=ui.galaxyButton||"Galaxy";
  ui.chronTitle=ui.chronTitle||"THE CHRONICLE";ui.codexTitle=ui.codexTitle||"CODEX";ui.showCredits=ui.showCredits!==false;ui.evCount=ui.evCount||"";
  const nW=bookIds.length<=12?NUMW[bookIds.length]:String(bookIds.length);
  if(ui.bookLabel==null)ui.bookLabel=mode==="cumulative"?"Reading":"";
  ui.allTitle=ui.allTitle||(mode==="cumulative"?"All "+nW+" books, with spoilers":"All "+nW+" books");
  ui.booksAria=ui.booksAria||(mode==="cumulative"?"The book you are reading through":"Filter by book");
  ui.hints=Object.assign(mode==="cumulative"?
    {galaxy:"Drag to turn · scroll to zoom · right-drag or shift-drag to pan · pick the book you are reading above",galaxyMob:"Drag to turn · pinch to zoom · tap a world · pick your book above"}:
    {galaxy:"Drag to turn · scroll to zoom · right-drag or shift-drag to pan · click a world",galaxyMob:"Drag to turn · pinch to zoom · tap a world"},
    {world:"Drag to turn the world · scroll to zoom in close · Esc returns to the galaxy",worldMob:"Drag to turn the world · pinch to zoom · tap a place"},ui.hints||{});
  if(ui.go===undefined){const m=worlds.find(w=>w.major)||worlds[0];ui.go={id:m.id,label:"Go to "+m.name};}
  if(ui.go&&!ids.has(ui.go.id))ui.go=null;
  const codex=ARR(P.codex).filter(t=>t&&t.id).map(t=>({id:t.id,t:t.title||t.id,list:ARR(t.list).filter(x=>x&&x.name)}));
  return {raw:P,id:P.id||"atlas",meta,theme,mode,books,bookIds,worlds,events,groups,G,ui,codex,intro:P.intro||{},legend:P.legend,hooks:P.hooks||{},
    spoil:Object.assign({dimLabel:mode==="cumulative"?.4:.35,dimMarker:mode==="cumulative"?.2:.15},P.spoilers||{})};
}

/* ===================== PAGE SHELL ===================== */
function buildShell(K){
  const M=K.meta,T=K.theme,U=K.ui;
  document.title=M.title;
  const root=document.documentElement;Object.keys(THEME_VARS).forEach(k=>{if(T[k]!=null)root.style.setProperty(THEME_VARS[k],String(T[k]));});
  let css=":root{"+K.bookIds.map(b=>"--b"+b+":"+K.books[b].c).join(";")+"}\n";
  K.bookIds.forEach(b=>{css+=".bk"+b+"{background:var(--b"+b+")"+(K.books[b].ink?";color:"+K.books[b].ink:"")+"}\n";});
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const stops=T.chromeStops||[[0,"#fff7e2"],[.45,"#e8cd8a"],[.68,"#9a7432"],[1,"#f4e2b2"]];
  const defs='<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">'+stops.map(s=>'<stop offset="'+s[0]+'" stop-color="'+s[1]+'"/>').join("")+'</linearGradient></defs>';
  const sig=T.sigil||DEF_SIGIL,ssig=T.splashSigil||sig;const TT=M.title.toUpperCase();
  const app=document.createElement("div");app.id="app";if(!U.showCredits)app.classList.add("nocredits");if(U.wrapBooks===true||(U.wrapBooks!==false&&K.bookIds.length>3))app.classList.add("manybooks");
  app.innerHTML=
'<canvas id="c" aria-label="'+esc(M.canvasLabel||("Three-dimensional map of the Milky Way and the worlds of "+M.series))+'"></canvas>'+
'<div class="vignette"></div><div id="labels"></div><div id="fade"></div>'+
'<header class="top"><div class="brand"><svg class="sigil" viewBox="0 0 48 48" aria-hidden="true">'+defs+sig+'</svg>'+
  '<div><h1 class="chrome">'+esc(TT)+'</h1><p>'+(M.tagline||"")+'</p></div></div>'+
 '<div class="controls"><button class="btn" id="idxBtn" aria-expanded="false" aria-controls="index">Worlds</button>'+
  (U.bookLabel?'<span class="seglbl">'+esc(U.bookLabel)+'</span>':"")+
  '<div class="seg" id="books" role="group" aria-label="'+esc(U.booksAria)+'"><button data-b="0" aria-pressed="true" title="'+esc(U.allTitle)+'">All</button>'+
  K.bookIds.map(b=>'<button data-b="'+b+'" aria-pressed="false" title="'+esc(K.books[b].title+(K.books[b].y?" ("+K.books[b].y+")":""))+'">'+esc(K.books[b].n)+'</button>').join("")+'</div>'+
  '<button class="btn" id="galBtn">'+esc(U.galaxyButton)+'</button><button class="btn" id="webBtn">'+esc(U.homeButton)+'</button>'+
  '<button class="btn" id="cxBtn"'+(K.codex.length?"":" hidden")+'>Codex</button></div></header>'+
'<nav id="crumbs" aria-label="Location"></nav>'+
(K.raw.realms?'<div class="seg" id="realms" role="group" aria-label="Realm">'+["physical","cognitive","spiritual"].filter(r=>r==="physical"||K.raw.realms[r]).map(r=>{const R=K.raw.realms[r]||{};
  return '<button data-r="'+r+'" aria-pressed="'+(r==="physical")+'" title="'+esc(R.tip||"")+'">'+esc(R.label||(r.charAt(0).toUpperCase()+r.slice(1)))+'</button>';}).join("")+'</div>':"")+
'<aside class="panel" id="index" aria-label="Worlds"></aside><aside class="panel" id="dossier" aria-live="polite"></aside>'+
'<div id="navhint"></div><div id="bake" hidden>Charting surface<b><i></i></b></div><div id="tip" hidden></div>'+
'<section id="chron" aria-label="The Chronicle"><div class="chron-head"><h2 id="chronT">'+esc(U.chronTitle)+'</h2><span class="hint" id="legend"></span>'+
  '<span class="credits">'+(M.credits||"")+'</span></div><div id="track"></div></section>'+
'<div id="codex" hidden><div class="panel" role="dialog" aria-modal="true" aria-labelledby="cxT"><div class="cx-head"><h2 id="cxT" class="chrome">'+esc(U.codexTitle)+'</h2><span id="cxNote"></span>'+
  '<div class="cx-tabs" id="cxTabs"></div><button class="btn" id="cxClose">Close</button></div><div class="cx-body" id="cxBody"></div></div></div>'+
'<div id="splash"><div><svg width="'+(T.splashSize||78)+'" height="'+(T.splashSize||78)+'" viewBox="0 0 48 48" aria-hidden="true">'+ssig+'</svg><h1 class="chrome">'+esc(TT)+'</h1>'+
  (M.splash?'<p>'+esc(M.splash)+'</p>':"")+'<div class="ld" id="splashLd">Charting the galaxy</div></div></div>';
  document.body.appendChild(app);
}

/* ===================== ENGINE ===================== */
let STARTED=false;
function start(pack){
  if(STARTED)throw new Error("AtlasEngine.start may only be called once per page.");STARTED=true;
  const K=normalise(pack);buildShell(K);
  const BOOKS=K.books,BOOK_IDS=K.bookIds,WORLDS=K.worlds,EVENTS=K.events,G=K.G,UI=K.ui,CUM=K.mode==="cumulative";
  const GROUP_BY={};K.groups.forEach(g=>GROUP_BY[g.id]=g);
  const GROUP_NAME=g=>{const gr=GROUP_BY[g];if(!gr)return "";if(!gr.eras)return gr.name||"";let v=gr.name;const cur=S.book||99;Object.keys(gr.eras).map(Number).sort((a,b)=>a-b).forEach(k=>{if(cur>=k&&gr.eras[k]&&gr.eras[k].name)v=gr.eras[k].name;});return v||"";};
  const MOB=isMob();
  const C=h=>new THREE.Color(h);
  const CL=h=>new THREE.Color(h).convertSRGBToLinear();

/* ===================== RENDERER ===================== */
const canvas=$("#c");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,MOB?1.6:2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.0;
renderer.setClearColor(0x04050b,1);
const MAXTEX=renderer.capabilities.maxTextureSize||4096;
const ANISO=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const HD=window.__HD||Math.min(4096,MAXTEX);

/* ===================== SPACE COORDINATES =====================
   Scene units: 1 unit = 100 light-years. Galactic centre at the origin, the disc in the XZ plane.
   Pack map coordinates are kly: scene = (x*10, h*10+.2, y*10). Sol comes from galaxy.sol.
   Local space may be drawn around Sol with a logarithmic radius (dispR) so worlds 6 ly and
   6,000 ly away are both readable. */
const solMap=G.sol||[0,27.14];
const SOL=new THREE.Vector3(solMap[0]*10,0.2,solMap[1]*10);
const MIRROR=!!G.mirrorGal;
const EQ2GAL=[[-0.0548755604,-0.8734370902,-0.4838350155],[0.4941094279,-0.4448296300,0.7469822445],[-0.8676661490,-0.1980763734,0.4559837762]];
function radecToScene(ra,dec){const a=ra*DEG,d=dec*DEG;const e=[Math.cos(d)*Math.cos(a),Math.cos(d)*Math.sin(a),Math.sin(d)];
  const g=EQ2GAL.map(r=>r[0]*e[0]+r[1]*e[1]+r[2]*e[2]);return new THREE.Vector3(g[1],g[2],-g[0]).normalize();}
function lbToScene(l,b){l*=DEG;b*=DEG;return new THREE.Vector3(Math.cos(b)*Math.sin(l),Math.sin(b),-Math.cos(b)*Math.cos(l)).normalize();}
const mir=v=>{if(MIRROR)v.x=-v.x;return v;};
const dispR=ly=>3.0*Math.log(1+ly/6);
const MAPPOS=(x,y,h)=>new THREE.Vector3(x*10,(h||0)*10+.2,y*10);
const SECTORS=G.sectors||{};
const WORLD_BY={};
function worldPosition(w,depth){
  if(w.pos3)return new THREE.Vector3(+w.pos3[0]||0,+w.pos3[1]||0,+w.pos3[2]||0);
  if(w.map)return MAPPOS(+w.map[0]||0,+w.map[1]||0,w.map[2]);
  if(w.gal){const d=mir(lbToScene(w.gal.l,w.gal.b));return SOL.clone().add(d.multiplyScalar((w.gal.ly||0)/100));}
  if(w.at&&WORLD_BY[w.at.of]&&(depth||0)<8){const base=WORLD_BY[w.at.of];const p=worldPosition(base,(depth||0)+1).clone();const R=rng(hashStr(w.id));p.add(new THREE.Vector3(R()-.5,(R()-.5)*.5,R()-.5).multiplyScalar(w.at.spread||1.2));return p;}
  let dir=null;
  if(w.star&&w.star.ra!=null)dir=mir(radecToScene(w.star.ra,w.star.dec||0));
  else if(w.dir)dir=mir(lbToScene(w.dir.l||0,w.dir.b||0));
  else if(SECTORS[w.group]){const R=rng(hashStr(w.id));const sec=SECTORS[w.group];const l=(sec.l||0)+(R()-.5)*(sec.dl||0),b=(sec.b||0)+(R()-.5)*(sec.db||0);dir=mir(lbToScene(l,b));}
  if(!dir)return SOL.clone();
  const ly=(w.star&&w.star.ly)||w.ly||(G.groupLy&&G.groupLy[w.group])||G.defaultLy||300;
  return SOL.clone().add(dir.multiplyScalar(dispR(ly)));
}

/* ===================== SCENES & CAMERAS ===================== */
const gal=new THREE.Scene();
const camG=new THREE.PerspectiveCamera(50,1,.05,60000);
const wsc=new THREE.Scene();
const camW=new THREE.PerspectiveCamera(36,1,.005,4000);

/* ---------- the Milky Way ---------- */
const galMat=new THREE.ShaderMaterial({vertexShader:GAL_VS,fragmentShader:GAL_FS,uniforms:{uScale:{value:300},uNear:{value:6},uAlpha:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
const dustMat=new THREE.ShaderMaterial({vertexShader:GAL_VS,fragmentShader:DUST_FS,uniforms:{uScale:{value:300},uNear:{value:6},uAlpha:{value:.55}},transparent:true,depthWrite:false,blending:THREE.NormalBlending});
function pointsGeo(pos,col,size){const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("aCol",new THREE.BufferAttribute(col,3));g.setAttribute("aSize",new THREE.BufferAttribute(size,1));return g;}
/* arms: log spirals; `a` is the arm's angle at r=40 units */
const ARMS=(ARR(G.arms).length?ARR(G.arms):[{a:0,name:"Perseus Arm"},{a:Math.PI/2,name:"Norma Arm"},{a:Math.PI,name:"Scutum–Centaurus Arm"},{a:Math.PI*1.5,name:"Sagittarius Arm"}]).map(a=>({a:+a.a||0,name:a.name||""}));
const PITCH=Math.tan((G.pitch||12.5)*DEG);
function armAngle(r,a0){return a0+Math.log(r/40)/PITCH;}
const SAT={core:new THREE.Vector3()};
function buildGalaxy(){
  const N=MOB?70000:150000;const R=rng(G.seed||1977);
  const pos=new Float32Array(N*3),col=new Float32Array(N*3),siz=new Float32Array(N);
  const cOld=[1,.82,.58],cMid=[1,.93,.82],cYoung=[.62,.75,1],cHII=[1,.45,.62];
  for(let i=0;i<N;i++){let x,y,z,c,s;const k=R();
    if(k<.2){ /* bulge + bar */
      const r=Math.abs(gauss(R))*34;const th=R()*TAU;const ph=Math.acos(R()*2-1);
      x=r*Math.sin(ph)*Math.cos(th)*1.0;z=r*Math.sin(ph)*Math.sin(th)*.6;y=r*Math.cos(ph)*.55;
      if(R()<.4){const bl=gauss(R)*55;x+=bl*Math.cos(.45);z+=bl*Math.sin(.45);y*=.6;}
      c=cOld;s=1.6+R()*2.2;
    }else if(k<.8){ /* spiral arms */
      const arm=ARMS[(R()*ARMS.length)|0];const r=42+Math.pow(R(),.85)*430;
      const th=armAngle(r,arm.a)+gauss(R)*(.3+r/1600)+Math.sin(r*.05+arm.a*3)*.12;
      const rr=r*(1+gauss(R)*.06);x=Math.sin(th)*rr;z=Math.cos(th)*rr;y=gauss(R)*(3+r*.012);
      const yb=R();c=yb<.55?cYoung:yb<.9?cMid:cOld;s=1.1+R()*2.4;
      if(R()<.035){c=cHII;s=3+R()*4;}
    }else{ /* thin disc between the arms */
      const r=30+Math.pow(R(),.7)*480;const th=R()*TAU;x=Math.sin(th)*r;z=Math.cos(th)*r;y=gauss(R)*(4+r*.01);c=R()<.6?cMid:cOld;s=.9+R()*1.6;}
    const b=.55+R()*.5;pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;col[i*3]=c[0]*b;col[i*3+1]=c[1]*b;col[i*3+2]=c[2]*b;siz[i]=s;}
  gal.add(new THREE.Points(pointsGeo(pos,col,siz),galMat));
  /* optional spur: a short bridge of young stars (e.g. the Spur of Orion) */
  if(G.spur){const sp0=G.spur;const NS=MOB?(sp0.nMob||Math.round((sp0.n||5500)*2500/5500)):(sp0.n||5500);const rad=(sp0.r||27.1)*10,span=sp0.span||.8;
   const sp=new Float32Array(NS*3),sc=new Float32Array(NS*3),ss=new Float32Array(NS);
   for(let i=0;i<NS;i++){const th=(R()-.5)*span;const r=rad*Math.exp(PITCH*th*.6)*(1+gauss(R)*.05);const x=Math.sin(th)*r,z=Math.cos(th)*r;
     sp[i*3]=x;sp[i*3+1]=gauss(R)*3;sp[i*3+2]=z;const c=R()<.6?[.66,.78,1]:[1,.93,.82];const b=.22+R()*.33;sc.set([c[0]*b,c[1]*b,c[2]*b],i*3);ss[i]=.8+R()*1.6;}
   gal.add(new THREE.Points(pointsGeo(sp,sc,ss),galMat));}
  /* dust lanes trace the inner edge of each arm */
  const ND=MOB?9000:22000;const dp=new Float32Array(ND*3),dc=new Float32Array(ND*3),ds=new Float32Array(ND);
  for(let i=0;i<ND;i++){const arm=ARMS[(R()*ARMS.length)|0];const r=50+Math.pow(R(),.9)*380;const th=armAngle(r,arm.a)-.1+gauss(R)*.09+Math.sin(r*.05+arm.a*3)*.12;
    dp[i*3]=Math.sin(th)*r;dp[i*3+1]=gauss(R)*2;dp[i*3+2]=Math.cos(th)*r;const v=.04+R()*.04;dc[i*3]=v*1.2;dc[i*3+1]=v*.9;dc[i*3+2]=v*.7;ds[i]=5+R()*7;}
  gal.add(new THREE.Points(pointsGeo(dp,dc,ds),dustMat));
  /* satellite galaxies (always at their true positions) */
  [{l:280.5,b:-32.9,d:1600,n:MOB?5000:11000,r:40,name:"lmc"},{l:302.8,b:-44.3,d:2000,n:MOB?2200:5000,r:22,name:"smc"}].forEach(sg=>{
    const ctr=SOL.clone().add(lbToScene(sg.l,sg.b).multiplyScalar(sg.d));const p=new Float32Array(sg.n*3),c=new Float32Array(sg.n*3),s=new Float32Array(sg.n);
    for(let i=0;i<sg.n;i++){const bar=R()<.5;const v=new THREE.Vector3(gauss(R)*sg.r*(bar?1.4:1),gauss(R)*sg.r*.35,gauss(R)*sg.r*(bar?.45:1));
      p[i*3]=ctr.x+v.x;p[i*3+1]=ctr.y+v.y;p[i*3+2]=ctr.z+v.z;const yb=R()<.5;const b=.5+R()*.5;c[i*3]=(yb?.7:1)*b;c[i*3+1]=(yb?.8:.9)*b;c[i*3+2]=(yb?1:.8)*b;s[i]=1.4+R()*2.4;}
    gal.add(new THREE.Points(pointsGeo(p,c,s),galMat));SAT[sg.name]=ctr;});
  /* core glow */
  const core=glowSprite(glowTex([[0,"rgba(255,236,200,1)"],[.15,"rgba(255,200,140,.55)"],[.45,"rgba(200,120,80,.12)"],[1,"rgba(0,0,0,0)"]]),220,.75);gal.add(core);
  /* faint stars on the sky in every direction */
  skyStars(gal,MOB?2500:5000,30000,1.3);
  const and=glowSprite(glowTex([[0,"rgba(255,240,220,.9)"],[.3,"rgba(200,190,255,.25)"],[1,"rgba(0,0,0,0)"]]),900,.8);
  and.position.copy(lbToScene(121.2,-21.6).multiplyScalar(25000).add(SOL));and.scale.set(1400,520,1);and.material.rotation=.6;gal.add(and);SAT.andromeda=and.position.clone();
}
function glowTex(stops){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");const gr=g.createRadialGradient(64,64,0,64,64,64);
  stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return t;}
function glowSprite(tex,scale,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op==null?1:op}));s.scale.set(scale,scale,1);return s;}
function skyStars(scene,n,r,size){const g=new THREE.BufferGeometry();const p=new Float32Array(n*3),c=new Float32Array(n*3);const R=rng(n+3);
  for(let i=0;i<n;i++){const u=R()*2-1,t=R()*TAU,s=Math.sqrt(1-u*u);p[i*3]=s*Math.cos(t)*r;p[i*3+1]=u*r;p[i*3+2]=s*Math.sin(t)*r;
    const w=Math.pow(R(),2.4)*.85+.08,warm=R()<.3;c[i*3]=w;c[i*3+1]=w*(warm?.84:.95);c[i*3+2]=w*(warm?.7:1);}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size,sizeAttenuation:false,vertexColors:true,transparent:true,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);return pts;}
const GLOW_W=glowTex([[0,"rgba(255,255,255,1)"],[.18,"rgba(220,232,255,.55)"],[.5,"rgba(120,160,255,.1)"],[1,"rgba(0,0,0,0)"]]);
const GLOW_R=glowTex([[0,"rgba(255,230,210,1)"],[.2,"rgba(255,90,50,.55)"],[.55,"rgba(160,30,10,.12)"],[1,"rgba(0,0,0,0)"]]);
const RING_T=(function(){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");g.strokeStyle="#fff";g.lineWidth=5;g.beginPath();g.arc(64,64,52,0,TAU);g.stroke();
  g.lineWidth=2;for(let i=0;i<4;i++){const a=i*Math.PI/2;g.beginPath();g.moveTo(64+Math.cos(a)*40,64+Math.sin(a)*40);g.lineTo(64+Math.cos(a)*30,64+Math.sin(a)*30);g.stroke();}return new THREE.CanvasTexture(cv);})();

/* point specs (PACK_FORMAT 14.4) */
function resolvePoint(p){let v=null;
  if(p==null)return null;
  if(typeof p==="string"){const w=WORLD_BY[p];return w?w.pos.clone():null;}
  if(p.world!=null){const w=WORLD_BY[p.world];v=w?w.pos.clone():null;}
  else if(p.map)v=MAPPOS(+p.map[0]||0,+p.map[1]||0,p.map[2]);
  else if(p.xyz)v=new THREE.Vector3(+p.xyz[0]||0,+p.xyz[1]||0,+p.xyz[2]||0);
  else if(p.sol)v=SOL.clone().add(new THREE.Vector3(+p.sol[0]||0,+p.sol[1]||0,+p.sol[2]||0));
  else if(p.gal){const g=Array.isArray(p.gal)?{l:p.gal[0],b:p.gal[1],ly:p.gal[2]}:p.gal;v=SOL.clone().add(mir(lbToScene(g.l||0,g.b||0)).multiplyScalar((g.ly||0)/100));}
  else if(p.lb)v=SOL.clone().add(mir(lbToScene(+p.lb[0]||0,+p.lb[1]||0)).multiplyScalar(dispR(p.ly||G.defaultLy||300)));
  else if(p.sat){v=SAT[p.sat]?SAT[p.sat].clone():null;}
  else if(p.arm!=null){const arm=typeof p.arm==="number"?ARMS[p.arm]:ARMS.find(a=>a.name===p.arm);if(arm){const r=(p.r||30)*10;const th=armAngle(r,arm.a);v=new THREE.Vector3(Math.sin(th)*r,0,Math.cos(th)*r);}}
  if(v&&p.off)v.add(new THREE.Vector3(+p.off[0]||0,+p.off[1]||0,+p.off[2]||0));
  return v;}

/* ===================== WORLD MARKERS IN THE GALAXY ===================== */
const GMARK={};const GLOWS=[];
const linkMats=[];
const LK=Object.assign({base:.28,gain:1,curveMax:2.4},G.link||{});
function linkMaterial(color,a,speed,dash){const m=new THREE.ShaderMaterial({vertexShader:LINK_VS,fragmentShader:LINK_FS,uniforms:{uC:{value:CL(color)},uTime:{value:0},uA:{value:a},uSpeed:{value:speed},uDash:{value:dash},uBase:{value:LK.base},uGain:{value:LK.gain}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});linkMats.push(m);return m;}
function linkLines(pairs,mat,curve){const P=[],T=[],W=[];
  pairs.forEach((pr,k)=>{const a=pr[0],b=pr[1];const seg=curve?24:1;const mid=a.clone().add(b).multiplyScalar(.5);
    if(curve){const off=new THREE.Vector3().subVectors(b,a);mid.y+=Math.min(off.length()*curve,LK.curveMax);}
    let prev=a.clone();for(let i=1;i<=seg;i++){const t=i/seg;let p;
      if(curve){const u=1-t;p=new THREE.Vector3(u*u*a.x+2*u*t*mid.x+t*t*b.x,u*u*a.y+2*u*t*mid.y+t*t*b.y,u*u*a.z+2*u*t*mid.z+t*t*b.z);}else p=b.clone();
      P.push(prev.x,prev.y,prev.z,p.x,p.y,p.z);T.push((i-1)/seg,t);W.push(k,k);prev=p;}});
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));g.setAttribute("aT",new THREE.Float32BufferAttribute(T,1));g.setAttribute("aW",new THREE.Float32BufferAttribute(W,1));
  const l=new THREE.LineSegments(g,mat);l.frustumCulled=false;gal.add(l);return l;}

const TERR=[];
function buildTerritories(){const tex=glowTex([[0,"rgba(255,255,255,1)"],[.5,"rgba(255,255,255,.6)"],[1,"rgba(255,255,255,0)"]]);
  ARR(G.territories).forEach(t=>{if(!t||!t.at)return;const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:tex,color:CL(t.c||"#ffffff"),transparent:true,opacity:t.a==null?.12:t.a,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
    m.rotation.x=-Math.PI/2;m.position.copy(MAPPOS(t.at[0],t.at[1],t.h));m.position.y-=.6;m.scale.set((t.r||5)*20*(t.sx||1),(t.r||5)*20*(t.sy||1),1);m.renderOrder=-1;gal.add(m);m.userData.gate=(t.book!=null||t.first!=null||t.books)?{books:t.books,first:t.first!=null?t.first:t.book}:null;TERR.push(m);});}
let markerPts,markerMat,selRing,hoverRing;const LINKS={};const LINK_DEFS=[];
function buildMarkers(){
  WORLDS.forEach(w=>WORLD_BY[w.id]=w);
  WORLDS.forEach(w=>{w.pos=worldPosition(w);});
  const n=WORLDS.length;const p=new Float32Array(n*3),c=new Float32Array(n*3),s=new Float32Array(n),k=new Float32Array(n);
  WORLDS.forEach((w,i)=>{p.set([w.pos.x,w.pos.y,w.pos.z],i*3);const sc=C((w.star&&w.star.col)||"#fff6e4");c.set([sc.r,sc.g,sc.b],i*3);s[i]=w.major?2.6:1.9;k[i]=w.craft?1:0;});
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));g.setAttribute("aS",new THREE.BufferAttribute(s,1));g.setAttribute("aK",new THREE.BufferAttribute(k,1));
  g.setAttribute("aDim",new THREE.BufferAttribute(new Float32Array(n).fill(1),1));
  markerMat=new THREE.ShaderMaterial({uniforms:{uPx:{value:renderer.getPixelRatio()}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:"attribute vec3 color;attribute float aS;attribute float aDim;attribute float aK;varying vec3 vC;varying float vD;varying float vK;uniform float uPx;void main(){vC=color;vD=aDim;vK=aK;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aDim<0.?0.:uPx*aS*6.5*(.6+.4*aDim);gl_Position=projectionMatrix*mv;}",
    fragmentShader:"varying vec3 vC;varying float vD;varying float vK;void main(){vec2 c=gl_PointCoord-.5;float d=vK>.5?(abs(c.x)+abs(c.y))*2.3:length(c)*2.;float core=vK>.5?smoothstep(.5,.38,d):smoothstep(.35,0.,d);float halo=exp(-d*d*5.)*.55;float a=(core+halo)*(.25+.75*vD);gl_FragColor=vec4(mix(vC,vec3(1.),core*.6)*a,a);}"});
  markerPts=new THREE.Points(g,markerMat);markerPts.frustumCulled=false;gal.add(markerPts);
  selRing=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL(K.theme.selRing||"#e8cd8a"),transparent:true,depthWrite:false,depthTest:false,opacity:0,sizeAttenuation:false}));selRing.scale.set(.045,.045,1);gal.add(selRing);
  hoverRing=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL(K.theme.hoverRing||"#ece4d2"),transparent:true,depthWrite:false,depthTest:false,opacity:0,sizeAttenuation:false}));hoverRing.scale.set(.032,.032,1);gal.add(hoverRing);
  buildLinks();
  /* swarms: drifting motes around fleets and worldships */
  const SW=Object.assign({n:160,spread:.7,color:[1,.42,.3]},G.swarm||{});
  WORLDS.filter(w=>w.swarm).forEach(w=>{const R=rng(hashStr(w.id+"s"));const n=SW.n;const p=new Float32Array(n*3),c=new Float32Array(n*3),s=new Float32Array(n);
    for(let i=0;i<n;i++){const v=new THREE.Vector3(gauss(R),gauss(R)*.4,gauss(R)).multiplyScalar(SW.spread);p.set([v.x,v.y,v.z],i*3);c.set(SW.color,i*3);s[i]=.4+R()*.7;}
    const pts=new THREE.Points(pointsGeo(p,c,s),galMat);pts.position.copy(w.pos);gal.add(pts);GMARK[w.id+"_swarm"]=pts;});
  /* beacons */
  ARR(G.glows).forEach(gl=>{const at=resolvePoint(gl&&gl.at);if(!at)return;const tex=gl.color==="red"?GLOW_R:gl.color==="white"||!gl.color?GLOW_W:glowTex([[0,"rgba(255,255,255,1)"],[.2,gl.color],[1,"rgba(0,0,0,0)"]]);
    const op=gl.opacity==null?.5:gl.opacity;const s=glowSprite(tex,gl.scale||26,op);s.position.copy(at);gal.add(s);GLOWS.push({def:gl,s,op,pulse:gl.pulse!==false,gate:(gl.book!=null||gl.first!=null||gl.books)?{books:gl.books,first:gl.first!=null?gl.first:gl.book}:null});});
}
/* links are rebuilt when the realm layout moves the worlds */
function buildLinks(){
  /* animated links: routes, networks, raids (PACK_FORMAT 14.6) */
  ARR(G.links).forEach((L,li)=>{if(!L)return;const id=String(L.id!=null?L.id:"link"+li);const pairs=[];
    const netGate=L.network&&CUM&&L.network.gate!==false;const byFirst={};
    if(L.network){const fl=L.network.flag||"web";const net=WORLDS.filter(w=>w[fl]);const seen=new Set();const near=L.network.nearest==null?2:L.network.nearest;
      const add=(a,b)=>{const k=a.id<b.id?a.id+"|"+b.id:b.id+"|"+a.id;if(a===b||seen.has(k))return;seen.add(k);
        if(netGate){const f=Math.max(firstOf(a),firstOf(b));(byFirst[f]=byFirst[f]||[]).push([a.pos,b.pos]);}else pairs.push([a.pos,b.pos]);};
      const hub=L.network.hub&&WORLD_BY[L.network.hub];
      net.forEach(w=>{if(hub&&w!==hub)add(w,hub);net.filter(o=>o!==w).sort((x,y)=>x.pos.distanceTo(w.pos)-y.pos.distanceTo(w.pos)).slice(0,near).forEach(o=>add(w,o));});}
    if(L.path){const ps=ARR(L.path);for(let i=0;i<ps.length-1;i++){const a=resolvePoint(ps[i]),b=resolvePoint(ps[i+1]);if(a&&b)pairs.push([a,b]);}}
    ARR(L.pairs).forEach(pr=>{if(!pr)return;const a=resolvePoint(pr[0]),b=resolvePoint(pr[1]);if(a&&b)pairs.push([a,b]);});
    const col=L.color||(L.book&&BOOKS[L.book]?BOOKS[L.book].c:"#e9cf8f");const op=Object.assign({all:.6,cur:1,past:.22},L.opacity||{});
    const mk=(prs,lid,minBook)=>{const line=linkLines(prs,linkMaterial(col,.85,L.speed==null?.45:L.speed,L.dash==null?2.2:L.dash),L.curve==null?.13:L.curve);line.userData.route=L;
      LINKS[lid]=line;LINK_DEFS.push({id:lid,L,op,minBook});};
    Object.keys(byFirst).forEach(f=>mk(byFirst[f],id+"@"+f,+f));
    if(!pairs.length)return;
    mk(pairs,id,L.first!=null?L.first:null);});
  if(typeof realmThreads==="function")realmThreads();
}
function rebuildLinks(){Object.keys(LINKS).forEach(k=>{const l=LINKS[k];gal.remove(l);l.geometry.dispose();const i=linkMats.indexOf(l.material);if(i>=0)linkMats.splice(i,1);l.material.dispose();delete LINKS[k];});
  LINK_DEFS.length=0;buildLinks();applyBookToScene();}
/* field stars around Sol, so the local volume has depth */
function localField(){const LF=G.localField;if(LF===false)return;const o=Object.assign({},typeof LF==="object"?LF:{});
  const n0=MOB?1400:3000;const n=Math.round(n0*(o.density==null?1:o.density));if(n<=0)return;const ctr=o.at?(resolvePoint(o.at)||SOL):SOL;const spread=o.spread||14;const clear=o.clear||0;
  const R=rng(11);const p=new Float32Array(n*3),c=new Float32Array(n*3),s=new Float32Array(n);let m=0;
  for(let i=0;i<n;i++){const v=new THREE.Vector3(gauss(R),gauss(R)*.6,gauss(R)).multiplyScalar(spread);
    const t=R();const col=t<.6?[1,.9,.78]:t<.85?[.75,.84,1]:[1,.7,.5];const b=.25+R()*.45;const sz=.05+R()*.08;if(clear&&v.length()<clear)continue;
    p.set([ctr.x+v.x,ctr.y+v.y,ctr.z+v.z],m*3);c.set([col[0]*b,col[1]*b,col[2]*b],m*3);s[m]=sz;m++;}
  gal.add(new THREE.Points(pointsGeo(p.subarray(0,m*3),c.subarray(0,m*3),s.subarray(0,m)),galMat));}

/* ===================== ORBIT CONTROLS ===================== */
class Orbit{
  constructor(cam,o){this.cam=cam;this.t=o.target.clone();this.gt=o.target.clone();this.yaw=o.yaw;this.gyaw=o.yaw;this.pitch=o.pitch;this.gpitch=o.pitch;this.dist=o.dist;this.gdist=o.dist;
    this.min=o.min;this.max=o.max;this.pmin=o.pmin==null?-1.45:o.pmin;this.pmax=o.pmax==null?1.45:o.pmax;this.fly=null;this.vy=0;this.vp=0;}
  flyTo(target,dist,yaw,pitch,dur){this.fly={t0:performance.now(),dur:dur||1600,fT:this.t.clone(),fD:this.dist,fY:this.yaw,fP:this.pitch,tT:target.clone(),tD:dist,tY:yaw==null?this.yaw:yaw,tP:pitch==null?this.pitch:pitch};}
  update(dt){
    if(this.fly){const f=this.fly;const k=clamp((performance.now()-f.t0)/f.dur,0,1);const e=ease(k);
      this.t.lerpVectors(f.fT,f.tT,e);
      const ld=lerp(Math.log(f.fD),Math.log(f.tD),e);const bump=Math.sin(k*Math.PI)*Math.max(0,Math.log(f.tT.distanceTo(f.fT)/Math.max(f.tD,f.fD)+1))*.35;
      this.dist=Math.exp(ld+bump);this.yaw=lerp(f.fY,f.tY,e);this.pitch=lerp(f.fP,f.tP,e);
      this.gt.copy(this.t);this.gdist=this.dist;this.gyaw=this.yaw;this.gpitch=this.pitch;if(k>=1)this.fly=null;}
    else{this.gyaw+=this.vy;this.gpitch=clamp(this.gpitch+this.vp,this.pmin,this.pmax);this.vy*=.9;this.vp*=.9;
      const s=1-Math.pow(.0005,dt);this.yaw=lerp(this.yaw,this.gyaw,s);this.pitch=lerp(this.pitch,this.gpitch,s);
      this.dist=Math.exp(lerp(Math.log(this.dist),Math.log(this.gdist),s));this.t.lerp(this.gt,s);}
    const cp=Math.cos(this.pitch);this.cam.position.set(this.t.x+Math.sin(this.yaw)*cp*this.dist,this.t.y+Math.sin(this.pitch)*this.dist,this.t.z+Math.cos(this.yaw)*cp*this.dist);
    this.cam.lookAt(this.t);}
  rotate(dx,dy){this.fly=null;this.gyaw-=dx*.005;this.gpitch=clamp(this.gpitch+dy*.005,this.pmin,this.pmax);}
  zoom(f){this.fly=null;this.gdist=clamp(this.gdist*f,this.min,this.max);}
  pan(dx,dy){this.fly=null;const k=this.dist*.0016;const right=new THREE.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));const fwd=new THREE.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    this.gt.addScaledVector(right,-dx*k).addScaledVector(fwd,dy*k);}
}
const orbG=new Orbit(camG,{target:new THREE.Vector3(0,0,40),yaw:.35,pitch:.95,dist:1100,min:.5,max:5200,pmin:-1.5,pmax:1.5});
const orbW=new Orbit(camW,{target:new THREE.Vector3(),yaw:.6,pitch:.25,dist:4.2,min:1.06,max:14});

/* ===================== HD PLANET BAKING =====================
   Each world's surface is generated on the GPU into equirectangular maps (albedo + water mask,
   object-space normals + city lights, and a cloud layer). A 512px preview bakes instantly; the
   full-resolution maps (4096×2048 on desktop) then bake in strips over a few frames. Past that
   resolution the planet shader adds live procedural detail as the camera closes in. */
const TYPES={terran:0,ocean:1,archipelago:2,desert:3,forest:4,ice:5,gas:6,city:7,barren:8,lava:9,hive:10,toxic:11,dyson:12};
const bakeMat=new THREE.ShaderMaterial({vertexShader:BAKE_VS,fragmentShader:BAKE_FS,depthTest:false,depthWrite:false,
  uniforms:{uPass:{value:0},uType:{value:0},uOct:{value:8},uSeed:{value:new THREE.Vector3()},uFreq:{value:1.6},uWarp:{value:.6},uRough:{value:.6},uSea:{value:.5},uIce:{value:72},
    uLights:{value:0},uBump:{value:1},uCloud:{value:.5},uCloudScale:{value:2.2},uBands:{value:14},uWall:{value:0},uNF:{value:0},uFA:{value:[]},uFB:{value:[]},uFC:{value:[]},uFD:{value:[]},tBase:{value:null},uBase:{value:0},tMapHi:{value:null},tMapLo:{value:null},tMapReg:{value:null},uMapOn:{value:0},uMapMtn:{value:.35},uDune:{value:9},uMoist:{value:0},uEps:{value:.002},
    uP0:{value:new THREE.Color()},uP1:{value:new THREE.Color()},uP2:{value:new THREE.Color()},uP3:{value:new THREE.Color()},uP4:{value:new THREE.Color()},uP5:{value:new THREE.Color()}}});
const bakeScene=new THREE.Scene();const bakeCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const bakeQuad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),bakeMat);bakeQuad.frustumCulled=false;bakeScene.add(bakeQuad);
function gfxFor(w,book){let g=Object.assign({},w.gfx||{});if(w.eras){Object.keys(w.eras).map(Number).sort((a,b)=>a-b).forEach(k=>{if(book>=k&&w.eras[k]&&w.eras[k].gfx)g=Object.assign(g,w.eras[k].gfx);});}return g;}
function setBakeU(g,seedKey){const u=bakeMat.uniforms;const R=rng(hashStr(seedKey));
  u.uType.value=TYPES[g.type]!=null?TYPES[g.type]:0;u.uSeed.value.set(R()*40-20,R()*40-20,R()*40-20);
  u.uFreq.value=g.freq||1.6;u.uWarp.value=g.warp==null?.6:g.warp;u.uRough.value=g.rough==null?.6:g.rough;u.uSea.value=g.sea==null?.5:g.sea;
  u.uIce.value=g.ice==null?78:g.ice;u.uLights.value=g.lights||0;u.uBump.value=g.bump==null?1:g.bump;u.uCloud.value=g.clouds||0;u.uCloudScale.value=g.cloudScale||2.2;
  u.uBands.value=g.bands||14;u.uWall.value=g.wall||0;u.uDune.value=g.dune||9;u.uMoist.value=g.moist||0;
  setFeatures(g);
  const pal=g.pal&&g.pal.length?g.pal:["#0b1e3d","#2a6f97","#4b6b3a","#7a8a4a","#8a7a62","#f2f2f2"];["uP0","uP1","uP2","uP3","uP4","uP5"].forEach((k,i)=>u[k].value.set(pal[i]||pal[pal.length-1]));}
/* hand-laid terrain features: continents, ranges, biomes, basins, peaks, rivers */
const FK={continent:1,range:2,biome:3,basin:4,peak:5,river:6};
const BS={grass:0,forest:1,rock:2,flame:3,farm:4,snow:5};
for(let i=0;i<14;i++){["uFA","uFB","uFC","uFD"].forEach(k=>bakeMat.uniforms[k].value.push(new THREE.Vector4()));}
function setFeatures(g){const u=bakeMat.uniforms;const F=ARR(g.feat).filter(f=>f&&FK[f.k]&&(f.at||f.from)).slice(0,14);u.uNF.value=F.length;
  F.forEach((f,i)=>{const a=latLonDir(...(f.at||f.from));const b=f.to?latLonDir(...f.to):a;
    u.uFA.value[i].set(a.x,a.y,a.z,(f.r||5)*DEG);u.uFB.value[i].set(FK[f.k],f.s==null?.3:f.s,BS[f.style]||0,0);
    const c=new THREE.Color(f.c||"#ffffff");u.uFC.value[i].set(c.r,c.g,c.b,0);u.uFD.value[i].set(b.x,b.y,b.z,(f.w||3)*DEG);});
  u.uBase.value=g.base==="earth"&&EARTH_TEX?1:0;u.tBase.value=EARTH_TEX;
  const MT=g.map?mapTextures(g.map):null;u.uMapOn.value=MT?1:0;u.tMapHi.value=MT?MT.hi:null;u.tMapLo.value=MT?MT.lo:null;u.tMapReg.value=MT?MT.reg:null;
  u.uMapMtn.value=g.map&&g.map.mtn!=null?g.map.mtn:.35;}
let EARTH_TEX=null;let earthReady=null;
function loadEarth(){if(!earthReady)earthReady=new Promise(res=>{const im=new Image();im.onload=()=>{const t=new THREE.Texture(im);t.wrapS=THREE.RepeatWrapping;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;EARTH_TEX=t;res();};im.onerror=()=>res();im.src=ENGINE_BASE+"earth-base.png";});return earthReady;}
if(WORLDS.some(w=>gfxFor(w,99).base==="earth"))loadEarth();
/* vector maps (gfx.map): hand-laid coastlines, lakes, rivers, ranges and painted regions, given as
   [lat,lon] outlines, are roughened with deterministic midpoint displacement and drawn into
   equirectangular textures (8192x4096 on capable desktops). The bake reads them for the 4K surface,
   and the planet shader reads the full-size one again up close, so coastlines and rivers stay sharp. */
const MAPW=(()=>{if(window.__MAPW)return window.__MAPW;if(MOB||MAXTEX<8192)return 4096;const dm=navigator.deviceMemory;return dm&&dm<8?4096:8192;})();
const MAP_CACHE={};
function fractalLine(pts,closed,rough,depth,seed){const R=rng(seed);let P=ARR(pts).filter(q=>q&&q.length>1).map(q=>[+q[0],+q[1]]);if(P.length<2)return P;
  for(let i=1;i<P.length;i++){while(P[i][1]-P[i-1][1]>180)P[i][1]-=360;while(P[i][1]-P[i-1][1]<-180)P[i][1]+=360;}
  for(let d=0;d<depth;d++){const N=[];const n=P.length;const m=closed?n:n-1;
    for(let i=0;i<m;i++){const a=P[i],b=P[(i+1)%n];let bl=b[1];while(bl-a[1]>180)bl-=360;while(bl-a[1]<-180)bl+=360;
      const dx=bl-a[1],dy=b[0]-a[0];const L=Math.hypot(dx,dy)||1;const k=(R()-.5)*rough*L;
      N.push(a,[(a[0]+b[0])/2+dx/L*k,(a[1]+bl)/2-dy/L*k]);}
    if(!closed)N.push(P[n-1]);P=N;}
  return P;}
function mapPath(ctx,P,W,H,closed){ctx.beginPath();[-360,0,360].forEach(off=>{P.forEach((q,i)=>{const x=(q[1]+off+180)/360*W,y=(90-q[0])/180*H;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});if(closed)ctx.closePath();});}
function mapTextures(M){const key=JSON.stringify(M);if(MAP_CACHE[key])return MAP_CACHE[key];
  const W=MAPW,H=W/2,seed=hashStr(key),rough=M.rough==null?.5:M.rough;
  const land=ARR(M.land).map((q,i)=>fractalLine(q,true,rough,M.depth||6,seed+i));
  const water=ARR(M.water).map((q,i)=>fractalLine(q,true,rough*.8,5,seed+100+i));
  const ranges=ARR(M.ranges).map((r,i)=>({w:r.w||1.6,s:r.s==null?1:r.s,P:fractalLine(r.line,false,.3,4,seed+200+i)}));
  const rivers=ARR(M.rivers).map((r,i)=>({w:r.w||.16,c:r.c||null,P:fractalLine(r.line,false,.55,5,seed+300+i)}));
  const regions=ARR(M.regions).map((r,i)=>({c:r.c||"#7a8a4a",s:r.s==null?.9:r.s,P:fractalLine(r.poly,true,.45,5,seed+400+i)}));
  const px=d=>d/360*W;
  const hi=document.createElement("canvas");hi.width=W;hi.height=H;const h=hi.getContext("2d");
  h.fillStyle="#000";h.fillRect(0,0,W,H);h.globalCompositeOperation="lighter";h.lineCap=h.lineJoin="round";
  h.fillStyle="rgb(255,0,0)";land.forEach(P=>{mapPath(h,P,W,H,true);h.fill();});
  h.fillStyle="rgb(0,0,255)";water.forEach(P=>{mapPath(h,P,W,H,true);h.fill();});
  h.strokeStyle="rgb(0,0,255)";rivers.filter(r=>!r.c).forEach(r=>{h.lineWidth=Math.max(1.2,px(r.w*.8));mapPath(h,r.P,W,H,false);h.stroke();});
  ranges.forEach(r=>{h.strokeStyle="rgb(0,"+Math.round(150*clamp(r.s,0,1))+",0)";h.lineWidth=Math.max(2,px(r.w*.8));mapPath(h,r.P,W,H,false);h.stroke();});
  const LW=1024,LH=512;
  const small=(w,draw)=>{const c=document.createElement("canvas");c.width=w;c.height=w/2;const x=c.getContext("2d");x.fillStyle="#000";x.fillRect(0,0,w,w/2);x.lineCap=x.lineJoin="round";draw(x,w,w/2);return c;};
  const up=c=>{const o=document.createElement("canvas");o.width=LW;o.height=LH;const x=o.getContext("2d");x.imageSmoothingEnabled=true;x.imageSmoothingQuality="high";x.drawImage(c,0,0,LW,LH);return x.getImageData(0,0,LW,LH).data;};
  const landAt=w=>small(w,(x,ww,hh)=>{x.fillStyle="#fff";land.forEach(P=>{mapPath(x,P,ww,hh,true);x.fill();});});
  const rel1=up(landAt(64)),rel2=up(landAt(160));
  const mtn=up(small(320,(x,ww,hh)=>{x.strokeStyle="#fff";ranges.forEach(r=>{x.globalAlpha=clamp(r.s,0,1);x.lineWidth=Math.max(1,r.w*2/360*ww);mapPath(x,r.P,ww,hh,false);x.stroke();});}));
  const reg=up(small(512,(x,ww,hh)=>{x.fillStyle="#fff";regions.forEach(r=>{x.globalAlpha=clamp(r.s,0,1);mapPath(x,r.P,ww,hh,true);x.fill();});x.globalAlpha=1;x.strokeStyle="#fff";rivers.filter(r=>r.c).forEach(r=>{x.lineWidth=Math.max(1.5,r.w*1.6/360*ww);mapPath(x,r.P,ww,hh,false);x.stroke();});}));
  const lo=document.createElement("canvas");lo.width=LW;lo.height=LH;const lx=lo.getContext("2d");const id=lx.createImageData(LW,LH);
  for(let i=0;i<LW*LH;i++){id.data[i*4]=Math.min(255,rel1[i*4]*.6+rel2[i*4]*.4);id.data[i*4+1]=mtn[i*4];id.data[i*4+2]=reg[i*4];id.data[i*4+3]=255;}lx.putImageData(id,0,0);
  const RW=2048,RH=1024;const rg=document.createElement("canvas");rg.width=RW;rg.height=RH;const rx=rg.getContext("2d");rx.fillStyle="#7a7a6a";rx.fillRect(0,0,RW,RH);rx.lineJoin="round";
  regions.forEach(r=>{rx.fillStyle=rx.strokeStyle=r.c;rx.lineWidth=28;mapPath(rx,r.P,RW,RH,true);rx.fill();rx.stroke();});
  rivers.filter(r=>r.c).forEach(r=>{rx.strokeStyle=r.c;rx.lineCap="round";rx.lineWidth=Math.max(2,r.w*1.6/360*RW);mapPath(rx,r.P,RW,RH,false);rx.stroke();});
  const tex=(c,mip)=>{const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;t.minFilter=mip?THREE.LinearMipmapLinearFilter:THREE.LinearFilter;t.generateMipmaps=!!mip;t.anisotropy=ANISO;return t;};
  return MAP_CACHE[key]={hi:tex(hi,true),lo:tex(lo,false),reg:tex(rg,false)};}
function freeMaps(keep){Object.keys(MAP_CACHE).forEach(k=>{if(k===keep)return;const m=MAP_CACHE[k];m.hi.dispose();m.lo.dispose();m.reg.dispose();delete MAP_CACHE[k];});}
function makeRT(w,h,mip){const rt=new THREE.WebGLRenderTarget(w,h,{depthBuffer:false,stencilBuffer:false,wrapS:THREE.RepeatWrapping,wrapT:THREE.ClampToEdgeWrapping,
  minFilter:mip?THREE.LinearMipmapLinearFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,generateMipmaps:!!mip});rt.texture.anisotropy=ANISO;return rt;}
function renderBake(rt,y0,rows){const W=rt.width;renderer.setRenderTarget(rt);
  if(rows!=null){renderer.setScissorTest(true);rt.scissor.set(0,y0,W,rows);rt.scissorTest=true;}
  renderer.render(bakeScene,bakeCam);rt.scissorTest=false;renderer.setScissorTest(false);renderer.setRenderTarget(null);}
function octFor(size){return size>=4096?10:size>=2048?9:size>=1024?8:6;}
/* bake a full set synchronously (small sizes only) */
function bakeNow(g,key,W){const H=W/2;const set={alb:makeRT(W,H,true),nrm:makeRT(W,H,true),cld:makeRT(W,H,true),size:W};
  setBakeU(g,key);const u=bakeMat.uniforms;u.uOct.value=octFor(W);u.uEps.value=TAU/W*.6;
  u.uPass.value=0;renderBake(set.alb);u.uPass.value=1;renderBake(set.nrm);u.uPass.value=2;u.uOct.value=7;renderBake(set.cld);return set;}
/* incremental HD bake */
const bakeJobs=[];
function queueBake(g,key,W,done,progress){const H=W/2;const job={g,key,W,H,set:{alb:makeRT(W,H,true),nrm:makeRT(W,H,true),cld:makeRT(W/2,H/2,true),size:W},pass:0,row:0,done,progress,cancelled:false};bakeJobs.push(job);return job;}
let BAKE_SCALE=1;
function bakeStep(){
  const job=bakeJobs[0];if(!job){bakeStep.last=0;return;}if(job.cancelled){disposeSet(job.set);bakeJobs.shift();return;}
  setBakeU(job.g,job.key);const u=bakeMat.uniforms;
  const rt=job.pass===0?job.set.alb:job.pass===1?job.set.nrm:job.set.cld;
  /* adapt the strip size to how long frames are taking, so baking never stalls the view */
  if(bakeStep.last){const ft=performance.now()-bakeStep.last;BAKE_SCALE=clamp(BAKE_SCALE*(ft>34?.7:ft<20?1.15:1),.05,2.5);}bakeStep.last=performance.now();
  const budget=(MOB?520000:1900000)*BAKE_SCALE/(job.pass===1?3.2:1);
  const rows=Math.max(8,Math.floor(budget/rt.width/8)*8);
  u.uPass.value=job.pass;u.uOct.value=job.pass===2?8:octFor(job.W);u.uEps.value=TAU/job.W*.6;
  renderBake(rt,job.row,Math.min(rows,rt.height-job.row));job.row+=rows;
  const tot=job.H*2+job.H/2;const doneRows=(job.pass>0?job.H:0)+(job.pass>1?job.H:0)+Math.min(job.row,rt.height)*(job.pass===2?2:1);
  if(job.progress)job.progress(clamp(doneRows/tot,0,1));
  if(job.row>=rt.height){job.pass++;job.row=0;if(job.pass>2){bakeJobs.shift();job.done(job.set);}}
}
function disposeSet(s){if(!s)return;["alb","nrm","cld"].forEach(k=>s[k]&&s[k].dispose());}
/* water mask readback from a preview set, used to keep land sites on land */
function waterMask(set){const W=set.alb.width,H=set.alb.height;const buf=new Uint8Array(W*H*4);renderer.readRenderTargetPixels(set.alb,0,0,W,H,buf);
  const m=new Uint8Array(W*H);for(let i=0;i<W*H;i++)m[i]=buf[i*4+3]>40?1:0;return {W,H,m};}
function snapToLand(mask,lat,lon){const {W,H,m}=mask;const toIJ=(la,lo)=>[((((lo/360+.5)%1)+1)%1)*W|0,clamp(((la/180)+.5)*H|0,0,H-1)];
  let [i,j]=toIJ(lat,lon);if(!m[j*W+i])return [lat,lon];
  for(let r=1;r<60;r++){let best=null,bd=1e9;for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;
      const jj=clamp(j+dj,0,H-1),ii=((i+di)%W+W)%W;if(!m[jj*W+ii]){const d=di*di+dj*dj;if(d<bd){bd=d;best=[ii,jj];}}}
    if(best){const lo=((best[0]+.5)/W-.5)*360,la=((best[1]+.5)/H-.5)*180;return [la,lo];}}
  return [lat,lon];}
function latLonDir(lat,lon){const a=(+lat||0)*DEG,o=(+lon||0)*DEG;return new THREE.Vector3(Math.cos(a)*Math.cos(o),Math.sin(a),-Math.cos(a)*Math.sin(o));}

/* ===================== WORLD VIEW ===================== */
const SUN_DIR=new THREE.Vector3(-.78,.24,.62).normalize();
wsc.add(new THREE.AmbientLight(0x202430,.4));
skyStars(wsc,MOB?2200:4200,1500,1.4);
(function band(){const n=MOB?7000:16000,R=rng(77);const p=new Float32Array(n*3),c=new Float32Array(n*3);const tilt=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.0,.4,.3));const v=new THREE.Vector3();
  for(let i=0;i<n;i++){const a=R()*TAU;const sp=gauss(R)*.09;v.set(Math.cos(a),sp,Math.sin(a)).normalize().multiplyScalar(1400).applyMatrix4(tilt);p.set([v.x,v.y,v.z],i*3);
    const w=.05+R()*.16*(1+Math.cos(a-1)*.6);c.set([w,w*.93,w*.86],i*3);}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size:1.2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.85,depthWrite:false}));pts.frustumCulled=false;wsc.add(pts);})();
const WSKY=wsc.children.filter(o=>o.isPoints);
const sunSprite=glowSprite(GLOW_W,140,.95);sunSprite.position.copy(SUN_DIR).multiplyScalar(600);wsc.add(sunSprite);
const sunHalo=glowSprite(GLOW_W,520,.18);sunHalo.position.copy(sunSprite.position);wsc.add(sunHalo);
const planetGroup=new THREE.Group();wsc.add(planetGroup);
const SPHERE=new THREE.SphereGeometry(1,MOB?160:256,MOB?110:176);
const SPHERE_LO=new THREE.SphereGeometry(1,96,64);
function planetMaterial(set,g,w){const u={tAlb:{value:set.alb.texture},tNrm:{value:set.nrm.texture},tCld:{value:set.cld.texture},
    uSun:{value:SUN_DIR.clone()},uSunCol:{value:CL((w.star&&w.star.col)||"#fff4e0").multiplyScalar(1.12)},uAtmo:{value:CL(g.atmo||"#6fa8ff")},uAtmoK:{value:g.atmoK==null?1:g.atmoK},
    uLightCol:{value:CL(g.lightCol||"#ffc27a")},uLava:{value:CL(g.lava||"#ff5a1a")},uLavaOn:{value:(g.type==="lava"||g.type==="dyson")?1:0},uSeed:{value:new THREE.Vector3(hashStr(w.id)%97,3,7)},
    uCloudShift:{value:0},uDetail:{value:0},uHasSea:{value:(g.sea>0&&g.type!=="gas")?1:0},uWaterCol:{value:CL((g.pal||[])[1]||"#2a6f97")},uLandCol:{value:CL((g.pal||[])[2]||"#4b6b3a")},uAmb:{value:g.amb==null?.018:g.amb},uHasCld:{value:g.clouds?1:0},uTime:{value:0},uRot:{value:new THREE.Matrix3()},
    tMapHi:{value:g.map?mapTextures(g.map).hi:null},uMapOn:{value:g.map?1:0},uRealm:{value:0},uRStyle:{value:0},uRC1:{value:new THREE.Color()},uRC2:{value:new THREE.Color()},uRC3:{value:new THREE.Color()}};
  return new THREE.ShaderMaterial({vertexShader:PLANET_VS,fragmentShader:PLANET_FS,uniforms:u,extensions:{derivatives:true}});}
function cloudMaterial(set,g,w){return new THREE.ShaderMaterial({vertexShader:PLANET_VS,fragmentShader:CLOUD_FS,transparent:true,depthWrite:false,extensions:{derivatives:true},
  uniforms:{tCld:{value:set.cld.texture},uSun:{value:SUN_DIR.clone()},uSunCol:{value:CL((w.star&&w.star.col)||"#fff4e0").multiplyScalar(1.2)},uCloudCol:{value:CL(g.cloudCol||"#ffffff")},
    uAtmo:{value:CL(g.atmo||"#6fa8ff")},uCloudShift:{value:0},uOpacity:{value:g.cloudOp||.95},uRot:{value:new THREE.Matrix3()}}});}
function atmoMesh(g,r){const m=new THREE.Mesh(new THREE.SphereGeometry(r,96,64),new THREE.ShaderMaterial({vertexShader:ATMO_VS,fragmentShader:ATMO_FS,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  uniforms:{uC:{value:CL(g.atmo||"#6fa8ff")},uSun:{value:SUN_DIR.clone()},uK:{value:(g.atmoK==null?1:g.atmoK)*.62},uEdge:{value:1/Math.sqrt(1-1/(r*r))}}}));return m;}
function ringMesh(rg){const inner=rg.inner||1.4,outer=rg.outer||2.4;const geo=new THREE.RingGeometry(inner,outer,256,1);const pos=geo.attributes.position,uv=geo.attributes.uv;
  for(let i=0;i<pos.count;i++){const r=Math.hypot(pos.getX(i),pos.getY(i));uv.setXY(i,(r-inner)/(outer-inner),.5);}
  const m=new THREE.Mesh(geo,new THREE.ShaderMaterial({vertexShader:RING_VS,fragmentShader:RING_FS,transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{uC1:{value:CL(rg.c1||"#cbb894")},uC2:{value:CL(rg.c2||"#8a7a62")},uSun:{value:SUN_DIR.clone()},uIn:{value:rg.inner},uOut:{value:rg.outer},uSeed:{value:rg.seed||3}}}));
  m.rotation.x=-Math.PI/2+(rg.tilt||.35);return m;}

let PL=null; /* current planet assembly */
const setCache={};
function cacheKey(w,g){return w.id+"|"+JSON.stringify(g);}
function buildPlanet(w,book,onProgress){
  clearPlanet();
  const g=gfxFor(w,book);const key=cacheKey(w,g);freeMaps(g.map?JSON.stringify(g.map):null);
  const P={w,g,key,root:new THREE.Group(),moons:[],spin:0,jobs:[]};
  planetGroup.add(P.root);
  let set=setCache[key];
  const pre=set&&set.hd?set.hd:bakeNow(g,w.id,512);
  if(!setCache[key])setCache[key]={pre,hd:null,mask:waterMask(pre)};
  set=setCache[key];P.mask=set.mask;
  const use=set.hd||set.pre;
  P.mat=planetMaterial(use,g,w);P.mesh=new THREE.Mesh(SPHERE,P.mat);P.root.add(P.mesh);
  if(g.clouds){P.cmat=cloudMaterial(use,g,w);P.clouds=new THREE.Mesh(SPHERE,P.cmat);P.clouds.scale.setScalar(1.012);P.root.add(P.clouds);}
  if(g.atmoK!==0){P.atmo=atmoMesh(g,g.type==="gas"?1.05:1.075);P.root.add(P.atmo);}
  if(w.ring){P.ring=ringMesh(w.ring);P.root.add(P.ring);}
  /* moons */
  ARR(w.moons).forEach((m,i)=>{m=m||{};const mg=Object.assign({type:"barren",pal:["#2a2a2a","#3a3836","#5a5550","#7a736a","#9a9288","#c8c2b8"],rough:.9,sea:0,atmoK:0,bump:1.6},m.gfx||{});
    const ms=bakeNow(mg,w.id+"_m"+i,256);const mm=new THREE.Mesh(SPHERE_LO,planetMaterial(ms,mg,w));const mo={};mo.job=()=>queueBake(mg,w.id+"_m"+i,MOB?1024:2048,s=>{const u=mm.material.uniforms;u.tAlb.value=s.alb.texture;u.tNrm.value=s.nrm.texture;u.tCld.value=s.cld.texture;disposeSet(mo.cur);mo.cur=s;});mo.cur=ms;const r=m.size||.18;mm.scale.setScalar(r);
    const piv=new THREE.Object3D();piv.rotation.set((i%2?.25:-.18),i*2.1+.6,(i%2?-.1:.12));const d=m.dist||(2.4+i*1.1);mm.position.x=d;piv.add(mm);planetGroup.add(piv);
    P.moons.push({piv,mesh:mm,mo,speed:(m.speed||.05)/(1+i*.6),name:m.name});});
  /* sun colour */
  const sc=C((w.star&&w.star.col)||"#fff4e0");sunSprite.material.color.copy(sc);sunHalo.material.color.copy(sc);
  /* queue the HD bake */
  if(!set.hd){const job=queueBake(g,w.id,HD,s=>{set.hd=s;disposeSet(set.pre);set.pre=null;if(PL===P)applySet(P,s);},onProgress);P.jobs.push(job);}
  else if(onProgress)onProgress(1);
  P.moons.forEach(m=>P.jobs.push(m.mo.job()));
  /* free other worlds' maps */
  Object.keys(setCache).forEach(k=>{if(k!==key){const s=setCache[k];if(s.hd)disposeSet(s.hd);if(s.pre)disposeSet(s.pre);delete setCache[k];}});
  PL=P;applyRealmToPlanet();return P;
}
function applySet(P,s){P.mat.uniforms.tAlb.value=s.alb.texture;P.mat.uniforms.tNrm.value=s.nrm.texture;P.mat.uniforms.tCld.value=s.cld.texture;if(P.cmat)P.cmat.uniforms.tCld.value=s.cld.texture;}
function clearPlanet(){if(!PL)return;bakeJobs.forEach(j=>{if(PL.jobs.includes(j))j.cancelled=true;});
  PL.moons.forEach(m=>{planetGroup.remove(m.piv);disposeSet(m.mo.cur);m.mesh.material.dispose();});
  planetGroup.remove(PL.root);PL.root.traverse(o=>{if(o.material&&o.material.dispose)o.material.dispose();if(o.geometry&&o.geometry!==SPHERE&&o.geometry!==SPHERE_LO)o.geometry.dispose();});PL=null;}
const _m4=new THREE.Matrix4();
function updatePlanet(dt,t,spinOn){if(!PL)return;
  if(PL.turn){const k=clamp((performance.now()-PL.turn.t0)/1500,0,1);PL.root.rotation.y=lerp(PL.turn.from,PL.turn.to,ease(k));if(k>=1)PL.turn=null;}
  else if(spinOn)PL.root.rotation.y+=dt*.018;
  PL.root.updateMatrixWorld();const rot=new THREE.Matrix3().setFromMatrix4(_m4.extractRotation(PL.mesh.matrixWorld));
  PL.mat.uniforms.uRot.value.copy(rot);PL.mat.uniforms.uTime.value=t;
  const near=clamp((2.3-orbW.dist)/1.1,0,1);PL.mat.uniforms.uDetail.value=near;
  PL.mat.uniforms.uCloudShift.value+=dt*.0035;if(PL.cmat){PL.cmat.uniforms.uCloudShift.value=PL.mat.uniforms.uCloudShift.value;PL.cmat.uniforms.uRot.value.copy(rot);}
  PL.moons.forEach(m=>{m.piv.rotation.y+=dt*m.speed;m.mesh.rotation.y+=dt*.05;m.mesh.updateMatrixWorld();m.mesh.material.uniforms.uRot.value.setFromMatrix4(_m4.extractRotation(m.mesh.matrixWorld));});
}

/* ===================== STATE & SPOILER RULES (PACK_FORMAT 6) ===================== */
const S={view:"galaxy",sel:null,site:null,book:0,ev:null,hover:null,interacted:false,realm:"physical"};
const EV_BY={};EVENTS.forEach((e,i)=>{e.ord=i;EV_BY[e.id]=e;});
const EFF=()=>S.book||99;
const firstOf=w=>w.first||(w.books&&w.books.length?Math.min(...w.books):1);
/* optional book gating for labels, glows, territories and links: `books:[..]` = only in those books, `book`/`first` = from that book on */
const gateOk=(it,b)=>{if(!it||!b)return true;if(it.books)return ARR(it.books).includes(b);const f=it.first!=null?it.first:it.gateBook;return f==null||b>=f;};
const eraVal=(o,key)=>{let v=o[key];const cur=CUM?EFF():S.book;eraKeys(o).forEach(k=>{if(cur>=k&&o.eras[k][key]!=null)v=o.eras[k][key];});return v;};
const realmOk=it=>{if(!it)return true;const r=it.realm||it.realms;if(!r||typeof r!=="string"&&!Array.isArray(r))return true;return ARR(r).includes(S.realm||"physical");};
const seen=w=>(!CUM||!S.book||firstOf(w)<=S.book)&&realmOk(w);
const inBook=w=>!S.book||(w.books||[]).includes(S.book);
const siteEraOk=s=>{const b=S.book||0;return !(s.until&&b>=s.until)&&!(s.since&&b<s.since);};
const siteSeen=s=>siteEraOk(s)&&(!CUM||!S.book||!(s.books&&s.books.length)||Math.min(...s.books)<=S.book)&&realmOk(s);
const evFor=(wid,site)=>EVENTS.filter(e=>e.world===wid&&(site==null||e.site===site)&&(!S.book||(CUM?e.book<=S.book:e.book===S.book)));
const eraKeys=w=>w.eras?Object.keys(w.eras).map(Number).filter(k=>isFinite(k)&&w.eras[k]).sort((a,b)=>a-b):[];
function statusFor(w){let s=w.status;eraKeys(w).forEach(k=>{if(S.book>=k&&w.eras[k].status)s=w.eras[k].status;});
  if(!S.book&&w.eras){
    if(CUM){const ks=eraKeys(w).filter(k=>w.eras[k].status);if(ks.length){const k=Math.max(...ks);s=w.status+" → "+w.eras[k].status;}}
    else{const ks=eraKeys(w);if(ks.length){const k=Math.max(...ks);if(w.eras[k].status)s=w.status+" → "+w.eras[k].status;}}}
  return s;}
const bks=arr=>'<span class="bks">'+(arr||[]).filter(b=>BOOKS[b]&&(!CUM||!S.book||b<=S.book)).map(b=>'<span class="bk bk'+b+'">'+esc(BOOKS[b].n)+'</span>').join("")+'</span>';
const groupOpt=(w,k,def)=>{const g=GROUP_BY[w.group];return g&&g[k]!=null?g[k]:def;};
const flyDistFor=w=>groupOpt(w,"flyDist",G.flyDist||24);
const FLY_PITCH=G.flyPitch==null?.5:G.flyPitch;
const LBL_FAR=Object.assign({major:1500,minor:560},G.labelFar||{});
buildGalaxy();buildMarkers();buildTerritories();localField();

/* ===================== LABELS ===================== */
const labelsEl=$("#labels");
const GL_LBL={};
WORLDS.forEach(w=>{const b=document.createElement("button");b.className="lbl"+(w.major?" major":"");b.textContent=w.name;b.dataset.id=w.id;labelsEl.appendChild(b);GL_LBL[w.id]=b;
  b.addEventListener("click",ev=>{ev.stopPropagation();if(S.sel===w.id&&S.view==="galaxy")descend(w.id);else selectWorld(w.id,true);});
  b.addEventListener("dblclick",ev=>{ev.stopPropagation();descend(w.id);});
  b.addEventListener("mouseenter",ev=>{S.hover=w.id;showTipWorld(w,ev.clientX,ev.clientY);});b.addEventListener("mousemove",ev=>placeTip(ev.clientX,ev.clientY));
  b.addEventListener("mouseleave",()=>{S.hover=null;hideTip();});});
const REGIONS=[];
function regionLabel(text,pos,minD,maxD,big){if(!pos||!text)return;const el=document.createElement("div");el.className="lbl region"+(big?" big":"");el.textContent=text;labelsEl.appendChild(el);
  const spec=arguments[6]||null;const off=spec&&spec.off?new THREE.Vector3(+spec.off[0]||0,+spec.off[1]||0,+spec.off[2]||0):new THREE.Vector3();
  REGIONS.push({el,pos,minD,maxD,gate:arguments[5]||null,spec,off});}
function regionLabels(){
  const core=G.coreLabels!==false;
  if(core)regionLabel("Galactic core",new THREE.Vector3(0,14,0),250,6000,true);
  ARR(G.labels).forEach(r=>{if(!r)return;let text=r.text;if(!text&&r.at&&r.at.arm!=null){const a=typeof r.at.arm==="number"?ARMS[r.at.arm]:{name:r.at.arm};text=a&&a.name;}
    const at=r.at?Object.assign({},r.at):null;if(at&&r.off&&!at.off)at.off=r.off;regionLabel(text,resolvePoint(at),r.min==null?60:r.min,r.max==null?1500:r.max,!!r.big,(r.book!=null||r.first!=null||r.books)?{books:r.books,first:r.first!=null?r.first:r.book}:null,{world:at&&at.world,off:at&&at.off,realm:r.realm||r.realms});});
  if(core){regionLabel("Large Magellanic Cloud",SAT.lmc.clone().add(new THREE.Vector3(0,60,0)),300,9000,true);
    regionLabel("Small Magellanic Cloud",SAT.smc.clone().add(new THREE.Vector3(0,40,0)),300,9000);}
}
regionLabels();
const _v=new THREE.Vector3();
function project(p,cam,W,H){_v.copy(p).project(cam);return {x:(_v.x*.5+.5)*W,y:(-_v.y*.5+.5)*H,z:_v.z};}
function layoutGalaxyLabels(W,H){
  const camPos=camG.position;const placed=[];
  const order=WORLDS.slice().sort((a,b)=>(b.id===S.sel)-(a.id===S.sel)||(b.id===S.hover)-(a.id===S.hover)||(b.major?1:0)-(a.major?1:0)||camPos.distanceTo(a.pos)-camPos.distanceTo(b.pos));
  order.forEach(w=>{const el=GL_LBL[w.id];const pr=project(w.pos,camG,W,H);const cd=camPos.distanceTo(w.pos);
    let show=pr.z<1&&pr.x>-50&&pr.x<W+50&&pr.y>-20&&pr.y<H+20;
    const far=groupOpt(w,"labelFar",w.major?LBL_FAR.major:LBL_FAR.minor);
    if(cd>far&&w.id!==S.sel)show=false;if(!seen(w))show=false;
    if(show){const bw=w.name.length*8+14,bh=20;const r={x:pr.x+8,y:pr.y-10,w:bw,h:bh};
      if(w.id!==S.sel&&placed.some(o=>r.x<o.x+o.w&&r.x+r.w>o.x&&r.y<o.y+o.h&&r.y+r.h>o.y))show=false;else placed.push(r);}
    el.style.opacity=show?(inBook(w)?1:K.spoil.dimLabel):0;el.style.pointerEvents=show?"auto":"none";
    if(show)el.style.transform="translate("+(pr.x+7)+"px,"+(pr.y-11)+"px)";
    el.classList.toggle("sel",w.id===S.sel);});
  REGIONS.forEach(r=>{if(r.spec&&r.spec.world&&WORLD_BY[r.spec.world])r.pos=WORLD_BY[r.spec.world].pos.clone().add(r.off);
    const pr=project(r.pos,camG,W,H);const cd=camPos.distanceTo(r.pos);const show=pr.z<1&&cd>r.minD&&cd<r.maxD&&gateOk(r.gate,S.book)&&realmOk(r.spec);
    r.el.style.opacity=show?1:0;if(show)r.el.style.transform="translate(-50%,-50%) translate("+pr.x+"px,"+pr.y+"px)";});
}

/* ===================== SITE MARKERS (world view) ===================== */
let SITE_EL=[];
function buildSiteLabels(w){SITE_EL.forEach(s=>s.el.remove());SITE_EL=[];
  const pos={};const land=PL&&PL.mask&&PL.g.type!=="gas";
  const place=(s,depth)=>{if(!s)return [0,0];if(pos[s.id])return pos[s.id];let lat,lon;
    if(s.rel&&(depth||0)<8){const a=place((w.sites||[]).find(x=>x.id===s.rel.to),(depth||0)+1);lat=a[0]+(s.rel.dlat||0)*.32;lon=a[1]+(s.rel.dlon||0)*.32;}else{lat=+s.lat||0;lon=+s.lon||0;}
    if(!s.sea&&land)[lat,lon]=snapToLand(PL.mask,lat,lon);return pos[s.id]=[lat,lon];};
  (w.sites||[]).filter(siteSeen).forEach(s=>{const [lat,lon]=place(s);
    const el=document.createElement("button");el.className="plbl";el.innerHTML='<span class="pip"></span><span class="tx">'+esc(s.name)+'</span>';labelsEl.appendChild(el);
    el.addEventListener("click",ev=>{ev.stopPropagation();selectSite(s.id);});
    SITE_EL.push({s,el,dir:latLonDir(lat,lon)});});}
const _w=new THREE.Vector3(),_n=new THREE.Vector3();
function layoutSiteLabels(W,H){if(!PL)return;const placed=[];
  SITE_EL.slice().sort((a,b)=>(b.s.id===S.site)-(a.s.id===S.site)).forEach(o=>{_n.copy(o.dir).applyQuaternion(PL.root.quaternion);_w.copy(_n).multiplyScalar(1.004);
    const facing=_n.dot(camW.position.clone().sub(_w).normalize());const pr=project(_w,camW,W,H);let show=facing>.12&&pr.z<1;
    const r={x:pr.x,y:pr.y-12,w:String(o.s.name).length*8+30,h:24};
    if(show&&o.s.id!==S.site&&placed.some(q=>r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y))show=false;if(show)placed.push(r);
    o.el.style.opacity=show?clamp((facing-.12)*5,0,1):0;o.el.style.pointerEvents=show?"auto":"none";
    if(show)o.el.style.transform="translate("+(pr.x-7)+"px,"+(pr.y-13)+"px)";o.el.classList.toggle("sel",o.s.id===S.site);});
}

/* ===================== TOOLTIP ===================== */
const tip=$("#tip");
function placeTip(x,y){const r=tip.getBoundingClientRect();let tx=x+18,ty=y+16;if(tx+r.width>innerWidth-12)tx=x-r.width-18;if(ty+r.height>innerHeight-12)ty=innerHeight-r.height-12;tip.style.left=tx+"px";tip.style.top=ty+"px";}
function showTipWorld(w,x,y){if(MOB)return;tip.innerHTML='<p class="eyebrow">'+esc(GROUP_NAME(w.group))+'</p><h3>'+esc(w.name)+'</h3>'+bks(w.books)+'<p>'+esc(eraVal(w,"short")||(w.blurb?w.blurb.split(". ")[0]+".":""))+'</p><div class="cta">'+(S.sel===w.id?"Click to descend to the surface":"Click to select · double-click to descend")+'</div>';tip.hidden=false;placeTip(x,y);}
function hideTip(){tip.hidden=true;}

/* ===================== INDEX ===================== */
const idx=$("#index");
function renderIndex(){let h='<h2 class="eyebrow">'+esc(UI.indexTitle)+'</h2>';
  K.groups.forEach(gr=>{const g=gr.id;const ws=WORLDS.filter(w=>w.group===g&&seen(w));if(!ws.length)return;h+='<div class="grp">'+esc(GROUP_NAME(g))+'</div>';
    ws.forEach(w=>{const n=evFor(w.id).length;h+='<button class="world'+(inBook(w)?"":" dim")+(S.sel===w.id?" sel":"")+(w.craft?" craft":"")+'" data-id="'+esc(w.id)+'"><span class="sw" style="background:'+esc((w.gfx&&w.gfx.sw)||(w.gfx&&w.gfx.pal&&w.gfx.pal[3])||"#889")+'"></span>'+esc(w.name)+'<span class="n">'+(n?n+UI.evCount:"")+'</span></button>';});});
  if(S.book){const hid=WORLDS.filter(w=>realmOk(w)&&!seen(w)).length;if(hid)h+='<p class="locked-note">'+hid+' more world'+(hid===1?" appears":"s appear")+' in later books.</p>';}
  idx.innerHTML=h;}
idx.addEventListener("click",e=>{const b=e.target.closest(".world");if(!b)return;if(MOB){idx.classList.remove("open");$("#idxBtn").setAttribute("aria-expanded","false");}
  if(S.view==="world")descend(b.dataset.id);else selectWorld(b.dataset.id,true);});
$("#idxBtn").addEventListener("click",()=>{const o=idx.classList.toggle("open");$("#idxBtn").setAttribute("aria-expanded",o);});

/* ===================== DOSSIER ===================== */
const dos=$("#dossier");let dosCollapsed=MOB;
const nBooksWord=BOOK_IDS.length<=12?NUMW[BOOK_IDS.length]:String(BOOK_IDS.length);
function grab(title,sub,go){return '<div class="grab" id="grab" role="button" tabindex="0" aria-label="Show or hide details">'+(go?'<button class="btn primary go" data-act="descend">Descend</button>':'')+'<span>'+esc(title)+'</span><em>'+esc(sub||"")+'</em></div>';}
function chipStyle(w){const g=GROUP_BY[w.group];const c=g&&g.chip;return c?' style="'+(c.border?"--chip-b:"+esc(c.border)+";":"")+(c.color?"--chip-c:"+esc(c.color):"")+'"':"";}
function renderDossier(){let h="";const M=K.meta,IN=K.intro;
  if(!S.sel){
    h=grab(M.title,"About")+'<p class="eyebrow">'+esc([M.author,M.years].filter(Boolean).join(" · "))+'</p><h2>'+esc(M.series)+'</h2>'+realmCard(null)+
      (IN.text?'<p class="blurb">'+esc(IN.text)+'</p>':"")+
      (CUM?'<div class="rule"><span class="eyebrow">Reading through</span></div>'+
      '<p class="shield">'+(S.book?'Showing <b>'+esc(BOOKS[S.book].title)+'</b> and the books before it. Worlds, events and fates from later books are hidden.':
        (BOOK_IDS.length>1?'Showing all '+nBooksWord+' books. <b>Pick the book you are reading</b> in the bar above to hide later spoilers.':'Showing the whole book.'))+'</p>':"")+
      (ARR(IN.legend).length?'<div class="rule"><span class="eyebrow">How to read the map</span></div>'+
      '<dl class="facts">'+ARR(IN.legend).map(r=>'<dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd>').join("")+'</dl>':"")+
      '<div class="actions"><button class="btn primary" data-act="web">'+esc(UI.homeAction)+'</button>'+(UI.go?'<button class="btn" data-act="go" data-id="'+esc(UI.go.id)+'">'+esc(UI.go.label||("Go to "+WORLD_BY[UI.go.id].name))+'</button>':"")+'</div>'+
      (M.srcnote?'<p class="srcnote">'+esc(M.srcnote)+'</p>':"");
  } else {const w=WORLD_BY[S.sel];const status=statusFor(w);
    h=grab(w.name,S.view==="world"?"On the surface":"Selected",S.view==="galaxy")+
      '<p class="eyebrow">'+esc(GROUP_NAME(w.group))+'</p><h2>'+esc(w.name)+'</h2>'+(w.aka&&w.aka.length?'<p class="aka">'+esc(ARR(w.aka).join(" · "))+'</p>':"")+
      '<div class="chips">'+(status?'<span class="chip"'+chipStyle(w)+'>'+esc(status)+'</span>':"")+bks(w.books)+'</div>'+
      realmCard(w)+(S.realm!=="physical"?'<div class="rule"><span class="eyebrow">In the Physical Realm</span></div>':"")+'<p class="blurb">'+esc(eraBlurb(w))+'</p>'+
      '<dl class="facts">'+(w.star&&w.star.name?'<dt>Star</dt><dd>'+esc(w.star.name)+'</dd>':"")+ARR(eraVal(w,"facts")).map(f=>'<dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd>').join("")+
        '<dt>Distance</dt><dd>'+esc(distText(w))+'</dd></dl>'+
      '<div class="actions">'+(S.view==="galaxy"?'<button class="btn primary" data-act="descend">Descend to the surface</button>':'<button class="btn primary" data-act="ascend">Return to the galaxy</button>')+
        (S.view==="world"?'':'<button class="btn" data-act="web">'+esc(UI.homeLink)+'</button>')+'</div>';
    const all=(w.sites||[]).filter(siteEraOk);
    if(CUM){const sites=all.filter(siteSeen);
      if(sites.length){h+='<div class="rule"><span class="eyebrow">Places</span></div>';
        sites.forEach(s=>{h+='<button class="place'+(S.site===s.id?" sel":"")+'" data-site="'+esc(s.id)+'"'+(!S.book||(s.books||[]).includes(S.book)?"":' style="opacity:.55"')+'><span class="pn"><span class="pip"></span>'+esc(s.name)+'<span class="pc">'+bks(s.books||[])+'</span></span><span class="pd">'+esc(s.desc)+'</span></button>';});}}
    else{const vis=all.filter(s=>!S.book||!s.book||s.book===S.book||(s.books||[]).includes(S.book));
      if(all.length){h+='<div class="rule"><span class="eyebrow">Places</span></div>';
        all.forEach(s=>{h+='<button class="place'+(S.site===s.id?" sel":"")+'" data-site="'+esc(s.id)+'"'+(vis.includes(s)?"":' style="opacity:.45"')+'><span class="pn"><span class="pip"></span>'+esc(s.name)+'<span class="pc">'+bks(s.books||(s.book?[s.book]:[]))+'</span></span><span class="pd">'+esc(s.desc)+'</span></button>';});}}
    const evs=evFor(w.id);h+='<div class="rule"><span class="eyebrow">In the Chronicle</span></div>';
    h+=evs.length?evs.map(e=>'<button class="evitem'+(S.ev===e.id?" open":"")+(S.book&&e.book<S.book?" past":"")+'" data-ev="'+esc(e.id)+'"><span class="et"><span class="bk bk'+e.book+'">'+esc(BOOKS[e.book].n)+'</span>'+esc(e.title)+'</span><span class="ex">'+esc(e.text)+'</span>'+(e.side?'<span class="ep">'+esc(e.side)+'</span>':e.site?'<span class="ep">'+esc(siteName(w,e.site))+'</span>':"")+'</button>').join("")
      :'<p class="empty">'+(S.book?(CUM?"Nothing happens here up to "+BOOKS[S.book].title+".":"No events here in "+BOOKS[S.book].title+"."):"No major events take place here.")+'</p>';
  }
  dos.innerHTML=h;dos.classList.toggle("collapsed",MOB&&dosCollapsed);dos.scrollTop=0;
  const gb=$("#grab");
  if(gb){const toggleSheet=()=>{dosCollapsed=!dosCollapsed;dos.classList.toggle("collapsed",dosCollapsed);if(!dosCollapsed)closeChron();};
    gb.addEventListener("click",e=>{if(e.target.closest("[data-act]"))return;toggleSheet();});
    gb.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleSheet();}});}
}
function eraBlurb(w){let b=w.blurb;const cur=CUM?EFF():S.book;eraKeys(w).forEach(k=>{if(cur>=k&&w.eras[k].blurb)b=w.eras[k].blurb;});return b;}
function siteName(w,id){const s=(w.sites||[]).find(x=>x.id===id);return s?s.name:"";}
const HOOK_API={get worldBy(){return WORLD_BY;},sol:SOL,get state(){return {book:S.book,sel:S.sel,view:S.view};},books:BOOKS,worlds:WORLDS};
function distText(w){
  if(w.distText)return w.distText;
  if(typeof K.hooks.distText==="function"){try{const t=K.hooks.distText(w,HOOK_API);if(t!=null)return t;}catch(e){console.warn(e);}}
  if(w.pos3)return "Not in our time or space";
  if(w.gal)return "About "+Math.round(w.gal.ly||0).toLocaleString()+" light-years from Sol (real star)";
  if(w.star&&w.star.ly)return w.star.ly.toLocaleString()+" light-years from Sol (real star)";
  if(w.ly)return "About "+w.ly.toLocaleString()+" light-years from Sol (placement estimated)";
  const ly=Math.round(w.pos.distanceTo(SOL))*100;if(!ly)return "At Sol";
  return "About "+ly.toLocaleString()+" light-years from Sol"+(w.est?" · position estimated":"");}
dos.addEventListener("click",e=>{const a=e.target.closest("[data-act]");if(a){const k=a.dataset.act;
    if(k==="descend")descend(S.sel);else if(k==="ascend")ascend();else if(k==="web")flyHuman();else if(k==="go")selectWorld(a.dataset.id,true);return;}
  const p=e.target.closest("[data-site]");if(p){selectSite(p.dataset.site===S.site?null:p.dataset.site);return;}
  const ev=e.target.closest("[data-ev]");if(ev){openEvent(ev.dataset.ev===S.ev?null:ev.dataset.ev,false);}});

/* ===================== CHRONICLE ===================== */
const track=$("#track");const chron=$("#chron");
function renderChron(){let h="";BOOK_IDS.forEach(b=>{
  if(CUM&&S.book&&b>S.book){h+='<div class="book locked"><div class="book-t" style="color:var(--b'+b+')"><i>'+esc(BOOKS[b].n)+'</i>'+esc(BOOKS[b].title)+'</div><div class="lockmsg">Hidden until you reach it</div></div>';return;}
  const evs=EVENTS.filter(e=>e.book===b);
  h+='<div class="book'+(CUM&&S.book&&b<S.book?" past":"")+'"><div class="book-t" style="color:var(--b'+b+')"><i>'+esc(BOOKS[b].n)+'</i>'+esc(BOOKS[b].title)+'</div><div class="evs">'+
    evs.map(e=>'<button class="ev'+(!CUM&&S.book&&S.book!==b?" dim":"")+(S.ev===e.id?" hl":"")+(e.side?" side":"")+'" data-ev="'+esc(e.id)+'" style="--c:var(--b'+b+')"><span class="d"></span><span class="tt">'+esc(e.title)+'</span><span class="pl">'+esc(WORLD_BY[e.world]?WORLD_BY[e.world].name:"")+'</span></button>').join("")+'</div></div>';});
  track.innerHTML=h;if(typeof chronH==="function")requestAnimationFrame(chronH);
  if(CUM&&S.book){const cur=track.querySelectorAll(".book")[BOOK_IDS.indexOf(S.book)];if(cur&&!MOB)track.scrollLeft=Math.max(0,cur.offsetLeft-40);}}
track.addEventListener("click",e=>{const b=e.target.closest(".ev");if(b){openEvent(b.dataset.ev,true);if(MOB)closeChron();}});
function closeChron(){if(MOB){chron.classList.add("closed");chron.classList.remove("open-c");chronH();}}
$("#chronT").addEventListener("click",()=>{if(!MOB)return;const open=chron.classList.contains("closed");chron.classList.toggle("closed",!open);chron.classList.toggle("open-c",open);if(open){dosCollapsed=true;dos.classList.add("collapsed");}chronH();});
if(MOB)chron.classList.add("closed");

/* ===================== LEGEND (PACK_FORMAT 15) ===================== */
function renderLegend(){const b=S.book;let L=[];
  if(typeof K.legend==="function"){try{L=ARR(K.legend(b,HOOK_API));}catch(e){console.warn(e);}}
  else ARR(K.legend).forEach(it=>{if(!it)return;
    if(it.bookColors){if(b)L.push([BOOKS[b].c,(it.label||"")+" · "+BOOKS[b].title]);else L.push(["linear-gradient(90deg,"+BOOK_IDS.map(k=>BOOKS[k].c).join(",")+")",it.allLabel||it.label||""]);return;}
    if(it.books&&b&&!ARR(it.books).includes(b))return;if(it.book!=null&&b&&b<it.book)return;
    L.push([it.color||"#fff",it.label||""]);});
  $("#legend").innerHTML=L.map(l=>'<span><i style="background:'+esc(l[0])+'"></i>'+esc(l[1])+'</span>').join("");}

/* ===================== CODEX ===================== */
let cxTab=K.codex.length?K.codex[0].id:null;
function cxFirst(x){return x.first||(x.books&&x.books.length?Math.min(...x.books):1);}
function renderCodex(){if(!cxTab)return;$("#cxTabs").innerHTML=K.codex.map(t=>'<button class="btn" data-tab="'+esc(t.id)+'" aria-pressed="'+(t.id===cxTab)+'">'+esc(t.t)+'</button>').join("");
  const tab=K.codex.find(t=>t.id===cxTab)||K.codex[0];
  const list=tab.list.filter(x=>!CUM||!S.book||cxFirst(x)<=S.book);const hid=tab.list.length-list.length;
  $("#cxBody").innerHTML=list.map(x=>{const more=ARR(x.more).filter(m=>m&&m[0]<=EFF()).map(m=>m[1]).join(" ");
    return '<div class="cx-item"><h3>'+esc(x.name)+'</h3>'+(x.role||x.books?'<div class="r">'+esc(x.role||"")+(x.books?" "+bks(x.books):"")+'</div>':"")+'<p>'+esc((x.desc||"")+(more?" "+more:""))+'</p></div>';}).join("")+
    (hid?'<p class="cx-hid">'+hid+' more entr'+(hid===1?"y unlocks":"ies unlock")+' in later books.</p>':"");
  $("#cxNote").textContent=CUM?(S.book?"Reading through "+BOOKS[S.book].title:(BOOK_IDS.length>1?"All "+nBooksWord+" books · spoilers":"")):"";}
$("#cxTabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){cxTab=b.dataset.tab;renderCodex();}});
$("#cxBtn").addEventListener("click",()=>{renderCodex();$("#codex").hidden=false;$("#cxClose").focus();});
$("#cxClose").addEventListener("click",()=>{$("#codex").hidden=true;});
$("#codex").addEventListener("click",e=>{if(e.target.id==="codex")$("#codex").hidden=true;});
addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#codex").hidden)$("#codex").hidden=true;else if(S.view==="world")ascend();}});

/* ===================== CRUMBS & HINT ===================== */
function renderCrumbs(){const c=$("#crumbs");let h='<button data-c="gal">'+esc(UI.galaxyCrumb)+'</button><i>›</i>';
  const w=S.sel&&WORLD_BY[S.sel];const gc=w&&groupOpt(w,"crumb",null);
  if(gc)h+='<button data-c="'+(gc.ascendOnly?"sat":"web")+'">'+esc(gc.label||GROUP_NAME(w.group))+'</button>';
  else if(UI.crumbGroups)h+='<button data-c="web"'+(!w?' class="here"':"")+'>'+(w?esc(GROUP_NAME(w.group)):esc(UI.homeCrumb))+'</button>';
  else h+='<button data-c="web"'+(!w?' class="here"':"")+'>'+esc(UI.homeCrumb)+'</button>';
  if(w)h+='<i>›</i><button data-c="world" class="'+(S.view==="world"&&!S.site?"here":S.view==="galaxy"?"here":"")+'">'+esc(w.name)+'</button>';
  if(S.view==="world"&&S.site)h+='<i>›</i><span class="here">'+esc(siteName(w,S.site))+'</span>';
  c.innerHTML=h;}
$("#crumbs").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;const k=b.dataset.c;
  if(k==="gal")flyGalaxy();else if(k==="web")flyHuman();else if(k==="sat"){if(S.view==="world")ascend();}else if(k==="world"){if(S.view==="world")selectSite(null);else descend(S.sel);}});
let hintT=0;function hint(t){const h=$("#navhint");h.textContent=t;h.style.opacity=1;clearTimeout(hintT);hintT=setTimeout(()=>h.style.opacity=0,5200);}

/* ===================== REALMS (PACK_FORMAT 19) =====================
   One space, three views. Physical: the map as drawn. Cognitive: the same worlds with the empty
   space between them compressed, each world shown as its subastral. Spiritual: no distance at all;
   worlds gather by Connection around the Shards that invest them. */
const RL=K.raw.realms||null;const RCOG=(RL&&RL.cognitive)||{},RSPI=(RL&&RL.spiritual)||{};
const REALM_FX=[];
WORLDS.forEach(w=>{w.posP=w.pos.clone();});
const RCENTER=resolvePoint(RL&&RL.center)||SOL.clone();
function groupAnchor(gid){const gr=GROUP_BY[gid];if(gr&&gr.anchor&&WORLD_BY[gr.anchor])return WORLD_BY[gr.anchor].posP.clone();
  const ws=WORLDS.filter(w=>w.group===gid);const c=new THREE.Vector3();ws.forEach(w=>c.add(w.posP));return c.multiplyScalar(1/Math.max(1,ws.length));}
const ANCH={};K.groups.forEach(gr=>ANCH[gr.id]=groupAnchor(gr.id));
const anchorOf=w=>w.realmAnchor&&WORLD_BY[w.realmAnchor]?ANCH[WORLD_BY[w.realmAnchor].group]:ANCH[w.group];
{const kO=RCOG.compress==null?.4:RCOG.compress,kI=RCOG.compressInner==null?.75:RCOG.compressInner;
  WORLDS.forEach(w=>{const a=anchorOf(w);w.posC=RCENTER.clone().add(a.clone().sub(RCENTER).multiplyScalar(kO)).add(w.posP.clone().sub(a).multiplyScalar(kI));});}
const SHARDS=ARR(RSPI.shards).filter(x=>x&&x.id);const SNODE={};
{const n=SHARDS.length||1,R0=RSPI.radius||14,lift=RSPI.lift==null?1.5:RSPI.lift;
  SHARDS.forEach((sh,i)=>{const a=i/n*TAU+(RSPI.rot||0);SNODE[sh.id]=RCENTER.clone().add(new THREE.Vector3(Math.sin(a)*R0,lift,Math.cos(a)*R0));});
  WORLDS.forEach(w=>{const gr=GROUP_BY[w.group]||{};const own=w.realms&&w.realms.spiritual&&w.realms.spiritual.shards;
    const sp=ARR(own||w.spirit||gr.spirit).filter(id=>SNODE[id]);w.spiritShards=sp;let an;
    if(sp.length){an=new THREE.Vector3();sp.forEach(id=>an.add(SNODE[id]));an.multiplyScalar(1/sp.length);an=RCENTER.clone().add(an.sub(RCENTER).multiplyScalar(RSPI.pull==null?.58:RSPI.pull));}
    else{const R=rng(hashStr(w.group+"sp"));const a=R()*TAU;an=RCENTER.clone().add(new THREE.Vector3(Math.sin(a)*R0*.2,lift*.6,Math.cos(a)*R0*.2));}
    w.posS=an.add(w.posP.clone().sub(anchorOf(w)).multiplyScalar(RSPI.inner==null?.45:RSPI.inner));});}
/* Cognitive extras: embers in the dark between subastrals, glows for each subastral and perpendicularity */
function realmSprite(tex,scale,op,realm,world,off,first,pulse,stretch){const sp=glowSprite(tex,scale,op);if(stretch)sp.scale.set(scale*stretch[0],scale*stretch[1],1);
  sp.visible=false;if(!world&&off)sp.position.copy(off);gal.add(sp);const f={s:sp,op,realm,world,off:world?(off||new THREE.Vector3()):new THREE.Vector3(),first,pulse,ph:Math.random()*6};REALM_FX.push(f);return f;}
if(RL){
  if(RL.cognitive){const n=MOB?1600:3600,R=rng(5);const p=new Float32Array(n*3),c=new Float32Array(n*3),z=new Float32Array(n);const spread=RCOG.emberSpread||12;
    for(let i=0;i<n;i++){const v=new THREE.Vector3(gauss(R),gauss(R)*.35,gauss(R)).multiplyScalar(spread);p.set([RCENTER.x+v.x,RCENTER.y+v.y,RCENTER.z+v.z],i*3);
      const t=R();const col=t<.7?[1,.45,.18]:t<.9?[1,.7,.35]:[.8,.6,1];const b=.25+R()*.5;c.set([col[0]*b,col[1]*b,col[2]*b],i*3);z[i]=.05+R()*.12;}
    const em=new THREE.Points(pointsGeo(p,c,z),galMat.clone());em.material.uniforms.uAlpha.value=1;em.visible=false;em.frustumCulled=false;gal.add(em);REALM_FX.push({s:em,realm:"cognitive",op:1});
    const SAS=ARR(RCOG.subastrals).filter(sa=>sa&&WORLD_BY[sa.world]&&WORLD_BY[sa.world].posC);const SAC=new THREE.Vector3();SAS.forEach(sa=>SAC.add(WORLD_BY[sa.world].posC));if(SAS.length)SAC.multiplyScalar(1/SAS.length);
    /* subastral names fan outward from the middle of the cluster so they do not pile up */
    const saOff=sa=>{if(sa.off)return sa.off;const w=WORLD_BY[sa.world];const r=sa.r||2.2;if(!w.posC)return [0,-r*.42,0];const d=w.posC.clone().sub(SAC);d.y=0;if(d.length()<1e-3)return [0,-r*.42,0];d.normalize().multiplyScalar(r*1.25+1.1);return [d.x,-r*.2,d.z];};
    ARR(RCOG.subastrals).forEach(sa=>{if(!sa||!WORLD_BY[sa.world])return;const tex=glowTex([[0,"rgba(255,255,255,.9)"],[.35,sa.color||"#8a6fe8"],[1,"rgba(0,0,0,0)"]]);
      realmSprite(tex,sa.r||2.2,sa.op==null?.42:sa.op,"cognitive",sa.world,new THREE.Vector3(),sa.first,true);
      if(sa.name)regionLabel(sa.name,WORLD_BY[sa.world].pos.clone(),.6,60,false,sa.first?{first:sa.first}:null,{world:sa.world,off:saOff(sa),realm:"cognitive"});});
    ARR(RCOG.perps).forEach(pp=>{if(!pp||!WORLD_BY[pp.world])return;const tex=glowTex([[0,"rgba(255,255,255,1)"],[.25,pp.color||"rgba(200,220,255,.6)"],[1,"rgba(0,0,0,0)"]]);
      realmSprite(tex,.5,.85,"cognitive",pp.world,new THREE.Vector3(0,.35,0),pp.first,true,[.35,2.4]);});}
  if(RL.spiritual){const core=glowTex([[0,"rgba(255,250,235,1)"],[.25,"rgba(255,220,150,.45)"],[1,"rgba(0,0,0,0)"]]);
    realmSprite(core,RSPI.coreSize||6,.75,"spiritual",null,RCENTER.clone().add(new THREE.Vector3(0,RSPI.lift==null?1.5:RSPI.lift,0)),null,true);
    if(RSPI.coreLabel)regionLabel(RSPI.coreLabel,RCENTER.clone().add(new THREE.Vector3(0,(RSPI.lift==null?1.5:RSPI.lift)+1.6,0)),2,400,true,RSPI.coreFirst?{first:RSPI.coreFirst}:null,{realm:"spiritual"});
    SHARDS.forEach(sh=>{const tex=glowTex([[0,"rgba(255,255,255,1)"],[.3,sh.color||"#f0d890"],[1,"rgba(0,0,0,0)"]]);realmSprite(tex,sh.size||2.4,.8,"spiritual",null,SNODE[sh.id].clone(),sh.first,true);
      regionLabel(sh.name||sh.id,SNODE[sh.id].clone().add(new THREE.Vector3(0,1.1,0)),2,400,!!sh.major,sh.first?{first:sh.first}:null,{realm:"spiritual"});});}
}
/* Connection threads in the Spiritual Realm: each Shard to the Shattering, each world to the Shards that invest it */
function realmThreads(){if(S.realm!=="spiritual"||!RL||!RL.spiritual)return;const mid=RCENTER.clone().add(new THREE.Vector3(0,RSPI.lift==null?1.5:RSPI.lift,0));
  SHARDS.forEach(sh=>{const id="sp_"+sh.id;const m=linkMaterial(sh.color||"#f0d890",.85,.25,1.2);const l=linkLines([[mid,SNODE[sh.id]]],m,.02);LINKS[id]=l;
    LINK_DEFS.push({id,L:{realm:"spiritual"},op:{all:.35,cur:.35,past:.35},minBook:sh.first||null});});
  WORLDS.filter(w=>w.spiritShards&&w.spiritShards.length&&(w.major||w.spiritThread)).forEach(w=>w.spiritShards.forEach(sid=>{const sh=SHARDS.find(x=>x.id===sid);const id="spw_"+w.id+"_"+sid;
    const m=linkMaterial((sh&&sh.color)||"#f0d890",.85,.5,2);const l=linkLines([[w.pos.clone(),SNODE[sid]]],m,.06);LINKS[id]=l;
    LINK_DEFS.push({id,L:{realm:"spiritual"},op:{all:.6,cur:.6,past:.6},minBook:Math.max(firstOf(w),(sh&&sh.first)||0)||null});}));}
let RT=null;
const realmTarget=w=>S.realm==="cognitive"?w.posC:S.realm==="spiritual"?w.posS:w.posP;
function placeWorlds(k){const pa=markerPts.geometry.attributes.position;WORLDS.forEach((w,i)=>{if(RT)w.pos.lerpVectors(RT.from[i],RT.to[i],k);else w.pos.copy(realmTarget(w));pa.setXYZ(i,w.pos.x,w.pos.y,w.pos.z);});pa.needsUpdate=true;}
function stepRealmTween(){if(!RT)return;const k=clamp((performance.now()-RT.t0)/RT.dur,0,1);placeWorlds(ease(k));if(k>=1){RT=null;rebuildLinks();}}
const STYLE_IX={beads:0,mist:1,plasma:2,paint:3,unsea:4};
function realmLook(w){const r=S.realm;if(r==="cognitive"){const c=Object.assign({},RCOG.look||{},(w.realms&&w.realms.cognitive)||{});return {i:1,st:STYLE_IX[c.style]!=null?STYLE_IX[c.style]:0,c1:c.c1||"#6a4ab0",c2:c.c2||"#b8a0ff",c3:c.c3||"#121018"};}
  if(r==="spiritual"){const cs=(w.spiritShards||[]).map(id=>(SHARDS.find(x=>x.id===id)||{}).color).filter(Boolean);const d=RSPI.color||"#f0d890";return {i:2,st:0,c1:cs[0]||d,c2:cs[1]||cs[0]||d,c3:"#0a0810"};}
  return {i:0,st:0,c1:"#000",c2:"#000",c3:"#000"};}
function applyRealmToPlanet(){if(!PL)return;const L=realmLook(PL.w);const u=PL.mat.uniforms;u.uRealm.value=L.i;u.uRStyle.value=L.st;u.uRC1.value.copy(CL(L.c1));u.uRC2.value.copy(CL(L.c2));u.uRC3.value.copy(CL(L.c3));
  const phys=S.realm==="physical";if(PL.clouds)PL.clouds.visible=phys;if(PL.atmo)PL.atmo.visible=S.realm!=="spiritual";if(PL.atmo&&PL.atmo.material.uniforms){if(!PL.atmoC)PL.atmoC=PL.atmo.material.uniforms.uC.value.clone();PL.atmo.material.uniforms.uC.value.copy(phys?PL.atmoC:CL(L.c2).multiplyScalar(.6));}
  if(PL.ring)PL.ring.visible=S.realm!=="spiritual";PL.moons.forEach(m=>m.piv.visible=phys);
  WSKY.forEach(o=>o.visible=phys);sunSprite.visible=S.realm!=="spiritual";sunHalo.visible=phys;sunSprite.scale.setScalar(phys?140:38);
  if(!phys)sunSprite.material.color.copy(C("#ffffff"));else sunSprite.material.color.copy(C((PL.w.star&&PL.w.star.col)||"#fff4e0"));
  renderer.setClearColor(S.realm==="cognitive"?0x030206:S.realm==="spiritual"?0x06040a:0x04050b,1);}
const REALM_GAL={physical:{g:1,d:.55,clear:0x04050b},cognitive:{g:.1,d:.05,clear:0x030206},spiritual:{g:.04,d:0,clear:0x06040a}};
function setRealmLook(){const L=REALM_GAL[S.realm];galMat.uniforms.uAlpha.value=L.g;dustMat.uniforms.uAlpha.value=L.d;renderer.setClearColor(L.clear,1);}
const realmFirst=r=>RL&&RL[r]&&RL[r].first||0;
const realmOpen=r=>r==="physical"||!CUM||!S.book||S.book>=realmFirst(r);
function renderRealmBar(){const bar=$("#realms");if(!bar)return;if(!realmOpen(S.realm)){setRealm("physical",true);}
  bar.querySelectorAll("button").forEach(b=>{const r=b.dataset.r;const open=realmOpen(r);b.disabled=!open;b.setAttribute("aria-pressed",String(r===S.realm));
    b.title=open?((RL[r]||{}).tip||""):("Appears from "+(BOOKS[realmFirst(r)]?BOOKS[realmFirst(r)].title:"a later book"));});}
function setRealm(r,quiet){if(!RL||r===S.realm||(r!=="physical"&&!RL[r]))return;S.realm=r;setRealmLook();
  if(S.view==="galaxy"){RT={t0:performance.now(),dur:1500,from:WORLDS.map(w=>w.pos.clone()),to:WORLDS.map(realmTarget)};
    Object.values(LINKS).forEach(l=>l.visible=false);
    if(S.sel&&WORLD_BY[S.sel]){const w=WORLD_BY[S.sel];orbG.flyTo(realmTarget(w),flyDistFor(w),orbG.gyaw,orbG.pitch,1500);}
    else if(!quiet)orbG.flyTo(HOME_AT.clone().lerp(RCENTER,S.realm==="physical"?0:1),S.realm==="spiritual"?(RSPI.dist||52):HOME.dist*(S.realm==="cognitive"?(RCOG.zoom||.7):1),orbG.gyaw,HOME.pitch,1500);}
  else{RT=null;placeWorlds(1);rebuildLinks();applyRealmToPlanet();const w=WORLD_BY[S.sel];if(w)buildSiteLabels(w);}
  if(S.sel&&!seen(WORLD_BY[S.sel])){if(S.view==="world")ascend(()=>{S.sel=null;refreshAll();});else S.sel=null;}
  if(!quiet)refreshAll();}
function realmCard(w){if(!RL||S.realm==="physical")return "";const R=RL[S.realm]||{};
  if(!w)return '<div class="realmcard"><p class="eyebrow">'+esc(R.title||S.realm)+'</p><p>'+esc(R.text||"")+'</p></div>';
  const rw=w.realms&&w.realms[S.realm];const t=rw&&rw.blurb?rw.blurb:(R.unknown||"");if(!t&&!(rw&&rw.name))return "";
  return '<div class="realmcard"><p class="eyebrow">'+esc((rw&&rw.name)||R.title||S.realm)+'</p><p>'+esc(t)+'</p></div>';}
if($("#realms"))$("#realms").addEventListener("click",e=>{const b=e.target.closest("[data-r]");if(!b||b.disabled)return;setRealm(b.dataset.r);});

/* ===================== ACTIONS ===================== */
const HOME=Object.assign({at:{sol:[0,0,0]},dist:58,pitch:.62,dur:2000},G.home||{},MOB&&G.homeMob?G.homeMob:{});
const OVER=Object.assign({at:{xyz:[0,0,40]},dist:1100,pitch:.95,dur:2200},G.overview||{});
const HOME_AT=resolvePoint(HOME.at)||SOL.clone(),OVER_AT=resolvePoint(OVER.at)||new THREE.Vector3(0,0,40);
function refreshAll(){renderRealmBar();renderIndex();renderDossier();renderChron();renderCrumbs();renderLegend();applyBookToScene();}
function selectWorld(id,fly){if(!WORLD_BY[id])return;S.sel=id;S.site=null;S.ev=null;if(MOB)dosCollapsed=true;refreshAll();
  const w=WORLD_BY[id];if(fly&&S.view==="galaxy"){orbG.flyTo(w.pos,flyDistFor(w),orbG.gyaw,FLY_PITCH,1900);}
  if(S.view==="world")descend(id);}
function flyGalaxy(){if(S.view==="world"){ascend(()=>flyGalaxy());return;}orbG.flyTo(OVER_AT,OVER.dist,orbG.gyaw,OVER.pitch,OVER.dur);}
function flyHuman(){if(S.view==="world"){ascend(()=>flyHuman());return;}orbG.flyTo(HOME_AT,HOME.dist,orbG.gyaw,HOME.pitch,HOME.dur);}
const fade=$("#fade");
function transition(fn){fade.classList.add("on");setTimeout(()=>{fn();requestAnimationFrame(()=>fade.classList.remove("on"));},430);}
function fitDist(r){const hf=2*Math.atan(Math.tan(camW.fov*DEG/2)*camW.aspect);return r/Math.sin(Math.min(hf,camW.fov*DEG)/2);}
function descend(id){const w=WORLD_BY[id];if(!w)return;S.sel=id;S.site=null;if(MOB)dosCollapsed=true;
  transition(()=>{S.view="world";hideTip();
    const bk=$("#bake");bk.hidden=false;const bi=bk.querySelector("i");
    const go=()=>{buildPlanet(w,S.book,p=>{bi.style.width=(p*100).toFixed(0)+"%";if(p>=1)setTimeout(()=>bk.hidden=true,400);});buildSiteLabels(w);
      /* open with the world's best-known place turned toward the sun */
      const hero=SITE_EL.find(o=>o.s.id===w.hero)||SITE_EL[0];
      if(hero&&PL){const V=SUN_DIR.clone().multiplyScalar(.55).add(new THREE.Vector3(Math.sin(orbW.gyaw),0,Math.cos(orbW.gyaw)).multiplyScalar(.45));
        PL.root.rotation.y=Math.atan2(V.x,V.z)-Math.atan2(hero.dir.x,hero.dir.z);orbW.pitch=orbW.gpitch=clamp(Math.asin(hero.dir.y)*.6,-.6,.6);}};
    orbW.min=gfxFor(w,S.book).map?1.012:1.06;orbW.t.set(0,0,0);orbW.gt.set(0,0,0);orbW.dist=orbW.gdist=Math.max(w.view||(w.gfx&&w.gfx.type==="gas"?4.8:4.0),fitDist(w.ring?2.3:1.15));orbW.yaw=orbW.gyaw=.45;orbW.pitch=orbW.gpitch=.18;
    if(gfxFor(w,S.book).base==="earth"&&!EARTH_TEX)loadEarth().then(go);else go();
    S.interacted=false;
    Object.values(GL_LBL).forEach(l=>{l.style.opacity=0;l.style.pointerEvents="none";});REGIONS.forEach(r=>r.el.style.opacity=0);
    refreshAll();hint(MOB?UI.hints.worldMob:UI.hints.world);});}
function ascend(after){transition(()=>{S.view="galaxy";S.site=null;clearPlanet();SITE_EL.forEach(s=>s.el.remove());SITE_EL=[];$("#bake").hidden=true;
  const w=WORLD_BY[S.sel];if(w){orbG.t.copy(w.pos);orbG.gt.copy(w.pos);orbG.dist=orbG.gdist=flyDistFor(w);}refreshAll();if(after)setTimeout(after,60);});}
function selectSite(id){S.site=id;if(id&&MOB)dosCollapsed=false;renderDossier();renderCrumbs();
  if(id&&PL){const o=SITE_EL.find(x=>x.s.id===id);if(o){S.interacted=true;
    /* turn the world so the place sits in daylight, between the sun and the viewer */
    const V=SUN_DIR.clone().multiplyScalar(.55).add(new THREE.Vector3(Math.sin(orbW.gyaw),0,Math.cos(orbW.gyaw)).multiplyScalar(.45));V.y=0;V.normalize();
    const vy=Math.atan2(V.x,V.z);const sy=Math.atan2(o.dir.x,o.dir.z);const r0=PL.root.rotation.y;PL.turn={t0:performance.now(),from:r0,to:r0+((((vy-sy)-r0+Math.PI)%TAU+TAU)%TAU-Math.PI)};
    const pitch=Math.asin(clamp(o.dir.y,-1,1));const dy=((vy-orbW.gyaw+Math.PI)%TAU+TAU)%TAU-Math.PI;
    orbW.flyTo(new THREE.Vector3(),Math.min(orbW.dist,2.4),orbW.gyaw+dy,clamp(pitch,-1.2,1.2),1500);}}}
function openEvent(id,travel){S.ev=id;if(!id){renderDossier();renderChron();return;}const e=EV_BY[id];if(!e)return;
  if(travel&&e.site&&RL){const ew=WORLD_BY[e.world];const st=ew&&(ew.sites||[]).find(x=>x.id===e.site);const rr=st&&(st.realm||st.realms);if(rr&&!ARR(rr).includes(S.realm))setRealm(ARR(rr)[0]);}
  if(travel){if(S.view==="world"&&S.sel===e.world){if(e.site)selectSite(e.site);}
    else if(S.view==="world"){S.sel=e.world;descend(e.world);if(e.site)setTimeout(()=>selectSite(e.site),900);}
    else{S.sel=e.world;const w=WORLD_BY[e.world];orbG.flyTo(w.pos,flyDistFor(w),orbG.gyaw,FLY_PITCH,1900);}}
  if(MOB)dosCollapsed=false;refreshAll();S.ev=id;renderDossier();
  const it=dos.querySelector('[data-ev="'+id+'"]');if(it&&!MOB)it.scrollIntoView({block:"nearest"});}

/* book filter */
$("#books").addEventListener("click",e=>{const b=e.target.closest("[data-b]");if(!b)return;S.book=+b.dataset.b;if(S.sel&&!seen(WORLD_BY[S.sel])){if(S.view==="world"){S.book=+b.dataset.b;$("#books").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));ascend(()=>{S.sel=null;refreshAll();});return;}S.sel=null;}S.ev=null;
  $("#books").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
  if(S.view==="world"&&S.sel){const w=WORLD_BY[S.sel];const k1=cacheKey(w,gfxFor(w,S.book));if(!PL||PL.key!==k1){descend(S.sel);return;}}
  refreshAll();});
$("#galBtn").addEventListener("click",flyGalaxy);
$("#webBtn").addEventListener("click",flyHuman);
function applyBookToScene(){const b=S.book;
  LINK_DEFS.forEach(d=>{const L=LINKS[d.id];if(!L)return;const op=d.op,R=d.L;
    let a=!b?op.all:R.books?(ARR(R.books).includes(b)?op.cur:0):R.book!=null?(R.book===b?op.cur:R.book<b?op.past:0):op.cur;if(d.minBook!=null&&b&&b<d.minBook)a=0;if(!realmOk(R))a=0;
    L.material.uniforms.uA.value=a;L.visible=a>0;});
  const dim=markerPts.geometry.attributes.aDim;WORLDS.forEach((w,i)=>dim.setX(i,!seen(w)?-1:inBook(w)?1:K.spoil.dimMarker));dim.needsUpdate=true;
  WORLDS.filter(w=>w.swarm).forEach(w=>{const s=GMARK[w.id+"_swarm"];if(s)s.visible=CUM?seen(w):(!b||inBook(w));});
  GLOWS.forEach(g=>{g.s.visible=gateOk(g.gate,b)&&realmOk(g.def);});
  REALM_FX.forEach(f=>{f.s.visible=f.realm===S.realm&&(!f.first||!CUM||!b||b>=f.first);});TERR.forEach(m=>{m.visible=gateOk(m.userData.gate,b);});}

/* ===================== POINTER INPUT ===================== */
const ptrs=new Map();let dragMoved=0,pinch0=0,lastTap=0,downAt=0;
canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});dragMoved=0;downAt=performance.now();
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);}canvas.classList.add("dragging");S.interacted=true;});
canvas.addEventListener("pointermove",e=>{const p=ptrs.get(e.pointerId);
  if(!p){if(S.view==="galaxy"&&e.pointerType==="mouse")hoverPick(e.clientX,e.clientY);return;}
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;dragMoved+=Math.abs(dx)+Math.abs(dy);
  const orb=S.view==="world"?orbW:orbG;
  if(ptrs.size===1){if(e.shiftKey||e.buttons===2||e.buttons===4){if(S.view==="galaxy")orb.pan(dx,dy);}else{const k=S.view==="world"?clamp((orb.dist-1)/3,.12,1):1;orb.rotate(dx*k,dy*k);}}
  else if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch0>0){orb.zoom(Math.pow(pinch0/d,1.2));}pinch0=d;
    if(S.view==="galaxy")orb.pan(dx*.5,dy*.5);}});
function endPtr(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;canvas.classList.remove("dragging");
  if(ptrs.size===0&&dragMoved<8&&performance.now()-downAt<500)tapAt(e.clientX,e.clientY);}
canvas.addEventListener("pointerup",endPtr);canvas.addEventListener("pointercancel",endPtr);
canvas.addEventListener("contextmenu",e=>e.preventDefault());
canvas.addEventListener("wheel",e=>{e.preventDefault();const orb=S.view==="world"?orbW:orbG;const f=Math.exp(e.deltaY*(S.view==="world"?.0012:.0016));
  if(S.view==="world"){const dd=orbW.gdist-1;orbW.gdist=clamp(1+dd*f,orbW.min,orbW.max);orbW.fly=null;}else orb.zoom(f);S.interacted=true;},{passive:false});
function pickWorld(x,y){const W=innerWidth,H=innerHeight;let best=null,bd=MOB?26:16;
  WORLDS.forEach(w=>{if(!seen(w))return;const pr=project(w.pos,camG,W,H);if(pr.z>=1)return;const d=Math.hypot(pr.x-x,pr.y-y);if(d<bd){bd=d;best=w;}});return best;}
function hoverPick(x,y){const w=pickWorld(x,y);if((w&&w.id)!==S.hover){S.hover=w?w.id:null;if(w)showTipWorld(w,x,y);else hideTip();}else if(w)placeTip(x,y);canvas.classList.toggle("pointing",!!w);}
function tapAt(x,y){const now=performance.now();const dbl=now-lastTap<320;lastTap=now;
  if(S.view==="galaxy"){const w=pickWorld(x,y);if(w){if(dbl||S.sel===w.id)descend(w.id);else selectWorld(w.id,true);}}
  else if(MOB){dosCollapsed=true;dos.classList.add("collapsed");closeChron();}}

/* ===================== RESIZE & LOOP ===================== */
function viewOffset(){const W=innerWidth,H=innerHeight;let ox=0,oy=0;
  if(!MOB&&W>900){const L=idx.getBoundingClientRect().right||0,R=dos.getBoundingClientRect().left||W;ox=W/2-(L+R)/2;ox=clamp(ox,-W*.2,W*.2);}
  if(MOB)oy=H*.07;
  [camG,camW].forEach(c=>{if(ox||oy)c.setViewOffset(W,H,ox,oy,W,H);else c.clearViewOffset();});}
function chronH(){document.documentElement.style.setProperty('--ch',chron.offsetHeight+'px');}
function resize(){chronH();const W=innerWidth,H=innerHeight;renderer.setSize(W,H,false);camG.aspect=camW.aspect=W/H;viewOffset();camG.updateProjectionMatrix();camW.updateProjectionMatrix();
  galMat.uniforms.uScale.value=dustMat.uniforms.uScale.value=H*renderer.getPixelRatio()*1.1;markerMat.uniforms.uPx.value=renderer.getPixelRatio();}
addEventListener("resize",resize);resize();
let last=performance.now(),T=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  bakeStep();
  linkMats.forEach(m=>m.uniforms.uTime.value=T);
  const W=innerWidth,H=innerHeight;
  if(S.view==="galaxy"){stepRealmTween();REALM_FX.forEach(f=>{if(f.world&&WORLD_BY[f.world])f.s.position.copy(WORLD_BY[f.world].pos).add(f.off);if(f.pulse)f.s.material.opacity=f.op*(.75+.25*Math.sin(T*1.6+f.ph));});orbG.update(dt);
    if(!S.interacted&&!orbG.fly)orbG.gyaw+=dt*.012;GLOWS.forEach(g=>{if(g.pulse)g.s.material.opacity=g.op*(.7+.3*Math.sin(T*1.3));});
    galMat.uniforms.uNear.value=dustMat.uniforms.uNear.value=clamp(orbG.dist*.25,.4,40);
    const sw=S.sel&&WORLD_BY[S.sel];selRing.material.opacity=sw?.95:0;if(sw)selRing.position.copy(sw.pos);
    const hw=S.hover&&WORLD_BY[S.hover];hoverRing.material.opacity=hw&&hw.id!==S.sel?.7:0;if(hw)hoverRing.position.copy(hw.pos);
    Object.keys(GMARK).forEach(k=>{GMARK[k].rotation.y=T*.02;});
    layoutGalaxyLabels(W,H);
    renderer.render(gal,camG);}
  else{orbW.update(dt);updatePlanet(dt,T,!S.interacted);layoutSiteLabels(W,H);renderer.render(wsc,camW);}
  requestAnimationFrame(frame);}

/* ===================== START ===================== */
refreshAll();
requestAnimationFrame(frame);
setTimeout(()=>{$("#splash").classList.add("out");hint(MOB?UI.hints.galaxyMob:UI.hints.galaxy);
  setTimeout(()=>flyHuman(),900);},1400);
$("#splash").addEventListener("click",()=>$("#splash").classList.add("out"));
const API={pack:K.raw,LINKS,WORLD_BY,get PL(){return PL;},get SITE_EL(){return SITE_EL;},descend,ascend,selectWorld,flyHuman,flyGalaxy,selectSite,orbG,orbW,S,openEvent,
  setBook(b){const el=document.querySelector('#books [data-b="'+(b|0)+'"]');if(el)el.click();},setRealm};
window.__atlas=API;return API;
}

/* fatal error panel, so a broken pack never leaves a blank page */
function fail(err){console.error(err);const d=document.createElement("div");d.style.cssText="position:fixed;inset:0;display:grid;place-items:center;background:#04050b;color:#d9deea;font:15px Georgia,serif;padding:24px;text-align:center;z-index:99";
  d.innerHTML='<div><p style="font:12px monospace;letter-spacing:.2em;text-transform:uppercase;color:#9db8ff">Atlas could not start</p><p>'+esc(err&&err.message||err)+'</p><p><a href="?" style="color:#9db8ff">Back to the list of atlases</a></p></div>';document.body.appendChild(d);}

window.AtlasEngine={version:1,start(pack){try{return start(pack);}catch(e){fail(e);return null;}},fail};
})();
