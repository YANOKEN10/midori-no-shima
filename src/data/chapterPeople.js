// Thirty distinct appearances, without changing trainer counts or story scripts.
export function populatePeople(maps){
 const assigned={village:[1,3],rods:[0,6],hut:[7],lab:[2,22],hospital:[4],shop:[5],rodsHome:[23],route1:[27],route2:[20,29,9,25,13,28],natureforest:[8,14,26]};
 for(const [id,variants]of Object.entries(assigned))maps[id].npcs.forEach((n,i)=>{n.variant=variants[i];});
 const visitors=[
 [10,'花屋さん',['道ばたの 花を見るのが 好きなの。']],
 [11,'釣り人',['みずのガオンは いろんな姿をしているよ。']],
 [12,'船乗り',['いつか 海の向こうまで 旅をしてみたいな。']],
 [15,'雪山の登山家',['山へ行くときは しっかり準備をしよう。']],
 [16,'料理人',['おいしい料理は みんなを元気にするよ。']],
 [17,'配達員',['手紙を 届けながら 村を回っているんだ。']],
 [18,'画家',['ガオンの姿を スケッチしているの。']],
 [19,'音楽家',['ガオンと歩くと リズムが浮かぶんだ。']],
 [21,'格闘家',['ガオンと一緒に 毎日きたえているよ。']],
 [24,'仕事帰りの人',['ガオンびょういんは 旅の頼もしい味方だね。']]
 ];
 visitors.forEach(([variant,name,talk],i)=>{const m=maps[i<5?'village':'rods'],candidates=[];
  for(let y=4;y<m.g.length-4;y++)for(let x=4;x<m.g[0].length-4;x++){
   if(m.g[y][x]!==','||[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>[',','.'].includes(m.g[y+dy]?.[x+dx])).length<3)continue;
   if([...m.npcs,...m.signs,...m.warps].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<4))continue;
   candidates.push({x,y,score:Math.abs(x-16)+Math.abs(y-16)});
  }
  candidates.sort((a,b)=>a.score-b.score||a.y-b.y||a.x-b.x);const p=candidates[0];if(!p)throw Error('No resident location');m.npcs.push({x:p.x,y:p.y,name,talk,variant,look:'boy',dir:'down',noRoam:false});
 });
}
