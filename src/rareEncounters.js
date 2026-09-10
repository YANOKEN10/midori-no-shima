import { MAPS } from './data/maps.js';
export const RARE_RULES = [
 {name:'コケゴロ',map:'mossSanctuary',rate:0.01,min:32,max:36},
 {name:'オバケシ',map:'forgottenRuins',rate:0.03,min:34,max:38},
 {name:'ムラサキビ',map:'forgottenRuins',rate:0.01,min:40,max:45},
 {name:'ヨウガンヌシ',map:'volcanicDepths',rate:0.01,min:45,max:50},
 {name:'ヤミノヌシ',map:'shadowDepths',rate:0.01,min:50,max:55},
];
export const EXCLUSIVE_WILD = new Set(RARE_RULES.map(r=>r.name));
export const EVOLUTION_ONLY = new Set(['ユウレイン','ボウレイ']);
export function ordinaryEncounters(list=[],mapId){return list.filter(e=>(!EXCLUSIVE_WILD.has(e[0])||(mapId==='mountain'&&e[0]==='コケゴロ'))&&!EVOLUTION_ONLY.has(e[0]));}
export function rareAreasUnlocked(save){return !!save.flags?.['v5:dex'] && MAPS.natureforest.npcs.every((n,i)=>!n.trainer||save.flags?.['beat:natureforest:'+i]);}
export function rareCandidates(mapId){
 const m=MAPS[mapId];if(!m)return [];
 const allowed=new Set([',','.','"','C','H','h','d']);
 const queue=[[m.spawn.x,m.spawn.y]],seen=new Set(),result=[];
 while(queue.length){const [x,y]=queue.pop(),key=x+','+y;if(seen.has(key)||!allowed.has(m.rows[y]?.[x]))continue;seen.add(key);
  if(['"','C'].includes(m.rows[y][x])&&!m.warps.some(w=>Math.abs(w.x-x)+Math.abs(w.y-y)<4)&&!m.npcs.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3))result.push({map:mapId,x,y});
  queue.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);
 }
 return result.sort((a,b)=>a.y-b.y||a.x-b.x);
}
export function createRareSpawns(seed=Math.floor(Math.random()*4294967296),existing={}){
 let value=seed>>>0;const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};
 const spots={},used=new Set();
 for(const rule of RARE_RULES){const options=rareCandidates(rule.map).filter(p=>!used.has(p.map+':'+p.x+':'+p.y));if(!options.length)throw Error('No reachable rare habitat: '+rule.map);
  const old=existing?.[rule.name];const valid=old&&options.find(p=>p.map===old.map&&p.x===old.x&&p.y===old.y);
  const picked=options[Math.floor(random()*options.length)];spots[rule.name]=valid||picked;used.add(spots[rule.name].map+':'+spots[rule.name].x+':'+spots[rule.name].y);
 }
 return {version:1,seed:seed>>>0,spots};
}
export function normalizeRareSpawns(save){
 const old=save.rareSpawns;save.rareSpawns=createRareSpawns(Number.isInteger(old?.seed)?old.seed:undefined,old?.spots);return save.rareSpawns;
}
export function rollRareEncounter(save,mapId,x,y,random=Math.random){
 if(!rareAreasUnlocked(save))return null;
 for(const rule of RARE_RULES){const p=save.rareSpawns?.spots?.[rule.name];if(p&&p.map===mapId&&p.x===x&&p.y===y&&random()<rule.rate)return rule;}
 return null;
}
