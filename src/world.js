// ============================================================
//  フィールド（まちや どうろを あるく ところ）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { beep, playBgm } from "./audio.js";
import { tileFor, solid } from "./tiles.js";
import { battleArt } from "./data/battleart.js";
import { environmentTile } from "./environmentArt.js";
import { findHouses, houseImage } from "./props.js";
import { treeImage, TREE_W, TREE_UP } from "./trees.js";
import { MAPS } from "./data/maps.js?v=20260902-movement-v5";
import { personFrames, personFramesRaw, LOOKS, styleOf } from "./data/charart.js";
import { playerColors, darker } from "./data/looks.js";
import { MONART } from "./data/monart.js";
import {
  G as State, makeMon, species, monName, maxHp, healFull, healParty,
  addItem, addToParty, ownMon, setFlag, flag, rnd, chance, hasItem, useItem,
} from "./state.js";
import { startBattle, popEvolution, wait } from "./battle.js";
import { openMenu, shopMenu, showStatus, reportMenu, clothesShop, hairSalon } from "./menu.js";
import { saveLocal, saveCloud } from "./save.js";
import { cloud } from "./cloud.js";
import { compassEnabled, compassWaypoint } from "./compass.js";
import { drawTerrain, drawHero, drawRevampObject, drawRevampTree, drawTileDetail, drawWorldBackdrop } from "./revampArt.js?v=20260902-movement-v5";

const SPEED = 4;            // 1フレームに すすむ ドット
const T = G.TILE;

const charCache = new Map();
let rawFrames = null;
function playerStyle() {
  const L = State.save.look || {};
  return { hair: L.hat || L.style || "short", bangs: L.bangs == null ? "seven" : L.bangs,
           skirt: Boolean(L.skirt), face: L.skirt ? "girl" : "boy" };
}
function playerFrames() { return personFramesRaw(playerStyle()); }
function framesFor(look) {
  if (!charCache.has(look)) charCache.set(look, personFrames(LOOKS[look] || LOOKS.boy, styleOf(look)));
  return charCache.get(look);
}
// NPC ごとの かみがた（地図で していが あれば それを つかう）
function npcStyle(n) {
  const base = styleOf(n.look);
  return {
    hair: n.hair || base.hair,
    bangs: n.bangs == null ? base.bangs : n.bangs,
    skirt: n.skirt == null ? base.skirt : Boolean(n.skirt),
    coat: base.coat, face: base.face,
  };
}
function npcKey(n) { const s = npcStyle(n); return s.hair + s.bangs + (s.skirt ? "s" : ""); }

// ひとの いろ（かげの 色も 作る）
const lookColorCache = new Map();
function colorsFor(look) {
  if (lookColorCache.has(look)) return lookColorCache.get(look);
  const pal = G.resolve(look) || G.resolve("boy");
  const L = LOOKS[look] || LOOKS.boy;
  const c = {
    K: pal[L.K], S: pal[L.S], P: pal[L.P], H: pal[L.H], "3": pal[3], w: "#ffffff", T: "#e3c281", C: "#f4f6f8",
    k: darker(pal[L.K], 0.18), s: darker(pal[L.S]), p: darker(pal[L.P]), h: darker(pal[L.H], 0.32), t: darker("#e3c281"), c: "#ccd3da",
  };
  lookColorCache.set(look, c);
  return c;
}
G.onPaletteChange(() => lookColorCache.clear());

