// ============================================================
//  ログイン画面（HTMLの ほうを うごかします）
//   ・キーボードの ある なしに かかわらず つかえるように
//     もじの にゅうりょくは ふつうの <input> で おこないます
// ============================================================
import { cloud } from "./cloud.js";

const el = {
  gate: document.getElementById("gate"),
  card: null,
  tabs: null,
  form: document.getElementById("form"),
  fields: document.getElementById("fields"),
  who: document.getElementById("who"),
  name: document.getElementById("name"),
  pw: document.getElementById("pw"),
  mail: document.getElementById("mail"),
  go: document.getElementById("go"),
  skip: document.getElementById("skip"),
  msg: document.getElementById("msg"),
  guestNote: document.getElementById("guestNote"),
  who_: null,
};
el.card = el.gate.querySelector(".card");
el.tabs = Array.from(el.gate.querySelectorAll(".tab"));
const title = el.card.querySelector("h1");
const sub = el.card.querySelector("p.sub");
const tabsBox = el.card.querySelector(".tabs");

let mode = "login";
let resolveGate = null;
let formSpec = null;

function group(name) { return el.fields.querySelector('[data-f="' + name + '"]'); }
function show(name, on) { group(name).style.display = on ? "" : "none"; }
function setLabel(name, txt) { group(name).querySelector("label").textContent = txt; }

function message(text, kind) {
  el.msg.textContent = text || "";
  el.msg.className = "msg" + (kind ? " " + kind : "");
}

function applyMode() {
  for (const t of el.tabs) t.classList.toggle("on", t.dataset.mode === mode);
  message("");
  if (mode === "login") {
    show("who", true); show("name", false); show("pw", true); show("mail", false);
    el.guestNote.style.display = "none";
    el.go.textContent = "ログイン";
    el.pw.setAttribute("autocomplete", "current-password");
    el.who.value = el.who.value || cloud.lastName();
  } else if (mode === "signup") {
    show("who", false); show("name", true); show("pw", true); show("mail", true);
    el.guestNote.style.display = "none";
    el.go.textContent = "とうろくして はじめる";
    el.pw.setAttribute("autocomplete", "new-password");
  } else {
    show("who", false); show("name", false); show("pw", false); show("mail", false);
    el.guestNote.style.display = "";
    el.go.textContent = "この たんまつで はじめる";
  }
}

for (const t of el.tabs) {
  t.addEventListener("click", () => {
    if (formSpec) return;
    mode = t.dataset.mode;
    applyMode();
  });
}

el.skip.addEventListener("click", () => {
  if (formSpec) { finish(null); return; }
  finish({ kind: "guest" });
});

el.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (formSpec) { submitForm(); return; }
  await submitAuth();
});

async function submitAuth() {
  if (mode === "guest") { finish({ kind: "guest" }); return; }

  const pw = el.pw.value;
  el.go.disabled = true;
  message("つうしん中…");

  let r;
  if (mode === "signup") {
    const name = el.name.value.trim();
    const mail = el.mail.value.trim();
    if (name.length < 2) { message("なまえは 2もじ いじょうに してください。", "err"); el.go.disabled = false; return; }
    if (pw.length < 4) { message("あいことばは 4もじ いじょうに してください。", "err"); el.go.disabled = false; return; }
    r = await cloud.signup(name, pw, mail);
  } else {
    const who = el.who.value.trim();
    if (!who || !pw) { message("なまえと あいことばを いれてください。", "err"); el.go.disabled = false; return; }
    r = await cloud.login(who, pw);
  }
  el.go.disabled = false;
  if (!r.ok) { message(r.why, "err"); return; }
  message("ようこそ、" + cloud.who + " さん！", "ok");
  el.pw.value = "";
  setTimeout(() => finish({ kind: mode === "signup" ? "signup" : "login" }), 400);
}

function submitForm() {
  const out = {};
  for (const f of formSpec.fields) out[f.key] = el[f.el].value;
  finish(out);
}

function finish(value) {
  el.gate.classList.remove("show");
  // もじの らんに カーソルが のこると キーが きかなくなるので はずす
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  el.pw.value = "";
  const r = resolveGate;
  resolveGate = null;
  formSpec = null;
  tabsBox.style.display = "";
  title.textContent = "OORAZ MONSTERS";
  sub.innerHTML = "ログインすると、パソコンでも スマホでも<br>おなじ ぼうけんの つづきが あそべます。";
  el.skip.style.display = "";
  if (r) r(value);
}

/* --- そとから よぶ --------------------------------------------- */
export function showAuth(startMode) {
  mode = startMode || (cloud.lastName() ? "login" : "signup");
  formSpec = null;
  applyMode();
  el.gate.classList.add("show");
  el.skip.textContent = "ログインしないで あそぶ";
  el.skip.style.display = "";
  setTimeout(() => { (mode === "login" ? el.who : el.name).focus(); }, 60);
  return new Promise((res) => { resolveGate = res; });
}

// じゆうな にゅうりょく（メールの とうろく・あいことばの へんこう など）
export function showForm(spec) {
  formSpec = spec;
  tabsBox.style.display = "none";
  title.textContent = spec.title || "にゅうりょく";
  sub.innerHTML = spec.sub || "";
  el.guestNote.style.display = "none";
  show("who", false); show("name", false); show("pw", false); show("mail", false);
  for (const f of spec.fields) {
    show(f.el === "who" ? "who" : f.el === "name" ? "name" : f.el === "pw" ? "pw" : "mail", true);
    setLabel(f.el === "who" ? "who" : f.el === "name" ? "name" : f.el === "pw" ? "pw" : "mail", f.label);
    el[f.el].value = f.value || "";
    if (f.placeholder != null) el[f.el].placeholder = f.placeholder;
    if (f.type) el[f.el].type = f.type;
  }
  el.go.textContent = spec.submit || "けってい";
  el.skip.textContent = "やめる";
  message(spec.message || "");
  el.gate.classList.add("show");
  setTimeout(() => el[spec.fields[0].el].focus(), 60);
  return new Promise((res) => { resolveGate = res; });
}

export function gateMessage(text, kind) { message(text, kind); }
export function gateOpen() { return el.gate.classList.contains("show"); }
