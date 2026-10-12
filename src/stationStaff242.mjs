// Lift the clerk within the opening so the counter covers the waist, not the neck.
export function stationStaffLift242(map,n){
  return [...(map.props||[]),...(map.editorAddedProps72||[])].some(p=>p.art==='station236-kiosk'&&!p.turn81&&n.x>=p.x&&n.x<p.x+p.w&&n.y>=p.y&&n.y<p.y+p.h&&p.mask?.[Math.round(n.y-p.y)]?.[Math.round(n.x-p.x)]==='.')?10:0;
}

export function clipStationStaff242(ctx,map,n,camX=0,camY=0){
  if(!stationStaffLift242(map,n))return;
  const p=[...(map.props||[]),...(map.editorAddedProps72||[])].find(p=>p.art==='station236-kiosk'&&!p.turn81&&n.x>=p.x&&n.x<p.x+p.w&&n.y>=p.y&&n.y<p.y+p.h&&p.mask?.[Math.round(n.y-p.y)]?.[Math.round(n.x-p.x)]==='.');
  ctx.beginPath();ctx.rect((p.x+2)*32-camX,(p.y+1)*32-camY,32,28);ctx.clip();
}
