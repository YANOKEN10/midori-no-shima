import {canonicalName} from './data/redesignV47.js';
export const WILD_WINDOWS94={
 'カエデリア':{hours:[18,6],label:'毎日18:00〜翌6:00（日本時間）'},
 'コノハギ':{hours:[18,6],label:'毎日18:00〜翌6:00（日本時間）'},
 'リーフィン':{days:[0],hours:[18,24],label:'日曜日18:00〜24:00（日本時間）'},
 'フクモッチ':{days:[1],hours:[15,19],map:'gaonPark',label:'月曜日15:00〜19:00・ガオンパーク限定（日本時間）'},
 'フワクジ':{days:[4],hours:[5,10],label:'木曜日5:00〜10:00（日本時間）'}
};
export const NO_WILD94=new Set(['ハヤナギ','カゲナギ']);
export function wildWindow91(name){return WILD_WINDOWS94[canonicalName(name)]?.label||null;}
export function wildAvailable91(name,now=new Date(),mapId,ignoreTime=false){
 name=canonicalName(name);if(NO_WILD94.has(name))return false;
 const rule=WILD_WINDOWS94[name];if(!rule)return true;if(rule.map&&mapId&&mapId!==rule.map)return false;if(ignoreTime)return true;
 const j=new Date(now.getTime()+9*3600000),hour=j.getUTCHours()+j.getUTCMinutes()/60;
 if(rule.days&&!rule.days.includes(j.getUTCDay()))return false;
 const[start,end]=rule.hours;return start<end?hour>=start&&hour<end:hour>=start||hour<end;
}
export const filterWild91=(list,now=new Date(),mapId,ignoreTime=false)=>list.filter(e=>wildAvailable91(e[0],now,mapId,ignoreTime));
