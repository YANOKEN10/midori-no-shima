# Map workshop performance 195

The workshop now caches the active map raster and connection target raster until the rendered map or loaded-art revision changes. Selection/grid/exit overlays still redraw independently. Material previews use IntersectionObserver, including ancestor clipping, and repaint only for a new resource revision or rotation. Room thumbnails reuse completed renders. RAF scheduling stops when idle or hidden. Initial base maps, species, and published data load concurrently after session validation.

Scope: browser editor only. Authentication, server API, stored map formats, and published documents are unchanged. Assets arriving later invalidate caches (with a settling pass); edits/undo/redo replace the rendered-map identity. A single raster is retained per active map/connection view.

Verification:
- Same public rods map in a local browser, API reads copied and writes mocked: 6 alternating zoom clicks, 1,032 drawImage calls before vs 6 after; script duration 88ms before vs 6ms after (one run, environment-dependent).
- Scheduler test: coalescing, idle shutdown, bounded settling, hidden/resume.
- Browser regression: placement, undo/redo, draft save/reload, scrolling to a previously hidden species, resource/model cache invalidation.
- Existing public maps are never modified by verification.

Production verification (26869e4): API 200, 37 published maps, revision 144 unchanged. Browser regression passed including connection dialog and room workspace; no page errors. Production zoom measurement: 6 image draws / 6ms script time. Image visibility checks wait for network completion instead of a fixed delay.
