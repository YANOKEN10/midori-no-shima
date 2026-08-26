// ============================================================
//  フィールド（まちや どうろを あるく ところ）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { beep, playBgm } from "./audio.js";
import { tileFor, solid } from "./tiles.js";
import { MAPS } from "./data/maps.js";
import { personFrames, personFramesRaw, LOOKS } from "./data/charart.js";
import { playerColors } from "./data/looks.js";
import { MONART } from "./data/monart.js";
import {
  G as State, makeMon, species, monName, maxHp, healFull, healParty,
  addItem, addToParty, ownMon, setFlag, flag, rnd, chance, hasItem, useItem,
} from "./state.js";
import { startBattle, popEvolution, wait } from "./battle.js";
import { openMenu, shopMenu, showStatus, reportMenu, clothesShop, hairSalon } from "./menu.js";
import { saveLocal, saveCloud } from "./save.js";
import { cloud } from "./cloud.js";

const SPEED = 4;            // 1フレームに すすむ ドット
const T = G.TILE;

const charCache = new Map();
let rawFrames = null;
function playerFrames() {
  if (!rawFrames) rawFrames = personFramesRaw();
  return rawFrames;
}
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
    // しらない ばしょ（ふるい きろく など）なら むらへ もどす
    if (!MAPS[mapId]) { mapId = "village"; x = 7; y = 6; }
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
    if (enc && (ch === '"' || enc.encAll || (this.map.kind === "cave" && ch === "C"))) {
      if (chance(enc.rate / 100)) await this.wildBattle();
    }
  },

  async doWarp(wp) {
    this.busy = true;
    beep("warp");
    await wait(160);
    if (wp.to === "@back") {
      const b = State.save.backTo || { map: "village", x: 7, y: 6 };
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

  // ぞくちょう：ラグ・ネットを もらう → リーフ・コンパスを とってくる
  async elderEvent(n) {
    if (!flag("gotNet")) {
      await ui.say([
        "ぞくちょう「よく きた、" + State.save.name + "。",
        "　おまえも もう この やまを 出る としだ。",
        "　やまの そとには「ガオン」と よばれる",
        "　とくいせいぶつが あふれておる。",
      ]);
      addItem("ラグ・ネット", 8);
      addItem("ガオンずかん");
      setFlag("gotNet");
      beep("levelup");
      await ui.say([
        State.save.name + "は「ラグ・ネット」を てにいれた！",
        "のびちぢみする あみ。よわった ガオンを つかまえられる。",
      ]);
      await ui.say([
        "ぞくちょう「そして「ガオンずかん」だ。",
        "　であった ガオンが きろくされる。",
        "　やまを 出る まえに ひとつ しごとが ある。",
        "　やまの おくちに ある",
        "　「リーフ・コンパス」を とってくるのだ。",
      ]);
      saveLocal();
      return;
    }
    if (!flag("gotCompass")) {
      await ui.say([
        "ぞくちょう「やまの おくちだ。",
        "　きたの やまみちを ぬけた さきに ある。",
        "　たかい くさでは ガオンを つかまえて",
        "　なかまに してゆくと よい。",
      ]);
      return;
    }
    if (!flag("elderOK")) {
      setFlag("elderOK");
      beep("levelup");
      await ui.say([
        "ぞくちょう「おお…！ その コンパス。",
        "　みごとだ、" + State.save.name + "。",
        "　おまえを ひとりの ガオンつかいと みとめよう。",
      ]);
      await ui.say([
        "ぞくちょう「みなみの でぐちから やまを 出ろ。",
        "　せかいの ちゅうしん「ギャラクシー・タウン」で",
        "　ガオンバトル大会が ひらかれる。",
        "　8つの タウンを めぐり、7つの エンブレムを あつめよ。",
      ]);
      saveLocal();
      if (cloud.signedIn) saveCloud(true);
      return;
    }
    await ui.say([
      "ぞくちょう「よい たびを。",
      "　ガオンたちと ともに ゆけ。",
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
      "むらへ もどって ぞくちょうに 見せよう。",
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
        "うけつけ「ガオンバトル大会へ ようこそ！",
        "　しゅつじょうには 7つの エンブレムが ひつようです。",
        "　いまは " + have + "こですね。がんばって！",
      ]);
      return;
    }
    if (!hasItem("たいかいパス")) {
      addItem("たいかいパス");
      beep("levelup");
      await ui.say([
        "うけつけ「エンブレム 7つ、たしかに！",
        "　「たいかいパス」を おわたしします。",
        "　北の かいじょうで おまちしています！",
      ]);
      saveLocal();
      return;
    }
    await ui.say(["うけつけ「かいじょうは 北です。", "　けんとうを いのります！"]);
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
        "しんこう「ここは ガオンバトル大会の かいじょう。",
        "　しゅつじょうには「たいかいパス」が ひつようだ。",
      ]);
      return;
    }
    const yes = await ui.ask([
      "しんこう「" + State.save.name + "せんしゅ、じゅんびは いいか？",
      "　まけたら そこで おわりだ。",
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
      "しんこう「けっしょうせん！",
      "　あいては…うみから きた しょうねん フィロア！",
    ]);
    await ui.say([
      "フィロア「やっぱり ここで あえたね、" + State.save.name + "！",
      "　おれ、この 日の ために うみを わたってきたんだ。",
      "　ぜんりょくで いくよ！",
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
      State.save.name + "は ガオンバトル大会の ゆうしょうしゃに なった！",
      "やまの むらの みんなも、きっと よろこんでいる。",
      "やまの おくちの ぬし ラテットも、",
      "どこかで 見ていたのかもしれない——",
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
    for (let ty = y0; ty <= y0 + Math.ceil(G.H / T); ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        // 地図の そとは いちばん はしの マスを つづけて えがく
        const ch = edgeTile(map, tx, ty);
        if (ch === null) continue;
        const gg = group(ch);
        let mask = 0;
        if (group(edgeTile(map, tx, ty - 1)) === gg) mask |= 1;
        if (group(edgeTile(map, tx + 1, ty)) === gg) mask |= 2;
        if (group(edgeTile(map, tx, ty + 1)) === gg) mask |= 4;
        if (group(edgeTile(map, tx - 1, ty)) === gg) mask |= 8;
        G.draw(tileFor(ch, frame, map.sets, mask), tx * T - camX, ty * T - camY);
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
        const fi = this.moving ? this.walkFrame : 0;
        const hopY = this.hop ? -Math.abs(Math.sin((this.oy / T) * Math.PI)) * 14 : 0;
        let img;
        if (G.isColor()) {
          const f = playerFrames()[this.dir][fi];
          img = G.makeColorArt(f, 2, "pc" + this.dir + fi, playerColors(State.save.look));
        } else {
          const f = framesFor("player")[this.dir][fi];
          img = G.makeArt(f, 2, "p" + this.dir + fi, "player");
        }
        G.draw(img, px - camX, py - camY - 8 + hopY);
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

// つなげて えがく ときの「なかま」わけ
const GROUP = {
  ",": "g", '"': "g", F: "g", S: "g", "=": "g",
  ".": "p", s: "p", m: "p",
  "~": "n", W: "w", T: "t", R: "r", X: "x", C: "c", d: "d",
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
