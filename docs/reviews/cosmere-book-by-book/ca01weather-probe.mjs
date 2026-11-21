// CA01-WEATHER-01 rendered probe (ca01-handoff-2026-11-21.md); harness adapted from ko01text-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Canticle is selected programmatically (__atlas.selectWorld).
//  - eligible states (base blurb shown; parent exposure 2/13 per tests/atlas-ca01-weather.test.ts: legacy11, bucket11):
//    dossier p.blurb equals the full new blurb, contains the replacement, "firestorm" absent; blurb box horizontally
//    inside the viewport and its replacement line visible after scrolling;
//  - era-12 state (All): eras[12] blurb shown; neither old nor new sentence on the page (inherited, unchanged);
//  - denied states (legacy10, Sunlit only, bucket11 minus Sunlit): neither old nor new sentence on the page.
// Usage: node ca01weather-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir]
import { chromium } from "playwright";
import fs from "node:fs";
import vm from "node:vm";
const [
  base = "http://127.0.0.1:4173",
  packPath = "public/atlas/packs/cosmere.js",
  mode = "head",
  shotDir,
] = process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(packPath, "utf8"), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const B11 = pk.spoilers.works.filter((w) => w.bucket === 11).map((w) => w.id);
const SUNLIT = "the-sunlit-man";
const OLD =
  "It spins backwards, rings light its night side, and a firestorm sweeps the sunset line.";
const NEW =
  "It spins backwards, and rings light its night side. A powerful storm follows sunset, bringing wind, rain, and lightning.";
const NEW_BLURB =
  "A tiny planet whose sunlight burns anything it touches, so whole cities fly around the world just ahead of the dawn. " +
  NEW +
  " A stranger called Nomad lands here, hunted from world to world, and is captured by the people of the Cinder King, who rules the cities through power cells called sunhearts.";
const STATES = [
  ["legacy11", "#book=11", "base"],
  ["bucket11", "#read=" + B11.join(","), "base"],
  ["All", "#book=0", "era12"],
  ["legacy10", "#book=10", "denied"],
  ["Sunlit only", "#read=" + SUNLIT, "denied"],
  [
    "bucket11 minus Sunlit",
    "#read=" + B11.filter((id) => id !== SUNLIT).join(","),
    "denied",
  ],
];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log("FAIL", msg);
  }
  if (c && process.env.VERBOSE) console.log("ok  ", msg);
};
const expand = async (p, mobile) => {
  if (
    mobile &&
    (await p.evaluate(() =>
      document.querySelector("#dossier")?.classList.contains("collapsed"),
    ))
  )
    await p.tap("#grab");
  await p.waitForTimeout(300);
};
for (const [name, vp, mobile] of [
  ["1440x900", { width: 1440, height: 900 }, false],
  ["390x844", { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({
    viewport: vp,
    hasTouch: mobile,
    isMobile: mobile,
  });
  for (const [label, hash, kind] of STATES) {
    const tag = `${name} ${label}`;
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await p.goto(base + "/atlas/index.html?pack=cosmere" + hash);
    await p.waitForFunction(() => !!window.__atlas, null, {
      timeout: 120000,
      polling: 250,
    });
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__atlas.selectWorld("canticle"));
    await p.waitForTimeout(500);
    await expand(p, mobile);
    const s = await p.evaluate(() => {
      const b = document.querySelector("#dossier p.blurb");
      return {
        sel: window.__atlas.S.sel,
        blurb: b ? b.textContent : null,
        page: document.body.innerText + "\n" + document.body.textContent,
      };
    });
    ok(
      !s.page.includes("firestorm") && !s.page.includes(OLD),
      `${tag}: old wording absent`,
    );
    if (kind === "base") {
      ok(s.sel === "canticle", `${tag}: canticle selected (${s.sel})`);
      ok(
        s.blurb === NEW_BLURB,
        `${tag}: blurb = full replacement blurb (${s.blurb})`,
      );
      await p.locator("#dossier p.blurb").first().scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const el = document
          .querySelector("#dossier p.blurb")
          .getBoundingClientRect();
        const q = (v) => Math.round(v * 10) / 10;
        return {
          w: q(el.width),
          h: q(el.height),
          left: q(el.left),
          top: q(el.top),
          right: q(el.right),
          bottom: q(el.bottom),
          vw: innerWidth,
          vh: innerHeight,
        };
      });
      ok(
        r.w > 0 &&
          r.h > 0 &&
          r.left >= 0 &&
          r.right <= r.vw &&
          r.top < r.vh &&
          r.bottom > 0,
        `${tag}: blurb box visible, horizontally inside viewport (${JSON.stringify(r)})`,
      );
      if (shotDir && label === "legacy11")
        await p.screenshot({
          path: `${shotDir}/ca01weather-${mode}-${label}-${name}.png`,
        });
    } else if (kind === "era12") {
      ok(s.sel === "canticle", `${tag}: canticle selected (${s.sel})`);
      ok(
        !!s.blurb &&
          s.blurb === pk.worlds.find((w) => w.id === "canticle").eras[12].blurb,
        `${tag}: eras[12] blurb shown`,
      );
      ok(
        !s.page.includes(NEW),
        `${tag}: replacement not on page (era-12 blurb in effect)`,
      );
    } else {
      ok(!s.page.includes(NEW), `${tag}: replacement not on page`);
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join("|")}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`ca01weather-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
