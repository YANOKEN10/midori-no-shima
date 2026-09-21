import {canonicalTrainingItem125} from './training122.mjs';
import {showSummary124,showGrowth124} from './summary124.js';
import {drawMoveCell123} from './windowArt123.js';
import {EV_ITEMS122,STAT_LABELS122,reduceEffort122,effortText122} from './training122.mjs';
import {mapHeroFrame119} from './peopleArt119.js';
import {HAIRSTYLES119,OUTFITS119} from './peopleCatalog119.mjs';
import {salePrice,sellableItems,sellItem} from './itemSelling.js';
import {teachMove92} from './moveLearning92.mjs';
import {businessMenu79} from './economy79.js';
import {MAPS as businessMaps79} from './data/maps.js';
import {drawTypeIcon77} from './typeIcons77.js';
import {habitatEntries,habitatRateLabel} from './habitats.js';
import {APPEARANCE_COLORS,FASHION_TOWNS,FASHION_ITEMS,fashionStock,itemLook,equipFashion} from './data/fashion.js';
import {openFriends} from './friends.js';
let menuWorld=null;
export function setMenuWorld(w){menuWorld=w;}
import {releaseMon} from './marineRules.js';
import { heroFrame } from "./revampArt.js?v=20260913-fashion-v50";
import { battleArt } from './data/battleart.js';
import { chapterObjective } from "./chapterStory.js";
// ============================================================
//  メニュー（START ボタン）
// ============================================================
import * as G from "./gfx.js";
import { ui } from "./ui.js";
import { beep, setMuted, isMuted, playBgm } from "./audio.js";
import { MONART, MONPAL } from "./data/monart.js";
import { SPECIES, DEX_ORDER, STAT_KEYS, STAT_LABELS } from "./data/species.js";
import { move as moveData } from "./data/moves.js";
import { item as itemData, SHOP_LIST } from "./data/items.js";
import {
  G as State, species, palOf, accentOf, maxHp, statOf, normalizeMonStats, evTotal, monName, fainted, healFull,
  followingMon, chooseFollower, stopFollowing, bagList, useItem, addItem, dexCount, hasItem, lagNetMultiplier,
} from "./state.js";
import { saveLocal, saveCloud, loadCloud, applySave, describeSave, compatible } from "./save.js";
import { cloud } from "./cloud.js";
import { showAuth, showForm } from "./gate.js";
import { personFramesRaw } from "./data/charart.js";
import { playerColors, SHIRT_BASIC, PANTS_BASIC, SHIRT_FANCY, PANTS_FANCY, HAIR_COLORS , HAIR_STYLES, BANGS_STYLES, SKIRT_BASIC, SKIRT_FANCY, HAT_STYLES } from "./data/looks.js";
import { compassEnabled, compassSummary, nextObjective, setCompassEnabled } from "./compass.js";

/* ============ メインメニュー ============ */
export async function openMenu() {
  for (;;) {
    const items = ["ガオン", "つれあるき", "どうぐ", "ずかん", State.save.name, "レポート", "せってい", "友だちと遊ぶ", "きがえる", "とじる"];
    const i = await ui.choice(items, { x: 156, y: 8, w: 156, rows: 9 });
    if (i < 0 || i === 9) return;
    if (i === 0) {const section=await ui.choice(["てもち","ボックス","もどる"],{x:8,y:8,w:304,rows:3});if(section===0)await partyMenu();if(section===1)await boxMenu();}
    else if (i === 1) await followerMenu();
    else if (i === 2) await bagMenu();
    else if (i === 3) { if (hasItem("ガオンずかん")) await dexMenu(); else await ui.say(["ガオンずかんは まだ持っていない。"]); }
    else if (i === 4) await trainerCard();
    else if (i === 5) await reportMenu();
    else if (i === 6) await settingsMenu();
    else if (i === 7) await openFriends();
    else if (i === 8) await wardrobeMenu();
  }
}

export async function followerMenu(selected) {
 const choice=await ui.choice(["えらぶ","やめる","もどる"],{x:156,y:136,w:156});
 if(choice===0){let mon=selected;if(!mon){if(!State.save.party.length){await ui.say(["ガオンを もっていない。"]);return;}const i=await ui.choice(State.save.party.map(m=>monName(m)+" Lv"+m.lv),{x:8,y:8,w:304,rows:6});if(i<0)return;mon=State.save.party[i];}if(chooseFollower(mon)){saveLocal();beep("ok");await ui.say([monName(mon)+"と いっしょに あるこう！"]);}}
 else if(choice===1){stopFollowing();saveLocal();await ui.say(["つれあるきを やめた。"]);}
}

/* ============ てもち ============ */
function partyLabels() {
  return State.save.party.map((m) => {
    const hp = m.hp + "/" + maxHp(m);
    return monName(m) + " Lv" + m.lv + " " + hp + (m.status ? " " + m.status : "");
  });
}

