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

function field(width = 40, height = 40) {
  const grid = Array.from({ length: height }, () => Array(width).fill("X"));
  const rect = (x, y, w, h, tile = ".") => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      if (yy >= 0 && yy < height && xx >= 0 && xx < width) grid[yy][xx] = tile;
    }
  };
  return { rect, rows: () => grid.map((row) => row.join("")) };
}

function mountainTrailRows() {
  const m = field();
  m.rect(17, 0, 9, 40);                 // 南北の砂利道
  m.rect(14, 8, 12, 24);                // 曲がり道の肩
  m.rect(17, 14, 9, 5, "d");          // 雪解け川の橋面
  m.rect(5, 21, 10, 7, '"');           // 西の濃い草むら
  m.rect(27, 23, 10, 8, '"');          // 東の濃い草むら
  m.rect(14, 24, 4, 3); m.rect(25, 26, 3, 3);
  return m.rows();
}

function mountainSanctuaryRows() {
  const m = field();
  m.rect(18, 20, 8, 20);                // 南からの主路
  m.rect(7, 8, 24, 17, ",");           // 物語イベントの草原
  m.rect(9, 6, 20, 7);                  // 環状路の北側
  m.rect(27, 16, 8, 7, "d");          // 源流に架かる橋
  m.rect(4, 19, 10, 8, '"');           // 西の濃い草むら
  m.rect(29, 24, 9, 8, '"');           // 東の濃い草むら
  m.rect(13, 20, 6, 4); m.rect(25, 24, 5, 4);
  return m.rows();
}

function mountainGateRows() {
  const m = field();
  m.rect(17, 0, 9, 40);                 // 峠を貫く主路
  m.rect(15, 5, 13, 9);                 // 門の前後
  m.rect(7, 12, 11, 9);                 // 山小屋への枝道
  m.rect(25, 22, 11, 8, '"');          // 柵内の濃い草むら
  m.rect(24, 24, 3, 4);
  return m.rows();
}

function windCabinRows() {
  const m = field();
  m.rect(5, 12, 30, 22, "f");          // 木床
  m.rect(18, 32, 6, 8, "f");           // 南玄関
  // 家具は一枚絵に合わせ、床から明示的に除外する。
  m.rect(5, 12, 8, 5, "X"); m.rect(4, 17, 8, 10, "X");
  m.rect(15, 8, 10, 7, "X"); m.rect(26, 10, 9, 7, "X");
  m.rect(29, 24, 6, 7, "X"); m.rect(5, 29, 6, 5, "X");
  return m.rows();
}

function valleyLodgeRows() {
  const m = field();
  m.rect(4, 9, 32, 25, "f");
  m.rect(18, 32, 6, 8, "f");
  m.rect(5, 8, 30, 5, "X");             // 北壁の暖炉・資料棚
  m.rect(17, 16, 7, 13, "X");           // 中央の長机
  m.rect(5, 15, 7, 6, "X"); m.rect(28, 14, 8, 8, "X");
  m.rect(6, 25, 8, 7, "X"); m.rect(27, 25, 8, 7, "X");
  return m.rows();
}

function secondRegionRows(kind = "route") {
  const m = field();
  m.rect(16, 0, 9, 40);
  m.rect(7, 8, 28, 24);
  if (kind === "route") {
    m.rect(15, 18, 11, 5, "d");
    m.rect(3, 25, 11, 9, '"');
    m.rect(27, 8, 11, 9, '"');
  } else {
    m.rect(0, 18, 11, 8);
    m.rect(30, 18, 10, 8);
    m.rect(7, 29, 10, 7, '"');
    m.rect(29, 29, 8, 7, '"');
  }
  return m.rows();
}

function stoneTownRows() {
  const m = field();
  m.rect(17, 0, 8, 40); m.rect(8, 8, 25, 24);
  m.rect(15, 24, 12, 6, "d");
  m.rect(30, 27, 8, 8, '"'); m.rect(0, 19, 11, 7); m.rect(31, 18, 9, 7);
  return m.rows();
}

function stoneRoadRows() {
  const m = field();
  m.rect(16, 0, 9, 40); m.rect(10, 6, 18, 29);
  m.rect(15, 23, 12, 5, "d");
  m.rect(4, 25, 10, 8, '"'); m.rect(27, 8, 10, 8, '"');
  return m.rows();
}

function mirrorTownRows() {
  const m = field();
  m.rect(17, 0, 8, 40); m.rect(5, 8, 30, 25);
  m.rect(11, 17, 24, 8, "d");
  m.rect(29, 29, 9, 7, '"'); m.rect(0, 18, 10, 7); m.rect(31, 18, 9, 7);
  return m.rows();
}

