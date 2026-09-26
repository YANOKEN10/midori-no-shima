export const BALANCE_KEYS176=Object.freeze(['hp','atk','def','spc','sdef','spd']);
export const LEGENDARY176=Object.freeze(['ラテット','ディーナ','メロロン']);
export const LEGEND_TOTALS176=Object.freeze({'ラテット':740,'ディーナ':640,'メロロン':620});
const total=base=>BALANCE_KEYS176.reduce((sum,k)=>sum+base[k],0);
// Largest-remainder allocation keeps the exact total and differs from each ideal
// proportional value by less than one point. Stable key order breaks equal ties.
export function proportionalBase176(base,target){
 if(!Number.isInteger(target)||target<6)throw Error('Invalid base-stat target');
 const sum=total(base);if(BALANCE_KEYS176.some(k=>!Number.isInteger(base[k])||base[k]<=0))throw Error('Invalid source base stats');
 const rows=BALANCE_KEYS176.map((key,index)=>{const ideal=base[key]*target/sum;return{key,index,value:Math.floor(ideal),fraction:ideal%1};});
 if(rows.some(r=>r.value<1))throw Error('Target would remove a stat');
 let left=target-rows.reduce((n,r)=>n+r.value,0);
 for(const r of [...rows].sort((a,b)=>b.fraction-a.fraction||a.index-b.index)){if(!left)break;r.value++;left--;}
 return Object.fromEntries(rows.map(r=>[r.key,r.value]));
}
export function planBalance176(species,{legendTotals=LEGEND_TOTALS176,normalMax=600}={}){
 const names=Object.keys(species),legends=new Set(LEGENDARY176),before=Object.fromEntries(names.map(n=>[n,{...species[n].base}]));
 const oldMax=Math.max(...names.filter(n=>!legends.has(n)).map(n=>total(before[n]))),ratio=normalMax/oldMax;
 const targets=Object.fromEntries(names.map(n=>[n,legends.has(n)?legendTotals?.[n]??total(before[n]):Math.round(total(before[n])*ratio)]));
 const visiting=new Set(),done=new Set(),corrections=[];
 function order(name){if(done.has(name))return;if(visiting.has(name))throw Error('Evolution cycle: '+name);visiting.add(name);const next=species[name].evo?.to;
  if(next){if(!species[next])throw Error('Unknown evolution: '+next);order(next);if(targets[name]>=targets[next]){const corrected=targets[next]-1;if(legends.has(name))throw Error('Legendary total conflicts with evolution');corrections.push({name,to:next,scaledTotal:targets[name],correctedTotal:corrected});targets[name]=corrected;}}
  visiting.delete(name);done.add(name);
 }
 names.forEach(order);
 const after=Object.fromEntries(names.map(n=>[n,proportionalBase176(before[n],targets[n])]));
 return{before,after,targets,oldMax,normalMax,ratio,legendTotals,corrections};
}
// Existing companions retain their current HP percentage, including fainted state.
// Their levels, IVs, EVs, moves, identity and status are not changed.
export function migrateBalanceHp176(mon,before,after){
 if(mon.balanceVersion176===1)return mon;
 if(before&&after&&Number.isFinite(mon.hp)&&mon.lv>0){const max=base=>Math.floor((2*base.hp+(mon.iv?.hp||0)+Math.floor((mon.ev?.hp||0)/4))*mon.lv/100)+mon.lv+10,oldMax=max(before),newMax=max(after);mon.hp=mon.hp<=0?0:Math.max(1,Math.min(newMax,Math.round(Math.min(mon.hp,oldMax)*newMax/oldMax)));}
 mon.balanceVersion176=1;return mon;
}
