import {followerSize} from './followerArt.js';
// Read the retained parent individuals directly. Walking never mutates the save.
export function daycareResidents(map,save,tick){
 return (map.daycarePens||[]).flatMap((pen,i)=>{
  const mon=save.daycare?.parents?.[i];if(!mon)return [];
  const size=followerSize(mon.sp),left=(pen.x+1)*32+size/2+3,right=(pen.x+pen.w-1)*32-size/2-3;
  const top=(pen.y+1)*32+size*.925+3,bottom=(pen.y+pen.h-1)*32-size*.075-3;
  const points=[[left,top],[right,top],[right,bottom],[left,bottom]],time=(Math.max(0,tick)+i*2700)%10800,leg=Math.floor(time/2700),elapsed=time%2700,t=Math.min(1,elapsed/2000);
  const a=points[leg],b=points[(leg+1)%4],cx=a[0]+(b[0]-a[0])*t,feet=a[1]+(b[1]-a[1])*t,x=(cx-16)/32,y=(feet-20)/32;
  return [{follower:mon,pose:{x,y,dir:['right','down','left','up'][leg],moving:elapsed<2000},x,y}];
 });
}
export function drawDaycareLabels(c,map,save,camX,camY){
 for(const [i,pen]of (map.daycarePens||[]).entries()){
  const mon=save.daycare?.parents?.[i];if(!mon)continue;
  const label=(mon.nick||mon.sp)+' Lv.'+mon.lv,cx=(i===0?pen.x+pen.w-1.5:pen.x+1.5)*32-camX,y=(pen.y+pen.h-1)*32+6-camY,w=96;
  c.save();c.font='11px sans-serif';while(c.measureText(label).width>w-12&&parseInt(c.font)>8)c.font=(parseInt(c.font)-1)+'px sans-serif';c.fillStyle='#f4eed4';c.fillRect(cx-w/2,y,w,18);c.strokeStyle='#6c563a';c.strokeRect(cx-w/2+.5,y+.5,w-1,17);c.fillStyle='#294937';c.textAlign='center';c.textBaseline='middle';c.fillText(label,cx,y+9,w-10);c.restore();
 }
}
