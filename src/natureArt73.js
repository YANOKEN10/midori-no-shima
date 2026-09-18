import {NATURE73} from './natureCatalog73.mjs';
import {LEGACY73} from './legacyCatalog73.mjs';
const defs=[...NATURE73,...LEGACY73],images=new Map();
function get(key){const d=defs.find(d=>d.key===key);if(!d)return null;let im=images.get(key);if(!im){im=new Image();im.src=new URL('../'+d.file,import.meta.url).href;images.set(key,im);}return im;}
export function natureReady73(map){return (map.editorGround72||[]).every(t=>{const im=get(t.material);return !im||im.complete&&im.naturalWidth>0;});}
export function drawNature73(c,key,x,y,w,h){const im=get(key);if(!im)return false;if(!im.complete||!im.naturalWidth)return true;c.imageSmoothingEnabled=false;const d=defs.find(d=>d.key===key);if(d.group==='floor'){c.drawImage(im,x,y,w,h);}else if(d.group==='grass'&&key.endsWith('-long')){for(let i=0;i<3;i++){const hh=h*(i===1?1.25:1.05),ww=hh*im.naturalWidth/im.naturalHeight;c.drawImage(im,x+i*w/3+(w/3-ww)/2,y+h-hh,ww,hh);}}else{const maxH=d.group==='grass'?h*(key.endsWith('-short')?.55:key.endsWith('-long')?1.25:.85):h;const scale=Math.min(w/im.naturalWidth,maxH/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;c.drawImage(im,x+(w-dw)/2,y+h-dh,dw,dh);}return true;}
