// AI生成した背景素材を、ゲーム用の高密度ドット画像として先読みする。
const files = {
  grass: "../assets/environment/pixel/grass-ground.png",
  path: "../assets/environment/pixel/dirt-path.png",
  water: "../assets/environment/pixel/water-surface.png",
  tree: "../assets/environment/pixel/evergreen-tree-v2.png",
  treeWinter: "../assets/environment/pixel/evergreen-tree-winter.png",
  tallgrass: "../assets/environment/pixel/tall-grass-tile.png",
  rock: "../assets/environment/pixel/field-rock-tile.png",
  mountain: "../assets/environment/pixel/mountain-tile.png",
  roofRed: "../assets/environment/pixel/roof-red.png",
  roofBlue: "../assets/environment/pixel/roof-blue.png",
  roofThatch: "../assets/environment/pixel/roof-thatch.png",
  wallPlaster: "../assets/environment/pixel/wall-plaster.png",
  floorWood: "../assets/environment/pixel/floor-wood.png",
  battleBackground: "../assets/environment/pixel/battle-background.png",
  battleBackgroundWinter: "../assets/environment/pixel/battle-background-winter.png",
  battlePlatform: "../assets/environment/pixel/battle-platform.png",
  battlePlatformWinter: "../assets/environment/pixel/battle-platform-winter.png",
  battlePanel: "../assets/environment/pixel/battle-panel.png",
  snow: "../assets/environment/pixel/snow-ground.png",
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
  alpineCabin: "../assets/environment/pixel/alpine-cabin.png",
  alpineLodge: "../assets/environment/pixel/alpine-lodge.png",
  alpineBoathouse: "../assets/environment/pixel/alpine-boathouse.png",
  alpineWorkshop: "../assets/environment/pixel/alpine-workshop.png",
  alpineHerbalist: "../assets/environment/pixel/alpine-herbalist.png",
  alpineSnowChalet: "../assets/environment/pixel/alpine-snow-chalet.png",
  alpineRailStation: "../assets/environment/pixel/alpine-rail-station.png",
  alpineObservatory: "../assets/environment/pixel/alpine-observatory.png",
  alpineCliff: "../assets/environment/pixel/alpine-cliff.png",
  alpineTerrace: "../assets/environment/pixel/alpine-terrace.png",
  alpineWaterfall: "../assets/environment/pixel/alpine-waterfall.png",
  alpinePond: "../assets/environment/pixel/alpine-pond.png",
  alpineWoodBridge: "../assets/environment/pixel/alpine-wood-bridge.png",
  alpineStoneBridge: "../assets/environment/pixel/alpine-stone-bridge.png",
  alpineTrailSign: "../assets/environment/pixel/alpine-trail-sign.png",
  alpineTrain: "../assets/environment/pixel/alpine-train.png",
  alpineFirCluster: "../assets/environment/pixel/alpine-fir-cluster.png",
  alpineSnowFirCluster: "../assets/environment/pixel/alpine-snow-fir-cluster.png",
  alpineFlowerMeadow: "../assets/environment/pixel/alpine-flower-meadow.png",
  alpineTrailStairs: "../assets/environment/pixel/alpine-trail-stairs.png",
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
