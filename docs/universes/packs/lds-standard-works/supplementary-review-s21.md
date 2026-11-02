# Supplementary checkpoint 21: PGP identity and vocabulary

Implementation **91a69fbaa9f42e9409955f0c2d35fe59eb02fdd0**, code **71794a3f5eab02dc9435a909d23814784eb8ec54**, baseline **b27b845eec64bb987feb82fe1674051c9dde0e40**, prior review **42e5f91613b91e07c8d23c38132f5f740b7b6ac4**. Accepted SD register: **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**, preserving the completed research at **3729dbb33a98705fe8117a2aa53d9d058b870d9d**. This is a parallel content review; Claude retains fixing ownership, code and lock. No stage or release approval.

**S20-C1 and S20-C2 close.** QG07 now gives Japheth/450, Shem/42 years later (492 by addition), and Ham/500; PC05 adds the supplied facsimile-disagreement, funerary-text and vignette-uncertainty sentence. PC06's reciprocal overview pointer and the receipt's explicit mandatory SC49 entry are also present. These closures do not imply that SC49 is implemented.

**11/11 new SD mappings compared**, yielding **10 new cards**: SD1244 consolidates into QG07, with its own Moses 8:12 locator retained. **Nine rows conform to their minimum copy/index requirements; two require the corrections below.** All 10 cards have correct `5/pgp` gates and institutional source links. [Row comparison](supplementary-review-s21/row-comparison.csv) preserves accepted context, actual copy, source sets and verdicts. No new children are added; all 75 existing children remain unchanged.

## S21-C1 — SD1243: display the source-specific ages

`PGM-id03-seth-line` says “ages are the account’s own reported figures” but supplies none. Its QG05 cross-reference has none either; QG07 covers Noah's sons, not this parent chain. The accepted SC48 row explicitly requires reuse **with source-specific ages**. This answers builder question 2: retain a compact attributed age payload, not a generic retention statement. A new timeline or extra pins are unnecessary.

Add this compact table or equivalent prose to id03 or an immediately referenced child, under `5/pgp`. These are reported ages when the named child is born, not independently established dates:

| Parent → child | Age | Source |
|---|---:|---|
| Adam → Seth | 130 | Moses 6:10 |
| Seth → Enos | 105 | Moses 6:13 |
| Enos → Cainan | 90 | Moses 6:17 |
| Cainan → Mahalaleel | 70 | Moses 6:19 |
| Mahalaleel → Jared | 65 | Moses 6:20 |
| Jared → Enoch | 162 | Moses 6:21 |
| Enoch → Methuselah | 65 | Moses 6:25 |
| Methuselah → Lamech | 187 | Moses 8:5 |
| Lamech → Noah | 182 | Moses 8:8–9 |

Sources freshly checked on 2026-11-02: [Moses 6:10–25](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/6?lang=eng) and [Moses 8:5–12](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/8?lang=eng). Keep the existing homonym safeguards and QG07 pointer. Do not derive calendar years or copy Genesis totals into this source view. The table addresses the parent-chain requirement; it does not demand a new exhaustive lifespan table. Acceptance: all nine pairs and ages resolve visibly in this source view or its identified child, with the same work/layer restrictions.

## S21-C2 — SD1245: remove the ambiguous spouse pronoun

`PGM-id04-abraham-family` currently says “Terah is Abraham’s father and Sarai his wife.” The subject makes “his” ambiguous. Replace that clause with:

> Terah is Abraham’s father; Sarai is Abraham’s wife.

[Abraham 2:1–4](https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/2?lang=eng), freshly checked, supports the distinction. Keep Lot's unnamed wife, the passage's unspecified brother-parent, and Haran person/city separation. This is a copy clarification, not a claim that the builder deliberately assigned Sarai to Terah. Acceptance: generated copy names Abraham explicitly as Sarai's spouse; no other relationship or gate changes.

## Remaining builder questions and copy dispositions

1. **SD1251 / id10 vocabulary:** the ten-name attributed index and caption references satisfy the accepted index minimum; do not treat it as a complete glossary or independently authenticated translation. An explicit gloss enhancement is supported and avoids making readers infer the shared sun/moon examples. If added, use the following attributed summary, with the current uncertainty disclaimer:

   > In the published explanations, Oliblish is a governing creation next to Kolob; Jah-oh-eh names Earth. Enish-go-on-dosh is associated with the Sun. Kae-e-vanrash is a governing power; Floeese denotes the Moon. Kli-flos-is-es and Hah-ko-kau-beam name the stars represented by figures 22 and 23. Raukeeyang denotes expanse or firmament; the explanation relates it here to Shaumau, height or heavens, and to Shaumahyeem.

   Freshly checked [Facsimile 2, explanations 1–5](https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/fac-2?lang=eng) and [Facsimile 1, explanation 12](https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/fac-1?lang=eng). These describe published interpretations, not modern astronomy or scholarly Egyptian readings. Keep the individual caption locators; do not merge identities simply because glosses overlap. This enhancement is not counted as a third required correction.
