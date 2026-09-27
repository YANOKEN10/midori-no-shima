# Gaon artwork 201–300

Battle portraits in this directory are historical. Current battle portraits are in ../battle-v187/. The map and follower atlases here remain current and unchanged.

These 100 species extend the existing 200 with 33 three-stage families and one standalone species. Data for the original 200 is preserved.

## Rendering specification

- Large square pixels, thick dark outlines, bright colorful flat shapes.
- Battle front/back: 32 × 32 logical pixels, stored as 128 × 128 at integer 4× scale. The game draws these at 96 × 96 (integer 3× logical scale).
- Map: separate four-direction overhead artwork, 320 × 80 atlas.
- Follower: separate four-direction neutral and alternate-step artwork, 320 × 160 atlas.
- Map/follower silhouettes use 16/20/24 logical pixels by evolution stage, enlarged exactly 2×, in 80-pixel cells with a common foot anchor at y=72.
- Original fine-detail and recolor-only attempts are not release assets. Rejected image hashes are recorded in rejected-artwork.json.

## Generation and integration

Generation mode: built-in image_gen. Exact per-species prompts and source hashes are preserved in manifest.json. Original generated images remain in the Codex generated_images directory; local copied sources are in source-coarse/ and are intentionally excluded from Git and deployment.

Run `node tools/extractCoarseSprites184.cjs [species-number]` to repack a local corrected source. Front/back/map/follower directories contain the shipped PNG files.

Run `node tools/verifyCoarseSprites184.cjs` to validate all 400 files and pixel blocks and build/update the manifest. With no local sources, the committed manifest supplies provenance.

## Verification

- `node tools/verifyExpansion184.mjs`: all 300 species, 33 evolution families, valid learnsets, unchanged original 200, no rejected PNGs.
- `node tools/verifyWorkshopPlacement184.mjs`: placement, validation, serialization, reload of every new species.
- `node tools/verifyExpansionUI184.cjs`: browser image decoding, all directions, actual evolution calculations and zukan search.
- `node tools/verifyWorkshopSpecies184.cjs`: 300 workshop choices and snow-dragon selection, with API writes mocked.
- `node tools/verifyBattle184.cjs`: real battle front/back at integer scale.
- `node tools/verifyPublished184.cjs`: exact production hashes for all 400 PNGs plus published catalog/source checks.
