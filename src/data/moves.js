// ============================================================
//  わざ
//   cat : "phys"=ぶつり / "spec"=とくしゅ / "stat"=へんか
//   fx  : おまけの こうか
// ============================================================
export const MOVES = {
  タックル:      { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "からだごと ぶつかる。" },
  ひっかく:        { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "つめで ひっかく。" },
  スピードブロー:  { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 30, pri: 1, desc: "かならず 先に うごける。" },
  れんぞくパンチ:  { type: "ノーマル", cat: "phys", pow: 18, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つづけて たたく。" },
  マックスアタック:  { type: "ノーマル", cat: "phys", pow: 100, acc: 90, pp: 10, fx: { recoil: 0.25 }, desc: "つよいが じぶんも きずつく。" },
  かみつく:        { type: "ノーマル", cat: "phys", pow: 55, acc: 100, pp: 25, fx: { flinch: 0.2 }, desc: "たまに ひるませる。" },
  ボイス:        { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 40, fx: { foe: { atk: -1 } }, desc: "あいての こうげきを さげる。" },
  しっぽふり:      { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ぼうぎょを さげる。" },
  いかく:    { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ぼうぎょを さげる。" },
  ブロック:      { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { self: { def: 1 } }, desc: "じぶんの ぼうぎょを あげる。" },
  ダブルカット:      { type: "ノーマル", cat: "phys", pow: 15, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つく。" },
  パワーアップ:          { type: "ノーマル", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { rest: true }, desc: "ねむって たいりょくを ぜんかい。" },

  はっぱカッター:  { type: "くさ", cat: "spec", pow: 55, acc: 95, pp: 25, fx: { crit: 2 }, desc: "きゅうしょに あたりやすい。" },
  つるのムチ:      { type: "くさ", cat: "phys", pow: 45, acc: 100, pp: 25, desc: "つるで たたく。" },
  やどりぎ:        { type: "くさ", cat: "stat", pow: 0, acc: 90, pp: 10, fx: { leech: true }, desc: "まいターン すこしずつ すいとる。" },
  ソーラーリーフ:  { type: "くさ", cat: "spec", pow: 95, acc: 95, pp: 10, desc: "ひかりを あつめて はなつ。" },
  こうごうせい:    { type: "くさ", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { heal: 0.5 }, desc: "たいりょくを 半分 かいふく。" },

  ファイア:          { type: "ほのお", cat: "spec", pow: 45, acc: 100, pp: 25, fx: { status: "やけど", chance: 0.1 }, desc: "たまに やけどさせる。" },
  ファイアブラスト:  { type: "ほのお", cat: "spec", pow: 90, acc: 100, pp: 15, fx: { status: "やけど", chance: 0.1 }, desc: "つよい ほのおを あびせる。" },
  ひばしら:        { type: "ほのお", cat: "spec", pow: 70, acc: 95, pp: 15, fx: { status: "やけど", chance: 0.2 }, desc: "したから ほのおが ふきあがる。" },
  もえるつばさ:    { type: "ほのお", cat: "phys", pow: 60, acc: 100, pp: 20, desc: "もえる はねで きりつける。" },

  ウォーターブロー:    { type: "みず", cat: "spec", pow: 45, acc: 100, pp: 25, desc: "みずを いきおいよく はく。" },
  アクアピストル:  { type: "みず", cat: "spec", pow: 65, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "たまに すばやさを さげる。" },
  ウォーターレーザー:    { type: "みず", cat: "spec", pow: 95, acc: 90, pp: 10, desc: "おおきな なみで おしながす。" },
  アクアマシンガン:        { type: "みず", cat: "spec", pow: 50, acc: 95, pp: 20, fx: { trap: true }, desc: "うずに とじこめる。" },

  イナズマ:  { type: "でんき", cat: "spec", pow: 45, acc: 100, pp: 30, fx: { status: "まひ", chance: 0.15 }, desc: "たまに まひさせる。" },
  "サンダーマジック":  { type: "でんき", cat: "spec", pow: 90, acc: 100, pp: 15, fx: { status: "まひ", chance: 0.1 }, desc: "つよい でんげきを はなつ。" },
  サンダー:        { type: "でんき", cat: "stat", pow: 0, acc: 90, pp: 20, fx: { status: "まひ", chance: 1 }, desc: "あいてを まひさせる。" },
  イナズマボール:  { type: "でんき", cat: "spec", pow: 60, acc: 95, pp: 20, desc: "でんきの たまを ぶつける。" },

  サンドスモッグ:        { type: "じめん", cat: "stat", pow: 0, acc: 100, pp: 15, fx: { foe: { acc: -1 } }, desc: "めいちゅうを さげる。" },
  ロックピストル:        { type: "じめん", cat: "phys", pow: 60, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "じめんを ゆらす。" },
  ロッククラッシュ:          { type: "じめん", cat: "phys", pow: 100, acc: 100, pp: 10, desc: "だいちを ゆるがす。" },
  ロックシュート:      { type: "じめん", cat: "phys", pow: 55, acc: 90, pp: 15, desc: "いわを ぶつける。" },
  ドリルアタック:  { type: "じめん", cat: "phys", pow: 80, acc: 95, pp: 15, fx: { crit: 2 }, desc: "きりもみして つっこむ。" },

  ナイフ:        { type: "むし", cat: "phys", pow: 45, acc: 100, pp: 25, fx: { drain: 0.5 }, desc: "あたえた ダメージの 半分 かいふく。" },
  イトハードイト:      { type: "むし", cat: "stat", pow: 0, acc: 95, pp: 40, fx: { foe: { spd: -2 } }, desc: "すばやさを ぐんと さげる。" },
  スラッシュ:    { type: "むし", cat: "phys", pow: 75, acc: 100, pp: 15, fx: { crit: 2 }, desc: "おおあごで はさむ。" },
  ポイズン:        { type: "むし", cat: "phys", pow: 35, acc: 100, pp: 30, fx: { status: "どく", chance: 0.3 }, desc: "たまに どくに する。" },

  シャドーアタック:        { type: "やみ", cat: "phys", pow: 60, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "かげを ぬいとめる。" },
  ブラックカッター:      { type: "やみ", cat: "phys", pow: 80, acc: 95, pp: 15, fx: { crit: 2 }, desc: "やみの つめで さく。" },
  ムゲン:      { type: "やみ", cat: "stat", pow: 0, acc: 100, pp: 20, fx: { reset: true }, desc: "のうりょくの へんかを もとに もどす。" },
  ダークブレイン:        { type: "やみ", cat: "spec", pow: 80, acc: 100, pp: 10, fx: { dream: true }, desc: "ねむっている あいてにだけ あたる。" },
  ダウンバグ:  { type: "やみ", cat: "stat", pow: 0, acc: 65, pp: 20, fx: { status: "ねむり", chance: 1 }, desc: "あいてを ねむらせる。" },
};

export function move(name) {
  const m = MOVES[canonicalMoveName(name)];
  if (!m) return { type: "ノーマル", cat: "phys", pow: 40, acc: 100, pp: 20, desc: "" };
  return m;
}
export function newMove(name) {
  name = canonicalMoveName(name);
  const m = move(name);
  return { name: name, pp: m.pp, max: m.pp };
}

// Old saves and bookmarked move links retain compatibility.
export const MOVE_ALIASES = {
  "たいあたり": "タックル",
  "かえんほうしゃ": "ファイアブラスト",
  "ひのこ": "ファイア",
  "にらみつける": "いかく",
  "なきごえ": "ボイス",
  "すてみタックル": "マックスアタック",
  "でんこうせっか": "スピードブロー",
  "ハイドロなみ": "ウォーターレーザー",
  "バブルこうせん": "アクアピストル",
  "みずでっぽう": "ウォーターブロー",
  "うずしお": "アクアマシンガン",
  "じしん": "ロッククラッシュ",
  "かたくなる": "ブロック",
  "みだれづき": "ダブルカット",
  "でんきショック": "イナズマ",
  "でんじは": "サンダー",
  "スパークボール": "イナズマボール",
  "１０まんボルト": "サンダーマジック",
  "じならし": "ロックピストル",
  "すなかけ": "サンドスモッグ",
  "いわおとし": "ロックシュート",
  "むしくい": "ナイフ",
  "いとをはく": "イトハードイト",
  "シザーカット": "スラッシュ",
  "どくばり": "ポイズン",
  "かげぬい": "シャドーアタック",
  "さいみんじゅつ": "ダウンバグ",
  "ゆめくい": "ダークブレイン",
  "よるのつめ": "ブラックカッター",
  "くろいきり": "ムゲン",
  "ねむる": "パワーアップ"
};
export const canonicalMoveName=name=>MOVE_ALIASES[name]||name;
