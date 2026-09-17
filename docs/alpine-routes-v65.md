# ３・４番道路のアルプス風散策路（v65）

３番道路はチーズ工房、海辺の桟橋、花畑、草むら４区画と３人のトレーナーを配置。工房のエミールから回復を受けられます。４番道路はモミの林、湖畔の東屋と桟橋、草むら５区画と３人のトレーナーを配置。道は曲がり道と周回する寄り道を設けています。

既存のマップID、外部への出入口、出現テーブルを維持。既存NPCの配列位置も維持し、追加トレーナーの勝利記録と衝突しません。休憩所の回復は病院の復活地点を変更しません。古いセーブが新しい建物内にある場合は既存の安全な位置への移動処理が適用されます。

画像は組み込み image_gen で個別に生成。元画像を `assets/routes-v65/*-source.png` に保持し、表示用画像は透明余白を除き、最近傍法で縮小しています。地面の色やドア画像を上から重ねた建物ではありません。

生成プロンプト:

1. Create one production game sprite, transparent background, isolated Swiss Alpine cheese-maker's roadside chalet for a Japanese top-down pixel-art creature RPG. Three-quarter overhead view with strictly frontal facade, orthographic not isometric: horizontal facade edges, centered bottom door. Warm timber walls, pale limestone foundation, red-brown shingled wide pitched roof, tiny chimney, green wooden shutters, geranium flower window boxes, small cheese wheel emblem above a centered open veranda service counter. This is an OUTDOOR cheese stall with open serving counter, NOT a enterable front door. No text, no letters, no people, no landscape, no ground rectangle, no drop shadow outside footprint. Complete roof and walls uncropped with generous transparent margin. Cozy refined 16-bit pixel art, clear readable silhouette, consistent hard pixel clusters and restrained detailed shading. One building only centered, front faces straight south. Square canvas. Asset intended to display about 192 by 160 pixels.
2. One single transparent-background game sprite of an elegant rustic Swiss lakeside picnic shelter / open timber gazebo. Top-down 3/4 overhead camera for a 16-bit Japanese creature adventure RPG, front facade perfectly horizontal, not isometric. A small green copper gabled roof, carved warm wood beams, open front, bench seating and picnic table tucked under shelter, two tiny geranium flower boxes attached to the side posts. Cozy Alpine architecture. No text, no logos, no people, no landscape or water, no ground rectangle. Entire complete building centered with generous transparent margin; genuine transparent background. Crisp refined pixel-art clusters, clean silhouette, warm timber, moss green roof, gentle readable shading. Single structure only, square canvas, intended display about 160 by 128 pixels.

検証: `node tools/verifyAlpineRoutesV65.cjs [URL]`。NPCを障害物に含め、全出入口・入場地点・草むら区画・NPCと看板の隣接位置に到達可能であることを検証。ブラウザで全景と実画面を書き出し、画像の読み込みとJSエラーを確認。回復と復活地点、旧セーブ位置の移動は追加の実行確認済み。
