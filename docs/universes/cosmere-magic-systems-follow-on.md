# Post-release task: Cosmere interactive magic-system atlas

Owner request, 2026-11-02. **A distinct Cosmere feature, not a synchronoptic-timeline subfeature.** Queue for Claude after the current LDS initial release; do not implement now or add a release blocker. Current PR33 scope, required integration, ownership/lock and content/technical/owner-approval gates remain unchanged. This document authorizes no merge or deployment.

## Intent and owner references

The owner explicitly wants the seven supplied Allomancy/Feruchemy reference-chart inspirations built into the Cosmere experience. Their described forms include a metal glyph wheel, quadrants and relationships, matrices organized by pushing/pulling and internal/external categories, a searchable symbol gallery/table and comparisons between systems. Treat these as design and research leads, not verified canon or a dataset to transcribe blindly. This brief records the owner's description, not an assertion that the image pixels, original authors or licenses were inspected. No filenames, public locations or Claude access to private images are assumed.

Deliver an original, explorable reference that explains source-supported distinctions and connections. Preserve the structural usefulness of the examples, rather than copying a fan chart's artwork, classifications or unmarked spoilers. Allomancy and Feruchemy are the explicitly requested starting systems; additional system comparisons require supported records and spoiler review, not automatic scope expansion or invented equivalences.

## Complementary views over one dataset

- **Selectable wheel / relationship view:** selectable symbols or entries, labelled category groupings and inspectable connections. Explain the meaning of each edge and quadrant through a legend; adjacency or symmetry must not silently assert a canonical relationship. Offer a reduced-complexity view as well as full permitted detail.
- **Category cards and matrices:** filter/group by the source-supported taxonomy, including pushing/pulling and internal/external where applicable. Do not impose one system's taxonomy on another to fill a symmetric grid; show not applicable, unknown or disputed distinctions explicitly.
- **Searchable glyph gallery:** symbol, textual name and aliases, system/category, permitted summary and source link. Search must work by text without recognizing a glyph. Keep verified canonical glyphs distinguishable from edition variants, fan-designed substitutes and original neutral interface icons.
- **Accessible table:** the same allowed records and relationships in a sortable/filterable text table, with source locators, category meanings and uncertainty. This is an equivalent primary interface, not a stripped-down fallback missing key explanations.
- **Cross-system comparison:** aligned cards or columns that identify what is actually comparable and what differs. Reusing a material/name does not establish identical effects, mechanisms or users. Display source-supported links to relevant books, worlds and existing atlas records, with independent gates on every connection.

Selections and filters should persist across these views without duplicating records or silently changing their meanings. Use stable shared IDs and source-view claims for editions or accounts that differ. This feature may link to a timeline later, but its data, navigation and acceptance remain separately scoped.

## Canon, provenance and artwork requirements

Before implementation, inventory the existing Cosmere pack/research and lawful primary evidence already available. For each proposed chart claim record: system/material/entry ID, exact claim, category/relationship type, source work and edition, chapter/appendix/page or other stable locator, attribution, confidence/uncertainty, earliest **verified** spoiler gate, and any later clarification. Prefer original books and authorized author/publisher reference materials; identify the status/date of supplementary author commentary separately. Fan charts and wikis are discovery leads unless independently verified. Do not claim inaccessible books were read.

Separate what an in-world speaker knows or believes from a narrator's explanation and from later authoritative clarification. Preserve edition differences, ambiguous terminology and source conflicts. Missing support results in a labelled research hold or conservative omission, not a guessed category, ability, identity or connection. Do not present the reference images themselves as primary evidence.

Record asset authorship, provenance and usable license/permission before shipping any glyph or illustration. Public visibility of a chart is not permission to reproduce it. Do not trace/rehost third-party artwork or substitute a fan glyph as canonical. Use suitably licensed/authorized assets or original neutral icons with clear labels; if exact canonical glyph rights remain unresolved, keep the textual/category interface usable and record that specific asset dependency. No purchases, rights outreach or account setup are authorized by this brief.

## Progressive spoiler contract

Use the existing pack's work/chapter reading controls. Gate **each claim and relationship**, not merely the whole entry or its detail paragraph. Abilities, user identities, hidden affiliations and cross-world/system connections may unlock at different points. A familiar symbol must not disclose a later ability or connection by implication.

The permitted projection must govern wheel sectors/edges, category names, labels, tooltips, previews, thumbnails/alt text, gallery/table rows, search terms/results/counts, links, comparison columns, exports and URL-restored selections. If an existence or relationship is itself a spoiler, do not reveal it through an empty labelled slot, locked count or suggestive silhouette. Require an explicit user spoiler setting rather than silently revealing data to complete a chart.

On repeated work/chapter downgrades, remove newly forbidden labels/cards/edges and search results, cancel pending reveals/transitions, and sanitize restored or bookmarked selections. A link must satisfy the source claim's gate and the destination disclosure's gate; selecting a known book/world must not bypass the connection gate. Unverified earliest appearances remain withheld with an internal research task, never promoted from a secondary-only assertion.

## Post-release delivery and acceptance

Claude's first follow-on deliverable: a finite source/asset inventory, proposed shared schema and original interaction layout, plus a bounded verified example spanning the wheel, category cards, gallery, table and comparison. Reuse existing evidence and records; list precise missing passages, editions or rights. ChatGPT reviews disputed classifications and spoiler provenance before expanding the corpus. A prototype is not completion of the seven examples' requested functionality.

Acceptance must demonstrate:

1. Every visible claim/category/edge and canonical glyph has traceable source/edition or asset provenance; unsupported or conflicting claims stay explicitly qualified or omitted. Cross-system comparisons preserve differences.
2. All views resolve the same IDs, sources and permitted fields; filters/search/selection and book/world links agree. No duplicate datasets or divergent copy between wheel and table.
3. Keyboard navigation, visible focus, Enter/Space activation and Escape return; touch-friendly controls; meaningful glyph names/alt text; no color-only category distinctions. Phone layouts can switch to cards/table instead of shrinking a dense wheel into illegibility. Provide a readable screen-reader/list/table path and reduced motion.
4. Spoiler tests cover first load, hover/focus previews, search/autocomplete, accessible names, category counts, direct URLs, back/forward, comparison links, export and repeated downgrades during pending interactions. Verify actual source-backed work/chapter unlock boundaries.
5. Final same-head content and technical evidence across desktop/phone and applicable real-device/performance checks for the chosen renderer. No implementation or passing tests are claimed here.

Keep this task separately discoverable from the timeline feature. Existing initial-release work has priority; missing chart originals, source passages or artwork rights are dependencies of this **post-release feature only**, not new LDS release gates. Specific-PR approval remains required before any eventual merge/release.
