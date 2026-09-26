// Shared native 16px rock and snow tiles. No smoothing or fractional pixels.
const cache=new Map();
const palettes={cave:['#293d45','#425962','#657a7b','#93a29a','#b1b8a5'],volcano:['#241f29','#453039','#664840','#8f6653','#ae8562'],snow:['#414842','#696b59','#96927b','#c4c8b6','#edf3e8'],ice:['#355872','#5989a0','#87b3c3','#b9dce2','#e8f3ed']};
const rockKeys=new Set(['cave-wall173','cave-front173','volcano-wall173','volcano-front173','snow-wall173','snow-front173','snow-corner173','ice-wall173','ice-front173','ice-corner173']);
export function drawRockTerrain180(c,key,x,y){if(!rockKeys.has(key))return false;let cv=cache.get(key);if(!cv){cv=document.createElement('canvas');cv.width=cv.height=16;const g=cv.getContext('2d'),p=palettes[key.split('-')[0]],snow=key.startsWith('snow'),ice=key.startsWith('ice'),front=/front|corner/.test(key);const r=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};r(p[0],0,0,16,16);
 if(front){
  // Irregular rock columns, stepped shoulders and a deep foot shadow.
  for(const [x,w,top,bottom]of [[-1,6,2,14],[5,6,1,15],[11,6,3,14]]){r(p[1],x,top+1,w,bottom-top-1);r(p[2],x+1,top,w-2,bottom-top-2);r(p[3],x+1,top+1,1,6);r(p[1],x+3,top+5,2,5);r(p[0],x+w-1,top+4,1,bottom-top-2);r(p[2],x+2,bottom-3,2,1);r(p[0],x,bottom,w,1);}
  r(snow||ice?p[4]:p[3],0,0,16,2);r(snow||ice?p[4]:p[2],0,2,5,1);r(snow||ice?p[4]:p[2],7,2,6,1);r(snow||ice?p[3]:p[1],3,3,3,1);r(snow||ice?p[3]:p[1],11,3,4,1);if(/corner/.test(key)){r(p[4],0,0,2,14);r(p[3],2,4,1,8);}
 }else{
  // Offset, rounded angular stones, rather than a brick bond.
  for(const [x,y,w,h]of [[-2,-2,9,9],[8,-1,9,8],[2,7,9,9],[12,8,7,9]]){r(p[1],x+1,y+1,w-2,h-1);r(p[2],x+2,y,w-4,h-2);r(p[2],x+1,y+2,w-2,h-5);r(p[3],x+2,y+1,w-4,1);r(p[3],x+1,y+2,1,2);r(p[1],x+w-3,y+3,2,h-5);r(p[0],x+2,y+h-1,w-3,1);r(p[2],x+3,y+h-2,2,1);}
  if(snow){r(p[4],0,0,16,4);r(p[4],1,4,6,2);r(p[4],9,4,6,1);r('#d6e4df',3,3,3,1);r('#d6e4df',11,2,3,1);}if(ice){r(p[4],2,1,1,5);r(p[3],3,6,2,2);r(p[4],10,9,1,4);}
 }
 cache.set(key,cv);}c.imageSmoothingEnabled=false;c.drawImage(cv,x,y,32,32);return true;}
