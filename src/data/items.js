// ============================================================
//  どうぐ
//   kind: ball / heal / cure / revive / battleUp / key / escape
// ============================================================
export const ITEMS = {
  モンスターボール: { kind: "ball", rate: 1, price: 200, desc: "やせいの モンスターを つかまえる ボール。" },
  スーパーボール: { kind: "ball", rate: 1.5, price: 600, desc: "モンスターボールより つかまえやすい。" },
  ハイパーボール: { kind: "ball", rate: 2, price: 1200, desc: "とても つかまえやすい ボール。" },

  キズぐすり: { kind: "heal", amount: 20, price: 300, desc: "たいりょくを 20 かいふくする。" },
  いいキズぐすり: { kind: "heal", amount: 50, price: 700, desc: "たいりょくを 50 かいふくする。" },
  すごいキズぐすり: { kind: "heal", amount: 200, price: 1500, desc: "たいりょくを 200 かいふくする。" },
  まんたんのくすり: { kind: "heal", amount: 9999, price: 2500, desc: "たいりょくを ぜんぶ かいふくする。" },

  どくけし: { kind: "cure", cure: "どく", price: 100, desc: "どくを なおす。" },
  やけどなおし: { kind: "cure", cure: "やけど", price: 250, desc: "やけどを なおす。" },
  まひなおし: { kind: "cure", cure: "まひ", price: 200, desc: "まひを なおす。" },
  ねむけざまし: { kind: "cure", cure: "ねむり", price: 250, desc: "ねむりを さます。" },
  なんでもなおし: { kind: "cure", cure: "all", price: 600, desc: "すべての じょうたいを なおす。" },

  げんきのかけら: { kind: "revive", ratio: 0.5, price: 1500, desc: "ひんしから 半分の たいりょくで ふっかつ。" },

  あなぬけのヒモ: { kind: "escape", price: 550, desc: "ほらあなから いっしゅんで そとへ でる。" },

  ずかん: { kind: "key", price: 0, desc: "であった モンスターが きろくされる。" },
  みなとバッジ: { kind: "key", price: 0, desc: "みなとジムの あかし。" },
  かざんバッジ: { kind: "key", price: 0, desc: "かざんジムの あかし。" },
};

export function item(name) { return ITEMS[name] || { kind: "key", price: 0, desc: "" }; }
export function isKey(name) { return item(name).kind === "key"; }

// ショップの しなぞろえ
export const SHOP_LIST = [
  "モンスターボール", "スーパーボール", "キズぐすり", "いいキズぐすり",
  "どくけし", "まひなおし", "やけどなおし", "ねむけざまし", "あなぬけのヒモ",
];
