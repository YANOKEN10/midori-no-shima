# Swiss map materials v1

Generated with the built-in image_gen tool on 2026-09-07.

This directory is an additive material pack. Existing Gaon, character, and map assets are retained. No player records are modified. Production has not been deployed with these materials.

- `swiss-atlas-v1.png`: original RGBA sprite sheet, 1254 × 1254.
- `atlas.json`: 50 source rectangles, destination sizes in 32px tiles, and four town palettes.
- `preview.html`: browser preview of every material plus four small composition samples.

The generator did not follow the requested uniform 8 × 8 grid. The manifest therefore uses individually measured rectangles. Do not slice by equal grid cells. The previews draw those rectangles directly without rewriting the source image.

Trees occupy 2 × 3 tiles; the Christmas tree occupies 3 × 4. Rocks and encounter grass occupy 1 × 1. Chalets mostly occupy 4 × 4. Building entrances, solid footprints, foreground occlusion, shoreline transitions, and seamless terrain require validation during game integration. This is a first material pack, not a completed playable map.

## Town direction

## Traversal requirements (2026-09-07)

- Doorways, stairs, and ladders have a width of exactly one 32px tile. Long stairs and ladders extend vertically. The stairs preview now uses 1 × 2 tiles; a dedicated ladder sprite is still required.
- River and sea edge tiles are impassable, as are ordinary water tiles. Only explicitly placed bridge or jetty passage tiles permit crossing.
- Every tile occupied by a tree is impassable, including its canopy: a 2 × 3 tree blocks all six tiles. Apply this equally to firs, snowy firs, and Christmas trees using their full placement rectangles.
- These constraints are recorded in `atlas.json.placementRules`. Game collision integration is pending; this material metadata alone does not change the live game.

## Town palettes

- ネイチャータウン: starting village, alpine meadow, yellow paths, firs and timber chalets.
- クリスマスタウン: paved streets, snowy borders, warm windows, market stalls and decorated trees.
- ブルータウン: patterned blue sea, harbor, blue roofs, colorful timber buildings.
- ギャラクシータウン: city paving, tall glass buildings, apartment blocks and station.

## Generation prompt

Use case: stylized-concept. Create an ORIGINAL production sprite atlas for Gaon World, a top-down 2D pixel-art RPG inspired by the visual grammar of Game Boy Advance FireRed/LeafGreen, with Swiss Alpine landscape and villages. This is a TILESET ASSET SHEET, NOT a finished map or landscape scene. Square 1024x1024 canvas, organized into 8 columns and 8 rows of 128x128 cells, NO visible grid, NO labels/text, no characters or Pokemon imagery, no logos. Strict crisp pixel art at a consistent apparent 2x pixel scale, orthographic top-down with building fronts visible, no isometric. Terrain cells fill entire cell and are seamless. Objects isolated on actual transparent background with generous transparent margin and aligned to cell base. Rows 1-2 terrain: mint green short grass, tall encounter grass tufts, warm pale yellow dirt, dirt/grass transition, gray cobblestone, red cobblestone, snow, blue sea with repeating diagonal cyan wave strokes, turquoise river, sand, cliffs and steps variations. Row 3: single-cell gray rock, small rock, flowers, horizontal pale gray picket fence, vertical fence, fence corner, wooden sign, streetlamp. Row 4: leafy broad tree occupying full cell (intended 2x3 map tiles), alpine fir tree 2x3 tiles, snowy fir, decorated Christmas tree with red ornaments and golden lights, shrubs and flowers. Rows 5-6: separate Swiss chalets with steep red/brown roofs, white plaster and dark timber, blue shutters, flower window boxes; snowy illuminated chalet, Christmas market stall, colorful timber canal house, blue roof harbor shop, clocktower, stone bridge. Buildings occupy a full atlas cell intended 4x4 map tiles. Rows 7-8: tall modern city buildings blue glass/gray stone for Galaxy Town, city station, rooftop variants, Christmas lamps/garlands, harbor bollards, jetty segment, mountain cliff/snow peak modules. Shared limited palette: mint/turquoise greens, golden sandy paths, saturated medium blue patterned ocean, warm wood red roofs, soft blue-gray rock. Cute readable elegant compact sprites faithful to early handheld RPG proportions. Trees visibly much larger than rocks; houses larger than trees. No blurry painting, smooth gradients, photorealism or perspective scenes. Make a cohesive attractive practical sprite sheet.

## Verification

Preview loaded locally in headless Edge through Playwright: 50 material cards, four named town samples, zero JavaScript page errors. Screenshot: `../../artifacts/swiss-material-preview-v1.png`.

Tall grass remains walkable. During both standing and movement, render a foreground grass layer over the player's feet. Game renderer integration is still pending.

## Battle backgrounds (material design phase)

Four original images were generated with the built-in image_gen tool and saved here: battle-nature-v1.png, battle-blue-v1.png, battle-christmas-v1.png, battle-galaxy-v1.png. Review them in battle-preview.html. Existing battle backgrounds and Gaon art are retained. Not yet wired into battle.js or deployed.

Prompt set: original Gaon World classic GBA pixel-art battle assets, landscape 3:2, limited palette and crisp pixel edges, no creatures, humans, interface, text or logos; quiet upper-left and lower-right regions for HP panels; two empty oval platforms at upper-right and lower-left. Nature: mint-green Swiss alpine meadow, distant firs, chalets and peaks. Blue: patterned blue sea and timber harbor behind warm sand. Christmas: snowy chalets, warm windows and decorated fir at blue dusk, pale blue snow field. Galaxy: modern glass towers and station behind a light blue-gray paved square. Full generation prompts are retained in this task's image-generation calls.

Before integration, align each background platform with the live battle sprite foot anchors and validate HP/command readability. These are background assets, not screenshots of the game.

## Battle correction v2

The user rejected scenery in battle backgrounds. The current preview supersedes the four scenic v1 concepts with battle-grass-simple-v2.png and battle-river-simple-v2.png. Both were generated using the built-in image_gen tool. No runtime integration or production deployment has occurred.

Prompt direction: landscape 1536x1024 classic GBA pixel art; abstract pale horizontal stripes and exactly two elliptical standing areas; no mountains, houses, trees, skyline, creatures, text or interface. Grass uses mint bands and pale green grass patches. River uses pale turquoise current bands and broken white/cyan ripple rings, with no land or riverbanks. Exact prompts are retained in this task's generation calls. Field movement restrictions remain a separate requirement; adding river battle art does not make shoreline tiles walkable.
