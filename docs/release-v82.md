# Map workshop v82

- Place signs and edit up to 500 characters with line breaks. Existing signs migrate without losing text; moved/stored signs move/remove their interaction.
- Admin-only custom map registry, outdoor/indoor maps 12–64 tiles each dimension. Definitions stay private until publication. Existing connection controls support old/new maps and bidirectional travel; publish new destinations before linking publicly.
- Trainer party editing (1–6 Gaon, levels 1–100) preserves trainer identity and existing battle metadata.
- Per-map shop inventory, selectable priced items, preserved prices; indoor override takes precedence over town override.
- Validation runs on both client/server; registry creation uses optimistic concurrency. No production map content changed by this release.

Tests: verifySignsV82 covers UI/save/publish/game sign interaction; verifyExpansionV82 covers UI map creation, privacy, publication, old/new/indoor roundtrips, trainer persistence and real shop inventory.
