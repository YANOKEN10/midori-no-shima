import {MOVES,canonicalMoveName,newMove} from './data/moves.js';
// The species' base stats determine its move category, independent of level/IV/EV.
export function moveStyle192(sp){const d=sp.base.atk-sp.base.spc;return Math.abs(d)<20?'mixed':d>0?'phys':'spec';}
export function allowsMove192(sp,name){const m=MOVES[canonicalMoveName(name)];return !!m&&(m.cat==='stat'||moveStyle192(sp)==='mixed'||m.cat===moveStyle192(sp));}
function closest192(sp,old,cat,used){
 const candidates=Object.keys(MOVES).filter(n=>MOVES[n].cat===cat&&!used.has(n));
 const score=n=>{const m=MOVES[n];return (m.type===old.type?0:sp.types.includes(m.type)?60:150)+Math.abs(m.pow-old.pow)+(m.acc<old.acc?10:0);};
 return candidates.sort((a,b)=>score(a)-score(b)||a.localeCompare(b,'ja'))[0];
}
export function alignLearnsets192(catalog){
 for(const sp of Object.values(catalog)){
  const style=moveStyle192(sp),used=new Set(),counts={phys:0,spec:0};
  sp.learn=sp.learn.map(([lv,raw])=>{
   let n=canonicalMoveName(raw);const old=MOVES[n];if(old.cat==='stat'){used.add(n);return [lv,n];}
   const cat=style==='mixed'?(counts.phys===counts.spec?old.cat:counts.phys<counts.spec?'phys':'spec'):style;
   if(old.cat!==cat||used.has(n))n=closest192(sp,old,cat,used);
   if(!n)throw Error('No replacement move for '+sp.no);
   used.add(n);counts[cat]++;return [lv,n];
  });
  // Make mixed pools exactly even without deleting any change move.
  if(style==='mixed'&&counts.phys!==counts.spec){const cat=counts.phys<counts.spec?'phys':'spec',last=sp.learn.filter(([,n])=>MOVES[n].cat!=='stat').at(-1);sp.learn.push([last[0],closest192(sp,MOVES[last[1]],cat,used)]);}
 }
}
export function alignKnownMoves192(mon,sp){
 if(!sp||!Array.isArray(mon.moves)||mon.moveRules192===mon.sp)return false;
 const used=new Set(),counts={phys:0,spec:0},style=moveStyle192(sp);let changed=false;
 mon.moves=mon.moves.map(m=>{
  const n=canonicalMoveName(m.name),old=MOVES[n];if(!old)return m;
  if(old.cat==='stat'){used.add(n);return m;}
  const cat=style==='mixed'?(counts.phys===counts.spec?old.cat:counts.phys<counts.spec?'phys':'spec'):style;
  counts[cat]++;if(cat===old.cat&&!used.has(n)){used.add(n);return m;}
  const pool=sp.learn.filter(([lv,name])=>lv<=mon.lv&&MOVES[name].cat===cat&&!used.has(name)).map(([,name])=>name);
  const name=pool.sort((a,b)=>Math.abs(MOVES[a].pow-old.pow)-Math.abs(MOVES[b].pow-old.pow))[0]||closest192(sp,old,cat,used);
  const next=newMove(name);next.pp=Math.max(0,Math.min(next.max,Math.floor(next.max*(m.max?m.pp/m.max:0))));used.add(name);changed=true;return next;
 });
 mon.moveRules192=mon.sp;return changed;
}
