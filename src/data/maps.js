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
//              スイス・アルプスを思わせる七つの谷 → 星環の都の山岳祭
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
  "TRRLLLLLR,,,,,,T",   // ← だんさ（ひだりがわ）
  "T,,,,,,,,RHHLLLT",   // ← だんさ（みぎがわ・かいだん x10,11）
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
    name: "かぜの 丸太ごや",
    kind: "in",
    rows: [
      "##########",
      "#bffffftf#",
      "#ffffffff#",
      "#fBffffVf#",
      "#ffggggff#",
      "#ffggggff#",
      "#ffffffff#",
      "#ffffffff#",
      "#fffxxfff#",
      "##########",
    ],
    warps: [{ x: 4, y: 8, to: "village", tx: 4, ty: 6 }, { x: 5, y: 8, to: "village", tx: 4, ty: 6 }],
    npcs: [
      {
        x: 7, y: 6, dir: "left", look: "girl", name: "母 ミレナ",
        talk: ["ミレナ「谷の 風が きのうから おかしいの。",
               "　森の ガオンたちも、山の上を 見つめている。",
               "　谷守の オルドが 共同ロッジで まっているわ。"],
        heal: true,
      },
    ],
    objects: [
      { x: 7, y: 1, text: ["谷の 天気を よむ 古い 気圧計。", "針が 山の ほうへ ふるえている。"] },
      { x: 2, y: 3, text: ["厚い 毛布の ベッド。", "窓の そとから モミの香りがする。"] },
    ],
  },

  village: {
    name: "風鳴り谷",
    kind: "out",
    sets: { r: "wood", ",": "grass" },     // わらぶきの やね
    hideTileHouses: true,
    landmarks: [
      { art: "alpineCabin", x: 1, y: 2, w: 6, h: 5 },
      { art: "alpineLodge", x: 9, y: 8, w: 7, h: 6 },
      { art: "alpineWoodBridge", x: 5, y: 6, w: 6, h: 4 },
      { art: "alpineFirCluster", x: 0, y: 8, w: 4, h: 4 },
    ],
    rows: [
      "TTTTTTT,,TTTTTTT",
      "TTTTT,,,,,,TTTTT",
      "TTT,,,,WW,,,,TTT",
      "TT,,rrrWW,,,,,TT",
      "TT,,rrrWW,TT,,TT",
      "TT,,#D#WW,,,,,,T",
      "T,,,,,mWW,,,,,,T",
      "T,TT,,,WW==,,,,T",
      "T,,,,,,WW==,TT,T",
      "T,,F,,,WW,,,,,,T",
      "T,,,,,,WW,rrrrrT",
      "T,TT,,,WW,rrrrrT",
      "T,,,,,,WW,#wDw#T",
      "T,,,S,,WW,,mmm,T",
      "TT,,,,,,,,,,,,TT",
      "TTTTTTT,,TTTTTTT",
    ],
    warps: [
      { x: 4, y: 5, to: "hut", tx: 4, ty: 8 },
      { x: 12, y: 12, to: "elder", tx: 4, ty: 8 },
      { x: 7, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
      { x: 8, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
      { x: 7, y: 15, to: "gate", tx: 6, ty: 1, edge: 1 },
      { x: 8, y: 15, to: "gate", tx: 6, ty: 1, edge: 1 },
    ],
    signs: [
      { x: 3, y: 13, text: ["風鳴り谷　標高 1480m",
                            "北…雲を生む 森　南…谷をくだる 古道"] },
    ],
    npcs: [
      {
        x: 3, y: 9, dir: "down", look: "oldman", name: "木こり バルト",
        talk: ["バルト「この谷では、人と ガオンが",
               "　同じ 水と 薪を わけあって 暮らしてきた。",
               "　近ごろは 森の 奥で 木々が ざわめいている。"],
      },
      {
        x: 10, y: 7, dir: "left", look: "girl", name: "羊飼い エナ", hair: "bun",
        talk: ["エナ「雪どけ水は つめたいけど、",
               "　ガオンたちは この川の 音が だいすき。",
               "　丸木橋は すべるから 気をつけてね。"],
      },
      {
        x: 5, y: 14, dir: "down", look: "hiker", name: "橋守 ロアン", hair: "straw",
        talk: ["ロアン「谷の外へ つづく古道は、",
               "　リーフ・コンパスを 持つ旅人のための道だ。",
               "　方角ではなく、命のざわめきを 指すらしい。"],
      },
    ],
  },

  // となりの こや（むらの もう ひとつの いえ）
  hut2: {
    name: "むらの いえ",
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
    warps: [{ x: 4, y: 7, to: "village", tx: 10, ty: 5 }],
    npcs: [
      {
        x: 3, y: 4, dir: "down", look: "girl", name: "おばさん",
        talk: ["レオも いよいよ 山を おりるのね。",
               "むこうの 町には 大きな 海が あるんですって。"],
      },
    ],
  },

  elder: {
    name: "谷守の 共同ロッジ",
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
    warps: [{ x: 4, y: 8, to: "village", tx: 7, ty: 13 }],
    npcs: [
      {
        x: 4, y: 3, dir: "down", look: "oldman", name: "谷守 オルド",
        script: "elder",
        talk: ["オルド「よく きた、レオ。"],
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
      "T,,,,,,,,,,,RR,T",
      "T,,,,,,,,,,,,,,T",
      "TLLHHLLM,,,,,,,T",
      "T,,,,,,MLLLLLLLT",
      "T,,,,,\"\"\"\"\"\",,,T",
      "T,,,,,\"\"\"\"\"\",,,T",
      "T,,S,,,,,,,,,,,T",
      "T,,RR,,,,,,,,,,T",
      "TLLLHHLLM,,,,,,T",
      "T,,,,,,,,MLLLLLT",
      "T,,,,,,,,,,,,,,T",
      "T,\"\"\"\",,,\"\"\"\",,T",
      "T,\"\"\"\",,,\"\"\"\",,T",
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
        x: 13, y: 9, dir: "down", look: "boy", name: "やまの こ ケンタ",
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
      "TTTTTT,,TTTTTTTT",
      "T,,,,,,,,,,,,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,RR,,,,,,RR,,T",
      "TMMMMMLHHLMMMMMT",
      "T,,,,,,,,,,,,,,T",
      "T,,,WWWWWWWW,,,T",
      "T,,,WWWWWWWW,,,T",
      "T,,,,,,,,,,,,,,T",
      "T,,\"\"\",,,,\"\"\",,T",
      "T,,\"\"\",,,,\"\"\",,T",
      "T,,,,,,,,,,,,,,T",
      "T,,RR,,,,,,RR,,T",
      "T,,,,,,,,,,,,,,T",
      "TTTTTTT,,TTTTTTT",
    ],
    warps: [
      { x: 7, y: 14, to: "mount1", tx: 7, ty: 1, edge: 1 },
      { x: 8, y: 14, to: "mount1", tx: 7, ty: 1, edge: 1 },
    ],
    npcs: [
      {
        x: 7, y: 2, dir: "down", look: "prof", name: "やまの ぬし",
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
      { x: 6, y: 0, to: "village", tx: 7, ty: 14, edge: 1 },
      { x: 7, y: 0, to: "village", tx: 7, ty: 14, edge: 1 },
      { x: 7, y: 8, to: "harbor", tx: 6, ty: 1, edge: 1 },
      { x: 8, y: 8, to: "harbor", tx: 6, ty: 1, edge: 1 },
    ],
    signs: [{ x: 3, y: 6, text: ["谷の でぐち", "この さき アーレ湖港"] }],
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
    name: "山旅の 共同ロッジ",
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
        talk: ["ロッジ番「山旅の 共同ロッジへ ようこそ。",
               "　暖炉のそばで、ガオンたちを 休ませていって。"],
        healAll: true,
      },
      {
        x: 7, y: 6, dir: "left", look: "boy", name: "たびびと",
        talk: ["旅人「このロッジは 七つの谷の人が",
               "　薪と薬草を 持ち寄って守っているんだ。"],
      },
    ],
    objects: [{ x: 8, y: 1, text: ["ぼうけんの きろくを つける たんまつだ。"], pc: true }],
  },


  // アーレ湖港の ふくや
  clothes1: {
    name: "ふくや ウミカゼ",
    kind: "in",
    sets: { g: "carpet" },
    rows: [
      "##########",
      "#ccccffff#",
      "#ffffffff#",
      "#ffggggff#",
      "#ffggggff#",
      "#ffffffff#",
      "#ffVffVff#",
      "#fffxxfff#",
      "##########",
    ],
    warps: [{ x: 4, y: 7, to: "harbor", tx: 3, ty: 11 }, { x: 5, y: 7, to: "harbor", tx: 3, ty: 11 }],
    npcs: [
      {
        x: 2, y: 2, dir: "down", look: "girl", name: "ふくやの おねえさん", hair: "pony", skirt: true,
        clothes: "basic",
        talk: ["いらっしゃい！ ウミカゼ ふくてんよ。",
               "うわぎと ズボン、5色ずつ あるわ。"],
      },
      {
        x: 7, y: 5, dir: "left", look: "boy", name: "おきゃく",
        talk: ["4つめの まちには もっと おしゃれな",
               "ふくやが あるって うわさだよ。"],
      },
    ],
  },

  // 陽だまり棚田の びよういん
  salon: {
    name: "びよういん スナカゼ",
    kind: "in",
    sets: { g: "carpet" },
    rows: [
      "##########",
      "#ccccffff#",
      "#ffffffff#",
      "#ffggggff#",
      "#ffggggff#",
      "#ffffffff#",
      "#ffVffVff#",
      "#fffxxfff#",
      "##########",
    ],
    warps: [{ x: 4, y: 7, to: "sand", tx: 3, ty: 10 }, { x: 5, y: 7, to: "sand", tx: 3, ty: 10 }],
    npcs: [
      {
        x: 2, y: 2, dir: "down", look: "nurse", name: "びようしさん", hair: "bob", skirt: true,
        salon: true,
        talk: ["ようこそ スナカゼへ。",
               "かみの 色、5色から えらべますよ。"],
      },
      {
        x: 7, y: 5, dir: "left", look: "girl", name: "おきゃく",
        talk: ["きんいろに してもらったの。",
               "すなの まちに にあうでしょ？"],
      },
    ],
  },

  // 石笛の峡谷の おしゃれな ふくや
  clothes2: {
    name: "ブティック イシヅカ",
    kind: "in",
    sets: { g: "carpet" },
    rows: [
      "##########",
      "#ccccffff#",
      "#ffffffff#",
      "#ffggggff#",
      "#ffggggff#",
      "#ffggggff#",
      "#ffVffVff#",
      "#fffxxfff#",
      "##########",
    ],
    warps: [{ x: 4, y: 7, to: "stone", tx: 3, ty: 10 }, { x: 5, y: 7, to: "stone", tx: 3, ty: 10 }],
    npcs: [
      {
        x: 2, y: 2, dir: "down", look: "leader1", name: "デザイナー イシヅカ", hair: "bun", skirt: true,
        clothes: "fancy",
        talk: ["ようこそ ブティック イシヅカへ。",
               "ここでしか 手に入らない 10色を そろえている。",
               "…すこし たかいけどね。"],
      },
      {
        x: 7, y: 5, dir: "left", look: "boy", name: "おきゃく",
        talk: ["ここの ふくは 大会でも めだつんだ。"],
      },
    ],
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
        talk: ["ネットは よわらせてから つかうと", "よく つかまるんだって。"],
      },
    ],
  },

};

