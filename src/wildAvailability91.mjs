import {SPECIES_CALENDAR246} from './speciesCalendar246.mjs';
import {SCHEDULED_ENCOUNTERS} from './scheduledEncounters62.js';
import {radenRule214} from './radenEncounters214.mjs';
import {parkRule189} from './parkEncounters189.mjs';
import {canonicalName} from './data/redesignV47.js';
export const WILD_WINDOWS94={
 'カエデリア':{hours:[18,6],label:'毎日18:00〜翌6:00（日本時間）'},
 'コノハギ':{hours:[18,6],label:'毎日18:00〜翌6:00（日本時間）'},
 'リーフィン':{days:[0],hours:[18,24],label:'日曜日18:00〜24:00（日本時間）'},
 'フクモッチ':{days:[1],hours:[15,19],map:'gaonPark',label:'月曜日15:00〜19:00・ガオンパーク限定（日本時間）'},
 'フワクジ':{days:[4],hours:[5,10],label:'木曜日5:00〜10:00（日本時間）'}
};
export const NO_WILD94=new Set(['ハヤナギ','カゲナギ']);
export function wildRule246(name,mapId){name=canonicalName(name);return radenRule214(mapId,name)||parkRule189(mapId,name)||WILD_WINDOWS94[name]||SCHEDULED_ENCOUNTERS.find(r=>r.name===name)||SPECIES_CALENDAR246[name];}
export function wildWindow91(name,mapId){return wildRule246(name,mapId)?.label||null;}
export function wildAvailable91(name,now=new Date(),mapId,ignoreTime=false){
 name=canonicalName(name);if(NO_WILD94.has(name))return false;
 const rule=wildRule246(name,mapId);if(!rule)return true;if(rule.map&&mapId&&mapId!==rule.map)return false;if(ignoreTime)return true;
 const j=new Date(now.getTime()+9*3600000),hour=j.getUTCHours()+j.getUTCMinutes()/60;
 if(rule.days&&!rule.days.includes(j.getUTCDay()))return false;
 if(rule.weekdays&&!rule.weekdays.includes(j.getUTCDay()))return false;
 if(rule.months&&!rule.months.includes(j.getUTCMonth()+1))return false;
 if(!rule.hours)return true;
 const[start,end]=rule.hours;return start<end?hour>=start&&hour<end:hour>=start||hour<end;
}
export const filterWild91=(list,now=new Date(),mapId,ignoreTime=false)=>list.filter(e=>wildAvailable91(e[0],now,mapId,ignoreTime));
