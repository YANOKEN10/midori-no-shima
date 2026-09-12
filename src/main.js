import { chooseAppearance } from "./characterSetup.js";
import { battleArt } from './data/battleart.js';
// ============================================================
//  はじまり（タイトル → ログイン → ぼうけん）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { initAudio, resumeAudio, playBgm, beep, setMuted } from "./audio.js";
import { MONART, MONPAL } from "./data/monart.js";
import { SPECIES, palOf, accentOf } from "./data/species.js";
import { G as State, loadInto, newGame, makeMon } from "./state.js";
import { world, bgmFor } from "./world.js?v=20260913-environments-v41";
import { battle, startBattle } from "./battle.js";
import { cloud } from "./cloud.js";
import { showAuth, showForm } from "./gate.js";
import { loadLocal, saveLocal, saveCloud, loadCloud, applySave, describeSave, clearLocal, compatible } from "./save.js";
import { accountMenu } from "./menu.js";
import { START } from "./data/maps.js?v=20260913-environments-v41";
import { drawTitleBackground } from "./revampArt.js?v=20260913-environments-v41";

let scene = null;
let last = 0;
const whoami = document.getElementById("whoami");

/* --- ゲームループ --------------------------------------------- */
function frame(dt) {
  In.pollGamepad();
  if (battle.active) { battle.update(dt); battle.draw(); }
  else if (scene) { scene.update(dt); scene.draw(); }
  In.endFrame();
}

function loop(t) {
  const dt = Math.min(50, t - last || 16);
  last = t;
  frame(dt);
  requestAnimationFrame(loop);
}

// かいはつ用（手元で うごかすときだけ）
if (/^(localhost|127.0.0.1)$/.test(location.hostname)) {
  window.VM = {
    frame: frame,
    steps(n, dt) { for (let i = 0; i < (n || 1); i++) frame(dt || 16); },
    get scene() { return scene; },
    setWorld() { scene = world; },
    setTitle() { scene = title; },
    newGame: newGame,
    makeMon: makeMon,
    startBattle: startBattle,
    world: world, battle: battle, ui: ui, State: State, cloud: cloud,
  };
}

/* --- タイトル画面 ---------------------------------------------- */
// ふちどり文字（まわりを こい色で かこんでから 白で かく）
function outlined(str, cx, y, size) {
  const w = G.textW(str, size);
  const x = cx - w / 2;
  const off = [[-2, 0], [2, 0], [0, -2], [0, 2], [-2, -2], [2, -2], [-2, 2], [2, 2]];
  for (const [dx, dy] of off) G.text(str, x + dx, y + dy, 3, size);
  G.text(str, x, y, 0, size);
}

const title = {
  t: 0,
  update(dt) { this.t += dt; ui.update(dt); },
  draw() {
    const t = this.t;
    if (drawTitleBackground(G.ctx, G.W, G.H)) {
      G.ctx.save();
      G.ctx.fillStyle = "rgba(4,18,51,.64)";
      G.ctx.strokeStyle = "rgba(126,211,255,.82)";
      G.ctx.lineWidth = 2;
      G.ctx.fillRect(22, 12, G.W - 44, 66);
      G.ctx.strokeRect(26, 16, G.W - 52, 58);
      G.ctx.restore();
      outlined("ガオン・ワールド", G.W / 2, 24, 25);
      G.use("ui");
      G.textCenter("ガオンずかんを 完成させよう", G.W / 2, 58, 0, 13);
      if (Math.floor(t / 500) % 2 === 0) {
        G.ctx.fillStyle = "rgba(4,18,51,.75)";
        G.ctx.fillRect(87, 238, 146, 30);
        G.textCenter("PUSH  START", G.W / 2 + 1, 245, 3, 16);
        G.textCenter("PUSH  START", G.W / 2, 244, 0, 16);
      }
      ui.draw();
      return;
    }
    // Only a neutral loading surface is shown until the current title is ready.
    G.ctx.fillStyle='#0b2435';G.ctx.fillRect(0,0,G.W,G.H);
    ui.draw();
  },
};