/* ============================================================
   8つの タウンと みち（もとがたから 組み立てる）
============================================================ */
const TOWN_DEFS = [
  {
    id: "harbor", name: "アーレ湖港", sets: { r: "roofBlue" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineBoathouse", x: 9, y: 3, w: 7, h: 6 },
      { art: "alpineLodge", x: 0, y: 1, w: 7, h: 6 },
      { art: "alpineStoneBridge", x: 5, y: 6, w: 6, h: 4 },
    ],
    // 小さな 港町：右がわは うみ、まん中に さんばし
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TT,,,,,,,,,,,,,T",
      "T,rrrr,,rrrr,,,T",
      "T,#wD#,,#Dw#,,,T",
      ",,,,......,,,WWW",
      "T,,,,,,.,,,,,WWW",
      "T,s,,,,.,,,,,WWW",
      "T,,,,,,.....dWWW",
      "T,,,,,,.,,,dddWW",
      "T,rrr,,,,,,,dWWW",
      "T,#D#,,,,,~~~WWW",
      "T,,,,,,,,~~~~WWW",
      "T,,,,,,,,~~~~~WW",
      "TTTTTT,,TTTTTTTT",
    ],
    warps: [
      { x: 4, y: 3, to: "station", tx: 5, ty: 8, back: { map: "harbor", x: 4, y: 4 } },
      { x: 9, y: 3, to: "shop", tx: 4, ty: 6, back: { map: "harbor", x: 9, y: 4 } },
      { x: 6, y: 0, to: "route1", tx: 7, ty: 15, edge: 1 },
      { x: 7, y: 0, to: "route1", tx: 7, ty: 15, edge: 1 },
      { x: 0, y: 4, to: "inlet", tx: 1, ty: 6, edge: 1 },
      { x: 6, y: 13, to: "gate", tx: 7, ty: 7, edge: 1 },
      { x: 7, y: 13, to: "gate", tx: 7, ty: 7, edge: 1 },
      { x: 3, y: 10, to: "clothes1", tx: 4, ty: 6 },
    ],
    signXY: [2, 6],
    signText: ["アーレ湖港",
               "ちいさな 港町。ふねが 一そう つながれている",
               "◀ ステーション　ショップ ▶　ふくや も あるよ"],
    champXY: [5, 10],
    north: "route1", northXY: [7, 15], south: "gate", southXY: [7, 7],
    emblem: "湖風エンブレム",
    champ: { name: "湖守 ナギ", look: "leader1",
             party: [["カニポン", 10], ["シズクン", 12]], money: 1200 },
    champTalk: ["ナギ「湖の水は、雪と森と町を ひとつにつなぐ。",
                "　ガオンの流れを読めるか、あなたの呼吸を見せて。"],
    champWin: ["ナギ「水の声が あなたに応えた。「湖風エンブレム」を。"],
    people: [
      { x: 12, y: 8, look: "sailor", name: "せんいん",
        talk: ["この さんばしから ふねが 出るんだ。",
               "けど いまは 一そうしか ない ちいさな 港さ。"] },
      { x: 10, y: 12, look: "boy", name: "はまべの こ",
        talk: ["あさは 波が しずかで きもちいいよ。",
               "すなはまで ガオンを 見かける ことも あるんだ。"] },
    ],
  },
  {
    id: "sand", name: "陽だまり棚田", sets: { r: "roof", ",": "grass" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineWorkshop", x: 0, y: 6, w: 7, h: 6 },
      { art: "alpineTerrace", x: 9, y: 5, w: 6, h: 5 },
      { art: "alpineFlowerMeadow", x: 6, y: 9, w: 5, h: 4 },
    ],
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [10, 7, "~"], [11, 7, "~"], [12, 9, "~"], [12, 10, "~"],
            [2, 8, "r"], [3, 8, "r"], [4, 8, "r"], [2, 9, "#"], [3, 9, "D"], [4, 9, "#"]],
    extraWarps: [{ x: 3, y: 9, to: "salon", tx: 4, ty: 6 },
                 { x: 15, y: 10, to: "desert", tx: 1, ty: 6, edge: 1 }],
    north: "route2", northXY: [7, 15], south: "route1", southXY: [7, 1],
    emblem: "陽刻エンブレム",
    champ: { name: "牧守 ダイ", look: "hiker",
             party: [["ツチマル", 16], ["イワッコ", 16], ["スナムシ", 18]], money: 1800 },
    champTalk: ["ダイ「ここは砂漠じゃない。氷河が削った石の段々畑だ。",
                "　重い石を積むような、ぶれない絆を見せてみろ。"],
    champWin: ["ダイ「いい足場だ。「陽刻エンブレム」を 受け取れ。"],
    people: [
      { x: 6, y: 11, look: "girl", name: "むすめ", hair: "pony", skirt: true,
        talk: ["すなの 下には むかしの ガオンが", "ねむっているって いわれてるの。"] },
    ],
  },
  {
    id: "forest", name: "モミ響きの森", sets: { r: "wood" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineHerbalist", x: 0, y: 4, w: 7, h: 6 },
      { art: "alpineFirCluster", x: 10, y: 1, w: 5, h: 5 },
      { art: "alpineWaterfall", x: 9, y: 7, w: 6, h: 6 },
    ],
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [3, 8, "T"], [12, 8, "T"], [4, 11, "F"], [11, 11, "F"], [3, 10, "T"], [12, 10, "T"]],
    extraWarps: [{ x: 15, y: 10, to: "deepforest", tx: 1, ty: 6, edge: 1 }],
    north: "route3", northXY: [7, 15], south: "route2", southXY: [7, 1],
    emblem: "森響エンブレム",
    champ: { name: "薬草守 シノ", look: "girl",
             party: [["タネコロ", 20], ["キノコン", 21], ["ツルマキ", 23]], money: 2400 },
    champTalk: ["シノ「木は声を出さない。でも根の下で水を分けあうの。",
                "　あなたの仲間も、見えないところで支えあっている？"],
    champWin: ["シノ「森が静かになった。「森響エンブレム」を託すね。"],
    people: [
      { x: 11, y: 6, look: "boy", name: "きこり",
        talk: ["フィロアって 子が さっき とおったよ。", "きたへ いそいでたな。"] },
    ],
  },
  {
    id: "stone", name: "石笛の峡谷", sets: { r: "roofBlue" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineRailStation", x: 0, y: 1, w: 8, h: 6 },
      { art: "alpineTrain", x: 7, y: 1, w: 8, h: 6 },
      { art: "alpineCliff", x: 10, y: 7, w: 6, h: 6 },
    ],
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [11, 8, "M"], [12, 8, "M"], [12, 11, "R"], [11, 11, "R"],
            [2, 8, "r"], [3, 8, "r"], [4, 8, "r"], [2, 9, "#"], [3, 9, "D"], [4, 9, "#"]],
    extraWarps: [{ x: 3, y: 9, to: "clothes2", tx: 4, ty: 6 },
                 { x: 15, y: 10, to: "cavern", tx: 1, ty: 6, edge: 1 }],
    north: "route4", northXY: [7, 15], south: "route3", southXY: [7, 1],
    emblem: "石笛エンブレム",
    champ: { name: "石工守 ゴウ", look: "hiker",
             party: [["イワッコ", 25], ["コケゴロ", 26], ["ガンセキ", 28]], money: 3000 },
    champTalk: ["ゴウ「列車の音が峡谷に七回返れば、天気が変わる。",
                "　力で砕くな。響きを聞いて、最初の一手を選べ。"],
    champWin: ["ゴウ「いい響きだ。「石笛エンブレム」を持っていけ。"],
    people: [
      { x: 6, y: 11, look: "oldman", name: "いしきり", hair: "straw",
        talk: ["きたの みずうみには「メロロン」という",
               "おおきな ガオンが すんでいるらしい。"] },
    ],
  },
  {
    id: "aqua", name: "水鏡の入江", sets: { r: "roofBlue" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineBoathouse", x: 0, y: 1, w: 7, h: 6 },
      { art: "alpinePond", x: 8, y: 7, w: 7, h: 6 },
      { art: "alpineWoodBridge", x: 4, y: 6, w: 6, h: 4 },
    ],
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [2, 9, "W"], [3, 9, "W"], [4, 9, "W"], [2, 10, "W"], [3, 10, "W"], [4, 10, "W"],
            [2, 11, "W"], [3, 11, "W"], [4, 11, "W"]],
    extraWarps: [{ x: 15, y: 10, to: "river", tx: 1, ty: 6, edge: 1 }],
    north: "route5", northXY: [7, 15], south: "route4", southXY: [7, 1],
    emblem: "水鏡エンブレム",
    champ: { name: "水路守 ミナ", look: "leader1",
             party: [["シズクン", 30], ["クラゲミ", 30], ["ミナモン", 32]], money: 3600 },
    champTalk: ["ミナ「この入江は、メロロンが泳ぐと水位が変わるの。",
                "　相手を押さえず、波に合わせる戦いを見せて。"],
    champWin: ["ミナ「水面に道が映った。「水鏡エンブレム」をどうぞ。"],
    legend: { name: "メロロン", lv: 38, flag: "meloron", look: "nurse",
              x: 6, y: 11,
              talk: ["みずうみが ざわめいている…！",
                     "おおきな かげが こちらに くる！"] },
    people: [],
  },
  {
    id: "sky", name: "白嶺のシャレー", sets: { r: "roof", ",": "snow" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineSnowChalet", x: 0, y: 1, w: 8, h: 7 },
      { art: "alpineSnowFirCluster", x: 10, y: 1, w: 6, h: 6 },
      { art: "alpineTrailStairs", x: 7, y: 7, w: 6, h: 6 },
    ],
    // まちの きたがわは 高台。かいだん(x5,6)で のぼる
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [1, 7, "M"], [2, 7, "M"], [3, 7, "L"], [4, 7, "L"], [5, 7, "H"],
            [6, 7, "H"], [7, 7, "L"], [8, 7, "M"],
            [8, 8, "M"], [9, 8, "L"], [10, 8, "L"], [11, 8, "L"],
            [12, 8, "M"], [13, 8, "M"], [14, 8, "M"],
            [7, 10, "u"], [8, 10, "u"]],
    extraWarps: [{ x: 15, y: 10, to: "cloud", tx: 1, ty: 6, edge: 1 }],
    north: "route6", northXY: [7, 15], south: "route5", southXY: [7, 1],
    emblem: "雪翼エンブレム",
    champ: { name: "雪稜守 ソラ", look: "leader2",
             party: [["ハネデン", 34], ["トリッピ", 34], ["ソラデン", 36]], money: 4200 },
    champTalk: ["ソラ「ここでは雲が足もとに生まれ、谷へ降りていく。",
                "　速さだけでは渡れない雪稜を、どう越える？"],
    champWin: ["ソラ「風が道をあけた。「雪翼エンブレム」を持っていって。"],
    legend: { name: "ディーナ", lv: 42, flag: "deena", look: "girl",
              x: 10, y: 11,
              talk: ["にじいろの はねが 空を よぎった…！",
                     "「ディーナ」が まいおりてくる！"] },
    people: [],
  },
  {
    id: "flame", name: "夕映え高原", sets: { r: "roof" },
    hideTileHouses: true,
    landmarks: [
      { art: "alpineObservatory", x: 8, y: 1, w: 8, h: 7 },
      { art: "alpineLodge", x: 0, y: 6, w: 7, h: 6 },
      { art: "alpineFlowerMeadow", x: 8, y: 8, w: 6, h: 5 },
    ],
    patch: [[15, 10, ","], [14, 10, "."], [13, 10, "."], [3, 8, "M"], [4, 9, "R"], [11, 9, "R"], [12, 8, "M"], [7, 11, "R"], [8, 11, "R"]],
    extraWarps: [{ x: 15, y: 10, to: "volcano", tx: 1, ty: 6, edge: 1 }],
    north: "route7", northXY: [7, 15], south: "route6", southXY: [7, 1],
    emblem: "夕映エンブレム",
    champ: { name: "星見守 カグラ", look: "leader2",
             party: [["ボヤッコ", 38], ["ワンヒノ", 38], ["メラボヤ", 40], ["ホノワン", 40]], money: 5000 },
    champTalk: ["カグラ「山が赤く染まる一瞬、星と大地の境が消える。",
                "　最後に必要なのは炎ではない。迷わず選ぶ意志だ。"],
    champWin: ["カグラ「七つの谷がつながった。「夕映エンブレム」を。"],
    people: [
      { x: 11, y: 11, look: "oldman", name: "ふるどうぐや",
        talk: ["7つの エンブレムが そろえば",
               "星環の都の 山岳祭に 参加できる。"] },
    ],
  },
];

