const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
(async()=>{
 const origin=process.env.VERIFY_ORIGIN||'https://midori-no-shima.vercel.app';
 const current=JSON.parse(fs.readFileSync('assets/monsters/battle-v187/manifest.json'));
 const old=JSON.parse(fs.readFileSync('assets/monsters/expansion-v184/manifest.json'));
 const family=JSON.parse(fs.readFileSync('assets/monsters/family-v188/manifest.json'));
 const assets=[...family.entries.flatMap(e=>Object.values(e.assets)),...current.entries.flatMap(e=>Object.values(e.assets)),...old.entries.flatMap(e=>[e.assets.map,e.assets.follower])];
 for(let i=0;i<assets.length;i+=12)await Promise.all(assets.slice(i,i+12).map(async f=>{const r=await fetch(origin+'/'+f.path);assert.equal(r.status,200,f.path);const hash=crypto.createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');assert.equal(hash,f.sha256,f.path);}));
 const normalize=s=>s.replace(/\r\n/g,'\n').replace(/^\uFEFF/,'');
 for(const path of ['src/roomLayout188.mjs','src/roomArt188.js','src/workshopMaps181.mjs','src/mapRuntime72.js','src/editorModel72.mjs','src/editorGround72.js','src/chapterArt.js','src/styleArt105.js','map-editor/editor.js','src/data/families184.mjs','src/data/species184.mjs','src/data/followerProfilesV1.js','src/battle.js','src/data/battleart.js','src/battlePortrait187.js','gaon-zukan/index.html','gaon-zukan/catalog.js','gaon-zukan/poses/index.html']){
  const r=await fetch(origin+'/'+path);assert.equal(r.status,200,path);assert.equal(normalize(await r.text()),normalize(fs.readFileSync(path,'utf8')),path);
 }
 for(const name of ['sink','cabinet','phone','fridge','table','chair','plant','window']){const path='assets/interiors-v188/'+name+'.png',r=await fetch(origin+'/'+path);assert.equal(r.status,200,path);assert(Buffer.from(await r.arrayBuffer()).equals(fs.readFileSync(path)),path);}
 assert((await fetch(origin+'/').then(r=>r.text())).includes('usage-tracker.js'));
 console.log('PASS production: 200 new battle sprites, 200 unchanged map/follower atlases, Chromegear display, review page and usage tracker');
})().catch(e=>{console.error(e);process.exit(1)});
