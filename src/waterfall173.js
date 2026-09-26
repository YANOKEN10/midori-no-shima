const cache=new Map();
function tile(key,phase=0){const id=key+phase;if(cache.has(id))return cache.get(id);const cv=document.createElement('canvas');cv.width=cv.height=16;const c=cv.getContext('2d'),box=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};box('#286f94',0,0,16,16);
 if(key.includes('rock')){box('#35424b',0,0,16,16);for(const[x,y,w,h]of [[0,1,7,7],[9,0,7,8],[2,9,6,7],[10,10,6,6]]){box('#657b81',x,y,w,h);box('#9aacaa',x,y,w,1);box('#465b69',x+w-2,y+2,2,h-2);}const x=key.includes('left')?12:0;box('#286f94',x,0,4,16);box('#75bccd',x+1,0,2,16);}
 else if(key.includes('top')){box('#245776',0,0,16,5);box('#66b6c8',0,4,16,3);box('#dcf3ea',0,6,16,2);for(let x=0;x<16;x+=4){box('#9edbe0',x,8,3,7);box('#ecf8ed',x+1,8,1,4);}}
 else if(key.includes('base')){box('#3c97b5',0,0,16,16);for(let x=0;x<16;x+=4){box('#bce8e4',x,0,2,7);box('#f0f8ec',x,5+(x/4+phase)%2,4,3);box('#b8e4df',x+1,9,3,2);}box('#205c7e',0,14,16,2);box('#75bbc9',2,12,5,1);box('#75bbc9',10,13,4,1);}
 else{box('#429fbb',0,0,16,16);for(let x=1;x<16;x+=5){const y=(phase*3+x*2)%16;box('#72c4d2',x,y,2,7);box('#72c4d2',x,y-16,2,7);box('#bce8e5',x+1,y,1,3);}for(let x=0;x<16;x+=4){const y=(phase*3+(x===4||x===8?1:0))%16;box('#9ddbdc',x,y,4,2);}}
 cache.set(id,cv);return cv;}
export function drawWaterfallTile173(c,key,x,y,tick=0){if(!key.startsWith('waterfall-'))return false;c.imageSmoothingEnabled=false;c.drawImage(tile(key,Math.floor(tick/160)%4),x,y,32,32);return true;}
export function drawWaterfall173(c,p,tick=performance.now()){
 const w=p.w,h=p.h;c.save();c.imageSmoothingEnabled=false;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const side=w>=3&&(x===0||x===w-1),key=side?(x===0?'waterfall-rock-left173':'waterfall-rock-right173'):y===0?'waterfall-top173':y===h-1?'waterfall-base173':'waterfall-flow173';drawWaterfallTile173(c,key,(p.x+x)*32,(p.y+y)*32,tick);}c.restore();return true;}