const ROUTE_DEFS = [
  { id: "route1", name: "うみぞいの みち", south: "harbor", southXY: [7, 1], north: "sand", northXY: [7, 12],
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TTTTT,,,TTTTT,TT",
      "T,,TF,,,,,,,,,,T",
      "TT,,,,,,F,,,,,,T",
      "TT,,,,,,,,,,,,,T",
      "TT,,,,,R,,,,,,TT",
      "TT,,F\"\",RRR,,,,T",
      "TT,,\",,\"\"\",,,,TT",
      "TT,,,\"\"\"\",,,,,TT",
      "TT,,,,\"F,,,,,,,T",
      "TT,S,\",WWW~,,,TT",
      "TT,,,\",WWW~~,,TT",
      "TT,,,,\",WW~,,,,T",
      "T,,,,,,\",,,,T,TT",
      "TTTTTT,,,,,,TTTT",
      "TTTTTT,,TTTTTTTT",
    ],
    lv: [8, 12],
    rival: { party: [["サカナビ", 12], ["シズクン", 13]], money: 800,
      talk: ["フィロア「そのコンパス、葉っぱみたいに光るんだね。",
             "　おれは フィロア。湖のむこうから 山道を測りにきた。",
             "　七つの谷を一本の地図にするのが 夢なんだ。",
             "　きみとガオンの歩き方、しょうぶで 見せてよ！"],
      win: ["フィロア「負けたけど、きみの道筋は おぼえたよ！"],
      after: ["フィロア「地図の続きは 北の谷で。風の音を 目印にね。"] },
    list: [["ネズミン", 8, 11, 14], ["カニポン", 8, 11, 14], ["トリッピ", 8, 11, 12],
           ["シズクン", 8, 12, 12], ["マルミィ", 8, 11, 10], ["ムシリン", 8, 11, 10],
           ["サカナビ", 9, 12, 10], ["クモッコ", 9, 12, 8], ["ヨルドリ", 9, 12, 6], ["アワミィ", 8, 11, 8], ["コイヌン", 8, 11, 10],
           ["ムシコロ", 8, 11, 10], ["シャチマル", 10, 13, 3]],
    trainers: [
      { x: 4, y: 9, dir: "right", look: "boy", name: "つりびと ハル", hair: "beanie",
        party: [["サカナビ", 10], ["カニポン", 11]], money: 400,
        talk: ["うみの ガオンは にげあしが はやいぜ！"], win: ["やられた！"],
        after: ["みずの ガオンには でんきが きくよ。"] },
    ] },
  { id: "route2", name: "さばくの みち", south: "sand", southXY: [7, 1], north: "forest", northXY: [7, 12],
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TTTT,T,,T,,TT,TT",
      "T,,,,,,,,,,,T,,T",
      "T,,,,,,,R,,,,,,T",
      "TT,R,,,R,,,,,,,T",
      "T~R,,,,,,,,,,,TT",
      "TT~,,,,~,,,,,,,T",
      "TT,~~,~,,,RR,,,T",
      "TT,~~~~,,\",R,,,T",
      "TT~~~~~~\",\"\"\",TT",
      "T,,S~~~~\",\"\"\"\"TT",
      "T,,~~~~,\",\"\"\",,T",
      "TT,~~~,,\",,,\",TT",
      "TT,~~~,,T\"T,,\"TT",
      "TT~T~~,,TT\"T,,TT",
      "TTT~~T,,TTTTTTTT",
    ],
    lv: [14, 18],
    list: [["スナムシ", 14, 17, 16], ["ツチマル", 14, 17, 14], ["イワッコ", 14, 17, 14],
           ["サボチク", 15, 18, 10], ["ダンゴロン", 14, 17, 12], ["アリンコ", 14, 17, 12],
           ["ヒバナリ", 15, 18, 10], ["モグポン", 15, 18, 12], ["ツチノコ", 14, 17, 12], ["イシゴロ", 15, 18, 10],
           ["ビリタマ", 14, 17, 12], ["ドロヌマ", 16, 19, 6], ["タヌポン", 15, 18, 10]],
    trainers: [
      { x: 11, y: 5, dir: "left", look: "hiker", name: "たびの ひと ソウ", hair: "straw",
        party: [["ツチマル", 16], ["スナムシ", 17]], money: 700,
        talk: ["さばくを こえるなら ようじんしな。"], win: ["みごとだ。"],
        after: ["すなの ガオンは くさが にがて。"] },
    ] },
  { id: "route3", name: "モミの 回廊", south: "forest", southXY: [7, 1], north: "stone", northXY: [7, 12],
    rows: [
      "TTTTTT,,\"\"T\"\"TTT",
      "TTT,T,,,\"\"\"TT\"TT",
      "TT,,,\"\",\"\"\"\"\"\"\"T",
      "TT,,\"\",,,\"\"\"\"\"\"\"",
      "TT,,\"\"\",,,\"\"\"\"\"T",
      "T,,\"\",,\"\"T,\"\",,T",
      "T,,F,,,\"\",TT\",TT",
      "TTT,,,,,TT,T,,TT",
      "TT,,======TT,,,T",
      "TT,,,,,,,,,,,,TT",
      "T,,S,,,,,,,,TFTT",
      "T,,,,,,,===T,F,T",
      "TT,,,,,,,,,TT,TT",
      "TT,,,,,,,T,,,TTT",
      "TT,,TT,,TT,TT,TT",
      "TTTTTT,,TTTTTTTT",
    ],
    lv: [20, 24],
    rival: { party: [["スイスイオ", 23], ["ライボルト", 23], ["カニポン", 24]], money: 1800,
      talk: ["フィロア「森では 方位磁針が ぐるぐる回るんだ。",
             "　でもガオンは、根の下の水を感じて 迷わない。",
             "　おれの地図と きみのコンパス、どちらが先に道を見つけるかな？"],
      win: ["フィロア「なるほど…ガオンの歩幅まで 地図に描かないとね。"],
      after: ["フィロア「つぎは 雲の上のシャレーで また会おう！"] },
    list: [["キノコン", 20, 23, 14], ["ムシリン", 20, 23, 12], ["チョウマユ", 20, 23, 12],
           ["ハッパチョ", 21, 24, 10], ["クモッコ", 20, 23, 12], ["ホタリン", 21, 24, 10],
           ["ウリボン", 21, 24, 12], ["タネコロ", 20, 23, 10], ["ヨルネコ", 21, 24, 8], ["リーフィン", 20, 23, 8], ["ハナビィ", 20, 23, 10],
           ["ネムノハ", 22, 25, 6], ["パンダン", 22, 25, 6], ["オバケシ", 21, 24, 8]],
    trainers: [
      { x: 4, y: 12, dir: "up", look: "girl", name: "むしとり シオリ", hair: "twin", skirt: true,
        party: [["カブトン", 22], ["チョウマユ", 22]], money: 900,
        talk: ["もりの むしガオンは かわいいでしょ？"], win: ["まだまだ！"],
        after: ["むしは ほのおが にがて。"] },
    ] },
  { id: "route4", name: "いしきりの みち", south: "stone", southXY: [7, 1], north: "aqua", northXY: [7, 12],
    rows: [
      "TTTTTT,,T.TTTTTT",
      "TT,,TT,..T.,T,TT",
      "T,,RR,,,,..,,,TT",
      "TT,,RR,...,,,,,T",
      "TT,RR,,....,,,TT",
      "TT,,RR......,,TT",
      "TT,,,,R..,\",\"TTT",
      "T,,,,,R,,.\"\",\",T",
      "T,,,,RRR\"\".\"\",TT",
      "T,,,,,R,\"\"\",,\"TT",
      "T,,S,,,\",\",,,,TT",
      "TT,,,,,,,,,,,,,T",
      "TT,,,,,,,,,,,,TT",
      "T,,,,,,,,,,,,,,T",
      "TT,TT,,,,,,,,TTT",
      "TTTTTT,,TTTTTTTT",
    ],
    lv: [26, 30],
    list: [["イワッコ", 26, 29, 14], ["ガンセキ", 27, 30, 10], ["コケゴロ", 26, 29, 12],
           ["ダンゴロン", 26, 29, 12], ["カセキン", 27, 30, 8], ["マグマゴ", 27, 30, 10],
           ["クロネズ", 26, 29, 12], ["カゲポン", 26, 29, 12], ["プラグン", 27, 30, 10], ["ドクロン", 27, 30, 8], ["スミビン", 28, 31, 6],
           ["デンチュウ", 28, 31, 6], ["ジシンヌシ", 29, 32, 4]],
    trainers: [
      { x: 11, y: 9, dir: "left", look: "hiker", name: "いしきり タツ", hair: "beanie",
        party: [["イワッコ", 28], ["ガンセキ", 29]], money: 1200,
        talk: ["いわの ガオンは そう かんたんに くずれん！"], win: ["くずれたか…"],
        after: ["いわには みずと くさが きく。"] },
    ] },
  { id: "route5", name: "水鏡の 桟道", south: "aqua", southXY: [7, 1], north: "sky", northXY: [7, 12],
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TT,,TT,,T\",,T\"\"T",
      "T,,,,,,,,\"\",,\"TT",
      "TT,,,,,,W,\",,\"\"\"",
      "TT,,,,WWWW\",,,\"\"",
      "TT,,,,,WWW,,,,,T",
      "T,,,,,\"\"WW,,,,,T",
      "TT,,,,,\"W,,,,,TT",
      "T,,,,,,,W\",,,,,T",
      "TT,,,,,,,\",,,,TT",
      "TT,S,WW,,,,,,,TT",
      "TTT,WWW,,,,,,,,T",
      "T,,WWW,,,,,,,,TT",
      "TT,WWW,,,,,,,,,T",
      "TT,WWW,,,,T,,,,T",
      "TTTWWT,,TTTTTTTT",
    ],
    lv: [31, 35],
    list: [["クラゲミ", 31, 34, 12], ["シズクン", 31, 34, 12], ["サカナビ", 31, 34, 12],
           ["コオリン", 32, 35, 10], ["ミナモン", 32, 35, 10], ["ラゲドン", 33, 36, 8],
           ["ハネデン", 31, 34, 12], ["ヒツジン", 31, 34, 12], ["タツノコ", 33, 36, 8], ["カバリン", 32, 35, 8], ["ヌシガエル", 34, 37, 4],
           ["ウズシオヌシ", 34, 37, 4]],
    trainers: [
      { x: 4, y: 5, dir: "right", look: "sailor", name: "みずうみの ヨシ", hair: "cap",
        party: [["クラゲミ", 33], ["ミナモン", 34]], money: 1500,
        talk: ["みずうみの ガオンは しずかで つよい。"], win: ["おみごと。"],
        after: ["きたの 白嶺のシャレーは 雪稜に 近い。"] },
    ] },
  { id: "route6", name: "白嶺の 石段", south: "sky", southXY: [7, 1], north: "flame", northXY: [7, 12],
    rows: [
      "TTTTTT,,TTTTTTTT",
      "TT,TT,,,,,RTTTTT",
      "T\"\",\",,,,,R,,,TT",
      "\"\"\"\",,,,,,,,,,TT",
      "T\"\"\"\",,,,,,,T,TT",
      "\"\"\"\"\"\",,,,TTT,,T",
      "T\"\"\"\",,,,,,,T,,T",
      "T\"\",,\",T,,,,,,,T",
      "TT,,,,,T,,,,,,,T",
      "TT,,,,TT,,,,,,,T",
      "T,,S,,,,,,,,,,,T",
      "T,,,,,,R,,,,R,,T",
      "T,,,\"\",,,,,,,RTT",
      "TT,,\"\",,,,,,R,TT",
      "TTTT,\"\",\"TTT,,TT",
      "TTTTTT,,TTTTTTTT",
    ],
    lv: [36, 40],
    rival: { party: [["スイスイオ", 38], ["ライボルト", 38], ["ハサミガニ", 39], ["ミナモン", 40]], money: 3200,
      talk: ["フィロア「見て！ 七つの谷が 地図の上でつながった。",
             "　星環の都の山脈祭で、この道を みんなに見せるんだ。",
             "　その前に、雪稜を越えた おたがいの力を確かめよう！"],
      win: ["フィロア「くやしい！ でも地図の最後は 決勝で描くからな！"],
      after: ["フィロア「星環の都で まってる！ 地図の最後を描こう！"] },
    list: [["ハネデン", 36, 39, 12], ["ソラデン", 37, 40, 10], ["トリッピ", 36, 39, 12],
           ["ソラハネ", 37, 40, 10], ["ヒバナリ", 36, 39, 10], ["ジリジリ", 36, 39, 10],
           ["ライメイ", 38, 41, 6], ["イナヅマル", 37, 40, 8], ["ピリット", 36, 39, 12],
           ["ネコデン", 36, 39, 12], ["ヒノコマ", 36, 39, 8], ["タキビィ", 36, 39, 8],
           ["ボヤッコ", 36, 39, 8]],
    trainers: [
      { x: 11, y: 12, dir: "up", look: "boy", name: "そらの こ カイ", hair: "spiky",
        party: [["ハネデン", 38], ["ソラデン", 39]], money: 1800,
        talk: ["そらの ガオンは はやいぞ！"], win: ["つかまえられた…！"],
        after: ["でんきには じめんが きく。"] },
    ] },
  { id: "route7", name: "星環鉄道沿い", south: "flame", southXY: [7, 1], north: "galaxy", northXY: [8, 14],
    rows: [
      "TTT\"T\",,TTTTTTTT",
      "TTT\"\"\",,,TT,TTTT",
      "T,T\"\"\",,,,,,,T,T",
      "T,,,,\",,,,,,,,TT",
      "TT,,,,,,,,,,,,,T",
      "T,.,,,,,,,,,,,TT",
      "......,,,,,,RRTT",
      "..,..,.,,,,R,,TT",
      "TT..,..,,,,,,,TT",
      "T,.....,,,,,,R,T",
      "\",,S,,,,,,,,R,,T",
      "\"\"\"\",,,,,,,\"\",,T",
      "T\"\"\",,,,R,\"\"\"\",T",
      "\"\"\",,,,,,,,\"\"T,T",
      "\"\"\",,T,,RTT\"\"TTT",
      "\"\"TTTT,,TTT\"TTTT",
    ],
    lv: [41, 45],
    list: [["メラボヤ", 41, 44, 10], ["ホノワン", 41, 44, 10], ["マグマゴ", 41, 44, 10],
           ["カガリビ", 42, 45, 8], ["ヨルネコ", 41, 44, 10], ["シャドネコ", 43, 46, 6],
           ["ムラサキビ", 42, 45, 8], ["オニイワ", 43, 46, 6], ["カマキリン", 42, 45, 8],
           ["スズメバチン", 42, 45, 8], ["デカネズ", 41, 44, 10], ["ヨルグモ", 42, 45, 8], ["ヤミノヌシ", 44, 47, 3],
           ["フェニクス", 44, 47, 3], ["ヨウガンヌシ", 44, 47, 3]],
    trainers: [
      { x: 4, y: 3, dir: "right", look: "leader2", name: "山道の 案内人", hair: "beanie",
        party: [["メラボヤ", 43], ["シャドネコ", 44], ["ガンセキ", 44]], money: 2500,
        talk: ["大会の 出場者だ。ここで ならしておこう。"], win: ["いい しあいだった！"],
        after: ["星環の都は すぐ そこだ。"] },
    ] },
];

