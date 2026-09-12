import {recordBirth} from './frontierRules.js';
import {SPECIES} from './data/species.js';
import {MOVES} from './data/moves.js';
export const SHIP_TICKET='船のチケット',VOYAGE_MS=180000,DAYCARE_STEPS=2000;
export const SHIP_MAPS=['shipDeck','shipLounge','shipCabins'];
export function japanTime(now=new Date()){const d=new Date(now.getTime()+9*3600000);return {day:d.toISOString().slice(0,10),hour:d.getUTCHours()};}
export function boardingOpen(now=new Date()){const h=japanTime(now).hour;return h>=12&&h<17;}
export function registeredCount(save){return Object.entries(save.dexOwn||{}).filter(([name,v])=>v&&SPECIES[name]).length;}
export function hasShipTicket(save){return !!save.bag?.[SHIP_TICKET];}
export function canReceiveTicket(save){return !!save.flags?.['power:passed']&&registeredCount(save)>=15&&!hasShipTicket(save);}
export function voyageRemaining(save,now=Date.now()){return Math.max(0,Number(save.voyage?.arriveAt||0)-now);}
export function voyageDocked(save,now=Date.now()){return !!save.voyage&&voyageRemaining(save,now)===0;}
export function trainerAvailable(save,id,now=new Date()){return save.shipBattles?.[id]!==japanTime(now).day;}
export function markTrainer(save,id,now=new Date()){save.shipBattles||={};save.shipBattles[id]=japanTime(now).day;}
export function daycareRemaining(save){return save.daycare?Math.max(0,save.daycare.readyAt-(save.steps||0)):0;}
export function eggMoves(sp){const normal=new Set(SPECIES[sp].learn.map(e=>e[1]));const all=Object.keys(MOVES).filter(n=>!normal.has(n));const themed=all.filter(n=>SPECIES[sp].types.includes(MOVES[n].type)&&MOVES[n].pow<=100);return themed.length?themed:all.filter(n=>MOVES[n].pow<=80);}
export function parentOptions(save){return ['party','box'].flatMap(collection=>(save[collection]||[]).map((mon,index)=>({collection,index,mon})));}
export function eligiblePairs(save){const groups={};for(const ref of parentOptions(save))(groups[ref.mon.sp]||=[]).push(ref);return Object.entries(groups).filter(([,refs])=>refs.length>=2);}
export function checkParents(save,refs){
 if(save.daycare)return 'すでに ガオンを預かっているよ。';
 if(refs.length!==2||refs[0].collection===refs[1].collection&&refs[0].index===refs[1].index)return '違う２匹を 選んでね。';
 const parents=refs.map(r=>['party','box'].includes(r.collection)?save[r.collection]?.[r.index]:null);
 if(parents.some(m=>!m)||parents[0].sp!==parents[1].sp)return '同じ種類の ガオン２匹を選んでね。';
 if(!save.party.some((m,i)=>m.hp>0&&!refs.some(r=>r.collection==='party'&&r.index===i)))return '旅のために 元気なガオンを１匹 手持ちに残してね。';
 return null;
}
export function depositParents(save,refs,child){
 const error=checkParents(save,refs);if(error)return error;
 const parents=refs.map(r=>save[r.collection][r.index]);
 for(const collection of ['party','box'])for(const r of refs.filter(r=>r.collection===collection).sort((a,b)=>b.index-a.index))save[collection].splice(r.index,1);
 save.daycare={parents,child,readyAt:(save.steps||0)+DAYCARE_STEPS,notified:false};return null;
}
export function reclaimDaycare(save,withBaby){
 recordBirth(save);
 const job=save.daycare;if(!job||withBaby&&daycareRemaining(save)>0)return null;
 const mons=[...job.parents,...(withBaby?[job.child]:[])];for(const m of mons)(save.party.length<6?save.party:save.box).push(m);
 save.daycare=null;return mons;
}
export function migrateVoyageSave(save){
 // Keep tickets that players already earned in v27; all new tickets use the professor's check.
 if(save.bag?.['れんらくせんチケット']){save.bag[SHIP_TICKET]=1;delete save.bag['れんらくせんチケット'];save.flags['voyage:ticket']=true;save.flags['voyage:professorMet']=true;}
 save.shipBattles||={};
}
