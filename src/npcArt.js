import {mapPerson119,trainerBattle119} from './peopleArt119.js';
import {ADDITIONAL_PEOPLE119} from './peopleCatalog119.mjs';
import {winterFrame} from './frontierArt.js';
import {matchHeroHeight} from "./humanScale.js";
// All residents and trainers share the hero's 32 x 48 frame and foot anchor.
export const NPC_VARIANTS=['少年','少女','スイスはかせ','おじいさん','看護師','店員','山歩きの人','お母さん','レンジャー','むしとり少年','花屋さん','釣り人','船乗り','鉱夫','考古学者','雪山の登山家','料理人','配達員','画家','音楽家','スポーツ少年','格闘家','学生','おばあさん','会社員','牧場の女性','飼育員','冒険少女','エーストレーナー','踊り子','ふくよかなトレーナー','おばあさんトレーナー','子供トレーナー','おじいさんトレーナー'];
NPC_VARIANTS.push(...ADDITIONAL_PEOPLE119.map(p=>p.label));
const atlases=NPC_VARIANTS.slice(0,34).map((_,i)=>{const im=new Image();im.src=new URL(i<30?'../assets/people-v13/'+String(i).padStart(2,'0')+'.png':'../assets/people-v79/'+['stout','grandma','child','grandpa'][i-30]+'.png',import.meta.url).href;return im;}),cache=new Map();
// A dedicated sheet keeps Yanoken consistent at the first meeting, on the ship and on the mountain.
const yanokenSheet=new Image();yanokenSheet.src=new URL('../assets/people-v79/yanoken.png',import.meta.url).href;
const yanokenFrames=new Map();
export function isYanoken(n){return n.name==='ヤノケン'||['v5:dex','voyage:yanoken','frontier:yanoken'].includes(n.script);}
function yanokenFrame(n,step){if(!yanokenSheet.complete||!yanokenSheet.naturalWidth)return null;const col=({down:0,left:1,right:2,up:3})[n.dir]??0,row=Math.max(0,Math.min(2,step)),key=col+':'+row;if(yanokenFrames.has(key))return yanokenFrames.get(key);const c=document.createElement('canvas');c.width=32;c.height=48;c.getContext('2d').drawImage(yanokenSheet,col*32,row*48,32,48,0,0,32,48);yanokenFrames.set(key,c);return c;}
function legacyNpcFrame119(n,step=1){if(isYanoken(n))return yanokenFrame(n,step);if(Number.isInteger(n.winterVariant))return winterFrame(n);const variant=Number.isInteger(n.variant)?n.variant:n.script==='v5:mother'?7:({boy:0,girl:1,prof:2,oldman:3,nurse:4,clerk:5,hiker:6,sailor:12})[n.look]??0;const im=atlases[variant];if(!im?.complete||!im.naturalWidth)return null;const col=({down:0,left:1,right:2,up:3})[n.dir]??0,key=variant+':'+col+':'+step;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=32;c.height=48;c.getContext('2d').drawImage(im,col*32,step*48,32,48,0,0,32,48);const fitted=variant===32?c:matchHeroHeight(c);cache.set(key,fitted);return fitted;}
export function drawNpc(ctx,n,tick,x,y){const step=n.moving?[0,1,2,1][Math.floor((n.roamProgress||Math.max(Math.abs(n.ox||0),Math.abs(n.oy||0))/32)*4)%4]:1,frame=mapPerson119(n,step)||legacyNpcFrame119(n,step);if(!frame)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(frame,Math.round(x+16-frame.width/2),Math.round(y));return true;}

export function npcFrame(n,step=1){return trainerBattle119(n)||legacyNpcFrame119(n,step);}
