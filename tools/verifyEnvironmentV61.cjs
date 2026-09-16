const fs=require('fs'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.argv[2]||'http://127.0.0.1:5182/');const result=await p.evaluate(async()=>{
 const {MAPS}=await import('/src/data/maps.js'),{SOLID}=await import('/src/tiles.js'),{drawChapterMap}=await import('/src/chapterArt.js');
 const checks=[];for(const id of ['natureforest','forgottenRuins','shadowDepths','mossSanctuary','rods','route2']){const m=MAPS[id],q=[[m.spawn.x,m.spawn.y]],seen=new Set([q[0].join(',')]);
 for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,k=a+','+b;if(m.rows[b]?.[a]!==undefined&&!SOLID.has(m.rows[b][a])&&!seen.has(k)){seen.add(k);q.push([a,b]);}}}
 for(const wp of m.warps)if(!seen.has(wp.x+','+wp.y))throw Error(id+' warp unreachable '+JSON.stringify(wp));
 for(const n of [...m.npcs,...m.signs,...m.items])if(![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((n.x+dx)+','+(n.y+dy))))throw Error(id+' event inaccessible '+JSON.stringify(n));
 for(const other of Object.values(MAPS))for(const wp of other.warps)if(wp.to===id&&Number.isFinite(wp.tx)&&!seen.has(wp.tx+','+wp.ty))throw Error('arrival blocked '+id+JSON.stringify(wp));
 if(id==='natureforest'&&m.rows.some(r=>r.includes('.')))throw Error('Forest still has sand path');
 if(id==='route2')for(let y=0;y<m.rows.length;y++)for(let x=1;x<m.rows[y].length-1;x++)if(m.rows[y][x]==='.'&&x!==14&&x!==15)throw Error('Side road remains');
 checks.push({id,reachable:seen.size,flowers:m.townGardens?.length,trainers:m.npcs.filter(n=>n.trainer).length});}
 const canvases={};for(const id of ['shop','natureforest','forgottenRuins','shadowDepths','mossSanctuary','rods','route2']){const m=MAPS[id],cv=document.createElement('canvas');cv.width=m.rows[0].length*32;cv.height=m.rows.length*32;drawChapterMap(cv.getContext('2d'),m,0,0);canvases[id]=cv;}
 await new Promise(r=>setTimeout(r,5000));for(const [id,cv]of Object.entries(canvases))drawChapterMap(cv.getContext('2d'),MAPS[id],0,0);
 await new Promise(r=>setTimeout(r,2000));for(const [id,cv]of Object.entries(canvases))drawChapterMap(cv.getContext('2d'),MAPS[id],0,0);
 return {checks,images:Object.fromEntries(Object.entries(canvases).map(([id,cv])=>[id,cv.toDataURL()]))};});
 for(const[id,url]of Object.entries(result.images))fs.writeFileSync('v61-'+id+'.png',Buffer.from(url.split(',')[1],'base64'));console.log(JSON.stringify({checks:result.checks,errors}));if(errors.length)process.exitCode=1;
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
