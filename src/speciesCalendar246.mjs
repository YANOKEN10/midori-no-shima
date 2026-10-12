import {SPECIES} from './data/species.js';
// Common early families stay available so calendar gates never require a different season.
export const COMMON246=new Set(['ヒノマシ','トリッピ','ムシコロ','タネコロ','ピリット','シズクン','サカナビ','カニポン']);
const warm=[3,4,5,6,7,8,9,10,11],water=[6,7,8,9,10,11,12,1,2];
export const SPECIES_CALENDAR246=Object.fromEntries(Object.entries(SPECIES).map(([name,s])=>{
 if(COMMON246.has(name))return [name,{label:'通年・終日'}];
 const type=s.types[0],night=s.types.includes('やみ'),hours=night?[18,6]:type==='ひかり'?[5,19]:type==='でんき'?[10,22]:type==='じめん'?[0,24]:[6,20];
 const months=['くさ','むし','ほのお'].includes(type)?warm:type==='みず'?water:undefined;
 const season=months===warm?'春・夏・秋（3〜11月）':months===water?'夏・秋・冬（6〜2月）':'通年';
 return [name,{hours,...(months?{months}:{}),label:season+'・'+(hours[0]===0&&hours[1]===24?'終日':hours[0]+':00〜'+(hours[0]>hours[1]?'翌':'')+hours[1]+':00')+'（日本時間）'}];
}));
