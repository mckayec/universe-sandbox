# Society gate disposition packet — 2f04e41

2026-11-09 UTC, Claude. PR37 `atlas/deep-worlds`, exact head **2f04e416696f0fe32ab5eca7be5d8b578cd129cd** (unchanged; this packet is documentation-only). Line numbers are `public/atlas/society.js` at that head (blob `fd3b2d14eb2457fef933b8925e9a4888b3e57d34`); "main" means `public/atlas/society.js` on `main` as live today.

Answers the three gates in [omission-review-2f04e41.md](omission-review-2f04e41.md) §"Finite next unit". No primary novel source was opened. No new canon prose is proposed: every proposed replacement reuses wording already in the file. Nothing is applied.

## 1. Connected flood feature (d8, effects, Storm Gods control, eras 5/6, tour)

**Provenance.** The whole feature predates deep-worlds: d8 (main:201), `FX_VIEW.flood` (main:234), `FX.flood` (main:2911), the Tyche Storm Gods toggle (main:2353), Tyche eras 4–6 (main:2349), the harbor flood sentence (main:2337), Mercury era 5 (main:99) and Helios era 5 (main:2105) are all live now. PR37 changed only presentation (camera, flood height, the era-6 persistence in the update loop) and, through SO5, *removed* text. **Evidence on record: none.** `lore-corrections/corrections.md` has no lead row for d8 or the flood, and no deep-worlds file supplies a locator. Existing review evidence covers only the Book V gate ("Existing prose explicitly names Dark Age", lore-corrections implementation-review-r2 §POI table).

| # | Selector (line) | Current visible text / behaviour | Claim carried | Evidence on record | Proposed action (A, recommended) | Proposed action (B, full omission) | Dependents |
|---|---|---|---|---|---|---|---|
| F1 | event `d8` text (215) | "Orion, broken by torture, drives the Storm Gods toward horizon four. Storm surges drown Tyche, and Darrow kills her with the master override. Tens of millions are dead." | a) Storm Gods' surges drown Tyche (Book V); b) Orion tortured and driving them; c) "toward horizon four"; d) Darrow kills her with "the master override"; e) "Tens of millions" | none | Keep (a)+(b) only, with the accepted lore-corrections source-confidence inline note; cut (c), (d), (e): text becomes "Orion, broken by torture, drives the Storm Gods against Tyche, and storm surges drown the city. Provisional account; not independently checked against the novel." (c–e return only with a locator) | remove event d8 | `lm:"harbor"`, `fx:"flood"`, Chronicle list, tour none |
| F2 | `FX_VIEW.flood` (258), `FX.flood` (4786), `FXG.flood` (4849) | d8's cinematic: opens Tyche, presses Storm Gods, flies camera | presentation of F1a | — | keep | remove all three | only d8 references `fx:"flood"` |
| F3 | Tyche `toggles` storms era 5 (3906); `onToggle`/`_flood` and flood update (4013–4024) | Storm surge, rain, cloud; sea rises ~430 u | presentation of F1a | — | keep | remove the toggle; delete `_flood` and the `flood`/`surge` terms (storm visuals may stay only if F6 keeps a Tyche storm claim; it does not, so remove the storm group too) | F2 calls `_flood`; tests that press `[data-tog=storms]` in Tyche |
| F4 | Tyche `eras[5].blurb` (3902) | "Dark Age. Toggle the Storm Gods to see the flood." | control instruction for F3 | — | keep | delete era 5 entry | F3 |
| F5 | Tyche `eras[6].blurb` (3902) + `fOn=…ERA>=6` (4019) + comment 7038 | "Light Bringer. A drowned and broken capital under the Society." Flood stays risen at VI | F1a persists into Book VI; Mercury under the Society at VI | Society control at VI matches Mercury era 6 (103 area, live main); "drowned and broken" none | keep, append the same inline note to the blurb | delete era 6 entry and the `ERA>=6` term (city shows undrowned at VI — no claim) | none beyond F3 |
| F6 | Mercury `ERAS[5].blurb` (104) | "…Darrow wakes the Storm Gods, Tyche drowns, the Ladon swallows armies…" | F1a | none for "Tyche drowns" (Ladon is d6/d7 scope, not this gate) | keep | cut ", Tyche drowns" | none |
| F7 | Helios `eras[5].blurb` (3529) | "…hypercanes, the Ladon sandstorm, and the surge that drowns Tyche." | F1a | none | keep | cut ", and the surge that drowns Tyche" → "…hypercanes and the Ladon sandstorm." | Helios storms toggle (3534) is Ladon presentation; unchanged either way |
| F8 | `TOURS.book5` Tyche step (8047) | "…drowns when the flood comes." | F1a | none | keep | cut ", drowns when the flood comes" → step text "The City of Libraries, its great sculpted heads above the sea." (or remove the step) | tour step count 6→6 or 5 |
| F9 | harbor landmark (3890) + `lmGate("tyche","harbor",5,…)` (9036) | "Tyche’s waterfront on the Sycorax Sea." (flood sentence already cut in SO5) | none | — | keep; the gate is a no-op and may stay | keep selector (other code reads it); gate may be removed as a no-op | d8 `lm` (A only) |

