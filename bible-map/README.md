# Biblical Lands & Times — interactive Bible atlas

Self-contained HTML maps with an era timeline and traced journeys. Open any file directly in a browser.

- `bible-map-geo.html` — **current version.** Real coastlines/lakes/rivers (Natural Earth 50m, embedded as SVG paths, clipped to lon 8–50, lat 22–43, equirectangular onto a 1000x500 viewBox). Era timeline filter, deselect, journeys (Abraham, Exodus, Jesus, Paul) with arrows, distance and stay-time popups, touch pan/pinch zoom, constant-screen-size pins/badges/arrowheads.
- `bible-map-schematic.html` — first version, hand-drawn schematic map.
- `bible-map-leaflet.html` — second version using Leaflet + CARTO tiles (needs network).

Notes for review: the geography arrays (`LAND_PATHS`, `LAKE_PATHS`, `RIVER_PATHS`) are ~47KB of generated path data on a few very long lines; skip those. Travel times are rough estimates (land 15–22 mi/day, sea 60–100 mi/day) over straight lines, so they simplify real roads and sea lanes.

## Review round 2 (fixes to `bible-map-geo.html`)

Code:
1. Pan, wheel and pinch now use `svg.getScreenCTM()` and its inverse (`clientToMap`, `zoomAtClient`, `panByClient`), so letterboxing is handled. Pinch keeps the map point under the old midpoint under the new midpoint.
2. Pointer tracking is on the whole svg. Presses that start on pins, badges or route lines can pan or pinch; a 6px threshold separates taps from drags, and the click after a drag or pinch is swallowed.
3. One `tip` state object (`key`, `pinned`, `title`, `html`, `anchor` in map coordinates). Mouse hover never replaces a pinned tooltip; tap or click toggles. Escape clears. Hover is mouse-only, touch uses tap.
4. `syncSelection()` clears the `.selected` pin when the era or journey changes.
5. Pins, badges and arrowheads counter-scale by the real screen scale and re-run on `ResizeObserver` / resize, so they stay ~11px on phones. Arrowheads stop 8px short of the stop. Revisited stops get offset badges, and a retraced leg bends to the other side.
6. Tooltip CSS no longer uses `white-space:nowrap`; it wraps, is capped at 240px / 78vw, and is clamped inside the map.

Content:
- Paul's first journey now follows Acts 13–14: Antioch, Salamis, Paphos, Perga, Pisidian Antioch, Iconium, Lystra, Derbe, back through Lystra, Iconium, Pisidian Antioch and Perga, then Attalia and Antioch. Seven places added.
- Second journey: Antioch → Lystra → Troas overland, then by sea to Philippi (Acts 16:11–12); Ephesus is the short visit of Acts 18:19–21, with the long stay (Acts 19:8–10) noted as later.
- Kingdom blurb: David made Jerusalem the capital (2 Samuel 5), not Saul. Abram left Haran with Sarai, Lot and household (Genesis 11:31–12:5).
- Jesus: the Samaria stop is labelled "Samaria (Sychar area)" and shown at Shechem; "about three years" in Capernaum removed (Matthew 4:13 gives no duration).

Verification: Acts 13–14, 16:11–12, 18:18–23, 19:8–10, John 4:4–9, Matthew 4:13, Genesis 11:31–12:5 and 2 Samuel 5 were read on biblia.com / biblegateway. Stay-length citations carried over from earlier versions and not re-read this round: 430 years (Exodus 12:40), Numbers 10:11, Numbers 14:33–34, Luke 3:23, Mark 7:24, Acts 9:9, 17:2, 18:11, 24:27, 28:11, 28:30. The Acts 20:31 \u201cabout three years\u201d claim and the Luke 17:11 Samaria claim were removed rather than cited.

Testing: headless Chromium (Playwright). Desktop mouse in a deliberately letterboxed 1200x900 window, and a 390x844 touch context with real two-finger CDP pinch, rotation, tap/drag/pinch starting on pins and badges, tooltip pin/hover/unpin, selection clearing, and all eight journeys drawing without errors. Not tested on a physical phone or in Safari.