/* --- まちを 組み立てる --- */
for (const t of TOWN_DEFS) {
  const npcs = [];
  const champAt = t.champXY || [7, 9];
  npcs.push({
    x: champAt[0], y: champAt[1], dir: "down", look: t.champ.look, name: t.champ.name,
    trainer: { party: t.champ.party, money: t.champ.money, leader: t.emblem },
    talk: t.champTalk,
    win: t.champWin,
    after: ["つぎの まちで まってるぞ！"],
  });
  for (const p of t.people || []) {
    npcs.push({ x: p.x, y: p.y, dir: "down", look: p.look, name: p.name, talk: p.talk, hair: p.hair, skirt: p.skirt });
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
    hideTileHouses: Boolean(t.hideTileHouses),
    landmarks: t.landmarks || [],
    rows: t.rows || build(TOWN, t.patch),
    warps: (t.warps || townWarps(t.id, t.north, t.south, t.northXY, t.southXY)).concat(t.extraWarps || []),
    signs: [{ x: (t.signXY || [2, 6])[0], y: (t.signXY || [2, 6])[1],
              text: t.signText || [t.name, "山の暮らしと ガオンが息づく土地",
                                    "リーフ・コンパスは 谷守の声を示す"] }],
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
      x: t.x, y: t.y, dir: t.dir, look: t.look, name: t.name, hair: t.hair, skirt: t.skirt,
      trainer: { party: t.party, money: t.money },
      talk: t.talk, win: t.win, after: t.after,
    });
  }
  MAPS[r.id] = {
    name: r.name,
    kind: "out",
    sets: r.id === "route6" ? { ",": "snow" } : undefined,
    rows: r.rows || ROUTE.slice(),
    warps: routeWarps(r.south, r.southXY, r.north, r.northXY),
    signs: [{ x: 3, y: 10, text: [r.name, "でる ガオン　Lv" + r.lv[0] + "〜" + r.lv[1]] }],
    npcs: npcs,
    enc: { rate: 15, list: r.list },
  };
}

