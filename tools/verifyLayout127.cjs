const fs=require('fs'),assert=require('assert');const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 fs.mkdirSync('artifacts/verify127',{recursive:true});const errors=[];
 for(const width of [320,375,430]){
 const p=await b.newPage({viewport:{width,height:850}});p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/usage-tracker.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await p.route('**/src/main.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.goto(process.env.BASE||'http://127.0.0.1:5182/');await p.evaluate(async()=>{(await import('/src/gate.js')).showAuth('signup');});await p.waitForSelector('#gate .tab');
 await p.screenshot({path:'artifacts/verify127/login-'+width+'.png'});
 const overflow=await p.locator('#gate .tab').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));assert.deepEqual(overflow,[]);
 await p.evaluate(async()=>{const s=await import('/src/characterSetup.js');s.chooseAppearance();});await p.waitForSelector('#character-setup');
 await p.waitForTimeout(1000);
 assert.equal(await p.locator('[data-part=hairMap119] button:visible').count(),7);
 assert.equal(await p.locator('[data-part=outfit119] button:visible').count(),5);
 const bad=await p.locator('#character-setup button:visible').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));assert.deepEqual(bad,[]);
 await p.screenshot({path:'artifacts/verify127/setup-'+width+'.png'});
 await p.locator('[data-part=gender] button[data-value=girl]').click();assert.equal(await p.locator('[data-part=hairMap119] button:visible').count(),6);
 await p.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: 320/375/430 login and appearance, 7 boy / 6 girl hairstyles and 5 outfit colors, no text overflow or page errors');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
