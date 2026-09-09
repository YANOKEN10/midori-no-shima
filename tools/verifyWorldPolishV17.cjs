const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const base=process.argv[2]||'http://127.0.0.1:5179',b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
const p=await b.newPage({viewport:{width:1000,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/');await p.waitForTimeout(2000);await p.locator('canvas').first().screenshot({path:'artifacts/v17-title.png'});
const report=await p.evaluate(async()=>{
 const {npcFrame}=await import('/src/npcArt.js'),{heroFrame}=await import('/src/revampArt.js?v=20260909-title-scale-v17');
 const {SPECIES:S,STAT_KEYS,STAT_LABELS}=await import('/src/data/species.js');
 await new Promise(r=>setTimeout(r,1500));const cv=document.createElement('canvas');cv.width=600;cv.height=600;const c=cv.getContext('2d');c.fillStyle='#aacbb0';c.fillRect(0,0,600,600);c.imageSmoothingEnabled=false;
 const bounds=f=>{const d=f.getContext('2d').getImageData(0,0,f.width,f.height).data;let lo=99,hi=-1;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++)if(d[(y*f.width+x)*4+3]>=128){lo=Math.min(lo,y);hi=Math.max(hi,y);}return{height:hi-lo+1,bottom:hi};};
 const frames=[];for(let v=0;v<30;v++)for(const dir of ['down','up','left','right'])for(let step=0;step<3;step++){
  const f=npcFrame({variant:v,dir},step);if(!f)throw Error('missing NPC '+v);const box=bounds(f);frames.push({v,dir,step,...box});
  if(dir==='down'&&step===1){const x=v%6*100,y=Math.floor(v/6)*120;c.drawImage(heroFrame('down',1),x,y+15,48,72);c.drawImage(f,x+55-f.width*.75+24,y+15,f.width*1.5,72);c.fillStyle='#123';c.fillText('Hero / NPC '+v,x,y+106);}
 }
 const html=await(await fetch('/gaon-zukan/')).text(),dom=new DOMParser().parseFromString(html,'text/html');let checked=0;
 for(const card of dom.querySelectorAll('article')){const n=card.querySelector('b').textContent;for(const [i,dd]of [...card.querySelectorAll('.base-stats dd')].entries()){if(Number(dd.textContent)!==S[n].base[STAT_KEYS[i]])throw Error('catalog mismatch '+n+' '+STAT_KEYS[i]);}checked++;}
 const expected={'ヤミノヌシ':{spd:100,def:80,hp:85,atk:120,spc:110},'コケゴロ':{hp:120,atk:130,def:120,spc:60},'オオヒノオ':{sdef:120,spd:125},'ヨウガンヌシ':{def:90,spd:110},'リュウグウ':{sdef:103,spd:152},'ライメイ':{sdef:90,spd:130},'オニイワ':{spd:70,def:91},'ジシンヌシ':{spd:97,hp:110,spc:60},'オオカブト':{spd:80,spc:60},'シャドネコ':{atk:100,spc:90,sdef:70},'ボウレイ':{hp:90,atk:60,def:70},'ムラサキビ':{spd:90,atk:60,hp:78,def:65}};
 for(const[n,stats]of Object.entries(expected))for(const[k,v]of Object.entries(stats))if(S[n].base[k]!==v)throw Error(n+' '+k);
 return {frames,checked,gallery:cv.toDataURL()};
});fs.writeFileSync('artifacts/v17-npc-gallery.png',Buffer.from(report.gallery.split(',')[1],'base64'));delete report.gallery;assert.equal(report.checked,153);assert.ok(report.frames.every(f=>f.height>=45&&f.height<=46&&f.bottom>=46&&f.bottom<=47));
if(base.includes('127.0.0.1')){await p.goto(base+'/?v4test=route1');await p.waitForFunction(()=>window.VM?.world);await p.waitForTimeout(1500);for(const [id,x,y]of [['route1',22,18],['route1',7,27],['village',3,4],['mountain',27,12]]){await p.evaluate(([id,x,y])=>{VM.ui.clear();VM.world.enter(id,x,y,'down');},[id,x,y]);await p.waitForTimeout(350);await p.locator('canvas').first().screenshot({path:`artifacts/v17-${id}-${x}-${y}.png`});}}
const terrain=await p.evaluate(async()=>{const {drawRockTerrain}=await import('/src/rockTerrainArt.js');const a=await(await fetch('/assets/terrain-v17/atlas.json')).json();await new Promise(r=>setTimeout(r,1000));const cv=document.createElement('canvas');cv.width=256;cv.height=256;const c=cv.getContext('2d');let i=0;for(const name of Object.keys(a.sprites)){if(!drawRockTerrain(c,name,(i%4)*64,Math.floor(i/4)*64,64,64))throw Error('terrain '+name);i++;}return cv.toDataURL();});fs.writeFileSync('artifacts/v17-terrain-preview.png',Buffer.from(terrain.split(',')[1],'base64'));
assert.deepEqual(errors,[]);console.log(JSON.stringify({base,npcFrames:report.frames.length,catalog:report.checked,errors}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});

