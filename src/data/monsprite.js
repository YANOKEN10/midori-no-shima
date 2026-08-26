// ============================================================
//  モンスターの ドットえを パーツから 組み立てる
//   ・16x16／左右たいしょう
//   ・0=ハイライト 1=からだ 2=かげ 3=ふち .=とうめい
//
//   からだ ごとに「かおの ばしょ」「つばさの つくところ」などの
//   めじるし(anchor)を もっているので、パーツが きれいに つきます。
//
//   recipe の れい：
//     { body:"quad", ear:"cat", crest:"flame", tail:"puff", eye:"round", mouth:"fang", pat:"belly" }
// ============================================================
const W = 16, H = 16;

function blank() {
  const g = [];
  for (let y = 0; y < H; y++) g.push(new Array(W).fill("."));
  return g;
}
function put(g, x, y, c) { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; }
function get(g, x, y) { return (x >= 0 && x < W && y >= 0 && y < H) ? g[y][x] : "."; }
// dx = まんなかから いくつめ（0 が いちばん内がわ）
function sym(g, dx, y, c) { put(g, 7 - dx, y, c); put(g, 8 + dx, y, c); }
function symIf(g, dx, y, c, only) {
  if (get(g, 7 - dx, y) === only) put(g, 7 - dx, y, c);
  if (get(g, 8 + dx, y) === only) put(g, 8 + dx, y, c);
}
function rowFill(g, y, w, c) { for (let dx = 0; dx < w; dx++) sym(g, dx, y, c); }
function symBox(g, dx, y, w, h, c) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) sym(g, dx + i, y + j, c);
}
function ellipseW(y, cy, ry, rx) {
  const t = (y - cy) / ry;
  if (Math.abs(t) > 1) return 0;
  return Math.max(1, Math.round(rx * Math.sqrt(1 - t * t)));
}
function fillEllipse(g, cy, ry, rx, y0, y1, c) {
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) {
    const w = ellipseW(y, cy, ry, rx);
    if (w) rowFill(g, y, w, c);
  }
}
// その行の からだの はば（ふちを ふくむ）
function widthAt(g, y) {
  let w = 0;
  for (let dx = 0; dx < 8; dx++) if (get(g, 7 - dx, y) !== ".") w = dx + 1;
  return w;
}

