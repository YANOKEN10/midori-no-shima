const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),sharp=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const root='assets/monsters/battle-v187',old=JSON.parse(fs.readFileSync('assets/monsters/expansion-v184/manifest.json')),previous=fs.existsSync(root+'/manifest.json')?JSON.parse(fs.readFileSync(root+'/manifest.json')).entries:[],entries=[];
 for(let id=201;id<=300;id++){
  const prior=old.entries.find(e=>e.id===id),saved=previous.find(e=>e.id===id),source=root+'/source/'+id+'.png';
  for(const kind of ['map','follower'])assert.equal(hash(prior.assets[kind].path),prior.assets[kind].sha256,id+' '+kind+' must remain unchanged');
  const item={id,prompt:fs.existsSync(source)?fs.readFileSync(root+'/source/'+id+'.txt','utf8').replace(/^\uFEFF/,''):saved?.prompt,sourceHash:fs.existsSync(source)?hash(source):saved?.sourceHash,assets:{}};assert(item.prompt&&item.sourceHash,'missing provenance '+id);
  for(const kind of ['front','back']){
   const path=root+'/'+kind+'/'+id+'.png',{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,192);assert.equal(info.height,192);let occupied=0,changedGrid=0;
   for(let y=0;y<192;y++)for(let x=0;x<192;x++){
    const at=(y*192+x)*4,anchor=(Math.floor(y/2)*2*192+Math.floor(x/2)*2)*4,oldGrid=(Math.floor(y/6)*6*192+Math.floor(x/6)*6)*4;
    for(let c=0;c<4;c++){assert.equal(data[at+c],data[anchor+c],id+' 2px pixel grid');if(data[at+c]!==data[oldGrid+c])changedGrid++;}
    if(data[at+3]>180){occupied++;assert(x>=4&&x<188&&y>=4&&y<184,id+' unclipped silhouette');}
   }
   assert(occupied>500&&changedGrid>100,id+' detailed battle sprite');const sha256=hash(path);assert.notEqual(sha256,prior.assets[kind].sha256);item.assets[kind]={path,sha256};
  }
  assert.notEqual(item.assets.front.sha256,item.assets.back.sha256);entries.push(item);
 }
 fs.writeFileSync(root+'/manifest.json',JSON.stringify({generationMode:'built-in image_gen',logicalCanvas:96,storedCanvas:192,battleDisplay:88,entries},null,2)+'\n');
 console.log('PASS 100 dedicated battle pairs, 96px native grid, 200 map/follower atlases unchanged');
})().catch(e=>{console.error(e);process.exit(1)});
