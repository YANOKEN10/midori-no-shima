// Clothing follows the original sprite alpha and shading in every walking pose.
const rgb=s=>/^#[0-9a-f]{6}$/i.test(s||'')?[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)):null;
export function dressHero(canvas,base,look,dir){
 const c=canvas.getContext('2d'),d=c.getImageData(0,0,32,48),src=base.getContext('2d').getImageData(0,0,32,48).data;
 for(let y=23;y<48;y++)for(let x=0;x<32;x++){
  const i=(y*32+x)*4,r=src[i],g=src[i+1],b=src[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
  if(!src[i+3]||hi<35||base.protectedHead?.[y*32+x])continue;
  const skin=r>g*1.12&&g>b*1.12&&r>175&&g>115;
  const shirt=y<35&&!skin&&(look.gender==='girl'?b>r*1.05&&b>=g:(b>r*1.15||hi-lo<38&&lo>110));
  const pants=y>=35&&y<42&&!skin&&(b>=r*.9&&b>g*.9||hi-lo<35);
  const shoes=y>=42;
  const slot=shirt?'shirt':pants?'pants':shoes?'shoes':null;if(!slot)continue;
  let color=rgb(look[slot]);if(!color)continue;const style=look[slot+'Style'];let accent=false;
  if(slot==='shirt')accent=style==='stripe'?y%4<2:style==='vest'?x<11||x>21:style==='jacket'?Math.abs(x-16)<=1:style==='sailor'?y<27:style==='tunic'?y>=32:false;
  if(slot==='pants')accent=style==='stripe'?x%10<2:style==='cargo'?y===37||y===38:style==='cuff'?y>=40:style==='shorts'?y>=39:false;
  if(slot==='shoes')accent=style==='sneakers'?y>=46:style==='dress'?y%3===0:style==='sandals'?y<45:style==='boots'?y===43:false;
  if(accent)color=rgb(look[slot+'Accent'])||color;
  const shade=Math.max(.35,Math.min(1.25,hi/(slot==='shirt'?180:120)));
  for(let k=0;k<3;k++)d.data[i+k]=Math.min(255,Math.round(color[k]*shade));
 }
 c.putImageData(d,0,0);
 if(look.hat)drawHat(c,look,dir);
}
function drawHat(c,look,dir){
 const color=look.hatColor||'#345b81',accent=look.hatAccent||'#e9c87e',style=look.hatStyle||look.hat;
 const x=dir==='left'?5:dir==='right'?7:6;
 const box=(dx,y,w,h,fill)=>{c.fillStyle=fill;c.fillRect(x+dx,y,w,h);};
 box(1,5,18,6,'#24343e');box(2,4,16,7,color);box(4,2,12,3,color);
 if(style==='beret'){box(-1,5,20,5,color);box(11,1,2,2,'#24343e');box(1,10,18,2,accent);}
 else if(style==='beanie'){box(4,1,12,5,color);box(7,0,5,3,accent);box(1,10,18,3,accent);for(let j=4;j<17;j+=4)box(j,4,1,5,accent);}
 else if(style==='safari'||style==='straw'){box(-3,10,26,3,'#24343e');box(-2,10,24,2,color);box(2,8,16,2,accent);}
 else{box(1,10,18,2,accent);if(dir!=='up')box(dir==='left'?-4:dir==='right'?13:3,11,11,2,color);box(8,6,3,3,accent);}
}
