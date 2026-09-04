// ============================================================
//  リーフ・コンパス（つぎの ものがたりの もくてきち）
// ============================================================
import { MAPS } from "./data/maps.js?v=20260904-recovery-v1";
import { G as State, flag, hasItem } from "./state.js";

const EMBLEM_TARGETS = [
  { map: "harbor", x: 5, y: 11, name: "アーレ湖港の 湖守ナギ" },
  { map: "sand", x: 7, y: 10, name: "陽だまり棚田の 牧守ダイ" },
  { map: "forest", x: 7, y: 10, name: "モミ響きの森の 薬草守シノ" },
  { map: "stone", x: 7, y: 10, name: "石笛の峡谷の 石工守ゴウ" },
  { map: "aqua", x: 7, y: 10, name: "水鏡の入江の 水路守ミナ" },
  { map: "sky", x: 7, y: 10, name: "白嶺のシャレーの 雪稜守ソラ" },
  { map: "flame", x: 7, y: 10, name: "夕映え高原の 星見守カグラ" },
];

export function compassAvailable() {
  return flag("gotCompass") || hasItem("リーフ・コンパス");
}

export function compassEnabled() {
  return compassAvailable() && Boolean(State.save.flags.compassOn);
}

export function setCompassEnabled(on) {
  State.save.flags.compassOn = on ? 1 : 0;
}

export function nextObjective() {
  if (!compassAvailable()) return null;
  if (!flag("elderOK")) {
    return { map: "elder", x: 4, y: 4, name: "やまの むらの ぞくちょう" };
  }
  const badges = Math.min(7, (State.save.badges || []).length);
  if (badges < EMBLEM_TARGETS.length) return EMBLEM_TARGETS[badges];
  if (!hasItem("たいかいパス")) {
    return { map: "galaxy", x: 5, y: 12, name: "星環の都の 山脈会議うけつけ" };
  }
  if (!flag("champion")) {
    return { map: "arena", x: 6, y: 5, name: "ガオンバトル大会の かいじょう" };
  }
  if (!flag("latetteBack")) {
    return { map: "mount2", x: 7, y: 3, name: "やまの おくちの ラテット" };
  }
  return { done: true, name: "ものがたりの もくてきは たっせいした！" };
}

function destinations(mapId) {
  const map = MAPS[mapId];
  if (!map) return [];
  const out = [];
  for (const w of map.warps || []) {
    let to = w.to;
    if (to === "@back") to = State.save.backTo && State.save.backTo.map;
    if (to && MAPS[to]) out.push({ to, x: w.x, y: w.y });
  }
  return out;
}

// いまの マップから もくてきの マップまで BFS し、さいしょの でぐちを かえす。
export function compassWaypoint(mapId) {
  const objective = nextObjective();
  if (!objective || objective.done) return objective;
  if (objective.map === mapId) return objective;

  const queue = [{ map: mapId, first: null }];
  const seen = new Set([mapId]);
  while (queue.length) {
    const cur = queue.shift();
    for (const edge of destinations(cur.map)) {
      if (seen.has(edge.to)) continue;
      const first = cur.first || edge;
      if (edge.to === objective.map) {
        return { map: mapId, x: first.x, y: first.y, name: objective.name, via: edge.to };
      }
      seen.add(edge.to);
      queue.push({ map: edge.to, first });
    }
  }
  return null;
}

export function compassSummary() {
  const objective = nextObjective();
  if (!objective) return ["リーフ・コンパスは まだ つかえない。"];
  if (objective.done) return [objective.name, "やじるしを OFFに しました。"];
  const map = MAPS[objective.map];
  return [
    "つぎの もくてき：" + objective.name,
    "ばしょ：" + (map ? map.name : objective.map),
  ];
}
