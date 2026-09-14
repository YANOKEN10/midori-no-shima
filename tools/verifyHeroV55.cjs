const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.argv[2]||'http://127.0.0.1:5182/',{waitUntil:'networkidle'});
const result=await page.evaluate(async()=>{
 const {heroFrame}=await import('/src/revampArt.js'),{generatedBoyFrame,heroVariantsReady}=await import('/src/heroVariants.js'),{APPEARANCE_COLORS}=await import('/src/data/fashion.js');
 const {drawTrainerBack,readyBattleArt}=await import('/src/battleSceneArt.js');
 for(let i=0;i<120&&(!heroVariantsReady()||!readyBattleArt());i++)await new Promise(r=>setTimeout(r,100));if(!heroVariantsReady()||!readyBattleArt())throw Error('Hero images not ready');
 const rgba=f=>f.getContext('2d').getImageData(0,0,32,48).data,dirs=['down','left','right','up'],lengths=[undefined,'short','medium','long'];let frames=0;
 const warm=(r,g,b)=>r>g*1.12&&g>b*1.12&&r>90;
 for(const hairLength of lengths)for(const dir of dirs)for(let step=0;step<3;step++){
   const silver=generatedBoyFrame(dir,step,{hair:'#cfd6dd',hairLength}),ref=rgba(silver);
   for(const color of APPEARANCE_COLORS){const look={gender:'boy',hair:color.color,hairLength,shirt:'#f2f2f2',pants:'#37a05a',shoes:'#d94b3a',shirtStyle:'stripe'};
     const base=generatedBoyFrame(dir,step,look),before=rgba(base),frame=heroFrame(dir,step,look),after=rgba(frame);let visible=0,skin=0;
     for(let n=0;n<1536;n++){const i=n*4;if(after[i+3])visible++;if(base.protectedHead[n]){
       for(let k=0;k<4;k++)if(before[i+k]!==after[i+k])throw Error('Clothing changed head: '+JSON.stringify(look)+':'+dir+':'+n);
       if(warm(before[i],before[i+1],before[i+2]))skin++;
       if((hairLength||base.generatedVariant==='silver')&&warm(ref[i],ref[i+1],ref[i+2]))for(let k=0;k<4;k++)if(before[i+k]!==ref[i+k])throw Error('Hair color changed skin: '+color.name+':'+dir+':'+n);
     }}
     if(visible<280||visible>1150)throw Error('Sprite bounds/matte failure '+visible);for(const n of [0,31,1504,1535])if(after[n*4+3])throw Error('Opaque background corner');if(dir!=='up'&&skin<2)throw Error('Missing skin '+dir+':'+color.name);frames++;
   }
 }
 for(const color of ['#cfd6dd','#2f6fd0','#241d1a','#e8bf2e','#d94b3a'])for(const dir of dirs){const poses=[0,1,2].map(step=>heroFrame(dir,step,{hair:color}).toDataURL());if(new Set(poses).size!==3)throw Error('Missing walk pose '+dir+':'+color);}
 const cv=document.createElement('canvas');cv.width=1152;cv.height=880;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#83aa97';c.fillRect(0,0,cv.width,cv.height);
 const colors=['#cfd6dd','#2f6fd0','#241d1a','#e8bf2e','#d94b3a','#6b4a2b','#f07ab0','#37a05a','#8a4fd0'];
 colors.forEach((hair,row)=>{dirs.forEach((dir,col)=>{const f=heroFrame(dir,1,{hair,shirt:'#f2f2f2'});c.drawImage(f,col*80,row*96,64,96);});});
 lengths.slice(1).forEach((hairLength,row)=>{dirs.forEach((dir,col)=>{const f=heroFrame(dir,1,{hair:'#cfd6dd',hairLength,shirt:'#f2f2f2'});c.drawImage(f,400+col*100,row*160,96,144);});});
 dirs.forEach((dir,row)=>{[0,1,2].forEach((step,col)=>c.drawImage(heroFrame(dir,step,{hair:'#2f6fd0'}),820+col*100,row*144,96,144));});
 for(let i=0;i<5;i++){c.save();c.translate(390+i*140,640);c.scale(1.6,1.6);drawTrainerBack(c,{hair:colors[i]},0,0);c.restore();}
 return {frames,image:cv.toDataURL()};
});assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/hero-v55-verified.png',Buffer.from(result.image.split(',')[1],'base64'));console.log('PASS '+result.frames+' color/style/direction/pose combinations; skin and head preserved under clothing; 5 generated palettes animate in all directions');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

