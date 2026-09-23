import {waterPool150} from './encounterTerrain150.mjs';
import {wildWindow91,filterWild91} from './wildAvailability91.mjs';
import {scheduleForMap} from './scheduledEncounters62.js';
import {MAPS} from './data/maps.js';
import {canonicalName} from './data/redesignV47.js';
import {ordinaryEncounters,RARE_RULES} from './rareEncounters.js';
const events={'marine:meroron':'メロロン','power:weeklyRaimei':'ライメイ','frontier:volcano':'ヨウガンヌシ','end:ice':'ヒョウガン','end:dark':'ヤミノヌシ','end:rat':'ラテット','end:star':'ホシミノ','post:deena':'ディーナ'};
const habitats=new Map();
function add(name,map,kind,rate=null){
 if(!map)return;name=canonicalName(name);if(!habitats.has(name))habitats.set(name,[]);
 const entries=habitats.get(name);if(!entries.some(e=>e.mapId===map.id&&e.kind===kind))entries.push({mapId:map.id,mapName:map.name,kind,rate,window91:wildWindow91(name)});
}
function addPool(map,list,kind){
 const weights=new Map();for(const [name,,,weight] of list)if(weight>0){const key=canonicalName(name);weights.set(key,(weights.get(key)||0)+weight);}
 const total=[...weights.values()].reduce((a,b)=>a+b,0);
 for(const [name,weight] of weights){const rule=scheduleForMap(map.id);if(wildWindow91(name)&&kind==='outside-window'&&rule?.hours?.[0]===18&&rule.hours[1]===6)continue;add(name,map,kind,weight/total);}
}
for(const map of Object.values(MAPS)){
 const rule=map.encountersConfigured86?null:scheduleForMap(map.id);
 if(map.encountersConfigured86){addPool(map,filterWild91(map.enc?.list||[],new Date(),map.id,true),'ordinary');}else{
 addPool(map,ordinaryEncounters(map.enc?.list,map.id,new Date(),'inactive'),rule?'outside-window':'ordinary');
 if(rule)addPool(map,ordinaryEncounters(map.enc?.list,map.id,new Date(),'active'),'scheduled');
 }
 if(map.boatWater&&map.rows.some(row=>row.includes('W'))){const rule=map.waterEncountersConfigured150?null:scheduleForMap(map.id,'water');addPool(map,filterWild91(waterPool150(map,new Date(),'inactive'),new Date(),map.id,true),rule?'water-outside-window':'water');if(rule)addPool(map,filterWild91(waterPool150(map,new Date(),'active'),new Date(),map.id,true),'water-scheduled');}
 for(const npc of map.npcs||[]){if(events[npc.script])add(events[npc.script],map,'event');if(npc.script==='legend'&&npc.legend?.name)add(npc.legend.name,map,'event');}
}
for(const rule of RARE_RULES)if(!MAPS[rule.map]?.encountersConfigured86)add(rule.name,MAPS[rule.map],'rare',rule.rate);
export function habitatEntries(name){return (habitats.get(canonicalName(name))||[]).map(e=>({...e}));}
export function habitatNames(name){return [...new Set(habitatEntries(name).map(e=>e.mapName))];}
export function habitatRateLabel(entry){if(entry.window91)return entry.window91+'のみ：遭遇時'+Number((entry.rate*100).toFixed(2))+'％';
 if(entry.kind==='event')return entry.mapId==='leafTown'?'クリア後・虹の研究員の３つの調査を達成・Lv.80':'条件付きイベント（通常抽選なし）';
 const percent=Number((entry.rate*100).toFixed(2))+'％';
 const rule=scheduleForMap(entry.mapId,entry.kind.startsWith('water')?'water':'land');
 if(entry.kind==='scheduled'||entry.kind==='water-scheduled')return rule.label+'：遭遇時'+percent+'（日本時間）';
 if(entry.kind==='outside-window'||entry.kind==='water-outside-window')return rule.label+'以外：'+percent;
 if(entry.kind==='rare'){const r=RARE_RULES.find(r=>r.map===entry.mapId&&r.spots===3);return (r?'解放後・ランダム3マス：':'解放後・特定マスの移動判定：')+percent;}
 return (entry.kind==='water'?'水上':'通常')+'の遭遇時：'+percent;
}
export function habitatText(name){return habitatEntries(name).map(e=>e.mapName+'（'+habitatRateLabel(e)+'）').join('・')||'野生の出現場所なし';}