export async function partyMenu(forItem) {
  for (;;) {
    const p = State.save.party;
    if (!p.length) { await ui.say(["ガオンを もっていない。"]); return -1; }
    const i = await ui.choice(partyLabels(), { x: 8, y: 8, w: 304, rows: 6 });
    if (i < 0) return -1;
    if (forItem) return i;

    const what = await ui.choice(["つよさを みる", "いれかえる", "なまえを つける", "つれあるき", "ガオンをにがす", "もちもの", "もどる"], { x: 148, y: 112, w: 164 });
    if(what===5){const mon=p[i];await ui.say(["持ち物："+(mon.heldItem||"なし")]);if(mon.heldItem&&await ui.ask(["持ち物を はずしますか？"])){addItem(mon.heldItem);delete mon.heldItem;saveLocal();}}
    else if (what === 0) await showStatus(p[i]);
    else if (what === 1) {
      const j = await ui.choice(partyLabels(), { x: 8, y: 8, w: 304, rows: 6 });
      if (j >= 0 && j !== i) { const t = p[i]; p[i] = p[j]; p[j] = t; beep("ok"); }
    } else if(what===4){await releaseChosen("party",i);
    } else if (what === 3) { await followerMenu(p[i]);
    } else if (what === 2) {
      const r = await showForm({
        title: "なまえを つける",
        sub: monName(p[i]) + " の あたらしい なまえ",
        fields: [{ el: "who", key: "nick", label: "なまえ（からっぽで もとに もどす）", type: "text", value: p[i].nick || "" }],
        submit: "けってい",
      });
      if (r) {
        p[i].nick = String(r.nick || "").trim().slice(0, 8);
        await ui.say([monName(p[i]) + "に なった！"]);
      }
    }
  }
}

export async function showStatus(m){return showSummary124(m,{onChange:()=>{State.dirty=true;saveLocal();}});}

/* ============ どうぐ ============ */
export async function bagMenu() {
  let category=0,start=0;
  for (;;) {
    const it=await ui.itemList(bagList("normal").concat(bagList("key")),{pockets:true,category,start});
    if(!it)return;category=it.category;start=it.index;
    const d = itemData(it.name);
    const desc = it.name === "ラグネット"
      ? [d.desc, "エンブレム " + State.save.badges.length + "こ／捕獲力 " + lagNetMultiplier().toFixed(2) + "倍"]
      : [d.desc];
    await ui.say(desc);
    if (it.name === "リーフ・コンパス") {
      await leafCompassMenu();
      continue;
    }
    if (d.kind === "held") {const i=await partyMenu(true);if(i>=0){const mon=State.save.party[i];if(await ui.ask([monName(mon)+"に "+it.name+"を持たせますか？"])){if(mon.heldItem)addItem(mon.heldItem);useItem(it.name);mon.heldItem=it.name;saveLocal();await ui.say(["持ち物を変更した！"]);}}continue;}
    if(it.name==="小型ボート"){if(await ui.ask(["小型ボートを使いますか？"]))await useOutside(it.name);return;}
    if (d.kind === "key") continue;

    const what = await ui.choice(["つかう", "すてる", "もどる"], { x: 176, y: 150, w: 136 });
    if (what === 0) await useOutside(it.name);
    else if (what === 1) {
      const yes = await ui.ask([it.name + "を すてますか？"]);
      if (yes) { useItem(it.name); await ui.say([it.name + "を すてた。"]); }
    }
  }
}

async function leafCompassMenu() {
  const objective = nextObjective();
  await ui.say(compassSummary());
  if (!objective || objective.done) {
    setCompassEnabled(false);
    saveLocal();
    return;
  }
  const on = compassEnabled();
  const i = await ui.choice([on ? "やじるしを OFFにする" : "やじるしを ONにする", "もどる"], {
    x: 88, y: 148, w: 224, rows: 2,
  });
  if (i !== 0) return;
  setCompassEnabled(!on);
  beep("ok");
  saveLocal();
  await ui.say([!on ? "コンパスの やじるしを 表示した。" : "コンパスの やじるしを 消した。"]);
}

