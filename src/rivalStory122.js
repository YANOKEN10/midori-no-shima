import {G as State} from './state.js';
import {ui} from './ui.js';
import {startBattle,wait} from './battle.js';
import {saveLocal,saveCloud} from './save.js';
import {cloud} from './cloud.js';
import {RIVAL_EVENTS122,RIVAL_APPEARANCE122,rivalLines122,available122,weeklyReady122,sunday122,route122} from './rivalRules122.mjs';
const persist=async()=>{State.dirty=true;saveLocal();if(cloud.signedIn)await saveCloud(true);};
export function enterRival122(w,from){const s=State.save;w.rivalAttempt122=false;if(w.mapId==='marine')s.flags['rival122:marineVisited']=true;if(from==='marine'&&w.map.kind!=='in'&&w.mapId!=='marine'&&available122(s,'marine'))s.flags['rival122:marineExit']=w.mapId;
 w.rivalEntry122=['rods','resure','blizzard','galaxy'].includes(w.mapId)?w.mapId:s.flags['rival122:marineExit']===w.mapId?'marine':null;refreshRival122(w);saveLocal();}
export function refreshRival122(w){for(const n of w.npcs)if(n.rival122){const id=n.script.split(':')[1];n.gone=!available122(State.save,id)||(id==='marine'&&State.save.flags['rival122:marineExit']!==w.mapId);n.noRoam=true;}}
const canStand=(w,n,x,y)=>w.rivalCanStand122(x,y,n)&&Math.hypot(x-w.x,y-w.y)>.8;
async function animate(w,n,path){for(const p of path||[]){const dx=p.x-n.x,dy=p.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';n.moving=true;for(let i=1;i<=4;i++){n.ox=dx*32*i/4;n.oy=dy*32*i/4;n.walkFrame=i%2;await wait(32);}n.x=p.x;n.y=p.y;n.ox=n.oy=0;}n.moving=false;}
async function approach(w,n){const path=route122({x:Math.round(n.x),y:Math.round(n.y)},p=>Math.hypot(p.x-w.x,p.y-w.y)<=1.5,(x,y)=>canStand(w,n,x,y));if(path===null)return false;await animate(w,n,path);const dx=n.x-w.x,dy=n.y-w.y;w.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';n.dir=({up:'down',down:'up',left:'right',right:'left'})[w.dir];return true;}
async function depart(w,n){const path=route122({x:Math.round(n.x),y:Math.round(n.y)},p=>Math.abs(p.x-w.x)>12||Math.abs(p.y-w.y)>9,(x,y)=>canStand(w,n,x,y));if(path)await animate(w,n,path);else{const fallback=route122({x:Math.round(n.x),y:Math.round(n.y)},p=>Math.hypot(p.x-w.x,p.y-w.y)>5,(x,y)=>canStand(w,n,x,y));await animate(w,n,fallback);}n.gone=true;}
// Dependency injection keeps complete win/loss/gift flows testable without a live battle.
export async function runRivalEvent122(w,n,deps={}){const s=State.save,id=n.script.split(':')[1],event=RIVAL_EVENTS122[id],say=deps.say||((lines)=>ui.say(lines)),battle=deps.battle||startBattle,save=deps.persist||persist,leave=deps.depart||depart,now=deps.now||(()=>new Date());if(!event||!available122(s,id))return;
 const old=ui.speaker;ui.speaker=n.displayName||'ライバル';try{
 if(id==='weekly'&&!weeklyReady122(s,now())){await say(['ちょっと考える時間をくれよ！']);return;}
 if(event.team&&!s.party.some(m=>m.hp>0)){await say(['元気なガオンを 連れてきてくれ！']);return;}
 await say(rivalLines122(event.talk,s));if(id==='lab')return;
 if(id==='blizzard'){s.flags['rival122:blizzard']=true;s.bag['ハイパーラグ']=(s.bag['ハイパーラグ']||0)+10;await save();await say(['ハイパーラグを 10個 もらった！']);await say(event.win);await leave(w,n);return;}
 const result=await battle({trainer:{name:n.displayName||'ライバル',appearance79:{...RIVAL_APPEARANCE122},fixedLevels122:true,party:event.team,money:0}});
 if(result!=='win'){if(result==='lose')await w.blackout();await save();w.resumeBgm();return;}
 if(id==='weekly')s.flags['rival122:week']=sunday122(now());else s.flags['rival122:'+id]=true;if(id==='marine')delete s.flags['rival122:marineExit'];await save();await say(rivalLines122(event.win,s));if(id!=='weekly')await leave(w,n);await w.checkEvolution();await save();w.resumeBgm();
 }finally{ui.speaker=old;}}
export function tickRival122(w){if(w.busy||ui.busy||w.moving||w.rivalAttempt122||!w.rivalEntry122)return false;const id=w.rivalEntry122,n=w.npcs.find(n=>n.script==='rival122:'+id&&!n.gone);if(!n||!available122(State.save,id)||RIVAL_EVENTS122[id].team&&!State.save.party.some(m=>m.hp>0))return false;w.rivalAttempt122=true;w.busy=true;(async()=>{if(await approach(w,n))await runRivalEvent122(w,n);})().catch(e=>console.error('Rival event',e)).finally(()=>{w.busy=false;refreshRival122(w);});return true;}
