// Painted ground is authoritative for native grass hidden underneath it.
// Explicit visible grass props remain encounter areas above the painted floor.
const floorIndexes201=new WeakMap();
export function reconcileGrass201(map,floors){
 if(!map.editorGround72?.length)return map;
 let index=floorIndexes201.get(floors);if(!index){index=new Map(floors.map(f=>[f[0],f[2]]));floorIndexes201.set(floors,index);}
 const props=[...map.props||[],...map.editorAddedProps72||[]].filter(p=>p.walkable&&(p.group==='grass'||p.tile==='"'));
 let rows,visual;
 for(const t of map.editorGround72){const ch=index.get(t.material);if(!ch||ch==='"'||map.rows[t.y]?.[t.x]!=='"'||props.some(p=>t.x>=p.x&&t.x<p.x+p.w&&t.y>=p.y&&t.y<p.y+p.h))continue;
 rows??=map.rows.map(r=>[...r]);rows[t.y][t.x]=ch;
 if(map.editorVisualRows73?.[t.y]?.[t.x]==='"'){visual??=map.editorVisualRows73.map(r=>[...r]);visual[t.y][t.x]=ch;}
 }
 if(rows)map.rows=rows.map(r=>r.join(''));if(visual)map.editorVisualRows73=visual.map(r=>r.join(''));return map;
}
