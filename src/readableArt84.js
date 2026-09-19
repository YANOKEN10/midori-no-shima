import {READABLE84,FURNITURE84,readableKey84} from './readableCatalog84.mjs';
const images={};for(const key of [...READABLE84,...FURNITURE84.map(p=>p.key)]){const im=new Image();im.src=new URL('../assets/readable-v84/'+key+'.png',import.meta.url).href;images[key]=im;}
export const readableReady84=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth>0);
export function drawReadable84(c,key,x,y,w,h){const im=images[readableKey84(key)];if(!im)return false;if(im.complete&&im.naturalWidth){const s=Math.min(w/im.width,h/im.height),dw=im.width*s,dh=im.height*s;c.imageSmoothingEnabled=false;c.drawImage(im,x+(w-dw)/2,y+h-dh,dw,dh);}return true;}
