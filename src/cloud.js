// ============================================================
//  ログインと クラウド保存の やりとり
//   ・あいことばは サーバーに おくるだけ。たんまつには のこしません
//   ・のこすのは「ログインの券」(1年で きれる) だけ
// ============================================================
const TOK = "vmon:token";
const NAME = "vmon:lastname";

export const cloud = {
  token: "",
  user: null,
  rev: 0,

  get signedIn() { return Boolean(this.token && this.user); },
  get who() { return this.user ? this.user.display : ""; },

  init() {
    try { this.token = localStorage.getItem(TOK) || ""; } catch (e) { this.token = ""; }
  },
  lastName() {
    try { return localStorage.getItem(NAME) || ""; } catch (e) { return ""; }
  },
  setToken(t, name) {
    this.token = t || "";
    try {
      if (t) localStorage.setItem(TOK, t); else localStorage.removeItem(TOK);
      if (name) localStorage.setItem(NAME, name);
    } catch (e) { /* つかえない ブラウザでも うごくように */ }
  },

  async call(path, opt) {
    const o = opt || {};
    const h = { "Content-Type": "application/json" };
    if (this.token) h["Authorization"] = "Bearer " + this.token;
    let r;
    try {
      r = await fetch(path, {
        method: o.method || "GET",
        headers: h,
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
    } catch (e) {
      return { ok: false, why: "つながりませんでした。ネットを たしかめてください。" };
    }
    let d = null;
    try { d = await r.json(); } catch (e) { d = null; }
    if (!r.ok) {
      if (r.status === 401 && this.user) { this.setToken(""); this.user = null; }
      if (r.status === 404 && !d) return { ok: false, status: 404, why: "クラウドは この ばしょでは つかえません。" };
      return { ok: false, status: r.status, data: d, why: (d && d.message) || ("うまく いきませんでした（" + r.status + "）") };
    }
    return { ok: true, data: d || {} };
  },

  async signup(name, pw, mail) {
    const r = await this.call("/api/auth", { method: "POST", body: { action: "signup", name: name, pw: pw, mail: mail || "" } });
    if (!r.ok) return r;
    this.setToken(r.data.token, name);
    this.user = r.data.user;
    this.rev = r.data.user.rev | 0;
    return r;
  },
  async login(who, pw) {
    const r = await this.call("/api/auth", { method: "POST", body: { action: "login", name: who, pw: pw } });
    if (!r.ok) return r;
    this.setToken(r.data.token, r.data.user.display);
    this.user = r.data.user;
    this.rev = r.data.user.rev | 0;
    return r;
  },
  logout() { this.setToken(""); this.user = null; this.rev = 0; },

  // 券が まだ いきているか（はじめに 1かい）
  async restore() {
    if (!this.token) return null;
    const r = await this.call("/api/save");
    if (!r.ok) return null;
    this.user = r.data.user;
    this.rev = r.data.user.rev | 0;
    return r.data;
  },

  async pull() {
    const r = await this.call("/api/save");
    if (r.ok) { this.user = r.data.user; this.rev = r.data.user.rev | 0; }
    return r;
  },
  async push(payload, force) {
    const r = await this.call("/api/save", { method: "POST", body: { payload: payload, rev: this.rev, force: Boolean(force) } });
    if (r.ok) { this.user = r.data.user; this.rev = r.data.rev | 0; }
    else if (r.status === 409 && r.data) { this.rev = (r.data.user && r.data.user.rev) | 0; }
    return r;
  },

  account(action, pw, extra) {
    return this.call("/api/account", { method: "POST", body: Object.assign({ action: action, pw: pw }, extra || {}) });
  },
};
