const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),path=require('path');
const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:5179', rows=JSON.parse(fs.readFileSync('docs/gaon-redesign-v9.json','utf8'));
 const hashes=JSON.parse(fs.readFileSync('docs/gaon-v8-unchanged-hashes.json','utf8'));
 for(const [file,hash]of Object.entries(hashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
 const p=await b.newPage({viewport:{width:430,height:932},isMobile:true,hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/gaon-zukan/');await p.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode()})));
 assert.equal(await p.locator('article').count(),153);assert.equal(await p.locator('article img[src*="redesign-v9"]').count(),25);
 const data=await p.evaluate(async rows=>{
  const {SPECIES:S}=await import('/src/data/species.js');const {makeMon,gainExp,expForLevel}=await import('/src/state.js');const a=await import('/src/data/battleart.js');
  if(S['コケゴロ'].evo)throw Error('Kokegoro evolves');
  for(const row of rows){for(const key of ['base','learn','types','catch','exp'])if(JSON.stringify(S[row.name][key])!==JSON.stringify(row[key]))throw Error('Changed '+row.name+' '+key);if(row.name!=='コケゴロ'&&JSON.stringify(S[row.name].evo)!==JSON.stringify(row.evo))throw Error('Evolution changed '+row.name);}
  const m=makeMon('コケゴロ',27),r=gainExp(m,expForLevel(100)-m.exp);if(r.evolve||m.sp!=='コケゴロ'||m.lv!==100)throw Error('Kokegoro level-up failed');
  const control=makeMon('ヨルネコ',27),cr=gainExp(control,expForLevel(28)-control.exp);if(cr.evolve!=='シャドネコ')throw Error('Other evolution broken');
  let count=0,v9=0;
  for(const name of Object.keys(a.BATTLE_ART_FILES))for(const back of [false,true]){
   const src=(back?a.BATTLE_BACK_ART_FILES:a.BATTLE_ART_FILES)[name],im=new Image();im.src=new URL(src,new URL('/src/data/battleart.js',location.href));await im.decode();if(im.width!==80||im.height!==80)throw Error('resolution '+name);
   if(src.includes('redesign-v9')){
    v9++;const c=document.createElement('canvas');c.width=c.height=80;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,80,80).data;let opaque=0;
    for(let y=0;y<80;y++)for(let x=0;x<80;x++){let i=(y*80+x)*4;if(d[i+3]!==0&&d[i+3]!==255)throw Error('soft alpha');if(d[i+3]){opaque++;if(x===0||y===0||x===79||y===79)throw Error('clipped');}}
    if(opaque<200||opaque>5500)throw Error('Unexpected silhouette '+name+' '+opaque);
   }count++;
  }
  return {count,v9,kokegoroLevel:m.lv,kokegoroEvolution:r.evolve,otherEvolution:cr.evolve};
 },rows);assert.equal(data.count,306);assert.equal(data.v9,50);
 await p.locator('#search').fill('コケゴロ');assert.equal(await p.locator('article:visible').count(),1);assert.equal(await p.locator('.family:visible').count(),0);await p.screenshot({path:'artifacts/v9-kokegoro.png'});
 await p.locator('#search').fill('モスゴレム');assert.equal(await p.locator('article:visible').count(),1);
 if(base.includes('127.0.0.1')){
  await p.goto(base+'/?v4test=route1');await p.waitForFunction(()=>window.VM);await p.waitForTimeout(800);await p.evaluate(()=>{VM.State.save.party=[VM.makeMon('コケゴロ',30)];VM.State.save.battleTerrain='grass';VM.startBattle({wild:VM.makeMon('タキビィ',20)});});await p.waitForTimeout(500);await p.screenshot({path:'artifacts/v9-battle.png'});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/v9-verification.json',JSON.stringify({base,...data,unchangedFiles:Object.keys(hashes).length,errors},null,2));console.log(JSON.stringify({base,...data,errors}));
 const preview=await b.newPage({viewport:{width:1300,height:1400}});await preview.goto(base+'/gaon-zukan/');await preview.setContent('<style>body{font-family:sans-serif;background:#e7efea}main{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}article{background:white;text-align:center;padding:12px}img{width:110px;height:110px;image-rendering:pixelated}h3{margin:4px;font-size:16px}</style><main>'+rows.map(r=>'<article><h3>'+r.name+'</h3>'+[0,1].map(v=>'<img src="'+base+'/assets/monsters/redesign-v9/'+(v?'back':'front')+'/'+path.basename(r.files[v])+'">').join('')+'</article>').join('')+'</main>');await preview.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await preview.locator('main').screenshot({path:'artifacts/v9-all-25.png'});
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