/* ============================================================
   星環の都 と かいじょう
============================================================ */
MAPS.galaxy = {
  name: "星環の都",
  kind: "out",
  hideTileHouses: true,
  landmarks: [
    { art: "alpineObservatory", x: 0, y: 0, w: 8, h: 7 },
    { art: "alpineRailStation", x: 8, y: 0, w: 8, h: 6 },
    { art: "alpineTrain", x: 7, y: 7, w: 8, h: 5 },
    { art: "alpineStoneBridge", x: 2, y: 8, w: 6, h: 4 },
  ],
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
    "T,,,,,,,,,,,,,,,",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,,T",
    "TTTTTTTT,,TTTTTT",
  ],
  warps: [
    { x: 15, y: 11, to: "starhill", tx: 1, ty: 6, edge: 1 },
    { x: 7, y: 3, to: "arena", tx: 6, ty: 12 },
    { x: 8, y: 3, to: "arena", tx: 7, ty: 12 },
    { x: 4, y: 7, to: "station", tx: 5, ty: 8, back: { map: "galaxy", x: 4, y: 8 } },
    { x: 11, y: 7, to: "shop", tx: 4, ty: 6, back: { map: "galaxy", x: 11, y: 8 } },
    { x: 8, y: 14, to: "route7", tx: 7, ty: 1, edge: 1 },
    { x: 9, y: 14, to: "route7", tx: 7, ty: 1, edge: 1 },
  ],
  signs: [{ x: 3, y: 9, text: ["星環の都", "七つの谷の道と 高山鉄道が集う場所",
                               "上… 山脈祭 ガオンバトル会場"] }],
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


