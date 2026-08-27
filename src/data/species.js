// ============================================================
//  モンスター ずかん（ぜんぶ オリジナルの いきものです）
//   base : たいりょく・こうげき・ぼうぎょ・すばやさ・とくしゅ
//   learn: [レベル, わざ]
//   evo  : { lv:レベル, to:"なまえ" }
// ============================================================
export const SPECIES = {
  リーフィン: {
    no: 1, types: ["くさ"], base: { hp: 45, atk: 49, def: 49, spd: 45, spc: 65 },
    catch: 45, exp: 64, evo: { lv: 16, to: "リーフォード" },
    learn: [[1, "たいあたり"], [1, "なきごえ"], [7, "つるのムチ"], [13, "やどりぎ"], [20, "はっぱカッター"], [27, "こうごうせい"], [34, "ソーラーリーフ"]],
    dex: "あたまの わかばで ひかりを あつめる。げんきな ときほど よく そだつ。",
  },
  リーフォード: {
    no: 2, types: ["くさ"], base: { hp: 60, atk: 62, def: 63, spd: 60, spc: 80 },
    catch: 45, exp: 141, evo: { lv: 32, to: "フォレスタ" },
    learn: [[1, "たいあたり"], [1, "つるのムチ"], [15, "やどりぎ"], [22, "はっぱカッター"], [30, "こうごうせい"], [38, "ソーラーリーフ"]],
    dex: "せなかの はっぱが かたくなり、たてのように つかう。もりの みはりやく。",
  },
  フォレスタ: {
    no: 3, types: ["くさ"], base: { hp: 80, atk: 82, def: 83, spd: 80, spc: 100 },
    catch: 45, exp: 208,
    learn: [[1, "はっぱカッター"], [1, "たいあたり"], [25, "こうごうせい"], [36, "ソーラーリーフ"], [44, "すてみタックル"]],
    dex: "からだじゅうから きのみの かおりが する。ちかづくと きぶんが よくなる。",
  },

  ヒノコマ: {
    no: 4, types: ["ほのお"], base: { hp: 39, atk: 52, def: 43, spd: 65, spc: 60 },
    catch: 45, exp: 65, evo: { lv: 16, to: "ボウエン" },
    learn: [[1, "ひっかく"], [1, "なきごえ"], [9, "ひのこ"], [16, "でんこうせっか"], [25, "ひばしら"], [34, "かえんほうしゃ"]],
    dex: "しっぽの ひが きえると げんきが なくなる。ねるときも もえている。",
  },
  ボウエン: {
    no: 5, types: ["ほのお"], base: { hp: 58, atk: 64, def: 58, spd: 80, spc: 80 },
    catch: 45, exp: 142, evo: { lv: 32, to: "エンブレイズ" },
    learn: [[1, "ひっかく"], [1, "ひのこ"], [18, "でんこうせっか"], [27, "ひばしら"], [36, "かえんほうしゃ"], [42, "すてみタックル"]],
    dex: "たてがみが もえあがると、あたりの きおんが ぐんと あがる。",
  },
  エンブレイズ: {
    no: 6, types: ["ほのお"], base: { hp: 78, atk: 84, def: 78, spd: 100, spc: 109 },
    catch: 45, exp: 209,
    learn: [[1, "ひのこ"], [1, "ひっかく"], [30, "もえるつばさ"], [38, "かえんほうしゃ"], [46, "すてみタックル"]],
    dex: "ふたつの つのから ほのおを ふきだす。おこると いわも とけるという。",
  },

  アワミィ: {
    no: 7, types: ["みず"], base: { hp: 44, atk: 48, def: 65, spd: 43, spc: 64 },
    catch: 45, exp: 66, evo: { lv: 16, to: "ウズマリン" },
    learn: [[1, "たいあたり"], [1, "しっぽふり"], [8, "みずでっぽう"], [15, "かたくなる"], [22, "バブルこうせん"], [31, "うずしお"], [39, "ハイドロなみ"]],
    dex: "ほおぶくろに みずを ためている。びっくりすると あわを ふきだす。",
  },
  ウズマリン: {
    no: 8, types: ["みず"], base: { hp: 59, atk: 63, def: 80, spd: 58, spc: 80 },
    catch: 45, exp: 143, evo: { lv: 32, to: "タイダルオ" },
    learn: [[1, "みずでっぽう"], [1, "しっぽふり"], [18, "バブルこうせん"], [26, "かたくなる"], [34, "うずしお"], [41, "ハイドロなみ"]],
    dex: "みみの ひれで みずの ながれを よむ。かわの ながれには まけない。",
  },
  タイダルオ: {
    no: 9, types: ["みず"], base: { hp: 79, atk: 83, def: 100, spd: 78, spc: 105 },
    catch: 45, exp: 210,
    learn: [[1, "みずでっぽう"], [1, "バブルこうせん"], [30, "うずしお"], [40, "ハイドロなみ"], [46, "じしん"]],
    dex: "せなかから おおなみを おこす。みなとの ふねを まもってくれる。",
  },

  ネズミン: {
    no: 10, types: ["ノーマル"], base: { hp: 30, atk: 56, def: 35, spd: 72, spc: 25 },
    catch: 255, exp: 57, evo: { lv: 20, to: "デカネズ" },
    learn: [[1, "たいあたり"], [1, "しっぽふり"], [7, "かみつく"], [14, "でんこうせっか"], [23, "みだれづき"], [30, "すてみタックル"]],
    dex: "どこにでも いる。まえばで かたい きのみも かじって われる。",
  },
  デカネズ: {
    no: 11, types: ["ノーマル"], base: { hp: 55, atk: 81, def: 60, spd: 97, spc: 50 },
    catch: 127, exp: 116,
    learn: [[1, "たいあたり"], [1, "かみつく"], [24, "みだれづき"], [32, "でんこうせっか"], [40, "すてみタックル"]],
    dex: "なわばりを あらす ものには ようしゃしない。はしる はやさは ぴかいち。",
  },

  トリッピ: {
    no: 12, types: ["ノーマル"], base: { hp: 40, atk: 45, def: 40, spd: 56, spc: 35 },
    catch: 255, exp: 55, evo: { lv: 20, to: "ソラハネ" },
    learn: [[1, "たいあたり"], [1, "なきごえ"], [9, "すなかけ"], [17, "でんこうせっか"], [25, "みだれづき"], [33, "すてみタックル"]],
    dex: "まだ とおくまでは とべない。はねを ばたつかせて すなを まきあげる。",
  },
  ソラハネ: {
    no: 13, types: ["ノーマル"], base: { hp: 63, atk: 70, def: 55, spd: 91, spc: 50 },
    catch: 120, exp: 113,
    learn: [[1, "でんこうせっか"], [1, "すなかけ"], [26, "みだれづき"], [35, "かみつく"], [44, "すてみタックル"]],
    dex: "そらの たかい ところを まわりながら えものを さがしている。",
  },

  ムシコロ: {
    no: 14, types: ["むし"], base: { hp: 45, atk: 30, def: 35, spd: 45, spc: 20 },
    catch: 255, exp: 53, evo: { lv: 12, to: "ギガビート" },
    learn: [[1, "たいあたり"], [1, "いとをはく"], [6, "むしくい"], [11, "どくばり"]],
    dex: "はっぱを たべて そだつ。てきに あうと いとを はいて にげる。",
  },
  ギガビート: {
    no: 15, types: ["むし"], base: { hp: 65, atk: 90, def: 80, spd: 75, spc: 45 },
    catch: 90, exp: 134,
    learn: [[1, "むしくい"], [1, "いとをはく"], [16, "シザーカット"], [24, "かたくなる"], [33, "どくばり"], [40, "じならし"]],
    dex: "おおきな つのは いわも くだく。もりの おうじゃと よばれている。",
  },

  ピリット: {
    no: 16, types: ["でんき"], base: { hp: 40, atk: 40, def: 40, spd: 75, spc: 70 },
    catch: 190, exp: 82, evo: { lv: 22, to: "ライボルト" },
    learn: [[1, "でんきショック"], [1, "しっぽふり"], [10, "でんじは"], [18, "スパークボール"], [26, "でんこうせっか"], [34, "１０まんボルト"]],
    dex: "からだに でんきを ためこむ。さわると ぱちぱちと はねる。",
  },
  ライボルト: {
    no: 17, types: ["でんき"], base: { hp: 60, atk: 65, def: 60, spd: 105, spc: 95 },
    catch: 75, exp: 152,
    learn: [[1, "でんきショック"], [1, "でんじは"], [24, "スパークボール"], [34, "でんこうせっか"], [42, "１０まんボルト"]],
    dex: "かみなりぐもを おいかけて はしる。せなかの もようが ひかる。",
  },

  ツチノコ: {
    no: 18, types: ["じめん"], base: { hp: 50, atk: 60, def: 55, spd: 40, spc: 30 },
    catch: 190, exp: 73, evo: { lv: 24, to: "ドリルモグ" },
    learn: [[1, "たいあたり"], [1, "すなかけ"], [10, "いわおとし"], [19, "じならし"], [28, "かたくなる"], [36, "じしん"]],
    dex: "つちの なかを ほって くらす。ひかりが にがてで、よるに でてくる。",
  },
  ドリルモグ: {
    no: 19, types: ["じめん"], base: { hp: 70, atk: 95, def: 80, spd: 60, spc: 45 },
    catch: 70, exp: 149,
    learn: [[1, "じならし"], [1, "すなかけ"], [26, "ドリルアタック"], [35, "いわおとし"], [44, "じしん"]],
    dex: "はなの ドリルで いわを けずる。トンネルを ほるのを てつだってくれる。",
  },

  イシゴロ: {
    no: 20, types: ["じめん"], base: { hp: 60, atk: 80, def: 100, spd: 20, spc: 30 },
    catch: 150, exp: 96,
    learn: [[1, "たいあたり"], [1, "かたくなる"], [12, "いわおとし"], [22, "じならし"], [33, "じしん"], [40, "すてみタックル"]],
    dex: "ほら穴の いわに まぎれている。うごかないので いわと まちがえられる。",
  },

  ヨルネコ: {
    no: 21, types: ["やみ"], base: { hp: 45, atk: 60, def: 45, spd: 80, spc: 55 },
    catch: 150, exp: 88, evo: { lv: 28, to: "シャドネコ" },
    learn: [[1, "ひっかく"], [1, "にらみつける"], [11, "かげぬい"], [20, "かみつく"], [29, "さいみんじゅつ"], [37, "よるのつめ"]],
    dex: "よるに なると めが ひかる。かげの なかを すべるように あるく。",
  },
  シャドネコ: {
    no: 22, types: ["やみ"], base: { hp: 70, atk: 90, def: 65, spd: 110, spc: 80 },
    catch: 60, exp: 158,
    learn: [[1, "かげぬい"], [1, "にらみつける"], [30, "さいみんじゅつ"], [36, "ゆめくい"], [45, "よるのつめ"], [50, "くろいきり"]],
    dex: "つきの ない よるにしか すがたを みせない。かげと まざって きえる。",
  },

  ヌシガエル: {
    no: 23, types: ["みず"], base: { hp: 105, atk: 95, def: 95, spd: 55, spc: 95 },
    catch: 20, exp: 220,
    learn: [[1, "みずでっぽう"], [1, "かみつく"], [30, "うずしお"], [38, "じしん"], [46, "ハイドロなみ"], [52, "ねむる"]],
    dex: "ぬまの ぬしと つたわる おおガエル。ひとの ことばが わかるらしい。",
  },
};


