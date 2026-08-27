// ============================================================
//  たたかい
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui, BOX, topRect, overlaps, isSaying } from "./ui.js";
import { beep, playBgm } from "./audio.js";
import { MONART, MONPAL } from "./data/monart.js";
import { effect, effectWord } from "./data/types.js";
import { move as moveData } from "./data/moves.js";
import { item as itemData } from "./data/items.js";
import {
  G as State, species, palOf, accentOf, makeMon, maxHp, statOf, monName, fainted, gainExp,
  healFull, rnd, chance, useItem, bagList, addToParty, ownMon, seeMon, learnMove,
} from "./state.js";

export function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

const STAGE = [0.25, 0.28, 0.33, 0.4, 0.5, 0.66, 1, 1.5, 2, 2.5, 3, 3.5, 4];
function stageMul(s) { return STAGE[Math.max(-6, Math.min(6, s)) + 6]; }

function fresh(mon, isPlayer) {
  return {
    mon: mon, player: Boolean(isPlayer),
    st: { atk: 0, def: 0, spd: 0, spc: 0, acc: 0 },
    flinch: false, sleep: 0, leech: false, trap: 0,
    shakeX: 0, hidden: false, flash: 0,
  };
}

let B = null;   // いまの たたかい

export const battle = {
  active: false,
  update(dt) {
    ui.update(dt);
    if (!B) return;
    for (const s of [B.you, B.foe]) {
      if (!s) continue;
      if (s.shakeX) s.shakeX *= 0.82;
      if (s.flash > 0) s.flash -= dt;
    }
    if (B.hpAnim) {
      for (const s of [B.you, B.foe]) {
      if (!s) continue;
        if (s.showHp == null) s.showHp = s.mon.hp;
        const d = s.mon.hp - s.showHp;
        if (Math.abs(d) < 0.6) s.showHp = s.mon.hp;
        else s.showHp += d * 0.16;
      }
    }
  },
  draw() { drawBattle(); ui.draw(); },
};

/* ============================================================
   たたかい 本体
   opts: { wild: mon } / { trainer: {...} }
   もどりち: "win" | "lose" | "run" | "caught"
============================================================ */
export async function startBattle(opts) {
  const you = State.save.party.find((m) => !fainted(m)) || null;
  const isTrainer = Boolean(opts.trainer);
  if (!you && isTrainer) return "lose";
  const foeParty = isTrainer ? opts.trainer.party.map((p) => makeMon(p[0], p[1])) : [opts.wild];
  B = {
    isTrainer: isTrainer,
    trainer: opts.trainer || null,
    foeParty: foeParty, foeIndex: 0,
    you: you ? fresh(you, true) : null, foe: fresh(foeParty[0], false),
    turn: 0, runTries: 0, hpAnim: true, caught: false,
    intro: 0,
  };
  if (B.you) B.you.showHp = you.hp;
  B.foe.showHp = B.foe.mon.hp;
  battle.active = true;

  playBgm(isTrainer ? ((opts.trainer.leader || opts.trainer.champ) ? "boss" : "battle") : "battle");
  seeMon(B.foe.mon.sp);

  await wait(260);
  if (isTrainer) await ui.say([opts.trainer.name + "が しょうぶを しかけてきた！"]);
  else await ui.say(["あっ！ やせいの " + B.foe.mon.sp + "が とびだしてきた！"]);
  if (B.you) await ui.say(["ゆけっ！ " + monName(B.you.mon) + "！"]);
  else await ui.say(["まだ ガオンを もっていない。", "ラグ・ネットで つかまえてみよう！"]);

  let result = "";
  while (!result) {
    const action = await chooseAction();
    if (action.kind === "run") {
      if (B.isTrainer) { await ui.say(["トレーナーとの しょうぶからは にげられない！"]); continue; }
      if (await tryRun()) { result = "run"; break; }
      await doTurn(null);
    } else if (action.kind === "move") {
      await doTurn(action.move);
    } else if (action.kind === "item") {
      const r = await useBattleItem(action.item);
      if (r === "caught") { result = "caught"; break; }
      if (r === "used") await doTurn(null, true);
    } else if (action.kind === "switch") {
      await switchTo(action.index);
      await doTurn(null, true);
    }
    if (result) break;

    // どちらかが たおれたか
    if (fainted(B.foe.mon)) {
      const r = await onFoeDown();
      if (r) result = r;
    } else if (B.you && fainted(B.you.mon)) {
      // さいしょの つかまえかた（てもちが いない）ときは ここを とばす
      const r = await onYouDown();
      if (r) result = r;
    }
  }

  battle.active = false;
  lastEvo = B.pendingEvo || null;
  B = null;
  if (result === "win" && isTrainer) {
    const money = opts.trainer.money || 0;
    State.save.money += money;
    await ui.say([opts.trainer.name + "に かった！", "しょうきんとして " + money + "円 てにいれた！"]);
  }
  return result;
}

