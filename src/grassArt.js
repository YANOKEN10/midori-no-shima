import {drawMarineAsset} from './marineArt.js';
const images=Object.fromEntries(['mountain','rural'].map(name=>{const im=new Image();im.src=new URL('../assets/grass-v25/'+name+'.png',import.meta.url).href;return[name,im];}));
export const grassTheme=map=>map.id==='mountain'?'mountain':['village','rods','route1','route2','natureforest','mossSanctuary'].includes(map.id)?'rural':null;
export const grassReady=map=>{const theme=grassTheme(map);return !theme||images[theme].complete&&images[theme].naturalWidth>0;};
// Shared half-tile tufts bridge adjacent grass cells. The same world-space
// anchors are used by the cached map and the character feet overlay.
export function grassPatches(map,tx,ty){
 const grass=(x,y)=>map.rows[y]?.[x]==='"',out=[];
 for(let y=ty-1;y<=ty;y++)for(let x=tx-1;x<=tx;x++){
  if(!grass(x,y))continue;
  out.push([x*32,y*32]);
  if(grass(x+1,y))out.push([x*32+16,y*32]);
  if(grass(x,y+1))out.push([x*32,y*32+16]);
  if(grass(x+1,y)&&grass(x,y+1)&&grass(x+1,y+1))out.push([x*32+16,y*32+16]);
 }
 return out;
}
export function drawBiomeGrass(c,map,x,y,worldX=x,worldY=y){
 const theme=grassTheme(map);if(!map.biome&&!theme)return false;
 const im=images[theme];if(!map.biome&&(!im.complete||!im.naturalWidth))return true;
 c.save();c.beginPath();c.rect(x,y,32,32);c.clip();c.imageSmoothingEnabled=false;
 for(const [px,py]of grassPatches(map,Math.floor(worldX/32),Math.floor(worldY/32))){if(map.biome)drawMarineAsset(c,'reeds',px-worldX+x,py-worldY+y,32,32);else c.drawImage(im,px-worldX+x,py-worldY+y,32,32);}
 c.restore();return true;
}