/* ============================================================
   まちから 枝分かれした 場所（山・森・さばく・川・海・地下・空）
============================================================ */
MAPS.inlet = {
  name: "アーレ湖の 入江",
  kind: "out",
  sets: {",": "grass"},
  rows: [
    "T\"TTTTTTTTTTTTTT",
    ",\"\"\"TTT,TTT,,TTT",
    "TWWWWWW,,,,,,TTT",
    "WWWWWWW,,,~~,,TT",
    "WWWWWW,,,~~~,,,T",
    "T,WWW,,~,~~~,,,T",
    ",,,~,W~,,,,~~,,T",
    "TT~S,W,,,,,,,,,T",
    "T,~~WWW,,,,,,,,T",
    "T,F,WWW,,,,,,,TT",
    "TT,,WWW,,\",,,,,T",
    "TT,,,,,,\"\"\"\",,,T",
    "TT,,,TT,\",\",TTTT",
    "TTTTTTTTTTT\"TTTT",
  ],
  warps: [{ x: 0, y: 6, to: "harbor", tx: 1, ty: 4, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["しおかぜの いりえ","ふねが とおらない しずかな うみ。"] }],
  items: [{ x: 12, y: 8, item: "スーパーネット", flag: "inletBall" }],
  npcs: [{ x: 6, y: 5, dir: "down", look: "sailor", name: "はまべの ひと",
           hair: "cap",
           talk: ["ここは まちの うらの いりえ。","しおかぜが きもちいいだろ？"] }],
  enc: { rate: 15, list: [["サカナビ", 10, 14, 14], ["カニポン", 11, 14, 14], ["シズクン", 12, 14, 12], ["アワミィ", 10, 14, 12], ["クラゲミ", 11, 14, 10], ["シャチマル", 12, 14, 8]] },
};

