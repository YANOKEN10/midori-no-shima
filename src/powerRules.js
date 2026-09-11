import {hasShipTicket,SHIP_MAPS} from './voyageRules.js';
export const KARAT_EMBLEM='カラット・エンブレム';
export const FERRY_TICKET='船のチケット';
export const RAIMEI_BATTLE={catchRate:3};
const DAY=86400000,WEEK=7*DAY,JST=9*3600000;
export function raimeiWindow(now=new Date()){
 const time=now.getTime(),j=new Date(time+JST),day=j.getUTCDay(),hour=j.getUTCHours();
 if(!((day===6||day===0)&&hour>=9&&hour<13||day===6&&hour>=17&&hour<18))return null;
 const start=Date.UTC(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate(),hour>=17?17:9)-JST;
 return {start,end:start+(hour>=17?1:4)*3600000};
}
export function raimeiAvailable(save,now=new Date()){
 return !!save.flags?.['power:passed']&&!!raimeiWindow(now)&&now.getTime()>=Number(save.flags?.['power:raimeiAfter']||0)&&![...(save.party||[]),...(save.box||[]),...(save.daycare?.parents||[]),...(save.daycare?.child?[save.daycare.child]:[])].some(m=>m.sp==='ライメイ');
}
export function markRaimeiVisit(save,now=new Date()){
 const window=raimeiWindow(now);if(window){save.flags||={};save.flags['power:raimeiAfter']=window.start+WEEK;}
}
export function markRaimeiRelease(save,now=new Date()){
 const t=now.getTime(),j=new Date(t+JST),day=j.getUTCDay();
 // Next ISO week, Saturday morning. A release can never reopen this week's visit.
 const monday=Date.UTC(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate())-((day+6)%7)*DAY-JST;
 const nextSaturday=monday+12*DAY+9*3600000;
 save.flags||={};save.flags['power:raimeiAfter']=Math.max(Number(save.flags['power:raimeiAfter']||0),nextSaturday);
}
export function powerOutage(save){return !!save.flags?.['power:outage']&&!save.flags?.['power:restored'];}
export function powerVisible(n,save,now=new Date()){
 if(n.script==='power:storyRaimei')return powerOutage(save);
 if(n.script==='power:weeklyRaimei')return raimeiAvailable(save,now);
 return true;
}
export function powerGate(wp,save){
 if(wp.requires==='power:director'&&!save.flags?.['power:director'])return ['まずは ドアの前の ジネル所長に','バトルで 勝たなければ 入れない。'];
 return null;
}
export function powerTarget(save){
 const f=save.flags||{};
 if(!f['power:briefed'])return {map:'karat',x:17,y:19,name:'カラットタウンで 試験の話を聞こう'};
 if(!f['power:director'])return {map:'raden',x:17,y:14,name:'発電所で ジネルに挑もう'};
 if(!f['power:outage'])return {map:'radenInside',x:4,y:3,name:'発電所の 最奥の宝箱へ'};
 if(!f['power:restored'])return {map:'raden',x:25,y:13,name:'外のライメイを 倒そう'};
 if(!f['power:passed'])return {map:'raden',x:19,y:14,name:'ジネルから エンブレムをもらおう'};
 if(!hasShipTicket(save))return {map:'karat',x:31,y:16,name:'図鑑15種類で スイスはかせから船のチケット'};
 if(SHIP_MAPS.includes(save.where?.map))return {map:'shipDeck',x:14,y:20,name:'船旅を楽しみ 到着したら下船しよう'};
 return {map:'daycare',x:10,y:8,name:'レスレタウンの 育て屋マリオに会おう'};
}
