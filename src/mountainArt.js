import {forestLayout} from './forestArt.js';
const images=Object.fromEntries(['fir','tree','rock','crag'].map(name=>{const im=new Image();im.src=new URL('../assets/mountain-v24/'+name+'.png',import.meta.url).href;return[name,im];}));
export const mountainReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth);
export function mountainMaterial(c,key,x,y,w,h){const im=images[key];if(im?.complete&&im.naturalWidth)c.drawImage(im,x,y,w,h);}
export function mountainFloor(c,x,y){c.fillStyle='rgba(17,57,50,.32)';c.fillRect(x,y,32,32);for(let i=0;i<4;i++){const dx=(x*3+y+i*13)%28,dy=(x+y*3+i*7)%28;c.fillStyle=i%2?'#588663':'#3f7657';c.fillRect(x+dx,y+dy,3,1);c.fillRect(x+dx+1,y+dy-1,1,3);}}
export function mountainForest(c,map){if(!mountainReady())return;for(const p of forestLayout(map))mountainMaterial(c,Math.floor(p.x/64)%3===0?'tree':'fir',p.x,p.y,p.w,p.h);}
