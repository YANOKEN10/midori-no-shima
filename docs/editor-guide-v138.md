# v138 — 工房と攻略サイト（2026-09-22）

- 工房の「拾えるアイテム」から道具・素材を1マスに配置。個数は1〜99個。隣から決定で拾い、安定した配置IDで一度だけ受け取る。移動・収納・再公開で受取済みを初期化しない。複製は別の配置ID。
- 元の草むらを通常の素材として選択・移動・収納・復元できる。古い編集データは一度だけ移行し、塗り替え済みの地面は保持する。
- トレーナーの賞金を0〜999999円で編集。未設定時は元の賞金。元の編成と賞金をそれぞれ復元できる。
- 人物名から括弧書きと肩書きを取り除き、452の人物配置に固定名を設定。別人の名前は重複しない。ライバル・ヤノケン・博士・エビゲルの再登場は同一人物として名前を維持。既存ストーリーの固有名を保持。新規配置・名前編集・API保存時にも重複を検査する。
- 草むら素材 legacy73-tallGrass を assets/grass-v138/tall-grass.png に差し替え。32×32、透過、最近傍縮小。既に配置した同素材にも反映。
- /gaon-guide/ に7章の画像付きストーリー、ライバルの条件・手持ち・レベル、日曜の再戦、タワーの別ルール、パーク5エリアを反映。画像はゲーム描画による案内画面例。人やイベントの表示条件は進行状況で変わる。

## 検証

- tools/verifyPickups138.cjs: 個数、地面保持、収納、ID保持、重なりと範囲外。
- tools/verifyGrassStorage138.cjs: 元の草むらがある35マップで移行・保存復元・収納復元。
- tools/verifyPeople138.cjs: 452人物配置の名称、賞金0円・上限・不正値・ゲームデータ反映。
- tools/verifyBrowser138.cjs: 工房の実操作で配置・個数・収納・復元・保存、ゲームの決定操作から受け取りと端末保存後の重複防止、元の草むら収納、賞金編集、草素材パレット、攻略全章の画像と進行チェック・スマホ幅。
- tools/verifyExits137.cjs: 2マス出入口と234辺の道の連続性の回帰確認。

## 画像生成

Built-in image_gen使用。最終素材: assets/grass-v138/tall-grass.png。
プロンプト: Create a single game-ready 2D pixel-art sprite: one compact tuft of tall encounter grass for a cheerful Japanese top-down monster RPG. Transparent alpha background. The sprite is logically exactly 32 by 32 pixels, presented as a crisp integer-upscaled image; use coarse consistent square pixels, no antialiasing or gradients. Limited 7-color palette of yellow-lime highlights, medium leaf green, jade green and deep teal shadows. A low fan of pointed blades, top-down three-quarter view matching 32px terrain tiles and small RPG people. Occupy the central 28x26 logical pixels with a 2-pixel transparent border on every side. Entire complete tuft visible, isolated, no clipped fragments, no neighboring sprites, no ground rectangle, no outlines around canvas, no text, no glow, no checkerboard painted into the artwork. This is a production replacement for a flawed grass sprite in Gaon World. Save output for project use.

本番公開中の8マップを読み取り、編集データの互換性と人物名の重複なしを確認。既存の独自名15件を保持。
