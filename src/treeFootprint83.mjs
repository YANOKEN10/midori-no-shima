export const treeKind83=p=>!!p&&/^(tree|fir|garden72-conifer|garden72-broadleaf|legacy73-tree|legacy73-fir|legacy73-world-v19-tree|resource83-blue-tree|autumn-tree109|winter-dry-tree109|winter-snow-tree109|eDarkTree|legacy73-eDarkTree)$/.test(p.art||p.key||'');
export const isTree83=p=>treeKind83(p)&&p.w===2&&p.h===3;
export const treeVisual83=p=>({...p,y:p.y-1,h:4,treeDraw83:true});
