# SD0238: accessible lineage reference payload

Official [Matthew 1:1–17](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/1?lang=eng) and [Luke 3:23–38](https://www.churchofjesuschrist.org/study/scriptures/nt/luke/3?lang=eng) were successfully retrieved and the relevant passages inspected on 2026-11-01. This resolves access for this audit environment; it does not claim Claude's prior failed fetch succeeded. These are textual witnesses, not established biological pedigrees.

Use separate `2/nt` reference views under SD0238, not a merged tree, Mary-line theory, date calculation or Earth geometry. CSVs are compact manual source transcriptions of ordered names, independently checked against the retained KJV fallback by verse. They are not raw chapter captures. [Check result](genealogy-check.json); [reproducible check](genealogy-check.py).

## Matthew

[Ordered main chain](matt-genealogy-names.csv): concatenate rows to get 40 name occurrences from Abraham through Joseph. Successive main-chain links carry Matthew's “begat” predicate; this is the text's formulation, not a claim that no generations were omitted. Keep duplicate names as separate verse/occurrence nodes.

Required side branches and predicates: verse 2 adds Judas's brethren; verse 3 names Phares and Zara of Thamar; verse 5 associates Booz with Rachab and Obed with Ruth; verse 6 calls David king and identifies Solomon's mother through her former marriage to Urias without naming her here; verse 11 adds Jechonias's brethren and the Babylon carrying-away boundary. Verse 16 calls Joseph Mary's husband and says Jesus, called Christ, was born of her: **do not create a Joseph-begat-Jesus edge**. Verse 17 states three groups of fourteen; preserve that textual grouping without inserting missing names or forcing an automatic count. Verse 1's summary associations with David and Abraham do not replace the intermediate chain.

## Luke

[Ordered chain](luke-genealogy-names.csv): concatenate 16 verse rows, preserving all 77 occurrences from Jesus through God. The direction is child toward named predecessor, using Luke's repeated “son of” wording. Preserve the verse 23 qualifier **“as was supposed”** for Jesus/Joseph and the approximate age, if displayed. The final Adam/God relationship is Luke's textual/theological claim, not an ordinary genetic edge. Repeated names remain distinct occurrence nodes; Luke's spellings remain Luke's. No harmonization with Matthew.

## Acceptance

Render both complete reference payloads, including side branches and qualified predicates; source each by book/chapter/verse. A plain ordered text/list is sufficient: dense graphical-tree UI is not required. Test that both are hidden before group 2 and with OT-only layers, and that no generic name deduplicator collapses repeated occurrences across or within accounts. Assert Matthew's ending predicate differs from the main chain and Luke's initial qualifier remains. Audit the generated output at the next exact head; this handoff is not an implemented import or S3-C1 closure.
