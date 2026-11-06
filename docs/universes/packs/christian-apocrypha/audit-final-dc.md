# DC exact-head final recheck

2026-10-29. Implementation `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`; original audited implementation `8ae91333461bfeb989b570857a0aba321eaa34df`; controlling research `4dc7f444246ab0c5afffe90ee3fb1838b92493aa`. Read builder resolutions from `audit-build.md` on main (that file does not exist on implementation head). No remote mutations.

## Correction dispositions

**APB-007,008,009,010,011,019 are verified resolved at this head.**

- 007, line449/m2-01: first letter alone now owns years169/188; second remains separate.
- 008, line332/jdt-07:34 days modifies siege, followed by failing water supplies, not34 days wholly without water.
- 009, line764/Nineveh: the ending now expressly moves Tobiah to Ecbatana.
- 010, line326/jdt-01: summons/refusal before capture; defeat of Arphaxad before taking Ecbatana.
- 019, line786/Egypt.more[6]: remit now reaches Egypt’s borders rather than including Egypt.
- 011: evaluated old and fixed packs independently; exactly95 DC event side labels changed. Joined each against exact-research coverage CSV, not the new presence-only test: **80 NABRE and15 RV1895, zero mismatches**. All138 single-edition chapter/prologue rows match; manually checked remaining9 composite/addition labels against `read_extent` (EstherA–F, Daniel prayer/song, Susanna, Bel). The coverage CSV at implementation head is byte-identical to research head. Thus all147 labels preserve the selected edition; no blanket NABRE assignment hides RV substitutions.

## APQ-004 — precise research disposition proposed

