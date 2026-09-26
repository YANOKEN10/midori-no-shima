import {drawRockTerrain180} from './rockTerrain180.js';
import {drawWaterfallTile173} from './waterfall173.js';
import {drawCliff173} from './cliffArt173.js';
import {drawBank173} from './shore173.js';
import {MATERIALS173} from './materialCatalog173.mjs';
const textures={};for(const id of ['cave-floor','volcano-floor','ruins-floor','lava','wood-floor','kitchen-floor']){const im=new Image();im.src=new URL('../assets/terrain-v173/'+id+'.png',import.meta.url);textures[id+'173']=im;}
export const terrainReady173=()=>Object.values(textures).every(im=>im.complete&&im.naturalWidth);
const keys=new Set(MATERIALS173.map(p=>p[0])),cache=new Map();
function nativeTile(key){if(cache.has(key))return cache.get(key);const cv=document.createElement('canvas');cv.width=cv.height=16;const c=cv.getContext('2d');const box=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const home=key.startsWith('home'),clinic=key.startsWith('clinic'),ruin=key.startsWith('ruins'),hot=key.startsWith('volcano');
 if(key.startsWith('snow')||key.startsWith('ice')){
 const ice=key.startsWith('ice');box(ice?'#b9d9e4':'#e7eee8',0,0,16,16);
 if(key.includes('wall')||key.includes('front')||key.includes('corner')){
  if(key.includes('wall')){box(ice?'#6e9fb6':'#5d594c',0,0,16,16);for(const[x,y,ww,hh]of [[1,2,6,6],[9,1,6,7],[0,10,7,6],[9,10,6,6]]){box(ice?'#a5cbdc':'#96917a',x,y,ww,hh);box(ice?'#c9e4e9':'#b0ab8e',x,y,ww,1);box(ice?'#5b8da9':'#706b58',x+ww-1,y+2,1,hh-2);}box('#eef4eb',0,0,16,2);box('#d0e3e4',3,2,4,1);}
  else{box(ice?'#568cab':'#544b3c',0,3,16,13);for(let x=0;x<16;x+=4){box(ice?'#8cc1d3':'#807760',x,4,3,9);box(ice?'#acd9e4':'#a69b7c',x,4,1,6);}box('#f0f5ed',0,0,16,3);box('#d0e5e8',1,3,5,2);box('#d0e5e8',9,3,5,2);box(ice?'#416982':'#393c37',0,15,16,1);if(key.includes('corner')){box('#ecf4ed',0,0,3,16);box('#d0e5e8',3,2,2,12);}}
 }else if(key==='snow-stairs173'){for(let y=0;y<16;y+=4){box('#fbf8e9',0,y,16,1);box('#bdccd0',0,y+1,16,2);box('#8d9ea5',0,y+3,16,1);}}
 else if(key==='ice-water173'){box('#306f8e',0,0,16,16);box('#8bbfcf',2,4,7,1);box('#609fae',10,11,5,1);}
 else if(key==='snow-grass173'){for(const[x,y]of [[2,9],[6,5],[10,10],[13,6]]){box('#b7a96d',x,y,1,5);box('#d3c68a',x-1,y,3,2);box('#8e966d',x+1,y+3,1,2);}box('#f2f5e9',1,14,3,1);}
 else if(key==='snow-path173'){box('#d7dfd3',0,0,16,16);box('#bdcbc5',3,5,2,1);box('#e7e9dd',9,11,4,1);}
 else if(ice){box('#d5eaec',2,3,6,1);box('#e7f4ef',8,4,1,3);box('#96c0d5',3,11,3,1);box('#96c0d5',6,12,1,2);box('#e7f4ef',11,9,4,1);}
 else{box('#cfdfdf',3,6,3,1);box('#f6f8ee',10,11,4,1);}
 }else if(key==='wood-floor173'){box('#b9915f',0,0,16,16);box('#806241',0,7,16,1);box('#806241',0,15,16,1);box('#dbc18b',0,0,16,1);box('#dbc18b',0,8,16,1);box('#806241',5,0,1,7);box('#806241',12,8,1,7);box('#aa8254',8,4,5,1);box('#cba974',2,11,6,1);}
 else if(key==='kitchen-floor173'){box('#ceddd4',0,0,16,16);for(let y=0;y<16;y+=8)for(let x=0;x<16;x+=8){box('#85aaa5',x,y,8,1);box('#85aaa5',x,y,1,8);box('#edf0dd',x+2,y+2,5,5);box('#b1ccc4',x+4,y+3,2,3);}}
 else if(key.includes('wall')||key.includes('front')){
  if(home||clinic){box(home?'#423629':'#4c626a',0,0,16,16);box(home?'#dbd0aa':'#d1e3dd',0,2,16,10);box(home?'#eee3c5':'#e6f3e9',0,2,16,1);box(home?'#c9bc94':'#bdd5d0',3,8,4,1);box(home?'#a78154':'#8db4ad',0,12,16,2);box(home?'#755231':'#567d7b',0,14,16,2);box(home?'#9b744b':'#97b2b1',0,0,16,2);}
  else {const p=hot?['#261e25','#473138','#68433e','#936048']:ruin?['#323c38','#566158','#7e8771','#a0a487']:['#192e38','#304650','#49616a','#71818a'];box(p[0],0,0,16,16);
   if(ruin){for(let y=0;y<16;y+=8)for(let x=-8;x<16;x+=8){const xx=x+(y?4:0);box(p[1],xx+1,y+1,7,7);box(p[2],xx+1,y+1,7,1);box(p[3],xx+1,y+2,1,3);}}
   else{for(const[x,y,w,h]of [[0,0,7,6],[8,0,8,5],[2,6,8,6],[11,6,5,7],[0,13,8,3],[8,14,8,2]]){box(p[1],x,y,w,h);box(p[2],x+1,y,w-2,2);box(p[3],x+1,y+1,2,1);box(p[0],x+w-1,y+h-3,1,3);}}
   if(key.includes('front')){box(p[3],0,0,16,2);for(let x=0;x<16;x+=4){box(p[1],x,3,3,11);box(p[2],x,3,1,8);}box(p[0],0,14,16,2);}
  }
 }else if(key==='stairs173'){box('#3b4547',0,0,16,16);for(let y=0;y<16;y+=4){box('#9a9e8c',1,y,14,1);box('#747e76',1,y+1,14,2);}}
 else if(key==='bridge173'){box('#3c2922',0,0,16,16);for(let y=0;y<16;y+=4){box('#ab7c47',0,y,16,3);box('#d0a264',0,y,16,1);box('#695038',2,y+1,1,1);box('#695038',13,y+1,1,1);}}
 else if(key==='stone-bridge173'){box('#45423d',0,0,16,16);box('#85877a',1,1,14,14);box('#b2b09a',1,1,14,1);box('#656b62',8,2,1,13);box('#656b62',1,8,14,1);}
 else if(key==='water173'){box('#174454',0,0,16,16);box('#215d68',1,3,7,1);box('#317985',8,10,7,1);box('#1b5260',2,13,4,1);}
 else if(key.startsWith('rug')){box(key==='rug173'?'#2a4e62':'#713744',0,0,16,16);box('#879d9d',7,5,2,1);box('#879d9d',5,7,1,2);box('#879d9d',10,7,1,2);box('#879d9d',7,10,2,1);}
 else box('#121b22',0,0,16,16);
 cache.set(key,cv);return cv;
}
export function drawTerrain173(c,key,x,y){if(!keys.has(key))return false;if(drawRockTerrain180(c,key,x,y))return true;if(drawWaterfallTile173(c,key,x,y))return true;if(drawCliff173(c,key,x,y))return true;if(key.startsWith('bank-'))return drawBank173(c,({'n':1,'e':2,'s':4,'w':8,'ne':3,'se':6,'sw':12,'nw':9,'inner-nw':16,'inner-ne':32,'inner-se':64,'inner-sw':128})[key.slice(5,-3)],x,y,true);c.imageSmoothingEnabled=false;const im=textures[key];if(!['wood-floor173','kitchen-floor173'].includes(key)&&im?.complete&&im.naturalWidth)c.drawImage(im,x,y,32,32);else c.drawImage(nativeTile(key),x,y,32,32);return true;}
export function drawMap173(c,map,cx,cy,drawProp,drawOtherGround){if(!map.layout173)return false;c.save();c.imageSmoothingEnabled=false;c.translate(-Math.round(cx),-Math.round(cy));c.fillStyle='#121b22';c.fillRect(0,0,map.rows[0].length*32,map.rows.length*32);
 for(const t of map.editorGround72||[]){if(t.x*32+32<cx||t.y*32+32<cy||t.x*32>cx+c.canvas.width||t.y*32>cy+c.canvas.height)continue;drawOtherGround(c,t);}
 // A rug is assembled from floor cells; draw its border only at exposed edges.
 const rugTiles=(map.editorGround72||[]).filter(t=>t.material==='rug173'||t.material==='rug-red173');const rugs=new Map(rugTiles.map(t=>[t.x+','+t.y,t.material]));c.fillStyle='#bfad7c';for(const t of rugTiles){const x=t.x*32,y=t.y*32,same=(dx,dy)=>rugs.get((t.x+dx)+','+(t.y+dy))===t.material;if(!same(0,-1))c.fillRect(x,y+2,32,2);if(!same(0,1))c.fillRect(x,y+28,32,2);if(!same(-1,0))c.fillRect(x+2,y,2,32);if(!same(1,0))c.fillRect(x+28,y,2,32);}
 const all=[...(map.props||[]),...(map.editorAddedProps72||[])].sort((a,b)=>(a.y+a.h)-(b.y+b.h));for(const p of all)if((p.x+p.w)*32>=cx&&(p.y+p.h)*32>=cy&&p.x*32<=cx+c.canvas.width&&p.y*32<=cy+c.canvas.height)drawProp(c,p,map);
 c.restore();return true;}
