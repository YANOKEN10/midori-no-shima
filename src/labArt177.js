import{LAB_FLOORS177,LAB_PROPS177}from'./labCatalog177.mjs';
const floorKeys=new Set(LAB_FLOORS177.map(p=>p[0])),propKeys=new Set(LAB_PROPS177.filter(p=>p.key!=='lab177-plant').map(p=>p.key)),cache=new Map();
function sprite(key){if(cache.has(key))return cache.get(key);const p=LAB_PROPS177.find(p=>p.key===key),cv=document.createElement('canvas');cv.width=p?p.w*16:16;cv.height=p?p.h*16:16;const c=cv.getContext('2d'),W=cv.width,box=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const edge='#435b61',shade='#6e9292',mint='#a5cdc0',light='#d3e6d4',white='#eef1dc';
 if(floorKeys.has(key)){
  if(key==='lab177-floor'||key==='lab177-door'){box('#a4cbb9',0,0,16,16);for(let y=0;y<16;y+=8)for(let x=0;x<16;x+=8){box('#b6d6c2',x,y,8,1);box('#b6d6c2',x,y,1,8);box('#91bba9',x+7,y+1,1,7);box('#91bba9',x+1,y+7,7,1);box('#aed0bc',x+2,y+2,4,4);}if(key.endsWith('door')){box('#694e45',1,5,14,10);box('#a85749',2,6,12,8);box('#d08764',3,7,10,1);box('#813d38',3,13,10,1);} }
  else if(key==='lab177-bottom'){box('#101d23',0,0,16,16);box('#526d68',0,0,16,1);box('#d9d6ad',0,1,16,5);box('#eee6c5',0,1,16,1);box('#8c8c71',0,6,16,2);}
  else if(key==='lab177-left'||key==='lab177-right'){box('#101d23',0,0,16,16);const x=key.endsWith('left')?8:0;box('#849381',x,0,8,16);box('#dadbbd',x+1,0,6,16);box('#f0eacb',x+1,0,1,16);box('#636f63',x+7,0,1,16);for(let y=3;y<16;y+=6)box('#b5bca2',x+2,y,4,1);}
  else if(key==='lab177-top'){box('#a5aa88',0,0,16,16);box('#eee7c6',0,2,16,3);box('#c1c2a0',0,5,16,9);box('#dfdcc0',0,7,16,1);box('#969d80',0,14,16,2);}
  else{box('#dedfc3',0,0,16,16);box('#f2edd3',0,0,16,2);box('#c8cdb2',0,3,16,1);box('#a8b5a4',0,12,16,2);box('#718e86',0,14,16,2);box('#e8e7cf',3,6,8,1);if(key.includes('window')){const shift=key.endsWith('right')?-16:0;box('#aab9a5',2+shift,3,28,8);box('#f2eed4',3+shift,3,26,1);box('#70b6bd',4+shift,5,24,4);box('#9ed6d4',6+shift,4,20,1);box('#d4eee1',8+shift,5,7,1);box('#4c9aa8',5+shift,9,22,1);box('#b8dace',3+shift,10,26,1);}}
 }else{
  box('#527f7a',2,29,W-4,2);
  if(key==='lab177-glass'){box(edge,0,4,32,25);box(shade,1,5,30,23);box('#dce9de',1,3,30,7);box('#f2f2df',2,3,28,1);box('#96bab4',2,9,28,1);box('#9fd4d1',2,11,28,12);box('#73b4bb',3,19,26,4);for(const[x,y]of [[5,18],[10,19],[20,17],[25,19]]){box('#509886',x,y,4,4);box('#8abfa1',x+1,y-1,2,3);}box('#caeee3',4,12,2,8);box('#e6f5e9',6,12,3,2);box('#b5e1dc',8,14,2,3);box('#d2e6dc',15,4,2,19);box(edge,15,10,1,13);box('#659b9e',1,24,30,5);box('#92c0b7',2,24,28,1);box('#3f707c',2,28,28,2);box('#436574',0,29,3,2);box('#436574',29,29,3,2);}
  if(key==='lab177-desk'||key==='lab177-sink'){box(edge,1,11,W-2,18);box('#cfddd0',2,12,W-4,14);box('#a3b8ac',3,19,W-6,7);box('#eef0dc',0,10,W,6);box('#b2cabc',1,15,W-2,2);for(let x=3;x<W-4;x+=12){box('#6f918b',x,20,10,6);box('#c4d9c9',x+1,20,8,1);box('#4e6969',x+7,22,2,1);}box('#547575',2,28,3,3);box('#547575',W-5,28,3,3);
   if(key.endsWith('desk')){box(edge,3,0,17,11);box('#c6d6cc',4,1,15,9);box('#3f727f',5,2,13,6);box('#80c4c9',6,3,11,4);box('#c2e6db',7,3,3,1);box('#627c7b',10,10,3,2);box('#9cac9b',3,13,17,2);for(let x=4;x<19;x+=3)box('#dae5d2',x,13,2,1);box('#789b8c',29,8,10,6);box('#e1e3bf',30,8,8,5);box('#8fa78e',34,8,1,5);box('#83a4a0',42,5,3,8);box('#d9e9d3',42,5,3,2);box('#bf9774',24,11,3,3);}
   else{box('#5c8385',4,6,21,8);box('#89b6b2',5,7,19,6);box('#bedad0',6,7,17,1);box('#4e7f85',8,10,12,2);box('#657c78',18,2,2,5);box('#cbd7ca',17,1,4,2);box('#dfe5cf',16,2,2,3);box('#779e92',27,6,3,6);box('#d7dcc5',27,5,3,2);}}
  if(key==='lab177-shelf'){box(edge,1,3,30,26);box('#cedccc',2,3,28,25);box(white,3,3,26,2);for(const y of [8,18]){box('#648482',3,y,26,8);let x=4;for(const[color,width]of [['#729d99',4],['#bda875',3],['#a5bdac',5],['#789cac',3],['#bd987e',4],['#849477',4]]){box(color,x,y+1,width,6);box('#d6dcc1',x,y+2,1,3);x+=width+1;if(x>27)break;}box('#e0e5d0',2,y+8,28,2);}box('#5d7c79',3,28,3,3);box('#5d7c79',26,28,3,3);}
 }
 cache.set(key,cv);return cv;
}
export function drawLabFloor177(c,key,x,y){if(!floorKeys.has(key))return false;c.save();c.imageSmoothingEnabled=false;c.drawImage(sprite(key),x,y,32,32);c.restore();return true;}
export function drawLabProp177(c,p){if(!propKeys.has(p.art))return false;c.save();c.imageSmoothingEnabled=false;c.drawImage(sprite(p.art),p.x*32,p.y*32,p.w*32,p.h*32);c.restore();return true;}
