import {PONDS87,POND_TILES87} from './pondCatalog87.mjs';
const image=new Image();image.src=new URL('../assets/gardens-v52/pond.png',import.meta.url).href;
export const pondReady87=()=>image.complete&&image.naturalWidth>0;
export function drawPond87(c,key,x,y,w,h){const whole=PONDS87.some(p=>p.key===key),tile=POND_TILES87.find(p=>p.key===key);if(!whole&&!tile)return false;if(!pondReady87())return true;c.imageSmoothingEnabled=false;if(whole)c.drawImage(image,x,y,w,h);else c.drawImage(image,tile.sx*image.width/tile.sw,tile.sy*image.height/tile.sh,image.width/tile.sw,image.height/tile.sh,x,y,w,h);return true;}
