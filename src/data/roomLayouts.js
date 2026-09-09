// Compact rooms retain the existing entrance coordinates for saved games.
export function furnishInteriors(maps){
 const layouts={
 hut:{theme:'home',npcs:[[9,8]],rug:[6,7,4,3],furniture:[['bed',3,5,2,3],['kitchen',3,4,3,1],['books',10,4,3,1],['table',10,8,2,2],['chair',10,10,1,1],['plant',12,10,1,1],['tv',6,4,2,1]],windows:[4,9]},
 rodsHome:{theme:'cottage',npcs:[[9,7]],rug:[6,6,5,3],furniture:[['sofa',3,6,2,2],['table',7,7,2,1],['kitchen',3,4,3,1],['books',10,4,3,1],['bed',11,8,2,3],['plant',3,10,1,1],['chair',7,8,1,1]],windows:[4,9]},
 lab:{theme:'lab',npcs:[[8,6],[11,9]],rug:[6,8,4,3],furniture:[['computer',3,4,3,1],['books',10,4,3,1],['machine',3,6,2,2],['labtable',5,6,2,1],['tank',11,6,2,2],['plant',3,10,1,1],['computer',4,9,2,1]],windows:[6,9]},
 hospital:{theme:'hospital',npcs:[[7,5]],rug:[6,8,3,3],furniture:[['healer',3,4,3,2],['counter',6,6,4,1],['bed',11,5,2,3],['bed',11,9,2,2],['sofa',3,8,2,1],['plant',3,10,1,1],['computer',10,4,2,1]],windows:[4,9]},
 shop:{theme:'shop',npcs:[[7,5]],rug:[6,8,3,3],furniture:[['shelf',3,4,3,2],['shelf',10,4,3,2],['counter',6,6,4,1],['shelf',3,8,2,2],['shelf',11,8,2,2],['plant',12,10,1,1]],windows:[4,9]}
 };
 for(const [id,room]of Object.entries(layouts)){const m=maps[id];m.room=room;m.props=[];m.g=m.g.map((row,y)=>row.map((_,x)=>x>=3&&x<=12&&y>=4&&y<=10?'f':'X'));m.g[11][7]='x';for(const exit of m.warps)if(exit.x===7&&exit.y===12)exit.y=11;
 room.furniture.forEach(([kind,x,y,w,h])=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.g[j][i]='t';});
 m.npcs.forEach((n,i)=>{[n.x,n.y]=room.npcs[i];});
 }
}
export function encloseTowns(maps){for(const id of ['village','rods']){const m=maps[id],w=m.g[0].length,h=m.g.length;const isEdge=p=>p.x<2||p.x+p.w>w-2||p.y<3||p.y+p.h>h-3;
 for(const p of m.props.filter(p=>['tree','fir'].includes(p.art)&&isEdge(p)))for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)if(m.g[y]?.[x]==='T')m.g[y][x]=',';
 m.props=m.props.filter(p=>!(['tree','fir'].includes(p.art)&&isEdge(p)));
 const add=(x,y)=>{for(let j=y;j<y+3;j++)for(let i=x;i<x+2;i++)if(m.g[j]?.[i]==='.'||m.signs.some(s=>s.x===i&&s.y===j))return;for(let j=y;j<y+3;j++)for(let i=x;i<x+2;i++)m.g[j][i]='T';m.props.push({art:'tree',x,y,w:2,h:3});};
 for(let y=0;y<=h-3;y+=2){add(0,y);add(w-2,y);}for(let x=2;x<w-2;x+=2){add(x,0);add(x,h-3);}
 m.props.sort((a,b)=>(a.y+a.h)-(b.y+b.h));
}}
