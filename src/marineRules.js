import {markLegend} from './endgameRules.js';
import {markVolcano} from './frontierRules.js';
import {markRaimeiRelease} from './powerRules.js';
// Calendar rules use Japan time even when the browser is elsewhere.
export const MARINE_EMBLEM='マリンエンブレム';
export const MERORON_BATTLE={catchRate:3,wildFleeRate:.12,escapeDisabled:true};
export function japanClock(now=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 return {day:parts.year+'-'+parts.month+'-'+parts.day,hour:Number(parts.hour)};
}
export function holdsMeroron(save){return [...(save.party||[]),...(save.box||[]),...(save.daycare?.parents||[]),...(save.daycare?.child?[save.daycare.child]:[])].some(m=>m.sp==='メロロン');}
export function meroronAvailable(save,now=new Date()){const t=japanClock(now);return new Set(save.badges||[]).size>=4&&t.hour>=17&&!holdsMeroron(save)&&save.flags?.['marine:meroronDay']!==t.day;}
export function markMeroronDay(save,now=new Date()){save.flags||={};save.flags['marine:meroronDay']=japanClock(now).day;}
export function trialCount(save){return [0,1,2,3].filter(i=>save.flags?.['marine:crab:'+i]).length;}
export function marineVisible(n,save,now=new Date()){
 if(n.hideFlag&&save.flags?.[n.hideFlag])return false;
 if(n.script==='marine:elder')return !!save.flags?.['marine:started']&&trialCount(save)===4;
 if(n.script==='marine:meroron')return meroronAvailable(save,now);
 return true;
}
export function marineGate(wp,save){
 if(wp.requires==='marine:fourEmblems')return new Set(save.badges||[]).size>=4?null:['深い霧で 道が見えない。','エンブレムが４個 集まると','カゲリの林への霧が 晴れる。'];
 if(wp.requires==='marine:passed')return save.flags?.['marine:passed']?null:['５番道路は 工事中です。','エンブレム・テストに合格すると','カラットタウンへ 通れるようになります。'];
 return null;
}
export function releaseMon(save,collection,index,now=new Date()){
 const list=save[collection];if(!['party','box'].includes(collection)||!list?.[index])return null;
 const m=list[index];if(['ラテット','ヤミノヌシ'].includes(m.sp))markLegend(save,m.sp,now);if(m.sp==='ヨウガンヌシ')markVolcano(save,now);if(m.heldItem){save.bag[m.heldItem]=(save.bag[m.heldItem]||0)+1;delete m.heldItem;}if(m.sp==='メロロン')markMeroronDay(save,now);if(m.sp==='ライメイ')markRaimeiRelease(save,now);list.splice(index,1);return m;
}
