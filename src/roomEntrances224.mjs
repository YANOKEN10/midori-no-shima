// Each entrance has two horizontally adjacent trigger cells.
const EXITS={karatSalon:{'@back':[7,13]},daycare:{'@back':[10,17]},shipDeck:{shipLounge:[15,3]},shipLounge:{shipDeck:[15,20],shipCaptain86:[15,3],shipGalley86:[2,11],shipCabins:[28,11]},shipCabins:{shipLounge:[0,11],shipCorridor123:[15,2]}};
export function applyRoomEntrances224(map,doc){
 if(!doc.roomEntrances224||!EXITS[map.id])return;
 map.roomEntrances224=true;
 map.warps=map.warps.filter(w=>!w.entranceLane224).flatMap(w=>{const p=EXITS[map.id][w.to];if(!p)return [w];return [0,1].map(i=>({...w,x:p[0]+i,y:p[1],...(i?{entranceLane224:true}:{})}));});
 if(map.id==='shipLounge')map.spawn={x:16,y:18};
}
export function connectRoomEntrances224(maps){
 const arrivals={shipDeck:{shipLounge:[16,5]},shipLounge:{shipDeck:[16,18],shipCaptain86:[16,5],shipGalley86:[5,11],shipCabins:[26,11]},shipCabins:{shipLounge:[3,11],shipCorridor123:[15,5]}};
 for(const map of Object.values(maps))for(const w of map.warps||[]){if(!maps[w.to]?.roomEntrances224)continue;const p=arrivals[w.to]?.[map.id];if(p){w.tx=p[0];w.ty=p[1];}}
}
