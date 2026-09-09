// Normalize the visible person, not the transparent atlas cell.
const normalized=new WeakMap();
export function matchHeroHeight(source){
  if(normalized.has(source))return normalized.get(source);
  const sw=source.width,sh=source.height,ctx=source.getContext('2d',{willReadFrequently:true}),data=ctx.getImageData(0,0,sw,sh).data;
  let x0=sw,y0=sh,x1=-1,y1=-1;
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++)if(data[(y*sw+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  if(x1<0)return source;
  const w=x1-x0+1,h=y1-y0+1,dh=46,dw=Math.max(1,Math.round(w*dh/h));
  const out=document.createElement('canvas');out.width=Math.max(32,Math.ceil((dw+2)/2)*2);out.height=48;
  const draw=out.getContext('2d');draw.imageSmoothingEnabled=false;draw.drawImage(source,x0,y0,w,h,Math.floor((out.width-dw)/2),48-dh,dw,dh);
  normalized.set(source,out);return out;
}
