import assert from 'node:assert/strict';
import {MAPS} from '../src/data/maps.js';
const blocked=new Set(['T','R','M','W','#','r','w','S','X','=','c','b','t','K','V','P','s']);
let towns=0;
for(const m of Object.values(MAPS)){
 if(!m.townDesign)continue;towns++;
 const open=(x,y)=>m.rows[y]?.[x]!=null&&!blocked.has(m.rows[y][x]);
 const start=m.warps.find(p=>open(p.x,p.y))||m.spawn;
 const q=[[start.x,start.y]],seen=new Set([start.x+','+start.y]);
 for(let i=0;i<q.length;i++)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const[x,y]=q[i],xx=x+dx,yy=y+dy,k=xx+','+yy;if(open(xx,yy)&&!seen.has(k)){seen.add(k);q.push([xx,yy]);}}
 for(const p of [...m.warps,m.spawn])assert(seen.has(p.x+','+p.y),m.id+' inaccessible entrance/spawn '+JSON.stringify(p));
 for(const p of [...m.npcs,...m.signs])assert([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((p.x+dx)+','+(p.y+dy))),m.id+' inaccessible person/sign '+p.name);
 if(m.authoredTownStreets){assert(m.rows.some(r=>r.includes('WWW')),'Pond missing');for(const p of m.props.filter(p=>p.door&&p.door.y<16))for(let y=p.door.y+1;y<18;y++)for(let x=p.door.x;x<p.door.x+2;x++)assert.equal(m.rows[y][x],'.','Continuous two-cell doorway approach');}
}
console.log('PASS: '+towns+' towns, all doors/spawns/residents/signs reachable; authored two-cell streets and ponds');
