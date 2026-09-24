# English localization (v167)

Japanese and English (Beta) are available through the language selector and Settings. The device preference `gaon:language` is separate from game saves. Translation uses local dictionaries, without a translation service.

## Coverage
- All 200 Gaon names and encyclopedia descriptions, all 292 move names and descriptions, and all item names and descriptions.
- Later story chapters through the postgame, including ferry travel, daycare, park trials, legendary encounters, the Champion Tower and Galaxy Tournament.
- Built-in map NPC dialogue, signs, facility names and habitat conditions. Times remain explicitly in Japan time.
- Variable counts, rewards, travel times and player names use anchored message templates.
- Long encyclopedia descriptions have additional pages so the complete text remains readable.
- Existing menus, battles, login, saving and onboarding remain available in both languages. Canonical identifiers and saved fields are unchanged.

This does not translate text embedded in artwork, separate guide/editor websites, or arbitrary text authored by players in the map editor. The Beta label remains while secondary interfaces such as clothing and multiplayer receive further review. Unknown text remains in its original language.

## Checks
- `node tools/verifyEnglish167.mjs`: all encyclopedia, move/item, map NPC/sign, habitat and later-story content; dynamic quantities; original Japanese and canonical data preservation.
- `node tools/verifyEnglish166.cjs`: browser regressions plus `checkEnglish167Browser.cjs` for full encyclopedia pagination and late-story dialogue, wrapping, switching language, save preservation, battle controls and login.
- Set `BASE` to check a deployed build. The test only intercepts its own browser's main module to enable the existing local test hook; production code is not changed.