/* --- こうどうを えらぶ ---------------------------------------- */
async function chooseAction() {
  for (;;) {
    if (!B.you) {
      const j = await ui.choice(["ラグ・ネットを つかう", "にげる"], { x: 96, y: 168, w: 216, rows: 2, cancel: false });
      if (j === 1) return { kind: "run" };
      const list = bagList("battle").filter((x) => itemData(x.name).kind === "ball");
      if (!list.length) { await ui.say(["ラグ・ネットを もっていない！"]); return { kind: "run" }; }
      if (list.length === 1) return { kind: "item", item: list[0].name };
      const k = await ui.choice(list.map((x) => x.name + " ×" + x.n), { x: 8, y: 140, w: 240, rows: 4 });
      if (k >= 0) return { kind: "item", item: list[k].name };
      continue;
    }
    const i = await ui.choice(["たたかう", "どうぐ", "ガオン", "にげる"], {
      x: 160, y: 168, w: 152, rows: 4, cancel: false,
    });
    if (i === 0) {
      const mv = await chooseMove();
      if (mv) return { kind: "move", move: mv };
    } else if (i === 1) {
      const it = await chooseItem();
      if (it) return { kind: "item", item: it };
    } else if (i === 2) {
      const idx = await choosePartyMember();
      if (idx >= 0) return { kind: "switch", index: idx };
    } else if (i === 3) {
      return { kind: "run" };
    }
  }
}

async function chooseMove() {
  const m = B.you.mon;
  const labels = m.moves.map((mv) => {
    const d = moveData(mv.name);
    return mv.name + "  " + mv.pp + "/" + mv.max;
  });
  const i = await ui.choice(labels, { x: 8, y: 168, w: 220, rows: 4 });
  if (i < 0) return null;
  if (m.moves[i].pp <= 0) { await ui.say(["わざの のこりが ない！"]); return null; }
  return m.moves[i];
}

async function chooseItem() {
  const list = bagList("battle");
  if (!list.length) { await ui.say(["どうぐを もっていない。"]); return null; }
  const labels = list.map((x) => x.name + " ×" + x.n);
  const i = await ui.choice(labels, { x: 8, y: 140, w: 240, rows: 5 });
  if (i < 0) return null;
  return list[i].name;
}

async function choosePartyMember() {
  const p = State.save.party;
  const labels = p.map((m, i) => {
    return (i === p.indexOf(B.you.mon) ? "・" : "　") + monName(m) + " Lv" + m.lv + " " + m.hp + "/" + maxHp(m) + (m.status ? " " + m.status : "");
  });
  const i = await ui.choice(labels, { x: 8, y: 118, w: 300, rows: 6 });
  if (i < 0) return -1;
  if (p[i] === B.you.mon) { await ui.say([monName(p[i]) + "は もう でている！"]); return -1; }
  if (fainted(p[i])) { await ui.say([monName(p[i]) + "は たたかえない！"]); return -1; }
  return i;
}

