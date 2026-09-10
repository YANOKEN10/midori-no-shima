import {drawBattlePanel} from './battleSceneArt.js';
import {drawItemList,visibleItems} from './itemScreens.js';
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
const PAD = 24;                 // わくの 内がわの よゆう（左右）
const LINE_H = 26;              // 1行の 高さ
const TEXT_SIZE = 16;
const SAY_LINES = 2;            // 1ページに 出す 行数

const CH_PAD_L = 32;            // ▶ のぶんの 左よゆう
const CH_PAD_R = 24;
const CH_ROW = 28;
const CH_PAD_Y = 16;

let stack = [];       // うえに あるものが 入力を うけとる
let now = 0;
let battleMode=false;

export const ui = {
  setBattleMode(value){battleMode=!!value;Object.assign(BOX,battleMode?{x:0,y:208,w:320,h:80}:{x:8,y:196,w:304,h:84});},
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
        rows: o.rows || Math.min(items.length, 4), columns: o.columns === 2 ? 2 : 1,
        x: o.x, y: o.y, w: o.w, extra: o.extra, battle: !!o.battle, details: o.details,
        resolve: resolve,
      });
    });
  },

  itemList(items,opt={}) {return new Promise(resolve=>stack.push({kind:'itemList',items,pockets:!!opt.pockets,category:opt.category||0,i:opt.start||0,mode:opt.mode,money:opt.money||0,resolve}));},
  async ask(lines, yes, no) {
    if (lines && lines.length) await this.say(lines);
    const i = await this.choice([yes || "はい", no || "いいえ"], { x: 196, y: 118, w: 112 });
    return i === 0;
  },

  // じぶんで えがく がめん（A か B で とじる）
  custom(drawFn, opt) {
    const o = opt || {};
    return new Promise((resolve) => {
      stack.push({ kind: "custom", draw: drawFn, keep: o.keep, onPage: o.onPage, resolve: resolve });
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
    else if(w.kind==='itemList'){
      const pocketDir=w.pockets?(In.repeat('left',now,350,220)?-1:In.repeat('right',now,350,220)?1:0):0;
      if(pocketDir){w.category=(w.category+pocketDir+3)%3;w.i=0;beep('blip');}
      const list=visibleItems(w),n=list.length;w.i=Math.min(w.i,Math.max(0,n-1));
      if(n&&In.repeat('down',now)){w.i=(w.i+1)%n;beep('blip');}if(n&&In.repeat('up',now)){w.i=(w.i+n-1)%n;beep('blip');}
      if(In.hit('b')){beep('back');close(w,null);}else if(n&&In.hit('a')){beep('ok');close(w,{...list[w.i],category:w.category,index:w.i});}
    }
    else if (w.kind === "custom") { const pageDir=w.onPage?(In.repeat("left",now,350,220)?-1:In.repeat("right",now,350,220)?1:0):0; if(pageDir){w.onPage(pageDir);beep("blip");} if (In.hit("a") || In.hit("b")) { beep("back"); close(w, true); } }
  },

  draw() {
    G.use("ui");
    for (const w of stack) {
      if (w.kind === "say") drawSay(w);
      else if (w.kind === "choice") drawChoice(w);
      else if(w.kind==="itemList") drawItemList(w);
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
// いま メッセージを 出しているか
export function isSaying() {
  const w = stack[stack.length - 1];
  return Boolean(w && w.kind === "say");
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
  G.use("ui");
  const cur = curPage(w);
  if(battleMode)drawBattlePanel(G.ctx);else G.window9(BOX.x, BOX.y, BOX.w, BOX.h);
  let left = Math.floor(w.shown);
  for (let i = 0; i < cur.length; i++) {
    const line = cur[i];
    const show = line.slice(0, Math.max(0, left));
    left -= line.length;
    G.textFit(show, BOX.x + PAD, BOX.y + 20 + i * LINE_H, sayWidth(), battleMode?0:3, TEXT_SIZE);
  }
  const total = cur.join("").length;
  if (w.shown >= total && Math.floor(now / 300) % 2 === 0) {
    G.text("▼", BOX.x + BOX.w - PAD - 10, BOX.y + BOX.h - 20, 3, 10);
  }
}

/* --- えらぶ ----------------------------------------------------
   中身の 長さに あわせて わくを ひろげ、画面から はみ出さない
   ところまで 動かします。
------------------------------------------------------------------ */
function boxOf(w) {
  if(w.battle)return {...BOX,rows:2};
  let widest = 0;
  for (const s of w.items) widest = Math.max(widest, G.textW(s, TEXT_SIZE));
  let width = Math.max(w.w || 0, widest + CH_PAD_L + CH_PAD_R, 96);
  width = Math.min(width, G.W - 16);

  let x = w.x == null ? G.W - width - 8 : w.x;
  if (x + width > G.W - 8) x = G.W - 8 - width;
  if (x < 8) x = 8;

  let y = w.y == null ? 8 : w.y;
  const maxRows = Math.max(1, Math.floor((G.H - 16 - CH_PAD_Y * 2) / CH_ROW));
  const rows = Math.min(Math.ceil(w.items.length/(w.columns||1)), w.rows, maxRows);
  const h = CH_PAD_Y * 2 + rows * CH_ROW;
  // 余白と行数を保ったまま、画面の内側へ移動する。
  y = Math.max(8, Math.min(y, G.H - 8 - h));
  return { x: x, y: y, w: width, h: h, rows: rows };
}

function updateChoice(w) {
  const b = boxOf(w);
  const n = w.items.length;
  if(w.columns===2){
    if(In.repeat('right',now)){w.i=(w.i+1)%n;beep('blip');}
    if(In.repeat('left',now)){w.i=(w.i+n-1)%n;beep('blip');}
    if(In.repeat('down',now)||In.repeat('up',now)){const target=w.i<2?w.i+2:w.i-2;if(target<n)w.i=target;beep('blip');}
    if(In.hit('a')){beep('ok');close(w,w.i);}
    else if(In.hit('b')&&w.cancel){beep('back');close(w,-1);}
    return;
  }
  if (In.repeat("down", now)) { w.i = (w.i + 1) % n; beep("blip"); }
  if (In.repeat("up", now)) { w.i = (w.i + n - 1) % n; beep("blip"); }
  if (w.i < w.top) w.top = w.i;
  if (w.i >= w.top + b.rows) w.top = w.i - b.rows + 1;
  w.top = Math.max(0, Math.min(w.top, n - b.rows));

  if (In.hit("a")) { beep("ok"); close(w, w.i); return; }
  if (In.hit("b") && w.cancel) { beep("back"); close(w, -1); }
}

function drawChoice(w) {
  G.use("ui");
  const b = boxOf(w);
  if(w.battle)drawBattlePanel(G.ctx,b.x,b.y,b.w,b.h);else G.window9(b.x, b.y, b.w, b.h);
  if(w.battle){
    const cellW=(b.w-24)/2;
    w.items.forEach((label,i)=>{
      const x=b.x+12+(i%2)*cellW,y=b.y+12+Math.floor(i/2)*32;
      if(i===w.i){G.ctx.fillStyle='#3b6376';G.ctx.fillRect(x,y-2,cellW-4,30);G.text('▶',x+2,y+2,0,10);}
      const available=cellW-24,size=Math.min(14,14*available/Math.max(1,G.textW(label,14)));
      G.text(label,x+18,y+(w.details?0:6),0,size);
      if(w.details)G.text(w.details[i]||'',x+18,y+17,0,10);
    });
    return;
  }
  if(w.columns===2){
    const cellW=(b.w-16)/2;
    w.items.forEach((label,i)=>{const x=b.x+8+(i%2)*cellW,y=b.y+CH_PAD_Y+Math.floor(i/2)*CH_ROW;
      if(i===w.i)G.text('▶',x+4,y,3,12);
      G.textFit(label,x+22,y,cellW-28,3,14);
    });
    return;
  }
  const maxW = b.w - CH_PAD_L - CH_PAD_R;
  for (let r = 0; r < b.rows; r++) {
    const i = w.top + r;
    if (i >= w.items.length) break;
    const y = b.y + CH_PAD_Y + r * CH_ROW;
    if (i === w.i) G.text("▶", b.x + 14, y, 3, 12);
    G.textFit(w.items[i], b.x + CH_PAD_L, y, maxW, 3, TEXT_SIZE);
  }
  if (w.extra) w.extra(b, w.i);
  G.use("ui");
  if (w.top > 0) G.text("▲", b.x + b.w - 22, b.y + 5, 3, 10);
  if (w.top + b.rows < w.items.length) G.text("▼", b.x + b.w - 22, b.y + b.h - 15, 3, 10);
}

export { BOX };
