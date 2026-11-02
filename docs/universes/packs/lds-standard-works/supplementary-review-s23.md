# Checkpoint 23: final imports, citations and Church display name

Reviewed implementation **e09d6e83bb8774e798cdf583150f380eff2b0282**, code **a440133576437028b88dd4d2888bf91e22eccf8d**, against **82a0053bf64e680554afe5a178576f9c017b1fc0**. Prior content review **9dcd550f052a66a18b8983bb4d6fd3a1e68dd82d**; accepted SD register **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**, completed research **3729dbb33a98705fe8117a2aa53d9d058b870d9d**. This is a delta review with unchanged evidence inherited explicitly, not another full-corpus audit. Claude retains fixing ownership, code and lock. No approval or release.

**S22-C1 closes:** FM08 includes the D&C 7 heading and FM09 includes the D&C introduction's 1981-edition source. Both original links remain, gates are unchanged, and the generator/mapping preserve the additions without duplicate URLs.

**The SD import backlog is closed: 1,271 imported, zero pending.** All final 11 rows were compared with accepted source context. Three attributed model cards are new; eight narrative rows consolidate into existing views. This is import accounting, not full integration acceptance. S23-C1 below restores already-required model context; the earlier identity/navigation and final technical gates remain.

## S23-C1 — carry the accepted Church-position notice with the new models

The three `bom-model-*` cards label themselves proposed and attributed, preserve disagreements and draw no geometry. However, neither those cards nor another pack entry supplies the accepted G1 Church-position note. The general independent-publication disclaimer does not explain the Church's position on these particular models. `geography-evidence.md`'s default-representation section and `geography-source-audit.md` retain that requirement.

Add the following notice with the model summaries, either in each card or a shared context view that is visibly available with them at `3/bom`:

> For Book of Mormon events in the ancient Americas, the Church takes no position on specific geographic locations. These models are individual interpretations, not Church-endorsed maps.

