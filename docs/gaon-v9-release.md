# Remaining 25 species: pixel-art refresh

All 25 previously protected species have now been redrawn at the user's request, retaining their recognizable identities. Built-in ImageGen produced one front/back sprite sheet per species. Final 50 transparent sprites are in assets/monsters/redesign-v9/front and back. Prompt set and pre-change gameplay baselines: gaon-redesign-v9.json. Original generated sources are retained locally in work/redesign-v9-source.

Kokegoro no longer evolves. Its existing stat/learnset generation tier remains unchanged to preserve balance. Mossgolem remains a separate species; both appear as standalone entries in the encyclopedia. Other evolution paths, all base stats, types and learnsets are unchanged.

All 153 species now use 80x80 game assets, with hard alpha and consistent 74px bounds. The previous 128 designs are unchanged (256 SHA-256 baselines verified). Build version: 20260908-gaon-v9.

Validation: tools/verifyGaonV9.cjs checks all 306 front/back assets, 50 new images, prior 256 files, stats and all 25 evolution settings; raises Kokegoro from level 27 to 100 without evolution and checks Yoruneko still evolves to Shadowneko. Also verifies standalone encyclopedia search and battle rendering. tools/verifyCatalog.cjs checks all 153 images and mobile search; tools/verifyRelease.cjs checks normal startup and leaving the home. Pass production base URL to run public verification.
