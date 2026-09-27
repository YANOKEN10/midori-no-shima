# Reference interiors, release 188
Eight transparent sprites generated with the built-in image tool from the user-supplied room reference. The source atlas is retained in source.png. tools/extractRoom188.cjs packs each sprite on a 16-pixel-per-map-cell grid. Blue chair-left is mirrored at render time. Floors, wall bands, rug borders and entrance mat use editable native canvas tiles in src/roomArt188.js.

19 rooms: all names ending in の室内, plus karatSalon. Existing entrances, resident identities and dialogue are retained. Furniture is stored rather than deleted during the one-time migration. New materials are available in the workshop's 参考室内の床・家具 tab. The red/gold throne additionally has a 1x1 variant using the existing throne artwork.

Validation: tools/checkLayout188.cjs; tools/verifyRoom188.cjs; tools/verifyWorkshop188.cjs. Database publishing capacity regression: tools/verifyMapCapacity188.cjs.
