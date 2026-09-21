export function homeSignText117(sign,name){return sign.homeSign117?[`${String(name||'レオ').trim()||'レオ'}のいえ`]:sign.text;}
export function addHomeSign117(map){
 if(!map||map.id!=='village'||map.signs?.some(s=>s.homeSign117))return map;
 const door=map.warps?.find(w=>w.to==='hut');if(!door)return map;
 const house=[...map.props||[],...map.editorAddedProps72||[]].find(p=>p.door?.x===door.x&&p.door?.y===door.y);
 const turn=house?.turn81||0,[fx,fy]=[[0,1],[-1,0],[0,-1],[1,0]][turn],[sx,sy]=[fy,-fx];
 const occupied=[...map.npcs||[],...map.signs||[],...map.items||[],...map.warps||[]];
 const free=(x,y)=>[',','.','F','"','f'].includes(map.rows[y]?.[x])&&!occupied.some(o=>o.x===x&&o.y===y)&&![...map.props||[],...map.editorAddedProps72||[]].some(p=>!p.walkable&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);
 let spot;for(const distance of [1,2,3]){for(const side of [-1,1,-2,2]){const x=door.x+fx*distance+sx*side,y=door.y+fy*distance+sy*side;if(free(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>free(x+dx,y+dy))){spot={x,y};break;}}if(spot)break;}
 if(!spot)return map;
 const {x,y}=spot,ground=map.rows[y][x];map.signs??=[];map.signs.push({x,y,ground,homeSign117:true,text:['主人公のいえ']});
 map.rows=map.rows.map((row,j)=>j===y?row.slice(0,x)+'S'+row.slice(x+1):row);
 map.editorAddedProps72??=[];map.editorAddedProps72.push({art:'sign',x,y,w:1,h:1,homeSign117:true});
 return map;
}
