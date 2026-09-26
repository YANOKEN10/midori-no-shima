import assert from 'node:assert/strict';
import{SPECIES,STAT_KEYS,BALANCE176}from'../src/data/species.js';
import{planBalance176,proportionalBase176,migrateBalanceHp176,LEGENDARY176,LEGEND_TOTALS176}from'../src/data/balance176.mjs';
const source=Object.fromEntries(Object.entries(SPECIES).map(([n,s])=>[n,{...s,base:BALANCE176.before[n]}]));
const raw=JSON.stringify(SPECIES),plan=planBalance176(source),sum=b=>STAT_KEYS.reduce((n,k)=>n+b[k],0),normal=Object.keys(SPECIES).filter(n=>!LEGENDARY176.includes(n));
assert.equal(Object.keys(SPECIES).length,200);assert.equal(plan.oldMax,688);assert.equal(Math.max(...normal.map(n=>sum(plan.after[n]))),600);assert.equal(JSON.stringify(SPECIES),raw);
for(const [n,s]of Object.entries(SPECIES)){const b=plan.before[n],a=plan.after[n];assert.equal(sum(a),plan.targets[n]);for(const k of STAT_KEYS){assert(Number.isInteger(a[k])&&a[k]>0);assert(Math.abs(a[k]-b[k]*sum(a)/sum(b))<1+1e-9,n+' '+k);if(normal.includes(n))assert(a[k]<=b[k]);for(const j of STAT_KEYS)if(b[k]>b[j])assert(a[k]>=a[j],n+' profile');}if(s.evo)assert(sum(a)<sum(plan.after[s.evo.to]),n+' evolution');}
for(const n of LEGENDARY176)assert.equal(sum(plan.after[n]),LEGEND_TOTALS176[n]);
const frozen=planBalance176(source,{legendTotals:null});for(const n of LEGENDARY176)assert.deepEqual(frozen.after[n],source[n].base);
assert.deepEqual(plan.corrections,[{name:'キラル',to:'キラモル',scaledTotal:358,correctedTotal:330}]);
for(const n of ['ヤミオウ','ラテット'])for(const lv of [1,50,100])for(const fraction of [0,.1,.5,1]){const before=plan.before[n],after=plan.after[n],max=b=>Math.floor((2*b.hp+31+63)*lv/100)+lv+10;const m={sp:n,lv,iv:{hp:31},ev:{hp:252},hp:Math.floor(max(before)*fraction),nick:'相棒',moves:['タックル'],status:'poison'};const untouched=JSON.stringify({...m,hp:undefined});migrateBalanceHp176(m,before,after);assert(m.hp>=0&&m.hp<=max(after));assert.equal(m.hp===0,fraction===0||Math.floor(max(before)*fraction)===0);assert.equal(JSON.stringify({...m,hp:undefined,balanceVersion176:undefined}),untouched);const once=JSON.stringify(m);migrateBalanceHp176(m,before,after);assert.equal(JSON.stringify(m),once);}
assert.throws(()=>planBalance176({a:{base:SPECIES.ラテット.base,evo:{to:'b'}},b:{base:SPECIES.ラテット.base,evo:{to:'a'}}}),/cycle/);
assert.deepEqual(Object.fromEntries(Object.entries(SPECIES).map(([n,s])=>[n,s.base])),plan.after);
console.log(JSON.stringify({species:200,normal:197,ratio:plan.ratio,evolutionCorrections:plan.corrections,legendProposal:LEGENDARY176.map(n=>({name:n,old:sum(plan.before[n]),next:plan.after[n],total:sum(plan.after[n])})),hpMigration:'pass'},null,2));
