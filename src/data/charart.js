// ============================================================
//  ひとの ドットえ（16x16で かたちを きめ、32x32に ひきあげる）
//   H=かみ K=はだ S=ふく P=ズボン の 4かしょを 色で さしかえます。
// ============================================================
import { mirror } from "./monart.js";

// まえむき（左はんぶん）
const FRONT = [
  "........",
  "....3333",
  "...3HHHH",
  "..3HHHHH",
  "..3HHHKK",
  "..3HKKKK",
  "..3HK3KK",
  "..3KKKKK",
  "...3KKKK",
  "....3333",
  "..3SSSSS",
  ".3SSSSSS",
  ".3KSSSSS",
  ".33SSSSS",
  "....3PP.",
  "....333.",
];

// うしろむき
const BACK = [
  "........",
  "....3333",
  "...3HHHH",
  "..3HHHHH",
  "..3HHHHH",
  "..3HHHHH",
  "..3HHHHH",
  "..3HHHHH",
  "...3HHHH",
  "....3333",
  "..3SSSSS",
  ".3SSSSSS",
  ".3KSSSSS",
  ".33SSSSS",
  "....3PP.",
  "....333.",
];

// よこむき（右をむいている 16もじ）
const SIDE = [
  "................",
  ".....33333......",
  "....3HHHHH3.....",
  "...3HHHHHHH3....",
  "...3HHHHKKK3....",
  "...3HHHKK3K3....",
  "...3HHHKKKK.....",
  "....3HKKKK3.....",
  ".....33333......",
  "...3SSSSSS3.....",
  "..3SSSSSSSS3....",
  "..3SSSSSSSK3....",
  "..3SSSSSS33.....",
  "....3PPP3.......",
  "....3PP3........",
  "....333.........",
];


/* ============================================================
   16x16の えを 32x32に ひきあげる
    ・ななめの ギザギザを なめらかに する（EPX）
    ・ふくと ズボンと はだに、右下がわの かげ（h k s p）を つける
   もじ： H かみ  K はだ  S ふく  P ズボン  3 ふち
         h k s p は それぞれの かげ
============================================================ */
function epx(rows) {
  const h = rows.length, w = rows[0].length;
  const at = (x, y) => (x >= 0 && x < w && y >= 0 && y < h ? rows[y][x] : ".");
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
      r0 += e0 + e1; r1 += e2 + e3;
    }
    out.push(r0, r1);
  }
  return out;
}

// 右下がわに かげを つける（ひかりは 左上から）
const SHADE = { H: "h", K: "k", S: "s", P: "p" };
function shadeRows(rows) {
  const h = rows.length, w = rows[0].length;
  const g = rows.map((r) => r.split(""));
  const at = (x, y) => (x >= 0 && x < w && y >= 0 && y < h ? rows[y][x] : ".");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = rows[y][x];
      const sh = SHADE[c];
      if (!sh) continue;
      // 右か 下が「そとがわ か ふち」なら かげに する
      const r = at(x + 1, y), d = at(x, y + 1);
      const edge = (r === "." || r === "3" || d === "." || d === "3");
      if (edge) g[y][x] = sh;
      // ふくは 下の ほうも すこし くらく
      else if ((c === "S" || c === "P") && y > h * 0.72 && (x + y) % 2 === 0) g[y][x] = sh;
    }
  }
  return g.map((r) => r.join(""));
}

function upscale(rows) { return shadeRows(epx(rows)); }

function paint(rows, c) {
  return rows.map((r) => r.replace(/H/g, c.H).replace(/K/g, c.K).replace(/S/g, c.S).replace(/P/g, c.P));
}
function flipRows(rows) {
  return rows.map((r) => r.split("").reverse().join(""));
}
// あるいて みえるように 足もとを すこし ずらす
function step(rows, side) {
  const out = rows.slice();
  const put = (y, x, ch) => {
    const a = out[y].split("");
    if (x >= 0 && x < a.length) a[x] = ch;
    out[y] = a.join("");
  };
  if (side === 0) { put(15, 4, "."); put(15, 5, "."); put(14, 4, "3"); }
  else { put(15, 10, "."); put(15, 11, "."); put(14, 11, "3"); }
  return out;
}

// もじ（H=かみ K=はだ S=うわぎ P=ズボン 3=ふち）の ままで かえす
export function personFramesRaw() {
  const front = mirror(FRONT);
  const back = mirror(BACK);
  const right = SIDE.slice();
  const left = flipRows(right);
  const f = (rows) => upscale(rows);
  return {
    down: [f(front), f(step(front, 0)), f(front), f(step(front, 1))],
    up: [f(back), f(step(back, 0)), f(back), f(step(back, 1))],
    right: [f(right), f(step(right, 0)), f(right), f(step(right, 1))],
    left: [f(left), f(step(left, 1)), f(left), f(step(left, 0))],
  };
}

export function personFrames(colors) {
  const c = {
    H: String(colors.H == null ? 3 : colors.H),
    K: String(colors.K == null ? 0 : colors.K),
    S: String(colors.S == null ? 1 : colors.S),
    P: String(colors.P == null ? 2 : colors.P),
  };
  const front = mirror(paint(FRONT, c));
  const back = mirror(paint(BACK, c));
  const right = paint(SIDE, c);
  const left = flipRows(right);
  return {
    down: [front, step(front, 0), front, step(front, 1)],
    up: [back, step(back, 0), back, step(back, 1)],
    right: [right, step(right, 0), right, step(right, 1)],
    left: [left, step(left, 1), left, step(left, 0)],
  };
}

// よく つかう みため
export const LOOKS = {
  player: { H: 3, K: 0, S: 2, P: 3 },
  rival: { H: 2, K: 0, S: 3, P: 2 },
  prof: { H: 0, K: 0, S: 0, P: 3 },
  boy: { H: 3, K: 0, S: 2, P: 3 },
  girl: { H: 2, K: 0, S: 3, P: 2 },
  oldman: { H: 0, K: 0, S: 2, P: 3 },
  nurse: { H: 2, K: 0, S: 0, P: 0 },
  clerk: { H: 3, K: 0, S: 0, P: 2 },
  sailor: { H: 3, K: 0, S: 0, P: 2 },
  hiker: { H: 2, K: 0, S: 2, P: 3 },
  philoa: { H: 1, K: 0, S: 2, P: 3 },
  leader1: { H: 2, K: 0, S: 3, P: 2 },
  leader2: { H: 3, K: 0, S: 2, P: 3 },
};
