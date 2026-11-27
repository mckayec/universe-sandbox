// Rendered probe for the source-confidence batch (Revision 6, r6-acceptance).
// Serve public/ at :8811 (e.g. `python3 -m http.server 8811` inside public/), then:
//   VP='{"width":1440,"height":900}' SHOTS=dir VERBOSE=1 node source-confidence-probe.cjs
// Exit code is non-zero when any case fails or any page error is recorded.
//
// Case kinds:
//   [visible]  the target text is located as a Range in the live DOM, scrolled into
//              its scroll container, and must have non-zero client rects inside the
//              viewport and inside every clipping ancestor, with computed visibility
//              along the chain, and must be the hit-test target at each line's centre.
//   [absent]   no occurrence of the text may pass the visible predicate (downgrades).
//   [data]     reads exposed data objects only; makes no presentation claim.
//   [control]  deliberate negative controls: the visible predicate must return false.
const { chromium } = require("playwright");
const vp = JSON.parse(process.env.VP || '{"width":1440,"height":900}');
const SHOTS = process.env.SHOTS || "";
const BASE = process.env.BASE || "http://localhost:8811/atlas/";
const cases = [];
const ok = (kind, name, pass, info) => cases.push({ kind, name, pass: !!pass, info: info || "" });

// Runs in the page. [rootSel, needle, all] -> {found, visible, reason, rect}
function visProbe([rootSel, needle, all]) {
  const root = document.querySelector(rootSel);
  if (!root) return { found: false, visible: false, reason: "no root" };
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits = [];
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const i = n.nodeValue.indexOf(needle);
    if (i >= 0) hits.push([n, i]);
  }
  if (!hits.length) return { found: false, visible: false, reason: "text not in DOM" };
  const R = q => [q.left, q.top, q.right, q.bottom].map(Math.round);
  const check = ([node, i]) => {
    const el = node.parentElement;
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.display === "none") return { visible: false, reason: "display:none on " + a.tagName + "#" + a.id };
      if (cs.visibility === "hidden") return { visible: false, reason: "visibility:hidden" };
      if (+cs.opacity < 0.05) return { visible: false, reason: "opacity" };
      if (a.hidden) return { visible: false, reason: "hidden attr" };
    }
    const r = document.createRange();
    r.setStart(node, i);
    r.setEnd(node, i + needle.length);
    el.scrollIntoView({ block: "nearest" });
    const first = r.getClientRects()[0];
    if (!first) return { visible: false, reason: "no client rects" };
    for (let a = el.parentElement; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (/(auto|scroll)/.test(cs.overflowY) && a.scrollHeight > a.clientHeight) {
        const ar = a.getBoundingClientRect();
        const f = r.getClientRects()[0];
        if (f.top < ar.top || f.bottom > ar.bottom) a.scrollTop += f.top - ar.top - ar.height / 3;
      }
    }
    const rects = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0);
    if (!rects.length) return { visible: false, reason: "zero-size rects" };
    for (const q of rects) {
      if (q.left < -0.5 || q.top < -0.5 || q.right > innerWidth + 0.5 || q.bottom > innerHeight + 0.5)
        return { visible: false, reason: "outside viewport", rect: R(q) };
      for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
          const ar = a.getBoundingClientRect();
          if (q.left < ar.left - 0.5 || q.right > ar.right + 0.5 || q.top < ar.top - 0.5 || q.bottom > ar.bottom + 0.5)
            return { visible: false, reason: "clipped by " + a.tagName + "#" + a.id + "." + a.className, rect: R(q) };
        }
      }
      const hit = document.elementFromPoint((q.left + q.right) / 2, (q.top + q.bottom) / 2);
      if (!hit || !(hit === el || el.contains(hit) || hit.contains(el)))
        return { visible: false, reason: "covered by " + (hit ? hit.tagName + "#" + hit.id + "." + hit.className : "nothing") };
    }
    return { visible: true, reason: "", rect: R(rects[0]), lines: rects.length };
  };
  if (!all) return { found: true, ...check(hits[0]) };
  for (const h of hits) {
    const c = check(h);
    if (c.visible) return { found: true, ...c };
  }
  return { found: true, visible: false, reason: "no occurrence visible" };
}

