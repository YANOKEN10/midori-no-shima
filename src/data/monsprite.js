// ============================================================
//  ガオンの ドットえを パーツから 組み立てる（64x64・6かいちょう）
//   ・くみたて中は 1=からだ b=あかるい もよう d=くらい もよう O=ふち
//   ・さいごに ひかりの むき（左上）から 立体の かげを つけて
//     0(いちばん あかるい)〜4(いちばん くらい)＋5(ふち) の 6かいちょうに する
//   ・かたちの すうじは 32ドット時代の ものを そのまま つかい、
//     えがく どうぐの がわで K=2ばいに して 64ドットに おこします。
//
//   recipe の れい：
//     { body:"quad", ear:"cat", crest:"flame", tail:"puff",
//       eye:"round", mouth:"fang", pat:"belly" }
// ============================================================
const W = 64, H = 64;
const CX = 31;              // 左がわの まん中の れつ（右は 32）
const K = 2;                // 32ドットの すうじを 64ドットに なおす ばいりつ
const U = (v) => Math.round(v * K);

function blank() {
  const g = [];
  for (let y = 0; y < H; y++) g.push(new Array(W).fill("."));
  return g;
}
function put(g, x, y, c) { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = String(c); }
function get(g, x, y) { return (x >= 0 && x < W && y >= 0 && y < H) ? g[y][x] : "."; }

/* --- ここから したは「32ドットの すうじ」で よべる どうぐ --- */
// dx = まん中から いくつめ
function symRaw(g, dx, y, c) { put(g, CX - dx, y, c); put(g, CX + 1 + dx, y, c); }
function sym(g, dx, y, c) {
  const x0 = U(dx), y0 = U(y);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    if (x0 + i > CX) continue;
    symRaw(g, x0 + i, y0 + j, c);
  }
}
// only が "1" の ときは「からだの ぬり ぜんぶ」を さす
const BODYCH = "1bdncABCDEFGHIJKLMNO";   // ぬられた ところ ぜんぶ
function isOnly(ch, only) { return only === "1" ? BODYCH.indexOf(ch) >= 0 : ch === only; }
function symIf(g, dx, y, c, only) {
  const x0 = U(dx), y0 = U(y);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const xx = CX - (x0 + i), yy = y0 + j;
    if (isOnly(get(g, xx, yy), only)) put(g, xx, yy, c);
    const xr = CX + 1 + (x0 + i);
    if (isOnly(get(g, xr, yy), only)) put(g, xr, yy, c);
  }
}
function rowFill(g, y, w, c) {
  const y0 = U(y), wpx = U(w);
  for (let j = 0; j < 2; j++) for (let dx = 0; dx < wpx; dx++) symRaw(g, dx, y0 + j, c);
}
function box(g, dx, y, w, h, c) {
  const x0 = U(dx), y0 = U(y), wpx = U(w), hpx = U(h);
  for (let j = 0; j < hpx; j++) for (let i = 0; i < wpx; i++) symRaw(g, x0 + i, y0 + j, c);
}
function ellipseW(y, cy, ry, rx) {
  const t = (y - cy) / ry;
  if (Math.abs(t) > 1) return 0;
  return Math.max(1, Math.round(rx * Math.sqrt(1 - t * t)));
}
// たてよこの まるみ（48ドットの きめこまかさで えがく）
function ell(g, cy, ry, rx, y0, y1, c) {
  const CY = cy * K, RY = ry * K, RX = rx * K;
  const from = Math.max(0, U(y0)), to = Math.min(H - 1, U(y1) + 1);
  for (let y = from; y <= to; y++) {
    const w = ellipseW(y, CY, RY, RX);
    if (!w) continue;
    for (let dx = 0; dx < w; dx++) symRaw(g, dx, y, c || 1);
  }
}
// さんかく（つの・ひれ など）dir: -1=うえむき 1=したむき
function tri(g, dx, y, w, h, dir, c) {
  const x0 = U(dx), y0 = U(y), wpx = U(w), hpx = U(h);
  for (let j = 0; j < hpx; j++) {
    const ww = Math.max(1, Math.round(wpx * (1 - j / hpx)));
    const yy = dir < 0 ? y0 + j : y0 + hpx - 1 - j;
    for (let i = 0; i < ww; i++) symRaw(g, x0 + i, yy, c || 1);
  }
}

