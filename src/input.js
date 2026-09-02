// ============================================================
//  そうさ（キーボード・タッチ・ゲームパッド）
// ============================================================
const KEYS = ["up", "down", "left", "right", "a", "b", "start", "select"];
const MAP = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
  KeyZ: "a", Enter: "a", Space: "a",
  KeyX: "b", Backspace: "b", Escape: "b",
  KeyE: "start", ShiftLeft: "select", ShiftRight: "select",
};

const down = Object.create(null);
const pressed = Object.create(null);
let repeatAt = Object.create(null);
let anyInput = false;
let analogX = 0, analogY = 0;

export function isDown(k) { return Boolean(down[k]); }
export function hit(k) { return Boolean(pressed[k]); }
export function anyHit() { return KEYS.some((k) => pressed[k]); }
export function consumedAll() { for (const k of KEYS) pressed[k] = false; }
export function usedInput() { const v = anyInput; anyInput = false; return v; }
export function movementVector() {
  let x = (down.right ? 1 : 0) - (down.left ? 1 : 0);
  let y = (down.down ? 1 : 0) - (down.up ? 1 : 0);
  if (Math.abs(analogX) > Math.abs(x)) x = analogX;
  if (Math.abs(analogY) > Math.abs(y)) y = analogY;
  const length = Math.hypot(x, y);
  return length > 1 ? { x: x / length, y: y / length } : { x, y };
}

// おしっぱなしで くりかえす（メニューの カーソル用）
export function repeat(k, now, first, every) {
  if (!down[k]) { repeatAt[k] = 0; return false; }
  if (pressed[k]) { repeatAt[k] = now + (first || 260); return true; }
  if (repeatAt[k] && now >= repeatAt[k]) { repeatAt[k] = now + (every || 90); return true; }
  return false;
}

function set(k, v) {
  if (!k) return;
  if (v && !down[k]) pressed[k] = true;
  down[k] = v;
  anyInput = true;
}

export function endFrame() { for (const k of KEYS) pressed[k] = false; }

