// ============================================================
//  マップ（1もじ＝1マス）
//   . みち   , くさ   " たかいくさ   F はな   ~ すな   L がけ
//   T き     R いわ   W みず   = さく   S かんばん   s かんばん(まちなか)
//   r やね   # かべ   w まど   D ドア   u かいだん
//   C ほらあなの ゆか  X ほらあなの かべ
//   f ゆか   g カーペット  x でぐち  c カウンター  b ほんだな
//   t つくえ  B ベッド  K かいふくき  P パソコン  V しょくぶつ
//
//  ものがたり：やまの むら → やまの おくち（リーフ・コンパス）→
//              8つの タウン → ギャラクシー・タウンの ガオンバトル大会
// ============================================================

/* ============================================================
   まちの もとがた（16x14）
   ・上と下に でぐち、左に ガオン・ステーション、右に ラグ・ショップ
============================================================ */
const TOWN = [
  "TTTTTT,,TTTTTTTT",
  "TT,,,,,,,,,,,,,T",
  "T,rrrr,,,rrrr,,T",
  "T,rrrr,,,rrrr,,T",
  "T,#wD#,,,#Dw#,,T",
  "T,,,,,,,,,,,,,,T",
  "T,s,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "TTTTTT,,TTTTTTTT",
];

/* みちの もとがた（16x16） */
const ROUTE = [
  "TTTTTT,,TTTTTTTT",
  "T,,,,,,,,,,,,,,T",
  "T,\"\"\",,,,,\"\"\",,T",
  "T,\"\"\",,,,,\"\"\",,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,\"\"\"\"\",,,,,T",
  "T,,,,\"\"\"\"\",,,,,T",
  "T,,,,\"\"\"\"\",,,,,T",
  "T,,,,,,,,,,,,,,T",
  "T,,S,,,,,,,,,,,T",
  "T,\"\"\",,,,,\"\"\",,T",
  "T,\"\"\",,,,,\"\"\",,T",
  "T,,,,,,,,,,,,,,T",
  "T,,,,,,,,,,,,,,T",
  "TTTTTT,,TTTTTTTT",
];

// もとがたを コピーして、いくつかの マスを かきかえる
function build(base, patches) {
  const rows = base.slice();
  for (const [x, y, ch] of patches || []) {
    const r = rows[y].split("");
    r[x] = ch;
    rows[y] = r.join("");
  }
  return rows;
}

// まちの きほんの ワープ（ステーション・ショップ・上下の でぐち）
function townWarps(id, northTo, southTo, northXY, southXY) {
  const w = [
    { x: 4, y: 4, to: "station", tx: 5, ty: 8, back: { map: id, x: 4, y: 5 } },
    { x: 10, y: 4, to: "shop", tx: 4, ty: 6, back: { map: id, x: 10, y: 5 } },
  ];
  if (northTo) {
    w.push({ x: 6, y: 0, to: northTo, tx: northXY[0], ty: northXY[1], edge: 1 });
    w.push({ x: 7, y: 0, to: northTo, tx: northXY[0], ty: northXY[1], edge: 1 });
  }
  if (southTo) {
    w.push({ x: 6, y: 13, to: southTo, tx: southXY[0], ty: southXY[1], edge: 1 });
    w.push({ x: 7, y: 13, to: southTo, tx: southXY[0], ty: southXY[1], edge: 1 });
  }
  return w;
}
function routeWarps(southTo, southXY, northTo, northXY) {
  return [
    { x: 6, y: 15, to: southTo, tx: southXY[0], ty: southXY[1], edge: 1 },
    { x: 7, y: 15, to: southTo, tx: southXY[0], ty: southXY[1], edge: 1 },
    { x: 6, y: 0, to: northTo, tx: northXY[0], ty: northXY[1], edge: 1 },
    { x: 7, y: 0, to: northTo, tx: northXY[0], ty: northXY[1], edge: 1 },
  ];
}

