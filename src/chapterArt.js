// Tile-based rendering of the new material pack. The source atlas is preserved.
import { tileFor } from './tiles.js';
import * as G from './gfx.js';
const atlasImage=new Image();atlasImage.src=new URL('../assets/world-v5/swiss-atlas-v1.png',import.meta.url).href;
let atlas=null;fetch(new URL('../assets/world-v5/atlas.json',import.meta.url)).then(r=>r.json()).then(d=>{atlas=d;}).catch(e=>console.error('Tile atlas:',e));
const cache=new WeakMap();
export function drawMaterial(ctx,key,x,y,w,h){const s=atlas?.sprites[key];if(!s||!atlasImage.complete||!atlasImage.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(atlasImage,...s.rect,x,y,w,h);return true;}
function ground(ctx,id,x,y){if(!drawMaterial(ctx,id,x,y,32,32)){ctx.fillStyle='#75c7a2';ctx.fillRect(x,y,32,32);}}
export function drawChapterMap(ctx,map,camX,camY){
 if(!atlas||!atlasImage.complete||!atlasImage.naturalWidth){ctx.fillStyle='#76c6a1';ctx.fillRect(0,0,G.W,G.H);return true;}
 let cv=cache.get(map);
 if(!cv){cv=document.createElement('canvas');cv.width=map.rows[0].length*32;cv.height=map.rows.length*32;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++){
 const ch=map.rows[y][x],dx=x*32,dy=y*32;
 if(map.kind==='in'){
  c.fillStyle='#c79b65';c.fillRect(dx,dy,32,32);c.fillStyle='#b48a58';c.fillRect(dx,dy+30,32,2);c.fillRect(dx+(y%2?15:0),dy,1,32);
  if(ch==='X'){c.fillStyle='#6e7879';c.fillRect(dx,dy,32,32);c.fillStyle='#bdc7ba';c.fillRect(dx+1,dy+1,30,24);}
  if(ch==='x'){c.fillStyle='#8c514c';c.fillRect(dx,dy,32,32);c.fillStyle='#deb577';c.fillRect(dx+2,dy+3,28,3);}
  continue;
 }
 if(map.kind==='cave'){
  const colors=map.theme==='volcano'?['#5a3d38','#6e4a3a']:map.theme==='shadow'?['#252d40','#343c55']:['#4a4356','#60556c'];
  c.fillStyle=colors[0];c.fillRect(dx,dy,32,32);c.fillStyle=colors[1];
  if(map.theme==='ruins'){c.fillRect(dx+2,dy+3,27,1);c.fillRect(dx+4,dy+6,1,19);c.fillRect(dx+18,dy+24,9,2);}
  else{const n=(x*17+y*31)%23;c.fillRect(dx+3+n%6,dy+5+n%9,7,2);c.fillRect(dx+8+n%7,dy+6+n%9,2,6);c.fillRect(dx+21,dy+22,3,2);c.fillRect(dx+5,dy+26,2,1);}
  if(ch==='X'||ch==='R')drawMaterial(c,'rock',dx,dy,32,32);
  if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);
  if(ch==='W'){c.fillStyle='#a52f1c';c.fillRect(dx,dy,32,32);c.fillStyle='#ffb347';c.fillRect(dx+2,dy+8,19,3);c.fillRect(dx+12,dy+23,18,3);}
  if(ch==='.')ground(c,'path',dx,dy);
  continue;
 }
 const base=ch==='.'?'path':ch==='W'?'river':ch==='H'||ch==='h'?'path':'grass';ground(c,base,dx,dy);
 if(ch==='"')ground(c,'tallGrass',dx,dy);
 if(ch==='F')drawMaterial(c,'flowers',dx+3,dy+3,26,26);
 if(ch==='R')drawMaterial(c,'rock',dx,dy,32,32);
 if(ch==='X')drawMaterial(c,'cliff',dx,dy,32,32);
 if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);
 if(ch==='=')drawMaterial(c,'fenceHorizontal',dx,dy,32,32);
 if(ch==='d'){c.fillStyle='#99754b';c.fillRect(dx,dy,32,32);for(let j=0;j<32;j+=8){c.fillStyle='#d8b67c';c.fillRect(dx+2,dy+j,28,5);}}
 if(ch==='H')drawMaterial(c,'stairs',dx,dy,32,32);
 if(ch==='h'){c.fillStyle='#503f2c';c.fillRect(dx+5,dy,4,32);c.fillRect(dx+23,dy,4,32);for(let j=3;j<32;j+=8){c.fillStyle='#d4ae70';c.fillRect(dx+5,dy+j,22,4);}}
 }
 if(map.kind==='in'){
 const visited=new Set();for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++){
 const ch=map.rows[y][x];if(!'bBtKP'.includes(ch)||visited.has(x+','+y))continue;let w=1,h=1;while(map.rows[y][x+w]===ch)w++;while(map.rows[y+h]?.slice(x,x+w)===ch.repeat(w))h++;
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)visited.add(i+','+j);c.drawImage(tileFor(ch,0,null,255,0,0,x,y),x*32,y*32,w*32,h*32);
 }}
 for(const p of map.props||[]){drawMaterial(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32);if(p.door){const x=p.door.x*32,y=p.door.y*32;c.fillStyle='#453629';c.fillRect(x,y,32,32);c.fillStyle='#936542';c.fillRect(x+3,y+3,26,29);c.fillStyle='#654429';c.fillRect(x+6,y+5,20,20);c.fillStyle='#f2d074';c.fillRect(x+23,y+17,3,3);}}
 cache.set(map,cv);}
 ctx.fillStyle=map.kind==='in'?'#6e7879':'#75c7a2';ctx.fillRect(0,0,G.W,G.H);
 ctx.drawImage(cv,Math.round(-camX),Math.round(-camY));return true;
}
export function drawGrassFeet(ctx,map,px,py,camX,camY){
 const left=px,top=py+8,right=px+32,bottom=py+20;
 for(let y=Math.floor(top/32);y<=Math.floor((bottom-1)/32);y++)for(let x=Math.floor(left/32);x<=Math.floor((right-1)/32);x++){
 if(map.rows[y]?.[x]!=='"')continue;ctx.save();ctx.beginPath();ctx.rect(left-camX,top-camY,32,12);ctx.clip();drawMaterial(ctx,'tallGrass',x*32-camX,y*32-camY,32,32);ctx.restore();}
}
const battleImages={};
export function drawChapterBattle(ctx,terrain){const key=terrain==='river'?'river':'grass';let im=battleImages[key];if(!im){im=battleImages[key]=new Image();im.src=new URL('../assets/world-v5/battle-'+key+'-simple-v2.png',import.meta.url).href;}if(!im.complete||!im.naturalWidth)return false;
 // Background and two platform strips are placed separately to match sprite feet.
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(im,0,0,im.width,Math.floor(im.height*.4),0,0,320,196);
 if(key==='grass'){
 ctx.drawImage(im,850,425,650,168,180,112,136,35);
 ctx.drawImage(im,0,830,1060,194,-5,171,154,28);
 }else{
 ctx.drawImage(im,620,335,860,217,177,110,145,37);
 ctx.drawImage(im,0,700,1080,324,-3,164,160,48);
 }return true;}
