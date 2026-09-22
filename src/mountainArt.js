import {drawReadable84,readableReady84} from './readableArt84.js';
import {forestLayout} from './forestArt.js';
const images=Object.fromEntries(['fir','tree','rock','crag'].map(name=>{const im=new Image();im.src=new URL('../assets/mountain-v24/'+name+'.png',import.meta.url).href;return[name,im];}));
export const mountainReady=()=>readableReady84()&&Object.values(images).every(im=>im.complete&&im.naturalWidth);
export function mountainMaterial(c,key,x,y,w,h){if(drawReadable84(c,'mountain-v24-'+key,x,y,w,h))return;const im=images[key];if(im?.complete&&im.naturalWidth)c.drawImage(im,x,y,w,h);}
// One moss palette under both tree roots and encounter grass, with no bright
// rectangular meadow cutouts beneath each tree.
export function mountainFloor(c,x,y){c.fillStyle='#426b50';c.fillRect(x,y,32,32);let seed=((x+7919)*374761393^(y+104729)*668265263)>>>0;const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};for(let i=0;i<10;i++){const dx=2+rand(27),dy=3+rand(26);c.fillStyle=i%3?'#507a57':'#365e46';c.fillRect(x+dx,y+dy,3,1);if(i<5){c.fillRect(x+dx+1,y+dy-2,1,2);c.fillRect(x+dx-1,y+dy-1,1,1);}}if(rand(4)===0){const dx=3+rand(22),dy=3+rand(22);c.fillStyle='#66836a';c.fillRect(x+dx,y+dy,3,2);c.fillStyle='#8b9b7b';c.fillRect(x+dx,y+dy,2,1);}for(let i=0;i<3;i++){const dx=rand(29),dy=rand(29);c.fillStyle='#487253';c.fillRect(x+dx,y+dy,4,2);}}
export function mountainTrail(c,map,x,y){
 const near=(dx,dy)=>map.rows[y+dy]?.[x+dx]==='.';
 const l=near(-1,0)?0:2,r=near(1,0)?32:30,t=near(0,-1)?0:2,b=near(0,1)?32:30;
 c.fillStyle='#677653';c.fillRect(x*32+l,y*32+t,r-l,b-t);
 c.fillStyle='#a29a72';c.fillRect(x*32+(l?l+1:0),y*32+(t?t+1:0),r-l-(l?1:0)-(r<32?1:0),b-t-(t?1:0)-(b<32?1:0));
 for(let i=0;i<8;i++){const px=5+(x*7+y*3+i*11)%22,py=5+(x*3+y*13+i*7)%22;c.fillStyle=i%2?'#b3aa80':'#8e8b64';c.fillRect(x*32+px,y*32+py,2,1);}
}
export function mountainForest(c,map){if(map.forestObjects131||!mountainReady())return;for(const p of forestLayout(map))mountainMaterial(c,'fir',Math.floor(p.x/32)*32,Math.floor(p.y/32)*32,64,96);}