/* ============================================================
   からだ
   かえりち: { eyeY, eyeDX, topY, botY, sideY, sideDX, footY }
============================================================ */
const BODIES = {
  // まるい（スライム風）
  blob(g) {
    fillEllipse(g, 10, 5.6, 6.6, 4, 15, 1);
    return { eyeY: 9, eyeDX: 3, topY: 4, botY: 15, sideY: 10, sideDX: 6, footY: 15 };
  },

  // たまご（たてなが）
  egg(g) {
    fillEllipse(g, 9, 6.4, 5.0, 2, 15, 1);
    return { eyeY: 6, eyeDX: 2, topY: 2, botY: 15, sideY: 9, sideDX: 5, footY: 15 };
  },

  // 4つあし
  quad(g) {
    fillEllipse(g, 10, 2.8, 6.2, 7, 12, 1);
    fillEllipse(g, 5, 3.4, 4.0, 2, 8, 1);
    for (const dx of [1, 4]) symBox(g, dx, 12, 2, 4, 1);
    return { eyeY: 5, eyeDX: 2, topY: 2, botY: 15, sideY: 10, sideDX: 6, footY: 15 };
  },

  // こいぬ（あたまが 大きい 4つあし）
  puppy(g) {
    fillEllipse(g, 11, 2.6, 5.0, 9, 13, 1);
    fillEllipse(g, 6, 4.0, 4.6, 2, 10, 1);
    for (const dx of [1, 3]) symBox(g, dx, 13, 2, 3, 1);
    return { eyeY: 6, eyeDX: 2, topY: 2, botY: 15, sideY: 11, sideDX: 5, footY: 15 };
  },

  // 2ほんあし（けもの）
  beast(g) {
    fillEllipse(g, 11, 4.2, 4.6, 7, 14, 1);
    fillEllipse(g, 5, 3.6, 4.2, 1, 8, 1);
    symBox(g, 4, 9, 2, 4, 1);
    symBox(g, 1, 14, 3, 2, 1);
    return { eyeY: 5, eyeDX: 2, topY: 1, botY: 15, sideY: 10, sideDX: 5, footY: 15 };
  },

  // とり
  bird(g) {
    fillEllipse(g, 9, 4.0, 4.2, 5, 13, 1);
    fillEllipse(g, 4, 3.0, 3.4, 1, 7, 1);
    symBox(g, 4, 8, 2, 4, 1);
    symBox(g, 1, 14, 1, 2, 1);
    return { eyeY: 4, eyeDX: 2, topY: 1, botY: 15, sideY: 9, sideDX: 5, footY: 15 };
  },

  // むし（ふしめ）
  bug(g) {
    fillEllipse(g, 5, 3.2, 3.8, 2, 8, 1);
    for (let y = 9; y <= 15; y++) rowFill(g, y, y % 2 === 0 ? 5 : 4, 1);
    return { eyeY: 5, eyeDX: 2, topY: 2, botY: 15, sideY: 10, sideDX: 5, footY: 15 };
  },

  // いもむし（たてに ながい）
  worm(g) {
    fillEllipse(g, 4, 3.0, 3.6, 1, 6, 1);
    for (let y = 7; y <= 15; y++) rowFill(g, y, (y % 3 === 0) ? 4 : 3, 1);
    return { eyeY: 4, eyeDX: 2, topY: 1, botY: 15, sideY: 9, sideDX: 4, footY: 15 };
  },

  // さかな
  fish(g) {
    fillEllipse(g, 8, 5.0, 4.4, 3, 13, 1);
    symBox(g, 4, 8, 3, 2, 1);
    symBox(g, 0, 14, 2, 2, 1);
    symBox(g, 2, 15, 2, 1, 1);
    return { eyeY: 6, eyeDX: 2, topY: 3, botY: 15, sideY: 8, sideDX: 6, footY: 15 };
  },

  // へび（フードを ひろげた）
  snake(g) {
    for (let y = 10; y <= 15; y++) rowFill(g, y, y >= 13 ? 3 : 2, 1);
    fillEllipse(g, 6, 4.0, 6.4, 2, 10, 1);
    fillEllipse(g, 5, 2.6, 3.0, 3, 7, 1);
    return { eyeY: 5, eyeDX: 2, topY: 2, botY: 15, sideY: 6, sideDX: 6, footY: 15 };
  },

  // おばけ
  ghost(g) {
    fillEllipse(g, 8, 5.6, 5.2, 2, 12, 1);
    for (let dx = 0; dx < 5; dx++) {
      const h = (dx % 2 === 0) ? 3 : 1;
      for (let j = 0; j < h; j++) sym(g, dx, 12 + j, 1);
    }
    return { eyeY: 6, eyeDX: 2, topY: 2, botY: 14, sideY: 8, sideDX: 5, footY: 14 };
  },

  // いわ
  rock(g) {
    for (let y = 4; y <= 14; y++) {
      const w = y < 6 ? 4 + (y - 4) : y > 12 ? 7 - (y - 12) : 6;
      rowFill(g, y, w, 1);
    }
    return { eyeY: 8, eyeDX: 3, topY: 4, botY: 14, sideY: 9, sideDX: 6, footY: 14 };
  },

  // けっしょう（とがった いし）
  crystal(g) {
    for (let y = 2; y <= 15; y++) {
      const w = y < 8 ? 1 + Math.floor((y - 2) * 0.8) : 6 - Math.floor((y - 8) * 0.3);
      rowFill(g, y, Math.max(1, w), 1);
    }
    return { eyeY: 9, eyeDX: 2, topY: 2, botY: 15, sideY: 10, sideDX: 5, footY: 15 };
  },

  // くさ
  plant(g) {
    fillEllipse(g, 12, 3.8, 5.6, 8, 15, 1);
    fillEllipse(g, 6, 3.6, 3.8, 2, 10, 1);
    return { eyeY: 6, eyeDX: 2, topY: 2, botY: 15, sideY: 7, sideDX: 4, footY: 15 };
  },

  // きのこ
  mush(g) {
    fillEllipse(g, 6, 3.6, 7.0, 2, 9, 1);
    for (let y = 10; y <= 15; y++) rowFill(g, y, 3, 1);
    return { eyeY: 11, eyeDX: 1, topY: 2, botY: 15, sideY: 6, sideDX: 6, footY: 15 };
  },

  // ちいさな たま
  ball(g) {
    fillEllipse(g, 9, 4.6, 4.6, 4, 14, 1);
    return { eyeY: 8, eyeDX: 2, topY: 4, botY: 14, sideY: 9, sideDX: 5, footY: 14 };
  },

  // かに（はさみが うえ）
  crab(g) {
    fillEllipse(g, 10, 3.0, 6.0, 7, 13, 1);
    symBox(g, 4, 3, 3, 4, 1);
    symBox(g, 6, 5, 2, 3, 1);
    symBox(g, 1, 13, 2, 3, 1);
    symBox(g, 4, 13, 2, 3, 1);
    return { eyeY: 9, eyeDX: 3, topY: 3, botY: 15, sideY: 10, sideDX: 6, footY: 15 };
  },

  // くらげ（したに あし）
  jelly(g) {
    fillEllipse(g, 7, 4.6, 5.4, 2, 9, 1);
    for (const dx of [0, 2, 4]) symBox(g, dx, 10, 1, 5, 1);
    return { eyeY: 6, eyeDX: 2, topY: 2, botY: 15, sideY: 7, sideDX: 5, footY: 15 };
  },

  // こうもり
  bat(g) {
    fillEllipse(g, 8, 3.4, 3.0, 5, 12, 1);
    for (let dx = 3; dx <= 7; dx++) {
      const top = 4 + (dx - 3), bot = 10 - Math.floor((dx - 3) / 2);
      for (let y = top; y <= bot; y++) sym(g, dx, y, 1);
    }
    return { eyeY: 7, eyeDX: 1, topY: 4, botY: 13, sideY: 6, sideDX: 7, footY: 13 };
  },

  // りゅう
  drake(g) {
    fillEllipse(g, 11, 4.4, 4.4, 7, 15, 1);
    fillEllipse(g, 4, 3.4, 4.2, 1, 8, 1);
    symBox(g, 4, 9, 2, 3, 1);
    symBox(g, 1, 14, 3, 2, 1);
    return { eyeY: 4, eyeDX: 2, topY: 1, botY: 15, sideY: 10, sideDX: 5, footY: 15 };
  },

  // かめ（こうらと 手あし）
  shell(g) {
    fillEllipse(g, 9, 3.6, 6.4, 5, 13, 1);
    fillEllipse(g, 9, 2.6, 4.0, 6, 12, 2);
    symBox(g, 5, 12, 2, 3, 1);
    symBox(g, 1, 13, 2, 3, 1);
    for (let y = 12; y <= 15; y++) rowFill(g, y, 1, 1);
    return { eyeY: 14, eyeDX: 0, topY: 5, botY: 15, sideY: 9, sideDX: 6, footY: 15 };
  },

  // ひとがた
  imp(g) {
    fillEllipse(g, 4, 3.4, 4.0, 1, 7, 1);
    fillEllipse(g, 11, 3.6, 3.4, 8, 14, 1);
    symBox(g, 3, 9, 2, 3, 1);
    symBox(g, 0, 14, 2, 2, 1);
    return { eyeY: 4, eyeDX: 2, topY: 1, botY: 15, sideY: 10, sideDX: 4, footY: 15 };
  },

  // おおきな ひとがた（ゴーレム）
  golem(g) {
    fillEllipse(g, 4, 2.6, 3.4, 1, 6, 1);
    for (let y = 7; y <= 13; y++) rowFill(g, y, 5, 1);
    symBox(g, 5, 7, 2, 5, 1);
    symBox(g, 1, 14, 3, 2, 1);
    return { eyeY: 4, eyeDX: 2, topY: 1, botY: 15, sideY: 9, sideDX: 6, footY: 15 };
  },

  // ふわふわ（くも）
  cloud(g) {
    fillEllipse(g, 7, 3.4, 6.4, 4, 10, 1);
    fillEllipse(g, 11, 2.6, 4.4, 9, 13, 1);
    return { eyeY: 7, eyeDX: 3, topY: 4, botY: 13, sideY: 7, sideDX: 6, footY: 13 };
  },

  // ながい くび
  neck(g) {
    fillEllipse(g, 12, 3.2, 5.6, 9, 15, 1);
    for (let y = 5; y <= 10; y++) rowFill(g, y, 2, 1);
    fillEllipse(g, 3, 2.8, 3.6, 1, 6, 1);
    for (const dx of [1, 4]) symBox(g, dx, 14, 2, 2, 1);
    return { eyeY: 3, eyeDX: 2, topY: 1, botY: 15, sideY: 12, sideDX: 5, footY: 15 };
  },

  // ほのおの かたまり
  fire(g) {
    for (let y = 3; y <= 15; y++) {
      const w = y < 6 ? 1 + (y - 3) : y < 9 ? 4 : 5;
      rowFill(g, y, w, 1);
    }
    symBox(g, 5, 8, 2, 4, 1);
    return { eyeY: 9, eyeDX: 2, topY: 3, botY: 15, sideY: 10, sideDX: 5, footY: 15 };
  },

  // ほし
  star(g) {
    symBox(g, 0, 1, 2, 4, 1);
    for (let y = 5; y <= 9; y++) rowFill(g, y, 7 - Math.abs(7 - y), 1);
    rowFill(g, 6, 7, 1); rowFill(g, 7, 7, 1);
    symBox(g, 5, 10, 2, 4, 1);
    symBox(g, 1, 10, 2, 5, 1);
    return { eyeY: 7, eyeDX: 2, topY: 1, botY: 15, sideY: 7, sideDX: 6, footY: 15 };
  },

  // からくり（かくばった）
  robot(g) {
    for (let y = 2; y <= 7; y++) rowFill(g, y, 4, 1);
    for (let y = 8; y <= 13; y++) rowFill(g, y, 6, 1);
    symBox(g, 6, 8, 2, 4, 1);
    symBox(g, 1, 14, 3, 2, 1);
    return { eyeY: 4, eyeDX: 2, topY: 2, botY: 15, sideY: 10, sideDX: 6, footY: 15 };
  },
};

