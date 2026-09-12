# Resure to Clear Town — v35

This chapter extends the existing ferry/daycare story with 17 maps (53 total). Existing tickets, voyages, parents, caught species, player locations and legendary encounter saves are retained.

## Story and progression
- Resure is a ranch town with daycare pens, a barn, mountain rocks and a separate Gaon Park. Park-exclusive wild species: ウリボン, スナボンネ, ワンヒノ, シオマント, ネコデン, ドロヌマ, カマキリン, ハナヤリ, タヌポン, フワクジ. They are removed from other wild encounter lists. Only actual captures in the park count toward its ten distinct species.
- One daycare birth is recorded once when the existing 2,000-step job becomes ready. Together with ten park species this triggers Takara's approach. Declining returns Takara to roaming near the park. Winning grants the Resure Emblem once.
- Ordinary trainers offer a weekly rematch after victory, resetting Monday at 00:00 Japan time. Flower Park has ten daily trainers; existing ship trainers remain daily. Declining never consumes a rematch.
- Resure connects to roads 8, 9 (Flower Park), 10 (Resure Beach), and 11 (Galaxy, five unique emblems). Beach leads to the long, higher-level road 12 and Manikereo.
- Manikereo station contains a reusable train connection to Galaxy at seven unique emblems and a shop for three held items. Power Band, Defense Charm and Insight Stone each cost 2,500 and boost attack, defense or special attack by 10%. Items can be equipped from the bag, removed from the party menu and are returned when a Gaon is released.
- The mayor's volcano briefing opens the path beyond Mountain. Ash Road leads through three climbing dungeon floors to the summit. Near the top Yanoken approaches and offers an optional rematch. Victory grants one Lv.5 Awamii, with the dialogue explaining that it was born from his Awamii. A full party sends the gift to the box.
- Summit Yogannushi is Lv.35. The first battle forbids both capture and player escape; victory offers immediate travel back to Nature Town. Reporting to Nature's mayor gives the Manikereo Emblem. After the initial victory, the summit encounter appears daily at 15:00–24:00 Japan time with catch rate 3 and no player escape. It stays absent while owned, including daycare; defeat or release allows return the next day.
- Volcano victory opens long, snowy road 13 and illuminated Clear Town. Snow sprites include terrain, grass, rocks, houses, fir trees, festive lights and four residents in winter clothes with four facing directions.

Unspecified teams chosen for this chapter: Takara has ウリボン26 / タヌポン27 / フワクジ28; mountain Yanoken has コケゴロ32 / アワミィ30 / ヨルネコ33. Clear Town's test and later emblem tests were not specified and are not invented; five/seven-emblem travel gates remain in place for the continuing story.

## Artwork
Built-in image generation produced two transparent 4×4 sheets. Original files:
- exec-c6fe4d4c-d15f-4370-baad-676491928962.png (terrain, buildings, vegetation and train)
- exec-f024d0fe-1150-45c6-a368-574432499827.png (winter residents)

Both were generated under the current Codex task's generated_images directory, then sliced and trimmed into 32 project-owned PNGs in assets/chapter-v35. Generation calls, including prompts, are retained in frontier-v35-generation-calls.json. Snow-ground tint and grass overlap are applied in the canvas renderer. Existing grass, mountain and building materials are reused where appropriate.

## Verification
- verifyFrontierV35.cjs: full map reachability and landing collision checks; ten real park captures; origin and deduplication; exact birth threshold; Takara and Yanoken approach/decline/accept; unique rewards; first summit escape/capture denial and victory; daily schedule/ownership/release; train roundtrip; unique-emblem gates; held-item purchase/equip/stat changes and save reload.
- verifyVoyageV28.cjs: professor, ticket, 180,000ms voyage, all ten ship trainers, third-conversation Yanoken, existing daycare retention/egg moves/2,000 actual steps.
- verifyMarineStoryV26.cjs and verifyPowerStoryV27.cjs: prior emblem stories, timed legends, defeat/capture/escape restrictions and persistence.
- verifyReleaseV28.cjs: real mobile new-game UI to home and town, all 53 maps loaded, zero console errors and missing assets.
- verifyFrontierMobileV35.cjs / renderFrontierV35.cjs: actual mobile map rendering and full-map artwork inspection for ranch, park, station, volcano and snow scenes.
