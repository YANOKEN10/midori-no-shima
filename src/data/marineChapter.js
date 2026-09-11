// Chapter two: authored routes, lake circuit and future emblem gate.
export function extendMarineChapter(M,h){
 const {add,rect,path,prop,tree,npc,sign,link}=h;
 const make=(id,name,w,ht,biome)=>{const m=add(id,name,w,ht);m.chapter=2;m.biome=biome;return m;};
 const coast=make('route3','３番道路',40,28,'coast');
 const town=make('marine','マリンタウン',40,36,'coast');
 const four=make('route4','４番道路',30,32,'lake');
 const lake=make('remoteLake','はなれの湖',40,40,'lake');
 const five=make('route5','５番道路',32,24,'coast');
 const karat=make('karat','カラットタウン',32,28,'coast');
 const grove=make('kageri','カゲリの林',30,36,'ancient');
 const altar=make('mountainAltar','ヤマノヌシのさいだん',34,36,'ancient');
 const grass=(m,x,y,w,ht)=>rect(m,x,y,w,ht,'"');
 const resident=(m,x,y,name,variant,talk,extra={})=>npc(m,x,y,name,'boy',talk,{variant,...extra});
 // A forest exit joins the existing southern clearing without closing the sanctuary branch.
 const f=M.natureforest;
 f.props=f.props.filter(p=>{if(p.x+p.w<=16||p.y>35||p.y+p.h<=34)return true;for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)if(f.g[y]?.[x]==='T')f.g[y][x]=',';return false;});
 path(f,16,34,33,34);link(f,33,34,coast,0,14);
 f.signs.find(s=>s.x===18&&s.y===34).text=['東：３番道路・マリンタウン','南：森の聖域'];f.g[34][18]='S';
 rect(coast,0,21,40,7,'W');path(coast,0,14,15,14);path(coast,15,14,26,17);path(coast,26,17,39,14);
 rect(coast,19,20,2,5,'d');grass(coast,3,4,9,6);grass(coast,26,4,10,6);
 coast.spawn={x:2,y:14};coast.enc={rate:18,list:[['サカナビ',7,9,65],['クラゲミ',7,9,35]]};coast.battleTerrain='river';
 resident(coast,20,19,'港の船乗り',12,['潮風の道を 東へ進むと マリンタウンだ。','草むらには 海のガオンもいるぞ。']);
 sign(coast,13,12,['３番道路 ― 海沿いの港道','西：ネイチャーの森　東：マリンタウン']);
 link(coast,39,14,town,0,18);
 rect(town,0,28,40,8,'W');path(town,0,18,39,18);path(town,20,0,20,27);
 rect(town,19,27,3,6,'d');town.spawn={x:2,y:18};
 const house=(m,x,y,art,to,label)=>{prop(m,art,x,y,5,5,'#');const dx=x+2,dy=y+4;m.g[dy][dx]='D';m.props.at(-1).door={x:dx,y:dy};m.warps.push({x:dx,y:dy,to,tx:7,ty:10,back:{map:m.id,x:dx,y:dy+1}});if(y<18)path(m,dx,dy+1,dx,18,1);else{path(m,x-1,18,x-1,dy+1,1);path(m,x-1,dy+1,dx,dy+1,1);}sign(m,x,dy+2,[label]);};
 house(town,4,10,'marineHouse','hospital','ガオンびょういん');house(town,28,10,'marineShop','shop','ショップ');
 const hall=add('marineHall','マリンタウンの集会所',16,14,'in');hall.chapter=2;hall.spawn={x:7,y:10};hall.g[12][7]='x';hall.warps.push({x:7,y:12,to:'@back'});
 resident(hall,7,5,'試験の案内係',5,[],{script:'marine:guide',noRoam:true});
 house(town,16,10,'marineHall','marineHall','エンブレム・テスト案内所');
 house(town,5,21,'marineHouse','rodsHome','港の家');house(town,28,21,'marineHouse','rodsHome','海辺の家');
 resident(town,17,20,'村長 エビゲル',3,[],{script:'marine:guide',noRoam:true});
 resident(town,21,26,'船乗り',12,['町の桟橋は 船乗りたちの 集まる場所さ。']);
 resident(town,7,20,'港町の女の子',1,['エンブレムは ７つあるんだって。','ガオンのトレーナーとして 認められた証だよ。']);
 resident(town,29,20,'釣り人',11,['北の４番道路を 抜けると はなれの湖。','中央の島までは 木の桟橋で渡れるよ。']);
 resident(town,37,17,'工事の人',13,[],{script:'marine:works',hideFlag:'marine:passed',noRoam:true});
 sign(town,22,3,['北：４番道路・はなれの湖']);sign(town,34,20,['東：５番道路・カラットタウン']);
 path(four,14,0,14,31);path(four,14,16,7,20);rect(four,22,4,7,21,'W');grass(four,3,4,8,7);grass(four,3,22,8,6);grass(four,17,9,4,7);
 four.spawn={x:14,y:29};four.enc={rate:19,list:[['シズクン',8,10,70],['ミナモン',9,11,30]]};four.battleTerrain='river';
 resident(four,12,18,'湖を見守る人',8,['湖の四隅には カニポンがいる。','試験を始めるには 島の宝箱を 開けるんだ。']);
 link(town,20,0,four,14,31);link(four,14,0,lake,20,39);
 // Broad forest shore, a central island, and a single west-side wooden pier.
 for(let y=8;y<=31;y++)for(let x=8;x<=31;x++)if(((x-19.5)/12)**2+((y-19.5)/12)**2<1)lake.g[y][x]='W';
 for(let y=15;y<=24;y++)for(let x=15;x<=24;x++)if(((x-19.5)/4.8)**2+((y-19.5)/4.8)**2<1)lake.g[y][x]=',';
 rect(lake,7,20,10,2,'d');
 path(lake,20,32,20,39);path(lake,5,32,20,32);path(lake,5,20,5,32);path(lake,20,0,20,7);
 grass(lake,3,3,6,6);grass(lake,31,3,6,6);grass(lake,3,31,6,6);grass(lake,31,31,6,6);grass(lake,3,16,5,4);
 lake.spawn={x:20,y:37};lake.enc={rate:18,list:[['カニポン',8,10,80],['ミナモリス',10,12,20]]};lake.battleTerrain='river';
 prop(lake,'ancientTree',17,16,2,3);
 for(const [x,y]of [[3,10],[33,10],[3,24],[33,24],[11,3],[26,3],[11,33],[26,33]])tree(lake,x,y);
 resident(lake,21,20,'試験の宝箱',0,[],{script:'marine:chest',propArt:'marineChest',noRoam:true});
 resident(lake,19,22,'村長 エビゲル',3,[],{script:'marine:elder',noRoam:true});
 [[5,5],[34,5],[5,34],[34,34]].forEach(([x,y],i)=>resident(lake,x,y,'カニポン',0,[],{script:'marine:crab',crab:i,artMon:'カニポン',artSize:32,roamMon:true,hideFlag:'marine:crab:'+i}));
 sign(lake,18,35,['はなれの湖','中央の島へは 西岸の桟橋から。']);
 sign(lake,22,5,['霧の先：カゲリの林・ヤマノヌシのさいだん','エンブレム４個で 霧が晴れる。']);
 link(lake,20,0,grove,14,35,'marine:fourEmblems');
 path(grove,14,35,14,28);path(grove,14,28,6,21);path(grove,6,21,22,12);path(grove,22,12,14,0);
 // A rocky rise crosses the mountain trail; stairs occupy the two walking lanes.
 rect(grove,3,18,24,1,'R');rect(grove,22,18,2,1,'H');
 grass(grove,3,5,7,8);grass(grove,20,24,6,6);grove.spawn={x:14,y:33};grove.enc={rate:17,list:[['キノコン',20,24,55],['ハナビィ',20,24,45]]};
 link(grove,14,0,altar,17,35);altar.spawn={x:17,y:33};path(altar,17,35,17,16);rect(altar,12,8,11,10,',');
 prop(altar,'ancientAltar',14,5,7,5,'R');resident(altar,17,12,'メロロン',0,[],{script:'marine:meroron',artMon:'メロロン',artSize:56,noRoam:true});
 grass(altar,3,12,8,15);grass(altar,24,12,7,15);grass(altar,11,22,5,8);grass(altar,20,22,4,8);
 altar.enc={rate:18,list:[['キノコン',23,27,50],['ハナビィ',23,27,49],['ネムノハ',24,28,1]]};
 sign(altar,20,16,['ヤマノヌシのさいだん','夕方17時から 夜24時まで','森の奥に メロロンが姿を見せる。','一度会うと 次の日まで姿を消す。']);
 path(five,0,10,31,10);five.spawn={x:2,y:10};rect(five,0,18,32,6,'W');grass(five,5,3,7,5);grass(five,20,13,8,4);
 link(town,39,18,five,0,10,'marine:passed');link(five,31,10,karat,0,18);
 path(karat,0,18,29,18);path(karat,16,8,16,24);karat.spawn={x:2,y:18};
 house(karat,5,10,'marineHouse','hospital','ガオンびょういん');house(karat,22,10,'marineShop','shop','ショップ');
 resident(karat,17,19,'カラットタウンの人',13,['カラットタウンへ ようこそ！','山から届く きれいな石が この町の自慢さ。']);
 // Trees respect every authored path, grass patch, NPC and building. Borders are full sprites.
 for(const m of [coast,town,four,lake,five,karat,grove,altar]){
  for(let y=1;y<m.g.length-3;y+=3)for(let x=1;x<m.g[0].length-2;x+=3){if(m.npcs.some(n=>Math.abs(n.x-x)<4&&Math.abs(n.y-y)<4)||m.warps.some(n=>Math.abs(n.x-x)<3&&Math.abs(n.y-y)<3))continue;if((x+y)%3===0||m.biome==='ancient'||x<4||x>m.g[0].length-6)tree(m,x,y);}

  for(const [x,y] of [[11,5],[25,25]])if(m.g[y]?.[x]===','&&!m.npcs.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3))prop(m,'shoreRock',x,y,1,1,'R');
  m.props.sort((a,b)=>(a.y+a.h)-(b.y+b.h));
 }
}