async function switchTo(i) {
  await ui.say(["もどれ！ " + monName(B.you.mon) + "！"]);
  B.you = fresh(State.save.party[i], true);
  B.you.showHp = B.you.mon.hp;
  await ui.say(["ゆけっ！ " + monName(B.you.mon) + "！"]);
}

/* --- 1ターン --------------------------------------------------- */
async function doTurn(playerMove, skipPlayer) {
  if (!B.you) { await ui.say(["やせいの " + B.foe.mon.sp + "は こちらを じっと 見ている。"]); return; }
  const youSpd = statOf(B.you.mon, "spd") * stageMul(B.you.st.spd) * (B.you.mon.status === "まひ" ? 0.25 : 1);
  const foeSpd = statOf(B.foe.mon, "spd") * stageMul(B.foe.st.spd) * (B.foe.mon.status === "まひ" ? 0.25 : 1);
  const foeMove = pickFoeMove();

  const pPri = playerMove ? (moveData(playerMove.name).pri || 0) : 0;
  const fPri = foeMove ? (moveData(foeMove.name).pri || 0) : 0;
  let youFirst;
  if (skipPlayer || !playerMove) youFirst = false;
  else if (pPri !== fPri) youFirst = pPri > fPri;
  else youFirst = youSpd === foeSpd ? chance(0.5) : youSpd > foeSpd;

  const order = youFirst ? [[B.you, B.foe, playerMove], [B.foe, B.you, foeMove]]
                         : [[B.foe, B.you, foeMove], [B.you, B.foe, playerMove]];

  for (const [atk, def, mv] of order) {
    if (!mv) continue;
    if (fainted(atk.mon) || fainted(def.mon)) continue;
    await useMove(atk, def, mv);
    if (fainted(def.mon)) break;
  }

  // ターンの おわり（どく・やけど・やどりぎ）
  for (const s of [B.you, B.foe]) {
      if (!s) continue;
    if (fainted(s.mon)) continue;
    if (s.mon.status === "どく" || s.mon.status === "やけど") {
      const d = Math.max(1, Math.floor(maxHp(s.mon) / 16));
      s.mon.hp = Math.max(0, s.mon.hp - d);
      await ui.say([label(s) + "は " + s.mon.status + "の ダメージを うけた！"]);
      beep("weak");
      await wait(220);
    }
    if (s.leech && !fainted(s.mon)) {
      const other = s === B.you ? B.foe : B.you;
      const d = Math.max(1, Math.floor(maxHp(s.mon) / 16));
      s.mon.hp = Math.max(0, s.mon.hp - d);
      other.mon.hp = Math.min(maxHp(other.mon), other.mon.hp + d);
      await ui.say([label(s) + "は やどりぎに たいりょくを すわれた！"]);
      await wait(220);
    }
  }
  B.turn++;
}

function label(s) { return s.player ? monName(s.mon) : "あいての " + monName(s.mon); }

function pickFoeMove() {
  const m = B.foe.mon;
  const usable = m.moves.filter((x) => x.pp > 0);
  if (!usable.length) return null;
  if (!B.isTrainer) return usable[rnd(usable.length)];
  // トレーナーは あいしょうの いい わざを えらびやすい
  let best = usable[0], bestScore = -1;
  for (const mv of usable) {
    const d = moveData(mv.name);
    let score = d.pow || 30;
    if (d.pow) score *= effect(d.type, species(B.you.mon.sp).types);
    score *= 0.7 + Math.random() * 0.6;
    if (score > bestScore) { bestScore = score; best = mv; }
  }
  return best;
}

