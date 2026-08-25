// ============================================================
//  アカウントの せってい
//   POST /api/account { action:"setmail"|"clearmail"|"setpw"|"rename"|"delete", ... }
//  どの めいれいにも「いまの あいことば」が いります。
// ============================================================
const L = require("./_lib");

// あぶない文字（制御文字と山かっこ）を とりのぞく
function cleanText(v, max) {
  let s = String(v == null ? "" : v);
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 0x20 || c === 0x7f || ch === "<" || ch === ">") continue;
    out += ch;
  }
  return out.trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  L.cors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "method" }); return; }
  if (!L.configured()) { L.notReady(res); return; }

  const claim = L.readToken(L.bearer(req));
  if (!claim) { res.status(401).json({ error: "auth", message: "ログインし なおしてください。" }); return; }

  const b = L.body(req);
  const action = String(b.action || "");

  try {
    const user = await L.readUser(claim.id);
    if (!user) { res.status(404).json({ error: "gone", message: "アカウントが 見つかりませんでした。" }); return; }

    if (!L.checkPw(String(b.pw == null ? "" : b.pw), user)) {
      await L.slowDown();
      res.status(401).json({ error: "auth", message: "いまの あいことばが ちがいます。" });
      return;
    }

    // メールアドレスを つける／かえる
    if (action === "setmail") {
      const mail = L.normMail(b.mail);
      if (!L.isMail(mail)) {
        res.status(400).json({ error: "mail", message: "メールアドレスの かたちが ちがいます。" });
        return;
      }
      const owner = await L.idForMail(mail);
      if (owner && owner !== user.id) {
        res.status(409).json({ error: "mailtaken", message: "その メールアドレスは もう つかわれています。" });
        return;
      }
      if (user.email && user.email !== mail) await L.unlinkMail(user.email);
      user.email = mail;
      await L.writeUser(user);
      await L.linkMail(mail, user.id);
      res.status(200).json({ user: L.publicUser(user) });
      return;
    }

    // メールアドレスを はずす（なまえ＋あいことば だけに もどす）
    if (action === "clearmail") {
      if (user.email) await L.unlinkMail(user.email);
      user.email = "";
      await L.writeUser(user);
      res.status(200).json({ user: L.publicUser(user) });
      return;
    }

    // あいことばを かえる
    if (action === "setpw") {
      const np = String(b.newPw == null ? "" : b.newPw);
      if (np.length < 4 || np.length > 64) {
        res.status(400).json({ error: "pw", message: "あいことばは 4もじ いじょうに してください。" });
        return;
      }
      L.setPw(user, np);
      await L.writeUser(user);
      res.status(200).json({ user: L.publicUser(user), token: L.makeToken(user.id) });
      return;
    }

    // 画面に でる なまえだけ かえる（ログイン用の なまえは かわりません）
    if (action === "rename") {
      const d = cleanText(b.display, 16);
      if (!d) { res.status(400).json({ error: "name", message: "なまえを いれてください。" }); return; }
      user.display = d;
      await L.writeUser(user);
      res.status(200).json({ user: L.publicUser(user) });
      return;
    }

    // アカウントごと けす
    if (action === "delete") {
      await L.deleteUser(user);
      res.status(200).json({ deleted: true });
      return;
    }

    res.status(400).json({ error: "action", message: "しらない めいれいです。" });
  } catch (e) {
    res.status(500).json({ error: "server", message: "サーバーに つながりませんでした。" });
  }
};
