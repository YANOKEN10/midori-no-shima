# Start screen and Kagenagi icon (v170)

Every normal launch opens an illustrated start screen before onboarding, login restoration and the home menu. Tap the illustration/button or press Enter/Space/Z to continue once. The language picker remains usable without starting the game. Existing saves are untouched; local test-map and administrator preview paths bypass the start screen.

The final ensemble uses Kokegoro on the upper left, Nushigaeru beside the water, Niyago on the lower right, Kagenagi on the lower left and Valdio on the upper right, following the user's revised cast and placement. The original game sprites were supplied as image-generation references. `assets/start-v170/ensemble.png` retains the revised generated artwork, encoded as WebP at quality 90 for deployment. The v169 files retain the previous composition. The title and controls are live bilingual HTML, not baked text.

Home-screen and tab icons reuse the actual Kagenagi battle sprite (`redesign-v47/front/118.png`), with nearest-neighbor scaling. The maskable image fits the central safe area. New versioned URLs are used in the manifest and Apple touch icon links. Previously installed home-screen shortcuts may retain their old icon until the OS refreshes it or the shortcut is added again.

Verification: `node tools/verifyStart169.cjs` (set `BASE` for production) checks mobile/desktop rendering, live language changes, tap/keyboard transition into the menu, repeated launch, save preservation and icon URLs/dimensions.
