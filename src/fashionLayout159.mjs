import {freshName138} from './peopleNames138.mjs';
const towns=['village','rods','marine','karat','resure','manikereo','galaxy','clearTown','belerio','leafTown'];
const customerNames159={},taken159=[];for(const town of towns)for(let i=0;i<2;i++){const key='fashion-'+town+':a:fashion159-customer'+i,name=freshName138(key,taken159);customerNames159[key]=name;taken159.push(name);}
export const fashionClerk159=base=>[10,18,19,24,25,17,8,20,21,22][Math.max(0,towns.indexOf(base.fashionTown))];
export function upgradeFashion159(base,d){
 if(!base.fashionTown||d.fashion159)return d;
 const objects=d.objects.map(o=>o.type==='furniture'?{...o,stored79:true}:o);
 for(const [k,x,y]of [['shop-glass106',1,3],['shop-glass106',1,6],['counter84',4,4],['counter84',7,4],['register84',4,4],['plant-monstera128',4,6],['shop-shelf-side106',11,4],['shop-shelf-side106',11,7],['shop-shelf-side106',13,4],['shop-shelf-side106',13,7]])objects.push({id:'a:fashion159-'+objects.length,type:'furniture',template:k,x,y});
 const actors=d.actors.map(a=>a.id==='n:0'?{...a,x:5,y:3,dir:'down',mode:'still'}:a);
 for(const [i,x,y,v]of [[0,3,9,18],[1,14,5,20]]){const id='a:fashion159-customer'+i;actors.push({id,type:'person',template:String(v),name:customerNames159[base.id+':'+id]||freshName138(base.id+':'+id,actors.map(a=>a.name).filter(Boolean)),x,y,dir:i?'left':'up',mode:'still',owner:null,talk:i?'どの色の服にしようかな。':'ガオンとのお出かけに合う服を探しているんだ。'});}
 return {...d,fashion159:true,objects,actors,rug:[6,9,3,1]};
}
