# 引き継ぎメモ（別のAIエージェント／人が 続きをやるとき用）

このファイルを 最初に 読んでください。**どこに 何が あるか** と
**さわるときの 決まりごと・ハマりどころ** を まとめてあります。

- 遊べるURL: <https://midori-no-shima.vercel.app/>
- 手元のフォルダ: `I:\Claude code\voraz-monsters`
- 手元で動かす: `node serve.js` → <http://localhost:5179>
- ビルドなし。**素の ES モジュール**（`<script type="module">`）だけ。npm run build は 存在しません
- 画像ファイルは 1枚も 使っていません。**ドット絵は すべて コードの中**（実行時に canvas へ描いています）

---

## 1. ファイルの地図

```
index.html            画面のわく（ログインUIも ここ）
serve.js              手元用サーバー（:5179）。/api/* は Vercel と同じ関数を呼ぶ
src/
  main.js             タイトル → ログイン → ぼうけん の 流れ。VM.* を window に出す
  world.js    839行   フィールド描画・あたり判定・NPC・ものがたりイベント
  battle.js   690行   たたかい
  menu.js     561行   メニュー（ガオン／どうぐ／ずかん／せってい）
  ui.js       241行   メッセージ枠・えらぶ枠（BOX = x8 y196 w304 h84）
  gfx.js      555行   描画の土台・色セット（パレット）・Pixelクラス・画像キャッシュ
  tiles.js    724行   マス（タイル）の絵 ぜんぶ
  trees.js    132行   木（複数マスにまたがる絵）
  props.js    388行   建物・屋根（6種類）
  state.js    159行   セーブデータの中身・makeMon()
  save.js / cloud.js  端末保存 / クラウド保存
  input.js            キー・タッチ・ゲームパッド（Z/Enter/Space = a、X/Esc = b）
  audio.js            効果音とBGM（コードで合成）
  gate.js             ログイン画面
  data/
    maps.js   1288行  地図 35枚（★あとで詳しく）
    species.js / species_more.js   ガオン 153種の 数値・進化・おぼえる技
    monsprite.js 806行  ガオンの絵を パーツから 組み立てる（64x64・6階調）
    monhand.js   289行  手で うった ガオンの絵
    monpix.js           手描きの絵から おこした ドット絵（tools/pixelize.js の 出力先）
    monart.js           上の3つを まとめて 呼び出す入口
    charart.js   489行  人の絵（32x40・2頭身）を その場で 組み立てる
    looks.js            人の 見た目の 名前（髪型・服の色など）
    moves.js / items.js / types.js   技・どうぐ・タイプ相性
api/                  とうろく・ログイン・クラウド保存（Vercel の関数）
tools/                かいはつ用スクリプト（★2. と 5. を見てください）
d3/                   3Dの ためしがき（本編とは 別物。今は使っていません）
shots/                かいはつ中の スクリーンショット置き場（git には 入れていません）
```

---

## 2. データはどこ？

| 何 | どこ | かたち |
|---|---|---|
| **地図（35枚）** | `src/data/maps.js` | `MAPS.村 = { name, kind, sets, rows:[...], warps, npcs, signs, items }` |
| **地図の地形** | 同上の `rows` | 1文字＝1マスの 文字列の配列。`rows[y][x]` |
| **ガオンの数値** | `src/data/species.js`, `species_more.js` | 5つのステータス・タイプ・進化・技 |
| **ガオンの絵** | `monsprite.js`（組み立て）/ `monhand.js`（手打ち）/ `monpix.js`（絵から変換） | 64x64・6階調 |
| **人の絵** | `src/data/charart.js` | 32x40・2頭身。髪型20種＋前髪・スカート・白衣・帽子 |
| **技・どうぐ・タイプ** | `src/data/moves.js`, `items.js`, `types.js` | |
| **色セット（パレット）** | `src/gfx.js` の 上のほう | 1セット＝4色（GBカラー風）。`G.use("grass")` で 切り替え |
| **セーブ** | 端末は localStorage、クラウドは Vercel Blob（`api/save.js`） | 手元では `.devdata/` に たまる |

