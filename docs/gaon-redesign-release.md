# Gaon pixel-art redesign, 2026-09-08

128 species received new 80x80 transparent front and back sprites (256 PNGs). All 25 user-protected species retain their original front and back files, verified against SHA-256 baselines. Names, evolution order and battle stats are unchanged. Latett uses cobalt and azure blue.

Battle, field companions, legendary encounters, status, in-game encyclopedia, title and the public encyclopedia share the current artwork mapping. The module build identifier is 20260908-gaon-v8.

Generation prompts: gaon-redesign-prompts.json. Final sprites: assets/monsters/redesign-v8/{front,back}. Original generated atlases remain in the local ignored work/redesign-source directory. importRedesignSprites.cjs converts these atlases to native transparent pixel sprites; integrateGaonRedesign.cjs records the one-time migration.

Validation: verifyGaonRedesign.cjs checks all 306 front/back images, 256 new sprites, hard transparency, padding, blue Latett and all 50 protected files. verifyCatalog.cjs checks 153 images and mobile search. verifyRelease.cjs checks normal game startup and leaving the house. Pass a public base URL to verify production.
