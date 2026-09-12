# Yanoken photo-inspired sprite redesign — v36

Dedicated original pixel-art character based on the user's three supplied photographs: short black center-parted hair, navy bomber jacket with ivory trim, blue striped shirt, beige cargo trousers and black boots. The source photographs are not published.

The generated chroma-key sheet is stored in assets/people-v36/yanoken-sheet.png. Four columns represent down, left, right and up; three rows represent alternating walking feet and a neutral stance. Runtime extraction removes the magenta key, preserves transparent gaps, normalizes visible character height with the existing matchHeroHeight helper, and caches each frame.

All three existing appearances use the dedicated identity: the first meeting in Rods Town, the ferry lounge and the volcanic mountain. Generic residents retain their current sprites. Dialogues, parties, rewards and battle music remain unchanged. The current battle screen does not draw the opposing trainer, so no new opponent introduction mechanic is added.

Verification: verifyYanokenV36.cjs checks all three map appearances, twelve populated directional/walking frames, distinction from the generic boy, existing character scale, mobile screenshots and absence of missing assets or browser errors. Generated prompt retained in yanoken-v36-generation.json.
