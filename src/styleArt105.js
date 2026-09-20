import {STYLE105} from './styleCatalog105.mjs';
const images=new Map(STYLE105.map(p=>{const im=new Image();im.src=new URL('../assets/style-v105/'+p.key+'.png',import.meta.url).href;return[p.key,im];}));
const aliases={'v41-fence':'fenceHorizontal','garden75-prop-wood-bench':'outdoor-bench105'};
export function styleKey105(key){const k=key?.replace(/^legacy73-/,'');return aliases[k]||k;}
export const styleReady105=()=>[...images.values()].every(im=>im.complete&&im.naturalWidth>0);
export function drawStyle105(c,key,x,y,w,h){const canonical=styleKey105(key),im=images.get(canonical);if(!im)return false;if(im.complete&&im.naturalWidth){if(canonical==='fenceHorizontal'&&w>h*1.05){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let dx=0;dx<w;dx+=h)drawStyle105(c,canonical,x+dx,y,h,h);c.restore();return true;}const scale=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;c.imageSmoothingEnabled=false;c.drawImage(im,Math.round(x+(w-dw)/2),Math.round(y+h-dh),Math.round(dw),Math.round(dh));}return true;}