function mirrorBoardwalkRows() {
  const m = field();
  m.rect(17, 0, 8, 40, "d"); m.rect(12, 5, 17, 30, "d");
  m.rect(3, 10, 10, 9, '"'); m.rect(28, 24, 10, 9, '"');
  m.rect(11, 12, 3, 4); m.rect(27, 27, 3, 4);
  return m.rows();
}

function snowTownRows() {
  const m = field();
  m.rect(17, 0, 8, 40); m.rect(6, 8, 29, 24);
  m.rect(16, 21, 10, 6, "d");
  m.rect(5, 27, 11, 8, '"'); m.rect(0, 18, 10, 7); m.rect(31, 18, 9, 7);
  return m.rows();
}

function snowStepsRows() {
  const m = field();
  m.rect(16, 0, 9, 40); m.rect(10, 5, 19, 30);
  m.rect(15, 20, 13, 6, "d");
  m.rect(3, 24, 11, 9, '"'); m.rect(27, 7, 10, 9, '"');
  return m.rows();
}

function sunsetTownRows() {
  const m = field();
  m.rect(17, 0, 8, 40); m.rect(6, 8, 29, 24);
  m.rect(25, 21, 15, 6, "d");
  m.rect(4, 27, 11, 8, '"'); m.rect(0, 18, 10, 7);
  return m.rows();
}

function railwayRows() {
  const m = field();
  m.rect(11, 0, 9, 40); m.rect(8, 7, 15, 27);
  m.rect(8, 19, 25, 5, "d");
  m.rect(3, 9, 8, 9, '"'); m.rect(3, 25, 8, 8, '"');
  return m.rows();
}

function capitalRows() {
  const m = field();
  m.rect(17, 0, 9, 40); m.rect(4, 8, 32, 25);
  m.rect(13, 16, 15, 13); m.rect(15, 27, 11, 8, "d");
  m.rect(31, 18, 9, 8); m.rect(29, 29, 9, 7, '"');
  return m.rows();
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
    { x: 21, y: 0, to: "mount1", tx: 20, ty: 38, edge: 1 },
    { x: 22, y: 0, to: "mount1", tx: 21, ty: 38, edge: 1 },
    { x: 21, y: 34, to: "gate", tx: 20, ty: 1, edge: 1 },
    { x: 22, y: 34, to: "gate", tx: 21, ty: 1, edge: 1 },
  ],
  signs: [{ x: 17, y: 20, text: ["風鳴り谷　標高 1480m", "北…雲を生む森　南…谷をくだる古道"] }],
  npcs: [
    { x: 17, y: 18, dir: "down", look: "oldman", name: "木こり バルト", talk: ["バルト「この谷では、人と ガオンが", "　同じ水と薪を わけあって暮らしてきた。", "　近ごろは森の奥で 木々がざわめいている。"] },
    { x: 29, y: 20, dir: "left", look: "girl", name: "羊飼い エナ", hair: "bun", talk: ["エナ「雪どけ水は つめたいけど、", "　ガオンたちは この川の音が だいすき。", "　橋はすべるから 気をつけてね。"] },
    { x: 23, y: 30, dir: "down", look: "hiker", name: "橋守 ロアン", hair: "straw", talk: ["ロアン「谷の外へ続く古道は、", "　リーフ・コンパスを持つ旅人のための道だ。", "　方角ではなく、命のざわめきを指すらしい。"] },
  ],
};

