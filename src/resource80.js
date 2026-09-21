import {fitSprite85} from './treeSprite85.js';
// Designate a few reachable existing trees/rocks. Ordinary scenery is not harvestable.
import {resourceNodes80} from './resourceNodes89.mjs';
export {resourceNodes80};
export function migrateKit80(save){save.bag??={};if(save.bag['つるはし']){save.bag['採掘セット']=(save.bag['採掘セット']||0)+save.bag['つるはし'];delete save.bag['つるはし'];}}
const blueRock81=new Image();blueRock81.src=new URL('../assets/resources-v81/blue-rock.png',import.meta.url).href;
const blueTree81=new Image();blueTree81.src=new URL('../assets/style-v105/resource-tree109.png',import.meta.url).href;
export function drawResources80(c,map,save,cx,cy){
 c.save();c.imageSmoothingEnabled=false;
 for(const p of resourceNodes80(map)){
  if(p.type==='rock'&&blueRock81.complete&&blueRock81.naturalWidth){const w=p.w*32,h=p.h*32;c.drawImage(blueRock81,p.x*32-cx,p.y*32-cy,w,h);}
 }
 c.restore();
}

export function drawResourceTree85(c,map,p,x=p.x*32,y=p.y*32,w=p.w*32,h=p.h*32){if(!(p.resource89&&!/rock|crag/i.test(p.art||''))&&!resourceNodes80(map).some(n=>n.type==='tree'&&n.art&&n.x===p.x&&n.y===p.y))return false;if(blueTree81.complete&&blueTree81.naturalWidth)fitSprite85(c,blueTree81,x,y,w,h);return true;}
export const resourceArtReady85=()=>blueTree81.complete&&blueTree81.naturalWidth>0;
