# Scadrial/Luthadel implementation review — 7155f0a

ChatGPT, 2026-11-10 UTC. PR [48](https://github.com/mckayec/universe-sandbox/pull/48), exact audited head **7155f0acbcfa351c73fb990366b4e0bd163ea3cf**, parent **773c35bcaeb727927c9ab6a462a52ab1e9d0e538**.

**Accept the finite implementation of the [Scadrial/Luthadel field handoff](scadrial-luthadel-handoff-2026-11-10.md).** Resume parent-surface research under ChatGPT. Neither parent record is promoted, and no full-work or release approval is granted.

## Actual implementation and independent validation

Read the handoff, [builder return](scadrial-luthadel-return-7155f0a.md), complete rendered probe and exact-head pack. GitHub's actual parent-to-head comparison has **1/1 file**, `public/atlas/packs/cosmere.js`, +4/−3. Fresh metadata confirms this open PR head. The unchanged engine/helper/test files are inherited from the reviewed parent; the actual comparison contains no changes to them.

- **3/3 exact text replacements** match the authorized Scadrial blurb/short and Luthadel description.
- **4/4 field gates** match `{in:["mistborn-the-final-empire"],req:"mistborn-the-final-empire"}`: Scadrial `gates.blurb/short`, Luthadel `gates.name/desc`. Luthadel's name itself is unchanged.
- Neither record receives a record gate. Deep equality of the **entire evaluated pack** against the parent with only those seven authorized substitutions succeeds. This independently checks that all other text, records, geometry, eras, nested realms, facts, registry and event data are unchanged.
- **60/60 reviewer source assertions** pass in [runner](reviewer-parent-return-7155f0a.mjs) and [output](parent-return-output-7155f0a.json): exact copy/gates, full-pack equality, absent parent gates, four actual field selectors plus e6/e12 across **8/8 original-trilogy subsets**, and both unreviewed parent fallbacks. Unlike the preceding proposal probe, this runner injects **no gates into the audited pack**. Only the comparison copy of the parent is modified to test the allowed delta.
- **35/35 focused Node tests** pass freshly: atlas-reading, atlas-reading-engine, atlas-reading-ui and atlas-cosmere-registry. They exercise actual source/helper logic; no full build or browser test is implied.

Input blobs: pack `317cb58c4996c64f3acee32e7c9db00e95512552`; parent pack `aebc2fb385bc6e2bfe453c610b48173f11d50916`; reading.js `4d9bc177294e5e33accf6f19825ef467f0bb90d4`; engine.js `6ecfb467f2577c2ffe57ee93ba5c06ee85979f52`. Local bytes match these Git blob hashes.

Actual selector result: all four field surfaces and both mapped events remain hidden for each of the seven incomplete trilogy subsets; they pass only with all three works selected. The narrower leaf gates therefore do **not** bypass the whole-bucket parent fallback. This is the intended conservative behavior, not an MB01-only accessibility claim.

## Rendered evidence and limitations

Inspected the complete [builder probe](scadrial-luthadel-probe.mjs) and **2/2 supplied screenshots** (1440×900 and 390×844). The visible Scadrial blurb matches the handoff, and the desktop tooltip shows the new short text. The screenshots are builder artifacts, not independently executed views.

Claude reports **84/84 rendered checks** across both sizes, including hidden none/MB01/MB03/MB01+MB02, visible original-trilogy set/preset, legacy book=2, later-era book=6 and All behavior. That total is **builder-reported**; no raw per-assertion success log is supplied with this probe, which logs failures and an aggregate. The screenshots do not independently establish all Luthadel, history or hidden-state behavior.

A fresh reviewer Chromium launch fails before page creation: `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0 reviewer browser cases.** Builder 153/153 full-suite tests, 115 dist files and 24/24 page cases remain attributed for this head. Previous parent CI evidence is historical. Claude's reported simulator Save→Clear→Load failures at both parent/head do not independently prove an environment-only cause or close that separate strict gate.

This implementation review reuses the cited, bounded source packet for unchanged authorized prose. It performs no new full-text reading or fresh source certification.

## Preserved ledger and continuation

**4/10 listed parent fields** have narrow candidates implemented; **6/10 remain held**. **0/2 whole parent records** are promoted. PR48 remains **2/7 key-2 events mapped**, with restrictive ancestors. The broader PR37 inventory retains **8/148 narrow field candidates, 140/148 held fields; 2/65 record candidates and 63/65 record holds**. None of these counts is a whole-book audit. **0/33 full-work approvals.** Existing CBR-01/02/03 closures and earlier bibliography qualifications stand.

Next bounded ChatGPT research unit: inspect the Scadrian system-chart fields and parent-dependent cognitive/era/gfx surfaces against accessible primary material, separating direct publication text, author commentary, map edition/provenance and illustrative geometry. Reconcile PR24/PR37/current PR48 before proposing any implementation. Keep all unresolved whole-record gates and nested/later-era claims held. Do not promote Scadrial merely to expose the two accepted event leaves.

The current canonical sources/editions do not yet resolve those remaining parent surfaces. Continue at `content-review / owner: chatgpt` with this exact checkpoint; no additional builder work is requested by this review alone.

Inspected **18/18 pack statuses and 8/8 review statuses**; agreement active with both sign-offs, unchanged. Three parallel self-audits current. No site or PR-branch edit, merge, deploy or Mckay release approval.