### 地図の rows に つかう文字

| 文字 | 意味 | 通れる |
|---|---|---|
| `,` | くさ地（地面。町では `sets` で 砂などに 変えられる） | ○ |
| `.` | 道 | ○ |
| `"` | たかい くさ（ガオンが 出る） | ○ |
| `F` | 花 | ○ |
| `~` | すな | ○ |
| `T` | 木 | × |
| `R` | 丸い岩 | × |
| `M` | がけ（上に 地面、下に かべ） | × |
| `L` | だんさ（**下へ 飛びおりるだけ** 通れる） | 一方通行 |
| `H` | かいだん | ○ |
| `W` | 水（池・川。まわりに 石わくが 自動で つく） | × |
| `=` | さく | × |
| `S` `s` | かんばん | × |
| `C` `X` | ほらあなの ゆか / かべ | ○ / × |
| `#` `w` `r` `D` | かべ・やね・ドア | ドアだけ ○ |

- 通れるかどうかは `src/tiles.js` の `SOLID` が 正。**ここを 直したら 判定も 変わります**
- `ENCOUNTER`（`"` と `C`）の マスで ガオンが 出ます
- `sets: { ",": "sand", r: "roofBlue" }` のように 地図ごとに 色を 変えられます

---

## 3. 描画の決まり（さわる前に 必ず）

- 見た目の座標は **320×288**（ゲームボーイの2倍）。ただし `gfx.js` の `AS = 2` で
  canvas の 中身は **640×576** で 描いています。`ctx.setTransform(AS,0,0,AS,0,0)`
- そのため **絵を作る canvas は すべて AS倍の 大きさ**で 作り、`G.draw` は `img.width/AS` で 出します
- 1マスは 見た目16px＝中身32px。タイルを 描く `Pixel`（`p`）には 2種類のAPIがあります
  - `p.f / p.fbox / p.fdither / p.fnoise / p.fcorner` … **32分割**の 座標（昔からの 書き方）
  - `p.d / p.dbox / p.ddither / p.dnoise` … **本当のドット**の 座標。`p.N`（=64）が 1マスの幅
- `mask` は となりに 同じ仲間が いるか の 8ビット
  **1=上 2=右 4=下 8=左 16=右上 32=右下 64=左下 128=左上**
- `p.ground` は その地図の 地面パレット名。角を 丸めるときの 外側の色に つかいます
- タイルの絵は `tileFor()` で キャッシュされます。キーに `mask`・`variant`・位置・`ground` が
  入っているので、**新しく 見た目を 変える要素を 足したら キーにも 足す**こと（tiles.js 703行あたり）

---

## 4. 動作確認のしかた

```bash
node serve.js
```

ブラウザで <http://localhost:5179>。開発用に こんな 出口を つけてあります。

- `window.VM`（**localhost のときだけ** 出ます）… `VM.world`（フィールド）, `VM.battle`, `VM.setWorld()`, `VM.steps(回数, ms)`
- `VM.world.enter(地図id, x, y, "down")` で すきな場所へ 飛べます
- `POST /devshot` に `{name, png}`（dataURL）を 送ると `shots/<name>.png` に 保存されます

画面を 確認する ときの ひな形（DevTools のコンソールで）:

```js
VM.setWorld();
VM.world.enter("route5", 7, 8, "down");
VM.steps(10, 16);
```

---

## 5. 地形をつくる道具（tools/map/）

みち7本と 枝分かれ8エリアの 地形は **自動生成**です。手で書きかえるより
生成しなおす ほうが 安全です。

```bash
node tools/map/rebuildRoutes.js   # route1〜7 の rows を つくりなおす
node tools/map/rebuildAreas.js    # いりえ・さばく・もり・ほらあな・かわ・くも・ひのやま・ほしのおか
node tools/map/checkmaps.mjs      # ★かならず 最後に。地図の しらべもの
```

- 種（seed）は 固定なので、**同じ地形が 何度でも 出ます**（＝流し直しても 差分ゼロ）
- `checkmaps.mjs` は 横はば・ワープ先・かんばん/おとしもの/人の マス・
  **入口から ぜんぶに 歩いて いけるか** を 調べます。`maps ok` が 出れば OK
