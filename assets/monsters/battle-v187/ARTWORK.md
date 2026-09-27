# Dedicated battle portraits, Gaon 201–300

The 32-pixel battle portraits from expansion-v184 were too coarse. These front and rear portraits are redrawn with the existing Gaon World battle art as references, preserving each species' colors and identity with finer contours and dimensional battle poses.

- Native canvas: 96 × 96, maximum shared silhouette extent 88 pixels.
- Stored PNG: 192 × 192, exact 2× nearest-neighbor scale, transparent background.
- Game display: standard 88 × 88 battle frame, consistent with existing species.
- Map and follower atlases remain byte-for-byte unchanged.
- Mode: built-in image_gen. Exact prompts and source hashes are in manifest.json.
- Local generated source pairs live in source/ (excluded from Git); final front/ and back/ are deployed.

`tools/extractBattle187.cjs ID` packs a source pair. `tools/verifyBattleAssets187.cjs` verifies all 200 battle PNGs and unchanged map/follower atlases, then records the manifest. `tools/reviewBattle187.cjs` builds visual inspection sheets. `tools/verifyBattle187.cjs` checks actual battle rendering.

The map/follower review page is `/gaon-zukan/poses/`. Chromegear (119) keeps its existing artwork; its transparent margins are trimmed only during rendering and its display size is increased in the battle and public catalog.

Release 188 replaces the rejected deer family (282–284) in all three roles; its battle silhouettes grow through native extents 60/74/88. See ../family-v188/ARTWORK.md.
