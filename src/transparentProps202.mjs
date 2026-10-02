// Preserve the painted ground/water under transparent vehicle sprites.
const vehicles202=new Set(['rowboat','canoe','sailboat','fishingboat','minecart','wheelbarrow'].map(k=>'material172-'+k));
export const transparentProp202=p=>vehicles202.has(p.art||p.key);
