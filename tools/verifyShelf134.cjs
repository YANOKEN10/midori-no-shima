const fs=require('fs'),assert=require('assert/strict'),{chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
const p=await b.newPage({viewport:{width:1200,height:1200}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/src/main.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.route('**/usage-tracker.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.goto(process.env.BASE||'http://127.0.0.1:5182/');
const result=await p.evaluate(async()=>{
const E=await import('/src/editorModel72.mjs'),{MAPS}=await import('/src/data/maps.js'),F=await import('/src/furnitureCatalog128.mjs'),A=await import('/src/interiorArt.js'),C=await import('/src/chapterArt.js');
const cat=E.catalog(MAPS,[]),base={id:'test128',name:'検証室',kind:'in',rows:Array(20).fill('f'.repeat(24)),props:[],npcs:[],signs:[],items:[],warps:[],spawn:{x:1,y:18},room:{theme:'home',windows:[],bounds:[0,0,24,20],rug:[0,0,0,0],furniture:[]}};
cat.maps.test128=base;let count=0;
for(const table of cat.furniture.filter(t=>F.shelf134(t)))for(const item of ['plant-fern128','vase-blue128','vase-flowers128']){
 const doc=E.initial(base);doc.objects=[{id:'a:table',type:'furniture',template:table.key,x:4,y:4},{id:'a:item',type:'furniture',template:item,x:4,y:4}];
 const errs=E.validateEdit(base,doc,cat);if(errs.length)throw Error(table.key+': '+errs.join('|'));
 const applied=E.applyEdit(base,doc,cat);if(applied.tabletopFurniture128.length!==1)throw Error('mount missing');
 const dup=structuredClone(doc);dup.objects.push({id:'a:duplicate',type:'furniture',template:item,x:4,y:4});if(!E.validateEdit(base,dup,cat).some(e=>e.includes('重なり')))throw Error('item overlap allowed');
 const partial=structuredClone(doc);partial.objects[1].x=4+table.w-0.5;if(!E.validateEdit(base,partial,cat).length)throw Error('partial outside accepted');count++;
}
const cv=document.createElement('canvas');cv.width=1200;cv.height=1200;document.body.replaceChildren(cv);document.body.style='margin:0;background:#dcefe6';const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const doc=E.initial(base);doc.objects=[{id:'a:shelf',type:'furniture',template:'shop-glass106',x:4,y:6},{id:'a:fern',type:'furniture',template:'plant-fern128',x:6,y:6}];const map=E.applyEdit(base,doc,cat);const paint=()=>{ctx.clearRect(0,0,1200,1200);ctx.save();ctx.scale(3,3);C.drawChapterMap(ctx,map,0,0);ctx.restore();};
paint();const ready=await import('/src/furnitureArt128.js');for(let n=0;n<300&&!ready.furnitureReady128();n++)await new Promise(r=>setTimeout(r,100));if(!ready.furnitureReady128())throw Error('Furniture images did not load');paint();await new Promise(r=>setTimeout(r,1000));paint();return {cases:count,catalog:F.FURNITURE128.length,originalSizes:cat.furniture.filter(f=>['books','kitchen'].includes(f.key))};
});await p.screenshot({path:'artifacts/shelf134.png'});assert.deepEqual(errors,[]);console.log(JSON.stringify(result));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