MAPS.desert = {
  name: "風化石の 牧草地",
  kind: "out",
  sets: {",": "sand","r": "roof"},
  rows: [
    "TTT\"TTTTTTTTTTTT",
    "T\"\"\"R,,T,,TT,T,T",
    "TT\"\"\"R,,R,,T,,TT",
    "TTT\"\"\"RR,,,,~TT~",
    "T,,\"\"\"~~R,,~~~~T",
    "T,,,\",R~,,,~~~,~",
    ",,,,,,,,~~~,~~~~",
    "TT,S,,,,~~~,~~~T",
    "TTT,,,,,,~,~,~TT",
    "TT,,,,,~~~~~~~,T",
    "TT,,,,,R,~~~~,TT",
    "T,,,,,,R,,~~~,,T",
    "TT,T,TTTR,,,~~TT",
    "TTTTTTTTTTTTT~TT",
  ],
  warps: [{ x: 0, y: 6, to: "sand", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["風化石の 牧草地","乾いた風が 古い岩を けずっている。"] }],
  items: [{ x: 11, y: 12, item: "ハイヒール", flag: "desertHeal" }],
  npcs: [{ x: 10, y: 3, dir: "down", look: "hiker", name: "牧草地の 旅人",
           hair: "straw",
           talk: ["この さきは すなばかりだ。","水を もっていくと いい。"] }],
  enc: { rate: 18, list: [["スナムシ", 16, 20, 14], ["ツチマル", 17, 20, 14], ["サボチク", 18, 20, 12], ["ダンゴロン", 16, 20, 12], ["モグポン", 17, 20, 10], ["ヒバナリ", 18, 20, 8]] },
};

MAPS.deepforest = {
  name: "樹海の 薬草道",
  kind: "out",
  rows: [
    "TTTTTTTTTTTTTTTT",
    "TTT,,T,TT,T\"T,TT",
    "T,,,,T,,,,,T\"\"\"\"",
    "TT,,,T,,,,,\",\"\"T",
    "TTT,T,,,,\"\",\"\"\"T",
    "T,TTT\",,,\"\"\"\"\"\"T",
    ",,,,,T\"T\"\"\"\"\",TT",
    "T,,S\"\",TTT\"\"\",\"T",
    "T,T,\"\"T,TT\"\"\"\",T",
    "T,,\",,TT,T\"\",\"TT",
    "TT,,TT,,,\",\",\"TT",
    "TTT,,TT,T\",,F,TT",
    "TT,,T,,TT,TT,,,T",
    "TTTTTTTTTTTTTTTT",
  ],
  warps: [{ x: 0, y: 6, to: "forest", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["ささやきの もり","木の あいだから 声が きこえる…"] }],
  items: [{ x: 13, y: 12, item: "ふしぎのみ", flag: "forestBerry" }],
  npcs: [{ x: 6, y: 4, dir: "down", look: "girl", name: "もりの こ",
           hair: "bun", skirt: true,
           talk: ["しずかに していると、","ガオンの こえが きこえるよ。"] }],
  enc: { rate: 20, list: [["キノコン", 22, 26, 14], ["チョウマユ", 23, 26, 14], ["ホタリン", 24, 26, 12], ["ネムノハ", 22, 26, 12], ["パンダン", 23, 26, 10], ["オバケシ", 24, 26, 8]] },
};

MAPS.cavern = {
  name: "氷河洞",
  kind: "cave",
  sets: { ",": "cave", S: "cave" },
  rows: [
    "XXXXXXXXXXXXXXXX",
    "XXXCXCXXXXCXXXXX",
    "XCCCCCCCCCCCXCXX",
    "XXCCCCCCCCCRCCXX",
    "XXCCCCCCCRCRRCXX",
    "XXXCCCCCCRCCCCXX",
    "CCCCCCCCCRCCCCCX",
    "XCCSCRCCCCCCCCXX",
    "XXCCRRRCCCCCCCCX",
    "XXCRRRRRCRRRRCCX",
    "XCCRCRRRCCRRRCXX",
    "XCCRRRCCCCCCCCCX",
    "XXCXCCXXCXXXCCXX",
    "XXXXXXXXXXXXXXXX",
  ],
  warps: [{ x: 0, y: 6, to: "stone", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["いしの ちかどう","石を きりだした あとの あな。"] }],
  items: [{ x: 13, y: 11, item: "ハイパーネット", flag: "cavernBall" }],
  npcs: [{ x: 5, y: 3, dir: "down", look: "oldman", name: "いしきりの ろうじん",
           hair: "beanie",
           talk: ["ここは わしらが ほった あなじゃ。","おくは くらいから 気を つけろ。"] }],
  enc: { rate: 22, list: [["イワッコ", 28, 32, 14], ["ガンセキ", 29, 32, 14], ["コケゴロ", 30, 32, 12], ["カセキン", 28, 32, 12], ["ドクロン", 29, 32, 10], ["クロネズ", 30, 32, 8]] },
};

MAPS.river = {
  name: "アーレ源流",
  kind: "out",
  rows: [
    "TTTTTTTTTTTTTTTT",
    "TT,TT,,,,,TT,,,T",
    "T,,,T,,,,,,T,TTT",
    "T,,,,,,,,,,\"\",\"\"",
    "T,,,,\",,,,,,\"\"\"\"",
    "TT,,F,\",,,,,,\"T\"",
    ",,F,\"\",\"WWR\"\",\"T",
    "TT,S\",,,WWW,\"\"\"T",
    "T,,,,,,WWWWW,\"TT",
    "TT====,WWWWW\",TT",
    "TT,,,,,WWWW,,,,T",
    "TT,,,R,WWW,,,,,T",
    "TT,T,TR,,TT,,,,T",
    "TTTTTTTTTTTTTTTT",
  ],
  warps: [{ x: 0, y: 6, to: "aqua", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["せせらぎの かわ","石を わたって むこうへ いける。"] }],
  items: [{ x: 13, y: 12, item: "ハイヒール", flag: "riverHeal" }],
  npcs: [{ x: 8, y: 1, dir: "down", look: "boy", name: "かわの こ",
           hair: "beanie",
           talk: ["この 石を わたると 上に いけるよ。","おちないでね。"] }],
  enc: { rate: 16, list: [["シズクン", 33, 37, 14], ["サカナビ", 34, 37, 14], ["ミナモン", 35, 37, 12], ["コオリン", 33, 37, 12], ["ラゲドン", 34, 37, 10], ["タツノコ", 35, 37, 8]] },
};

