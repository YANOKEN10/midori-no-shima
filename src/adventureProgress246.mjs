import {SPECIES} from './data/species.js';
export const DAY246=86400000;
export function ownedGaon246(save){return [...(save.party||[]),...(save.box||[]),...(save.daycare?.parents||[]),...(save.daycare?.child?[save.daycare.child]:[])];}
export function startTime246(save,now=Date.now()){
 const valid=t=>Number.isFinite(t)&&t>0;
 if(valid(save?.adventureStartedAt246))return save.adventureStartedAt246;
 const dates=ownedGaon246(save||{}).map(m=>Number(m.encounter124?.date)).filter(valid);
 return dates.length?Math.min(...dates):now;
}
export function migrateAdventure246(save,original,now=Date.now()){save.adventureStartedAt246=startTime246(original||{},now);return save;}
export function progress246(save,days,kinds,level=0,now=Date.now()){
 const elapsed=Math.max(0,now-startTime246(save,now)),owned=Object.entries(save.dexOwn||{}).filter(([n,v])=>v&&SPECIES[n]).length;
 const hasLevel=!level||[...(save.party||[]),...(save.box||[]),...(save.daycare?.parents||[])].some(m=>SPECIES[m.sp]&&Number(m.lv)>=level);
 return {ready:elapsed>=days*DAY246&&owned>=kinds&&hasLevel,days:Math.floor(elapsed/DAY246),remainingDays:Math.max(0,Math.ceil((days*DAY246-elapsed)/DAY246)),owned,remainingKinds:Math.max(0,kinds-owned),hasLevel};
}
export function progressMessage246(save,days,kinds,level=0,now=Date.now()){
 const p=progress246(save,days,kinds,level,now);
 return ['冒険開始から'+days+'日以上・図鑑'+kinds+'種類以上'+(level?'・レベル'+level+'以上が1匹以上':'')+'が必要です。','経過：'+p.days+'日 ／ 仲間図鑑：'+p.owned+'種類',...(p.remainingDays?['日数は あと'+p.remainingDays+'日です。']:[]),...(p.remainingKinds?['仲間にする種類は あと'+p.remainingKinds+'種類です。']:[]),...(level&&!p.hasLevel?['レベル'+level+'以上のガオンを 1匹以上育ててください。']:[]),'進化で登録した種類も数えます。'];
}
