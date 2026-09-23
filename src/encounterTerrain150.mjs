import {waterEncounters} from './scheduledEncounters62.js';
export function encounterRate150(map,tile,boating=false){
 if(boating&&tile==='W')return map.waterEncountersConfigured150?(map.waterEncounters150?.rate||0):(map.enc?.rate??18);
 const enc=map.enc;if(!enc)return 0;
 const allowed=enc.terrain150==='land'?tile!=='W':enc.terrain150==='grass'?tile==='"':tile==='"'||enc.encAll||(map.kind==='cave'&&tile==='C');
 return allowed?enc.rate:0;
}
export function waterPool150(map,now=new Date(),mode='clock'){return map.waterEncountersConfigured150?(map.waterEncounters150?.list||[]):waterEncounters(map.id,now,mode);}
