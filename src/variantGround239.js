const directions={right:'右向き',left:'左向き',up:'上向き',down:'下向き'};
export const VARIANT_FLOORS239=['snow','soil'].flatMap(kind=>{
 const label=kind==='snow'?'雪':'土';return [['terrain239-'+kind,label+'の地面（草地と同じ模様）',','],...Object.entries(directions).map(([dir,name])=>['terrain239-'+kind+'-'+dir,label+'の低い崖・'+name,'X'])];
});
const keys=new Set(VARIANT_FLOORS239.map(v=>v[0]));
// Preserve the original pixel shapes and rock colors; only the green ground changes.
export function drawVariantGround239(c,key,x,y,material){
 if(!keys.has(key))return false;
 const [,kind,dir]=key.split('-'),snow=kind==='snow';
 const layer=document.createElement('canvas');layer.width=layer.height=32;const l=layer.getContext('2d');l.imageSmoothingEnabled=false;
 l.save();if(dir){l.translate(16,16);l.rotate(({down:0,left:1,up:2,right:3})[dir]*Math.PI/2);material(l,'cliff',-16,-16,32,32);}else material(l,'grass',0,0,32,32);l.restore();
 const pixels=l.getImageData(0,0,32,32),a=pixels.data;
 for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2];if(!a[i+3]||dir&&!(g>r*1.12&&g>b*1.03))continue;const light=(r*.2126+g*.7152+b*.0722)/255;const base=snow?[170,191,197]:[116,76,43],range=snow?[77,59,57]:[105,99,76];for(let n=0;n<3;n++)a[i+n]=Math.round(base[n]+range[n]*light);}
 l.putImageData(pixels,0,0);c.imageSmoothingEnabled=false;c.drawImage(layer,x,y);return true;
}
