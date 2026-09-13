import {forestLayout} from './forestArt.js';
const images=Object.fromEntries(['fir','tree','rock','crag'].map(name=>{const im=new Image();im.src=new URL('../assets/mountain-v24/'+name+'.png',import.meta.url).href;return[name,im];}));
export const mountainReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth);
export function mountainMaterial(c,key,x,y,w,h){const im=images[key];if(im?.complete&&im.naturalWidth)c.drawImage(im,x,y,w,h);}
// One moss palette under both tree roots and encounter grass, with no bright
// rectangular meadow cutouts beneath each tree.
export function mountainFloor(c,x,y){c.fillStyle='#426b50';c.fillRect(x,y,32,32);for(let i=0;i<7;i++){const dx=(x*3+y+i*13)%29,dy=(x+y*3+i*7)%29;c.fillStyle=i%2?'#4d7657':'#396448';c.fillRect(x+dx,y+dy,3,1);}}
export function mountainTrail(c,map,x,y){
 const near=(dx,dy)=>map.rows[y+dy]?.[x+dx]==='.';
 const l=near(-1,0)?0:2,r=near(1,0)?32:30,t=near(0,-1)?0:2,b=near(0,1)?32:30;
 c.fillStyle='#677653';c.fillRect(x*32+l,y*32+t,r-l,b-t);
 c.fillStyle='#a29a72';c.fillRect(x*32+(l?l+1:0),y*32+(t?t+1:0),r-l-(l?1:0)-(r<32?1:0),b-t-(t?1:0)-(b<32?1:0));
 for(let i=0;i<8;i++){const px=5+(x*7+y*3+i*11)%22,py=5+(x*3+y*13+i*7)%22;c.fillStyle=i%2?'#b3aa80':'#8e8b64';c.fillRect(x*32+px,y*32+py,2,1);}
}
export function mountainForest(c,map){if(!mountainReady())return;for(const p of forestLayout(map))mountainMaterial(c,Math.floor(p.x/64)%3===0?'tree':'fir',p.x,p.y,p.w,p.h);}
