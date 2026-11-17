// SH-E1 finished-surface probe (implementation-review-0b43f8e.md). Real Cosmere pack + engine at the audited head,
// no fixtures; Playwright + SwiftShader. Strengthens sh-omission-probe.mjs's descent wait, which only tested
// `PL.w.id === "scadrial"` (PL is assigned when the HD bake is QUEUED, not when it finishes).
//
// For each required case (1440x900 desktop, 390x844 phone), state = original trilogy + The Way of Kings (bucket 4),
// Cognitive, descend("scadrial"). A case is COMPLETE only when ALL of these hold, polled until a hard deadline:
//   R1 assembly: S.view === "world", S.sel === "scadrial", S.realm === "cognitive", PL.w.id === "scadrial"
//   R2 bake finished: every job in PL.jobs has pass > 2 (the engine shifts a job after pass 2 and calls done)
//   R3 HD applied: PL.mat.uniforms.tAlb.value is a W x W/2 texture with W === the expected bake size for the mode
//   R4 loading indicator: #bake is hidden
//   R5 subsequent frames: 30 further requestAnimationFrame callbacks after R1–R4, then R1–R4 rechecked
//   R6 uniforms at capture time: realm 1, style 4, colours = global Cognitive look
//   R7 pixels (REPORT ONLY, not a pass criterion): luma statistics of the central 60% square of the capture. The
//      generic Cognitive look (#1e1a2c/#5a5088/#0e0c14) is dark by design, so brightness cannot distinguish a finished
//      surface from an intermediate one; completion is established by R2–R5 and the capture is inspected by eye.
// A timeout is recorded as INCOMPLETE with the readiness snapshot at the deadline; it is never counted as complete.
// The probe exits 1 unless every required case is COMPLETE and every check passes.
//
// Modes:
//   diag    window.__HD = 256 before load: existing reduced-resolution hook (engine.js:499). Diagnostic only; it
//           establishes the bounded rendering path, NOT the default-resolution pass.
//   default no override: production bake size (4096 desktop / 2048 phone, capped by MAXTEX).
// Usage: node sh-surface-probe.mjs <baseUrl> <mode diag|default> <shotDir> [deadlineSec]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', mode = 'diag', shotDir = '.', deadlineArg] = process.argv.slice(2);
const DEADLINE = (+deadlineArg || (mode === 'diag' ? 300 : 900)) * 1000;
const ctxv = { window: {} };
vm.createContext(ctxv);
vm.runInContext(fs.readFileSync('public/atlas/packs/cosmere.js', 'utf8'), ctxv);
const WORKS = ctxv.window.ATLAS_PACKS.cosmere.spoilers.works;
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const B4 = WORKS.filter(w => w.bucket === 4).map(w => w.id);
const GLOOK = { c1: '#1e1a2c', c2: '#5a5088', c3: '#0e0c14' };
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const incomplete = [];
const results = [];
const ok = (c, msg) => {
  if (c) pass++;
  else fail++;
  console.log(c ? 'ok  ' : 'FAIL', msg);
};
const ready = () => {
  const A = window.__atlas,
    P = A.PL,
    S = A.S;
  const t = P && P.mat && P.mat.uniforms.tAlb.value;
  const img = t && t.image;
  const bake = document.querySelector('#bake');
  return {
    view: S.view,
    sel: S.sel,
    realm: S.realm,
    pl: P && P.w ? P.w.id : null,
    jobs: P ? P.jobs.map(j => ({ pass: j.pass, row: j.row, W: j.W, cancelled: j.cancelled })) : [],
    texW: img ? img.width : 0,
    texH: img ? img.height : 0,
    bakeHidden: !!(bake && bake.hidden),
    bar: bake ? bake.querySelector('i')?.style.width || '' : '',
  };
};
const isReady = (r, W) =>
  r.view === 'world' &&
  r.sel === 'scadrial' &&
  r.realm === 'cognitive' &&
  r.pl === 'scadrial' &&
  r.jobs.length > 0 &&
  r.jobs.every(j => j.pass > 2 && !j.cancelled) &&
  r.texW === W &&
  r.texH === W / 2 &&
  r.bakeHidden;
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const tag = `${mode} ${name}`;
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  if (mode === 'diag') await ctx.addInitScript(() => (window.__HD = 256));
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere#read=' + [...OT, ...B4].join(','));
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  // expected bake size, computed with the engine's own rule (engine.js:499) inside the page
  const W = await p.evaluate(() => {
    const gl =
      document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
    const MAXTEX = (gl && gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 4096;
    const MOB = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer:coarse)').matches;
    const LOWMEM = (navigator.deviceMemory || 8) < 4;
    return window.__HD || Math.min(LOWMEM ? 1024 : MOB ? 2048 : 4096, MAXTEX);
  });
  await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
  await p.waitForTimeout(400);
  await p.evaluate(() => window.__atlas.setRealm('cognitive'));
  await p.waitForTimeout(500);
  const t0 = Date.now();
  await p.evaluate(() => window.__atlas.descend('scadrial'));
  let r = null,
    done = false;
  while (Date.now() - t0 < DEADLINE) {
    r = await p.evaluate(ready);
    if (isReady(r, W)) {
      done = true;
      break;
    }
    await p.waitForTimeout(1000);
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  if (!done) {
    incomplete.push(`${tag}: not ready after ${secs}s; snapshot ${JSON.stringify(r)}; expected W=${W}`);
    results.push({ tag, complete: false, secs, W, snapshot: r });
    console.log('INCOMPLETE', incomplete.at(-1));
    await p.screenshot({ path: `${shotDir}/sh-surface-${mode}-${name}-INCOMPLETE.png` });
    await ctx.close();
    continue;
  }
  // R5: further rendered frames, then recheck
  await p.evaluate(
    () =>
      new Promise(res => {
        let n = 0;
        const f = () => (++n >= 30 ? res() : requestAnimationFrame(f));
        requestAnimationFrame(f);
      }),
  );
  const r2 = await p.evaluate(ready);
  ok(isReady(r2, W), `${tag}: R1–R4 still hold after 30 frames (${JSON.stringify(r2)})`);
  ok(r2.texW === W, `${tag}: HD albedo ${r2.texW}x${r2.texH} = expected ${W}x${W / 2}`);
  const u = await p.evaluate(() => {
    const U = window.__atlas.PL.mat.uniforms;
    const hex = v => '#' + v.clone().convertLinearToSRGB().getHexString();
    return {
      realm: U.uRealm.value,
      style: U.uRStyle.value,
      c1: hex(U.uRC1.value),
      c2: hex(U.uRC2.value),
      c3: hex(U.uRC3.value),
    };
  });
  ok(
    u.realm === 1 && u.style === 4,
    `${tag}: capture-time uniforms Cognitive + generic style 4 (${JSON.stringify(u)})`,
  );
  ok(u.c1 === GLOOK.c1 && u.c2 === GLOOK.c2 && u.c3 === GLOOK.c3, `${tag}: capture-time colours = global look`);
  const file = `${shotDir}/sh-surface-${mode}-${name}.png`;
  const buf = await p.screenshot({ path: file });
  // R7: luma statistics of the central square (planet disc) of the capture, decoded in the page
  const px = await p.evaluate(async b64 => {
    const im = new Image();
    im.src = 'data:image/png;base64,' + b64;
    await im.decode();
    const c = document.createElement('canvas');
    c.width = im.width;
    c.height = im.height;
    const g = c.getContext('2d');
    g.drawImage(im, 0, 0);
    const s = Math.floor(Math.min(im.width, im.height) * 0.6);
    const d = g.getImageData(Math.floor(im.width / 2 - s / 2), Math.floor(im.height / 2 - s / 2), s, s).data;
    let sum = 0,
      lit = 0;
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      sum += y;
      if (y > 20) lit++;
    }
    return { meanLuma: +(sum / (d.length / 4)).toFixed(1), litFrac: +(lit / (d.length / 4)).toFixed(3), side: s };
  }, buf.toString('base64'));
  console.log('info', `${tag}: R7 centre luma (report only) ${JSON.stringify(px)}`);
  const card = await p.evaluate(() => document.querySelector('#dossier .realmcard')?.textContent || '');
  ok(
    !card.includes('Expanse of the Vapors') && !card.includes('mist'),
    `${tag}: no held Scadrial Cognitive copy in card`,
  );
  ok(errors.length === 0, `${tag}: no page/console errors ${errors.join('|')}`);
  results.push({ tag, complete: true, secs, W, readiness: r2, uniforms: u, pixels: px, file });
  await ctx.close();
}
await browser.close();
const summary = {
  mode,
  pass,
  fail,
  complete: results.filter(x => x.complete).length,
  required: 2,
  incomplete: incomplete.length,
};
console.log(JSON.stringify(results));
console.log(JSON.stringify(summary));
process.exit(fail || incomplete.length || summary.complete !== 2 ? 1 : 0);