const SOLID_LANDMARKS = new Set([
  "alpineCabin","alpineLodge","alpineBoathouse","alpineWorkshop","alpineHerbalist",
  "alpineSnowChalet","alpineRailStation","alpineObservatory"
]);
function landmarkBlocked(map, x, y) {
  if ((map.warps || []).some((w) => w.x === x && w.y === y)) return false;
  return (map.landmarks || []).some((lm) => {
    if (!SOLID_LANDMARKS.has(lm.art)) return false;
    const w=lm.w||4,h=lm.h||4;
    if (x < lm.x || x >= lm.x+w || y < lm.y || y >= lm.y+h) return false;
    return !(y === lm.y+h-1 && x === lm.x+Math.floor(w/2));
  });
}
export const world = {
  mapId: "", map: null,
  x: 0, y: 0, dir: "down",
  ox: 0, oy: 0, moving: false, mx: 0, my: 0,
  walkFrame: 0, walkTimer: 0, hop: 0,
  busy: false, steps: 0, tick: 0,
  npcs: [],

  enter(mapId, x, y, dir) {
    // しらない ばしょ（ふるい きろく など）なら むらへ もどす
    if (!MAPS[mapId]) { mapId = "village"; x = 7; y = 6; }
    this.mapId = mapId;
    this.map = MAPS[mapId];
    if (this.map.freeMove && (tileAt(this.map, Math.floor(x), Math.floor(y)) == null || solid(tileAt(this.map, Math.floor(x), Math.floor(y))))) {
      x = this.map.spawn.x; y = this.map.spawn.y;
    }
    // ばんのため：とおれない マスに 出ないよう、ちかくの あるける マスへ
    if (solid(tileAt(this.map, x, y)) || tileAt(this.map, x, y) === null || landmarkBlocked(this.map, x, y)) {
      let found = null;
      for (let r = 1; r <= 4 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            const c = tileAt(this.map, x + dx, y + dy);
            if (c !== null && !solid(c) && c !== "L" && !landmarkBlocked(this.map, x + dx, y + dy)) found = [x + dx, y + dy];
          }
        }
      }
      if (found) { x = found[0]; y = found[1]; }
    }
    this.x = x; this.y = y;
    this.fx = x; this.fy = y;
    this.freeCellX = Math.floor(x); this.freeCellY = Math.floor(y);
    if (dir) this.dir = dir;
    this.ox = this.oy = 0;
    this.moving = false;
    this.npcs = (this.map.npcs || []).map((n, i) => Object.assign({}, n, {
      idx: i, ox: 0, oy: 0, homeX: n.x, homeY: n.y,
      roamWait: 900 + i * 370, moving: false, walkFrame: 0,
    }));
    State.save.where = { map: mapId, x: x, y: y, dir: this.dir };
    this.showName = this.map.kind === "in" ? 0 : 2200;
    playBgm(bgmFor(mapId));
  },

  update(dt) {
    this.tick += dt;
    if (this.showName > 0) this.showName -= dt;
    ui.update(dt);
    if (this.map.freeMove && !ui.busy && !this.busy) this.updateNpcRoam(dt);
    if (ui.busy || this.busy) return;

    if (In.hit("start")) { this.busy = true; openMenu().then(() => { this.busy = false; }); return; }

    if (this.map.freeMove) {
      if (In.hit("a")) { this.interact(); return; }
      this.updateFree(dt); return;
    }

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

  updateFree(dt) {
    const move = In.movementVector();
    if (!move.x && !move.y) { this.moving = false; this.walkFrame = 0; return; }
    const length = Math.hypot(move.x, move.y) || 1;
    const vx = move.x / length, vy = move.y / length;
    const distance = Math.min(0.18, dt * 0.0062);
    if (Math.abs(vx) > Math.abs(vy)) this.dir = vx < 0 ? "left" : "right";
    else this.dir = vy < 0 ? "up" : "down";

    let nx = this.fx + vx * distance, ny = this.fy + vy * distance;
    // 壁沿いで止まり過ぎないよう、X/Yを分離して滑らせる。
    if (this.canFreeStand(nx, this.fy)) this.fx = nx;
    if (this.canFreeStand(this.fx, ny)) this.fy = ny;
    this.x = this.fx; this.y = this.fy;
    this.ox = this.oy = 0;
    this.moving = true;
    this.walkTimer += dt;
    if (this.walkTimer > 110) { this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 4; }
    State.save.where = { map: this.mapId, x: this.x, y: this.y, dir: this.dir };

    const wp = (this.map.warps || []).find((w) => Math.abs(w.x - this.fx) < 0.38 && Math.abs(w.y - this.fy) < 0.38);
    if (wp && !this.busy) { this.busy = true; this.doWarp(wp).finally(() => { this.busy = false; }); return; }

    const cellX = Math.floor(this.fx), cellY = Math.floor(this.fy);
    if (cellX !== this.freeCellX || cellY !== this.freeCellY) {
      this.freeCellX = cellX; this.freeCellY = cellY;
      State.save.steps = (State.save.steps || 0) + 1;
      const ch = tileAt(this.map, cellX, cellY);
      // 野生ガオンは「濃い草むら (")」に足を踏み入れた時だけ出現する。
      if (ch === '"' && this.map.enc && chance(this.map.enc.rate / 100) && !this.busy) {
        this.wildBattle();
      }
    }
  },

  updateNpcRoam(dt) {
    const dirs = [[0,-1,"up"],[0,1,"down"],[-1,0,"left"],[1,0,"right"]];
    for (const n of this.npcs) {
      if (n.gone || n.noRoam || n.trainer) continue;
      n.roamWait -= dt;
      if (!n.moving && n.roamWait <= 0) {
        const d = dirs[(n.idx + Math.floor(this.tick / 1100)) % dirs.length];
        const tx = n.x + d[0], ty = n.y + d[1];
        const ch = tileAt(this.map, Math.floor(tx), Math.floor(ty));
        const nearHome = Math.hypot(tx - n.homeX, ty - n.homeY) <= 1.8;
        const nearPlayer = Math.hypot(tx - this.fx, ty - this.fy) >= .8;
        if (nearHome && nearPlayer && ch != null && !solid(ch) && ch !== "L") {
          n.fromX = n.x; n.fromY = n.y; n.toX = tx; n.toY = ty;
          n.dir = d[2]; n.roamProgress = 0; n.moving = true;
        }
        n.roamWait = 1200 + ((n.idx * 431 + Math.floor(this.tick)) % 1300);
      }
      if (n.moving) {
        n.roamProgress = Math.min(1, n.roamProgress + dt / 520);
        n.x = n.fromX + (n.toX - n.fromX) * n.roamProgress;
        n.y = n.fromY + (n.toY - n.fromY) * n.roamProgress;
        n.walkFrame = Math.floor(n.roamProgress * 4) % 4;
        if (n.roamProgress >= 1) { n.x = n.toX; n.y = n.toY; n.moving = false; }
      }
    }
  },

  canFreeStand(x, y) {
    const foot = [[0,0],[-.22,-.08],[.22,-.08],[-.2,.18],[.2,.18]];
    for (const [ox, oy] of foot) {
      const ch = tileAt(this.map, Math.floor(x + ox), Math.floor(y + oy));
      if (ch == null || solid(ch) || ch === "L") return false;
    }
    return !this.npcs.some((n) => !n.gone && Math.hypot(n.x - x, n.y - y) < .58);
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
    if (solid(ch) || landmarkBlocked(this.map, nx, ny)) return;
    if (this.npcAt(nx, ny)) return;
    this.mx = nx; this.my = ny;
    this.moving = true;
  },

  npcAt(x, y) {
    return this.npcs.find((n) => !n.gone && (this.map.freeMove
      ? Math.hypot(n.x - x, n.y - y) < .72
      : n.x === x && n.y === y));
  },

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
    if (enc && (ch === '"' || enc.encAll || (this.map.kind === "cave" && ch === "C"))) {
      if (chance(enc.rate / 100)) await this.wildBattle();
    }
  },

  async doWarp(wp) {
    this.busy = true;
    beep("warp");
    const enteringBuilding = this.map && this.map.kind === "out" && this.map.freeMove && !wp.edge && wp.to !== "@back";
    if (enteringBuilding) {
      // 玄関の奥へ歩き、戸口に隠れてから暗転する。
      this.dir = "up"; this.moving = true;
      for (let i = 1; i <= 7; i++) {
        this.fy -= 0.055;
        this.y = this.fy;
        this.walkFrame = i % 4;
        this.doorFade = Math.max(0, (i - 3) / 4);
        await wait(36);
      }
    } else {
      this.doorFade = 1;
      await wait(150);
    }
    if (wp.to === "@back") {
      const b = State.save.backTo || { map: "village", x: 7, y: 6 };
      this.enter(b.map, b.x, b.y, "down");
    } else {
      if (wp.back) State.save.backTo = wp.back;
      this.enter(wp.to, wp.tx, wp.ty, wp.edge ? this.dir : "down");
    }
    for (let i = 5; i >= 0; i--) {
      this.doorFade = i / 5;
      await wait(32);
    }
    this.doorFade = 0;
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
    const tx = Math.round(this.x + dx), ty = Math.round(this.y + dy);

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

    /* --- ものがたりの イベント --- */
    if (n.script === "elder") { await this.elderEvent(n); return; }
    if (n.script === "latette") { await this.latetteEvent(n); return; }
    if (n.script === "gate") { await this.gateEvent(n); return; }
    if (n.script === "legend") { await this.legendEvent(n); return; }
    if (n.script === "entry") { await this.entryEvent(n); return; }
    if (n.script === "tournament") { await this.tournamentEvent(n); return; }

    if (n.trainer && !flag(beatKey)) {
      await ui.say(n.talk || ["しょうぶだ！"]);
      const res = await startBattle({ trainer: Object.assign({}, n.trainer, { name: n.name }) });
      if (res === "lose") { await this.blackout(); return; }
      setFlag(beatKey);
      await ui.say(n.win || ["やるな！"]);
      if (n.trainer.leader) {
        const em = n.trainer.leader;
        if (State.save.badges.indexOf(em) < 0) State.save.badges.push(em);
        addItem(em);
        beep("levelup");
        await ui.say([State.save.name + "は " + em + "を てにいれた！",
                      "エンブレム " + State.save.badges.length + "こめ！"]);
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
      const yes = await ui.ask(["ガオンを やすませますか？"]);
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

    if (n.clothes) {
      await ui.say(n.talk);
      await clothesShop(n.clothes === "fancy");
      return;
    }

    if (n.salon) {
      await ui.say(n.talk);
      await hairSalon();
      return;
    }

    if (n.heal) {
      await ui.say(n.talk);
      const yes = await ui.ask(["ゆっくり やすんでいく？"]);
      if (yes) {
        healParty();
        beep("heal");
        await ui.say(["…すっきりした！", "ガオンたちも げんきに なった。"]);
        saveLocal();
      }
      return;
    }

    await ui.say((flag(beatKey) && n.after) ? n.after : n.talk);
  },

  /* ============================================================
     ものがたり
  ============================================================ */

  // 谷守：山の異変をしらべるため、ラグ・ネットをたくす
  async elderEvent(n) {
    if (!flag("gotNet")) {
      await ui.say([
        "オルド「よく きた、" + State.save.name + "。",
        "　今朝、谷をぬける風から 音が消えた。",
        "　ガオンたちも 雪峰のほうを 見つめている。",
        "　山の奥で なにかが 目をさましたのだ。",
      ]);
      addItem("ラグ・ネット", 8);
      addItem("ガオンずかん");
      setFlag("gotNet");
      beep("levelup");
      await ui.say([
        State.save.name + "は「ラグ・ネット」を うけとった！",
        "谷のつる草で 編まれた網。ガオンを 傷つけずに 保護できる。",
      ]);
      await ui.say([
        "オルド「これは 谷の生き物を記す 観察帳だ。",
        "　戦うためだけでなく、声を聞くために 使ってほしい。",
        "　雲を生む森をぬけ、山の奥へ 行ってくれ。",
        "　古い伝承が本当なら、リーフ・コンパスが",
        "　異変の源へ おまえを 導くだろう。",
      ]);
      saveLocal();
      return;
    }
    if (!flag("gotCompass")) {
      await ui.say([
        "オルド「北の モミ林を ぬけ、雪どけの泉へ。",
        "　ガオンが 近づいてきたら、まず ようすを見ろ。",
        "　心を通わせた 仲間なら、山の気配を",
        "　おまえより 早く感じてくれる。",
      ]);
      return;
    }
    if (!flag("elderOK")) {
      setFlag("elderOK");
      beep("levelup");
      await ui.say([
        "オルド「その葉脈の光… コンパスが おまえを選んだか。",
        "　ラテットは 山を守る者を 見きわめたのだろう。",
        "　谷の外でも、土地ごとの声を 聞いてきてほしい。",
      ]);
      await ui.say([
        "オルド「山々には 七つの谷があり、それぞれに",
        "　人とガオンの暮らしを守る『谷守』がいる。",
        "　七つの エンブレムは、土地の声を聞いた証。",
        "　集めれば 星環の都で、山脈会議への道が開くだろう。",
      ]);
      saveLocal();
      if (cloud.signedIn) saveCloud(true);
      return;
    }
    await ui.say([
      "オルド「よい風が おまえの背を押すように。",
      "　ガオンたちと、まだ名のない道を ゆけ。",
    ]);
  },

  // やまの おくち：ラテットに であい、リーフ・コンパスを 手に入れる
  async latetteEvent(n) {
    if (flag("gotCompass")) {
      if (flag("champion") && !flag("latetteBack")) {
        await ui.say(["やまの おくちに、また あの きんいろの かげが…！"]);
        setFlag("latetteBack");
        const res = await startBattle({ wild: makeMon("ラテット", 50) });
        if (res === "lose") { await this.blackout(); return; }
        await this.checkEvolution();
        playBgm(bgmFor(this.mapId));
        saveLocal();
        return;
      }
      await ui.say(["しずかな いずみ。", "あの ガオンの すがたは もう ない。"]);
      return;
    }
    n.gone = true;
    beep("levelup");
    await ui.say([
      "いずみの ほとりに、金の たてがみの ガオンが いた。",
      "……「ラテット」。やまの ぬしと よばれる でんせつの ガオン。",
    ]);
    await wait(400);
    await ui.say([
      "ラテットは " + State.save.name + "を じっと 見つめ、",
      "かぜの ように はしり去っていった。",
    ]);
    addItem("リーフ・コンパス");
    setFlag("gotCompass");
    beep("catch");
    await ui.say([
      "ラテットが いた ばしょに、",
      "「リーフ・コンパス」が おちていた！",
      "STARTの「どうぐ」から 見ると、つぎの土地が わかる。",
      "風鳴り谷へ もどって オルドに 見せよう。",
    ]);
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  },

  // やまの でぐち：コンパスが ないと とおれない
  async gateEvent(n) {
    if (!flag("elderOK")) {
      await ui.say([
        "みはり「ここから さきは やまの そとだ。",
        "　ぞくちょうさまに みとめられたのか？",
        "　…まだ みたいだな。もどりな。",
      ]);
      return;
    }
    if (!flag("gateOpen")) {
      setFlag("gateOpen");
      n.x = 4; n.dir = "down";
      await ui.say([
        "みはり「その コンパス…！ みとめられたんだな。",
        "　いってこい。せかいは ひろいぞ。",
      ]);
      saveLocal();
      return;
    }
    await ui.say(["みはり「きを つけてな。"]);
  },

  // でんせつの ガオン（メロロン・ディーナ）
  async legendEvent(n) {
    const L = n.legend;
    if (flag("legend:" + L.name)) {
      await ui.say(["…あの ガオンの すがたは もう ない。"]);
      return;
    }
    await ui.say(n.talk);
    setFlag("legend:" + L.name);
    n.gone = true;
    const res = await startBattle({ wild: makeMon(L.name, L.lv) });
    if (res === "lose") { await this.blackout(); return; }
    await this.checkEvolution();
    playBgm(bgmFor(this.mapId));
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  },

  // 大会の うけつけ：エンブレム 7つで しゅつじょう
  async entryEvent(n) {
    const have = State.save.badges.length;
    if (flag("champion")) {
      await ui.say(["うけつけ「ゆうしょうしゃの " + State.save.name + "さん！",
                    "　また いつでも ちょうせんしに きてくださいね。"]);
      return;
    }
    if (have < 7) {
      await ui.say([
        "案内人「七つの谷が集う 山脈祭へ ようこそ。",
        "　中央のバトル会議へは 7つの証が ひつようです。",
        "　いまは " + have + "こ。まだ声を聞いていない谷があります。",
      ]);
      return;
    }
    if (!hasItem("たいかいパス")) {
      addItem("たいかいパス");
      beep("levelup");
      await ui.say([
        "案内人「七つの谷の証、たしかに。",
        "　山脈会議の「たいかいパス」を おわたしします。",
        "　北の木造ホールで、谷の代表たちが待っています。",
      ]);
      saveLocal();
      return;
    }
    await ui.say(["案内人「木造ホールは 北です。", "　あなたの旅の答えを 見せてください。"]);
  },

  // ガオンバトル大会
  async tournamentEvent(n) {
    if (flag("champion")) {
      await ui.say(["しんこう「ゆうしょうしゃの おでましだ！",
                    "　ことしも みごとな たたかいだった。"]);
      return;
    }
    if (!hasItem("たいかいパス")) {
      await ui.say([
        "進行役「ここは 七つの谷の バトル会議場。",
        "　参加には 山脈祭の「たいかいパス」が ひつようだ。",
      ]);
      return;
    }
    const yes = await ui.ask([
      "進行役「" + State.save.name + "、旅の答えを 見せる準備はいいか？",
      "　七つの谷の代表と、つづけて 声を重ねてもらう。",
    ], "たたかう", "まだ まつ");
    if (!yes) return;

    const rounds = [
      { name: "1かいせん　ガオンつかい リク", look: "boy",
        party: [["デカネズ", 44], ["ソラハネ", 45], ["ガンセキ", 45]], money: 3000,
        talk: ["リク「1かいせん、いくぞ！"], win: ["リク「つよい…！"] },
      { name: "2かいせん　ガオンつかい ミオ", look: "girl",
        party: [["ミナモン", 46], ["キノガミ", 46], ["ラゲドン", 47]], money: 4000,
        talk: ["ミオ「ここからは かんたんには いかないわ。"], win: ["ミオ「みごとね。"] },
      { name: "じゅんけっしょう　ガオンつかい ゴウ", look: "hiker",
        party: [["ガンゴレム", 47], ["ドリルモグ", 48], ["オオカブト", 48]], money: 5000,
        talk: ["ゴウ「かたい ガオンで うけとめる！"], win: ["ゴウ「くずされたか…！"] },
    ];

    for (let i = 0; i < rounds.length; i++) {
      const r = rounds[i];
      await ui.say(["しんこう「" + r.name + "！"]);
      await ui.say(r.talk);
      const res = await startBattle({ trainer: { party: r.party, money: r.money, name: r.name, leader: null, champ: true } });
      if (res === "lose") { await this.tournamentLose(); return; }
      await ui.say(r.win);
      await this.checkEvolution();
      healParty();
      await ui.say(["しんこう「かいふくの じかんだ。", "　ガオンたちが げんきに なった！"]);
      saveLocal();
    }

    // けっしょう：フィロア
    await ui.say([
      "進行役「最後に 地図を閉じる一戦！",
      "　相手は…湖のむこうから来た 測量士フィロア！",
    ]);
    await ui.say([
      "フィロア「やっぱり 最後の線は きみと引くんだね、" + State.save.name + "！",
      "　おれの地図には、道だけじゃなく 出会った声も描いてある。",
      "　七つの谷を歩いた全部で、しょうぶだ！",
    ]);
    const res = await startBattle({
      trainer: {
        name: "フィロア",
        party: [["スイスイオ", 48], ["ライボルト", 48], ["オオハサミ", 50], ["リュウグウ", 52]],
        money: 8000, champ: true,
      },
    });
    if (res === "lose") { await this.tournamentLose(); return; }

    setFlag("champion");
    beep("levelup");
    await ui.say([
      "フィロア「…つよいなあ。おれの まけだ！",
      "　でも つぎは ぜったい かつからな！",
    ]);
    await this.checkEvolution();
    await this.ending();
  },

  async tournamentLose() {
    await ui.say([
      "しんこう「しょうぶ あり！",
      "　" + State.save.name + "せんしゅ、ここで だいかいだ。",
      "　また ちょうせんしに きてくれ。",
    ]);
    healParty();
    this.enter("galaxy", 8, 4, "down");
    saveLocal();
  },

  /* --- やせいの ガオン ---------------------------------------- */
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
    const c = State.save.lastCenter || { map: "village", x: 7, y: 6 };
    this.enter(c.map, c.x, c.y, "down");
    await ui.say(["おかねを " + lost + "円 おとしてしまった…", "ガオン・ステーションで めを さました。"]);
    saveLocal();
  },

  async ending() {
    await ui.say([
      "…………",
      State.save.name + "の旅が、七つの谷をつなぐ 新しい道として認められた！",
      "風鳴り谷の人々も、きっと 風の音で知っただろう。",
      "山の奥地の ラテットも、",
      "葉脈の光を どこかで見ていたのかもしれない——",
      "ここまで あそんでくれて ありがとう！",
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
    const fullBackdrop = map.fullArt && drawWorldBackdrop(G.ctx, map.fullArt, camX, camY, mw * T, mh * T);
    for (let ty = y0; ty <= y0 + Math.ceil(G.H / T); ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        if (fullBackdrop) continue;
        // 地図の そとは いちばん はしの マスを つづけて えがく
        const ch = edgeTile(map, tx, ty);
        if (ch === null) continue;
        const gg = group(ch);
        // まわり 8マスを 見る（ななめも 見て、かどを まるく できるように）
        let mask = 0;
        if (group(edgeTile(map, tx, ty - 1)) === gg) mask |= 1;
        if (group(edgeTile(map, tx + 1, ty)) === gg) mask |= 2;
        if (group(edgeTile(map, tx, ty + 1)) === gg) mask |= 4;
        if (group(edgeTile(map, tx - 1, ty)) === gg) mask |= 8;
        if (group(edgeTile(map, tx + 1, ty - 1)) === gg) mask |= 16;
        if (group(edgeTile(map, tx + 1, ty + 1)) === gg) mask |= 32;
        if (group(edgeTile(map, tx - 1, ty + 1)) === gg) mask |= 64;
        if (group(edgeTile(map, tx - 1, ty - 1)) === gg) mask |= 128;
        const vr = ((tx * 7 + ty * 13 + tx * ty) >>> 0) % 16;
        // がけの 下の じめんには かげが おちる
        const up = edgeTile(map, tx, ty - 1);
        const sh = up === "M" && GROUND.has(ch) ? 1 : 0;   // がけ だけ かげを おとす
        // き の ところは まず じめんだけ えがく（木は あとで かさねる）
        const hiddenBuilding = map.hideTileHouses && (ch === "r" || ch === "#" || ch === "w" || ch === "D");
        const draw = hiddenBuilding ? "," : (ch === "T") ? ((map.sets && map.sets.T2) || ",") : ch;
        const tileX = tx * T - camX, tileY = ty * T - camY;
        const newGround = !sh && drawTerrain(G.ctx, draw, map, tileX, tileY, T, tx, ty);
        if (!newGround) G.draw(tileFor(draw, frame, map.sets, draw === ch ? mask : 255, vr, sh, tx, ty), tileX, tileY);
        if(newGround) drawTileDetail(G.ctx,ch,tileX,tileY,T);
      }
    }

    // き（1本ずつ かさねて もりに 見せる）
    for (let ty = y0 - 1; ty <= y0 + Math.ceil(G.H / T) + 1; ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        if (fullBackdrop || edgeTile(map, tx, ty) !== "T") continue;
        const kind = ((tx * 5 + ty * 11 + tx * ty) >>> 0) % 4;
        const foot = edgeTile(map, tx, ty + 1) !== "T";     // 下に 木が なければ みきを 出す
        const winterTree = map.sets && map.sets[","] === "snow";
        const treeX=tx*T-camX, treeY=ty*T-camY;
        if(!G.isColor() || !drawRevampTree(G.ctx,treeX,treeY)) {
          G.draw(treeImage(kind, foot, winterTree),
                 treeX - (TREE_W - T) / 2, treeY - TREE_UP);
        }
      }
    }

    // たてもの（何マスかに またがる 1まいの え）
    for (const hs of fullBackdrop || map.hideTileHouses ? [] : findHouses(map)) {
      const sx = hs.x * T - camX, sy = hs.y * T - camY;
      if (sx > G.W || sy > G.H || sx + hs.w * T < 0 || sy + hs.h * T < 0) continue;
      G.draw(houseImage(hs), sx, sy);
    }

    // 山岳世界の大型建築・橋・崖。複数マスをまたぐ高密度画像で奥行きを出す。
    for (const lm of fullBackdrop ? [] : (map.landmarks || [])) {
      const sx = lm.x * T - camX, sy = lm.y * T - camY;
      const w = (lm.w || 4) * T, h = (lm.h || 4) * T;
      if (sx > G.W || sy > G.H || sx + w < 0 || sy + h < 0) continue;
      if(!G.isColor() || !drawRevampObject(G.ctx,lm.art,sx,sy,w,h)) {
        const img = environmentTile(lm.art);
        if (img) G.drawScaled(img, sx, sy, w, h);
      }
    }

    // おちている どうぐ
    for (const it of map.items || []) {
      if (flag(it.flag)) continue;
      drawBall(it.x * T - camX, it.y * T - camY);
    }

    // ひとたち（うしろに いる人から）
    const people = this.npcs.filter((n) => !n.gone).map((n) => ({ n: n, y: n.y }));
    if (G.isColor() && State.save.party && State.save.party.length) {
      const back = this.dir === "up" ? [0, 1] : this.dir === "down" ? [0, -1]
        : this.dir === "left" ? [1, 0] : [-1, 0];
      people.push({ follower: State.save.party[0], x: this.x + back[0], y: this.y + back[1] });
    }
    people.push({ me: true, y: this.y + (this.oy > 0 ? 0.5 : 0) });
    people.sort((a, b) => a.y - b.y);
    for (const p of people) {
      if (p.follower) {
        const monImg = battleArt(p.follower.sp);
        if (monImg) G.drawScaled(monImg, p.x * T - camX - 6, p.y * T - camY - 10, 44, 44);
      } else if (p.me) {
        const fi = this.moving ? this.walkFrame : 0;
        const hopY = this.hop ? -Math.abs(Math.sin((this.oy / T) * Math.PI)) * 14 : 0;
        const heroX = px - camX, heroY = py - camY - 28 + hopY;
        if (!G.isColor() || !drawHero(G.ctx, this.dir, this.moving, this.tick, heroX, heroY)) {
          let img;
          const f = playerFrames()[this.dir][fi];
          if (G.isColor()) img = G.makeColorArt(f, 1, "pc" + this.dir + fi, playerColors(State.save.look));
          else img = G.makeArt(framesFor("player")[this.dir][fi], 1, "p" + this.dir + fi, "player");
          G.draw(img, px - camX, py - camY - 12 + hopY);
        }
      } else {
        const n = p.n;
        const dirn = n.dir || "down";
        const personKey = ({ boy:"Boy", girl:"Girl", prof:"Prof", oldman:"Oldman", nurse:"Nurse", clerk:"Clerk",
          sailor:"Sailor", hiker:"Hiker", leader1:"Leader1", leader2:"Leader2", rival:"Rival", philoa:"Leader1" })[n.look];
        const generatedPerson = G.isColor() && personKey && environmentTile("person" + personKey);
        const nfi = n.moving ? n.walkFrame : 0;
        const img2 = generatedPerson || (G.isColor()
          ? G.makeColorArt(personFramesRaw(npcStyle(n))[dirn][nfi], 1, "nc" + n.look + npcKey(n) + dirn + nfi, colorsFor(n.look))
          : G.makeArt(framesFor(n.look)[dirn][nfi], 1, "n" + n.look + dirn + nfi, n.look));
        G.draw(img2, n.x * T - camX, n.y * T - camY - 12);
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
    if (compassEnabled()) drawCompassArrow(this.mapId, this.x, this.y, camX, camY, this.tick);
    if (this.doorFade > 0) {
      G.ctx.fillStyle = `rgba(3, 12, 23, ${Math.min(1, this.doorFade)})`;
      G.ctx.fillRect(0, 0, G.W, G.H);
    }
    ui.draw();
  },
};

function drawCompassArrow(mapId, x, y, camX, camY, tick) {
  const wp = compassWaypoint(mapId);
  if (!wp || wp.done || wp.x == null) return;
  const targetX = wp.x * T + T / 2 - camX;
  const targetY = wp.y * T + T / 2 - camY;
  const playerX = x * T + T / 2 - camX;
  const playerY = y * T + T / 2 - camY;
  const angle = Math.atan2(targetY - playerY, targetX - playerX);
  const c = G.ctx;

  // 画面右上の常時見えるコンパス。進行方向へ針が回る。
  c.save();
  c.translate(286, 28);
  c.fillStyle = "rgba(12,35,56,0.86)";
  c.strokeStyle = "#fff1b8";
  c.lineWidth = 2;
  c.beginPath(); c.arc(0, 0, 19, 0, Math.PI * 2); c.fill(); c.stroke();
  c.rotate(angle + Math.PI / 2);
  const bob = Math.sin(tick / 180) * 2;
  c.translate(0, bob);
  c.fillStyle = "#5dd7ff";
  c.strokeStyle = "#092e66";
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, -14); c.lineTo(9, 8); c.lineTo(0, 4); c.lineTo(-9, 8); c.closePath();
  c.fill(); c.stroke();
  c.restore();

  // 目的地点が画面内に入ったら、場所そのものにも葉形の印を出す。
  if (targetX > 14 && targetX < G.W - 14 && targetY > 22 && targetY < G.H - 28) {
    c.save();
    c.translate(targetX, targetY - 18 + Math.sin(tick / 160) * 3);
    c.rotate(-0.35);
    c.fillStyle = "#8ee85b";
    c.strokeStyle = "#173d24";
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, -11); c.bezierCurveTo(12, -6, 10, 8, 0, 12);
    c.bezierCurveTo(-10, 6, -10, -5, 0, -11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(0, -7); c.lineTo(0, 9); c.stroke();
    c.restore();
  }
}

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

// つなげて えがく ときの「なかま」わけ
// がけの かげが おちる じめん
const GROUND = new Set([",", ".", '"', "~", "F", "m", "d", "W", "H", "S", "s"]);

const GROUP = {
  ",": "g", '"': "g", F: "g", S: "g", "=": "g",
  ".": "p", s: "p", m: "p",
  "~": "n", W: "w", T: "t", R: "r", M: "cliff", X: "x", C: "c", d: "d",
  r: "roof", "#": "wall", w: "wall", D: "wall",
};
function group(ch) { return ch == null ? "" : (GROUP[ch] || ch); }

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
