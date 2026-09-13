# Gaon redesign v47

43 redesigned species, created with the built-in image_gen tool. Each creature has a 4-column / 2-row pose sheet. Generated originals are retained in work/redesign-v47-source (not deployed). Existing original images were not overwritten.

- front/: front battle and encyclopedia PNGs, 80 x 80, alpha background.
- back/: rear battle PNGs, 80 x 80, alpha background.
- assets/followers-v47/: four directions with two poses each, 320 x 160 atlases.
- prompts.json: prompt set and reference images.
- requests.json: design changes, renames and the Gigabeet stat adjustment.

The importer uses the existing sprite-sheet workflow: chroma-key matte removal, cell extraction, transparent padding and nearest-neighbor scaling. Frame anchors and scale stay consistent across the eight poses.

Species numbers, evolution levels and saved individual progression are retained. Registry aliases accept legacy names without duplicate encyclopedia entries. Gigabeet attack is 130 and speed is 100.
