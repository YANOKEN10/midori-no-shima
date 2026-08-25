// ============================================================
//  はじまり（タイトル → ログイン → ぼうけん）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { initAudio, resumeAudio, playBgm, beep, setMuted } from "./audio.js";
import { MONART } from "./data/monart.js";
import { G as State, loadInto, newGame } from "./state.js";
import { world, bgmFor } from "./world.js";
import { battle } from "./battle.js";
import { cloud } from "./cloud.js";
import { showAuth, showForm } from "./gate.js";
import { loadLocal, saveLocal, saveCloud, loadCloud, applySave, describeSave, clearLocal } from "./save.js";
import { accountMenu } from "./menu.js";
import { START } from "./data/maps.js";

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
    world: world, battle: battle, ui: ui, State: State, cloud: cloud,
  };
}

/* --- タイトル画面 ---------------------------------------------- */
const title = {
  t: 0,
  update(dt) { this.t += dt; ui.update(dt); },
  draw() {
    G.clear(0);
    const t = this.t;
    // ロゴ
    G.rect(0, 40, G.W, 76, 1);
    G.rect(0, 40, G.W, 3, 3);
    G.rect(0, 113, G.W, 3, 3);
    G.textCenter("VORAZ", G.W / 2, 52, 3, 32);
    G.textCenter("MONSTERS", G.W / 2, 84, 3, 26);
    G.textCenter("〜みどりのしまの ものがたり〜", G.W / 2, 128, 2, 14);

    // モンスターが 3びき
    const names = ["リーフィン", "ヒノコマ", "アワミィ"];
    names.forEach((n, i) => {
      const bob = Math.sin(t / 400 + i) * 3;
      G.draw(G.makeArt(MONART[n], 3, "t" + n), 40 + i * 88, 168 + bob);
    });

    if (Math.floor(t / 500) % 2 === 0) G.textCenter("PUSH  START", G.W / 2, 236, 3, 18);
    G.textCenter("(c) VORAZ  1998-2026", G.W / 2, 266, 2, 12);
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
    const cloudSave = restored && restored.payload ? restored.payload : null;
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
        fields: [{ el: "who", key: "name", label: "なまえ", type: "text", value: State.save.name || "ユウキ", placeholder: "ユウキ" }],
        submit: "この なまえで はじめる",
      });
      const name = r && String(r.name || "").trim() ? String(r.name).trim().slice(0, 8) : "ユウキ";
      loadInto(newGame(name));
      saveLocal();
      await ui.say([
        "ようこそ モンスターの せかいへ！",
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