/* --- わざを つかう --------------------------------------------- */
async function useMove(atk, def, mv) {
  const d = moveData(mv.name);

  // ねむり・まひ の はんてい
  if (atk.mon.status === "ねむり") {
    if (atk.sleep > 0) atk.sleep--;
    if (atk.sleep <= 0) { atk.mon.status = ""; await ui.say([label(atk) + "は めを さました！"]); }
    else { await ui.say([label(atk) + "は ぐうぐう ねむっている。"]); return; }
  }
  if (atk.mon.status === "まひ" && chance(0.25)) {
    await ui.say([label(atk) + "は からだが しびれて うごけない！"]);
    return;
  }
  if (atk.flinch) { atk.flinch = false; await ui.say([label(atk) + "は ひるんで うごけない！"]); return; }

  mv.pp = Math.max(0, mv.pp - 1);
  await ui.say([label(atk) + "の " + mv.name + "！"]);

  // めいちゅう
  if (!chance(Math.min(1, (d.acc / 100) * stageMul(atk.st.acc)))) {
    await ui.say([label(atk) + "の こうげきは はずれた！"]);
    return;
  }

  const fx = d.fx || {};

  // へんかわざ
  if (d.cat === "stat" || !d.pow) {
    await applyEffects(atk, def, fx, 0);
    return;
  }

  // ダメージ
  const times = fx.multi ? (fx.multi[0] + rnd(fx.multi[1] - fx.multi[0] + 1)) : 1;
  let total = 0, eff = 1, crit = false;
  for (let i = 0; i < times; i++) {
    if (fainted(def.mon)) break;
    const r = calcDamage(atk, def, d, fx);
    eff = r.eff;
    if (r.crit) crit = true;
    if (r.eff === 0) break;
    def.mon.hp = Math.max(0, def.mon.hp - r.dmg);
    total += r.dmg;
    def.shakeX = 8;
    def.flash = 140;
    beep(r.eff >= 2 ? "super" : r.eff < 1 ? "weak" : "hit");
    await wait(200);
  }

  if (eff === 0) { await ui.say(["こうかが ないようだ…"]); return; }
  if (crit) await ui.say(["きゅうしょに あたった！"]);
  const w = effectWord(eff);
  if (w) await ui.say([w]);
  if (times > 1) await ui.say([times + "かい あたった！"]);

  // すいとる・はんどう
  if (fx.drain && total > 0) {
    const heal = Math.max(1, Math.floor(total * fx.drain));
    atk.mon.hp = Math.min(maxHp(atk.mon), atk.mon.hp + heal);
    await ui.say([label(atk) + "は たいりょくを すいとった！"]);
  }
  if (fx.recoil && total > 0) {
    const back = Math.max(1, Math.floor(total * fx.recoil));
    atk.mon.hp = Math.max(0, atk.mon.hp - back);
    await ui.say([label(atk) + "は はんどうで きずついた！"]);
  }

  if (!fainted(def.mon)) await applyEffects(atk, def, fx, total);
}

function calcDamage(atk, def, d, fx) {
  const a = atk.mon, b = def.mon;
  const spTypes = species(b.sp).types;
  const eff = effect(d.type, spTypes);
  if (eff === 0) return { dmg: 0, eff: 0, crit: false };

  const phys = d.cat === "phys";
  let A = statOf(a, phys ? "atk" : "spc") * stageMul(phys ? atk.st.atk : atk.st.spc);
  let D = statOf(b, phys ? "def" : "spc") * stageMul(phys ? def.st.def : def.st.spc);
  if (phys && a.status === "やけど") A *= 0.5;

  const critRate = (fx.crit ? 0.125 : 0.0625);
  const crit = chance(critRate);
  if (crit) { A = statOf(a, phys ? "atk" : "spc"); D = statOf(b, phys ? "def" : "spc"); }

  let dmg = Math.floor(Math.floor(Math.floor((2 * a.lv) / 5 + 2) * d.pow * A / Math.max(1, D)) / 50) + 2;
  if (crit) dmg *= 2;
  if (species(a.sp).types.indexOf(d.type) >= 0) dmg = Math.floor(dmg * 1.5);
  dmg = Math.floor(dmg * eff);
  dmg = Math.floor(dmg * (217 + rnd(39)) / 255);
  return { dmg: Math.max(1, dmg), eff: eff, crit: crit };
}