async function useOutside(name) {
  if(name==='小型ボート'){const {useBoat}=await import('./endgameStory.js');if(menuWorld)await useBoat(menuWorld);return;}
  if(name==='レベルの実'){const i=await partyMenu(true);if(i<0)return;const m=State.save.party[i];if(m.lv>=100){await ui.say(['すでに レベル100です。']);return;}if(!useItem(name))return;const {gainExp,expForLevel}=await import('./state.js');const result=gainExp(m,expForLevel(m.lv+1)-m.exp);await showGrowth124(m,result.growth);for(const name of result.learned)await teachMove92(m,name,ui,()=>{State.dirty=true;saveLocal();});if(result.evolve&&await ui.ask([result.evolve+'へ 進化しますか？'])){m.sp=result.evolve;State.save.dexSeen[m.sp]=true;State.save.dexOwn[m.sp]=true;}healFull(m);saveLocal();await ui.say(['レベルが１ 上がった！']);return;}

  const d = itemData(name);
  if(d.kind==='evReduce'){const i=await partyMenu(true);if(i<0)return;const m=State.save.party[i];normalizeMonStats(m);if(!(m.ev[d.stat]>0)){await ui.say(['その能力の努力値は すでに0です。']);return;}if(!useItem(name))return;const amount=reduceEffort122(m,d.stat);m.hp=Math.min(m.hp,maxHp(m));State.dirty=true;saveLocal();await ui.say([monName(m)+'の '+STAT_LABELS122[d.stat]+'の努力値が '+amount+' 下がった！']);return;}
  if (d.kind === "heal" || d.kind === "cure" || d.kind === "revive") {
    const i = await partyMenu(true);
    if (i < 0) return;
    const m = State.save.party[i];
    if (d.kind === "heal") {
      if (fainted(m)) { await ui.say([monName(m) + "は ひんしだ。"]); return; }
      if (m.hp >= maxHp(m)) { await ui.say(["たいりょくは まんたんだ。"]); return; }
      useItem(name);
      const before = m.hp;
      m.hp = Math.min(maxHp(m), m.hp + d.amount);
      beep("heal");
      await ui.say([monName(m) + "の たいりょくが " + (m.hp - before) + " かいふくした！"]);
    } else if (d.kind === "cure") {
      if (!m.status || (d.cure !== "all" && m.status !== d.cure)) { await ui.say(["こうかが なさそうだ。"]); return; }
      useItem(name); m.status = ""; beep("heal");
      await ui.say([monName(m) + "は げんきに なった！"]);
    } else {
      if (!fainted(m)) { await ui.say(["その ガオンは げんきだ。"]); return; }
      useItem(name);
      m.hp = Math.max(1, Math.floor(maxHp(m) * d.ratio));
      m.status = "";
      beep("heal");
      await ui.say([monName(m) + "は げんきを とりもどした！"]);
    }
    return;
  }
  await ui.say(["いまは つかえない。"]);
}

/* ============ ずかん ============ */
export async function dexMenu() {
  const c = dexCount();
  for (;;) {
    const labels = DEX_ORDER.map((n) => {
      const seen = State.save.dexSeen[n];
      const own = State.save.dexOwn[n];
      const no = String(SPECIES[n].no).padStart(3, "0");
      return no + " " + (seen ? (own ? "● " : "・ ") + n : "－－－－－");
    });
    labels.push("とじる（みた " + c.seen + " / つかまえた " + c.own + "）");
    const i = await ui.choice(labels, { x: 8, y: 8, w: 304, rows: 7 });
    if (i < 0 || i >= DEX_ORDER.length) return;
    const n = DEX_ORDER[i];
    if (!State.save.dexSeen[n]) { await ui.say(["まだ みたことが ない。"]); continue; }
    await dexEntry(n);
  }
}

export async function dexEntry(n) {
  if(n==="ラテット"&&!State.save.dexOwn[n]){await ui.say(["ラテット", "データ：？？？"]);return;}
  const sp = SPECIES[n];
  const places=habitatEntries(n);
  const habitatPages=Math.max(1,Math.ceil(places.length/3));
  let page=0;const pages=2+habitatPages+Math.ceil(sp.learn.length/7);
  await ui.custom(() => {
    G.use("uiDark");
    G.clear(1);
    G.use("ui");
    if(page===pages-1){G.window9(4,4,312,276);G.textFit(n+' の 種族値',18,16,284,3,16);Object.entries(STAT_LABELS122).forEach(([key,label],i)=>{G.text(label,18,46+i*24,3,14);G.textRight(String(sp.base[key]),290,46+i*24,3,14);});G.text('倒すともらえる努力値',18,205,3,13);G.textFit(effortText122(sp),18,226,284,3,12);G.text('← → ページ　A・B もどる',18,262,3,11);return;}
    if(page>0&&page<=habitatPages){G.window9(4,4,312,276);G.textFit(n+' の 生息地',18,16,284,3,16);
      if(!places.length)G.text('野生の出現場所なし',18,48,3,14);
      places.slice((page-1)*3,page*3).forEach((entry,i)=>{G.textFit(entry.mapName,18,48+i*56,284,3,14);G.textFit(habitatRateLabel(entry),18,70+i*56,284,3,12);});
      G.text('通常・水上：遭遇したときの割合',18,226,3,11);
      G.text('1歩ごとの確率ではありません',18,242,3,11);
      G.text('← → ページ '+page+'/'+(pages-1)+'　A・B もどる',18,262,3,10);return;}
    if(page>0){G.window9(4,4,312,276);G.textFit(n+" の おぼえるわざ",18,16,284,3,16);
     sp.learn.slice((page-habitatPages-1)*7,(page-habitatPages)*7).forEach(([lv,name],i)=>{const y=48+i*28;G.text("Lv"+lv,18,y,3,13);G.textFit(name,76,y,160,3,14);G.textRight(moveData(name).type,300,y,3,11);});
     G.text("← → ページ "+page+"/"+(pages-1)+"　A・B もどる",18,262,3,10);return;}
    G.window9(4, 4, 312, 160);
    const current=battleArt(n);
    if(current)G.drawScaled(current,4,24,128,128);else G.draw(G.makeMonArt(MONART[n], 2, "d" + n, palOf(sp), accentOf(sp), MONPAL[n]),4,24);
    G.text("No." + String(sp.no).padStart(3, "0"), 140, 26, 3, 14);
    G.textFit(n, 140, 48, 162, 3, 16);
    G.textFit("タイプ/" + sp.types.join("・"), 140, 74, 162, 3, 14);
    G.text(State.save.dexOwn[n] ? "つかまえた" : "みつけた", 140, 96, 3, 14);
    G.window9(4, 170, 312, 110);
    const lines = G.wrap(sp.dex, 276, 16).slice(0, 3);
    lines.forEach((l, i) => G.text(l, 18, 182 + i * 25, 3, 16));
    G.text("← → 生息地・わざ・種族値",18,262,3,11);
  },{onPage:dir=>{page=(page+(dir===-1?-1:1)+pages)%pages;}});
}

