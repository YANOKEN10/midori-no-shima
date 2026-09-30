# Release 201 — hidden grass and hospital nurses

Painted floors now determine native grass collision/encounter cells when no visible grass prop covers the cell. Explicit grass props remain above the floor. The correction is shared by the game and map studio and does not rewrite saved maps.

Audit: 134 maps; corrected 15 cells on Route 2, 297 at Mountain Altar, and 120 in Leaf Town. After correction there are no painted-floor/native-grass mismatches. NPCs, items, warps and validation results are unchanged.

All 13 regional hospital visits retain the healing nurse's uniform (variant 4), down-facing direction and stationary counter position instead of applying the town visitor outfit. Town-specific staff names and other visitors remain unchanged. The nurse sheet was visually inspected.

Validation: tools/verifyGrass201.cjs compares old/new maps and checks every hospital counter interaction. tools/verifyGrassBrowser201.cjs checks the road foot overlay, renders the hospital, and exercises nurse healing with dialogue acknowledgements automated in the isolated test browser. Evidence is in artifacts/grass201.