async function applyEffects(atk, def, fx, dealt) {
  if (fx.self) {
    for (const k of Object.keys(fx.self)) {
      atk.st[k] = Math.max(-6, Math.min(6, atk.st[k] + fx.self[k]));
      await ui.say([label(atk) + "の " + statName(k) + "が " + (fx.self[k] > 0 ? "あがった！" : "さがった！")]);
    }
  }
  if (fx.foe && (!fx.chance || chance(fx.chance))) {
    for (const k of Object.keys(fx.foe)) {
      def.st[k] = Math.max(-6, Math.min(6, def.st[k] + fx.foe[k]));
      await ui.say([label(def) + "の " + statName(k) + "が " + (fx.foe[k] > 0 ? "あがった！" : "さがった！")]);
    }
  }
  if (fx.status && chance(fx.chance == null ? 1 : fx.chance)) {
    if (!def.mon.status) {
      const t = species(def.mon.sp).types;
      const immune = (fx.status === "やけど" && t.indexOf("ほのお") >= 0) ||
                     (fx.status === "まひ" && t.indexOf("でんき") >= 0);
      if (!immune) {
        def.mon.status = fx.status;
        if (fx.status === "ねむり") def.sleep = 1 + rnd(3);
        await ui.say([label(def) + "は " + fx.status + "に なった！"]);
      }
    }
  }
  if (fx.flinch && chance(fx.flinch)) def.flinch = true;
  if (fx.leech) { def.leech = true; await ui.say([label(def) + "に たねを うえつけた！"]); }
  if (fx.heal) {
    const h = Math.floor(maxHp(atk.mon) * fx.heal);
    atk.mon.hp = Math.min(maxHp(atk.mon), atk.mon.hp + h);
    beep("heal");
    await ui.say([label(atk) + "は たいりょくを かいふくした！"]);
  }
  if (fx.rest) {
    atk.mon.hp = maxHp(atk.mon);
    atk.mon.status = "ねむり";
    atk.sleep = 2;
    beep("heal");
    await ui.say([label(atk) + "は ねむって げんきに なった！"]);
  }
  if (fx.reset) {
    B.you.st = { atk: 0, def: 0, spd: 0, spc: 0, acc: 0 };
    B.foe.st = { atk: 0, def: 0, spd: 0, spc: 0, acc: 0 };
    await ui.say(["のうりょくの へんかが もとに もどった！"]);
  }
}

function statName(k) {
  return { atk: "こうげき", def: "ぼうぎょ", spd: "すばやさ", spc: "まほう", acc: "めいちゅう" }[k] || k;
}

/* --- にげる ---------------------------------------------------- */
async function tryRun() {
  if (!B.you) { beep("back"); await ui.say(["うまく にげきれた！"]); return true; }
  B.runTries++;
  const a = statOf(B.you.mon, "spd");
  const b = statOf(B.foe.mon, "spd");
  const odds = b === 0 ? 1 : ((a * 32) / ((b / 4) % 256) + 30 * B.runTries) / 256;
  if (odds > 1 || chance(odds)) {
    beep("back");
    await ui.say(["うまく にげきれた！"]);
    return true;
  }
  await ui.say(["にげられない！"]);
  return false;
}

