// Match appearances and population to each settlement, rather than showcasing every sprite.
export function populatePeople(maps){
 const assigned={village:[1,3],rods:[0,6],hut:[7],lab:[2,22],hospital:[4],shop:[5],rodsHome:[23],route1:[27],route2:[20,27,9,25,6,28],natureforest:[8,9,26]};
 for(const [id,variants]of Object.entries(assigned))maps[id].npcs.forEach((n,i)=>{n.variant=variants[i];});
 // Nature Town is a quiet rural village (five outdoors); Rods is a small travel stop (six).
 // Sailors, chefs and office workers remain available as art, but have no suitable venue here.
 const residents={
 village:[
  {variant:25,name:'庭しごとの人',anchor:[5,22],talk:['花だんの お世話をしているの。','この村は 緑がいっぱいで 気持ちがいいね。']},
  {variant:0,name:'村の少年',anchor:[11,9],talk:['家の近くで ガオンと遊んでいるんだ。']},
  {variant:23,name:'散歩中のおばあさん',anchor:[25,7],talk:['村を ゆっくり散歩しているの。','山へ行くなら 気をつけてね。']}
 ],
 rods:[
  {variant:7,name:'買い物帰りの人',anchor:[26,12],talk:['ショップで くすりを買ってきたの。','旅に出る前に 準備をしておこうね。']},
  {variant:1,name:'町の女の子',anchor:[11,7],talk:['ここが わたしの住んでいる町だよ。']},
  {variant:3,name:'花を育てるおじいさん',anchor:[5,22],talk:['毎朝 花に水をあげているんじゃ。']},
  {variant:27,name:'旅支度の女の子',anchor:[21,25],talk:['南の道路へ 出発するところなの。','仲間のガオンと たくさん歩くんだ。']}
 ]};
 for(const [id,people]of Object.entries(residents))for(const {anchor, ...person}of people){
  const m=maps[id],candidates=[];
  for(let y=4;y<m.g.length-4;y++)for(let x=4;x<m.g[0].length-4;x++){
   if(m.g[y][x]!==','||[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>[',','.'].includes(m.g[y+dy]?.[x+dx])).length<3)continue;
   if([...m.npcs,...m.signs,...m.warps].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<4))continue;
   candidates.push({x,y,score:Math.abs(x-anchor[0])+Math.abs(y-anchor[1])});
  }
  candidates.sort((a,b)=>a.score-b.score||a.y-b.y||a.x-b.x);const p=candidates[0];if(!p)throw Error('No resident location in '+id);
  m.npcs.push({...person,x:p.x,y:p.y,look:'boy',dir:'down',noRoam:false});
 }
}
