// Convert old composite falls into editable single-cell terrain stamps.
export function upgradeWaterfalls173(base,d,cat){
 const falls=d.objects.filter(o=>!o.stored79&&/waterfall/i.test(o.template||''));if(!falls.length)return d;
 const tiles=new Map(d.tiles.map(t=>[t.x+','+t.y,t])),converted=new Set();
 for(const o of falls){const src=o.id.startsWith('p:')?base.props[Number(o.id.slice(2))]:cat.props.find(p=>p.key===o.template);if(!src)continue;const w=src.w,h=src.h,turn=o.turn81||0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const key=w>=3&&(x===0||x===w-1)?(x===0?'waterfall-rock-left173':'waterfall-rock-right173'):y===0?'waterfall-top173':y===h-1?'waterfall-base173':'waterfall-flow173';const[xx,yy]=turn===1?[h-1-y,x]:turn===2?[w-1-x,h-1-y]:turn===3?[y,w-1-x]:[x,y],px=o.x+xx,py=o.y+yy;if(base.rows[py]?.[px]!==undefined)tiles.set(px+','+py,{x:px,y:py,material:key,...(turn?{turn81:turn}:{}),...(o.color115?{color115:o.color115}:{})});}
  converted.add(o.id);
 }
 return {...d,waterfallsTiled173:true,tiles:[...tiles.values()],objects:d.objects.map(o=>converted.has(o.id)?{...o,stored79:true}:o)};
}
