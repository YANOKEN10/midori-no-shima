const { chromium } = require("C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  const page = await browser.newPage({ viewport: { width: 960, height: 720 } });
  const errors = [], failed = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !m.text().includes("Failed to load resource")) errors.push(m.text()); });
  page.on("requestfailed", r => { if (!r.url().includes("fonts.googleapis.com")) failed.push(r.url()); });
  await page.goto("http://127.0.0.1:5179", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.VM && VM.world);
  const checked = await page.evaluate(async () => {
    const { MAPS } = await import("/src/data/maps.js");
    VM.State.save = VM.newGame("全マップテスト");
    VM.State.save.party.push(VM.makeMon("アワミィ", 5));
    const names = [];
    for (const [id, map] of Object.entries(MAPS)) {
      let x = 1, y = 1;
      outer: for (let yy = 0; yy < map.rows.length; yy++) for (let xx = 0; xx < map.rows[yy].length; xx++) {
        if (".,~fCgxu".includes(map.rows[yy][xx])) { x = xx; y = yy; break outer; }
      }
      VM.world.enter(id, x, y, "down"); VM.setWorld(); VM.steps(2, 16); names.push(id);
    }
    return names;
  });
  await page.waitForTimeout(700);
  console.log(JSON.stringify({ maps: checked.length, errors, failed }));
  if (!checked.length || errors.length || failed.length) process.exitCode = 1;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
