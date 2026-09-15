const atlas=new Image();atlas.src=new URL('../assets/roads-v46/materials.png',import.meta.url).href;
const textures=new Map();
export const roadStyle=m=>m.kind==='out'&&m.id!=='mountain'&&!['snow','ash'].includes(m.frontierTheme)&&!['dark','ice','snow'].includes(m.endTheme)?(['rods','karat','galaxy','clearTown','belerio'].includes(m.id)?'stone':'sand'):null;
export const roadReady=m=>!roadStyle(m)||(atlas.complete&&atlas.naturalWidth>0);
export function drawRoad(c,m,x,y){
 const style=roadStyle(m);const isRoad=(a,b)=>['.','D','d','H'].includes(m.rows[b]?.[a])||(m.rows[b]?.[a]==='S'&&m.signs?.some(s=>s.x===a&&s.y===b&&s.ground==='.'));if(!style||!isRoad(x,y))return false;
 const near=(dx,dy)=>isRoad(x+dx,y+dy);
 const l=near(-1,0),r=near(1,0),t=near(0,-1),b=near(0,1),px=x*32,py=y*32;
 c.save();c.beginPath();
 // Small stepped turf edges, continuous through straight roads and junctions.
 for(let j=0;j<32;j+=2){const edge=style==='stone'?2:1+((y*16+j/2+x*3)%3);const left=l?0:edge,right=r?32:32-edge;const top=t?0:2,bottom=b?32:30;if(j>=top&&j<bottom)c.rect(px+left,py+j,right-left,2);}
 c.clip();c.fillStyle=style==='stone'?'#d5d7c5':'#ead799';c.fillRect(px,py,32,32);
 if(roadReady(m)){
  if(!textures.has(style)){const tile=document.createElement('canvas');tile.width=64;tile.height=128;const tc=tile.getContext('2d');tc.imageSmoothingEnabled=false;const half=atlas.width/2;tc.drawImage(atlas,style==='stone'?half:0,0,half,atlas.height,0,0,64,128);textures.set(style,tile);}
  c.imageSmoothingEnabled=false;c.drawImage(textures.get(style),(x%2)*32,(y%4)*32,32,32,px,py,32,32);
 }
 c.restore();return true;
}
