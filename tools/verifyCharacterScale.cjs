const { chromium } = require('C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const page = await browser.newPage({ viewport: mobile ? {width:430,height:932} : {width:1100,height:800}, hasTouch:mobile, isMobile:mobile });
      const cdp = await page.context().newCDPSession(page); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(() => {
        window.__characterFrames=[];
        const original=CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage=function(...args){
          if(args.length===5) window.__characterFrames.push({w:args[3],h:args[4],src:args[0]?.src||'canvas'});
          return original.apply(this,args);
        };
      });
      await page.goto('http://127.0.0.1:5179/?v4test=village', {waitUntil:'networkidle'});
      await page.waitForFunction(() => window.__characterFrames.some(f=>f.w===32&&f.h===48), null, {timeout:15000});
      await page.evaluate(()=>{ const n=VM.world.npcs[0]; n.x=VM.world.x+1; n.y=VM.world.y; VM.steps(4,16); });
      const result=await page.evaluate(()=>({frames:window.__characterFrames.filter(f=>f.w===32&&f.h===48).length,dimensions:[...new Set(window.__characterFrames.map(f=>`${f.w}x${f.h}`))],npcs:VM.world.npcs.length,errors:[]}));
      assert.ok(result.npcs>0,'test map must contain NPCs');
      assert.ok(result.frames>=1,'NPC must render with the required 32x48 frame');
      assert.deepEqual(errors,[]);
      await page.screenshot({path:`artifacts/character-scale-${mobile?'mobile':'desktop'}.png`,fullPage:true});
      results.push({mobile,...result,errors}); await page.close();
    }
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
