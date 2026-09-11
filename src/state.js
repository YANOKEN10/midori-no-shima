import {migrateVoyageSave} from './voyageRules.js';
import { createRareSpawns, normalizeRareSpawns } from './rareEncounters.js';
// ============================================================
//  ゲームの なかみ（もちもの・てもち・ずかん・フラグ）
// ============================================================
import { SPECIES, species, palOf, accentOf, STAT_KEYS } from "./data/species.js";
import { newMove, move, canonicalMoveName } from "./data/moves.js";
import { item, isKey } from "./data/items.js";
import { START } from "./data/maps.js";

const SPECIES_ALIASES = {"シャチマル":"シオマント","タツノコ":"ミナモリス","モスゴレム":"コケトロッコ","サボチク":"スナボンネ","ハッパチョ":"リボネム","デンチュウ":"デンデマリ","イシゴロ":"スナコロネ","スズメバチン":"ハナヤリ","ダンゴロン":"クルミグル","ヨルグモ":"ホシミノ","パンダン":"フクモッチ","カバリン":"フワクジ"};
export const MAX_PARTY = 6;
function companionId(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
export function followingMon(){const f=G.save.following;if(f?.enabled===false)return null;return f?.id?G.save.party.find(m=>m.companionId===f.id)||null:G.save.party[0]||null;}
export function chooseFollower(mon){if(!G.save.party.includes(mon))return false;mon.companionId ||= companionId();G.save.following={enabled:true,id:mon.companionId};return true;}
export function stopFollowing(){G.save.following={enabled:false,id:null};}


export function rnd(n) { return Math.floor(Math.random() * n); }
export function chance(p) { return Math.random() < p; }
export function pick(list) { return list[rnd(list.length)]; }

/* --- モンスター 1たい ---------------------------------------- */
export function expForLevel(lv) { return lv * lv * lv; }
export function expProgress(mon) {
  const level=Math.max(1,Math.min(100,Math.floor(mon.lv)||1));
  if(level===100)return {current:0,required:0,ratio:1,max:true};
  const required=expForLevel(level+1)-expForLevel(level);
  const total=Number.isFinite(mon.exp)?mon.exp:expForLevel(level);
  const current=Math.max(0,Math.min(required,Math.floor(total)-expForLevel(level)));
  return {current,required,ratio:current/required,max:false};
}


export function makeMon(spName, lv, opt) {
  spName=SPECIES_ALIASES[spName]||spName;
  const sp = species(spName);
  const o = opt || {};
  const iv = Object.fromEntries(STAT_KEYS.map(k=>[k,clampStat(o.iv?.[k] ?? rnd(32),31)]));
  const m = {
    companionId: companionId(), sp: spName, nick: "", lv: lv, exp: expForLevel(lv), iv, ev: normalizeEV(o.ev), statVersion: 2,
    moves: [], status: "", hp: 0,
  };
  // レベルまでに おぼえる わざの うち あたらしい 4つ
  const pool = sp.learn.filter((l) => l[0] <= lv).map((l) => l[1]);
  const uniq = [];
  for (const name of pool) if (uniq.indexOf(name) < 0) uniq.push(name);
  for (const name of uniq.slice(-4)) m.moves.push(newMove(name));
  if (!m.moves.length) m.moves.push(newMove("タックル"));
  m.hp = maxHp(m);
  return m;
}

export const IV_MAX=31, EV_STAT_MAX=252, EV_TOTAL_MAX=510;
function clampStat(value,max) { return Math.max(0,Math.min(max,Number.isFinite(Number(value))?Math.floor(Number(value)):0)); }
function normalizeEV(input) {
  let left=EV_TOTAL_MAX;
  return Object.fromEntries(STAT_KEYS.map(k=>{const n=Math.min(left,clampStat(input?.[k],EV_STAT_MAX));left-=n;return [k,n];}));
}
export function normalizeMonStats(m) {
  m.companionId ||= companionId();
  const old=m.statVersion!==2, iv=m.iv||{};
  m.iv=Object.fromEntries(STAT_KEYS.map(k=>{
    const value=iv[k] ?? (k==='sdef'?iv.spc:0) ?? 0;
    return [k,old?clampStat(value,15)*2:clampStat(value,IV_MAX)];
  }));
  m.ev=normalizeEV(m.ev);m.statVersion=2;
  return m;
}
function statTerm(m,key) {
  if(m.statVersion!==2||!m.ev||!m.iv)normalizeMonStats(m);
  return Math.floor((2*species(m.sp).base[key]+(m.iv[key]||0)+Math.floor((m.ev[key]||0)/4))*m.lv/100);
}
export function maxHp(m) { return statTerm(m,'hp')+m.lv+10; }
export function statOf(m,key) { return key==='hp'?maxHp(m):statTerm(m,key)+5; }
export function evTotal(m) { return STAT_KEYS.reduce((n,k)=>n+(m.ev?.[k]||0),0); }
export function gainEffort(m,defeatedSpecies) {
  normalizeMonStats(m);
  const gained=Object.fromEntries(STAT_KEYS.map(k=>[k,0]));
  if(fainted(m))return gained;
  const before=maxHp(m),yieldStats=species(defeatedSpecies).evYield;
  let remaining=EV_TOTAL_MAX-evTotal(m);
  for(const key of STAT_KEYS){
    const n=Math.max(0,Math.min(yieldStats[key],EV_STAT_MAX-m.ev[key],remaining));
    m.ev[key]+=n;gained[key]=n;remaining-=n;
  }
  m.hp=Math.min(maxHp(m),m.hp+maxHp(m)-before);
  return gained;
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
  name = canonicalMoveName(name);
  if (m.moves.some((x) => x.name === name)) return "already";
  if (m.moves.length < 4) { m.moves.push(newMove(name)); return "ok"; }
  return "full";
}

/* --- セーブデータ --------------------------------------------- */
export function newGame(playerName) {
  return {
    ver: 3,
    rareSpawns: createRareSpawns(),
    chapterVersion: 5,
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
    voyage: null,
    shipBattles: {},
    daycare: null,
    playTime: 0,
    where: { map: START.map, x: START.x, y: START.y, dir: START.dir },
    lastCenter: null,
    look: { gender: "boy", appearanceVersion: 1, shirt: "#2f6fd0", pants: "#231a14", hair: "#6b4a2b" },
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
  G.save.box = G.save.box || [];
  for(const mon of [...G.save.party,...G.save.box,...(G.save.daycare?.parents||[]),...(G.save.daycare?.child?[G.save.daycare.child]:[])]){mon.sp=SPECIES_ALIASES[mon.sp]||mon.sp;normalizeMonStats(mon);for(const mv of mon.moves||[])mv.name=canonicalMoveName(mv.name);}
  for(const key of ['dexSeen','dexOwn']){
    G.save[key] ||= {};
    for(const [oldName,newName]of Object.entries(SPECIES_ALIASES))if(G.save[key][oldName]){G.save[key][newName]=G.save[key][oldName];delete G.save[key][oldName];}
  }
  for(const key of ['starter','rivalStarter'])G.save[key]=SPECIES_ALIASES[G.save[key]]||G.save[key];
  const names = {"ラグ・ネット":"ラグネット", "スーパーネット":"スーパーラグ", "ハイパーネット":"ハイパーラグ", "ヒールジェル":"ガオンのくすり"};
  for (const [oldName,newName] of Object.entries(names)) if (G.save.bag[oldName]) { G.save.bag[newName]=(G.save.bag[newName]||0)+G.save.bag[oldName]; delete G.save.bag[oldName]; }
  if (data && data.chapterVersion !== 5) { G.save.where={...START}; G.save.backTo={map:"village",x:13,y:12}; G.save.lastCenter=null; }
  G.save.chapterVersion=5;
  migrateVoyageSave(G.save);
  normalizeRareSpawns(G.save);
  G.save.look = G.save.look || { shirt: "#2f4fa8", pants: "#231a14", hair: "#241d1a" };
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

// ラグネットは、土地の声を聞いた証（エンブレム）ごとに15%強くなる。
export function lagNetMultiplier() {
  const badges = Math.max(0, Math.min(7, (G.save.badges || []).length));
  return 1 + badges * 0.15;
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

export { SPECIES, species, palOf, accentOf, move, item };
