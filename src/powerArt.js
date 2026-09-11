import {powerOutage} from './powerRules.js';
const names=['controlBank','transformers','pipePump','turbine','flowerHouse','powerStation','solarPanels','generator','flowersPink','flowersGold','ferry','flowerTree'];
const images=Object.fromEntries(names.map(n=>{const im=new Image();im.src=new URL('../assets/power-v27/'+n+'.png',import.meta.url).href;return[n,im];}));
export const powerReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth>0);
export function drawPowerAsset(c,key,x,y,w,h){const im=images[key];if(!im)return false;if(im.complete&&im.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(im,x,y,w,h);}return true;}
export function drawIndustrialTile(c,x,y,ch){
 const dx=x*32,dy=y*32;c.fillStyle='#899a9d';c.fillRect(dx,dy,32,32);c.fillStyle='#a5b4b3';c.fillRect(dx+1,dy+1,30,30);c.fillStyle='#74898d';for(const [a,b]of [[3,3],[27,3],[3,27],[27,27]])c.fillRect(dx+a,dy+b,2,2);
 if(ch==='X'){c.fillStyle='#34474e';c.fillRect(dx,dy,32,32);c.fillStyle='#66818a';c.fillRect(dx+2,dy+2,28,22);}
 if(ch==='R'){c.fillStyle='#3e5055';c.fillRect(dx,dy,32,32);c.fillStyle='#d4b361';for(let i=0;i<32;i+=12)c.fillRect(dx+i,dy+29,6,3);}
 if(ch==='x'){c.fillStyle='#365c4b';c.fillRect(dx,dy,32,32);c.fillStyle='#a6d796';c.fillRect(dx+8,dy+12,16,4);c.fillRect(dx+6,dy+10,5,8);}
}
export function drawPowerAtmosphere(c,map,tick,save){
 if(!powerOutage(save))return;
 if(map.id==='radenInside'){c.fillStyle='rgba(5,13,24,.68)';c.fillRect(0,0,320,288);return;}
 if(map.id!=='raden')return;
 c.save();c.fillStyle='rgba(12,25,53,.48)';c.fillRect(0,0,320,288);
 c.strokeStyle='rgba(182,219,244,.65)';c.lineWidth=1;c.beginPath();for(let i=0;i<65;i++){const x=(i*79+tick*.06)%360-20,y=(i*43+tick*.35)%320-20;c.moveTo(x,y);c.lineTo(x-5,y+15);}c.stroke();
 // A single brief flash and a jagged bolt, with several seconds between flashes.
 if(tick%7300<100){c.fillStyle='rgba(227,239,251,.5)';c.fillRect(0,0,320,288);c.strokeStyle='#eefaff';c.lineWidth=2;c.beginPath();c.moveTo(240,0);c.lineTo(222,31);c.lineTo(235,29);c.lineTo(211,67);c.stroke();}c.restore();
}
