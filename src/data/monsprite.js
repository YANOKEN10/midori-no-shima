// ============================================================
//  ガオンの ドットえを パーツから 組み立てる（32x32）
//   ・左右たいしょう。0=ハイライト 1=からだ 2=かげ 3=ふち .=とうめい
//   ・からだ ごとに「目の ばしょ」「つばさの つくところ」などの
//     めじるし(anchor)を もっているので パーツが きれいに つきます。
//
//   recipe の れい：
//     { body:"quad", ear:"cat", crest:"flame", tail:"puff",
//       eye:"round", mouth:"fang", pat:"belly" }
// ============================================================
const W = 32, H = 32;
const CX = 15;              // 左がわの まん中の れつ（右は 16）

function blank() {
  const g = [];
  for (let y = 0; y < H; y++) g.push(new Array(W).fill("."));
  return g;
}
function put(g, x, y, c) { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; }
function get(g, x, y) { return (x >= 0 && x < W && y >= 0 && y < H) ? g[y][x] : "."; }
// dx = まん中から いくつめ（0 が いちばん内がわ）
function sym(g, dx, y, c) { put(g, CX - dx, y, c); put(g, CX + 1 + dx, y, c); }
function symIf(g, dx, y, c, only) {
  if (get(g, CX - dx, y) === only) put(g, CX - dx, y, c);
  if (get(g, CX + 1 + dx, y) === only) put(g, CX + 1 + dx, y, c);
}
function rowFill(g, y, w, c) { for (let dx = 0; dx < w; dx++) sym(g, dx, y, c); }
function box(g, dx, y, w, h, c) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) sym(g, dx + i, y + j, c);
}
function ellipseW(y, cy, ry, rx) {
  const t = (y - cy) / ry;
  if (Math.abs(t) > 1) return 0;
  return Math.max(1, Math.round(rx * Math.sqrt(1 - t * t)));
}
function ell(g, cy, ry, rx, y0, y1, c) {
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) {
    const w = ellipseW(y, cy, ry, rx);
    if (w) rowFill(g, y, w, c || 1);
  }
}
// さんかく（つの・ひれ など）dir: -1=うえむき 1=したむき
function tri(g, dx, y, w, h, dir, c) {
  for (let j = 0; j < h; j++) {
    const ww = Math.max(1, Math.round(w * (1 - j / h)));
    const yy = dir < 0 ? y + j : y + h - 1 - j;
    for (let i = 0; i < ww; i++) sym(g, dx + i, yy, c || 1);
  }
}