/* --- どうぐ ---------------------------------------------------- */
async function useBattleItem(name) {
  const d = itemData(name);
  if (d.kind === "ball") {
    if (B.isTrainer) { await ui.say(["ひとの ガオンを とるなんて だめ！"]); return "no"; }
    useItem(name);
    return await throwBall(d.rate);
  }
  if (d.kind === "heal") {
    if (!B.you) { await ui.say(["いま つかっても いみが なさそうだ。"]); return "no"; }
    const m = B.you.mon;
    if (m.hp >= maxHp(m)) { await ui.say(["たいりょくは まんたんだ。"]); return "no"; }
    useItem(name);
    const before = m.hp;
    m.hp = Math.min(maxHp(m), m.hp + d.amount);
    beep("heal");
    await ui.say([monName(m) + "の たいりょくが " + (m.hp - before) + " かいふくした！"]);
    return "used";
  }
  if (d.kind === "cure") {
    if (!B.you) { await ui.say(["いま つかっても いみが なさそうだ。"]); return "no"; }
    const m = B.you.mon;
    if (!m.status || (d.cure !== "all" && m.status !== d.cure)) { await ui.say(["こうかが なさそうだ。"]); return "no"; }
    useItem(name);
    m.status = "";
    beep("heal");
    await ui.say([monName(m) + "は げんきに なった！"]);
    return "used";
  }
  if (d.kind === "revive") {
    const idx = await choosePartyMemberForRevive();
    if (idx < 0) return "no";
    useItem(name);
    const m = State.save.party[idx];
    m.hp = Math.max(1, Math.floor(maxHp(m) * d.ratio));
    m.status = "";
    beep("heal");
    await ui.say([monName(m) + "は げんきを とりもどした！"]);
    return "used";
  }
  await ui.say(["いまは つかえない。"]);
  return "no";
}

async function choosePartyMemberForRevive() {
  const p = State.save.party;
  const labels = p.map((m) => monName(m) + " Lv" + m.lv + (fainted(m) ? " ひんし" : " " + m.hp + "/" + maxHp(m)));
  const i = await ui.choice(labels, { x: 8, y: 118, w: 300, rows: 6 });
  if (i < 0) return -1;
  if (!fainted(p[i])) { await ui.say(["その ガオンは げんきだ。"]); return -1; }
  return i;
}

async function throwBall(ballRate) {
  const m = B.foe.mon;
  await ui.say(["ラグ・ネットを つかった！"]);
  B.foe.hidden = true;
  beep("ball");
  await wait(400);

  const max = maxHp(m);
  const statusBonus = m.status === "ねむり" ? 2 : (m.status ? 1.5 : 1);
  let a = ((3 * max - 2 * m.hp) * species(m.sp).catch * ballRate * statusBonus) / (3 * max);
  a = Math.min(255, a);
  const b = 65536 / Math.pow(255 / Math.max(1, a), 0.1875);

  let shakes = 0;
  for (let i = 0; i < 4; i++) {
    if (a >= 255 || Math.random() * 65536 < b) shakes++;
    else break;
  }
  for (let i = 0; i < Math.min(shakes, 3); i++) {
    beep("ball");
    await wait(420);
  }

  if (shakes >= 4) {
    beep("catch");
    await ui.say(["やった！ " + m.sp + "を つかまえた！"]);
    ownMon(m.sp);
    const where = addToParty(m);
    if (where === "box") await ui.say(["てもちが いっぱいなので", m.sp + "を ボックスへ おくった。"]);
    return "caught";
  }
  B.foe.hidden = false;
  const msg = ["ああ！ ネットから でてしまった！", "おしい！ あと すこしだったのに！", "ダメだ！ とびだされた！"];
  await ui.say([msg[Math.min(shakes, 2)]]);
  return "used";
}