export function initInput() {
  addEventListener("keydown", (e) => {
    const k = MAP[e.code];
    if (!k) return;
    if (document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    e.preventDefault();
    if (!e.repeat) set(k, true);
  });
  addEventListener("keyup", (e) => {
    const k = MAP[e.code];
    if (!k) return;
    e.preventDefault();
    set(k, false);
  });
  addEventListener("blur", () => { for (const k of KEYS) down[k] = false; });

  // --- タッチ ---
  const pad = document.getElementById("pad");
  const btns = Array.from(pad.querySelectorAll("[data-k]"));
  const active = new Map();     // ゆびID -> ボタン

  function at(x, y) {
    for (const b of btns) {
      const r = b.getBoundingClientRect();
      const grow = b.id.startsWith("d") ? 6 : 10;
      if (x >= r.left - grow && x <= r.right + grow && y >= r.top - grow && y <= r.bottom + grow) return b;
    }
    return null;
  }
  function refresh() {
    const held = new Set(Array.from(active.values()).map((b) => b.dataset.k));
    for (const k of KEYS) if (down[k] && !held.has(k) && !keyboardHeld[k]) set(k, false);
    for (const k of held) if (!down[k]) set(k, true);
    for (const b of btns) b.classList.toggle("on", held.has(b.dataset.k));
  }
  const keyboardHeld = Object.create(null);
  addEventListener("keydown", (e) => { if (MAP[e.code]) keyboardHeld[MAP[e.code]] = true; });
  addEventListener("keyup", (e) => { if (MAP[e.code]) keyboardHeld[MAP[e.code]] = false; });

  function onStart(e) {
    for (const t of e.changedTouches) {
      const b = at(t.clientX, t.clientY);
      if (b) { active.set(t.identifier, b); e.preventDefault(); }
    }
    refresh();
  }
  function onMove(e) {
    let touched = false;
    for (const t of e.changedTouches) {
      if (!active.has(t.identifier)) continue;
      touched = true;
      const b = at(t.clientX, t.clientY);
      if (b) active.set(t.identifier, b); else active.delete(t.identifier);
    }
    if (touched) e.preventDefault();
    refresh();
  }
  function onEnd(e) {
    for (const t of e.changedTouches) active.delete(t.identifier);
    refresh();
  }
  pad.addEventListener("touchstart", onStart, { passive: false });
  pad.addEventListener("touchmove", onMove, { passive: false });
  pad.addEventListener("touchend", onEnd, { passive: false });
  pad.addEventListener("touchcancel", onEnd, { passive: false });

  // 360度アナログスティック。フィールドでは斜めを含む連続移動に使う。
  const stick = document.getElementById("joystick");
  const knob = document.getElementById("stickKnob");
  let stickPointer = null;
  const updateStick = (clientX, clientY) => {
    const r = stick.getBoundingClientRect();
    const radius = r.width * 0.34;
    let dx = clientX - (r.left + r.width / 2), dy = clientY - (r.top + r.height / 2);
    const length = Math.hypot(dx, dy);
    if (length > radius) { dx *= radius / length; dy *= radius / length; }
    analogX = dx / radius; analogY = dy / radius;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    anyInput = true;
  };
  const releaseStick = () => {
    stickPointer = null; analogX = analogY = 0;
    knob.style.transform = "translate(0, 0)";
    stick.classList.remove("on");
  };
  stick.addEventListener("pointerdown", (e) => {
    e.preventDefault(); stickPointer = e.pointerId; stick.setPointerCapture(e.pointerId);
    stick.classList.add("on"); updateStick(e.clientX, e.clientY);
  });
  stick.addEventListener("pointermove", (e) => {
    if (e.pointerId === stickPointer) { e.preventDefault(); updateStick(e.clientX, e.clientY); }
  });
  stick.addEventListener("pointerup", releaseStick);
  stick.addEventListener("pointercancel", releaseStick);

  // iOSのホーム画面アプリではPointer Captureが失敗する場合があるため、
  // Touch Eventsでも同じアナログ値を更新する。
  const stickTouch = (e) => {
    const t = e.touches[0] || e.changedTouches[0];
    if (!t) return;
    e.preventDefault();
    stick.classList.add("on");
    updateStick(t.clientX, t.clientY);
  };
  stick.addEventListener("touchstart", stickTouch, { passive: false });
  stick.addEventListener("touchmove", stickTouch, { passive: false });
  stick.addEventListener("touchend", (e) => { e.preventDefault(); releaseStick(); }, { passive: false });
  stick.addEventListener("touchcancel", releaseStick, { passive: false });

  // マウスでも おせるように（パソコンで さわりたい人むけ）
  for (const b of btns) {
    b.addEventListener("mousedown", (e) => { e.preventDefault(); set(b.dataset.k, true); b.classList.add("on"); });
    addEventListener("mouseup", () => { if (b.classList.contains("on")) { set(b.dataset.k, false); b.classList.remove("on"); } });
  }

  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) document.body.classList.add("touch");
}

// ゲームパッド（あれば）
let padPrev = {};
export function pollGamepad() {
  if (!navigator.getGamepads) return;
  const gp = navigator.getGamepads()[0];
  if (!gp) return;
  const now = {
    up: gp.buttons[12] && gp.buttons[12].pressed || gp.axes[1] < -0.4,
    down: gp.buttons[13] && gp.buttons[13].pressed || gp.axes[1] > 0.4,
    left: gp.buttons[14] && gp.buttons[14].pressed || gp.axes[0] < -0.4,
    right: gp.buttons[15] && gp.buttons[15].pressed || gp.axes[0] > 0.4,
    a: gp.buttons[0] && gp.buttons[0].pressed,
    b: gp.buttons[1] && gp.buttons[1].pressed,
    start: gp.buttons[9] && gp.buttons[9].pressed,
    select: gp.buttons[8] && gp.buttons[8].pressed,
  };
  for (const k of KEYS) {
    if (now[k] !== padPrev[k]) set(k, now[k]);
  }
  padPrev = now;
}
