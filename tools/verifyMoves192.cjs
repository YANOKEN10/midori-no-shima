const fs=require('fs'),assert=require('assert/strict');
(async()=>{
const {SPECIES}=await import('../src/data/species.js'),{MOVES,newMove}=await import('../src/data/moves.js'),{moveStyle192,alignKnownMoves192,allowsMove192}=await import('../src/moveRules192.mjs'),{ITEMS}=await import('../src/data/items.js'),{GOODS82}=await import('../src/shopCatalog82.mjs'),{PICKUPS138}=await import('../src/pickup138.mjs'),{GIFT_ITEMS111}=await import('../src/npcSettings111.mjs'),{teachMove92,recallableMoves92}=await import('../src/moveLearning92.mjs');
const before=JSON.parse(fs.readFileSync('tools/fixtures/species-before192.json'));const totals={phys:0,spec:0,mixed:0};
for(const [name,sp]of Object.entries(SPECIES)){
 assert.deepEqual(sp.base,before[name].base);assert.deepEqual(sp.learn.filter(([,n])=>MOVES[n].cat==='stat'),before[name].learn.filter(([,n])=>MOVES[n].cat==='stat'));
 const style=moveStyle192(sp);totals[style]++;assert.equal(new Set(sp.learn.map(e=>e[1])).size,sp.learn.length,name);
 const cats=sp.learn.map(([,n])=>MOVES[n].cat);if(style==='mixed')assert.equal(cats.filter(x=>x==='phys').length,cats.filter(x=>x==='spec').length,name);else assert(cats.every(x=>x==='stat'||x===style),name);
 for(const lv of[1,20,100]){const mon={sp:name,lv,moves:before[name].learn.filter(e=>e[0]<=lv).slice(-4).map(([,n])=>({...newMove(n),pp:0}))};alignKnownMoves192(mon,sp);assert(mon.moves.every(m=>allowsMove192(sp,m.name)));assert(mon.moves.every(m=>m.pp===0));const snap=JSON.stringify(mon);alignKnownMoves192(mon,sp);assert.equal(JSON.stringify(mon),snap);assert(recallableMoves92(mon).every(m=>allowsMove192(sp,m.name)));}
}
for(const n of Object.keys(MOVES)){const key='わざじゅもん：'+n;assert.equal(ITEMS[key].move,n);assert(GOODS82.some(e=>e.name===key));assert(PICKUPS138.some(e=>e.pickup138===key));assert(GIFT_ITEMS111.includes(key));}
for(const d of[-20,-19,0,19,20])assert.equal(moveStyle192({base:{atk:100+d,spc:100}}),Math.abs(d)<20?'mixed':d>0?'phys':'spec');
const mixed=Object.keys(SPECIES).find(n=>moveStyle192(SPECIES[n])==='mixed');let consumed=0;const mon={sp:mixed,lv:1,moves:[]},ui={say:async()=>{},ask:async()=>true,choice:async()=>0};assert(await teachMove92(mon,'タックル',ui,()=>consumed++));assert.equal(consumed,1);assert.equal(await teachMove92(mon,'タックル',ui,()=>consumed++),false);assert.equal(consumed,1);ui.ask=async()=>false;assert.equal(await teachMove92(mon,'ブレイド',ui,()=>consumed++),false);assert.equal(consumed,1);
const cat=JSON.parse(fs.readFileSync('api/_friendCatalog.json'));cat.species=SPECIES;fs.writeFileSync('api/_friendCatalog.json',JSON.stringify(cat));console.log({PASS:true,species:Object.keys(SPECIES).length,totals,scrolls:Object.keys(MOVES).length});
})();