/* ============ トレーナーカード ============ */
async function trainerCard() {
  const s = State.save;
  const c = dexCount();
  await ui.custom(() => {
    G.use("uiDark");
    G.clear(1);
    G.use("ui");
    G.window9(8, 8, 304, 264);
    const W = 264;   // わくの 内がわの はば
    G.text("ガオンつかいカード", 24, 24, 3, 16);
    G.textFit("なまえ　" + s.name, 24, 60, W, 3, 16);
    G.textFit("おかね　" + s.money + "円", 24, 88, W, 3, 16);
    G.textFit("ずかん　みた " + c.seen + " / つかまえた " + c.own, 24, 116, W, 3, 16);
    G.textFit("目標：全ガオンを 仲間にする",24,144,W,3,16);
    G.textFit(chapterObjective(),24,180,W,3,14);
    G.textFit(cloud.signedIn ? "☁ " + cloud.who + " で ログイン中" : "この たんまつだけで あそんでいます", 24, 240, W, 3, 13);
  });
}

/* ============ レポート（ほぞん） ============ */
export async function reportMenu() {
  const yes = await ui.ask(["ぼうけんの きろくを つけますか？"]);
  if (!yes) return;
  saveLocal();
  if (!cloud.signedIn) {
    await ui.say(["この たんまつに きろくを つけた！", "ログインすると ほかの きかいでも つづきが できます。"]);
    return;
  }
  await ui.say(["きろくを あずけています…"], { speed: 8 });
  const r = await saveCloud(false);
  if (r.ok) { beep("ok"); await ui.say(["クラウドに きろくを つけた！", "ほかの きかいでも つづきが できます。"]); return; }
  if (r.conflict) {
    await ui.say(["べつの きかいで あたらしい きろくが あります。"]);
    const i = await ui.choice([
      "こちらで うわがきする",
      "むこうの きろくを つかう",
      "なにも しない",
    ], { x: 20, y: 120, w: 280 });
    if (i === 0) { await saveCloud(true); await ui.say(["うわがき しました。"]); }
    else if (i === 1) { applySave(r.remote); saveLocal(); await ui.say(["むこうの きろくを よみこみました。"]); }
    return;
  }
  await ui.say([r.why || "クラウドに つなげませんでした。", "この たんまつには ほぞん できています。"]);
}

/* ============ せってい ============ */
export async function settingsMenu() {
  for (;;) {
    const items = [
      "がめんの いろ",
      isMuted() ? "おと：きれています" : "おと：なっています",
      cloud.signedIn ? "アカウント（" + cloud.who + "）" : "ログイン / とうろく",
      "もどる",
    ];
    const i = await ui.choice(items, { x: 60, y: 60, w: 220 });
    if (i < 0 || i === 3) return;
    if (i === 0) {
      const j = await ui.choice(["カラー（おすすめ）", "ゲームボーイ みどり", "ゲームボーイ グレー"], { x: 30, y: 100, w: 260 });
      if (j >= 0) {
        const name = ["color", "green", "gray"][j];
        G.setPalette(name);
        State.save.palette = name;
        saveLocal();
      }
    } else if (i === 1) {
      setMuted(!isMuted());
    } else if (i === 2) {
      await accountMenu();
    }
  }
}