// ほそながい ぶぶん（てあし・はね・しっぽ）を 線で えがく
function limb(g, x0, y0, x1, y1, w, c) {
  const ax = U(x0), ay = U(y0), bx = U(x1), by = U(y1), wp = Math.max(1, U(w));
  const steps = Math.max(1, Math.max(Math.abs(bx - ax), Math.abs(by - ay)));
  for (let t = 0; t <= steps; t++) {
    const x = Math.round(ax + (bx - ax) * t / steps);
    const y = Math.round(ay + (by - ay) * t / steps);
    for (let j = 0; j < wp; j++) for (let i = 0; i < wp; i++) symRaw(g, x + i, y + j, c || 1);
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

  /* ===== でんせつの ガオン せんよう ===== */

  // ラテット：金の たてがみの ライオン
  lion(g) {
    // たてがみ（ぎざぎざの わ）
    for (let y = 1; y <= 21; y++) {
      const w = ellipseW(y, 11, 10.5, 11.5);
      if (!w) continue;
      rowFill(g, y, (y % 2 === 0) ? w : Math.max(1, w - 1), 1);
    }
    ell(g, 22, 8.5, 8.5, 15, 31);          // どうたい
    ell(g, 11, 6, 6.5, 5, 17);             // かお
    box(g, 2, 27, 4, 5, 1);                // まえあし
    box(g, 8, 27, 4, 5, 1);                // うしろあし
    limb(g, 11, 19, 14, 12, 1.2);          // なびく しっぽ
    return { eyeY: 11, eyeDX: 3, topY: 1, botY: 31, sideY: 20, sideDX: 10, footY: 31 };
  },

  // ディーナ：にじいろの クジャク
  peacock(g) {
    // おおきな おびれ（おうぎ）
    for (let y = 1; y <= 19; y++) {
      const w = ellipseW(y, 12, 11, 14);
      if (!w) continue;
      rowFill(g, y, w, 1);
    }
    for (let dx = 0; dx < 14; dx += 3) box(g, dx, 1, 1, 3, 1);   // はねの さき
    ell(g, 21, 6.5, 4.5, 15, 28);          // からだ
    for (let y = 12; y <= 17; y++) rowFill(g, y, 2, 1);          // くび
    ell(g, 9, 3.6, 4, 5, 13);              // あたま
    box(g, 1, 28, 2, 4, 1);                // あし
    box(g, 4, 28, 2, 4, 1);
    return { eyeY: 9, eyeDX: 2, topY: 1, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },

  // メロロン：きょだいな アザラシ
  seal(g) {
    ell(g, 21, 11, 12.5, 9, 31);           // まるい からだ
    ell(g, 12, 6.5, 8, 5, 19);             // あたま
    tri(g, 9, 19, 5, 6, 1, 1);             // ひれ（よこ）
    box(g, 0, 29, 5, 3, 1);                // しっぽの ひれ
    box(g, 6, 30, 3, 2, 1);
    return { eyeY: 11, eyeDX: 3, topY: 5, botY: 31, sideY: 20, sideDX: 12, footY: 31 };
  },
};

/* ============ かざり ============ */
const EARS = {
  none() {},
  cat(g, L) { tri(g, L.eyeDX + 2, L.eyeY - 9, 4, 8, -1, "n"); },
  round(g, L) { ell(g, L.eyeY - 6, 4, 4, L.eyeY - 10, L.eyeY - 2, "n"); box(g, L.eyeDX + 3, L.eyeY - 8, 4, 6, "n"); },
  long(g, L) { box(g, L.eyeDX, L.eyeY - 16, 4, 12, "n"); },
  fin(g, L) { tri(g, L.eyeDX + 3, L.eyeY - 3, 6, 5, 1, "n"); },
  side(g, L) { box(g, L.eyeDX + 3, L.eyeY - 4, 6, 3, "n"); },
  droop(g, L) { box(g, L.eyeDX + 3, L.eyeY - 4, 4, 9, "n"); },
  horn(g, L) { tri(g, L.eyeDX + 3, L.eyeY - 6, 3, 6, -1, "n"); },
};

const CRESTS = {
  none() {},
  spike(g, L) { tri(g, 0, L.topY - 7, 3, 7, -1, "n"); tri(g, 3, L.topY - 4, 2, 4, -1, "n"); },
  leaf(g, L) { box(g, 0, L.topY - 8, 2, 8, "n"); ell(g, L.topY - 8, 3, 6, L.topY - 11, L.topY - 5, "n"); },
  flame(g, L) { tri(g, 0, L.topY - 9, 4, 9, -1, "n"); tri(g, 4, L.topY - 5, 3, 5, -1, "n"); },
  fan(g, L) { for (let dx = 0; dx < 8; dx++) tri(g, dx, L.topY - 7 + dx, 1, 8 - dx, -1, "n"); },
  ball(g, L) { box(g, 0, L.topY - 5, 2, 5, "n"); ell(g, L.topY - 7, 3, 4, L.topY - 10, L.topY - 4, "n"); },
  horns(g, L) { tri(g, 4, L.topY - 7, 3, 7, -1, "n"); tri(g, 7, L.topY - 4, 2, 4, -1, "n"); },
  antenna(g, L) { box(g, 2, L.topY - 10, 2, 10, "n"); ell(g, L.topY - 11, 2, 3, L.topY - 13, L.topY - 9, "n"); },
  crown(g, L) { for (const dx of [0, 4, 8]) tri(g, dx, L.topY - 7, 3, 7, -1, "n"); box(g, 0, L.topY - 3, 11, 3, "n"); },
};

const WINGS = {
  none() {},
  small(g, L) { tri(g, L.sideDX - 1, L.sideY - 3, 5, 7, 1, "n"); },
  big(g, L) { for (let i = 0; i < 6; i++) box(g, L.sideDX - 1 + i, L.sideY - 5 + i, 1, 11 - i, "n"); },
  bug(g, L) { ell(g, L.sideY, 6, 5, L.sideY - 6, L.sideY + 6, "n"); box(g, L.sideDX - 2, L.sideY - 6, 6, 12, "n"); },
  fin(g, L) { tri(g, L.sideDX, L.sideY, 4, 7, 1, "n"); },
  arm(g, L) { box(g, L.sideDX - 2, L.sideY, 4, 8, "n"); },
};

const TAILS = {
  none() {},
  puff(g, L) { ell(g, L.botY - 7, 4, 5, L.botY - 11, L.botY - 3, "n"); box(g, 10, L.botY - 9, 5, 5, "n"); },
  spike(g, L) { tri(g, 11, L.botY - 11, 4, 6, -1, "n"); },
  long(g, L) { box(g, 12, L.botY - 13, 2, 10, "n"); box(g, 12, L.botY - 15, 4, 3, "n"); },
  fan(g, L) { for (let dx = 10; dx < 15; dx++) box(g, dx, L.botY - 7 - (dx - 10), 1, 5, "n"); },
};

/* ============ かお ============ */
function eyeDX(L) { return Math.max(2, L.eyeDX); }

// め：しろめ・くろめ・ひかり を 64ドットの きめこまかさで えがく
//  dxU,yU は 32ドットの すうじ。w,h は 64ドットの ドットすう。
function drawEye(g, dxU, yU, w, h, lidTop) {
  const x0 = U(dxU), y0 = U(yU);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const corner = (i === 0 || i === w - 1) && (j === 0 || j === h - 1);
      if (corner) continue;                       // かどを おとして まるく
      const edge = (i === 0 || i === w - 1 || j === 0 || j === h - 1);
      symRaw(g, x0 + i, y0 + j, edge ? "3" : "0");
    }
  }
  const pw = Math.max(2, Math.round(w * 0.5)), ph = Math.max(2, Math.round(h * 0.55));
  const px = x0 + Math.round((w - pw) / 2), py = y0 + h - ph - 1;
  for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) symRaw(g, px + i, py + j, "3");
  symRaw(g, px, py, "0");                          // ひかり
  if (lidTop) for (let i = 0; i < w; i++) symRaw(g, x0 + i, y0, "3");   // まぶた
}