MAPS.cloud = {
  name: "雲上の 尾根",
  kind: "out",
  rows: [
    "TTTTTTTTTTTTTTTT",
    "TTTT,T,,,T,T,TTT",
    "T,,,,,,,,,,,,,,T",
    "T,,,,,,,,,,,,,TT",
    "TTRR,,,,R,,,,,,T",
    "T,RR,\"\",RRR,,,TT",
    ",,\"\"\"\",,,,,,,,TT",
    "T\"\"S\"\"\",,,,,,,TT",
    "TT\"\"\"\",,,,,,,,TT",
    "TR\"\"\"RR,,,,,,,,T",
    "RT\"\"\",,R,\",,,TTT",
    "T,,\"R\",,\"\"\"\",,TT",
    "TT,TT,,T\"\"\"T,TTT",
    "TTTTTTTTTTTTTTTT",
  ],
  warps: [{ x: 0, y: 6, to: "sky", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["くもの みはらしだい","かいだんを のぼると 雲の 上。"] }],
  items: [{ x: 12, y: 2, item: "ハイパーネット", flag: "cloudBall" }],
  npcs: [{ x: 8, y: 2, dir: "down", look: "leader2", name: "そらを 見る ひと",
           hair: "spiky",
           talk: ["ここからは まちが 一つ 見える。","雲より 上は かぜが つよい。"] }],
  enc: { rate: 18, list: [["ハネデン", 38, 42, 14], ["ソラデン", 39, 42, 14], ["トリッピ", 40, 42, 12], ["ソラハネ", 38, 42, 12], ["イナヅマル", 39, 42, 10], ["ライメイ", 40, 42, 8]] },
};

MAPS.volcano = {
  name: "夕焼け岩稜",
  kind: "out",
  sets: {",": "lava", R: "lavaRock"},
  rows: [
    "TTTTTTTTRRRT\"\"\"T",
    "T,T,,,T,R,,T\"\"\"\"",
    "TT,,,,,RR,,,\"\"\"T",
    "TT,,,,,,R,,\",\",\"",
    "T,,,,R,,R,\",\",TT",
    "TTT,,,,,,,,,,,,T",
    ",,,,,RR,,,,,,,TT",
    "T,,S,,R,,,,RR,TT",
    "T,,,,,,,,.,,R,,T",
    "TT,,\"\"......,TTT",
    "T,,\"\".........,T",
    "TT\",\",\",..,,,,,T",
    "TT,,TT\",,T,,,TTT",
    "TTTTTT\"TTTTTTTTT",
  ],
  warps: [{ x: 0, y: 6, to: "flame", tx: 14, ty: 10, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["ひのやまの ふもと","地めんが あたたかい。"] }],
  items: [{ x: 12, y: 11, item: "ハイヒール", flag: "volcanoHeal" }],
  npcs: [{ x: 6, y: 3, dir: "down", look: "hiker", name: "岩稜の 見張り",
           hair: "beanie",
           talk: ["山の 上は あつくて はいれん。","ふもとで がまんじゃ。"] }],
  enc: { rate: 20, list: [["メラボヤ", 43, 47, 14], ["ホノワン", 44, 47, 14], ["マグマゴ", 45, 47, 12], ["カガリビ", 43, 47, 12], ["ヨウガンヌシ", 44, 47, 10], ["フェニクス", 45, 47, 8]] },
};

MAPS.starhill = {
  name: "星見の 丘",
  kind: "out",
  rows: [
    "TTTTTTTTTTTTTTTT",
    "TTT,TTT,,,,T,TTT",
    "TT,,,TT,,,,,R,,T",
    "T,,TT,,,,,,,RR,T",
    "T,,TT====,,,,,TT",
    "TT,,,,,,,,,,\"\"TT",
    ",,,,,,\",,,,,\"\",T",
    "T,FS,,\"TTTF,,\"\"T",
    "TRT,\"\"\"\"TT,,,TTT",
    "T,R\",\",,\",,,\",,T",
    "TT,,\"\",,,,\"\",,TT",
    "T,,\"\"\"\"\"\"\"\"\"\"\"TT",
    "TTTT,\"\"\"\"\"\"\"T,TT",
    "TTTTTT\"TT\"\"TTTTT",
  ],
  warps: [{ x: 0, y: 6, to: "galaxy", tx: 14, ty: 11, edge: 1 }],
  signs: [{ x: 3, y: 7, text: ["ほしぞらの おか","大会の まえに ひとやすみ。"] }],
  items: [{ x: 8, y: 2, item: "げんきのかたまり", flag: "starRevive" }],
  npcs: [{ x: 10, y: 2, dir: "down", look: "prof", name: "ほしを 見る ひと",
           hair: "bald",
           talk: ["よるに なると 星が よく 見える。","きみの たびも もう すぐ おわりだな。"] }],
  enc: { rate: 16, list: [["ヨルネコ", 45, 50, 14], ["シャドネコ", 46, 50, 14], ["ムラサキビ", 47, 50, 12], ["ヤミノヌシ", 45, 50, 12], ["ヨルグモ", 46, 50, 10], ["オバケシ", 47, 50, 8]] },
};

MAPS.arena = {
  name: "七つの谷 山岳祭",
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
      x: 6, y: 4, dir: "down", look: "leader1", name: "山岳祭の 進行役",
      script: "tournament",
      talk: ["ガオンバトル大会、かいまく！"],
    },
  ],
};

// 町と町のあいだも単調な四角タイルにせず、谷ごとの大きな景観を置く。
const ROUTE_LANDMARKS = {
  mount1: [{ art: "alpineFirCluster", x: 0, y: 1, w: 5, h: 5 }, { art: "alpineTrailStairs", x: 9, y: 8, w: 6, h: 6 }],
  mount2: [{ art: "alpinePond", x: 3, y: 4, w: 8, h: 6 }, { art: "alpineCliff", x: 10, y: 1, w: 5, h: 5 }],
  gate: [{ art: "alpineTrailSign", x: 0, y: 2, w: 5, h: 5 }, { art: "alpineStoneBridge", x: 8, y: 2, w: 6, h: 5 }],
  route1: [{ art: "alpinePond", x: 8, y: 7, w: 7, h: 6 }, { art: "alpineWoodBridge", x: 1, y: 9, w: 6, h: 5 }],
  route2: [{ art: "alpineTerrace", x: 0, y: 4, w: 6, h: 6 }, { art: "alpineTrailSign", x: 10, y: 8, w: 5, h: 5 }],
  route3: [{ art: "alpineFirCluster", x: 8, y: 0, w: 7, h: 6 }, { art: "alpineWaterfall", x: 0, y: 7, w: 6, h: 6 }],
  route4: [{ art: "alpineCliff", x: 8, y: 1, w: 7, h: 6 }, { art: "alpineTrailStairs", x: 0, y: 8, w: 6, h: 6 }],
  route5: [{ art: "alpineStoneBridge", x: 7, y: 3, w: 7, h: 5 }, { art: "alpineFlowerMeadow", x: 0, y: 8, w: 6, h: 5 }],
  route6: [{ art: "alpineSnowFirCluster", x: 0, y: 0, w: 7, h: 6 }, { art: "alpineTrailStairs", x: 9, y: 7, w: 6, h: 6 }],
  route7: [{ art: "alpineTrain", x: 0, y: 4, w: 8, h: 6 }, { art: "alpineObservatory", x: 9, y: 7, w: 7, h: 6 }],
  inlet: [{ art: "alpineBoathouse", x: 7, y: 1, w: 8, h: 7 }],
  deepforest: [{ art: "alpineHerbalist", x: 8, y: 6, w: 7, h: 6 }],
  river: [{ art: "alpineWaterfall", x: 8, y: 1, w: 7, h: 6 }],
  cloud: [{ art: "alpineSnowFirCluster", x: 8, y: 1, w: 7, h: 6 }],
  starhill: [{ art: "alpineObservatory", x: 8, y: 5, w: 7, h: 7 }],
};
for (const [id, landmarks] of Object.entries(ROUTE_LANDMARKS)) {
  if (MAPS[id]) MAPS[id].landmarks = landmarks;
}

export const START = { map: "hut", x: 4, y: 5, dir: "down" };
