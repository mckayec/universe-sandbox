/* Atlas places: event effects (PACK_FORMAT 21, event `fx`). Each effect is placed at a landmark (`a.p`,
   size `a.s`) in the current place `P` and returns {dur, upd(dt, t), end()}; places.js runs and disposes it. */
(function () {
  "use strict";
  function create(K) {
    const { THREE, Particles, sprite, glowMat, mat, C, cam, SMALL, ease, clamp, TAU } = K;
    const _v = new THREE.Vector3(),
      _v2 = new THREE.Vector3();
    const FX = {
      fire(a, P) {
        const pp = Particles(SMALL ? 260 : 520, {}),
          sm = Particles(SMALL ? 120 : 240, { normal: true, puff: true, op: 0.6 });
        P.root.add(pp.obj, sm.obj);
        const L = new THREE.PointLight(0xff7a30, 3, a.s * 12, 1.6);
        L.position.copy(a.p).add(_v.set(0, a.s, 0));
        P.root.add(L);
        const fc = [C("#ffd27a"), C("#ff7a2a"), C("#ff4a1a")],
          scol = C("#3c3834"),
          R = P.R;
        return {
          dur: 11,
          upd(dt, t) {
            const on = t < 9;
            for (let i = 0; on && i < 8; i++)
              pp.emit(_v.copy(a.p).add(_v2.set((R() - 0.5) * a.s * 2.4, a.s * 0.3, (R() - 0.5) * a.s * 2.4)), new THREE.Vector3((R() - 0.5) * 6, 18 + R() * 30, (R() - 0.5) * 6), 0.7 + R() * 0.6, a.s * 0.5, a.s * 0.15, fc[(R() * 3) | 0]);
            if (on && R() < 0.6) sm.emit(_v.copy(a.p).add(_v2.set((R() - 0.5) * a.s, a.s * 1.2, (R() - 0.5) * a.s)), new THREE.Vector3(5, 22 + R() * 10, 2), 7, a.s * 0.5, a.s * 2.6, scol);
            pp.update(dt, -6, 0.6);
            sm.update(dt, -1, 0.9);
            L.intensity = on ? 2.4 + Math.sin(t * 23) * 0.6 + Math.sin(t * 37) * 0.4 : Math.max(0, L.intensity - dt * 2);
          },
          end() {
            P.root.remove(pp.obj, sm.obj, L);
            pp.dispose();
            sm.dispose();
          },
        };
      },
      battle(a, P) {
        const n = SMALL ? 40 : 90;
        const lg = new THREE.BufferGeometry();
        const lp = new Float32Array(n * 6);
        lg.setAttribute("position", new THREE.BufferAttribute(lp, 3));
        const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: C("#ffb060"), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
        lines.frustumCulled = false;
        const fl = Particles(300, {}),
          sm = Particles(160, { normal: true, puff: true, op: 0.5 });
        P.root.add(lines, fl.obj, sm.obj);
        const R = P.R,
          rad = a.s * 6;
        const tr = [];
        for (let i = 0; i < n; i++) tr.push({ a: new THREE.Vector3(), b: new THREE.Vector3(), t: R() * 2, k: 0, c: R() < 0.5 });
        const col = [C("#ffb060"), C("#9fd0ff")];
        return {
          dur: 12,
          upd(dt, t) {
            const on = t < 10;
            tr.forEach((q, i) => {
              q.t -= dt;
              if (q.t <= 0 && on) {
                q.t = 0.25 + R() * 0.8;
                q.k = 0;
                const ang = R() * TAU;
                q.a.set(a.p.x + Math.cos(ang) * rad, a.p.y + 4 + R() * a.s, a.p.z + Math.sin(ang) * rad);
                q.b.set(a.p.x - Math.cos(ang) * rad * R(), a.p.y + 2 + R() * a.s * 0.5, a.p.z - Math.sin(ang) * rad * R());
              }
              q.k = Math.min(1, q.k + dt * 3.2);
              const h1 = _v.lerpVectors(q.a, q.b, q.k),
                h0 = _v2.lerpVectors(q.a, q.b, Math.max(0, q.k - 0.18));
              lp.set([h0.x, h0.y, h0.z, h1.x, h1.y, h1.z], i * 6);
              if (q.k >= 1 && on && R() < 0.3) {
                fl.emit(q.b, _v.set(0, 0, 0), 0.35, a.s * 1.6, a.s * 0.2, col[q.c ? 0 : 1]);
                if (R() < 0.3) sm.emit(q.b, _v.set(2, 6, 1), 5, a.s * 0.4, a.s * 1.8, C("#3e3a36"));
                q.k = 2;
              }
            });
            lg.attributes.position.needsUpdate = true;
            lines.material.opacity = on ? 0.9 : Math.max(0, lines.material.opacity - dt);
            fl.update(dt);
            sm.update(dt, -0.3, 0.9);
          },
          end() {
            P.root.remove(lines, fl.obj, sm.obj);
            lg.dispose();
            lines.material.dispose();
            fl.dispose();
            sm.dispose();
          },
        };
      },
      bombard(a, P) {
        const R = P.R;
        const beams = [];
        const fl = Particles(400, {}),
          sm = Particles(220, { normal: true, puff: true, op: 0.6 });
        P.root.add(fl.obj, sm.obj);
        const bm = glowMat("#ffd9a0", 0.9);
        for (let i = 0; i < 12; i++) {
          const b = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true).translate(0, 0.5, 0), bm);
          b.visible = false;
          P.root.add(b);
          beams.push({ m: b, t: 1 + i * 0.7 + R() * 0.5, life: 0 });
        }
        return {
          dur: 13,
          upd(dt, t) {
            beams.forEach(b => {
              b.t -= dt;
              if (b.t <= 0 && b.life <= 0 && t < 10) {
                b.life = 0.6;
                const x = a.p.x + (R() - 0.5) * a.s * 10,
                  z = a.p.z + (R() - 0.5) * a.s * 10,
                  y = P.sc.space ? a.p.y : Math.max(P.H(x, z), 0);
                b.m.position.set(x, y, z);
                b.m.scale.set(a.s * 0.12, 9000, a.s * 0.12);
                b.m.visible = true;
                for (let k = 0; k < 40; k++) fl.emit(_v.set(x, y + 4, z), _v2.set((R() - 0.5) * 120, 40 + R() * 160, (R() - 0.5) * 120), 0.8 + R() * 0.6, a.s * 0.6, a.s * 0.1, C(k % 2 ? "#ffcf7a" : "#ff6a2a"));
                for (let k = 0; k < 6; k++) sm.emit(_v.set(x, y + 10, z), _v2.set((R() - 0.5) * 20, 20 + R() * 20, (R() - 0.5) * 20), 8, a.s, a.s * 4, C("#2f2b28"));
                P.shake = Math.max(P.shake || 0, 0.5);
              }
              if (b.life > 0) {
                b.life -= dt;
                b.m.scale.x = b.m.scale.z = a.s * 0.12 * (b.life / 0.6 + 0.2);
                if (b.life <= 0) {
                  b.m.visible = false;
                  b.t = 0.6 + R() * 1.4;
                }
              }
            });
            fl.update(dt, 60, 0.7);
            sm.update(dt, -0.5, 0.9);
          },
          end() {
            beams.forEach(b => {
              P.root.remove(b.m);
              b.m.geometry.dispose();
            });
            bm.dispose();
            P.root.remove(fl.obj, sm.obj);
            fl.dispose();
            sm.dispose();
          },
        };
      },
      blast(a, P) {
        const fb = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), glowMat("#ffd8a0", 1));
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 96).rotateX(-Math.PI / 2), glowMat("#ffe8c8", 0.8));
        const flash = sprite("#fff2dc", 1, 1);
        fb.position.copy(a.p);
        ring.position.copy(a.p).add(_v.set(0, 4, 0));
        flash.position.copy(a.p).add(_v.set(0, a.s * 2, 0));
        const sm = Particles(300, { normal: true, puff: true, op: 0.7 });
        P.root.add(fb, ring, flash, sm.obj);
        const R = P.R;
        P.shake = 1.4;
        return {
          dur: 14,
          upd(dt, t) {
            const k = clamp(t / 2.4, 0, 1);
            fb.scale.setScalar(a.s * (1 + ease(k) * 8));
            fb.material.opacity = 1 - k;
            ring.scale.setScalar(a.s * (1 + t * 26));
            ring.material.opacity = Math.max(0, 0.8 - t * 0.25);
            flash.scale.setScalar(a.s * 60 * Math.max(0, 1 - t * 1.4));
            flash.material.opacity = Math.max(0, 1 - t * 1.2);
            if (t < 6 && R() < 0.8)
              sm.emit(_v.copy(a.p).add(_v2.set((R() - 0.5) * a.s * 2, a.s * (1 + t * 3), (R() - 0.5) * a.s * 2)), new THREE.Vector3((R() - 0.5) * 30, 30 + R() * 20, (R() - 0.5) * 30), 8, a.s * 2, a.s * 7, C(t < 1.5 ? "#7a4a2a" : "#3a3634"));
            sm.update(dt, -1, 0.9);
          },
          end() {
            [fb, ring].forEach(m => {
              P.root.remove(m);
              m.geometry.dispose();
              m.material.dispose();
            });
            P.root.remove(flash, sm.obj);
            flash.material.dispose();
            sm.dispose();
          },
        };
      },
      fleet(a, P) {
        const n = SMALL ? 10 : 22,
          R = P.R;
        const g = new THREE.ConeGeometry(0.3, 1.6, 6).rotateX(Math.PI / 2);
        const im = new THREE.InstancedMesh(g, mat("#8e9299", { metal: 0.6, rough: 0.4 }), n);
        im.frustumCulled = false;
        const glow = Particles(n, {});
        P.root.add(im, glow.obj);
        const S = [];
        for (let i = 0; i < n; i++) S.push({ to: new THREE.Vector3(a.p.x + (R() - 0.5) * a.s * 14, a.p.y + a.s * (6 + R() * 6), a.p.z + (R() - 0.5) * a.s * 14), sc: a.s * (0.8 + R() * 2.5), d: R() * 1.5 });
        const M = new THREE.Matrix4(),
          Q = new THREE.Quaternion();
        Q.setFromEuler(new THREE.Euler(0, R() * TAU, 0));
        return {
          dur: 14,
          upd(dt, t) {
            S.forEach((s, i) => {
              const k = ease(clamp((t - s.d) / 5, 0, 1));
              _v.copy(s.to).add(_v2.set(0, (1 - k) * 6000, -(1 - k) * 3000));
              M.compose(_v, Q, _v2.set(s.sc, s.sc, s.sc));
              im.setMatrixAt(i, M);
              glow.emit(_v.clone().add(_v2.set(0, 0, s.sc * 0.8)), _v2.set(0, 0, 0), 0.05, s.sc * (k < 1 ? 1.4 : 0.7), null, C("#9fd0ff"));
            });
            im.instanceMatrix.needsUpdate = true;
            glow.update(dt);
          },
          end() {
            P.root.remove(im, glow.obj);
            g.dispose();
            glow.dispose();
          },
        };
      },
      storm(a, P) {
        const R = P.R;
        const flash = sprite("#dfe8ff", 1, 0);
        flash.position.copy(a.p).add(_v.set(0, a.s * 20, 0));
        P.root.add(flash);
        const wx = Particles(SMALL ? 900 : 2200, {});
        P.root.add(wx.obj);
        const sand = P.gtype === "desert" || P.sc.weather === "dust";
        const wc = C(sand ? "#cfae7a" : "#b8c8dc");
        const fog0 = P.fog.density;
        return {
          dur: 14,
          upd(dt, t) {
            const k = Math.min(1, t / 2) * Math.min(1, (14 - t) / 2);
            P.fog.density = fog0 * (1 + k * (sand ? 4 : 2));
            for (let i = 0; i < 40; i++)
              wx.emit(_v.copy(cam.position).add(_v2.set((R() - 0.5) * 800, (R() - 0.3) * 500, (R() - 0.5) * 800)), new THREE.Vector3(sand ? 180 : 20, sand ? -10 : -220, sand ? 60 : 10), 2.5, sand ? 7 : 3, null, wc);
            wx.update(dt);
            if (!sand && R() < dt * 0.9) {
              flash.material.opacity = 1;
              flash.scale.setScalar(a.s * 80);
            }
            flash.material.opacity = Math.max(0, flash.material.opacity - dt * 4);
          },
          end() {
            P.fog.density = fog0;
            P.root.remove(flash, wx.obj);
            flash.material.dispose();
            wx.dispose();
          },
        };
      },
      quake(a, P) {
        const R = P.R;
        const sm = Particles(260, { normal: true, puff: true, op: 0.55 });
        P.root.add(sm.obj);
        const c = C(P.pal.ground2);
        return {
          dur: 9,
          upd(dt, t) {
            P.shake = t < 6 ? 0.9 : 0;
            if (t < 6) for (let i = 0; i < 3; i++) {
              const x = a.p.x + (R() - 0.5) * a.s * 16,
                z = a.p.z + (R() - 0.5) * a.s * 16;
              sm.emit(_v.set(x, P.H(x, z) + 3, z), _v2.set((R() - 0.5) * 10, 8 + R() * 10, (R() - 0.5) * 10), 6, a.s * 0.5, a.s * 2.4, c);
            }
            sm.update(dt, -0.3, 0.9);
          },
          end() {
            P.root.remove(sm.obj);
            sm.dispose();
          },
        };
      },
      crowd(a, P) {
        const n = SMALL ? 260 : 700,
          R = P.R;
        const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.3, 1.7, 5).translate(0, 0.85, 0), mat("#ffffff", { emis: "#2a2018", ei: 0.4 }), n);
        im.frustumCulled = false;
        const cols = ["#7a5a4a", "#3a4a6a", "#8a7a5a", "#5a3a3a", "#c8b89a", "#2a2a2a"];
        const S = [];
        for (let i = 0; i < n; i++) {
          const ang = R() * TAU,
            r = a.s * (1.5 + R() * 4);
          S.push({ a: ang, r, w: (R() - 0.5) * 0.08 });
          im.setColorAt(i, C(cols[i % cols.length]));
        }
        P.root.add(im);
        const M = new THREE.Matrix4(),
          Q = new THREE.Quaternion(),
          one = new THREE.Vector3(9, 9, 9);
        return {
          dur: 14,
          upd(dt, t) {
            const k = ease(clamp(t / 3, 0, 1));
            S.forEach((s, i) => {
              s.a += s.w * dt;
              const r = s.r * (2.5 - 1.5 * k);
              const x = a.p.x + Math.cos(s.a) * r,
                z = a.p.z + Math.sin(s.a) * r;
              M.compose(_v.set(x, (P.sc.space ? a.p.y : P.H(x, z)) + Math.abs(Math.sin(t * 6 + i)) * 0.6, z), Q, one);
              im.setMatrixAt(i, M);
            });
            im.instanceMatrix.needsUpdate = true;
          },
          end() {
            P.root.remove(im);
            im.geometry.dispose();
          },
        };
      },
      duel(a, P) {
        const R = P.R;
        const fig = c => {
          const g = new THREE.Group();
          const b = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 3.4, 8).translate(0, 1.7, 0), mat(c));
          const h = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), mat("#c8a88a"));
          h.position.y = 3.8;
          const bl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.2).translate(0, 0, 2.1), glowMat("#cfe6ff", 1));
          bl.position.set(0.7, 2.6, 0.3);
          g.add(b, h, bl);
          g.userData.bl = bl;
          g.scale.setScalar(3);
          return g;
        };
        const A1 = fig("#3a3f52"),
          B1 = fig("#7a2a24");
        const sp = Particles(240, {});
        P.root.add(A1, B1, sp.obj);
        return {
          dur: 14,
          upd(dt, t) {
            const ang = t * 0.9,
              r = a.s * 0.5 + Math.sin(t * 1.4) * a.s * 0.25;
            const y = P.sc.space ? a.p.y : P.H(a.p.x, a.p.z);
            A1.position.set(a.p.x + Math.cos(ang) * r, y, a.p.z + Math.sin(ang) * r);
            B1.position.set(a.p.x - Math.cos(ang) * r, y, a.p.z - Math.sin(ang) * r);
            A1.lookAt(B1.position);
            B1.lookAt(A1.position);
            A1.userData.bl.rotation.x = Math.sin(t * 7) * 0.9;
            B1.userData.bl.rotation.x = Math.sin(t * 6.3 + 1) * 0.9;
            if (Math.sin(t * 7) > 0.95 && R() < 0.5)
              for (let i = 0; i < 12; i++) sp.emit(_v.lerpVectors(A1.position, B1.position, 0.5).add(_v2.set(0, 8, 0)), new THREE.Vector3((R() - 0.5) * 40, R() * 30, (R() - 0.5) * 40), 0.5, 3, 0.5, C("#cfe6ff"));
            sp.update(dt, 40);
          },
          end() {
            [A1, B1].forEach(g => {
              P.root.remove(g);
              g.traverse(o => o.geometry && o.geometry.dispose());
            });
            P.root.remove(sp.obj);
            sp.dispose();
          },
        };
      },
      flood(a, P) {
        const w = new THREE.Mesh(new THREE.CircleGeometry(a.s * 14, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: C(P.pal.water), roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85 }));
        w.position.copy(a.p);
        P.root.add(w);
        return {
          dur: 12,
          upd(dt, t) {
            const k = Math.sin(clamp(t / 12, 0, 1) * Math.PI);
            w.position.y = a.p.y - 10 + k * a.s * 1.4;
          },
          end() {
            P.root.remove(w);
            w.geometry.dispose();
            w.material.dispose();
          },
        };
      },
      launch(a, P, down) {
        const R = P.R;
        const ship = new THREE.Group();
        const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1, 4, 10), mat("#a7aab0", { metal: 0.6, rough: 0.4 }));
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.6, 10).translate(0, 2.8, 0), mat("#a7aab0", { metal: 0.6, rough: 0.4 }));
        ship.add(hull, nose);
        ship.scale.setScalar(a.s * 0.9);
        P.root.add(ship);
        const ex = Particles(500, {}),
          sm = Particles(200, { normal: true, puff: true, op: 0.6 });
        P.root.add(ex.obj, sm.obj);
        return {
          dur: 13,
          upd(dt, t) {
            const k = down ? 1 - ease(clamp(t / 9, 0, 1)) : Math.pow(clamp((t - 1.5) / 9, 0, 1), 2.2);
            ship.position.copy(a.p).add(_v.set(0, a.s * 2.5 + k * 9000, 0));
            const on = down ? t < 10 : t > 0.6 && t < 11;
            if (on) {
              for (let i = 0; i < 6; i++) ex.emit(_v.copy(ship.position).add(_v2.set(0, -a.s * 2, 0)), new THREE.Vector3((R() - 0.5) * 30, -120 - R() * 80, (R() - 0.5) * 30), 0.6, a.s * 1.2, a.s * 0.2, C(i % 2 ? "#ffd8a0" : "#9fd0ff"));
              if (k < 0.08) sm.emit(_v.copy(a.p).add(_v2.set((R() - 0.5) * a.s * 3, 4, (R() - 0.5) * a.s * 3)), new THREE.Vector3((R() - 0.5) * 60, 6, (R() - 0.5) * 60), 6, a.s, a.s * 4, C("#8a847c"));
            }
            ex.update(dt);
            sm.update(dt, -0.3, 0.85);
          },
          end() {
            P.root.remove(ship, ex.obj, sm.obj);
            ship.traverse(o => o.geometry && o.geometry.dispose());
            ex.dispose();
            sm.dispose();
          },
        };
      },
      arrival(a, P) {
        return FX.launch(a, P, true);
      },
      eruption(a, P) {
        const R = P.R;
        const lv = Particles(SMALL ? 500 : 1100, {}),
          sm = Particles(260, { normal: true, puff: true, op: 0.7 });
        P.root.add(lv.obj, sm.obj);
        const L = new THREE.PointLight(0xff5a1a, 4, a.s * 30, 1.4);
        L.position.copy(a.p).add(_v.set(0, a.s * 2, 0));
        P.root.add(L);
        return {
          dur: 14,
          upd(dt, t) {
            if (t < 11) {
              for (let i = 0; i < 18; i++) lv.emit(_v.copy(a.p).add(_v2.set(0, a.s, 0)), new THREE.Vector3((R() - 0.5) * 90, 160 + R() * 160, (R() - 0.5) * 90), 2.4, a.s * 0.5, a.s * 0.2, C(i % 3 ? "#ff6a1a" : "#ffd27a"));
              if (R() < 0.7) sm.emit(_v.copy(a.p).add(_v2.set(0, a.s * 4, 0)), new THREE.Vector3(10, 60, 4), 9, a.s * 2, a.s * 9, C("#3a3230"));
            }
            lv.update(dt, 120, 0.95);
            sm.update(dt, -1, 0.92);
            L.intensity = t < 11 ? 3.5 + Math.sin(t * 17) : Math.max(0, L.intensity - dt * 2);
          },
          end() {
            P.root.remove(lv.obj, sm.obj, L);
            lv.dispose();
            sm.dispose();
          },
        };
      },
      worm(a, P) {
        const R = P.R;
        const segs = 46;
        const g = new THREE.Group();
        const sk = mat("#7a6048", { rough: 0.9 });
        const S = [];
        for (let i = 0; i < segs; i++) {
          const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.1, 18, 1, true).rotateX(Math.PI / 2), sk);
          g.add(m);
          S.push(m);
        }
        const mouth = new THREE.Mesh(new THREE.TorusGeometry(1, 0.18, 8, 24), mat("#c8b090", { rough: 0.6 }));
        g.add(mouth);
        P.root.add(g);
        const dust = Particles(SMALL ? 500 : 1100, { normal: true, puff: true, op: 0.65 });
        P.root.add(dust.obj);
        const dc = C("#c9a774");
        const rad = a.s * 0.9,
          span = a.s * 30;
        const dir = new THREE.Vector3(Math.cos(R() * TAU), 0, Math.sin(R() * TAU));
        P.shake = 0.7;
        return {
          dur: 13,
          upd(dt, t) {
            const head = clamp(t / 9, 0, 1.3);
            for (let i = 0; i < segs; i++) {
              const u = head - i / segs;
              const s = (u - 0.5) * span;
              const x = a.p.x + dir.x * s,
                z = a.p.z + dir.z * s;
              const arc = Math.sin(clamp(u, 0, 1) * Math.PI) * a.s * 7 - a.s * 1.5;
              const ground = P.H(x, z);
              S[i].position.set(x, ground + arc, z);
              const nx = a.p.x + dir.x * (s + 1),
                nz = a.p.z + dir.z * (s + 1);
              const narc = Math.sin(clamp(u + 0.02, 0, 1) * Math.PI) * a.s * 7 - a.s * 1.5;
              S[i].lookAt(nx, P.H(nx, nz) + narc, nz);
              S[i].scale.set(rad, rad, (span / segs) * 1.2);
              S[i].visible = u >= 0 && u <= 1;
              if (i === 0) {
                mouth.position.copy(S[0].position);
                mouth.quaternion.copy(S[0].quaternion);
                mouth.scale.setScalar(rad * 1.05);
                mouth.visible = S[0].visible;
              }
              if (S[i].visible && Math.abs(arc) < a.s * 1.2 && R() < 0.5)
                dust.emit(_v.set(x, ground + 2, z), _v2.set((R() - 0.5) * 60, 30 + R() * 40, (R() - 0.5) * 60), 4, a.s * 0.8, a.s * 3.5, dc);
            }
            dust.update(dt, 8, 0.85);
          },
          end() {
            P.root.remove(g, dust.obj);
            g.traverse(o => o.geometry && o.geometry.dispose());
            dust.dispose();
          },
        };
      },
    };
    return FX;
  }
  window.AtlasPlacesFX = { create };
})();
