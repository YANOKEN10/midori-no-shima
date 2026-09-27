const fs=require('fs'),assert=require('assert/strict'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const origin=process.env.VERIFY_ORIGIN||'http://127.0.0.1:5182';
 const pub=await fetch('https://midori-no-shima.vercel.app/api/map-editor').then(r=>r.json());
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1500,height:950}}),errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>localStorage.setItem('vmon:token','local-ui-test'));
  await p.route('**/api/map-editor',r=>{const d=r.request().method()==='POST'?r.request().postDataJSON():{};return r.fulfill({json:d.action==='session'?{name:'検証',definitions:pub.definitions}:d.action==='read'?{draft:null,published:pub.maps[d.map]||null,draftRevision:0,publicRevision:pub.revision}:pub});});
  await p.goto(origin+'/map-editor/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.querySelector('#mapSelect')?.options.length>10);
  await p.waitForSelector('#mapSelect:not([disabled])');
  await p.locator('#tabs [data-category="rocks"]').click();await p.fill('#search','氷の結晶');
  for(const [key,size] of [['eIce',2],['ice-crystal-small186',1]]){
   const choice=p.locator('#materials [data-key="'+key+'"]');assert.equal(await choice.count(),1);await choice.click();
   assert((await p.locator('#selectedInfo90').innerText()).includes(size+'×'+size));
  }
  await p.screenshot({path:'artifacts/expansion184/workshop-ice-sizes.png'});
  const rendered=await p.evaluate(async()=>{
   const m=await import('/src/styleArt105.js');await new Promise((resolve,reject)=>{let n=0;const t=setInterval(()=>{if(m.styleReady105()){clearInterval(t);resolve()}else if(++n>200){clearInterval(t);reject(Error('images not ready'))}},50)});
   const c=document.createElement('canvas');c.width=128;c.height=80;const g=c.getContext('2d');
   for(const [art,x,size] of [['eIce',0,64],['ice-crystal-small186',80,32]]){m.drawStyle105(g,art,x,0,size,size);}
   return c.toDataURL();
  });
  fs.writeFileSync('artifacts/expansion184/ice-sizes.png',Buffer.from(rendered.split(',')[1],'base64'));
  assert.deepEqual(errs,[]);console.log('PASS workshop ice 2x2 + 1x1 selection and renderer');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
