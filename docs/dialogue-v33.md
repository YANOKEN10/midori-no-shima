# Dialogue v33

Explicitly authored ambient dialogue for 11 residents plus 19 ordinary trainers (including 10 aboard the ship). Conversations use a shuffled bag per character and phase, returning the original text on the first interaction and avoiding consecutive repetitions. Memory is scoped to the current save object; it survives map changes but resets on reload. Original map data is not mutated.

Quest scripts, services, major opponents, information providers without an authored ambient entry, and fixedDialogue actors retain fixed dialogue. Ship trainers always retain the daily battle limit/rematch information.

Yanoken is an explicit exception: the initial encyclopedia introduction uses the seven user-specified sentences verbatim, followed by the item receipt. Subsequent local greetings vary, as do greetings after the ship battle is won. The three-conversation ship encounter and item/progression flags remain intact.

Validation: verifyDialogueV33.cjs checks 30 varied / 41 fixed NPC definitions, actual world interactions, repeated nonidentical conversations, protected actors, exact Yanoken introduction, all three requested greetings and a single encyclopedia grant. verifyVoyageV28.cjs verifies the ten actual daily battles, Yanoken's third-conversation battle, voyage, professor ticket and daycare regressions.
