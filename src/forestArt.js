import {forestLayout} from './forestLayout131.mjs';
export {forestLayout} from './forestLayout131.mjs';
import {fitSprite85} from './treeSprite85.js';
import {isTree83} from './treeFootprint83.mjs';
const tree=new Image();tree.src=new URL('../assets/world-v19/tree.png',import.meta.url).href;
export const forestReady=()=>tree.complete&&tree.naturalWidth;
export function boundaryTree(map,p){const w=map.rows[0].length,h=map.rows.length;return map.forestBorder&&['tree','fir'].includes(p.art)&&(p.x<2||p.x+p.w>w-2||p.y<3||p.y+p.h>h-3);}
// Fit complete crowns between openings. Never clip sprites against road tiles.
export function forestCanopy(c,map){if(map.editor72||!forestReady()||(map.props||[]).some(p=>isTree83(p)&&boundaryTree(map,p)))return;for(const p of forestLayout(map))fitSprite85(c,tree,p.x,p.y,p.w,p.h);}
