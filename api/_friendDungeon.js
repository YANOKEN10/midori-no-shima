const B=require('./_friendBattle');
// Shared fixed dungeon geometry: walkable corridors, two encounters and a boss.
const FLOORS=[
 ['###############','#..#..........#','#..#..###.....#','#.....#.......#','###...#..###..#','#.....#....#..#','#..####....#..#','#..........#..#','#..####.......#','#.............#','###############'],
 ['###############','#.............#','#..#####..##..#','#..#.......#..#','#..#..###..#..#','#.....#.......#','#####.#..###..#','#.....#.......#','#..#####..##..#','#.............#','###############'],
 ['###############','#.............#','#...##...##...#','#...##...##...#','#.............#','#.............#','#..###...###..#','#.............#','#.............#','#.............#','###############']
];
const ENEMIES=[['コケゴロ',30],['シャドネコ',40],['ギガビート',50]];
function start(players){return {floor:0,positions:Object.fromEntries(players.map((p,i)=>[p.id,{x:1+i,y:9}])),cleared:[],battle:null,complete:false,steps:0};}
function walk(d,actor,dx,dy){if(d.complete||d.battle&&!d.battle.finished)throw Error('今は移動できません');if(![[1,0],[-1,0],[0,1],[0,-1]].some(v=>v[0]===dx&&v[1]===dy))throw Error('1マスずつ移動してください');const pos=d.positions[actor];if(!pos)throw Error('参加していません');const x=pos.x+dx,y=pos.y+dy;if(FLOORS[d.floor][y]?.[x]!=='#'&&FLOORS[d.floor][y]?.[x]){d.positions[actor]={x,y};d.steps++;}}
function interact(d,players,actor){const p=d.positions[actor];if(!p)throw Error('参加していません');if(d.complete)return;if(d.battle&&!d.battle.finished)throw Error('バトル中です');if(Math.abs(p.x-12)+Math.abs(p.y-2)>1)throw Error('守りのガオンに近づいてください');if(!Object.values(d.positions).every(q=>Math.abs(q.x-12)+Math.abs(q.y-2)<=4))throw Error('友だちも近くに来ると進めます');if(!d.cleared.includes(d.floor)){const [sp,lv]=ENEMIES[d.floor],boss=B.combatMon({sp,lv,iv:{},ev:{},moves:[{name:'タックル'},{name:'マックスアタック'}]},lv);boss.maxHp*=3;boss.hp=boss.maxHp;d.battle=B.begin([...players.map(p=>({id:p.id,name:p.name,group:0,team:p.team.map(m=>B.combatMon(m,50))})),{id:'dungeon-boss',name:'守りのガオン',group:1,ai:true,team:[boss]}],true);return;}if(d.floor===2){d.complete=true;return;}d.floor++;d.battle=null;players.forEach((p,i)=>d.positions[p.id]={x:1+i,y:9});}
function act(d,actor,action,turn,rng){if(!d.battle)throw Error('バトルが始まっていません');B.submit(d.battle,actor,action,turn,rng);if(d.battle.finished&&d.battle.winner===0&&!d.cleared.includes(d.floor))d.cleared.push(d.floor);return d;}
function view(d,actor){return {...d,map:FLOORS[d.floor],battle:d.battle?B.view(d.battle,actor):null,goal:{x:12,y:2},reward:'レベルの実 ×1'};}
module.exports={FLOORS,start,walk,interact,act,view};