export function applyFirstRegionV4(maps) {
  const hutNpc = maps.hut.npcs;
  Object.assign(maps.hut, {
    layoutVersion: 4, fullArt: "wind-cabin-interior", freeMove: true,
    spawn: { x: 20, y: 31 }, rows: windCabinRows(),
    warps: [{ x: 20, y: 37, to: "village", tx: 9, ty: 17 }, { x: 21, y: 37, to: "village", tx: 9, ty: 17 }],
    npcs: hutNpc.map((n, i) => Object.assign({}, n, i === 0 ? { x: 28, y: 22 } : {})),
    objects: [
      { x: 27, y: 12, text: ["谷の天気を読む 古い気圧計。", "針が山のほうへ ふるえている。"] },
      { x: 12, y: 20, text: ["厚い毛布のベッド。", "窓の外から モミの香りがする。"] },
    ],
  });

  const elderNpcs = maps.elder.npcs;
  Object.assign(maps.elder, {
    layoutVersion: 4, fullArt: "valley-lodge-interior", freeMove: true,
    spawn: { x: 20, y: 31 }, rows: valleyLodgeRows(),
    warps: [{ x: 20, y: 37, to: "village", tx: 39, ty: 27 }, { x: 21, y: 37, to: "village", tx: 39, ty: 27 }],
    npcs: elderNpcs.map((n, i) => Object.assign({}, n, i === 0 ? { x: 20, y: 14 } : { x: 29, y: 23 })),
  });

  const mount1Npcs = maps.mount1.npcs, mount1Enc = maps.mount1.enc;
  Object.assign(maps.mount1, {
    layoutVersion: 4, fullArt: "mountain-trail", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: mountainTrailRows(), enc: mount1Enc,
    warps: [
      { x: 20, y: 39, to: "village", tx: 21, ty: 1, edge: 1 }, { x: 21, y: 39, to: "village", tx: 22, ty: 1, edge: 1 },
      { x: 20, y: 0, to: "mount2", tx: 20, ty: 38, edge: 1 }, { x: 21, y: 0, to: "mount2", tx: 21, ty: 38, edge: 1 },
    ],
    signs: [{ x: 24, y: 8, text: ["やまみち", "この先に 山の奥地"] }],
    items: [{ x: 27, y: 29, item: "ヒールジェル", flag: "m1heal" }],
    npcs: mount1Npcs.map((n) => Object.assign({}, n, { x: 25, y: 23 })),
  });

  const mount2Npcs = maps.mount2.npcs, mount2Enc = maps.mount2.enc;
  Object.assign(maps.mount2, {
    layoutVersion: 4, fullArt: "mountain-sanctuary", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: mountainSanctuaryRows(), enc: mount2Enc,
    warps: [{ x: 20, y: 39, to: "mount1", tx: 20, ty: 1, edge: 1 }, { x: 21, y: 39, to: "mount1", tx: 21, ty: 1, edge: 1 }],
    npcs: mount2Npcs.map((n) => Object.assign({}, n, { x: 19, y: 10 })),
  });

  const gateNpcs = maps.gate.npcs;
  Object.assign(maps.gate, {
    layoutVersion: 4, fullArt: "mountain-gate", freeMove: true,
    spawn: { x: 20, y: 2 }, rows: mountainGateRows(),
    enc: { rate: 12, list: [["タネコロ", 4, 6, 35], ["ムシリン", 4, 6, 30], ["ネズミン", 4, 6, 20], ["ウサポン", 5, 7, 15]] },
    warps: [
      { x: 20, y: 0, to: "village", tx: 21, ty: 33, edge: 1 }, { x: 21, y: 0, to: "village", tx: 22, ty: 33, edge: 1 },
      { x: 20, y: 39, to: "harbor", tx: 10, ty: 5, edge: 1 }, { x: 21, y: 39, to: "harbor", tx: 11, ty: 5, edge: 1 },
      { x: 10, y: 15, to: "station", tx: 4, ty: 8, back: { map: "gate", x: 11, y: 18 } },
    ],
    signs: [{ x: 14, y: 19, text: ["谷の出口", "この先 アーレ湖港"] }],
    npcs: gateNpcs.map((n) => Object.assign({}, n, { x: 20, y: 34 })),
  });
}

