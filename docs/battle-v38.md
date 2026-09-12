# Battle scenery v38

All 75 maps have an explicit environment mapping in `src/battleBackgrounds.js`. Eighteen environments include the existing ocean image and seventeen newly generated images: meadow, forest, mountain, lake, coast, snow, ice, cave, volcano, ruins, haunted road, town, interior, factory, arena, waterfall and ship lounge.

Each battle captures its background from its current map, boat state and tournament options. The legacy saved battleTerrain field cannot leak a previous ocean or arena scene into a subsequent battle. The selected image loads before the battle activates. Loading failure uses a neutral floor while preserving the HUD, never the legacy background. Decoded background cache retains at most four scenes on phones.

Existing trainer introduction, Gaon art, HP panels and command layout are preserved. No save migration or combat balance changes.

Verification: all map assignments and image loads; boat and tournament precedence; stale water/arena regression; mobile battle screenshots for every environment; actual endgame battle/story regression; new-game production smoke test.