/* ============ かざり ============ */
const EARS = {
  none() {},
  cat(g, L) { for (let i = 0; i < 3; i++) symBox(g, L.eyeDX + 1 + i, L.eyeY - 2 - i, 1, 2 + i, 1); },
  round(g, L) { symBox(g, L.eyeDX + 2, L.eyeY - 3, 2, 3, 1); },
  long(g, L) { symBox(g, L.eyeDX, L.eyeY - 8, 2, 6, 1); },
  fin(g, L) { symBox(g, L.eyeDX + 2, L.eyeY - 1, 3, 2, 1); },
  side(g, L) { symBox(g, L.eyeDX + 2, L.eyeY - 2, 3, 1, 1); },
  droop(g, L) { symBox(g, L.eyeDX + 2, L.eyeY - 2, 2, 4, 1); },
};

const CRESTS = {
  none() {},
  spike(g, L) { symBox(g, 0, L.topY - 3, 1, 3, 1); symBox(g, 1, L.topY - 2, 1, 2, 1); },
  leaf(g, L) { symBox(g, 0, L.topY - 4, 1, 4, 1); symBox(g, 1, L.topY - 4, 2, 2, 1); },
  flame(g, L) { symBox(g, 0, L.topY - 4, 1, 4, 1); symBox(g, 1, L.topY - 3, 1, 2, 1); symBox(g, 2, L.topY - 1, 1, 1, 1); },
  fan(g, L) { for (let dx = 0; dx < 4; dx++) symBox(g, dx, L.topY - 3 + dx, 1, 4 - dx, 1); },
  ball(g, L) { symBox(g, 0, L.topY - 3, 1, 2, 1); symBox(g, 0, L.topY - 5, 2, 2, 1); },
  horns(g, L) { symBox(g, 2, L.topY - 3, 1, 3, 1); symBox(g, 3, L.topY - 2, 1, 2, 1); },
  antenna(g, L) { symBox(g, 1, L.topY - 5, 1, 5, 1); symBox(g, 1, L.topY - 6, 2, 1, 1); },
  crown(g, L) { for (const dx of [0, 2, 4]) symBox(g, dx, L.topY - 3, 1, 3, 1); symBox(g, 0, L.topY - 1, 5, 1, 1); },
};