2. **SD1243 / id03:** resolved by S21-C1 above, using source-specific parenthood ages rather than an inferred chronology.
3. **SD1250 / id09:** the sun/moon/star/stars glosses and Kolob ordering conform to the accepted Abraham 3 row and previously read source. Its separation from place-name Shinehah and refusal to equate the instruments with JS—History's object are correct. The “Olaha Shinehah” pointer does not merge them. No added precision or new source hunt is needed.
4. **SD1247 / id06:** preserving the two Egyptus statements without imposing a family tree is correct. The accepted row does not require adding the Chaldean gloss. Keep the distinction between the king in verse 21 and the governmental Pharaoh of verse 25, and preserve both wisdom/righteous judgment and the priesthood restriction. QG15 supplies separate current Church context. No present ethnic mapping is authorized.

The other compared rows retain: Cainite/Sethite identity distinctions and unnamed niece; restrained maternity assertions; Onitah's unnamed daughters as victims and royal descent rather than immediate Ham parentage; attributed Shulem/Olimlah/Prince captions without invented personal names or parentage; gods versus humans and Libnah town separation; Rahleenos as the narrative's gloss. These dispositions reuse accepted source evidence, not a new full primary reading. All identity cards are prose: their presence does not establish a typed identity graph or navigable See-also links.

## Reproducible validation and counts

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s21/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s21/accounting.py
```

- [Probe](supplementary-review-s21/probe-result.json): 10 added, three changed and **1,499 unchanged prior cards**; 1,512 total, 1,479 unique keyed cards. All other pack data and engine JS/CSS/layers are byte/structurally unchanged. **325 work/layer combinations and 52 early-work exclusions pass**. No new coordinates, dates or landmark IDs are fabricated.
- [Accounting](supplementary-review-s21/accounting-result.json): all **1,271 SD rows** retain accepted provenance. The 11 new imports are exactly SD1241–1251; all old SD mappings are unchanged. Every imported/consolidated target resolves. Generator reproduction in an isolated temporary directory yields **byte-identical pack and mapping**. The `MERGE_NO_SRC` addition for SD1218 avoids a duplicate chapter link while SD1244 retains its narrower locator.
- **1,251 imported / 20 pending SD rows**: SC50 nine, SC52 three, SC53 four, SC54 four. **1,354 mapping rows / 1,334 imported mapping rows / 1,309 distinct supplementary cards**; 75 children, seven standalone prose cards and one consolidated prose mapping. Imported row counts are not unique view counts.
- [42/42 local tests](supplementary-review-s21/unit-results.txt) passed at the implementation head (`lds-pack.test.ts` and `atlas-layers.test.ts`). Coverage, source-witness and reference-disposition validators passed; outputs are retained beside the probe. Missing historical private source captures remain disclosed by the witness validator. These checks do not establish new primary reading or complete historical truth.
- Exact implementation CI: [41365210163](https://github.com/mckayec/universe-sandbox/actions/runs/41365210163); terminal result is recorded in the publication handoff. No CI rerun or deployment was requested by this review.

## Rendered evidence and mandatory integration still open

The four committed S21 screenshots at 3840×2160, 1440×900, 1280×800 and 390×844 were inspected as pixels. They show the selected PGP tab, source-labelled identity cards, three desktop columns and a single compact column. The compact selected label is truncated, and the lower card continues beyond the visible panel; a still image cannot prove its scrolling behavior. The wide image shows additional rows, but not every card or correction. The receipt reports DOM-assisted selection/scrolling, 28 cards, no page overflow/console errors and SwiftShader playback on code 71794a3. Those are **builder-reported observations**, not reviewer-run interaction tests. No reviewer browser, DOM or server was run. Native-select interaction, keyboard/focus/escape behavior, real-GPU and final same-head technical/rendered acceptance remain open.

Separate from the 20 pending imports, retain these mandatory integration duties:

| Requirement | Current disposition / next action |
|---|---|
| SC49, zero SD rows | Still mandatory: explicit family/member distinctions, Stoal employment and failed mine, Hale/Tarbill marriage context, relayed Harris account, separate artifacts/visits/return, reciprocal baptism and quoted/directing ancient referents. QG14/Cowdery and earlier records cover portions only. Claude must provide a complete source-to-target prose crosswalk; zero rows is not closure. |
| SC50/51 front matter | Finish nine row imports and separately account for the zero-row SC51 prose/identity requirements, including early neutral witness visibility versus later source-specific relationships. |
| SC52–54 geography/model references | Ten pending rows require attribution and uncertainty; proposed models cannot become settled sites or precise routes. |
| SC48 identities | Copy is largely retained, with S21-C1/C2 outstanding; explicit source-specific identity reuse, typed edges and final links still need the broader integration crosswalk. |
| BA07 across primary/supplementary views | Preserve all earlier omission/consolidation, source/vision, timeline, date and identity/link obligations. The unchanged primary 169-view accounting is not re-audited here; newly imported reference cards alone cannot close those behaviors. |
| Release | Changed-head content recheck, same-head technical/rendered evidence and final owner release remain necessary. The approved schematic does not need approval again; missing archaeology/LiDAR comparison artifacts are separate and do not block these Earth-atlas corrections. |

Claude can fix S21-C1/C2 and continue the pending imports/integration without a new owner decision. No source-access blocker prevents these two fixes. This review is a bounded checkpoint, not full supplementary closure or release approval.
