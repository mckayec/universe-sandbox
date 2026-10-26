/* Atlas places: landmark builders (PACK_FORMAT 21). Each builder returns a THREE.Group standing on y=0,
   centred on x=z=0, roughly 2u to 6u across where u is the place's unit (1/18 of its radius). The kit
   passed in carries the palette, the architecture style and shared materials. Loaded before places.js. */
(function () {
  "use strict";
  const TAU = Math.PI * 2;

  function build(kind, K, l) {
    const T = K.THREE,
      u = K.u,
      R = K.R;
    const g = new T.Group();
    const A = K.arch;
    const stone = K.mat(K.pal.stone, { rough: 0.85 });
    const trim = K.mat(K.pal.roof, { rough: 0.7, metal: A === "imperial" ? 0.45 : 0.05 });
    const dark = K.mat("#2b2a2e", { rough: 0.6, metal: 0.3 });
    const gold = K.mat("#c9a24a", { rough: 0.32, metal: 0.8 });
    const metal = K.mat("#9da3ab", { rough: 0.4, metal: 0.65 });
    const glass = K.windowMaterial("#ffffff", { win: 1, glass: A === "modern" || A === "crystal" ? "#2a4256" : "#1b1a1e", winCol: K.pal.light });
    const col = l && l.col ? K.mat(l.col, { rough: 0.6 }) : null;
    const main = col || stone;
    function add(geo, m, x, y, z, ry, rx, rz) {
      const o = new T.Mesh(geo, m);
      o.position.set(x || 0, y || 0, z || 0);
      if (ry) o.rotation.y = ry;
      if (rx) o.rotation.x = rx;
      if (rz) o.rotation.z = rz;
      g.add(o);
      return o;
    }
    const box = (w, h, d, m, x, y, z, ry) => add(new T.BoxGeometry(w, h, d).translate(0, h / 2, 0), m, x, y, z, ry);
    const cyl = (rt, rb, h, m, x, y, z, seg) => add(new T.CylinderGeometry(rt, rb, h, seg || 20).translate(0, h / 2, 0), m, x, y, z);
    const cone = (r, h, m, x, y, z, seg) => add(new T.ConeGeometry(r, h, seg || 16).translate(0, h / 2, 0), m, x, y, z);
    const dome = (r, m, x, y, z) => add(new T.SphereGeometry(r, 28, 14, 0, TAU, 0, Math.PI / 2), m, x, y, z);
    const sphere = (r, m, x, y, z) => add(new T.SphereGeometry(r, 24, 16), m, x, y, z);
    const glow = (c, s, x, y, z, op) => {
      const sp = K.sprite(c, s, op == null ? 0.9 : op);
      sp.position.set(x || 0, y || 0, z || 0);
      g.add(sp);
      return sp;
    };
    /* a roof suited to the architecture */
    function roofTop(w, d, y, m) {
      if (A === "gothic" || A === "alien") cone(Math.min(w, d) * 0.55, Math.min(w, d) * 1.6, m || trim, 0, y, 0, 8);
      else if (A === "classical" || A === "rustic" || A === "eastern") add(new T.ConeGeometry(Math.max(w, d) * 0.72, Math.min(w, d) * 0.55, 4).rotateY(Math.PI / 4).scale(w / Math.max(w, d), 1, d / Math.max(w, d)).translate(0, Math.min(w, d) * 0.275, 0), m || trim, 0, y, 0);
      else if (A === "desert" || A === "organic") dome(Math.min(w, d) * 0.5, m || trim, 0, y, 0);
      else if (A === "crystal") add(new T.OctahedronGeometry(Math.min(w, d) * 0.5, 0).scale(1, 2, 1).translate(0, Math.min(w, d) * 0.9, 0), K.mat("#d8ecff", { emis: "#4a7aaa", ei: 0.5, rough: 0.15, metal: 0.3 }), 0, y, 0);
      else box(w * 0.6, Math.min(w, d) * 0.25, d * 0.6, m || main, 0, y, 0);
    }
    function columns(n, r, h, y, m, rr) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU;
        cyl(rr || u * 0.07, rr || u * 0.08, h, m || stone, Math.cos(a) * r, y || 0, Math.sin(a) * r, 10);
      }
    }
    function crenel(w, d, y, s, m) {
      const n = Math.max(3, Math.round(w / s));
      for (let i = 0; i < n; i++) {
        const x = -w / 2 + (i + 0.5) * (w / n);
        box(s * 0.5, s * 0.5, s * 0.5, m || main, x, y, d / 2);
        box(s * 0.5, s * 0.5, s * 0.5, m || main, x, y, -d / 2);
      }
    }
    function figure(h, m) {
      /* a standing giant: legs, robe, chest, head */
      const s = h / 10;
      cyl(s * 1.4, s * 2.2, s * 5, m, 0, 0, 0, 12);
      cyl(s * 1.5, s * 1.2, s * 3, m, 0, s * 5, 0, 12);
      box(s * 4.2, s * 0.9, s * 1.4, m, 0, s * 7.6, 0);
      sphere(s * 0.9, m, 0, s * 9.1, 0);
      add(new T.CylinderGeometry(s * 0.35, s * 0.35, s * 3.4, 8).translate(0, -s * 1.7, 0), m, s * 2.1, s * 8.2, 0, 0, 0, 0.12);
      add(new T.CylinderGeometry(s * 0.35, s * 0.35, s * 3.4, 8).translate(0, -s * 1.7, 0), m, -s * 2.1, s * 8.2, 0, 0, 0, -0.12);
    }
    function shipHull(len, m, accent) {
      const hg = new T.Group();
      const body = new T.Mesh(new T.CylinderGeometry(len * 0.08, len * 0.12, len, 10).rotateZ(Math.PI / 2), m);
      const nose = new T.Mesh(new T.ConeGeometry(len * 0.08, len * 0.25, 10).rotateZ(-Math.PI / 2).translate(len * 0.62, 0, 0), m);
      const fin1 = new T.Mesh(new T.BoxGeometry(len * 0.3, len * 0.02, len * 0.4).translate(-len * 0.3, 0, 0), accent || m);
      const tower = new T.Mesh(new T.BoxGeometry(len * 0.16, len * 0.1, len * 0.06).translate(-len * 0.1, len * 0.12, 0), accent || m);
      hg.add(body, nose, fin1, tower);
      for (let i = 0; i < 3; i++) {
        const e = K.sprite("#9fd0ff", len * 0.12, 0.8);
        e.position.set(-len * 0.52, (i - 1) * len * 0.05, 0);
        hg.add(e);
      }
      return hg;
    }

    const F = {
      tower() {
        const h = u * (5 + R() * 2);
        cyl(u * 0.55, u * 0.7, h, A === "modern" || A === "crystal" ? glass : main, 0, 0, 0, A === "modern" ? 6 : 16);
        roofTop(u * 1.1, u * 1.1, h);
        if (A === "imperial") cone(u * 0.12, u * 2.4, gold, 0, h + u * 0.4, 0, 8);
      },
      spire() {
        const h = u * (9 + R() * 3);
        cyl(u * 0.9, u * 1.3, u * 1.2, main, 0, 0, 0, 12);
        cyl(u * 0.32, u * 0.7, h * 0.7, A === "modern" || A === "crystal" ? glass : main, 0, u * 1.2, 0, 10);
        cone(u * 0.32, h * 0.45, A === "gothic" ? trim : gold, 0, u * 1.2 + h * 0.7, 0, 10);
        glow(K.pal.light, u * 1.6, 0, u * 1.2 + h * 1.12, 0, 0.6);
      },
      skyscraper() {
        let y = 0,
          w = u * 2.2;
        for (let i = 0; i < 4; i++) {
          const h = u * (3.4 - i * 0.5);
          box(w, h, w * 0.85, glass, 0, y, 0);
          y += h;
          w *= 0.78;
        }
        cyl(u * 0.05, u * 0.05, u * 2.4, metal, 0, y, 0, 6);
        glow("#ff4a3a", u * 0.5, 0, y + u * 2.4, 0);
      },
      palace() {
        const W = u * 6,
          D = u * 3.6;
        box(W, u * 0.5, D + u * 1.4, stone, 0, 0, 0);
        box(W, u * 1.8, D, main, 0, u * 0.5, 0);
        box(W * 0.44, u * 1.4, D * 0.7, main, 0, u * 2.3, 0);
        if (A === "eastern") {
          for (let i = 0; i < 3; i++) add(new T.ConeGeometry(W * (0.32 - i * 0.07), u * 0.9, 4).rotateY(Math.PI / 4).translate(0, u * 0.45, 0), trim, 0, u * (3.7 + i * 0.9), 0);
        } else {
          dome(u * 1.1, A === "imperial" || A === "classical" ? gold : trim, 0, u * 3.7, 0);
          [-1, 1].forEach(s => {
            box(u * 1.2, u * 3.2, u * 1.2, main, s * W * 0.45, u * 0.5, 0);
            roofTop(u * 1.2, u * 1.2, u * 3.7);
          });
        }
        for (let i = 0; i < 9; i++) cyl(u * 0.08, u * 0.08, u * 1.6, stone, -W * 0.3 + i * W * 0.075, u * 0.5, D / 2 + u * 0.15, 8);
        box(W * 0.9, u * 0.05, u * 3, K.mat("#4f7a3a", { rough: 1 }), 0, u * 0.5, D / 2 + u * 2.2);
      },
      citadel() {
        let y = 0,
          w = u * 6;
        for (let i = 0; i < 4; i++) {
          const h = u * (1.2 + i * 0.3);
          box(w, h, w, i % 2 ? main : stone, 0, y, 0);
          if (i < 3) crenel(w, w, y + h, u * 0.4);
          y += h;
          w *= 0.7;
        }
        [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ].forEach(([a, b]) => {
          cyl(u * 0.45, u * 0.55, y * 0.9, main, a * u * 2.7, 0, b * u * 2.7, 10);
          roofTop(u * 0.9, u * 0.9, y * 0.9);
        });
        cyl(u * 0.5, u * 0.6, u * 4, main, 0, y, 0, 12);
        roofTop(u * 1.1, u * 1.1, y + u * 4);
      },
      castle() {
        const w = u * 5;
        [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].forEach(([a, b]) => box(a ? u * 0.5 : w, u * 1.8, b ? u * 0.5 : w, main, (a * w) / 2, 0, (b * w) / 2));
        [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ].forEach(([a, b]) => {
          cyl(u * 0.55, u * 0.6, u * 2.8, main, (a * w) / 2, 0, (b * w) / 2, 12);
          cone(u * 0.7, u * 1.2, trim, (a * w) / 2, u * 2.8, (b * w) / 2, 12);
        });
        box(u * 1.8, u * 3.6, u * 1.8, main, 0, 0, 0);
        crenel(u * 1.8, u * 1.8, u * 3.6, u * 0.35);
      },
      keep() {
        box(u * 2, u * 4.5, u * 2, main, 0, 0, 0);
        crenel(u * 2, u * 2, u * 4.5, u * 0.4);
        box(u * 0.6, u * 0.9, u * 0.1, dark, 0, 0, u * 1.01);
      },
      wall() {
        for (let i = -3; i <= 3; i++) {
          box(u * 1.6, u * 1.6, u * 0.6, main, i * u * 1.6, 0, 0);
          if (i % 2 === 0) cyl(u * 0.45, u * 0.5, u * 2.4, main, i * u * 1.6, 0, 0, 10);
        }
        crenel(u * 11, u * 0.6, u * 1.6, u * 0.4);
      },
      gate() {
        [-1, 1].forEach(s => {
          box(u * 1.3, u * 3.6, u * 1.3, main, s * u * 1.4, 0, 0);
          roofTop(u * 1.3, u * 1.3, u * 3.6);
        });
        box(u * 4.1, u * 0.9, u * 1.1, main, 0, u * 2.3, 0);
        box(u * 1.5, u * 2.2, u * 0.2, K.mat("#3a2a1e"), 0, 0, 0);
        box(u * 10, u * 1.8, u * 0.6, stone, u * 6.8, 0, 0);
        box(u * 10, u * 1.8, u * 0.6, stone, -u * 6.8, 0, 0);
      },
      arch() {
        [-1, 1].forEach(s => box(u * 1.1, u * 3.6, u * 1.2, main, s * u * 1.5, 0, 0));
        box(u * 4.2, u * 1.2, u * 1.3, main, 0, u * 3.6, 0);
        box(u * 3.2, u * 0.6, u * 0.6, gold, 0, u * 4.8, 0);
      },
      bridge() {
        const L = u * 12;
        box(L, u * 0.25, u * 1.2, main, 0, u * 1.6, 0);
        [-1, 0, 1].forEach(s => box(u * 0.5, u * 1.6, u * 1, stone, s * L * 0.3, 0, 0));
        [-1, 1].forEach(s => {
          cyl(u * 0.1, u * 0.12, u * 4, metal, s * L * 0.3, u * 1.6, u * 0.55, 6);
          cyl(u * 0.1, u * 0.12, u * 4, metal, s * L * 0.3, u * 1.6, -u * 0.55, 6);
        });
      },
      dome() {
        cyl(u * 2.2, u * 2.3, u * 1.4, main, 0, 0, 0, 32);
        dome(u * 2.2, A === "crystal" || A === "modern" ? K.mat("#bfe2ff", { op: 0.4, rough: 0.05, metal: 0.4, ds: true }) : trim, 0, u * 1.4, 0);
        cyl(u * 0.25, u * 0.3, u * 0.8, gold, 0, u * 3.6, 0, 12);
      },
      temple() {
        box(u * 4.6, u * 0.5, u * 3, stone, 0, 0, 0);
        box(u * 3.8, u * 2.2, u * 2.2, main, 0, u * 0.5, 0);
        for (let i = 0; i < 8; i++) {
          cyl(u * 0.13, u * 0.15, u * 2.2, stone, -u * 1.9 + i * u * 0.54, u * 0.5, u * 1.3, 10);
          cyl(u * 0.13, u * 0.15, u * 2.2, stone, -u * 1.9 + i * u * 0.54, u * 0.5, -u * 1.3, 10);
        }
        if (A === "eastern") for (let i = 0; i < 3; i++) add(new T.ConeGeometry(u * (2.8 - i * 0.6), u * 0.8, 4).rotateY(Math.PI / 4).translate(0, u * 0.4, 0), trim, 0, u * (2.7 + i * 0.8), 0);
        else if (A === "desert" || A === "organic" || A === "alien") dome(u * 1.3, trim, 0, u * 2.7, 0);
        else add(new T.CylinderGeometry(u * 1.4, u * 1.4, u * 4.2, 3, 1).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).scale(1, 0.38, 1).translate(0, u * 0.45, 0), trim, 0, u * 2.7, 0);
        glow(K.pal.light, u * 1.2, 0, u * 1.5, u * 1.6, 0.5);
      },
      cathedral() {
        box(u * 6, u * 3.2, u * 2.2, main, 0, 0, 0);
        add(new T.ConeGeometry(u * 1.55, u * 1.6, 4).rotateY(Math.PI / 4).scale(2.7, 1, 1).translate(0, u * 0.8, 0), trim, 0, u * 3.2, 0);
        [-1, 1].forEach(s => {
          box(u * 1.1, u * 6, u * 1.1, main, u * 3.2, 0, s * u * 0.9);
          cone(u * 0.62, u * 4.2, trim, u * 3.2, u * 6, s * u * 0.9, 8);
        });
        cone(u * 0.5, u * 3.2, trim, -u * 1.2, u * 3.2, 0, 8);
        add(new T.CircleGeometry(u * 0.7, 24), K.mat(K.pal.light, { emis: K.pal.light, ei: 0.8 }), u * 3.76, u * 3.6, 0, Math.PI / 2);
        for (let i = 0; i < 6; i++) box(u * 0.15, u * 2.6, u * 0.6, stone, -u * 2.5 + i * u, 0, u * 1.25);
      },
      pyramid() {
        add(new T.ConeGeometry(u * 3.6, u * 4.4, 4).rotateY(Math.PI / 4).translate(0, u * 2.2, 0), col || K.mat("#d2bb8a", { rough: 0.95 }), 0, 0, 0);
        add(new T.ConeGeometry(u * 0.36, u * 0.44, 4).rotateY(Math.PI / 4).translate(0, u * 0.22, 0), gold, 0, u * 3.96, 0);
      },
      ziggurat() {
        let w = u * 6;
        for (let i = 0; i < 5; i++) {
          box(w, u * 0.9, w, i % 2 ? main : stone, 0, i * u * 0.9, 0);
          w *= 0.76;
        }
        box(u * 0.6, u * 4.5, u * 1.4, stone, 0, 0, u * 2.6);
        box(w, u * 1.2, w, trim, 0, u * 4.5, 0);
      },
      obelisk() {
        add(new T.CylinderGeometry(u * 0.3, u * 0.55, u * 7, 4).rotateY(Math.PI / 4).translate(0, u * 3.5, 0), main, 0, u * 0.4, 0);
        add(new T.ConeGeometry(u * 0.42, u * 0.8, 4).rotateY(Math.PI / 4).translate(0, u * 0.4, 0), gold, 0, u * 7.4, 0);
        box(u * 1.6, u * 0.4, u * 1.6, stone, 0, 0, 0);
      },
      statue() {
        box(u * 1.8, u * 1.2, u * 1.8, stone, 0, 0, 0);
        const g2 = new T.Group();
        const before = g.children.length;
        figure(u * 6, col || (A === "imperial" ? gold : K.mat("#b8b2a6", { rough: 0.6, metal: 0.2 })));
        g.children.splice(before).forEach(o => {
          o.position.y += u * 1.2;
          g2.add(o);
        });
        g.add(g2);
      },
      monolith() {
        box(u * 1.3, u * 5.2, u * 0.5, col || K.mat("#121214", { rough: 0.15, metal: 0.4 }), 0, 0, 0);
        glow("#9fb8ff", u * 2, 0, u * 2.6, u * 0.4, 0.15);
      },
      arena() {
        const g0 = new T.CylinderGeometry(u * 4.4, u * 4.6, u * 2.4, 48, 1, true).translate(0, u * 1.2, 0);
        add(g0, K.mat(K.pal.stone, { rough: 0.85, ds: true }), 0, 0, 0).scale.z = 0.78;
        for (let i = 0; i < 4; i++) {
          const t = add(new T.CylinderGeometry(u * (4.3 - i * 0.55), u * (3.7 - i * 0.55), u * 0.5, 48, 1, true).translate(0, u * 0.25, 0), K.mat(K.pal.stone, { rough: 0.9, ds: true }), 0, u * (1.8 - i * 0.45), 0);
          t.scale.z = 0.78;
        }
        const fl = add(new T.CircleGeometry(u * 2.2, 40).rotateX(-Math.PI / 2), K.mat("#c9b48a", { rough: 1 }), 0, u * 0.05, 0);
        fl.scale.z = 0.78;
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * TAU;
          box(u * 0.3, u * 2.6, u * 0.3, stone, Math.cos(a) * u * 4.5, 0, Math.sin(a) * u * 4.5 * 0.78);
        }
      },
      library() {
        box(u * 6, u * 2.4, u * 3.4, main, 0, 0, 0);
        for (let i = 0; i < 10; i++) cyl(u * 0.11, u * 0.12, u * 2.4, stone, -u * 2.7 + i * u * 0.6, 0, u * 1.85, 10);
        box(u * 6.2, u * 0.4, u * 3.9, stone, 0, u * 2.4, 0);
        cyl(u * 1.3, u * 1.4, u * 1, main, 0, u * 2.8, 0, 28);
        dome(u * 1.3, trim, 0, u * 3.8, 0);
        [-1, 1].forEach(s => box(u * 1.6, u * 3, u * 2.6, main, s * u * 3.6, 0, -u * 0.2));
      },
      hall() {
        box(u * 4.6, u * 1.6, u * 2.2, main, 0, 0, 0);
        add(new T.ConeGeometry(u * 1.6, u * 1.1, 4).rotateY(Math.PI / 4).scale(2.1, 1, 1).translate(0, u * 0.55, 0), trim, 0, u * 1.6, 0);
        box(u * 0.8, u * 1.1, u * 0.1, dark, 0, 0, u * 1.11);
      },
      house() {
        box(u * 1.6, u * 1.1, u * 1.2, main, 0, 0, 0);
        roofTop(u * 1.6, u * 1.2, u * 1.1);
        cyl(u * 0.1, u * 0.12, u * 0.6, stone, u * 0.5, u * 1.1, 0, 6);
      },
      market() {
        const cs = ["#b84a3a", "#c9a24a", "#3a6a8a", "#5a8a4a", "#8a4a7a"];
        for (let i = 0; i < 22; i++) {
          const a = R() * TAU,
            r = u * (0.6 + R() * 2.4);
          const x = Math.cos(a) * r,
            z = Math.sin(a) * r;
          box(u * 0.5, u * 0.45, u * 0.5, K.mat("#6a5440"), x, 0, z);
          add(new T.ConeGeometry(u * 0.5, u * 0.3, 4).rotateY(Math.PI / 4).translate(0, u * 0.15, 0), K.mat(cs[i % cs.length], { rough: 1 }), x, u * 0.6, z);
        }
        cyl(u * 0.5, u * 0.6, u * 0.4, stone, 0, 0, 0, 16);
      },
      plaza() {
        cyl(u * 3.2, u * 3.2, u * 0.08, K.mat(K.pal.pave, { rough: 0.9 }), 0, 0, 0, 40);
        cyl(u * 0.8, u * 0.9, u * 0.35, stone, 0, u * 0.08, 0, 24);
        cyl(u * 0.7, u * 0.7, u * 0.06, K.mat(K.pal.water, { rough: 0.1, metal: 0.2 }), 0, u * 0.35, 0, 24);
        cyl(u * 0.08, u * 0.12, u * 1.2, stone, 0, u * 0.4, 0, 8);
      },
      garden() {
        cyl(u * 3, u * 3, u * 0.06, K.mat("#4f7a3a", { rough: 1 }), 0, 0, 0, 36);
        for (let i = 0; i < 26; i++) {
          const a = R() * TAU,
            r = u * (0.4 + R() * 2.4);
          const s = u * (0.25 + R() * 0.35);
          add(new T.IcosahedronGeometry(s, 0).translate(0, s, 0), K.mat(["#3f6a33", "#5a8a42", "#a8526a", "#c9a24a"][i % 4], { rough: 0.9, flat: true }), Math.cos(a) * r, 0, Math.sin(a) * r);
        }
        cyl(u * 0.5, u * 0.5, u * 0.05, K.mat(K.pal.water, { rough: 0.1 }), 0, u * 0.06, 0, 24);
      },
      tree() {
        cyl(u * 0.35, u * 0.6, u * 4, K.mat("#5a4030", { rough: 1 }), 0, 0, 0, 10);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU;
          add(new T.IcosahedronGeometry(u * (1.3 + R() * 0.6), 1), K.mat(col ? l.col : "#3f6a33", { rough: 0.95, flat: true }), Math.cos(a) * u * 1.2, u * (4 + R() * 1.6), Math.sin(a) * u * 1.2);
        }
        add(new T.IcosahedronGeometry(u * 1.8, 1), K.mat(col ? l.col : "#4a7a3a", { rough: 0.95, flat: true }), 0, u * 5.6, 0);
      },
      grove() {
        for (let i = 0; i < 18; i++) {
          const a = R() * TAU,
            r = u * (0.5 + R() * 2.6),
            s = u * (0.5 + R() * 0.6);
          cyl(s * 0.12, s * 0.18, s * 2, K.mat("#4a3524"), Math.cos(a) * r, 0, Math.sin(a) * r, 6);
          add(new T.ConeGeometry(s, s * 2.6, 7).translate(0, s * 1.3, 0), K.mat(col ? l.col : "#3a5a30", { rough: 0.9 }), Math.cos(a) * r, s * 1.4, Math.sin(a) * r);
        }
      },
      cave() {
        const rock = K.mat(K.pal.high, { rough: 1, flat: true });
        const m = add(new T.DodecahedronGeometry(u * 3, 1), rock, 0, u * 0.6, 0);
        m.scale.set(1.4, 0.75, 1.1);
        add(new T.CircleGeometry(u * 1.1, 24, 0, Math.PI), K.mat("#050403", { rough: 1 }), 0, 0, u * 3.12);
        glow(K.pal.light, u * 1.2, 0, u * 0.5, u * 3.3, 0.6);
      },
      mine() {
        box(u * 0.2, u * 4, u * 0.2, metal, -u * 0.8, 0, -u * 0.8);
        box(u * 0.2, u * 4, u * 0.2, metal, u * 0.8, 0, -u * 0.8);
        box(u * 0.2, u * 4, u * 0.2, metal, 0, 0, u * 0.8);
        cyl(u * 0.6, u * 0.6, u * 0.2, dark, 0, u * 4, 0, 16);
        add(new T.CircleGeometry(u * 1.4, 24).rotateX(-Math.PI / 2), K.mat("#0a0908"), 0, u * 0.05, 0);
        box(u * 2, u * 1.4, u * 1.4, K.mat("#6a5a4a"), u * 2.4, 0, 0);
      },
      well() {
        cyl(u * 0.7, u * 0.75, u * 0.5, stone, 0, 0, 0, 16);
        cyl(u * 0.55, u * 0.55, u * 0.05, K.mat(K.pal.water, { rough: 0.1 }), 0, u * 0.4, 0, 16);
        [-1, 1].forEach(s => box(u * 0.08, u * 1.2, u * 0.08, K.mat("#5a4030"), s * u * 0.6, u * 0.5, 0));
        box(u * 1.4, u * 0.1, u * 0.1, K.mat("#5a4030"), 0, u * 1.7, 0);
      },
      crater() {
        add(new T.CircleGeometry(u * 3, 40).rotateX(-Math.PI / 2), K.mat("#141110", { rough: 1, op: 0.8 }), 0, 0.6, 0);
        add(new T.TorusGeometry(u * 3, u * 0.4, 8, 40).rotateX(Math.PI / 2).scale(1, 0.4, 1), K.mat(K.pal.ground2 || "#7a6a5a", { rough: 1 }), 0, 0, 0);
      },
      lake() {
        /* the water itself comes from the place (the ground is carved and flooded); this is the stone rim */
        for (let i = 0; i < 26; i++) {
          const a = (i / 26) * TAU;
          add(new T.DodecahedronGeometry(u * (0.25 + R() * 0.25), 0), K.mat(K.pal.high, { rough: 1, flat: true }), Math.cos(a) * u * 4.1, 0, Math.sin(a) * u * 4.1);
        }
      },
      dock() {
        for (let i = 0; i < 4; i++) {
          box(u * 0.6, u * 0.2, u * 5, K.mat("#5a4a3a"), -u * 2.4 + i * u * 1.6, u * 0.1, u * 3);
          for (let k = 0; k < 4; k++) cyl(u * 0.07, u * 0.07, u * 1, K.mat("#3a2e24"), -u * 2.4 + i * u * 1.6, -u * 0.8, u * (1 + k * 1.4), 6);
        }
        box(u * 1.2, u * 3.5, u * 0.3, metal, u * 3.6, 0, u * 1.5);
        box(u * 0.3, u * 0.3, u * 3, metal, u * 3.6, u * 3.5, u * 2.6);
        box(u * 3, u * 1.2, u * 1.6, main, 0, 0, -u * 0.4);
        const sh = shipHull(u * 3, K.mat("#6a5a4a"), trim);
        sh.position.set(0, u * 0.2, u * 5.6);
        g.add(sh);
      },
      pad() {
        cyl(u * 2.6, u * 2.6, u * 0.2, K.mat("#3a3d42", { rough: 0.8 }), 0, 0, 0, 40);
        add(new T.RingGeometry(u * 1.9, u * 2.05, 48).rotateX(-Math.PI / 2), K.mat("#e8c24a", { emis: "#e8c24a", ei: 0.6 }), 0, u * 0.21, 0);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * TAU;
          glow("#ffcf6a", u * 0.5, Math.cos(a) * u * 2.5, u * 0.3, Math.sin(a) * u * 2.5, 0.9);
        }
        const sh = shipHull(u * 3.4, metal, trim);
        sh.position.set(0, u * 0.7, 0);
        sh.rotation.y = R() * TAU;
        g.add(sh);
        box(u * 0.6, u * 2.6, u * 0.6, glass, u * 3.6, 0, u * 1.4);
      },
      ship() {
        const sh = shipHull(u * 7, K.mat(l && l.col ? l.col : "#8e939a", { metal: 0.65, rough: 0.4 }), trim);
        sh.position.set(0, u * 1.1, 0);
        g.add(sh);
        [-1, 1].forEach(s => box(u * 0.2, u * 0.8, u * 0.2, metal, s * u * 1.5, 0, u * 0.4));
      },
      wreck() {
        const m = K.mat("#3c3a3b", { metal: 0.55, rough: 0.6 });
        const a = shipHull(u * 4, m, dark);
        a.position.set(-u * 1.2, u * 0.5, 0);
        a.rotation.set(0.2, 0.3, -0.35);
        const b = shipHull(u * 3, m, dark);
        b.position.set(u * 2.2, u * 0.2, u * 1);
        b.rotation.set(-0.4, 2.4, 0.5);
        g.add(a, b);
        for (let i = 0; i < 10; i++) add(new T.BoxGeometry(u * (0.2 + R() * 0.6), u * 0.15, u * (0.2 + R() * 0.8)), m, (R() - 0.5) * u * 7, 0, (R() - 0.5) * u * 7, R() * TAU, R(), R());
        glow("#ff6a2a", u * 1.2, -u * 0.6, u * 0.8, 0, 0.35);
      },
      station() {
        const s = new T.Group();
        s.add(new T.Mesh(new T.TorusGeometry(u * 2.6, u * 0.3, 12, 64).rotateX(Math.PI / 2), glass));
        s.add(new T.Mesh(new T.CylinderGeometry(u * 0.5, u * 0.5, u * 3, 16), metal));
        for (let i = 0; i < 4; i++) {
          const sp = new T.Mesh(new T.BoxGeometry(u * 2.6, u * 0.1, u * 0.12).translate(u * 1.3, 0, 0), metal);
          sp.rotation.y = (i / 4) * TAU;
          s.add(sp);
        }
        s.position.y = K.space ? 0 : u * 9;
        g.add(s);
        if (!K.space) glow(K.pal.light, u * 2.5, 0, u * 9, 0, 0.4);
      },
      ring() {
        const r = add(new T.TorusGeometry(u * 3.2, u * 0.45, 16, 72), K.mat(l && l.col ? l.col : "#8a8f98", { metal: 0.7, rough: 0.35 }), 0, u * 3.6, 0);
        r.castShadow = true;
        glow(K.pal.light, u * 2.2, 0, u * 3.6, 0, 0.3);
      },
      tomb() {
        box(u * 3, u * 0.5, u * 3, stone, 0, 0, 0);
        box(u * 2.2, u * 2, u * 2.2, col || main, 0, u * 0.5, 0);
        if (A === "crystal" || A === "alien") add(new T.OctahedronGeometry(u * 1.2, 0).scale(1, 1.8, 1).translate(0, u * 2, 0), K.mat("#bfe6c8", { op: 0.75, rough: 0.1, metal: 0.2, emis: "#2a6a4a", ei: 0.4 }), 0, u * 2.5, 0);
        else add(new T.ConeGeometry(u * 1.6, u * 1.3, 4).rotateY(Math.PI / 4).translate(0, u * 0.65, 0), trim, 0, u * 2.5, 0);
        box(u * 0.7, u * 1.2, u * 0.1, dark, 0, u * 0.5, u * 1.11);
      },
      ruin() {
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * TAU;
          const h = u * (0.6 + R() * 3);
          cyl(u * 0.2, u * 0.22, h, stone, Math.cos(a) * u * 2.2, 0, Math.sin(a) * u * 2.2, 10);
        }
        box(u * 3.4, u * 1.4, u * 0.4, main, 0, 0, -u * 1.4, 0.1);
        box(u * 1.6, u * 2.4, u * 0.4, main, -u * 1.4, 0, u * 0.6, 1.2);
        for (let i = 0; i < 14; i++) add(new T.DodecahedronGeometry(u * (0.15 + R() * 0.3), 0), stone, (R() - 0.5) * u * 5, 0, (R() - 0.5) * u * 5);
      },
      camp() {
        const tc = ["#c8b28a", "#8a6a4a", "#9a3a2e", "#7a8a5a"];
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * TAU;
          add(new T.ConeGeometry(u * 0.55, u * 0.8, 4).rotateY(Math.PI / 4).translate(0, u * 0.4, 0), K.mat(tc[i % 4], { rough: 1 }), Math.cos(a) * u * 2.2, 0, Math.sin(a) * u * 2.2);
        }
        cyl(u * 0.4, u * 0.45, u * 0.15, dark, 0, 0, 0, 12);
        glow("#ff8a3a", u * 1.4, 0, u * 0.4, 0, 0.9);
      },
      tent() {
        add(new T.ConeGeometry(u * 2.2, u * 2.6, 8).translate(0, u * 1.3, 0), K.mat(l && l.col ? l.col : "#c8b28a", { rough: 1 }), 0, 0, 0);
        cyl(u * 0.05, u * 0.05, u * 0.8, K.mat("#5a4030"), 0, u * 2.6, 0, 6);
      },
      farm() {
        const fc = ["#9aa64a", "#c9b45a", "#6e8a3a", "#a87a3a"];
        for (let i = 0; i < 6; i++) box(u * 2.4, u * 0.04, u * 1.6, K.mat(fc[i % 4], { rough: 1 }), ((i % 3) - 1) * u * 2.6, 0, (i < 3 ? -1 : 1) * u * 0.9);
        box(u * 1.4, u * 1, u * 1, K.mat("#8a3a2e"), u * 4.4, 0, 0);
        roofTop(u * 1.4, u * 1, u * 1);
        cyl(u * 0.35, u * 0.35, u * 1.8, metal, u * 5.5, 0, u * 0.6, 12);
      },
      lighthouse() {
        cyl(u * 0.45, u * 0.8, u * 6, K.mat("#e8e2d6"), 0, 0, 0, 16);
        cyl(u * 0.5, u * 0.5, u * 0.7, glass, 0, u * 6, 0, 12);
        cone(u * 0.6, u * 0.6, trim, 0, u * 6.7, 0, 12);
        glow("#fff2c8", u * 3, 0, u * 6.35, 0, 0.9);
      },
      mast() {
        cyl(u * 0.08, u * 0.3, u * 9, metal, 0, 0, 0, 4);
        for (let i = 1; i < 5; i++) box(u * 0.9 - i * u * 0.12, u * 0.06, u * 0.06, metal, 0, i * u * 1.8, 0);
        glow("#ff3a2a", u * 0.7, 0, u * 9, 0);
      },
      reactor() {
        add(new T.CylinderGeometry(u * 1.5, u * 2.2, u * 4.5, 32, 1, true).translate(0, u * 2.25, 0), K.mat("#bdbab4", { rough: 0.9, ds: true }), 0, 0, 0);
        sphere(u * 1.4, K.mat("#cfd3d8", { metal: 0.4, rough: 0.4 }), u * 3.2, u * 1.4, 0);
        glow("#9fd0ff", u * 2.2, u * 3.2, u * 1.4, 0, 0.25);
      },
      factory() {
        box(u * 5, u * 1.6, u * 3, K.mat("#6f6b63", { rough: 0.9 }), 0, 0, 0);
        for (let i = 0; i < 4; i++) add(new T.CylinderGeometry(u * 0.9, u * 0.9, u * 5, 3, 1).rotateZ(Math.PI / 2).scale(0.12, 0.6, 1).translate(0, u * 0.3, 0), dark, -u * 1.9 + i * u * 1.25, u * 1.6, 0);
        for (let i = 0; i < 3; i++) cyl(u * 0.18, u * 0.24, u * 4.2, K.mat("#5a524a"), u * 2.8, 0, -u * 1 + i * u, 10);
        cyl(u * 0.8, u * 0.8, u * 1.6, metal, -u * 3.4, 0, u * 1.2, 16);
      },
      beacon() {
        cyl(u * 0.2, u * 0.4, u * 5, metal, 0, 0, 0, 8);
        sphere(u * 0.5, K.mat(K.pal.light, { emis: K.pal.light, ei: 1.2 }), 0, u * 5.4, 0);
        glow(K.pal.light, u * 4, 0, u * 5.4, 0, 0.8);
      },
      portal() {
        add(new T.TorusGeometry(u * 2.2, u * 0.3, 12, 48), K.mat("#3a3a44", { metal: 0.6, rough: 0.3 }), 0, u * 2.6, 0);
        add(new T.CircleGeometry(u * 2, 40), K.glowMat(l && l.col ? l.col : "#7ab8ff", 0.45), 0, u * 2.6, 0);
        box(u * 3, u * 0.4, u * 1.4, stone, 0, 0, 0);
      },
      stones() {
        for (let i = 0; i < 11; i++) {
          const a = (i / 11) * TAU;
          box(u * 0.5, u * (1.6 + R() * 0.8), u * 0.35, K.mat("#8a8478", { rough: 1 }), Math.cos(a) * u * 2.4, 0, Math.sin(a) * u * 2.4, -a);
        }
        box(u * 0.9, u * 0.5, u * 0.6, K.mat("#8a8478"), 0, 0, 0);
      },
      peak() {
        const m = add(new T.ConeGeometry(u * 6, u * 9, 9, 3), K.mat(K.pal.high, { rough: 1, flat: true }), 0, u * 4.5, 0);
        const p = m.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) if (p.getY(i) > -u * 4.4 && p.getY(i) < u * 4.4) p.setX(i, p.getX(i) * (0.85 + R() * 0.3));
        m.geometry.computeVertexNormals();
        add(new T.ConeGeometry(u * 2, u * 2.4, 9), K.mat("#eef2f6", { rough: 0.8, flat: true }), 0, u * 7.8, 0);
      },
      cliff() {
        const m = add(new T.BoxGeometry(u * 10, u * 5, u * 2, 10, 5, 1).translate(0, u * 2.5, 0), K.mat(K.pal.high, { rough: 1, flat: true }), 0, 0, 0);
        const p = m.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + (R() - 0.5) * u * 0.8);
        m.geometry.computeVertexNormals();
      },
      throne() {
        box(u * 3.2, u * 0.4, u * 3.2, stone, 0, 0, 0);
        box(u * 2.4, u * 0.4, u * 2.4, stone, 0, u * 0.4, 0);
        box(u * 1, u * 0.6, u * 0.9, col || gold, 0, u * 0.8, 0);
        box(u * 1, u * 2.4, u * 0.25, col || gold, 0, u * 0.8, -u * 0.35);
        columns(6, u * 2, u * 3, 0, stone, u * 0.12);
      },
      shrine() {
        box(u * 1.4, u * 0.3, u * 1.4, stone, 0, 0, 0);
        columns(4, u * 0.55, u * 1.3, u * 0.3, stone, u * 0.07);
        roofTop(u * 1.3, u * 1.3, u * 1.6);
        glow(K.pal.light, u * 1.2, 0, u * 0.9, 0, 0.7);
      },
    };
    (F[kind] || F.tower)();
    return g;
  }

  window.AtlasPlacesLM = { build };
})();
