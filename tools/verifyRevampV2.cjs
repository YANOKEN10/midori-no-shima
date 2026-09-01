const { chromium } = require("C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

(async () => {
  const browser = await chromium.launch({ executablePath: edge, headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("http://127.0.0.1:5179/?v=revamp-v2", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.querySelector("#gate").style.display = "none";
    document.body.classList.add("touch");
    VM.State.save = VM.newGame("QA");
    VM.State.save.party.push(VM.makeMon("アワミィ", 5));
    VM.world.enter("village", 4, 7, "down");
    VM.setWorld();
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "artifacts/revamp-v2-village-mobile.png", fullPage: true });
  const result = await page.evaluate(() => {
    const canvas = document.querySelector("#screen");
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let neon = 0, opaqueBlack = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      if(a>240 && r<25 && g>205 && b<95) neon++;
      if(a>240 && r<4 && g<4 && b<4) opaqueBlack++;
    }
    return {
      map: VM.world.mapId,
      hero: [VM.world.x, VM.world.y],
      canvas: [canvas.width, canvas.height],
      neonPixels: neon,
      opaqueBlackPixels: opaqueBlack,
      bodyText: document.body.innerText.length,
    };
  });
  await browser.close();
  if(errors.length || result.map !== "village" || result.neonPixels > 16) {
    throw new Error(JSON.stringify({ errors, result }));
  }
  console.log(JSON.stringify({ errors, result }));
})().catch(error => { console.error(error); process.exit(1); });
