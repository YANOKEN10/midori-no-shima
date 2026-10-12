import {seaFloor140} from './seaFloor140.mjs';
import {drawBeach132,beachReady132} from './beach132.js';
const sea=new Image();sea.src=new URL('../assets/marine-v26/sea.png',import.meta.url).href;
const beachSea231=new Image();beachSea231.src=new URL('../assets/environment-v132/sea.png',import.meta.url).href;
const coast238={frontierTheme:'coast'};
export const seaReady140=()=>sea.complete&&sea.naturalWidth>0&&beachSea231.complete&&beachSea231.naturalWidth>0&&beachReady132(coast238);
export function drawSeaFloor140(c,key,x,y){
 if(key==='resure-shallow238'||key==='resure-sand-edge238'){
  const water=key==='resure-shallow238',sx=4+((Math.floor(x/32)%4)+4)%4,sy=4+((Math.floor(y/32)%4)+4)%4;
  const rows=Array.from({length:10},()=>Array.from({length:10},(_,i)=>i<(water?sx:sx+1)?'S':'W').join(''));
  c.save();c.translate(x-sx*32,y-sy*32);drawBeach132(c,{...coast238,rows},sx,sy,water?'W':'S');c.restore();return true;
 }
 if(!seaFloor140(key))return false;const image=key==='resure-sea231'?beachSea231:sea;if(image.complete&&image.naturalWidth){c.imageSmoothingEnabled=false;const sx=((Math.floor(x/32)%4)+4)%4,sy=((Math.floor(y/32)%4)+4)%4;const size=image.naturalWidth/4;c.drawImage(image,sx*size,sy*size,size,size,x,y,32,32);}return true;
}
