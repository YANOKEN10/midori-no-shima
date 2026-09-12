// Deliberate furnishing and planting zones preserve every story entrance and NPC.
export function redesignEnvironments(maps){
 const hospital=maps.hospital;hospital.npcs.push(
 {name:'お見舞いの人',x:3,y:8,look:'boy',variant:7,dir:'down',noRoam:false,roamBounds:[2,7,5,9],talk:['窓辺の席で ガオンと休んでいたの。','ここの待合室は 落ち着くね。']},
 {name:'旅のトレーナー',x:10,y:8,look:'boy',variant:27,dir:'left',noRoam:false,roamBounds:[10,6,11,10],talk:['次は どの町へ行こうかな。','ガオンが元気になるまで のんびりしているよ。']});
 const safe=(m,x,y,w,h,margin=1)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(![',','f','.'].includes(m.g[yy]?.[xx]))return false;return ![...m.npcs,...m.warps,...m.signs,m.spawn].some(p=>p&&p.x>=x-margin&&p.x<x+w+margin&&p.y>=y-margin&&p.y<y+h+margin);};
 const prop=(m,art,x,y,w,h)=>{m.props.push({art,x,y,w,h});for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)m.g[yy][xx]='R';};
 for(const id of ['galaxyArena','championTower']){const m=maps[id];m.environmentArena=true;m.props=m.props.filter(p=>p.art!=='eArena');for(let y=1;y<=6;y++)for(let x=2;x<24;x++)m.g[y][x]='f';for(const x of [2,10,18])prop(m,'v41-facilities-6',x,2,6,4);for(const[x,y]of [[3,9],[21,9]])prop(m,'v41-facilities-5',x,y,2,3);for(const[x,y]of [[3,19],[21,19]])prop(m,'v41-facilities-7',x,y,2,2);prop(m,'v41-facilities-4',10,8,5,2);}
 for(const id of ['shipLounge','shipCabins']){const m=maps[id];for(const[x,y]of [[3,9],[26,4],[26,16]])if(safe(m,x,y,3,2))prop(m,'v41-facilities-3',x,y,3,2);}
 const elder=maps.clearElder;elder.room={theme:'cottage',bounds:[1,3,16,12],rug:[5,7,7,6],windows:[3,12],furniture:[['kitchen',2,3,4,2],['books',12,3,3,3],['bed',13,9,3,4],['table',3,9,3,2],['plant',2,13,1,1]]};for(const[k,x,y,w,h]of elder.room.furniture)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)elder.g[yy][xx]='t';
 const towns=['village','rods','marine','karat','resure','manikereo','galaxy','clearTown','belerio','leafTown'];
 for(const id of towns){const m=maps[id];m.townGardens=[];m.townDesign=true;
 // Join each front door to the nearest existing street using walkable ground only.
 for(const door of m.warps.filter(w=>m.g[w.y]?.[w.x]==='D')){const start=[door.x,door.y+1],key=(x,y)=>x+','+y,q=[start],prev=new Map([[key(...start),null]]);let target=null;for(let i=0;i<q.length&&!target;i++){const[x,y]=q[i];if(m.g[y]?.[x]==='.') {target=[x,y];break;}for(const[dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]]){const xx=x+dx,yy=y+dy,k=key(xx,yy);if(!prev.has(k)&&[',','F','.'].includes(m.g[yy]?.[xx])){prev.set(k,[x,y]);q.push([xx,yy]);}}}while(target){const[x,y]=target;if([',','F'].includes(m.g[y]?.[x]))m.g[y][x]='.';target=prev.get(key(x,y));}}

 // Planting beds follow building fronts and empty verge bands, never the main route.
 const candidates=[];for(const p of m.props.filter(p=>p.door))for(const dx of [-4,p.w+1])candidates.push([p.x+dx,p.y+p.h+1]);for(let y=6;y<m.g.length-5;y+=6)for(const x of [4,m.g[0].length-7])candidates.push([x,y]);
 for(const[x,y]of candidates){if(m.townGardens.length>=4)break;if(x<2||y<2||x+3>=m.g[0].length-2||y+2>=m.g.length-2)continue;let grass=true;for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+3;xx++)if(m.g[yy]?.[xx]!==',')grass=false;if(!grass||!safe(m,x,y,3,2,2)||m.townGardens.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<7))continue;m.townGardens.push({x,y,w:3,h:2});}
 // Group street trees into small groves instead of leaving isolated obstacles.
 const width=m.g[0].length,height=m.g.length;const old=m.props.filter(p=>['tree','fir'].includes(p.art)&&p.x>2&&p.y>3&&p.x+p.w<width-2&&p.y+p.h<height-3);
 m.props=m.props.filter(p=>!old.includes(p));for(const p of old)for(let yy=p.y;yy<p.y+p.h;yy++)for(let xx=p.x;xx<p.x+p.w;xx++)if(m.g[yy]?.[xx]==='T'&&!m.props.some(o=>xx>=o.x&&xx<o.x+o.w&&yy>=o.y&&yy<o.y+o.h))m.g[yy][xx]=',';
 const groves=[];for(let y=5;y<height-6;y+=4)for(const x of [4,width-8,Math.floor(width/2)+3,8,width-12]){if(groves.length>=4)break;let clear=true;for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+4;xx++)if(m.g[yy]?.[xx]!==',')clear=false;if(!clear||!safe(m,x,y,4,3,1)||m.townGardens.some(p=>x<p.x+p.w+1&&x+4>p.x-1&&y<p.y+p.h+1&&y+3>p.y-1))continue;groves.push({x,y});for(let dx=0;dx<4;dx+=2){m.props.push({art:'tree',x:x+dx,y,w:2,h:3});for(let yy=y;yy<y+3;yy++)for(let xx=x+dx;xx<x+dx+2;xx++)m.g[yy][xx]='T';}}
 m.townGroves=groves;
 // A low continuous fence behind each bed groups the planting without closing a route.
 for(const p of m.townGardens){if(safe(m,p.x,p.y-1,p.w,1,1)&&m.g[p.y-1].slice(p.x,p.x+p.w).every(ch=>ch===',')){for(let x=p.x;x<p.x+p.w;x++)m.g[p.y-1][x]='=';m.props.push({art:'v41-fence',x:p.x,y:p.y-1,w:p.w,h:1});}}
 }
 const coasts=['route3','marine','route6','raden','karatPort','resurePort','route8','resureBeach','belerioPort','belerio','leafTown'];
 for(const id of coasts){const m=maps[id];if(!m)continue;m.coastDesign=true;let count=0;for(let y=3;y<m.g.length-3;y+=3)for(let x=3;x<m.g[0].length-3;x+=3){if(count>=12)break;if(m.g[y]?.[x]!==','||!safe(m,x,y,1,1,2))continue;const water=[[-2,0],[2,0],[0,-2],[0,2]].some(([dx,dy])=>m.g[y+dy]?.[x+dx]==='W');if(!water)continue;prop(m,'v41-coast-'+([2,3,4,5][count%4]),x,y,1,1);count++;}}
}

export function shopInteriorFor(base,town='village'){
 const furniture=base.room.furniture.map(f=>[...f]);
 for(const f of furniture){if(['clearTown','galaxy','manikereo'].includes(town)&&f[0]==='shelfRight')f[1]=4;if(['clearTown','galaxy','manikereo'].includes(town)&&f[0]==='shelfLeft')f[1]=11;if(['marine','karatPort','resurePort'].includes(town)&&f[0]==='shelfLeft'){f[0]='shelf';f[1]=11;f[2]=8;f[3]=3;f[4]=2;}}
 if(['karat','leafTown'].includes(town))furniture.push(['plant',12,6,1,1]);
 const rows=base.rows.map(row=>[...row].map(ch=>ch==='t'?'f':ch));for(const[k,x,y,w,h]of furniture)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='t';
 return {...base,rows:rows.map(r=>r.join('')),room:{...base.room,shopTown:town,furniture}};
}
