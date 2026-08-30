const { chromium } = require("C:/Users/81801/AppData/Local/OpenAI/Codex/runtimes/cua_node/f24ab376120677c2/bin/node_modules/playwright-core");

async function tap(page, key, wait = 350) {
  const map = { KeyE: "start", ArrowDown: "down", KeyZ: "a" };
  const button = page.locator('[data-k="' + map[key] + '"]').first();
  await button.dispatchEvent("mousedown");
  await page.waitForTimeout(120);
  await button.dispatchEvent("mouseup");
  await page.waitForTimeout(wait);
}

async function run(viewport, label) {
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !m.text().includes("Failed to load resource")) errors.push(m.text()); });
  await page.goto("http://127.0.0.1:5179", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.querySelector("#gate").classList.remove("show"); document.querySelector("#gate").style.display = "none"; document.activeElement?.blur();
    VM.State.save = VM.newGame("コンパステスト");
    VM.State.save.flags.gotCompass = 1;
    VM.State.save.flags.elderOK = 1;
    VM.State.save.bag["リーフ・コンパス"] = 1;
    VM.State.save.party.push(VM.makeMon("アワミィ", 5));
    VM.world.enter("village", 4, 7, "down");
    VM.setWorld();
  });
  // STARTメニューが呼ぶものと同じ切替APIで、矢印の描画を検証する。
  await page.evaluate(async () => {
    const c = await import("/src/compass.js");
    c.setCompassEnabled(true);
  });
  await page.waitForTimeout(500);
  const result = await page.evaluate(async () => {
    const c = await import("/src/compass.js");
    return { enabled: c.compassEnabled(), objective: c.nextObjective(), waypoint: c.compassWaypoint(VM.world.mapId), scene: VM.scene === VM.world };
  });
  await page.screenshot({ path: `C:/Users/81801/Documents/Codex/compass-${label}.png`, fullPage: true });
  await browser.close();
  if (!result.enabled || !result.objective || !result.waypoint || errors.length) throw new Error(JSON.stringify({ label, result, errors }));
  return { label, ...result, errors };
}

(async () => {
  const desktop = await run({ width: 1280, height: 800 }, "desktop");
  const mobile = await run({ width: 390, height: 844 }, "mobile");
  console.log(JSON.stringify({ desktop, mobile }));
})().catch(e => { console.error(e); process.exit(1); });
