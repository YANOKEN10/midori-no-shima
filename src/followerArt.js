import {V63_IDS} from './data/redesignV63.js';
import {REVISED_IDS,legacyName} from './data/redesignV47.js';
// Cardinal views; new sheets contain idle plus two distinct strides.
import {SPECIES} from './data/species.js';
import {MOTION_PROFILES} from './data/gaonMotion.js';
import {WALK_V51_IDS} from './data/redesignV51.js';
import {FOLLOWER_SIZES} from './data/followerSizes.js';
// Enlarge the authored species sizes uniformly; retain the existing foot anchor.
export const followerSize=name=>{const previous=SPECIES[name]?.no===20?56:Math.min(64,Math.round((FOLLOWER_SIZES[legacyName(name)]??32)*1.2));return Math.round(previous*1.15);};
const sheets=new Map(),frames=new Map();
export function followerSheet(name){const no=SPECIES[name]?.no;if(!no)return null;if(!sheets.has(no)){const im=new Image();im.src=new URL('../assets/'+(V63_IDS.has(no)?'followers-v63/':WALK_V51_IDS.has(no)?'followers-v52/':REVISED_IDS.has(no)?'followers-v47/':'followers-v14/')+String(no).padStart(3,'0')+'.png',import.meta.url).href;sheets.set(no,im);}return sheets.get(no);}
export async function loadFollowerSheet(name){const im=followerSheet(name);if(!im)return false;try{await im.decode();return true;}catch{return false;}}
export function followerFrame(name,dir,phase=0){const im=followerSheet(name);if(!im?.complete||!im.naturalWidth)return null;const col=({down:0,up:1,right:2,left:3})[dir]??0,row=phase%((V63_IDS.has(SPECIES[name]?.no)||WALK_V51_IDS.has(SPECIES[name]?.no))?3:2),key=SPECIES[name].no+':'+col+':'+row;if(frames.has(key))return frames.get(key);const c=document.createElement('canvas');c.width=c.height=80;c.getContext('2d').drawImage(im,col*80,row*80,80,80,0,0,80,80);frames.set(key,c);return c;}
export function drawFollower(ctx,mon,pose,tick,cx,feetY){const size=followerSize(mon.sp),kind=(SPECIES[mon.sp]?.no===20?'fly':SPECIES[mon.sp]?.no===156?'float':[113,114].includes(SPECIES[mon.sp]?.no)?'swim':[88,89,90].includes(SPECIES[mon.sp]?.no)?'walk':MOTION_PROFILES[legacyName(mon.sp)]?.kind)||'walk',active=pose.moving||['fly','float','swim'].includes(kind),ms=({walk:160,hop:200,fly:150,swim:220,float:260,crawl:260,slither:220})[kind]||180,phase=active?((V63_IDS.has(SPECIES[mon.sp]?.no)||WALK_V51_IDS.has(SPECIES[mon.sp]?.no))?[0,1,0,2][Math.floor(tick/ms)%4]:Math.floor(tick/ms)%2):0;const frame=followerFrame(mon.sp,pose.dir,phase);ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='rgba(12,44,37,.18)';ctx.beginPath();ctx.ellipse(Math.round(cx),Math.round(feetY-1),size/4,Math.max(2,size/16),0,0,Math.PI*2);ctx.fill();if(frame)ctx.drawImage(frame,Math.round(cx-size/2),Math.round(feetY-size*.925),size,size);ctx.restore();return !!frame;}
