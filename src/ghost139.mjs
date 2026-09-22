import {personKey119} from './peopleCatalog119.mjs';
export const ghostKind139=n=>{const k=personKey119(n?.variant);return k?.startsWith('ghost139-')?k.slice(9):null;};
export function stepGhost139(n,player,dt){const kind=ghostKind139(n);if(!kind)return;const fade=!n.trainer&&(n.ghostVanish139??(kind==='girl')),distance=Math.hypot(n.x-player.x,n.y-player.y);if(!fade)n.ghostHide139=false;else if(distance<=2)n.ghostHide139=true;else if(distance>=4)n.ghostHide139=false;const delta=Math.max(0,dt)/280;n.ghostAlpha139=Math.max(0,Math.min(1,(n.ghostAlpha139??1)+(n.ghostHide139?-delta:delta)));n.ghostHidden139=n.ghostAlpha139<=.05;}
export const npcBlocks139=n=>!n.gone&&!n.symbol139&&!n.ghostHidden139;
export const validSymbol139=s=>!!s&&typeof s==='object'&&!Array.isArray(s)&&Object.keys(s).every(k=>['min','max'].includes(k))&&Number.isInteger(s.min)&&Number.isInteger(s.max)&&s.min>=1&&s.max>=s.min&&s.max<=100;
export const touchingSymbol139=(n,x,y)=>!!n.symbol139&&!n.gone&&Math.hypot(n.x+(n.ox||0)/32-x,n.y+(n.oy||0)/32-y)<.8;
export async function beginSymbol139(world,n,battle){if(world.busy||n.gone||!validSymbol139(n.symbol139))return false;world.busy=true;n.gone=true;try{await battle();return true;}catch(error){n.gone=false;throw error;}finally{world.busy=false;}}