export function applySecondRegionV4(maps) {
  const set = (id, fullArt, kind, warps, points) => {
    const map = maps[id];
    Object.assign(map, {
      layoutVersion: 4,
      fullArt,
      freeMove: true,
      spawn: { x: 20, y: 37 },
      rows: secondRegionRows(kind),
      warps,
      npcs: (map.npcs || []).map((npc, i) => Object.assign({}, npc, points[i] || points[0] || {})),
    });
  };
  const edges = (south, north) => [
    { x: 20, y: 39, to: south, tx: 20, ty: 2, edge: 1 },
    { x: 21, y: 39, to: south, tx: 21, ty: 2, edge: 1 },
    { x: 20, y: 0, to: north, tx: 20, ty: 38, edge: 1 },
    { x: 21, y: 0, to: north, tx: 21, ty: 38, edge: 1 },
  ];

  set("harbor", "aare-lake-harbor", "town", [
    ...edges("gate", "route1"),
    { x: 0, y: 21, to: "inlet", tx: 5, ty: 10, edge: 1 },
    { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "harbor", x: 11, y: 14 } },
    { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "harbor", x: 30, y: 14 } },
    { x: 31, y: 24, to: "clothes1", tx: 4, ty: 6 },
  ], [{ x: 20, y: 22 }, { x: 12, y: 25 }, { x: 28, y: 23 }]);
  maps.harbor.spawn = { x: 20, y: 3 };

  set("route1", "lakeside-route", "route", edges("harbor", "sand"), [{ x: 18, y: 27 }, { x: 24, y: 12 }]);
  set("sand", "sunny-terraces", "town", [
    ...edges("route1", "route2"),
    { x: 39, y: 21, to: "desert", tx: 5, ty: 10, edge: 1 },
    { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "sand", x: 11, y: 14 } },
    { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "sand", x: 30, y: 14 } },
    { x: 9, y: 24, to: "salon", tx: 4, ty: 6 },
  ], [{ x: 18, y: 22 }, { x: 27, y: 24 }]);
  set("route2", "dry-pasture-route", "route", edges("sand", "forest"), [{ x: 20, y: 27 }]);
  set("forest", "fir-echo-forest", "town", [
    ...edges("route2", "route3"),
    { x: 39, y: 21, to: "deepforest", tx: 5, ty: 10, edge: 1 },
    { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "forest", x: 11, y: 14 } },
    { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "forest", x: 30, y: 14 } },
  ], [{ x: 18, y: 22 }, { x: 27, y: 24 }]);
  set("route3", "fir-corridor", "route", edges("forest", "stone"), [{ x: 18, y: 27 }, { x: 24, y: 12 }]);
  maps.harbor.signs = [{ x: 15, y: 29, text: ["アーレ湖港", "湖沿いの道と 谷の古道をつなぐ港"] }];
  maps.sand.signs = [{ x: 15, y: 29, text: ["陽だまり棚田", "風と水を分けあう 山の棚田"] }];
  maps.forest.signs = [{ x: 15, y: 29, text: ["モミ響きの森", "木々の声が 谷へひびく集落"] }];
}

export function applyThirdRegionV4(maps) {
  const edges = (south, north) => [
    { x: 20, y: 39, to: south, tx: 20, ty: 2, edge: 1 }, { x: 21, y: 39, to: south, tx: 21, ty: 2, edge: 1 },
    { x: 20, y: 0, to: north, tx: 20, ty: 38, edge: 1 }, { x: 21, y: 0, to: north, tx: 21, ty: 38, edge: 1 },
  ];
  const set = (id, fullArt, rows, warps, points) => {
    const map = maps[id];
    Object.assign(map, { layoutVersion: 4, fullArt, freeMove: true, spawn: { x: 20, y: 37 }, rows, warps,
      npcs: (map.npcs || []).map((npc, i) => Object.assign({}, npc, points[i] || points[0] || {})) });
  };
  set("stone", "stone-whistle-gorge", stoneTownRows(), [
    ...edges("route3", "route4"), { x: 0, y: 21, to: "clothes2", tx: 4, ty: 6 },
    { x: 39, y: 21, to: "cavern", tx: 1, ty: 6, edge: 1 },
    { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "stone", x: 11, y: 14 } },
    { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "stone", x: 30, y: 14 } },
  ], [{ x: 18, y: 21 }, { x: 27, y: 22 }]);
  set("route4", "stonecutter-road", stoneRoadRows(), edges("stone", "aqua"), [{ x: 20, y: 28 }]);
  set("aqua", "mirrorwater-cove", mirrorTownRows(), [
    ...edges("route4", "route5"), { x: 39, y: 21, to: "river", tx: 5, ty: 10, edge: 1 },
    { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "aqua", x: 11, y: 14 } },
    { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "aqua", x: 30, y: 14 } },
  ], [{ x: 17, y: 25 }, { x: 28, y: 22 }]);
  set("route5", "mirrorwater-boardwalk", mirrorBoardwalkRows(), edges("aqua", "sky"), [{ x: 20, y: 25 }]);
  maps.stone.signs = [{ x: 15, y: 30, text: ["石笛の峡谷", "岩壁を渡る風が 笛のように鳴る"] }];
  maps.aqua.signs = [{ x: 15, y: 30, text: ["水鏡の入江", "空と峰を映す 青い入江"] }];
  maps.route4.signs = [{ x: 15, y: 31, text: ["石切りの道", "足もとの石段に 気をつけよう"] }];
}

