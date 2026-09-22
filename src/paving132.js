const stone=new Image();stone.src=new URL('../assets/environment-v132/paving.png',import.meta.url).href;
export const pavingReady132=()=>stone.complete&&stone.naturalWidth>0;
export function drawPaving132(c,x,y,w=32,h=32){if(!pavingReady132())return false;const s=stone.naturalWidth/4;c.imageSmoothingEnabled=false;c.drawImage(stone,((Math.floor(x/32)%4+4)%4)*s,((Math.floor(y/32)%4+4)%4)*s,s,s,x,y,w,h);return true;}
export function drawConcrete132(c,x,y,light=false){c.fillStyle=light?'#b5bdbe':'#7d8a91';c.fillRect(x,y,32,32);for(let i=0;i<8;i++){c.fillStyle=i%2?(light?'#bec5c5':'#859198'):(light?'#afb7b8':'#77858c');c.fillRect(x+(x*7+y*3+i*13)%31,y+(x*3+y*11+i*7)%31,1,1);}if(light){c.fillStyle='#a4adaf';if(x%64===0)c.fillRect(x,y,1,32);if(y%64===0)c.fillRect(x,y,32,1);}}
