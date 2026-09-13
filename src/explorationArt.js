// Neighbour-aware wall faces, independent from the one-cell movement grid.
export function explorationWall(c,m,x,y){
 if(!m.ruinRooms&&!m.continuousCliffs)return false;
 const ch=m.rows[y][x];if(!['R','X'].includes(ch))return false;
 const wall=(a,b)=>['R','X'].includes(m.rows[b]?.[a]),dx=x*32,dy=y*32;
 const ice=m.endTheme==='ice',snow=m.frontierTheme==='snow';
 const top=m.ruinRooms?'#383441':ice?'#a8d5e1':snow?'#e2ebec':'#665f5c';
 const face=m.ruinRooms?'#78696e':ice?'#629bad':snow?'#7f8e9b':'#807568';
 c.fillStyle=top;c.fillRect(dx,dy,32,32);
 // Only exposed faces get trim: adjoining cells form one solid wall mass.
 if(!wall(x,y+1)){c.fillStyle=face;c.fillRect(dx,dy+9,32,23);c.fillStyle=m.ruinRooms?'#b79b87':'#d6edf0';c.fillRect(dx,dy+7,32,3);c.fillStyle=m.ruinRooms?'#4f444e':'#506f82';c.fillRect(dx,dy+29,32,3);c.fillRect(dx+(y%2?9:23),dy+12,1,16);}
 if(!wall(x-1,y)){c.fillStyle=face;c.fillRect(dx,dy,3,32);}if(!wall(x+1,y)){c.fillStyle='#252a39';c.fillRect(dx+29,dy,3,32);}
 if(!wall(x,y-1)){c.fillStyle=m.ruinRooms?'#ad9586':'#f1f7f7';c.fillRect(dx,dy,32,3);}
 return true;
}
export function ruinFloor(c,m,x,y,ch){
 if(!m.ruinRooms||['R','X'].includes(ch))return;
 const dx=x*32,dy=y*32;c.fillStyle=(x+y)%2?'#827e77':'#8b857c';c.fillRect(dx,dy,32,32);
 c.fillStyle='#686771';c.fillRect(dx,dy+31,32,1);c.fillRect(dx+31,dy,1,32);
 if(ch==='.') {c.fillStyle='#746479';c.fillRect(dx+2,dy,28,32);}
 if((x*13+y*7)%19===0){c.strokeStyle='#585764';c.beginPath();c.moveTo(dx+8,dy+3);c.lineTo(dx+13,dy+12);c.lineTo(dx+9,dy+20);c.stroke();}
}