const WINGS = {
  none() {},
  small(g, L) { symBox(g, L.sideDX - 1, L.sideY - 1, 2, 3, 1); },
  big(g, L) { for (let i = 0; i < 3; i++) symBox(g, L.sideDX - 1 + i, L.sideY - 2 + i, 1, 5 - i, 1); },
  bug(g, L) { symBox(g, L.sideDX - 1, L.sideY - 3, 3, 5, 1); },
  fin(g, L) { symBox(g, L.sideDX, L.sideY, 2, 3, 1); },
  arm(g, L) { symBox(g, L.sideDX - 1, L.sideY, 2, 4, 1); },
};

const TAILS = {
  none() {},
  puff(g, L) { symBox(g, 5, L.botY - 4, 2, 2, 1); },
  spike(g, L) { symBox(g, 6, L.botY - 5, 2, 1, 1); },
  long(g, L) { symBox(g, 6, L.botY - 6, 1, 5, 1); },
  fan(g, L) { for (let dx = 5; dx < 8; dx++) symBox(g, dx, L.botY - 3 - (dx - 5), 1, 2, 1); },
};

/* ============ かお ============ */
function eyeSpot(L) { return Math.max(1, L.eyeDX); }

const EYES = {
  dot(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 3); },
  round(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 3); sym(g, d, L.eyeY - 1, 0); },
  big(g, L) {
    const d = eyeSpot(L);
    for (let j = 0; j < 2; j++) { sym(g, d, L.eyeY - 1 + j, 3); sym(g, d + 1, L.eyeY - 1 + j, 3); }
    sym(g, d + 1, L.eyeY - 1, 0);
  },
  angry(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 3); sym(g, d + 1, L.eyeY - 1, 3); },
  closed(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 3); sym(g, d + 1, L.eyeY, 3); },
  visor(g, L) { for (let dx = 0; dx <= L.eyeDX + 1; dx++) symIf(g, dx, L.eyeY, 3, "1"); sym(g, eyeSpot(L), L.eyeY, 0); },
  glow(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 0); sym(g, d, L.eyeY - 1, 3); sym(g, d + 1, L.eyeY, 3); },
  sleepy(g, L) { const d = eyeSpot(L); sym(g, d, L.eyeY, 3); sym(g, d + 1, L.eyeY + 1, 3); },
};

