// Keep moving highlights within the central water curtain, clear of the rocky sides.
export function drawWaterfalls84(c,map,camX=0,camY=0,tick=performance.now()){
 const props=[...(map.props||[]),...(map.editorAddedProps72||[])];
 c.save();c.translate(-camX,-camY);
 for(const p of props){if(!/^(legacy73-)?eWaterfall$/.test(p.art))continue;
  c.save();const w=p.w*32,h=p.h*32;c.translate(p.x*32+w/2,p.y*32+h/2);c.rotate((p.turn81||0)*Math.PI/2);
  const ow=(p.turn81%2?p.h:p.w)*32,oh=(p.turn81%2?p.w:p.h)*32;
  c.translate(-ow/2,-oh/2);c.beginPath();c.rect(ow*.4,oh*.12,ow*.17,oh*.69);c.clip();
  for(let i=0;i<5;i++){const x=ow*(.405+i*.032),phase=(tick/650+i*.23)%1;c.fillStyle=i%2?'#dcf6ff88':'#98dce877';for(let j=-1;j<3;j++)c.fillRect(x,oh*(.12+(phase+j)*.34),Math.max(1,ow*.012),oh*.18);}
  c.restore();
 }c.restore();
}