/* --- たおれたとき --------------------------------------------- */
async function onFoeDown() {
  beep("faint");
  B.foe.hidden = true;
  await wait(400);
  await ui.say([label(B.foe) + "は たおれた！"]);
  if (!B.you) return "win";           // てもちが いない ときは けいけんち なし

  // けいけんち
  const base = species(B.foe.mon.sp).exp;
  const gain = Math.max(1, Math.floor((base * B.foe.mon.lv / 7) * (B.isTrainer ? 1.5 : 1)));
  const m = B.you.mon;
  await ui.say([monName(m) + "は " + gain + " けいけんちを もらった！"]);
  const res = gainExp(m, gain);
  for (const lv of res.levels) {
    beep("levelup");
    await ui.say([monName(m) + "は レベル " + lv + "に あがった！"]);
  }
  for (const name of res.learned) {
    const r = learnMove(m, name);
    if (r === "ok") await ui.say([monName(m) + "は " + name + "を おぼえた！"]);
    else if (r === "full") {
      await ui.say([monName(m) + "は あたらしく " + name + "を おぼえたい！", "でも わざは 4つまで…"]);
      const yes = await ui.ask([name + "の かわりに どれを わすれる？"], "えらぶ", "やめる");
      if (yes) {
        const i = await ui.choice(m.moves.map((x) => x.name), { x: 8, y: 160, w: 240, rows: 4 });
        if (i >= 0) {
          const old = m.moves[i].name;
          m.moves[i] = { name: name, pp: moveData(name).pp, max: moveData(name).pp };
          await ui.say([old + "を わすれて…", name + "を おぼえた！"]);
        }
      }
    }
  }
  if (res.evolve) B.pendingEvo = { mon: m, to: res.evolve };

  // つぎの あいて
  if (B.isTrainer && B.foeIndex + 1 < B.foeParty.length) {
    B.foeIndex++;
    await ui.say([B.trainer.name + "は " + B.foeParty[B.foeIndex].sp + "を くりだした！"]);
    B.foe = fresh(B.foeParty[B.foeIndex], false);
    B.foe.showHp = B.foe.mon.hp;
    seeMon(B.foe.mon.sp);
    return "";
  }
  return "win";
}

async function onYouDown() {
  beep("faint");
  B.you.hidden = true;
  await wait(400);
  await ui.say([monName(B.you.mon) + "は たおれた！"]);
  const alive = State.save.party.filter((m) => !fainted(m));
  if (!alive.length) {
    await ui.say(["めのまえが まっくらに なった…"]);
    return "lose";
  }
  const i = await choosePartyMemberForce();
  B.you = fresh(State.save.party[i], true);
  B.you.showHp = B.you.mon.hp;
  await ui.say(["ゆけっ！ " + monName(B.you.mon) + "！"]);
  return "";
}

async function choosePartyMemberForce() {
  const p = State.save.party;
  for (;;) {
    const labels = p.map((m) => monName(m) + " Lv" + m.lv + " " + m.hp + "/" + maxHp(m));
    const i = await ui.choice(labels, { x: 8, y: 118, w: 300, rows: 6, cancel: false });
    if (i >= 0 && !fainted(p[i])) return i;
    await ui.say(["その ガオンは たたかえない！"]);
  }
}

let lastEvo = null;
// たたかいの あとで しんかを とりだす
export function popEvolution() { const e = lastEvo; lastEvo = null; return e; }