export async function accountMenu() {
  if (!cloud.signedIn) {
    const r = await showAuth();
    if (r && (r.kind === "login" || r.kind === "signup")) {
      return await afterLogin();
    }
    return;
  }
  for (;;) {
    const u = cloud.user || {};
    const items = [
      "ログインちゅう：" + cloud.who,
      u.hasMail ? "メール：" + u.mail + "（かえる）" : "メールアドレスを とうろく",
      "あいことばを かえる",
      "クラウドに きろくを あずける",
      "クラウドから きろくを とりだす",
      "ログアウト",
      "もどる",
    ];
    const i = await ui.choice(items, { x: 20, y: 40, w: 280, rows: 7 });
    if (i < 0 || i === 6) return;

    if (i === 1) {
      const r = await showForm({
        title: "メールアドレスの とうろく",
        sub: "いれておくと、なまえを わすれても<br>メールアドレスで ログインできます。",
        fields: [
          { el: "mail", key: "mail", label: "メールアドレス", type: "email", value: "" },
          { el: "pw", key: "pw", label: "いまの あいことば", type: "password", value: "" },
        ],
        submit: "とうろくする",
      });
      if (!r) continue;
      const res = await cloud.account("setmail", r.pw, { mail: r.mail });
      if (res.ok) { cloud.user = res.data.user; await ui.say(["メールアドレスを とうろく しました。"]); }
      else await ui.say([res.why]);
    } else if (i === 2) {
      const r = await showForm({
        title: "あいことばの へんこう",
        sub: "",
        fields: [
          { el: "pw", key: "pw", label: "いまの あいことば", type: "password", value: "" },
          { el: "mail", key: "np", label: "あたらしい あいことば（4もじ いじょう）", type: "password", value: "" },
        ],
        submit: "かえる",
      });
      if (!r) continue;
      const res = await cloud.account("setpw", r.pw, { newPw: r.np });
      if (res.ok) {
        if (res.data.token) cloud.setToken(res.data.token, cloud.who);
        await ui.say(["あいことばを かえました。"]);
      } else await ui.say([res.why]);
    } else if (i === 3) {
      await reportMenu();
    } else if (i === 4) {
      const data = await loadCloud();
      if (!data || !compatible(data)) { await ui.say(["クラウドに きろくが ありません。"]); continue; }
      const yes = await ui.ask(["クラウドの きろく：", describeSave(data), "これを よみこみますか？"]);
      if (yes) { applySave(data); saveLocal(); await ui.say(["よみこみました。"]); return "reload"; }
    } else if (i === 5) {
      const yes = await ui.ask(["ログアウトしますか？", "この たんまつの きろくは のこります。"]);
      if (yes) { cloud.logout(); await ui.say(["ログアウトしました。"]); return; }
    }
  }
}

function hasProgress(d) {
  if (!d) return false;
  return (d.party && d.party.length > 0) || (d.badges && d.badges.length > 0);
}

async function afterLogin() {
  await ui.say(["ようこそ、" + cloud.who + " さん！", "これで どの きかいでも", "おなじ つづきが あそべます。"]);
  const data = await loadCloud();
  if (compatible(data) && hasProgress(data)) {
    const yes = await ui.ask(["クラウドに きろくが あります。", describeSave(data), "よみこみますか？"]);
    if (yes) { applySave(data); saveLocal(); return "reload"; }
    return;
  }
  if (hasProgress(State.save)) {
    const yes = await ui.ask(["いまの ぼうけんを クラウドに あずけますか？"]);
    if (yes) { await saveCloud(true); await ui.say(["あずけました。"]); }
  }
}

/* ============ ショップ ============ */
export async function shopMenu(stock82=SHOP_LIST) {
  stock82=[...new Set([...stock82.map(canonicalTrainingItem125),...EV_ITEMS122.map(i=>i.name)])];
  for (;;) {
    const i = await ui.choice(["かう", "うる", "土地・お店", "やめる"], { x: 176, y: 150, w: 136 });
    if (i < 0 || i === 3) { await ui.say(["また どうぞ！"]); return; }
    if (i === 0) await buyMenu(stock82);
    else if(i===1)await sellMenu();else await businessMenu79(menuWorld,businessMaps79);
  }
}

