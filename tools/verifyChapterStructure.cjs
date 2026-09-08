const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),root=require('node:path').resolve(__dirname,'..').replaceAll('\\','/');
process.env.TEMP=root+'/work/tmp';process.env.TMP=process.env.TEMP;
(async()=>{const c=await chromium.launchPersistentContext(root+'/work/chapter-inspect',{executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,viewport:{width:1100,height:850}});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));try{
await p.goto('http://127.0.0.1:5179/?v4test=village');await p.waitForFunction(()=>window.VM?.world.map?.tileWorld);await p.waitForTimeout(1500);await p.screenshot({path:root+'/artifacts/chapter-village.png'});
const report=await p.evaluate(async()=>{const {MAPS}=await import('/src/data/maps.js?v=20260908-gaon-v9');const {solid}=await import('/src/tiles.js');const {SPECIES}=await import('/src/data/species.js');const out=[];for(const [id,m] of Object.entries(MAPS)){
 const at=(x,y)=>m.rows[y]?.[x];const q=[[m.spawn.x,m.spawn.y]],seen=new Set();while(q.length){const [x,y]=q.shift(),k=x+','+y;if(seen.has(k)||at(x,y)==null||solid(at(x,y)))continue;seen.add(k);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}
 const unreachable=[];for(const w of m.warps)if(!seen.has(w.x+','+w.y))unreachable.push('warp '+w.x+','+w.y);for(const n of m.npcs)if(![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((n.x+dx)+','+(n.y+dy))))unreachable.push(n.name);
 for(const e of m.enc?.list||[])if(!SPECIES[e[0]])unreachable.push('unknown species '+e[0]);
 out.push({id,tiles:m.rows[0].length+'x'+m.rows.length,reachable:seen.size,unreachable,trainers:m.npcs.filter(n=>n.trainer).length});}return out;});console.log(JSON.stringify({report,errors}));fs.writeFileSync(root+'/artifacts/chapter-structure.json',JSON.stringify({report,errors},null,2));assert.deepEqual(errors,[]);assert.ok(report.every(r=>r.unreachable.length===0));
}finally{await c.close();}})().catch(e=>{console.error(e);process.exitCode=1});
