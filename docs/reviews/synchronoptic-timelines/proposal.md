# Synchronoptic timelines: inventory, schema and layout proposal

Claude, 2026-11-02. This is the brief's first step: what dated and related records already exist, a small shared schema with
one adapter per pack, an original layout, and the bounded prototype that comes before any rollout. Nothing here is
built yet. Counts are from the pack branches' current heads (unmerged PRs #33, #38 and #39).

## 1. Inventory of reusable records

| Pack (branch) | Dated records today | Relations today | Gaps for timelines |
| --- | --- | --- | --- |
| Religious Traditions / Abrahamic (`pack/abrahamic-world-religions`, PR #39) | 60 Chronicle events, 57 with `when` (year or `[from, to]`), every one with `whenText` keeping the source's precision; 1 `approx`. Range 597 BCE to 2026. Tree: 109 nodes, 15 with `when`, 19 with `emerge` ranges, 75 `undated`, 81 `ongoing` | Tree `parent` + `parentType` (within / branch / division / context / overlap) + `parentRel` text; 3 `merge` nodes; 16 `notSame` guards; 27 typed `links` (context, contact, history, overlap, within, branch, division) with relation text | Best starting material: already distinguishes undated, approximate, emergence windows and typed non-parent relations. No per-claim source locator on links (sources sit in node `notes`). |
| LDS Standard Works (`pack/lds-standard-works`, PR #33) | 24 events, 13 with `when` (1829–1978, D&C/Church history); 12 of 34 sites and 3 of 9 routes have `when`; 2 of 1,523 codex cards have `when`; `timeline` eras defined | 127 codex cards with typed See-also links (same entity, within, describes, in another account); identity crosswalk for 12 people; routes as ordered stops | Scripture narrative is mostly undated or relatively ordered (correctly). Genealogies exist as text lists (e.g. Matthew 1, Luke 3, Moses 5–6), not as parent/child records. Institutional history (D&C dates) is the only dense numeric lane. |
| Christian Apocrypha (`pack/christian-apocrypha`, PR #38) | 327 events, **0** with `when`; no `timeline` | None typed | Composition/transmission dates would need new accepted research rows; nothing can be plotted on a year axis yet. Usable only in the undated/relative-order panel at first. |
| Fiction packs (sun-eater, hyperion, expanse, dune, foundation, cosmere, Red Rising) | Book/chapter gates; some in-world years in event text | Few structured relations | Need per-world calendars; never share the Earth axis. Later phase. |

Conclusion: a timeline can be built honestly today from the Abrahamic tree and Chronicle and from LDS Church-history
events; most scripture narrative belongs in the relative-order panel. Missing dates are reported, not filled.

## 2. Shared schema (produced by adapters; packs are not rewritten)

A per-pack adapter reads existing fields and emits read-only records. No pack gains dates it doesn't have.

```
Record  { id, sourceId, label, lane, kind: 'event'|'span'|'presence'|'undated',
          chron: 'narrative'|'composition'|'institutional'|'historical',
          claim: 'text'|'tradition'|'scholarship'|'institution'|'proposal',
          calendar: 'gregorian-ce' | '<world-id>',
          when: { from, to, fromOpen?, toOpen?, approx?, alt?: [ {from, to, by} ] } | null,
          order?: number,                         // relative order when undated
          whenText, src: [{t, u}], gate: { book, layers, chapter? } }
Edge    { from, to, type: 'parent'|'spouse'|'succession'|'branch'|'division'|'merge'|'context'|'contact'|
          'travel'|'quotation'|'vision'|'composition'|'transmission'|'same-entity',
          label, src?, gate }
Lane    { id, title, group: 'tradition'|'institution'|'region'|'family'|'work'|'narrative', parent?, gate }
```

Rules carried from the brief: `when: null` goes to the undated panel; `approx` and `alt` draw as hatched or forked ranges,
never as a crisp bar; an open end (`ongoing`) fades out rather than stopping at a made-up year; a span is only drawn
when its source gives both ends (an `emerge` window is drawn as an arrival window, not as a lifespan); different
calendars never share an axis; every record and edge is filtered by the same gate functions as the atlas (`layers.js`),
including search, the list view, the URL state and exports.

Adapter mapping, first two packs:

- **Abrahamic:** tree node → lane (tradition / branch) + `presence` record (from `when` or `emerge`, `ongoing` = open end,
  `undated` = undated panel); `parent`+`parentType` → `branch`/`division`/`context` edge (never `parent` kinship);
  `merge` → `merge` edges; `links` → typed edges with their `rel` text; Chronicle events → `event` records with
  `whenText`, `approx`, `ref`.
- **LDS:** events with `when` → `institutional` records on a Church history lane; dated sites/routes → `travel` edges
  between stops on a region lane; codex `see` links → `same-entity`/`describes` edges; everything else scriptural →
  `narrative` records in the relative-order panel per work (Bible OT/NT, BoM, D&C, PGP), which keeps each work and any
  combination selectable as the brief requires.

## 3. Layout (original; no third-party chart art)

- **Rendering:** SVG/DOM rather than WebGL. Text stays crisp at 4K, every mark can be a focusable element, and screen
  readers get real order. Records are windowed (only what's in the viewport is drawn) to stay smooth on phones.
- **Top:** one shared time axis with era bands from the pack's `timeline.eras`; BCE/CE labelled, no year 0.
- **Lanes:** stacked horizontal lanes with a left rail of names, collapsible groups (e.g. Judaism → Rabbinic → movements),
  drag or buttons to reorder, presets (“Religious Traditions”, “Church history”, “Scripture works”, “Everything”) and
  reset. Branches are drawn as curved connectors leaving the parent lane at the supported date or window, with a line
  style per edge type and a legend (solid = branch, dashed = context, dotted = contact, double = merge).
- **Zoom levels:** overview shows lanes as bands with counts (“14 movements”); middle zoom opens sub-lanes and
  emergence windows; close zoom shows individual events and their labels. Uncertainty marks stay at every level.
- **Side panel:** selecting a band, event or connector opens its claim, `whenText`, source links, claim type and a link
  to the atlas record.
- **Undated / relative-order panel:** a separate strip under the axis for records without dates, ordered by the source.
- **List view:** a toggle to a structured list of the same filtered records and edges, with citations; this is the
  nonvisual alternative and the search/export base.
- **Phone:** one lane group at a time, lane rail becomes a picker, detail opens as a sheet; text never shrinks below
  the atlas minimum.
- **Entry:** a “Timeline” button beside “Codex” in Track A atlases, opening a full-screen view; state in the URL hash
  (`#tl=lanes,…&t=from,to&sel=id`), validated and always re-gated.

## 4. Bounded prototype (next unit)

Branch `engine/timelines`, new modules `public/atlas/timeline.js` (pure: adapters, layout, gating; unit-tested) and
`timeline-view.js` (DOM), wired to the Abrahamic pack first because its records already cover most of the brief's
required example: a branch (Israelite/Judean context → Second Temple era), a duration band (Second Temple era, `approx`), a typed
non-parent edge (Ananites → Karaites “influence; not an exact schism”), simultaneous lanes (Judaism / Christianity /
Islam), a merge (ALEPH), a disputed or approximate date and undated records. The two items the Abrahamic data cannot
supply honestly, **a succession edge and a migration**, come from LDS if its accepted records support them: a dated
route for the migration, and an office succession from the D&C records (DRE) only where the record states it. If either
is not supported, the prototype reports it as missing rather than inventing it. The prototype will be checked record by record against the pack data, run under
`pnpm check`, and screenshotted at 3840×2160, 1440×900 and 390×844 with keyboard and touch passes.

## 5. Open choices for Mckay / ChatGPT

1. Prototype order: Abrahamic first, then LDS (proposed), or LDS first.
2. Illustrations: symbols drawn by Claude for now; licensed or commissioned art later if wanted.
3. Gospel-harmony and circular views: after the linear view and list view are accepted.
4. Christian Apocrypha needs research rows with composition/transmission dates before it can use the year axis;
   ChatGPT would own that research.