const EYES = {
  dot(g, L) { const d = eyeDX(L); box(g, d, L.eyeY, 2, 2, 3); },
  round(g, L) { drawEye(g, eyeDX(L), L.eyeY - 1, 6, 7); },
  big(g, L) { drawEye(g, eyeDX(L), L.eyeY - 2, 8, 9); },
  angry(g, L) {
    const d = eyeDX(L);
    drawEye(g, d, L.eyeY, 6, 6, true);
    const x0 = U(d), y0 = U(L.eyeY);
    for (let i = 0; i < 8; i++) symRaw(g, x0 + i, y0 - 2 - Math.floor(i / 2), "3");   // つりあがった まゆ
  },
  closed(g, L) {
    const d = eyeDX(L), x0 = U(d), y0 = U(L.eyeY);
    for (let i = 0; i < 7; i++) symRaw(g, x0 + i, y0 + (i < 2 || i > 4 ? 1 : 0), "3");
    for (let i = 1; i < 6; i++) symRaw(g, x0 + i, y0 + 2, "3");
  },
  visor(g, L) {
    for (let dx = 0; dx <= L.eyeDX + 3; dx++) { symIf(g, dx, L.eyeY, "3", "1"); symIf(g, dx, L.eyeY + 1, "3", "1"); }
    const x0 = U(eyeDX(L)), y0 = U(L.eyeY);
    for (let i = 0; i < 4; i++) symRaw(g, x0 + i, y0 + 1, "0");
  },
  glow(g, L) {
    const d = eyeDX(L), x0 = U(d), y0 = U(L.eyeY - 1);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 7; i++) {
      if ((i === 0 || i === 6) && (j === 0 || j === 7)) continue;
      symRaw(g, x0 + i, y0 + j, "3");
    }
    for (let j = 2; j < 6; j++) for (let i = 2; i < 5; i++) symRaw(g, x0 + i, y0 + j, "0");
  },
  sleepy(g, L) {
    const d = eyeDX(L), x0 = U(d), y0 = U(L.eyeY);
    for (let i = 0; i < 7; i++) symRaw(g, x0 + i, y0, "3");
    for (let i = 2; i < 6; i++) symRaw(g, x0 + i, y0 + 1, "3");
    for (let i = 1; i < 5; i++) symRaw(g, x0 + i, y0 + 2, "0");
  },
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
// もよう：b=あかるい ところ d=くらい ところ
// （かげを つける まえに ぬるので、もようにも 立体の かげが のる）
const PATTERNS = {
  none() {},
  belly(g, L) {
    for (let y = L.botY - 11; y <= L.botY - 3; y++) for (let dx = 0; dx < 6; dx++) symIf(g, dx, y, "c", "1");
  },
  stripe(g, L) {
    for (let y = L.topY + 5; y < L.botY - 2; y += 5) {
      for (let dx = 0; dx < 14; dx++) { symIf(g, dx, y, "d", "1"); symIf(g, dx, y + 1, "d", "1"); }
    }
  },
  spot(g, L) {
    for (const [dx, dy] of [[4, 6], [9, 12], [2, 16]]) {
      const y = L.topY + dy;
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) symIf(g, dx + i, y + j, "d", "1");
    }
  },
  back(g, L) { for (let dx = 0; dx < 9; dx++) { symIf(g, dx, L.topY + 4, "d", "1"); symIf(g, dx, L.topY + 5, "d", "1"); } },
  band(g, L) {
    const y = Math.round((L.topY + L.botY) / 2);
    for (let dx = 0; dx < 15; dx++) { symIf(g, dx, y, "d", "1"); symIf(g, dx, y + 1, "d", "1"); }
  },
  dots(g, L) {
    for (const [dx, dy] of [[6, 7], [2, 12], [9, 17], [4, 21]]) {
      symIf(g, dx, L.topY + dy, "c", "1"); symIf(g, dx + 1, L.topY + dy, "c", "1");
      symIf(g, dx, L.topY + dy + 1, "c", "1"); symIf(g, dx + 1, L.topY + dy + 1, "c", "1");
    }
  },
  plate(g, L) {
    for (let y = L.botY - 13; y <= L.botY - 4; y++) for (let dx = 0; dx < 8; dx++) symIf(g, dx, y, "d", "1");
  },
};


