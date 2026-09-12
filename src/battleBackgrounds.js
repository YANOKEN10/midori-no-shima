// Background selection is captured at battle start, never inherited from a previous battle.
export const BACKGROUND_GROUPS = {
 meadow: 'route1 route2 route5 route9 gaonPark flowerPark route11 route18 route19',
 forest: 'natureforest mossSanctuary sunValley',
 mountain: 'mountain kageri mountainAltar',
 lake: 'route4 remoteLake',
 coast: 'route3 marine route6 raden route7 karatPort resurePort route8 route10 resureBeach route12 belerioPort belerio shipDeck',
 snow: 'route13 clearTown route14 momi route15 mountainRail route16 blizzard',
 ice: 'glacier',
 cave: 'shadowDepths',
 volcano: 'volcanicDepths ashRoad volcano1 volcano2 volcano3 volcanoSummit',
 ruins: 'forgottenRuins dark1 dark2 dark3 dark4',
 haunted: 'route17',
 town: 'village rods karat resure manikereo galaxy leafTown',
 interior: 'hut lab hospital shop rodsHome marineHall daycare manikereoStation clearElder',
 factory: 'radenInside',
 arena: 'galaxyArena championTower',
 waterfall: 'merire',
 ship: 'shipLounge shipCabins',
};
const byMap = Object.fromEntries(Object.entries(BACKGROUND_GROUPS).flatMap(([key,ids])=>ids.split(' ').map(id=>[id,key])));
export function battleBackgroundFor(save, opts={}, map={}) {
 if(opts.tournament || opts.facility) return 'arena';
 if(save?.boating && map.boatWater) return 'water';
 return byMap[save?.where?.map] || (map.kind==='in'?'interior':map.kind==='cave'?'cave':'meadow');
}
const images = new Map();
export function prepareBattleBackground(key) {
 if(images.has(key)) return images.get(key).ready;
 // Keep decoded image memory bounded on phones.
 if(images.size>=4) images.delete(images.keys().next().value);
 const image = new Image();
 const record = {image, ready: null};
 record.ready = new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>{images.delete(key);resolve(false)};});
 images.set(key,record);
 image.src = key==='water' ? new URL('../assets/chapter-v37/water-battle.png',import.meta.url).href : new URL('../assets/battle-v38/'+key+'.png',import.meta.url).href;
 return record.ready;
}
export function drawBattleBackground(ctx,key) {
 ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#dce8e0';ctx.fillRect(0,0,320,288);
 const image=images.get(key)?.image;
 if(image?.complete && image.naturalWidth)ctx.drawImage(image,0,0,320,208);
 return true;
}
