/* Procedural surface maps for the Solar System Atlas.

   The photographic maps the page was designed around (tex/lo, tex/hi) were never shipped, so every body's map is
   generated here instead: equirectangular canvases (u = 0.5 + lon/360, north at the top, the same convention as the
   page's llDir) painted from 3D value noise on the unit sphere (no seam), crater stamps and a few named features placed
   at their real coordinates (the Great Red Spot, Olympus Mons, Pluto's heart and so on). The look is illustrative,
   not a map. Earth uses the atlas's own land mask (earth-base.png) so the continents are right.

   API: SolarTex.make(name, hi) -> Promise<HTMLCanvasElement|null>; SolarTex.ring(name) -> HTMLCanvasElement|null.
   The same file runs as a Web Worker that does the painting, so the page keeps animating at full speed; without
   Worker support it paints on the main thread in ~12 ms slices. */
(function () {
  'use strict';

  const IN_WORKER = typeof document === 'undefined';
  const COARSE = !IN_WORKER && matchMedia('(hover:none),(pointer:coarse)').matches;
  const LOW_MEM = !IN_WORKER && (navigator.deviceMemory || 8) < 4;
  const DEG = Math.PI / 180;

  /* ---------------- noise ---------------- */
  function makeNoise(seed) {
    const P = new Uint8Array(512);
    const p = [];
    for (let i = 0; i < 256; i++) p.push(i);
    let s = (seed * 2654435761) >>> 0 || 1;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    const G = new Float32Array(256);
    for (let i = 0; i < 256; i++) G[i] = ((P[i] * 7919 + seed) % 256) / 255;
    const lerp = (t, a, b) => a + (b - a) * t;
    function vn(x, y, z) {
      const xi = Math.floor(x),
        yi = Math.floor(y),
        zi = Math.floor(z);
      const fx = x - xi,
        fy = y - yi,
        fz = z - zi;
      const X = xi & 255,
        Y = yi & 255,
        Z = zi & 255;
      const u = fx * fx * (3 - 2 * fx),
        v = fy * fy * (3 - 2 * fy),
        w = fz * fz * (3 - 2 * fz);
      const a = P[X] + Y,
        aa = P[a] + Z,
        ab = P[a + 1] + Z,
        b = P[X + 1] + Y,
        ba = P[b] + Z,
        bb = P[b + 1] + Z;
      return lerp(
        w,
        lerp(v, lerp(u, G[P[aa]], G[P[ba]]), lerp(u, G[P[ab]], G[P[bb]])),
        lerp(v, lerp(u, G[P[aa + 1]], G[P[ba + 1]]), lerp(u, G[P[ab + 1]], G[P[bb + 1]])),
      );
    }
    function fbm(x, y, z, oct) {
      let a = 0.5,
        sum = 0,
        norm = 0;
      for (let i = 0; i < oct; i++) {
        sum += a * vn(x + i * 17.1, y, z);
        norm += a;
        a *= 0.5;
        x *= 2.03;
        y *= 2.03;
        z *= 2.03;
      }
      // stretch the narrow value-noise distribution back to roughly 0..1
      const r = (sum / norm - 0.5) * 2.2 + 0.5;
      return r < 0 ? 0 : r > 1 ? 1 : r;
    }
    function ridged(x, y, z, oct) {
      return 1 - Math.abs(fbm(x, y, z, oct) * 2 - 1);
    }
    return { vn, fbm, ridged };
  }

  function rng(seed) {
    let s = (seed * 2654435761) >>> 0 || 7;
    return () => {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  /* ---------------- small colour helpers ---------------- */
  const cl = t => (t < 0 ? 0 : t > 1 ? 1 : t);
  const sst = (a, b, x) => {
    const t = cl((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function ramp(stops, t) {
    t = cl(t);
    const n = stops.length - 1;
    const i = Math.min(n - 1, Math.floor(t * n));
    return mix(stops[i], stops[i + 1], t * n - i);
  }
  const R = list => list.map(hex);
  function dirLL(lat, lon) {
    const la = lat * DEG,
      lo = lon * DEG;
    return [Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)];
  }
  // great-circle distance in degrees between a pixel direction and a feature centre
  function angTo(p, c) {
    const d = p.x * c[0] + p.y * c[1] + p.z * c[2];
    return Math.acos(d > 1 ? 1 : d < -1 ? -1 : d) / DEG;
  }
  // a soft spot of radius r degrees (1 at the centre, 0 outside), optionally stretched east-west
  function spot(p, c, r, stretch) {
    if (!stretch) return 1 - sst(r * 0.55, r, angTo(p, c));
    const dlat = p.lat - c.lat;
    let dlon = p.lon - c.lon;
    if (dlon > 180) dlon -= 360;
    if (dlon < -180) dlon += 360;
    dlon *= Math.cos(p.lat * DEG) / stretch;
    return 1 - sst(r * 0.55, r, Math.hypot(dlat, dlon));
  }

  /* ---------------- slicing scheduler ---------------- */
  const chan = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
  const waiting = [];
  if (chan) chan.port1.onmessage = () => waiting.length && waiting.shift()();
  const yieldNow = () =>
    IN_WORKER ? Promise.resolve() : new Promise(res => (chan ? (waiting.push(res), chan.port2.postMessage(0)) : setTimeout(res, 0)));

  /* Paint W x H pixels with fn(p) -> [r,g,b] (0..1); p carries lat, lon (deg) and the unit vector x,y,z. */
  async function paint(W, H, fn) {
    const buf = new Float32Array(W * H * 3);
    const p = { x: 0, y: 0, z: 0, lat: 0, lon: 0, u: 0, v: 0 };
    let t0 = performance.now();
    for (let j = 0; j < H; j++) {
      const lat = 90 - ((j + 0.5) / H) * 180;
      const la = lat * DEG,
        cla = Math.cos(la),
        sla = Math.sin(la);
      p.lat = lat;
      p.v = j / H;
      for (let i = 0; i < W; i++) {
        const lon = ((i + 0.5) / W) * 360 - 180;
        const lo = lon * DEG;
        p.lon = lon;
        p.u = i / W;
        p.x = cla * Math.cos(lo);
        p.y = sla;
        p.z = -cla * Math.sin(lo);
        const c = fn(p);
        const k = (j * W + i) * 3;
        buf[k] = c[0];
        buf[k + 1] = c[1];
        buf[k + 2] = c[2];
      }
      if (!IN_WORKER && performance.now() - t0 > 12) {
        await yieldNow();
        t0 = performance.now();
      }
    }
    return { W, H, buf };
  }

  /* Craters stamped on top of a painted map: bowl shading lit from the west, a bright rim and faint ejecta.
     opts: n (count), rMin/rMax (deg), seed, depth (0..1), fresh (fraction with bright rays), list (fixed craters). */
  async function craters(img, opts) {
    const { W, H, buf } = img;
    const rand = rng(opts.seed || 1);
    const list = (opts.list || []).slice();
    for (let i = 0; i < (opts.n || 0); i++) {
      const u = rand(),
        lat = Math.asin(rand() * 2 - 1) / DEG,
        lon = rand() * 360 - 180;
      // power law: many small, few large
      const r = opts.rMin * Math.pow(opts.rMax / opts.rMin, Math.pow(u, 2.6));
      list.push({ lat, lon, r, ray: rand() < (opts.fresh || 0) });
    }
    const depth = opts.depth == null ? 0.35 : opts.depth;
    const minR = (180 / H) * 0.9;
    let t0 = performance.now();
    for (const c of list) {
      if (c.r < minR) continue;
      const cd = dirLL(c.lat, c.lon);
      const reach = c.r * (c.ray ? 4 : 1.35);
      const j0 = Math.max(0, Math.floor(((90 - c.lat - reach) / 180) * H));
      const j1 = Math.min(H - 1, Math.ceil(((90 - c.lat + reach) / 180) * H));
      for (let j = j0; j <= j1; j++) {
        const lat = 90 - ((j + 0.5) / H) * 180;
        const cosl = Math.max(0.03, Math.cos(lat * DEG));
        const dLon = Math.min(180, reach / cosl);
        const i0 = Math.floor(((c.lon - dLon + 180) / 360) * W),
          i1 = Math.ceil(((c.lon + dLon + 180) / 360) * W);
        const la = lat * DEG;
        for (let ii = i0; ii <= i1; ii++) {
          const i = ((ii % W) + W) % W;
          const lon = ((i + 0.5) / W) * 360 - 180,
            lo = lon * DEG;
          const px = Math.cos(la) * Math.cos(lo),
            py = Math.sin(la),
            pz = -Math.cos(la) * Math.sin(lo);
          const dot = px * cd[0] + py * cd[1] + pz * cd[2];
          const d = Math.acos(dot > 1 ? 1 : dot) / DEG;
          const t = d / c.r;
          if (t > (c.ray ? 4 : 1.35)) continue;
          // east-west position across the crater, for the lighting
          let dl = lon - c.lon;
          if (dl > 180) dl -= 360;
          if (dl < -180) dl += 360;
          const ex = (dl * cosl) / Math.max(d, 1e-6);
          let f = 1;
          if (t < 0.92) {
            const wall = sst(0.35, 0.92, t);
            f = 1 - depth * 0.35 + depth * 0.55 * wall * ex; // far (east) wall lit, near wall in shadow
            f -= depth * 0.18 * (1 - wall);
          } else if (t < 1.12) {
            f = 1 + depth * 0.45 * (1 - Math.abs(t - 1.02) / 0.1) * (0.6 + 0.4 * ex);
          } else if (t < 1.35) {
            f = 1 + depth * 0.12 * (1 - (t - 1.12) / 0.23);
          }
          if (c.ray && t >= 1) {
            const ang = Math.atan2(py - cd[1], ex);
            const ray = Math.pow(Math.max(0, Math.sin(ang * 9 + c.lon) * Math.sin(ang * 5 - c.lat)), 3);
            f += 0.35 * ray * (1 - (t - 1) / 3);
          }
          const k = (j * W + i) * 3;
          buf[k] *= f;
          buf[k + 1] *= f;
          buf[k + 2] *= f;
        }
      }
      if (!IN_WORKER && performance.now() - t0 > 12) {
        await yieldNow();
        t0 = performance.now();
      }
    }
    return img;
  }

  function toRGBA(img, alphaFromLuma) {
    const { W, H, buf } = img;
    const d = new Uint8ClampedArray(W * H * 4);
    for (let i = 0, k = 0; i < W * H; i++, k += 3) {
      d[i * 4] = cl(buf[k]) * 255;
      d[i * 4 + 1] = cl(buf[k + 1]) * 255;
      d[i * 4 + 2] = cl(buf[k + 2]) * 255;
      d[i * 4 + 3] = alphaFromLuma ? cl(buf[k + 1]) * 255 : 255;
    }
    return d;
  }
  function toCanvas(W, H, rgba) {
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    cv.getContext('2d').putImageData(new ImageData(rgba, W, H), 0, 0);
    return cv;
  }
  async function paintRGBA(name, W, H, seed) {
    const img = await MAPS[name](W, H, makeNoise(seed), seed);
    return toRGBA(img, name === 'earth_clouds');
  }

  /* ---------------- Earth land mask ---------------- */
  let landP = null;
  let workerMask = null;
  function landMask() {
    if (IN_WORKER) return Promise.resolve(workerMask);
    if (landP) return landP;
    landP = new Promise(res => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement('canvas');
        c.width = im.width;
        c.height = im.height;
        const g = c.getContext('2d');
        g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const a = new Float32Array(c.width * c.height);
        for (let i = 0; i < a.length; i++) a[i] = d[i * 4] / 255;
        res({ w: c.width, h: c.height, a });
      };
      im.onerror = () => res(null);
      im.src = 'earth-base.png';
    });
    return landP;
  }
  function sampleMask(m, u, v) {
    if (!m) return 0;
    const x = u * m.w - 0.5,
      y = v * m.h - 0.5;
    const x0 = Math.floor(x),
      y0 = Math.max(0, Math.min(m.h - 2, Math.floor(y)));
    const fx = x - x0,
      fy = cl(y - y0);
    const xa = ((x0 % m.w) + m.w) % m.w,
      xb = (xa + 1) % m.w;
    const A = m.a[y0 * m.w + xa],
      B = m.a[y0 * m.w + xb],
      C = m.a[(y0 + 1) * m.w + xa],
      D = m.a[(y0 + 1) * m.w + xb];
    return (A * (1 - fx) + B * fx) * (1 - fy) + (C * (1 - fx) + D * fx) * fy;
  }

  /* ---------------- generic families ---------------- */
  // a cratered rocky or icy body: base colour ramp from noise, then craters
  function rocky(stops, o) {
    o = o || {};
    return async (W, H, N, seed) => {
      const S = R(stops);
      const img = await paint(W, H, p => {
        const n = N.fbm(p.x * (o.f || 2.2), p.y * (o.f || 2.2), p.z * (o.f || 2.2), 5);
        let c = ramp(S, n * (o.k || 1) + (o.b || 0));
        if (o.px) c = o.px(p, c, N, n);
        return c;
      });
      return craters(img, {
        seed,
        n: o.n == null ? 500 : o.n,
        rMin: o.rMin || 0.5,
        rMax: o.rMax || 14,
        depth: o.depth,
        fresh: o.fresh || 0.04,
        list: o.list,
      });
    };
  }
  // a banded giant planet
  function giant(stops, o) {
    return async (W, H, N) => {
      const S = R(stops);
      return paint(W, H, p => {
        const turb = (N.fbm(p.x * 2.4, p.y * 7, p.z * 2.4, 5) - 0.5) * o.turb;
        const swirl = (N.fbm(p.x * 6 + 3, p.y * 18, p.z * 6, 4) - 0.5) * o.turb * 0.5;
        const t = p.lat / 90 + turb + swirl;
        const band = 0.5 + 0.5 * Math.sin(t * o.bands + Math.sin(t * o.bands * 0.37) * 1.6);
        let c = ramp(S, band * 0.85 + (N.fbm(p.x * 9, p.y * 30, p.z * 9, 3) - 0.5) * 0.25 + 0.07);
        if (o.px) c = o.px(p, c, N);
        return c;
      });
    };
  }

  /* ---------------- named maps ---------------- */
  const GRS = Object.assign(dirLL(-20.5, -57.5), { lat: -20.5, lon: -57.5 });
  const GDS = Object.assign(dirLL(-20, -36), { lat: -20, lon: -36 });
  const LL = (lat, lon) => Object.assign(dirLL(lat, lon), { lat, lon });

  const MAPS = {
    sun: async (W, H, N) =>
      paint(W, H, p => {
        const s = N.fbm(p.x * 22, p.y * 22, p.z * 22, 4) * 0.6 + N.fbm(p.x * 5, p.y * 5, p.z * 5, 3) * 0.4;
        return [s, s, s];
      }),

    mercury: rocky(['#3e3a36', '#6d665e', '#958b80', '#b3aa9e'], {
      n: 900,
      rMax: 12,
      depth: 0.45,
      fresh: 0.06,
      list: [{ lat: 30.5, lon: -170.2, r: 22 }],
      px: (p, c) => mix(c, hex('#c2b49f'), spot(p, LL(30.5, -170.2), 20) * 0.35),
    }),

    venus: rocky(['#5b3b20', '#8a5a2e', '#b47b42', '#d39d5c'], {
      n: 80,
      rMax: 3,
      depth: 0.2,
      f: 2.6,
      px: (p, c, N) => mix(c, hex('#e0b57a'), sst(0.62, 0.8, N.fbm(p.x * 1.3 + 5, p.y * 1.3, p.z * 1.3, 4)) * 0.6),
    }),
    venus_clouds: async (W, H, N) => {
      const S = R(['#c9b07a', '#e2cf9d', '#f1e4bf', '#faf2da']);
      return paint(W, H, p => {
        // the sideways "Y" and chevrons of Venus's cloud tops, swept by the four-day super-rotation
        const chev = Math.abs(p.lat) / 90;
        const w = N.fbm(p.x * 2, p.y * 6, p.z * 2, 5);
        const t = p.lon / 60 + chev * 1.8 + w * 2.2;
        const b = 0.5 + 0.5 * Math.sin(t * 2.4);
        return ramp(S, 0.25 + b * 0.45 + (N.fbm(p.x * 8, p.y * 8, p.z * 8, 3) - 0.5) * 0.3 + chev * 0.2);
      });
    },

    earth: async (W, H, N) => {
      const m = await landMask();
      const ocean = R(['#06183a', '#0b2b5c', '#134272']);
      return paint(W, H, p => {
        const land = sampleMask(m, p.u, p.v);
        const n = N.fbm(p.x * 4, p.y * 4, p.z * 4, 6);
        const alat = Math.abs(p.lat);
        let c = ramp(ocean, sst(0.05, 0.9, land) * 0.7 + n * 0.3);
        if (land > 0.45) {
          // biomes by latitude: rainforest, savanna, the desert belts, temperate forest, taiga, tundra
          const desert = sst(12, 20, alat) * (1 - sst(32, 40, alat)) * sst(0.4, 0.62, N.fbm(p.x * 2 + 9, p.y * 2, p.z * 2, 4) + 0.12);
          let g = ramp(R(['#21431f', '#3a5a2a', '#5b6b3a']), n);
          g = mix(g, hex('#7a6a40'), sst(8, 16, alat) * 0.5 * (1 - sst(40, 50, alat)));
          g = mix(g, ramp(R(['#b9955f', '#d2b27a', '#e3c891']), n), desert);
          g = mix(g, hex('#2c3e2a'), sst(48, 60, alat) * 0.6);
          g = mix(g, hex('#857a68'), sst(62, 70, alat));
          g = mix(g, hex('#6b625a'), sst(0.68, 0.82, N.ridged(p.x * 6, p.y * 6, p.z * 6, 4)) * 0.45);
          c = mix(c, g, sst(0.45, 0.62, land));
        }
        // ice: Antarctica, Greenland and the Arctic pack
        const ice = p.lat < -62 ? sst(-62, -70, p.lat) : sst(72 + n * 8, 80, p.lat) + (land > 0.5 ? sst(58, 66, p.lat) * spot(p, LL(72, -40), 16) : 0);
        return mix(c, hex('#eef2f6'), cl(ice));
      });
    },
    earth_night: async (W, H, N) => {
      const m = await landMask();
      return paint(W, H, p => {
        const land = sampleMask(m, p.u, p.v);
        if (land < 0.5 || p.lat < -50 || p.lat > 68) return [0, 0, 0];
        // cities crowd temperate coasts and river plains
        const coast = 1 - sst(0.55, 0.95, land) * 0.6;
        const dens = sst(0.5, 0.8, N.fbm(p.x * 5, p.y * 5, p.z * 5, 4)) * (0.4 + 0.6 * sst(10, 30, p.lat)) * coast;
        const pts = sst(0.72, 0.9, N.vn(p.x * 160, p.y * 160, p.z * 160));
        const v = cl(dens * (pts * 1.6 + 0.08));
        return [v, v * 0.82, v * 0.55];
      });
    },
    earth_clouds: async (W, H, N) =>
      paint(W, H, p => {
        const alat = Math.abs(p.lat);
        const swirl = N.fbm(p.x * 3, p.y * 3, p.z * 3, 3) * 2;
        const n = N.fbm(p.x * 4 + swirl, p.y * 6, p.z * 4 - swirl, 6);
        const belt = 0.18 * (1 - sst(4, 12, alat)) + 0.16 * sst(40, 55, alat) * (1 - sst(70, 80, alat));
        const dry = 0.18 * sst(15, 22, alat) * (1 - sst(32, 38, alat));
        const v = sst(0.56 - belt + dry, 0.8 - belt + dry, n) * 0.9;
        return [v, v, v];
      }),

    moon: rocky(['#4b4842', '#6e6a62', '#8f8a80', '#aaa498'], {
      n: 1100,
      rMax: 10,
      depth: 0.4,
      fresh: 0.03,
      list: [
        { lat: -43.3, lon: -11.2, r: 2.2, ray: true },
        { lat: 9.6, lon: -20.1, r: 2, ray: true },
      ],
      px: (p, c, N) => {
        // the maria of the near side
        const maria = [
          [33, -16, 18],
          [28, 17.5, 10],
          [8.5, 31, 11],
          [17, 59, 7],
          [-8, 51, 9],
          [-21, -17, 11],
          [18, -57, 26],
          [56, 1, 6],
          [-24, -39, 8],
        ];
        let m = 0;
        for (const q of maria) m = Math.max(m, spot(p, LL(q[0], q[1]), q[2] * (0.85 + 0.3 * N.fbm(p.x * 6, p.y * 6, p.z * 6, 3))));
        return mix(c, hex('#36332f'), m * 0.75);
      },
    }),

    mars: rocky(['#6d2e17', '#9a4524', '#bd6234', '#d48a54'], {
      n: 260,
      rMax: 9,
      depth: 0.25,
      list: [{ lat: -42.4, lon: 70.5, r: 18 }],
      px: (p, c, N) => {
        // dark albedo regions: Syrtis Major, Acidalia, Mare Erythraeum, Sinus Meridiani
        const dark = [
          [8.4, 69.5, 12],
          [46.7, -22, 14],
          [-25, -40, 16],
          [-3, 0, 8],
          [-20, 120, 14],
        ];
        let d = 0;
        for (const q of dark) d = Math.max(d, spot(p, LL(q[0], q[1]), q[2] * (0.7 + 0.6 * N.fbm(p.x * 5, p.y * 5, p.z * 5, 4))));
        c = mix(c, hex('#4a2a1d'), d * 0.65);
        // Tharsis and Olympus Mons
        c = mix(c, hex('#c97a4a'), spot(p, LL(2, -110), 22) * 0.35);
        const om = angTo(p, dirLL(18.65, -133.8));
        c = mix(c, hex('#d8a074'), (1 - sst(3, 7, om)) * 0.6);
        c = mix(c, hex('#5a2c1a'), (1 - sst(0.6, 1.4, Math.abs(om - 6.2))) * 0.5);
        // Valles Marineris, a dark scar east of Tharsis
        let dl = p.lon + 59.2;
        const along = 1 - sst(28, 36, Math.abs(dl));
        const across = 1 - sst(0.8, 2.4, Math.abs(p.lat + 13.9 - dl * 0.08 + (N.fbm(p.x * 20, p.y * 20, p.z * 20, 2) - 0.5) * 2));
        c = mix(c, hex('#3c1d12'), along * across * 0.8);
        // polar caps
        const cap = sst(78 + N.fbm(p.x * 8, p.y * 8, p.z * 8, 3) * 6, 84, p.lat) + sst(-80 - N.fbm(p.x * 8, 0, p.z * 8, 3) * 5, -86, p.lat);
        return mix(c, hex('#f2efe9'), cl(cap));
      },
    }),
    phobos: rocky(['#2a2725', '#3e3a36', '#55504a'], { n: 220, rMax: 18, depth: 0.5, list: [{ lat: 1, lon: -46, r: 26 }] }),
    deimos: rocky(['#3a3632', '#4d4842', '#625c55'], { n: 120, rMax: 6, depth: 0.25 }),
    ceres: rocky(['#2f2e2c', '#45433f', '#5c5953'], {
      n: 520,
      rMax: 10,
      depth: 0.4,
      list: [{ lat: 19.8, lon: -120.7, r: 3.2 }],
      px: p => {
        const d = angTo(p, dirLL(19.8, -120.7));
        return mix([0.27, 0.26, 0.25], [0.95, 0.95, 0.92], (1 - sst(0.3, 1.1, d)) * 0.95);
      },
    }),
    vesta: rocky(['#55504a', '#7a736a', '#9b9387'], { n: 400, rMax: 9, depth: 0.4, list: [{ lat: -75, lon: 60, r: 38 }] }),

    jupiter: giant(['#8e6a4c', '#b98d66', '#dcc6a6', '#efe3cc', '#c69c74'], {
      bands: 30,
      turb: 0.06,
      px: (p, c, N) => {
        // the Great Red Spot, an oval about 1.4 times as wide as it is tall, with a pale collar
        let dlon = p.lon - GRS.lon;
        if (dlon > 180) dlon -= 360;
        if (dlon < -180) dlon += 360;
        const e = Math.hypot(dlon / 13, (p.lat - GRS.lat) / 7.5) + (N.fbm(p.x * 30, p.y * 30, p.z * 30, 3) - 0.5) * 0.25;
        c = mix(c, hex('#f2e8d8'), (1 - sst(1.05, 1.35, e)) * sst(0.85, 1.05, e) * 0.7);
        c = mix(c, mix(hex('#b4502e'), hex('#d9764a'), sst(0.2, 0.9, e)), 1 - sst(0.85, 1.05, e));
        // white ovals in the southern belts
        const wo = N.vn(p.x * 14, p.y * 14 + 4, p.z * 14);
        if (p.lat < -30 && p.lat > -45 && wo > 0.82) c = mix(c, hex('#f6f1e6'), (wo - 0.82) * 4);
        return c;
      },
    }),
    saturn: giant(['#b39462', '#cfb07a', '#e5d0a2', '#f0e2bf'], {
      bands: 22,
      turb: 0.035,
      px: (p, c) => mix(c, hex('#7d8c86'), sst(74, 86, p.lat) * 0.5),
    }),
    uranus: giant(['#8fc3cc', '#a2d1d8', '#b4dde2', '#c6e7eb'], {
      bands: 10,
      turb: 0.02,
      px: (p, c) => mix(c, hex('#d8eff1'), sst(50, 80, p.lat) * 0.25),
    }),
    neptune: giant(['#203e9a', '#2d55b8', '#3e6fd0', '#5a8be0'], {
      bands: 14,
      turb: 0.05,
      px: (p, c, N) => {
        let dlon = p.lon - GDS.lon;
        if (dlon > 180) dlon -= 360;
        const e = Math.hypot(dlon / 14, (p.lat - GDS.lat) / 7);
        c = mix(c, hex('#12245e'), 1 - sst(0.75, 1.05, e));
        // bright methane clouds that hug the dark spot, plus Scooter
        const cloud = (1 - sst(0.3, 1, Math.hypot((dlon - 4) / 9, (p.lat - GDS.lat + 8) / 2.2))) * 0.8;
        const scooter = 1 - sst(0.4, 1, Math.hypot((p.lon - 60) / 8, (p.lat + 42) / 2.5));
        const streaks = sst(0.82, 0.95, N.fbm(p.x * 3, p.y * 40, p.z * 3, 3)) * 0.5;
        return mix(c, hex('#eef3ff'), cl(cloud + scooter * 0.7 + streaks));
      },
    }),

    io: rocky(['#b38d2d', '#d9bc4c', '#e8d474', '#f0e3a2'], {
      n: 0,
      f: 3,
      px: (p, c, N) => {
        // volcanic centres: black calderas, red and orange sulphur rings (Pele's is the big red one)
        const v = N.vn(p.x * 9, p.y * 9, p.z * 9);
        if (v > 0.74) c = mix(c, hex('#a3442a'), sst(0.74, 0.86, v) * 0.8);
        if (v > 0.86) c = mix(c, hex('#1c1712'), sst(0.86, 0.93, v));
        const pele = angTo(p, dirLL(-18.7, -104.5));
        c = mix(c, hex('#c05a32'), (1 - sst(4, 9, Math.abs(pele - 9))) * 0.6);
        return mix(c, hex('#8a7a58'), sst(55, 75, Math.abs(p.lat)) * 0.45);
      },
    }),
    europa: rocky(['#b9ab95', '#d6ccbb', '#e9e2d6', '#f3efe8'], {
      n: 12,
      rMax: 3,
      depth: 0.15,
      px: (p, c, N) => {
        // lineae: long reddish-brown cracks across the ice
        const l1 = N.ridged(p.x * 3.5, p.y * 3.5, p.z * 3.5, 4);
        const l2 = N.ridged(p.x * 7 + 9, p.y * 7, p.z * 7, 3);
        c = mix(c, hex('#8b5a3a'), sst(0.9, 0.98, l1) * 0.7 + sst(0.93, 0.99, l2) * 0.35);
        return mix(c, hex('#a88468'), sst(0.62, 0.8, N.fbm(p.x * 2 + 4, p.y * 2, p.z * 2, 4)) * 0.4);
      },
    }),
    ganymede: rocky(['#4f463d', '#6b6155', '#968a7a', '#b8ad9d'], {
      n: 500,
      rMax: 8,
      depth: 0.35,
      fresh: 0.06,
      px: (p, c, N) => {
        // dark ancient terrain (Galileo Regio) cut by paler grooved bands
        const dark = sst(0.5, 0.62, N.fbm(p.x * 1.6, p.y * 1.6, p.z * 1.6, 5)) + spot(p, LL(35, -145), 30) * 0.6;
        const grooves = 0.08 * Math.sin((p.x * 40 + N.fbm(p.x * 5, p.y * 5, p.z * 5, 3) * 30) * 1.0);
        c = mix(c, hex('#4a4038'), cl(dark) * 0.7);
        return mix(c, hex('#c9c0b2'), cl((1 - dark) * 0.35 + grooves));
      },
    }),
    callisto: rocky(['#2e2924', '#3f3832', '#554c43', '#6d6357'], {
      n: 1300,
      rMax: 8,
      depth: 0.45,
      fresh: 0.25,
      list: [{ lat: 14, lon: -56, r: 20, ray: true }],
    }),

    icy: rocky(['#b9b9b9', '#d2d2d2', '#e6e6e6'], { n: 600, rMax: 10, depth: 0.35 }),
    rocky: rocky(['#6a6a6a', '#8a8a8a', '#a4a4a4'], { n: 500, rMax: 10, depth: 0.35 }),
    asteroid: rocky(['#7d7d7d', '#9a9a9a', '#b6b6b6'], { n: 300, rMax: 16, depth: 0.5 }),
    comet: rocky(['#2e2b28', '#3c3834', '#4f4a44'], { n: 60, rMax: 10, depth: 0.4 }),
    arrokoth: rocky(['#6b3e26', '#8a5638', '#a06a48'], { n: 40, rMax: 8, depth: 0.25 }),
    nix: rocky(['#9a9a9a', '#b5b5b5', '#cfcfcf'], { n: 120, rMax: 8 }),
    puck: rocky(['#4a4a48', '#5e5e5b', '#74746f'], { n: 200, rMax: 10 }),
    phoebe: rocky(['#272624', '#363431', '#48453f'], { n: 300, rMax: 14, depth: 0.5 }),
    hyperion: rocky(['#6e5f4b', '#8c7b62', '#a8977c'], { n: 900, rMax: 9, depth: 0.7 }),

    mimas: rocky(['#a9a9a6', '#c4c3c0', '#d8d7d3'], { n: 900, rMax: 8, depth: 0.45, list: [{ lat: 0, lon: -112, r: 21 }] }),
    enceladus: rocky(['#dfe6ea', '#eef3f5', '#fbfdfe'], {
      n: 160,
      rMax: 5,
      depth: 0.2,
      px: (p, c) => {
        // the four tiger stripes near the south pole
        if (p.lat > -60) return c;
        const a = Math.atan2(p.z, p.x) / DEG;
        const r = 90 + p.lat;
        let s = 0;
        for (let i = 0; i < 4; i++) s = Math.max(s, 1 - sst(0.25, 0.9, Math.abs(r * Math.cos((a + 30) * DEG) - (i - 1.5) * 5)));
        return mix(c, hex('#5c86a8'), s * sst(-60, -66, p.lat) * (1 - sst(16, 22, r * Math.abs(Math.sin((a + 30) * DEG)))) * 0.8);
      },
    }),
    tethys: rocky(['#c7c6c2', '#dad9d5', '#ebeae6'], { n: 700, rMax: 9, list: [{ lat: 30, lon: -130, r: 25 }] }),
    dione: rocky(['#a9a8a3', '#c2c1bc', '#d8d7d2'], {
      n: 600,
      rMax: 8,
      px: (p, c, N) => {
        // bright wispy fractures on the trailing hemisphere
        const t = 1 - sst(50, 90, angTo(p, dirLL(0, 90)));
        return mix(c, hex('#f2f2ef'), sst(0.88, 0.97, N.ridged(p.x * 5, p.y * 5, p.z * 5, 4)) * t * 0.85);
      },
    }),
    rhea: rocky(['#b1aea8', '#c7c4be', '#dcd9d3'], { n: 1100, rMax: 9, depth: 0.4, list: [{ lat: -8, lon: -82, r: 4, ray: true }] }),
    titan: rocky(['#3b2f22', '#5a4632', '#7a6146'], {
      n: 10,
      rMax: 4,
      depth: 0.15,
      px: (p, c, N) => mix(c, hex('#a88a62'), cl(spot(p, LL(-10, -100), 28) * 0.8 + sst(0.6, 0.75, N.fbm(p.x * 2, p.y * 2, p.z * 2, 4)) * 0.4)),
    }),
    titan_haze: async (W, H, N) =>
      paint(W, H, p => {
        const n = N.fbm(p.x * 2, p.y * 4, p.z * 2, 4);
        let c = mix(hex('#c98a3a'), hex('#e3ad62'), n * 0.6 + 0.2);
        return mix(c, hex('#8a6a4a'), sst(60, 85, p.lat) * 0.5);
      }),
    iapetus: rocky(['#c9c2b5', '#ddd6ca', '#ece7dd'], {
      n: 500,
      rMax: 9,
      px: (p, c, N) => {
        // Cassini Regio: the dark, reddish leading hemisphere
        const d = angTo(p, dirLL(0, 90)) + (N.fbm(p.x * 6, p.y * 6, p.z * 6, 3) - 0.5) * 18;
        return mix(c, hex('#3a2a1f'), 1 - sst(60, 75, d));
      },
    }),

    miranda: rocky(['#9a9a98', '#b4b4b1', '#cbcbc8'], {
      n: 300,
      rMax: 7,
      px: (p, c, N) => {
        // coronae: racetrack bands of ridges
        const cor = spot(p, LL(-30, 20), 32) + spot(p, LL(-20, -80), 30) + spot(p, LL(-40, 160), 26);
        const rings = 0.5 + 0.5 * Math.sin(angTo(p, dirLL(-30, 20)) * 1.4 + N.fbm(p.x * 4, p.y * 4, p.z * 4, 3) * 4);
        return mix(c, mix(hex('#6d6d6a'), hex('#d8d8d4'), rings), cl(cor) * 0.75);
      },
    }),
    ariel: rocky(['#a6a6a4', '#c0c0bd', '#d4d4d1'], { n: 400, rMax: 7 }),
    umbriel: rocky(['#4e4e4d', '#5f5f5d', '#727270'], { n: 700, rMax: 9, list: [{ lat: -10, lon: -88, r: 4 }] }),
    titania: rocky(['#86827c', '#9e9a93', '#b5b1aa'], { n: 600, rMax: 9 }),
    oberon: rocky(['#78736c', '#8f8a82', '#a59f96'], { n: 800, rMax: 10, depth: 0.45 }),
    triton: rocky(['#b4a59c', '#c9bbb1', '#ddd2c9'], {
      n: 30,
      rMax: 3,
      depth: 0.15,
      px: (p, c, N) => {
        // pinkish south polar cap; "cantaloupe" terrain to the north
        c = mix(c, hex('#e0c6bb'), sst(-10, -30, p.lat) * 0.7);
        const cant = N.vn(p.x * 30, p.y * 30, p.z * 30);
        return mix(c, hex('#8f857c'), sst(10, 25, p.lat) * sst(0.55, 0.75, cant) * 0.5);
      },
    }),
    pluto: rocky(['#8b6a4f', '#a8866a', '#c8ab8f', '#e6d6c3'], {
      n: 120,
      rMax: 6,
      depth: 0.25,
      px: (p, c, N) => {
        // Cthulhu's dark red belt, then the bright heart: Sputnik Planitia (west lobe) and Tombaugh Regio
        const belt = (1 - sst(8, 22, Math.abs(p.lat + 5))) * (1 - sst(40, 70, angTo(p, dirLL(-5, 110))));
        c = mix(c, hex('#4b2618'), cl(belt * 1.2) * 0.85);
        const heart = Math.max(spot(p, LL(20, 175), 20), spot(p, LL(5, -160), 24) * 0.9);
        c = mix(c, hex('#f2e9dc'), cl(heart * (0.8 + 0.3 * N.fbm(p.x * 12, p.y * 12, p.z * 12, 3))));
        return mix(c, hex('#d8c8b2'), sst(55, 75, p.lat) * 0.5);
      },
    }),
    charon: rocky(['#7d7b78', '#959390', '#aba9a5'], {
      n: 300,
      rMax: 7,
      px: (p, c) => mix(c, hex('#6b3c28'), sst(65, 82, p.lat) * 0.75),
    }),
    ninth: giant(['#6f8aa3', '#86a1b8', '#9db7cb', '#b2c8d8'], { bands: 12, turb: 0.03 }),
  };
  // aliases for names the page asks for
  MAPS.jupiter8k = MAPS.jupiter;

  /* resolution: big for planets and large moons; halved on phones; quartered on low-memory devices */
  const BIG = new Set(['earth', 'earth_night', 'earth_clouds', 'mars', 'jupiter', 'saturn', 'venus', 'venus_clouds', 'mercury', 'moon', 'io', 'europa', 'ganymede', 'callisto', 'titan', 'titan_haze', 'pluto', 'uranus', 'neptune', 'sun']);
  function size(name, hi) {
    let w = hi ? (BIG.has(name) ? 2048 : 1024) : BIG.has(name) ? 512 : 256;
    if (hi && COARSE) w /= 2;
    if (hi && LOW_MEM) w = Math.min(w, 1024);
    return [w, w / 2];
  }

  /* Worker side: paint on request and send the pixels back. */
  if (IN_WORKER) {
    self.onmessage = async e => {
      const m = e.data;
      if (m.mask) workerMask = m.mask;
      let rgba = null;
      try {
        rgba = await paintRGBA(m.name, m.W, m.H, m.seed);
      } catch (err) {
        console.warn('SolarTex worker: could not paint ' + m.name, err);
      }
      self.postMessage({ id: m.id, rgba }, rgba ? [rgba.buffer] : []);
    };
    return;
  }

  /* Main thread: one map at a time (interleaving them all would finish none until the very end), close-up (hi)
     requests jump the queue so the body being visited is painted first. */
  const SRC = document.currentScript && document.currentScript.src;
  let worker = null;
  let workerOk = typeof Worker !== 'undefined' && !!SRC;
  let maskSent = false;
  const pending = {};
  let nextId = 1;
  function getWorker() {
    if (!workerOk) return null;
    if (worker) return worker;
    try {
      worker = new Worker(SRC);
      worker.onmessage = e => {
        const cb = pending[e.data.id];
        delete pending[e.data.id];
        if (cb) cb(e.data.rgba);
      };
      worker.onerror = () => {
        workerOk = false;
        worker = null;
        // re-run anything that was waiting on the worker on the main thread instead
        Object.keys(pending).forEach(id => pending[id](undefined));
      };
    } catch (err) {
      workerOk = false;
      worker = null;
    }
    return worker;
  }
  async function paintJob(job) {
    const w = getWorker();
    if (w) {
      const msg = { id: nextId++, name: job.name, W: job.W, H: job.H, seed: job.seed };
      if (/^earth/.test(job.name) && !maskSent) {
        msg.mask = await landMask();
        maskSent = true;
      }
      const rgba = await new Promise(res => {
        pending[msg.id] = res;
        w.postMessage(msg);
      });
      if (rgba !== undefined) return rgba;
    }
    return paintRGBA(job.name, job.W, job.H, job.seed);
  }
  const cache = {};
  const queue = [];
  let busy = false;
  async function pump() {
    if (busy) return;
    busy = true;
    while (queue.length) {
      const job = queue.shift();
      try {
        const rgba = await paintJob(job);
        job.res(rgba ? toCanvas(job.W, job.H, rgba) : null);
      } catch (e) {
        console.warn('SolarTex: could not paint ' + job.name, e);
        job.res(null);
      }
    }
    busy = false;
  }
  function make(name, hi) {
    if (/_normal$/.test(name) || !MAPS[name]) return Promise.resolve(null);
    const key = (hi ? 'hi/' : 'lo/') + name;
    if (!cache[key]) {
      const [W, H] = size(name, hi);
      const seed = hash(name.replace(/8k$/, ''));
      cache[key] = new Promise(res => {
        const job = { name, W, H, seed, res };
        if (hi) queue.unshift(job);
        else queue.push(job);
        pump();
      });
    }
    return cache[key];
  }

  /* ---------------- rings (radial profiles; x runs from the inner to the outer edge of the drawn band) ---------------- */
  const RINGS = {
    // drawn band 1.235..2.41 Saturn radii: C ring, B ring, Cassini Division, A ring with the Encke gap, F ring
    saturn: { inner: 1.235, outer: 2.41, prof: [[1.239, 1.527, 0.18, '#8c7f6c'], [1.527, 1.951, 0.92, '#e3d3b4'], [1.951, 2.027, 0.06, '#4a4338'], [2.027, 2.269, 0.62, '#c9b896'], [2.32, 2.33, 0.45, '#d6cbb8']], gaps: [[2.214, 0.004], [2.265, 0.002]] },
    // narrow dark rings; epsilon (2.0) is the widest
    uranus: { inner: 1.65, outer: 2.02, prof: [[1.637, 1.642, 0.5, '#6b6f70'], [1.652, 1.656, 0.5, '#6b6f70'], [1.666, 1.67, 0.5, '#6b6f70'], [1.75, 1.756, 0.6, '#787c7d'], [1.786, 1.792, 0.6, '#787c7d'], [1.845, 1.848, 0.5, '#7a7e80'], [1.863, 1.867, 0.55, '#7a7e80'], [1.903, 1.908, 0.6, '#7a7e80'], [1.99, 2.01, 0.85, '#9aa0a2']] },
    // faint Galle, Le Verrier, Lassell plateau, Arago and the clumpy Adams ring
    neptune: { inner: 1.7, outer: 2.56, prof: [[1.69, 1.77, 0.12, '#6c6c74'], [2.145, 2.152, 0.5, '#8a8a92'], [2.152, 2.31, 0.08, '#6c6c74'], [2.31, 2.316, 0.35, '#8a8a92'], [2.535, 2.545, 0.65, '#a0a0a8']] },
  };
  function ring(name) {
    const spec = RINGS[name.replace(/_rings$/, '')];
    if (!spec) return null;
    const W = 1024;
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = 1;
    const g = cv.getContext('2d');
    const id = g.createImageData(W, 1);
    const N = makeNoise(hash(name));
    for (let i = 0; i < W; i++) {
      const r = spec.inner + ((i + 0.5) / W) * (spec.outer - spec.inner);
      let a = 0,
        c = [0, 0, 0];
      for (const b of spec.prof) {
        if (r >= b[0] && r <= b[1]) {
          a = b[2];
          c = hex(b[3]);
        }
      }
      // fine ringlets
      a *= 0.75 + 0.5 * N.fbm(r * 90, 0.5, 0.5, 3);
      for (const gp of spec.gaps || []) if (Math.abs(r - gp[0]) < gp[1]) a *= 0.05;
      id.data[i * 4] = c[0] * 255;
      id.data[i * 4 + 1] = c[1] * 255;
      id.data[i * 4 + 2] = c[2] * 255;
      id.data[i * 4 + 3] = cl(a) * 255;
    }
    g.putImageData(id, 0, 0);
    return cv;
  }

  window.SolarTex = { make, ring, names: Object.keys(MAPS) };
})();
