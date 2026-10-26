/* Atlas places: ground-level views of the sites on a world (PACK_FORMAT 21).
   Loaded after engine.js. The engine calls AtlasPlaces.create(env) once, then enter(world, site) to build a
   procedural place (terrain, sky, city, landmarks, weather, traffic) and render(dt) every frame while the
   visitor is inside. Landmark builders live in places-lm.js; event effects at the end of this file.
   Everything is procedural: no textures or network requests. */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const ARR = x => (Array.isArray(x) ? x : x == null ? [] : [x]);
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s = Math.imul(s ^ (s >>> 15), 2246822507);
      s = Math.imul(s ^ (s >>> 13), 3266489909);
      s ^= s >>> 16;
      return (s >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    s = String(s);
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  /* 2D gradient noise and fbm, seeded per place */
  function makeNoise(seed) {
    const R = rng(seed),
      p = new Uint8Array(512),
      g = new Float32Array(512);
    const q = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) {
      const j = (R() * (i + 1)) | 0;
      [q[i], q[j]] = [q[j], q[i]];
    }
    for (let i = 0; i < 512; i++) {
      p[i] = q[i & 255];
      g[i] = R() * TAU;
    }
    const grad = (h, x, y) => Math.cos(g[h]) * x + Math.sin(g[h]) * y;
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    function n2(x, y) {
      const X = Math.floor(x),
        Y = Math.floor(y);
      const xf = x - X,
        yf = y - Y;
      const xi = X & 255,
        yi = Y & 255;
      const aa = p[p[xi] + yi],
        ab = p[p[xi] + yi + 1],
        ba = p[p[xi + 1] + yi],
        bb = p[p[xi + 1] + yi + 1];
      const u = fade(xf),
        v = fade(yf);
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v,
      );
    }
    function fbm(x, y, oct) {
      let a = 0.5,
        f = 1,
        s = 0;
      for (let i = 0; i < (oct || 5); i++) {
        s += a * n2(x * f, y * f);
        f *= 2.03;
        a *= 0.5;
      }
      return s;
    }
    function ridge(x, y, oct) {
      let a = 0.5,
        f = 1,
        s = 0;
      for (let i = 0; i < (oct || 5); i++) {
        s += a * (1 - Math.abs(n2(x * f, y * f) * 1.6));
        f *= 2.1;
        a *= 0.5;
      }
      return s;
    }
    return { n2, fbm, ridge };
  }

  /* ===================== PRESETS ===================== */
  const SIZE_EXT = { small: 450, medium: 800, large: 1250, huge: 1800 };
  /* bld = building density, hmax = height of the core, hero = landmark kind for the place itself */
  const KIND = {
    city: { bld: 0.85, hmax: 1, hero: 'tower' },
    capital: { bld: 1, hmax: 1.7, hero: 'palace', plaza: true },
    town: { bld: 0.45, hmax: 0.3, hero: 'hall' },
    village: { bld: 0.2, hmax: 0.15, hero: 'house', trees: 0.45 },
    palace: { bld: 0.45, hmax: 0.5, hero: 'palace', garden: true },
    fortress: { bld: 0.35, hmax: 0.45, hero: 'citadel', walls: true },
    castle: { bld: 0.3, hmax: 0.25, hero: 'castle', walls: true },
    port: { bld: 0.7, hmax: 0.55, hero: 'dock', coast: 's' },
    spaceport: { bld: 0.35, hmax: 0.45, hero: 'pad', pads: true, traffic: true },
    station: { space: true, hero: 'station', traffic: true },
    habitat: { space: true, habitat: true, hero: 'ring', traffic: true },
    underground: { under: true, bld: 0.45, hmax: 0.22, hero: 'cave' },
    sietch: { under: true, bld: 0.07, hmax: 0.08, hero: 'cave', arch: 'desert', rockHouses: true },
    desert: { bld: 0, hmax: 0, dunes: true, hero: 'stones', rocks: 0.4 },
    ruins: { bld: 0, hmax: 0, ruins: 0.8, hero: 'ruin', rocks: 0.4 },
    battlefield: { bld: 0, hmax: 0, craters: 1, wrecks: 1, smoke: true, hero: 'wreck', ruins: 0.25 },
    wilds: { bld: 0, hmax: 0, trees: 0.5, rocks: 0.6, hero: 'stones' },
    forest: { bld: 0, hmax: 0, trees: 1.1, hero: 'tree' },
    mountain: { bld: 0.04, hmax: 0.1, peaks: true, rocks: 0.8, hero: 'peak' },
    ice: { bld: 0.05, hmax: 0.12, snow: true, icespires: true, hero: 'monolith' },
    sea: { water: true, bld: 0.25, hmax: 0.35, platform: true, hero: 'lighthouse' },
    temple: { bld: 0.25, hmax: 0.2, hero: 'temple', garden: true },
    monastery: { bld: 0.12, hmax: 0.18, hero: 'temple', peaks: true, trees: 0.3 },
    library: { bld: 0.5, hmax: 0.45, hero: 'library', plaza: true },
    arena: { bld: 0.55, hmax: 0.45, hero: 'arena' },
    camp: { bld: 0, hmax: 0, tents: true, hero: 'camp', rocks: 0.3 },
    crater: { bld: 0.05, hmax: 0.1, crater: true, hero: 'crater' },
    tombs: { bld: 0, hmax: 0, hero: 'tomb', rocks: 0.5, dunes: false },
    farm: { bld: 0.06, hmax: 0.08, fields: true, hero: 'farm', trees: 0.2 },
    dome: { bld: 0.4, hmax: 0.28, domes: true, hero: 'dome' },
    wreck: { bld: 0, hmax: 0, hero: 'wreck', craters: 0.4, rocks: 0.5 },
    industrial: { bld: 0.6, hmax: 0.45, hero: 'factory', arch: 'industrial', stacks: true },
  };
  /* architecture: body and roof colours, roof shapes, window share, height factor, block size */
  const ARCH = {
    classical: {
      stone: '#d9cfbb',
      roof: '#a4583c',
      tops: ['pitched', 'flat', 'dome', 'pitched'],
      win: 0.45,
      hmul: 0.55,
      cell: 26,
    },
    gothic: {
      stone: '#5b5752',
      roof: '#2c2a2f',
      tops: ['spire', 'pitched', 'spire', 'flat'],
      win: 0.7,
      hmul: 1.25,
      cell: 24,
      slim: true,
    },
    imperial: {
      stone: '#e6dec9',
      roof: '#c7a046',
      tops: ['flat', 'dome', 'spire', 'tier'],
      win: 0.8,
      hmul: 1.6,
      cell: 34,
    },
    modern: {
      stone: '#9aa7b4',
      roof: '#68727e',
      tops: ['flat', 'flat', 'slant', 'tier'],
      win: 1,
      hmul: 1.4,
      cell: 32,
      glass: true,
    },
    brutal: {
      stone: '#7f7c76',
      roof: '#5c5953',
      tops: ['flat', 'tier', 'flat'],
      win: 0.5,
      hmul: 1.05,
      cell: 38,
      wide: true,
    },
    organic: {
      stone: '#9db28c',
      roof: '#6c8c5c',
      tops: ['dome', 'round', 'dome'],
      win: 0.4,
      hmul: 0.65,
      cell: 28,
      round: true,
    },
    crystal: {
      stone: '#b9d5ee',
      roof: '#e3f1ff',
      tops: ['prism', 'spire', 'prism'],
      win: 0.6,
      hmul: 1.3,
      cell: 30,
      glow: true,
    },
    rustic: { stone: '#8b7052', roof: '#5b3b2b', tops: ['pitched'], win: 0.3, hmul: 0.25, cell: 18 },
    desert: { stone: '#d6bb8d', roof: '#c6a77b', tops: ['flat', 'flat', 'dome'], win: 0.3, hmul: 0.35, cell: 22 },
    alien: {
      stone: '#6c5c7c',
      roof: '#9c7cb2',
      tops: ['prism', 'round', 'spire'],
      win: 0.5,
      hmul: 1.1,
      cell: 30,
      round: true,
    },
    industrial: {
      stone: '#6f6b63',
      roof: '#4f4b45',
      tops: ['flat', 'tank', 'stack', 'flat'],
      win: 0.4,
      hmul: 0.7,
      cell: 34,
      wide: true,
    },
    eastern: { stone: '#cbbba2', roof: '#7c2f27', tops: ['pagoda', 'pitched'], win: 0.4, hmul: 0.4, cell: 22 },
    ancient: { stone: '#baa98a', roof: '#9b8b6b', tops: ['flat', 'step', 'flat'], win: 0.1, hmul: 0.4, cell: 26 },
  };
  /* time of day: sun elevation and azimuth, light, sky, windows, exposure */
  const TOD = {
    day: {
      el: 52,
      az: 35,
      sun: '#fff2e2',
      si: 2.7,
      hemi: 0.95,
      zen: '#2f64b4',
      hor: '#adcaec',
      gnd: '#7a6d5d',
      win: 0.04,
      lamps: 0,
      stars: 0,
      exp: 0.95,
    },
    dawn: {
      el: 7,
      az: -70,
      sun: '#ffb98a',
      si: 1.7,
      hemi: 0.55,
      zen: '#3d5590',
      hor: '#e8b394',
      gnd: '#4a3d36',
      win: 0.4,
      lamps: 0.35,
      stars: 0.15,
      exp: 1.12,
    },
    dusk: {
      el: 5,
      az: 110,
      sun: '#ff9a62',
      si: 1.5,
      hemi: 0.45,
      zen: '#28305e',
      hor: '#d98d6c',
      gnd: '#3b2f2c',
      win: 0.75,
      lamps: 0.7,
      stars: 0.3,
      exp: 1.18,
    },
    night: {
      el: 28,
      az: -140,
      sun: '#8ea4d6',
      si: 0.38,
      hemi: 0.16,
      zen: '#04060f',
      hor: '#121a2e',
      gnd: '#0b0d14',
      win: 1,
      lamps: 1,
      stars: 1,
      exp: 1.55,
    },
  };
  const TOD_ORDER = ['day', 'dusk', 'night', 'dawn'];
  const LM_KINDS =
    'tower spire skyscraper palace citadel castle keep wall gate arch bridge dome temple cathedral pyramid ziggurat obelisk statue monolith arena library hall house market plaza garden tree grove cave mine well crater lake dock pad ship wreck station ring tomb ruin camp tent farm lighthouse mast reactor factory beacon portal stones peak cliff throne shrine'.split(
      ' ',
    );

  /* ---------- guessing a place from its name and description when the pack gives no scene ---------- */
  const GUESS = [
    [/\bsietch\b/i, 'sietch'],
    [/\b(space ?station|orbital|habitat|station|ring station|the ring|platform in orbit)\b/i, 'station'],
    [/\b(spaceport|landing field|landing pad|starport|port of entry)\b/i, 'spaceport'],
    [/\b(shipyard|yards|foundry|forge|refinery|factory|factories|works|mill)\b/i, 'industrial'],
    [/\b(palace|residency)\b/i, 'palace'],
    [/\b(citadel|fortress|fort|stronghold|bastion|garrison)\b/i, 'fortress'],
    [/\b(castle|keep)\b/i, 'castle'],
    [/\b(library|archive|university|academy|school|college|institute)\b/i, 'library'],
    [/\b(temple|shrine|church|cathedral|monastery|abbey|sanctum|chapel|basilica)\b/i, 'temple'],
    [/\b(arena|colosseum|coliseum|stadium|amphitheat)/i, 'arena'],
    [/\b(tomb|tombs|grave|necropolis|crypt|mausoleum)\b/i, 'tombs'],
    [/\b(battle|battlefield|siege|front line|massacre)\b/i, 'battlefield'],
    [/\b(ruin|ruins|ruined|abandoned)\b/i, 'ruins'],
    [/\b(mine|mines|cavern|caves?|underground|tunnels?|warrens?|undercity|beneath)\b/i, 'underground'],
    [/\b(harbou?r|port|docks?|wharf|quay)\b/i, 'port'],
    [/\b(camp|encampment|outpost)\b/i, 'camp'],
    [/\b(crater)\b/i, 'crater'],
    [/\b(dome|domes)\b/i, 'dome'],
    [/\b(wreck|crash)/i, 'wreck'],
    [/\b(farm|farms|fields|plantation|ranch|orchard)\b/i, 'farm'],
    [/\b(forest|woods?|jungle|grove)\b/i, 'forest'],
    [/\b(mountains?|peak|range|pass|highlands|cliffs?|spire)\b/i, 'mountain'],
    [/\b(desert|dunes|waste|erg|sands)\b/i, 'desert'],
    [/\b(capital|imperial city|metropolis)\b/i, 'capital'],
    [/\b(city|hive)\b/i, 'city'],
    [/\b(village|hamlet)\b/i, 'village'],
    [/\b(town|settlement|colony)\b/i, 'town'],
  ];
  function guessKind(world, site) {
    const g = (world && world.gfx) || {};
    if (site.surface) {
      const T = {
        desert: 'desert',
        ice: 'ice',
        forest: 'forest',
        barren: 'crater',
        lava: 'crater',
        ocean: 'sea',
        archipelago: 'sea',
        gas: 'station',
        city: 'city',
        hive: 'city',
        dyson: 'station',
      };
      return T[g.type] || 'wilds';
    }
    const txt = (site.name || '') + ' ' + (site.desc || '');
    const nm = site.name || '';
    for (const [re, k] of GUESS) if (re.test(nm)) return k;
    if (g.type === 'gas') return 'station';
    if (site.sea) return 'sea';
    for (const [re, k] of GUESS) if (re.test(txt)) return k;
    if (g.type === 'city' || g.type === 'hive') return 'city';
    if (g.type === 'desert') return 'desert';
    if (g.type === 'ice') return 'ice';
    if (g.type === 'forest') return 'forest';
    if (g.type === 'barren' || g.type === 'lava') return 'crater';
    if (g.type === 'ocean' || g.type === 'archipelago') return 'port';
    return 'town';
  }
  function guessArch(kind, world, defaults) {
    if (defaults && defaults.arch) return defaults.arch;
    const t = ((world && world.gfx) || {}).type;
    if (KIND[kind] && KIND[kind].arch) return KIND[kind].arch;
    if (t === 'desert') return 'desert';
    if (kind === 'palace' || kind === 'capital') return 'imperial';
    if (kind === 'fortress') return 'brutal';
    if (kind === 'castle' || kind === 'village' || kind === 'farm') return 'rustic';
    if (kind === 'temple' || kind === 'library' || kind === 'arena') return 'classical';
    if (kind === 'station' || kind === 'habitat' || kind === 'spaceport' || kind === 'industrial') return 'industrial';
    if (kind === 'ruins' || kind === 'tombs') return 'ancient';
    if (t === 'city' || t === 'hive') return 'imperial';
    if (t === 'ice') return 'brutal';
    if (t === 'forest') return 'rustic';
    return 'modern';
  }
  function guessLandmarkKind(site, sceneKind) {
    /* the landmark's own name decides; otherwise the place's signature structure */
    const nm = site.name || '';
    const T = [
      [/\b(palace|residency|court)\b/i, 'palace'],
      [/\b(citadel|fortress|fort|stronghold)\b/i, 'citadel'],
      [/\b(castle|keep)\b/i, 'castle'],
      [/\b(cathedral|basilica)\b/i, 'cathedral'],
      [/\b(temple|shrine|chapel|church|monastery|abbey)\b/i, 'temple'],
      [/\b(library|archive|university|academy|school)\b/i, 'library'],
      [/\b(arena|colosseum|coliseum|stadium)\b/i, 'arena'],
      [/\b(tower|spire)s?\b/i, 'spire'],
      [/\b(tomb|tombs|grave|crypt|mausoleum)\b/i, 'tomb'],
      [/\b(mine|mines)\b/i, 'mine'],
      [/\b(cave|caves|cavern|sietch|tunnels?)\b/i, 'cave'],
      [/\b(dock|docks|harbou?r|port|wharf)\b/i, 'dock'],
      [/\b(spaceport|landing field|landing)\b/i, 'pad'],
      [/\b(station|habitat|orbital)\b/i, 'station'],
      [/\b(wreck|crash)/i, 'wreck'],
      [/\bruins?\b/i, 'ruin'],
      [/\bgate\b/i, 'gate'],
      [/\bbridge\b/i, 'bridge'],
      [/\bstatue\b/i, 'statue'],
      [/\b(monolith|obelisk)\b/i, 'monolith'],
      [/\bpyramid\b/i, 'pyramid'],
      [/\bdome\b/i, 'dome'],
      [/\bcamp\b/i, 'camp'],
      [/\btree\b/i, 'tree'],
      [/\b(forest|wood|woods|grove)\b/i, 'grove'],
      [/\bcrater\b/i, 'crater'],
      [/\b(lake|pool|pools)\b/i, 'lake'],
      [/\b(mountain|peak|mount)\b/i, 'peak'],
      [/\b(farm|fields?)\b/i, 'farm'],
      [/\b(factory|works|yards?|forge|foundry)\b/i, 'factory'],
      [/\b(market|bazaar)\b/i, 'market'],
      [/\b(garden|gardens|park)\b/i, 'garden'],
      [/\bwall\b/i, 'wall'],
    ];
    for (const [re, k] of T) if (re.test(nm)) return k;
    return (KIND[sceneKind] && KIND[sceneKind].hero) || 'tower';
  }

  /* ===================== CREATE ===================== */
  function create(env) {
    const THREE = env.THREE || window.THREE;
    const renderer = env.renderer;
    const SMALL = !!env.small,
      LOWMEM = !!env.lowMem;
    /* every colour that reaches a shader is linear (the renderer encodes to sRGB on output) */
    const CL = h => new THREE.Color(h).convertSRGBToLinear();
    const C = CL;
    const cam = new THREE.PerspectiveCamera(50, 1, 2, 120000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    let P = null; /* the current place */
    const _v = new THREE.Vector3(),
      _v2 = new THREE.Vector3();

    /* ---------- materials: buildings with procedural windows ---------- */
    function windowMaterial(col, opt) {
      opt = opt || {};
      const m = new THREE.MeshStandardMaterial({
        color: C(col),
        roughness: opt.rough == null ? 0.78 : opt.rough,
        metalness: opt.metal || 0.05,
        vertexColors: false,
      });
      const U = {
        uNight: P ? P.U.uNight : { value: 0 },
        uWin: { value: opt.win == null ? 0.7 : opt.win },
        uWinCol: { value: CL(opt.winCol || '#ffc27a') },
        uGlass: { value: CL(opt.glass || '#24313f') },
        uFloor: { value: opt.floor || 4.2 },
        uBase: { value: opt.base || 0 },
      };
      m.userData.U = U;
      m.extensions = { derivatives: true };
      m.onBeforeCompile = sh => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader =
          'varying vec3 vWP;varying vec3 vWN;\n' +
          sh.vertexShader.replace(
            '#include <project_vertex>',
            '#include <project_vertex>\n{vec4 pw=vec4(transformed,1.);vec3 nw=objectNormal;\n#ifdef USE_INSTANCING\npw=instanceMatrix*pw;nw=mat3(instanceMatrix)*nw;\n#endif\npw=modelMatrix*pw;vWP=pw.xyz;vWN=normalize(mat3(modelMatrix)*nw);}',
          );
        sh.fragmentShader =
          'varying vec3 vWP;varying vec3 vWN;uniform float uNight,uWin,uFloor,uBase;uniform vec3 uWinCol,uGlass;\n' +
          'float whash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}\n' +
          sh.fragmentShader
            .replace(
              '#include <color_fragment>',
              '#include <color_fragment>\nfloat wm=0.;float wfar=1.;vec3 wcell=vec3(0.);{vec3 N=normalize(vWN);if(abs(N.y)<.35&&vWP.y>uBase+2.){vec2 t=normalize(vec2(-N.z,N.x));float u=dot(vWP.xz,t)/2.9;float v=vWP.y/uFloor;\n' +
                'vec2 f=fract(vec2(u,v));vec2 fw=max(fwidth(vec2(u,v)),vec2(1e-4));vec2 a=smoothstep(vec2(.18),vec2(.18)+fw*1.5,f)*(1.-smoothstep(vec2(.78)-fw*1.5,vec2(.78),f));\n' +
                'float far=clamp(1.-max(fw.x,fw.y)*2.2,0.,1.);wfar=far;wm=mix(.45,a.x*a.y,far)*uWin;wcell=vec3(floor(u),floor(v),floor(dot(vWP.xz,N.xz)*.1));}\n' +
                'diffuseColor.rgb=mix(diffuseColor.rgb,uGlass,wm*.55);}',
            )
            .replace(
              '#include <emissivemap_fragment>',
              '#include <emissivemap_fragment>\n{float lit=step(.55-uNight*.25,whash(wcell))*(.6+.4*whash(wcell+3.1));lit=mix(.32+uNight*.2,lit,wfar);totalEmissiveRadiance+=uWinCol*wm*lit*uNight*1.6;}',
            );
      };
      m.customProgramCacheKey = () => 'atlasWin';
      return m;
    }
    const matCache = {};
    function mat(col, o) {
      const k = col + JSON.stringify(o || {});
      if (matCache[k]) return matCache[k];
      o = o || {};
      return (matCache[k] = new THREE.MeshStandardMaterial({
        color: C(col),
        roughness: o.rough == null ? 0.82 : o.rough,
        metalness: o.metal || 0,
        emissive: o.emis ? C(o.emis) : C('#000000'),
        emissiveIntensity: o.ei == null ? 1 : o.ei,
        transparent: !!o.op,
        opacity: o.op || 1,
        side: o.ds ? THREE.DoubleSide : THREE.FrontSide,
        flatShading: !!o.flat,
      }));
    }
    function glowMat(col, op) {
      return new THREE.MeshBasicMaterial({
        color: C(col),
        transparent: true,
        opacity: op == null ? 1 : op,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }
    function freeMats() {
      Object.keys(matCache).forEach(k => {
        matCache[k].dispose();
        delete matCache[k];
      });
    }
    const dotTex = (() => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 64;
      const g = cv.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.3, 'rgba(255,255,255,.7)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(cv);
    })();
    const puffTex = (() => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 64;
      const g = cv.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,.9)');
      gr.addColorStop(0.55, 'rgba(255,255,255,.4)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(cv);
    })();
    function sprite(col, scale, op, additive) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: dotTex,
          color: C(col),
          transparent: true,
          opacity: op == null ? 1 : op,
          depthWrite: false,
          blending: additive === false ? THREE.NormalBlending : THREE.AdditiveBlending,
        }),
      );
      s.scale.set(scale, scale, 1);
      return s;
    }

    /* ---------- particle pools (sparks, flames, smoke, weather) ---------- */
    function Particles(n, o) {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3),
        col = new Float32Array(n * 3),
        sz = new Float32Array(n);
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setAttribute('size', new THREE.BufferAttribute(sz, 1));
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: o.puff ? puffTex : dotTex },
          uScale: { value: 600 },
          uOp: { value: o.op == null ? 1 : o.op },
          uMax: { value: o.max || 220 },
        },
        vertexShader:
          'attribute float size;varying vec3 vC;uniform float uScale,uMax;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=min(size*uScale/max(1.,-mv.z),uMax);gl_Position=projectionMatrix*mv;}',
        fragmentShader:
          'uniform sampler2D uMap;uniform float uOp;varying vec3 vC;void main(){vec4 t=texture2D(uMap,gl_PointCoord);gl_FragColor=vec4(vC,t.a*uOp);}',
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: o.normal ? THREE.NormalBlending : THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      const L = [];
      for (let i = 0; i < n; i++)
        L.push({
          p: new THREE.Vector3(),
          v: new THREE.Vector3(),
          life: 0,
          max: 1,
          s0: 1,
          s1: 1,
          c: new THREE.Color(),
          dead: true,
        });
      let next = 0;
      return {
        obj: pts,
        emit(p, v, life, s0, s1, c) {
          const q = L[next];
          next = (next + 1) % n;
          q.p.copy(p);
          q.v.copy(v);
          q.life = 0;
          q.max = life;
          q.s0 = s0;
          q.s1 = s1 == null ? s0 : s1;
          q.c.copy(c);
          q.dead = false;
        },
        update(dt, grav, drag) {
          let alive = 0;
          for (let i = 0; i < n; i++) {
            const q = L[i];
            if (q.dead) {
              sz[i] = 0;
              continue;
            }
            q.life += dt;
            if (q.life >= q.max) {
              q.dead = true;
              sz[i] = 0;
              continue;
            }
            alive++;
            q.v.y -= (grav || 0) * dt;
            if (drag) q.v.multiplyScalar(Math.pow(drag, dt));
            q.p.addScaledVector(q.v, dt);
            const k = q.life / q.max;
            pos[i * 3] = q.p.x;
            pos[i * 3 + 1] = q.p.y;
            pos[i * 3 + 2] = q.p.z;
            const f = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
            col[i * 3] = q.c.r * f;
            col[i * 3 + 1] = q.c.g * f;
            col[i * 3 + 2] = q.c.b * f;
            sz[i] = lerp(q.s0, q.s1, k);
          }
          g.attributes.position.needsUpdate = g.attributes.color.needsUpdate = g.attributes.size.needsUpdate = true;
          return alive;
        },
        dispose() {
          g.dispose();
          m.dispose();
        },
        mat: m,
      };
    }

    /* ===================== BUILD A PLACE ===================== */
    function resolveScene(world, site, opts) {
      const sc = Object.assign({}, site.scene || {});
      const D = (opts && opts.defaults) || {};
      sc.kind = KIND[sc.kind] ? sc.kind : guessKind(world, site);
      const K0 = KIND[sc.kind];
      sc.arch = ARCH[sc.arch] ? sc.arch : guessArch(sc.kind, world, D);
      sc.size = SIZE_EXT[sc.size]
        ? sc.size
        : D.size ||
          (sc.kind === 'capital' ? 'large' : sc.kind === 'village' || sc.kind === 'camp' ? 'small' : 'medium');
      sc.tod = TOD[sc.tod] ? sc.tod : D.tod || 'day';
      sc.space = sc.space != null ? !!sc.space : !!K0.space;
      sc.under = sc.under != null ? !!sc.under : !!K0.under;
      sc.coast = sc.coast || K0.coast || null;
      sc.water = sc.water != null ? !!sc.water : !!K0.water;
      sc.walls = sc.walls != null ? !!sc.walls : !!K0.walls;
      const tr = sc.traffic != null ? sc.traffic : D.traffic;
      sc.traffic =
        tr != null
          ? !!tr
          : !!K0.traffic || ['modern', 'imperial', 'crystal', 'alien', 'industrial', 'brutal'].includes(sc.arch);
      if (sc.under || (sc.space && !sc.weather)) sc.weather = 'clear';
      return sc;
    }

    /* the heightfield of the place, in scene units */
    function makeTerrain(Pl) {
      const { N, ext, sc, gtype } = Pl;
      const K0 = KIND[sc.kind];
      const amp = gtype === 'barren' || gtype === 'ice' ? 140 : 90;
      const peaks = K0.peaks || sc.kind === 'mountain';
      const dunes = K0.dunes || (gtype === 'desert' && sc.kind !== 'city' && sc.kind !== 'capital');
      const flatR = ext * (sc.kind === 'camp' || sc.kind === 'tombs' || sc.kind === 'battlefield' ? 0.6 : 1.05);
      const coast = sc.coast;
      const riverOn = !!sc.river;
      const lakeAt = [];
      Pl.lms.forEach(l => {
        if (l.kind === 'lake') lakeAt.push([l.x, l.z, Pl.u * 4 * l.h]);
      });
      return function H(x, z) {
        const r = Math.hypot(x, z);
        const s = 1 / (ext * 1.4);
        let h = N.fbm(x * s, z * s, 5) * amp;
        if (peaks)
          h +=
            Math.pow(Math.max(0, N.ridge(x * s * 0.6 + 7, z * s * 0.6, 5) - 0.35), 1.6) *
            ext *
            1.3 *
            clamp((r - ext * 0.5) / ext, 0, 1);
        else
          h +=
            Math.pow(Math.max(0, N.ridge(x * s * 0.5 + 3, z * s * 0.5 - 2, 4) - 0.55), 2) *
            ext *
            0.9 *
            clamp((r - ext * 1.6) / ext, 0, 1);
        if (dunes)
          h +=
            (Math.sin(x * 0.012 + N.n2(x * 0.002, z * 0.002) * 4) * 0.5 + 0.5) * 22 +
            N.fbm(x * 0.004, z * 0.004, 3) * 30;
        /* dry land stays above the waterline; only coasts, rivers, lakes and open water go below it */
        if (h < 3) h = 3 - (3 - h) * 0.008;
        /* the built-up area is levelled */
        const flat = clamp((r - flatR) / (ext * 0.6), 0, 1);
        h = lerp(6, h, flat * flat * (3 - 2 * flat));
        if (sc.kind === 'crater' || K0.crater) {
          const cr = ext * 1.5;
          const k = r / cr;
          h +=
            k < 1
              ? -ext * 0.18 * (1 - k * k) + Math.exp(-Math.pow((k - 0.98) / 0.08, 2)) * ext * 0.12
              : Math.exp(-Math.pow((k - 1) / 0.1, 2)) * ext * 0.12;
        }
        if (coast) {
          const d = coast === 's' ? z : coast === 'n' ? -z : coast === 'e' ? x : -x;
          const edge = ext * 0.75 + N.fbm(x * 0.002 + 5, z * 0.002, 3) * ext * 0.35;
          if (d > edge - ext * 0.4) h = lerp(h, -40, clamp((d - edge + ext * 0.4) / (ext * 0.4), 0, 1));
        }
        if (sc.water) {
          let isl = 0;
          Pl.lms.forEach(l => {
            isl = Math.max(isl, 1 - Math.hypot(x - l.x, z - l.z) / (Pl.u * 3.2 * Math.max(0.8, l.h)));
          });
          isl = Math.max(isl, 1 - r / (ext * (K0.platform ? 0.45 : 0.3)));
          h = lerp(-60, 8, clamp(isl * 2, 0, 1)) + N.fbm(x * 0.004, z * 0.004) * 10;
        }
        if (riverOn) {
          const cx = Math.sin(z * 0.0025) * ext * 0.18 + N.n2(z * 0.001, 3) * ext * 0.12;
          const d = Math.abs(x - cx);
          const w = Pl.u * 1.4;
          if (d < w * 2.4) h = lerp(-14, h, clamp((d - w) / (w * 1.4), 0, 1));
        }
        lakeAt.forEach(([lx, lz, lr]) => {
          const d = Math.hypot(x - lx, z - lz);
          if (d < lr * 1.4) h = lerp(-16, h, clamp((d - lr) / (lr * 0.4), 0, 1));
        });
        return h;
      };
    }

    function terrainColors(Pl) {
      const pal = Pl.pal;
      const ground = C(pal.ground),
        g2 = C(pal.ground2),
        hi = C(pal.high),
        peak = C(pal.peak),
        pave = C(pal.pave),
        sand = C(pal.shore),
        snow = C('#eef3f8');
      const tmp = new THREE.Color();
      return (x, z, h, slope) => {
        const r = Math.hypot(x, z);
        const n = Pl.N.fbm(x * 0.003 + 11, z * 0.003, 3) * 0.5 + 0.5;
        tmp.copy(ground).lerp(g2, clamp(n * 1.3 - 0.15, 0, 1));
        const hk = clamp((h - 120) / 520, 0, 1);
        tmp.lerp(hi, hk);
        tmp.lerp(peak, clamp((h - 520) / 700, 0, 1));
        if (slope > 0.55) tmp.lerp(hi, clamp((slope - 0.55) * 2, 0, 0.7));
        if (Pl.snow) tmp.lerp(snow, clamp(0.55 + n * 0.5 - slope * 0.6, 0, 1));
        else if (h > 900) tmp.lerp(snow, clamp((h - 900) / 400, 0, 0.9));
        if (h < 1.6 && h > -6) tmp.lerp(sand, 0.7);
        const pk = Pl.paveR > 0 ? 1 - clamp((r - Pl.paveR) / (Pl.ext * 0.25), 0, 1) : 0;
        if (pk > 0) tmp.lerp(pave, pk * (0.55 + n * 0.35));
        tmp.multiplyScalar(0.86 + Pl.N.n2(x * 0.03, z * 0.03) * 0.16);
        return tmp;
      };
    }

    /* fine grit over the ground: tiled noise, multiplied with the vertex colours */
    function detailTex(Pl) {
      const n = 256,
        cv = document.createElement('canvas');
      cv.width = cv.height = n;
      const cx = cv.getContext('2d'),
        img = cx.createImageData(n, n);
      const N2 = makeNoise(7);
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
          const a = (x / n) * TAU,
            b = (y / n) * TAU;
          /* periodic: sample the noise on a torus so the tile repeats seamlessly */
          const v =
            N2.fbm(Math.cos(a) * 2 + 9, Math.sin(a) * 2 + Math.cos(b) * 2.3, 4) * 0.6 +
            N2.n2(Math.sin(b) * 9 + Math.cos(a) * 3, Math.cos(b) * 9) * 0.25;
          const k = clamp(0.86 + v * 0.32, 0.62, 1) * 255;
          const o = (y * n + x) * 4;
          img.data[o] = img.data[o + 1] = img.data[o + 2] = k;
          img.data[o + 3] = 255;
        }
      cx.putImageData(img, 0, 0);
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(70, 70);
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      Pl.mats.push(t);
      return t;
    }

    function buildGround(Pl) {
      const { ext, H } = Pl;
      const size = ext * 9,
        seg = SMALL ? 200 : 300;
      const g = new THREE.PlaneGeometry(size, size, seg, seg).rotateX(-Math.PI / 2);
      const p = g.attributes.position;
      const col = new Float32Array(p.count * 3);
      const colf = terrainColors(Pl);
      const step = size / seg;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i),
          z = p.getZ(i);
        /* distant ground is pushed into a gentle bowl so the horizon stays below eye level */
        const h = H(x, z);
        p.setY(i, h);
        const sl = Math.min(1, (Math.abs(H(x + step, z) - h) + Math.abs(H(x, z + step) - h)) / step);
        const c = colf(x, z, h, sl);
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.computeVertexNormals();
      const m = new THREE.Mesh(
        g,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, map: detailTex(Pl) }),
      );
      m.receiveShadow = true;
      Pl.root.add(m);
      Pl.ground = m;
      /* a far ring so the land runs to the horizon */
      const far = new THREE.Mesh(
        new THREE.RingGeometry(size * 0.45, size * 6, 64, 1).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: C(Pl.pal.ground2).lerp(C(Pl.pal.high), 0.3), roughness: 1 }),
      );
      far.position.y = Pl.sc.water || Pl.sc.coast ? -30 : H(size * 0.45, 0) - 10;
      Pl.root.add(far);
    }

    function buildWater(Pl) {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uDeep: { value: CL(Pl.pal.deep) },
          uShal: { value: CL(Pl.pal.water) },
          uSky: Pl.U.uHor,
          uSun: Pl.U.uSunDir,
          uSunC: Pl.U.uSunCol,
          uT: Pl.U.uTime,
          uCam: { value: cam.position },
          fogColor: { value: new THREE.Color() },
          fogDensity: { value: 0 },
        },
        vertexShader:
          'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
        fragmentShader:
          'uniform vec3 uDeep,uShal,uSky,uSun,uSunC,uCam;uniform float uT;varying vec3 vW;uniform vec3 fogColor;uniform float fogDensity;\n' +
          'float w(vec2 p){return sin(p.x*.021+uT*.9)*.5+sin(p.y*.017-uT*.7)*.5+sin((p.x+p.y)*.031+uT*1.3)*.3+sin((p.x-p.y)*.047-uT*1.7)*.2;}\n' +
          'void main(){vec2 p=vW.xz;float e=.6;vec3 N=normalize(vec3(w(p+vec2(e,0.))-w(p-vec2(e,0.)),6.,w(p+vec2(0.,e))-w(p-vec2(0.,e))));\n' +
          'vec3 V=normalize(uCam-vW);float fr=pow(1.-max(dot(N,V),0.),4.)*.85+.06;vec3 R=reflect(-V,N);float sp=pow(max(dot(R,normalize(uSun)),0.),220.)*2.5;\n' +
          'vec3 c=mix(mix(uDeep,uShal,.35),uSky,fr)+uSunC*sp;float d=length(uCam-vW);float f=1.-exp(-fogDensity*fogDensity*d*d);c=mix(c,fogColor,f);\n' +
          'gl_FragColor=vec4(c,.92);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}',
        transparent: true,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(Pl.ext * 60, Pl.ext * 60, 1, 1).rotateX(-Math.PI / 2), m);
      plane.position.y = 0;
      plane.renderOrder = 1;
      Pl.root.add(plane);
      Pl.water = plane;
    }

    /* sky dome: gradient, sun, stars, haze; bodies in the sky */
    function buildSky(Pl) {
      const U = Pl.U;
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uZen: U.uZen,
          uHor: U.uHor,
          uGnd: U.uGnd,
          uSunDir: U.uSunDir,
          uSunCol: U.uSunCol,
          uStars: U.uStars,
          uSunSize: { value: Pl.sunSize },
        },
        vertexShader:
          'varying vec3 vD;void main(){vD=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}',
        fragmentShader:
          'uniform vec3 uZen,uHor,uGnd,uSunDir,uSunCol;uniform float uStars,uSunSize;varying vec3 vD;\n' +
          'void main(){vec3 d=normalize(vD);float y=d.y;vec3 c=mix(uHor,uZen,pow(clamp(y,0.,1.),.5));if(y<0.)c=mix(uHor,uGnd,clamp(-y*4.,0.,1.));\n' +
          'float s=max(dot(d,normalize(uSunDir)),0.);c+=uSunCol*(pow(s,6.)*.18+pow(s,90.)*.5);c+=uSunCol*smoothstep(1.-uSunSize*1.2e-4,1.-uSunSize*.9e-4,s)*6.;\n' +
          'vec3 q=floor(d*520.);float h=fract(sin(dot(q,vec3(12.9898,78.233,45.164)))*43758.5453);c+=vec3(.9,.95,1.)*smoothstep(.9972,1.,h)*uStars*clamp(y*5.+.2,0.,1.)*1.6;\n' +
          'gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}',
        side: THREE.BackSide,
        depthWrite: false,
      });
      const sky = new THREE.Mesh(new THREE.SphereGeometry(50000, 48, 24), m);
      sky.renderOrder = -10;
      sky.frustumCulled = false;
      Pl.root.add(sky);
      Pl.sky = sky;
      const S = Pl.sc.sky || {};
      const add = (col, size, dir, rings) => {
        const g = new THREE.Group();
        const pm = new THREE.MeshStandardMaterial({
          color: C(col),
          roughness: 1,
          emissive: C(col),
          emissiveIntensity: 0.06,
        });
        const b = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), pm);
        g.add(b);
        if (rings) {
          const rg = new THREE.Mesh(
            new THREE.RingGeometry(1.4, 2.3, 96),
            new THREE.MeshBasicMaterial({
              color: C(col).lerp(C('#ffffff'), 0.4),
              transparent: true,
              opacity: 0.55,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          rg.rotation.x = Math.PI / 2 - 0.35;
          g.add(rg);
        }
        g.scale.setScalar(size);
        g.position.copy(dir).multiplyScalar(30000);
        g.lookAt(0, 0, 0);
        Pl.root.add(g);
        Pl.skyBodies.push(g);
      };
      const R = rng(hashStr(Pl.site.id + 'sky'));
      if (S.planet && !Pl.sc.space) {
        const pc = typeof S.planet === 'string' ? S.planet : S.planet.c || '#c9b08a';
        const ps = (typeof S.planet === 'object' && S.planet.size) || 1;
        add(pc, 2600 * ps, new THREE.Vector3(-0.5, 0.42, -0.75).normalize(), !!S.rings);
      }
      for (let i = 0; i < (S.moons | 0); i++)
        add(
          i % 2 ? '#c9c3b8' : '#a9b0bc',
          380 + R() * 420,
          new THREE.Vector3(R() * 2 - 1, 0.25 + R() * 0.5, R() * 2 - 1).normalize(),
          false,
        );
    }

    function lighting(Pl) {
      const sun = new THREE.DirectionalLight(0xffffff, 2.5);
      sun.castShadow = !LOWMEM;
      const SM = SMALL || LOWMEM ? 1024 : 2048;
      sun.shadow.mapSize.set(SM, SM);
      const e = Pl.ext * 1.6;
      Object.assign(sun.shadow.camera, { left: -e, right: e, top: e, bottom: -e, near: 10, far: Pl.ext * 12 });
      sun.shadow.bias = -0.0006;
      sun.shadow.normalBias = 1.2;
      const hemi = new THREE.HemisphereLight(0xbcd4ff, 0x6a5a48, 0.9);
      Pl.root.add(sun, sun.target, hemi);
      Pl.sun = sun;
      Pl.hemi = hemi;
    }

    /* ---------- time of day ---------- */
    function todState(Pl, key) {
      const T0 = TOD[key];
      const atmo = C(Pl.atmo);
      const star = C(Pl.star);
      const zen = C(T0.zen).lerp(atmo.clone().multiplyScalar(key === 'night' ? 0.15 : 0.6), Pl.atmoK * 0.35);
      const hor = C(T0.hor).lerp(atmo, Pl.atmoK * (key === 'day' ? 0.3 : 0.08));
      const sunc = C(T0.sun).lerp(star, key === 'night' ? 0 : 0.45);
      if (Pl.sc.space) {
        zen.set('#000000');
        hor.set('#02030a');
      }
      if (Pl.sc.under) {
        zen.set('#0b0806');
        hor.set('#17110c');
      }
      const el = (T0.el * Math.PI) / 180,
        az = ((T0.az + Pl.azOff) * Math.PI) / 180;
      return {
        zen,
        hor,
        gnd: C(T0.gnd),
        sunc,
        dir: new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)),
        si: Pl.sc.under ? 0 : T0.si,
        hemi: Pl.sc.under ? 0.35 : T0.hemi,
        win: Pl.sc.under ? 1 : T0.win,
        lamps: Pl.sc.under ? 1 : T0.lamps,
        stars: Pl.sc.space ? 1 : Pl.sc.under ? 0 : T0.stars,
        exp: Pl.sc.space ? 1.05 : Pl.sc.under ? 1.4 : T0.exp,
      };
    }
    function applyTod(Pl, a, b, k) {
      const U = Pl.U;
      const mixC = (x, y) => x.clone().lerp(y, k);
      const zen = mixC(a.zen, b.zen),
        hor = mixC(a.hor, b.hor),
        gnd = mixC(a.gnd, b.gnd),
        sc = mixC(a.sunc, b.sunc);
      U.uZen.value.copy(zen);
      U.uHor.value.copy(hor);
      U.uGnd.value.copy(gnd);
      U.uSunCol.value.copy(sc);
      const dir = a.dir.clone().lerp(b.dir, k).normalize();
      U.uSunDir.value.copy(dir);
      U.uStars.value = lerp(a.stars, b.stars, k);
      U.uNight.value = lerp(a.win, b.win, k);
      Pl.lampK = lerp(a.lamps, b.lamps, k);
      Pl.sun.color.copy(sc);
      Pl.sun.intensity = lerp(a.si, b.si, k);
      Pl.sun.position.copy(dir).multiplyScalar(Pl.ext * 5);
      Pl.hemi.intensity = lerp(a.hemi, b.hemi, k);
      Pl.hemi.color.copy(zen).lerp(C('#ffffff'), 0.5);
      Pl.hemi.groundColor.copy(gnd);
      Pl.fog.color.copy(U.uHor.value);
      Pl.exp = lerp(a.exp, b.exp, k);
      if (Pl.water) {
        Pl.water.material.uniforms.fogColor.value.copy(Pl.fog.color);
        Pl.water.material.uniforms.fogDensity.value = Pl.fog.density;
      }
      if (Pl.lampPts) Pl.lampPts.mat.uniforms.uOp.value = Pl.lampK;
      if (Pl.trafficLights) Pl.trafficLights.material.opacity = 0.35 + Pl.lampK * 0.65;
    }
    function setTod(key, instant) {
      if (!P || !TOD[key]) return;
      const from = P.todNow || todState(P, key);
      const to = todState(P, key);
      P.tod = key;
      P.todTw = instant ? null : { from, to, t0: performance.now(), dur: 1400 };
      if (instant) applyTod(P, to, to, 1);
      P.todNow = to;
    }

    /* ---------- the city: buildings on a jittered grid, roofs by style ---------- */
    function buildCity(Pl) {
      const { sc, ext, H, R } = Pl;
      const K0 = KIND[sc.kind],
        A = ARCH[sc.arch];
      const bld = (K0.bld || 0) * (sc.density == null ? 1 : sc.density);
      if (bld <= 0) return;
      const hmax = (K0.hmax || 0.3) * (sc.height == null ? 1 : sc.height);
      const cell = A.cell * (sc.size === 'small' ? 0.85 : 1);
      const rot = R() * Math.PI;
      const cr = Math.cos(rot),
        sr = Math.sin(rot);
      /* the built-up area grows with density; inside it blocks are nearly solid, thinning at the edge */
      const lim = ext * (sc.under ? 0.8 : 0.36 + 0.64 * Math.min(1, bld));
      const fill0 = (0.62 + 0.34 * Math.min(1, bld)) * (SMALL ? 0.72 : 1);
      const body = [],
        tops = {};
      const avoid = Pl.avoid;
      const stone = K0.rockHouses ? C(Pl.pal.high).multiplyScalar(0.7) : C(Pl.pal.stone),
        roofC = C(Pl.pal.roof);
      const tmpC = new THREE.Color();
      for (let gx = -lim; gx <= lim; gx += cell) {
        for (let gz = -lim; gz <= lim; gz += cell) {
          if (Math.abs(gx) < cell * 0.7 || Math.abs(gz) < cell * 0.7) continue; /* boulevards to the centre */
          if ((Math.round(gx / cell) % 4 === 0 || Math.round(gz / cell) % 4 === 0) && R() < 0.9) continue; /* streets */
          const jx = gx + (R() - 0.5) * cell * 0.25,
            jz = gz + (R() - 0.5) * cell * 0.25;
          const x = jx * cr - jz * sr,
            z = jx * sr + jz * cr;
          const r = Math.hypot(x, z) / lim;
          const edge = r + Pl.N.n2(x * 0.004, z * 0.004) * 0.18;
          if (edge > 1) continue;
          if (R() > fill0 * (edge < 0.55 ? 1 : 1 - ((edge - 0.55) / 0.45) * 0.85)) continue;
          if (avoid.some(a => Math.hypot(x - a.x, z - a.z) < a.r)) continue;
          const y = H(x, z);
          if (y < 2 && !sc.under) continue;
          const core = Math.pow(Math.max(0, 1 - r), 2.2);
          let h = 6 + R() * 10 + Math.pow(R(), 2) * 26 * A.hmul + core * 300 * hmax * A.hmul * Math.pow(R(), 1.6);
          if (sc.under) h = Math.min(h, 40);
          const fw = cell * (A.wide ? 0.88 : A.slim ? 0.6 : 0.78) * (0.8 + R() * 0.2);
          const fd = cell * (A.wide ? 0.88 : A.slim ? 0.66 : 0.78) * (0.8 + R() * 0.2);
          const tint = tmpC.copy(stone).multiplyScalar(0.78 + R() * 0.32);
          if (sc.arch === 'rustic' || sc.arch === 'desert') tint.lerp(roofC, R() * 0.18);
          body.push({ x, y: y - 2, z, w: fw, h: h + 2, d: fd, ry: rot + (A.round ? R() * TAU : 0), c: tint.clone() });
          if (!A.round && h < 160 && R() < 0.55) {
            /* a lower wing beside the main block */
            const sx = (R() < 0.5 ? -1 : 1) * fw * 0.32,
              sz = (R() < 0.5 ? -1 : 1) * fd * 0.32;
            const ax = x + sx * cr - sz * sr,
              az = z + sx * sr + sz * cr;
            body.push({
              x: ax,
              y: y - 2,
              z: az,
              w: fw * 0.56,
              h: h * (0.35 + R() * 0.3) + 2,
              d: fd * 0.56,
              ry: rot,
              c: tint.clone().multiplyScalar(0.92),
            });
          }
          let top = A.tops[(R() * A.tops.length) | 0];
          if (h > 140 && top === 'pitched') top = 'spire';
          if (!tops[top]) tops[top] = [];
          tops[top].push({ x, y: y + h, z, w: fw, h, d: fd, ry: rot });
        }
      }
      Pl.stats.buildings = body.length;
      if (!body.length) return;
      cityPlan(Pl, lim, cell, rot);
      /* bodies */
      const bmat = windowMaterial('#ffffff', {
        win: A.win,
        glass: A.glass ? '#2a4256' : '#1b1a1e',
        winCol: Pl.pal.light,
        floor: sc.arch === 'rustic' || sc.arch === 'desert' ? 3.6 : 4.2,
      });
      Pl.mats.push(bmat);
      const geo = A.round
        ? new THREE.CylinderGeometry(0.5, 0.5, 1, 14, 1).translate(0, 0.5, 0)
        : new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
      const im = new THREE.InstancedMesh(geo, bmat, body.length);
      const M = new THREE.Matrix4(),
        Q = new THREE.Quaternion(),
        Sv = new THREE.Vector3(),
        Pv = new THREE.Vector3(),
        E = new THREE.Euler();
      body.forEach((b, i) => {
        Q.setFromEuler(E.set(0, b.ry, 0));
        M.compose(Pv.set(b.x, b.y, b.z), Q, Sv.set(b.w, b.h, b.d));
        im.setMatrixAt(i, M);
        im.setColorAt(i, b.c);
      });
      im.castShadow = im.receiveShadow = true;
      Pl.root.add(im);
      /* roofs */
      const roofMat = mat(Pl.pal.roof, { rough: 0.7, metal: sc.arch === 'imperial' ? 0.5 : 0.05 });
      const TOPG = {
        pitched: () => new THREE.ConeGeometry(0.72, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0),
        spire: () => new THREE.ConeGeometry(0.5, 1, 8, 1).translate(0, 0.5, 0),
        dome: () => new THREE.SphereGeometry(0.5, 16, 8, 0, TAU, 0, Math.PI / 2),
        round: () => new THREE.SphereGeometry(0.5, 14, 8, 0, TAU, 0, Math.PI / 2),
        tier: () => new THREE.BoxGeometry(0.6, 1, 0.6).translate(0, 0.5, 0),
        slant: () => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
        prism: () => new THREE.OctahedronGeometry(0.5, 0).scale(1, 2.2, 1),
        tank: () => new THREE.CylinderGeometry(0.4, 0.4, 1, 14).translate(0, 0.5, 0),
        stack: () => new THREE.CylinderGeometry(0.09, 0.12, 1, 8).translate(0, 0.5, 0),
        step: () => new THREE.BoxGeometry(0.7, 1, 0.7).translate(0, 0.5, 0),
        pagoda: () => new THREE.ConeGeometry(0.85, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0),
      };
      const TOPS = {
        pitched: t => [t.w, Math.min(t.w, t.d) * 0.55, t.d],
        spire: t => [Math.min(t.w, t.d) * 0.7, Math.max(12, t.h * 0.35), Math.min(t.w, t.d) * 0.7],
        dome: t => [Math.min(t.w, t.d) * 0.9, Math.min(t.w, t.d) * 0.9, Math.min(t.w, t.d) * 0.9],
        round: t => [t.w, Math.min(t.w, t.d) * 0.7, t.d],
        tier: t => [t.w, t.h * 0.25, t.d],
        slant: t => [t.w * 0.4, t.h * 0.12, t.d * 0.4],
        prism: t => [Math.min(t.w, t.d) * 0.8, Math.min(t.w, t.d) * 0.6, Math.min(t.w, t.d) * 0.8],
        tank: t => [Math.min(t.w, t.d) * 0.8, Math.min(t.w, t.d) * 0.5, Math.min(t.w, t.d) * 0.8],
        stack: t => [t.w, 30 + t.h * 0.6, t.d],
        step: t => [t.w, t.h * 0.3, t.d],
        pagoda: t => [t.w * 1.15, Math.min(t.w, t.d) * 0.45, t.d * 1.15],
        flat: null,
      };
      Object.keys(tops).forEach(k => {
        if (!TOPS[k]) return;
        const L = tops[k];
        const g = TOPG[k]();
        const m =
          k === 'tier' || k === 'slant' || k === 'step'
            ? bmat
            : k === 'prism' && sc.arch === 'crystal'
              ? mat('#cfe6ff', { emis: '#3a6a9a', ei: 0.6, rough: 0.2, metal: 0.3 })
              : roofMat;
        const im2 = new THREE.InstancedMesh(g, m, L.length);
        L.forEach((t, i) => {
          const s = TOPS[k](t);
          Q.setFromEuler(E.set(0, t.ry, 0));
          M.compose(Pv.set(t.x, t.y, t.z), Q, Sv.set(s[0], s[1], s[2]));
          im2.setMatrixAt(i, M);
          if (m === bmat) im2.setColorAt(i, stone);
        });
        im2.castShadow = true;
        im2.receiveShadow = true;
        Pl.root.add(im2);
      });
      /* street lamps: warm points along the blocks, bright at night */
      const nl = Math.min(SMALL ? 900 : 2600, body.length * 2);
      const lp = Particles(nl, {});
      lp.mat.uniforms.uScale.value = 900;
      const lc = C(Pl.pal.light);
      for (let i = 0; i < nl; i++) {
        const b = body[(R() * body.length) | 0];
        const a = R() * TAU;
        _v.set(b.x + Math.cos(a) * b.w * 0.75, b.y + 6, b.z + Math.sin(a) * b.d * 0.75);
        lp.emit(_v, _v2.set(0, 0, 0), 1e9, 5 + R() * 4, null, lc);
      }
      lp.update(0.001);
      const la = lp.obj.geometry.attributes.color;
      for (let i = 0; i < nl; i++) la.setXYZ(i, lc.r, lc.g, lc.b);
      la.needsUpdate = true;
      Pl.root.add(lp.obj);
      Pl.lampPts = lp;
    }

    /* the street plan: paving, a street grid at the block rotation, boulevards and squares at the landmarks */
    function cityPlan(Pl, lim, cell, rot) {
      const n = SMALL ? 1024 : 2048,
        span = lim * 2.3;
      const cv = document.createElement('canvas');
      cv.width = cv.height = n;
      const cx = cv.getContext('2d');
      const k = n / span;
      cx.translate(n / 2, n / 2);
      const pave = new THREE.Color(Pl.pal.pave),
        road = pave.clone().multiplyScalar(0.62),
        sq = pave.clone().lerp(new THREE.Color('#ffffff'), 0.18);
      const rg = cx.createRadialGradient(0, 0, lim * k * 0.6, 0, 0, lim * k * 1.12);
      rg.addColorStop(
        0,
        'rgba(' + ((pave.r * 255) | 0) + ',' + ((pave.g * 255) | 0) + ',' + ((pave.b * 255) | 0) + ',0.8)',
      );
      rg.addColorStop(
        1,
        'rgba(' + ((pave.r * 255) | 0) + ',' + ((pave.g * 255) | 0) + ',' + ((pave.b * 255) | 0) + ',0)',
      );
      cx.fillStyle = rg;
      cx.beginPath();
      cx.arc(0, 0, lim * k * 1.12, 0, TAU);
      cx.fill();
      cx.save();
      cx.rotate(rot);
      cx.strokeStyle = road.getStyle();
      for (let gx = -lim * 1.1; gx <= lim * 1.1; gx += cell) {
        const st = Math.round(gx / cell) % 4 === 0;
        cx.lineWidth = (st ? cell * 0.55 : cell * 0.16) * k;
        cx.globalAlpha = st ? 0.85 : 0.45;
        cx.beginPath();
        cx.moveTo(gx * k, -lim * 1.1 * k);
        cx.lineTo(gx * k, lim * 1.1 * k);
        cx.moveTo(-lim * 1.1 * k, gx * k);
        cx.lineTo(lim * 1.1 * k, gx * k);
        cx.stroke();
      }
      cx.globalAlpha = 0.9;
      cx.lineWidth = cell * 1.3 * k;
      cx.beginPath();
      cx.moveTo(0, -lim * 1.15 * k);
      cx.lineTo(0, lim * 1.15 * k);
      cx.moveTo(-lim * 1.15 * k, 0);
      cx.lineTo(lim * 1.15 * k, 0);
      cx.stroke();
      cx.restore();
      cx.globalAlpha = 0.85;
      cx.fillStyle = sq.getStyle();
      Pl.avoid.forEach(a => {
        cx.beginPath();
        cx.arc(a.x * k, a.z * k, a.r * 0.9 * k, 0, TAU);
        cx.fill();
      });
      /* a soft round mask so the plan fades into the land */
      cx.globalCompositeOperation = 'destination-in';
      cx.globalAlpha = 1;
      const mg = cx.createRadialGradient(0, 0, lim * k * 0.85, 0, 0, lim * k * 1.14);
      mg.addColorStop(0, 'rgba(0,0,0,1)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = mg;
      cx.fillRect(-n / 2, -n / 2, n, n);
      const t = new THREE.CanvasTexture(cv);
      t.encoding = THREE.sRGBEncoding;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(span, span).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({
          map: t,
          transparent: true,
          roughness: 0.9,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
        }),
      );
      m.position.y = 6.2;
      m.receiveShadow = true;
      m.renderOrder = 0;
      Pl.root.add(m);
      Pl.mats.push(t);
    }

    /* scatter helpers: trees, rocks, ruins, craters, tents, fields */
    function inst(Pl, geo, material, list, shadow) {
      if (!list.length) return null;
      const im = new THREE.InstancedMesh(geo, material, list.length);
      const M = new THREE.Matrix4(),
        Q = new THREE.Quaternion(),
        E = new THREE.Euler();
      list.forEach((o, i) => {
        Q.setFromEuler(E.set(o.rx || 0, o.ry || 0, o.rz || 0));
        M.compose(new THREE.Vector3(o.x, o.y, o.z), Q, new THREE.Vector3(o.sx, o.sy, o.sz));
        im.setMatrixAt(i, M);
        if (o.c) im.setColorAt(i, o.c);
      });
      im.castShadow = shadow !== false;
      im.receiveShadow = true;
      Pl.root.add(im);
      return im;
    }
    function scatter(Pl, n, rMin, rMax, accept) {
      const out = [],
        R = Pl.R;
      for (let i = 0; i < n * 3 && out.length < n; i++) {
        const a = R() * TAU,
          r = lerp(rMin, rMax, Math.sqrt(R()));
        const x = Math.cos(a) * r,
          z = Math.sin(a) * r;
        const y = Pl.H(x, z);
        if (y < 1.5 && !Pl.sc.under) continue;
        if (Pl.avoid.some(o => Math.hypot(x - o.x, z - o.z) < o.r * 0.8)) continue;
        if (accept && !accept(x, z, y)) continue;
        out.push({ x, y, z });
      }
      return out;
    }
    function buildNature(Pl) {
      const { sc, ext, R } = Pl;
      const K0 = KIND[sc.kind];
      const gt = Pl.gtype;
      let trees = sc.trees != null ? sc.trees : K0.trees || 0;
      if (trees === 0 && (gt === 'forest' || gt === 'terran' || gt === 'archipelago') && !sc.under && !sc.space)
        trees = 0.25;
      if (gt === 'desert' || gt === 'barren' || gt === 'ice' || gt === 'lava' || gt === 'toxic' || Pl.snow)
        trees *= gt === 'toxic' ? 0.6 : 0.08;
      const nT = Math.round(trees * (SMALL ? 1100 : 2600));
      if (nT > 0) {
        const fol = C(Pl.pal.foliage);
        const L = scatter(
          Pl,
          nT,
          ext * (K0.bld ? 0.75 : 0.05),
          ext * (trees > 0.8 ? 2.2 : 3.2),
          (x, z, y) => y < 900,
        ).map(o => {
          const s = 12 + R() * 16;
          return Object.assign(o, {
            sx: s,
            sy: s * (1.6 + R() * 1.4),
            sz: s,
            ry: R() * TAU,
            c: fol.clone().multiplyScalar(0.7 + R() * 0.45),
          });
        });
        const conifer = Pl.snow || gt === 'ice' || sc.arch === 'gothic' || R() < 0.4;
        const g = conifer
          ? new THREE.ConeGeometry(0.5, 1, 7).translate(0, 0.6, 0)
          : new THREE.IcosahedronGeometry(0.55, 0).scale(1, 0.75, 1).translate(0, 0.7, 0);
        inst(Pl, g, mat('#ffffff', { rough: 0.9, flat: !conifer }), L);
        inst(
          Pl,
          new THREE.CylinderGeometry(0.06, 0.09, 0.4, 5).translate(0, 0.2, 0),
          mat('#4a3524'),
          L.map(o => Object.assign({}, o, { c: null })),
          false,
        );
      }
      const rocks = sc.rocks != null ? sc.rocks : K0.rocks || 0.15;
      const nR = Math.round(rocks * (SMALL ? 300 : 800));
      if (nR > 0) {
        const rc = C(Pl.pal.high);
        const L = scatter(Pl, nR, ext * 0.4, ext * 3).map(o => {
          const s = 3 + Math.pow(R(), 3) * 40;
          return Object.assign(o, {
            y: o.y - s * 0.3,
            sx: s * (0.7 + R() * 0.6),
            sy: s * (0.5 + R() * 0.5),
            sz: s,
            rx: R(),
            ry: R() * TAU,
            c: rc.clone().multiplyScalar(0.6 + R() * 0.5),
          });
        });
        inst(Pl, new THREE.DodecahedronGeometry(1, 0), mat('#ffffff', { flat: true }), L);
      }
      if (K0.icespires || (Pl.snow && sc.kind === 'wilds')) {
        const L = scatter(Pl, SMALL ? 60 : 160, ext * 0.6, ext * 3).map(o => {
          const s = 8 + R() * 22;
          return Object.assign(o, {
            sx: s,
            sy: s * (2 + R() * 4),
            sz: s,
            rx: (R() - 0.5) * 0.3,
            rz: (R() - 0.5) * 0.3,
            ry: R() * TAU,
          });
        });
        inst(
          Pl,
          new THREE.ConeGeometry(0.5, 1, 5).translate(0, 0.5, 0),
          mat('#cfe6f5', { rough: 0.15, metal: 0.1, flat: true }),
          L,
        );
      }
      if (K0.ruins) {
        const sCol = C(Pl.pal.stone).multiplyScalar(0.85);
        const L = scatter(Pl, Math.round(K0.ruins * (SMALL ? 160 : 380)), ext * 0.05, ext * 1.1).map(o => {
          const w = 6 + R() * 22;
          return Object.assign(o, {
            y: o.y - 2,
            sx: w,
            sy: 4 + Math.pow(R(), 2) * 40,
            sz: 3 + R() * 6,
            ry: R() * TAU,
            rz: (R() - 0.5) * 0.2,
            c: sCol.clone().multiplyScalar(0.8 + R() * 0.3),
          });
        });
        inst(Pl, new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mat('#ffffff', { rough: 1 }), L);
        const cols = scatter(Pl, SMALL ? 50 : 140, ext * 0.05, ext).map(o => {
          const s = 2.2 + R() * 1.4;
          return Object.assign(o, { sx: s, sy: 8 + R() * 26, sz: s, c: sCol });
        });
        inst(Pl, new THREE.CylinderGeometry(0.5, 0.55, 1, 10).translate(0, 0.5, 0), mat('#ffffff'), cols);
      }
      if (K0.craters || sc.kind === 'battlefield') {
        const L = scatter(Pl, SMALL ? 40 : 90, 0, ext * 1.4).map(o => {
          const s = 12 + Math.pow(R(), 2) * 60;
          return Object.assign(o, { y: o.y + 0.6, sx: s, sy: 1, sz: s });
        });
        inst(
          Pl,
          new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2),
          new THREE.MeshStandardMaterial({
            color: C('#1b1714'),
            roughness: 1,
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
          }),
          L,
          false,
        );
        const rim = L.map(o => Object.assign({}, o, { y: o.y - 0.5, sy: o.sx * 0.12 }));
        inst(
          Pl,
          new THREE.TorusGeometry(1, 0.18, 6, 24).rotateX(Math.PI / 2),
          mat(Pl.pal.ground2, { rough: 1 }),
          rim,
          false,
        );
      }
      if (K0.wrecks) {
        const L = scatter(Pl, SMALL ? 14 : 30, ext * 0.1, ext * 1.2).map(o => {
          const s = 8 + R() * 30;
          return Object.assign(o, {
            sx: s * 2.4,
            sy: s * 0.6,
            sz: s,
            ry: R() * TAU,
            rz: (R() - 0.5) * 0.8,
            rx: (R() - 0.5) * 0.5,
          });
        });
        inst(Pl, new THREE.BoxGeometry(1, 1, 1), mat('#3b3a3c', { metal: 0.6, rough: 0.5 }), L);
      }
      if (K0.tents) {
        const tc = ['#c8b28a', '#8a6a4a', '#b84a3a', '#7a8a5a'];
        const L = scatter(Pl, SMALL ? 50 : 120, ext * 0.08, ext * 0.8).map(o => {
          const s = 6 + R() * 8;
          return Object.assign(o, { sx: s, sy: s * 0.8, sz: s * 1.4, ry: R() * TAU, c: C(tc[(R() * 4) | 0]) });
        });
        inst(
          Pl,
          new THREE.ConeGeometry(0.7, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0),
          mat('#ffffff', { rough: 1 }),
          L,
        );
      }
      if (K0.fields) {
        const fc = ['#9aa64a', '#c9b45a', '#6e8a3a', '#a87a3a', '#88a05a'];
        const L = [];
        for (let i = 0; i < (SMALL ? 50 : 120); i++) {
          const a = R() * TAU,
            r = ext * (0.25 + R() * 1.6);
          const x = Math.cos(a) * r,
            z = Math.sin(a) * r;
          const y = Pl.H(x, z);
          if (y < 2) continue;
          L.push({
            x,
            y: y + 0.5,
            z,
            sx: 60 + R() * 120,
            sy: 1,
            sz: 40 + R() * 90,
            ry: Pl.R() * 0.3,
            c: C(fc[(R() * fc.length) | 0]),
          });
        }
        inst(
          Pl,
          new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
          new THREE.MeshStandardMaterial({ roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
          L,
          false,
        );
      }
      if (KIND[sc.kind].domes) {
        const L = scatter(Pl, SMALL ? 6 : 12, ext * 0.1, ext * 0.9).map(o => {
          const s = 40 + R() * 90;
          return Object.assign(o, { sx: s, sy: s * 0.8, sz: s });
        });
        inst(
          Pl,
          new THREE.SphereGeometry(1, 32, 16, 0, TAU, 0, Math.PI / 2),
          mat('#bfe2ff', { op: 0.22, rough: 0.05, metal: 0.4, ds: true }),
          L,
          false,
        );
      }
      if (KIND[sc.kind].smoke) Pl.smokeCols = scatter(Pl, 6, ext * 0.1, ext * 1.1);
      if (KIND[sc.kind].pads) {
        const L = (Pl.padSpots || []).map(o =>
          Object.assign(o, { y: o.y + 0.4, sx: Pl.u * 1.6, sy: 1, sz: Pl.u * 1.6 }),
        );
        inst(Pl, new THREE.CylinderGeometry(1, 1, 1.2, 28), mat('#3a3d42', { rough: 0.8 }), L, false);
        inst(
          Pl,
          new THREE.RingGeometry(0.72, 0.8, 32).rotateX(-Math.PI / 2).translate(0, 0.65, 0),
          mat('#e8c24a', { emis: '#e8c24a', ei: 0.5 }),
          L,
          false,
        );
        const ships = L.filter(() => R() < 0.6).map(o =>
          Object.assign({}, o, {
            y: o.y + Pl.u * 0.35,
            sx: Pl.u * 1.6,
            sy: Pl.u * 0.35,
            sz: Pl.u * 0.5,
            ry: R() * TAU,
          }),
        );
        inst(
          Pl,
          new THREE.CylinderGeometry(0.5, 0.7, 1, 10).rotateZ(Math.PI / 2),
          mat('#9a9fa6', { metal: 0.6, rough: 0.4 }),
          ships,
        );
      }
      if (Pl.water && (sc.coast || KIND[sc.kind].coast)) {
        /* piers out from the waterfront, and boats moored along them */
        const side = sc.coast || KIND[sc.kind].coast;
        const nrm = side === 's' ? [0, 1] : side === 'n' ? [0, -1] : side === 'e' ? [1, 0] : [-1, 0];
        const piers = [],
          boats = [];
        for (let i = -9; i <= 9; i++) {
          const t = (i / 9) * ext * 0.85;
          let x = nrm[1] ? t : 0,
            z = nrm[0] ? t : 0;
          /* walk out from the centre to the waterline */
          let d = 0;
          for (; d < ext * 2.2; d += 8) if (Pl.H(x + nrm[0] * d, z + nrm[1] * d) < 0.5) break;
          if (d >= ext * 2.2) continue;
          x += nrm[0] * d;
          z += nrm[1] * d;
          const len = Pl.u * (1.6 + R() * 1.4);
          piers.push({
            x: x + nrm[0] * len * 0.45,
            y: 1.2,
            z: z + nrm[1] * len * 0.45,
            sx: nrm[0] ? len : Pl.u * 0.3,
            sy: 1.4,
            sz: nrm[1] ? len : Pl.u * 0.3,
          });
          if (R() < 0.75)
            boats.push({
              x: x + nrm[0] * len * 0.6 + (nrm[1] ? Pl.u * 0.5 : 0),
              y: 0.6,
              z: z + nrm[1] * len * 0.6 + (nrm[0] ? Pl.u * 0.5 : 0),
              sx: Pl.u * (0.9 + R() * 0.8),
              sy: Pl.u * 0.3,
              sz: Pl.u * 0.32,
              ry: nrm[0] ? 0 : Math.PI / 2,
            });
        }
        inst(Pl, new THREE.BoxGeometry(1, 1, 1), mat('#5a4a3a', { rough: 1 }), piers, false);
        inst(
          Pl,
          new THREE.CylinderGeometry(0.42, 0.5, 1, 8, 1).rotateZ(Math.PI / 2).scale(1, 0.6, 1),
          mat(sc.arch === 'modern' || sc.arch === 'imperial' ? '#c9ccd2' : '#6a4e34', { rough: 0.7 }),
          boats,
        );
      }
    }

    function buildWalls(Pl) {
      if (!Pl.sc.walls || Pl.sc.space || Pl.sc.under) return;
      const r = Pl.ext * 1.02,
        n = SMALL ? 40 : 72,
        h = 22 + Pl.ext * 0.02;
      const L = [],
        T = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU,
          x = Math.cos(a) * r,
          z = Math.sin(a) * r;
        const y = Pl.H(x, z);
        L.push({ x, y: y - 4, z, sx: ((TAU * r) / n) * 1.04, sy: h + 4, sz: 9, ry: -a + Math.PI / 2 });
        if (i % 6 === 0) T.push({ x, y: y - 4, z, sx: 14, sy: h * 1.6, sz: 14 });
      }
      const m = mat(Pl.pal.stone, { rough: 0.9 });
      inst(Pl, new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), m, L);
      inst(Pl, new THREE.CylinderGeometry(0.5, 0.56, 1, 10).translate(0, 0.5, 0), m, T);
    }

    /* underground: a cavern roof over the place */
    function buildCavern(Pl) {
      const r = Pl.ext * 1.7;
      const g = new THREE.SphereGeometry(r, 96, 48, 0, TAU, 0, Math.PI / 2);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        _v.fromBufferAttribute(p, i);
        const n = Pl.N.fbm(_v.x * 0.004, _v.z * 0.004 + _v.y * 0.003, 4);
        _v.multiplyScalar(1 - 0.12 - n * 0.16);
        _v.y *= 0.42;
        p.setXYZ(i, _v.x, _v.y, _v.z);
      }
      g.computeVertexNormals();
      const m = new THREE.Mesh(
        g,
        new THREE.MeshStandardMaterial({
          color: C(Pl.pal.high).multiplyScalar(0.55),
          roughness: 1,
          side: THREE.BackSide,
          flatShading: true,
        }),
      );
      Pl.root.add(m);
      /* warm lamps and a few real lights */
      const lc = C(Pl.pal.light);
      for (let i = 0; i < (SMALL ? 2 : 4); i++) {
        const a = (i / 4) * TAU + 0.3;
        const L = new THREE.PointLight(lc, 1.6, Pl.ext * 2.2, 1.6);
        L.position.set(Math.cos(a) * Pl.ext * 0.5, 120, Math.sin(a) * Pl.ext * 0.5);
        Pl.root.add(L);
      }
      const L0 = new THREE.PointLight(lc, 2.2, Pl.ext * 3, 1.4);
      L0.position.set(0, 220, 0);
      Pl.root.add(L0);
      Pl.cavernR = r;
    }

    /* stations and habitats: no ground; a structure in space over the world */
    function buildSpace(Pl) {
      const { ext, R } = Pl;
      const m = mat(Pl.pal.stone, { metal: 0.55, rough: 0.45 });
      const dark = mat('#2a2c31', { metal: 0.6, rough: 0.5 });
      const lit = windowMaterial(Pl.pal.stone, { win: 0.9, glass: '#1c2430', winCol: Pl.pal.light, floor: 5 });
      Pl.mats.push(lit);
      const g = new THREE.Group();
      if (KIND[Pl.sc.kind].habitat || Pl.sc.habitat) {
        const drum = new THREE.Mesh(
          new THREE.CylinderGeometry(ext * 0.45, ext * 0.45, ext * 1.8, 64, 1, true).rotateZ(Math.PI / 2),
          lit,
        );
        g.add(drum);
        [-1, 1].forEach(s => {
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(ext * 0.45, ext * 0.45, 8, 64).rotateZ(Math.PI / 2), m);
          cap.position.x = (s * ext * 1.8) / 2;
          g.add(cap);
          const hub = new THREE.Mesh(
            new THREE.CylinderGeometry(ext * 0.08, ext * 0.1, ext * 0.3, 24).rotateZ(Math.PI / 2),
            dark,
          );
          hub.position.x = s * (ext * 0.9 + ext * 0.15);
          g.add(hub);
        });
        for (let i = 0; i < 6; i++) {
          const fin = new THREE.Mesh(
            new THREE.BoxGeometry(ext * 1.7, 2, ext * 0.18),
            mat('#203a5c', { metal: 0.3, rough: 0.3, emis: '#0c1a30' }),
          );
          fin.position.set(0, Math.cos((i / 6) * TAU) * ext * 0.62, Math.sin((i / 6) * TAU) * ext * 0.62);
          fin.rotation.x = (i / 6) * TAU;
          g.add(fin);
        }
        Pl.spin = drum;
      } else {
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(ext * 0.12, ext * 0.12, ext * 0.9, 32), lit);
        g.add(hub);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(ext * 0.7, ext * 0.06, 16, 128).rotateX(Math.PI / 2), lit);
        g.add(ring);
        for (let i = 0; i < 6; i++) {
          const sp = new THREE.Mesh(new THREE.BoxGeometry(ext * 0.7, ext * 0.02, ext * 0.03), dark);
          sp.position.set(Math.cos((i / 6) * TAU) * ext * 0.35, 0, Math.sin((i / 6) * TAU) * ext * 0.35);
          sp.rotation.y = -(i / 6) * TAU;
          g.add(sp);
        }
        for (let i = 0; i < 4; i++) {
          const pn = new THREE.Mesh(
            new THREE.BoxGeometry(ext * 0.5, 2, ext * 0.16),
            mat('#1d3556', { metal: 0.4, rough: 0.3, emis: '#0a1628' }),
          );
          pn.position.set(0, (i < 2 ? 1 : -1) * ext * 0.36, (i % 2 ? 1 : -1) * ext * 0.2);
          g.add(pn);
        }
        for (let i = 0; i < 10; i++) {
          const mod = new THREE.Mesh(
            new THREE.BoxGeometry(18 + R() * 30, 14 + R() * 20, 18 + R() * 30),
            R() < 0.5 ? lit : m,
          );
          mod.position.set((R() - 0.5) * ext * 0.3, (R() - 0.5) * ext * 0.8, (R() - 0.5) * ext * 0.3);
          g.add(mod);
        }
        Pl.spin = ring;
      }
      g.traverse(o => {
        if (o.isMesh) o.castShadow = o.receiveShadow = true;
      });
      Pl.root.add(g);
      Pl.station = g;
      /* the world below */
      const pc =
        Pl.sc.sky && Pl.sc.sky.planet
          ? typeof Pl.sc.sky.planet === 'string'
            ? Pl.sc.sky.planet
            : Pl.sc.sky.planet.c
          : Pl.pal.ground;
      const pr = ext * 14;
      const cv = document.createElement('canvas');
      const TW = SMALL ? 512 : 1024,
        TH = TW / 2,
        TS = TW / 1024;
      cv.width = TW;
      cv.height = TH;
      const cx = cv.getContext('2d');
      const base = C(pc),
        alt = C(Pl.pal.water),
        cl = C('#ffffff');
      const img = cx.createImageData(TW, TH);
      for (let y = 0; y < TH; y++)
        for (let x = 0; x < TW; x++) {
          const ang = (x / TW) * TAU;
          const n = Pl.N.fbm(
            Math.cos(ang) * 1.2 * (TW / (140 * TS * TAU)) * 0.9 + 50,
            y / (140 * TS) + Math.sin(ang) * 1.1,
            5,
          );
          const c =
            Pl.gtype === 'gas'
              ? base.clone().lerp(alt, 0.5 + 0.5 * Math.sin(y / 18 + n * 3))
              : n > -0.02
                ? base.clone().multiplyScalar(0.8 + n)
                : alt.clone();
          const k = Math.max(0, Pl.N.fbm(Math.cos(ang) * 3 + 9, y / (60 * TS) + Math.sin(ang) * 3, 4) - 0.1) * 1.4;
          c.lerp(cl, Math.min(0.8, k));
          const o = (y * TW + x) * 4;
          img.data[o] = c.r * 255;
          img.data[o + 1] = c.g * 255;
          img.data[o + 2] = c.b * 255;
          img.data[o + 3] = 255;
        }
      cx.putImageData(img, 0, 0);
      const tex = new THREE.CanvasTexture(cv);
      tex.encoding = THREE.sRGBEncoding;
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(pr, 128, 64),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }),
      );
      planet.rotation.set(Math.PI / 2 - 0.25, 0, 0.3);
      planet.position.set(0, -pr * 1.18, -pr * 0.55);
      Pl.root.add(planet);
      Pl.planetBelow = planet;
      const glow = sprite(Pl.atmo, pr * 2.25, 0.35);
      glow.position.copy(planet.position);
      Pl.root.add(glow);
    }

    /* ---------- traffic: small craft on lanes over the place ---------- */
    function buildTraffic(Pl) {
      if (!Pl.sc.traffic) return;
      const n = SMALL ? 14 : 34,
        R = Pl.R;
      const g = new THREE.BoxGeometry(1, 0.35, 0.45);
      const m = mat('#c9ccd2', { metal: 0.6, rough: 0.35 });
      const im = new THREE.InstancedMesh(g, m, n);
      im.frustumCulled = false;
      const lanes = [];
      for (let i = 0; i < n; i++)
        lanes.push({
          r: Pl.ext * (0.2 + R() * 1.2),
          h: Pl.sc.space ? (R() - 0.5) * Pl.ext * 1.2 : 70 + R() * 260,
          w: (0.04 + R() * 0.08) * (R() < 0.5 ? -1 : 1),
          a: R() * TAU,
          s: 6 + R() * 10,
          tilt: (R() - 0.5) * 0.5,
        });
      Pl.root.add(im);
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const lm = new THREE.PointsMaterial({
        color: C('#ffd9a0'),
        size: 7,
        map: dotTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lights = new THREE.Points(lg, lm);
      lights.frustumCulled = false;
      Pl.root.add(lights);
      Pl.trafficLights = lights;
      const M = new THREE.Matrix4(),
        Q = new THREE.Quaternion(),
        E = new THREE.Euler(),
        S = new THREE.Vector3(),
        Pv = new THREE.Vector3();
      Pl.anims.push((dt, t) => {
        const lp = lg.attributes.position;
        lanes.forEach((l, i) => {
          const a = l.a + t * l.w;
          const x = Math.cos(a) * l.r,
            z = Math.sin(a) * l.r,
            y = l.h + Math.sin(t * 0.3 + i) * 12;
          Q.setFromEuler(E.set(0, -a + (l.w > 0 ? -Math.PI / 2 : Math.PI / 2), l.tilt));
          M.compose(Pv.set(x, y, z), Q, S.set(l.s, l.s, l.s));
          im.setMatrixAt(i, M);
          lp.setXYZ(i, x, y - l.s * 0.3, z);
        });
        im.instanceMatrix.needsUpdate = true;
        lp.needsUpdate = true;
      });
    }

    /* ---------- weather ---------- */
    const WX = {
      dust: { c: '#cdb089', n: 1400, s: 7, v: [26, -1, 8], fog: 2.2, normal: true, puff: true, op: 0.5, max: 26 },
      snow: { c: '#ffffff', n: 2200, s: 4.5, v: [3, -12, 2], fog: 1.6, normal: true, op: 0.9, max: 18 },
      rain: { c: '#b8c8dc', n: 2600, s: 2.6, v: [4, -140, 2], fog: 1.5, op: 0.6, max: 8 },
      ash: { c: '#6f6962', n: 1600, s: 4, v: [2, -6, 1], fog: 1.8, normal: true, op: 0.75, max: 14 },
      mist: { c: '#e8eef2', n: 500, s: 40, v: [2, 0, 1], fog: 2.6, normal: true, puff: true, op: 0.2 },
      spores: { c: '#b8f08a', n: 900, s: 4, v: [1, 4, 1], fog: 1.3, max: 14 },
      storm: { c: '#c2aa84', n: 2800, s: 6, v: [90, -18, 30], fog: 3, normal: true, puff: true, op: 0.55, max: 30 },
    };
    function buildWeather(Pl) {
      const w = WX[Pl.sc.weather];
      if (!w) return;
      const n = Math.round(w.n * (SMALL ? 0.45 : 1));
      const pp = Particles(n, { normal: w.normal, puff: w.puff, op: w.op == null ? 0.85 : w.op, max: w.max });
      const box = 700,
        c = C(w.c),
        R = Pl.R;
      const off = [];
      for (let i = 0; i < n; i++) {
        off.push(new THREE.Vector3(R() * box, R() * box * 0.6, R() * box));
        pp.emit(_v.set(0, 0, 0), _v2.set(0, 0, 0), 1e9, w.s, null, c);
      }
      Pl.root.add(pp.obj);
      Pl.fogMul *= w.fog;
      const vel = new THREE.Vector3().fromArray(w.v);
      const posA = pp.obj.geometry.attributes.position;
      Pl.anims.push((dt, t) => {
        const cp = cam.position;
        for (let i = 0; i < n; i++) {
          const o = off[i];
          o.addScaledVector(vel, dt);
          if (Pl.sc.weather === 'spores' || Pl.sc.weather === 'mist') o.x += Math.sin(t * 0.7 + i) * dt * 4;
          const x = ((((o.x - cp.x) % box) + box) % box) - box / 2 + cp.x;
          const y = ((((o.y - cp.y) % (box * 0.6)) + box * 0.6) % (box * 0.6)) - box * 0.3 + cp.y;
          const z = ((((o.z - cp.z) % box) + box) % box) - box / 2 + cp.z;
          posA.setXYZ(i, x, y, z);
        }
        posA.needsUpdate = true;
      });
      pp.update(0.001);
      const ca = pp.obj.geometry.attributes.color;
      for (let i = 0; i < n; i++) ca.setXYZ(i, c.r, c.g, c.b);
      ca.needsUpdate = true;
      Pl.weatherPts = pp;
      if (Pl.sc.weather === 'storm') Pl.lightning = true;
    }

    /* ---------- landmarks ---------- */
    function resolveLandmarks(site, sc, opts) {
      const raw = ARR(sc.landmarks).filter(l => l && l.id != null && (!opts.landmarkOk || opts.landmarkOk(l)));
      const list = raw.length
        ? raw
        : site.surface
          ? []
          : [
              {
                id: '__site',
                name: site.name,
                desc: site.desc,
                kind: guessLandmarkKind(site, sc.kind),
                at: [0, 0],
                h: 1.2,
                books: site.books,
                auto: true,
              },
            ];
      const n = list.length;
      return list.map((l, i) => {
        let at = Array.isArray(l.at) ? l.at : null;
        if (!at) {
          if (n === 1) at = [0, 0];
          else {
            const a = i * 2.399963 + 0.4,
              r = 0.22 + 0.62 * Math.sqrt((i + 0.5) / n);
            at = [Math.cos(a) * r, Math.sin(a) * r];
          }
        }
        return Object.assign({}, l, {
          kind: LM_KINDS.includes(l.kind) ? l.kind : guessLandmarkKind(l, sc.kind),
          at,
          h: clamp(+l.h || 1, 0.3, 4),
        });
      });
    }
    function placeLandmarks(Pl) {
      const LM = window.AtlasPlacesLM;
      const kit = {
        THREE,
        C,
        mat,
        glowMat,
        sprite,
        windowMaterial: (c, o) => {
          const m = windowMaterial(c, o);
          Pl.mats.push(m);
          return m;
        },
        pal: Pl.pal,
        arch: Pl.sc.arch,
        R: Pl.R,
        dotTex,
        u: Pl.u,
        H: Pl.H,
        space: Pl.sc.space,
        under: Pl.sc.under,
      };
      Pl.lms.forEach(l => {
        let g = null;
        try {
          g = LM && LM.build ? LM.build(l.kind, kit, l) : null;
        } catch (e) {
          console.warn('Atlas places: landmark', l.id, e);
        }
        if (!g) {
          g = new THREE.Group();
          const b = new THREE.Mesh(new THREE.BoxGeometry(Pl.u, Pl.u * 3, Pl.u), mat(Pl.pal.stone));
          b.position.y = Pl.u * 1.5;
          g.add(b);
        }
        const y = Pl.sc.space ? 0 : Pl.H(l.x, l.z);
        g.position.set(l.x, l.kind === 'lake' || l.kind === 'crater' ? Math.max(y, 0) : y - 1, l.z);
        if (Pl.sc.space && !l.free) {
          /* moored to the station: the ring or the hull, facing out */
          const a = Math.atan2(l.z, l.x);
          const rr = Math.hypot(l.x, l.z);
          g.position.set(
            Math.cos(a) * Math.max(rr, Pl.ext * 0.3),
            (l.at[1] || 0) * Pl.ext * 0.25,
            Math.sin(a) * Math.max(rr, Pl.ext * 0.3),
          );
        }
        g.rotation.y = l.ry != null ? l.ry : Math.atan2(-l.x, -l.z) + (Pl.R() - 0.5) * 0.3;
        g.scale.setScalar(l.h);
        g.traverse(o => {
          if (o.isMesh) {
            o.castShadow = o.castShadow !== false;
            o.receiveShadow = true;
            o.userData.lm = l.id;
          }
        });
        g.userData.lm = l.id;
        Pl.root.add(g);
        g.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(g);
        l.obj = g;
        l.top = new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2);
        l.mid = new THREE.Vector3((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2, (bb.min.z + bb.max.z) / 2);
        l.rad = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z) * 0.5 || Pl.u;
      });
    }

    /* ---------- labels ---------- */
    function buildLabels(Pl) {
      Pl.lms.forEach(l => {
        const el = document.createElement('button');
        el.className = 'plbl lm';
        el.type = 'button';
        el.tabIndex = -1;
        el.style.opacity = 0;
        el.style.pointerEvents = 'none';
        el.innerHTML = '<span class="pip"></span><span class="tx"></span>';
        el.querySelector('.tx').textContent = l.name;
        el.addEventListener('click', e => {
          e.stopPropagation();
          if (env.onPick) env.onPick(l.id);
        });
        env.labelsEl.appendChild(el);
        l.el = el;
      });
    }
    function layoutLabels(W, H) {
      if (!P) return;
      const placed = [];
      const sel = P.sel;
      P.lms.forEach(l => {
        l.dist = cam.position.distanceTo(l.top);
      });
      const order = P.lms.slice().sort((a, b) => (b.id === sel) - (a.id === sel) || a.dist - b.dist);
      order.forEach(l => {
        _v.copy(l.top);
        _v.y += P.u * 0.6 * l.h;
        _v.project(cam);
        const x = (_v.x * 0.5 + 0.5) * W,
          y = (-_v.y * 0.5 + 0.5) * H;
        let show = _v.z < 1 && x > -40 && x < W + 40 && y > -20 && y < H + 20 && !P.hideLabels;
        const r = { x: x - 8, y: y - 14, w: String(l.name).length * 7.6 + 30, h: 24 };
        if (
          show &&
          l.id !== sel &&
          placed.some(q => r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y)
        )
          show = false;
        if (show) placed.push(r);
        l.el.style.opacity = show ? (l.id === sel ? 1 : clamp(1.4 - l.dist / (P.ext * 5), 0.45, 1)) : 0;
        l.el.style.pointerEvents = show ? 'auto' : 'none';
        if (l.el._tab !== show) {
          l.el._tab = show;
          l.el.tabIndex = show ? 0 : -1;
          l.el.setAttribute('aria-hidden', String(!show));
        }
        if (show) l.el.style.transform = 'translate(' + (x - 7) + 'px,' + (y - 13) + 'px)';
        l.el.classList.toggle('sel', l.id === sel);
      });
    }

    /* ---------- camera ---------- */
    function camCtl(Pl) {
      const o = {
        t: new THREE.Vector3(0, 30, 0),
        gt: new THREE.Vector3(0, 30, 0),
        yaw: 0.6,
        gyaw: 0.6,
        pitch: 0.5,
        gpitch: 0.5,
        dist: Pl.ext * 2.2,
        gdist: Pl.ext * 2.2,
        fly: null,
        min: Pl.u * 0.9,
        max: Pl.ext * (Pl.sc.space ? 6 : 4.6),
        pmin: Pl.sc.space ? -1.35 : 0.04,
        pmax: Pl.sc.under ? 0.95 : 1.45,
      };
      o.flyTo = (t, d, yaw, pitch, dur) => {
        o.fly = {
          t0: performance.now(),
          dur: dur || 1700,
          fT: o.t.clone(),
          fD: o.dist,
          fY: o.yaw,
          fP: o.pitch,
          tT: t.clone(),
          tD: d,
          tY: yaw == null ? o.yaw : yaw,
          tP: pitch == null ? o.pitch : pitch,
        };
      };
      o.update = dt => {
        if (o.fly) {
          const f = o.fly;
          const k = clamp((performance.now() - f.t0) / f.dur, 0, 1),
            e = ease(k);
          o.t.lerpVectors(f.fT, f.tT, e);
          o.dist = Math.exp(lerp(Math.log(f.fD), Math.log(f.tD), e) + Math.sin(k * Math.PI) * 0.25);
          o.yaw = lerp(f.fY, f.tY, e);
          o.pitch = lerp(f.fP, f.tP, e);
          o.gt.copy(o.t);
          o.gdist = o.dist;
          o.gyaw = o.yaw;
          o.gpitch = o.pitch;
          if (k >= 1) o.fly = null;
        } else {
          const s = 1 - Math.pow(0.0006, dt);
          o.yaw = lerp(o.yaw, o.gyaw, s);
          o.pitch = lerp(o.pitch, o.gpitch, s);
          o.dist = Math.exp(lerp(Math.log(o.dist), Math.log(o.gdist), s));
          o.t.lerp(o.gt, s);
        }
        const cp = Math.cos(o.pitch);
        cam.position.set(
          o.t.x + Math.sin(o.yaw) * cp * o.dist,
          o.t.y + Math.sin(o.pitch) * o.dist,
          o.t.z + Math.cos(o.yaw) * cp * o.dist,
        );
        if (!Pl.sc.space) {
          const gy = Pl.H(cam.position.x, cam.position.z) + 6;
          if (cam.position.y < gy) cam.position.y = gy;
          if (Pl.water && cam.position.y < 6) cam.position.y = 6;
        }
        if (Pl.sc.under && Pl.cavernR) {
          const lim = Pl.cavernR * 0.36;
          if (cam.position.y > lim) cam.position.y = lim;
          const rr = Math.hypot(cam.position.x, cam.position.z);
          if (rr > Pl.cavernR * 0.8) {
            cam.position.x *= (Pl.cavernR * 0.8) / rr;
            cam.position.z *= (Pl.cavernR * 0.8) / rr;
          }
        }
        cam.lookAt(o.t);
      };
      o.rotate = (dx, dy) => {
        o.fly = null;
        o.gyaw -= dx * 0.005;
        o.gpitch = clamp(o.gpitch + dy * 0.004, o.pmin, o.pmax);
      };
      o.zoom = f => {
        o.fly = null;
        o.gdist = clamp(o.gdist * f, o.min, o.max);
      };
      o.pan = (dx, dy) => {
        o.fly = null;
        const k = o.dist * 0.0018;
        const right = _v.set(Math.cos(o.yaw), 0, -Math.sin(o.yaw));
        o.gt.addScaledVector(right, -dx * k);
        const fwd = _v2.set(-Math.sin(o.yaw), 0, -Math.cos(o.yaw));
        o.gt.addScaledVector(fwd, dy * k);
        const rr = Math.hypot(o.gt.x, o.gt.z),
          lim = Pl.ext * 2.6;
        if (rr > lim) o.gt.multiplyScalar(lim / rr);
        if (!Pl.sc.space) o.gt.y = Math.max(Pl.H(o.gt.x, o.gt.z), 0) + 20;
      };
      return o;
    }

    /* ---------- selection marker ---------- */
    function buildMarker(Pl) {
      const g = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.86, 1, 64).rotateX(-Math.PI / 2),
        glowMat(env.accent || '#e8cd8a', 0.8),
      );
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1, 8, 1, true).translate(0, 0.5, 0),
        glowMat(env.accent || '#e8cd8a', 0.35),
      );
      g.add(ring, beam);
      g.visible = false;
      Pl.root.add(g);
      Pl.marker = { g, ring, beam };
    }

    /* ===================== ENTER / EXIT ===================== */
    function enter(world, site, opts) {
      exit();
      opts = opts || {};
      const seed = hashStr((world && world.id) + '/' + site.id);
      const sc = resolveScene(world, site, opts);
      const gfx = opts.gfx || (world && world.gfx) || {};
      const gp =
        Array.isArray(gfx.pal) && gfx.pal.length >= 6
          ? gfx.pal
          : ['#1d3f5e', '#3f7fa0', '#6f8a4a', '#8a8a5a', '#8a7a66', '#e8e8e8'];
      const A = ARCH[sc.arch];
      const sp = sc.pal || {};
      const ext = SIZE_EXT[sc.size];
      const dryWorld =
        ['desert', 'barren', 'lava', 'toxic', 'city', 'hive', 'dyson'].includes(gfx.type) ||
        (gfx.sea != null && gfx.sea < 0.08);
      const Pl = {
        world,
        site,
        sc,
        ext,
        u: ext / 18,
        R: rng(seed),
        N: makeNoise(seed),
        gtype: gfx.type || 'terran',
        root: new THREE.Scene(),
        mats: [],
        anims: [],
        fx: [],
        skyBodies: [],
        stats: {},
        fogMul: 1,
        lampK: 0,
        exp: 1,
        azOff: (rng(seed + 7)() - 0.5) * 80,
        star: (world && world.star && world.star.col) || '#fff6e4',
        atmo: gfx.atmo || '#6fa8ff',
        atmoK: gfx.atmoK == null ? 1 : gfx.atmoK,
        snow: sc.weather === 'snow' || gfx.type === 'ice' || !!KIND[sc.kind].snow,
        sunSize: (opts.sunSize || 1) * 1,
        sel: null,
      };
      Pl.pal = {
        deep: sp.deep || (dryWorld ? '#123447' : gp[0]),
        water: sp.water || (dryWorld ? '#2f6f88' : gp[1]),
        ground: sp.ground || (gfx.type === 'desert' ? gp[3] : gp[2]),
        ground2: sp.ground2 || gp[3],
        high: sp.high || gp[4],
        peak: sp.peak || gp[5],
        shore: sp.shore || '#c9b58f',
        stone: sp.stone || A.stone,
        roof: sp.roof || A.roof,
        light: sp.light || gfx.lightCol || '#ffc27a',
        foliage: sp.foliage || (gfx.type === 'toxic' ? '#7a9a3a' : gfx.type === 'forest' ? gp[3] : '#4e7a3a'),
        pave: sp.pave || new THREE.Color(A.stone).multiplyScalar(0.62).getStyle(),
      };
      if (Pl.gtype === 'gas' && !sc.space) sc.space = true;
      Pl.paveR = KIND[sc.kind].bld > 0.3 && !sc.space ? ext * 0.95 : KIND[sc.kind].bld > 0 ? ext * 0.4 : 0;
      Pl.U = {
        uZen: { value: new THREE.Color() },
        uHor: { value: new THREE.Color() },
        uGnd: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uSunCol: { value: new THREE.Color() },
        uStars: { value: 0 },
        uNight: { value: 0 },
        uTime: { value: 0 },
      };
      P = Pl;
      /* landmarks first: the city and terrain make room for them */
      Pl.lms = resolveLandmarks(site, sc, opts);
      Pl.lms.forEach(l => {
        l.x = l.at[0] * ext * 0.9;
        l.z = -l.at[1] * ext * 0.9;
      });
      Pl.avoid = Pl.lms.map(l => ({ x: l.x, z: l.z, r: Pl.u * 2.2 * l.h }));
      Pl.fog = new THREE.FogExp2(0x000000, 0);
      Pl.root.fog = Pl.fog;
      lighting(Pl);
      buildSky(Pl);
      if (sc.space) {
        Pl.H = () => 0;
        buildSpace(Pl);
      } else {
        Pl.H = makeTerrain(Pl);
        buildGround(Pl);
        if (KIND[sc.kind].pads) {
          Pl.padSpots = scatter(Pl, SMALL ? 8 : 14, ext * 0.25, ext * 0.9);
          Pl.padSpots.forEach(o => Pl.avoid.push({ x: o.x, z: o.z, r: Pl.u * 2 }));
        }
        if (
          sc.water ||
          sc.coast ||
          sc.river ||
          Pl.lms.some(l => l.kind === 'lake' || l.kind === 'dock') ||
          KIND[sc.kind].coast
        )
          buildWater(Pl);
        if (sc.under) buildCavern(Pl);
        buildWalls(Pl);
        buildCity(Pl);
        buildNature(Pl);
      }
      placeLandmarks(Pl);
      buildTraffic(Pl);
      if (!sc.under) buildWeather(Pl);
      buildMarker(Pl);
      buildLabels(Pl);
      if (Pl.smokeCols) Pl.smokeCols.forEach(s => ambientSmoke(Pl, s));
      Pl.fog.density = ((sc.space ? 0 : sc.under ? 1.2 : 0.7) / (ext * 4.2)) * Pl.fogMul;
      Pl.cam = camCtl(Pl);
      setTod(sc.tod, true);
      overview(true);
      return Pl;
    }
    function exit() {
      if (!P) return;
      stopFx();
      P.lms.forEach(l => l.el && l.el.remove());
      P.root.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) ARR(o.material).forEach(m => !Object.values(matCache).includes(m) && m.dispose());
      });
      P.mats.forEach(m => m.dispose());
      if (P.lampPts) P.lampPts.dispose();
      if (P.weatherPts) P.weatherPts.dispose();
      freeMats();
      P = null;
    }

    /* ---------- camera moves ---------- */
    function overview(instant) {
      if (!P) return;
      const d = P.sc.space ? P.ext * 2.4 : P.sc.under ? P.ext * 0.9 : P.ext * 2.1;
      const t = new THREE.Vector3(0, P.sc.space ? 0 : Math.max(P.H(0, 0), 0) + 30, 0);
      const pitch = P.sc.space ? 0.35 : P.sc.under ? 0.3 : 0.48;
      if (instant) {
        Object.assign(P.cam, { yaw: 0.6, gyaw: 0.6, pitch, gpitch: pitch, dist: d * 1.25, gdist: d });
        P.cam.t.copy(t);
        P.cam.gt.copy(t);
      } else P.cam.flyTo(t, d, P.cam.yaw, pitch, 1600);
    }
    function focus(id, opt) {
      if (!P) return;
      const l = P.lms.find(x => x.id === id);
      P.sel = l ? l.id : null;
      if (!l) {
        P.marker.g.visible = false;
        return;
      }
      const d = clamp(l.rad * 3.4, P.u * 2.2, P.ext * 1.6);
      const t = l.mid.clone();
      t.y = Math.max(t.y * 0.75, (P.sc.space ? t.y : P.H(t.x, t.z)) + l.rad * 0.4);
      const yaw = Math.atan2(l.x, l.z) + 0.5;
      P.cam.flyTo(
        t,
        d,
        P.sc.space ? P.cam.yaw : yaw,
        P.sc.space ? 0.25 : P.sc.under ? 0.22 : 0.36,
        (opt && opt.dur) || 1700,
      );
      const m = P.marker;
      m.g.visible = true;
      m.g.position.set(l.x, (P.sc.space ? l.obj.position.y : Math.max(P.H(l.x, l.z), 0)) + 1.5, l.z);
      if (P.sc.space) m.g.position.copy(l.obj.position);
      m.r = Math.max(l.rad * 1.15, P.u);
      m.ring.scale.setScalar(m.r);
      m.beam.scale.set(m.r * 0.25, Math.max(l.rad * 4, P.ext * 0.3), m.r * 0.25);
    }

    /* ---------- picking ---------- */
    const ray = new THREE.Raycaster();
    function pick(x, y, W, H) {
      if (!P) return null;
      let best = null,
        bd = SMALL ? 30 : 20;
      P.lms.forEach(l => {
        if (!l.el || l.el.style.opacity === '0') return;
        _v.copy(l.top).project(cam);
        if (_v.z >= 1) return;
        const sx = (_v.x * 0.5 + 0.5) * W,
          sy = (-_v.y * 0.5 + 0.5) * H;
        const d = Math.hypot(sx - x, sy - y);
        if (d < bd) {
          bd = d;
          best = l.id;
        }
      });
      if (best) return best;
      ray.setFromCamera({ x: (x / W) * 2 - 1, y: -(y / H) * 2 + 1 }, cam);
      const objs = P.lms.map(l => l.obj).filter(Boolean);
      const hit = ray.intersectObjects(objs, true)[0];
      return hit ? hit.object.userData.lm || null : null;
    }

    /* ===================== EFFECTS (event fx) ===================== */
    function stopFx() {
      if (!P) return;
      P.fx.forEach(f => f.end && f.end());
      P.fx = [];
      P.shake = 0;
    }
    function fxAt(id) {
      const l = P.lms.find(x => x.id === id) || P.lms[0];
      const p = l
        ? new THREE.Vector3(l.x, P.sc.space ? l.obj.position.y : Math.max(P.H(l.x, l.z), 0), l.z)
        : new THREE.Vector3();
      if (P.sc.space && l) p.copy(l.obj.position);
      return { l, p, s: Math.max(P.u * (l ? l.h : 1), 30) };
    }
    function addFx(o) {
      o.t = 0;
      P.fx.push(o);
      return o;
    }
    function ambientSmoke(Pl, at) {
      const pp = Particles(SMALL ? 90 : 180, { normal: true, puff: true, op: 0.55 });
      Pl.root.add(pp.obj);
      const c = C('#4a4642'),
        R = Pl.R;
      let acc = 0;
      Pl.anims.push(dt => {
        acc += dt;
        while (acc > 0.12) {
          acc -= 0.12;
          pp.emit(
            _v.set(at.x + (R() - 0.5) * 10, at.y + 4, at.z + (R() - 0.5) * 10),
            _v2.set(6 + R() * 4, 14 + R() * 8, 2),
            9,
            14,
            70,
            c,
          );
        }
        pp.update(dt, -0.4, 0.9);
      });
      Pl.mats.push({ dispose: () => pp.dispose() });
    }
    const FX = window.AtlasPlacesFX
      ? window.AtlasPlacesFX.create({ THREE, Particles, sprite, glowMat, mat, C, cam, SMALL, ease, clamp, TAU })
      : {};
    function play(kind, lmId) {
      if (!P || !FX[kind]) return false;
      stopFx();
      addFx(FX[kind](fxAt(lmId), P));
      return true;
    }

    /* ===================== FRAME ===================== */
    let T = 0;
    function render(dt, W, H) {
      if (!P) return;
      T += dt;
      P.U.uTime.value = T;
      if (P.todTw) {
        const k = clamp((performance.now() - P.todTw.t0) / P.todTw.dur, 0, 1);
        applyTod(P, P.todTw.from, P.todTw.to, ease(k));
        if (k >= 1) P.todTw = null;
      }
      if (P.idle && !P.cam.fly) P.cam.gyaw += dt * 0.025;
      P.cam.update(dt);
      if (P.shake) {
        cam.position.x += (Math.random() - 0.5) * P.shake * 6;
        cam.position.y += (Math.random() - 0.5) * P.shake * 4;
        P.shake = Math.max(0, P.shake - dt * 0.35);
      }
      P.anims.forEach(f => f(dt, T));
      for (let i = P.fx.length - 1; i >= 0; i--) {
        const f = P.fx[i];
        f.t += dt;
        f.upd(dt, f.t);
        if (f.t >= f.dur) {
          f.end();
          P.fx.splice(i, 1);
          if (env.onFxEnd) env.onFxEnd();
        }
      }
      if (P.spin) P.spin.rotation[P.spin.geometry.type === 'TorusGeometry' ? 'y' : 'x'] += dt * 0.03;
      if (P.marker.g.visible) {
        const k = 1 + Math.sin(T * 3) * 0.06;
        P.marker.ring.scale.setScalar(P.marker.r * k);
        P.marker.ring.material.opacity = 0.55 + Math.sin(T * 3) * 0.25;
      }
      if (P.lightning && Math.random() < dt * 0.25) P.sun.intensity += 4;
      P.sky.position.copy(cam.position);
      if (P.lampPts) P.lampPts.mat.uniforms.uScale.value = H * renderer.getPixelRatio() * 0.9;
      if (P.weatherPts) P.weatherPts.mat.uniforms.uScale.value = H * renderer.getPixelRatio() * 0.6;
      if (P.water) P.water.material.uniforms.uCam.value.copy(cam.position);
      const e0 = renderer.toneMappingExposure;
      renderer.toneMappingExposure = P.exp;
      layoutLabels(W, H);
      renderer.render(P.root, cam);
      renderer.toneMappingExposure = e0;
    }
    function resize(W, H, ox, oy) {
      cam.aspect = W / H;
      if (ox || oy) cam.setViewOffset(W, H, ox || 0, oy || 0, W, H);
      else cam.clearViewOffset();
      cam.updateProjectionMatrix();
    }

    return {
      enter,
      exit,
      render,
      resize,
      focus,
      overview,
      setTod,
      play,
      stopFx,
      pick,
      get place() {
        return P;
      },
      get tod() {
        return P ? P.tod : null;
      },
      landmarks() {
        return P ? P.lms : [];
      },
      rotate(dx, dy) {
        if (P) {
          P.idle = false;
          P.cam.rotate(dx, dy);
        }
      },
      pan(dx, dy) {
        if (P) {
          P.idle = false;
          P.cam.pan(dx, dy);
        }
      },
      zoom(f) {
        if (P) {
          P.idle = false;
          P.cam.zoom(f);
        }
      },
      setIdle(v) {
        if (P) P.idle = !!v;
      },
      setLabelsHidden(v) {
        if (P) P.hideLabels = !!v;
      },
      fxKinds: Object.keys(FX),
      TOD_ORDER,
    };
  }

  window.AtlasPlaces = { create, guessKind, KINDS: Object.keys(KIND), ARCHS: Object.keys(ARCH), LM_KINDS };
})();
