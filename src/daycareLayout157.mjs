export function upgradeDaycare157(base,d){
 if(base.id!=='daycare'||d.daycare157)return d;
 const objects=d.objects.map(o=>/^p:[012]$/.test(o.id)?{...o,stored79:true}:o);
 const add=(type,template,x,y)=>objects.push({id:'a:daycare157-'+objects.length,type,template,x,y});
 for(const [k,x,y]of [['lab-bookshelf86',3,2],['lab-bookshelf86',9,2],['wall-clock86',7,1],['wall-frame86',17,1],['counter84',4,6],['counter84',7,6],['register84',4,6],['vase-flowers128',9,6],['sofa-h84',3,10],['table-round-oak128',4,13],['plant-monstera128',2,14],['plant-monstera128',19,14],['plant-fern128',11,2]])add('furniture',k,x,y);
 for(let y=3;y<=12;y++)if(y!==10&&y!==11)add('prop','white-fence-v106',13,y);
 const tiles=new Map(d.tiles.map(t=>[t.x+','+t.y,t]));for(let y=1;y<17;y++)for(let x=1;x<21;x++)tiles.set(x+','+y,{x,y,material:'wood'});
 for(let y=3;y<=13;y++)for(let x=14;x<=20;x++)tiles.set(x+','+y,{x,y,material:'tile',color115:'#a8cf80'});
 for(let y=15;y<=16;y++)for(let x=9;x<=11;x++)tiles.set(x+','+y,{x,y,material:'tile',color115:'#c78b70'});
 return {...d,daycare157:true,objects,tiles:[...tiles.values()],actors:d.actors.map(a=>a.id==='n:0'?{...a,x:7,y:5,dir:'down',mode:'still'}:a)};
}
