# Rival naming and walking (v168)

New games ask for the rival's name after the player's name, before appearance selection. Names are trimmed to eight Unicode code points; blank input uses Reiji (レイジ in Japanese). Cancelling returns to the title before a new save is created.

The new `rivalName168` save field is included in normal local/cloud snapshots. Existing saves retain their previous map display name when the field is absent; the legacy `rival` field is unrelated and is preserved. The chosen name is used for story dialogue speakers, regular battles and Champion Tower rival opponents. Canonical NPC identity, appearance and battle music flags remain unchanged.

Rival approach and departure use the ordinary resident walking interval of 650 ms per tile with smooth offsets. A map change cancels the animation and resets transient motion state.

Checks: `node tools/verifyRival168.mjs` and `node tools/verifyRival168.cjs`. The browser test exercises new-game forms, saving/restoring, battle/tower naming, English input and cancellation. `BASE` selects a deployed URL; local test hooks are enabled only in that browser's intercepted response.
