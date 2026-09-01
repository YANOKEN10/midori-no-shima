# ガオン・ワールド 全マップV4移行台帳

更新日: 2026-09-01

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
| village | 風鳴り谷 | 屋外 | verified |
| hut | かぜの丸太ごや | 屋内 | implemented_unverified |
| elder | 谷守の共同ロッジ | 屋内 | implemented_unverified |
| mount1 | やまみち | 屋外 | implemented_unverified |
| mount2 | やまの奥地 | 屋外 | implemented_unverified |
| gate | 山の出口 | 屋外 | implemented_unverified |
| station | 山旅の共同ロッジ | 屋内 | pending |
| clothes1 | ふくや ウミカゼ | 屋内 | pending |
| salon | びよういん スナカゼ | 屋内 | pending |
| clothes2 | ブティック イシヅカ | 屋内 | pending |
| shop | ラグ・ショップ | 屋内 | pending |
| harbor | アーレ湖港 | 屋外 | implemented_unverified |
| sand | 陽だまり棚田 | 屋外 | implemented_unverified |
| forest | モミ響きの森 | 屋外 | implemented_unverified |
| stone | 石笛の峡谷 | 屋外 | pending |
| aqua | 水鏡の入江 | 屋外 | pending |
| sky | 白嶺のシャレー | 屋外 | pending |
| flame | 夕映え高原 | 屋外 | pending |
| route1 | 湖沿いの道 | 屋外 | implemented_unverified |
| route2 | 乾いた牧道 | 屋外 | implemented_unverified |
| route3 | モミの回廊 | 屋外 | implemented_unverified |
| route4 | 石切りの道 | 屋外 | pending |
| route5 | 水鏡の桟道 | 屋外 | pending |
| route6 | 白嶺の石段 | 屋外 | pending |
| route7 | 星環鉄道沿い | 屋外 | pending |
| galaxy | 星環の都 | 屋外 | pending |
| inlet | アーレ湖の入江 | 屋外 | pending |
| desert | 風化石の牧草地 | 屋外 | pending |
| deepforest | 樹海の薬草道 | 屋外 | pending |
| cavern | 氷河洞 | 洞窟 | pending |
| river | アーレ源流 | 屋外 | pending |
| cloud | 雲上の尾根 | 屋外 | pending |
| volcano | 夕焼け岩稜 | 屋外 | pending |
| starhill | 星見の丘 | 屋外 | pending |
| arena | 七つの谷 山岳祭 | 屋内 | pending |
| hut2 | 村の家 | 屋内 | pending |

## 証拠欄

各マップについて、画像パス、衝突マスク定義、ワープ試験、PC撮影、スマホ撮影をコミット単位で追記する。

### 第1群（実装済み・操作検証待ち）

- 画像: `assets/world-v4/wind-cabin-interior.png`, `valley-lodge-interior.png`, `mountain-trail.png`, `mountain-sanctuary.png`, `mountain-gate.png`
- 衝突マスク: `src/data/worldV4.js` の各マップ専用関数
- 静的接続検査: 全36マップ `errors: 0`, `failed: 0`
- 回帰: リーフ・コンパス PC/スマホ `errors: 0`, 戦闘背景 PC/スマホ `errors: 0`
- 描画: Chromiumデスクトップ5画面、Pixel 5エミュレーション5画面の読込と撮影に成功
- 未検証: 5マップ全ワープのブラウザ操作、物理iPhone/Android、ホーム画面PWA
