// AI生成した背景素材を、ゲーム用の高密度ドット画像として先読みする。
const files = {
  grass: "../assets/environment/pixel/grass-ground.png",
  path: "../assets/environment/pixel/dirt-path.png",
  water: "../assets/environment/pixel/water-surface.png",
  tree: "../assets/environment/pixel/evergreen-tree-v2.png",
  tallgrass: "../assets/environment/pixel/tall-grass-tile.png",
  rock: "../assets/environment/pixel/field-rock-tile.png",
  mountain: "../assets/environment/pixel/mountain-tile.png",
  roofRed: "../assets/environment/pixel/roof-red.png",
  roofBlue: "../assets/environment/pixel/roof-blue.png",
  roofThatch: "../assets/environment/pixel/roof-thatch.png",
  wallPlaster: "../assets/environment/pixel/wall-plaster.png",
  floorWood: "../assets/environment/pixel/floor-wood.png",
  battleBackground: "../assets/environment/pixel/battle-background.png",
  battlePlatform: "../assets/environment/pixel/battle-platform.png",
  battlePanel: "../assets/environment/pixel/battle-panel.png",
  furnitureBed: "../assets/environment/pixel/furniture-bed.png",
  furnitureTable: "../assets/environment/pixel/furniture-table.png",
  furnitureBookshelf: "../assets/environment/pixel/furniture-bookshelf.png",
  furnitureCounter: "../assets/environment/pixel/furniture-counter.png",
  furniturePlant: "../assets/environment/pixel/furniture-plant.png",
  furnitureHealer: "../assets/environment/pixel/furniture-healer.png",
  furnitureComputer: "../assets/environment/pixel/furniture-computer.png",
  personBoy: "../assets/environment/pixel/person-boy.png",
  personGirl: "../assets/environment/pixel/person-girl.png",
  personProf: "../assets/environment/pixel/person-prof.png",
  personOldman: "../assets/environment/pixel/person-oldman.png",
  personNurse: "../assets/environment/pixel/person-nurse.png",
  personClerk: "../assets/environment/pixel/person-clerk.png",
  personSailor: "../assets/environment/pixel/person-sailor.png",
  personHiker: "../assets/environment/pixel/person-hiker.png",
  personLeader1: "../assets/environment/pixel/person-leader1.png",
  personLeader2: "../assets/environment/pixel/person-leader2.png",
  personRival: "../assets/environment/pixel/person-rival.png",
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
