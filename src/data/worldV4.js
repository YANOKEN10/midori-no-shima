// ガオン・ワールド V4：旧タイル配置から独立した、手設計のフィールド定義。
// 表示画像と衝突マスクを分離し、見た目の継ぎ目を無くしながら通行範囲を明示する。

function kazenariCollision() {
  const width = 44, height = 35;
  const grid = Array.from({ length: height }, () => Array(width).fill("X"));
  const rect = (x, y, w, h, tile = ".") => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      if (yy >= 0 && yy < height && xx >= 0 && xx < width) grid[yy][xx] = tile;
    }
  };
  rect(19, 0, 7, 35);
  rect(15, 15, 17, 9);
  rect(8, 14, 12, 6);
  rect(25, 19, 15, 9);
  rect(24, 13, 11, 5, "d");
  rect(6, 20, 10, 7, '"');
  rect(15, 21, 4, 3);
  rect(8, 15, 3, 3);
  rect(38, 25, 3, 3);
  return grid.map((row) => row.join(""));
}

export const KAZENARI_VALLEY = {
  id: "village",
  name: "風鳴り谷",
  kind: "out",
  layoutVersion: 4,
  freeMove: true,
  spawn: { x: 21, y: 19 },
  fullArt: "kazenari-valley",
  rows: kazenariCollision(),
  enc: {
    rate: 14,
    list: [
      ["タネコロ", 3, 5, 30], ["ムシリン", 3, 5, 24],
      ["マルミィ", 3, 5, 20], ["ネズミン", 3, 5, 16], ["ウサポン", 4, 6, 10],
    ],
  },
  warps: [
    { x: 9, y: 16, to: "hut", tx: 4, ty: 8 },
    { x: 39, y: 26, to: "elder", tx: 4, ty: 8 },
    { x: 21, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
    { x: 22, y: 0, to: "mount1", tx: 7, ty: 19, edge: 1 },
    { x: 21, y: 34, to: "gate", tx: 6, ty: 1, edge: 1 },
    { x: 22, y: 34, to: "gate", tx: 6, ty: 1, edge: 1 },
  ],
  signs: [{ x: 17, y: 20, text: ["風鳴り谷　標高 1480m", "北…雲を生む森　南…谷をくだる古道"] }],
  npcs: [
    { x: 17, y: 18, dir: "down", look: "oldman", name: "木こり バルト", talk: ["バルト「この谷では、人と ガオンが", "　同じ水と薪を わけあって暮らしてきた。", "　近ごろは森の奥で 木々がざわめいている。"] },
    { x: 29, y: 20, dir: "left", look: "girl", name: "羊飼い エナ", hair: "bun", talk: ["エナ「雪どけ水は つめたいけど、", "　ガオンたちは この川の音が だいすき。", "　橋はすべるから 気をつけてね。"] },
    { x: 23, y: 30, dir: "down", look: "hiker", name: "橋守 ロアン", hair: "straw", talk: ["ロアン「谷の外へ続く古道は、", "　リーフ・コンパスを持つ旅人のための道だ。", "　方角ではなく、命のざわめきを指すらしい。"] },
  ],
};
