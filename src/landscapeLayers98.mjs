// Scenery may share occupied tiles; doors and furniture keep their own rules.
export const landscape98=p=>!!p&&!p.building&&!p.door&&!p.wallMount86&&!p.walkable&&/tree|fir|conifer|broadleaf|palm|rock|crag|cliff|mountain|wall79|(?:^|-)wall$|eIce/i.test(p.art||p.key||'');
export const canOverlap98=(a,b)=>(landscape98(a)&&landscape98(b))||(landscape98(a)&&!!(b.door||b.building))||(landscape98(b)&&!!(a.door||a.building));
export const depth98=(a,b)=>(a.walkable?0:1)-(b.walkable?0:1)||(a.y+a.h)-(b.y+b.h)||a.x-b.x;
export const sortedProps98=map=>[...map.props||[],...map.editorAddedProps72||[]].sort(depth98);