/* --- できあがった からだを はかって、パーツの ばしょを あわせる ---
   からだの かたちは しゅるいごとに ちがうので、
   「あたまの てっぺん」「あしもと」「よこはば」を じっさいに はかって
   つの・はね・あしが うくのを ふせぎます。
------------------------------------------------------------ */
function measure(g, L) {
  const isB = (x, y) => BODYCH.indexOf(get(g, x, y)) >= 0;
  const out = Object.assign({}, L);
  let top = -1, bot = -1;
  for (let y = 0; y < H; y++) if (isB(CX, y) || isB(CX + 1, y)) { top = y; break; }
  for (let y = H - 1; y >= 0; y--) if (isB(CX, y) || isB(CX + 1, y)) { bot = y; break; }
  if (top >= 0) out.topY = Math.round(top / K);
  if (bot >= 0) { out.botY = Math.round(bot / K); out.footY = out.botY; }
  const sy = Math.min(H - 1, Math.max(0, Math.round((L.sideY | 0) * K)));
  for (let d = CX; d >= 0; d--) if (isB(CX - d, sy)) { out.sideDX = Math.round(d / K); break; }
  return out;
}

/* --- はなれた パーツを からだに つなぐ ----------------------
   つの・はね・あし などが すこし はなれて うかんで 見えることが あるので、
   いちばん 大きい かたまり（＝からだ）に、ちかい ところを つないで
   1つづきの いきものに 見えるように します。
------------------------------------------------------------ */
function connect(g) {
  const isB = (x, y) => BODYCH.indexOf(get(g, x, y)) >= 0;
  const lab = [];
  for (let y = 0; y < H; y++) lab.push(new Array(W).fill(-1));
  const cells = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!isB(x, y) || lab[y][x] >= 0) continue;
      const q = [[x, y]], cs = [];
      lab[y][x] = cells.length;
      while (q.length) {
        const c = q.pop();
        cs.push(c);
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const d of dirs) {
          const nx = c[0] + d[0], ny = c[1] + d[1];
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          if (isB(nx, ny) && lab[ny][nx] < 0) { lab[ny][nx] = cells.length; q.push([nx, ny]); }
        }
      }
      cells.push(cs);
    }
  }
  if (cells.length <= 1) return;
  let main = 0;
  for (let i = 1; i < cells.length; i++) if (cells[i].length > cells[main].length) main = i;

  for (let i = 0; i < cells.length; i++) {
    if (i === main || cells[i].length < 3) continue;
    let best = null, bd = 1e9;
    for (const c of cells[i]) {
      for (let dy = -14; dy <= 14; dy++) {
        for (let dx = -14; dx <= 14; dx++) {
          const bx = c[0] + dx, by = c[1] + dy;
          if (bx < 0 || bx >= W || by < 0 || by >= H) continue;
          if (lab[by][bx] !== main) continue;
          const d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = [c[0], c[1], bx, by]; }
        }
      }
    }
    if (!best || bd <= 2) continue;          // もう ついている
    const steps = Math.max(Math.abs(best[2] - best[0]), Math.abs(best[3] - best[1]));
    for (let t = 0; t <= steps; t++) {
      const x = Math.round(best[0] + (best[2] - best[0]) * t / steps);
      const y = Math.round(best[1] + (best[3] - best[1]) * t / steps);
      for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) if (!isB(x + k, y + j)) put(g, x + k, y + j, "1");
    }
  }
}

