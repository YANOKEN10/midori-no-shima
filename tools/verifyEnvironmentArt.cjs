const { chromium } = require("C:/Users/81801/AppData/Local/OpenAI/Codex/runtimes/cua_node/f24ab376120677c2/bin/node_modules/playwright-core");

(async () => {
  const map = process.argv[2] || "village";
  const x = Number(process.argv[3] || 7), y = Number(process.argv[4] || 8);
  const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [], failed = [];
  page.on("console", m => { if (m.type() === "error" && !m.text().includes("Failed to load resource")) errors.push(m.text()); });
  page.on("pageerror", e => errors.push(e.message));
  page.on("requestfailed", r => { if (!r.url().includes("fonts.googleapis.com")) failed.push(r.url()); });
  await page.goto("http://127.0.0.1:5179", { waitUntil: "networkidle" });
  await page.evaluate(({ map, x, y }) => {
    VM.State.save = VM.newGame("環境テスト");
    VM.State.save.party.push(VM.makeMon("アワミィ", 5));
    VM.world.enter(map, x, y, 0);
    VM.setWorld();
  }, { map, x, y });
  await page.waitForTimeout(1200);
  const result = await page.evaluate(() => ({ scene: VM.scene === VM.world, canvas: [document.querySelector("#screen").width, document.querySelector("#screen").height] }));
  await page.screenshot({ path: `C:/Users/81801/Documents/Codex/environment-art-${map}.png`, fullPage: true });
  console.log(JSON.stringify({ ...result, errors, failed }));
  if (!result.scene || errors.length || failed.length) process.exitCode = 1;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
