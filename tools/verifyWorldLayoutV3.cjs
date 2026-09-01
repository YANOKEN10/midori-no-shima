const SOLID = new Set(["T","R","M","W","#","r","w","S","X","=","c","b","t","K","V","P","s"]);
const SOLID_LANDMARKS = new Set(["alpineCabin","alpineLodge","alpineBoathouse","alpineWorkshop","alpineHerbalist","alpineSnowChalet","alpineRailStation","alpineObservatory"]);

(async()=>{
  const {MAPS}=await import("../src/data/maps.js");
  const failures=[];let outdoor=0;
  for(const [id,map] of Object.entries(MAPS)){
    if(map.kind!=="out")continue;outdoor++;
    const w=map.rows[0].length,h=map.rows.length;
    if(w<24||h<22)failures.push(`${id}:small:${w}x${h}`);
    const landmarkBlocked=(x,y)=>(map.landmarks||[]).some(lm=>{
      if(!SOLID_LANDMARKS.has(lm.art))return false;
      const lw=lm.w||4,lh=lm.h||4;
      if(x<lm.x||x>=lm.x+lw||y<lm.y||y>=lm.y+lh)return false;
      return !(y===lm.y+lh-1&&x===lm.x+Math.floor(lw/2));
    });
    const pass=(x,y)=>x>=0&&x<w&&y>=0&&y<h&&!SOLID.has(map.rows[y][x])&&!landmarkBlocked(x,y);
    let start=(map.warps||[]).find(p=>pass(p.x,p.y));
    if(!start){outer:for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(pass(x,y)){start={x,y};break outer;}}
    if(!start){failures.push(`${id}:no-start`);continue;}
    const seen=new Set([`${start.x},${start.y}`]),queue=[[start.x,start.y]];
    while(queue.length){const [x,y]=queue.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(pass(nx,ny)&&!seen.has(k)){seen.add(k);queue.push([nx,ny]);}}}
    const required=[];
    for(const p of map.warps||[])required.push(["warp",p]);
    for(const key of ["npcs","signs","items"])for(const p of map[key]||[])required.push([key,p]);
    for(const [kind,p] of required){
      const cells=[[p.x,p.y],[p.x+1,p.y],[p.x-1,p.y],[p.x,p.y+1],[p.x,p.y-1]];
      if(!cells.some(([x,y])=>seen.has(`${x},${y}`)))failures.push(`${id}:${kind}@${p.x},${p.y}`);
    }
  }
  console.log(JSON.stringify({outdoor,failures}));
  if(failures.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
