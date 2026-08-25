// ============================================================
//  フィールド（まちや どうろを あるく ところ）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { beep, playBgm } from "./audio.js";
import { tileFor, solid } from "./tiles.js";
import { MAPS } from "./data/maps.js";
import { personFrames, LOOKS } from "./data/charart.js";
import { MONART } from "./data/monart.js";
import {
  G as State, makeMon, species, monName, maxHp, healFull, healParty,
  addItem, addToParty, ownMon, setFlag, flag, rnd, chance, hasItem, useItem,
} from "./state.js";
import { startBattle, popEvolution, wait } from "./battle.js";
import { openMenu, shopMenu, showStatus, reportMenu } from "./menu.js";
import { saveLocal, saveCloud } from "./save.js";
import { cloud } from "./cloud.js";

const SPEED = 4;            // 1フレームに すすむ ドット
const T = G.TILE;

const charCache = new Map();
function framesFor(look) {
  if (!charCache.has(look)) charCache.set(look, personFrames(LOOKS[look] || LOOKS.boy));
  return charCache.get(look);
}

export const world = {
  mapId: "", map: null,
  x: 0, y: 0, dir: "down",
  ox: 0, oy: 0, moving: false, mx: 0, my: 0,
  walkFrame: 0, walkTimer: 0, hop: 0,
  busy: false, steps: 0, tick: 0,
  npcs: [],

  enter(mapId, x, y, dir) {
    this.mapId = mapId;
    this.map = MAPS[mapId];
    this.x = x; this.y = y;
    if (dir) this.dir = dir;
    this.ox = this.oy = 0;
    this.moving = false;
    this.npcs = (this.map.npcs || []).map((n, i) => Object.assign({}, n, { idx: i, ox: 0, oy: 0 }));
    State.save.where = { map: mapId, x: x, y: y, dir: this.dir };
    this.showName = this.map.kind === "in" ? 0 : 2200;
    playBgm(bgmFor(mapId));
  },

  update(dt) {
    this.tick += dt;
    if (this.showName > 0) this.showName -= dt;
    ui.update(dt);
    if (ui.busy || this.busy) return;

    if (In.hit("start")) { this.busy = true; openMenu().then(() => { this.busy = false; }); return; }

    if (this.moving) {
      const sp = SPEED * (this.hop ? 1.5 : 1);
      if (this.dir === "left") this.ox -= sp;
      if (this.dir === "right") this.ox += sp;
      if (this.dir === "up") this.oy -= sp;
      if (this.dir === "down") this.oy += sp;
      this.walkTimer += dt;
      if (this.walkTimer > 110) { this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 4; }

      const goalX = (this.mx - this.x) * T, goalY = (this.my - this.y) * T;
      if (Math.abs(this.ox) >= Math.abs(goalX) && Math.abs(this.oy) >= Math.abs(goalY)) {
        this.x = this.mx; this.y = this.my;
        this.ox = this.oy = 0;
        this.moving = false;
        this.hop = 0;
        this.afterStep();
      }
      return;
    }

    if (In.hit("a")) { this.interact(); return; }

    const d = In.isDown("up") ? "up" : In.isDown("down") ? "down" : In.isDown("left") ? "left" : In.isDown("right") ? "right" : "";
    if (d) {
      if (this.dir !== d) { this.dir = d; this.walkTimer = 0; }
      this.tryStep(d);
    } else {
      this.walkFrame = 0;
    }
  },

  /* --- あるく ------------------------------------------------- */
  tryStep(d) {
    const dx = d === "left" ? -1 : d === "right" ? 1 : 0;
    const dy = d === "up" ? -1 : d === "down" ? 1 : 0;
    const nx = this.x + dx, ny = this.y + dy;
    const ch = tileAt(this.map, nx, ny);

    if (ch === null) return;
    // がけは 下へ とびおりるだけ
    if (ch === "L") {
      if (d !== "down") return;
      this.mx = nx; this.my = ny + 1;
      this.moving = true; this.hop = 1;
      beep("blip");
      return;
    }
    if (solid(ch)) return;
    if (this.npcAt(nx, ny)) return;
    this.mx = nx; this.my = ny;
    this.moving = true;
  },

  npcAt(x, y) { return this.npcs.find((n) => n.x === x && n.y === y && !n.gone); },

  async afterStep() {
    State.save.where = { map: this.mapId, x: this.x, y: this.y, dir: this.dir };
    State.save.steps = (State.save.steps || 0) + 1;

    // ワープ
    const wp = (this.map.warps || []).find((w) => w.x === this.x && w.y === this.y);
    if (wp) { await this.doWarp(wp); return; }

    // トレーナーに 見つかる
    const t = this.spotter();
    if (t) { await this.trainerSpot(t); return; }

    // やせいの モンスター
    const ch = tileAt(this.map, this.x, this.y);
    const enc = this.map.enc;
    if (enc && (ch === '"' || (this.map.kind === "cave" && ch === "C"))) {
      if (chance(enc.rate / 100)) await this.wildBattle();
    }
  },

  async doWarp(wp) {
    this.busy = true;
    beep("warp");
    await wait(160);
    if (wp.to === "@back") {
      const b = State.save.backTo || { map: "town2", x: 4, y: 5 };
      this.enter(b.map, b.x, b.y, "down");
    } else {
      if (wp.back) State.save.backTo = wp.back;
      this.enter(wp.to, wp.tx, wp.ty, wp.edge ? this.dir : "down");
    }
    saveLocal();
    this.busy = false;
  },

  // 4マス さきまで 見ている トレーナー
  spotter() {
    for (const n of this.npcs) {
      if (!n.trainer || n.gone) continue;
      if (flag("beat:" + this.mapId + ":" + n.idx)) continue;
      const dx = this.x - n.x, dy = this.y - n.y;
      const face = n.dir;
      let ok = false, dist = 0;
      if (face === "down" && dx === 0 && dy > 0 && dy <= 4) { ok = true; dist = dy; }
      if (face === "up" && dx === 0 && dy < 0 && dy >= -4) { ok = true; dist = -dy; }
      if (face === "right" && dy === 0 && dx > 0 && dx <= 4) { ok = true; dist = dx; }
      if (face === "left" && dy === 0 && dx < 0 && dx >= -4) { ok = true; dist = -dx; }
      if (!ok) continue;
      // あいだに かべが ないか
      let clear = true;
      for (let i = 1; i < dist; i++) {
        const cx = n.x + (face === "right" ? i : face === "left" ? -i : 0);
        const cy = n.y + (face === "down" ? i : face === "up" ? -i : 0);
        if (solid(tileAt(this.map, cx, cy))) { clear = false; break; }
      }
      if (clear) return n;
    }
    return null;
  },

  async trainerSpot(n) {
    this.busy = true;
    n.alert = 900;
    beep("ok");
    await wait(700);
    n.alert = 0;
    // となりまで あるいてくる
    if (n.dir === "down") n.y = this.y - 1;
    else if (n.dir === "up") n.y = this.y + 1;
    else if (n.dir === "right") n.x = this.x - 1;
    else n.x = this.x + 1;
    await wait(200);
    await this.runNpc(n);
    this.busy = false;
  },

  /* --- はなす・しらべる --------------------------------------- */
  interact() {
    const dx = this.dir === "left" ? -1 : this.dir === "right" ? 1 : 0;
    const dy = this.dir === "up" ? -1 : this.dir === "down" ? 1 : 0;
    const tx = this.x + dx, ty = this.y + dy;

    const n = this.npcAt(tx, ty);
    if (n) { this.busy = true; this.runNpc(n).then(() => { this.busy = false; }); return; }

    const it = (this.map.items || []).find((i) => i.x === tx && i.y === ty && !flag(i.flag));
    if (it) { this.busy = true; this.pickItem(it).then(() => { this.busy = false; }); return; }

    const sg = (this.map.signs || []).find((s) => s.x === tx && s.y === ty);
    if (sg) { this.busy = true; ui.say(sg.text).then(() => { this.busy = false; }); return; }

    const ob = (this.map.objects || []).find((o) => o.x === tx && o.y === ty);
    if (ob) {
      this.busy = true;
      (async () => {
        await ui.say(ob.text);
        if (ob.pc) await reportMenu();
      })().then(() => { this.busy = false; });
      return;
    }
  },

  async pickItem(it) {
    beep("ok");
    addItem(it.item);
    setFlag(it.flag);
    await ui.say([State.save.name + "は " + it.item + "を みつけた！"]);
    saveLocal();
  },

  async runNpc(n) {
    // むきを こちらへ
    if (!n.trainer) {
      if (this.dir === "up") n.dir = "down";
      else if (this.dir === "down") n.dir = "up";
      else if (this.dir === "left") n.dir = "right";
      else n.dir = "left";
    }

    const beatKey = "beat:" + this.mapId + ":" + n.idx;

    if (n.script === "starter" && !flag("gotStarter")) { await this.starterEvent(n); return; }
    if (n.script === "champion" && !flag("champion")) {
      if (State.save.badges.length < 2) {
        await ui.say([n.name + "「バッジを 2つ あつめてから", "　もういちど こい！」"]);
        return;
      }
    }

    if (n.trainer && !flag(beatKey)) {
      await ui.say(n.talk || ["しょうぶだ！"]);
      const party = n.trainer.party.map((p) => (p[0] === "@rivalStarter" ? [State.save.rivalStarter || "ネズミン", p[1]] : p));
      const res = await startBattle({ trainer: Object.assign({}, n.trainer, { party: party, name: n.name }) });
      if (res === "lose") { await this.blackout(); return; }
      setFlag(beatKey);
      await ui.say(n.win || ["やるな！"]);
      if (n.trainer.leader) {
        const badge = n.trainer.leader;
        if (State.save.badges.indexOf(badge) < 0) State.save.badges.push(badge);
        addItem(badge);
        beep("levelup");
        await ui.say([State.save.name + "は " + badge + "を てにいれた！"]);
      }
      if (n.script === "champion") {
        setFlag("champion");
        await ui.say(n.after || []);
        await this.ending();
        return;
      }
      if (n.after) await ui.say(n.after);
      await this.checkEvolution();
      saveLocal();
      if (cloud.signedIn) saveCloud(true);
      playBgm(bgmFor(this.mapId));
      return;
    }

    if (n.healAll) {
      await ui.say(n.talk);
      const yes = await ui.ask(["モンスターを やすませますか？"]);
      if (yes) {
        beep("heal");
        await ui.say(["…おやすみなさい。"], { speed: 6 });
        healParty();
        await wait(600);
        await ui.say(["おまたせしました！", "みんな げんきに なりました。"]);
        const b = State.save.backTo;
        if (b) State.save.lastCenter = { map: b.map, x: b.x, y: b.y };
        saveLocal();
        if (cloud.signedIn) saveCloud(true);
      }
      return;
    }

    if (n.shop) {
      await ui.say(n.talk);
      await shopMenu();
      return;
    }

    if (n.heal) {
      await ui.say(n.talk);
      const yes = await ui.ask(["ゆっくり やすんでいく？"]);
      if (yes) {
        healParty();
        beep("heal");
        await ui.say(["…すっきりした！", "モンスターたちも げんきに なった。"]);
        saveLocal();
      }
      return;
    }

    await ui.say((flag(beatKey) && n.after) ? n.after : n.talk);
  },

  /* --- さいしょの モンスター ---------------------------------- */
  async starterEvent(n) {
    await ui.say([
      "ハカセ「おお、" + State.save.name + "！",
      "　よく きたな。",
      "　きみに モンスターを 1ぴき あげよう。",
    ]);
    const list = ["リーフィン", "ヒノコマ", "アワミィ"];
    let picked = -1;
    while (picked < 0) {
      const i = await ui.choice(list.map((s) => s + "（" + species(s).types.join("") + "）"), { x: 20, y: 120, w: 280, cancel: false });
      await ui.say([list[i] + "を えらびますか？"]);
      const yes = await ui.ask([]);
      if (yes) picked = i;
    }
    const starter = list[picked];
    const mon = makeMon(starter, 5);
    addToParty(mon);
    ownMon(starter);
    State.save.starter = starter;
    State.save.rivalStarter = list[(picked + 1) % 3];
    setFlag("gotStarter");
    beep("levelup");
    await ui.say([State.save.name + "は " + starter + "を てにいれた！"]);
    await ui.say(["ハカセ「その こと なかよく してやってくれ。"]);
    addItem("ずかん");
    addItem("モンスターボール", 5);
    await ui.say([
      "ハカセ「これも もっていきなさい。",
      "　ずかんと モンスターボール 5こだ。",
      "　たかい くさで つかまえてみるといい！",
    ]);
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  },

  /* --- やせいの たたかい -------------------------------------- */
  async wildBattle() {
    this.busy = true;
    const enc = this.map.enc;
    const total = enc.list.reduce((s, e) => s + e[3], 0);
    let r = rnd(total), chosen = enc.list[0];
    for (const e of enc.list) { r -= e[3]; if (r < 0) { chosen = e; break; } }
    const lv = chosen[1] + rnd(chosen[2] - chosen[1] + 1);
    const mon = makeMon(chosen[0], lv);
    const res = await startBattle({ wild: mon });
    if (res === "lose") { await this.blackout(); this.busy = false; return; }
    await this.checkEvolution();
    playBgm(bgmFor(this.mapId));
    saveLocal();
    this.busy = false;
  },

  async checkEvolution() {
    let e = popEvolution();
    while (e) {
      const from = e.mon.sp;
      await ui.say(["おや…？", from + "の ようすが…！"]);
      e.mon.sp = e.to;
      ownMon(e.to);
      beep("levelup");
      await ui.say(["おめでとう！ " + from + "は", e.to + "に しんかした！"]);
      e = popEvolution();
    }
  },

  async blackout() {
    await ui.say([State.save.name + "は めのまえが まっくらに なった…"]);
    const lost = Math.floor(State.save.money / 2);
    State.save.money -= lost;
    healParty();
    const c = State.save.lastCenter || { map: "town1", x: 5, y: 5 };
    this.enter(c.map, c.x, c.y, "down");
    await ui.say(["おかねを " + lost + "円 おとしてしまった…", "モンスターセンターで めを さました。"]);
    saveLocal();
  },

  async ending() {
    await ui.say([
      "…………",
      State.save.name + "は チャンピオンに なった！",
      "ここまで あそんでくれて ありがとう！",
      "ぼうけんは これからも つづく——",
    ]);
    saveLocal();
    if (cloud.signedIn) await saveCloud(true);
  },

  /* --- えがく ------------------------------------------------- */
  draw() {
    const map = this.map;
    const mw = map.rows[0].length, mh = map.rows.length;
    const px = this.x * T + this.ox, py = this.y * T + this.oy;
    // メッセージわくの ぶんだけ 下に よぶんに スクロールできるように する
    //（そうしないと まちの はしで 主人公が わくに かくれてしまう）
    const EXTRA = 96;
    let camX = px - (G.W - T) / 2, camY = py - (G.H - T) / 2 - 24;
    camX = Math.max(0, Math.min(mw * T - G.W, camX));
    camY = Math.max(0, Math.min(mh * T - G.H + EXTRA, camY));
    if (mw * T < G.W) camX = (mw * T - G.W) / 2;
    if (mh * T + EXTRA < G.H) camY = (mh * T - G.H) / 2;

    // そとの すきま（地図の むこう）は そのばしょに あう 色で うめる
    G.use(map.kind === "cave" ? "cave" : map.kind === "in" ? "floor" : "grass");
    G.clear(map.kind === "cave" ? 3 : map.kind === "in" ? 3 : 2);

    const frame = Math.floor(this.tick / 500) % 2;
    const x0 = Math.floor(camX / T), y0 = Math.floor(camY / T);
    for (let ty = y0; ty <= y0 + Math.ceil(G.H / T); ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        // 地図の そとは いちばん はしの マスを つづけて えがく
        const ch = edgeTile(map, tx, ty);
        if (ch === null) continue;
        G.draw(tileFor(ch, frame, map.sets), tx * T - camX, ty * T - camY);
      }
    }

    // おちている どうぐ
    for (const it of map.items || []) {
      if (flag(it.flag)) continue;
      drawBall(it.x * T - camX, it.y * T - camY);
    }

    // ひとたち（うしろに いる人から）
    const people = this.npcs.filter((n) => !n.gone).map((n) => ({ n: n, y: n.y }));
    people.push({ me: true, y: this.y + (this.oy > 0 ? 0.5 : 0) });
    people.sort((a, b) => a.y - b.y);
    for (const p of people) {
      if (p.me) {
        const f = framesFor("player")[this.dir][this.moving ? this.walkFrame : 0];
        const hopY = this.hop ? -Math.abs(Math.sin((this.oy / T) * Math.PI)) * 14 : 0;
        G.draw(G.makeArt(f, 2, "p" + this.dir + (this.moving ? this.walkFrame : 0), "player"), px - camX, py - camY - 8 + hopY);
      } else {
        const n = p.n;
        const f = framesFor(n.look)[n.dir || "down"][0];
        G.draw(G.makeArt(f, 2, "n" + n.look + (n.dir || "down"), n.look), n.x * T - camX, n.y * T - camY - 8);
        if (n.alert) {
          G.use("ui");
          G.window9(n.x * T - camX + 6, n.y * T - camY - 34, 22, 26);
          G.text("！", n.x * T - camX + 11, n.y * T - camY - 30, 3, 16);
        }
      }
    }

    // まちの なまえ（はいってすぐ）
    G.use("ui");
    if (this.showName > 0) {
      const wdt = G.textW(map.name, 16) + 32;
      G.window9(8, 8, wdt, 38);
      G.text(map.name, 24, 19, 3, 16);
    }
    ui.draw();
  },
};

