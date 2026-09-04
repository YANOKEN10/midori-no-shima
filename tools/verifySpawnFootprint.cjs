const { chromium } = require('C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:430,height:932},hasTouch:true,isMobile:true});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5179/?v4test=village');
    const report=await page.evaluate(async()=>{
      const {MAPS}=await import('/src/data/maps.js');
      const failures=[]; let count=0;
      const check=(id,x,y)=>{
        VM.world.enter(id,x,y); const w=VM.world; count++;
        if(!w.canFreeStand(w.x,w.y)||![[.05,0],[-.05,0],[0,.05],[0,-.05]].some(([dx,dy])=>w.canFreeStand(w.x+dx,w.y+dy))) failures.push({id,x,y});
      };
      for(const [id,m] of Object.entries(MAPS)) {
        check(id,m.spawn.x,m.spawn.y);
        for(const wp of m.warps||[]) if(MAPS[wp.to]) check(wp.to,wp.tx,wp.ty);
      }
      // Regress every legacy integer position on the village map.
      const m=MAPS.village;
      for(let y=0;y<m.rows.length;y++) for(let x=0;x<m.rows[y].length;x++) check('village',x,y);
      VM.world.enter('village',19,10);VM.setWorld();
      return {count,failures,before:{x:VM.world.x,y:VM.world.y}};
    });
    assert.deepEqual(report.failures,[]);
    const box=await page.locator('#joystick').boundingBox();
    const cdp=await page.context().newCDPSession(page);
    const x=box.x+box.width/2,y=box.y+box.height/2;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+30,y:y+30}]});
    await page.waitForTimeout(350);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    const after=await page.evaluate(()=>({x:VM.world.x,y:VM.world.y}));
    assert.ok(Math.hypot(after.x-report.before.x,after.y-report.before.y)>.1,'Touch input must move rescued player');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({...report,after,errors}));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
