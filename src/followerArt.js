import {SPECIES} from './data/species.js';
import {FOLLOWER_PROFILES} from './data/followerProfilesV1.js';
const columns = {down:0,up:1,right:2,left:3};
const sheets = new Map(), frames = new Map();
export const followerProfile = name => FOLLOWER_PROFILES[SPECIES[name]?.no] || null;
// Sizes describe the visible silhouette, never the transparent 80px cell.
export const followerSize = name => followerProfile(name)?.size || 32;
export function followerMetrics(name, dir='right') {
  const p = followerProfile(name), rect = p?.dirs[columns[dir] ?? 0];
  if (!p || !rect) return {width:32,height:32};
  return {width:Math.max(1,Math.round(rect[2]*p.size/p.extent)),height:Math.max(1,Math.round(rect[3]*p.size/p.extent))};
}
export function followerDistance(name, dir='right') {
  const {width,height} = followerMetrics(name,dir);
  // Hero body is ~30px wide / 46px tall. Leave a small visible gap sideways;
  // depth overlap is intentional vertically, as in the reference screenshots.
  return ['up','down'].includes(dir) ? Math.max(.94,(height*.5+14)/32) : Math.max(1,(width/2+15+5)/32);
}
export function followerSheet(name) {
  const no=SPECIES[name]?.no, p=followerProfile(name);
  if (!p) return null;
  if (!sheets.has(no)) {
    const im=new Image(); im.src=new URL('../assets/'+p.src,import.meta.url).href;
    sheets.set(no,im);
  }
  return sheets.get(no);
}
export async function loadFollowerSheet(name) {
  const im=followerSheet(name); if(!im)return false;
  try {await im.decode();return true;} catch {return false;}
}
export function followerFrame(name,dir,phase=0) {
  const p=followerProfile(name), im=followerSheet(name);
  if(!p||!im?.complete||!im.naturalWidth)return null;
  const col=columns[dir]??0,row=((phase%p.rows)+p.rows)%p.rows,key=SPECIES[name].no+':'+col+':'+row;
  if(frames.has(key))return frames.get(key);
  const [x,y,w,h]=p.dirs[col],size=followerMetrics(name,dir),c=document.createElement('canvas');
  c.width=size.width;c.height=size.height;
  const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  // One common crop per direction preserves stance and head size during a stride.
  ctx.drawImage(im,col*80+x,row*80+y,w,h,0,0,c.width,c.height);
  frames.set(key,c);return c;
}
export function drawFollower(ctx,mon,pose,tick,cx,feetY) {
  const p=followerProfile(mon.sp);if(!p)return false;
  const hovering=['fly','float','swim'].includes(p.kind),active=pose.moving||hovering;
  const beat=Math.floor(tick/p.frameMs),phase=active?(p.rows===3?[0,1,0,2][beat%4]:beat%p.rows):0;
  const frame=followerFrame(mon.sp,pose.dir,phase);
  if(!frame)return false;
  const bob=hovering?2+Math.round(Math.sin(tick/(p.frameMs*2))*1.5):p.kind==='hop'&&pose.moving?Math.round(Math.abs(Math.sin(tick/(p.frameMs*2)*Math.PI))*3):0;
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='rgba(12,44,37,.18)';ctx.beginPath();
  ctx.ellipse(Math.round(cx),Math.round(feetY-1),Math.max(5,frame.width*.34),Math.max(2,frame.width*.07),0,0,Math.PI*2);ctx.fill();
  ctx.drawImage(frame,Math.round(cx-frame.width/2),Math.round(feetY-frame.height-bob));
  ctx.restore();return true;
}