export const MAPS = {

/* ============================================================
   1. やまの むら
============================================================ */
  hut: {
    name: "レオの こや",
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
    warps: [{ x: 4, y: 7, to: "village", tx: 4, ty: 5 }],
    npcs: [
      {
        x: 2, y: 5, dir: "down", look: "girl", name: "ははおや",
        talk: ["レオ、きょうは たいちょうは どう？",
               "ぞくちょうさまが よんでいたよ。",
               "むらの おくの いえに いっておいで。"],
        heal: true,
      },
    ],
    objects: [
      { x: 5, y: 1, text: ["ふるい つうしんき。", "…でんげんが 入らない。"] },
      { x: 3, y: 3, text: ["わらの ベッド。よく ねむれる。"] },
    ],
  },

  village: {
    name: "やまの むら",
    kind: "out",
    sets: { r: "roof" },
    rows: [
      "TTTTTTT,,TTTTTTT",
      "TT,,,,,,,,,,,,TT",
      "T,,rrr,,,,rrr,,T",
      "T,,#D#,,,,#D#,,T",
      "T,,,,,,,,,,,,,,T",
      "T,F,,,,,,,,,,F,T",
      "T,,S,,,,,,,,,,,T",
      "T,,,,rrrrrr,,,,T",
      "T,,,,rrrrrr,,,,T",
      "T,,,,#wDw##,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTT,,TTTTTTT",
    ],
    warps: [
      { x: 4, y: 3, to: "hut", tx: 4, ty: 7 },
      { x: 11, y: 3, to: "elder", tx: 5, ty: 8 },
      { x: 7, y: 9, to: "elder", tx: 5, ty: 8 },
      { x: 7, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
      { x: 8, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
      { x: 7, y: 13, to: "gate", tx: 6, ty: 1, edge: 1 },
      { x: 8, y: 13, to: "gate", tx: 6, ty: 1, edge: 1 },
    ],
    signs: [
      { x: 3, y: 6, text: ["やまの むら", "きた…やまの おくち",
                           "みなみ…やまの でぐち"] },
    ],
    npcs: [
      {
        x: 3, y: 11, dir: "down", look: "oldman", name: "むらびと",
        talk: ["やまの そとには「ガオン」と よばれる",
               "とくいせいぶつが あふれておる。",
               "ネットなしで 出るのは むぼうじゃ。"],
      },
      {
        x: 12, y: 6, dir: "left", look: "girl", name: "むらの こ",
        talk: ["ぞくちょうさまに みとめられないと",
               "この やまからは 出られないんだって。"],
      },
    ],
  },

  elder: {
    name: "ぞくちょうの いえ",
    kind: "in",
    rows: [
      "##########",
      "#bffffffb#",
      "#ffffffff#",
      "#fftffttf#",
      "#ffffffff#",
      "#ffVffVff#",
      "#ffffffff#",
      "#ffffffff#",
      "#fffxffff#",
      "##########",
    ],
    warps: [{ x: 4, y: 8, to: "village", tx: 7, ty: 10 }],
    npcs: [
      {
        x: 4, y: 3, dir: "down", look: "oldman", name: "ぞくちょう",
        script: "elder",
        talk: ["よく きた、レオよ。"],
      },
      {
        x: 7, y: 6, dir: "left", look: "boy", name: "むらの わかもの",
        talk: ["やまの おくちには「やまの ぬし」が",
               "すんでいると いわれている。",
               "…おれは まだ 見たことが ないけどな。"],
      },
    ],
  },

/* ============================================================
   2. やまみち と やまの おくち
============================================================ */
  mount1: {
    name: "やまみち",
    kind: "out",
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TT,,,,,,,,,,,,TT",
      "T,\"\"\"\",,,\"\"\"\",,T",
      "T,\"\"\"\",,,\"\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "TRR,,,,,,,,,RRRT",
      "T,,,,\"\"\"\"\"\",,,,T",
      "T,,,,\"\"\"\"\"\",,,,T",
      "T,,,,\"\"\"\"\"\",,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,S,,,,,,,,,,,T",
      "TLLLLLL,,LLLLLLT",
      "T,,,,,,,,,,,,,,T",
      "T,\"\"\"\",,,\"\"\"\",,T",
      "T,\"\"\"\",,,\"\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "T,,RR,,,,,,RR,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTT,,TTTTTTT",
    ],
    warps: [
      { x: 7, y: 19, to: "village", tx: 7, ty: 1, edge: 1 },
      { x: 8, y: 19, to: "village", tx: 7, ty: 1, edge: 1 },
      { x: 6, y: 0, to: "mount2", tx: 7, ty: 14, edge: 1 },
      { x: 7, y: 0, to: "mount2", tx: 7, ty: 14, edge: 1 },
    ],
    signs: [{ x: 3, y: 10, text: ["やまみち", "この さきに やまの おくち"] }],
    ledges: true,
    items: [{ x: 13, y: 12, item: "ヒールジェル", flag: "m1heal" }],
    npcs: [
      {
        x: 11, y: 6, dir: "down", look: "boy", name: "やまの こ ケンタ",
        trainer: { party: [["タネコロ", 5], ["ネズミン", 5]], money: 200 },
        talk: ["あっ、レオ！ ネットを もらったの？",
               "ぼくと しょうぶしようよ！"],
        win: ["すごい！ レオ つよいなあ。"],
        after: ["たかい くさに はいると", "ガオンが とびだしてくるよ。"],
      },
    ],
    enc: {
      rate: 15,
      list: [["タネコロ", 3, 5, 24], ["ムシリン", 3, 5, 22], ["マルミィ", 3, 5, 20],
             ["ネズミン", 3, 5, 18], ["ウサポン", 4, 6, 16]],
    },
  },

  mount2: {
    name: "やまの おくち",
    kind: "out",
    sets: { W: "water" },
    rows: [
      "RRRRRR,,RRRRRRRR",
      "R,,,,,,,,,,,,,,R",
      "R,,RR,,,,,,RR,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,,WWWWWWWW,,,R",
      "R,,,WWWWWWWW,,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,\"\"\",,,,\"\"\",,R",
      "R,,\"\"\",,,,\"\"\",,R",
      "R,,,,,,,,,,,,,,R",
      "R,,RR,,,,,,RR,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,,,,,,,,,,,,,R",
      "RRRRRRR,,RRRRRRR",
    ],
    warps: [
      { x: 7, y: 14, to: "mount1", tx: 7, ty: 1, edge: 1 },
      { x: 8, y: 14, to: "mount1", tx: 7, ty: 1, edge: 1 },
    ],
    npcs: [
      {
        x: 7, y: 6, dir: "down", look: "prof", name: "やまの ぬし",
        script: "latette",
        talk: ["…………"],
      },
    ],
    enc: {
      rate: 12,
      list: [["ムシリン", 5, 7, 30], ["タネコロ", 5, 7, 25], ["ウサポン", 5, 7, 25],
             ["コケゴロ", 6, 8, 12], ["ワンヒノ", 6, 8, 8]],
    },
  },

  gate: {
    name: "やまの でぐち",
    kind: "out",
    rows: [
      "RRRRRR,,RRRRRRRR",
      "R,,,,,,,,,,,,,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,RR,,,,,,RR,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,,,,,,,,,,,,,R",
      "R,,S,,,,,,,,,,,R",
      "R,,,,,,,,,,,,,,R",
      "RRRRRRR,,RRRRRRR",
    ],
    warps: [
      { x: 6, y: 0, to: "village", tx: 7, ty: 12, edge: 1 },
      { x: 7, y: 0, to: "village", tx: 7, ty: 12, edge: 1 },
      { x: 7, y: 8, to: "harbor", tx: 6, ty: 1, edge: 1 },
      { x: 8, y: 8, to: "harbor", tx: 6, ty: 1, edge: 1 },
    ],
    signs: [{ x: 3, y: 6, text: ["やまの でぐち", "この さき ハーバー・タウン"] }],
    npcs: [
      {
        x: 7, y: 7, dir: "up", look: "hiker", name: "みはりの おじ",
        script: "gate",
        talk: ["ここから さきは やまの そとだ。"],
      },
    ],
  },

/* ============ みんなの ばしょ ============ */
  station: {
    name: "ガオン・ステーション",
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
    warps: [{ x: 4, y: 8, to: "@back" }, { x: 5, y: 8, to: "@back" }],
    npcs: [
      {
        x: 2, y: 3, dir: "down", look: "nurse", name: "スタッフ",
        talk: ["ガオン・ステーションへ ようこそ！"],
        healAll: true,
      },
      {
        x: 7, y: 6, dir: "left", look: "boy", name: "たびびと",
        talk: ["ここで やすめば ガオンは げんきに なるよ。"],
      },
    ],
    objects: [{ x: 8, y: 1, text: ["ぼうけんの きろくを つける たんまつだ。"], pc: true }],
  },

  shop: {
    name: "ラグ・ショップ",
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
        talk: ["ネットは よわらせてから なげると", "よく つかまるんだって。"],
      },
    ],
  },

};

