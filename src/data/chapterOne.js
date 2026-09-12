import {redesignEnvironments} from './environmentLayouts.js';
import {extendEndgameChapter} from './endgameChapter.js';
import {extendFrontierChapter} from './frontierChapter.js';
import {extendVoyageChapter} from './voyageChapter.js';
import {extendPowerChapter} from './powerChapter.js';
import {extendMarineChapter} from './marineChapter.js';
import {furnishInteriors,encloseTowns} from './roomLayouts.js';
import {populatePeople} from './chapterPeople.js';
// Hand-authored first chapter. One cell is one 32px movement tile.
function map(name,w,h,kind='out') { const g=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?'X':kind==='in'?'f':','));return {name,kind,tileWorld:true,chapter:1,g,warps:[],npcs:[],signs:[],items:[],props:[],spawn:{x:Math.floor(w/2),y:h-3}}; }
function rect(m,x,y,w,h,ch){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(m.g[j]?.[i]!=null)m.g[j][i]=ch;}
function path(m,ax,ay,bx,by,width=2){rect(m,Math.min(ax,bx),ay,Math.abs(bx-ax)+width,width,'.');rect(m,bx,Math.min(ay,by),width,Math.abs(by-ay)+width,'.');}
function prop(m,art,x,y,w,h,ch='T'){rect(m,x,y,w,h,ch);m.props.push({art,x,y,w,h});}
function tree(m,x,y,art='tree'){if(m.npcs.some(n=>n.x>=x&&n.x<x+2&&n.y>=y&&n.y<y+3))return;if(m.g.slice(y,y+3).length===3&&m.g.slice(y,y+3).every(r=>r.slice(x,x+2).length===2&&r.slice(x,x+2).every(c=>c===',')))prop(m,art,x,y,2,3);}
function trees(m){for(let y=1;y<m.g.length-3;y+=4)for(let x=1;x<m.g[0].length-2;x+=3)if((x*7+y*11)%5!==0)tree(m,x,y,(x+y)%2?'fir':'tree');}
function npc(m,x,y,name,look,talk,extra={}){m.npcs.push({x,y,name,look,dir:'down',noRoam:false,talk,...extra});}
function sign(m,x,y,text){const ground=m.g[y][x];rect(m,x,y,1,1,'S');m.signs.push({x,y,ground,text:Array.isArray(text)?text:[text]});}
function building(m,x,y,art,to,label){prop(m,art,x,y,5,5,'#');const dx=x+2,dy=y+4;m.g[dy][dx]='D';m.props.at(-1).door={x:dx,y:dy};m.props.at(-1).label=label;m.warps.push({x:dx,y:dy,to,tx:7,ty:10,back:{map:m.id,x:dx,y:dy+1}});if(dy<16)path(m,dx,dy+1,dx,16,1);else{path(m,16,16,16,dy+1,2);path(m,16,dy+1,dx,dy+1,1);}}
function link(a,ax,ay,b,bx,by,req){
 a.g[ay][ax]='.';b.g[by][bx]='.';
 const opening=(m,x,y)=>{const horizontal=y===0||y===m.g.length-1,dx=horizontal?1:0,dy=horizontal?0:1;let sx=x,sy=y;
  while(m.g[sy-dy]?.[sx-dx]==='.') {sx-=dx;sy-=dy;}
  const lanes=[];while(m.g[sy]?.[sx]==='.') {lanes.push({x:sx,y:sy});sx+=dx;sy+=dy;}
  return lanes;
 };
 const aa=opening(a,ax,ay),bb=opening(b,bx,by);
 const connect=(from,lanes,to,targets,requires)=>lanes.forEach((p,i)=>{const q=targets[Math.min(i,targets.length-1)];from.warps.push({x:p.x,y:p.y,to:to.id,tx:q.x+(q.x===0?1:q.x===to.g[0].length-1?-1:0),ty:q.y+(q.y===0?1:q.y===to.g.length-1?-1:0),edge:1,requires});});
 connect(a,aa,b,bb,req);connect(b,bb,a,aa);
}
function trainer(m,x,y,name,look,dir,party,talk){npc(m,x,y,name,look,[talk],{dir,trainer:{party,money:120+party[0][1]*35},win:['いい しょうぶだったね！'],after:['弱ったら ガオンびょういんへ。','くすりと ラグネットは ショップで買えるよ。']});}
export function buildChapterOne(){
 const M={};const add=(id,name,w,h,kind)=>{const m=map(name,w,h,kind);m.id=id;M[id]=m;return m};
 const v=add('village','ネイチャータウン',34,29);
 const r=add('rods','ロッズタウン',34,29);
 for(const m of [v,r]){rect(m,2,5,30,18,',');path(m,16,0,16,28,2);path(m,3,16,29,16,2);m.spawn={x:16,y:19};building(m,3,6,'chaletClinic','hospital','ガオンびょういん');building(m,25,6,'harborShop','shop','ショップ');sign(m,4,12,['ガオンびょういん','ガオンの HP・状態・技の回数を回復。']);sign(m,26,12,['ショップ','ガオンのくすりと ラグネット。']);}
 building(v,11,7,'chalet','hut','主人公の家');building(v,21,19,'chaletStone','lab','けんきゅうしせつ');
 // Reserve clear routes before placing trees or decorations.
 path(v,16,24,23,24,2);path(v,16,16,16,4,2);
 npc(v,19,15,'ラテットを見た女の子','girl',[],{script:'v5:witness'});
 npc(v,12,19,'村のひと','oldman',['ここは ネイチャータウン。','山おくへの道は 北にあるよ。']);
 sign(v,18,3,['北：山おく','南：1ばんどうろ・ロッズタウン']);
 sign(v,22,25,['スイスはかせの けんきゅうしせつ']);
 npc(r,19,16,'ヤノケン','boy',[],{script:'v5:dex'});
 building(r,11,6,'chalet','rodsHome','村の家');
 npc(r,12,21,'旅のひと','hiker',['南の 2ばんどうろには','6人の トレーナーがいるよ。','先へ進む前に ガオンを仲間にしよう。']);
 sign(r,18,25,['南：2ばんどうろ','その先：ネイチャーのもり']);
 for(const m of [v,r]){rect(m,3,21,5,3,'F');for(let x=3;x<8;x++)m.g[24][x]='=';trees(m);}
 // Only west/east borders change. Keep the north/south rows and exits intact.
 for(const old of v.props.filter(p=>p.art==='tree'||p.art==='fir'))if(old.x<2||old.x+old.w>32){for(let y=old.y;y<old.y+old.h;y++)for(let x=old.x;x<old.x+old.w;x++)if(v.g[y][x]==='T')v.g[y][x]=',';}
 v.props=v.props.filter(p=>!((p.art==='tree'||p.art==='fir')&&(p.x<2||p.x+p.w>32)));
 for(let y=1;y<=25;y+=3){prop(v,'tree',0,y,2,3);prop(v,'tree',32,y,2,3);}
 const home=add('hut','主人公の家',16,14,'in');home.spawn={x:7,y:10};rect(home,2,2,3,1,'b');rect(home,11,3,2,2,'B');rect(home,4,5,2,2,'t');npc(home,9,6,'お母さん','girl',[],{script:'v5:mother'});
 const lab=add('lab','スイスはかせの研究施設',16,14,'in');rect(lab,2,2,5,1,'b');rect(lab,10,2,3,1,'P');rect(lab,3,5,3,2,'t');npc(lab,8,5,'スイスはかせ','prof',[],{script:'v5:professor'});npc(lab,12,8,'研究員','girl',['弱ったガオンほど つかまえやすいよ。','マスターラグなら 確実につかまるんだ。']);
 const hospital=add('hospital','ガオンびょういん',16,14,'in');rect(hospital,2,2,3,2,'K');rect(hospital,10,2,3,2,'B');npc(hospital,7,5,'看護師','nurse',['ガオンびょういんへ ようこそ！'],{healAll:true,noRoam:true});
 const shop=add('shop','ショップ',16,14,'in');rect(shop,2,2,4,2,'b');rect(shop,10,2,4,2,'b');npc(shop,7,5,'店員','clerk',['いらっしゃいませ！','くすりと ラグネットは こちらです。'],{shop:true,noRoam:true});
 const rh=add('rodsHome','ロッズタウンの家',16,14,'in');rect(rh,3,4,3,2,'t');npc(rh,10,5,'村のひと','oldman',['草むらで会える ガオンは','道路ごとに ちがうんだ。']);
 for(const m of [home,lab,hospital,shop,rh]){m.g[12][7]='x';m.warps.push(m.id==='hut'?{x:7,y:12,to:'village',tx:13,ty:12}:{x:7,y:12,to:'@back'});m.spawn={x:7,y:10};}
 const mountain=add('mountain','山おく',30,58);mountain.spawn={x:14,y:55};
 // A one-tile, grass-free trail winds from the southern entrance to Ratetto.
 const mountainTrail=[[14,57],[14,48],[6,40],[22,31],[8,22],[20,13],[14,7],[14,4]];
 for(let i=1;i<mountainTrail.length;i++)path(mountain,...mountainTrail[i-1],...mountainTrail[i],1);
 rect(mountain,11,3,8,5,'.');
 for(const [x,y] of [[11,22],[18,25],[23,8],[5,7],[24,47],[4,35],[25,38]])if(mountain.g[y][x]===',')mountain.g[y][x]='R';
 npc(mountain,14,4,'ラテット','boy',[],{script:'v5:latett',artMon:'ラテット',hideFlag:'v5:latettSeen'});
 mountain.enc={rate:15,list:[['スナコロネ',3,5,59],['ツチノコ',3,5,40],['コケゴロ',8,10,1]]};mountain.battleTerrain='grass';trees(mountain);
 const one=add('route1','1ばんどうろ',26,60);one.spawn={x:12,y:2};
 const firstRoad=[[12,0],[12,12],[5,20],[18,34],[8,46],[12,59]];
 for(let i=1;i<firstRoad.length;i++)path(one,...firstRoad[i-1],...firstRoad[i],2);
 one.enc={rate:17,list:[['ネズミン',2,3,55],['トリッピ',2,4,45]]};
 sign(one,10,4,['1ばんどうろ','北：ネイチャー　南：ロッズ']);npc(one,15,26,'旅の女の子','girl',['ガオンを持っていなくても','ラグネットを投げて つかまえられるよ。']);trees(one);
 const two=add('route2','2ばんどうろ',30,42);path(two,14,0,14,41);path(two,5,10,24,10);path(two,5,23,24,23);path(two,5,34,24,34);
 rect(two,3,4,7,5,'"');rect(two,20,13,7,6,'"');rect(two,3,27,7,6,'"');rect(two,19,36,8,4,'"');
 // The first trainer sees the main path near the entrance. No trainers exist earlier.
 const trainers=[[11,5,'トレーナーの アキ','boy','right',[['ネズミン',3]],'はじめての トレーナーしょうぶだね！'],[18,11,'トレーナーの メイ','girl','left',[['トリッピ',4]],'ガオンと 一緒に がんばろう！'],[11,18,'むしとりの ソウ','boy','right',[['ムシコロ',4],['ムシコロ',4]],'ぼくの ガオンを 見て！'],[18,25,'トレーナーの リナ','girl','left',[['タネコロ',5]],'くすりの 準備は できてる？'],[11,32,'やまあるきの ダン','hiker','right',[['スナコロネ',5]],'森へ行く前に しょうぶだ！'],[18,38,'トレーナーの ユウ','boy','left',[['ピリット',5],['ネズミン',5]],'6人目は ぼくだよ！']];
 for(const [x,y,name,look,dir,party,talk] of trainers){rect(two,Math.min(x,14),y,Math.abs(x-14)+2,1,'.');trainer(two,x,y,name,look,dir,party,talk);}
 two.enc={rate:18,list:[['ムシコロ',3,5,50],['タネコロ',3,5,45],['ピリット',4,5,5]]};sign(two,16,2,['2ばんどうろ','トレーナーは 全部で6人。']);trees(two);
 const forest=add('natureforest','ネイチャーのもり',34,38);forest.spawn={x:16,y:2};path(forest,16,0,16,8);path(forest,16,8,7,19);path(forest,7,19,24,29);path(forest,24,29,16,34);rect(forest,13,31,8,5,',');
 rect(forest,3,5,7,7,'"');rect(forest,23,5,8,9,'"');rect(forest,3,25,7,7,'"');rect(forest,19,18,7,7,'"');
 // Riverbank is explicitly impassable; the one crossing is a bridge.
 rect(forest,9,14,22,4,'R');rect(forest,10,15,20,2,'W');rect(forest,16,14,2,4,'d');path(forest,7,12,16,13);path(forest,7,18,16,19);
 for(const [x,y,dir,name,party] of [[12,8,'right','森のトレーナー ミオ',[['キノコン',6]]],[4,20,'right','森のトレーナー ケイ',[['ハナビィ',6],['ムシコロ',5]]],[27,29,'left','森のトレーナー ナオ',[['キノコン',7]]]]){rect(forest,x,y,1,1,'.');trainer(forest,x,y,name,'hiker',dir,party,'森の ガオンと しょうぶしよう！');}
 forest.enc={rate:20,list:[['キノコン',5,7,45],['ハナビィ',5,7,53],['リボネム',7,8,2]]};forest.rareSpecies='リボネム';
 sign(forest,18,34,['南：森の聖域','森の3人に勝つと 奥へ進める。']);path(forest,16,29,16,37,1);trees(forest);
 link(v,16,0,mountain,14,57,'v5:heardLatett');link(v,16,28,one,12,0,'v5:netGift');link(one,12,59,r,16,0);link(r,16,28,two,14,0,'v5:dex');link(two,14,41,forest,16,0);
 // Optional rare habitats beyond the first forest. All borders remain solid except exits.
 const sanctuary=add('mossSanctuary','森の聖域',28,28);sanctuary.spawn={x:14,y:2};
 path(sanctuary,14,0,14,25);path(sanctuary,14,14,27,14,1);rect(sanctuary,3,4,7,7,'"');rect(sanctuary,18,18,7,7,'"');
 sanctuary.enc={rate:18,list:[['キノコン',10,14,45],['ハナビィ',11,15,35],['コケトロッコ',14,18,20]]};trees(sanctuary);
 sign(sanctuary,12,3,['奥には とても強い ガオンがいる。','十分に育ててから 探索しよう。']);
 const makeCave=(id,name,theme,list)=>{const m=add(id,name,28,28,'cave');m.theme=theme;m.spawn={x:14,y:25};rect(m,1,1,26,26,'C');
  for(const [x,y]of [[5,5],[20,5],[7,16],[20,20],[11,10],[17,8],[16,18]])rect(m,x,y,2,3,'R');
  m.enc={rate:16,encAll:true,list};return m;};
 const ruins=makeCave('forgottenRuins','忘れられた遺跡','ruins',[['ヨルネコ',16,21,50],['カゲポン',18,23,35],['カセキン',18,22,15]]);
 const volcano=makeCave('volcanicDepths','火山の奥','volcano',[['スミビン',25,30,55],['ヒノコマ',23,28,45]]);
 rect(volcano,4,10,7,3,'W');rect(volcano,18,15,6,3,'W');
 const abyss=makeCave('shadowDepths','深闇の洞窟','shadow',[['シャドネコ',30,36,45],['カゲポン',28,34,35],['カセキン',28,33,20]]);
 link(forest,16,37,sanctuary,14,0,'v11:forestCleared');path(forest,16,34,16,37,1);
 link(sanctuary,27,14,ruins,0,14);link(ruins,14,0,volcano,14,27);link(ruins,27,14,abyss,0,14);
 sign(ruins,4,14,['北：火山の奥　東：深闇の洞窟','奥ほど 強いガオンが 生息する。']);
 extendMarineChapter(M,{add,rect,path,prop,tree,trees,npc,sign,link});
 extendPowerChapter(M,{add,rect,path,prop,tree,trees,npc,sign,link});
 extendVoyageChapter(M,{add,rect,path,prop,tree,trees,npc,sign,link});
 extendFrontierChapter(M,{add,rect,path,prop,tree,trees,npc,sign,link});
 extendEndgameChapter(M,{add,rect,path,prop,tree,trees,npc,sign,link});
 furnishInteriors(M);
 encloseTowns(M);
 // Route 1 retains every road, tree, sign and exit; open meadow becomes encounter grass.
 for(const row of M.route1.g)for(let x=0;x<row.length;x++)if(row[x]===',')row[x]='"';
 // Larger mossy crags occupy selected forest pockets, away from the existing trail.
 for(const [x,y,w,h]of [[2,4,3,4],[24,3,3,5],[24,24,3,4],[3,28,3,3]]){
  const m=M.mountain;let clear=true;
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(![',','T','R'].includes(m.g[j]?.[i]))clear=false;
  if(!clear)continue;
  m.props=m.props.filter(p=>{const overlap=p.x<x+w&&p.x+p.w>x&&p.y<y+h&&p.y+p.h>y;if(!overlap)return true;for(let j=p.y;j<p.y+p.h;j++)for(let i=p.x;i<p.x+p.w;i++)if(m.g[j]?.[i]==='T')m.g[j][i]=',';return false;});
  prop(m,'mountainCrag',x,y,w,h,'R');
 }
 // Dense stands leave the authored trail and encounter clearings open.
 for(let y=4;y<M.mountain.g.length-5;y+=3)for(let x=3;x<26;x+=3)tree(M.mountain,x,y,(x+y)%2?'fir':'tree');
 // Preserve the narrow trail and clearing; surrounding meadow becomes tall grass.
 for(let y=0;y<M.mountain.g.length;y++)for(let x=0;x<M.mountain.g[y].length;x++){
  const clearing=x>=11&&x<=18&&y>=3&&y<=7;
  const exit=M.mountain.warps.some(w=>w.x===x&&w.y===y);
  if(!clearing&&!exit&&M.mountain.g[y][x]===',')M.mountain.g[y][x]='"';
 }
 M.mountain.props.sort((a,b)=>(a.y+a.h)-(b.y+b.h));
 populatePeople(M);
 redesignEnvironments(M);
 for(const m of Object.values(M)){m.rows=m.g.map(r=>r.join(''));delete m.g;}
 return M;
}
