# ガオン・ワールド 全マップV4移行台帳

更新日: 2026-09-02

## 2026-09-04 画面崩れ・移動不能の再調査

- in_progress: 小数座標のセーブ復帰、画像失敗時の旧マスク露出、移動操作を再検証。
- implemented_unverified: tileAtで小数を整数化し非有限座標を拒否。一枚絵では旧ランドマーク衝突を無効化。
- implemented_unverified: 全36背景の同時読込を止め、訪問時読込と最大3回の再試行を追加。未読込時は旧マップを描画しない。
- 前回の描画テストは移動・衝突の正しさを証明していない。実機iOS/PWAと画像に合わせた全衝突マスクは未検証。
- 自動単体テスト: 小数/無効座標、遅延読込、画像失敗後再試行、描画復帰、外周黒マット除去と内部黒の保持に合格。
- ブラウザ操作: Desktopキー斜め入力、モバイル相当Pointerスティック斜め入力で両軸の移動を確認。小数座標で再入場後も座標一致、pageerror 0。
- 証拠: `tools/verifyWorldRecovery.cjs`, `tools/verifyMovementRecovery.cjs`, `artifacts/movement-recovery.json`。
- コンパス/戦闘: Desktopおよびモバイル相当の既存テストでエラー0。
- 主人公画像12コマの外周はRGBA(0,0,0,255)。外周と連結した黒のみ描画時に透過。
- 未検証: 物理iPhone、インストール済みPWA、ユーザー本人のセーブ、全36枚の視覚と衝突領域の一致。今回のテストはこれらの合格を意味しない。

## 2026-09-02 移動不具合

- Desktop Chrome/CDP: `village`で主人公が y=19 から y=21.83938 へ移動。
- Desktop Chrome/CDP: 待機後、画面内のNPC 3人すべての座標変化を確認。
- iOS/PWA: アナログスティックへTouch Events予備経路を追加。物理端末は未確認。
- キャッシュ識別子を `20260902-movement-v5` へ更新。

## 共通の完了条件

- マップ固有の一枚絵を個別生成し、プロジェクト内へ保存する。
- 道・通常草原・濃い草むら・橋・玄関を歩行可能領域として個別指定する。
- 建物、柵、樹木、岩壁、水面を衝突領域として個別指定する。
- 野生ガオンは濃い草むらだけで出現する。
- 建物入口は歩行＋暗転、出口は暗転復帰を通して接続する。
- PCとスマホ表示、主要ワープ、リーフ・コンパス、戦闘復帰を直接検証する。

## 移行状況

| ID | 表示名 | 種別 | 状態 |
|---|---|---|---|
| village | 風鳴り谷 | 屋外 | automated_verified |
| hut | かぜの丸太ごや | 屋内 | automated_verified |
| elder | 谷守の共同ロッジ | 屋内 | automated_verified |
| mount1 | やまみち | 屋外 | implemented_unverified |
| mount2 | やまの奥地 | 屋外 | implemented_unverified |
| gate | 山の出口 | 屋外 | implemented_unverified |
| station | 山旅の共同ロッジ | 屋内 | implemented_unverified |
| clothes1 | ふくや ウミカゼ | 屋内 | implemented_unverified |
| salon | びよういん スナカゼ | 屋内 | implemented_unverified |
| clothes2 | ブティック イシヅカ | 屋内 | implemented_unverified |
| shop | ラグ・ショップ | 屋内 | implemented_unverified |
| harbor | アーレ湖港 | 屋外 | implemented_unverified |
| sand | 陽だまり棚田 | 屋外 | implemented_unverified |
| forest | モミ響きの森 | 屋外 | implemented_unverified |
| stone | 石笛の峡谷 | 屋外 | implemented_unverified |
| aqua | 水鏡の入江 | 屋外 | implemented_unverified |
| sky | 白嶺のシャレー | 屋外 | implemented_unverified |
| flame | 夕映え高原 | 屋外 | implemented_unverified |
| route1 | 湖沿いの道 | 屋外 | implemented_unverified |
| route2 | 乾いた牧道 | 屋外 | implemented_unverified |
| route3 | モミの回廊 | 屋外 | implemented_unverified |
| route4 | 石切りの道 | 屋外 | implemented_unverified |
| route5 | 水鏡の桟道 | 屋外 | implemented_unverified |
| route6 | 白嶺の石段 | 屋外 | implemented_unverified |
| route7 | 星環鉄道沿い | 屋外 | implemented_unverified |
| galaxy | 星環の都 | 屋外 | implemented_unverified |
| inlet | アーレ湖の入江 | 屋外 | implemented_unverified |
| desert | 風化石の牧草地 | 屋外 | implemented_unverified |
| deepforest | 樹海の薬草道 | 屋外 | implemented_unverified |
| cavern | 氷河洞 | 洞窟 | implemented_unverified |
| river | アーレ源流 | 屋外 | implemented_unverified |
| cloud | 雲上の尾根 | 屋外 | implemented_unverified |
| volcano | 夕焼け岩稜 | 屋外 | implemented_unverified |
| starhill | 星見の丘 | 屋外 | implemented_unverified |
| arena | 七つの谷 山岳祭 | 屋内 | implemented_unverified |
| hut2 | 村の家 | 屋内 | implemented_unverified |

