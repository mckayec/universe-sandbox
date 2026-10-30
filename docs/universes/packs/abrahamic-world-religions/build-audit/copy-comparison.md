# Complete built-record conformity pass (bounded evidence)

2026-10-30. Implementation `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`; accepted research `f7b74e7bec5b75a9e83666e6fd873f1f21630d0f`. Continues review checkpoint `5d8080b92ba3033252545fd1adbfb8b1991dde84`.

The manual pass compared every supplied record's names, descriptions/blurbs, notes, attribution, dates and relationship/reference meanings with the accepted dossiers and comparative evidence. It includes all four parts: Judaism, Christianity, Islam and Encounters. The accompanying inventory is an accounting of that comparison, not a claim to have newly read 313 primary sources. Crosswalk and source-audit entries provide the already accepted passages and their limitations. A fallback register match by source key denotes the related source passage, not an exact record-ID match. Numeric hashes identify the evaluated JSON copy; they do not prove reading or source access.

| Category | Compared / built |
|---|---:|
| Tree nodes (including parent, merger and notSame fields) |109/109|
| Explicit typed links |27/27|
| Chronicle events |60/60|
| Existing heritage sites |10/10|
| Reference places |59/59|
| Journey/network descriptions |12/12|
| People |24/24|
| Encounters |4/4|
| Population/method cards |8/8|
| **Total records** |**313/313**|

Inventory dispositions: **296 supported conformity;12 correction;5 source-unavailable for fresh confirmation**. Supported means the retained attributed claim conforms to accepted research; it does not turn religious accounts into established history. Source-unavailable means conformity could be compared against prior accepted evidence but current primary retrieval could not independently renew it. CH14 (WCC Pentecostal) and IS24 (USCIRF Pakistan2026) access returned403 earlier in this audit; no bypass or invented reading. ABR01 on the Pentecostal node takes correction precedence over its access limitation. No further independent uncertainty was discovered in other built copy beyond the source qualifications already retained; Q01's six uncertain proposals are a separate inventory.

## New actionable findings

### ABR03 — Formation/episode dates become finite node filter spans (medium)

`judaism.js:111` `jud-ananites`; `christianity.js:37` `ch-early-communities`, `:243` `ch-stone-campbell`, `:306` `ch-strang-movement`. Actual `AtlasTree.normTree` followed by `AtlasLayers.timeOk` gives endpoints800,100,1832,1847 and excludes those nodes in801,101,1833,1848 respectively. Research JU08 and Christianity CH01/CH18,CH15/CH20,CH16 support formation contexts or the1832union, not these four termination dates. The label says emergence; this finding concerns filtering/span semantics, **not** a claim that rendered text explicitly says extinction.

For movement/community nodes, conservative exact data remedy: remove `emerge`/`when`, set `undated:true`, retain the existing source-worded `whenText` and independently dated formation events. Do not simply set `ongoing:true` for historical groups without evidence. Alternatively the builder can distinguish a dated formation-episode node from the continuing/unknown-end community and label that scope expressly; the1832union is a genuine dated episode, but the current movement node must not silently stand for both. A separately specified start-only/unknown-end engine model is another option requiring its own tests. The Second Temple period's evidenced finite span is unaffected.

Acceptance: inspect the actual replacement data and test later-year filtering without an invented endpoint; preserve the distinction between a recorded episode and a group's temporal extent.

### ABR04 — Event numeric filters contradict their displayed date qualifications (medium)

`islam.js:299` **ISE07** carries `[874,941]`, but describes lesser and greater concealment and displays “Traditionally874–941, then941onward”. Actual filter942 excludes the combined record. `islam.js:303` **ISE11** carries1130, but displays “After1130 /524AH”; actual filter1131 excludes it. Accepted Islamic event rows preserve those qualifications; neither supplies the narrowed exact interval/point used for the combined claim.

Conservative exact data remedy: remove numeric `when` from both records and retain existing `whenText`, attribution, descriptions and references. They then remain text-dated rather than implying a false bounded interval. Alternatively split the concealment phases with sourced onset semantics and a tested unknown-end model; do not invent a year for “after”. Acceptance probes must check the source-worded qualification and numeric semantics together. ISE14 explicitly identifies institutional1866 while disclosing Metcalf1867; retaining that named-witness distinction is not an extra error.

## Retained source and scope safeguards

The seven flagged readings and Q02–Q07 remain as previously disposed; they were not restarted. The built encounter links retain authored comparison, source dates and non-equivalence warnings. Dara's biographical Lahore reference is not certified as the composition venue of every work. The Xi'an stele repository/reference does not establish the original erection spot. Independent Sikh and Bahá’í hubs remain independent; no invented parentage is required by a title grouping. Root/overlap/merger/notSame labels are scoped rather than a universal religious taxonomy. Population cards retain2020 estimates/release-date distinctions and non-additivity. No journey card authorizes route geometry. Existing ten heritage pins retain the accepted reference-point limitation; reference-card locations do not acquire coordinates through event links.

This closes the requested **built-copy comparison pass**, not full historical accuracy or final acceptance. Four findings remain open (ABR01–04;12 node/event records), plus Q01 and rendered gates. No application edit was made. Fresh source access is explicitly bounded; original scripture/manuscript verification was not repeated.
