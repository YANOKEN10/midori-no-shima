const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const response=await fetch('https://midori-no-shima.vercel.app/api/map-editor?check214='+Date.now());assert(response.ok);const pub=await response.text();fs.mkdirSync('artifacts/raden214',{recursive:true});fs.writeFileSync('artifacts/raden214/preview.json',pub);const server=http.createServer((q,r)=>{let name=new URL(q.url,'http://localhost').pathname;if(name==='/api/map-editor'){r.setHeader('Content-Type','application/json');return r.end(pub);}if(name.endsWith('/'))name+='index.html';const f=path.resolve('.'+decodeURIComponent(name));if(!f.startsWith(process.cwd()+path.sep))return r.writeHead(403).end();r.setHeader('Content-Type',/\.(js|mjs)$/.test(f)?'text/javascript':f.endsWith('.html')?'text/html':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.png')?'image/png':'application/octet-stream');const stream=fs.createReadStream(f);stream.on('error',()=>r.writeHead(404).end());stream.pipe(r);});await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});fs.mkdirSync('artifacts/raden214',{recursive:true});try{const p=await b.newPage({viewport:{width:1100,height:1250}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:'+server.address().port+'/?v4test=kageri',{waitUntil:'domcontentloaded',timeout:120000});await p.waitForFunction(()=>window.VM?.world?.mapId==='kageri',null,{timeout:180000});const result=await p.evaluate(async()=>{
VM.world.enter('raden');VM.ui.clear();const map=VM.world.map;
const {wildAvailable91,wildWindow91,filterWild91}=await import('/src/wildAvailability91.mjs');
const {encounterRate150}=await import('/src/encounterTerrain150.mjs');
const {SPECIES}=await import('/src/data/species.js');
const {habitatEntries}=await import('/src/habitats.js');
if(map.enc?.list.length!==5||map.enc.rate!==23)throw Error('Missing encounter settings');
for(const [n]of map.enc.list){if(!SPECIES[n])throw Error('Missing species '+n);if(!habitatEntries(n).some(e=>e.mapId==='raden'))throw Error('Missing habitat '+n);}
let checked=0;for(let day=0;day<7;day++)for(let h=0;h<24;h++){
const now=new Date(Date.UTC(2026,9,4+day,h-9));for(const [name]of map.enc.list){
const expected=name==='トリッピ'?h>=6&&h<12:name==='ヨルネコ'?h>=18||h<6:name==='ネコデン'?[2,4,6].includes(day):true;
if(wildAvailable91(name,now,'raden')!==expected)throw Error('Wrong schedule '+name+' '+day+' '+h);checked++;
}if(!filterWild91(map.enc.list,now,'raden').length)throw Error('Empty pool');}
if(!wildAvailable91('ネコデン',new Date('2026-10-04T03:00:00Z'),'route6'))throw Error('Other map affected');
const grass=map.rows.flatMap((r,y)=>[...r].flatMap((ch,x)=>ch==='"'?[{x,y}]:[]));
if(!grass.length)throw Error('No actual grass');
if(encounterRate150(map,'"')!==23||encounterRate150(map,',')||encounterRate150(map,'.'))throw Error('Terrain incorrect');
VM.world.x=grass[0].x;VM.world.y=grass[0].y;
return {checked,grassCells:grass.length,pool:map.enc.list,labels:map.enc.list.map(([n])=>[n,wildWindow91(n,'raden')])};
});console.log(JSON.stringify(result));await p.screenshot({path:"artifacts/raden214/grass.png"});assert.deepEqual(errors,[]);console.log('PASS map previews',errors);}finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});