export const borderRock154=(m,x,y)=>m.rows[y]?.[x]==='R'&&(x===0||y===0||x===m.rows[0].length-1||y===m.rows.length-1);
export function upgradeBorderRocks154(base,d,ground){
 if(!d.borderRocks154){const added=ground(base).filter(o=>borderRock154(base,o.x,o.y)&&!d.objects.some(p=>p.id===o.id)&&!base.warps.some(w=>w.x===o.x&&w.y===o.y)&&!(base.id==='resure'&&o.y===0&&[9,10].includes(o.x)));d={...d,borderRocks154:true,objects:[...d.objects,...added]};}
 if(base.id!=='resure'||d.parkGate154)return d;
 const gate=d.objects.find(o=>o.id==='p:0'&&o.template==='parkGate');
 if(!gate||gate.stored79||gate.turn81||gate.x!==28||gate.y!==2)return {...d,parkGate154:true};
 return {...d,parkGate154:true,objects:d.objects.map(o=>o===gate?{...o,y:0}:o.y===0&&o.x>=28&&o.x<=31&&(/resure-border153/.test(o.id)||o.id.startsWith('g:'))?{...o,stored79:true}:o)};
}
