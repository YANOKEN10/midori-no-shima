# v40 主人公素材

Built-in image_genを使用。ゲームには以下の生成画像を使用します。

- girl-walk.png：4方向×3歩行ポーズ。参照 assets/people-v13/01.png。赤い上着・茶色のポニーテールを維持し、足と反対の腕を前後に振る。
- boy-hair.png：4方向×短め・ふつう・長めの頭部差分。参照 assets/revamp-v2/hero-source.png。src/revampArt.jsで背景の外側につながる無彩色マットだけを抜き、髪色変更と体への合成を行う。

## 最終プロンプト
Girl: Replace the same brown-ponytail girl RPG sprite sheet, preserving red jacket, cream undershirt, navy shorts, brown boots, satchel and blue eyes. Four columns front/left/right/back, three rows left-foot-forward/idle/right-foot-forward. Arms visibly swing opposite to legs in every direction. Uniform character scale, transparent background, complete uncropped figures, crisp pixel art, no labels.

Boy: New HEAD ONLY atlas for the same brown-haired blue-eyed boy. Four columns front/left/right/back, three rows short cropped hair/medium tousled hair/long shoulder-length layered hair. Same skull and face size, no torso or shoulders, no labels, pixel art. The generated RGB atlas has a checker matte; runtime connected-border matte extraction preserves eye whites and dark outlines. A subsequent transparency-only generation was inspected but was not selected.
