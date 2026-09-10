const tree=new Image(),fill=new Image();tree.src=new URL('../assets/world-v19/tree.png',import.meta.url).href;fill.src=new URL('../assets/world-v19/forest.png',import.meta.url).href;
export const forestReady=()=>tree.complete&&tree.naturalWidth&&fill.complete&&fill.naturalWidth;
export function boundaryTree(map,p){const w=map.rows[0].length,h=map.rows.length;return map.forestBorder&&['tree','fir'].includes(p.art)&&(p.x<2||p.x+p.w>w-2||p.y<3||p.y+p.h>h-3);}
export function forestCanopy(c,map){
 if(!map.forestBorder)return;const w=map.rows[0].length,h=map.rows.length;c.save();c.beginPath();
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if((x<2||x>=w-2||y<3||y>=h-3)&&map.rows[y][x]==='T')c.rect(x*32,y*32,32,32);
 c.clip();c.fillStyle='#348047';c.fillRect(0,0,w*32,h*32);
 if(forestReady()){
  for(let y=0;y<h*32;y+=128)for(let x=0;x<w*32;x+=128)c.drawImage(fill,x,y);
  // All trees stay upright. The front row exposes trunks toward the clearing.
  for(let y=-40;y<h*32;y+=56){c.drawImage(tree,4,y,64,80);c.drawImage(tree,(w-2)*32-4,y,64,80);}
  for(let x=-16;x<w*32;x+=56){c.drawImage(tree,x,16,64,80);c.drawImage(tree,x,(h-3)*32+20,64,80);}
 }
 c.restore();
}
