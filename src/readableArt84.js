import {drawHarbor140,harborReady140} from './harborArt140.js';
import {drawStyle105,styleReady105} from './styleArt105.js';
import {SCENE86,sceneKey86} from './sceneCatalog86.mjs';
import {READABLE84,FURNITURE84,readableKey84} from './readableCatalog84.mjs';
const images={};for(const key of [...READABLE84,...FURNITURE84.map(p=>p.key),...SCENE86]){const im=new Image();im.src=new URL('../assets/'+(SCENE86.includes(key)?'scene-v86/':'readable-v84/')+key+'.png',import.meta.url).href;images[key]=im;}
export const readableReady84=()=>harborReady140()&&styleReady105()&&Object.values(images).every(im=>im.complete&&im.naturalWidth>0);
export function drawReadable84(c,key,x,y,w,h){if(drawHarbor140(c,key,x,y,w,h))return true;if(drawStyle105(c,key,x,y,w,h))return true;const im=images[sceneKey86(key)]||images[readableKey84(key)];if(!im)return false;if(im.complete&&im.naturalWidth){if(key==='mountain-v24-fir'||key==='eDarkTree'||key==='ship-floor86'||key==='ship-wall86'){c.imageSmoothingEnabled=false;c.drawImage(im,x,y,w,h);return true;}const s=Math.min(w/im.width,h/im.height),dw=im.width*s,dh=im.height*s;c.imageSmoothingEnabled=false;c.drawImage(im,x+(w-dw)/2,y+h-dh,dw,dh);}return true;}
