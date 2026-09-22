# v140 出入口・霊の描き直し・海と桟橋・船

## 操作
- 屋外・洞窟のマップ端と公園の門にある他マップへの接続を2マスに統一。建物のドアと室内は対象外。元の行き先・イベント条件を保ち、往復の到着地点を対応する内側のマスへそろえる。
- 工房の「地面・床」→「海の水面」で、現在の港の海と同じテクスチャをドラッグで塗れる。重複した旧「海」の置物は床セルへ移行する。
- 「地面・床」→「桟橋の床」は歩ける木の床。海上へ塗って道を延ばせる。
- 「飾り」→「小舟」（3×2マス）・「ヨット」（4×4マス）。配置・移動・回転・収納に対応。透明な周囲には元の水面を残す。
- 霊3種を作り直した。マップは既存人物の大きな頭と短い胴体に合わせ、32×48の枠内で見える高さ40px。バトルは既存トレーナーを参照し64×96。輪郭のにじみを除き、消失中以外ははっきり表示する。

## 素材
built-in image_genを使用。プロンプトは assets/ghosts-v140/prompts.json と assets/harbor-v140/prompts.json。
- 霊：assets/ghosts-v140/{girl,elder,white,battle-girl,battle-elder,battle-white}.png
- 桟橋：assets/harbor-v140/dock-floor140.png（32×32）
- 小舟：assets/harbor-v140/rowboat140.png（96×64）
- ヨット：assets/harbor-v140/yacht140.png（128×128）
- 海面は既存 assets/marine-v26/sea.png の同じ32px区画を使用。

## 検証
- verifyMapExits140：標準マップ112接続、2マス幅、隣接、到着先、繰り返し適用。
- verifyMapExitsBrowser140：224マスから移動処理が呼ばれること、着地点、出口の描画。公開時は公開編集データも読み込んで確認。
- verifySeaFloor140：工房の床選択、陸地への海の追加、保存、同座標の旧海素材2個から床1枚への移行。
- verifyHarbor140：桟橋の通行、船の水面保持、回転・収納、主人公と並べた描画。
- verifyBrowser139、verifyGhostSymbols139、verifyPickups138、verifyPeople138で既存機能も確認。
- 比較画像：artifacts/ghosts140-review.png、artifacts/exits140-review.png、artifacts/harbor140-review.png。

## 看板
- 初期配置の看板を塗った床へ移すと、床の描画で看板が隠れる問題を修正。床の上へ看板を描画する。
- verifySign140：移動先での表示を床だけの画像と比較し、移動先から文章が読めること、元の位置に看板イベントが残らないことを確認。
