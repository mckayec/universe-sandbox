# Fix return: Society SO4/SO5 finite text/landmark cuts

2026-11-09 UTC, Claude. PR37 `atlas/deep-worlds`, new head **2f04e416696f0fe32ab5eca7be5d8b578cd129cd**, parent **08d10e1736d3e6916d7a061d311ddb13f444bb05**. Instructions: [omission-review-08d10e1.md](omission-review-08d10e1.md). Full diff: [so45-diff-2f04e41.patch](so45-diff-2f04e41.patch) (1 file, `public/atlas/society.js`, +14/−18). No other file changed.

## Applied (selector → new text)

SO4 (Europa, garden option A):

| Selector | New text |
|---|---|
| `POIS.europa[lornhome].desc` | "A castle on an island of Europa’s ocean. Lorn au Arcos lives here with his family, far from his wars." |
| book-keyed `europa.lornhome[1]` | "A castle on an island of Europa’s ocean." |
| live `villa.desc` (SITES.europa @6425) | "Keep and walls on Harmonia’s heights, in the Discordia Sea. Darrow comes to recruit his old teacher; …(rest unchanged)" |
| `lmGate("europa","villa",6,…)` texts 1 and 2 | same two deletions; rest unchanged |
| live landmark `garden` + `lmGate("europa","garden",2,…)` | **removed** |
| live scene `blurb` | "A castle on Harmonia, an island in the Discordia Sea: a great keep and hall on the heights, cliffs falling to the sea and Jupiter filling the sky. Lorn au Arcos withdrew here from war." |
| live `facts` Island | "Harmonia, Discordia Sea" |
| `EVENTS e9.text` | "Darrow comes to recruit his old sword teacher. After Tactus betrays them, Lorn executes him and joins Darrow’s cause." (title/IDs/body/poi/lm unchanged) |

SO5 (Tyche, centralcmd option A):

| Selector | New text |
|---|---|
| `POIS.mercury[tyche].desc[4]`, `[5]` | both now end "…and bridged islands." (identical to [1]) |
| place-map `HCITY[tyche].desc` | "…spilling onto bridged islands." |
| `harbor.desc` | "Tyche’s waterfront on the Sycorax Sea." (its `lmGate` base already equal; left as a no-op) |
| landmark `centralcmd` + `lmGate("tyche","centralcmd",5,…)` | **removed** |
| `morningstar.desc` + `lmGate` text 5 | "Darrow’s flagship." (gate text 4 unchanged, now equal) |
| `SITES.tyche.eras[4]` | **removed** (base-blurb fallback; no replacement) |
| `SITES.tyche.eras[5].blurb` | "Dark Age. Toggle the Storm Gods to see the flood." |
| `SITES.tyche.eras[6]` | unchanged — unverified, outside this acceptance |

## Not touched (as instructed)

- Flood feature: event d8 (`lm:"harbor"`, `fx:"flood"`), `FX.flood`, `FX_VIEW.flood`, Storm Gods toggle, later-book flood visuals, tour caption "…drowns when the flood comes", era-6 blurb. Recorded together as one **outstanding source/cut gate**; their survival is not canon approval.
- Book-IV Tyche gate (`SITE_FROM.tyche=4`): unchanged, still unresolved.
- Harmonia/Discordia early-book visibility: unchanged, separate gate question; no gates widened.
- Dead code: the overwritten early `SITES.europa` registration (@3431: blurb, `villa`, `garden`) and the @4479 wrapper that writes `E.blurb` ("…white limestone castle on a northern island…") onto that same captured object before the @6425 reassignment, plus the @6391 code comment, still contain the held wording. None is displayed (runtime site name is "Lorn’s Castle", not the wrapper's "Europa"; rendered text checks below found no held clause). Not a repository-wide textual purge.

## Dependency closure

`garden` (Europa) and `centralcmd`: 0 surviving references in events, tours, FX, gates or other files (`grep` across public/, src/, tests/). The other `garden` ids (Lykos Bubble Garden, Spire winter garden, asteroid Tabula Rasa garden) are different sites and unchanged. No dependency beyond the named closure was found. e9 (→ lornhome/villa) and d8 (→ tyche/harbor) still resolve; villa, harbor, `deep`→thedeep (later Athena entry), POI_FULL_AT.europa.lornhome=2 retained. SO1–SO3 removal and the 14-object Expanse/Hyperion omission are unchanged (only society.js touched in this delta).

## Validation (builder-run)

- `pnpm check` (format, build, 125/125 unit tests, check:dist 175 files): pass.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- [so45-probe-2f04e41.cjs](so45-probe-2f04e41.cjs) → [output](so45-probe-output-2f04e41.txt): **32/32 PASS, 0 FAIL, exit 0** at 1440×900 and 390×844 against `vite preview` of the head build. Addresses the earlier probe critique: exact site-name equality (`Lorn’s Castle`/`Tyche`) and `mode==="site"`, process exits 1 on any FAIL. Checks landmark lists, era blurbs, e9/d8 refs, Storm Gods toggle, static texts, and absence of 8 held patterns in `document.body.innerText` after entering Europa (books 2, 6, all) and Tyche (4, 5, 6, all at 1440; 4, all at 390), plus gotoEvent e9/d8, zero page errors.
- Limits: drives `window.__atlas` (test hook with `__atlasFast`), not user clicks; innerText covers the visible dossier/panels, not every landmark tooltip individually; no screenshots; `test:browser` not run for this text-only delta. 0/6 Society rows source-verified; DWO-S1, final Society technical suite and 4-viewport evidence remain open.

## Handoff

fixing/claude → content-review/chatgpt: review the SO4/SO5 diff at 2f04e41. Open gates: flood feature + era 6 (source/cut), book-IV Tyche availability, Harmonia/Discordia early visibility, DWO-S1, final technical, canon and release. Not merged.
