// ============================================================
//  どうぐ
//   kind: net(つかまえる) / heal / cure / revive / escape / key
// ============================================================
export const ITEMS = {
  "ラグ・ネット": { kind: "ball", rate: 1, price: 200, desc: "のびちぢみする あみ。ガオンを つかまえる。" },
  "スーパーネット": { kind: "ball", rate: 1.5, price: 600, desc: "あみ目が こまかく、つかまえやすい。" },
  "ハイパーネット": { kind: "ball", rate: 2, price: 1200, desc: "どんな ガオンも のがさない じまんの あみ。" },

  "ヒールジェル": { kind: "heal", amount: 20, price: 300, desc: "たいりょくを 20 かいふくする ジェル。" },
  "ハイヒール": { kind: "heal", amount: 50, price: 700, desc: "たいりょくを 50 かいふくする。" },
  "スーパーヒール": { kind: "heal", amount: 200, price: 1500, desc: "たいりょくを 200 かいふくする。" },
  "フルヒール": { kind: "heal", amount: 9999, price: 2500, desc: "たいりょくを ぜんぶ かいふくする。" },

  "げどくそう": { kind: "cure", cure: "どく", price: 100, desc: "どくを なおす くさ。" },
  "ひやしそう": { kind: "cure", cure: "やけど", price: 250, desc: "やけどを なおす くさ。" },
  "しびれどめ": { kind: "cure", cure: "まひ", price: 200, desc: "まひを なおす。" },
  "めざましそう": { kind: "cure", cure: "ねむり", price: 250, desc: "ねむりを さます かおりの くさ。" },
  "オールキュア": { kind: "cure", cure: "all", price: 600, desc: "すべての じょうたいを なおす。" },

  "リカバーのみ": { kind: "revive", ratio: 0.5, price: 1500, desc: "ひんしから 半分の たいりょくで ふっかつ。" },
  "ぬけみちいし": { kind: "escape", price: 550, desc: "ほらあなから いっしゅんで そとへ でる。" },

  /* --- たいせつな もの --- */
  "ガオンずかん": { kind: "key", price: 0, desc: "であった ガオンが きろくされる。" },
  "リーフ・コンパス": { kind: "key", price: 0, desc: "やまの おくで 見つけた 木の葉の コンパス。山を でる ゆるし。" },
  "みなとエンブレム": { kind: "key", price: 0, desc: "ハーバー・タウンの あかし。" },
  "すなエンブレム": { kind: "key", price: 0, desc: "サンド・タウンの あかし。" },
  "もりエンブレム": { kind: "key", price: 0, desc: "フォレスト・タウンの あかし。" },
  "いしエンブレム": { kind: "key", price: 0, desc: "ストーン・タウンの あかし。" },
  "みずうみエンブレム": { kind: "key", price: 0, desc: "アクア・タウンの あかし。" },
  "そらエンブレム": { kind: "key", price: 0, desc: "スカイ・タウンの あかし。" },
  "ほのおエンブレム": { kind: "key", price: 0, desc: "フレイム・タウンの あかし。" },
  "たいかいパス": { kind: "key", price: 0, desc: "ガオンバトル大会の しゅつじょうけん。" },
};

export function item(name) { return ITEMS[name] || { kind: "key", price: 0, desc: "" }; }
export function isKey(name) { return item(name).kind === "key"; }

// ショップの しなぞろえ
export const SHOP_LIST = [
  "ラグ・ネット", "スーパーネット", "ヒールジェル", "ハイヒール",
  "げどくそう", "しびれどめ", "ひやしそう", "めざましそう", "ぬけみちいし",
];

// 7つの エンブレム（大会の しゅつじょうけん）
export const EMBLEMS = [
  "みなとエンブレム", "すなエンブレム", "もりエンブレム", "いしエンブレム",
  "みずうみエンブレム", "そらエンブレム", "ほのおエンブレム",
];
