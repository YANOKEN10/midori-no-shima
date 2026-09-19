import {drawReadable84,readableReady84} from './readableArt84.js';
const roadGrass=new Image();roadGrass.src=new URL('../assets/gardens-v52/grass.png',import.meta.url).href;
let roadBounds=null;
export const isRoadGrass=map=>(/^route(?:[1-9]|1[0-8])$/.test(map.id)||['mountain','natureforest','mossSanctuary'].includes(map.id))&&!['snow','ash'].includes(map.frontierTheme)&&!['dark','ice','snow'].includes(map.endTheme);
import {drawMarineAsset} from './marineArt.js';
const images=Object.fromEntries(['mountain','rural'].map(name=>{const im=new Image();im.src=new URL('../assets/grass-v25/'+name+'.png',import.meta.url).href;return[name,im];}));
export const grassTheme=map=>map.grassStyle||(['ranch','coast','flowers','rail'].includes(map.frontierTheme)?'rural':null)|| (map.id==='mountain'?'mountain':['village','rods','route1','route2','natureforest','mossSanctuary'].includes(map.id)?'rural':null);
export const grassReady=map=>{if(!readableReady84())return false;if(isRoadGrass(map))return roadGrass.complete&&roadGrass.naturalWidth>0;const theme=grassTheme(map);return !theme||images[theme].complete&&images[theme].naturalWidth>0;};
// Shared half-tile tufts bridge adjacent grass cells. The same world-space
// anchors are used by the cached map and the character feet overlay.
export function grassPatches(map,tx,ty){
 const grass=(x,y)=>{const ch=map.rows[y]?.[x];return ch==='"'||map.id==='mountain'&&(ch==='T'||ch==='R');},out=[];
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
 if(grassTheme(map)){drawReadable84(c,'grass-v25-'+grassTheme(map),x,y,32,32);return true;}if(isRoadGrass(map))return drawRoadGrass(c,map,x,y,worldX,worldY);
 const theme=grassTheme(map);if(!map.biome&&!theme)return false;
 const im=images[theme];if(!map.biome&&(!im.complete||!im.naturalWidth))return true;
 c.save();c.beginPath();c.rect(x,y,32,32);c.clip();c.imageSmoothingEnabled=false;
 for(const [px,py]of grassPatches(map,Math.floor(worldX/32),Math.floor(worldY/32))){if(map.biome)drawMarineAsset(c,'reeds',px-worldX+x,py-worldY+y,32,32);else c.drawImage(im,px-worldX+x,py-worldY+y,32,32);}
 c.restore();return true;
}

function drawRoadGrass(c,map,x,y,wx,wy){
 if(!roadGrass.complete||!roadGrass.naturalWidth)return true;
 if(!roadBounds){const cv=document.createElement('canvas');cv.width=roadGrass.width;cv.height=roadGrass.height;const ctx=cv.getContext('2d');ctx.drawImage(roadGrass,0,0);const d=ctx.getImageData(0,0,cv.width,cv.height).data;let l=cv.width,t=cv.height,r=0,b=0;for(let yy=0;yy<cv.height;yy++)for(let xx=0;xx<cv.width;xx++)if(d[(yy*cv.width+xx)*4+3]>128){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}roadBounds=[l,t,r-l+1,b-t+1];}
 c.save();c.beginPath();c.rect(x,y,32,32);c.clip();c.imageSmoothingEnabled=false;
 const tx=Math.floor(wx/32),ty=Math.floor(wy/32);
 // Keep both complete tufts inside the tile, including exposed patch edges.
 for(let yy=ty-1;yy<=ty;yy++)for(let xx=tx-1;xx<=tx+1;xx++)if(map.rows[yy]?.[xx]==='"')for(const off of [0,14])c.drawImage(roadGrass,...roadBounds,x+xx*32-wx,y+yy*32-wy+off,32,18);
 c.restore();return true;
}
