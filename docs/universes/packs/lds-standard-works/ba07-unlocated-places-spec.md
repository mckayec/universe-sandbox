# BA07 tranche 9 — primary unlocated places and selected Exodus journey

2026-10-31. Review branch baseline `be6350b54ada10140f827a89601aca2f0d585ade`; implementation checked at `5a9711eb2676e0b421fb093211fc0be97ae2b368`. This is additive builder-ready content specification, not an implementation change, final audit or scope reduction. The preceding exact-head remediation review remains applicable.

**37 new, nonoverlapping research source views:** BP01–BP30, AP01–AP05, AP34 and AJ01. Together with the preserved eight tranches, **156 distinct proposed source views** now have specifications. Research IDs measure source views, not distinct locations, new cards or independent historical events. None of these 37 has a keyed import at the checked build; contextual references in older events/journeys must not be erased or treated as wholly absent.

The complete [37-row crosswalk](ba07-spec/unlocated-places-content-crosswalk.csv) supplies exact titles, minimum neutral attributed copy, work/layer gates, source URLs and locators, original source context/hash, consolidation rules and per-record acceptance checks. [Generator/validator](ba07-spec/build-unlocated-places-crosswalk.py) reproduces it from accepted research and explicit editorial constraints. Seven Bible records received targeted official-passage checks documented in [source-check notes](unlocated-places-source-check.md); all 30 BoM records reuse earlier accepted official-text support. Neither measure asserts independent historical corroboration.

## Builder contract

Import as nonspatial codex/reference views. Use `books:[3], layers:['bom']` for all BP records; `books:[1], layers:['ot']` for AP01–05 and AJ01; `books:[2], layers:['nt']` for AP34. No generic `bible` layer, numeric `when`, coordinate, path geometry, distance or inferred calendar conversion. Keep source text visible and citations clickable using the current source-link field. This minimum content requires no new map engine or proposed real-world geography model.

Ordering: present BP01–30 in the accepted inventory order, with source-labelled narrative links rather than an implied continuous itinerary. Group AP01/AP02 and AP03/AP04 as the two AJ01 excerpts; separate AP05 (Joshua) and AP34 (Revelation). Independent cards are allowed, but consolidation is preferred when it avoids repeating the same episode: preserve every research ID in the import crosswalk and retain each place facet, source and gate.

### Identity and relationship safeguards

- BP03 preserves passage-specific land/city uses of Nephi and Lehi-Nephi. BP04's earlier Mosiah in Omni must not become the later king merely because both relate to Zarahemla. Burning and rebuilding remain later, separately sourced states.
- BP09–17 preserve relative textual relations only: Sidon's head is not a surveyed source, a west relation does not establish its full course, and the small neck is not a chosen modern isthmus. American Bountiful is distinct from Arabian Bountiful and from the P10 temple setting. Land, city, water and temple identities must not collapse into one point.
- BP18–21 retain place/person distinctions for Moroni and Lehi. Aaron in Alma 50 is not automatically every Aaron elsewhere. Preserve the existing Alma 51 Nephihah textual tension; this location card does not settle it.
- BP23–25 are the early retreat settings in Mormon, not a complete later route to Cumorah. BP26's Cumorah/Ramah relation is textual; do not import the New York record-recovery hill's coordinates. BP27 does not equate Jaredite and Lehite landings. BP29 belongs to Shiz's army, not Coriantumr's itinerary. BP30's temple assembly and tower do not yield a measured building plan.
- AP01 distinguishes Exodus Succoth from other same-named places. AP04 retains camp/mountain roles and a relationship to P05 Horeb without selecting a modern summit or identifying Moses 1's unnamed mountain. AP05 may share AE03's crossing narrative if both ID dispositions remain explicit; an archaeological Jericho marker does not establish a crossing point.
- AP34 can share AE14/AC03 presentation, preserving its visionary-city facet and NT gate. Do not merge it into present-day Jerusalem, Independence or a future Earth landing coordinate. This is source attribution, not a ruling on believers' interpretations.

### AJ01 precise sequence

Display two selected textual sequences: **AP01 → AP02; separately AP03 → AP04**. Label the gap. Do not append P04 as a proved starting stop, join Etham to Rephidim, infer elapsed travel time, or render a continuous recovered road. Exodus 13:20 and 19:2 support the individual statements; they do not supply the intervening itinerary within this selected record. AP01–04 may be presented within the same panel while retaining five total research-ID dispositions including AJ01. This adds one specified journey ID, not five new journeys.

## Acceptance checks

1. Resolve all 37 IDs once in the builder's implementation crosswalk, identifying independent card or exact consolidated target. Hashes and counts alone do not verify imported prose: compare minimum copy, full source locators and the per-row constraints.
2. Test every own-layer view, every off-layer exclusion and the preceding work group; all-on mode retains the source views. Do not leak PGP or D&C material into these cards through shared entities.
3. Ensure no new pin, polyline, distance or numeric date was created. Textual directions must not be treated as Earth bearings. Existing mapped anchors stay independently qualified.
4. Check clickable official sources and retained uncertainty/attribution in actual rendered desktop/mobile layouts. Pure source checks cannot close that gate.
5. Consolidation must not silently drop later source states, actor distinctions, aliases or per-ID coverage. Ordinary narrative entries are not covered by the dense genealogical display deferral.

## Coverage remaining and handoff

The original 256-primary-entry accounting is preserved. Relative to that baseline, after these specifications **13 primary IDs with omitted/partial status remain without specifications**: J01, J03, AP09, AP20, AP23, AP24, AP26, AP30, AP31, RP02, RP04, RP06 and RP08. This is a specification backlog, not a fresh claim about implementation at a later SHA. All 30 primary BP place IDs and all six primary AJ journey IDs now have either an earlier represented disposition or a specification; the existing AJ03/AJ05 route caveats remain in force.

The supplementary 62-category inventory remains open for item-level import/consolidation/omission dispositions, subject only to the documented dense-display deferral. This tranche does not newly claim supplementary coverage or authorize its omission. The existing 119-view remediation inventory is a historical checkpoint; it is not silently expanded to imply the new 37 were audited as imported.

Claude can implement these minimum views with current evidence. No new source-access blocker prevents them, and no owner geography decision is needed for nonspatial cards. Real-world identification, supplementary integration, remaining 13 primary specifications, BA07 implementation and same-head rendered/technical acceptance remain distinct work. Return any changed implementation for a delta recheck; this specification grants no merge, release or deployment authority.
