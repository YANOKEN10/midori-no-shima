// ============================================================
//  わざ
//   cat : "phys"=ぶつり / "spec"=とくしゅ / "stat"=へんか
//   fx  : おまけの こうか
// ============================================================
export const MOVES = {
  たいあたり:      { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "からだごと ぶつかる。" },
  ひっかく:        { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "つめで ひっかく。" },
  でんこうせっか:  { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 30, pri: 1, desc: "かならず 先に うごける。" },
  れんぞくパンチ:  { type: "ノーマル", cat: "phys", pow: 18, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つづけて たたく。" },
  すてみタックル:  { type: "ノーマル", cat: "phys", pow: 100, acc: 90, pp: 10, fx: { recoil: 0.25 }, desc: "つよいが じぶんも きずつく。" },
  かみつく:        { type: "ノーマル", cat: "phys", pow: 55, acc: 100, pp: 25, fx: { flinch: 0.2 }, desc: "たまに ひるませる。" },
  なきごえ:        { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 40, fx: { foe: { atk: -1 } }, desc: "あいての こうげきを さげる。" },
  しっぽふり:      { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ぼうぎょを さげる。" },
  にらみつける:    { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ぼうぎょを さげる。" },
  かたくなる:      { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { self: { def: 1 } }, desc: "じぶんの ぼうぎょを あげる。" },
  みだれづき:      { type: "ノーマル", cat: "phys", pow: 15, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つく。" },
  ねむる:          { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { rest: true }, desc: "ねむって たいりょくを ぜんかい。" },

  はっぱカッター:  { type: "くさ", cat: "spec", pow: 55, acc: 95, pp: 25, fx: { crit: 2 }, desc: "きゅうしょに あたりやすい。" },
  つるのムチ:      { type: "くさ", cat: "phys", pow: 45, acc: 100, pp: 25, desc: "つるで たたく。" },
  やどりぎ:        { type: "くさ", cat: "stat", pow: 0, acc: 90, pp: 10, fx: { leech: true }, desc: "まいターン すこしずつ すいとる。" },
  ソーラーリーフ:  { type: "くさ", cat: "spec", pow: 95, acc: 95, pp: 10, desc: "ひかりを あつめて はなつ。" },
  こうごうせい:    { type: "くさ", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { heal: 0.5 }, desc: "たいりょくを 半分 かいふく。" },

  ひのこ:          { type: "ほのお", cat: "spec", pow: 45, acc: 100, pp: 25, fx: { status: "やけど", chance: 0.1 }, desc: "たまに やけどさせる。" },
  かえんほうしゃ:  { type: "ほのお", cat: "spec", pow: 90, acc: 100, pp: 15, fx: { status: "やけど", chance: 0.1 }, desc: "つよい ほのおを あびせる。" },
  ひばしら:        { type: "ほのお", cat: "spec", pow: 70, acc: 95, pp: 15, fx: { status: "やけど", chance: 0.2 }, desc: "したから ほのおが ふきあがる。" },
  もえるつばさ:    { type: "ほのお", cat: "phys", pow: 60, acc: 100, pp: 20, desc: "もえる はねで きりつける。" },

  みずでっぽう:    { type: "みず", cat: "spec", pow: 45, acc: 100, pp: 25, desc: "みずを いきおいよく はく。" },
  バブルこうせん:  { type: "みず", cat: "spec", pow: 65, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "たまに すばやさを さげる。" },
  ハイドロなみ:    { type: "みず", cat: "spec", pow: 95, acc: 90, pp: 10, desc: "おおきな なみで おしながす。" },
  うずしお:        { type: "みず", cat: "spec", pow: 50, acc: 95, pp: 20, fx: { trap: true }, desc: "うずに とじこめる。" },

  でんきショック:  { type: "でんき", cat: "spec", pow: 45, acc: 100, pp: 30, fx: { status: "まひ", chance: 0.15 }, desc: "たまに まひさせる。" },
  "１０まんボルト":  { type: "でんき", cat: "spec", pow: 90, acc: 100, pp: 15, fx: { status: "まひ", chance: 0.1 }, desc: "つよい でんげきを はなつ。" },
  でんじは:        { type: "でんき", cat: "stat", pow: 0, acc: 90, pp: 20, fx: { status: "まひ", chance: 1 }, desc: "あいてを まひさせる。" },
  スパークボール:  { type: "でんき", cat: "spec", pow: 60, acc: 95, pp: 20, desc: "でんきの たまを ぶつける。" },

  すなかけ:        { type: "じめん", cat: "stat", pow: 0, acc: 100, pp: 15, fx: { foe: { acc: -1 } }, desc: "めいちゅうを さげる。" },
  じならし:        { type: "じめん", cat: "phys", pow: 60, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "じめんを ゆらす。" },
  じしん:          { type: "じめん", cat: "phys", pow: 100, acc: 100, pp: 10, desc: "だいちを ゆるがす。" },
  いわおとし:      { type: "じめん", cat: "phys", pow: 55, acc: 90, pp: 15, desc: "いわを ぶつける。" },
  ドリルアタック:  { type: "じめん", cat: "phys", pow: 80, acc: 95, pp: 15, fx: { crit: 2 }, desc: "きりもみして つっこむ。" },

  むしくい:        { type: "むし", cat: "phys", pow: 45, acc: 100, pp: 25, fx: { drain: 0.5 }, desc: "あたえた ダメージの 半分 かいふく。" },
  いとをはく:      { type: "むし", cat: "stat", pow: 0, acc: 95, pp: 40, fx: { foe: { spd: -2 } }, desc: "すばやさを ぐんと さげる。" },
  シザーカット:    { type: "むし", cat: "phys", pow: 75, acc: 100, pp: 15, fx: { crit: 2 }, desc: "おおあごで はさむ。" },
  どくばり:        { type: "むし", cat: "phys", pow: 35, acc: 100, pp: 30, fx: { status: "どく", chance: 0.3 }, desc: "たまに どくに する。" },

  かげぬい:        { type: "やみ", cat: "phys", pow: 60, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "かげを ぬいとめる。" },
  よるのつめ:      { type: "やみ", cat: "phys", pow: 80, acc: 95, pp: 15, fx: { crit: 2 }, desc: "やみの つめで さく。" },
  くろいきり:      { type: "やみ", cat: "stat", pow: 0, acc: 100, pp: 20, fx: { reset: true }, desc: "のうりょくの へんかを もとに もどす。" },
  ゆめくい:        { type: "やみ", cat: "spec", pow: 80, acc: 100, pp: 10, fx: { dream: true }, desc: "ねむっている あいてにだけ あたる。" },
  さいみんじゅつ:  { type: "やみ", cat: "stat", pow: 0, acc: 65, pp: 20, fx: { status: "ねむり", chance: 1 }, desc: "あいてを ねむらせる。" },
};

export function move(name) {
  const m = MOVES[name];
  if (!m) return { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 20, desc: "" };
  return m;
}
export function newMove(name) {
  const m = move(name);
  return { name: name, pp: m.pp, max: m.pp };
}
