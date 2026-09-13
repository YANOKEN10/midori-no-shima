import assert from 'node:assert/strict';
import {APPEARANCE_COLORS,FASHION_ITEMS,FASHION_TOWNS,equipFashion,fashionStock} from '../src/data/fashion.js';
import {MAPS} from '../src/data/maps.js';
assert.equal(APPEARANCE_COLORS.length,50);assert.equal(new Set(APPEARANCE_COLORS.map(c=>c.color)).size,50);
assert.equal(FASHION_ITEMS.length,80);assert.equal(new Set(FASHION_ITEMS.map(i=>i.id)).size,80);
for(const town of Object.keys(FASHION_TOWNS)){const m=MAPS[town],room=MAPS['fashion-'+town];assert(m.fashionShop&&room);assert.equal(room.npcs[0].clothes,town);assert.equal(room.warps[0].to,'@back');for(const slot of ['hat','shirt','pants','shoes'])assert.equal(fashionStock(town).filter(i=>i.slot===slot).length,2);}
const save={money:100000,look:{hair:'#6b4a2b',shirt:'#f2f2f2',pants:'#231a14'}};const start=structuredClone(save.look);
for(const item of FASHION_ITEMS){const before=save.money;assert(equipFashion(save,item.id,{buy:true}).ok);assert.equal(save.money,before-item.price);assert(equipFashion(save,item.id,{buy:true}).ok);assert.equal(save.money,before-item.price);}
assert.deepEqual(save.startingLook,start);assert.equal(save.look.hair,start.hair);assert.equal(save.wardrobe.length,80);
const poor={money:0,look:{}};assert.equal(equipFashion(poor,FASHION_ITEMS[0].id,{buy:true}).reason,'money');assert.deepEqual(poor,{money:0,look:{}});assert.equal(equipFashion(poor,FASHION_ITEMS[0].id).reason,'owned');
const restored=JSON.parse(JSON.stringify(save));assert(equipFashion(restored,FASHION_ITEMS[0].id).ok);assert.equal(restored.money,save.money);
console.log('PASS: 50 colors, 10 shops, 80 items, purchase/equip/insufficient funds/save roundtrip');