/* ============================================================
   からだ
   かえりち: { eyeY, eyeDX, topY, botY, sideY, sideDX, footY }
============================================================ */
const BODIES = {
  // まるい（スライム風）
  blob(g) {
    ell(g, 20, 11, 13, 8, 31);
    return { eyeY: 17, eyeDX: 6, topY: 8, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },

  // たまご（たてなが）
  egg(g) {
    ell(g, 18, 13, 10, 4, 31);
    return { eyeY: 12, eyeDX: 5, topY: 4, botY: 31, sideY: 18, sideDX: 10, footY: 31 };
  },

  // 4つあし
  quad(g) {
    ell(g, 20, 6, 12, 14, 25);            // どうたい
    ell(g, 11, 7, 8, 4, 17);              // あたま
    for (const dx of [2, 8]) box(g, dx, 25, 4, 7, 1);
    box(g, 2, 30, 5, 2, 1); box(g, 8, 30, 5, 2, 1);
    return { eyeY: 10, eyeDX: 4, topY: 4, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },

  // あたまの 大きい 4つあし（こいぬ）
  puppy(g) {
    ell(g, 22, 5, 10, 17, 27);
    ell(g, 12, 8, 9, 3, 20);
    for (const dx of [2, 7]) box(g, dx, 26, 4, 6, 1);
    return { eyeY: 12, eyeDX: 4, topY: 3, botY: 31, sideY: 22, sideDX: 10, footY: 31 };
  },

  // 2ほんあし（けもの）
  beast(g) {
    ell(g, 22, 9, 9, 14, 29);             // からだ
    ell(g, 10, 7, 9, 2, 17);              // あたま
    box(g, 8, 18, 4, 8, 1);               // うで
    box(g, 2, 29, 6, 3, 1);               // あし
    return { eyeY: 9, eyeDX: 4, topY: 2, botY: 31, sideY: 20, sideDX: 10, footY: 31 };
  },

  // とり
  bird(g) {
    ell(g, 19, 8, 8, 11, 27);
    ell(g, 9, 6, 7, 2, 15);
    box(g, 7, 16, 4, 9, 1);               // たたんだ つばさ
    box(g, 2, 28, 2, 4, 1);
    return { eyeY: 8, eyeDX: 3, topY: 2, botY: 31, sideY: 18, sideDX: 10, footY: 31 };
  },

  // むし（ふしめの ある からだ）
  bug(g) {
    ell(g, 10, 6, 8, 3, 16);
    for (let y = 17; y <= 31; y++) rowFill(g, y, (y % 4 < 2) ? 10 : 8, 1);
    return { eyeY: 9, eyeDX: 4, topY: 3, botY: 31, sideY: 21, sideDX: 10, footY: 31 };
  },

  // いもむし
  worm(g) {
    ell(g, 8, 6, 7, 2, 13);
    for (let y = 14; y <= 31; y++) rowFill(g, y, (y % 5 < 3) ? 7 : 6, 1);
    return { eyeY: 8, eyeDX: 3, topY: 2, botY: 31, sideY: 20, sideDX: 7, footY: 31 };
  },

  // さかな
  fish(g) {
    ell(g, 16, 10, 9, 6, 26);
    tri(g, 8, 14, 6, 6, 1, 1);            // よこの ひれ
    box(g, 0, 27, 3, 4, 1);
    tri(g, 2, 28, 6, 4, -1, 1);           // おびれ
    return { eyeY: 12, eyeDX: 4, topY: 6, botY: 31, sideY: 16, sideDX: 12, footY: 31 };
  },

  // へび（フードを ひろげた）
  snake(g) {
    for (let y = 20; y <= 31; y++) rowFill(g, y, y >= 26 ? 7 : 4, 1);
    ell(g, 13, 9, 13, 4, 21);             // フード
    ell(g, 10, 6, 6, 5, 15);              // あたま
    return { eyeY: 10, eyeDX: 3, topY: 4, botY: 31, sideY: 13, sideDX: 12, footY: 31 };
  },

  // おばけ
  ghost(g) {
    ell(g, 16, 12, 11, 4, 25);
    for (let dx = 0; dx < 11; dx++) {
      const h = (dx % 4 < 2) ? 6 : 2;
      for (let j = 0; j < h; j++) sym(g, dx, 25 + j, 1);
    }
    return { eyeY: 13, eyeDX: 4, topY: 4, botY: 29, sideY: 16, sideDX: 11, footY: 29 };
  },

  // いわ
  rock(g) {
    for (let y = 8; y <= 29; y++) {
      const w = y < 13 ? 7 + (y - 8) : y > 25 ? 13 - (y - 25) * 2 : 12;
      rowFill(g, y, Math.max(2, w), 1);
    }
    return { eyeY: 17, eyeDX: 6, topY: 8, botY: 29, sideY: 19, sideDX: 12, footY: 29 };
  },

  // けっしょう
  crystal(g) {
    for (let y = 3; y <= 31; y++) {
      const w = y < 17 ? 1 + Math.floor((y - 3) * 0.8) : 12 - Math.floor((y - 17) * 0.3);
      rowFill(g, y, Math.max(1, w), 1);
    }
    return { eyeY: 19, eyeDX: 4, topY: 3, botY: 31, sideY: 20, sideDX: 10, footY: 31 };
  },

  // くさ
  plant(g) {
    ell(g, 24, 8, 11, 16, 31);
    ell(g, 13, 7, 8, 5, 21);
    return { eyeY: 12, eyeDX: 4, topY: 5, botY: 31, sideY: 15, sideDX: 8, footY: 31 };
  },

  // きのこ
  mush(g) {
    ell(g, 12, 8, 14, 3, 19);
    for (let y = 20; y <= 31; y++) rowFill(g, y, 6, 1);
    return { eyeY: 24, eyeDX: 3, topY: 3, botY: 31, sideY: 12, sideDX: 13, footY: 31 };
  },

  // ちいさな たま
  ball(g) {
    ell(g, 19, 9, 9, 9, 28);
    return { eyeY: 17, eyeDX: 4, topY: 9, botY: 28, sideY: 19, sideDX: 9, footY: 28 };
  },

  // かに
  crab(g) {
    ell(g, 20, 6, 12, 13, 27);
    box(g, 8, 6, 5, 8, 1);                // はさみ
    box(g, 12, 10, 4, 6, 1);
    box(g, 2, 27, 4, 5, 1); box(g, 8, 27, 4, 5, 1);
    return { eyeY: 18, eyeDX: 6, topY: 6, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },

  // くらげ
  jelly(g) {
    ell(g, 14, 9, 11, 4, 19);
    for (const dx of [0, 4, 8]) box(g, dx, 20, 2, 11, 1);
    return { eyeY: 12, eyeDX: 4, topY: 4, botY: 31, sideY: 14, sideDX: 11, footY: 31 };
  },

  // こうもり
  bat(g) {
    ell(g, 17, 7, 6, 10, 25);
    for (let dx = 6; dx <= 15; dx++) {
      const top = 8 + (dx - 6), bot = 21 - Math.floor((dx - 6) / 2);
      for (let y = top; y <= bot; y++) sym(g, dx, y, 1);
    }
    return { eyeY: 15, eyeDX: 2, topY: 8, botY: 26, sideY: 13, sideDX: 15, footY: 26 };
  },

  // りゅう
  drake(g) {
    ell(g, 22, 9, 9, 14, 31);
    ell(g, 9, 7, 9, 2, 17);
    box(g, 8, 18, 4, 7, 1);
    box(g, 2, 29, 6, 3, 1);
    return { eyeY: 9, eyeDX: 4, topY: 2, botY: 31, sideY: 20, sideDX: 10, footY: 31 };
  },

  // かめ
  shell(g) {
    ell(g, 19, 8, 13, 11, 27);
    ell(g, 19, 5, 8, 14, 25, 2);          // こうらの もよう
    box(g, 10, 25, 4, 6, 1);
    box(g, 2, 27, 4, 5, 1);
    for (let y = 25; y <= 31; y++) rowFill(g, y, 3, 1);
    return { eyeY: 28, eyeDX: 1, topY: 11, botY: 31, sideY: 19, sideDX: 13, footY: 31 };
  },

  // ひとがた
  imp(g) {
    ell(g, 9, 7, 8, 2, 16);
    ell(g, 22, 8, 7, 15, 29);
    box(g, 6, 18, 4, 7, 1);
    box(g, 1, 29, 4, 3, 1);
    return { eyeY: 9, eyeDX: 4, topY: 2, botY: 31, sideY: 21, sideDX: 8, footY: 31 };
  },

  // ゴーレム
  golem(g) {
    ell(g, 8, 5, 7, 2, 13);
    for (let y = 14; y <= 27; y++) rowFill(g, y, 10, 1);
    box(g, 10, 14, 4, 10, 1);
    box(g, 2, 28, 6, 4, 1);
    return { eyeY: 8, eyeDX: 3, topY: 2, botY: 31, sideY: 18, sideDX: 12, footY: 31 };
  },

  // ふわふわ（くも）
  cloud(g) {
    ell(g, 14, 7, 13, 8, 21);
    ell(g, 23, 5, 9, 19, 27);
    return { eyeY: 14, eyeDX: 6, topY: 8, botY: 27, sideY: 14, sideDX: 13, footY: 27 };
  },

  // ながい くび
  neck(g) {
    ell(g, 25, 6, 11, 19, 31);
    for (let y = 10; y <= 21; y++) rowFill(g, y, 4, 1);
    ell(g, 7, 5, 7, 2, 12);
    for (const dx of [2, 8]) box(g, dx, 29, 4, 3, 1);
    return { eyeY: 6, eyeDX: 3, topY: 2, botY: 31, sideY: 25, sideDX: 11, footY: 31 };
  },

  // ほのおの かたまり
  fire(g) {
    for (let y = 6; y <= 31; y++) {
      const w = y < 12 ? 2 + (y - 6) : y < 18 ? 8 : 10;
      rowFill(g, y, w, 1);
    }
    box(g, 10, 17, 3, 8, 1);
    return { eyeY: 19, eyeDX: 4, topY: 6, botY: 31, sideY: 21, sideDX: 10, footY: 31 };
  },

  // ほし
  star(g) {
    tri(g, 0, 1, 4, 8, -1, 1);
    for (let y = 9; y <= 19; y++) rowFill(g, y, 13 - Math.abs(14 - y), 1);
    tri(g, 10, 20, 5, 9, 1, 1);
    tri(g, 1, 20, 6, 11, 1, 1);
    return { eyeY: 14, eyeDX: 4, topY: 1, botY: 31, sideY: 14, sideDX: 12, footY: 31 };
  },

  // からくり
  robot(g) {
    for (let y = 4; y <= 15; y++) rowFill(g, y, 8, 1);
    for (let y = 16; y <= 27; y++) rowFill(g, y, 12, 1);
    box(g, 12, 16, 4, 8, 1);
    box(g, 2, 28, 6, 4, 1);
    return { eyeY: 9, eyeDX: 4, topY: 4, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },
};

/* ============ かざり ============ */
const EARS = {
  none() {},
  cat(g, L) { tri(g, L.eyeDX + 2, L.eyeY - 9, 4, 8, -1, 1); },
  round(g, L) { ell(g, L.eyeY - 6, 4, 4, L.eyeY - 10, L.eyeY - 2, 1); box(g, L.eyeDX + 3, L.eyeY - 8, 4, 6, 1); },
  long(g, L) { box(g, L.eyeDX, L.eyeY - 16, 4, 12, 1); },
  fin(g, L) { tri(g, L.eyeDX + 3, L.eyeY - 3, 6, 5, 1, 1); },
  side(g, L) { box(g, L.eyeDX + 3, L.eyeY - 4, 6, 3, 1); },
  droop(g, L) { box(g, L.eyeDX + 3, L.eyeY - 4, 4, 9, 1); },
  horn(g, L) { tri(g, L.eyeDX + 3, L.eyeY - 6, 3, 6, -1, 1); },
};

const CRESTS = {
  none() {},
  spike(g, L) { tri(g, 0, L.topY - 7, 3, 7, -1, 1); tri(g, 3, L.topY - 4, 2, 4, -1, 1); },
  leaf(g, L) { box(g, 0, L.topY - 8, 2, 8, 1); ell(g, L.topY - 8, 3, 6, L.topY - 11, L.topY - 5, 1); },
  flame(g, L) { tri(g, 0, L.topY - 9, 4, 9, -1, 1); tri(g, 4, L.topY - 5, 3, 5, -1, 1); },
  fan(g, L) { for (let dx = 0; dx < 8; dx++) tri(g, dx, L.topY - 7 + dx, 1, 8 - dx, -1, 1); },
  ball(g, L) { box(g, 0, L.topY - 5, 2, 5, 1); ell(g, L.topY - 7, 3, 4, L.topY - 10, L.topY - 4, 1); },
  horns(g, L) { tri(g, 4, L.topY - 7, 3, 7, -1, 1); tri(g, 7, L.topY - 4, 2, 4, -1, 1); },
  antenna(g, L) { box(g, 2, L.topY - 10, 2, 10, 1); ell(g, L.topY - 11, 2, 3, L.topY - 13, L.topY - 9, 1); },
  crown(g, L) { for (const dx of [0, 4, 8]) tri(g, dx, L.topY - 7, 3, 7, -1, 1); box(g, 0, L.topY - 3, 11, 3, 1); },
};

const WINGS = {
  none() {},
  small(g, L) { tri(g, L.sideDX - 1, L.sideY - 3, 5, 7, 1, 1); },
  big(g, L) { for (let i = 0; i < 6; i++) box(g, L.sideDX - 1 + i, L.sideY - 5 + i, 1, 11 - i, 1); },
  bug(g, L) { ell(g, L.sideY, 6, 5, L.sideY - 6, L.sideY + 6, 1); box(g, L.sideDX - 2, L.sideY - 6, 6, 12, 1); },
  fin(g, L) { tri(g, L.sideDX, L.sideY, 4, 7, 1, 1); },
  arm(g, L) { box(g, L.sideDX - 2, L.sideY, 4, 8, 1); },
};

const TAILS = {
  none() {},
  puff(g, L) { ell(g, L.botY - 7, 4, 5, L.botY - 11, L.botY - 3, 1); box(g, 10, L.botY - 9, 5, 5, 1); },
  spike(g, L) { tri(g, 11, L.botY - 11, 4, 6, -1, 1); },
  long(g, L) { box(g, 12, L.botY - 13, 2, 10, 1); box(g, 12, L.botY - 15, 4, 3, 1); },
  fan(g, L) { for (let dx = 10; dx < 15; dx++) box(g, dx, L.botY - 7 - (dx - 10), 1, 5, 1); },
};

/* ============ かお ============ */
function eyeDX(L) { return Math.max(2, L.eyeDX); }

const EYES = {
  dot(g, L) { const d = eyeDX(L); box(g, d, L.eyeY, 2, 2, 3); },
  round(g, L) {
    const d = eyeDX(L);
    box(g, d, L.eyeY - 1, 3, 4, 3);
    box(g, d + 1, L.eyeY - 1, 1, 1, 0);
  },
  big(g, L) {
    const d = eyeDX(L);
    box(g, d, L.eyeY - 2, 4, 5, 3);
    box(g, d + 1, L.eyeY - 2, 2, 2, 0);
  },
  angry(g, L) {
    const d = eyeDX(L);
    box(g, d, L.eyeY, 3, 3, 3);
    for (let i = 0; i < 3; i++) box(g, d + i, L.eyeY - 2 - i, 1, 2, 3);
  },
  closed(g, L) { const d = eyeDX(L); box(g, d, L.eyeY, 4, 1, 3); box(g, d, L.eyeY + 1, 1, 1, 3); },
  visor(g, L) {
    for (let dx = 0; dx <= L.eyeDX + 3; dx++) symIf(g, dx, L.eyeY, "3", "1");
    for (let dx = 0; dx <= L.eyeDX + 3; dx++) symIf(g, dx, L.eyeY + 1, "3", "1");
    box(g, eyeDX(L), L.eyeY, 2, 1, 0);
  },
  glow(g, L) {
    const d = eyeDX(L);
    box(g, d - 1, L.eyeY - 1, 4, 4, 3);
    box(g, d, L.eyeY, 2, 2, 0);
  },
  sleepy(g, L) { const d = eyeDX(L); box(g, d, L.eyeY, 4, 1, 3); box(g, d + 2, L.eyeY + 1, 2, 1, 3); },
};

const MOUTHS = {
  none() {},
  fang(g, L) {
    box(g, 0, L.eyeY + 5, 5, 1, 3);
    box(g, 2, L.eyeY + 6, 1, 2, 3);
  },
  smile(g, L) { box(g, 0, L.eyeY + 6, 3, 1, 3); box(g, 3, L.eyeY + 5, 1, 1, 3); },
  beak(g, L) { tri(g, 0, L.eyeY + 3, 4, 4, 1, 0); box(g, 0, L.eyeY + 6, 3, 1, 3); },
  line(g, L) { box(g, 0, L.eyeY + 5, 4, 1, 3); },
  open(g, L) { box(g, 0, L.eyeY + 4, 4, 4, 3); box(g, 0, L.eyeY + 5, 2, 2, 0); },
};

/* ============ もよう ============ */
const PATTERNS = {
  none() {},
  belly(g, L) {
    for (let y = L.botY - 11; y <= L.botY - 3; y++) for (let dx = 0; dx < 6; dx++) symIf(g, dx, y, "0", "1");
  },
  stripe(g, L) {
    for (let y = L.topY + 5; y < L.botY - 2; y += 5) {
      for (let dx = 0; dx < 14; dx++) { symIf(g, dx, y, "2", "1"); symIf(g, dx, y + 1, "2", "1"); }
    }
  },
  spot(g, L) {
    for (const [dx, dy] of [[4, 6], [9, 12], [2, 16]]) {
      const y = L.topY + dy;
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) symIf(g, dx + i, y + j, "2", "1");
    }
  },
  back(g, L) { for (let dx = 0; dx < 9; dx++) { symIf(g, dx, L.topY + 4, "2", "1"); symIf(g, dx, L.topY + 5, "2", "1"); } },
  band(g, L) {
    const y = Math.round((L.topY + L.botY) / 2);
    for (let dx = 0; dx < 15; dx++) { symIf(g, dx, y, "2", "1"); symIf(g, dx, y + 1, "2", "1"); }
  },
  dots(g, L) {
    for (const [dx, dy] of [[6, 7], [2, 12], [9, 17], [4, 21]]) {
      symIf(g, dx, L.topY + dy, "0", "1"); symIf(g, dx + 1, L.topY + dy, "0", "1");
      symIf(g, dx, L.topY + dy + 1, "0", "1"); symIf(g, dx + 1, L.topY + dy + 1, "0", "1");
    }
  },
  plate(g, L) {
    for (let y = L.botY - 13; y <= L.botY - 4; y++) for (let dx = 0; dx < 8; dx++) symIf(g, dx, y, "2", "1");
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
// かたちに そって 下がわに かげ、そとがわにも すこし かげ
function shade(g, L) {
  for (let x = 0; x < W; x++) {
    let low = -1;
    for (let y = H - 1; y >= 0; y--) if (g[y][x] === "1") { low = y; break; }
    if (low < 0) continue;
    for (let y = Math.max(0, low - 3); y <= low; y++) if (g[y][x] === "1") g[y][x] = "2";
  }
  for (let y = 0; y < H; y++) {
    for (let dx = 0; dx < 16; dx++) {
      if (get(g, CX - dx, y) !== "1") continue;
      if (get(g, CX - dx - 1, y) === "3") { sym(g, dx, y, "2"); break; }
    }
  }
}
function highlight(g, L) {
  for (let j = 0; j < 3; j++) {
    for (let dx = 1; dx < 5; dx++) symIf(g, dx, L.topY + 2 + j, "0", "1");
  }
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
  if (r.size === "s") return resize(rows, 24);
  if (r.size === "m") return resize(rows, 28);
  return rows;
}

// ちいさい ガオンは ひとまわり 小さく（左右たいしょうの まま）
function resize(rows, n) {
  const off = Math.floor((W - n) / 2);
  const g = blank();
  const h = n / 2;
  for (let y = 0; y < n; y++) {
    const sy = Math.min(H - 1, Math.floor(y * H / n));
    for (let dx = 0; dx < h; dx++) {
      const sdx = Math.min(15, Math.floor(dx * 16 / h));
      const ch = rows[sy][CX - sdx];
      g[y + off][off + h - 1 - dx] = ch;
      g[y + off][off + h + dx] = ch;
    }
  }
  return g.map((r) => r.join(""));
}

export const PART_NAMES = {
  body: Object.keys(BODIES), ear: Object.keys(EARS), crest: Object.keys(CRESTS),
  wing: Object.keys(WINGS), tail: Object.keys(TAILS), eye: Object.keys(EYES),
  mouth: Object.keys(MOUTHS), pat: Object.keys(PATTERNS),
};
export const SPRITE_SIZE = W;