- `tools/map/terrainGen.js` が 本体。テーマの 意味:
  `water`(川と池の数) `rock`(岩) `grass`(たかい草) `sand`(すな) `grove`(木のかたまり)
  `fence`(さく) `flower`(花) `border`(まわりの かべの文字) `floor`(地面の文字)
- 地形の 順番が だいじ: **水 → 飾り（岩・草・砂・木）→ 水をととのえる → 入口を掘る → 小さい水を消す**
  （飾りが 水を 上書きしないよう `blob()` で 守っています）

絵の道具:

```bash
node tools/addpix.js <json> "ガオンの なまえ"   # 手描き→ドット を monpix.js に 追加
```
`tools/pixelize.js` は ブラウザで 絵を 64x64 の ドットに 変える 関数です。

---

## 6. ハマりどころ（実際に ハマったもの）

1. **改行コード**: `src/*.js` は CRLF です。複数行の 文字列置換をするときは
   いったん `.replace(/\r\n/g,"\n")` で そろえてから 直してください
2. **変数の かぶり**: `tiles.js` には モジュール直下に `const N = 1`（上のビット）が あります。
   関数の中で `const N = p.N`（=64）と 書くと **maskの判定が 全部おかしくなります**。
   水の白い線バグの 原因は これでした。別名 `N1/E1/S1/W1` を つかってください
3. **maps.js への 書きこみ**: 昔の スクリプトは 古い `rows:` を 消さずに 前へ 足していて、
   **後ろの 古いほうが 勝つ**ため 見た目が 変わりませんでした。
   `tools/map/rebuildRoutes.js` は 消してから 入れる 作りに なっています
4. **タイルのキャッシュ**: 見た目を 変えたのに 反映されない ときは
   `tileFor()` の キー（tiles.js 703行あたり）に その要素が 入っているか 見てください
5. **ほらあなの中に 草**: 入口を掘る処理が `","` を 直書きしていたのが 原因。
   いまは その地図の `floor` を つかいます
6. ブラウザのタブが 裏に いると requestAnimationFrame が 止まります。
   自動で 動かすときは `VM.steps()` で コマを 進めてください

---

## 7. 公開のしくみ

| | |
|---|---|
| 本番URL | <https://midori-no-shima.vercel.app/> |
| GitHub | <https://github.com/YANOKEN10/midori-no-shima>（ブランチ `master`） |
| Vercel | プロジェクト `midori-no-shima`。`git push` で 自動デプロイ |
| 記録の保管庫 | Vercel Blob `midori-no-shima-data`（東京・非公開） |
| 署名の鍵 | 環境変数 `AUTH_SECRET` |

コマンドで 出すとき（このパソコンの 例）:

```bash
node "I:/Claude code/bomb-battle/node_modules/vercel/dist/index.js" deploy --prod --yes --cwd "I:/Claude code/voraz-monsters"
```

> **注意**: いまは 手元のコミットが GitHub より 先に 進んでいることがあります。
> `git status` で `ahead` が 出ていたら `git push` してください（本番は 上のコマンドで 直接出しています）。

---

## 8. さいきん やったこと / つぎの候補

さいきん:
- 池・川の まわりに 石わくを つけ、水の 中に ブロックが 残る バグを 直した
- ほらあなの 中に 木が はえていたのを 岩の はしらに した
- たたかいの 下の枠を 「〜は どうする？」の 文に した
- 人の絵を 32x40・2頭身に して 髪型・前髪・スカート・白衣を 足した
- がけ／かいだん／さく／二色の 草地／丸い岩 を 足した

つぎの候補（まだ やっていません）:
- **ひのやま（volcano）が さばくと 同じ見た目**。溶岩色の 地面と 赤黒い岩の パレットを 足したい
- `mount1` `mount2`（やまみち）は まだ 手書きのまま。自動生成に 入れていない
- 8つの町は ひな形から 作ったので、町ごとの 作りこみが うすい
