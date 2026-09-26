// Original Gaon route boundary renderer, shared with one-cell workshop materials.
export const ROUTE_EDGES178=['right','left','up','down'].flatMap(dir=>[['route-wall178-'+dir,'３番道路の壁・'+({right:'右',left:'左',up:'上',down:'下'}[dir]),'X'],['route-cliff178-'+dir,'従来の低い崖・'+({right:'右向き',left:'左向き',up:'上向き',down:'下向き'}[dir]),'X']]);
export function drawRouteWall178(c,dx,dy,{left=false,stone=false,phase=0}={}){ c.save();c.beginPath();c.rect(dx,dy,32,32);c.clip();c.translate(dx,dy);if(left){c.translate(32,0);c.scale(-1,1);}
 c.fillStyle=stone?'#64766b':'#624735';c.fillRect(0,0,32,32);
 for(let row=-1;row<3;row++)for(let col=0;col<3;col++){
  const px=5+col*11+(row%2?4:0),py=row*16+((phase%2)*7);
  c.fillStyle=stone?'#96a28e':'#9b7650';c.fillRect(px,py,9,14);
  c.fillStyle=stone?'#bac2a8':'#bd9462';c.fillRect(px+1,py+1,4,9);
  c.fillStyle=stone?'#788677':'#78563d';c.fillRect(px+6,py+6,2,7);
 }
 c.fillStyle='#245f3a';c.fillRect(0,0,6,32);c.fillStyle='#53a653';c.fillRect(0,0,4,32);
 for(let py=0;py<32;py+=8){c.fillStyle='#81c766';c.fillRect(0,py,3,5);c.fillStyle='#377e42';c.fillRect(3,py+3,3,4);}
 c.restore();
}
export function drawRouteEdge178(c,key,x,y,material){if(!ROUTE_EDGES178.some(p=>p[0]===key))return false;const dir=key.split('-').at(-1);c.save();c.imageSmoothingEnabled=false;c.translate(x+16,y+16);if(key.startsWith('route-cliff')){c.rotate(({down:0,left:1,up:2,right:3})[dir]*Math.PI/2);material(c,'cliff',-16,-16,32,32);}else{c.rotate(({right:0,down:1,left:2,up:3})[dir]*Math.PI/2);drawRouteWall178(c,-16,-16);}c.restore();return true;}
