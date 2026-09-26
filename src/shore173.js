export const SHORE_MAPS173=['belerio','leafTown','raden','route7','merire'];
const cache=new Map();
export function drawBank173(c,mask,x,y,water=false){let cv=cache.get(mask);if(!cv){cv=document.createElement('canvas');cv.width=cv.height=16;const p=cv.getContext('2d'),box=(col,x,y,w,h)=>{p.fillStyle=col;p.fillRect(x,y,w,h);};
 if(mask&1){box('#285b66',0,0,16,7);box('#6b5139',0,1,16,4);box('#b39260',0,1,16,2);for(let i=0;i<16;i+=4){box('#80623f',i+2,3,2,2);box('#d0b17a',i,1,2,1);}box('#42693c',0,0,16,1);box('#8ab866',1,0,3,1);box('#8ab866',8,0,4,1);box('#66b7b4',1,7,6,1);}
 if(mask&2){box('#285b66',11,0,5,16);box('#705538',12,0,4,16);box('#b59564',14,0,2,16);for(let i=0;i<16;i+=4)box('#c4a372',13,i,2,2);box('#547e44',15,0,1,16);}
 if(mask&4){box('#285b66',0,12,16,4);box('#9b794e',0,13,16,3);box('#547c44',0,15,16,1);box('#c6aa75',2,14,5,1);box('#c6aa75',10,14,4,1);}
 if(mask&8){box('#285b66',0,0,5,16);box('#705538',0,0,4,16);box('#b59564',0,0,2,16);for(let i=0;i<16;i+=4)box('#c4a372',1,i,2,2);box('#547e44',0,0,1,16);}
 // Concave corners for a diagonal land tile between two water edges.
 for(const[bit,xx,yy]of [[16,0,0],[32,12,0],[64,12,12],[128,0,12]])if(mask&bit){box('#285b66',xx,yy,4,4);box('#9b794e',xx,yy,3,3);box('#7ea557',xx,yy,2,1);}
 cache.set(mask,cv);}
 c.imageSmoothingEnabled=false;if(water){c.fillStyle='#229fc7';c.fillRect(x,y,32,32);c.fillStyle='#56bad0';c.fillRect(x+12,y+20,12,2);}c.drawImage(cv,x,y,32,32);return true;}
export function drawShore173(c,map,cx=0,cy=0){if(!SHORE_MAPS173.includes(map.id))return;const g=map.editorVisualRows73||map.rows,land=(x,y)=>g[y]?.[x]!==undefined&&!['W','d'].includes(g[y][x]);
 for(let y=Math.max(0,Math.floor(cy/32));y<Math.min(g.length,Math.ceil((cy+c.canvas.height)/32));y++)for(let x=Math.max(0,Math.floor(cx/32));x<Math.min(g[0].length,Math.ceil((cx+c.canvas.width)/32));x++){if(g[y][x]!=='W')continue;let mask=(land(x,y-1)?1:0)|(land(x+1,y)?2:0)|(land(x,y+1)?4:0)|(land(x-1,y)?8:0);if(!(mask&9)&&land(x-1,y-1))mask|=16;if(!(mask&3)&&land(x+1,y-1))mask|=32;if(!(mask&6)&&land(x+1,y+1))mask|=64;if(!(mask&12)&&land(x-1,y+1))mask|=128;if(mask)drawBank173(c,mask,x*32-cx,y*32-cy);}
}
