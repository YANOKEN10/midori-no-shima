# Real-time environment, moves and close followers (v69)

- Japan real time matches scheduled encounters. Dawn at 05:00, morning 06:00, day 10:00, evening 16:00, night 18:00; lighting transitions smoothly. Outdoor clock/status stays above scene tint and below dialogs.
- Fictional weather follows real two-hour blocks, fading over ten minutes. Clear/cloud/rain varies by date, with snow in winter/cold areas. Reloading and moving between adjacent maps do not reroll the weather. Interiors/caves are excluded; story storms, volcanic ash and blizzards retain their existing effects.
- Eleven requested move renames update learnsets, battle messages, public dex and friend battle catalog. Old save names resolve to new names while preserving remaining PP. Existing power/category/effects stay the same.
- Wood Burst: grass physical, power 95, accuracy 100, PP 10. Learned at level 38 by Kinogami, Uribon, Dosuuri, Kokegoro, Sunabonne, Nemunoha and Kaederia (grass species with Attack above Special Attack).
- Follow-up to v67: horizontal following distance is now 0.9–1.09 tiles; vertical distance is 86% of horizontal for natural depth overlap. Size remains species-specific. Turning immediately repositions behind the new facing when the destination is walkable; walls/NPCs retain the safe trail fallback. Actors remain sorted by foot position.

Verification: four directions for Garwing/Kokegoro/Tanekoro; 156 species path clearance/range; stationary cardinal turns and blocked targets; morning/day/evening/night/rain screenshots; continuous lighting boundaries; room/cave exclusion; migration with PP preservation; seven level-38 learnsets; public dex and server alias compatibility. See verifyRealtimeWeatherV68.cjs, verifyMovesV69.cjs, verifyCompanionScaleV67.cjs and verifyCompanionTurnsV69.cjs.
