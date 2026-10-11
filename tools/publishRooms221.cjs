const fs=require('fs'),assert=require('assert/strict');assert(process.env.FRIEND_GATEWAY_SECRET);const F=require('../api/_friendStore'),{packPublished188,unpackPublished188}=require('../api/_mapCodec188');
(async()=>{const ids=['karatSalon','shipDeck','shipLounge','shipCabins','daycare'],P='maps72:published',R='maps82:definitions',keys=[P,R,...ids.flatMap(id=>['maps72:draft:'+id,'maps72:previous:'+id])],before=await F.read(keys),pub=unpackPublished188(before[P].data),dir='artifacts/rooms221/'+new Date().toISOString().replace(/[:.]/g,'-');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(dir+'/before.json',JSON.stringify(before));const m=await import('../src/editorModel72.mjs'),{extendMaps82}=await import('../src/customMaps82.mjs'),{addManagedPeople120}=await import('../src/managedPeople120.mjs');const bases=extendMaps82(addManagedPeople120(JSON.parse(fs.readFileSync('assets/editor-v72/base-maps.json'))),before[R]?.data?.definitions||{}),cat=m.catalog(bases,JSON.parse(fs.readFileSync('assets/editor-v72/species.json')));

function transform(id,input){
 const base=bases[id],d=m.upgrade79(base,structuredClone(input||m.initial(base)));
 if(d.roomEntrances221)return d;
 const old=m.applyEdit(base,d,cat),w=base.rows[0].length,h=base.rows.length;
 const g=Array.from({length:h},()=>Array(w).fill('void173'));
 for(const t of d.tiles)g[t.y][t.x]=t.material;
 const paint=(x,y,w,h,key)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)g[yy][xx]=key;};
 if(id==='karatSalon'){paint(7,11,1,1,'room188-floor');paint(6,13,3,1,'room188-floor');paint(7,13,1,1,'room188-mat');}
 if(id==='daycare'){
  const floor=d.tiles.find(t=>t.x===10&&t.y===15)?.material||'wood-floor173';
  for(const row of g)row.fill(null);for(const t of d.tiles)g[t.y][t.x]=t.material;paint(0,17,w,1,'void173');paint(9,17,3,1,floor);
 }
 if(id==='shipDeck'||id==='shipLounge'){
  for(const row of g)row.fill('void173');
  const deck=id==='shipDeck',floor=deck?'ship-floor86':'wood-floor173',wall=deck?'legacy73-ground-shipDeck-120':'home-wall173';
  if(deck){paint(4,4,24,19,wall);paint(5,5,22,17,floor);}else{paint(4,4,24,16,wall);paint(5,5,22,14,floor);}
  paint(14,1,5,4,wall);paint(15,2,3,4,floor);
  if(!deck){
   paint(14,19,5,4,wall);paint(15,18,3,4,floor);
   paint(1,9,4,5,wall);paint(2,10,4,3,floor);
   paint(27,9,4,5,wall);paint(26,10,4,3,floor);
   paint(21,5,6,4,'kitchen-floor173');
   const spots=[[6,5],[8,5],[25,5],[22,5],[21,5],[6,9],[6,11],[24,9],[5,18],[8,8],[23,7],[25,8],[6,14],[8,14],[8,16],[24,14],[25,17]];
   d.objects=d.objects.map(o=>{if(o.stored79)return o;const k=/^a:design173-(\d+)$/.exec(o.id);assert(k&&spots[+k[1]],'Unknown furniture '+o.id);return {...o,x:spots[+k[1]][0],y:spots[+k[1]][1]};});
  }
 }
 if(id==='shipCabins'){
  paint(0,11,3,1,'wood-floor173');
  paint(14,0,3,5,'home-wall173');paint(15,1,1,5,'wood-floor173');
  paint(15,10,1,1,'home-wall173');
 }
 d.roomEntrances221=true;
 d.tiles=g.flatMap((r,y)=>r.map((material,x)=>({x,y,material}))).filter(t=>t.material);
 const v=m.applyEdit(base,d,cat),errors=m.validateEdit(base,d,cat);
 assert.deepEqual(errors,[],id);
 assert.deepEqual(v.npcs.map(n=>n.script),old.npcs.map(n=>n.script));
 assert.equal(d.objects.filter(o=>!o.stored79).length,(m.upgrade79(base,input||m.initial(base))).objects.filter(o=>!o.stored79).length);
 console.log({id,warps:v.warps.map(({x,y,to})=>({x,y,to})),spawn:v.spawn});return d;
}

const maps={...pub.maps},drafts={};for(const id of ids){maps[id]=transform(id,pub.maps[id]);drafts[id]=before['maps72:draft:'+id]?.data?.edit?transform(id,before['maps72:draft:'+id].data.edit):maps[id];}const views={...bases};for(const[id,d]of Object.entries(maps))if(bases[id]&&!m.validateEdit(bases[id],d,cat).length)views[id]=m.applyEdit(bases[id],d,cat);(await import('../src/roomEntrances221.mjs')).connectRoomEntrances221(views);assert.deepEqual((await import('../src/connections75.mjs')).validateLinks75(views),[]);fs.writeFileSync(dir+'/preview.json',JSON.stringify({...pub,maps}));fs.writeFileSync('artifacts/rooms221/preview.json',JSON.stringify({...pub,maps}));console.log({validated:true,dir,revision:before[P].version});if(!process.argv.includes('--publish'))return;const at=Date.now(),expected={[P]:before[P].version},writes={[P]:packPublished188({...pub,maps,at})};for(const id of ids){const D='maps72:draft:'+id,H='maps72:previous:'+id;expected[D]=before[D]?.version||0;expected[H]=before[H]?.version||0;writes[D]={...before[D]?.data,edit:drafts[id],by:'ヤノケン',at};writes[H]={edit:pub.maps[id]||null,at};}assert(await F.commit(expected,writes),'Concurrent edit, no overwrite');const live=await fetch('https://midori-no-shima.vercel.app/api/map-editor?maps202='+Date.now()).then(r=>r.json());assert.deepEqual(live.maps,maps);fs.writeFileSync(dir+'/result.json',JSON.stringify({revision:live.revision,verified:true}));console.log({published:true,revision:live.revision});})().catch(e=>{console.error(e);process.exit(1)});
