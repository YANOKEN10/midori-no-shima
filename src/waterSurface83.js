// Animated highlights are drawn only inside unoccupied water tiles.
export function drawWater83(c,map,camX=0,camY=0,tick=performance.now()){
 const rows=map.editorVisualRows73||map.rows;if(!rows)return;
 const x0=Math.max(0,Math.floor(camX/32)),y0=Math.max(0,Math.floor(camY/32));
 const x1=Math.min(rows[0].length,Math.ceil((camX+c.canvas.width)/32)),y1=Math.min(rows.length,Math.ceil((camY+c.canvas.height)/32));
 const props=[...(map.props||[]),...(map.editorAddedProps72||[])];c.save();c.lineWidth=1;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  if(rows[y][x]!=='W'||props.some(p=>!p.pond87&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))continue;
  const phase=tick/850+x*1.71+y*.93,dx=x*32-camX,dy=y*32-camY;
  c.save();c.beginPath();c.rect(dx+4,dy+4,24,24);c.clip();
  c.strokeStyle='rgba(205,241,248,'+(.13+.10*(1+Math.sin(phase))/2)+')';
  for(let i=0;i<2;i++){const yy=dy+10+i*12+Math.sin(phase+i)*2,xx=dx+8+Math.sin(phase*.7+i)*3;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+5,yy+2,xx+11,yy);c.stroke();}c.restore();
 }c.restore();
}