/* --- はじめの ながれ ------------------------------------------ */
async function boot() {
  In.initInput();
  G.fitScreen();
  addEventListener("resize", G.fitScreen);

  // フォントが よみこめたら くっきり えがきなおす
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => G.markFontReady());
  }

  scene = title;
  requestAnimationFrame(loop);

  // 自動ビジュアル検証専用。公開環境では動作しない。
  const testMap = new URLSearchParams(location.search).get("v4test");
  if (/^(localhost|127.0.0.1)$/.test(location.hostname) && testMap) {
    loadInto(newGame("レオ"));
    world.enter(testMap, NaN, NaN, "down");
    scene = world;
    return;
  }

  cloud.init();
  const local = loadLocal();
  if (local && local.palette) G.setPalette(local.palette);

  // ログインの券が いきていれば、しずかに ログインしておく
  const restored = await cloud.restore();
  updateWho();

  // なにか おすまで まつ
  await waitForKey();
  initAudio();
  resumeAudio();
  playBgm("town");

  await mainFlow(local, restored);
}

function waitForKey() {
  return new Promise((res) => {
    const check = () => {
      if (In.anyHit() || In.usedInput()) { res(); return; }
      requestAnimationFrame(check);
    };
    const onPointer = () => { removeEventListener("pointerdown", onPointer); res(); };
    addEventListener("pointerdown", onPointer);
    requestAnimationFrame(check);
  });
}

async function mainFlow(local, restored) {
  for (;;) {
    const raw = restored && restored.payload ? restored.payload : null;
    const cloudSave = compatible(raw) ? raw : null;
    const items = [];
    if (local) items.push("つづきから（この たんまつ）");
    if (cloudSave) items.push("つづきから（クラウド）");
    items.push("さいしょから");
    items.push(cloud.signedIn ? "アカウント（" + cloud.who + "）" : "ログイン / とうろく");

    const i = await ui.choice(items, { x: 30, y: 150, w: 260, cancel: false, rows: 4 });
    const label = items[i];

    if (label.indexOf("この たんまつ") >= 0) {
      applySave(local);
      startGame();
      return;
    }
    if (label.indexOf("クラウド") >= 0 && label.indexOf("つづき") >= 0) {
      applySave(cloudSave);
      saveLocal();
      startGame();
      return;
    }
    if (label === "さいしょから") {
      if (local || cloudSave) {
        const yes = await ui.ask(["いまの きろくは きえてしまいます。", "それでも さいしょから はじめますか？"]);
        if (!yes) continue;
      }
      const r = await showForm({
        title: "きみの なまえは？",
        sub: "ぼうけんの あいだ つかう なまえです。",
        fields: [{ el: "who", key: "name", label: "なまえ", type: "text", value: "", placeholder: "ポンキチ" }],
        submit: "みためを えらぶ",
      });
      if (!r) continue;
      const name = String(r.name || "").trim().slice(0, 8) || "ポンキチ";
      const appearance = await chooseAppearance();
      if (!appearance) continue;
      loadInto(newGame(name));
      State.save.look = { ...State.save.look, ...appearance.look };
      saveLocal();
      await ui.say([
        "ようこそ ガオンの せかいへ！",
        "きみの なまえは " + name + "。",
        "ここは きみの生まれた ネイチャータウン。",
        "村の女の子が めずらしいガオンを見たらしい。",
      ]);
      startGame();
      return;
    }
    // アカウント
    const before = cloud.signedIn;
    const r = await accountMenu();
    updateWho();
    if (r === "reload") { startGame(); return; }
    if (!before && cloud.signedIn) restored = { payload: await loadCloud() };
    local = loadLocal();
  }
}

function startGame() {
  const w = State.save.where || START;
  world.enter(w.map, w.x, w.y, w.dir);
  scene = world;
  updateWho();
  // ときどき じどうで ほぞん（1かいだけ しかける）
  if (!startGame.timer) startGame.timer = setInterval(() => {
    if (battle.active || ui.busy) return;
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  }, 60000);
}

function updateWho() {
  whoami.textContent = cloud.signedIn ? "☁ " + cloud.who : "この たんまつだけ";
}
whoami.addEventListener("click", async () => {
  if (battle.active || ui.busy) return;
  await accountMenu();
  updateWho();
});

addEventListener("pointerdown", () => { initAudio(); resumeAudio(); }, { once: true });
addEventListener("keydown", () => { initAudio(); resumeAudio(); }, { once: true });
addEventListener("beforeunload", () => { if (State.save.party.length) saveLocal(); });

boot();
