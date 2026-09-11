import {boardingOpen,SHIP_MAPS,voyageRemaining} from './voyageRules.js';
const names=['shipSeats','shipHelm','daycareHouse','nurseryPen'];
const images=Object.fromEntries(names.map(n=>{const im=new Image();im.src=new URL('../assets/voyage-v28/'+n+'.png',import.meta.url).href;return[n,im];}));
const ferry=new Image();ferry.src=new URL('../assets/power-v27/ferry.png',import.meta.url).href;
export const voyageReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth>0);
export function drawVoyageAsset(c,key,x,y,w,h){const im=images[key];if(!im)return false;if(im.complete&&im.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(im,x,y,w,h);}return true;}
export function drawVoyageTile(c,map,x,y,ch){
 const dx=x*32,dy=y*32,nursery=map.biome==='nursery';
 c.fillStyle=nursery?'#d7bc86':'#b88958';c.fillRect(dx,dy,32,32);
 c.fillStyle=nursery?'#c6aa76':'#997348';c.fillRect(dx,dy+15,32,1);c.fillRect(dx,dy+31,32,1);c.fillRect(dx+(y%2?8:23),dy,1,15);c.fillRect(dx+(y%2?23:8),dy+16,1,15);
 if(!nursery&&x>=14&&x<=18){c.fillStyle=map.openDeck?'#a77b4d':'#355b6b';c.fillRect(dx,dy,32,32);if(x===14||x===18){c.fillStyle='#c8ad71';c.fillRect(dx+(x===14?2:28),dy,2,32);}if(y%2===0){c.fillStyle=map.openDeck?'#b18a59':'#426877';c.fillRect(dx+5,dy+12,22,1);}}
 if(ch==='X'){c.fillStyle=map.openDeck?'#397c94':nursery?'#637c60':'#254c63';c.fillRect(dx,dy,32,32);c.fillStyle=nursery?'#e4d6ae':'#e8ddbe';c.fillRect(dx,dy+5,32,4);c.fillRect(dx,dy+25,32,4);c.fillRect(dx+3,dy,3,32);c.fillStyle='#bc944b';c.fillRect(dx,dy+4,32,1);}
 if(ch==='x'){c.fillStyle='#315e76';c.fillRect(dx+1,dy+1,30,30);c.fillStyle='#d6bb78';c.fillRect(dx+3,dy+3,26,2);c.fillRect(dx+3,dy+27,26,2);}
}
export function drawVoyageOverlay(c,map,camX,camY,save,tick){
 if(!map.sailingPort||!boardingOpen()||!ferry.complete||!ferry.naturalWidth)return;
 for(const p of map.props||[])if(p.art==='ferry')c.drawImage(ferry,p.x*32-camX,p.y*32-camY,p.w*32,p.h*32);
}
export function drawVoyageStatus(c,map,save){
 if(!SHIP_MAPS.includes(map.id)||!save.voyage)return;
 const sec=Math.ceil(voyageRemaining(save)/1000),label=sec?'到着まで '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'):'到着しました';
 c.save();c.fillStyle='rgba(16,43,59,.9)';c.fillRect(204,4,112,20);c.strokeStyle='#cfb975';c.strokeRect(204.5,4.5,111,19);c.fillStyle='#fff3d2';c.font='11px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,260,14);c.restore();
}