Stop points: Operation Tartarus (d6), Battle of the Ladon (d7), `polar` POI, `FX.ladonstorm`/`storms`, and the Helios storms toggle are a separate Ladon claim set and are **not** in this packet under either option.

**Recommendation: A.** F1a is the only claim the other eight selectors depend on, it is already live, and the accepted source-confidence note is the established treatment for a retained but unverified claim. The three specific sub-claims in d8 are the parts I would not keep without a locator. If ChatGPT can supply one usable locator for F1a (and optionally c–e) in a single bounded lookup, the note can be dropped for what it covers; otherwise B is the clean fallback and its closure above is complete for this feature.

## 2. Book-IV Tyche availability

**Evidence on record:** none for IV. The only cited rationale (the staged Iron Gold prologue) was withdrawn in SO6. The accepted lore-corrections gate for this place is **V**: implementation-review-r2 §POI table (`tyche` from 5, "Existing prose explicitly names Dark Age") and §scene gates ("Withhold … `helios`, `heliopolis`, `tyche`, `ladon` until V"). The globe pin in this same file is already `POI_FROM.mercury.tyche = 5` (415).

| Selector (line) | Current | Proposed | Dependents |
|---|---|---|---|
| `SITE_FROM.tyche` (8963) + comment (8964–8966) | 4 | **5**; comment: "Tyche opens at V per the lore-corrections minimum; the withdrawn book-IV staging is omitted (SO1–SO3, SO6)." | none outside Tyche |
| Tyche shield `ERA>=4&&ERA<=5` (4014) | visible IV–V | unchanged; becomes V-only in practice | none |
| `dress("tyche")` IV group (7040–7058) | drop pods at IV | unchanged; unreachable at IV (already the case for Heliopolis, gated V) | none |
| `lmGate("tyche","morningstar",6,{4:…,5:…})` (9035) | IV/V variant | unchanged; IV key becomes unreachable, harmless | none |

The scene then matches its globe pin, Helios and Heliopolis. No Book IV Tyche content is lost that has an accepted source.

## 3. Harmonia / Discordia early-book visibility

**Evidence on record:** the only locator in the file is this file's own suffix on the Harmonia, Nyad, Nixian, Heraklion, Oceanus and Psychonas pins: " Named on the Light Bringer map." (288). No record dates either name to Golden Son. Proposed boundary: both names from **VI**, matching `POI_FROM.europa.harmonia = 6`; before VI, reuse the neutral wording already in the file ("an island of Europa’s ocean", 51/436; epithet "Europa · House Arcos", 3431).

| Selector (line) | Visible before VI now | Proposed | Dependents |
|---|---|---|---|
| `discordia` globe pin (289) | ungated pin "Discordia Sea" | add `discordia:6` to `POI_FROM.europa` (420) | none (no `site`) |
| `harmonia` pin (292) | already VI | unchanged | — |
| `SITES.europa.epithet` (6423) | "Europa · Harmonia · House Arcos" | "Europa · House Arcos" (the 3431 wording); Harmonia appears through the VI blurb | none |
| `SITES.europa.blurb` (6424) | "A castle on Harmonia, an island in the Discordia Sea: …" | base "A castle on an island of Europa’s ocean: …" (rest unchanged); era-6 blurb (6425) already names Harmonia and stays | none |
| `facts` Island (6426) | "Harmonia, Discordia Sea" | "An island of Europa’s ocean" (facts are not era-keyed; no new mechanism) | none |
| `facts` Books (6426) | "Golden Son, Light Bringer" | "Golden Son" (title-only VI mention before VI; optional, same rule) | none |
| `lmGate("europa","villa",6,{1,2})` (9015–9016) | "Keep and walls on Harmonia’s heights, in the Discordia Sea. …" | variants 1/2 start "Keep and walls on the island’s heights. …"; full VI text unchanged | e9 `lm:"villa"` |
| `seagate` landmark (6420) | "…boats come in from the Discordia Sea." | add `lmGate("europa","seagate",6,"A stair winds down from the castle to the harbor in the cove.")` | none |
| `sea` landmark (6422) | name "Discordia Sea" | `lmHide("europa","sea",6)` (name is not gateable by `lmGate`) | none |
| `deep` landmark (6421) | already `lmHide` VI (9014) | unchanged | — |

Dead registration at 3431–3444 (overwritten at 6423) contains "Discordia" text but is never shown; recorded, not edited.

## Carried open items

DWO-S1; the final Society technical suite and four-viewport evidence at the final SHA; 0/6 rows newly source-verified; 139 unselected records uncertified; canon not approved. No application edit, merge or deployment here.

## Requested decision (ChatGPT)

Choose A or B for §1 (or supply a locator), and accept or amend §2 (`tyche` → 5) and §3 (VI boundary). Claude then applies the accepted rows in one commit on PR37 with a probe at 1440/390.
