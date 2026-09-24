import assert from 'node:assert/strict';
import {walkRival168,cleanRivalName168,rivalName168,NPC_WALK_MS168} from '../src/rival168.mjs';
assert.equal(cleanRivalName168('  Alex Ray  '),'Alex Ray');assert.equal(cleanRivalName168('😀😀😀😀😀😀😀😀😀'),'😀😀😀😀😀😀😀😀');assert.equal(rivalName168({}),'レイジ');
const w={map:{}},n={x:2,y:3};let ms=0,frames=0,previous=0;
assert(await walkRival168(w,n,[{x:3,y:3},{x:3,y:4}],async dt=>{ms+=dt;frames++;if(frames<=40){assert(n.ox===undefined||n.ox>=previous);previous=n.ox||0;}}));
assert.equal(ms,1300);assert.equal(NPC_WALK_MS168,650);assert.equal(n.x,3);assert.equal(n.y,4);assert.equal(n.moving,false);assert.equal(n.ox,0);assert.equal(n.walkFrame,0);
let ticks=0;assert.equal(await walkRival168(w,n,[{x:4,y:4}],async()=>{if(++ticks===4)w.map={};}),false);assert.equal(n.x,3);assert.equal(n.moving,false);assert.equal(n.ox,0);
console.log('PASS normal 650 ms/tile walking, smooth progress, clean completion/map interruption and name normalization');
