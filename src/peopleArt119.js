import {heroSelection127} from './heroCatalog127.mjs';
import {personKey119,battleKey119,HAIRSTYLES119,OUTFITS119} from './peopleCatalog119.mjs';
import {mapHeroFrame127,hairMask127} from './heroArt127.js';
const sheets=new Map(),frames=new Map();
function asset(key,battle=false){const id=(battle?'battle/':'map/')+key;if(!sheets.has(id)){const im=new Image();im.src=new URL('../assets/'+(/^hero-(?:boy-(?:fauxhawk|buzz)|girl-twintail)-(?:front|back)$/.test(key)?'hero-v127/':key==='rival-camo'||battle&&(key==='yanoken'||/^hero-(boy|girl)-.+-(front|back)$/.test(key))?'people-v121/':'people-v119/')+id+'.png',import.meta.url).href;sheets.set(id,im);}return sheets.get(id);}
export function sheetFrame119(key,dir='down',step=1){if(!key)return null;const id=key+':'+dir+':'+step;if(frames.has(id))return frames.get(id);const im=asset(key);if(!im.complete||!im.naturalWidth)return null;const c=document.createElement('canvas');c.width=32;c.height=48;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(im,({down:0,left:1,right:2,up:3}[dir]??0)*32,Math.max(0,Math.min(2,step))*48,32,48,0,0,32,48);frames.set(id,c);return c;}
export function mapPerson119(n,step=1){const key=n.eden?'eden':n.name==='ヤノケン'||['v5:dex','voyage:yanoken','frontier:yanoken'].includes(n.script)?'yanoken':Number.isInteger(n.winterVariant)?'winter-'+n.winterVariant:personKey119(Number.isInteger(n.variant)?n.variant:n.script==='v5:mother'?7:({boy:0,girl:1,prof:2,oldman:3,nurse:4,clerk:5,hiker:6,sailor:12}[n.look]??0));return sheetFrame119(key,n.dir,step);}
export function trainerBattle119(n){const key=n.name==='ヤノケン'||['v5:dex','voyage:yanoken','frontier:yanoken'].includes(n.script)?'yanoken':n.variant===2||n.look==='prof'||/スイス/.test(n.name||'')?'npc-02':battleKey119(n.variant);if(!key)return null;const im=asset(key,true);return im.complete&&im.naturalWidth?im:null;}
const battleTint121=new Map();
export function heroBattle119(look={},view='front'){
 const selection=heroSelection127(look),gender=selection.gender,hair=gender==='girl'&&selection.hair==='short'?'ear-short':selection.hair,key='hero-'+gender+'-'+(hair==='default'?'':hair+'-')+(view==='back'?'back':'front');
 const im=asset(key,true);if(!im.complete||!im.naturalWidth)return null;
 const hairColor=/^#[0-9a-f]{6}$/i.test(look.hair||'')?look.hair:'';
 if(!hairColor&&selection.outfit==='default')return im;
 const id=key+hairColor+selection.outfit;if(battleTint121.has(id))return battleTint121.get(id);
 const c=document.createElement('canvas');c.width=64;c.height=96;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,64,96),p=d.data,rgb=[1,3,5].map(i=>parseInt((hairColor||'#000000').slice(i,i+2),16));
 const mask=hairMask127(p,64,96,gender,true),original=new Uint8ClampedArray(p);
 for(let n=0;n<mask.length;n++){
  if(!hairColor||!mask[n])continue;const i=n*4,max=Math.max(p[i],p[i+1],p[i+2]);
  const shade=Math.max(.3,Math.min(1.45,max/(gender==='girl'?130:75)));
  for(let j=0;j<3;j++)p[i+j]=Math.min(255,Math.round(rgb[j]*shade));
 }
 const cloth={red:[157,66,55],green:[46,102,66],cream:[231,217,181],purple:[154,128,177]}[selection.outfit];
 if(cloth){
  // Match the original garment's blue palette, preserving skin, undershirt,
  // trousers and the dark contour of the complete battle sprite.
  for(let y=20;y<61;y++)for(let x=0;x<64;x++){
   const i=(y*64+x)*4,r=original[i],g=original[i+1],b=original[i+2];
   const shirt=gender==='girl'?y<56&&b>r*1.12&&b>g*1.04&&b<160&&r>19:b>105&&g>65&&b>r*1.22&&g>r*1.13;
   if(p[i+3]<128||mask[y*64+x]||!shirt)continue;
   const shade=Math.max(.28,Math.min(1.18,Math.max(r,g,b)/(gender==='girl'?83:173)));
   for(let j=0;j<3;j++)p[i+j]=Math.min(255,Math.round(cloth[j]*shade));
  }
 }
 ctx.putImageData(d,0,0);if(battleTint121.size>256)battleTint121.clear();battleTint121.set(id,c);return c;
}
export const mapHeroFrame119=mapHeroFrame127;
