import assert from 'node:assert/strict';
import {ITEMS,SHOP_LIST} from '../src/data/items.js';
import {EV_BOOST_ITEMS171} from '../src/training122.mjs';
import {makeMon,boostEffort171,effortRoom171,evTotal,maxHp} from '../src/state.js';
import {salePrice,sellItem} from '../src/itemSelling.js';
import {MAPS} from '../src/data/maps.js';
import {addTreasures171,treasureGround171} from '../src/treasure171.mjs';
import {SPECIES} from '../src/data/species.js';
const mon=()=>makeMon(Object.keys(SPECIES)[0],50);
assert.equal(EV_BOOST_ITEMS171.length,6);
for(const d of EV_BOOST_ITEMS171){const m=mon();assert(SHOP_LIST.includes(d.name));assert.equal(boostEffort171(m,d.stat),10);assert.equal(m.ev[d.stat],10);m.ev[d.stat]=248;assert.equal(boostEffort171(m,d.stat),4);assert.equal(effortRoom171(m,d.stat),0);}
let m=mon();m.ev.atk=252;m.ev.def=252;assert.equal(boostEffort171(m,'spd'),6);assert.equal(evTotal(m),510);assert.equal(boostEffort171(m,'hp'),0);
m=mon();m.hp=0;boostEffort171(m,'hp');assert.equal(m.hp,0);m=mon();m.hp-=8;boostEffort171(m,'hp');assert.equal(maxHp(m)-m.hp,8);
for(const [name,price]of [['こはくのかけら',2000],['古代のきんか',5000],['ほしの宝石',10000]]){assert.equal(salePrice(name),price);const s={bag:{[name]:1},money:0};assert(sellItem(s,name,1));assert.equal(s.money,price);assert(!sellItem(s,name,1));}
let count=0;for(const [id,map]of Object.entries(MAPS)){const drops=map.items?.filter(i=>i.flag?.startsWith('treasure171:'))||[];if(/^route\d+$/.test(id))assert.equal(drops.length,2,id);if(['forgottenRuins','shadowDepths'].includes(id))assert.equal(drops.length,3,id);for(const i of drops){assert(ITEMS[i.item]);assert(treasureGround171(map,i.x,i.y));count++;}}
const before=JSON.stringify(MAPS);addTreasures171(MAPS);assert.equal(JSON.stringify(MAPS),before);console.log('PASS six EV items, caps, HP, selling, '+count+' accessible treasures and idempotent placement');