function drawBall(x, y) {
  const pal = G.resolve("flower");
  G.ctx.fillStyle = G.resolve("ui")[3];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 9, 0, Math.PI * 2); G.ctx.fill();
  G.ctx.fillStyle = pal[0];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 7, 0, Math.PI * 2); G.ctx.fill();
  G.ctx.fillStyle = pal[2];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 7, Math.PI, 0); G.ctx.fill();
  G.ctx.fillStyle = G.resolve("ui")[3];
  G.ctx.fillRect(x + 9, y + 17, 14, 2);
}

export function tileAt(map, x, y) {
  if (y < 0 || y >= map.rows.length) return null;
  const row = map.rows[y];
  if (x < 0 || x >= row.length) return null;
  return row[x];
}

// えがく ときだけ つかう：地図の そとは はしの マスを くりかえす
function edgeTile(map, x, y) {
  const ty = Math.max(0, Math.min(map.rows.length - 1, y));
  const row = map.rows[ty];
  const tx = Math.max(0, Math.min(row.length - 1, x));
  return row[tx];
}

export function bgmFor(mapId) {
  const m = MAPS[mapId];
  if (!m) return "town";
  if (mapId === "center") return "center";
  if (m.kind === "cave") return "cave";
  if (m.kind === "in") return "town";
  if (m.kind === "out" && /route/.test(mapId)) return "route";
  if (mapId === "summit") return "route";
  return "town";
}
