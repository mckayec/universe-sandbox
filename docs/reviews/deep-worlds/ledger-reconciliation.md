# Deep Worlds historical-to-current ledger reconciliation

2026-10-30. **Accounting update, not new primary-source or final canon approval.**

PR37 current head remains **9a09dbce1e777d3255e058e11d2b81c53cae8d98**, open/unmerged. Historical sample implementation **f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49**; historical210-row ledger at **3c6ce20f8b6145566e4041f694cf764f8e9828ae**; review branch before this continuation **bcc35c6c846b0e191cb2f0edaf343ec97308d67a**. Fresh branch/head checks found no concurrent change. The original sample-ledger.csv, sources.md and previous findings are unchanged.

## Reproducible mapping and counts

[sample-reconciliation.csv](sample-reconciliation.csv) joins all210historical identities to evaluated current pack data. Event IDs survive world/site changes; landmarks use pack/world/site/ID. Each row retains old/current SHAs, exact copy, changed fields, structure and payload hashes, historical evidence status, reused sources and current disposition. [reconcile-ledger.py](reconcile-ledger.py) regenerates it directly from Git objects, verifies the historical text/identity, and also exports [four outside-sample changes](outside-sample-content-delta.csv). Hashes establish object identity, not source support. No primary source was newly fetched or read.

| Historical samples | Current state |
|---|---:|
|Unchanged objects|188|
|Edited surviving objects|18|
|Deleted landmark objects|4|
|Total historical rows|210|
|Surviving sampled objects|206:116landmarks,90events|

Of the original202not-compared rows, **4were deleted,13edited and185unchanged**: **198surviving rows still have no primary comparison**. The eight previously compared rows remain eight, not additional source reads: two unchanged opening narratives retain their narrow support; SM06 retains its unresolved precision; five received the dispositions below. No numerator is silently reset to imply full current-population certification.

The original sample met20landmarks/15events per pack. After deletions Sun Eater, Expanse, Foundation and Cosmere each retain19landmark samples; Hyperion and Dune retain20. All retain15event samples. Therefore a future current-population20-landmark claim needs four additional replacement samples; none was silently substituted here. Existing-source support for eight historical rows does not satisfy the outstanding whole-sample evidence gate.

## Exactly what closes, and how

### Four sampled landmark holds retired by deletion, not validated

- **SM49 Sun Eater `emesh/borosevo/dungeons`:** dungeon landmark absent. Related b1j/b1n no longer target it; their retained story claims remain unsupported.
- **SM111 Expanse `ceres/govhall/conference`:** conference landmark absent. b6i no longer names its room/site, but still assigns `world:ceres`; that setting and its union narrative remain unverified.
- **SM162 Foundation `terminus/termcity/board`:** board-room landmark absent. f1d loses its landmark edge; its narrative remains unverified.
- **SM198 Cosmere `roshar/yeddaw/orphanage`:** orphanage landmark absent. This removes that modeled ending assertion; it does not prove the ending, victim or precise location.

These are four **record-level retirement dispositions**, not closure of DW06 overall or proof that all related claims were removed elsewhere.

### Five edited samples reuse already-read evidence

- **SM01 / DW04:** S01-supported heir-versus-child repair is present. The inverted clause is closed; modeled geometry is not certified.
- **SM30 / DW05:** S02-supported before-move wording replaces exact-eve timing in d1. This closes the timing correction, with the already-read test narrative support retained.
- **SM135 / DW05:** castle/keep's exact-eve clause is likewise repaired. Do not infer that this narrow timing check verifies every architectural, generation-count or room claim.
- **SM164 / DW06:** S06-supported arrival/taxi/follower narrowing is present; unsupported affiliation is removed. This closes the copy repair, not modeled-terminal placement or every earliest gate.
- **SM199 / DW06:** S03-supported opening Yeddaw journey replaces ending/victim/Ideal assertions and removes its orphanage/effect ties. This closes that conservative copy repair, not independent confirmation of the removed ending.

