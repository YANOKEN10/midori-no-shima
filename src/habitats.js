import {MAPS} from './data/maps.js';
import {canonicalName} from './data/redesignV47.js';
import {ordinaryEncounters,RARE_RULES} from './rareEncounters.js';
const events={'marine:meroron':'メロロン','power:weeklyRaimei':'ライメイ','frontier:volcano':'ヨウガンヌシ','end:ice':'ヒョウガン','end:dark':'ヤミノヌシ','end:rat':'ラテット','end:star':'ホシミノ'};
const habitats=new Map();
function add(name,map,kind,rate=null){
 if(!map)return;name=canonicalName(name);if(!habitats.has(name))habitats.set(name,[]);
 const entries=habitats.get(name);if(!entries.some(e=>e.mapId===map.id&&e.kind===kind))entries.push({mapId:map.id,mapName:map.name,kind,rate});
}
function addPool(map,list,kind){
 const weights=new Map();for(const [name,,,weight] of list)if(weight>0){const key=canonicalName(name);weights.set(key,(weights.get(key)||0)+weight);}
 const total=[...weights.values()].reduce((a,b)=>a+b,0);
 for(const [name,weight] of weights)add(name,map,kind,weight/total);
}
for(const map of Object.values(MAPS)){
 addPool(map,ordinaryEncounters(map.enc?.list,map.id),'ordinary');
 if(map.boatWater&&map.rows.some(row=>row.includes('W')))addPool(map,[['サカナビ',30,40,50],['ミナモリス',35,45,50]],'water');
 for(const npc of map.npcs||[]){if(events[npc.script])add(events[npc.script],map,'event');if(npc.script==='legend'&&npc.legend?.name)add(npc.legend.name,map,'event');}
}
for(const rule of RARE_RULES)add(rule.name,MAPS[rule.map],'rare',rule.rate);
export function habitatEntries(name){return (habitats.get(canonicalName(name))||[]).map(e=>({...e}));}
export function habitatNames(name){return [...new Set(habitatEntries(name).map(e=>e.mapName))];}
export function habitatRateLabel(entry){
 if(entry.kind==='event')return '条件付きイベント（通常抽選なし）';
 const percent=Number((entry.rate*100).toFixed(2))+'％';
 if(entry.kind==='rare')return '解放後・特定マスの移動判定：'+percent;
 return (entry.kind==='water'?'水上':'通常')+'の遭遇時：'+percent;
}
export function habitatText(name){return habitatEntries(name).map(e=>e.mapName+'（'+habitatRateLabel(e)+'）').join('・')||'野生の出現場所なし';}
