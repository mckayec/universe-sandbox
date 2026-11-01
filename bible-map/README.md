# Biblical Lands & Times — interactive Bible atlas

Self-contained HTML maps with an era timeline and traced journeys. Open any file directly in a browser.

- `bible-map-geo.html` — **current version.** Real coastlines/lakes/rivers (Natural Earth 50m, embedded as SVG paths, clipped to lon 8–50, lat 22–43, equirectangular onto a 1000x500 viewBox). Era timeline filter, deselect, journeys (Abraham, Exodus, Jesus, Paul) with arrows, distance and stay-time popups, touch pan/pinch zoom, constant-screen-size pins/badges/arrowheads.
- `bible-map-schematic.html` — first version, hand-drawn schematic map.
- `bible-map-leaflet.html` — second version using Leaflet + CARTO tiles (needs network).

Notes for review: the geography arrays (`LAND_PATHS`, `LAKE_PATHS`, `RIVER_PATHS`) are ~47KB of generated path data on a few very long lines; skip those. Travel times are rough estimates (land 15–22 mi/day, sea 60–100 mi/day); stay durations cite Scripture where it gives one. Only syntax-checked so far — not yet tested in a browser.
