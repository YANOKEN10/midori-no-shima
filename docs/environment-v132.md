# Environment v132

Built-in image_gen was used (no CLI/API fallback). Generated assets are stored in assets/environment-v132: jungle-floor.png, paving.png, train.png, sea.png, sand.png. Source images are preserved. See prompts-v132.json for the generation prompts.

- Conifers: 2 by 3 collision cells and 64 by 96 visible pixels; original sprite reused with nearest-neighbor rendering. Mountain boundary objects retain their identities and positions.
- Jungle trees: fill their 2 by 3 selection frame. Jungle floor replaced with subdued moss/grass.
- Forest border migration: extend the Rods perimeter treatment to all forest-bordered maps, fill missing original edge cells, and avoid replaying automatic marine canopy over placed trees. Preserve moved/deleted trees and explicit terrain edits. No base fingerprint bypass or production database writes.
- Paving: overhead flagstones, connected road edges and curbs; rail-town forecourts extend around buildings. Concrete uses neutral gray and restrained 64px slab seams inside stations.
- Train: new two-car overhead sprite, transparent margins cropped at draw time, 64px logical height and integer magnification at world size. Thumbnail sizes fit within their bounds. Tracks render behind the train.
- Beach: new sand and ocean textures, connected wet sand / foam / shallow-water bands including corners on route10, resureBeach and route12. Encounter regions and collision remain unchanged.

Validation: verifyForest132.cjs checks all 20 tree-enclosed maps (including the separately generated natureforest), no uncovered original boundary T cells, no blocked exits, valid and idempotent edits, and preservation of moved/deleted trees. verifyForestBrowser132.cjs renders the border maps plus natureforest, city, station, mountain railway and three beaches with no page errors. verifyForestEditor131.cjs checks actual conifer selection/drag/save payload with mocked API. verifyWorld131.cjs and read-only verifyPublishedRugs130.cjs pass. Visual records are in artifacts/forest132-*.png and forest132-audit.json.
