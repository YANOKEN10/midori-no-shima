// ============================================================
//  「やまの むら」を 立体で 見る ためしの がめん
//   ・地図の もじデータ・タイルの え・木の え・ひとの えは
//     2Dの ゲームの ものを そのまま つかっています
//   ・あたりはんてい も おなじ タイルの データから 作ります
// ============================================================
import * as THREE from "../vendor/three.module.min.js";
import { MAPS } from "../src/data/maps.js";
import { tileFor, solid } from "../src/tiles.js";
import { treeImage } from "../src/trees.js";
import { findHouses } from "../src/props.js";
import * as G from "../src/gfx.js";
import { personFrames, LOOKS } from "../src/data/charart.js";

const MAP = MAPS.village;
const ROWS = MAP.rows;
const MH = ROWS.length, MW = ROWS[0].length;
const TILE = 32;                 // もとの え 1マスの ドットすう
const U = 1;                     // 立体での 1マスの 大きさ

const at = (x, y) => (ROWS[y] && ROWS[y][x]) || "T";

/* ============ 3Dの ようい ============ */
const canvas = document.getElementById("view");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#a8ddf5");
scene.fog = new THREE.Fog("#a8ddf5", 20, 42);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

const sun = new THREE.DirectionalLight(0xfff3d8, 1.15);
sun.position.set(-6, 12, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
const sc = sun.shadow.camera;
sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 40;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xdff0ff, 0x6b8a4a, 0.75));

