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
  "リーフ・コンパス": { kind: "key", price: 0, desc: "葉脈の光で、つぎに声を聞くべき土地を示す。" },
  "湖風エンブレム": { kind: "key", price: 0, desc: "アーレ湖港で、水と風の声を聞いた証。" },
  "陽刻エンブレム": { kind: "key", price: 0, desc: "陽だまり棚田で、石と暮らしを支えた証。" },
  "森響エンブレム": { kind: "key", price: 0, desc: "モミ響きの森で、根のつながりを知った証。" },
  "石笛エンブレム": { kind: "key", price: 0, desc: "石笛の峡谷で、山の響きを聞いた証。" },
  "水鏡エンブレム": { kind: "key", price: 0, desc: "水鏡の入江で、波と歩調を合わせた証。" },
  "雪翼エンブレム": { kind: "key", price: 0, desc: "白嶺のシャレーで、雪稜を越えた証。" },
  "夕映エンブレム": { kind: "key", price: 0, desc: "夕映え高原で、迷わず道を選んだ証。" },
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
  "湖風エンブレム", "陽刻エンブレム", "森響エンブレム", "石笛エンブレム",
  "水鏡エンブレム", "雪翼エンブレム", "夕映エンブレム",
];
