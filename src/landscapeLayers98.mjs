// Fences, boundary walls and trees may share scenery tiles; doors and furniture keep their own rules.
export const landscape98=p=>!!p&&!p.building&&!p.door&&!p.wallMount86&&!p.walkable&&/fence|tree|fir|conifer|broadleaf|palm|rock|crag|cliff|mountain|wall79|(?:^|-)wall$|eIce/i.test(p.art||p.key||'');
// Walkable flower tiles are ground decoration, not competing solid objects.
export const groundDecoration107=p=>!!p?.walkable&&(p.tile==='F'||p.tile==='"'||p.art==='flowers'||p.group==='flower'||p.group==='grass');
// Pickups share ground-cover layers, but never solid scenery or another pickup.
export const canOverlap98=(a,b)=>(a.pickup138||b.pickup138)?(!(a.pickup138&&b.pickup138)&&(groundDecoration107(a)||groundDecoration107(b)||a.art==='rug105'||b.art==='rug105')):groundDecoration107(a)||groundDecoration107(b)||(a.art==='rug105'||b.art==='rug105')||(landscape98(a)&&landscape98(b))||(landscape98(a)&&!!(b.door||b.building))||(landscape98(b)&&!!(a.door||a.building));
export const depth98=(a,b)=>(a.walkable?0:1)-(b.walkable?0:1)||(a.y+a.h)-(b.y+b.h)||a.x-b.x;
export const sortedProps98=map=>[...map.props||[],...map.editorAddedProps72||[]].sort(depth98);