## 証拠欄

各マップについて、画像パス、衝突マスク定義、ワープ試験、PC撮影、スマホ撮影をコミット単位で追記する。

### 第1群（実装済み・操作検証待ち）

- 画像: `assets/world-v4/wind-cabin-interior.png`, `valley-lodge-interior.png`, `mountain-trail.png`, `mountain-sanctuary.png`, `mountain-gate.png`
- 衝突マスク: `src/data/worldV4.js` の各マップ専用関数
- 静的接続検査: 全36マップ `errors: 0`, `failed: 0`
- 回帰: リーフ・コンパス PC/スマホ `errors: 0`, 戦闘背景 PC/スマホ `errors: 0`
- 描画: Chromiumデスクトップ5画面、Pixel 5エミュレーション5画面の読込と撮影に成功
- 未検証: 5マップ全ワープのブラウザ操作、物理iPhone/Android、ホーム画面PWA

### 第3群（石笛・水鏡地域）

- 画像: `assets/world-v4/stone-whistle-gorge.png`, `stonecutter-road.png`, `mirrorwater-cove.png`, `mirrorwater-boardwalk.png`
- 衝突マスク: `src/data/worldV4.js` の `stoneTownRows`, `stoneRoadRows`, `mirrorTownRows`, `mirrorBoardwalkRows`
- 静的接続検査: 全36マップ `errors: 0`, `failed: 0`
- 配置検査: 屋外26マップ `failures: 0`
- 回帰: リーフ・コンパス PC/スマホ `errors: 0`, 戦闘背景 PC/スマホ `errors: 0`, 環境画像 `errors: 0`
- 未検証: 4マップ全ワープの手動操作、物理iPhone/Android、ホーム画面PWA

### 第4群（白嶺地域）

- 画像: `assets/world-v4/white-ridge-chalet.png`, `white-ridge-steps.png`
- 衝突マスク: `src/data/worldV4.js` の `snowTownRows`, `snowStepsRows`
- 静的接続検査: 全36マップ `errors: 0`, `failed: 0`
- 配置検査: 屋外26マップ `failures: 0`
- 回帰: リーフ・コンパス PC/スマホ `errors: 0`, 戦闘背景 PC/スマホ `errors: 0`, 環境画像 `errors: 0`
- 未検証: 2マップ全ワープの手動操作、物理iPhone/Android、ホーム画面PWA

### 第5群（夕映え・星環地域）

- 画像: `assets/world-v4/sunset-glow-highlands.png`, `star-ring-railway.png`, `star-ring-capital.png`
- 衝突マスク: `src/data/worldV4.js` の `sunsetTownRows`, `railwayRows`, `capitalRows`
- 静的接続検査: 全36マップ `errors: 0`, `failed: 0`
- 配置検査: 屋外26マップ `failures: 0`
- 回帰: リーフ・コンパス PC/スマホ `errors: 0`, 戦闘背景 PC/スマホ `errors: 0`, 環境画像 `errors: 0`
- 未検証: 3マップ全ワープの手動操作、物理iPhone/Android、ホーム画面PWA

### 第6群（入江・牧草地・薬草道）

- 画像: `assets/world-v4/aare-lake-cove.png`, `weathered-stone-pasture.png`, `deep-forest-herb-trail.png`
- 衝突マスク: `src/data/worldV4.js` の `sideAreaRows`
- 接続: 西端から各親マップへ往復し、橋・道・草地を自由移動可能
- 出現: 濃い草むらだけを `"` として指定
- 未検証: 自動検査、ブラウザ操作、物理iPhone/Android、ホーム画面PWA

### 第7群（氷河洞・源流・雲上・岩稜・星見）

- 画像: `assets/world-v4/glacier-cave.png`, `aare-river-source.png`, `cloudtop-ridge.png`, `sunset-volcanic-ridge.png`, `stargazer-hill.png`
- 衝突マスク: `src/data/worldV4.js` の `glacierCaveRows`, `sideAreaRows`
- 接続: 西端から各親マップへ往復。橋は通行可、崖は不可、石段のみ高低差を接続
- 出現: 屋外4マップは濃い草むらのみ。氷河洞は洞窟床の既存遭遇設定を維持
- 未検証: 自動検査、ブラウザ操作、物理iPhone/Android、ホーム画面PWA

### 第8群（全室内）

- 画像: `assets/world-v4/mountain-travel-lodge.png`, `umikaze-clothier.png`, `sunakaze-salon.png`, `ishizuka-boutique.png`, `rag-shop-interior.png`, `village-family-cabin.png`, `seven-valleys-arena.png`
- 衝突マスク: `src/data/worldV4.js` の `interiorRows`, `arenaRows`
- 入口: 全室内を南中央に統一し、既存の暗転遷移と台詞・買物・美容・大会イベントを維持
- 未検証: 自動検査、ブラウザ操作、物理iPhone/Android、ホーム画面PWA
