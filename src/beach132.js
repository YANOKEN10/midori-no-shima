const images=Object.fromEntries(['sea','sand'].map(k=>{const im=new Image();im.src=new URL('../assets/environment-v132/'+k+'.png',import.meta.url).href;return [k,im];}));
export const isBeach132=m=>m.frontierTheme==='coast'&&!m.endTheme;
export const beachReady132=m=>!isBeach132(m)||Object.values(images).every(im=>im.complete&&im.naturalWidth);
export function drawBeach132(c,m,x,y,ch){if(!isBeach132(m)||!beachReady132(m))return false;
 const water=ch==='W',im=images[water?'sea':'sand'],s=im.naturalWidth/4,px=x*32,py=y*32;c.imageSmoothingEnabled=false;c.drawImage(im,(x%4)*s,(y%4)*s,s,s,px,py,32,32);
 const land=t=>t!==undefined&&!['W','R','X','d'].includes(t),edge=(a,b)=>water?land(m.rows[y+b]?.[x+a]):m.rows[y+b]?.[x+a]==='W';
 if(!water&&!land(ch))return true;
 const left=edge(-1,0),right=edge(1,0),top=edge(0,-1),bottom=edge(0,1);
 for(let iy=0;iy<32;iy+=2)for(let ix=0;ix<32;ix+=2){let d=Math.min(left?ix:99,right?30-ix:99,top?iy:99,bottom?30-iy:99);for(const [a,b]of [[-1,-1],[1,-1],[-1,1],[1,1]])if(edge(a,b))d=Math.min(d,Math.hypot(a<0?ix:30-ix,b<0?iy:30-iy));const ripple=Math.round(2*Math.sin((px+ix+py+iy)*Math.PI/16));d+=ripple;
 if(water){if(d<3)c.fillStyle='#f0f7d8';else if(d<6)c.fillStyle='#c5f1e6';else if(d<12)c.fillStyle='#66cfdc';else continue;}else {if(d<8)c.fillStyle='#ece9ba';else if(d<16)c.fillStyle='#e5dfa8';else if(d<22)c.fillStyle='#eee2aa';else continue;}c.fillRect(px+ix,py+iy,2,2);
 }return true;}
