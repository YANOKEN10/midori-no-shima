// AI生成した背景素材を、ゲーム用の高密度ドット画像として先読みする。
const files = {
  grass: "../assets/environment/pixel/grass-ground.png",
  path: "../assets/environment/pixel/dirt-path.png",
  water: "../assets/environment/pixel/water-surface.png",
  tree: "../assets/environment/pixel/evergreen-tree-v2.png",
};

const images = new Map();
for (const [name, src] of Object.entries(files)) {
  const img = new Image();
  img.decoding = "async";
  img.src = new URL(src, import.meta.url).href;
  images.set(name, img);
}

export function environmentTile(name) {
  const img = images.get(name);
  return img && img.complete && img.naturalWidth ? img : null;
}
