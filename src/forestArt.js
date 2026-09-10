const tree=new Image();tree.src=new URL('../assets/world-v19/tree.png',import.meta.url).href;
export const forestReady=()=>tree.complete&&tree.naturalWidth;
export function boundaryTree(map,p){const w=map.rows[0].length,h=map.rows.length;return map.forestBorder&&['tree','fir'].includes(p.art)&&(p.x<2||p.x+p.w>w-2||p.y<3||p.y+p.h>h-3);}
// Fit complete crowns between openings. Never clip sprites against road tiles.
export function forestLayout(map){
 if(!map.forestBorder)return [];
 const w=map.rows[0].length,h=map.rows.length,out=[];
 const runs=(n,valid,emit)=>{for(let a=0;a<n;){if(!valid(a)){a++;continue;}let b=a+1;while(b<n&&valid(b))b++;emit(a*32,b*32);a=b;}};
 const positions=(a,b,size,step)=>{const length=b-a;if(length<size)return [a];const count=Math.max(1,Math.ceil((length-size)/step)+1);return Array.from({length:count},(_,i)=>Math.round(a+(count===1?0:i*(length-size)/(count-1))));};
 const add=(x,y,width=64)=>out.push({x,y,w:width,h:width*1.25});
 for(const south of [false,true]){
  const row=south?h-3:0;
  runs(w,x=>[0,1,2].every(j=>map.rows[row+j]?.[x]==='T'),(a,b)=>{
   const size=Math.min(64,b-a);
   for(const x of positions(a,b,size,52)){
    if(!south)add(x, -32,size);
    add(x,row*32+(south?0:16),size);
   }
   if(south)for(const x of positions(a,b,size,48))add(x,row*32+48,size);
  });
 }
 for(const right of [false,true]){
  const col=right?w-2:0;
  runs(h,y=>y>=3&&y<h-3&&[0,1].every(i=>map.rows[y]?.[col+i]==='T'),(a,b)=>{
   const size=Math.min(64,(b-a)/1.25);
   for(const y of positions(a,b,size*1.25,48))add(col*32+(64-size)/2,y,size);
  });
 }
 return out;
}
export function forestCanopy(c,map){if(!forestReady())return;for(const p of forestLayout(map))c.drawImage(tree,p.x,p.y,p.w,p.h);}
