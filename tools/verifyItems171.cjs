const assert=require('node:assert/strict'),fs=require('fs'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{const p=await b.newPage({viewport:{width:900,height:850}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{localStorage.setItem('gaon:welcome102:done','1');localStorage.setItem('yg-usage-excluded','1');});
await p.goto('http://127.0.0.1:5182/?v4test=route3',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForFunction(()=>window.VM?.world.mapId==='route3',null,{timeout:180000});
const result=await p.evaluate(async()=>{
 const S=await import('/src/save.js'),menu=await import('/src/menu.js'),art=await import('/src/itemArt.js');await art.itemArtReady();
 const save=VM.State.save;save.party=[VM.makeMon('リーフィン',50)];const m=save.party[0],name='アタックアップの実';save.bag[name]=3;
 const old={say:VM.ui.say,choice:VM.ui.choice,itemList:VM.ui.itemList};VM.ui.say=async()=>{};VM.ui.choice=async()=>0;
 const use=async(cancel=false)=>{let n=0;VM.ui.itemList=async()=>n++?null:{name,category:0,index:0};let c=0;VM.ui.choice=async()=>cancel&&c++===1?-1:0;await menu.bagMenu();};
 await use();const normal=[m.ev.atk,save.bag[name]];m.ev.atk=252;await use();const cap=[m.ev.atk,save.bag[name]];m.ev.atk=0;await use(true);const cancel=[m.ev.atk,save.bag[name]];
 const drop=VM.world.map.items.find(i=>i.flag.startsWith('treasure171:'));const before=save.bag[drop.item]||0;
 await VM.world.pickItem(drop);await VM.world.pickItem(drop);const picked=[save.bag[drop.item]-before,!!save.flags[drop.flag]];
 const snap=S.snapshot();S.applySave(JSON.parse(JSON.stringify(snap)));const persisted=!!VM.State.save.flags[drop.flag];
 Object.assign(VM.ui,old);
 const panel=document.createElement('div');panel.id='icons171';panel.style='position:fixed;inset:10px auto auto 10px;background:#fff8db;padding:20px;z-index:99999';
 for(const n of ['採掘セット',name,'こはくのかけら','古代のきんか','ほしの宝石']){const c=document.createElement('canvas');c.width=140;c.height=100;const x=c.getContext('2d');art.drawItem(x,n,40,0,64);x.fillStyle='#233e3a';x.font='13px sans-serif';x.fillText(n,5,85);panel.append(c);}document.body.append(panel);
 return {normal,cap,cancel,picked,persisted};});
assert.deepEqual(result,{normal:[10,2],cap:[252,2],cancel:[0,2],picked:[1,true],persisted:true});fs.mkdirSync('artifacts',{recursive:true});await p.locator('#icons171').screenshot({path:'artifacts/items171.png'});await p.locator('#icons171').evaluate(e=>e.remove());await p.evaluate(()=>{const d=VM.world.map.items.find(i=>i.flag.startsWith('treasure171:')&&!VM.State.save.flags[i.flag]);VM.world.enter('route3',d.x+3,d.y,'left');VM.setWorld();VM.steps(2);});await p.waitForTimeout(500);await p.screenshot({path:'artifacts/treasures171.png'});assert.deepEqual(errors,[]);console.log('PASS browser: EV use/cap/cancel inventory, pickup once, saved flags, icons and no page errors');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
