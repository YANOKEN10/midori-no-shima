# Start screen and Kagenagi icon (v169)

Every normal launch opens an illustrated start screen before onboarding, login restoration and the home menu. Tap the illustration/button or press Enter/Space/Z to continue once. The language picker remains usable without starting the game. Existing saves are untouched; local test-map and administrator preview paths bypass the start screen.

The final ensemble uses Gigabeet, Voltia and Hyougan on the left, with Kagenagi and Valdio on the right, following the user's request for powerful rather than cute creatures. The original game sprites were supplied as image-generation references. `assets/start-v169/ensemble.png` retains the final generated artwork; the deployed WebP is made by `tools/prepareStart169.cjs`. The title and controls are live bilingual HTML, not baked text.

Home-screen and tab icons reuse the actual Kagenagi battle sprite (`redesign-v47/front/118.png`), with nearest-neighbor scaling. The maskable image fits the central safe area. New versioned URLs are used in the manifest and Apple touch icon links. Previously installed home-screen shortcuts may retain their old icon until the OS refreshes it or the shortcut is added again.

Verification: `node tools/verifyStart169.cjs` (set `BASE` for production) checks mobile/desktop rendering, live language changes, tap/keyboard transition into the menu, repeated launch, save preservation and icon URLs/dimensions.
