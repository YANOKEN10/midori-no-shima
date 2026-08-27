// ============================================================
//  絵（しゃしん・イラスト）を ドットえに する どうぐ（かいはつ用）
//   1. まわりの はいけいを 見つけて すきとおるように する
//   2. えの ある ところだけを 切り出して、64x64に ちぢめる
//   3. いろを すこない かずに まとめる（にた いろを ひとまとめ）
//   4. まわりに こい ふちを つける
//  かえりち: { pal: ["#rrggbb", ...], rows: ["0.12...", ...] }
// ============================================================

function load(url) {
  return new Promise((ok, ng) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => ng(new Error("よみこめません: " + url));
    im.src = url;
  });
}

function dist2(a, b, i, j) {
  const dr = a[i] - b[j], dg = a[i + 1] - b[j + 1], db = a[i + 2] - b[j + 2];
  return dr * dr + dg * dg + db * db;
}

export async function pixelize(url, opt) {
  const o = Object.assign({ size: 64, colors: 8, bgTol: 60, outline: true }, opt || {});
  const img = await load(url);
  const W = img.naturalWidth, H = img.naturalHeight;
  const c0 = document.createElement("canvas");
  c0.width = W; c0.height = H;
  const g0 = c0.getContext("2d", { willReadFrequently: true });
  g0.drawImage(img, 0, 0);
  const src = g0.getImageData(0, 0, W, H);
  const d = src.data;

  /* --- 1) はいけいを すきとおるように（ふちから ぬりつぶして さがす） --- */
  const corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]];
  const bg = [0, 0, 0];
  for (const [x, y] of corners) {
    const i = (y * W + x) * 4;
    bg[0] += d[i] / 4; bg[1] += d[i + 1] / 4; bg[2] += d[i + 2] / 4;
  }
  const tol2 = o.bgTol * o.bgTol * 3;
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1); }
  for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y); }
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const k = y * W + x;
    if (seen[k]) continue;
    const i = k * 4;
    if (d[i + 3] < 40) { seen[k] = 1; }
    else {
      const dr = d[i] - bg[0], dg = d[i + 1] - bg[1], db = d[i + 2] - bg[2];
      if (dr * dr + dg * dg + db * db > tol2) continue;
      seen[k] = 1;
    }
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  for (let k = 0; k < W * H; k++) if (seen[k]) d[k * 4 + 3] = 0;
  g0.putImageData(src, 0, 0);

  /* --- 2) えの ある ところだけ 切り出す --- */
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (d[(y * W + x) * 4 + 3] < 40) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) throw new Error("えが 見つかりません（はいけいだけ？）");
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

  /* --- 3) 64x64に ちぢめる（たてよこの ひは そのまま） --- */
  const N = o.size;
  const scale = Math.min(N / cw, N / ch);
  const tw = Math.max(1, Math.round(cw * scale)), th = Math.max(1, Math.round(ch * scale));
  const ox = Math.floor((N - tw) / 2), oy = N - th;      // あしもとを 下に そろえる
  const c1 = document.createElement("canvas");
  c1.width = N; c1.height = N;
  const g1 = c1.getContext("2d", { willReadFrequently: true });
  g1.imageSmoothingEnabled = true;
  g1.imageSmoothingQuality = "high";
  g1.drawImage(c0, x0, y0, cw, ch, ox, oy, tw, th);
  const small = g1.getImageData(0, 0, N, N);
  const s = small.data;

  /* --- 4) いろを まとめる（k-means） --- */
  const pts = [];
  for (let k = 0; k < N * N; k++) {
    if (s[k * 4 + 3] < 128) { s[k * 4 + 3] = 0; continue; }
    pts.push(k);
  }
  if (!pts.length) throw new Error("えが 見つかりません");
  const K = Math.min(o.colors, pts.length);
  const cen = new Float64Array(K * 3);
  // はじめの いろは あかるさ じゅんに ばらけさせる
  const sorted = pts.slice().sort((a, b) => {
    const la = s[a * 4] + s[a * 4 + 1] * 2 + s[a * 4 + 2];
    const lb = s[b * 4] + s[b * 4 + 1] * 2 + s[b * 4 + 2];
    return la - lb;
  });
  for (let i = 0; i < K; i++) {
    const p = sorted[Math.floor((i + 0.5) * sorted.length / K)] * 4;
    cen[i * 3] = s[p]; cen[i * 3 + 1] = s[p + 1]; cen[i * 3 + 2] = s[p + 2];
  }
  const owner = new Int32Array(N * N).fill(-1);
  for (let it = 0; it < 12; it++) {
    const sum = new Float64Array(K * 4);
    for (const k of pts) {
      const p = k * 4;
      let best = 0, bd = Infinity;
      for (let i = 0; i < K; i++) {
        const dr = s[p] - cen[i * 3], dg = s[p + 1] - cen[i * 3 + 1], db = s[p + 2] - cen[i * 3 + 2];
        const dd = dr * dr + dg * dg + db * db;
        if (dd < bd) { bd = dd; best = i; }
      }
      owner[k] = best;
      sum[best * 4] += s[p]; sum[best * 4 + 1] += s[p + 1]; sum[best * 4 + 2] += s[p + 2]; sum[best * 4 + 3]++;
    }
    for (let i = 0; i < K; i++) {
      if (!sum[i * 4 + 3]) continue;
      cen[i * 3] = sum[i * 4] / sum[i * 4 + 3];
      cen[i * 3 + 1] = sum[i * 4 + 1] / sum[i * 4 + 3];
      cen[i * 3 + 2] = sum[i * 4 + 2] / sum[i * 4 + 3];
    }
  }

  /* --- 5) ふちを つける --- */
  const CH = "0123456789abcdefghijklmnopqrstuv";
  const grid = [];
  for (let y = 0; y < N; y++) grid.push(new Array(N).fill("."));
  for (const k of pts) grid[(k / N) | 0][k % N] = CH[owner[k]];
  const pal = [];
  for (let i = 0; i < K; i++) {
    pal.push("#" + [cen[i * 3], cen[i * 3 + 1], cen[i * 3 + 2]]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""));
  }
  if (o.outline) {
    // いちばん くらい いろを ふちに つかう（なければ ついかする）
    let dark = 0, dl = Infinity;
    for (let i = 0; i < K; i++) {
      const l = cen[i * 3] + cen[i * 3 + 1] * 2 + cen[i * 3 + 2];
      if (l < dl) { dl = l; dark = i; }
    }
    let oc = CH[dark];
    if (dl > 300) {                       // ぜんぶ あかるい えなら こい いろを つくる
      pal.push("#" + [cen[dark * 3] * 0.35, cen[dark * 3 + 1] * 0.35, cen[dark * 3 + 2] * 0.35]
        .map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""));
      oc = CH[pal.length - 1];
    }
    const before = grid.map((r) => r.slice());
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (before[y][x] === ".") continue;
      const near = (a, b) => (a < 0 || a >= N || b < 0 || b >= N) ? "." : before[b][a];
      if (near(x - 1, y) === "." || near(x + 1, y) === "." || near(x, y - 1) === "." || near(x, y + 1) === ".") grid[y][x] = oc;
    }
  }
  return { pal: pal, rows: grid.map((r) => r.join("").replace(/\.+$/, "")) };
}
