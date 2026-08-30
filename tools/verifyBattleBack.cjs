const { chromium } = require("C:/Users/81801/AppData/Local/OpenAI/Codex/runtimes/cua_node/f24ab376120677c2/bin/node_modules/playwright-core");

async function capture(name, viewport, output) {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5179", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    VM.State.save = VM.newGame("背面テスト");
    VM.State.save.party.push(VM.makeMon("メロロン", 30));
    VM.startBattle({ wild: VM.makeMon("リーフィン", 30) });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: output, fullPage: true });
  const active = await page.evaluate(() => VM.battle.active);
  console.log(name + ": active=" + active + " errors=" + errors.length);
  if (!active || errors.length) process.exitCode = 1;
  await browser.close();
}

(async () => {
  await capture("desktop", { width: 1280, height: 800 }, "C:/Users/81801/Documents/Codex/battle-back-desktop.png");
  await capture("mobile", { width: 390, height: 844 }, "C:/Users/81801/Documents/Codex/battle-back-mobile.png");
})().catch((e) => { console.error(e); process.exit(1); });