**Recommend reconcile in favor of earliest slot1, not silently retain5.** Research `deuterocanonical-research.md` line53 already assigns `dc-ref-babylon` to1/`dc-tob-14`, retaining Baruch scene at5; line60 requires earliest work references. `integration-contract.md` line9 allows the neutral shared label at the earliest supported slot and preserves source-specific gates; line41 implements earliest-book gating. `geography-reuse.md` requires each claim’s own work/section and earliest gate. Fresh [NABRE Tobit14:4](https://bible.usccb.org/bible/tobit/14) explicitly mentions Babylon as less safe than Media. This is narrated advice, not a journey or a scene in Babylon.

The inconsistent artifacts are the integration registry (`dc-ref-babylon.first=5`, Tobit absent from its source bundles), its derived record-work index (`baruch,5`), and the built badge `[5,6,7,8,9,10,11,22]` at lines264–270. Builder correctly declined unilateral badge expansion while research was inconsistent.

Proposed owned research correction, then builder follow-through:
1. Keep the dossier’s slot1 claim. Add the Babylon comparison explicitly to `dc-tob-14` coverage payload and `dc-tob-14-card` copy/place_refs, with a no-journey/no-city-scene limit.
2. Set `dc-ref-babylon.first=1`; add `dc-tob-14`, its NABRE URL and14:4 locator to source lists, leaving all later sources intact.
3. Add a new stable typed mention edge (e.g. `dc-ref-babylon-mention-tob14`; do not renumber existing01–07) from the Tobit card to the reference at1, with advice/comparison semantics. Regenerate/update matching index rows: reference becomes`tobit,1`, new mention`tobit,1`; existing Baruch and later edges retain their original gates.
4. Builder adds slot1 to the existing Babylon neutral anchor’s books and updates its earliest-source comment/test. No new pin/coordinate, no `site:'babylon'` on `tob-14`, no route, no Baruch content at1. Neutral city heritage disclaimer stays. Preserve Babylon/Babylonia distinction.

This report proposes those edits; it does not claim they have been applied or that APQ-004 is closed in the repository.

## Final sample — all14 DC selected entries freshly verified

Sample is parent’s `/tmp/apocrypha-final/sample.json`; no substitutions. All factual clauses of each selected base/entry were checked; Modin’s attached later addition was additionally verified. C-text only, not historical authentication. **No new High/Medium issue. One Low wording precision issue below.**

| Selected entry | Fresh selected primary and claim-by-claim disposition |
|---|---|
| Modin | [RV1Mc2](https://ebible.org/eng-rv/1MA02.htm)2:1 origins/move from Jerusalem,15–28 resistance,70 burial; [RV1Mc9](https://ebible.org/eng-rv/1MA09.htm)9:19 Judas’s burial; [RV1Mc13](https://ebible.org/eng-rv/1MA13.htm)13:25–30 Jonathan’s bones and Simon’s family monument/seven pyramids; [RV1Mc16](https://ebible.org/eng-rv/1MA16.htm)16:4 later mention. All supported. Seven pyramids belong to the family monument, not seven separate monuments solely for Jonathan; current wording is compressed but does not explicitly deny that. Attached more: [RV2Mc13](https://ebible.org/eng-rv/2MA13.htm)13:14–17 camp at Modin/night attack supported. |
| Bethbasi | [RV1Mc9](https://ebible.org/eng-rv/1MA09.htm)9:62–71 supports Jonathan’s party fortifying/defending against Bacchides. Simon remains in town while Jonathan fights outside; the card’s collective leadership summary is acceptable, not a claim Jonathan personally remains inside. |
| Chola | [RVJudith15](https://ebible.org/eng-rv/JDT15.htm)15:1–5: message after the killing, Chola explicitly in4. No modern location asserted. |
| m2-03 | [RV2Mc3](https://ebible.org/eng-rv/2MA03.htm)3:4–8 Simon/Onias/Apollonius, royal commission, inspection cover and named provinces;9–12 Jerusalem and deposits, including Hyrcanus son of Tobias;24–26 apparition;31–34 Onias’s sacrifice/recovery;35–39 return/testimony. **Low precision issue** at pack451: rider and two young men said to strike, whereas25 gives the horse’s forefeet and26 the youths’ scourging. Prefer “A horse bearing a heavenly rider strikes Heliodorus, and two young men scourge him.” Rest supported; apparition attribution retained. |
| Egypt.more[8] | [DRAEsther13](https://www.biblegateway.com/passage/?search=Esther+13&version=DRA)13:8–18, specifically16, explicitly places the Egypt recollection in Mordecai’s prayer. Correct selected witness for this half of additionC; no travel claim. |
| Embassy of Eupolemus and Jason | [RV1Mc8](https://ebible.org/eng-rv/1MA08.htm)8:17–19 names both envoys and Rome; mentions a long journey but no intervening stops. Supported. |
| m2-14 | [RV2Mc14](https://ebible.org/eng-rv/2MA14.htm)14:1–2 Demetrius son of Seleucus/Tripolis;3–13 Alcimus/about151/Nicanor;16–25 Lessau/reconciliation/Judas’s marriage (no wife name);26–30 complaint, royal Antioch order and escape;31–34 temple threat, with note explicitly giving Greek Dionysus for Bacchus;37–46 Razis’s siege/death. Note at16–17 says Greek corrupt. Every stated clause supported. |
| Esdraelon | [NABREJudith1](https://bible.usccb.org/bible/judith/1)1:7–8 summons; [RVJudith3](https://ebible.org/eng-rv/JDT03.htm)3:9 approach near Dotaea; [NABREJudith4](https://www.biblegateway.com/passage/?search=Judith+4&version=NABRE)4:6–7 passes/Esdraelon association; [RVJudith7](https://ebible.org/eng-rv/JDT07.htm)7:3 camp extent including Belmaim and Cyamon opposite Esdraelon. Supported as broad area description, not a plotted route. Exact text uses breadth Dothaim–Belmaim and length Bethulia–Cyamon; the brief “between” wording is geographic compression. |
| wis-09 | [NABREWisdom9](https://bible.usccb.org/bible/wisdom/9)9:4/10 petition for Wisdom;8 holy mountain/temple/city; chapter body has no city proper name. Note9:1–18 expressly identifies the modeled Solomon prayer. Supported; body/note distinction preserved. |
| Lud | [NABREJudith2](https://www.biblegateway.com/passage/?search=Judith+2&version=NABRE)2:21–27 Nineveh-to-Damascus campaign includes Lud23; notes2:14–3:10,21,23 support advance sequence, impossible compressed march, and literary rather than definite-locality treatment. “Partly rhetorical” fairly summarizes the note’s assonance/prophetic-overtones account. No map route created. |
| Lydia | [RV1Mc8](https://ebible.org/eng-rv/1MA08.htm)8:1–8 report heard by Judas, Lydia in8. Attribution to narrator’s report rather than independently corrected map is appropriate. |
| sir-25 | [NABRESirach25](https://bible.usccb.org/bible/sirach/25)25:1–11 virtues,13–26 hostile judgments;24 and its note explicitly refer to Genesis’s first sin. The pack attributes rather than endorses these judgments. Supported. |
| Bethsura.more[7] | [RV2Mc13](https://ebible.org/eng-rv/2MA13.htm)13:1 Eupator campaign,19–20 Bethsura and Judas conveying necessities. Supported. |
| m1-05 | [RV1Mc5](https://ebible.org/eng-rv/1MA05.htm)5:3–8 Idumaea/Ammon;17–23 Simon/Galilee/Arbatta/Judaea;24–34 Judas/Jonathan/Jordan/Nabathaeans/Bosora/relief;37–44 Timotheus/Carnaim temple;45–52 Ephron/return across Jordan opposite Bethshan;18–19 and55–62 Joseph son of Zacharias/Azarias disobey and lose at Jamnia;65–68 Hebron/Azotus;66 and note Samaria/Marisa. All clauses supported; no invented exact itinerary geometry. |

### Retrieval and scope limitations

USCCB Judith2 and4 returned403; licensed BibleGateway supplied the same NABRE body and notes. An intermittent RV2Mc3 fetch failed once then succeeded; no pending source access gap in these14 entries. This sample is not a full rereading of all147 DC units. Earlier comprehensive registry/dossier sweep and its inherited evidence limits remain as stated in audit-build-dc.md. Existing APB-004 technical gate is outside this content recheck.

### Builder-ready APQ-004 field brief

- `deuterocanonical-coverage.csv`, `record_id=dc-tob-14`: append to `atlas_payload`: “In his parting advice Tobit says Media will be safer than Assyria or Babylon (14:4).” Append to `limits`: “Babylon is a comparison in advice, not a visited destination or a scene.” Existing `first=1`, edition, source_url/read_extent stay unchanged.
- `deuterocanonical-integration.csv`, `id=dc-tob-14-card`: append same advice sentence to `copy`, append `;dc-ref-babylon` to `place_refs`; append same limit. Keep first1, event-group, and all existing data.
- Same registry, `id=dc-ref-babylon`: change `first`5→1; prepend `dc-tob-14` to `source_bundles`, `https://bible.usccb.org/bible/tobit/14` to `source_urls`, `Tobit14:4 (NABRE; comparison in parting advice)` to `passage`. Preserve later bundle/URL/passage associations. Keep reference-only/no-new-position disposition and generic label copy.
- New registry row `id=dc-ref-babylon-mention-tob14`: kind=`typed-edge`; label=`Textual place reference`; first=`1`; source_bundles=`dc-tob-14`; source_urls=above NABRE URL; passage=`Tobit14:4`; confidence=`C`; evidence_layer=`attributed text`; subject=`dc-tob-14-card`; predicate=`mentions-place`; object=`dc-ref-babylon`; date_precision=`unknown; do not derive Gregorian date`; copy=advice sentence above; limits=`Comparison in parting advice; not proof of a visit, an event occurring here, a route or historicity.`; disposition=`reference-card`; other relational fields empty, matching existing mention-row convention. No existing IDs renumbered.
- `record-work-index.csv`: `dc-ref-babylon` changes work key`baruch`→`tobit`, first5→1; new mention row uses registry filename, kind`typed-edge`, work key`tobit`, first1, ordinary separately-gated note. `dc-tob-14-card` already has correct work/slot. Existing `dc-ref-babylon-mention-01` through`-07` stay unchanged at5/5/6/7/8/9/9.
- `deuterocanonical-research.md`: existing stable-reference table already correct; optionally add explicit14:4 advice sentence to Tobit14 bundle for consistency. Derived counts/index tests must reflect one added typed edge, not a new event/place.
- Pack anchor `id:'babylon'` has **no `first` property**; earliest visibility comes from `books`. Change to `[1,5,6,7,8,9,10,11,22]` and comment earliest source to Tobit14:4. No coordinate change. Generic present-day city disclaimer is safe at1. No existing later narrative is in this generic anchor description, so no `more` migration is needed. If adding a Tobit-specific description, keep it explicitly attributed to Tobit; any Baruch description must still gate at5. `tob-14` remains without a Babylon `site`; its text may append the advice comparison after research acceptance, but no new event or route is required.
- Regression checks: Babylon neutral marker selectable at1; Baruch scene still unavailable before5; unchanged coordinate inventory; `tob-14.site` not Babylon; prior later work badges retained.

APF-001 is the Low/nonblocking m2-03 horse/rider precision issue above; it does not reopen APB-007–011/019.
