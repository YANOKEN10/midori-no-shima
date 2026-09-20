import {STYLE105} from './styleCatalog105.mjs';
const images=new Map(STYLE105.map(p=>{const im=new Image();im.src=new URL('../assets/style-v105/'+p.key+'.png',import.meta.url).href;return[p.key,im];}));
const aliases={'v41-fence':'fenceHorizontal'};
export function styleKey105(key){const k=key?.replace(/^legacy73-/,'');return aliases[k]||k;}
export const styleReady105=()=>[...images.values()].every(im=>im.complete&&im.naturalWidth>0);
export function drawStyle105(c,key,x,y,w,h){const im=images.get(styleKey105(key));if(!im)return false;if(im.complete&&im.naturalWidth){const scale=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;c.imageSmoothingEnabled=false;c.drawImage(im,Math.round(x+(w-dw)/2),Math.round(y+h-dh),Math.round(dw),Math.round(dh));}return true;}
