const assert=require('node:assert/strict'),B=require('../api/_friendBattle'),C=require('../api/_friendCatalog.json');
const mon=(sp,id)=>({sp,companionId:id,lv:12,iv:{},ev:{},moves:[{name:'タックル',pp:0}],hp:1});
const raw={party:[mon('トリッピ','a'),mon('リーフィン','b'),mon('アワミィ','c')]},before=JSON.stringify(raw);
const team=B.teamFromSave(raw,['a','b','c'],'level50');assert(team.every(m=>m.lv===50&&m.hp===m.maxHp&&m.moves[0].pp===35));assert.equal(JSON.stringify(raw),before);assert.throws(()=>B.teamFromSave(raw,['a','a','a'],'level50'));assert.throws(()=>B.teamFromSave(raw,['a','b','missing'],'level50'));
const battle=B.begin([{id:'a',name:'A',team},{id:'b',name:'B',team:B.teamFromSave(raw,['a','b','c'],'current')}]);
B.submit(battle,'a',{kind:'move',index:0},1,()=>.5);assert.equal(battle.turn,1);assert(!('pending' in B.view(battle,'b')));assert.throws(()=>B.submit(battle,'a',{kind:'move',index:0},1));assert.throws(()=>B.submit(battle,'outsider',{kind:'move',index:0},1));B.submit(battle,'b',{kind:'move',index:0},1,()=>.5);assert.equal(battle.turn,2);assert.throws(()=>B.submit(battle,'a',{kind:'move',index:0},1));
for(let i=0;i<300&&!battle.finished;i++){for(const side of battle.sides){if(battle.finished)break;const active=side.team[side.active],index=active.moves.findIndex(m=>m.pp>0);B.submit(battle,side.id,{kind:'move',index},battle.turn,()=>.5);}}assert(battle.finished);assert.equal(battle.winner,0);assert.equal(JSON.stringify(raw),before);
const coop=B.begin([{id:'a',name:'A',group:0,team:[B.combatMon(mon('ラテット','a'),50)]},{id:'b',name:'B',group:0,team:[B.combatMon(mon('トリッピ','b'),50)]},{id:'boss',name:'Boss',group:1,ai:true,team:[B.combatMon(mon('コケゴロ','boss'),5)]}],true);
B.submit(coop,'a',{kind:'move',index:0},1,()=>.5);assert.equal(coop.turn,1);B.submit(coop,'b',{kind:'move',index:0},1,()=>.5);assert(coop.finished);assert.equal(coop.winner,0);
for(const sp of Object.keys(C.species)){const m=B.combatMon(mon(sp,sp),50);assert(Number.isFinite(m.maxHp)&&m.maxHp>0,sp);}
console.log('PASS: selection, Lv50 stats, no save mutations, hidden choices, turn synchronization, duplicate/stale/outsider rejection, completed PvP and cooperative battle, all species stats');
