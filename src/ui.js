// ============================================================
//  メッセージわく と メニュー
//   ぜんぶ「まつ」ことが できます（await ui.say(...) のように つかう）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { beep } from "./audio.js";

const BOX = { x: 8, y: 196, w: 304, h: 84 };

let stack = [];       // うえに あるものが 入力を うけとる
let now = 0;

export const ui = {
  get busy() { return stack.length > 0; },

  // --- はなす -------------------------------------------------
  say(lines, opt) {
    const o = opt || {};
    const arr = Array.isArray(lines) ? lines.slice() : [String(lines)];
    return new Promise((resolve) => {
      stack.push({
        kind: "say", lines: arr, page: 0, shown: 0, done: false,
        speed: o.speed || 1.6, auto: o.auto || false, resolve: resolve,
      });
    });
  },

  // --- えらぶ -------------------------------------------------
  choice(items, opt) {
    const o = opt || {};
    return new Promise((resolve) => {
      stack.push({
        kind: "choice", items: items.slice(), i: o.start || 0, top: 0,
        cancel: o.cancel !== false, cols: o.cols || 1,
        rows: o.rows || Math.min(items.length, o.cols ? 4 : 4),
        x: o.x, y: o.y, w: o.w, title: o.title || "", desc: o.desc || null,
        resolve: resolve,
      });
    });
  },

  async ask(lines, yes, no) {
    if (lines && lines.length) await this.say(lines);
    const i = await this.choice([yes || "はい", no || "いいえ"], { x: 200, y: 120, w: 108 });
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

function close(w, value) {
  const i = stack.indexOf(w);
  if (i >= 0) stack.splice(i, 1);
  w.resolve(value);
}

/* --- はなす ---------------------------------------------------- */
function pageLines(w) {
  // 2ぎょうずつ みせる
  const flat = [];
  for (const l of w.lines) {
    const parts = G.wrap(l, BOX.w - 32, 16);
    for (const p of parts) flat.push(p);
  }
  w.flat = flat;
  return flat;
}

function updateSay(w, dt) {
  const flat = w.flat || pageLines(w);
  const cur = flat.slice(w.page * 2, w.page * 2 + 2);
  const total = cur.join("").length;

  if (w.shown < total) {
    w.shown += w.speed * (dt / 16.67) * (In.isDown("a") || In.isDown("b") ? 3 : 1);
    if (w.shown >= total) w.shown = total;
    if (In.hit("a") || In.hit("b")) { w.shown = total; return; }
    return;
  }
  if (In.hit("a") || In.hit("b")) {
    beep("blip");
    if ((w.page + 1) * 2 >= flat.length) { close(w, true); return; }
    w.page++;
    w.shown = 0;
  }
}

function drawSay(w) {
  const flat = w.flat || pageLines(w);
  const cur = flat.slice(w.page * 2, w.page * 2 + 2);
  G.window9(BOX.x, BOX.y, BOX.w, BOX.h);
  let left = Math.floor(w.shown);
  for (let i = 0; i < cur.length; i++) {
    const line = cur[i];
    const show = line.slice(0, Math.max(0, left));
    left -= line.length;
    G.text(show, BOX.x + 16, BOX.y + 16 + i * 26, 3, 16);
  }
  const total = cur.join("").length;
  if (w.shown >= total && Math.floor(now / 300) % 2 === 0) {
    G.text("▼", BOX.x + BOX.w - 26, BOX.y + BOX.h - 26, 3, 14);
  }
}

/* --- えらぶ ---------------------------------------------------- */
function boxOf(w) {
  const rows = Math.min(w.items.length, w.rows);
  const h = 16 + rows * 24;
  const width = w.w || Math.max(96, ...w.items.map((s) => G.textW(s, 16) + 44));
  const x = w.x == null ? G.W - width - 8 : w.x;
  const y = w.y == null ? 8 : w.y;
  return { x: x, y: y, w: width, h: h, rows: rows };
}

function updateChoice(w) {
  const b = boxOf(w);
  const n = w.items.length;
  if (In.repeat("down", now)) { w.i = (w.i + 1) % n; beep("blip"); }
  if (In.repeat("up", now)) { w.i = (w.i + n - 1) % n; beep("blip"); }
  if (w.i < w.top) w.top = w.i;
  if (w.i >= w.top + b.rows) w.top = w.i - b.rows + 1;

  if (In.hit("a")) { beep("ok"); close(w, w.i); return; }
  if (In.hit("b") && w.cancel) { beep("back"); close(w, -1); }
}

function drawChoice(w) {
  const b = boxOf(w);
  G.window9(b.x, b.y, b.w, b.h);
  for (let r = 0; r < b.rows; r++) {
    const i = w.top + r;
    if (i >= w.items.length) break;
    const y = b.y + 10 + r * 24;
    if (i === w.i) G.text("▶", b.x + 8, y, 3, 16);
    G.text(w.items[i], b.x + 26, y, 3, 16);
  }
  if (w.top > 0) G.text("▲", b.x + b.w - 20, b.y + 4, 3, 12);
  if (w.top + b.rows < w.items.length) G.text("▼", b.x + b.w - 20, b.y + b.h - 16, 3, 12);
}

export { BOX };
