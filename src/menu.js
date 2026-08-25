// ============================================================
//  メニュー（START ボタン）
// ============================================================
import * as G from "./gfx.js";
import { ui } from "./ui.js";
import { beep, setMuted, isMuted, playBgm } from "./audio.js";
import { MONART } from "./data/monart.js";
import { SPECIES, DEX_ORDER } from "./data/species.js";
import { move as moveData } from "./data/moves.js";
import { item as itemData, SHOP_LIST } from "./data/items.js";
import {
  G as State, species, maxHp, statOf, monName, fainted, healFull,
  bagList, useItem, addItem, dexCount, hasItem,
} from "./state.js";
import { saveLocal, saveCloud, loadCloud, applySave, describeSave } from "./save.js";
import { cloud } from "./cloud.js";
import { showAuth, showForm } from "./gate.js";

/* ============ メインメニュー ============ */
export async function openMenu() {
  for (;;) {
    const items = ["モンスター", "どうぐ", "ずかん", State.save.name, "レポート", "せってい", "とじる"];
    const i = await ui.choice(items, { x: 176, y: 8, w: 136, rows: 7 });
    if (i < 0 || i === 6) return;
    if (i === 0) await partyMenu();
    else if (i === 1) await bagMenu();
    else if (i === 2) await dexMenu();
    else if (i === 3) await trainerCard();
    else if (i === 4) await reportMenu();
    else if (i === 5) await settingsMenu();
  }
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
    if (!p.length) { await ui.say(["モンスターを もっていない。"]); return -1; }
    const i = await ui.choice(partyLabels(), { x: 8, y: 8, w: 304, rows: 6 });
    if (i < 0) return -1;
    if (forItem) return i;

    const what = await ui.choice(["つよさを みる", "いれかえる", "なまえを つける", "もどる"], { x: 176, y: 150, w: 136 });
    if (what === 0) await showStatus(p[i]);
    else if (what === 1) {
      const j = await ui.choice(partyLabels(), { x: 8, y: 8, w: 304, rows: 6 });
      if (j >= 0 && j !== i) { const t = p[i]; p[i] = p[j]; p[j] = t; beep("ok"); }
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

export async function showStatus(m) {
  const sp = species(m.sp);
  await ui.custom(() => {
    G.use("uiDark");
    G.clear(1);
    G.use("ui");
    G.window9(4, 4, 312, 156);
    const img = G.makeMonArt(MONART[m.sp], 4, "m" + m.sp, sp.types[0]);
    G.draw(img, 16, 26);
    G.text("No." + String(sp.no).padStart(3, "0"), 100, 16, 3, 14);
    const lv = "Lv" + m.lv;
    G.textFit(monName(m), 100, 36, 194 - G.textW(lv, 16), 3, 16);
    G.textRight(lv, 300, 36, 3, 16);
    G.textFit("タイプ/" + sp.types.join("・"), 100, 60, 200, 3, 14);
    G.text("HP " + m.hp + "/" + maxHp(m), 100, 82, 3, 14);
    if (m.status) G.textRight(m.status, 300, 82, 3, 14);
    G.text("こうげき " + statOf(m, "atk"), 20, 110, 3, 14);
    G.text("ぼうぎょ " + statOf(m, "def"), 170, 110, 3, 14);
    G.text("すばやさ " + statOf(m, "spd"), 20, 132, 3, 14);
    G.text("とくしゅ " + statOf(m, "spc"), 170, 132, 3, 14);

    G.window9(4, 166, 312, 114);
    m.moves.forEach((mv, i) => {
      const d = moveData(mv.name);
      const y = 176 + i * 25;
      G.textFit(mv.name, 18, y, 142, 3, 15);
      G.text(d.type, 166, y + 1, 3, 13);
      G.textRight(mv.pp + "/" + mv.max, 304, y + 1, 3, 13);
    });
  });
}

/* ============ どうぐ ============ */
export async function bagMenu() {
  for (;;) {
    const list = bagList("normal");
    const keys = bagList("key");
    const labels = list.map((x) => x.name + " ×" + x.n)
      .concat(keys.map((x) => "★" + x.name));
    labels.push("とじる");
    const i = await ui.choice(labels, { x: 8, y: 8, w: 304, rows: 7 });
    if (i < 0 || i === labels.length - 1) return;

    const all = list.concat(keys);
    const it = all[i];
    if (!it) return;
    const d = itemData(it.name);
    await ui.say([d.desc]);
    if (d.kind === "key") continue;

    const what = await ui.choice(["つかう", "すてる", "もどる"], { x: 176, y: 150, w: 136 });
    if (what === 0) await useOutside(it.name);
    else if (what === 1) {
      const yes = await ui.ask([it.name + "を すてますか？"]);
      if (yes) { useItem(it.name); await ui.say([it.name + "を すてた。"]); }
    }
  }
}

async function useOutside(name) {
  const d = itemData(name);
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
      if (!fainted(m)) { await ui.say(["その モンスターは げんきだ。"]); return; }
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

async function dexEntry(n) {
  const sp = SPECIES[n];
  await ui.custom(() => {
    G.use("uiDark");
    G.clear(1);
    G.use("ui");
    G.window9(4, 4, 312, 160);
    G.draw(G.makeMonArt(MONART[n], 5, "d" + n, sp.types[0]), 20, 24);
    G.text("No." + String(sp.no).padStart(3, "0"), 130, 24, 3, 14);
    G.textFit(n, 130, 46, 170, 3, 16);
    G.textFit("タイプ/" + sp.types.join("・"), 130, 72, 170, 3, 14);
    G.text(State.save.dexOwn[n] ? "つかまえた" : "みつけた", 130, 94, 3, 14);
    G.window9(4, 170, 312, 110);
    const lines = G.wrap(sp.dex, 276, 16).slice(0, 4);
    lines.forEach((l, i) => G.text(l, 18, 182 + i * 25, 3, 16));
  });
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
    G.text("トレーナーカード", 24, 24, 3, 16);
    G.textFit("なまえ　" + s.name, 24, 60, W, 3, 16);
    G.textFit("おかね　" + s.money + "円", 24, 88, W, 3, 16);
    G.textFit("ずかん　みた " + c.seen + " / つかまえた " + c.own, 24, 116, W, 3, 16);
    G.text("バッジ　" + s.badges.length + "こ", 24, 144, 3, 16);
    s.badges.slice(0, 3).forEach((b, i) => G.textFit("・" + b, 40, 170 + i * 22, W - 16, 3, 14));
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
      if (!data) { await ui.say(["クラウドに きろくが ありません。"]); continue; }
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
  if (hasProgress(data)) {
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
export async function shopMenu() {
  for (;;) {
    const i = await ui.choice(["かう", "うる", "やめる"], { x: 176, y: 150, w: 136 });
    if (i < 0 || i === 2) { await ui.say(["また どうぞ！"]); return; }
    if (i === 0) await buyMenu();
    else await sellMenu();
  }
}

async function buyMenu() {
  for (;;) {
    const labels = SHOP_LIST.map((n) => n + "  " + itemData(n).price + "円");
    labels.push("やめる");
    const i = await ui.choice(labels, { x: 8, y: 8, w: 304, rows: 7 });
    if (i < 0 || i >= SHOP_LIST.length) return;
    const name = SHOP_LIST[i];
    const price = itemData(name).price;
    await ui.say([itemData(name).desc, "もちきん " + State.save.money + "円"]);
    const counts = ["1こ", "2こ", "3こ", "5こ", "10こ", "やめる"];
    const ci = await ui.choice(counts, { x: 200, y: 100, w: 110 });
    if (ci < 0 || ci === 5) continue;
    const n = [1, 2, 3, 5, 10][ci];
    const total = price * n;
    if (State.save.money < total) { await ui.say(["おかねが たりません。"]); continue; }
    const yes = await ui.ask([name + " ×" + n, "ぜんぶで " + total + "円 です。", "よろしいですか？"]);
    if (!yes) continue;
    State.save.money -= total;
    addItem(name, n);
    beep("buy");
    await ui.say(["ありがとう ございました！"]);
  }
}

async function sellMenu() {
  for (;;) {
    const list = bagList("normal");
    if (!list.length) { await ui.say(["うれる ものが ありません。"]); return; }
    const labels = list.map((x) => x.name + " ×" + x.n);
    labels.push("やめる");
    const i = await ui.choice(labels, { x: 8, y: 8, w: 304, rows: 7 });
    if (i < 0 || i >= list.length) return;
    const name = list[i].name;
    const price = Math.floor(itemData(name).price / 2);
    const yes = await ui.ask([name + "を " + price + "円で ひきとります。", "よろしいですか？"]);
    if (!yes) continue;
    useItem(name);
    State.save.money += price;
    beep("buy");
    await ui.say(["ありがとう ございました！"]);
  }
}

export { hasProgress };