const MOUTHS = {
  none() {},
  fang(g, L) { sym(g, 0, L.eyeY + 2, 3); sym(g, 1, L.eyeY + 2, 3); sym(g, 1, L.eyeY + 3, 3); },
  smile(g, L) { sym(g, 0, L.eyeY + 3, 3); sym(g, 1, L.eyeY + 2, 3); },
  beak(g, L) { sym(g, 0, L.eyeY + 2, 0); sym(g, 1, L.eyeY + 3, 0); sym(g, 0, L.eyeY + 4, 3); },
  line(g, L) { sym(g, 0, L.eyeY + 2, 3); sym(g, 1, L.eyeY + 2, 3); },
  open(g, L) { symBox(g, 0, L.eyeY + 2, 2, 2, 3); },
};

/* ============ もよう ============ */
const PATTERNS = {
  none() {},
  belly(g, L) {
    for (let y = L.botY - 5; y <= L.botY - 2; y++) for (let dx = 0; dx < 3; dx++) symIf(g, dx, y, "0", "1");
  },
  stripe(g, L) {
    for (let y = L.topY + 3; y < L.botY - 1; y += 3) for (let dx = 0; dx < 7; dx++) symIf(g, dx, y, "2", "1");
  },
  spot(g, L) {
    for (const [dx, dy] of [[2, 3], [4, 6], [1, 8]]) {
      const y = L.topY + dy;
      symIf(g, dx, y, "2", "1"); symIf(g, dx + 1, y, "2", "1"); symIf(g, dx, y + 1, "2", "1");
    }
  },
  back(g, L) { for (let dx = 0; dx < 5; dx++) symIf(g, dx, L.topY + 2, "2", "1"); },
  band(g, L) {
    const y = Math.round((L.topY + L.botY) / 2);
    for (let dx = 0; dx < 8; dx++) symIf(g, dx, y, "2", "1");
  },
  dots(g, L) {
    for (const [dx, dy] of [[3, 4], [1, 6], [4, 9], [2, 11]]) symIf(g, dx, L.topY + dy, "0", "1");
  },
  plate(g, L) {
    for (let y = L.botY - 6; y <= L.botY - 2; y++) for (let dx = 0; dx < 4; dx++) symIf(g, dx, y, "2", "1");
  },
};