// 左右を きっちり たいしょうに そろえる（つなぎで ずれることが あるため）
function symmetrize(g) {
  for (let y = 0; y < H; y++) {
    for (let dx = 0; dx <= CX; dx++) {
      const l = get(g, CX - dx, y), r = get(g, CX + 1 + dx, y);
      if (l === r) continue;
      const c = (l !== ".") ? l : r;         // どちらかに ぬりが あれば それに あわせる
      put(g, CX - dx, y, c); put(g, CX + 1 + dx, y, c);
    }
  }
}

/* ============ しあげ ============ */
// ふちどり（からだの そとがわ 1ドット）
function outline(g) {
  const out = g.map((r) => r.slice());
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] === ".") continue;
      if (get(g, x - 1, y) === "." || get(g, x + 1, y) === "." ||
          get(g, x, y - 1) === "." || get(g, x, y + 1) === "." ||
          y === 0 || y === H - 1 || x === 0 || x === W - 1) out[y][x] = "X";
    }
  }
  return out;
}

/* --- 立体の かげ --------------------------------------------
   ひかりは 左上から。
   ひとつひとつの ドットで「左上の ふちまで いくつ」「右下の ふちまで いくつ」を
   かぞえて、その わりあいで あかるさを きめます。
   まるい ところは まるく、ほそい ところは ほそいなりに かげが つきます。
   b（あかるい もよう）と d（くらい もよう）は かいちょうを ずらして つかいます。
------------------------------------------------------------ */
// ざいしつごとの あかるさの たば
//   1 からだ / b からだ（あかるめ）/ d からだ（くらめ）
//   n そえいろ（つの・はね・しっぽ など）/ c クリーム（おなか・くちもと）
const RAMP = {
  "1": ["A", "B", "C", "D", "E"],
  b:   ["A", "A", "B", "C", "D"],
  d:   ["B", "C", "D", "E", "E"],
  n:   ["F", "G", "H", "I", "J"],
  c:   ["K", "L", "M", "N", "O"],
};
function volume(g) {
  const isBody = (x, y) => BODYCH.indexOf(get(g, x, y)) >= 0;
  const out = g.map((r) => r.slice());
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const mat = g[y][x];
      if (BODYCH.indexOf(mat) < 0) continue;
      let a = 0, b = 0, xx = x, yy = y;
      while (isBody(xx - 1, yy - 1) && a < 64) { xx--; yy--; a++; }
      xx = x; yy = y;
      while (isBody(xx + 1, yy + 1) && b < 64) { xx++; yy++; b++; }
      const t = (a + b) === 0 ? 0 : a / (a + b);
      const i = Math.max(0, Math.min(4, Math.floor(t * 5)));
      const ramp = RAMP[mat] || RAMP["1"];
      out[y][x] = ramp[i];
    }
  }
  return out;
}

