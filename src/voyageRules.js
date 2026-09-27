import {allowsMove192} from './moveRules192.mjs';
import {recordBirth} from './frontierRules.js';
import {SPECIES} from './data/species.js';
import {MOVES} from './data/moves.js';
export const SHIP_TICKET='船のチケット',VOYAGE_MS=180000,DAYCARE_STEPS=2000;
import {EXTRA_SHIP123} from './ship123.mjs';
export const SHIP_MAPS=[...EXTRA_SHIP123,'shipDeck','shipLounge','shipCabins','shipCaptain86','shipGalley86'];
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
export function eggMoves(sp){const normal=new Set(SPECIES[sp].learn.map(e=>e[1]));const all=Object.keys(MOVES).filter(n=>!normal.has(n)&&allowsMove192(SPECIES[sp],n));const themed=all.filter(n=>SPECIES[sp].types.includes(MOVES[n].type)&&MOVES[n].pow<=100);return themed.length?themed:all.filter(n=>MOVES[n].pow<=80);}
export function parentOptions(save){return ['party','box'].flatMap(collection=>(save[collection]||[]).map((mon,index)=>({collection,index,mon})));}
export function daycareBaby189(a,b){if(!a||!b||!SPECIES[a]||!SPECIES[b])return null;if(a==='ホシモチ'&&b==='ホシモチ')return null;if(a!=='ホシモチ'&&b!=='ホシモチ')return a===b?a:null;let name=a==='ホシモチ'?b:a;const seen=new Set();while(!seen.has(name)){seen.add(name);const prior=Object.keys(SPECIES).find(n=>SPECIES[n].evo?.to===name);if(!prior)return name;name=prior;}return null;}
export function eligiblePairs(save){const groups={},all=parentOptions(save),stars=all.filter(r=>r.mon.sp==='ホシモチ');for(const ref of all)(groups[ref.mon.sp]||=[]).push(ref);return Object.entries(groups).filter(([n,refs])=>n!=='ホシモチ'&&(refs.length>=2||stars.length)).map(([n,refs])=>[n,[...refs,...stars]]);}
export function checkParents(save,refs){
 if(save.daycare)return 'すでに ガオンを預かっているよ。';
 if(refs.length!==2||refs[0].collection===refs[1].collection&&refs[0].index===refs[1].index)return '違う２匹を 選んでね。';
 const parents=refs.map(r=>['party','box'].includes(r.collection)?save[r.collection]?.[r.index]:null);
 if(parents.some(m=>!m)||!daycareBaby189(parents[0]?.sp,parents[1]?.sp))return '同じ種類の２匹か、ホシモチと別のガオンを選んでね。';
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
 const job=save.daycare;if(!job||withBaby&&daycareRemaining(save)>0)return null;
 if(withBaby)recordBirth(save);
 const mons=[...job.parents,...(withBaby?[job.child]:[])];for(const m of mons)(save.party.length<6?save.party:save.box).push(m);
 save.daycare=null;return mons;
}
export function migrateVoyageSave(save){
 // Keep tickets that players already earned in v27; all new tickets use the professor's check.
 if(save.bag?.['れんらくせんチケット']){save.bag[SHIP_TICKET]=1;delete save.bag['れんらくせんチケット'];save.flags['voyage:ticket']=true;save.flags['voyage:professorMet']=true;}
 save.shipBattles||={};
}
