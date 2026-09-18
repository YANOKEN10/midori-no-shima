import {GARDEN72} from './gardenCatalog72.mjs';
const images=Object.fromEntries(GARDEN72.map(p=>{const image=new Image();image.src=new URL('../assets/garden-v72/'+p.name+'.png',import.meta.url).href;return[p.art,image];}));
export const gardenReady72=Promise.all(Object.values(images).map(im=>im.decode().catch(()=>{})));
export function drawGarden72(c,p){const im=images[p.art];if(!im)return false;if(!im.complete||!im.naturalWidth)return true;const w=p.w*32,h=p.h*32,scale=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;c.imageSmoothingEnabled=false;c.drawImage(im,p.x*32+(w-dw)/2,p.y*32+h-dh,dw,dh);return true;}
