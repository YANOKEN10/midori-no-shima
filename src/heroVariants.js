// Generated full-body variants. Other palette choices use only the neutral hair
// pixels in the new silver master; warm skin and blue eyes never qualify.
const files=['silver','blue','black','gold','red','heads'];
const images=Object.fromEntries(files.map(name=>{const im=new Image();im.src=new URL('../assets/hero-variants-v55/'+name+'.png',import.meta.url).href;return [name,im];}));
const exact=new Map([
 ['#cfd6dd','silver'],['#2f6fd0','blue'],['#241d1a','black'],
 ['#e8bf2e','gold'],['#e0c05a','gold'],['#d94b3a','red'],['#b8452e','red'],
]);
const cache=new Map();
export const heroVariantsReady=()=>files.every(k=>images[k].complete&&images[k].naturalWidth===128);
const canvas=()=>{const c=document.createElement('canvas');c.width=32;c.height=48;return c;};
function extract(name,col,row){const im=images[name];if(!im.complete||!im.naturalWidth)return null;const c=canvas();c.getContext('2d').drawImage(im,col*32,row*48,32,48,0,0,32,48);return c;}
function neutralHair(r,g,b,a){
 const high=Math.max(r,g,b),low=Math.min(r,g,b);
 return a>0&&high>=60&&b>=r*.98&&high-low<85&&low/high>.55;
}
export function generatedBoyFrame(dir,step,look={}){
 const color=/^#[0-9a-f]{6}$/i.test(look.hair||'')?look.hair.toLowerCase():'#6b4a2b';
 const length=['short','medium','long'].includes(look.hairLength)?look.hairLength:null;
 const key=[color,length,dir,step].join(':');if(cache.has(key))return cache.get(key);
 const col={down:0,left:1,right:2,up:3}[dir]??0;
 const name=length?'silver':exact.get(color)||'silver';
 const base=extract(name,col,step);if(!base)return null;
 const c=base.getContext('2d');let headPixels=null;
 if(length){
   const head=extract('heads',col,{short:0,medium:1,long:2}[length]);if(!head)return null;
   // Remove the old head before drawing the complete replacement, including its face.
   c.clearRect(0,0,32,24);c.drawImage(head,0,0);
   headPixels=head.getContext('2d').getImageData(0,0,32,48).data;
 }
 const data=c.getImageData(0,0,32,48),p=data.data,mask=new Uint8Array(32*48),protect=new Uint8Array(32*48);
 for(let y=0;y<48;y++)for(let x=0;x<32;x++){
   const n=y*32+x,i=n*4;
   const inHead=headPixels?headPixels[i+3]>0:y<24;
   if(inHead)protect[n]=1;
   let eye=false;
   // Protect the blue irises AND their neighboring white highlights. Silver
   // hair has low saturation; these saturated blue pixels belong to the eyes.
   if(inHead)for(let yy=Math.max(0,y-1);yy<=Math.min(47,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(31,x+1);xx++){
     const j=(yy*32+xx)*4;if(p[j+3]&&p[j+2]>140&&p[j+2]>p[j]*1.6&&p[j+2]>p[j+1]*1.05)eye=true;
   }
   if(inHead&&!eye&&neutralHair(p[i],p[i+1],p[i+2],p[i+3]))mask[n]=1;
 }
 if((length&&color!=='#cfd6dd')||!exact.has(color)){
   const rgb=[1,3,5].map(n=>parseInt(color.slice(n,n+2),16));
   for(let n=0;n<mask.length;n++)if(mask[n]){
     const i=n*4,l=(p[i]*.3+p[i+1]*.5+p[i+2]*.2)/230;
     const highlight=Math.max(0,(l-.77)/.23)*.45;
     for(let k=0;k<3;k++)p[i+k]=Math.round(Math.min(255,rgb[k]*Math.min(1,l)*(1-highlight)+255*highlight));
   }
   c.putImageData(data,0,0);
 }
 base.protectedHead=protect;base.hairMask=mask;base.generatedVariant=name;
 if(cache.size>768)cache.clear();cache.set(key,base);return base;
}
