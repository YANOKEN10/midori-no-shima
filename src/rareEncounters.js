import {filterWild91} from './wildAvailability91.mjs';
import {canonicalName} from './data/redesignV47.js';
import {scheduledPool} from './scheduledEncounters62.js';
import { MAPS } from './data/maps.js';
export const RARE_RULES = [
 {name:'コケゴロ',map:'mossSanctuary',rate:0.01,min:32,max:36},
 {name:'ジシンヌシ',map:'mountain',rate:0.01,min:40,max:45,spots:3},
];
export const EXCLUSIVE_WILD = new Set(RARE_RULES.map(r=>r.name));
export const EVOLUTION_ONLY = new Set(['ユウレイン','ボウレイ']);
export function ordinaryEncounters(list=[],mapId,now=new Date(),mode='clock'){const pool=list.map(e=>canonicalName(e[0])==='カゲナギ'?['ハヤナギ',Math.min(e[1],32),Math.min(e[2],35),e[3]]:e);if(mapId==='natureforest'&&!pool.some(e=>e[0]==='コノハギ'))pool.push(['コノハギ',8,12,8]);if(mapId==='volcanicDepths'&&!pool.some(e=>e[0]==='ボウエン'))pool.push(['ボウエン',23,28,10]);const available=mode==='clock'?filterWild91(pool,now):pool;return scheduledPool(available.filter(e=>(!EXCLUSIVE_WILD.has(e[0])||(mapId==='mountain'&&e[0]==='コケゴロ'))&&!EVOLUTION_ONLY.has(e[0])),mapId,now,mode);}
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
  const old=existing?.[rule.name],prior=Array.isArray(old)?old:old?[old]:[],chosen=[];
  for(let i=0;i<(rule.spots||1);i++){const pool=options.filter(p=>!chosen.some(q=>q.x===p.x&&q.y===p.y));const valid=prior[i]&&pool.find(p=>p.map===prior[i].map&&p.x===prior[i].x&&p.y===prior[i].y);const picked=valid||pool[Math.floor(random()*pool.length)];if(!picked)throw Error('Insufficient rare tiles');chosen.push(picked);used.add(picked.map+':'+picked.x+':'+picked.y);}
  spots[rule.name]=rule.spots?chosen:chosen[0];
 }
 return {version:2,seed:seed>>>0,spots};
}
export function normalizeRareSpawns(save){
 const old=save.rareSpawns;save.rareSpawns=createRareSpawns(Number.isInteger(old?.seed)?old.seed:undefined,old?.spots);return save.rareSpawns;
}
export function rollRareEncounter(save,mapId,x,y,random=Math.random){
 if(!rareAreasUnlocked(save))return null;
 for(const rule of RARE_RULES){const points=save.rareSpawns?.spots?.[rule.name],spots=Array.isArray(points)?points:points?[points]:[];if(spots.some(p=>p.map===mapId&&p.x===x&&p.y===y)&&random()<rule.rate)return rule;}
 return null;
}