/* ============================================================
   えがく
============================================================ */
function drawBattle() {
  G.use("sky");
  G.clear(0);
  if (!B) return;

  // そら と じめん
  G.use("sky");
  G.rect(0, 0, G.W, 90, 0);
  G.rect(0, 78, G.W, 12, 1);
  G.use("battleBg");
  G.rect(0, 90, G.W, 106, 1);
  G.rect(0, 90, G.W, 3, 2);
  // たっている ところ
  ellipse(248, 132, 58, 13, 2);
  ellipse(248, 129, 58, 13, 0);
  ellipse(72, 188, 70, 15, 2);
  ellipse(72, 185, 70, 15, 0);

  const foeArt = MONART[B.foe.mon.sp];
  const youArt = B.you ? MONART[B.you.mon.sp] : null;
  const foeSet = palOf(species(B.foe.mon.sp));
  const foeAcc = accentOf(species(B.foe.mon.sp));
  const youSet = B.you ? palOf(species(B.you.mon.sp)) : "ノーマル";
  const youAcc = B.you ? accentOf(species(B.you.mon.sp)) : "ほのお";

  if (!B.foe.hidden && foeArt) {
    const img = G.makeMonArt(foeArt, 2, "m" + B.foe.mon.sp, foeSet, foeAcc, MONPAL[B.foe.mon.sp]);
    G.draw(img, 184 + (B.foe.shakeX | 0), 4);
    if (B.foe.flash > 0 && Math.floor(B.foe.flash / 40) % 2 === 0) {
      G.use("ui");
      G.ctx.globalAlpha = 0.5; G.rect(184, 4, 128, 128, 0); G.ctx.globalAlpha = 1;
    }
  }
  if (B.you && !B.you.hidden && youArt) {
    const img = G.makeMonArt(youArt, 2, "m" + B.you.mon.sp, youSet, youAcc, MONPAL[B.you.mon.sp]);
    G.draw(img, 8 + (B.you.shakeX | 0), 60);
    if (B.you.flash > 0 && Math.floor(B.you.flash / 40) % 2 === 0) {
      G.use("ui");
      G.ctx.globalAlpha = 0.5; G.rect(8, 60, 128, 128, 0); G.ctx.globalAlpha = 1;
    }
  }

  // 下の わく（メニューが うかんで 見えないように）
  G.use("ui");
  G.window9(BOX.x, BOX.y, BOX.w, BOX.h);
  // メッセージが 出ていない ときは、いま だしている ガオンを のせる
  if (!isSaying() && B.you) {
    const m = B.you.mon;
    G.textFit(monName(m), BOX.x + 18, BOX.y + 18, 130, 3, 16);
    G.text("Lv" + m.lv, BOX.x + 18, BOX.y + 46, 3, 14);
    G.text(Math.round(B.you.showHp == null ? m.hp : B.you.showHp) + "/" + maxHp(m), BOX.x + 66, BOX.y + 46, 3, 14);
  }

  // じょうほうの わくは、メニューと かさなるときは かくす
  const top = topRect();
  const foeR = { x: 8, y: 12, w: 148, h: 60 };
  const youR = { x: 164, y: 132, w: 148, h: 60 };
  if (!overlaps(top, foeR)) infoBox(foeR.x, foeR.y, B.foe, false);
  if (B.you && !overlaps(top, youR)) infoBox(youR.x, youR.y, B.you, true);
}

function ellipse(cx, cy, rx, ry, c) {
  G.ctx.fillStyle = G.PAL[c];
  G.ctx.beginPath();
  G.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  G.ctx.fill();
}

function infoBox(x, y, side, mine) {
  const m = side.mon;
  const w = 148, h = 60;
  G.use("ui");
  G.window9(x, y, w, h);

  // なまえは Lv の ぶんを のこして つめる
  const lv = "Lv" + m.lv;
  const lvW = G.textW(lv, 14);
  G.textFit(monName(m), x + 10, y + 8, w - 24 - lvW, 3, 16);
  G.textRight(lv, x + w - 10, y + 10, 3, 14);

  const bx = x + 10, by = y + 32, bw = w - 20, bh = 8;
  const shown = side.showHp == null ? m.hp : side.showHp;
  const ratio = Math.max(0, Math.min(1, shown / maxHp(m)));
  G.rect(bx - 2, by - 2, bw + 4, bh + 4, 3);
  G.rect(bx, by, bw, bh, 1);
  // のこりで 色が かわる（みどり → きいろ → あか）
  G.use(ratio > 0.5 ? "くさ" : ratio > 0.2 ? "でんき" : "ほのお");
  G.rect(bx, by, Math.round(bw * ratio), bh, 1);
  G.use("ui");

  // いちばん下の 行：じぶんは のこりHP、じょうたいは 左に
  if (m.status) G.text(m.status, x + 10, y + 43, 3, 13);
  if (mine) G.textRight(Math.round(shown) + "/" + maxHp(m), x + w - 10, y + 43, 3, 13);
}