// 下の ふちを 1ドット ぶあつく して どっしり 見せる
function groundLine(g) {
  for (let x = 0; x < W; x++) {
    for (let y = H - 1; y >= 1; y--) {
      if (g[y][x] === "X" && g[y - 1][x] !== "." && g[y - 1][x] !== "X") { g[y - 1][x] = "O"; break; }
    }
  }
}

// くみたて用の もじを、えがく ときの 0〜5 に なおす
// くみたて用の もじ → えがく ときの いろ もじ
//   0〜5 からだ / a〜f そえいろ / g〜l クリーム / w しろ（めの ひかり）
const FINAL = {
  A: "0", B: "1", C: "2", D: "3", E: "4",
  F: "a", G: "b", H: "c", I: "d", J: "e",
  K: "g", L: "h", M: "i", N: "j", O: "k",
  X: "5",
  "0": "w", "1": "2", "2": "4", "3": "5",
  b: "1", d: "3", n: "b", c: "i",
};
function toTones(g) {
  return g.map((row) => row.map((c) => (c === "." ? "." : (FINAL[c] || "2"))).join(""));
}

export function buildSprite(recipe) {
  const r = recipe || {};
  let g = blank();
  const body = BODIES[r.body] || BODIES.blob;
  const L = measure(g, body(g));              // じっさいの かたちに あわせて パーツを おく

  (EARS[r.ear] || EARS.none)(g, L);
  (CRESTS[r.crest] || CRESTS.none)(g, L);
  (WINGS[r.wing] || WINGS.none)(g, L);
  (TAILS[r.tail] || TAILS.none)(g, L);

  connect(g);                                 // はなれた パーツを からだに つなぐ
  symmetrize(g);
  (PATTERNS[r.pat] || PATTERNS.none)(g, L);   // もようは かげの まえに
  g = outline(g);
  g = volume(g);                              // 立体の かげ
  groundLine(g);
  (EYES[r.eye] || EYES.dot)(g, L);
  (MOUTHS[r.mouth] || MOUTHS.none)(g, L);

  const rows = toTones(g);
  if (r.size === "s") return resize(rows, 48);
  if (r.size === "m") return resize(rows, 56);
  return rows;
}

