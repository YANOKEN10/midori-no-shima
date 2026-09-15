import {MAPS} from './data/maps.js';
import {canonicalName} from './data/redesignV47.js';
import {ordinaryEncounters,RARE_RULES} from './rareEncounters.js';
// Only wild encounter sources, never trainer teams or gifts.
const events={'marine:meroron':'メロロン','power:weeklyRaimei':'ライメイ','frontier:volcano':'ヨウガンヌシ','end:ice':'ヒョウガン','end:dark':'ヤミノヌシ','end:rat':'ラテット','end:star':'ホシミノ'};
const habitats=new Map();
function add(name,map){if(!map)return;name=canonicalName(name);if(!habitats.has(name))habitats.set(name,new Set());habitats.get(name).add(map.name);}
for(const map of Object.values(MAPS)){
 for(const [name,,,weight] of ordinaryEncounters(map.enc?.list,map.id))if(weight>0)add(name,map);
 if(map.boatWater&&map.rows.some(row=>row.includes('W')))for(const name of ['サカナビ','ミナモリス'])add(name,map);
 for(const npc of map.npcs||[]){if(events[npc.script])add(events[npc.script],map);if(npc.script==='legend'&&npc.legend?.name)add(npc.legend.name,map);}
}
for(const rule of RARE_RULES)add(rule.name,MAPS[rule.map]);
export function habitatNames(name){return [...(habitats.get(canonicalName(name))||[])];}
export function habitatText(name){return habitatNames(name).join('・')||'野生の出現場所なし';}
