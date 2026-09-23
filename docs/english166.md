# English beta (v166)

The game offers Japanese and opt-in English (Beta) using the language selector or Settings. The preference is stored in `gaon:language` on the device, separately from all saves. Japanese is the default. No translation service or network request is used for translation.

## Implemented
- All 200 species have authored English display names; all 292 moves have English names.
- Core menus, battle commands/messages, common item descriptions, login, saving, character setup, onboarding, and the first chapter's main story.
- Translations run before text wrapping and measurement; live changes invalidate dialogue layout.
- Canonical Japanese species/move/item names and all saved fields remain unchanged. Choices still return original indices.

## Remaining work before calling this a complete English release
- Later story chapters, incidental NPC dialogue and map signs.
- Encyclopedia species descriptions, some move/item descriptions, secondary facility and multiplayer/economy messages, clothing/color labels.
- Japanese text embedded in artwork and separate guide/editor websites.

Unknown text intentionally stays in Japanese instead of inventing a translation. Add exact entries to `src/i18n/`; variable messages use anchored templates. English creature names are display mappings, not key migrations.

## Verification
`node tools/verifyEnglish166.cjs` checks all creature/move names, template substitutions, preservation of player-name spaces, unchanged game data and save, wrapping, battle choice indices, switching back, persistence, login input preservation, and mobile rendering.

The new-game test also exposed an existing error after removing all grass from Moss Sanctuary. Rare encounters now prefer reachable grass, fall back to reachable open ground, and safely omit a rule when a map has no valid land. Existing valid spawn positions remain stable.
