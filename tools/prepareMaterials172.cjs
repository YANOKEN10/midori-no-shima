const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/materials-v172/manifest.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'tools/materialSources172.json'),'utf8'));
(async()=>{
 for(const m of manifest){
  const src=sources[m.id]; if(!src)throw Error('Missing source: '+m.id);
  const {data,info}=await sharp(src.path||src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x0=info.width,y0=info.height,x1=-1,y1=-1;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
   const i=(y*info.width+x)*4;data[i+3]=data[i+3]>=160?255:0;
   if(data[i+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  }
  if(x1<0)throw Error('Empty source '+m.id);
  const native=await sharp(data,{raw:info}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(m.w*16-2,m.h*16-2,{fit:'contain',kernel:'nearest',background:'#00000000'}).extend({top:1,bottom:1,left:1,right:1,background:'#00000000'}).png({palette:true,colours:32,dither:0}).toBuffer();
  await sharp(native).resize(m.w*32,m.h*32,{kernel:'nearest'}).png().toFile(path.join(root,m.file));
 }
 const dir=path.join(root,'docs/materials172');fs.mkdirSync(dir,{recursive:true});
 for(const group of [...new Set(manifest.map(m=>m.group))]){
  const subset=manifest.filter(m=>m.group===group),layers=[];
  for(let i=0;i<subset.length;i++){
   const m=subset[i],left=(i%5)*180,top=Math.floor(i/5)*175;
   layers.push({input:await sharp(path.join(root,m.file)).toBuffer(),left:left+Math.floor((180-m.w*32)/2),top:top+Math.floor((140-m.h*32)/2)});
   const label=Buffer.from(`<svg width="180" height="30"><text x="90" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#fff">${m.id}</text></svg>`);
   layers.push({input:label,left,top:top+140});
  }
  await sharp({create:{width:900,height:700,channels:4,background:'#53745c'}}).composite(layers).png().toFile(path.join(dir,group+'.png'));
 }
 console.log('Prepared 200 PNGs and 10 contact sheets');
})().catch(e=>{console.error(e);process.exit(1)});