async function buyMenu(stock82=SHOP_LIST) {
  for (;;) {
    const chosen=await ui.itemList(stock82.map(name=>({name,n:(State.save.bag[name]||0)})),{mode:'buy',money:State.save.money});
    if(!chosen)return;
    const name=chosen.name,price=itemData(name).price;
    if(name==='採掘セット'&&State.save.bag[name]>0){await ui.say(['採掘セットは すでに持っています。']);continue;}
    const max=Math.floor(State.save.money/price);
    if(max<1){await ui.say(['おかねが たりません。']);continue;}
    const quantities=(name==='採掘セット'?[1]:[1,2,3,5,10]).filter(n=>n<=max);
    const ci=await ui.choice(quantities.map(n=>n+'こ  '+(n*price)+'円').concat('やめる'),{x:116,y:70,w:196,rows:6});
    if(ci<0||ci===quantities.length)continue;
    const n=quantities[ci];
    const total = price * n;
    if (State.save.money < total) { await ui.say(["おかねが たりません。"]); continue; }
    const yes = await ui.ask([name + " ×" + n, "ぜんぶで " + total + "円 です。", "よろしいですか？"]);
    if (!yes) continue;
    State.save.money -= total;
    addItem(name, n);
    saveLocal();
    beep("buy");
    await ui.say(["ありがとう ございました！"]);
  }
}

export async function sellMenu() {
  await ui.say(['素材や どうぐを 買い取ります。','たいせつなもの・買取できない品は','売る一覧には 表示されません。']);
  for (;;) {
    const list = sellableItems(State.save);
    if (!list.length) { await ui.say(['うれる 素材やどうぐが ありません。']); return; }
    const chosen=await ui.itemList(list,{mode:'sell',money:State.save.money});
    if(!chosen)return;
    const name=chosen.name,price=salePrice(name),owned=State.save.bag[name]||0;
    if(!price||owned<1)continue;
    const quantities=[...new Set([1,5,10,owned])].filter(n=>n<=owned).sort((a,b)=>a-b);
    const ci=await ui.choice(quantities.map(n=>(n===owned&&n>1?'全部 '+n:n)+'こ  '+(n*price)+'円').concat('やめる'),{x:116,y:70,w:196,rows:6});
    if(ci<0||ci===quantities.length)continue;
    const n=quantities[ci],total=price*n;
    if(!await ui.ask([name+' ×'+n,'合計 '+total+'円で 売りますか？']))continue;
    if(!sellItem(State.save,name,n)){await ui.say(['この品は 売却できませんでした。']);continue;}
    saveLocal();
    beep('buy');
    await ui.say([name+'を '+n+'こ 売りました。',total+'円を 受け取りました！']);
  }
}

export { hasProgress };

/* ============ ふくや と びよういん ============ */
// いま えらんでいる みためで レオを 見せる
function drawLookPreview(look, x, y) {
  G.use("ui");
  G.window9(x, y, 84, 108);
  const current = mapHeroFrame119("down",1,look)||heroFrame("down", 1, look);
  if (current) { G.ctx.imageSmoothingEnabled=false; G.ctx.drawImage(current,x+10,y+6,64,96); return; }
  const st = { hair: look.hat || look.style || "short", bangs: look.bangs == null ? "seven" : look.bangs,
               skirt: Boolean(look.skirt), face: look.gender || (look.skirt ? "girl" : "boy") };
  const f = personFramesRaw(st).down[0];
  G.draw(G.makeColorArt(f, 2, "look" + st.hair + st.bangs + (st.skirt ? "s" : ""), playerColors(look)), x + 10, y + 14);
}

export async function clothesShop(town) {
  const id=FASHION_TOWNS[town]?town:FASHION_TOWNS[State.save.backTo?.map]?State.save.backTo.map:'village';
  const stock=fashionStock(id),categories=[['hat','ぼうし'],['shirt','うわぎ'],['pants','ズボン'],['shoes','くつ']];
  for(;;){
    const i=await ui.choice([...categories.map(c=>c[1]+'を えらぶ'),'買った服に きがえる','色をかえる（無料）','やめる'],{x:8,y:8,w:304,rows:7});
    if(i<0||i===6)return;if(i===5){await freeColors81();continue;}if(i===4){await wardrobeMenu();continue;}
    const list=stock.filter(item=>item.slot===categories[i][0]);
    const j=await ui.choice(list.map(item=>item.name),{x:8,y:8,w:216,maxWidth:216,rows:5,rightLabels:list.map(item=>(State.save.wardrobe||[]).includes(item.id)?'購入済み':item.price+'円'),extra:(b,idx)=>{if(list[idx]){drawLookPreview(itemLook(State.save.look,list[idx]),228,8);G.window9(8,194,304,54);G.textFit(list[idx].name,20,204,280,3,12);G.textFit('所持金 '+State.save.money+'円',20,225,280,3,12);}}});
    if(j<0)continue;const item=list[j],owned=(State.save.wardrobe||[]).includes(item.id);
    if(!owned&&State.save.money<item.price){await ui.say(['おかねが たりません…']);continue;}
    if(!await ui.ask([item.name,owned?'この服に きがえますか？':item.price+'円で 買ってきがえますか？']))continue;
    const result=equipFashion(State.save,item.id,{buy:true});
    if(result.ok){saveLocal();beep('buy');await ui.say([item.name+'に きがえた！']);}
  }
}
export async function wardrobeMenu(){
 for(;;){
  const items=FASHION_ITEMS.filter(item=>(State.save.wardrobe||[]).includes(item.id));
  const labels=[...items.map(item=>item.name),'ぼうしを ぬぐ','はじめの ふくに もどす','新しい服・髪型をえらぶ','もどる'];
  const i=await ui.choice(labels,{x:8,y:8,w:216,maxWidth:216,rows:6,extra:(b,idx)=>drawLookPreview(items[idx]?itemLook(State.save.look,items[idx]):State.save.look,228,8)});
  if(i<0||i===items.length+3)return;if(i===items.length+2){await customAppearance119();continue;}
  if(i<items.length)equipFashion(State.save,items[i].id);
  else if(i===items.length){State.save.look.hat='';if(State.save.equippedClothes)delete State.save.equippedClothes.hat;}
  else{const original=State.save.startingLook||{shirt:'#2f6fd0',pants:'#231a14'};for(const key of ['outfit119','shirt','pants','shoes','hat','hatColor','hatStyle','hatAccent','shirtStyle','shirtAccent','pantsStyle','pantsAccent','shoesStyle','shoesAccent','skirt']){delete State.save.look[key];if(original[key]!=null)State.save.look[key]=original[key];}State.save.equippedClothes={};}
  saveLocal();beep('ok');await ui.say(['きがえました！']);
 }
}

