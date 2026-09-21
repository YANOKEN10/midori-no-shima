import {addBuildingRooms83} from './buildingRooms83.mjs';
export function addMoveReminder92(maps){
 addBuildingRooms83(maps);const m=maps.rods;if(!m||m.editor72||[...m.props,...m.editorAddedProps72||[]].some(p=>p.art==='reminderHouse96'))return;
 const points=[m.spawn,...m.npcs,...m.warps,...m.signs,...m.items||[]],props=[...m.props||[],...m.editorAddedProps72||[]];
 const clear=(x,y)=>[',','F'].includes(m.rows[y]?.[x])&&!points.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<1)&&!props.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y-1&&y<p.y+p.h+1);
 const spots=[];for(let y=4;y<m.rows.length-6;y++)for(let x=3;x<m.rows[y].length-6;x++){let ok=true;for(let yy=y;yy<y+6&&ok;yy++)for(let xx=x;xx<x+5;xx++)if(!clear(xx,yy)){ok=false;break;}if(ok)spots.push({x,y});}
 spots.sort((a,b)=>Math.abs(a.x+2-m.spawn.x)+Math.abs(a.y+5-m.spawn.y)-Math.abs(b.x+2-m.spawn.x)-Math.abs(b.y+5-m.spawn.y));
 const spot=spots[0];if(!spot)return; // Preserve densely edited towns; the material remains available.
 const {x,y}=spot,door={x:x+2,y:y+4};
 m.props.push({art:'reminderHouse96',x,y,w:5,h:5,door,label:'思い出し屋（黄色い屋根）'});
 const grid=m.rows.map(r=>[...r]);for(let yy=y;yy<y+5;yy++)for(let xx=x;xx<x+5;xx++)grid[yy][xx]='#';grid[door.y][door.x]='D';grid[door.y+1][door.x]='.';m.rows=grid.map(r=>r.join(''));
 m.warps.push({...door,to:'building83-reminderHouse96',tx:7,ty:11,back:{map:m.id,x:door.x,y:door.y+1}});
}