/* ============ 組み立て ============ */
function outline(g) {
  const out = g.map((r) => r.slice());
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] === ".") continue;
      if (get(g, x - 1, y) === "." || get(g, x + 1, y) === "." ||
          get(g, x, y - 1) === "." || get(g, x, y + 1) === "." ||
          y === 0 || y === H - 1 || x === 0 || x === W - 1) out[y][x] = "3";
    }
  }
  return out;
}
function shade(g, L) {
  for (let y = L.botY - 2; y <= L.botY; y++) {
    if (!g[y]) continue;
    for (let x = 0; x < W; x++) if (g[y][x] === "1") g[y][x] = "2";
  }
}
function highlight(g, L) {
  const y = L.topY + 1;
  symIf(g, 1, y, "0", "1");
  symIf(g, 2, y + 1, "0", "1");
}

// ちいさい モンスターは ひとまわり 小さく（左右たいしょうを たもったまま）
function resize(rows, n) {
  const off = Math.floor((W - n) / 2);
  const g = blank();
  const h = n / 2;
  for (let y = 0; y < n; y++) {
    const sy = Math.min(H - 1, Math.floor(y * H / n));
    for (let dx = 0; dx < h; dx++) {
      const sdx = Math.min(7, Math.floor(dx * 8 / h));
      const ch = rows[sy][7 - sdx];
      g[y + off][off + h - 1 - dx] = ch;
      g[y + off][off + h + dx] = ch;
    }
  }
  return g.map((r) => r.join(""));
}

export function buildSprite(recipe) {
  const r = recipe || {};
  let g = blank();
  const body = BODIES[r.body] || BODIES.blob;
  const L = body(g);

  (EARS[r.ear] || EARS.none)(g, L);
  (CRESTS[r.crest] || CRESTS.none)(g, L);
  (WINGS[r.wing] || WINGS.none)(g, L);
  (TAILS[r.tail] || TAILS.none)(g, L);

  g = outline(g);
  shade(g, L);
  highlight(g, L);
  (PATTERNS[r.pat] || PATTERNS.none)(g, L);
  (EYES[r.eye] || EYES.dot)(g, L);
  (MOUTHS[r.mouth] || MOUTHS.none)(g, L);

  const rows = g.map((row) => row.join(""));
  if (r.size === "s") return resize(rows, 12);
  if (r.size === "m") return resize(rows, 14);
  return rows;
}

export const PART_NAMES = {
  body: Object.keys(BODIES), ear: Object.keys(EARS), crest: Object.keys(CRESTS),
  wing: Object.keys(WINGS), tail: Object.keys(TAILS), eye: Object.keys(EYES),
  mouth: Object.keys(MOUTHS), pat: Object.keys(PATTERNS),
};
