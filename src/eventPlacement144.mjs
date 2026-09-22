// The event starts inside the doorway; the editable placement uses its normal standing spot.
export function upgradeEventPlacement144(base,doc){
 if(doc.eventPlacement144||base.id!=='karat')return doc;
 return {...doc,eventPlacement144:true,actors:doc.actors.map(a=>{
  const n=a.id.startsWith('n:')?base.npcs[Number(a.id.slice(2))]:null;
  return n?.script==='voyage:professor'&&!a.stored79&&a.x===31&&a.y===14?{...a,y:16}:a;
 })};
}
