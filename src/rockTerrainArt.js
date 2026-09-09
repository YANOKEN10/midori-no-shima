// Reusable generated rocky terrain; names and source crops are in atlas.json.
const image=new Image();image.src=new URL('../assets/terrain-v17/rock-terrain-source.png',import.meta.url).href;
let atlas;fetch(new URL('../assets/terrain-v17/atlas.json',import.meta.url)).then(r=>r.json()).then(a=>atlas=a);
export function drawRockTerrain(ctx,name,x,y,w=32,h=32){
 const tile=atlas?.sprites[name];if(!tile||!image.complete||!image.naturalWidth)return false;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(image,...tile.rect,x,y,w,h);return true;
}
