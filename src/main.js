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
import { world, bgmFor } from "./world.js?v=20260903-world-v4";
import { battle, startBattle } from "./battle.js";
import { cloud } from "./cloud.js";
import { showAuth, showForm } from "./gate.js";
import { loadLocal, saveLocal, saveCloud, loadCloud, applySave, describeSave, clearLocal, compatible } from "./save.js";
import { accountMenu } from "./menu.js";
import { START } from "./data/maps.js?v=20260903-world-v4";
import { drawTitleBackground } from "./revampArt.js?v=20260903-world-v4";

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
      G.ctx.fillRect(22, 20, G.W - 44, 80);
      G.ctx.strokeRect(26, 24, G.W - 52, 72);
      G.ctx.restore();
      outlined("ガオン・ワールド", G.W / 2, 35, 25);
      G.use("ui");
      G.textCenter("七つの谷と リーフ・コンパス", G.W / 2, 76, 0, 13);
      if (Math.floor(t / 500) % 2 === 0) {
        G.ctx.fillStyle = "rgba(4,18,51,.75)";
        G.ctx.fillRect(87, 238, 146, 30);
        G.textCenter("PUSH  START", G.W / 2 + 1, 245, 3, 16);
        G.textCenter("PUSH  START", G.W / 2, 244, 0, 16);
      }
      ui.draw();
      return;
    }
    // そら → うみ → くさ の はいけい
    G.use("sky");
    G.clear(0);
    G.rect(0, 96, G.W, 20, 1);
    G.use("water");
    G.rect(0, 116, G.W, 40, 1);
    for (let i = 0; i < 5; i++) {
      const x = ((t / 30) + i * 70) % (G.W + 40) - 20;
      G.rect(x, 126 + (i % 2) * 14, 22, 3, 0);
    }
    G.use("grass");
    G.rect(0, 156, G.W, G.H - 156, 1);
    G.rect(0, 156, G.W, 4, 2);

    // ロゴ（ふちどりを つけて はっきり 見せる）
    G.use("title");
    G.rect(20, 30, G.W - 40, 80, 3);
    G.rect(24, 34, G.W - 48, 72, 2);
    G.rect(24, 34, G.W - 48, 8, 1);
    outlined("ガオン", G.W / 2, 42, 32);
    outlined("ワールド", G.W / 2, 76, 24);
    G.use("title");
    const sub = "〜七つの谷と リーフ・コンパス〜";
    const sw = G.textW(sub, 14) + 24;
    G.rect((G.W - sw) / 2, 114, sw, 24, 3);
    G.text(sub, (G.W - sw) / 2 + 12, 118, 0, 14);

    // ガオンが 3びき
    const names = ["リーフィン", "ヒノコマ", "アワミィ"];
    names.forEach((n, i) => {
      const bob = Math.sin(t / 400 + i) * 3;
      const set = palOf(SPECIES[n]);
      const acc = accentOf(SPECIES[n]);
      G.use("grass");
      G.ctx.globalAlpha = 0.35;
      G.rect(46 + i * 88, 224 + bob * 0.4, 44, 6, 3);
      G.ctx.globalAlpha = 1;
      G.draw(G.makeMonArt(MONART[n], 1, "t" + n, set, acc, MONPAL[n]), 44 + i * 88, 176 + bob);
    });

    G.use("ui");
    if (Math.floor(t / 500) % 2 === 0) {
      G.textCenter("PUSH  START", G.W / 2 + 2, 240, 3, 18);
      G.textCenter("PUSH  START", G.W / 2, 238, 0, 18);
    }
    G.textCenter("(c) VORAZ  1998-2026", G.W / 2, 268, 0, 12);
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
    const starts = {
      village: [21, 19], hut: [20, 31], elder: [20, 31],
      mount1: [20, 37], mount2: [20, 37], gate: [20, 2],
      harbor: [20, 3], route1: [20, 37], sand: [20, 37],
      route2: [20, 37], forest: [20, 37], route3: [20, 37],
      stone: [20, 37], route4: [20, 37], aqua: [20, 37], route5: [20, 37],
      sky: [20, 37], route6: [20, 37],
      flame: [20, 37], route7: [15, 37], galaxy: [20, 37],
      inlet: [2, 21], desert: [2, 21], deepforest: [2, 21],
      cavern: [2, 21], river: [2, 21], cloud: [2, 21], volcano: [2, 21], starhill: [2, 21],
      station: [20, 34], clothes1: [20, 34], salon: [20, 34], clothes2: [20, 34],
      shop: [20, 34], hut2: [20, 34], arena: [20, 34],
    };
    const at = starts[testMap] || starts.village;
    world.enter(starts[testMap] ? testMap : "village", at[0], at[1], "down");
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
        fields: [{ el: "who", key: "name", label: "なまえ", type: "text", value: State.save.name || "レオ", placeholder: "レオ" }],
        submit: "この なまえで はじめる",
      });
      const name = r && String(r.name || "").trim() ? String(r.name).trim().slice(0, 8) : "レオ";
      loadInto(newGame(name));
      saveLocal();
      await ui.say([
        "ようこそ ガオンの せかいへ！",
        "きみの なまえは " + name + "。",
        "きたの けんきゅうじょで", "はかせが まっている。",
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
