/* Nearby Worlds - GLSL shaders.
   GLSL_NOISE, BAKE_*, PLANET_*, CLOUD_FS, ATMO_* are reused from the Sun Eater Atlas engine (same author family),
   with additions for tidally locked worlds (day/night heat contrast) and a star-surface shader. */
'use strict';
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
uniform sampler2D tAlb,tNrm,tCld;
uniform vec3 uSun,uSunCol,uAtmo,uLightCol,uLava,uSeed;
uniform float uAtmoK,uCloudShift,uDetail,uAmb,uHasCld,uLavaOn,uTime,uHasSea,uLocked,uHeat;uniform vec3 uHeatCol;
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
  /* tidally locked worlds keep one face to the star: the substellar point is fixed in object space */
  vec3 Lo=normalize(transpose(uRot)*L);float sub=dot(d,Lo);
  float lockDay=mix(1.,smoothstep(-.15,.35,sub),uLocked);
  if(uLavaOn>.5)col+=uLava*B.a*(1.3+.3*sin(uTime*1.3+d.x*40.))*lockDay;
  /* thermal glow of hot worlds; on locked ones it pools around the substellar point and fades across the terminator */
  float hs=mix(.45,pow(clamp(sub*.5+.5,0.,1.),4.),uLocked);
  col+=uHeatCol*uHeat*hs*(.85+.15*sin(uTime*.7+d.y*9.+d.x*7.));
  float fr=pow(1.-max(dot(Ng,V),0.),3.);
  col=mix(col,uAtmo*(.15+.85*day),clamp(fr*uAtmoK*.55,0.,1.)*smoothstep(-.35,.25,ndlG));
  col+=uAtmo*uAtmoK*.035*day;
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


/* ---- star surface: granulation, limb darkening and starspots, tinted by temperature ----
   adapted from the Solar System Atlas sun shader (no texture; fully procedural) */
const STAR_VS=`varying vec3 vN;varying vec3 vP;
void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const STAR_FS=`uniform float uTime,uSpots,uSeed;uniform vec3 uCol,uLimb;varying vec3 vN;varying vec3 vP;
${GLSL_NOISE}
void main(){
  vec3 p=normalize(vP);
  float warp=fbm(p*2.5+vec3(uTime*.015+uSeed),4);
  float g1=snoise(p*60.+vec3(0.,uTime*.12,uSeed))*.5+.5;
  float g2=snoise(p*170.+vec3(uTime*.25,uSeed,0.))*.5+.5;
  float g=g1*.6+g2*.4;
  float act=smoothstep(.1,.6,fbm(p*2.2+vec3(uTime*.008,uSeed,0.),4)*.5+.5+warp*.3);
  /* starspots: commoner and larger on cool, active stars */
  float sp=smoothstep(.62-uSpots*.12,.78-uSpots*.1,fbm(p*3.1+vec3(uSeed*1.7),5)*.5+.5);
  float mu=clamp(dot(normalize(vN),vec3(0.,0.,1.)),0.,1.);
  float I=mix(.86,1.08,g)*(.38+.62*pow(mu,.5));
  vec3 c=mix(uLimb,uCol,pow(mu,.4))*I;
  c+=uCol*act*.08*pow(1.-mu,1.2);
  c*=1.-sp*uSpots*.55;
  gl_FragColor=vec4(c*1.25,1.);
  #include <tonemapping_fragment>
  #include <encodings_fragment>
}`;
/* soft corona shell drawn as a camera-facing quad */
const CORONA_VS=`varying vec2 vUv;void main(){vUv=uv*2.-1.;vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.);mv.xy+=position.xy;gl_Position=projectionMatrix*mv;}`;
const CORONA_FS=`uniform float uTime,uK;uniform vec3 uCol;varying vec2 vUv;
${GLSL_NOISE}
void main(){float r=length(vUv)*4.;if(r<.97)discard;float a=atan(vUv.y,vUv.x);
  float glow=exp(-(r-1.)*2.4);
  float str=pow(max(snoise(vec3(cos(a)*3.,sin(a)*3.,uTime*.03)),0.),2.)*exp(-(r-1.)*1.1)*.8;
  float fine=pow(max(snoise(vec3(cos(a)*12.,sin(a)*12.,r*.6-uTime*.05)),0.),3.)*exp(-(r-1.)*1.8)*.6;
  float i=(glow+str+fine)*smoothstep(4.,2.2,r)*uK;
  gl_FragColor=vec4(uCol*i,1.);}`;
/* map markers: soft star points with a hard core; aDim<0 hides */
const MARK_VS=`attribute vec3 color;attribute float aS;attribute float aDim;varying vec3 vC;varying float vD;uniform float uPx,uScale;
void main(){vC=color;vD=aDim;vec4 mv=modelViewMatrix*vec4(position,1.);float z=-mv.z;
  gl_PointSize=aDim<0.?0.:uPx*aS*clamp(uScale/z,.8,2.6)*(.55+.45*aDim);gl_Position=projectionMatrix*mv;}`;
const MARK_FS=`varying vec3 vC;varying float vD;
void main(){vec2 c=gl_PointCoord-.5;float d=length(c)*2.;float core=smoothstep(.3,0.,d);float halo=exp(-d*d*4.5)*.6;
  float a=(core+halo)*(.18+.82*vD);if(a<.01)discard;gl_FragColor=vec4(mix(vC,vec3(1.),core*.55)*a,a);}`;
/* orbit lines: dashed when uDash>0 (disputed planets) */
const ORBIT_VS=`attribute float aT;varying float vT;void main(){vT=aT;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const ORBIT_FS=`uniform vec3 uC;uniform float uA,uDash;varying float vT;
void main(){float a=uA;if(uDash>0.){if(fract(vT*uDash)>.55)discard;}gl_FragColor=vec4(uC*a,a);}`;
/* habitable-zone annulus */
const HZ_VS=`varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const HZ_FS=`uniform float uI0,uI1,uO0,uO1,uA;uniform vec3 uC;varying vec2 vP;
void main(){float r=length(vP);
  float opt=smoothstep(uI0*.985,uI0,r)*(1.-smoothstep(uO1,uO1*1.015,r));
  float con=smoothstep(uI1*.99,uI1,r)*(1.-smoothstep(uO0,uO0*1.01,r));
  float edge=exp(-pow((r-uI1)/(uI1*.012+.02),2.))+exp(-pow((r-uO0)/(uO0*.012+.02),2.));
  float a=(opt*.10+con*.16+edge*.35)*uA;if(a<.003)discard;gl_FragColor=vec4(uC*a,a);}`;
