# NPC redesign — 2026-09-08

Generated with built-in image_gen, using assets/revamp-v2/hero-source.png as a style reference. Final source: assets/world-v5/people-v6.png. Eight original characters, four directions each; runtime normalizes the visible body to the same 30 x 46 bounds in a 32 x 48 frame as the hero. Existing assets remain preserved.

Prompt: New production NPC sprite atlas for a top-down Swiss village RPG. Match the supplied hero's crisp pixel art, navy outlines, large head, three-head proportions, boots and rich shaded pixels. Four columns (front, left, right, back), eight rows: green-jacket boy trainer, coral-jacket ponytail girl, silver-haired professor with white lab coat, rust-vest elderly villager, teal-trim nurse, mustard-apron shopkeeper, forest-hat orange-jacket hiker, lavender-cardigan mother. Transparent margins, complete bodies, no scenery, labels or grid lines. Same detail and proportions as the hero. Original designs.

The generated source includes a pale checker matte. npcArt.js flood-clears only border-connected pale neutral pixels when extracting sprite frames, preserving enclosed white clothing. Runtime step animation adds alternating one-pixel foot offsets and body rise.

NPCs choose random directions and pauses, stay within two tiles of their starting point, reserve both origin/destination during movement, avoid occupied cells and entrances, and stop/facing the player for conversation. Clinic/shop staff remain available at their counters. Legendary Gaon event is excluded from wandering.

Validation: verifyNpcs.cjs simulates 200 seconds on each of six maps, checks all eligible people/trainer motion, integer tile positions, destination reservations, no overlap, home radius, directional sprite bounds and conversation freeze. verifyChapterStructure.cjs verifies all map exits and NPC approaches remain reachable. Outputs are under artifacts/.