/* ============================================================
   8つの タウンと みち（もとがたから 組み立てる）
============================================================ */
const TOWN_DEFS = [
  {
    id: "harbor", name: "ハーバー・タウン", sets: { r: "roofBlue" },
    patch: [[14, 8, "W"], [15, 8, "W"], [14, 9, "W"], [15, 9, "W"], [14, 10, "W"], [15, 10, "W"],
            [14, 11, "W"], [15, 11, "W"], [13, 10, "W"], [13, 11, "W"]],
    north: "route1", northXY: [7, 15], south: "gate", southXY: [7, 7],
    emblem: "みなとエンブレム",
    champ: { name: "タウン・チャンピオン ナギ", look: "leader1",
             party: [["カニポン", 10], ["シズクン", 12]], money: 1200 },
    champTalk: ["わたしは ハーバーの チャンピオン ナギ。",
                "うみの ガオンの つよさ、見せてあげる！"],
    champWin: ["みごと！ 「みなとエンブレム」を どうぞ。"],
    people: [
      { x: 11, y: 11, look: "sailor", name: "せんいん",
        talk: ["この まちは うみの げんかん。", "ふねで いろんな タウンと つながってる。"] },
    ],
  },
  {
    id: "sand", name: "サンド・タウン", sets: { r: "roof", ",": "sand" },
    patch: [[3, 9, "~"], [4, 9, "~"], [5, 9, "~"], [10, 7, "~"], [11, 7, "~"], [12, 9, "~"]],
    north: "route2", northXY: [7, 15], south: "route1", southXY: [7, 1],
    emblem: "すなエンブレム",
    champ: { name: "タウン・チャンピオン ダイ", look: "hiker",
             party: [["ツチマル", 16], ["イワッコ", 16], ["スナムシ", 18]], money: 1800 },
    champTalk: ["すなの まちの ダイだ。", "すなあらしにも たえられるか！"],
    champWin: ["やるな！ 「すなエンブレム」を もっていけ。"],
    people: [
      { x: 4, y: 11, look: "girl", name: "むすめ",
        talk: ["すなの 下には むかしの ガオンが", "ねむっているって いわれてるの。"] },
    ],
  },
  {
    id: "forest", name: "フォレスト・タウン", sets: { r: "roof" },
    patch: [[3, 8, "T"], [12, 8, "T"], [4, 11, "F"], [11, 11, "F"], [3, 10, "T"], [12, 10, "T"]],
    north: "route3", northXY: [7, 15], south: "route2", southXY: [7, 1],
    emblem: "もりエンブレム",
    champ: { name: "タウン・チャンピオン シノ", look: "girl",
             party: [["タネコロ", 20], ["キノコン", 21], ["ツルマキ", 23]], money: 2400 },
    champTalk: ["もりの チャンピオン シノよ。",
                "くさの ガオンの しつよさを あじわって。"],
    champWin: ["つよいのね。「もりエンブレム」を あげる。"],
    people: [
      { x: 11, y: 6, look: "boy", name: "きこり",
        talk: ["フィロアって 子が さっき とおったよ。", "きたへ いそいでたな。"] },
    ],
  },
  {
    id: "stone", name: "ストーン・タウン", sets: { r: "roofBlue" },
    patch: [[3, 8, "R"], [4, 8, "R"], [11, 8, "R"], [12, 8, "R"], [3, 11, "R"], [12, 11, "R"]],
    north: "route4", northXY: [7, 15], south: "route3", southXY: [7, 1],
    emblem: "いしエンブレム",
    champ: { name: "タウン・チャンピオン ゴウ", look: "hiker",
             party: [["イワッコ", 25], ["コケゴロ", 26], ["ガンセキ", 28]], money: 3000 },
    champTalk: ["いしきりばの ゴウだ。",
                "かたい ガオンを くずせるかな？"],
    champWin: ["いい うでだ。「いしエンブレム」を やろう。"],
    people: [
      { x: 5, y: 11, look: "oldman", name: "いしきり",
        talk: ["きたの みずうみには「メロロン」という",
               "おおきな ガオンが すんでいるらしい。"] },
    ],
  },
  {
    id: "aqua", name: "アクア・タウン", sets: { r: "roofBlue" },
    patch: [[2, 9, "W"], [3, 9, "W"], [4, 9, "W"], [2, 10, "W"], [3, 10, "W"], [4, 10, "W"],
            [2, 11, "W"], [3, 11, "W"], [4, 11, "W"]],
    north: "route5", northXY: [7, 15], south: "route4", southXY: [7, 1],
    emblem: "みずうみエンブレム",
    champ: { name: "タウン・チャンピオン ミナ", look: "leader1",
             party: [["シズクン", 30], ["クラゲミ", 30], ["ミナモン", 32]], money: 3600 },
    champTalk: ["みずうみの ミナです。",
                "しずかな 水面のように たたかいましょう。"],
    champWin: ["おみごと。「みずうみエンブレム」を どうぞ。"],
    legend: { name: "メロロン", lv: 38, flag: "meloron", look: "nurse",
              x: 6, y: 11,
              talk: ["みずうみが ざわめいている…！",
                     "おおきな かげが こちらに くる！"] },
    people: [],
  },
  {
    id: "sky", name: "スカイ・タウン", sets: { r: "roof" },
    patch: [[3, 8, "R"], [12, 8, "R"], [7, 10, "u"], [8, 10, "u"]],
    north: "route6", northXY: [7, 15], south: "route5", southXY: [7, 1],
    emblem: "そらエンブレム",
    champ: { name: "タウン・チャンピオン ソラ", look: "leader2",
             party: [["ハネデン", 34], ["トリッピ", 34], ["ソラデン", 36]], money: 4200 },
    champTalk: ["たかい そらの まち、スカイ・タウン。",
                "かぜより はやい ガオンたちだ！"],
    champWin: ["すばらしい。「そらエンブレム」を！"],
    legend: { name: "ディーナ", lv: 42, flag: "deena", look: "girl",
              x: 10, y: 11,
              talk: ["にじいろの はねが 空を よぎった…！",
                     "「ディーナ」が まいおりてくる！"] },
    people: [],
  },
  {
    id: "flame", name: "フレイム・タウン", sets: { r: "roof" },
    patch: [[3, 8, "R"], [4, 9, "R"], [11, 9, "R"], [12, 8, "R"], [7, 11, "R"], [8, 11, "R"]],
    north: "route7", northXY: [7, 15], south: "route6", southXY: [7, 1],
    emblem: "ほのおエンブレム",
    champ: { name: "タウン・チャンピオン カグラ", look: "leader2",
             party: [["ボヤッコ", 38], ["ワンヒノ", 38], ["メラボヤ", 40], ["ホノワン", 40]], money: 5000 },
    champTalk: ["さいごの エンブレムは わたし カグラが もつ。",
                "もえる こころを 見せてみろ！"],
    champWin: ["いい ほのおだ。「ほのおエンブレム」を うけとれ！"],
    people: [
      { x: 11, y: 11, look: "oldman", name: "ふるどうぐや",
        talk: ["7つの エンブレムが そろえば",
               "ギャラクシー・タウンの 大会に 出られる。"] },
    ],
  },
];

