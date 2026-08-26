// ============================================================
//  マップ（1もじ＝1マス）
//   . みち   , くさ   " たかいくさ   F はな   ~ すな   L がけ
//   T き     R いわ   W みず   = さく   S かんばん   s かんばん(まちなか)
//   r やね   # かべ   w まど   D ドア   u かいだん
//   C ほらあなの ゆか  X ほらあなの かべ
//   f ゆか   g カーペット  x でぐち  c カウンター  b ほんだな
//   t つくえ  B ベッド  K かいふくき  P パソコン  V しょくぶつ
// ============================================================

export const MAPS = {
  /* ============ はじまりの村 ============ */
  town1: {
    name: "はじまりの村",
    kind: "out",
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TT,,,,,,,,,,,,,T",
      "T,,rrrr,,rrrr,,T",
      "T,,rrrr,,rrrr,,T",
      "T,,#wD#,,#Dw#,,T",
      "T,,,,,,,,,,,,,,T",
      "T,F,,,,,,,,,,F,T",
      "T,S,,,,,,,,,,,,T",
      "T,,,,rrrrr,,,,,T",
      "T,,,,rrrrr,,,,,T",
      "T,,,,#wDw#,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTTTTTTTTTTT",
    ],
    warps: [
      { x: 5, y: 4, to: "home", tx: 4, ty: 7 },
      { x: 10, y: 4, to: "rivalhome", tx: 4, ty: 7 },
      { x: 7, y: 10, to: "lab", tx: 6, ty: 9 },
      { x: 6, y: 0, to: "route1", tx: 7, ty: 20, edge: 1 },
      { x: 7, y: 0, to: "route1", tx: 7, ty: 20, edge: 1 },
    ],
    signs: [
      { x: 2, y: 7, text: ["はじまりの村", "ちいさな まちだけど", "ぼうけんは ここから はじまる。"] },
    ],
    npcs: [
      {
        x: 3, y: 12, dir: "down", look: "oldman", name: "おじいさん",
        talk: ["たかい くさの なかには", "やせいの モンスターが すんでおる。", "ボールが ないと あぶないぞ。"],
      },
      {
        x: 12, y: 6, dir: "left", look: "girl", name: "おんなのこ",
        talk: ["きたに いくと みなとまちだよ。", "ジムの リーダーは とっても つよいの。"],
      },
    ],
  },

  /* ============ じぶんの いえ ============ */
  home: {
    name: "じぶんの いえ",
    kind: "in",
    rows: [
      "########",
      "#tfffPf#",
      "#ffffff#",
      "#fBfffV#",
      "#ffffff#",
      "#ffffff#",
      "#ffffff#",
      "#fffxff#",
      "########",
    ],
    warps: [{ x: 4, y: 7, to: "town1", tx: 5, ty: 5 }],
    npcs: [
      {
        x: 2, y: 5, dir: "down", look: "girl", name: "ママ",
        talk: ["いってらっしゃい！", "はかせが よんでいたわよ。", "きたの けんきゅうじょへ おいき。"],
        heal: true,
      },
    ],
    objects: [
      { x: 5, y: 1, text: ["パソコンだ。", "…いまは つかえないみたい。"] },
      { x: 3, y: 3, text: ["ふかふかの ベッドだ。"] },
    ],
  },

  rivalhome: {
    name: "ライバルの いえ",
    kind: "in",
    rows: [
      "########",
      "#bffftf#",
      "#ffffff#",
      "#ffVfff#",
      "#ffffff#",
      "#ffffff#",
      "#ffffff#",
      "#fffxff#",
      "########",
    ],
    warps: [{ x: 4, y: 7, to: "town1", tx: 10, ty: 5 }],
    npcs: [
      {
        x: 3, y: 4, dir: "down", look: "girl", name: "おばさん",
        talk: ["うちの こは もう でかけたわ。", "あなたに まけたくないって", "いってたわよ。"],
      },
    ],
  },

  /* ============ けんきゅうじょ ============ */
  lab: {
    name: "はかせの けんきゅうじょ",
    kind: "in",
    rows: [
      "############",
      "#bbbbbbbbbb#",
      "#ffffffffff#",
      "#fftffttfff#",
      "#ffffffffff#",
      "#ffcccccfff#",
      "#ffffffffff#",
      "#ffVffffVff#",
      "#ffffffffff#",
      "#fffffxffff#",
      "############",
    ],
    warps: [{ x: 6, y: 9, to: "town1", tx: 7, ty: 11 }],
    npcs: [
      {
        x: 5, y: 4, dir: "down", look: "prof", name: "オーキ…もとい ハカセ",
        script: "starter",
        talk: ["おお、よく きたな！", "モンスターは きみを まっておる。"],
      },
      {
        x: 9, y: 7, dir: "left", look: "boy", name: "じょしゅ",
        talk: ["モンスターは たいりょくが へると", "ボールで つかまえやすく なるんだ。"],
      },
    ],
  },

  /* ============ 1ばんどうろ ============ */
  route1: {
    name: "1ばんどうろ",
    kind: "out",
    rows: [
      "TTTT,,,,,,TTTTTT",
      "TT,,,,,,,,,,,,TT",
      "T,,\"\"\",,,\"\"\",,,T",
      "T,,\"\"\",,,\"\"\",,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TLLLLLLL,,LLLLLT",
      "T,,,,,,,,,,,,,,T",
      "T,\"\"\"\"\",,,,,,,,T",
      "T,\"\"\"\"\",,,,,,,,T",
      "T,\"\"\"\"\",,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,\"\"\"\"\",,T",
      "T,,,,,,,\"\"\"\"\",,T",
      "T,,,,,,,\"\"\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "T,,S,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTT,,TTTTTTT",
    ],
    warps: [
      { x: 7, y: 20, to: "town1", tx: 7, ty: 1, edge: 1 },
      { x: 8, y: 20, to: "town1", tx: 7, ty: 1, edge: 1 },
      { x: 4, y: 0, to: "town2", tx: 9, ty: 14, edge: 1 },
      { x: 5, y: 0, to: "town2", tx: 9, ty: 14, edge: 1 },
      { x: 6, y: 0, to: "town2", tx: 9, ty: 14, edge: 1 },
    ],
    signs: [
      { x: 3, y: 17, text: ["1ばんどうろ", "はじまりの村 ⇔ みなとまち"] },
    ],
    ledges: true,
    items: [{ x: 13, y: 4, item: "モンスターボール", flag: "r1ball" }],
    npcs: [
      {
        x: 4, y: 12, dir: "right", look: "boy", name: "たんぱんこぞう ケン",
        trainer: { party: [["ネズミン", 5]], money: 200 },
        talk: ["おれと しょうぶだ！"],
        win: ["つよいな…！"],
        after: ["モンスターは レベルが あがると", "あたらしい わざを おぼえるんだ。"],
      },
      {
        x: 11, y: 7, dir: "down", look: "girl", name: "むしとり シオリ",
        trainer: { party: [["ムシコロ", 4], ["トリッピ", 5]], money: 240 },
        talk: ["むしって かわいいでしょ？", "しょうぶ しよう！"],
        win: ["まだまだ つかまえるわ！"],
        after: ["たかい くさに はいると", "モンスターが とびだしてくるよ。"],
      },
    ],
    enc: {
      rate: 14,
      list: [
        ["ネズミン", 3, 5, 16], ["トリッピ", 3, 5, 14], ["ムシコロ", 2, 4, 12],
        ["マルミィ", 3, 5, 12], ["ウサポン", 3, 5, 10], ["タネコロ", 3, 5, 10],
        ["ハナビィ", 3, 5, 8], ["ムシリン", 2, 4, 8], ["チョウマユ", 2, 4, 6],
        ["ビリタマ", 4, 6, 5], ["コイヌン", 4, 6, 5], ["リーフィン", 4, 5, 2],
        ["ピリット", 4, 6, 2],
      ],
    },
  },

  /* ============ みなとまち ============ */
  town2: {
    name: "みなとまち",
    kind: "out",
    sets: { r: "roofBlue" },      // うみの まちは あおい やね
    rows: [
      "TTTTTTTTT,,TTTTTTTT",
      "T,,,,,,,,,,,,,,,,,T",
      "T,rrrrr,,,,,rrrrr,,",
      "T,rrrrr,,,,,rrrrr,,",
      "T,#wDw#,,,,,#wDw#,,",
      "T,,,,,,,,,,,,,,,,,W",
      "T,,,,,,,,,,,,,,,,WW",
      "T,,s,,,,,,,,,,,,,WW",
      "T,,,,,rrrrrrr,,,,WW",
      "T,,,,,rrrrrrr,,,,,W",
      "T,,,,,##wDw##,,,,,W",
      "T,,,,,,,,,,,,,,,,,W",
      "T,,,,,,,,,,,,,,,,,W",
      "T,,,,,,,,,,,,,,,,,W",
      "TTTTTTTT,,TTTTTTTTT",
    ],
    warps: [
      { x: 4, y: 4, to: "center", tx: 5, ty: 8, back: { map: "town2", x: 4, y: 5 } },
      { x: 14, y: 4, to: "mart", tx: 4, ty: 6, back: { map: "town2", x: 14, y: 5 } },
      { x: 9, y: 10, to: "gym1", tx: 5, ty: 12 },
      { x: 8, y: 14, to: "route1", tx: 5, ty: 1, edge: 1 },
      { x: 9, y: 14, to: "route1", tx: 5, ty: 1, edge: 1 },
      { x: 9, y: 0, to: "route2", tx: 4, ty: 17, edge: 1 },
      { x: 10, y: 0, to: "route2", tx: 4, ty: 17, edge: 1 },
    ],
    signs: [
      { x: 3, y: 7, text: ["みなとまち", "うみかぜと モンスターの まち", "◀ センター　　ショップ ▶"] },
    ],
    npcs: [
      {
        x: 12, y: 12, dir: "down", look: "sailor", name: "せんいん",
        talk: ["うみの むこうには もっと おおくの", "モンスターが いるらしいぜ。"],
      },
      {
        x: 6, y: 12, dir: "up", look: "boy", name: "おとこのこ",
        talk: ["ジムリーダーの ミオさんは", "みずタイプの つかいてだよ。", "くさや でんきが きくかも。"],
      },
      {
        x: 14, y: 8, dir: "left", look: "hiker", name: "やまおとこ",
        talk: ["きたの ほらあなは まっくらだ。", "つよい モンスターを つれてけよ。"],
      },
    ],
  },

  /* ============ モンスターセンター（どのまちでも おなじ） ============ */
  center: {
    name: "モンスターセンター",
    kind: "in",
    sets: { c: "machine" },
    rows: [
      "##########",
      "#KffffffP#",
      "#ccccffff#",
      "#ffffffff#",
      "#ffVffVff#",
      "#ffffffff#",
      "#ffffffff#",
      "#ffffffff#",
      "#fffxxfff#",
      "##########",
    ],
    warps: [
      { x: 4, y: 8, to: "@back" },
      { x: 5, y: 8, to: "@back" },
    ],
    npcs: [
      {
        x: 2, y: 3, dir: "down", look: "nurse", name: "おねえさん",
        talk: ["モンスターセンターへ ようこそ！"],
        healAll: true,
      },
      {
        x: 7, y: 6, dir: "left", look: "boy", name: "たびびと",
        talk: ["ここで やすめば", "みんな げんきに なるよ。"],
      },
    ],
    objects: [{ x: 8, y: 1, text: ["ぼうけんの きろくを つけられる パソコンだ。"], pc: true }],
  },

  /* ============ ショップ ============ */
  mart: {
    name: "フレンドリィショップ",
    kind: "in",
    rows: [
      "########",
      "#ccffff#",
      "#ffffff#",
      "#ffbbff#",
      "#ffffff#",
      "#ffffff#",
      "#fffxff#",
      "########",
    ],
    warps: [{ x: 4, y: 6, to: "@back" }],
    npcs: [
      {
        x: 2, y: 2, dir: "down", look: "clerk", name: "てんいん",
        talk: ["いらっしゃいませ！"],
        shop: true,
      },
      {
        x: 6, y: 4, dir: "left", look: "girl", name: "おきゃく",
        talk: ["キズぐすりは たくさん", "もっておいた ほうが いいわ。"],
      },
    ],
  },

  /* ============ みなとジム ============ */
  gym1: {
    name: "みなとジム",
    kind: "in",
    sets: { g: "water" },
    rows: [
      "##########",
      "#ffffffff#",
      "#ffgggfff#",
      "#ffgggfff#",
      "#ffffffff#",
      "#WWffffWW#",
      "#WWffffWW#",
      "#ffffffff#",
      "#ffffffff#",
      "#WWffffWW#",
      "#WWffffWW#",
      "#ffffffff#",
      "#fffxffff#",
      "##########",
    ],
    warps: [{ x: 4, y: 12, to: "town2", tx: 9, ty: 11 }],
    npcs: [
      {
        x: 4, y: 2, dir: "down", look: "leader1", name: "ジムリーダー ミオ",
        trainer: { party: [["アワミィ", 12], ["ウズマリン", 14]], money: 1400, leader: "みなとバッジ" },
        talk: ["わたしは みなとジムの ミオ。", "みずの ながれの ように", "しなやかに たたかうわ。"],
        win: ["みごとな たたかいだったわ。", "「みなとバッジ」を うけとって！"],
        after: ["バッジが あれば", "きたの ほらあなにも いけるはずよ。"],
      },
      {
        x: 2, y: 8, dir: "right", look: "sailor", name: "ジムトレーナー",
        trainer: { party: [["アワミィ", 10], ["ネズミン", 10]], money: 400 },
        talk: ["リーダーには あわせないぜ！"],
        win: ["やるじゃないか。"],
        after: ["みずタイプには でんきや くさが きく。"],
      },
      {
        x: 7, y: 4, dir: "left", look: "girl", name: "ジムトレーナー",
        trainer: { party: [["トリッピ", 11]], money: 350 },
        talk: ["ここは とおさないよ！"],
        win: ["つよい…！"],
        after: ["がんばってね。"],
      },
    ],
  },

  /* ============ 2ばんどうろ ============ */
  route2: {
    name: "2ばんどうろ",
    kind: "out",
    rows: [
      "TTTTTTRRRRTTTTTT",
      "TT,,,,RRRR,,,,TT",
      "T,,,,,,DD,,,,,,T",
      "T,,\"\"\",,,,\"\"\",,T",
      "T,,\"\"\",,,,\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,RR,,,,,,RR,,T",
      "T,,,,,,,,,,,,,,T",
      "T,\"\"\"\"\"\",,,,,,,T",
      "T,\"\"\"\"\"\",,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TLLLLLL,,LLLLLLT",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,\"\"\"\",,T",
      "T,,S,,,,,\"\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "TTT,,TTTTTTTTTTT",
    ],
    warps: [
      { x: 3, y: 17, to: "town2", tx: 9, ty: 1, edge: 1 },
      { x: 4, y: 17, to: "town2", tx: 9, ty: 1, edge: 1 },
      { x: 7, y: 2, to: "cave", tx: 10, ty: 13 },
      { x: 8, y: 2, to: "cave", tx: 11, ty: 13 },
    ],
    signs: [{ x: 3, y: 15, text: ["2ばんどうろ", "きたに ひかりの ほらあな"] }],
    ledges: true,
    items: [{ x: 2, y: 6, item: "いいキズぐすり", flag: "r2pot" }],
    npcs: [
      {
        x: 10, y: 5, dir: "left", look: "hiker", name: "やまおとこ タツ",
        trainer: { party: [["イシゴロ", 13], ["ツチノコ", 13]], money: 520 },
        talk: ["やまの おとこは いわの ように かたい！"],
        win: ["くずれたか…"],
        after: ["じめんタイプには くさや みずが きくぞ。"],
      },
      {
        x: 5, y: 13, dir: "up", look: "boy", name: "たんぱんこぞう ユウ",
        trainer: { party: [["ヨルネコ", 14]], money: 280 },
        talk: ["よるに つよい モンスターだぞ！"],
        win: ["まぶしい…！"],
        after: ["やみタイプは むしに よわいらしい。"],
      },
    ],
    enc: {
      rate: 14,
      list: [
        ["ネズミン", 8, 11, 8], ["トリッピ", 8, 11, 8], ["ピリット", 9, 12, 7],
        ["ツチノコ", 9, 12, 7], ["ヨルネコ", 10, 12, 6], ["キノコン", 9, 12, 7],
        ["ウリボン", 9, 13, 6], ["ボヤッコ", 9, 12, 6], ["ワンヒノ", 9, 12, 6],
        ["シズクン", 9, 12, 6], ["サカナビ", 9, 12, 5], ["ネコデン", 10, 13, 5],
        ["ハネデン", 10, 13, 5], ["ヒツジン", 10, 13, 5], ["タヌポン", 10, 13, 4],
        ["アリンコ", 9, 12, 4], ["クモッコ", 10, 13, 4], ["イシゴロ", 10, 13, 3],
        ["タキビィ", 10, 13, 3], ["カニポン", 9, 12, 5], ["ヨルドリ", 10, 13, 5],
        ["ヒバナリ", 11, 14, 3], ["コケゴロ", 10, 13, 4],
      ],
    },
  },

  /* ============ ひかりの ほらあな ============ */
  cave: {
    name: "ひかりの ほらあな",
    kind: "cave",
    rows: [
      "XXXXXXXXXXXXXXXXXXXX",
      "XCCCCCXXXXXXCCCCCCCX",
      "XCXXXCXXXXXXCXXXXXCX",
      "XCXXXCCCCCCCCXXXXXCX",
      "XCXXXXXXXXXXXXXXXXCX",
      "XCCCCCCXXXCCCCCCCCCX",
      "XXXXXXCXXXCXXXXXXXXX",
      "XCCCCCCXXXCCCCCCCCCX",
      "XCXXXXXXXXXXXXXXXCCX",
      "XCCCCCCCCCCXXXXXXCCX",
      "XXXXXXXXXXCXXXXXXCCX",
      "XCCCCCCCCCCCCCCCCCCX",
      "XCCXXXXXXXCXXXXXXXXX",
      "XCCXXXXXXXCCXXXXXXXX",
      "XXXXXXXXXXXXXXXXXXXX",
    ],
    warps: [
      { x: 10, y: 13, to: "route2", tx: 7, ty: 3 },
      { x: 11, y: 13, to: "route2", tx: 8, ty: 3 },
      { x: 1, y: 1, to: "town3", tx: 8, ty: 12, edge: 1 },
    ],
    items: [
      { x: 18, y: 9, item: "ハイパーボール", flag: "cave_ball" },
      { x: 2, y: 12, item: "げんきのかけら", flag: "cave_rev" },
    ],
    npcs: [
      {
        x: 12, y: 5, dir: "down", look: "hiker", name: "やまおとこ ゴウ",
        trainer: { party: [["イシゴロ", 16], ["ドリルモグ", 17]], money: 680 },
        talk: ["ほらあなの ぬしは おれだ！"],
        win: ["まけたか…！"],
        after: ["おくに すすめば ひのやまタウンだ。"],
      },
    ],
    enc: {
      rate: 12,
      list: [
        ["イシゴロ", 12, 16, 9], ["ツチマル", 12, 16, 8], ["イワッコ", 12, 16, 8],
        ["ヨルネコ", 13, 16, 6], ["カゲポン", 13, 17, 7], ["オバケシ", 13, 17, 6],
        ["クロネズ", 13, 17, 6], ["モグポン", 13, 17, 6], ["スナムシ", 12, 16, 6],
        ["ジリジリ", 13, 17, 5], ["ダンゴロン", 13, 17, 5], ["コオリン", 14, 18, 5],
        ["クラゲミ", 14, 18, 4], ["マグマゴ", 15, 18, 4], ["プラグン", 14, 18, 4],
        ["カセキン", 15, 19, 3], ["スミビン", 15, 19, 3], ["ドクロン", 15, 19, 3],
        ["ギガビート", 15, 17, 2], ["ホタリン", 14, 18, 4], ["ヌシガエル", 18, 20, 1],
      ],
    },
  },

  /* ============ ひのやまタウン ============ */
  town3: {
    name: "ひのやまタウン",
    kind: "out",
    rows: [
      "TTTTTTTT,,TTTTTT",
      "T,,,,,,,,,,,,,,T",
      "T,rrrrr,,,,,,,,T",
      "T,rrrrr,,rrrrr,T",
      "T,#wDw#,,rrrrr,T",
      "T,,,,,,,,#wDw#,T",
      "T,,,,,,,,,,,,,,T",
      "T,,s,,,,,,,,,,,T",
      "T,,,,,rrrrr,,,,T",
      "T,,,,,rrrrr,,,,T",
      "T,,,,,##D##,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTTTTTTTTTTT",
    ],
    warps: [
      { x: 4, y: 4, to: "center", tx: 5, ty: 8, back: { map: "town3", x: 4, y: 5 } },
      { x: 11, y: 5, to: "mart", tx: 4, ty: 6, back: { map: "town3", x: 11, y: 6 } },
      { x: 8, y: 10, to: "gym2", tx: 5, ty: 12 },
      { x: 8, y: 0, to: "cave", tx: 1, ty: 2, edge: 1 },
      { x: 9, y: 0, to: "cave", tx: 1, ty: 2, edge: 1 },
    ],
    signs: [{ x: 3, y: 7, text: ["ひのやまタウン", "やまの ねっきが つたわる まち"] }],
    npcs: [
      {
        x: 12, y: 11, dir: "down", look: "oldman", name: "ろうじん",
        talk: ["ジムを やぶった もののみが", "やまの ちょうじょうへ", "すすむことを ゆるされる。"],
      },
      {
        x: 5, y: 12, dir: "right", look: "girl", name: "おんなのこ",
        talk: ["ぬまには ヌシガエルが いるって", "おばあちゃんが いってた。"],
      },
    ],
  },

  gym2: {
    name: "かざんジム",
    kind: "in",
    sets: { g: "roof" },
    rows: [
      "##########",
      "#ffffffff#",
      "#ffgggfff#",
      "#ffgggfff#",
      "#ffffffff#",
      "#RRffffRR#",
      "#ffffffff#",
      "#ffRRRRff#",
      "#ffffffff#",
      "#RRffffRR#",
      "#ffffffff#",
      "#ffffffff#",
      "#fffxffff#",
      "##########",
    ],
    warps: [{ x: 4, y: 12, to: "town3", tx: 8, ty: 11 }],
    npcs: [
      {
        x: 4, y: 2, dir: "down", look: "leader2", name: "ジムリーダー カグラ",
        trainer: { party: [["ヒノコマ", 22], ["ボウエン", 24], ["ギガビート", 24]], money: 2600, leader: "かざんバッジ" },
        talk: ["かざんジムの カグラだ。", "もえる こころを みせてみろ！"],
        win: ["いい ほのおを もっているな。", "「かざんバッジ」を やろう！"],
        after: ["ちょうじょうで まっている やつが いる。", "いってこい。"],
      },
      {
        x: 7, y: 6, dir: "left", look: "hiker", name: "ジムトレーナー",
        trainer: { party: [["ヒノコマ", 20], ["ツチノコ", 20]], money: 800 },
        talk: ["あつさに たえられるか！"],
        win: ["みごとだ。"],
        after: ["ほのおには みずや じめんが きく。"],
      },
      {
        x: 2, y: 10, dir: "right", look: "boy", name: "ジムトレーナー",
        trainer: { party: [["デカネズ", 21], ["ライボルト", 21]], money: 840 },
        talk: ["スピードで まけない！"],
        win: ["はやい…！"],
        after: ["リーダーは 3たい つれているぞ。"],
      },
    ],
  },

  /* ============ やまの ちょうじょう ============ */
  summit: {
    name: "やまの ちょうじょう",
    kind: "out",
    rows: [
      "RRRRRRRRRRRRRRRR",
      "R~~~~~~~~~~~~~~R",
      "R~~RR~~~~~~RR~~R",
      "R~~~~~~~~~~~~~~R",
      "R~~~~~~~~~~~~~~R",
      "R~~~~~~~~~~~~~~R",
      "R~~RR~~~~~~RR~~R",
      "R~~~~~~~~~~~~~~R",
      "R~~~~~~~~~~~~~~R",
      "R~~~~~~~~~~~~~~R",
      "RRRRRRR~~RRRRRRR",
    ],
    warps: [
      { x: 7, y: 10, to: "town3", tx: 8, ty: 1, edge: 1 },
      { x: 8, y: 10, to: "town3", tx: 8, ty: 1, edge: 1 },
    ],
    npcs: [
      {
        x: 7, y: 3, dir: "down", look: "rival", name: "ライバル",
        script: "champion",
        trainer: { party: [["ソラハネ", 26], ["デカネズ", 26], ["シャドネコ", 28], ["@rivalStarter", 30]], money: 5000, champ: true },
        talk: ["やっぱり ここまで きたか。", "おれの ほうが つよいって", "しょうめいしてやる！"],
        win: ["…つよく なったな。", "おまえの かちだ。"],
        after: ["いつか また しょうぶしような！"],
      },
    ],
    enc: {
      rate: 16,
      encAll: true,
      list: [
        ["サボチク", 26, 30, 8], ["ハッパチョ", 26, 30, 7], ["ネムノハ", 26, 30, 6],
        ["カマキリン", 27, 31, 7], ["スズメバチン", 27, 31, 6], ["ヨルグモ", 27, 31, 6],
        ["ムラサキビ", 28, 32, 5], ["イナヅマル", 28, 32, 6], ["デンチュウ", 28, 32, 5],
        ["ライメイ", 29, 33, 4], ["ドロヌマ", 28, 32, 5], ["オニイワ", 29, 33, 5],
        ["ジシンヌシ", 30, 34, 3], ["パンダン", 28, 32, 5], ["カバリン", 28, 32, 5],
        ["シャチマル", 29, 33, 4], ["タツノコ", 28, 32, 4], ["ウズシオヌシ", 30, 34, 3],
        ["フェニクス", 31, 35, 2], ["ヨウガンヌシ", 31, 35, 2], ["ヤミノヌシ", 32, 36, 1],
      ],
    },
  },
};

// あるく ときの「たかいくさ」など、マップの きほん
export const START = { map: "home", x: 4, y: 5, dir: "down" };
