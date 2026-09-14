// Remember the outdoor area, rather than the currently playing battle track.
const townMusic={village:'natureTown',marine:'marineTown',karat:'karatTown'};
const sharedRooms=new Set(['hut','lab','hospital','shop','marineHall']);
export function musicArea(maps,mapId,save={}) {
  if(maps[mapId]?.kind==='out')return mapId;
  if(maps[save.bgmArea]?.kind==='out')return save.bgmArea;
  if(sharedRooms.has(mapId)&&maps[save.backTo?.map]?.kind==='out')return save.backTo.map;
  // Older saves have no remembered area: follow room/cave exits to outdoors.
  const queue=[mapId],seen=new Set(queue);
  for(let i=0;i<queue.length;i++)for(const warp of maps[queue[i]]?.warps||[]){
    const id=warp.to;if(maps[id]?.kind==='out')return id;
    if(maps[id]&&!seen.has(id)){seen.add(id);queue.push(id);}
  }
  return null;
}
export function areaBgm(maps,mapId,save={}) {
  return townMusic[musicArea(maps,mapId,save)]||'route';
}