const ROUTE_DEFS = [
  { id: "route1", name: "うみぞいの みち", south: "harbor", southXY: [7, 1], north: "sand", northXY: [7, 12],
    lv: [8, 12],
    rival: { party: [["サカナビ", 12], ["シズクン", 13]], money: 800,
      talk: ["フィロア「あ！ さっきの きみだ！", "　おれ フィロア。うみの むこうから きたんだ。", "　ギャラクシー・タウンの 大会で ゆうしょうするのが ゆめ！", "　ちょっと しょうぶ しようよ！"],
      win: ["フィロア「うわー まけた！ でも たのしかった！"],
      after: ["フィロア「つぎ あうときは もっと つよくなってる！"] },
    list: [["ネズミン", 8, 11, 14], ["カニポン", 8, 11, 14], ["トリッピ", 8, 11, 12],
           ["シズクン", 8, 12, 12], ["マルミィ", 8, 11, 10], ["ムシリン", 8, 11, 10],
           ["サカナビ", 9, 12, 10], ["クモッコ", 9, 12, 8], ["ヨルドリ", 9, 12, 6], ["アワミィ", 8, 11, 8], ["コイヌン", 8, 11, 10],
           ["ムシコロ", 8, 11, 10], ["シャチマル", 10, 13, 3]],
    trainers: [
      { x: 4, y: 9, dir: "right", look: "boy", name: "つりびと ハル",
        party: [["サカナビ", 10], ["カニポン", 11]], money: 400,
        talk: ["うみの ガオンは にげあしが はやいぜ！"], win: ["やられた！"],
        after: ["みずの ガオンには でんきが きくよ。"] },
    ] },
  { id: "route2", name: "さばくの みち", south: "sand", southXY: [7, 1], north: "forest", northXY: [7, 12],
    lv: [14, 18],
    list: [["スナムシ", 14, 17, 16], ["ツチマル", 14, 17, 14], ["イワッコ", 14, 17, 14],
           ["サボチク", 15, 18, 10], ["ダンゴロン", 14, 17, 12], ["アリンコ", 14, 17, 12],
           ["ヒバナリ", 15, 18, 10], ["モグポン", 15, 18, 12], ["ツチノコ", 14, 17, 12], ["イシゴロ", 15, 18, 10],
           ["ビリタマ", 14, 17, 12], ["ドロヌマ", 16, 19, 6], ["タヌポン", 15, 18, 10]],
    trainers: [
      { x: 11, y: 5, dir: "left", look: "hiker", name: "たびの ひと ソウ",
        party: [["ツチマル", 16], ["スナムシ", 17]], money: 700,
        talk: ["さばくを こえるなら ようじんしな。"], win: ["みごとだ。"],
        after: ["すなの ガオンは くさが にがて。"] },
    ] },
  { id: "route3", name: "もりの みち", south: "forest", southXY: [7, 1], north: "stone", northXY: [7, 12],
    lv: [20, 24],
    rival: { party: [["スイスイオ", 23], ["ライボルト", 23], ["カニポン", 24]], money: 1800,
      talk: ["フィロア「やっぱり きみも きたね！", "　もりの みちは とおりみち。おれは もう エンブレム 2つだよ。", "　いくよ、しょうぶだ！"],
      win: ["フィロア「つよい…！ でも まだ まけてないからな！"],
      after: ["フィロア「そらの まちで また あおう！"] },
    list: [["キノコン", 20, 23, 14], ["ムシリン", 20, 23, 12], ["チョウマユ", 20, 23, 12],
           ["ハッパチョ", 21, 24, 10], ["クモッコ", 20, 23, 12], ["ホタリン", 21, 24, 10],
           ["ウリボン", 21, 24, 12], ["タネコロ", 20, 23, 10], ["ヨルネコ", 21, 24, 8], ["リーフィン", 20, 23, 8], ["ハナビィ", 20, 23, 10],
           ["ネムノハ", 22, 25, 6], ["パンダン", 22, 25, 6], ["オバケシ", 21, 24, 8]],
    trainers: [
      { x: 4, y: 12, dir: "up", look: "girl", name: "むしとり シオリ",
        party: [["カブトン", 22], ["チョウマユ", 22]], money: 900,
        talk: ["もりの むしガオンは かわいいでしょ？"], win: ["まだまだ！"],
        after: ["むしは ほのおが にがて。"] },
    ] },
  { id: "route4", name: "いしきりの みち", south: "stone", southXY: [7, 1], north: "aqua", northXY: [7, 12],
    lv: [26, 30],
    list: [["イワッコ", 26, 29, 14], ["ガンセキ", 27, 30, 10], ["コケゴロ", 26, 29, 12],
           ["ダンゴロン", 26, 29, 12], ["カセキン", 27, 30, 8], ["マグマゴ", 27, 30, 10],
           ["クロネズ", 26, 29, 12], ["カゲポン", 26, 29, 12], ["プラグン", 27, 30, 10], ["ドクロン", 27, 30, 8], ["スミビン", 28, 31, 6],
           ["デンチュウ", 28, 31, 6], ["ジシンヌシ", 29, 32, 4]],
    trainers: [
      { x: 11, y: 9, dir: "left", look: "hiker", name: "いしきり タツ",
        party: [["イワッコ", 28], ["ガンセキ", 29]], money: 1200,
        talk: ["いわの ガオンは そう かんたんに くずれん！"], win: ["くずれたか…"],
        after: ["いわには みずと くさが きく。"] },
    ] },
  { id: "route5", name: "みずうみの みち", south: "aqua", southXY: [7, 1], north: "sky", northXY: [7, 12],
    lv: [31, 35],
    list: [["クラゲミ", 31, 34, 12], ["シズクン", 31, 34, 12], ["サカナビ", 31, 34, 12],
           ["コオリン", 32, 35, 10], ["ミナモン", 32, 35, 10], ["ラゲドン", 33, 36, 8],
           ["ハネデン", 31, 34, 12], ["ヒツジン", 31, 34, 12], ["タツノコ", 33, 36, 8], ["カバリン", 32, 35, 8], ["ヌシガエル", 34, 37, 4],
           ["ウズシオヌシ", 34, 37, 4]],
    trainers: [
      { x: 4, y: 5, dir: "right", look: "sailor", name: "みずうみの ヨシ",
        party: [["クラゲミ", 33], ["ミナモン", 34]], money: 1500,
        talk: ["みずうみの ガオンは しずかで つよい。"], win: ["おみごと。"],
        after: ["きたの スカイ・タウンは 空に ちかい まちだ。"] },
    ] },
  { id: "route6", name: "そらの かいだん", south: "sky", southXY: [7, 1], north: "flame", northXY: [7, 12],
    lv: [36, 40],
    rival: { party: [["スイスイオ", 38], ["ライボルト", 38], ["ハサミガニ", 39], ["ミナモン", 40]], money: 3200,
      talk: ["フィロア「ここまで きたか！ おれも エンブレム そろってきたぞ。", "　つぎに あうのは たぶん…大会の ぶたいだ。", "　その まえに 一しょうぶ！"],
      win: ["フィロア「くやしい！ けっしょうで まってるからな！"],
      after: ["フィロア「ギャラクシー・タウンで まってる！"] },
    list: [["ハネデン", 36, 39, 12], ["ソラデン", 37, 40, 10], ["トリッピ", 36, 39, 12],
           ["ソラハネ", 37, 40, 10], ["ヒバナリ", 36, 39, 10], ["ジリジリ", 36, 39, 10],
           ["ライメイ", 38, 41, 6], ["イナヅマル", 37, 40, 8], ["ピリット", 36, 39, 12],
           ["ネコデン", 36, 39, 12], ["ヒノコマ", 36, 39, 8], ["タキビィ", 36, 39, 8],
           ["ボヤッコ", 36, 39, 8]],
    trainers: [
      { x: 11, y: 12, dir: "up", look: "boy", name: "そらの こ カイ",
        party: [["ハネデン", 38], ["ソラデン", 39]], money: 1800,
        talk: ["そらの ガオンは はやいぞ！"], win: ["つかまえられた…！"],
        after: ["でんきには じめんが きく。"] },
    ] },
  { id: "route7", name: "ギャラクシーへの みち", south: "flame", southXY: [7, 1], north: "galaxy", northXY: [8, 14],
    lv: [41, 45],
    list: [["メラボヤ", 41, 44, 10], ["ホノワン", 41, 44, 10], ["マグマゴ", 41, 44, 10],
           ["カガリビ", 42, 45, 8], ["ヨルネコ", 41, 44, 10], ["シャドネコ", 43, 46, 6],
           ["ムラサキビ", 42, 45, 8], ["オニイワ", 43, 46, 6], ["カマキリン", 42, 45, 8],
           ["スズメバチン", 42, 45, 8], ["デカネズ", 41, 44, 10], ["ヨルグモ", 42, 45, 8], ["ヤミノヌシ", 44, 47, 3],
           ["フェニクス", 44, 47, 3], ["ヨウガンヌシ", 44, 47, 3]],
    trainers: [
      { x: 4, y: 3, dir: "right", look: "leader2", name: "たいかいの せんぱい",
        party: [["メラボヤ", 43], ["シャドネコ", 44], ["ガンセキ", 44]], money: 2500,
        talk: ["大会の 出場者だ。ここで ならしておこう。"], win: ["いい しあいだった！"],
        after: ["ギャラクシー・タウンは すぐ そこだ。"] },
    ] },
];

