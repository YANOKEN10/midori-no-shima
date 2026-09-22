import {twoCellExits140} from './mapExits140.mjs';
// Correct only untouched automatically supplied border objects, once per document.
export function upgradeDefaultBorders143(base,doc){
 if(doc.defaultBorders143||base.kind==='in')return doc;
 const map=twoCellExits140(structuredClone(base));
 const generated=o=>{if(o.stored79||o.turn81||o.color115)return false;const m=o.id.match(/^a:(?:nature-border132|border132-(?:top|bottom|left|right|cap))-(-?\d+)-(-?\d+)$/);return !!m&&o.x===(o.id.includes('-cap-')?Math.min(Number(m[1]),base.rows[0].length-2):Number(m[1]))&&o.y===Number(m[2]);};
 const kept=[];
 const objects=doc.objects.filter(o=>{
  if(o.id.startsWith('g:')&&!o.stored79&&!o.turn81&&o.template==='tree'){const n=Number(o.id.slice(2)),w=base.rows[0].length;if(o.x===n%w&&o.y===Math.floor(n/w)&&map.warps.some(p=>p.x===o.x&&p.y===o.y))return false;}
  if(!generated(o))return true;
  if(map.warps.some(w=>w.x>=o.x&&w.x<o.x+2&&w.y>=o.y&&w.y<o.y+3))return false;
  if(base.id==='natureforest'&&kept.some(p=>o.x<p.x+2&&o.x+2>p.x&&Math.abs(o.y-p.y)<2))return false;
  kept.push(o);return true;
 });
 return {...doc,defaultBorders143:true,objects:objects.filter(o=>{
  if(base.id!=='natureforest'||o.stored79||o.turn81||o.color115||!o.id.startsWith('p:'))return true;
  const p=base.props[Number(o.id.slice(2))];
  if(!p||p.art!=='tree'||p.w>=2&&p.h>=2||o.x!==p.x||o.y!==p.y)return true;
  return !kept.some(t=>o.x<t.x+2&&o.x+p.w>t.x&&o.y<t.y+3&&o.y+p.h>t.y);
 })};
}