(async () => {
  const br = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const mobile = vp.width < 1000;
  const errs = [];
  async function open(url) {
    const p = await br.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
    p.setDefaultTimeout(60000);
    p.on("pageerror", e => errs.push(url + ": " + e.message));
    p.on("console", m => {
      if (m.type() === "error") errs.push(url + " console: " + m.text());
    });
    await p.goto(BASE + url);
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 });
    await p.waitForTimeout(2200);
    return p;
  }
  const vis = (p, root, needle) => p.evaluate(visProbe, [root, needle, false]);
  const anyVis = (p, root, needle) => p.evaluate(visProbe, [root, needle, true]);
  async function expectVis(p, name, root, needles) {
    for (const n of needles) {
      const r = await vis(p, root, n);
      ok("visible", name + " — “" + n + "”", r.visible, r.visible ? "rect " + r.rect : r.reason + (r.rect ? " " + r.rect : ""));
    }
  }
  async function expectAbsent(p, name, root, needles) {
    for (const n of needles) {
      const r = await anyVis(p, root, n);
      ok("absent", name + " — no “" + n + "”", !r.visible, r.found ? (r.visible ? "VISIBLE " + r.rect : "in DOM, not visible") : "not in DOM");
    }
  }
  // engine phone dossier is a sheet; expand it so the probe measures the expanded sheet
  const expand = async p => {
    if (!mobile) return;
    await p.evaluate(() => {
      const d = document.querySelector("#dossier");
      if (d.classList.contains("collapsed")) d.querySelector(".grab").click();
    });
    await p.waitForTimeout(450);
  };
  const book = async (p, b) => {
    await p.evaluate(b => window.__atlas.setBook(b), b);
    await p.waitForTimeout(450);
  };
  const world = async (p, id) => {
    await p.evaluate(id => window.__atlas.selectWorld(id, true), id);
    await p.waitForTimeout(800);
    await expand(p);
  };
  const ev = async (p, id) => {
    await p.evaluate(id => window.__atlas.openEvent(id, true), id);
    await p.waitForTimeout(2600);
    await expand(p);
  };
  const shot = async (p, n) => {
    if (SHOTS) await p.screenshot({ path: SHOTS + "/" + n + "-" + vp.width + "x" + vp.height + ".png" });
  };
  const codexOpen = async p => {
    await p.evaluate(() => document.querySelector("#cxBtn").click());
    await p.waitForTimeout(500);
  };
  const codexClose = async p => {
    await p.keyboard.press("Escape");
    await p.waitForTimeout(250);
  };
  // open the codex tab whose content contains `needle`
  const codexFind = async (p, needle) => {
    const n = await p.evaluate(() => document.querySelectorAll("#cxTabs [data-tab]").length);
    for (let i = 0; i < Math.max(n, 1); i++) {
      if (n) {
        await p.evaluate(i => document.querySelectorAll("#cxTabs [data-tab]")[i].click(), i);
        await p.waitForTimeout(250);
      }
      if (await p.evaluate(s => document.querySelector("#codex").textContent.includes(s), needle)) return true;
    }
    return false;
  };

  // ---------- Foundation: intro (N1), codex (N1), Smyrno (L18)
  let p = await open("?pack=foundation");
  await expand(p);
  await expectVis(p, "foundation intro N1", "#dossier", ["Jazbec"]);
  await book(p, 1);
  await codexOpen(p);
  await codexFind(p, "twenty-five million inhabited worlds");
  await expectVis(p, "foundation codex Galactic Empire N1", "#codex", ["Jazbec"]);
  await codexClose(p);
  await world(p, "smyrno");
  await expectVis(p, "foundation Smyrno L18", "#dossier", ["Asimov fan wiki"]);
  await shot(p, "foundation-smyrno");
  await p.close();

  // ---------- Hyperion: Madhya base/eras/downgrade (L7), Bressia, b1j (L6)
  p = await open("?pack=hyperion");
  await book(p, 1);
  await world(p, "madhya");
  await expectVis(p, "hyperion Madhya b1", "#dossier", ["investigation in the Detective", "Hyperion Cantos fan wiki"]);
  await expectAbsent(p, "hyperion Madhya b1", "#dossier", ["Vatican"]);
  await book(p, 4);
  await world(p, "madhya");
  await expectVis(p, "hyperion Madhya era 4", "#dossier", ["Vatican", "Hyperion Cantos fan wiki"]);
  await shot(p, "hyperion-madhya-b4");
  await book(p, 1);
  await expand(p);
  await expectAbsent(p, "hyperion Madhya downgrade 4→1 (dossier open)", "#dossier", ["Vatican", "farcaster"]);
  await expectVis(p, "hyperion Madhya downgrade 4→1 keeps note", "#dossier", ["Hyperion Cantos fan wiki"]);
  await book(p, 0);
  await world(p, "bressia");
  await expectVis(p, "hyperion Bressia narrowed", "#dossier", ["Bressian campaign"]);
  await expectAbsent(p, "hyperion Bressia narrowed", "#dossier", ["wife"]);
  await book(p, 1);
  await ev(p, "b1j");
  await expectVis(p, "hyperion b1j L6", "body", ["plot summaries"]);
  await p.close();

  // ---------- Expanse: legend route note, b7e (L11), Pallas (L12), Ilus (L13), b1c (L14), Nieuwestad (L15)
  p = await open("?pack=expanse");
  await expand(p);
  await expectVis(p, "expanse intro legend route note", "#dossier", ["book-one route follow SuperSummary"]);
  await book(p, 7);
  await ev(p, "b7e");
  await expectVis(p, "expanse b7e L11", "body", ["SuperSummary"]);
  await world(p, "pallas");
  await expectVis(p, "expanse Pallas L12", "#dossier", ["Expanse fan wiki"]);
  await book(p, 4);
  await world(p, "ilus");
  await expectVis(p, "expanse Ilus L13", "#dossier", ["Expanse fan wiki"]);
  await shot(p, "expanse-ilus");
  await book(p, 1);
  await ev(p, "b1c");
  await expectVis(p, "expanse b1c L14", "body", ["This leg of the route is a provisional account"]);
  await book(p, 9);
  await world(p, "nieuwestad");
  await expectVis(p, "expanse Nieuwestad L15", "#dossier", ["spelling Nieuwestad"]);
  await p.close();

  // ---------- Cosmere: Canticle era 12 + identity note; downgrades with dossier / codex open
  p = await open("?pack=cosmere");
  await book(p, 12);
  await world(p, "canticle");
  await expectVis(p, "cosmere Canticle era 12", "#dossier", ["moves on to another world", "Identifying Nomad as Sigzil"]);
  await expectAbsent(p, "cosmere Canticle era 12", "#dossier", ["UTol"]);
  await shot(p, "cosmere-canticle-b12");
  await book(p, 11);
  await expand(p);
  await expectAbsent(p, "cosmere Canticle downgrade 12→11 (dossier open)", "#dossier", ["Sigzil", "Identifying Nomad"]);
  await book(p, 12);
  await codexOpen(p);
  await codexFind(p, "Sigzil of Bridge Four");
  await expectVis(p, "cosmere Nomad codex b12", "#codex", ["This identification"]);
  await codexClose(p);
  await book(p, 11);
  await codexOpen(p);
  await codexFind(p, "Nomad");
  await expectAbsent(p, "cosmere Nomad codex downgrade 12→11 (codex reopened)", "#codex", ["Sigzil", "This identification"]);
  await codexClose(p);
  await book(p, 12);
  await ev(p, "e59");
  await expectVis(p, "cosmere e59 L22", "body", ["Coppermind"]);
  await p.close();

  // ---------- Society (own UI)
  p = await open("society.html");
  const soc = await p.evaluate(() => {
    const A = window.__atlas;
    const f = (b, id) => (A.POIS[b] || []).find(x => x.id === id);
    const s = x => (typeof x === "string" ? x : JSON.stringify(x));
    return {
      rheacities: s(f("rhea", "rheacities").desc),
      bleeding: s(f("io", "bleeding").desc),
      r1: A.EV.r1 && A.EV.r1.text,
      r3: A.EV.r3 && A.EV.r3.text,
      g8: A.EV.g8 && A.EV.g8.text,
      l3: A.EV.l3 && A.EV.l3.text,
    };
  });
  ok("data", "society L28 Octavia attribution (data-only)", soc.rheacities.includes("In Octavia’s telling"));
  ok("data", "society L30 Bleeding Place + g8 (data-only)", soc.bleeding.includes("Red Rising fan wiki") && soc.g8.includes("Red Rising fan wiki"));
  ok("data", "society L27/L32 r1 r3 (data-only)", soc.r1.includes("Red Rising fan wiki") && soc.r3.includes("Red Rising fan wiki"));
  ok("data", "society l3 (data-only)", soc.l3.includes("Book Series Recaps"));
  const sheet = async () => {
    if (!mobile) return;
    await p.evaluate(() => {
      if (!document.body.classList.contains("sheet-open")) {
        const h = document.querySelector("#dossier .sheet-handle");
        if (h) h.click();
      }
    });
    await p.waitForTimeout(500);
  };
  await p.evaluate(() => window.__atlas.selectBook(6));
  await p.waitForTimeout(600);
  await p.evaluate(() => window.__atlas.enterSite("newsparta"));
  await p.waitForTimeout(1500);
  await p.waitForFunction(() => window.__atlas.curSite && !document.querySelector("#fade").classList.contains("on"));
  await p.waitForTimeout(1500);
  await sheet();
  await expectVis(p, "society New Sparta scene b6 (R-3)", "#dossier", ["summit in Rome", "Book Series Recaps"]);
  await shot(p, "society-newsparta-b6");
  await p.evaluate(() => {
    const b = document.querySelector('#dossier [data-lm="palace"]');
    if (b) b.click();
  });
  await p.waitForTimeout(2500);
  await sheet();
  const palaceSel = await p.evaluate(() => !!document.querySelector('#dossier [data-lm="palace"].sel'));
  ok("visible", "society palace landmark selected via its dossier button", palaceSel);
  await expectVis(p, "society palace landmark (R-3)", '#dossier [data-lm="palace"]', ["coerced", "Book Series Recaps"]);
  await expectAbsent(p, "society palace landmark", "#dossier", ["vote with him for Mars"]);
  await shot(p, "society-palace-b6");
  ok("visible", "no horizontal overflow (society, site open)", await p.evaluate(w => document.documentElement.scrollWidth <= w, vp.width));
  await p.evaluate(() => window.__atlas.selectBook(1));
  // leaving the scene is a fade; slow software-GL frames at 4K can stretch it
  await p.waitForFunction(() => !/Sparta/.test((window.__atlas.curSite || {}).name || ""), null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(1500);
  await sheet();
  const cs = await p.evaluate(() => (window.__atlas.curSite ? window.__atlas.curSite.name : null));
  ok("visible", "society downgrade 6→1 leaves New Sparta scene", !/Sparta/.test(cs || ""), "curSite=" + cs);
  await expectAbsent(p, "society downgrade 6→1 (UI open)", "body", ["Atalantia’s Citadel", "summit in Rome", "Book Series Recaps", "coerced"]);
  await shot(p, "society-downgrade-b1");
  await p.close();

  // ---------- Negative controls for the visible predicate
  p = await open("?pack=hyperion");
  await book(p, 1);
  await world(p, "madhya");
  if (mobile) {
    await p.evaluate(() => {
      const d = document.querySelector("#dossier");
      if (!d.classList.contains("collapsed")) d.querySelector(".grab").click();
    });
    await p.waitForTimeout(450);
    const inDom = await p.evaluate(() => document.querySelector("#dossier").textContent.includes("Hyperion Cantos fan wiki"));
    const r = await vis(p, "#dossier", "Hyperion Cantos fan wiki");
    ok("control", "collapsed phone sheet: text in DOM, predicate false", inDom && !r.visible, r.reason);
  } else {
    await p.addStyleTag({ content: "#dossier .blurb{visibility:hidden!important}" });
    const r = await vis(p, "#dossier", "Hyperion Cantos fan wiki");
    ok("control", "hidden blurb: predicate false", !r.visible, r.reason);
  }
  await p.addStyleTag({ content: "#dossier{max-height:60px!important;overflow:hidden!important}#dossier .blurb{visibility:visible!important}" });
  const rc = await vis(p, "#dossier", "Hyperion Cantos fan wiki");
  ok("control", "clipped dossier: predicate false", !rc.visible, rc.reason);
  const rn = await vis(p, "#dossier", "zz-not-present-zz");
  ok("control", "absent text: predicate false", !rn.visible && !rn.found, rn.reason);
  await p.close();

  const pass = cases.filter(x => x.pass).length;
  const byKind = {};
  for (const c of cases) {
    byKind[c.kind] = byKind[c.kind] || [0, 0];
    byKind[c.kind][1]++;
    if (c.pass) byKind[c.kind][0]++;
  }
  if (process.env.VERBOSE) for (const c of cases) console.log((c.pass ? "PASS " : "FAIL ") + "[" + c.kind + "] " + c.name + (c.info ? "  (" + c.info + ")" : ""));
  console.log(JSON.stringify({ vp, pass, total: cases.length, byKind, fail: cases.filter(x => !x.pass), errs }, null, 1));
  await br.close();
  if (pass !== cases.length || errs.length) process.exitCode = 1;
})().catch(e => {
  console.error(e);
  process.exitCode = 2;
});