/* ============ じめん（2Dの タイルの えを 1まいの ぬのに） ============ */
function groundTexture() {
  const cv = document.createElement("canvas");
  cv.width = MW * TILE; cv.height = MH * TILE;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  const group = (ch) => (ch === "," || ch === '"' || ch === "F" || ch === "S" ? "g"
    : ch === "." || ch === "m" || ch === "s" ? "p" : ch === "W" ? "w" : ch);
  for (let y = 0; y < MH; y++) {
    for (let x = 0; x < MW; x++) {
      let ch = at(x, y);
      // 木・たてもの・いわの 下は じめん（くさ）を えがく
      if ("TRr#wD".indexOf(ch) >= 0) ch = ",";
      const gg = group(ch);
      let mask = 0;
      const nb = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8], [1, -1, 16], [1, 1, 32], [-1, 1, 64], [-1, -1, 128]];
      for (const [dx, dy, bit] of nb) {
        let n = at(x + dx, y + dy);
        if ("TRr#wD".indexOf(n) >= 0) n = ",";
        if (group(n) === gg) mask |= bit;
      }
      const vr = ((x * 7 + y * 13 + x * y) >>> 0) % 16;
      c.drawImage(tileFor(ch, 0, MAP.sets, mask, vr, 0, x, y), x * TILE, y * TILE);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(MW * U, MH * U),
  new THREE.MeshLambertMaterial({ map: groundTexture() })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(MW * U / 2, 0, MH * U / 2);
ground.receiveShadow = true;
scene.add(ground);

// はての そらが 見えないように、下に ひろい じめんを しく
const far = new THREE.Mesh(new THREE.PlaneGeometry(90, 90),
  new THREE.MeshLambertMaterial({ color: 0x6fae4a }));
far.rotation.x = -Math.PI / 2;
far.position.set(MW * U / 2, -0.06, MH * U / 2);
far.receiveShadow = true;
scene.add(far);

/* ============ みず（すこし 下げて うごかす） ============ */
const waterMat = new THREE.MeshLambertMaterial({ color: 0x3f8fd8, transparent: true, opacity: 0.88 });
for (let y = 0; y < MH; y++) {
  for (let x = 0; x < MW; x++) {
    if (at(x, y) !== "W") continue;
    const m = new THREE.Mesh(new THREE.BoxGeometry(U, 0.24, U), waterMat);
    m.position.set(x * U + U / 2, -0.1, y * U + U / 2);
    m.receiveShadow = true;
    scene.add(m);
  }
}

/* ============ き（板に え を はって 立てる） ============ */
const treeMats = [];
for (let k = 0; k < 4; k++) {
  const tex = new THREE.CanvasTexture(treeImage(k, true));
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  treeMats.push(new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
}
// 地図の そとにも 木を ならべて、はてが 見えないように する
const OUT = 4;
const trees = [];
for (let y = -OUT; y < MH + OUT; y++) {
  for (let x = -OUT; x < MW + OUT; x++) {
    const outside = (x < 0 || x >= MW || y < 0 || y >= MH);
    if (outside) {
      // そとがわは まばらに 木を おく
      if (((x * 13 + y * 7 + x * y) >>> 0) % 5 === 0) continue;
    } else if (at(x, y) !== "T") continue;
    const k = ((x * 5 + y * 11 + x * y) >>> 0) % 4;
    const h = 2.0 + (k % 2) * 0.25;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(h * 40 / 52, h), treeMats[k]);
    m.position.set(x * U + U / 2, h / 2 - 0.12, y * U + U / 2);
    m.castShadow = true;
    scene.add(m);
    trees.push(m);
  }
}

/* ============ いわ（がけ） ============ */
const rockMat = new THREE.MeshLambertMaterial({ color: 0x9d9484 });
for (let y = 0; y < MH; y++) {
  for (let x = 0; x < MW; x++) {
    if (at(x, y) !== "R") continue;
    const m = new THREE.Mesh(new THREE.BoxGeometry(U, 1.2, U), rockMat);
    m.position.set(x * U + U / 2, 0.6, y * U + U / 2);
    m.castShadow = true; m.receiveShadow = true;
    scene.add(m);
  }
}

/* ============ たてもの（かべの 箱＋やねの さんかく） ============ */
function wallTexture(h) {
  const cv = document.createElement("canvas");
  cv.width = h.w * TILE; cv.height = 64;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  const wall = G.resolve("wall"), wood = G.resolve("wood"), glass = G.resolve("water"), door = G.resolve("door");
  c.fillStyle = wall[1]; c.fillRect(0, 0, cv.width, cv.height);
  c.fillStyle = wall[2];
  for (let y = 6; y < cv.height; y += 8) c.fillRect(0, y, cv.width, 2);
  c.fillStyle = wall[3]; c.fillRect(0, 0, 3, cv.height); c.fillRect(cv.width - 3, 0, 3, cv.height);
  for (const [cx] of h.windows) {
    const x = cx * TILE + 6;
    c.fillStyle = wood[2]; c.fillRect(x - 2, 16, 24, 24);
    c.fillStyle = glass[1]; c.fillRect(x, 18, 20, 20);
    c.fillStyle = wood[2]; c.fillRect(x + 9, 18, 2, 20); c.fillRect(x, 27, 20, 2);
  }
  for (const [cx] of h.doors) {
    const x = cx * TILE + 5;
    c.fillStyle = door[3]; c.fillRect(x - 1, 20, 24, 44);
    c.fillStyle = door[1]; c.fillRect(x, 22, 22, 42);
    c.fillStyle = door[2]; c.fillRect(x + 3, 26, 16, 34);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
function roofTexture(set) {
  const cv = document.createElement("canvas");
  cv.width = 64; cv.height = 64;
  const c = cv.getContext("2d");
  const p = G.resolve(set);
  c.fillStyle = p[1]; c.fillRect(0, 0, 64, 64);
  c.fillStyle = p[2];
  for (let y = 4; y < 64; y += 7) c.fillRect(0, y, 64, 2);
  c.fillStyle = p[0];
  for (let y = 0; y < 64; y += 7) c.fillRect(0, y, 64, 1);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const roofPal = G.resolve((MAP.sets && MAP.sets.r) || "roof");
const roofMat = new THREE.MeshLambertMaterial({ color: roofPal[1] });
for (const h of findHouses(MAP)) {
  const w = h.w * U, d = h.h * U, wallH = 1.15;
  const wallMat = new THREE.MeshLambertMaterial({ map: wallTexture(h) });
  const side = new THREE.MeshLambertMaterial({ color: 0xd8c2a2 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d),
    [side, side, side, side, wallMat, side]);   // まえの めんだけ かべの え
  box.position.set(h.x * U + w / 2, wallH / 2, h.y * U + d / 2);
  box.castShadow = true; box.receiveShadow = true;
  scene.add(box);
  // やね（さんかくの プリズム）
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, Math.SQRT2 * (d / 2 + 0.22), 0.62, 4, 1), roofMat);
  roof.rotation.y = Math.PI / 4;
  roof.scale.x = (w / 2 + 0.22) / (d / 2 + 0.22);
  roof.position.set(box.position.x, wallH + 0.29, box.position.z);
  roof.castShadow = true;
  scene.add(roof);
}

/* ============ ひと（板に え を はって 立てる） ============ */
function personTexture(look) {
  const f = personFrames(LOOKS[look] || LOOKS.boy);
  const rows = f.down[0];
  const cv = document.createElement("canvas");
  cv.width = rows[0].length; cv.height = rows.length;
  const c = cv.getContext("2d");
  const pal = G.resolve(look) || G.resolve("boy");
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x];
      if (ch === "." || ch === " ") continue;
      c.fillStyle = pal[+ch] || pal[3];
      c.fillRect(x, y, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const npcs = [];
for (const n of MAP.npcs || []) {
  const tex = personTexture(n.look);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
  m.position.set(n.x * U + U / 2, 0.45, n.y * U + U / 2);
  scene.add(m);
  npcs.push(m);
}

/* --- 主人公 --- */
const heroFrames = {};
{
  const f = personFrames(LOOKS.player);
  for (const dir of ["down", "up", "left", "right"]) {
    heroFrames[dir] = f[dir].map((rows) => {
      const cv = document.createElement("canvas");
      cv.width = rows[0].length; cv.height = rows.length;
      const c = cv.getContext("2d");
      const pal = G.resolve("player");
      for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
        const ch = rows[y][x];
        if (ch === "." || ch === " ") continue;
        c.fillStyle = pal[+ch] || pal[3];
        c.fillRect(x, y, 1, 1);
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }
}
const hero = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.95),
  new THREE.MeshBasicMaterial({ map: heroFrames.down[0], transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
hero.position.set(7.5, 0.48, 8.5);
scene.add(hero);
// あしもとの かげ
const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 }));
shadow.rotation.x = -Math.PI / 2;
scene.add(shadow);

/* ============ うごかす ============ */
const keys = {};
addEventListener("keydown", (e) => { keys[e.code] = true; });
addEventListener("keyup", (e) => { keys[e.code] = false; });
const pad = { x: 0, y: 0 };
for (const el of document.querySelectorAll("[data-dir]")) {
  const set = (v) => (e) => {
    e.preventDefault();
    const d = el.dataset.dir;
    pad.x = v ? (d === "left" ? -1 : d === "right" ? 1 : 0) : 0;
    pad.y = v ? (d === "up" ? -1 : d === "down" ? 1 : 0) : 0;
  };
  el.addEventListener("pointerdown", set(1));
  el.addEventListener("pointerup", set(0));
  el.addEventListener("pointercancel", set(0));
  el.addEventListener("pointerleave", set(0));
}

function blocked(x, z) {
  const tx = Math.floor(x / U), ty = Math.floor(z / U);
  if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return true;
  const ch = at(tx, ty);
  return solid(ch) || ch === "W";
}
function canGo(x, z) {
  const r = 0.26;
  return !blocked(x - r, z - r) && !blocked(x + r, z - r) && !blocked(x - r, z + r) && !blocked(x + r, z + r);
}

let dir = "down", frame = 0, walkT = 0;
let last = performance.now();
function tick(now) {
  const dt = Math.min(50, now - last); last = now;
  let mx = pad.x, mz = pad.y;
  if (keys.ArrowLeft || keys.KeyA) mx -= 1;
  if (keys.ArrowRight || keys.KeyD) mx += 1;
  if (keys.ArrowUp || keys.KeyW) mz -= 1;
  if (keys.ArrowDown || keys.KeyS) mz += 1;
  const len = Math.hypot(mx, mz);
  if (len > 0) {
    mx /= len; mz /= len;
    const sp = 0.0038 * dt;
    if (canGo(hero.position.x + mx * sp, hero.position.z)) hero.position.x += mx * sp;
    if (canGo(hero.position.x, hero.position.z + mz * sp)) hero.position.z += mz * sp;
    dir = Math.abs(mx) > Math.abs(mz) ? (mx < 0 ? "left" : "right") : (mz < 0 ? "up" : "down");
    walkT += dt;
    if (walkT > 140) { walkT = 0; frame = (frame + 1) % 4; }
  } else { frame = 0; }
  hero.material.map = heroFrames[dir][frame];

  // カメラは ななめ うしろから
  const camTarget = new THREE.Vector3(hero.position.x, 0.9, hero.position.z - 0.6);
  camera.position.lerp(new THREE.Vector3(hero.position.x, 9.2, hero.position.z + 9.6), 0.12);
  camera.lookAt(camTarget);
  sun.position.set(hero.position.x - 6, 12, hero.position.z + 6);
  sun.target.position.copy(hero.position);
  sun.target.updateMatrixWorld();

  // 板の えは いつも こちらを むく
  for (const t of trees) t.quaternion.copy(camera.quaternion);
  for (const n of npcs) n.quaternion.copy(camera.quaternion);
  hero.quaternion.copy(camera.quaternion);
  shadow.position.set(hero.position.x, 0.02, hero.position.z);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();
requestAnimationFrame(tick);

// かいはつ用：がめんが かくれていても えを 出せるように
if (location.hostname === "localhost") window.__v3 = { renderer, scene, camera, hero, tick };
