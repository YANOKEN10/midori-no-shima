# Companion scale v67

Field companions now use each species authored size, compressing sizes above 32px to retain body differences without overwhelming the 48px hero. Updated designs have explicit sizes by stable species number. Range: 20–46px. Battle sprites are unchanged.

Trailing distance follows field size (1.1–1.52 tiles), replacing the previous 2+ tile spacing for large followers. The existing Eden story companion spacing is retained.

Validation: all 156 species have bounded sizes and near-follow distances through a right-angle path; Garwing, Kokegoro and Tanekoro visually checked in all four directions. No browser errors. Run tools/verifyCompanionScaleV67.cjs against localhost:5182.
