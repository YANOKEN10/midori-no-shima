import {fitSprite85} from './treeSprite85.js';
// Designate a few reachable existing trees/rocks. Ordinary scenery is not harvestable.
const cache=new WeakMap(),dirs=[[0,1],[1,0],[0,-1],[-1,0]];
const contains=(p,x,y)=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h;
export function migrateKit80(save){save.bag??={};if(save.bag['つるはし']){save.bag['採掘セット']=(save.bag['採掘セット']||0)+save.bag['つるはし'];delete save.bag['つるはし'];}}
export function resourceNodes80(map){
 if(cache.has(map))return cache.get(map);
 const nodes=[];cache.set(map,nodes);if(map.kind!=='out')return nodes;
 const props=[...map.props||[],...map.editorAddedProps72||[]].map(p=>({...p,w:p.w||1,h:p.h||1}));
 const special=[...map.npcs||[],...map.warps||[],...map.items||[],...map.signs||[]];
 const walk=(x,y)=>!!map.rows[y]?.[x]&&!('TRMW#rwSX=cbtKVPLs'.includes(map.rows[y][x]))&&!props.some(p=>!p.walkable&&contains(p,x,y))&&!special.some(p=>p.x===x&&p.y===y);
 const queue=[],seen=new Set();const start=map.spawn||{x:1,y:1};
 // Find the closest open starting cell (some maps spawn on a doorway).
 let best=null,distance=Infinity;for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++)if(walk(x,y)){const d=Math.abs(x-start.x)+Math.abs(y-start.y);if(d<distance){distance=d;best={x,y};}}
 if(!best)return nodes;queue.push(best);seen.add(best.x+','+best.y);
 for(let i=0;i<queue.length;i++)for(const[dx,dy]of dirs){const x=queue[i].x+dx,y=queue[i].y+dy,k=x+','+y;if(!seen.has(k)&&walk(x,y)){seen.add(k);queue.push({x,y});}}
 const candidates=props.filter(p=>/rock|crag|tree|conifer|broadleaf/i.test(p.art||'')).map(p=>({...p,type:/rock|crag/i.test(p.art)?'rock':'tree'}));
 for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++)if(map.rows[y][x]==='R'&&!props.some(p=>contains(p,x,y)))candidates.push({x,y,w:1,h:1,type:map.rows[y][x]==='T'?'tree':'rock'});
 candidates.sort((a,b)=>Math.abs(a.x-start.x)+Math.abs(a.y-start.y)-Math.abs(b.x-start.x)-Math.abs(b.y-start.y)||a.y-b.y||a.x-b.x);
 for(const p of candidates){if(nodes.filter(n=>n.type===p.type).length>=3||special.some(s=>contains(p,s.x,s.y)))continue;
  let approach=null;for(let y=p.y;y<p.y+p.h&&!approach;y++)for(let x=p.x;x<p.x+p.w&&!approach;x++)for(const[dx,dy]of dirs)if(!contains(p,x+dx,y+dy)&&seen.has((x+dx)+','+(y+dy))){approach={x:x+dx,y:y+dy,tx:x,ty:y};break;}
  if(!approach||nodes.some(n=>Math.abs(n.x-p.x)+Math.abs(n.y-p.y)<4))continue;
  nodes.push({...p,key:p.x+','+p.y,approach});
 }
 return nodes;
}

const blueRock81=new Image();blueRock81.src=new URL('../assets/resources-v81/blue-rock.png',import.meta.url).href;
const blueTree81=new Image();blueTree81.src=new URL('../assets/resources-v85/blue-broadleaf.png',import.meta.url).href;
export function drawResources80(c,map,save,cx,cy){
 c.save();c.imageSmoothingEnabled=false;
 for(const p of resourceNodes80(map)){
  if(p.type==='rock'&&blueRock81.complete&&blueRock81.naturalWidth){const w=p.w*32,h=p.h*32;c.drawImage(blueRock81,p.x*32-cx,p.y*32-cy,w,h);}
 }
 c.restore();
}

export function drawResourceTree85(c,map,p,x=p.x*32,y=p.y*32,w=p.w*32,h=p.h*32){if(!resourceNodes80(map).some(n=>n.type==='tree'&&n.art&&n.x===p.x&&n.y===p.y))return false;if(blueTree81.complete&&blueTree81.naturalWidth)fitSprite85(c,blueTree81,x,y,w,h);return true;}
export const resourceArtReady85=()=>blueTree81.complete&&blueTree81.naturalWidth>0;
