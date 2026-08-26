// ============================================================
//  ひとの ドットえ（16x16）
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
  return {
    down: [front, step(front, 0), front, step(front, 1)],
    up: [back, step(back, 0), back, step(back, 1)],
    right: [right, step(right, 0), right, step(right, 1)],
    left: [left, step(left, 1), left, step(left, 0)],
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
