export const grassMap151=id=>['resure','flowerPark','gaonPark','gaonParkWoods','gaonParkWetland','gaonParkFlowers','gaonParkHill'].includes(id);
export function upgradeParkGround151(base,d,getCatalog,source,floors){
 if(!grassMap151(base.id)||d.parkGround151)return d;
 const cat=getCatalog(),water=new Set();for(const o of d.objects){if(o.stored79)continue;const p=source(base,o,cat);if(p&&(p.pond87||p.tile==='W'))for(let y=o.y;y<o.y+p.h;y++)for(let x=o.x;x<o.x+p.w;x++)water.add(x+','+y);}const tiles=new Map(d.tiles.map(t=>[t.x+','+t.y,t]));
 for(let y=0;y<base.rows.length;y++)for(let x=0;x<base.rows[y].length;x++){const key=x+','+y,t=tiles.get(key),ch=t?floors.find(f=>f[0]===t.material)?.[2]:base.rows[y][x];if(!water.has(key)&&ch!=='W'&&('.,"CdHh'.includes(ch)||t&&!["X","#","T","R"].includes(ch)))tiles.set(key,{x,y,material:'grass'});}
 const objects=d.objects.map(o=>{const p=source(base,o,cat);return p&&(p.group==='grass'||p.tile==='"')?{...o,stored79:true}:o;});
 return {...d,parkGround151:true,tiles:[...tiles.values()],objects};
}
