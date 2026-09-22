import {ghostKind139} from './ghost139.mjs';
const images=new Map();
export function ghostFrame139(n,battle=false){const kind=ghostKind139(n);if(!kind)return null;const key=(battle?'battle-':'')+kind;if(!images.has(key)){const im=new Image();im.src=new URL('../assets/ghosts-v139/'+key+'.png',import.meta.url).href;images.set(key,im);}const im=images.get(key);return im.complete&&im.naturalWidth?im:null;}
export function drawGhost139(c,n,tick,x,y){if(!ghostKind139(n))return false;const im=ghostFrame139(n);if(im){c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=.82*(n.ghostAlpha139??1);c.drawImage(im,Math.round(x),Math.round(y+Math.sin(tick/550)*1.5),32,48);c.restore();}return true;}
