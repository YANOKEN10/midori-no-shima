export const NPC_WALK_MS168=650;
export const cleanRivalName168=value=>Array.from(String(value??'').trim()).slice(0,8).join('');
export const rivalName168=(save,fallback='レイジ')=>cleanRivalName168(save?.rivalName168)||fallback;
export async function walkRival168(world,npc,path,pause){
 const map=world.map;
 try{for(const p of path||[]){
  if(world.map!==map)return false;
  const dx=p.x-npc.x,dy=p.y-npc.y;
  npc.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
  npc.toX=p.x;npc.toY=p.y;npc.moving=true;
  for(let frame=1;frame<=40;frame++){
   await pause(NPC_WALK_MS168/40);if(world.map!==map)return false;
   npc.roamProgress=frame/40;npc.ox=dx*32*frame/40;npc.oy=dy*32*frame/40;
   npc.walkFrame=Math.floor(frame/10)%4;
  }
  npc.x=p.x;npc.y=p.y;npc.ox=npc.oy=0;
 }return true;}finally{npc.moving=false;npc.ox=npc.oy=0;npc.walkFrame=0;npc.roamProgress=0;}
}
