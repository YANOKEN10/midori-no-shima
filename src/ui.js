// ============================================================
//  メッセージわく と メニュー
//   ぜんぶ「まつ」ことが できます（await ui.say(...) のように つかう）
//
//  文字が わくから はみ出さないように、
//   ・おりかえし は わくの 内がわの はばで 計算する
//   ・えらぶ わくは 中身の 長さで 自動的に ひろげる
//   ・それでも 入らない ものは「…」で つめる
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { beep } from "./audio.js";

const BOX = { x: 8, y: 196, w: 304, h: 84 };
const PAD = 18;                 // わくの 内がわの よゆう（左右）
const LINE_H = 27;              // 1行の 高さ
const TEXT_SIZE = 16;
const SAY_LINES = 2;            // 1ページに 出す 行数

const CH_PAD_L = 26;            // ▶ のぶんの 左よゆう
const CH_PAD_R = 16;
const CH_ROW = 24;

let stack = [];       // うえに あるものが 入力を うけとる
let now = 0;

export const ui = {
  get busy() { return stack.length > 0; },

  // --- はなす -------------------------------------------------
  say(lines, opt) {
    const o = opt || {};
    const arr = (Array.isArray(lines) ? lines : [lines])
      .map((s) => String(s == null ? "" : s))
      .filter((s) => s !== "");
    return new Promise((resolve) => {
      if (!arr.length) { resolve(true); return; }
      stack.push({
        kind: "say", lines: arr, page: 0, shown: 0,
        speed: o.speed || 1.6, resolve: resolve,
      });
    });
  },

  // --- えらぶ -------------------------------------------------
  choice(items, opt) {
    const o = opt || {};
    return new Promise((resolve) => {
      stack.push({
        kind: "choice",
        items: items.map((s) => String(s == null ? "" : s)),
        i: Math.min(o.start || 0, Math.max(0, items.length - 1)), top: 0,
        cancel: o.cancel !== false,
        rows: o.rows || Math.min(items.length, 4),
        x: o.x, y: o.y, w: o.w,
        resolve: resolve,
      });
    });
  },

  async ask(lines, yes, no) {
    if (lines && lines.length) await this.say(lines);
    const i = await this.choice([yes || "はい", no || "いいえ"], { x: 196, y: 118, w: 112 });
    return i === 0;
  },

  // じぶんで えがく がめん（A か B で とじる）
  custom(drawFn, opt) {
    const o = opt || {};
    return new Promise((resolve) => {
      stack.push({ kind: "custom", draw: drawFn, keep: o.keep, resolve: resolve });
    });
  },

  // すぐ とじる（イベントの とちゅうで つかう）
  clear() { stack = []; },

  update(dt) {
    now += dt;
    const w = stack[stack.length - 1];
    if (!w) return;
    if (w.kind === "say") updateSay(w, dt);
    else if (w.kind === "choice") updateChoice(w);
    else if (w.kind === "custom") { if (In.hit("a") || In.hit("b")) { beep("back"); close(w, true); } }
  },

  draw() {
    for (const w of stack) {
      if (w.kind === "say") drawSay(w);
      else if (w.kind === "choice") drawChoice(w);
      else if (w.kind === "custom") w.draw();
    }
  },
};