/* ============================================================
   あたらしい モンスターたち（species_more.js）を くみこむ
   ・のうりょくは「やくわり」と「しんかの だんかい」から けいさん
   ・わざは タイプごとの ひょうから じどうで くみたてる
============================================================ */
import { MORE } from "./species_more.js";

const ROLE_MIX = {
  atk: { hp: 0.17, atk: 0.29, def: 0.18, spd: 0.20, spc: 0.16 },
  spc: { hp: 0.17, atk: 0.15, def: 0.18, spd: 0.20, spc: 0.30 },
  def: { hp: 0.20, atk: 0.18, def: 0.31, spd: 0.11, spc: 0.20 },
  spd: { hp: 0.16, atk: 0.22, def: 0.14, spd: 0.31, spc: 0.17 },
  bal: { hp: 0.20, atk: 0.20, def: 0.20, spd: 0.20, spc: 0.20 },
  hp:  { hp: 0.31, atk: 0.20, def: 0.20, spd: 0.11, spc: 0.18 },
};

// なまえから きまる ちいさな ばらつき（まいかい おなじ けっか）
function seed(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function statsFor(name, role, stage, isFinal) {
  const total = stage === 1 ? 305 : stage === 2 ? (isFinal ? 455 : 400)
              : stage === 3 ? 500 : stage === 9 ? 560 : 420;
  const mix = ROLE_MIX[role] || ROLE_MIX.bal;
  const h = seed(name);
  const keys = ["hp", "atk", "def", "spd", "spc"];
  const out = {};
  keys.forEach((k, i) => {
    const wobble = (((h >> (i * 3)) & 7) - 3.5) * 0.02;
    out[k] = Math.max(20, Math.round(total * mix[k] * (1 + wobble)));
  });
  return out;
}

const POOL = {
  "ノーマル": { weak: "たいあたり", mid: "かみつく", strong: "すてみタックル", status: "なきごえ", extra: "みだれづき" },
  "くさ":     { weak: "つるのムチ", mid: "はっぱカッター", strong: "ソーラーリーフ", status: "やどりぎ", extra: "こうごうせい" },
  "ほのお":   { weak: "ひのこ", mid: "ひばしら", strong: "かえんほうしゃ", status: "にらみつける", extra: "もえるつばさ" },
  "みず":     { weak: "みずでっぽう", mid: "バブルこうせん", strong: "ハイドロなみ", status: "かたくなる", extra: "うずしお" },
  "でんき":   { weak: "でんきショック", mid: "スパークボール", strong: "１０まんボルト", status: "でんじは", extra: "でんこうせっか" },
  "じめん":   { weak: "すなかけ", mid: "じならし", strong: "じしん", status: "かたくなる", extra: "いわおとし" },
  "むし":     { weak: "むしくい", mid: "どくばり", strong: "シザーカット", status: "いとをはく", extra: "かたくなる" },
  "やみ":     { weak: "かげぬい", mid: "よるのつめ", strong: "ゆめくい", status: "さいみんじゅつ", extra: "くろいきり" },
};
const ROLE_MOVE = { atk: "みだれづき", spc: "なきごえ", def: "かたくなる", spd: "でんこうせっか", bal: "かみつく", hp: "ねむる" };

function learnFor(type, role, stage) {
  const P = POOL[type] || POOL["ノーマル"];
  const s = stage === 1 ? 0 : stage === 2 ? 2 : stage === 3 ? 5 : 1;
  const list = [
    [1, "たいあたり"],
    [1, P.weak],
    [7 + s, P.status],
    [13 + s, ROLE_MOVE[role] || "かみつく"],
    [19 + s, P.mid],
    [27 + s, P.extra],
    [34 + s, P.strong],
  ];
  if (stage === 3 || stage === 9) list.push([44 + s, "すてみタックル"]);
  return list;
}

let nextNo = 24;
const famCount = {};
const famPal = {};
for (const e of MORE) {
  const name = e[0], t1 = e[1], t2 = e[2], role = e[3], stage = e[4];
  const evoTo = e[5], evoLv = e[6], art = e[7], dex = e[8];
  const isFinal = !evoTo;
  // かぞく（しんかの ライン）ごとに いろちがいを わりあてる
  if (stage <= 1) {
    famCount[t1] = (famCount[t1] || 0) + 1;
    famPal[t1] = ["", "2", "3"][(famCount[t1] - 1) % 3];
  }
  const pal = t1 + (famPal[t1] || "");
  SPECIES[name] = {
    pal: pal,
    no: nextNo++,
    types: t2 ? [t1, t2] : [t1],
    base: statsFor(name, role, stage, isFinal),
    catch: stage === 1 ? 190 : stage === 2 ? (isFinal ? 80 : 105) : stage === 3 ? 45 : stage === 9 ? 12 : 125,
    exp: stage === 1 ? 62 : stage === 2 ? (isFinal ? 160 : 145) : stage === 3 ? 212 : stage === 9 ? 240 : 132,
    evo: evoTo ? { lv: evoLv, to: evoTo } : undefined,
    learn: learnFor(t1, role, stage),
    dex: dex,
    art: art,
    role: role,
    stage: stage,
  };
}

export const DEX_ORDER = Object.keys(SPECIES).sort((a, b) => SPECIES[a].no - SPECIES[b].no);
export const DEX_TOTAL = DEX_ORDER.length;

// でんせつの ガオンは のうりょくを 手で きめる
const LEGEND = {
  "ラテット": { hp: 100, atk: 125, def: 100, spd: 110, spc: 105 },
  "ディーナ": { hp: 85, atk: 95, def: 80, spd: 138, spc: 110 },
  "メロロン": { hp: 145, atk: 95, def: 115, spd: 55, spc: 95 },
};
for (const [n, b] of Object.entries(LEGEND)) {
  if (SPECIES[n]) { SPECIES[n].base = b; SPECIES[n].catch = 10; SPECIES[n].exp = 250; }
}

export function species(name) { return SPECIES[name] || SPECIES["ネズミン"]; }
// その モンスターを ぬる いろセット

// そえいろ：からだの 本いろ とは べつに、つの・はね・しっぽ に つかう いろ。
// 2つめの タイプが あれば その いろ、なければ タイプごとの きまった あいて。
const ACCENT_OF = {
  "ノーマル": "ほのお", "くさ": "ほのお", "ほのお": "でんき", "みず": "でんき",
  "でんき": "みず", "じめん": "くさ", "むし": "でんき", "やみ": "でんき",
};
export function accentOf(spc) {
  if (!spc) return "ほのお";
  const t = spc.types || [];
  if (t[1]) return t[1];
  return ACCENT_OF[t[0]] || "ほのお";
}

export function palOf(sp) { return (sp && (sp.pal || (sp.types && sp.types[0]))) || "ノーマル"; }
export function nameByNo(no) { return DEX_ORDER.find((n) => SPECIES[n].no === no) || ""; }
