import {forestMap131,forestObjects131} from './forestObjects131.mjs';
export function upgradeForestSpacing135(base,doc){
 if(doc.forestSpacing135||!forestMap131(base))return doc;
 const originals=forestObjects131(base),byId=new Map(doc.objects.map(o=>[o.id,o])),unchanged=p=>{const o=byId.get(p.id);return o&&!o.stored79&&!o.turn81&&!o.color115&&o.x===p.x&&o.y===p.y;},removed=new Set(originals.filter(unchanged).map(p=>p.id)),protectedTrees=originals.filter(p=>!unchanged(p)),objects=doc.objects.filter(o=>!removed.has(o.id)),w=base.rows[0].length,h=base.rows.length,slots=[];
 for(const y of [0,h-1])for(let x=0;x<w;){if(base.rows[y][x]!=='T'){x++;continue;}let end=x;while(end<w&&base.rows[y][end]==='T')end++;for(let a=x;a<end;a+=2)if(a+2<=end||end===w)slots.push([a,y===0?-1:h-2]);x=end;}
 for(const x of [0,w-2])for(let y=2;y<h-2;y+=2)if(base.rows[y][x]==='T'&&base.rows[y][x+1]==='T')slots.push([x,y]);
 for(const [x,y]of slots){if(protectedTrees.some(p=>p.x<x+2&&p.x+2>x&&p.y<y+3&&p.y+3>y)||doc.tiles.some(t=>t.x>=x&&t.x<x+2&&t.y>=y&&t.y<y+3)||base.warps.some(a=>a.x>=x&&a.x<x+2&&a.y>=y&&a.y<y+3))continue;objects.push({id:'a:forest-spacing135-'+x+'-'+y,type:'prop',template:'mountain-conifer131',x,y});}
 return {...doc,forestSpacing135:true,objects};
}
