// One-time cleanup also applies to saved workshop layouts without changing their base fingerprint.
export function upgradeForest148(base,d,getCatalog,source,floors){
 if(!['natureforest','mossSanctuary'].includes(base.id)||d.forest148)return d;
 const cat=getCatalog(),tiles=d.tiles.filter(t=>floors.find(f=>f[0]===t.material)?.[2]!=='"');
 const objects=d.objects.map(o=>{const p=source(base,o,cat);if(!p)return o;
 if(p.group==='grass'||p.tile==='"')return {...o,stored79:true};
 if(base.id==='mossSanctuary'&&/tree|fir|conifer|broadleaf|palm/i.test(p.art||o.template))return {...o,conifer148:true};
 return o;});
 return {...d,forest148:true,objects,tiles};
}
// Keep each tree's footprint and position, including edited border trees and two-cell exits.
export function coniferSource148(o,p){return p&&o.conifer148?{...p,art:'mountain-conifer131',forest131:{dx:0,dy:0,w:64,h:96},tile:'T',walkable:false}:p;}
