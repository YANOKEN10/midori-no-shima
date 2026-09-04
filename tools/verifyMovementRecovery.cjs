const { chromium } = require('C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const page = await browser.newPage({ viewport: mobile ? { width:430,height:932 } : { width:1100,height:800 }, hasTouch:mobile, isMobile:mobile });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:5179/?v4test=village', { waitUntil:'networkidle' });
      const before = await page.evaluate(() => {
        VM.world.enter('village', 21.45, 19.35, 'down'); VM.setWorld();
        return {x:VM.world.x,y:VM.world.y};
      });
      if (mobile) {
        const box = await page.locator('#joystick').boundingBox();
        await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
        await page.mouse.down();
        await page.mouse.move(box.x+box.width/2+35,box.y+box.height/2+35);
      } else {
        await page.keyboard.down('ArrowDown'); await page.keyboard.down('ArrowRight');
      }
      await page.waitForTimeout(350);
      if (mobile) await page.mouse.up();
      else { await page.keyboard.up('ArrowDown'); await page.keyboard.up('ArrowRight'); }
      const after = await page.evaluate(() => ({ x:VM.world.x,y:VM.world.y }));
      assert.ok(after.x>before.x+.1 && after.y>before.y+.1, 'Diagonal input must move both coordinates');
      const resumed = await page.evaluate(() => {
        const saved = JSON.parse(JSON.stringify(VM.State.save.where));
        VM.world.enter(saved.map,saved.x,saved.y,saved.dir);
        return {x:VM.world.x,y:VM.world.y};
      });
      assert.deepEqual(resumed,after,'Fractional position must survive re-entry');
      assert.equal(errors.length,0, errors.join('\n'));
      await page.screenshot({path:`artifacts/recovery-${mobile?'mobile':'desktop'}.png`,fullPage:true});
      results.push({mobile,before,after,resumed,errors});
      await page.close();
    }
    fs.writeFileSync('artifacts/movement-recovery.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