export function applyFourthRegionV4(maps) {
  const edges = (south, north) => [
    { x: 20, y: 39, to: south, tx: 20, ty: 2, edge: 1 }, { x: 21, y: 39, to: south, tx: 21, ty: 2, edge: 1 },
    { x: 20, y: 0, to: north, tx: 20, ty: 38, edge: 1 }, { x: 21, y: 0, to: north, tx: 21, ty: 38, edge: 1 },
  ];
  const sky = maps.sky;
  Object.assign(sky, {
    layoutVersion: 4, fullArt: "white-ridge-chalet", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: snowTownRows(),
    warps: [...edges("route5", "route6"),
      { x: 39, y: 21, to: "cloud", tx: 5, ty: 10, edge: 1 },
      { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "sky", x: 11, y: 14 } },
      { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "sky", x: 30, y: 14 } }],
    signs: [{ x: 15, y: 30, text: ["白嶺のシャレー", "雪と星を見守る 高地の集落"] }],
    npcs: (sky.npcs || []).map((n, i) => Object.assign({}, n, i ? { x: 28, y: 22 } : { x: 17, y: 24 })),
  });
  const route = maps.route6;
  Object.assign(route, {
    layoutVersion: 4, fullArt: "white-ridge-steps", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: snowStepsRows(), warps: edges("sky", "flame"),
    signs: [{ x: 15, y: 31, text: ["白嶺の石段", "吹雪の前に 峰を越えよう"] }],
    npcs: (route.npcs || []).map((n, i) => Object.assign({}, n, i ? { x: 24, y: 12 } : { x: 18, y: 28 })),
  });
}

export function applyFifthRegionV4(maps) {
  const edges = (south, north) => [
    { x: 20, y: 39, to: south, tx: 20, ty: 2, edge: 1 }, { x: 21, y: 39, to: south, tx: 21, ty: 2, edge: 1 },
    { x: 20, y: 0, to: north, tx: 20, ty: 38, edge: 1 }, { x: 21, y: 0, to: north, tx: 21, ty: 38, edge: 1 },
  ];
  const flame = maps.flame;
  Object.assign(flame, {
    layoutVersion: 4, fullArt: "sunset-glow-highlands", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: sunsetTownRows(),
    warps: [...edges("route6", "route7"),
      { x: 39, y: 23, to: "volcano", tx: 5, ty: 10, edge: 1 },
      { x: 11, y: 12, to: "station", tx: 5, ty: 8, back: { map: "flame", x: 11, y: 14 } },
      { x: 30, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "flame", x: 30, y: 14 } }],
    signs: [{ x: 15, y: 30, text: ["夕映え高原", "金色の風が吹く 山上の広場"] }],
    npcs: (flame.npcs || []).map((n, i) => Object.assign({}, n, i ? { x: 28, y: 22 } : { x: 17, y: 24 })),
  });
  const route = maps.route7;
  Object.assign(route, {
    layoutVersion: 4, fullArt: "star-ring-railway", freeMove: true,
    spawn: { x: 15, y: 37 }, rows: railwayRows(),
    warps: [
      { x: 15, y: 39, to: "flame", tx: 20, ty: 2, edge: 1 }, { x: 16, y: 39, to: "flame", tx: 21, ty: 2, edge: 1 },
      { x: 15, y: 0, to: "galaxy", tx: 20, ty: 37, edge: 1 }, { x: 16, y: 0, to: "galaxy", tx: 21, ty: 37, edge: 1 }],
    signs: [{ x: 10, y: 30, text: ["星環鉄道沿い", "線路は踏切だけ 横断できます"] }],
    npcs: (route.npcs || []).map((n) => Object.assign({}, n, { x: 15, y: 27 })),
  });
  const city = maps.galaxy;
  Object.assign(city, {
    layoutVersion: 4, fullArt: "star-ring-capital", freeMove: true,
    spawn: { x: 20, y: 37 }, rows: capitalRows(),
    warps: [
      { x: 20, y: 39, to: "route7", tx: 15, ty: 2, edge: 1 }, { x: 21, y: 39, to: "route7", tx: 16, ty: 2, edge: 1 },
      { x: 20, y: 7, to: "arena", tx: 6, ty: 12 }, { x: 21, y: 7, to: "arena", tx: 7, ty: 12 },
      { x: 39, y: 21, to: "starhill", tx: 5, ty: 10, edge: 1 },
      { x: 8, y: 12, to: "station", tx: 5, ty: 8, back: { map: "galaxy", x: 8, y: 14 } },
      { x: 31, y: 12, to: "shop", tx: 4, ty: 6, back: { map: "galaxy", x: 31, y: 14 } }],
    signs: [{ x: 15, y: 31, text: ["星環の都", "七つの谷が出会う 山岳都市"] }],
    npcs: (city.npcs || []).map((n, i) => Object.assign({}, n, i ? { x: 27, y: 22 } : { x: 16, y: 22 })),
  });
}
