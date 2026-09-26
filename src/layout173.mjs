import {target173,DUNGEONS173,SNOW173} from './materialCatalog173.mjs';
import {MATERIAL_PROPS172} from './materials172.mjs';
export {target173};
// Rebuild only requested maps. Old furnishings remain in editor storage.
export function upgrade173(base,d,cat){
 if(!target173(base)||d.layout173)return d;
 if(base.id==='merire'){
  if(d.waterfallDesign173)return d;const tiles=new Map(d.tiles.map(t=>[t.x+','+t.y,t])),pool=new Set();
  for(let y=21;y<=22;y++)for(let x=26;x<=35;x++)if(![...base.npcs,...base.warps,...(d.links||[])].some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=1)){pool.add(x+','+y);tiles.set(x+','+y,{x,y,material:'water173'});}
  const objects=d.objects.map(o=>{if(o.stored79)return o;const p=o.id.startsWith('p:')?base.props[Number(o.id.slice(2))]:cat.props.find(p=>p.key===o.template);if(!p||/waterfall/i.test(p.art||o.template))return o;let overlaps=false;for(let y=o.y;y<o.y+(p.h||1);y++)for(let x=o.x;x<o.x+(p.w||1);x++)if(pool.has(x+','+y)||/tree|fir/i.test(p.art||o.template)&&base.rows[y]?.[x]==='W')overlaps=true;if(!overlaps)return o;for(let y=o.y;y<o.y+(p.h||1);y++)for(let x=o.x;x<o.x+(p.w||1);x++)if(base.rows[y]?.[x]==='W'||pool.has(x+','+y))tiles.set(x+','+y,{x,y,material:'water173'});return {...o,stored79:true};});
  return {...d,waterfallDesign173:true,objects,tiles:[...tiles.values()]};
 }

 const w=base.rows[0].length,h=base.rows.length,indoor=base.kind==='in',ruin=base.id==='forgottenRuins',hot=!indoor&&base.id!=='shadowDepths'&&!ruin;
 const snow=SNOW173.includes(base.id),ice=base.id==='glacier';
 const theme=snow?(ice?'ice':'snow'):indoor?(base.id==='hospital'||base.id==='lab'?'clinic':'home'):hot?'volcano':ruin?'ruins':'cave';
 const floor=indoor?'wood-floor173':theme+'-floor173',wall=theme+'-wall173',g=Array.from({length:h},()=>Array(w).fill(indoor?'void173':wall)),objects=d.objects.map(o=>({...o,stored79:!(snow&&cat.props.find(p=>p.key===o.template)?.building||snow&&o.id.startsWith('p:')&&base.props[Number(o.id.slice(2))]?.door||cat.props.find(p=>p.key===o.template)?.pickup138)}));
 const paint=(x,y,ww,hh,t=floor)=>{for(let yy=Math.max(0,y);yy<Math.min(h,y+hh);yy++)for(let xx=Math.max(0,x);xx<Math.min(w,x+ww);xx++)g[yy][xx]=t;};
 const line=(a,b,width=3,t=floor)=>{let[x,y]=a;paint(x,y,width,width,t);while(x!==b[0]){x+=Math.sign(b[0]-x);paint(x,y,width,width,t);}while(y!==b[1]){y+=Math.sign(b[1]-y);paint(x,y,width,width,t);}};
 const route=(points,width=3,t=floor)=>{for(let i=1;i<points.length;i++)line(points[i-1],points[i],width,t);};
 const anchors=[base.spawn,...(base.warps||[]),...(d.links||[]),...(d.actors||[]),...(base.items||[]),...objects.filter(o=>!o.stored79&&cat.props.find(p=>p.key===o.template)?.pickup138)];
 for(const m of Object.values(cat.maps))for(const p of m.warps||[])if(p.to===base.id)anchors.push({x:p.tx,y:p.ty});
 let center=[Math.floor(w/2),Math.floor(h/2)];
 if(snow){
  paint(2,2,w-4,h-4);
  if(base.id==='clearTown'){for(const y of [17,30]){paint(2,y,w-4,2,wall);paint(y===17?27:18,y,4,2,'snow-stairs173');}paint(4,27,8,3,'ice-floor173');paint(29,32,9,4,'ice-floor173');center=[20,24];}
  else{for(let y=12;y<h-6;y+=16){const gate=(Math.floor(y/16)%2)?w-12:8;paint(2,y,w-4,3,wall);paint(gate,y,4,3,'snow-stairs173');paint(gate,y-3,4,3,'snow-path173');paint(ice?9:22,y+6,ice?15:10,4,ice?'ice-water173':'ice-floor173');}center=[20,8];}
  if(base.enc)for(let y=5;y<h-5;y+=16)paint((Math.floor(y/16)%2)?5:w-10,y,4,4,'snow-grass173');
  for(const o of objects.filter(o=>!o.stored79)){const p=cat.props.find(p=>p.key===o.template)||base.props[Number(o.id.slice(2))];if(p)paint(o.x-1,o.y-1,p.w+2,p.h+3);}
 }else if(indoor){
  const exit=base.warps.find(p=>p.to==='@back'||p.y>h/2)||base.warps[0],bottom=Math.min(h-2,Math.max(exit?.y||h-2,10));
  paint(1,1,w-2,bottom,wall);paint(2,3,w-4,bottom-3);center=[Math.floor(w/2),Math.max(7,bottom-3)];
  const split=Math.floor(w/2),partition=Math.min(7,bottom-4);
  paint(split,3,1,partition-3,wall);paint(2,partition,w-4,1,wall);paint(4,partition,2,1);paint(w-6,partition,2,1);
  paint(split,Math.max(4,partition-2),1,2);
  paint(split+1,3,w-split-3,partition-3,'kitchen-floor173');
  paint(3,partition+2,3,2,'rug173');
  if(['hospital','lab'].includes(base.id)){for(let y=3;y<bottom;y++)for(let x=2;x<w-2;x++)if(g[y][x]===floor)g[y][x]='kitchen-floor173';}
  if(base.id==='shipCabins'){
   paint(1,1,w-2,h-2,wall);paint(2,3,w-4,h-5);const my=Math.floor(h/2);paint(2,my-2,w-4,1,wall);paint(2,my+2,w-4,1,wall);paint(Math.floor(w/2),3,1,h-5,wall);paint(2,my-1,w-4,3);for(const x of [6,w-8]){paint(x,my-2,2,1);paint(x,my+2,2,1);}center=[Math.floor(w/2),my];
  }
 }else if(ruin){
  for(const r of [[3,3,9,7],[17,3,8,7],[3,18,9,7],[17,18,8,7],[10,11,9,7]])paint(...r);
  route([[0,13],[12,13],[12,0]],3);route([[12,13],[25,13],[27,13]],3);
  route([[6,7],[6,20],[20,20],[20,7]],3);center=[13,14];
  paint(12,5,4,4,wall);paint(12,20,4,5,wall);
 }else if(base.id==='shadowDepths'){
  route([[0,13],[5,13],[5,4],[21,4],[21,13],[14,13],[14,22],[5,22]],3);
  paint(3,3,7,6);paint(18,3,7,6);paint(10,18,13,7);paint(7,9,13,3,'water173');paint(9,10,3,7,wall);paint(17,8,2,8,'bridge173');route([[5,22],[5,13]],3);center=[14,22];
  paint(21,14,4,3,'water173');paint(5,7,3,2,'stairs173');
 }else if(base.id==='volcanoSummit'){
  paint(3,4,w-6,h-8,'lava173');paint(10,5,w-20,11);paint(8,7,w-16,6);paint(16,14,6,h-14);paint(12,23,14,5);paint(16,16,6,3,'stairs173');paint(16,28,6,3,'stairs173');center=[18,10];
 }else{
  const long=h>30,fl=Number(base.id.slice(-1))||0,left=fl===2?7:4,right=w-8;
  route([[Math.floor(w/2),h-1],[Math.floor(w/2),h-8],[left,h-8],[left,Math.floor(h*.57)],[right,Math.floor(h*.57)],[right,7],[Math.floor(w/2),7],[Math.floor(w/2),0]],3);
  paint(3,3,8,7);paint(w-12,h-12,8,7);paint(10,Math.floor(h*.57)-5,10,7);
  route([[left,7],[left,Math.floor(h*.57)]],3);route([[left,7],[right,7]],3);
  paint(9,11,w-18,Math.max(4,Math.floor(h*.57)-13),'lava173');paint(8,h-6,w-16,3,'lava173');paint(Math.floor(w/2),h-7,3,6,'stone-bridge173');paint(left,Math.floor(h*.57)+4,3,2,'stairs173');paint(right,10,3,2,'stairs173');center=[left,Math.floor(h*.57)];
  if(!long){paint(11,11,6,7,'lava173');paint(4,19,7,4,'lava173');}
 }
 // Join preserved event coordinates to the nearest authored walkable square.
 const blocked=t=>/wall|front|void|lava|water/.test(t);
 for(const p of anchors){if(!Number.isInteger(p?.x)||!Number.isInteger(p?.y)||!g[p.y]?.[p.x])continue;
  if(blocked(g[p.y][p.x])){let best=null,dist=Infinity;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(!blocked(g[y][x])){const n=Math.abs(x-p.x)+Math.abs(y-p.y);if(n<dist){best=[x,y];dist=n;}}line([p.x,p.y],best||center,2);}
  paint(p.x,p.y,1,1);
 }
 for(const p of base.warps||[]){if(p.y===0||p.y===h-1){paint(p.x,p.y,2,1);paint(p.x,p.y===0?1:h-2,2,1);}else if(p.x===0||p.x===w-1){paint(p.x,p.y,1,2);paint(p.x===0?1:w-2,p.y,1,2);}}
 // Connect all retained arrivals even when an old map had unusually wide exits.
 const floodFloor=()=>{const start=base.spawn,q=[start],seen=new Set([start.x+','+start.y]);for(let i=0;i<q.length;i++)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=q[i].x+dx,y=q[i].y+dy,k=x+','+y;if(g[y]?.[x]&&!blocked(g[y][x])&&!seen.has(k)){seen.add(k);q.push({x,y});}}return seen;};
 let connected=floodFloor();for(const p of anchors){if(!p||!g[p.y]?.[p.x]||connected.has(p.x+','+p.y))continue;let best=null,dist=Infinity;for(const k of connected){const[x,y]=k.split(',').map(Number),dd=Math.abs(x-p.x)+Math.abs(y-p.y);if(dd<dist){best=[x,y];dist=dd;}}if(best){line([p.x,p.y],best,2);connected=floodFloor();}}
 const reserved=new Set();for(const p of anchors)for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)reserved.add((p.x+xx)+','+(p.y+yy));
 const occupied=new Set();for(const o of objects.filter(o=>!o.stored79)){const p=base.props[Number(o.id.startsWith('p:')?o.id.slice(2):-1)]||cat.props.find(p=>p.key===o.template);if(p&&!p.pickup138)for(let y=o.y;y<o.y+p.h;y++)for(let x=o.x;x<o.x+p.w;x++)occupied.add(x+','+y);}for(const p of base.warps||[])occupied.delete(p.x+','+p.y);let serial=0;
 const add=(id,x,y)=>{const p=MATERIAL_PROPS172.find(p=>p.key==='material172-'+id)||cat.props.find(p=>p.key===id);if(!p)return false;for(let yy=y;yy<y+p.h;yy++)for(let xx=x;xx<x+p.w;xx++)if(!g[yy]?.[xx]||blocked(g[yy][xx])||reserved.has(xx+','+yy)||occupied.has(xx+','+yy)||/bridge|stairs/.test(g[yy][xx]))return false;
  // Keep a walkable ring around furniture/rocks; no random passage blockers.
  if(x<2||y<2||x+p.w>=w-1||y+p.h>=h-1)return false;
  for(let yy=y;yy<y+p.h;yy++)for(let xx=x;xx<x+p.w;xx++)occupied.add(xx+','+yy);
  objects.push({id:'a:design173-'+serial++,type:'prop',template:p.key,x,y});return true;};
 if(snow){
  for(let y=3;y<h-4;y+=4)for(let x=3;x<w-3;x+=4){if(base.id==='clearTown'&&x>9&&x<30&&y>8&&y<30)continue;add(ice?'legacy73-eIce':'legacy73-snowFir',x,y);}
 }else if(indoor){
  const medical=['hospital','lab'].includes(base.id),variants=base.id==='clearElder'?['fireplace','rockingchair','bookshelf']:base.id==='adminHouse72'?['workbench','cabinet','bookshelf']:['wardrobe','drawers','bookshelf'];
  for(const p of [[medical?'singlebed':'singlebed',3,3],[variants[0],5,3],['fridge',w-4,3],['sink',w-7,3],['stove',w-8,3],[medical?'counter':'sofa',3,8],[medical?'medicinecabinet':'coffeetable',3,10],[variants[1],w-5,8],[variants[2],w-4,Math.min(h-5,9)],['lamp',2,h-4]])add(...p);
  if(w>20)for(let y=4;y<h-4;y+=8)for(const x of [3,w-6]){add('singlebed',x,y);add('writingdesk',x+2,y);add('stool',x+2,y+2);}
 }else{
  const choices=ruin?['brokenpillar','moss-rock','rubble','statue','pillar']:hot?['basalt','coal-rock','ruby-rock','brazier']:['stalagmite','crystal-rock','moss-rock','white-rock'];
  for(let y=3;y<h-3;y+=4)for(let x=3;x<w-3;x+=5){let near=false;for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(blocked(g[y+dy]?.[x+dx]||wall))near=true;if(near||ruin)add(choices[(x+y)%choices.length],x,y);}
 }
 // Never let newly placed props disconnect an exit, NPC approach, or chamber.
 const reachable=()=>{const start=anchors.find(p=>p&&g[p.y]?.[p.x]&&!blocked(g[p.y][p.x])&&!occupied.has(p.x+','+p.y))||{x:center[0],y:center[1]},seen=new Set([start.x+','+start.y]),q=[start];for(let i=0;i<q.length;i++)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=q[i].x+dx,y=q[i].y+dy,k=x+','+y;if(g[y]?.[x]&&!blocked(g[y][x])&&!occupied.has(k)&&!seen.has(k)){seen.add(k);q.push({x,y});}}return seen;};
 let seen=reachable();for(let i=objects.length-1;i>=0;i--){const o=objects[i];if(!o.id.startsWith('a:design173-'))continue;if(anchors.every(p=>!p||!g[p.y]?.[p.x]||seen.has(p.x+','+p.y)))break;const p=MATERIAL_PROPS172.find(p=>p.key===o.template)||cat.props.find(p=>p.key===o.template);for(let y=o.y;y<o.y+p.h;y++)for(let x=o.x;x<o.x+p.w;x++)occupied.delete(x+','+y);objects.splice(i,1);seen=reachable();}
 const tiles=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){let material=g[y][x];if(material===wall&&g[y+1]?.[x]&&!blocked(g[y+1][x]))material=theme+'-front173';tiles.push({x,y,material});}
 return {...d,layout173:true,theme173:theme,objects,tiles,elevations:[],climbs:[],rug:null};
}
