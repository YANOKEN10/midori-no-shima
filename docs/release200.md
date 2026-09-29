# Release 199–200: workshop items and readable dialogue

- Workshop item palettes show the actual item effect on hover or keyboard focus. Selected pickups show the same description. Canonical item IDs are unchanged.
- Pickups explicitly share walkable grass/flower layers (including native tall-grass tiles), retain the ground and pickup identity after serialization, and continue rejecting solid scenery, other items and blocked approaches.
- Kageri ordinary ground uses `grass175-center`; 570 cells published at map revision 147. Actors, entrances, encounters and objects are preserved. Latest published/draft records are read and backed up before an optimistic-concurrency write; other maps are unchanged.
- Dialogue and ordinary choice panels use paper, forest-green and gold. Speaker names have separate labels; selected choices have a gold row. Trainer alerts use a small pixel-edged speech bubble.
- Shared canvas typography uses locally available Japanese gothic faces, with no additional font download. Dialogue body is 16 px with 29 px line spacing and separate ruby. Wrapping reserves closing punctuation so it does not become an isolated line start. Battle dialogue shares the light panel; battle command cells retain their existing contrast.

Validation:
- `node tools/verifyItems199.cjs`: 120 grass/flower placement-order and serialization cases, native tall grass, solid/duplicate rejection.
- `node tools/verifyWorkshop199.cjs`: real editor with isolated mock saves; hover/focus/Escape, move-scroll descriptions, draft save.
- `node tools/verifyReading197.cjs`: 534 items, 4077 ruby parts, bounds, page progression, English and canonical item selection.
- `node tools/verifyDialogue200.cjs`: real local world, dialogue, choices, alert, battle text and narrow viewport screenshots.

Local evidence: `artifacts/workshop199`, `artifacts/dialogue200`, `artifacts/kageri-publication199`. Publication backups remain private and are not committed.
