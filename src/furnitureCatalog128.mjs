// Complete sprites use the same 32-pixel map grid.
export const TABLES128=[
['table-long-h','長机・横',4,2],['table-long-v','長机・縦',2,4],
['table-round','円机',2,2],['table-square','四角い机',2,2],
['table-rect-h','机・横',3,2],['table-rect-v','机・縦',2,3]
];
export const WOODS128=[['oak','明るい木','#bd8a50'],['walnut','こげ茶','#654431'],['white','白木','#d8cfb5'],['blue','青','#558ba3']];
export const FURNITURE128=[
...TABLES128.flatMap(([asset,label,w,h])=>WOODS128.map(([color,name,tint])=>({key:asset+'-'+color+'128',label:label+'（'+name+'）',w,h,asset128:asset,tint128:color==='oak'?null:tint}))),
...[
['plant-monstera','モンステラ',1,2],['plant-palm','鉢植えのヤシ',1,2],
['plant-snake','サンスベリア',1,2],['plant-fern','シダの鉢植え',1,1],
['vase-flowers','花の花瓶',1,1],['vase-blue','青い花瓶',1,1]
].map(([asset,label,w,h])=>({key:asset+'128',label,w,h,asset128:asset}))
];
const kind128=p=>p?.kind||p?.art||p?.key||'';
export const tabletop128=p=>['computer','computer84','register84','plant-fern128','vase-flowers128','vase-blue128','plant-monstera128','plant-palm128','plant-snake128'].includes(kind128(p));
export const shelf134=p=>/^shop-(?:glass|wall-shelf|shelf|shelf-side)106$/.test(kind128(p));
export const table128=p=>shelf134(p)||/^(?:table(?:-|$)|long-table84$|counter84$|counter$|lab-desk86$|ship-desk85$|ship-table85$|labtable$|(?:home|ruin|tower|galaxy)-(?:table|counter)123$)/.test(kind128(p));
export function canStack128(a,b){
 const item=tabletop128(a)?a:tabletop128(b)?b:null;
 const table=table128(a)?a:table128(b)?b:null;
 return !!(item&&table&&item!==table&&item.x>=table.x&&item.y>=table.y&&item.x+item.w<=table.x+table.w&&item.y+item.h<=table.y+table.h);
}
export function mountFurniture128(map){
 const entries=[...(map.room?.furniture||[]).map(f=>({room:map.room,f})),...(map.editorAddedFurniture72||[]).map(f=>({room:{theme:'home'},f})),...(map.editorStyledFurniture73||[])];
 const placement=({f})=>({art:f[0],x:f[1],y:f[2],w:f[3],h:f[4]});
 const tables=entries.map(placement).filter(table128),mounted=new Set();
 map.tabletopFurniture128=[];
 for(const e of entries){const item=placement(e),support=tabletop128(item)&&tables.find(t=>canStack128(item,t));if(support){const y=shelf134(support)?(support.art==='shop-glass106'||support.art==='shop-wall-shelf106'?support.y+0.75-item.h:item.y-0.375):item.y-0.375;mounted.add(e.f);map.tabletopFurniture128.push({...e,f:[...e.f.slice(0,2),y,...e.f.slice(3)]});}}
 if(map.room)map.room.furniture=map.room.furniture.filter(f=>!mounted.has(f));
 map.editorAddedFurniture72=(map.editorAddedFurniture72||[]).filter(f=>!mounted.has(f));
 map.editorStyledFurniture73=(map.editorStyledFurniture73||[]).filter(e=>!mounted.has(e.f));
 return map;
}
