# Post-release task: illustrated synchronoptic timelines

Owner-requested follow-on brief, 2026-11-02. **Queue for Claude after the initial PR33 release; do not implement now or add an initial-release gate.** Existing PR33 corrections, integration requirements, ownership, lock and specific-PR approval process are unchanged. This brief neither waives those requirements nor authorizes a merge or deployment.

## Goal and references

Build a reusable view that lets readers follow several synchronized histories and their relationships together: a common date grid, branching genealogy, lifespans and duration bands, parallel historical/civilizational lanes, migrations, geographical/political color fields and succession. The structure and overview/detail behavior matter; a decorative antique style or a line of event dots does not fulfill the request.

Owner reference images: Library IDs `libfile_7d6145919c70819186a290b2c04128b2` and `libfile_81d0b3a8584481918200c8992d1ca3b0`. The owner describes dense illustrated charts combining the elements above. These are **private owner references**, not repository assets or evidence that Claude can access them; this brief does not claim to have inspected their pixels. The written requirements are sufficient to plan the feature. If the originals are later shared, use their organizational ideas as inspiration and create original layouts/illustration; do not trace or copy third-party artwork or assume reproduction rights.

## Coverage and lane selection

Use shared rendering and data adapters across all three religion/history atlas parts—standard works, Christian apocrypha, and Religious Traditions/Abrahamic world religions—and other universe/book-series sections. Preserve each pack's own corpus, canon, evidence standards and exclusions; reuse accepted records and identities rather than importing one religion's or fictional world's chronology into another.

For **The Church of Jesus Christ of Latter-day Saints · Standard Works**, provide these explicit selections:

- Each standard work individually: Bible (with Old/New Testament sublanes), Book of Mormon, Doctrine and Covenants including Official Declarations, and Pearl of Great Price with its component source views.
- Any selected combination of those works, including all together; shared identities may connect source views without erasing their different claims or gates.
- Religious/scriptural and historical/secular accounts side by side, independently selectable and visibly attributed.
- Judaism, Christianity and Islam comparison lanes, with selectable traditions/branches where the accepted research distinguishes them. Reuse the Religious Traditions data rather than treating these as three internally uniform or sequential replacement civilizations.
- Church history for The Church of Jesus Christ of Latter-day Saints, separately selectable from narrated scripture and from wider civil/political history. Preserve historical movement names where those are the actual subject.

For other universe/book-series worlds, support the same structural capabilities where the accepted canon supplies them: families, dynasties, political succession, lifespans, migrations and simultaneous regional or planetary narratives. Retain existing work/chapter spoiler gates on **nodes, labels, dates, portraits, branches, edges, search results, summaries and accessible exports**. Knowing a character's identity must not reveal a later death, successor or family relationship. Unavailable chapter-level provenance stays unresolved; do not fabricate an earliest appearance. Different fictional calendars or continuities must not silently share an Earth axis.

## Interaction and readable structure

1. **Synchronized selectable lanes:** users add, hide, reorder or collapse lanes while retaining one time viewport and selection. Distinguish civilizational, institutional, geographic and family lanes; make cross-lane connections inspectable without an unreadable mesh. Include presets plus custom combinations and reset.
2. **Overview to detail:** broad eras/civilizations at overview; regional branches, generations and duration bands at middle zoom; sourced people/events/relationships at close zoom. Aggregate labels with disclosed counts, expand on demand, and keep uncertainty visible at every level. Unknown lifespans must not become invented bars.
3. **Genealogy and succession:** branching parent/child and spouse relations, office succession and political continuity have different labelled line styles. An appointment is not automatically accession; succession is not parentage; tradition descent is not necessarily biological descent. Preserve disputed alternatives and source-specific roles.
4. **Geography and migration:** synchronized regional bands and optional map selection show changes where evidence supports them. Use approximate/disputed extents with legends; do not imply surveyed borders, exact migration tracks or ethnic identity from color alone. A location-free narrative can use an explicitly schematic lane without an Earth pin. Political overlap and contested control remain visible.
5. **Source-first inspection:** selecting a band, event or edge opens its claim, source locator, date basis, confidence/uncertainty and relevant atlas record. Typed connections include kinship, succession, travel, quotation, reported vision, composition and transmission; no line should silently assert a stronger relation than its source supports.
6. **State:** preserve the selected lanes, time viewport and allowed selection through view switches; validate shareable URL values and back/forward behavior. Never let a saved link or restored state bypass the current spoiler setting. Define which detailed state is shareable before implementation.

