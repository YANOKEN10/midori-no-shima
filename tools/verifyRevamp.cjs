const { chromium } = require("C:/Users/81801/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
(async()=>{
 const browser=await chromium.launch({executablePath:edge,headless:true});
 const page=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:1});
 const errors=[]; page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:5179/",{waitUntil:"networkidle"});
 await page.evaluate(()=>{document.querySelector("#gate").style.display="none";document.body.classList.add("touch")});
 await page.waitForTimeout(1800);
 await page.screenshot({path:"I:/Claude code/voraz-monsters/artifacts/revamp-title-mobile.png",fullPage:true});
 const title=await page.evaluate(()=>({stage:getComputedStyle(document.querySelector("#stage")).height,screen:getComputedStyle(document.querySelector("#screen")).width,a:getComputedStyle(document.querySelector("#ba")).backgroundImage,b:getComputedStyle(document.querySelector("#bb")).backgroundImage}));
 await page.evaluate(()=>{VM.State.save=VM.newGame("QA");VM.State.save.party.push(VM.makeMon("アワミィ",5));VM.world.enter("village",4,7,"down");VM.setWorld()});
 await page.waitForTimeout(1800);
 await page.screenshot({path:"I:/Claude code/voraz-monsters/artifacts/revamp-village-mobile.png",fullPage:true});
 const world=await page.evaluate(()=>({scene:VM.scene===VM.world,map:VM.world.mapId,hero:[VM.world.x,VM.world.y],canvas:[document.querySelector("#screen").width,document.querySelector("#screen").height]}));
 await browser.close();
 if(errors.length||!world.scene) throw new Error(JSON.stringify({errors,title,world}));
 console.log(JSON.stringify({errors,title,world}));
})().catch(e=>{console.error(e);process.exit(1)});