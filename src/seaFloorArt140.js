import {seaFloor140} from './seaFloor140.mjs';
const sea=new Image();sea.src=new URL('../assets/marine-v26/sea.png',import.meta.url).href;
const beachSea231=new Image();beachSea231.src=new URL('../assets/environment-v132/sea.png',import.meta.url).href;
export const seaReady140=()=>sea.complete&&sea.naturalWidth>0&&beachSea231.complete&&beachSea231.naturalWidth>0;
export function drawSeaFloor140(c,key,x,y){if(!seaFloor140(key))return false;const image=key==='resure-sea231'?beachSea231:sea;if(image.complete&&image.naturalWidth){c.imageSmoothingEnabled=false;const sx=((Math.floor(x/32)%4)+4)%4,sy=((Math.floor(y/32)%4)+4)%4;const size=image.naturalWidth/4;c.drawImage(image,sx*size,sy*size,size,size,x,y,32,32);}return true;}
