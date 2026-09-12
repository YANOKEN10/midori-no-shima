import {winterFrame} from './frontierArt.js';
import {matchHeroHeight} from "./humanScale.js";
// All residents and trainers share the hero's 32 x 48 frame and foot anchor.
export const NPC_VARIANTS=['少年','少女','スイスはかせ','おじいさん','看護師','店員','山歩きの人','お母さん','レンジャー','むしとり少年','花屋さん','釣り人','船乗り','鉱夫','考古学者','雪山の登山家','料理人','配達員','画家','音楽家','スポーツ少年','格闘家','学生','おばあさん','会社員','牧場の女性','飼育員','冒険少女','エーストレーナー','踊り子'];
const atlases=NPC_VARIANTS.map((_,i)=>{const im=new Image();im.src=new URL('../assets/people-v13/'+String(i).padStart(2,'0')+'.png',import.meta.url).href;return im;}),cache=new Map();
// A dedicated sheet keeps Yanoken consistent at the first meeting, on the ship and on the mountain.
const yanokenSheet=new Image();yanokenSheet.src=new URL('../assets/people-v36/yanoken-sheet.png',import.meta.url).href;
const yanokenFrames=new Map();
export function isYanoken(n){return n.name==='ヤノケン'||['v5:dex','voyage:yanoken','frontier:yanoken'].includes(n.script);}
let preparedYanoken=null;
function prepareYanoken(){
 if(preparedYanoken)return preparedYanoken;
 if(!yanokenSheet.complete||!yanokenSheet.naturalWidth)return null;
 const c=document.createElement('canvas');c.width=yanokenSheet.width;c.height=yanokenSheet.height;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(yanokenSheet,0,0);
 const pixels=ctx.getImageData(0,0,c.width,c.height),d=pixels.data,xCount=new Uint32Array(c.width),yCount=new Uint32Array(c.height);
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4;if(d[i]>160&&d[i+1]<120&&d[i+2]>150)d[i+3]=0;if(d[i+3]>=128){xCount[x]++;yCount[y]++;}}
 ctx.putImageData(pixels,0,0);
 // Locate the transparent gutters rather than cutting off boots at nominal grid boundaries.
 const bands=counts=>{const out=[];let start=-1;for(let i=0;i<=counts.length;i++){if(counts[i]>2){if(start<0)start=i;}else if(start>=0){if(i-start>20)out.push([start,i]);start=-1;}}return out;};
 let cols=bands(xCount),rows=bands(yCount);
 if(cols.length!==4)cols=Array.from({length:4},(_,i)=>[Math.round(i*c.width/4),Math.round((i+1)*c.width/4)]);
 if(rows.length!==3)rows=Array.from({length:3},(_,i)=>[Math.round(i*c.height/3),Math.round((i+1)*c.height/3)]);
 return preparedYanoken={canvas:c,cols,rows};
}
function yanokenFrame(n,step){
 const sheet=prepareYanoken();if(!sheet)return null;
 const col=({down:0,left:1,right:2,up:3})[n.dir]??0,row=Math.max(0,Math.min(2,step)),key=col+':'+row;
 if(yanokenFrames.has(key))return yanokenFrames.get(key);
 const [x,x1]=sheet.cols[col],[y,y1]=sheet.rows[row],w=x1-x,h=y1-y;
 const cell=document.createElement('canvas');cell.width=w;cell.height=h;cell.getContext('2d').drawImage(sheet.canvas,x,y,w,h,0,0,w,h);
 const fitted=matchHeroHeight(cell);yanokenFrames.set(key,fitted);return fitted;
}
export function npcFrame(n,step=1){if(isYanoken(n))return yanokenFrame(n,step);if(Number.isInteger(n.winterVariant))return winterFrame(n);const variant=Number.isInteger(n.variant)?n.variant:n.script==='v5:mother'?7:({boy:0,girl:1,prof:2,oldman:3,nurse:4,clerk:5,hiker:6,sailor:12})[n.look]??0;const im=atlases[variant];if(!im?.complete||!im.naturalWidth)return null;const col=({down:0,left:1,right:2,up:3})[n.dir]??0,key=variant+':'+col+':'+step;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=32;c.height=48;c.getContext('2d').drawImage(im,col*32,step*48,32,48,0,0,32,48);const fitted=matchHeroHeight(c);cache.set(key,fitted);return fitted;}
export function drawNpc(ctx,n,tick,x,y){const step=n.moving?[0,1,2,1][Math.floor((n.roamProgress||Math.max(Math.abs(n.ox||0),Math.abs(n.oy||0))/32)*4)%4]:1,frame=npcFrame(n,step);if(!frame)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(frame,Math.round(x+16-frame.width/2),Math.round(y));return true;}
