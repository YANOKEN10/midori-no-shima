const { chromium } = require('C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const assert = require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try {
    for(const mobile of [false,true]) {
      const page=await browser.newPage({viewport:mobile?{width:430,height:932}:{width:1100,height:800},hasTouch:mobile,isMobile:mobile});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(()=>{window.__drawnSources=[];const old=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(...a){if(a[0]?.src)window.__drawnSources.push(a[0].src);return old.apply(this,a)}});
      await page.goto('http://127.0.0.1:5179/?v4test=mount2',{waitUntil:'networkidle'});
      await page.waitForTimeout(1000);
      const collision=await page.evaluate(()=>{
        const w=VM.world;
        return {spawn:w.canFreeStand(20.5,37.5),meadow:w.canFreeStand(19.5,12.5),bridge:w.canFreeStand(28.5,20.5),northWater:w.canFreeStand(30.5,10.5),lowerWater:w.canFreeStand(27.5,24.5),cliff:w.canFreeStand(1.5,1.5)};
      });
      assert.equal(collision.spawn,true);assert.equal(collision.meadow,true);assert.equal(collision.bridge,true);
      assert.equal(collision.northWater,false);assert.equal(collision.lowerWater,false);assert.equal(collision.cliff,false);
      const rescued=await page.evaluate(()=>{VM.world.enter('mount2',30.5,10.5,'down');return {x:VM.world.x,y:VM.world.y,safe:VM.world.canFreeStand(VM.world.x,VM.world.y)}});
      assert.equal(rescued.safe,true);assert.ok(Math.hypot(rescued.x-30.5,rescued.y-10.5)>0.2,'saved water position must be rescued');
      await page.evaluate(()=>{window.__drawnSources=[];VM.State.save.where={map:'mount2',x:19.5,y:12.5,dir:'down'};VM.startBattle({wild:VM.makeMon('ワンヒノ',7)});VM.steps(8,16)});
      await page.waitForFunction(()=>window.__drawnSources.some(s=>s.includes('battle-background')),null,{timeout:15000});
      const sources=await page.evaluate(()=>window.__drawnSources.filter(s=>s.includes('battle-background')));
      assert.ok(sources.some(s=>s.endsWith('battle-background.png')),'mount2 must use normal battle background');
      assert.ok(!sources.some(s=>s.includes('winter')),'mount2 must not use winter battle background');
      assert.deepEqual(errors,[]);
      console.log(JSON.stringify({mobile,collision,rescued,battle:sources.at(-1),errors}));
      await page.close();
    }
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
