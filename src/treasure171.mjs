import {canTraverse75} from './elevation75.mjs';
export const TREASURES171=['こはくのかけら','古代のきんか','ほしの宝石'];
const steps=[[1,0],[-1,0],[0,1],[0,-1]];
// A conservative ground allowlist keeps rewards out of water, walls and furniture.
export function treasureGround171(m,x,y){
 if(![',','.','F','f','g','G','d','n','i','C','D'].includes(m.rows[y]?.[x]))return false;
 return ![...m.props||[],...m.editorAddedProps72||[],...m.landmarks||[]].some(p=>x>=p.x&&x<p.x+(p.w||1)&&y>=p.y&&y<p.y+(p.h||1));
}
export function treasureSpots171(m){
 const queue=[],seen=new Set();
 const add=(x,y)=>{const k=x+','+y;if(seen.has(k)||!treasureGround171(m,x,y))return;seen.add(k);queue.push({x,y});};
 for(const w of m.warps||[])for(const [dx,dy]of [[0,0],...steps])add(w.x+dx,w.y+dy);
 if(!queue.length&&m.spawn)add(m.spawn.x,m.spawn.y);
 for(let i=0;i<queue.length;i++){const q=queue[i];for(const [dx,dy]of steps)if(canTraverse75(m,q.x,q.y,q.x+dx,q.y+dy))add(q.x+dx,q.y+dy);}
 const occupied=[...m.npcs||[],...m.signs||[],...m.objects||[],...m.items||[],...m.warps||[]];
 return queue.filter(p=>p.x>1&&p.y>1&&p.x<m.rows[0].length-2&&p.y<m.rows.length-2&&!occupied.some(o=>Math.abs(o.x-p.x)+Math.abs(o.y-p.y)<3)&&steps.some(([dx,dy])=>seen.has((p.x+dx)+','+(p.y+dy))));
}
export function addTreasures171(maps){
 for(const [id,m] of Object.entries(maps)){
  const route=/^route\d+$/.test(id),dungeon=/洞窟|遺跡|ほらあな/.test(m.name||'');
  if(!route&&!dungeon)continue;
  m.items||=[];
  const count=route?2:3;
  for(let i=0;i<count;i++){
   const flag='treasure171:'+id+':'+i;if(m.items.some(p=>p.flag===flag))continue;
   const spots=treasureSpots171(m);if(!spots.length)break;
   // Stable choice, spread through each reachable map without blocking exits.
   const at=spots[Math.floor(spots.length*(i+1)/(count+1))];
   m.items.push({...at,item:TREASURES171[route?Math.min(i,1):i],flag});
  }
 }
}
