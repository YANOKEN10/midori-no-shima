const fs=require('fs'),sharp=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{const root='assets/furniture-v128',rows=[...JSON.parse(fs.readFileSync(root+'/prompts-0.json','utf8').replace(/^\uFEFF/,'')),...JSON.parse(fs.readFileSync(root+'/prompts-8.json','utf8').replace(/^\uFEFF/,''))];
for(const {id,w,h} of rows){const {data,info}=await sharp(root+'/source/'+id+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=0,y1=0,edgeAlpha=data[3];for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>180){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
if(edgeAlpha)throw Error('Opaque background '+id);
const {data:small,info:si}=await sharp(data,{raw:info}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(w-2,h-2,{fit:'fill',kernel:'nearest'}).raw().toBuffer({resolveWithObject:true});for(let i=3;i<small.length;i+=4)small[i]=small[i]>180?255:0;
const buf=await sharp(small,{raw:si}).png().toBuffer();await sharp({create:{width:w,height:h,channels:4,background:'#00000000'}}).composite([{input:buf,left:1,top:1}]).png().toFile(root+'/'+id+'.png');console.log(id,w,h);}
fs.writeFileSync(root+'/prompts.json',JSON.stringify(rows,null,2));})().catch(e=>{console.error(e);process.exit(1)});
