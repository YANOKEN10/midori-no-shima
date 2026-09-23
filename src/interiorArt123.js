import {MATERIALS123} from './materials123.mjs';
import {FURNITURE123} from './interiors123.mjs';
const tileImages=new Map(MATERIALS123.map(d=>{const im=new Image();im.src=new URL("../"+d.file,import.meta.url).href;return[d.key,im];}));
const tile123=(c,key,x,y)=>{const im=tileImages.get(key);if(im?.complete&&im.naturalWidth)c.drawImage(im,x,y,16,16);};
const images=new Map(FURNITURE123.map(([key])=>{const im=new Image();im.src=new URL('../assets/interiors-v123/'+key+'.png',import.meta.url).href;return[key,im];}));
export const interiorReady123=()=>[...images.values(),...tileImages.values()].every(im=>im.complete&&im.naturalWidth);
export function furniture123(c,kind,x,y,w,h){const im=images.get(kind);if(!im)return false;if(!im.complete||!im.naturalWidth)return true;c.save();c.imageSmoothingEnabled=false;const spec=FURNITURE123.find(f=>f[0]===kind),scale=Math.min(w/(spec[2]*16),h/(spec[3]*16));c.drawImage(im,Math.round(x+(w-im.width*scale)/2),Math.round(y+h-im.height*scale),im.width*scale,im.height*scale);c.restore();return true;}
// Render the architectural layer at native 16px tiles, then exactly 2x.
export function floor123(c,map){const r=map.room,W=map.rows[0].length,H=map.rows.length,cv=document.createElement('canvas');cv.width=W*16;cv.height=H*16;const a=cv.getContext('2d'),ruin=map.interior123==='ruin',galaxy=map.facility123==='galaxy',ship=map.shipStyle123,prefix=ship?'ship':ruin?'ruin':galaxy?'galaxy':'tower';a.imageSmoothingEnabled=false;const p=ruin?['#756647','#5a493b','#b8ae88','#75604a']:galaxy?['#434761','#34374e','#c1cadb','#776aa1']:['#438fa0','#307180','#e4dfbb','#b39a51'];a.fillStyle=ruin?'#141516':'#111c2b';a.fillRect(0,0,cv.width,cv.height);

 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const ch=map.rows[y][x],px=x*16,py=y*16;
  if(ch==='X'){
   if(map.interior123==='deck'){a.fillStyle='#225c8b';a.fillRect(px,py,16,16);a.fillStyle='#64c5d6';a.fillRect(px+3,py+4,7,1);a.fillStyle='#c9dce0';a.fillRect(px,py+8,16,2);a.fillRect(px+6,py+4,3,10);continue;}
   if(y+1<H&&map.rows[y+1][x]!=='X')tile123(a,prefix+(x%7===0?'-panel123':'-wall123'),px,py);
   else if(map.rows[y][x-1]&&map.rows[y][x-1]!=='X'||map.rows[y][x+1]&&map.rows[y][x+1]!=='X'){a.fillStyle=ship?'#d6dfe1':p[3];a.fillRect(px+5,py,6,16);}
   continue;
  }
  tile123(a,prefix+(map.cabin123||(!ship&&(x+y*3)%13===0)?'-accent123':'-floor123'),px,py);
 }

 if(!ruin&&!ship){const[x,y,w,h]=r.rug;a.fillStyle=galaxy?'#a8b7cf':'#dac888';a.fillRect(x*16,y*16,w*16,h*16);a.fillStyle=galaxy?'#635981':'#b8ac70';a.fillRect(x*16+2,y*16+2,w*16-4,h*16-4);a.strokeStyle=galaxy?'#c6d5ed':'#efe1ab';a.lineWidth=1;a.strokeRect(x*16+5.5,y*16+5.5,w*16-11,h*16-11);if(map.interior123==='arena'){a.strokeRect((x+w/2)*16-16.5,(y+h/2)*16-16.5,33,33);a.fillStyle=galaxy?'#b4cce2':'#ede2b4';a.fillRect(x*16+6,(y+h/2)*16,w*16-12,1);}}
 for(const [x,y] of map.cabinDoors160||[]){a.fillStyle='#e0c46e';a.fillRect(x*16,y*16+6,32,4);a.fillStyle='#795631';a.fillRect(x*16,y*16+10,32,2);}
 for(const wp of map.warps){a.fillStyle=ruin?'#ab4945':galaxy?'#afa0cd':'#e0c46e';a.fillRect(wp.x*16,wp.y*16,16,6);}
 c.save();c.imageSmoothingEnabled=false;c.drawImage(cv,0,0,W*32,H*32);c.restore();
}
