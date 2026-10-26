# Research-to-rendering contract

2026-10-26. Main baseline `a5c1e171c319a4aa6241a996f484babb617ad425`; PR28 tree documentation read directly from its fetched head (revision `62bb96f63e9d9c1e21cb38b33a0254ba3911d92d`). It is proposed code, not asserted deployed. No implementation edits or technical approval performed.

## Required semantic distinctions

The dossiers intentionally separate a tradition, institution, legal school, order, movement, person, place and source account. Store a `relation_type` in research even if the renderer displays it as text. Examples: historical-context, institutional-development, split, merger, communion-membership, legal-school, devotional-affiliation, translated-text, scholarly-comparison, textual-reference and claimed-continuity. Preserve ambiguity and attribution in visible copy.

Shared place labels may be reused after an explicit identity crosswalk. Do not union groups from shared names or graph adjacency. In particular Sunni legal schools are not eight rival religions; Sufi orders are not mutually exclusive denominational leaves; evangelical/Pentecostal overlap is not an additive census; “Abrahamic” is a comparative heading, not a dated mother institution. A theological self-description does not establish biological or organizational succession.

## PR28 field limitations requiring a safe disposition

The inspected PACK_FORMAT §21 defines `parent` as one institution/tradition from which a child branched. `also` supplies other-root/influence ties; labelled `links` supply additional connections. Use `links` for explicit relation labels where those semantics fit; never use bare `also` to imply a stronger ancestry than the evidence supports. A merger with two predecessors is not represented accurately by arbitrarily selecting one as the sole parent. Keep its source-qualified event/reference entry until the graph can retain both relations visibly.

`when` is required. A scalar is a beginning year; an array describes a tradition's beginning and ending, **not uncertainty about its beginning**. Therefore a centuries-long emergence cannot be encoded as `[earliestPossibleStart,latestPossibleStart]`: that would falsely display extinction at the second year. Nor does `approx:true` license an arbitrary midpoint. The sample Judaism-1200, Christianity30 and Islam610 values are demonstration data, not research evidence adopted by this pack.

**Safe import:** only research records with a defensible numeric event/institution date can become scalar-dated tree nodes without further date modelling. Source periods, traditional chronologies and uncertain formation windows remain reference entries, or require a separately reviewed renderer design that distinguishes uncertainty bounds from lifespan. Religious founders' supernatural claims remain labelled whatever the view. No year0 or invented founding day.

Tree year/layer filters fade rather than remove nodes. The view must state that faded entries remain present; it must not promise a fully hidden comparison when a layer is off. Source reading gate1 is an overview design, not a claim that every religion has the same canonical reading order.

Map links must target validated actual sites. An unlocated setting must not be imported as a site with absent coordinates (the existing atlas engine may default them to0). Use the nonspatial reference library. A representative modern city/heritage coordinate is not a surveyed historical event point. No reconstructed routes, country polygons or diffusion animations are authorized by a list of endpoint names.

## Before research-ready

Finish the cross-dossier entity/edge inventory, record all supported non-merges, supply a practical gazetteer subset, and audit prominent dates/labels against the cited sources. Scope omissions in the dossiers remain visible until resolved or explicitly justified as outside the material atlas scope. This initial checkpoint is research/chatgpt, not build or content approval.
