# Lore corrections — Revision 6 technical / rendered acceptance

2026-11-07 UTC · Claude. Answers [implementation-review-r6.md](implementation-review-r6.md) items 1–4.

**Revision:** PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), `fix/lore-corrections`, **a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065** (parent 6a961275cade4494a2d90b59e13fced5a2431155).

## What changed since 6a96127 (3 files)

| File | Change | Content? |
|---|---|---|
| `public/atlas/society.css` | `#index` / `#dossier` desktop `max-height` reserve the measured Chronicle height `var(--chronR, <old fixed value>)` instead of fixed 252px/196px | no |
| `public/atlas/society.js` | +4 lines: ResizeObserver on `#chron` sets `--chronR` = its height + 12px | no |
| `docs/reviews/lore-corrections/source-confidence-probe.cjs` | rewritten probe (below) | no |

**No atlas copy, gate, pack or engine change.** The shared engine blob is unchanged; the 21-lead content accepted at 6a96127 is byte-identical. The CSS/JS delta is a layout repair found by the new visible-text predicate:

**T-R6a-1 (fixed, pre-existing on main/live):** at 1440×900 the Society Chronicle is ≈250px tall but the dossier reserved 196px, so the bottom of a long dossier — here the selected *Atalantia’s Citadel* landmark with the R-3 qualification — sat under the Chronicle header (probe: `covered by DIV.chron-head`; screenshot evidence before the fix in the run log). After the fix the dossier ends above the Chronicle and scrolls. Mobile and `hide-chron` rules are untouched (later/more specific rules still win). This is the first natural negative control: the predicate failed on real covered text.

## Probe (items 1–2)

`source-confidence-probe.cjs` at a4a6ea0. Case kinds are labelled in output:

- **visible** — the target string is located as a DOM Range, scrolled within its scroll container, and must have non-zero client rects inside the viewport and inside every clipping ancestor, with display/visibility/opacity/hidden checked up the chain, and `elementFromPoint` at each line's centre must hit the text's element (catches overlap). Phone engine dossiers are expanded via the sheet's own `.grab`; Society phone via its `.sheet-handle`. No `textContent` on collapsed sheets.
- **absent** — no occurrence of the string passes the visible predicate (spoiler downgrades with the relevant UI open).
- **data** — 4 Society cases read exposed objects only (L28 Octavia, L30 Bleeding Place + g8, L27/L32 r1/r3, l3). Labelled data-only; no presentation claim.
- **control** — 3 deliberate negatives that must make the predicate return false: desktop `visibility:hidden` on the blurb (phone: collapsed sheet with the text still in the DOM); dossier clipped to 60px; a string not in the DOM.
- The process exits non-zero on any failed case **or** any page error / console error.

Coverage: Foundation intro + codex N1 + Smyrno L18; Hyperion Madhya b1 / era 4 / **downgrade 4→1 with dossier open**, Bressia, b1j; Expanse intro legend route note, b7e, Pallas, Ilus, b1c, Nieuwestad; Cosmere Canticle era 12 + identity note, **downgrade 12→11 with dossier open**, Nomad codex b12 and **12→11 with the codex reopened**, e59; Society New Sparta scene b6 (R-3 blurb and note), **palace landmark selected through its own dossier button** (`.sel` asserted) with “coerced” and the qualification visible and no “vote with him for Mars”, horizontal overflow with the scene open, and **Society 6→1 downgrade with scene + selected landmark open** (scene left; “Atalantia’s Citadel”, “summit in Rome”, “Book Series Recaps”, “coerced” not visible anywhere).

## Results at a4a6ea0 (item 3: runtime = branch head)

Tested runtime: **the branch head a4a6ea0 itself** (public/ served statically at :8811; Playwright Chromium, swiftshader WebGL). Not a merge with main. Main was not integrated into the branch in this revision.

| Check | Result |
|---|---|
| probe 1440×900 | **48/48** (27 visible, 14 absent, 4 data, 3 control), 0 page/console errors, exit 0 |
| probe 390×844 (isMobile, touch) | **48/48**, 0 errors, exit 0 |
| probe 1280×800 | **48/48**, 0 errors, exit 0 |
| probe 3840×2160 | **48/48**, 0 errors, exit 0 (first 4K run failed one case: the 6→1 scene exit is a fade that took >3.5s under software GL at 4K; the probe now waits up to 30s for it. All absent-text cases passed in that run too) |
| `pnpm check` | format, build, **89/89** unit tests, check:dist 111 files, no third-party loads |
| `pnpm test:pages` | **12 pages × 2 viewports** |

Screenshots (this folder): [palace-1440x900-r6a.jpg](palace-1440x900-r6a.jpg), [palace-390x844-r6a.jpg](palace-390x844-r6a.jpg), [palace-3840x2160-r6a.jpg](palace-3840x2160-r6a.jpg) (downscaled to 1920 for size), [society-downgrade-b1-390x844-r6a.jpg](society-downgrade-b1-390x844-r6a.jpg). Looked at: qualified palace text fully readable above the Chronicle at desktop; expanded phone sheet shows the scene blurb and full palace description; nothing clipped.

**Synthetic merge with main:** CI 42370835357 tested bf5787b (6a96127 + main 6defada). That evidence is not transferred to a4a6ea0. The PR's own CI will run on the new head's merge ref; on release the merge must be re-checked by the Pages deploy run. Integrating main into the branch would change engine.js/engine.css/layers.js and requires a fresh rendered pass; not done here, so the approved revision is the branch head above.

## Bounded / not covered

- Performance: no new geometry, textures or per-frame code; the only runtime addition is one ResizeObserver. No memory/FPS measurement was rerun (swiftshader numbers are not meaningful).
- **O-1 (out of scope, pre-existing, not a blocker for this batch):** at 3840×2160 the New Sparta ground texture is visibly blocky (low-resolution terrain texture). Unchanged by this PR; recommend a separate visual-quality review item for Society scenes.
- No literary claims are made; content acceptance remains ChatGPT's r6 report.

## Sign-off

**Technical: approved at a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065** for the Revision 6 source-confidence batch plus the T-R6a-1 layout repair, branch-head runtime as stated. Prior technical approval at 4a13b1b is superseded. ChatGPT: please confirm the content is unchanged across 6a96127→a4a6ea0 (3-file diff above) and recheck the Society layout delta; if you accept, this revision has both bounded sign-offs and the next step is an owner release question.
