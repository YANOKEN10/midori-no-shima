// Outdoor power-station grass only. All windows use Japan time.
export const RADEN_ENCOUNTERS214={rate:23,terrain150:'grass',percent139:true,list:[['ジリジリ',16,19,30],['ピリット',16,19,25],['トリッピ',15,18,15],['ヨルネコ',17,20,15],['ネコデン',18,22,15]]};
export const RADEN_WINDOWS214={
 'トリッピ':{hours:[6,12],label:'毎日6:00〜12:00（日本時間）'},
 'ヨルネコ':{hours:[18,6],label:'毎日18:00〜翌6:00（日本時間）'},
 'ネコデン':{days:[2,4,6],hours:[0,24],label:'火・木・土曜日（日本時間）'}
};
export const radenRule214=(map,name)=>map==='raden'?RADEN_WINDOWS214[name]:undefined;
export function upgradeRaden214(base,doc){return base.id!=='raden'||doc.radenEncounters214?doc:{...doc,radenEncounters214:true,encounters86:structuredClone(RADEN_ENCOUNTERS214)};}
