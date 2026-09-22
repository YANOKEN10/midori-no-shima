const fs=require('fs'),path=require('path');const sharp=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
const root='assets/hero-v127';fs.mkdirSync(root+'/battle',{recursive:true});
for(const id of ['girl-twintail','boy-fauxhawk','boy-buzz']){
 const input=root+'/approved/'+id+'-battle.png',meta=await sharp(input).metadata(),parts=[];
 for(let col=0;col<2;col++){
 const left=Math.round(col*meta.width/2),width=Math.round((col+1)*meta.width/2)-left;
 const {data,info}=await sharp(input).extract({left,top:0,width,height:meta.height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(data[3]>0)throw Error('Background must be transparent: '+id);
 let x0=width,y0=info.height,x1=0,y1=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4;if(data[i+3]>180){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
 parts.push({data,info,x0,y0,w:x1-x0+1,h:y1-y0+1,col});
 }
 const scale=Math.min(54/Math.max(...parts.map(p=>p.w)),92/Math.max(...parts.map(p=>p.h)));
 for(const p of parts){
 const w=Math.round(p.w*scale),h=Math.round(p.h*scale);
 const {data,info}=await sharp(p.data,{raw:p.info}).extract({left:p.x0,top:p.y0,width:p.w,height:p.h}).resize(w,h,{kernel:'nearest'}).raw().toBuffer({resolveWithObject:true});
 for(let i=3;i<data.length;i+=4)data[i]=data[i]>160?255:0;
 const buf=await sharp(data,{raw:info}).png().toBuffer();
 await sharp({create:{width:64,height:96,channels:4,background:'#00000000'}}).composite([{input:buf,left:Math.floor((64-w)/2),top:95-h}]).png().toFile(root+'/battle/hero-'+id+'-'+(p.col?'back':'front')+'.png');
 }console.log(id);
}
})().catch(e=>{console.error(e);process.exit(1)});