Attach **Church, Book of Mormon Geography**: `https://www.churchofjesuschrist.org/study/manual/gospel-topics/book-of-mormon-geography?lang=eng`. This [official overview](https://www.churchofjesuschrist.org/study/manual/gospel-topics/book-of-mormon-geography?lang=eng) was rechecked on 2026-11-02; its position and caution against implying institutional endorsement support the notice. No fresh archaeology or owner choice is needed. Keep the individual proponent/critical sources and their labels. Acceptance: model readers can see the notice and its source without changing work/layer, with no model coordinates or implication of equal scholarly support. This is existing required context, not basemap scope expansion.

## Changed copy, model evidence and inherited limits

[Eleven-row comparison](supplementary-review-s23/row-comparison.csv) retains accepted context, actual copy, sources, gates and dispositions. All 11 rows retain their minimum individual payloads; the three model rows share S23-C1's contextual gap.

- **SC52:** Sorenson's limited setting and Wunderli's critique retain their distinct claims; criticism is not proof of an alternative geography. Heartland remains a model family, with the FAIR-described Niagara variant separate from Hedges's later Lake Michigan corridor account. Orson Pratt's historical hemispheric interpretation is not treated as established geography. These are inherited G3–G6 readings; FAIR is a secondary description, not an inspected proponent map. No new full book reading, archaeological confirmation or model ranking is claimed. The later geography-source audit remains applicable and is not superseded by the older access notes.
- **SC53:** SD1264 → BE02; SD1265 → BE03; SD1266 → BXP02; SD1267 → BJ01. Burial versus death location, separate coastal/mountain/sea settings, Arabian/American Bountiful, the textual Irreantum gloss and unspecified landing are retained. No pins, dates or ocean track are added.
- **SC54:** SD1268–1271 → BJ11. Tower/Nimrod/Moriancumer/Shelem stay distinct stages or excursions, with relative geography, the four-year camp and unknown modern locations. Earlier crossings are not silently made the final voyage.
- **Two low-impact copy refinements**, not additional research blockers: remove the implementation-only parenthesis “(SD1266 consolidated here)” from BXP02's visitor text; retain it in mapping. To remove residual first-sentence ambiguity in BE02, use “The narrative reports Ishmael’s death and says he was buried at Nahom; his daughters mourn.” Its following burial-not-death qualification is already correct. Keep both corrections in generator copy if applied.

No other canonical copy changed. All 81 children and prior SC49/SC51 prose are unchanged and inherit S22's bounded source-review result, including its identity/link limitations.

## Owner display naming

`meta.title` and `meta.series`, registry title and sandbox pack label now exactly use **The Church of Jesus Christ of Latter-day Saints · Standard Works**. Splash, canvas label and introductory prose use the full Church name. All five permitted pack text changes are accounted; registry and sandbox deltas are single label replacements. Historical/quoted/descriptive uses, pack identifiers and the independent-publication disclaimer remain unchanged. No hosted-preview result is used as repository evidence.

Two committed naming images were inspected: 390×844 shows the long splash title wrapped within the frame; the file named `s23-splash-1280x800.jpg` actually shows the atlas/header with the full label, not the loading splash. Thus it supports header fit at 1280, not a desktop splash claim. Both are static evidence, not proof of keyboard or final loaded-state acceptance.

## Reproducible validation

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s23/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s23/accounting.py
```

[Probe](supplementary-review-s23/probe-result.json): **three added / seven changed / 1,513 unchanged prior cards**, 1,523 total and 1,490 unique keyed cards. **250 gate combinations and 23 early-work exclusions pass.** Outside the listed naming strings and card changes, the pack is structurally unchanged; engine JS/CSS/layers are byte-identical. FM08/FM09 change sources only; four primary geography cards change descriptions only. Models are nonspatial `3/bom` cards.

[Accounting](supplementary-review-s23/accounting-result.json): all **1,271 SD provenance records** reconcile; the 11 state changes are precisely SD1261–1271. Old mappings are unchanged except SD1259/1260's supplied citation labels. Every imported and composite target resolves. Generator reproduction, including `copy_geo.py`, yields **byte-identical pack and mapping** in an isolated temporary directory. **1,365 total/imported mapping rows** resolve to **1,333 unique cards**, including 13 existing primary cards; **1,320 supplementary cards**, 81 children, nine standalone prose cards and four constraint/consolidated-prose mappings. Do not count composite target strings as separate entities.

[45/45 local tests](supplementary-review-s23/unit-results.txt) passed (`lds-pack.test.ts`, `atlas-layers.test.ts`). Coverage, source-witness and reference-disposition validators passed; outputs retained. These checks do not certify primary reading or history. Exact implementation [CI 41378063813](https://github.com/mckayec/universe-sandbox/actions/runs/41378063813) and final review-head terminal results are recorded in the main handoff.

## Technical evidence correction and finite release handoff

The receipt says the local `pnpm test:browser` smoke did not finish within ten minutes under SwiftShader and that CI runs it. At this exact head, `.github/workflows/deploy-pages.yml` invokes **`pnpm test:pages`**, not `pnpm test:browser`; `package.json` maps these to distinct scripts (`standalone-pages.mjs` and `browser-smoke.mjs`). Correct that receipt statement. Passing standalone-page CI does not close the separate smoke timeout or unperformed interaction tests. No reviewer browser/DOM/server was executed and no workaround is authorized.

Four of 14 new committed images were inspected: the two naming images above and `bom-more` at 390×844/1440×900. The model cards visibly identify proposals and sources; compact labels truncate and lower content continues beyond the visible panel. The other ten images were not independently inspected in this bounded delta review. Builder reports DOM-assisted tab selection and SwiftShader captures, with the 4K run's report cut off after screenshots; retain that limit rather than asserting a clean completed 4K run.

| Next owner | Required initial-release action |
|---|---|
| Claude — content | Add S23-C1 and its source; optionally apply the two small copy refinements. No SD rows remain to import. |
| Claude — integration | Complete the previously requested 12-person accepted-key/source-view/gate crosswalk. Demonstrate See-also navigation/filter behavior or explicitly document unsupported behavior for disposition; finish the broader BA07 primary/supplementary identity, typed-link, timeline, source/vision and omission/consolidation crosswalk. The receipt still marks these open; this review does not infer their completion from import counts. |
| Claude — technical | Correct the CI/smoke receipt distinction; diagnose the separate smoke timeout and supply actual terminal results or a precise remaining technical blocker. Supply final same-head keyboard/focus/escape, native-select, touch, real-GPU and completed 4K/laptop/phone evidence, including naming fit and content/link reachability. Do not equate screenshots or helper tests with interaction acceptance. |
| ChatGPT | Recheck the changed delta and completed integration evidence at the final implementation SHA. Inherit unchanged validated material explicitly; no repeat canon sweep needed absent a new issue. |
| Owner | Specific-PR release approval after final content and technical evidence. None is supplied by this report. |

**Basemap remains follow-on and nonblocking** under the owner's priority clarification (`1240f12fcb9923968993f37cad831515a30b1425`). The already-approved schematic and separately missing archaeology/LiDAR comparison artifacts do not block these Earth-atlas corrections. No new broad research, source-access blocker, implementation edit, merge, deployment or release is introduced by this audit.
