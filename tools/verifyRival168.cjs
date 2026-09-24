const assert=require('node:assert/strict'),fs=require('fs'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:480,height:850}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 if(process.env.BASE)await p.route('**/src/main.js*',async r=>{const response=await r.fetch();const body=(await response.text()).replace('if (/^(localhost|127.0.0.1)$/.test(location.hostname)) {','if (true) {');await r.fulfill({response,body});});
 await p.addInitScript(()=>{localStorage.setItem('gaon:welcome102:done','1');localStorage.setItem('yg-usage-excluded','1');});
 await p.goto((process.env.BASE||'http://127.0.0.1:5182')+'/',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForFunction(()=>window.VM,null,{timeout:180000});
 async function press(){await p.keyboard.down('z');await p.evaluate(()=>VM.steps(1));await p.keyboard.up('z');await p.waitForTimeout(100);}
 async function advanceTo(selector){for(let i=0;i<120;i++){if(await p.locator(selector).isVisible())return;await press();}throw Error('Did not reach '+selector);}
 await p.locator('#screen').click();await advanceTo('#who');await p.fill('#who','テストくん');await p.click('#go');
 await advanceTo('#who');assert.match(await p.locator('#gate h1').textContent(),/ライバル/);await p.fill('#who','カイト');fs.mkdirSync('artifacts',{recursive:true});await p.screenshot({path:'artifacts/rival-name168.png'});await p.click('#go');
 await p.waitForSelector('#character-setup');await p.click('#go');for(let i=0;i<100&&!(await p.evaluate(()=>VM.scene===VM.world));i++)await press();
 assert.equal(await p.evaluate(()=>VM.State.save.rivalName168),'カイト');assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('gaon-world:save:v3')).rivalName168),'カイト');
 const result=await p.evaluate(async()=>{
  const R=await import('/src/rivalStory122.js'),E=await import('/src/endgameStory.js'),{towerRival122}=await import('/src/rivalRules122.mjs'),{snapshot,applySave}=await import('/src/save.js');
  const s=VM.State.save;s.party=[VM.makeMon('リーフィン',5)];s.captureCount122=1;const n={rival122:true,script:'rival122:rods',displayName:'レイジ'},w={npcs:[n],mapId:'rods',resumeBgm(){},checkEvolution(){}};R.refreshRival122(w);let trainer;
  await R.runRivalEvent122(w,n,{say:async()=>{},battle:async o=>{trainer=o.trainer;return 'run'},persist:async()=>{}});
  s.facilities={tower:{active:true,pendingOpponent122:towerRival122()}};const actor={script:'facility123:battle'},fw={map:{interior123:'arena',facility123:'tower'},npcs:[actor]};E.refreshFacility123(fw);
  const saved=snapshot();applySave(JSON.parse(JSON.stringify(saved)));
  return {map:n.displayName,battle:trainer.name,appearance:trainer.appearance79.variant,music:trainer.rivalBattle129,tower:actor.displayName,reloaded:VM.State.save.rivalName168};
 });assert.deepEqual(result,{map:'カイト',battle:'カイト',appearance:110,music:'regular',tower:'カイト',reloaded:'カイト'});
 // The same real form supports English, defaults and cancellation without changing a save.
 await p.selectOption('#language166 select','en');await p.evaluate(async()=>{const m=await import('/src/professorIntro70.js');window.before168=JSON.stringify(VM.State.save);window.say168=VM.ui.say;VM.ui.say=async()=>{};window.result168='pending';m.introduceAdventure().then(r=>window.result168=r);});
 await p.waitForSelector('#gate.show');await p.fill('#who','Alex');await p.click('#go');await p.waitForFunction(()=>document.querySelector('#gate h1').textContent.includes('rival'));
 assert.equal(await p.locator('#who').getAttribute('placeholder'),'Reiji');await p.fill('#who','Alex Ray');await p.screenshot({path:'artifacts/rival-name-english168.png'});await p.click('#go');await p.waitForSelector('#character-setup');await p.click('#go');await p.waitForFunction(()=>window.result168!=='pending');assert.equal(await p.evaluate(()=>result168.rivalName),'Alex Ray');assert(await p.evaluate(()=>before168===JSON.stringify(VM.State.save)));
 await p.evaluate(async()=>{const m=await import('/src/professorIntro70.js');window.result168='pending';m.introduceAdventure().then(r=>window.result168=r);});await p.waitForSelector('#gate.show');await p.fill('#who','Alex');await p.click('#go');await p.waitForFunction(()=>document.querySelector('#gate h1').textContent.includes('rival'));await p.click('#skip');await p.waitForFunction(()=>window.result168===null);assert(await p.evaluate(()=>before168===JSON.stringify(VM.State.save)));await p.evaluate(()=>VM.ui.say=say168);
 assert.deepEqual(errors,[]);console.log('PASS actual new-game rival form, saved name, reload/cloud snapshot, map/battle/tower name and unchanged art/music, English spaced names and cancel');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
