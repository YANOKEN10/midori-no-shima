# Music v31

Build: `20260912-battle-music-v31`

User-supplied WAV files in `I:/2026/BGM/ガオン/` were converted to MP3 at 160 kbps without changing their musical content or duration. Original WAV files remain untouched.

| Scene | Original | Output under assets/music-v31 | Seconds |
| --- | --- | --- | --- |
| Karat Town | Cozy Mountain Village（村）.wav | karat-cozy-mountain-village.mp3 | 163.2 |
| Marine Town | Whispering Grove（村）.wav | marine-whispering-grove.mp3 | 126.32 |
| General battles, including emblem opponents | Monster Encounter（バトル）.wav | monster-encounter.mp3 | 83.32 |
| Yanoken battles | The Warrior's Charge（ヤノケン）.wav | yanoken-warriors-charge.mp3 | 123.2 |

Nature Town retains Morning Meadow Path from v30. Shared town interiors inherit their originating town's music. Battle endings restore the current map's music. Only one recorded track plays at once; same-track transitions do not restart playback. Tracks loop and obey the existing mute control. Browser autoplay restrictions are retried by the existing input resume handler.

Validation: verifyMusicV31.cjs checks real playback and duration, loop/mute, map/interior transitions, and actual battle-start selection (stopping deliberately at the intro). verifyVoyageV28.cjs exercises completed trainer and Yanoken battles, voyage and daycare regression. verifyReleaseV28.cjs verifies mobile new-game entry and all 36 map definitions with no page errors or failed responses.