export async function hairSalon() {const kind119=await ui.choice(['かみがたを かえる','かみの色を かえる','もどる'],{x:8,y:8,w:216,rows:3});if(kind119<0||kind119===2)return;if(kind119===0){await customAppearance119('hairMap119');return;}
  if(State.save.look.gender!=="girl"){await boyHairSalon();return;}
  const price = 0;
  for (;;) {
    const which = await ui.choice(["かみの 色を かえる", "やめる"],
      { x: 144, y: 168, w: 168, rows: 2 });
    if (which !== 0) { await ui.say(["また どうぞ！"]); return; }
    const labels = HAIR_COLORS.map((x) => x.name + "  " + price + "円");
    labels.push("やめる");
    const j = await ui.choice(labels, {
      x: 8, y: 8, w: 216, maxWidth:216, rows: 6,
      extra: (b, idx) => {
        const look = Object.assign({}, State.save.look);
        if (HAIR_COLORS[idx]) look.hair = HAIR_COLORS[idx].color;
        drawLookPreview(look, 228, 8);
      },
    });
    if (j < 0 || j >= HAIR_COLORS.length) continue;
    if (State.save.money < price) { await ui.say(["おかねが たりません…"]); continue; }
    const yes = await ui.ask([HAIR_COLORS[j].name + "　" + price + "円", "これに しますか？"]);
    if (!yes) continue;
    State.save.money -= price;
    State.save.look = Object.assign({}, State.save.look, { hair: HAIR_COLORS[j].color });
    beep("buy");
    await ui.say(["できあがり！ " + HAIR_COLORS[j].name + "に なった。"]);
    saveLocal();
  }
}

/* --- まえがみを えらぶ --- */
async function bangsMenu(price) {
  for (;;) {
    const labels = BANGS_STYLES.map((x) => x.name + "  " + price + "円");
    labels.push("やめる");
    const j = await ui.choice(labels, {
      x: 8, y: 8, w: 216, rows: 6,
      extra: (b, idx) => {
        const look = Object.assign({}, State.save.look);
        if (BANGS_STYLES[idx]) look.bangs = BANGS_STYLES[idx].style;
        drawLookPreview(look, 228, 8);
      },
    });
    if (j < 0 || j >= BANGS_STYLES.length) return;
    if (State.save.money < price) { await ui.say(["おかねが たりません…"]); continue; }
    const yes = await ui.ask([BANGS_STYLES[j].name + "　" + price + "円", "これに しますか？"]);
    if (!yes) continue;
    State.save.money -= price;
    State.save.look = Object.assign({}, State.save.look, { bangs: BANGS_STYLES[j].style });
    beep("buy");
    await ui.say(["できあがり！ " + BANGS_STYLES[j].name + "に なった。"]);
    saveLocal();
  }
}

/* --- かみがたを えらぶ --- */
async function hairStyleMenu(price) {
  for (;;) {
    const labels = HAIR_STYLES.map((x) => x.name + "  " + price + "円");
    labels.push("やめる");
    const j = await ui.choice(labels, {
      x: 8, y: 8, w: 216, rows: 6,
      extra: (b, idx) => {
        const look = Object.assign({}, State.save.look);
        if (HAIR_STYLES[idx]) look.style = HAIR_STYLES[idx].style;
        drawLookPreview(look, 228, 8);
      },
    });
    if (j < 0 || j >= HAIR_STYLES.length) return;
    if (State.save.money < price) { await ui.say(["おかねが たりません…"]); continue; }
    const yes = await ui.ask([HAIR_STYLES[j].name + "　" + price + "円", "これに しますか？"]);
    if (!yes) continue;
    State.save.money -= price;
    State.save.look = Object.assign({}, State.save.look, { style: HAIR_STYLES[j].style });
    beep("buy");
    await ui.say(["できあがり！ " + HAIR_STYLES[j].name + "に なった。"]);
    saveLocal();
  }
}