/* --- まちを 組み立てる --- */
for (const t of TOWN_DEFS) {
  const npcs = [];
  npcs.push({
    x: 7, y: 9, dir: "down", look: t.champ.look, name: t.champ.name,
    trainer: { party: t.champ.party, money: t.champ.money, leader: t.emblem },
    talk: t.champTalk,
    win: t.champWin,
    after: ["つぎの まちで まってるぞ！"],
  });
  for (const p of t.people || []) {
    npcs.push({ x: p.x, y: p.y, dir: "down", look: p.look, name: p.name, talk: p.talk });
  }
  if (t.legend) {
    npcs.push({
      x: t.legend.x, y: t.legend.y, dir: "down", look: t.legend.look,
      name: "まちの ひと", script: "legend",
      legend: { name: t.legend.name, lv: t.legend.lv, flag: t.legend.flag },
      talk: t.legend.talk,
    });
  }
  MAPS[t.id] = {
    name: t.name,
    kind: "out",
    sets: t.sets,
    rows: build(TOWN, t.patch),
    warps: townWarps(t.id, t.north, t.south, t.northXY, t.southXY),
    signs: [{ x: 2, y: 6, text: [t.name, "◀ ステーション　ショップ ▶",
                                 "チャンピオンに かとう！"] }],
    npcs: npcs,
  };
}

