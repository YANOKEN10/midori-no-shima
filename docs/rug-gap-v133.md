# Rug entrance gap v133

Indoor rugs now leave exactly one complete floor cell between their edge and the entrance cell. Width, height and the perpendicular coordinate stay unchanged. Select the return entrance, then place the rug relative to the closest room edge. Empty rugs stay empty.

Initial editor documents and older saved documents use the same alignment, with an idempotent rugGap133 marker. Published-map loading applies the default placement to rooms without edits too. Original base map data and fingerprint checks are unchanged.

Validation: verifyRug133.cjs passed for 43 editor rooms, all four entrance directions, old-document migration and repeat application. verifyRugBrowser133.cjs passed for all 44 runtime rooms, including the runtime-created player shop; the laboratory screenshot shows the one-cell floor gap. Read-only published-map validation passed for three saved maps, including the edited home, and continued to reject unrelated base changes.
