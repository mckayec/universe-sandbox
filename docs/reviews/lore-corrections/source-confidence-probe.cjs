// Rendered probe for the source-confidence batch (Revision 6). Serve public/ at :8811, then:
// CHROME_PATH=... VP='{"width":1440,"height":900}' node source-confidence-probe.cjs
const { chromium } = require("playwright");
const vp = JSON.parse(process.env.VP || '{"width":1440,"height":900}');
const SHOTS = process.env.SHOTS || "";
const Q = "not independently checked against the";
const cases = [];
const ok = (name, pass, info) => cases.push({ name, pass: !!pass, info });
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const mobile = vp.width < 1000;
  const errs = [];
  async function open(url) {
    const p = await br.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
    p.setDefaultTimeout(60000);
    p.on("pageerror", e => errs.push(url + ": " + e.message));
    await p.goto("http://localhost:8811/atlas/" + url);
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 });
    await p.waitForTimeout(2200);
    return p;
  }
  const txt = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return e ? (window.innerWidth < 1000 ? e.textContent : e.innerText) : ""; }, sel);
  const book = async (p, b) => { await p.evaluate(b => window.__atlas.setBook(b), b); await p.waitForTimeout(400); };
  const world = async (p, id) => { await p.evaluate(id => window.__atlas.selectWorld(id, true), id); await p.waitForTimeout(700); return txt(p, "#dossier"); };
  const ev = async (p, id) => { await p.evaluate(id => window.__atlas.openEvent(id, true), id); await p.waitForTimeout(2600); return (await txt(p, "#ev")) + "\n" + (await txt(p, "#dossier")); };
  const codex = async p => { await p.evaluate(() => document.querySelector("#cxBtn").click()); await p.waitForTimeout(500);
    const n = await p.evaluate(() => document.querySelectorAll("#cxTabs [data-tab]").length); let t = "";
    for (let i = 0; i < Math.max(n, 1); i++) { if (n) { await p.evaluate(i => document.querySelectorAll("#cxTabs [data-tab]")[i].click(), i); await p.waitForTimeout(250); } t += (await txt(p, "#codex")) + "\n"; } await p.keyboard.press("Escape"); await p.waitForTimeout(200); return t; };

  // intro + codex (Foundation N1)
  let p = await open("?pack=foundation");
  let d = await txt(p, "#dossier");
  ok("foundation intro N1 qualified", d.includes("twenty-five million") && d.includes("Jazbec") && d.includes(Q), d.slice(0, 120));
  await book(p, 1); let c = await codex(p);
  ok("foundation codex Galactic Empire N1 qualified", /twenty-five million inhabited worlds[^\n]*Jazbec/.test(c), "");
  d = await world(p, "smyrno");
  ok("foundation smyrno L18 qualified", d.includes("underground") && d.includes("Asimov fan wiki"), "");
  if (SHOTS) await p.screenshot({ path: SHOTS + "/foundation-smyrno-" + vp.width + ".png" });
  await p.close();

  // world base/era + downgrade (Hyperion L7, Bressia, L6 event)
  p = await open("?pack=hyperion");
  await book(p, 1); d = await world(p, "madhya");
  ok("madhya base investigation + note, no era text", d.includes("investigation in the Detective") && d.includes("Hyperion Cantos fan wiki") && !d.includes("farcaster") && !d.includes("chase"), "");
  await book(p, 2); d = await world(p, "madhya");
  ok("madhya era 2 + note", d.includes("farcaster") && d.includes("Hyperion Cantos fan wiki") && !d.includes("Vatican"), "");
  await book(p, 4); d = await world(p, "madhya");
  ok("madhya era 4 + note", d.includes("Vatican") && d.includes("Hyperion Cantos fan wiki"), "");
  if (SHOTS) await p.screenshot({ path: SHOTS + "/hyperion-madhya-" + vp.width + ".png" });
  await book(p, 1); d = await world(p, "madhya");
  ok("madhya downgrade 4->1 drops era text", !d.includes("Vatican") && !d.includes("farcaster") && d.includes("Hyperion Cantos fan wiki"), "");
  await book(p, 0); d = await world(p, "bressia");
  ok("bressia narrowed (no wife/son)", d.includes("Bressian campaign") && !d.includes("wife"), "");
  await book(p, 1); d = await ev(p, "b1j");
  ok("hyperion b1j L6 qualified", d.includes("replica of Old Earth") && d.includes("plot summaries"), "");
  await p.close();

  // Expanse: event, world short, era, facts, legend/route note
  p = await open("?pack=expanse");
  d = await txt(p, "#dossier");
  ok("expanse legend route note (r1)", d.includes("book-one route follow SuperSummary"), "");
  await book(p, 7); d = await ev(p, "b7e");
  ok("expanse b7e L11 qualified", d.includes("Point Leuctra") && d.includes("SuperSummary"), "");
  d = await world(p, "pallas");
  ok("expanse pallas L12 qualified", d.includes("destroys Pallas Station") && d.includes("Expanse fan wiki"), "");
  d = await world(p, "tycho");
  ok("expanse tycho era 7 L12 qualified", d.includes("before the Tempest destroys Pallas") && d.includes("Expanse fan wiki"), "");
  await book(p, 4); d = await world(p, "ilus");
  ok("expanse ilus L13 blurb + facts qualified", (d.match(/Expanse fan wiki/g) || []).length >= 2, "");
  await book(p, 1); d = await ev(p, "b1c");
  ok("expanse b1c L14 qualified", d.includes("This leg of the route is a provisional account"), "");
  await book(p, 9); d = await world(p, "nieuwestad");
  ok("expanse nieuwestad L15 spelling note", d.includes("spelling Nieuwestad"), "");
  await p.close();

  // Cosmere: character more + Nomad low-book, era 12, events
  p = await open("?pack=cosmere");
  await book(p, 11); c = await codex(p);
  ok("cosmere Nomad book 11: no Sigzil, no note", c.includes("Nomad") && !c.includes("Sigzil"), "");
  d = await world(p, "canticle");
  ok("cosmere canticle book 11: no Sigzil/UTol era text", !d.includes("Sigzil") && !d.includes("Skips"), "");
  await book(p, 12); c = await codex(p);
  ok("cosmere Nomad book 12: Sigzil + note", /Sigzil of Bridge Four\. This identification[^\n]*Coppermind/.test(c), "");
  d = await world(p, "canticle");
  ok("cosmere canticle era 12: R-2 + identity note", d.includes("moves on to another world") && !d.includes("UTol") && d.includes("Identifying Nomad as Sigzil"), "");
  if (SHOTS) await p.screenshot({ path: SHOTS + "/cosmere-canticle-" + vp.width + ".png" });
  await book(p, 11); c = await codex(p); d = await world(p, "canticle");
  ok("cosmere downgrade 12->11 hides Sigzil and note", !c.includes("Sigzil") && !d.includes("Sigzil"), "");
  await book(p, 12); d = await ev(p, "e59");
  ok("cosmere e59 L22 qualified", d.includes("slowed time") && d.includes("Coppermind"), "");
  await p.close();

  // Society (own UI): data-effective checks plus rendered site blurb
  p = await open("society.html");
  const soc = await p.evaluate(() => { const A = window.__atlas; const P = A.POIS; const f = (b, id) => (P[b] || []).find(x => x.id === id);
    const s = x => typeof x === "string" ? x : JSON.stringify(x);
    return { rheacities: s(f("rhea", "rheacities").desc), bleeding: s(f("io", "bleeding").desc), ns: s(f("earth", "newsparta").desc), rome: s(f("earth", "rome").desc),
      site: A.SITES.newsparta && A.SITES.newsparta.blurb, palace: (() => { const S = A.SITES.newsparta; for (const k of Object.keys(S)) { const v = S[k]; if (Array.isArray(v)) { const m = v.find(x => x && x.id === "palace"); if (m) return m.desc; } } return ""; })(),
      r1: A.EV.r1 && A.EV.r1.text, r3: A.EV.r3 && A.EV.r3.text, g8: A.EV.g8 && A.EV.g8.text, l3: A.EV.l3 && A.EV.l3.text, l3b: A.EV.l3b && A.EV.l3b.text }; });
  ok("society L28 Octavia attribution", soc.rheacities.includes("In Octavia’s telling"), "");
  ok("society L30 bleeding + g8 qualified", soc.bleeding.includes("Red Rising fan wiki") && soc.g8.includes("Red Rising fan wiki"), "");
  ok("society L31 POIs, l3, l3b, site blurb qualified; R-3", [soc.ns, soc.rome, soc.l3, soc.l3b, soc.site].every(x => x && x.includes("Book Series Recaps")) && soc.site.includes("summit in Rome"), "");
  ok("society L27/L32 r1 r3 qualified", soc.r1.includes("Red Rising fan wiki") && soc.r3.includes("Red Rising fan wiki"), "");
  ok("society palace landmark R-3 (no Mars vote) + note", soc.palace.includes("coerced") && soc.palace.includes("Book Series Recaps") && !/vote with him for Mars/.test(soc.palace), (soc.palace || "").slice(0, 80));
  await p.evaluate(() => window.__atlas.selectBook(6)); await p.waitForTimeout(500);
  await p.evaluate(() => window.__atlas.enterSite("newsparta")); await p.waitForTimeout(4000);
  const body = await p.evaluate(() => document.body.textContent);
  ok("society New Sparta site rendered with note (book 6)", body.includes("summit in Rome") && body.includes("Book Series Recaps"), "");
  if (SHOTS) await p.screenshot({ path: SHOTS + "/society-newsparta-" + vp.width + ".png" });
  ok("no horizontal overflow (society)", await p.evaluate(w => document.documentElement.scrollWidth <= w, vp.width), "");
  await p.close();

  const pass = cases.filter(x => x.pass).length;
  console.log(JSON.stringify({ vp, pass, total: cases.length, fail: cases.filter(x => !x.pass), errs: errs.slice(0, 5) }, null, 1));
  await br.close();
})();
