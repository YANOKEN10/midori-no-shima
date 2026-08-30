// ============================================================
//  ぼうけんの きろく
//   ・いつも たんまつの なかに ほぞん
//   ・ログインしていれば クラウドにも あずける（べつの きかいで つづきが できる）
// ============================================================
import { G, loadInto } from "./state.js";
import { cloud } from "./cloud.js";

const KEY = "gaon-world:save:v3";

export function snapshot() {
  return JSON.parse(JSON.stringify(G.save));
}

export function saveLocal() {
  G.save.savedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(G.save)); return true; }
  catch (e) { return false; }
}

export const SAVE_VER = 3;

// ものがたりが 大きく かわったので、ふるい きろくは つかいません
export function compatible(d) { return Boolean(d) && (d.ver | 0) >= SAVE_VER; }

export function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return compatible(d) ? d : null;
  } catch (e) { return null; }
}

export function hasLocal() { return Boolean(loadLocal()); }

export function clearLocal() {
  try { localStorage.removeItem(KEY); } catch (e) { /* ok */ }
}

// クラウドへ あずける。ぶつかったら { conflict, remote } を かえす
export async function saveCloud(force) {
  if (!cloud.signedIn) return { ok: false, skip: true };
  const r = await cloud.push(snapshot(), force);
  if (r.ok) return { ok: true };
  if (r.status === 409 && r.data) return { ok: false, conflict: true, remote: r.data.payload, user: r.data.user };
  return { ok: false, why: r.why };
}

export async function saveBoth() {
  saveLocal();
  return saveCloud(true);
}

// クラウドから とりだす
export async function loadCloud() {
  if (!cloud.signedIn) return null;
  const r = await cloud.pull();
  if (!r.ok) return null;
  return r.data.payload || null;
}

export function applySave(data) {
  loadInto(data);
}

// どちらが あたらしいか
export function newerOf(a, b) {
  const ta = (a && a.savedAt) || 0;
  const tb = (b && b.savedAt) || 0;
  return ta >= tb ? "a" : "b";
}

export function describeSave(d) {
  if (!d) return "きろくなし";
  const badges = (d.badges || []).length;
  const party = (d.party || []).length;
  const t = d.savedAt ? new Date(d.savedAt) : null;
  const when = t ? (t.getMonth() + 1) + "/" + t.getDate() + " " + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0") : "";
  return (d.name || "?") + "  エンブレム" + badges + "  てもち" + party + "  " + when;
}