// いま いちばん上に ある わくの ばしょ（かさなりを さけるのに つかう）
export function topRect() {
  const w = stack[stack.length - 1];
  if (!w) return null;
  if (w.kind === "choice") return boxOf(w);
  if (w.kind === "say") return { x: BOX.x, y: BOX.y, w: BOX.w, h: BOX.h };
  return { x: 0, y: 0, w: G.W, h: G.H };
}
export function overlaps(a, b) {
  if (!a || !b) return false;
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function close(w, value) {
  const i = stack.indexOf(w);
  if (i >= 0) stack.splice(i, 1);
  w.resolve(value);
}

/* --- はなす ---------------------------------------------------- */
function sayWidth() { return BOX.w - PAD * 2 - 4; }

function pageLines(w) {
  // フォントが あとから よみこまれたら はば が かわるので やりなおす
  if (w.flat && w.rev === G.fontRevision()) return w.flat;
  const flat = [];
  for (const l of w.lines) {
    for (const part of G.wrap(l, sayWidth(), TEXT_SIZE)) flat.push(part);
  }
  w.flat = flat;
  w.rev = G.fontRevision();
  w.page = Math.min(w.page, Math.max(0, Math.ceil(flat.length / SAY_LINES) - 1));
  return flat;
}

function curPage(w) {
  const flat = pageLines(w);
  return flat.slice(w.page * SAY_LINES, w.page * SAY_LINES + SAY_LINES);
}

function updateSay(w, dt) {
  const cur = curPage(w);
  const total = cur.join("").length;

  if (w.shown < total) {
    if (In.hit("a") || In.hit("b")) { w.shown = total; return; }
    w.shown += w.speed * (dt / 16.67) * (In.isDown("a") || In.isDown("b") ? 3 : 1);
    if (w.shown > total) w.shown = total;
    return;
  }
  if (In.hit("a") || In.hit("b")) {
    beep("blip");
    const flat = pageLines(w);
    if ((w.page + 1) * SAY_LINES >= flat.length) { close(w, true); return; }
    w.page++;
    w.shown = 0;
  }
}

function drawSay(w) {
  const cur = curPage(w);
  G.window9(BOX.x, BOX.y, BOX.w, BOX.h);
  let left = Math.floor(w.shown);
  for (let i = 0; i < cur.length; i++) {
    const line = cur[i];
    const show = line.slice(0, Math.max(0, left));
    left -= line.length;
    G.textFit(show, BOX.x + PAD, BOX.y + 15 + i * LINE_H, sayWidth(), 3, TEXT_SIZE);
  }
  const total = cur.join("").length;
  if (w.shown >= total && Math.floor(now / 300) % 2 === 0) {
    G.text("▼", BOX.x + BOX.w - 26, BOX.y + BOX.h - 24, 3, 14);
  }
}

/* --- えらぶ ----------------------------------------------------
   中身の 長さに あわせて わくを ひろげ、画面から はみ出さない
   ところまで 動かします。
------------------------------------------------------------------ */
function boxOf(w) {
  let widest = 0;
  for (const s of w.items) widest = Math.max(widest, G.textW(s, TEXT_SIZE));
  let width = Math.max(w.w || 0, widest + CH_PAD_L + CH_PAD_R, 96);
  width = Math.min(width, G.W - 16);

  let x = w.x == null ? G.W - width - 8 : w.x;
  if (x + width > G.W - 8) x = G.W - 8 - width;
  if (x < 8) x = 8;

  let y = w.y == null ? 8 : w.y;
  let rows = Math.min(w.items.length, w.rows);
  let h = 16 + rows * CH_ROW;

  // 下に はみ出すなら 行数を へらし、それでも だめなら 上へ ずらす
  if (y + h > G.H - 8) {
    const fits = Math.floor((G.H - 8 - y - 16) / CH_ROW);
    if (fits >= 2) { rows = Math.min(rows, fits); h = 16 + rows * CH_ROW; }
    else { y = G.H - 8 - h; }
  }
  if (y < 8) { y = 8; }
  if (y + h > G.H - 8) {
    rows = Math.max(1, Math.floor((G.H - 16 - y - 16) / CH_ROW));
    h = 16 + rows * CH_ROW;
  }
  return { x: x, y: y, w: width, h: h, rows: rows };
}

function updateChoice(w) {
  const b = boxOf(w);
  const n = w.items.length;
  if (In.repeat("down", now)) { w.i = (w.i + 1) % n; beep("blip"); }
  if (In.repeat("up", now)) { w.i = (w.i + n - 1) % n; beep("blip"); }
  if (w.i < w.top) w.top = w.i;
  if (w.i >= w.top + b.rows) w.top = w.i - b.rows + 1;
  w.top = Math.max(0, Math.min(w.top, n - b.rows));

  if (In.hit("a")) { beep("ok"); close(w, w.i); return; }
  if (In.hit("b") && w.cancel) { beep("back"); close(w, -1); }
}

function drawChoice(w) {
  const b = boxOf(w);
  G.window9(b.x, b.y, b.w, b.h);
  const maxW = b.w - CH_PAD_L - CH_PAD_R;
  for (let r = 0; r < b.rows; r++) {
    const i = w.top + r;
    if (i >= w.items.length) break;
    const y = b.y + 10 + r * CH_ROW;
    if (i === w.i) G.text("▶", b.x + 8, y, 3, TEXT_SIZE);
    G.textFit(w.items[i], b.x + CH_PAD_L, y, maxW, 3, TEXT_SIZE);
  }
  if (w.top > 0) G.text("▲", b.x + b.w - 18, b.y + 2, 3, 12);
  if (w.top + b.rows < w.items.length) G.text("▼", b.x + b.w - 18, b.y + b.h - 14, 3, 12);
}

export { BOX };
