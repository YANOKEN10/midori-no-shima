const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
const root='assets/hero-v127',dir=root+'/approved',out=root+'/map';
fs.mkdirSync(out,{recursive:true});
for(const file of fs.readdirSync(dir).filter(n=>n.endsWith('.png')&&!n.includes('battle'))){
 const input=path.join(dir,file),meta=await sharp(input).metadata(),parts=[];
 for(let row=0;row<3;row++)for(let col=0;col<4;col++){
  const left=Math.round(col*meta.width/4),top=Math.max(0,Math.round(row*meta.height/3-meta.height/30)),width=Math.round((col+1)*meta.width/4)-left,height=Math.min(meta.height,Math.round((row+1)*meta.height/3+meta.height/30))-top;
  const {data,info}=await sharp(input).extract({left,top,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x0=width,y0=height,x1=0,y1=0;
  const seen=new Uint8Array(width*height);let largest=[];
  for(let k=0;k<seen.length;k++){if(seen[k]||data[k*4+3]<=180)continue;const component=[k];seen[k]=1;for(let q=0;q<component.length;q++){const at=component[q],ax=at%width,ay=Math.floor(at/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=ax+dx,ny=ay+dy,n=ny*width+nx;if(nx<0||nx>=width||ny<0||ny>=height||seen[n]||data[n*4+3]<=180)continue;seen[n]=1;component.push(n);}}if(component.length>largest.length)largest=component;}
  const keep=new Set(largest);for(let k=0;k<seen.length;k++)if(!keep.has(k))data[k*4+3]=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4;if(data[i+3]>180&&Math.max(data[i],data[i+1],data[i+2])>18){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
  if(x1<x0||y1<y0)throw Error('Empty pose '+file+row+col);
  parts.push({data,info,x0,y0,w:x1-x0+1,h:y1-y0+1,row,col});
 }
 // One scale for the complete sheet; never align or replace individual body parts.
 const scale=Math.min((file.startsWith('girl-twintail')?32:28)/Math.max(...parts.map(p=>p.w)),44/Math.max(...parts.map(p=>p.h)));
 const layers=[];
 for(const p of parts){
  const w=Math.max(1,Math.round(p.w*scale)),h=Math.max(1,Math.round(p.h*scale));
  const {data,info}=await sharp(p.data,{raw:p.info}).extract({left:p.x0,top:p.y0,width:p.w,height:p.h}).resize(w,h,{kernel:'nearest'}).raw().toBuffer({resolveWithObject:true});
  for(let i=3;i<data.length;i+=4)data[i]=data[i]>160?255:0;
  layers.push({input:await sharp(data,{raw:info}).png().toBuffer(),left:p.col*32+Math.floor((32-w)/2),top:p.row*48+47-h});
 }
 await sharp({create:{width:128,height:144,channels:4,background:'#00000000'}}).composite(layers).png().toFile(path.join(out,file));
 console.log(file);
}
})();
