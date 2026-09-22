import {heroSelection127} from './heroCatalog127.mjs';
const sheets=new Map(),frames=new Map();
export function heroAsset127(look={}){
 const {gender,hair,outfit}=heroSelection127(look);
 return gender+'-'+hair+(outfit==='default'?'':'-'+outfit);
}
function sheet(key){
 if(!sheets.has(key)){const im=new Image();im.src=new URL('../assets/hero-v127/map/'+key+'.png',import.meta.url).href;sheets.set(key,im);}
 return sheets.get(key);
}
export function mapHeroFrame127(dir='down',step=1,look={}){
 const key=heroAsset127(look),im=sheet(key),row=Math.max(0,Math.min(2,step|0)),col=({down:0,left:1,right:2,up:3}[dir]??0);
 if(!im.complete||!im.naturalWidth)return null;
 const tint=/^#[0-9a-f]{6}$/i.test(look.hair||'')?look.hair:'',id=key+':'+col+':'+row+':'+tint;
 if(frames.has(id))return frames.get(id);
 const c=document.createElement('canvas');c.width=32;c.height=48;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;
 // The selected file already contains the complete person and clothing palette.
 ctx.drawImage(im,col*32,row*48,32,48,0,0,32,48);
 if(tint){
  const d=ctx.getImageData(0,0,32,48),p=d.data,girl=look.gender==='girl',rgb=[1,3,5].map(i=>parseInt(tint.slice(i,i+2),16));
  const mask=hairMask127(p,32,48,girl?'girl':'boy');
  for(let n=0;n<mask.length;n++){
   if(!mask[n])continue;const i=n*4,hi=Math.max(p[i],p[i+1],p[i+2]);
   const shade=Math.max(.22,Math.min(1.25,hi/(girl?155:78)));
   for(let ch=0;ch<3;ch++)p[i+ch]=Math.round(Math.min(255,rgb[ch]*shade));
  }
  ctx.putImageData(d,0,0);
 }
 if(frames.size>700)frames.clear();frames.set(id,c);return c;
}


// Follow connected regions of the source hair palette from the crown.
// Garment colors cannot join a region merely because their hue is similar.
export function hairMask127(p,w,h,gender,battle=false){
 const limit=battle?(gender==='girl'?66:35):(gender==='girl'?36:29),seed=battle?22:20;
 const candidate=new Uint8Array(w*h),seen=new Uint8Array(w*h),mask=new Uint8Array(w*h);
 for(let y=0;y<Math.min(h,limit);y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,r=p[i],g=p[i+1],b=p[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
  candidate[y*w+x]=p[i+3]>127&&hi>28&&(gender==='girl'
   ?r>g*1.24&&g>r*.43&&g>b*1.15&&r<210&&g<140
   :b>=r&&b-r<45&&b<g*1.65&&hi<130&&lo>14)?1:0;
 }
 for(let start=0;start<candidate.length;start++){
  if(!candidate[start]||seen[start])continue;
  const stack=[start],region=[];seen[start]=1;let top=h;
  while(stack.length){const n=stack.pop(),y=Math.floor(n/w),x=n%w;region.push(n);top=Math.min(top,y);
   for(const m of [x>0?n-1:-1,x<w-1?n+1:-1,y>0?n-w:-1,y<h-1?n+w:-1]){
    if(m>=0&&candidate[m]&&!seen[m]){seen[m]=1;stack.push(m);}
   }
  }
  if(top<seed)for(const n of region)mask[n]=1;
 }
 return mask;
}
