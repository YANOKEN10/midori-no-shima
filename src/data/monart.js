// ============================================================
//  ガオンの ドットえ（32x32）
//   ぜんぶ monsprite.js の パーツから 組み立てています。
// ============================================================
import { MORE } from "./species_more.js";
import { buildSprite, buildHandSprite } from "./monsprite.js";
import { HAND } from "./monhand.js";
import { PIX } from "./monpix.js";

// はじめから いた 23ひきの レシピ
const BASE = {
  リーフィン:   ["s", { body: "ball", crest: "leaf", eye: "round", mouth: "smile", pat: "belly" }],
  リーフォード: ["m", { body: "plant", crest: "leaf", ear: "fin", eye: "round", mouth: "line", pat: "band" }],
  フォレスタ:   ["l", { body: "drake", crest: "fan", ear: "side", wing: "big", tail: "long", eye: "angry", mouth: "fang", pat: "back" }],

  ヒノコマ:     ["s", { body: "puppy", crest: "flame", ear: "cat", tail: "puff", eye: "round", mouth: "fang", pat: "belly" }],
  ボウエン:     ["m", { body: "quad", crest: "flame", ear: "cat", tail: "puff", eye: "angry", mouth: "fang", pat: "stripe" }],
  エンブレイズ: ["l", { body: "beast", crest: "crown", ear: "horn", wing: "big", tail: "fan", eye: "angry", mouth: "fang", pat: "back" }],

  アワミィ:     ["s", { body: "ball", ear: "fin", eye: "big", mouth: "smile", pat: "belly" }],
  ウズマリン:   ["m", { body: "fish", crest: "fan", ear: "fin", eye: "round", mouth: "line", pat: "stripe" }],
  タイダルオ:   ["l", { body: "jelly", crest: "crown", wing: "fin", eye: "glow", mouth: "open", pat: "band" }],

  ネズミン:     ["s", { body: "puppy", ear: "round", tail: "long", eye: "round", mouth: "fang", pat: "belly" }],
  デカネズ:     ["m", { body: "quad", ear: "round", crest: "spike", tail: "long", eye: "angry", mouth: "fang", pat: "stripe" }],

  トリッピ:     ["s", { body: "bird", wing: "small", eye: "round", mouth: "beak", pat: "belly" }],
  ソラハネ:     ["m", { body: "bird", crest: "fan", wing: "big", tail: "fan", eye: "angry", mouth: "beak", pat: "stripe" }],

  ムシコロ:     ["s", { body: "worm", crest: "antenna", eye: "dot", mouth: "line", pat: "band" }],
  ギガビート:   ["m", { body: "bug", crest: "horns", wing: "bug", eye: "angry", mouth: "fang", pat: "plate" }],

  ピリット:     ["s", { body: "ball", crest: "antenna", eye: "round", mouth: "smile", pat: "band" }],
  ライボルト:   ["m", { body: "quad", crest: "spike", ear: "cat", tail: "long", eye: "angry", mouth: "fang", pat: "stripe" }],

  ツチノコ:     ["s", { body: "puppy", ear: "round", eye: "closed", mouth: "line", pat: "belly" }],
  ドリルモグ:   ["m", { body: "beast", crest: "spike", ear: "round", eye: "closed", mouth: "fang", pat: "back" }],

  イシゴロ:     ["l", { body: "rock", eye: "dot", mouth: "none", pat: "spot" }],

  ヨルネコ:     ["s", { body: "puppy", ear: "cat", tail: "long", eye: "glow", mouth: "fang", pat: "band" }],
  シャドネコ:   ["m", { body: "beast", ear: "cat", crest: "spike", tail: "long", eye: "glow", mouth: "fang", pat: "stripe" }],

  ヌシガエル:   ["l", { body: "blob", ear: "side", eye: "big", mouth: "open", pat: "band" }],
};

const ART = {};
for (const name of Object.keys(BASE)) {
  const [size, recipe] = BASE[name];
  ART[name] = buildSprite(Object.assign({ size: size }, recipe));
}

// パーツから 組み立てる ガオンたち
for (const e of MORE) {
  const name = e[0], stage = e[4], recipe = e[7];
  const size = stage === 1 ? "s" : stage === 2 ? "m" : "l";
  if (!ART[name]) ART[name] = buildSprite(Object.assign({ size: size }, recipe));
}

// 手で うった ドットえが ある ガオンは そちらを つかう
for (const name of Object.keys(HAND)) ART[name] = buildHandSprite(HAND[name]);

// 絵から おこした ドットえ（その えの いろを そのまま つかう）
const PAL = {};
for (const name of Object.keys(PIX)) {
  const p = PIX[name];
  ART[name] = p.rows;
  PAL[name] = p.pal;
}
export const MONPAL = PAL;

export const MONART = ART;
export function mirror(rows8) {
  return rows8.map((r) => r + r.split("").reverse().join(""));
}
