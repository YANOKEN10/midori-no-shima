export function upgradeFashion147(base,d){
 if(!base.fashionTown||d.fashion147)return d;
 const furniture=base.room?.furniture||[];
 const objects=d.objects.map(o=>{const f=o.id.startsWith('f:')?furniture[Number(o.id.slice(2))]:null;if(!f||o.x!==f[1]||o.y!==f[2]||o.turn81||o.stored79)return o;
 if(/shop-table|shop-chair/.test(f[0]))return {...o,stored79:true};
 if(f[0]==='shop-shelf106'&&o.x===6)return {...o,x:5};return o;});
 return {...d,fashion147:true,objects,rug:['7,10,1,1','7,9,1,1'].includes(d.rug?.join(','))?[6,9,3,1]:d.rug};
}