Thus **four source-backed copy repairs plus one narrower timing-clause repair** are retained from existing evidence. These are not five newly read passages. SM46/47 retain their prior S04/S05 opening-narrative support; SM06's exact ISD date/colony-loss concern remains.

### Thirteen edited, previously uncompared samples still carry evidence holds

| Samples | Removed/narrowed assertion | Retained evidence dependency |
|---|---|---|
|SM19,SM119|Duarte/marines/reactor/decoy details removed|Free Navy slow-zone railguns, Bobbie assault, b6l landmark/effect and relevant passage|
|SM52|Balian given name removed|Mataro household, Anais/Valka and setting|
|SM64,SM75|Dungeon tie removed; b1n no longer says Colosso basement/torture|Captive Cielcin/Borosevo/secret visit narratives and metadata|
|SM79|Repaired-return clause removed from shiprest|Original landing/abandonment; separate b4f still exists|
|SM120|Ceres conference/site and leadership succession removed|b6i still says Ceres world, postwar timing and Holden union narrative|
|SM139,SM146|Station landmark story and named-rescuer precision narrowed; d5 untied|Hidden-station identity and retained attack/death/flight narrative/effect|
|SM141 / DW07|Explicit book-II departure omitted from book-I-visible entrance|Spoiler-clause defect closed; entrance construction/identity still needs source|
|SM157,SM173|Zenow landmark narrative narrowed; f7g room tie removed|Office identity and retained encyclopedia/Terminus narratives; f7f0 still separately tied to zenow|
|SM172|Board-room tie removed|Retained f1d story and other location/gate metadata|

A schematic-layout disclaimer does not turn a named office or story setting into primary-supported canon. Untying a landmark does not establish the world, site, date, actor, effect or first appearance remaining in the event.

## Four content deltas outside the historical sample

The evaluated six-pack delta also contains: Foundation `commdor/foundry` narrowed to schematic industry and f1h3 untied; Hyperion Bressia world blurb removes the family-death clause; Dune ecostation site removes the named-rescuer clause. These are listed separately, **not added to the210sample denominator**. Foundation retained foundry-event text still requires its passage. Bressia satisfies the prior conservative DW03 editorial disposition without newly obtaining the novel. Dune parent-site precision is reduced, not proven. The scan covers evaluated events, landmarks and site data excluding nested scene configuration, plus world name/blurb/books; it is not a full engine or Society content audit.

Society is separate from this six-pack ledger. The previous prologue/early-Europa/other scene-source holds remain in remediation-review.md and society-samples.md. The prior DWR-A/B callback findings are carried unchanged, not retested here. No deletion of a six-pack landmark closes Society source or lifecycle gates.

## Next owner/action and validation

**Claude:** fix DWR-A/B; for retained DW06 precise claims, supply the identified primary passages or make explicit conservative omissions across all duplicate surfaces. In particular, Medina drum rooms, retained Ceres world assignment, Sun Eater exact dates and Redtine selector, Hyperion b4f/Benares/Time Tombs, Foundation remaining narratives, later Dune events and Society prologue require their existing evidence dispositions. Use IDs in the mapping rather than assuming the original202rows are all unchanged.

**ChatGPT:** this finite mapping is complete. Future changed heads need incremental reconciliation. Source comparison remains open for198surviving historically uncompared samples and residual unsupported clauses in previously compared records; four replacement landmark samples are needed before claiming current20-per-pack coverage. This task obtains no new full-novel evidence and does not restart the broader source hunt.

Validation: historical check-ledger.py passes against f778b6b; generator accounts for210unique mappings,22changed samples and4outside-sample content deltas; regenerated outputs are deterministic; historical ledger unchanged; local links and whitespace checked. No application test or timed-callback suite rerun was necessary for this documentation-only reconciliation. Exact implementation CI40828887338 remains the prior successful result, separately verified during remediation review; it is not a source-truth or rendered certificate. No application/main edit, PR metadata retry, browser/server/rendered workaround, merge or deployment.
