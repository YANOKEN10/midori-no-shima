const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),root=require('node:path').resolve(__dirname,'..').replaceAll('\\','/');
process.env.TEMP=root+'/work/tmp';process.env.TMP=process.env.TEMP;
(async()=>{const ctx=await chromium.launchPersistentContext(root+'/work/chapter-flow',{executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,viewport:{width:1100,height:850}});const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
const press=async k=>{await p.keyboard.down(k);await p.waitForTimeout(55);await p.keyboard.up(k);await p.waitForTimeout(65)};
const drain=async()=>{for(let i=0;i<180;i++){const d=await p.evaluate(()=>window.__dialog);if(d?.kind==='say')await press('Enter');else if(d?.kind==='choice')return d;else if(await p.evaluate(()=>!VM.world.busy&&!VM.battle.active&&!VM.ui.busy))return null;else await p.waitForTimeout(90);}throw Error('drain timeout')};
const choose=async text=>{await p.waitForFunction(()=>window.__dialog?.kind==='choice');const d=await p.evaluate(()=>window.__dialog);const idx=d.items.findIndex(x=>x.includes(text));assert.ok(idx>=0,JSON.stringify(d));for(let i=d.opt.start||0;i<idx;i++)await press('ArrowDown');await press('Enter');};
const talk=async(id,x,y)=>{await p.evaluate(({id,x,y})=>{VM.world.enter(id,x,y,'up');VM.setWorld()}, {id,x,y});await press('Enter');await drain();};
const shot=async s=>p.screenshot({path:root+'/artifacts/chapter-'+s+'.png'});
try{
await p.goto('http://127.0.0.1:5179/?v4test=hut');await p.waitForFunction(()=>window.VM?.world.map?.tileWorld);
await p.evaluate(()=>{window.__dialog=null;window.__history=[];for(const kind of ['say','choice']){const fn=VM.ui[kind].bind(VM.ui);VM.ui[kind]=function(items,opt){const d={kind,items:Array.isArray(items)?items:[items],opt:opt||{}};window.__dialog=d;window.__history.push(d);return fn(items,kind==='say'?{...opt,speed:1}:opt).then(v=>{if(window.__dialog===d)window.__dialog=null;return v})}}});
await talk('hut',9,7);await choose('いいえ');await drain();assert.equal(await p.evaluate(()=>Object.keys(VM.State.save.bag).length),0);
await talk('lab',8,6);assert.equal(await p.evaluate(()=>VM.State.save.bag['ラグネット']||0),0);
await talk('village',19,16);assert.ok(await p.evaluate(()=>VM.State.save.flags['v5:heardLatett']));
await p.evaluate(()=>VM.world.enter('mountain',14,8,'up'));await press('ArrowUp');await p.waitForTimeout(250);await drain();assert.ok(await p.evaluate(()=>VM.State.save.flags['v5:latettSeen']));assert.equal(await p.evaluate(()=>VM.State.save.party.length),0);
await talk('lab',8,6);assert.equal(await p.evaluate(()=>VM.State.save.bag['ラグネット']),15);await talk('lab',8,6);assert.equal(await p.evaluate(()=>VM.State.save.bag['ラグネット']),15);
console.log('Story: witness -> Latett escapes -> professor gift exactly once passed');
await p.evaluate(()=>{VM.world.enter('route1',5,7,'up');window.__random=Math.random;Math.random=()=>0;VM.world.wildBattle();});await drain();await choose('ラグネットをつかう');await drain();assert.equal(await p.evaluate(()=>VM.State.save.party.length),1);await p.evaluate(()=>{Math.random=window.__random});
await talk('rods',19,17);assert.equal(await p.evaluate(()=>VM.State.save.bag['ガオンずかん']),1);await talk('rods',19,17);assert.equal(await p.evaluate(()=>VM.State.save.bag['ガオンずかん']),1);
// Actual one-cell doorway movement and return-to-town exit.
await p.evaluate(()=>{VM.world.enter('rods',5,11,'up');VM.State.save.party[0].hp=1;VM.State.save.party[0].status='どく';VM.State.save.party[0].moves[0].pp=0;});await press('ArrowUp');await p.waitForFunction(()=>VM.world.mapId==='hospital'&&!VM.world.busy);assert.equal(await p.evaluate(()=>VM.State.save.backTo.map),'rods');
await talk('hospital',7,6);await choose('はい');await drain();const healed=await p.evaluate(async()=>{const {maxHp}=await import('/src/state.js');const m=VM.State.save.party[0];return m.hp===maxHp(m)&&!m.status&&m.moves.every(v=>v.pp===v.max)});assert.ok(healed);
await p.evaluate(()=>VM.world.enter('hospital',7,11,'down'));await press('ArrowDown');await p.waitForFunction(()=>VM.world.mapId==='rods'&&!VM.world.busy);assert.equal(await p.evaluate(()=>VM.world.x),5);
await talk('shop',7,6);await choose('かう');await choose('ガオンのくすり');await drain();await choose('1こ');await drain();await choose('はい');await drain();assert.equal(await p.evaluate(()=>VM.State.save.bag['ガオンのくすり']),1);
await press('Escape');await choose('やめる');await drain();
console.log('Capture, dex once, one-tile hospital entrance/exit, full recovery, shop purchase passed');
// Exercise all nine trainer battles; high-level test partner keeps this integration test bounded.
await p.evaluate(async()=>{const {newMove}=await import('/src/data/moves.js');VM.State.save.party=[VM.makeMon('リーフィン',60)];VM.State.save.party[0].moves=[newMove('たいあたり')];window.__random=Math.random;Math.random=()=>0;});
const trainers=await p.evaluate(async()=>{const {MAPS}=await import('/src/data/maps.js?v=20260908-gaon-v8');return ['route2','natureforest'].flatMap(id=>MAPS[id].npcs.map((n,i)=>n.trainer?{id,i}:null).filter(Boolean))});assert.equal(trainers.length,9);
for(const t of trainers){await p.evaluate(t=>{VM.world.enter(t.id,NaN,NaN,'up');VM.world.busy=true;VM.world.runNpc(VM.world.npcs[t.i]).finally(()=>VM.world.busy=false)},t);await drain();for(let i=0;i<10&&await p.evaluate(()=>VM.battle.active);i++){await choose('たたかう');const d=await p.evaluate(()=>window.__dialog);await choose(d.items[0]);await drain();}assert.ok(await p.evaluate(t=>VM.State.save.flags['beat:'+t.id+':'+t.i],t));}
await p.evaluate(()=>{Math.random=window.__random});console.log('All 6 route trainers and 3 forest trainers can be defeated');
// Guaranteed master capture, including a difficult healthy target, under adverse RNG.
await p.evaluate(()=>{VM.world.enter('route1',12,15,'up');VM.State.save.bag={'マスターラグ':1};window.__random=Math.random;Math.random=()=>0.999999;VM.startBattle({wild:VM.makeMon('ラテット',50)}).then(()=>Math.random=window.__random)});await drain();await choose('どうぐ');await choose('マスターラグ');await drain();assert.ok(await p.evaluate(()=>VM.State.save.dexOwn['ラテット']));
await p.evaluate(()=>{VM.world.enter('route1',5,7,'down');VM.setWorld()});await p.waitForTimeout(200);await shot('grass-feet');
for(const id of ['village','rods','mountain','route2','natureforest','hospital','shop','lab']){await p.evaluate(id=>{VM.world.enter(id,NaN,NaN,'down');VM.setWorld()},id);await p.waitForTimeout(180);await shot(id);}
assert.deepEqual(errors,[]);const result={story:true,giftOnce:15,dexOnce:true,capture:true,hospital:true,shop:true,trainers:9,masterCapture:true,errors};fs.writeFileSync(root+'/artifacts/chapter-flow.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}catch(e){await shot('failure');console.error(JSON.stringify(await p.evaluate(()=>({map:VM.world.mapId,d:window.__dialog,busy:VM.world.busy,battle:VM.battle.active,flags:VM.State.save.flags,history:window.__history?.slice(-3)}))));throw e;}finally{await ctx.close();}})().catch(e=>{console.error(e);process.exitCode=1});
