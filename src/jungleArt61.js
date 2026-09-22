import {fitSprite85} from './treeSprite85.js';
import {drawResourceTree85} from './resource80.js';
import {drawTree83} from './activeArt83.js';
import {isTree83} from './treeFootprint83.mjs';
import {drawEditorGround72,editorGroundReady72} from './editorGround72.js';
const sheet=new Image();sheet.src=new URL('../assets/environment-v83/jungle.png',import.meta.url).href;
const floor132=new Image();floor132.src=new URL('../assets/environment-v132/jungle-floor.png',import.meta.url).href;
const frames=[],maps=new WeakMap();
function ready(){return sheet.complete&&sheet.naturalWidth>0;}
function sprite(c,index,x,y,w,h){
 if(!ready())return false;
 if(!frames[index]){const s=sheet.width/2,cv=document.createElement('canvas');cv.width=s;cv.height=sheet.height/2;const g=cv.getContext('2d');g.drawImage(sheet,(index%2)*s,Math.floor(index/2)*cv.height,s,cv.height,0,0,s,cv.height);frames[index]=cv;}
 c.imageSmoothingEnabled=false;if(index===1||index===3)fitSprite85(c,frames[index],x,y,w,h);else c.drawImage(frames[index],x,y,w,h);return true;
}
export function drawJungleFeet61(c,map,x,y){return map.jungle61?sprite(c,2,x,y,32,32):false;}
export function drawForest61(c,map,camX,camY,material){
 if(!map.jungle61&&!(map.maze61&&map.id==='natureforest'))return false;
 if(!ready()||(map.jungle61&&!(floor132.complete&&floor132.naturalWidth)))return false;
 let cv=maps.get(map);if(!cv){cv=document.createElement('canvas');cv.width=map.rows[0].length*32;cv.height=map.rows.length*32;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;let complete=true;
 for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++){
  const ch=map.rows[y][x],dx=x*32,dy=y*32;
  if(map.jungle61){
   // A quiet continuous grass surface, sampled over four tiles per axis.
   const s=floor132.naturalWidth/4;g.drawImage(floor132,(x%4)*s,(y%4)*s,s,s,dx,dy,32,32);
  }else complete=material(g,'grass',dx,dy,32,32)&&complete;
  if(ch==='"'){if(map.jungle61)sprite(g,2,dx,dy,32,32);else complete=material(g,'tallGrass',dx,dy,32,32)&&complete;}
  if(ch==='S')complete=material(g,'sign',dx,dy,32,32)&&complete;
  if(ch==='X'||ch==='R'){complete=material(g,'rock',dx,dy,32,32)&&complete;}
 }
 drawEditorGround72(g,map,material);
 for(const p of map.props){if(isTree83(p)){complete=drawTree83(g,p,map)&&complete;continue;}if(drawResourceTree85(g,map,p))continue;if(['tree','fir'].includes(p.art)){if(map.jungle61)sprite(g,(p.x+p.y)%2?1:3,p.x*32,p.y*32,p.w*32,p.h*32);else {complete=material(g,'tree',p.x*32,p.y*32,p.w*32,p.h*32)&&complete;}}else complete=material(g,p.art,p.x*32,p.y*32,p.w*32,p.h*32)&&complete;}
 if(complete)editorGroundReady72(map)&&maps.set(map,cv);
 }
 c.drawImage(cv,Math.round(-camX),Math.round(-camY));return true;
}
