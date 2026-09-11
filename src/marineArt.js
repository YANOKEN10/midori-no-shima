import {drawPowerAsset,powerReady} from './powerArt.js';
import {forestLayout} from './forestArt.js';
const names=['marineHouse','marineHall','marineShop','marinePier','ancientTree','shoreRock','ancientAltar','marineChest','sea','lake','reeds'];
const images=Object.fromEntries(names.map(n=>{const im=new Image();im.src=new URL('../assets/marine-v26/'+n+'.png',import.meta.url).href;return[n,im];}));
export const marineReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth>0)&&powerReady();
export function drawMarineAsset(c,key,x,y,w,h){const im=images[key];if(!im)return drawPowerAsset(c,key,x,y,w,h);if(im.complete&&im.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(im,x,y,w,h);}return true;}
export function marineForest(c,map){for(const p of forestLayout(map))drawMarineAsset(c,map.biome==='flowers'?'flowerTree':'ancientTree',p.x,p.y,p.w,p.h);}
export function drawMarineTile(c,map,x,y,ch){
 if(!map.biome)return false;const dx=x*32,dy=y*32;
 if(ch==='W'||ch==='d'){
  const im=images[map.biome==='coast'?'sea':'lake'];if(im.complete&&im.naturalWidth)c.drawImage(im,(x%4)*32,(y%4)*32,32,32,dx,dy,32,32);
  if(ch==='d'){const deck=images.marinePier;if(deck.complete&&deck.naturalWidth)c.drawImage(deck,8,18,80,28,dx,dy,32,32);
   c.fillStyle='#776448';for(const [ox,oy,a,b]of [[0,0,-1,0],[29,0,1,0],[0,0,0,-1],[0,29,0,1]])if(map.rows[y+b]?.[x+a]==='W'){c.fillRect(dx+ox,dy+oy,a?3:32,a?32:3);c.fillStyle='#baaa7f';c.fillRect(dx+ox,dy+oy,3,3);}}
  else {c.fillStyle=map.biome==='coast'?'#d7ce99':'#527b64';for(const [a,b,ox,oy,w,h]of [[0,-1,0,0,32,3],[0,1,0,29,32,3],[-1,0,0,0,3,32],[1,0,29,0,3,32]]){const t=map.rows[y+b]?.[x+a];if(t&&t!=='W'&&t!=='d')c.fillRect(dx+ox,dy+oy,w,h);}}
  return true;
 }
 return false;
}
export function drawMarineAtmosphere(c,map,camX,camY,tick,save){
 if(map.id==='remoteLake'&&new Set(save.badges||[]).size<4){c.save();const x=16*32-camX,y=-camY;const fog=c.createLinearGradient(0,y,0,y+7*32);fog.addColorStop(0,'rgba(222,236,227,.95)');fog.addColorStop(.55,'rgba(210,230,225,.7)');fog.addColorStop(1,'rgba(210,230,225,0)');c.fillStyle=fog;c.fillRect(x,y,8*32,7*32);c.restore();}
 if(map.id==='marine'&&!save.flags['marine:passed']){c.fillStyle='#704c32';c.fillRect(38*32-camX,18*32-camY,2*32,6);c.fillStyle='#eec56e';for(let i=0;i<6;i++)c.fillRect(38*32-camX+i*11,18*32-camY,6,6);}
}
