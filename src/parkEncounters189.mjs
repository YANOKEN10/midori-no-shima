// Map-scoped weekday/hour schedules, all in Japan time. End hours are exclusive.
export const PARK_NAMES189={
  "gaonPark": [
    "トゲフウ",
    "ハリジク",
    "フウマリ",
    "ジクノバ",
    "カゼイガラ",
    "ジキイバラ"
  ],
  "gaonParkWoods": [
    "ネムイト",
    "クロウツ",
    "イトユリ",
    "ウツロガン",
    "ヨイハンモ",
    "ウツロザン"
  ],
  "gaonParkWetland": [
    "アワムス",
    "アマスポ",
    "シオユイ",
    "スポニワ",
    "ウミムスビ",
    "アマノスダ"
  ],
  "gaonParkFlowers": [
    "ミツネリ",
    "セキマキ",
    "スミツギ",
    "マキカク",
    "ロウオルガ",
    "セキラセン"
  ],
  "gaonParkHill": [
    "オレヒダ",
    "スナサラ",
    "カネヒダ",
    "サラモレ",
    "ヒビキガネ",
    "サラドケイ"
  ]
};
const daySets=[[1,3,5,0],[2,4,6]],hours=[[0,12],[6,18],[12,24]],dayLabels=['月・水・金・日曜日','火・木・土曜日'];
export const PARK_RULES189=Object.fromEntries(Object.entries(PARK_NAMES189).map(([map,names])=>[map,Object.fromEntries(names.map((name,i)=>{const h=hours[Math.floor(i/2)];return[name,{days:daySets[i%2],hours:h,label:dayLabels[i%2]+' '+h[0]+':00〜'+h[1]+':00（日本時間）'}];}))]));
export const parkRule189=(map,name)=>PARK_RULES189[map]?.[name];
export const parkPool189=map=>PARK_NAMES189[map]?.map(name=>[name,21,25,50]);
export function upgradePark189(base,doc){if(!PARK_NAMES189[base.id]||doc.parkEncounters189)return doc;return {...doc,parkEncounters189:true,encounters86:{...(doc.encounters86||base.enc||{}),terrain150:doc.encounters86?.terrain150||base.enc?.terrain150||'land',rate:doc.encounters86?.rate>0?doc.encounters86.rate:23,list:parkPool189(base.id)}};}
