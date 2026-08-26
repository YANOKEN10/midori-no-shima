// ============================================================
//  ゲームの なかみ（もちもの・てもち・ずかん・フラグ）
// ============================================================
import { SPECIES, species, palOf } from "./data/species.js";
import { newMove, move } from "./data/moves.js";
import { item, isKey } from "./data/items.js";
import { START } from "./data/maps.js";

export const MAX_PARTY = 6;

export function rnd(n) { return Math.floor(Math.random() * n); }
export function chance(p) { return Math.random() < p; }
export function pick(list) { return list[rnd(list.length)]; }

/* --- モンスター 1たい ---------------------------------------- */
export function expForLevel(lv) { return lv * lv * lv; }

export function makeMon(spName, lv, opt) {
  const sp = species(spName);
  const o = opt || {};
  const iv = o.iv || { hp: rnd(16), atk: rnd(16), def: rnd(16), spd: rnd(16), spc: rnd(16) };
  const m = {
    sp: spName, nick: "", lv: lv, exp: expForLevel(lv), iv: iv,
    moves: [], status: "", hp: 0,
  };
  // レベルまでに おぼえる わざの うち あたらしい 4つ
  const pool = sp.learn.filter((l) => l[0] <= lv).map((l) => l[1]);
  const uniq = [];
  for (const name of pool) if (uniq.indexOf(name) < 0) uniq.push(name);
  for (const name of uniq.slice(-4)) m.moves.push(newMove(name));
  if (!m.moves.length) m.moves.push(newMove("たいあたり"));
  m.hp = maxHp(m);
  return m;
}

export function maxHp(m) {
  const b = species(m.sp).base;
  return Math.floor(((b.hp + m.iv.hp) * 2 * m.lv) / 100) + m.lv + 10;
}
export function statOf(m, key) {
  const b = species(m.sp).base;
  return Math.floor(((b[key] + m.iv[key]) * 2 * m.lv) / 100) + 5;
}
export function monName(m) { return m.nick || m.sp; }
export function fainted(m) { return m.hp <= 0; }
export function healFull(m) {
  m.hp = maxHp(m);
  m.status = "";
  for (const mv of m.moves) mv.pp = mv.max;
}

// レベルアップ（あがった ぶんの わざを かえす）
export function gainExp(m, amount) {
  const res = { levels: [], learned: [], evolve: null };
  m.exp += amount;
  const sp = species(m.sp);
  while (m.lv < 100 && m.exp >= expForLevel(m.lv + 1)) {
    const before = maxHp(m);
    m.lv++;
    m.hp += maxHp(m) - before;
    res.levels.push(m.lv);
    for (const [lv, name] of sp.learn) {
      if (lv === m.lv) res.learned.push(name);
    }
    if (sp.evo && m.lv >= sp.evo.lv && !res.evolve) res.evolve = sp.evo.to;
  }
  return res;
}

export function learnMove(m, name) {
  if (m.moves.some((x) => x.name === name)) return "already";
  if (m.moves.length < 4) { m.moves.push(newMove(name)); return "ok"; }
  return "full";
}

/* --- セーブデータ --------------------------------------------- */
export function newGame(playerName) {
  return {
    ver: 2,
    name: playerName || "レオ",
    rival: "フィロア",
    money: 3000,
    party: [],
    box: [],
    bag: {},
    dexSeen: {},
    dexOwn: {},
    badges: [],
    flags: {},
    steps: 0,
    playTime: 0,
    where: { map: START.map, x: START.x, y: START.y, dir: START.dir },
    lastCenter: null,
    starter: "",
    rivalStarter: "",
  };
}

export const G = { save: newGame(), account: null, dirty: false };

export function loadInto(data) {
  const base = newGame();
  G.save = Object.assign(base, data || {});
  G.save.bag = G.save.bag || {};
  G.save.flags = G.save.flags || {};
  G.save.party = G.save.party || [];
}

/* --- もちもの ------------------------------------------------- */
export function addItem(name, n) {
  const c = n == null ? 1 : n;
  G.save.bag[name] = (G.save.bag[name] || 0) + c;
}
export function useItem(name, n) {
  const c = n == null ? 1 : n;
  if ((G.save.bag[name] || 0) < c) return false;
  G.save.bag[name] -= c;
  if (G.save.bag[name] <= 0) delete G.save.bag[name];
  return true;
}
export function hasItem(name) { return (G.save.bag[name] || 0) > 0; }
export function bagList(filter) {
  const out = [];
  for (const k of Object.keys(G.save.bag)) {
    if (filter === "key" && !isKey(k)) continue;
    if (filter === "normal" && isKey(k)) continue;
    if (filter === "battle") {
      const kind = item(k).kind;
      if (kind !== "ball" && kind !== "heal" && kind !== "cure" && kind !== "revive") continue;
    }
    out.push({ name: k, n: G.save.bag[k] });
  }
  return out;
}

/* --- ずかん --------------------------------------------------- */
export function seeMon(sp) { G.save.dexSeen[sp] = 1; }
export function ownMon(sp) { G.save.dexSeen[sp] = 1; G.save.dexOwn[sp] = 1; }
export function dexCount() {
  return { seen: Object.keys(G.save.dexSeen).length, own: Object.keys(G.save.dexOwn).length };
}

/* --- てもち --------------------------------------------------- */
export function addToParty(m) {
  if (G.save.party.length < MAX_PARTY) { G.save.party.push(m); return "party"; }
  G.save.box.push(m);
  return "box";
}
export function firstAlive() { return G.save.party.find((m) => !fainted(m)); }
export function partyAlive() { return G.save.party.some((m) => !fainted(m)); }
export function healParty() { for (const m of G.save.party) healFull(m); }

/* --- フラグ --------------------------------------------------- */
export function flag(k) { return Boolean(G.save.flags[k]); }
export function setFlag(k, v) { G.save.flags[k] = v == null ? 1 : v; }

export { SPECIES, species, palOf, move, item };