async function releaseChosen(collection,index){
 const m=State.save[collection][index];if(!m)return;
 if(!await ui.ask([monName(m)+'を にがしますか？','このガオンは 手元から いなくなります。']))return;
 releaseMon(State.save,collection,index);saveLocal();if(cloud.signedIn)await saveCloud(true);await ui.say([monName(m)+'を にがした。']);
}
export async function boxMenu(){
 for(;;){const list=State.save.box;if(!list.length){await ui.say(['ボックスは 空です。']);return;}const i=await ui.choice(list.map(m=>monName(m)+' Lv'+m.lv),{x:8,y:8,w:304,rows:6});if(i<0)return;
 const action=await ui.choice(['つよさをみる','てもちへ','ガオンをにがす','もどる'],{x:8,y:148,w:304,rows:4});
 if(action===0)await showStatus(list[i]);if(action===1){if(State.save.party.length>=6)await ui.say(['てもちが いっぱいです。']);else{State.save.party.push(list.splice(i,1)[0]);saveLocal();}}if(action===2)await releaseChosen('box',i);}
}

async function boyHairSalon(){
 const lengths=[{name:'みじかい',value:'short'},{name:'ふつう',value:'medium'},{name:'ながい',value:'long'}];
 for(;;){const action=await ui.choice(['かみの ながさ','かみの いろ','やめる'],{x:130,y:145,w:182,rows:3});if(action<0||action===2)return;
 const price=action===0?300:0;const choices=action===0?lengths:HAIR_COLORS.map(c=>({name:c.name,value:c.color}));const key=action===0?'hairLength':'hair';
 const picked=await ui.choice([...choices.map(c=>c.name+'　'+price+'円'),'やめる'],{x:8,y:8,w:216,maxWidth:216,rows:6,extra:(b,i)=>{const look={...State.save.look};if(choices[i])look[key]=choices[i].value;drawLookPreview(look,228,8);}});
 if(picked<0||picked>=choices.length)continue;if(State.save.money<price){await ui.say(['おかねが たりません…']);continue;}
 if(!await ui.ask([choices[picked].name+'　'+price+'円','この見た目に しますか？']))continue;
 State.save.look={...State.save.look,appearanceVersion:1,[key]:choices[picked].value};State.save.money-=price;saveLocal();if(cloud.signedIn)await saveCloud(true);beep('buy');await ui.say(['できあがり！ 新しい髪で お出かけしよう。']);
 }
}

export async function freeColors81(){
 const parts=[['shirt','うわぎ'],['pants','ズボン・スカート'],['shoes','くつ'],['hair','かみ'],...(State.save.look.hat?[['hatColor','ぼうし']]:[])];
 for(;;){const i=await ui.choice(parts.map(p=>p[1]+'の色').concat('もどる'),{x:8,y:8,w:216,maxWidth:216,rows:6});if(i<0||i===parts.length)return;const[key,label]=parts[i];
 const j=await ui.choice(APPEARANCE_COLORS.map(c=>c.name).concat('もどる'),{x:8,y:8,w:216,maxWidth:216,rows:6,extra:(b,n)=>drawLookPreview({...State.save.look,...(APPEARANCE_COLORS[n]?{[key]:APPEARANCE_COLORS[n].color}:{})},228,8)});
 if(j<0||j===APPEARANCE_COLORS.length)continue;if(!await ui.ask([label+'を '+APPEARANCE_COLORS[j].name+'に変えますか？','色の変更は 無料です。']))continue;
 State.save.look={...State.save.look,[key]:APPEARANCE_COLORS[j].color};saveLocal();beep('ok');await ui.say(['色を 変更しました！']);}
}

async function customAppearance119(only){for(;;){let field=only;if(!field){const choice=await ui.choice(['ふくをえらぶ','かみがたをえらぶ','もどる'],{x:8,y:8,w:216,rows:3});if(choice<0||choice===2)return;field=choice===0?'outfit119':'hairMap119';}const choices=field==='outfit119'?OUTFITS119:HAIRSTYLES119[State.save.look.gender==='girl'?'girl':'boy'];const i=await ui.choice([...choices.map(p=>p[1]),'もどる'],{x:8,y:8,w:216,maxWidth:216,rows:6,extra:(b,idx)=>drawLookPreview({...State.save.look,...(choices[idx]?{[field]:choices[idx][0]}:{})},228,8)});if(i<0||i===choices.length){if(only)return;continue;}State.save.look[field]=choices[i][0];saveLocal();beep('ok');}}