// ちいさい ガオンは ひとまわり 小さく（左右たいしょうの まま）
function resize(rows, n) {
  const offX = Math.floor((W - n) / 2);
  const offY = H - n;                       // あしもとを 下に そろえる
  const g = blank();
  const h = n / 2;
  for (let y = 0; y < n; y++) {
    const sy = Math.min(H - 1, Math.floor(y * H / n));
    for (let dx = 0; dx < h; dx++) {
      const sdx = Math.min(CX, Math.floor(dx * (CX + 1) / h));
      const ch = rows[sy][CX - sdx];
      g[y + offY][offX + h - 1 - dx] = ch;
      g[y + offY][offX + h + dx] = ch;
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

/* ============================================================
   手で うった ドットえ を 64ドットに おこす
    32x32 の もじ絵を うけとって、
      . = すきとおる  # = からだ  b = あかるい ところ
      d = くらい ところ  e = め  m = くち
    2ばいに ひろげて（ななめを なめらかに）、ふち・立体の かげを つけます。
============================================================ */
// ななめの ギザギザを なめらかに する ひろげかた（EPX）
function scale2x(src) {
  const h = src.length, w = src[0].length;
  const at = (x, y) => (x >= 0 && x < w && y >= 0 && y < h ? src[y][x] : ".");
  const out = [];
  for (let y = 0; y < h; y++) {
    let r0 = "", r1 = "";
    for (let x = 0; x < w; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      let e0 = P, e1 = P, e2 = P, e3 = P;
      if (C === A && C !== D && A !== B) e0 = A;
      if (A === B && A !== C && B !== D) e1 = B;
      if (D === C && D !== B && C !== A) e2 = C;
      if (B === D && B !== A && D !== C) e3 = D;
      r0 += e0 + e1;
      r1 += e2 + e3;
    }
    out.push(r0, r1);
  }
  return out;
}

// て書きの め：おおきくて まるい ひとみに、大小 2つの ひかり
function handEye(g, x, y) {
  for (let j = -4; j <= 4; j++) {
    for (let i = -3; i <= 3; i++) {
      const dx = i / 3.4, dy = j / 4.4;
      if (dx * dx + dy * dy > 1) continue;
      put(g, x + i, y + j, "3");
    }
  }
  for (let j = -3; j <= -1; j++) for (let i = -2; i <= 0; i++) put(g, x + i, y + j, "0");  // 大きい ひかり
  put(g, x + 1, y + 2, "0"); put(g, x + 2, y + 2, "0"); put(g, x + 1, y + 3, "0");         // 小さい ひかり
}

export function buildHandSprite(rows32) {
  // どの ぎょうも 32もじに そろえる（みじかい ぎょうは すきとおるで うめる）
  const src = [];
  for (let y = 0; y < 32; y++) src.push(((rows32[y] || "") + "................................").slice(0, 32));
  const big = scale2x(src);
  const g = blank();
  const eyes = [], mouths = [];
  for (let y = 0; y < Math.min(H, big.length); y++) {
    for (let x = 0; x < Math.min(W, big[y].length); x++) {
      const c = big[y][x];
      if (c === ".") continue;
      if (c === "o") { g[y][x] = "X"; continue; }   // 中の りんかく（ふちの いろ）
      if (c === "e") { eyes.push([x, y]); g[y][x] = "1"; continue; }
      if (c === "m") { mouths.push([x, y]); g[y][x] = "1"; continue; }
      g[y][x] = c === "#" ? "1" : c;
    }
  }
  let out = outline(g);
  out = volume(out);
  groundLine(out);
  // め と くち（かげを つけた あとに のせる）
  const done = [];
  for (const [x, y] of eyes) {
    if (done.some((p) => Math.abs(p[0] - x) < 4 && Math.abs(p[1] - y) < 4)) continue;
    done.push([x, y]);
    handEye(out, x, y);
  }
  for (const [x, y] of mouths) put(out, x, y, "3");
  return toTones(out);
}
