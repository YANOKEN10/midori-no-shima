// Relocate only the entrances of rooms explicitly migrated by the editor.
export function applyRoomEntrances221(map,doc){
 if(!doc.roomEntrances221)return map;
 map.roomEntrances221=true;
 for(const w of map.warps){
  if(map.id==='karatSalon'&&w.to==='@back'){w.x=7;w.y=13;}
  if(map.id==='daycare'&&w.to==='@back'){w.x=10;w.y=17;}
  if(map.id==='shipCabins'&&w.to==='shipLounge'){w.x=0;w.y=11;}
  if(map.id==='shipCabins'&&w.to==='shipCorridor123'){w.x=15;w.y=1;}
 }
 if(map.id==='shipDeck')for(const s of map.signs){if(s.x===18&&s.y===3){s.x=20;s.y=5;}}
 return map;
}
export function connectRoomEntrances221(maps){
 if(!maps.shipCabins?.roomEntrances221)return;
 for(const map of Object.values(maps))for(const w of map.warps||[]){
  if(w.to!=='shipCabins')continue;
  if(map.id==='shipLounge'){w.tx=1;w.ty=11;}
  if(map.id==='shipCorridor123'){w.tx=15;w.ty=2;}
 }
}
