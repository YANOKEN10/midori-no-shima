import {moveRugs130} from './rugPlacement130.mjs';
import {addInteriors123} from './interiors123.mjs';
import {addRivalResidents122} from './rivalRules122.mjs';
import {addTutorialPeople100} from './tutorial100.mjs';
import {addDeenaGuide94} from './deenaResident123.mjs';
// These residents are part of the shared editable map, never added after edits.
export function addManagedPeople120(maps){
 for(const id of ['route1','route2','leafTown']){const old=maps[id];if(!old||old.npcs.some(n=>n.managed120))continue;const m=maps[id]={...old,npcs:old.npcs.map(n=>({...n}))};const count=m.npcs.length;
 const trainer=id==='route1'?[30,'山歩きの ダイチ','コケゴロ']:id==='route2'?[32,'こどもの ソラ','アワミィ']:null;
 if(trainer){let spot;for(let y=4;y<m.rows.length-4&&!spot;y++)for(let x=4;x<m.rows[0].length-4;x++)if(['.',','].includes(m.rows[y][x])&&['.',','].includes(m.rows[y+1][x])&&![...m.npcs,...m.warps,...m.signs,...m.items||[]].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3)&&!m.props.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y-1&&y<p.y+p.h+1)){spot={x,y};break;}if(spot){const[variant,name,sp]=trainer;m.npcs.push({...spot,name,variant,dir:'down',noRoam:true,trainer:{party:[[sp,5]],money:350},talk:['ガオンといっしょに 勝負しよう！'],after:['また しょうぶしようね！']});}}
 if(id==='route1')addTutorialPeople100({route1:m});if(id==='leafTown')addDeenaGuide94({leafTown:m});for(const n of m.npcs.slice(count))n.managed120=true;
 }return moveRugs130(addInteriors123(addRivalResidents122(maps)));
}
export function upgradeManagedPeople120(base,doc){const extras=base.npcs.map((n,i)=>({n,i})).filter(({n})=>n.managed120);if(!extras.length||extras.every(({i})=>doc.actors.some(a=>a.id==='n:'+i)))return doc;const actors=[...doc.actors];for(const{n,i}of extras)if(!actors.some(a=>a.id==='n:'+i))actors.splice(i,0,{id:'n:'+i,x:n.x,y:n.y,dir:n.dir||'down',mode:'still',owner:null});return {...doc,actors};}