## Chronology and evidence contract

Keep **narrative chronology**, **composition/transmission chronology**, and **institutional history** distinguishable and independently selectable. A narrated ancient event, later manuscript, translation, publication and modern institutional interpretation are different dated records, even when associated with the same work.

Each plotted claim needs an existing stable ID/source-view ID, source locator, claim type (textual narrative, adherent tradition, scholarly historical reconstruction, institutional record, or attributed proposal), chronology/calendar identifier, date basis, precision and uncertainty, lane membership and spoiler gate. Edges need typed endpoints, direction, source support and their own gates. Preserve provenance through aggregation and export.

- Use exact dates only where supported. Represent approximate dates, intervals, open bounds and disputed alternatives visibly; distinguish an uncertain event range from a known duration/lifespan.
- Never manufacture birth/death years, reign lengths, migration timing or chronology bridges to make a chart look continuous. Undated or only relatively ordered records belong in an undated/relative-order panel rather than at a guessed numeric point.
- Show incompatible chronology models as separate aligned alternatives **only if the alignment itself is supported**; otherwise use separate axes or a clear “not chronologically aligned” state. Never silently harmonize scriptural ages or treat a traditional creation chronology as established historical dating.
- Document era/calendar conversion, BCE/CE treatment and any absence of year zero. Proposed fictional-to-Earth conversions require an explicit source and must remain proposals.
- Association in time is not causation, geographic co-location, ethnic continuity or textual equivalence. Religious and secular lanes are labelled evidence perspectives, not an implied ranking of communities.

## Accessible acceptance and delivery plan

After initial release, Claude should first inventory reusable pack records, date coverage and relationship fields; return a finite schema/adapter and original layout proposal, with missing-source items marked rather than filled in. Implement a bounded example containing a family branch, a duration band, a typed succession edge, two simultaneous lanes, a migration, a disputed date and an undated record; verify it before rolling the common component through the three atlas parts and other worlds. A sample is a development checkpoint, not completion of the owner's requested coverage.

Acceptance must include:

- Every required work/lane selection and combination; synchronized zoom/pan with no accidental loss of selection; readable overview and detail on 4K, laptop and phone.
- Source-linked events **and edges**, distinct chronology types, visible alternative dates, undated handling, calendar boundaries and no unsupported positions/precision. Compare sample records against accepted sources, not only schema validity.
- Keyboard access to lane controls, zoom, branches and cards; predictable focus and Escape return; full names/descriptions available without hover. Touch targets, readable labels, reduced motion and no color-only distinctions. Dense mobile views should collapse lanes and expose detail rather than shrink text into illegibility.
- A readable, structured **nonvisual/list alternative** containing the same permitted selections, chronology/uncertainty, relationships and citations; screen-reader reading order must not depend on canvas coordinates. Search and list/table export obey the same spoiler and evidence rules.
- Spoiler checks for initial load, zoom aggregates, hidden branches, cross-links, search, URL/back-forward, exports and repeated work/chapter downgrade. Recheck restored selections and pending interactions after a downgrade.
- Final same-head content and technical review, real keyboard/touch/device evidence, and applicable real-GPU/performance checks for the chosen renderer. No implementation or tests are claimed passed by this brief.

Post-release design choices to resolve: initial lane presets and bounded prototype records; renderer and large-chart performance strategy; licensed/original illustration assets; supported calendar adapters; share/export format. Source gaps constrain individual plotted claims, not permission to invent them. Access to the two private reference images is optional for understanding this written brief, and neither the images nor this feature blocks the current release.
