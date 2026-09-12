import {endTarget} from './endgameRules.js';
export const PARK_SPECIES=['ウリボン','スナボンネ','ワンヒノ','シオマント','ネコデン','ドロヌマ','カマキリン','ハナヤリ','タヌポン','フワクジ'];
export const RESURE_EMBLEM='レスレ・エンブレム',VOLCANO_EMBLEM='マニケレオ・エンブレム';
export const VOLCANO_BATTLE={catchRate:3,escapeDisabled:true};
export function jstDay(now=new Date()){return new Date(now.getTime()+9*3600000).toISOString().slice(0,10);}
export function weekKey(now=new Date()){const d=new Date(now.getTime()+9*3600000);d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
export function rematchAvailable(save,key,daily=false,now=new Date()){return save.trainerDates?.[key]!== (daily?jstDay(now):weekKey(now));}
export function markRematch(save,key,daily=false,now=new Date()){save.trainerDates||={};save.trainerDates[key]=daily?jstDay(now):weekKey(now);}
export function recordParkCatch(save,map,sp){if(map!=='gaonPark'||!PARK_SPECIES.includes(sp))return;save.parkCaught||={};save.parkCaught[sp]=true;}
export function parkCount(save){return PARK_SPECIES.filter(n=>save.parkCaught?.[n]).length;}
export function recordBirth(save){if(save.daycare&&save.steps>=save.daycare.readyAt&&!save.daycare.birthRecorded){save.daycare.birthRecorded=true;save.daycareBirths=(save.daycareBirths||0)+1;}}
export function resureReady(save){return parkCount(save)>=10&&(save.daycareBirths||0)>=1;}
export function holds(save,sp){return [...(save.party||[]),...(save.box||[]),...(save.daycare?.parents||[]),...(save.daycare?.child?[save.daycare.child]:[])].some(m=>m.sp===sp);}
export function volcanoAvailable(save,now=new Date()){const hour=new Date(now.getTime()+9*3600000).getUTCHours();return !!save.flags?.['frontier:volcanoWon']&&hour>=15&&!holds(save,'ヨウガンヌシ')&&save.flags?.['frontier:volcanoDay']!==jstDay(now);}
export function markVolcano(save,now=new Date()){save.flags||={};save.flags['frontier:volcanoDay']=jstDay(now);}
export function frontierGate(wp,s){
 const f=s.flags||{},count=new Set(s.badges||[]).size;
 if(wp.requires==='frontier:five'&&!(s.badges||[]).includes('ハイラス・エンブレム'))return ['警備員「ハイラス・エンブレムが必要です。','今は この先へ進めません。」'];
 if(wp.requires==='frontier:volcano'&&!f['frontier:briefed'])return ['この先は 灰の舞う険しい山道だ。','マニケレオタウンで 試験の話を聞こう。'];
 if(wp.requires==='frontier:snow'&&!f['frontier:volcanoWon'])return ['雪道へ進む前に ヨウガン山の試験に挑もう。'];
 return null;
}
export function frontierTarget(s){const late=endTarget(s);if(late)return late;if(!s.flags?.['power:sailed'])return null;if(!s.flags['frontier:resureWon'])return {map:'resure',x:29,y:20,name:'ガオンパーク10種類と 育て屋で１匹誕生'};if(!s.flags['frontier:briefed'])return {map:'manikereo',x:19,y:23,name:'マニケレオタウンで 試験の話を聞こう'};if(!s.flags['frontier:volcanoWon'])return {map:'volcanoSummit',x:18,y:8,name:'ヨウガン山の ヨウガンヌシに挑もう'};if(!s.flags['frontier:reported'])return {map:'village',x:12,y:19,name:'ネイチャータウンの町長に 報告しよう'};return {map:'clearTown',x:18,y:24,name:'雪のクリアタウンへ'};}
