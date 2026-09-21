import {EXTRA_MOVES92} from './moves92.mjs';
// ============================================================
//  わざ
//   cat : "phys"=ぶつり / "spec"=とくしゅ / "stat"=へんか
//   fx  : おまけの こうか
// ============================================================
export const MOVES = {
  ウッドバースト: { type: "くさ", cat: "phys", pow: 95, acc: 100, pp: 10, desc: "かたい 木のちからを ぶつける。" },
  タックル:      { type: "ひかり", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "からだごと ぶつかる。" },
  ブレイド:        { type: "ひかり", cat: "phys", pow: 40, acc: 100, pp: 35, desc: "つめで ブレイド。" },
  スピードブロー:  { type: "ひかり", cat: "phys", pow: 40, acc: 100, pp: 30, pri: 1, desc: "かならず 先に うごける。" },
  ラッシュナックル:  { type: "ひかり", cat: "phys", pow: 18, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つづけて たたく。" },
  マックスアタック:  { type: "ひかり", cat: "phys", pow: 100, acc: 90, pp: 10, fx: { recoil: 0.25 }, desc: "つよいが じぶんも きずつく。" },
  スピナー:        { type: "ひかり", cat: "phys", pow: 55, acc: 100, pp: 25, fx: { flinch: 0.2 }, desc: "たまに ひるませる。" },
  ボイス:        { type: "ひかり", cat: "stat", pow: 0, acc: 100, pp: 40, fx: { foe: { atk: -1 } }, desc: "あいての アタックを さげる。" },
  ダンス:      { type: "ひかり", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ブロックを さげる。" },
  レイロム:    { type: "ひかり", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { foe: { def: -1 } }, desc: "あいての ブロックを さげる。" },
  ブロック:      { type: "ひかり", cat: "stat", pow: 0, acc: 100, pp: 30, fx: { self: { def: 1 } }, desc: "じぶんの ブロックを あげる。" },
  ダブルカット:      { type: "ひかり", cat: "phys", pow: 15, acc: 85, pp: 20, fx: { multi: [2, 5] }, desc: "2〜5かい つく。" },
  パワーアップ:          { type: "ひかり", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { rest: true }, desc: "ねむって たいりょくを ぜんかい。" },

  ウッドバット:  { type: "くさ", cat: "spec", pow: 55, acc: 95, pp: 25, fx: { crit: 2 }, desc: "きゅうしょに あたりやすい。" },
  リーフピストル:      { type: "くさ", cat: "phys", pow: 45, acc: 100, pp: 25, desc: "葉を いきおいよく うちだす。" },
  エネスポンジ:        { type: "くさ", cat: "stat", pow: 0, acc: 90, pp: 10, fx: { leech: true }, desc: "まいターン すこしずつ すいとる。" },
  フラワーブラスト:  { type: "くさ", cat: "spec", pow: 95, acc: 95, pp: 10, desc: "ひかりを あつめて はなつ。" },
  ライトチャージ:    { type: "くさ", cat: "stat", pow: 0, acc: 100, pp: 10, fx: { heal: 0.5 }, desc: "たいりょくを 半分 かいふく。" },

  ファイア:          { type: "ほのお", cat: "spec", pow: 45, acc: 100, pp: 25, fx: { status: "やけど", chance: 0.1 }, desc: "たまに やけどさせる。" },
  ファイアブラスト:  { type: "ほのお", cat: "spec", pow: 90, acc: 100, pp: 15, fx: { status: "やけど", chance: 0.1 }, desc: "つよい ほのおを あびせる。" },
  ファイアピン:        { type: "ほのお", cat: "spec", pow: 70, acc: 95, pp: 15, fx: { status: "やけど", chance: 0.2 }, desc: "したから ほのおが ふきあがる。" },
  ファイアーブレス:    { type: "ほのお", cat: "phys", pow: 60, acc: 100, pp: 20, desc: "あつい ほのおの 息を はく。" },

  ウォーターブロー:    { type: "みず", cat: "spec", pow: 45, acc: 100, pp: 25, desc: "みずを いきおいよく はく。" },
  アクアピストル:  { type: "みず", cat: "spec", pow: 65, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "たまに スピードを さげる。" },
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
  イトハードイト:      { type: "むし", cat: "stat", pow: 0, acc: 95, pp: 40, fx: { foe: { spd: -2 } }, desc: "スピードを ぐんと さげる。" },
  スラッシュ:    { type: "むし", cat: "phys", pow: 75, acc: 100, pp: 15, fx: { crit: 2 }, desc: "おおあごで はさむ。" },
  ポイズン:        { type: "むし", cat: "phys", pow: 35, acc: 100, pp: 30, fx: { status: "どく", chance: 0.3 }, desc: "たまに どくに する。" },

  シャドーアタック:        { type: "やみ", cat: "phys", pow: 60, acc: 100, pp: 20, fx: { foe: { spd: -1 }, chance: 0.3 }, desc: "かげを ぬいとめる。" },
  ブラックカッター:      { type: "やみ", cat: "phys", pow: 80, acc: 95, pp: 15, fx: { crit: 2 }, desc: "やみの つめで さく。" },
  ムゲン:      { type: "やみ", cat: "stat", pow: 0, acc: 100, pp: 20, fx: { reset: true }, desc: "のうりょくの へんかを もとに もどす。" },
  ダークブレイン:        { type: "やみ", cat: "spec", pow: 80, acc: 100, pp: 10, fx: { dream: true }, desc: "ねむっている あいてにだけ あたる。" },
  ダウンバグ:  { type: "やみ", cat: "stat", pow: 0, acc: 65, pp: 20, fx: { status: "ねむり", chance: 1 }, desc: "あいてを ねむらせる。" },

  ファイアバースト: { type: "ほのお", cat: "spec", pow: 120, acc: 100, pp: 10, desc: "はげしい ほのおを いっきに はなつ。" },
  リーフバースト: { type: "くさ", cat: "spec", pow: 100, acc: 100, pp: 10, desc: "はっぱに あつめた ちからを はなつ。" },
  アクアバースト: { type: "みず", cat: "spec", pow: 100, acc: 100, pp: 10, desc: "たいりょうの みずを いっきに はなつ。" },
  サンダーバースト: { type: "でんき", cat: "spec", pow: 100, acc: 100, pp: 10, desc: "ためこんだ でんきを いっきに はなつ。" },
  ロックバースト: { type: "じめん", cat: "spec", pow: 120, acc: 100, pp: 10, desc: "だいちの ちからを ばくはつさせる。" },
  ダークバースト: { type: "やみ", cat: "spec", pow: 120, acc: 100, pp: 10, desc: "こい やみの ちからを いっきに はなつ。" },
  ホワイトバースト: { type: "ひかり", cat: "spec", pow: 100, acc: 100, pp: 10, desc: "しろく かがやく エネルギーを はなつ。" },
  ビーストバースト: { type: "むし", cat: "spec", pow: 100, acc: 100, pp: 10, desc: "むしの ちからを あつめて はなつ。" },

};

Object.assign(MOVES,EXTRA_MOVES92);

export function move(name) {
  const m = MOVES[canonicalMoveName(name)];
  if (!m) return { type: "ひかり", cat: "phys", pow: 40, acc: 100, pp: 20, desc: "" };
  return m;
}
export function newMove(name) {
  name = canonicalMoveName(name);
  const m = move(name);
  return { name: name, pp: m.pp, max: m.pp };
}

// Old saves and bookmarked move links retain compatibility.
export const MOVE_ALIASES = {
  "れんぞくパンチ": "ラッシュナックル",
  "かみつく": "スピナー",
  "しっぽふり": "ダンス",
  "ひばしら": "ファイアピン",
  "いかく": "レイロム",
  "つるのムチ": "リーフピストル",
  "やどりぎ": "エネスポンジ",
  "はっぱカッター": "ウッドバット",
  "こうごうせい": "ライトチャージ",
  "ソーラーリーフ": "フラワーブラスト",
  "ひっかく": "ブレイド",
  "もえるつばさ": "ファイアーブレス",
  "たいあたり": "タックル",
  "かえんほうしゃ": "ファイアブラスト",
  "ひのこ": "ファイア",
  "にらみつける": "レイロム",
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

export const BURST_MOVE_NAMES = ["ファイアバースト","リーフバースト","アクアバースト","サンダーバースト","ロックバースト","ダークバースト","ホワイトバースト","ビーストバースト"];
