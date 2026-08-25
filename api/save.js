// ============================================================
//  ぼうけんのきろく（クラウド保存）
//   GET    /api/save          … じぶんの きろくを とりだす
//   POST   /api/save          … きろくを あずける
//   DELETE /api/save          … クラウドの きろくだけ けす
//  ログインしている本人のぶんしか さわれません。
// ============================================================
const L = require("./_lib");

const MAX_BYTES = 300 * 1024;   // きろく1つの上限

module.exports = async function handler(req, res) {
  L.cors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (!L.configured()) { L.notReady(res); return; }

  const claim = L.readToken(L.bearer(req));
  if (!claim) { res.status(401).json({ error: "auth", message: "ログインし なおしてください。" }); return; }

  try {
    const user = await L.readUser(claim.id);
    if (!user) { res.status(404).json({ error: "gone", message: "アカウントが 見つかりませんでした。" }); return; }

    if (req.method === "GET") {
      res.status(200).json({ user: L.publicUser(user), payload: user.payload || null });
      return;
    }

    if (req.method === "DELETE") {
      user.payload = null;
      user.savedAt = 0;
      user.rev = (user.rev | 0) + 1;
      await L.writeUser(user);
      res.status(200).json({ user: L.publicUser(user), cleared: true });
      return;
    }

    if (req.method !== "POST") { res.status(405).json({ error: "method" }); return; }

    const b = L.body(req);
    if (b.payload == null || typeof b.payload !== "object") {
      res.status(400).json({ error: "payload", message: "きろくの 中身が ありません。" });
      return;
    }
    const size = Buffer.byteLength(JSON.stringify(b.payload));
    if (size > MAX_BYTES) {
      res.status(413).json({ error: "big", message: "きろくが 大きすぎます。" });
      return;
    }

    // べつの たんまつで さきに 保存されていたら、上書きする前に たずねる
    const myRev = b.rev | 0;
    const serverRev = user.rev | 0;
    if (!b.force && user.payload && myRev < serverRev) {
      res.status(409).json({
        error: "conflict",
        message: "べつの たんまつで あたらしい きろくが あります。",
        user: L.publicUser(user),
        payload: user.payload,
      });
      return;
    }

    user.payload = b.payload;
    user.savedAt = Date.now();
    user.rev = serverRev + 1;
    await L.writeUser(user);
    res.status(200).json({ user: L.publicUser(user), saved: true, rev: user.rev });
  } catch (e) {
    res.status(500).json({ error: "server", message: "サーバーに つながりませんでした。" });
  }
};
