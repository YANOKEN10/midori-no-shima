import {ITEMS} from './data/items.js';
import {treasureSpots171} from './treasure171.mjs';
export const FLOWER_COUNT247=5;
export const flowerDay247=(now=Date.now())=>new Date(now+9*3600000).toISOString().slice(0,10);
// Mining tools can be bought normally; other key items unlock story progression.
export const flowerPool247=()=>Object.keys(ITEMS).filter(n=>ITEMS[n].kind!=='key'||n==='採掘セット');
export function flowerItems247(map,save,now=Date.now()){
 if(map.id!=='flowerPark')return {map,changed:false};
 const today=flowerDay247(now),base={...map,items:(map.items||[]).filter(i=>!i.flower247)};
 let daily=save.flowerDaily247,changed=false;
 if(!daily||daily.day<today){
  let seed=(save.rareSpawns?.seed??12345)>>>0;for(const c of today)seed=(Math.imul(seed,31)+c.charCodeAt(0))>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const pool=flowerPool247(),spots=treasureSpots171(base),items=[];
  for(let i=0;i<FLOWER_COUNT247&&spots.length&&pool.length;i++){
   const at=spots.splice(Math.floor(random()*spots.length),1)[0];
   items.push({...at,item:pool[Math.floor(random()*pool.length)],flag:'flower247:'+i,flower247:true,count:1});
   for(let j=spots.length-1;j>=0;j--)if(Math.abs(spots[j].x-at.x)+Math.abs(spots[j].y-at.y)<2)spots.splice(j,1);
  }
  save.flags||={};for(const k of Object.keys(save.flags))if(k.startsWith('flower247:'))delete save.flags[k];
  daily=save.flowerDaily247={day:today,items};changed=true;
 }
 return {map:{...base,items:[...base.items,...daily.items]},changed};
}
