// All availability windows use Japan time, matching the other calendar events.
export const SCHEDULED_ENCOUNTERS=[
 {name:'タキビィ',map:'natureforest',min:7,max:9,rate:.01,hours:[18,6],label:'18:00〜翌6:00'},
 {name:'ヒバナリ',map:'route1',min:3,max:5,rate:.01,hours:[6,11],label:'6:00〜11:00'},
 {name:'アワミィ',map:'route3',min:8,max:11,rate:.01,weekdays:[1,2],label:'月・火曜日'},
 {name:'ヌシガエル',map:'remoteLake',min:14,max:18,rate:.01,months:[4,5,6,7,8,9],label:'4〜9月'},
 {name:'ウズシオヌシ',map:'route6',medium:'water',min:35,max:40,rate:.01,months:[8],label:'8月限定・水上'},
 {name:'イナヅマル',map:'route6',min:22,max:26,rate:.01,months:[10],label:'10月限定・すぐ逃げる',wildFleeRate:1},
 {name:'スナムシ',map:'route2',min:4,max:6,rate:.01,months:[1,2],label:'1・2月'},
 {name:'モグポン',map:'forgottenRuins',min:16,max:19,rate:.01,months:[12],label:'12月限定'},
 {name:'オニイワ',map:'mountain',min:30,max:34,rate:.01,months:[1,3],label:'1・3月'},
];
export function scheduledAvailable(rule,now=new Date()){
 const j=new Date(now.getTime()+9*60*60*1000),hour=j.getUTCHours(),day=j.getUTCDay(),month=j.getUTCMonth()+1;
 if(rule.hours){const[a,b]=rule.hours;if(!(a>b?hour>=a||hour<b:hour>=a&&hour<b))return false;}
 return (!rule.weekdays||rule.weekdays.includes(day))&&(!rule.months||rule.months.includes(month));
}
export function scheduleForMap(id,medium='land'){return SCHEDULED_ENCOUNTERS.find(r=>r.map===id&&(r.medium||'land')===medium);}
export function scheduledBattleOptions(name){const r=SCHEDULED_ENCOUNTERS.find(r=>r.name===name);return r?.wildFleeRate?{wildFleeRate:r.wildFleeRate}:{};}
export function waterEncounters(mapId,now=new Date(),mode='clock'){return scheduledPool([['サカナビ',30,40,50],['ミナモリス',35,45,50]],mapId,now,mode,'water');}
export function scheduledPool(list,mapId,now=new Date(),mode='clock',medium='land'){
 const base=list.filter(e=>!SCHEDULED_ENCOUNTERS.some(r=>r.name===e[0])),rule=scheduleForMap(mapId,medium);
 if(!rule||mode==='inactive'||mode!=='active'&&!scheduledAvailable(rule,now))return base;
 const total=base.reduce((n,e)=>n+e[3],0);if(!total)return base;
 // Integer weights preserve an exact 1% share with the game's integer RNG.
 return [...base.map(e=>[e[0],e[1],e[2],e[3]*99]),[rule.name,rule.min,rule.max,total]];
}

