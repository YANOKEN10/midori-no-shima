# 岩・崖・山のマップ素材

画像生成した16種類の素材です。`assets/terrain-v17/atlas.json` に切り出し座標があります。標準描画サイズは32×32です。

`src/rockTerrainArt.js` の `drawRockTerrain(ctx, name, x, y, w, h)` で描画します。画像の読み込み前はfalseを返します。

- 横の崖：wall-front / rim-horizontal
- 縦の岩壁：wall-west / wall-east
- 手前の角：corner-west-front / corner-east-front
- 大きな角：outer-west-front / outer-east-front
- 内側の角：inner-west / inner-east
- 床：floor / plateau
- 岩：boulder / boulders
- 段差の移動：stairs / ladder

縦壁には横壁の回転や繰り返しを使わず、専用の縦壁素材を並べます。コリジョンと移動リンクはマップ側で設定してください。木で囲む道路・タウンの外周は維持し、岩の素材は岩山や洞窟のマップに利用します。

生成方式：built-in image_gen。元の生成画像はrock-terrain-source.pngとして保存しています。
