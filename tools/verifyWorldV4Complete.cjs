const { chromium } = require("C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const samples = new Set(["village", "inlet", "cavern", "shop", "arena"]);

async function verify(browser, label, viewport, touch) {
  const page = await browser.newPage({ viewport, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
  const errors = [], failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("Failed to load resource")) errors.push(m.text()); });
  page.on("requestfailed", (r) => { if (!r.url().includes("fonts.googleapis.com")) failed.push(r.url()); });
  await page.goto("http://127.0.0.1:5179/?v4test=village", { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.VM && VM.world && VM.world.mapId === "village");
  const results = await page.evaluate(async () => {
    const { MAPS } = await import("/src/data/maps.js");
    const out = [];
    for (const [id, map] of Object.entries(MAPS)) {
      const at = map.spawn || { x: 20, y: 20 };
      VM.world.enter(id, at.x, at.y, "down"); VM.setWorld(); VM.steps(3, 16);
      await new Promise((resolve) => setTimeout(resolve, 45));
      VM.steps(2, 16);
      const canvas = document.querySelector("#screen"), d = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let neon = 0, colored = 0, min = 255, max = 0;
      for (let i = 0; i < d.length; i += 64) {
        const r=d[i], g=d[i+1], b=d[i+2], v=(r+g+b)/3;
        if (r < 25 && g > 205 && b < 95) neon++;
        if (Math.max(r,g,b)-Math.min(r,g,b) > 18) colored++;
        min=Math.min(min,v); max=Math.max(max,v);
      }
      out.push({ id, layoutVersion: map.layoutVersion, fullArt: map.fullArt, rendered: max-min>45 && colored>300, neon });
    }
    return out;
  });
  for (const id of samples) {
    await page.goto(`http://127.0.0.1:5179/?v4test=${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(450);
    await page.screenshot({ path: `artifacts/v4-${label}-${id}.png`, fullPage: true });
  }
  await page.close();
  const bad = results.filter((r) => r.layoutVersion !== 4 || !r.fullArt || !r.rendered || r.neon > 20);
  return { label, maps: results.length, bad, errors, failed };
}

(async () => {
  const browser = await chromium.launch({ executablePath: edge, headless: true });
  const desktop = await verify(browser, "desktop", { width: 1100, height: 800 }, false);
  const mobile = await verify(browser, "mobile", { width: 430, height: 932 }, true);
  await browser.close();
  const report = JSON.stringify({ desktop, mobile });
  require("fs").writeFileSync("artifacts/v4-verification.json", report);
  console.log(report);
  if (desktop.bad.length || mobile.bad.length || desktop.errors.length || mobile.errors.length || desktop.failed.length || mobile.failed.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exit(1); });
