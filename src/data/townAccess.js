// Authored town streets and gardens; building doors and story coordinates stay fixed.
export function refineTownAccess(maps) {
  for (const m of Object.values(maps)) {
    if (!m.townDesign) continue;
    const buildings = m.props.filter(p => p.door);
    // A decorative tree must not pinch the two-cell approach around a house.
    const removed = m.props.filter(p => p.x>=2 && p.x+p.w<=m.g[0].length-2 && p.y>=3 && p.y+p.h<=m.g.length-3 && ['tree','fir','snowFir','ePalm'].includes(p.art) && buildings.some(b =>
      p.x < b.x+b.w+2 && p.x+p.w > b.x-2 && p.y < b.y+b.h+2 && p.y+p.h > b.y-2));
    removeProps(m, removed);
  }
  for (const id of ['village','rods']) composeGardenTown(maps[id]);
}
function removeProps(m, removed) {
  m.props = m.props.filter(p => !removed.includes(p));
  for (const p of removed) for (let y=p.y;y<p.y+p.h;y++) for(let x=p.x;x<p.x+p.w;x++) {
    if (m.g[y]?.[x]==='T' && !m.props.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)) m.g[y][x]=',';
  }
}
function composeGardenTown(m) {
  const width=m.g[0].length, height=m.g.length;
  removeProps(m,m.props.filter(p=>!p.door&&p.x>=2&&p.x+p.w<=width-2&&p.y>=3&&p.y+p.h<=height-3));
  m.townGardens=[];
  for(let y=3;y<height-3;y++)for(let x=2;x<width-2;x++)if(['.','F','='].includes(m.g[y][x]))m.g[y][x]=',';
  const fill=(x,y,w,h,ch)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if([',','.','F'].includes(m.g[yy]?.[xx]))m.g[yy][xx]=ch;};
  // Continuous two-cell streets. No one-cell flare or road ending in bare lawn.
  fill(16,0,2,height,'.');fill(5,16,24,2,'.');
  for(const b of m.props.filter(p=>p.door)){
    const {x,y}=b.door;
    if(y<16)fill(x,y+1,2,17-y,'.');
    else {fill(16,y+1,x-14,2,'.');}
  }
  const nearPerson=(x,y)=>m.npcs.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<=1);
  const bed=(x,y,w,h)=>{
    // Flowers stay walkable, but keep a clear conversation apron around residents.
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(m.g[yy]?.[xx]===','&&!nearPerson(xx,yy))m.g[yy][xx]='F';
  };
  for(const p of [[3,3,5,2],[9,3,4,1],[20,3,4,2],[29,3,3,2],
    [3,13,2,3],[8,13,4,3],[19,13,7,3],[29,13,3,3],
    [3,18,5,1],[9,18,6,1],[3,21,5,3],[14,20,1,5],[29,18,3,2],[29,24,3,2]])bed(...p);
  // The southern lawn becomes a pond with clipped corners and a flower border.
  const pond = m.id==='village'?[9,21,5,4]:[22,21,7,4];
  const [px,py,pw,ph]=pond;
  for(let y=py;y<py+ph;y++)for(let x=px;x<px+pw;x++){
    if((x===px||x===px+pw-1)&&(y===py||y===py+ph-1))continue;
    if(m.g[y][x]===','&&!nearPerson(x,y))m.g[y][x]='W';
  }
  bed(px-1,py,1,ph);bed(px,py-1,pw,1);
  if(m.id==='rods'){bed(9,23,6,3);bed(19,19,3,1);}
  // Paired broadleaf trees form a single compact grove with no spacer row.
  for(const y of [5,8])for(const x of [19,21]){
    let clear=true;for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+2;xx++)if(m.g[yy][xx]!==','||nearPerson(xx,yy))clear=false;
    if(clear){fill(x,y,2,3,'T');m.props.push({art:'tree',x,y,w:2,h:3});}
  }
  m.townPond=pond;m.authoredTownStreets=true;
  m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
}
