# Marine chapter v26

Built-in imagegen was used for all new raster assets (fresh generations, no reference images). Originals and extracted runtime PNGs are saved in `assets/marine-v26/`. `tools/prepareMarineV26.cjs` extracts alpha sprites and resizes them with browser Canvas; the game consumes the extracted PNGs.

## Sources and final assets

- `harbor-source.png`: `marineHouse.png`, `marineHall.png`, `marineShop.png`, `marinePier.png`.
- `nature-source.png`: `ancientTree.png`, `shoreRock.png`, `ancientAltar.png`, `marineChest.png`.
- `sea-source.png` → `sea.png`; `lake-source.png` → `lake.png`; `reeds-source.png` → `reeds.png`.

## Final prompts

Harbor:
Use case: stylized-concept. Production asset: one coherent RPG pixel-art harbor architecture spritesheet, transparent alpha background, exactly 2 by 2 equal cells, generous transparent gutters. Top left: white stucco seaside cottage with blue tiled roof and centered south doorway. Top right: larger maritime town hall with turquoise tiled roof, shell motif above south entrance, no letters. Bottom left: coastal supply shop white walls orange striped awning blue roof south-facing entrance, no text. Bottom right: long horizontal wooden pier segment with weathered planks, rope posts at the upper and lower edges, clear walkable middle, viewed overhead. Orthographic top-down three-quarter classic 16-bit RPG perspective, crisp pixel clusters, vivid but natural coastal palette, consistent scale, no characters, no ground squares, no UI, no shadows outside cell. Each object completely inside its own cell. Actual transparent background. Square sheet.

Nature:
Use case: stylized-concept. Production 16-bit top-down RPG nature and shrine sprite atlas, actual transparent background. Exactly 2x2 equal cells with empty margins. Top left: ancient broadleaf tree, massive twisted mossy roots, lush layered deep jade canopy, whole tree. Top right: cluster of weathered rounded shoreline stones with pale lichen and small ferns. Bottom left: ancient low stone altar platform, three short steps on SOUTH side, weathered moss-covered upright stone at NORTH rear, center empty space, mystical but natural, no symbols or letters. Bottom right: small closed wooden treasure chest with turquoise metal bands and shell clasp, facing south. Consistent orthographic overhead three-quarter RPG perspective, crisp readable pixel clusters, muted forest greens, no landscape base, no characters, no UI, each object entirely isolated inside its own cell, square sheet.

Sea:
Use case: stylized-concept. A seamless repeating top-down ocean water texture for a 16-bit pixel art RPG harbor map. Entire square is opaque blue water, no shore no land no objects. Rich turquoise shallow sea with quiet cobalt depths, sparse small cream and pale aqua horizontal ripples, readable pixel clusters, low contrast edges that tile perfectly on all four sides. Uniform scale, calm harbor mood, no text, no border. Square image.

Lake:
Use case: stylized-concept. Seamless square top-down woodland lake water texture for a 16-bit pixel art RPG. Entire opaque image is still deep jade and blue-green lake water, cool mysterious forest mood, sparse subtle pale green horizontal ripple pixels and small glints, muted natural palette, crisp pixel clusters. No land, shore, trees, fish, objects, border or text. Similar colors at every edge for seamless repeating tiling; uniform lighting without vignette. Quiet sacred forest lake atmosphere.

Reeds:
Use case: stylized-concept. One isolated small tuft of shoreline encounter grass and reeds for a top-down 16-bit pixel art RPG. Actual transparent background. Low dense curved sage green and teal blades, few taller cattail-like leaves but no brown heads. Blends into cool moss-green woodland lake shores and seaside meadow, no fluorescent colors. Strong readable pixel clusters at 32px, natural irregular rounded root silhouette, no ground patch, no rectangle, no dirt, no text, empty transparent margins all sides. Entire plant inside square image.

## Story rules

9 additional maps including the town hall; previous save version retained. Marine trial starts at the island chest. Four roaming Kanipon Lv.8 are persisted independently; only victories count. Ebigeru appears once all four are defeated. His party is Kanipon 8, Sakanabi 10, Minamoris 12. Victory grants one Marine Emblem and opens Route 5. Four distinct emblems open the fog gate.

Water encounters are disjoint: Route 3 Sakanabi/Kuragemi; Route 4 Shizukun/Minamon; Remote Lake Kanipon/Minamoris. Nemunoha has 1% weight among altar grass encounters.

Meroron is Lv.30, Japan time 17:00 inclusive to 00:00 exclusive. Each visit is saved before combat. Catch rate override 3; 12% chance to flee after a completed surviving turn. Guaranteed nets remain guaranteed. Party and box possession suppress spawning; defeat, escape, loss, or release allow another visit on a subsequent day. Release records its own day. No clock service is used; the game uses the device clock interpreted in Asia/Tokyo.

Verification scripts: verifyChapterStructure.cjs, verifyMarineStoryV26.cjs, verifyMarineVisualV26.cjs, verifyMarineMobileV26.cjs. Story verification runs the actual battle engine with automated input and shortened animation waits in an isolated browser, including saved mid-trial progress, unique reward, gate changes, date boundaries, altar defeat, failed capture/flee, guaranteed capture, and trial capture restriction.
