const fs=require('fs'),assert=require('assert/strict'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
const p=await b.newPage({viewport:{width:1200,height:1200}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/src/main.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.route('**/usage-tracker.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.goto(process.env.BASE||'http://127.0.0.1:5182/');
const result=await p.evaluate(async()=>{
const E=await import('/src/editorModel72.mjs'),{MAPS}=await import('/src/data/maps.js'),F=await import('/src/furnitureCatalog128.mjs'),A=await import('/src/interiorArt.js'),C=await import('/src/chapterArt.js');
const cat=E.catalog(MAPS,[]),base={id:'test128',name:'検証室',kind:'in',rows:Array(20).fill('f'.repeat(24)),props:[],npcs:[],signs:[],items:[],warps:[],spawn:{x:1,y:18},room:{theme:'home',windows:[],bounds:[0,0,24,20],rug:[0,0,0,0],furniture:[]}};
cat.maps.test128=base;let count=0;
for(const table of F.FURNITURE128.filter(t=>F.table128(t)))for(const item of ['computer84','register84']){
 const doc=E.initial(base);doc.objects=[{id:'a:table',type:'furniture',template:table.key,x:4,y:4},{id:'a:item',type:'furniture',template:item,x:4,y:4}];
 const errs=E.validateEdit(base,doc,cat);if(errs.length)throw Error(table.key+': '+errs.join('|'));
 const applied=E.applyEdit(base,doc,cat);if(applied.tabletopFurniture128.length!==1||applied.room.furniture.length!==1)throw Error('mount missing');
 if(applied.tabletopFurniture128[0].f[2]!==3.625)throw Error('mount height');
 const dup=structuredClone(doc);dup.objects.push({id:'a:duplicate',type:'furniture',template:'register84',x:4,y:4});if(!E.validateEdit(base,dup,cat).some(e=>e.includes('重なり')))throw Error('item overlap allowed');
 const partial=structuredClone(doc);partial.objects[1].x=4+table.w-0.5;if(!E.validateEdit(base,partial,cat).length)throw Error('partial outside accepted');
 count++;
}
const cv=document.createElement('canvas');cv.width=1200;cv.height=1200;document.body.replaceChildren(cv);document.body.style='margin:0;background:#dcefe6';const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const paint=()=>{ctx.fillStyle='#dcefe6';ctx.fillRect(0,0,1200,1200);let n=0;for(const t of F.FURNITURE128){const x=(n%6)*195,y=Math.floor(n/6)*185;ctx.fillStyle='#123447';ctx.font='12px sans-serif';ctx.fillText(t.label,x+5,y+15);ctx.save();ctx.translate(x+10,y+25);const scale=Math.min(1.4,165/(t.w*32),145/(t.h*32));ctx.scale(scale,scale);A.drawFurniture72(ctx,{theme:'home'},[[t.key,0,0,t.w,t.h]]);if(F.table128(t))A.drawFurniture72(ctx,{theme:'home'},[['computer84',0,-0.375,1,1],['register84',1,-0.375,1,1]]);ctx.restore();n++;}
for(const [i,key]of ['books','lab-bookshelf86','kitchen'].entries()){const s=cat.furniture.find(f=>f.key===key);ctx.save();ctx.translate(10+i*380,970);ctx.fillStyle='#123447';ctx.fillText(key+' '+s.w+'x'+s.h,0,0);ctx.scale(2,2);A.drawFurniture72(ctx,{theme:'home'},[[key,0,0,s.w,s.h]]);ctx.restore();}};
paint();await new Promise(r=>setTimeout(r,1500));paint();return {cases:count,catalog:F.FURNITURE128.length,originalSizes:cat.furniture.filter(f=>['books','kitchen'].includes(f.key))};
});await p.screenshot({path:'artifacts/verify128-furniture.png'});assert.deepEqual(errors,[]);console.log(JSON.stringify(result));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
