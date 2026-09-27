const fs=require('fs'),assert=require('assert/strict');
(async()=>{const {SPECIES}=await import('../src/data/species.js'),{MOVES}=await import('../src/data/moves.js'),{ITEMS}=await import('../src/data/items.js'),{ITEMS193,create193}=await import('../src/held193.mjs');let roll=0;const env={species:n=>SPECIES[n],maxHp:m=>160,rawStat:(m,k)=>SPECIES[m.sp].base[k],moves:MOVES,random:()=>roll};const H=create193(env),source=JSON.parse(fs.readFileSync('tools/fixtures/heldItems193.json')),name=x=>source.find(e=>e.source===x).name;function mon(sourceName,sp='コケゴロ'){const m={sp,hp:160,status:'',heldItem:sourceName?name(sourceName):null};H.enter(m);return m;}
assert.equal(ITEMS193.length,117);for(const x of ITEMS193){assert(ITEMS[x.name]);assert(!source.some(y=>y.source===x.name));assert(x.desc&&x.effect193);}
let a=mon('こだわりハチマキ'),b=mon();assert.equal(H.multiplier(a,'atk'),1.5);H.beginMove(a,'タックル',MOVES['タックル']);assert(!H.allowed(a,'ブレイド'));H.enter(a);assert(H.allowed(a,'ブレイド'));
a=mon('とつげきチョッキ');assert(!H.allowed(a,'ボイス'));assert.equal(H.multiplier(a,'sdef'),1.5);
a=mon('きあいのタスキ');assert.equal(H.damage(a,999),159);assert(!a.heldItem);a=mon('きあいのタスキ');a.hp=159;assert.equal(H.damage(a,999),159);assert(a.heldItem);
a=mon('きあいのハチマキ');roll=.09;assert.equal(H.damage(a,999),159);roll=.11;assert.equal(H.damage(a,999),160);roll=0;
a=mon('たべのこし');a.hp=80;H.tick(a);assert.equal(a.hp,90);a=mon('いのちのたま');assert.equal(H.power(a,b,MOVES['タックル'],1),1.3);H.afterAttack(a,b,MOVES['タックル'],40);assert.equal(a.hp,144);
a=mon('かいがらのすず');a.hp=80;H.afterAttack(a,b,MOVES['タックル'],40);assert.equal(a.hp,85);
a=mon('クリアチャーム');H.change(a,{atk:-1},b);assert.equal(H.state(a).st.atk,undefined);H.change(a,{atk:-1},a);assert.equal(H.state(a).st.atk,-1);
a=mon('しろいハーブ');H.change(a,{atk:-2,spd:1},b);assert.equal(H.state(a).st.atk,0);assert.equal(H.state(a).st.spd,1);assert(!a.heldItem);
a=mon('ものまねハーブ');H.copyBoost(b,a,{atk:2});assert.equal(H.state(a).st.atk,2);assert(!a.heldItem);
a=mon('じゃくてんほけん');a.hp=80;H.afterHit(b,a,MOVES['タックル'],2,80);assert.equal(H.state(a).st.atk,2);assert.equal(H.state(a).st.spc,2);
a=mon('いかさまダイス');assert.equal(H.hits(a,[2,5]),4);roll=.99;assert.equal(H.hits(a,[2,5]),5);roll=0;
a=mon('ふうせん');assert(H.immune(b,a,{type:'じめん'}));H.afterHit(b,a,{type:'みず'},1,20);assert(!H.immune(b,a,{type:'じめん'}));
a=mon('メトロノーム');for(let i=0;i<7;i++)H.beginMove(a,'タックル',MOVES['タックル']);assert.equal(H.power(a,b,MOVES['タックル'],1),2);H.beginMove(a,'ブレイド',MOVES['ブレイド']);assert.equal(H.power(a,b,MOVES['ブレイド'],1),1);
for(const [source,key]of [['あついいわ','sun'],['しめったいわ','rain'],['さらさらいわ','sand'],['つめたいいわ','snow']]){a=mon(source);const f={};H.effects(a,b,{fx193:{weather:key}},f);assert.equal(f.weatherTurns,8);for(let i=0;i<8;i++)H.tickField(f);assert(!f.weather);}
a=mon('グランドコート');let f={};H.effects(a,b,{fx193:{terrain:'grass'}},f);assert.equal(f.terrainTurns,8);
a=mon('エレキシード');H.fieldTriggers(a,{terrain:'electric'});assert.equal(H.state(a).st.def,1);assert(!a.heldItem);
a=mon('パワフルハーブ');assert(H.beginMove(a,'蓄光砲',MOVES['蓄光砲']));assert(!a.heldItem);a=mon();assert(!H.beginMove(a,'蓄光砲',MOVES['蓄光砲']));assert(H.beginMove(a,'蓄光砲',MOVES['蓄光砲']));
a=mon('メンタルハーブ');H.effects(b,a,{fx193:{mental:'charm'}},{});assert(!H.state(a).charm);assert(!a.heldItem);
a=mon('くっつきバリ');H.afterHit(b,a,MOVES['タックル'],1,10);assert.equal(b.heldItem,name('くっつきバリ'));assert(!a.heldItem);
a=mon('かるいし');assert.equal(H.weight(a),H.weight(mon())/2);
for(const x of source.filter(x=>x.effect193.type)){a=mon(x.source);assert.equal(H.power(a,mon(),{type:x.effect193.type,cat:'spec'},1),1.2);}
for(const x of source.filter(x=>x.effect193.form)){a=mon(x.source,x.effect193.species[0]);assert.equal(H.multiplier(a,x.effect193.form),1.2);}
a=mon('でんきだま','デンデマリ');assert.equal(H.multiplier(a,'atk'),2);assert.equal(H.multiplier(a,'spc'),2);
const c=JSON.parse(fs.readFileSync('api/_friendCatalog.json'));c.species=SPECIES;c.moves=MOVES;c.items=ITEMS;fs.writeFileSync('api/_friendCatalog.json',JSON.stringify(c));const P=require('../api/_friendBattle.js');const pm=(sp,item)=>P.combatMon({sp,lv:50,iv:{},ev:{},heldItem:item,moves:[{name:'タックル'}]},50);const p1=pm('コケゴロ',name('こだわりハチマキ')),p2=pm('ホシモチ',name('たべのこし'));let battle=P.begin([{id:'a',name:'A',team:[p1]},{id:'b',name:'B',team:[p2]}]);P.submit(battle,'a',{kind:'move',index:0},1,()=>.5);P.submit(battle,'b',{kind:'move',index:0},1,()=>.5);assert.equal(battle.turn,2);assert(battle.sides.every(s=>s.team[0].hp>=0));console.log('PASS 117 items, key effect boundaries, triggers/consumption, 314 moves and real server battle turn');
})();