/* --- みちを 組み立てる --- */
for (const r of ROUTE_DEFS) {
  const npcs = [];
  if (r.rival) {
    npcs.push({
      x: 8, y: 4, dir: "down", look: "philoa", name: "フィロア",
      trainer: { party: r.rival.party, money: r.rival.money },
      talk: r.rival.talk, win: r.rival.win, after: r.rival.after,
    });
  }
  for (const t of r.trainers || []) {
    npcs.push({
      x: t.x, y: t.y, dir: t.dir, look: t.look, name: t.name,
      trainer: { party: t.party, money: t.money },
      talk: t.talk, win: t.win, after: t.after,
    });
  }
  MAPS[r.id] = {
    name: r.name,
    kind: "out",
    rows: ROUTE.slice(),
    warps: routeWarps(r.south, r.southXY, r.north, r.northXY),
    signs: [{ x: 3, y: 10, text: [r.name, "レベル " + r.lv[0] + "〜" + r.lv[1] + " くらいの ガオンが でる"] }],
    npcs: npcs,
    enc: { rate: 15, list: r.list },
  };
}

/* ============================================================
   ギャラクシー・タウン と かいじょう
============================================================ */
MAPS.galaxy = {
  name: "ギャラクシー・タウン",
  kind: "out",
  sets: { r: "roofBlue", ",": "path" },
  rows: [
    "TTTTTTTTTTTTTTTT",
    "T,,rrrrrrrrrr,,T",
    "T,,rrrrrrrrrr,,T",
    "T,,##wwDDww##,,T",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "T,rrrr,,,,rrrr,T",
    "T,#wD#,,,,#Dw#,T",
    "T,,,,,,,,,,,,,,T",
    "T,,s,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "TTTTTTTT,,TTTTTT",
  ],
  warps: [
    { x: 7, y: 3, to: "arena", tx: 6, ty: 12 },
    { x: 8, y: 3, to: "arena", tx: 7, ty: 12 },
    { x: 4, y: 7, to: "station", tx: 5, ty: 8, back: { map: "galaxy", x: 4, y: 8 } },
    { x: 11, y: 7, to: "shop", tx: 4, ty: 6, back: { map: "galaxy", x: 11, y: 8 } },
    { x: 8, y: 14, to: "route7", tx: 7, ty: 1, edge: 1 },
    { x: 9, y: 14, to: "route7", tx: 7, ty: 1, edge: 1 },
  ],
  signs: [{ x: 3, y: 9, text: ["ギャラクシー・タウン", "せかいの ちゅうしん",
                               "上… ガオンバトル大会 かいじょう"] }],
  npcs: [
    {
      x: 5, y: 11, dir: "down", look: "girl", name: "うけつけの ひと",
      script: "entry",
      talk: ["ガオンバトル大会へ ようこそ！"],
    },
    {
      x: 11, y: 11, dir: "down", look: "boy", name: "かんきゃく",
      talk: ["ことしの 大会は レベルが たかいらしい。",
             "うみから きた 青い かみの 子も 出るんだって。"],
    },
  ],
};

MAPS.arena = {
  name: "ガオンバトル大会",
  kind: "in",
  sets: { g: "carpet" },
  rows: [
    "##############",
    "#ffffffffffff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffggggggggff#",
    "#ffffffffffff#",
    "#ffffffffffff#",
    "#ffffffffffff#",
    "#ffffxxfffff#f".slice(0, 14),
    "##############",
  ],
  warps: [
    { x: 5, y: 12, to: "galaxy", tx: 7, ty: 4 },
    { x: 6, y: 12, to: "galaxy", tx: 8, ty: 4 },
  ],
  npcs: [
    {
      x: 6, y: 4, dir: "down", look: "leader1", name: "たいかい しんこうやく",
      script: "tournament",
      talk: ["ガオンバトル大会、かいまく！"],
    },
  ],
};

export const START = { map: "hut", x: 4, y: 5, dir: "down" };
