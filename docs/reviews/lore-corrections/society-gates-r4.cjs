/* Revision 4 acceptance for R3-C1 (late Europa leviathan landmark and globe banner) and
   R3-C2 (book downgrade during queued transitions, queued event navigation and active
   story effects). Run against a served build:
     PORT=8811 VP='{"width":1440,"height":900}' node docs/reviews/lore-corrections/society-gates-r4.cjs */
const { chromium } = require("playwright");
const URL = "http://localhost:" + (process.env.PORT || 8811) + "/atlas/society.html";
const LB = /Light Bringer|Nixian|Ascomanni/;
let pass = 0, fail = 0;
const fails = [];
const ok = (c, m) => { if (c) pass++; else { fail++; fails.push(m); } };
const sleep = (p, ms) => p.waitForTimeout(ms);
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const vp = JSON.parse(process.env.VP || '{"width":1440,"height":900}');
  const tag = vp.width + "px";
  const p = await br.newPage({ viewport: vp });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(URL);
  await p.waitForFunction(() => window.__atlas && window.__atlas.SITES);
  await sleep(p, 800);
  const book = async (k) => { await p.click('.seg button[data-book="' + k + '"]'); await sleep(p, 150); };
  const state = () => p.evaluate(() => { const A = window.__atlas; const b = document.querySelector("#banner");
    return { site: Object.keys(A.SITES).find((k) => A.SITES[k] === A.curSite) || null, fx: A.fx.map((f) => f.name),
      banner: b.hidden ? "" : document.querySelector("#bannerT").textContent + " | " + document.querySelector("#bannerS").textContent,
      fade: document.querySelector("#fade") ? document.querySelector("#fade").classList.contains("on") : false,
      dossier: document.querySelector("#dossier").innerText }; });

  /* ---- R3-C1: data after the full registration order ---- */
  const lev = await p.evaluate(() => { const l = window.__atlas.SITES.europa.landmarks.filter((x) => x.id === "leviathan");
    return { n: l.length, desc: l[0] && l[0].desc }; });
  ok(lev.n === 1, tag + " exactly one leviathan landmark: " + lev.n);
  ok(lev.desc && typeof lev.desc === "object" && !LB.test(lev.desc[1]) && LB.test(lev.desc[6]) && !Object.keys(lev.desc).some((k) => +k > 1 && +k < 6),
    tag + " leviathan desc keyed I→neutral, VI→full: " + JSON.stringify(lev.desc).slice(0, 120));

  /* scene landmark at each book, entered by the real dossier path */
  for (const k of [1, 2, 3, 4, 5, 6, 0]) {
    await book(k);
    await p.evaluate(() => window.__atlas.enterSite("europa"));
    await p.waitForFunction(() => window.__atlas.curSite === window.__atlas.SITES.europa, null, { timeout: 8000 }).catch(() => {});
    await sleep(p, 300);
    const s = await state();
    const place = await p.evaluate(() => { const b = document.querySelector('#dossier .place[data-lm="leviathan"]'); return b ? b.textContent : null; });
    const want = k === 6 || k === 0;
    ok(place != null, tag + ` book ${k} leviathan place listed`);
    ok(place != null && LB.test(place) === want, tag + ` book ${k} leviathan place text later-book=${place && LB.test(place)} want ${want}`);
    if (!want) ok(!LB.test(s.dossier), tag + ` book ${k} europa dossier names no later book`);
    /* keyboard: focus the landmark button and activate it */
    const kb = await p.evaluate(() => { const b = document.querySelector('#dossier .place[data-lm="leviathan"]'); if (!b) return null; b.focus(); return document.activeElement === b; });
    if (kb) { await p.keyboard.press("Enter"); await sleep(p, 300); const d = await p.evaluate(() => document.querySelector("#dossier").innerText); ok(!LB.test(d) || want, tag + ` book ${k} keyboard-selected leviathan dossier`); }
  }
  /* VI → I inside the scene */
  await book(6); await sleep(p, 200); await book(1); await sleep(p, 300);
  { const t = await p.evaluate(() => { const b = document.querySelector('#dossier .place[data-lm="leviathan"]'); return b ? b.textContent : ""; });
    ok(!LB.test(t), tag + " VI→I europa scene leviathan text neutral"); }

  /* globe label and banner */
  const toGlobe = async () => {
    await p.evaluate(() => window.__atlas.selectBook(window.__atlas.ERA === 6 ? 0 : window.__atlas.ERA)); };
  await p.evaluate(() => { const c = document.querySelector('#crumbs button[data-c="body"][data-id="europa"]') || [...document.querySelectorAll("#crumbs button")].pop(); if (c) c.click(); });
  await sleep(p, 1500);
  for (const k of [1, 5, 6, 0, 1]) {
    await book(k);
    await sleep(p, 300);
    const lbl = await p.evaluate(() => [...document.querySelectorAll("button.lbl.region")].find((b) => b.textContent === "Leviathans") ? true : false);
    ok(lbl, tag + ` book ${k} globe leviathan label exists`);
    if (!lbl) continue;
    await p.evaluate(() => [...document.querySelectorAll("button.lbl.region")].find((b) => b.textContent === "Leviathans").focus());
    await p.keyboard.press("Enter");
    await sleep(p, 150);
    const s = await state();
    const want = k === 6 || k === 0;
    ok(s.banner.startsWith("Leviathans"), tag + ` book ${k} globe banner shown: ${s.banner.slice(0, 40)}`);
    ok(LB.test(s.banner) === want, tag + ` book ${k} globe banner later-book=${LB.test(s.banner)} want ${want}`);
  }
  await toGlobe();

  /* ---- R3-C2: downgrade during a queued scene transition ---- */
  await book(0);
  await p.evaluate(() => window.__atlas.enterSite("asteroid"));
  await sleep(p, 120);
  await book(1);
  await sleep(p, 3000);
  { const s = await state(); ok(s.site !== "asteroid", tag + " queued asteroid entry cancelled by VI→I: site=" + s.site); ok(!s.fade, tag + " fade cleared after cancelled entry: " + (await p.evaluate(() => document.querySelector("#fadeN").textContent))); }

  /* downgrade during queued event navigation into a gated scene with a story effect */
  await book(6);
  await p.evaluate(() => window.__atlas.gotoEvent(window.__atlas.EV.l4));
  await sleep(p, 120);
  await book(1);
  await sleep(p, 2500);
  { const s = await state(); ok(s.site !== "venusdocks" && s.fx.length === 0 && !LB.test(s.banner), tag + " queued l4 navigation cancelled: " + JSON.stringify({ site: s.site, fx: s.fx, b: s.banner })); }

  /* queued event into a scene that stays visible: entry may happen, the later-book effect must not */
  await book(2);
  await p.evaluate(() => window.__atlas.gotoEvent(window.__atlas.EV.e11));
  await sleep(p, 120);
  await book(1);
  await sleep(p, 2500);
  { const s = await state(); ok(s.fx.length === 0 && !/Iron Rain/.test(s.banner), tag + " queued e11 effect not played after II→I: " + JSON.stringify({ site: s.site, fx: s.fx, b: s.banner })); }

  /* active later-book effect in a scene that remains visible */
  await book(2);
  await p.evaluate(() => window.__atlas.gotoEvent(window.__atlas.EV.e11));
  await p.waitForFunction(() => window.__atlas.fx.some((f) => f.name === "ironrain"), null, { timeout: 8000 }).catch(() => {});
  { const s = await state(); ok(s.site === "agea" && s.fx.includes("ironrain") && /Iron Rain/.test(s.banner), tag + " II plays Iron Rain at Agea: " + JSON.stringify({ site: s.site, fx: s.fx })); }
  await book(1);
  await sleep(p, 400);
  { const s = await state(); ok(s.site === "agea", tag + " II→I keeps neutral Agea scene"); ok(s.fx.length === 0, tag + " II→I stops Iron Rain: " + s.fx); ok(s.banner === "", tag + " II→I dismisses banner: " + s.banner); }
  await sleep(p, 1000);
  { const s = await state(); ok(s.fx.length === 0, tag + " effect stays stopped"); }

  ok(errs.length === 0, tag + " page errors: " + errs.join(";"));
  console.log("pass", pass, "fail", fail);
  fails.forEach((f) => console.log(" FAIL", f));
  await br.close();
  process.exit(fail ? 1 : 0);
})();
