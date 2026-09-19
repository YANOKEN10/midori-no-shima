# Visual fixes v81

- Regenerated Hanabii, Flawan and Bloomna front/back sprites with native alpha and opaque faces/bodies.
- Generated blue harvest tree/ore sprites; removed world-space labels and centered the land sign.
- Regenerated clinic art; its entrance anchor at source pixel (131,151) maps to the center of doorway tile (4,4), with render offset (+13,-7) at 160px. Existing doorway and return coordinates remain intact.
- Clothing building visible bounding box matches the shop; existing entrance remains anchored.
- Clothing prices occupy a reserved column, preview is separate, full selected name below. Clothing/hair colors use the original 50-color palette free of charge.
- Removed title lettering and frame; increased trainer and Kokegoro battle display size.
- Editor supports quarter-turns for floors, scenery and furniture; dimensions, collision, doors, return points, link anchors and persisted state rotate together. Added missing directional paving edges/corners (69 paths total).

Validation: verifyResourcesV80, verifyMapStudioV79, verifyVisualV81, verifyMapCompletionV78; verifyMapEditorV75 updated for expanded path catalog. Visual review: clinic grid alignment and real round trip, shop sizes, clothing prices, all six monster sprites.
