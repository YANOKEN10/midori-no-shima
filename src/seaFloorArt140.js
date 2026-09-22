import {seaFloor140} from './seaFloor140.mjs';
const sea=new Image();sea.src=new URL('../assets/marine-v26/sea.png',import.meta.url).href;
export const seaReady140=()=>sea.complete&&sea.naturalWidth>0;
export function drawSeaFloor140(c,key,x,y){if(!seaFloor140(key))return false;if(seaReady140()){c.imageSmoothingEnabled=false;const sx=((Math.floor(x/32)%4)+4)%4,sy=((Math.floor(y/32)%4)+4)%4;c.drawImage(sea,sx*32,sy*32,32,32,x,y,32,32);}return true;}
