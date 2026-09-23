// Separate the road exit from the park gate while retaining existing map fingerprints.
export function upgradeResureEntrances153(base,d){
 if(base.id!=='resure'||d.resureEntrances153)return d;
 const objects=d.objects.map(o=>o.id==='g:9'||o.id==='g:10'?{...o,stored79:true}:o);
 for(const x of [29,30])if(!objects.some(o=>o.id==='a:resure-border153-'+x))objects.push({id:'a:resure-border153-'+x,type:'prop',template:'rock',x,y:0});
 const tiles=d.tiles.filter(t=>!(t.y===0&&[29,30].includes(t.x)));
 for(const x of [9,10])for(let y=0;y<3;y++){const i=tiles.findIndex(t=>t.x===x&&t.y===y),t={x,y,material:'grass'};if(i<0)tiles.push(t);else tiles[i]=t;}
 const actors=d.actors.map(a=>{const n=a.id.startsWith('n:')?base.npcs[Number(a.id.slice(2))]:null;if(n?.script!=='frontier:guard'||a.stored79||a.x!==n.x||a.y!==n.y)return a;return {...a,x:n.x===28?8:n.x===31?11:a.x};});
 return {...d,resureEntrances153:true,objects,tiles,actors};
}
export function resureEntrances153(map){
 if(map.id!=='resure')return map;
 let changed=false;map.warps=map.warps.map(w=>{if(w.to==='route11'&&w.y===0&&[29,30].includes(w.x)&&!w.editorLink75){changed=true;return {...w,x:w.x-20};}return w;});
 if(changed){for(const key of ['rows','editorVisualRows73'])if(map[key]){const grid=map[key].map(r=>[...r]);for(const x of [29,30])grid[0][x]='R';for(const x of [9,10])for(let y=0;y<3;y++)grid[y][x]=y===0&&key==='rows'?'D':',';map[key]=grid.map(r=>r.join(''));}map.editorGround72=(map.editorGround72||[]).filter(t=>!(t.y===0&&[29,30].includes(t.x)));}
 return map;
}

export const resureBorderSource153=(o,p)=>p&&/^a:resure-border153-(29|30)$/.test(o.id)&&o.template==='rock'?{...p,w:1,h:1,tile:'R'}:p;
