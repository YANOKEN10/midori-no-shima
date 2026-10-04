const cache=new WeakMap();
export function paintedShore218(map){const tiles=map.editorGround72||[];let old=cache.get(map);if(old?.tiles!==tiles){old={tiles,cells:new Set(tiles.map(t=>t.x+','+t.y))};cache.set(map,old);}return (x,y)=>old.cells.has(x+','+y);}
