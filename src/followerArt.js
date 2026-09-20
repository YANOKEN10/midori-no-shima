import {V94_IDS} from './data/redesignV94.js';
import {V63_IDS} from './data/redesignV63.js';
import {REVISED_IDS,legacyName} from './data/redesignV47.js';
// Cardinal views; new sheets contain idle plus two distinct strides.
import {SPECIES} from './data/species.js';
import {MOTION_PROFILES} from './data/gaonMotion.js';
import {WALK_V51_IDS} from './data/redesignV51.js';
import {FOLLOWER_SIZES} from './data/followerSizes.js';
// Species-specific field scale: compress large bodies without flattening their differences.
const fieldSizeOverrides={166:24,167:32,168:42,169:24,170:32,171:42,172:24,173:32,174:42,175:24,176:32,177:42,178:24,179:32,180:42,181:24,182:32,183:42,184:24,185:32,186:42,187:24,188:32,189:42,190:24,191:32,192:42,193:24,194:32,195:42,196:24,197:32,198:42,199:32,200:32,157:42,158:30,159:24,160:32,161:24,162:32,163:22,164:42,165:42,10:26,11:38,20:40,117:42,154:24,155:32,156:44};
export const followerSize=name=>{const authored=FOLLOWER_SIZES[legacyName(name)]??32;return fieldSizeOverrides[SPECIES[name]?.no]??Math.round(authored<=32?authored:32+(authored-32)*.6);};
// Vertical sprites intentionally overlap in depth; horizontal silhouettes stay separate.
export const followerDistance=(name,dir='right')=>Math.max(.9,(followerSize(name)*.65+5)/32)*(['up','down'].includes(dir)?.86:1);
const sheets=new Map(),frames=new Map();
export function followerSheet(name){const no=SPECIES[name]?.no;if(!no)return null;if(!sheets.has(no)){const im=new Image();im.src=new URL('../assets/'+(V94_IDS.has(no)?'followers-v94/':V63_IDS.has(no)?'followers-v63/':WALK_V51_IDS.has(no)?'followers-v52/':REVISED_IDS.has(no)?'followers-v47/':'followers-v14/')+String(no).padStart(3,'0')+'.png',import.meta.url).href;sheets.set(no,im);}return sheets.get(no);}
export async function loadFollowerSheet(name){const im=followerSheet(name);if(!im)return false;try{await im.decode();return true;}catch{return false;}}
export function followerFrame(name,dir,phase=0){const im=followerSheet(name);if(!im?.complete||!im.naturalWidth)return null;const col=({down:0,up:1,right:2,left:3})[dir]??0,row=phase%((V94_IDS.has(SPECIES[name]?.no)||V63_IDS.has(SPECIES[name]?.no)||WALK_V51_IDS.has(SPECIES[name]?.no))?3:2),key=SPECIES[name].no+':'+col+':'+row;if(frames.has(key))return frames.get(key);const c=document.createElement('canvas');c.width=c.height=80;c.getContext('2d').drawImage(im,col*80,row*80,80,80,0,0,80,80);frames.set(key,c);return c;}
export function drawFollower(ctx,mon,pose,tick,cx,feetY){const size=followerSize(mon.sp),kind=(SPECIES[mon.sp]?.no===20?'fly':SPECIES[mon.sp]?.no===156?'float':[113,114].includes(SPECIES[mon.sp]?.no)?'swim':[88,89,90].includes(SPECIES[mon.sp]?.no)?'walk':MOTION_PROFILES[legacyName(mon.sp)]?.kind)||'walk',active=pose.moving||['fly','float','swim'].includes(kind),ms=({walk:160,hop:200,fly:150,swim:220,float:260,crawl:260,slither:220})[kind]||180,phase=active?((V94_IDS.has(SPECIES[mon.sp]?.no)||V63_IDS.has(SPECIES[mon.sp]?.no)||WALK_V51_IDS.has(SPECIES[mon.sp]?.no))?[0,1,0,2][Math.floor(tick/ms)%4]:Math.floor(tick/ms)%2):0;const frame=followerFrame(mon.sp,pose.dir,phase);ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='rgba(12,44,37,.18)';ctx.beginPath();ctx.ellipse(Math.round(cx),Math.round(feetY-1),size/4,Math.max(2,size/16),0,0,Math.PI*2);ctx.fill();if(frame)ctx.drawImage(frame,Math.round(cx-size/2),Math.round(feetY-size*.925),size,size);ctx.restore();return !!frame;}
