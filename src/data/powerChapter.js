// Flower coast and the second emblem test. Each road has an authored walking corridor.
export function extendPowerChapter(M,h){
 const {add,rect,path,prop,tree,npc,sign,link}=h;
 const make=(id,name,w,ht,biome='flowers',kind='out')=>{const m=add(id,name,w,ht,kind);m.chapter=3;m.biome=biome;m.powerArt=true;return m;};
 // Replace the former small placeholders while retaining their IDs and arrival coordinates.
 M.marine.warps=M.marine.warps.filter(w=>w.to!=='route5');
 const five=make('route5','５番道路',64,30),town=make('karat','カラットタウン',42,38);
 const six=make('route6','６番道路',38,48,'coast'),yard=make('raden','ラーデン発電所',38,34,'coast');
 const inside=make('radenInside','ラーデン発電所・機械室',32,34,'industrial','in');
 const seven=make('route7','７番道路',40,28,'coast'),port=make('karatPort','カラット港',30,30,'coast');
 const otherPort=make('resurePort','レスレ港',30,30,'coast'),eight=make('route8','８番道路',32,36,'coast');
 const resure=make('resure','レスレタウン',34,30,'coast');
 const person=(m,x,y,name,variant,talk,extra={})=>npc(m,x,y,name,'boy',talk,{variant,...extra});
 const flowers=(m,x,y,w,ht,art='flowersPink')=>{for(let j=y;j<y+ht;j+=2)for(let i=x;i<x+w;i+=2){if(m.g.slice(j,j+2).every(r=>r.slice(i,i+2).every(c=>c===','))) {rect(m,i,j,2,2,'F');m.props.push({art,x:i,y:j,w:2,h:2});}}};
 const grass=(m,x,y,w,ht)=>rect(m,x,y,w,ht,'"');
 const home=(m,x,y,to,label,roadY,art='flowerHouse')=>{prop(m,art,x,y,5,5,'#');const dx=x+2,dy=y+4;m.g[dy][dx]='D';m.props.at(-1).door={x:dx,y:dy};m.warps.push({x:dx,y:dy,to,tx:7,ty:10,back:{map:m.id,x:dx,y:dy+1}});path(m,dx,dy+1,dx,roadY,1);sign(m,x,dy+2,label);};
 path(five,0,10,13,10);path(five,13,10,13,20);path(five,13,20,33,20);path(five,33,20,33,9);path(five,33,9,49,9);path(five,49,9,49,18);path(five,49,18,63,18);
 five.spawn={x:2,y:10};flowers(five,3,3,8,4);flowers(five,18,12,12,4);flowers(five,37,15,8,8,'flowersGold');flowers(five,53,4,8,10);flowers(five,18,24,12,4,'flowersGold');
 grass(five,4,20,6,6);grass(five,37,3,8,4);five.enc={rate:17,list:[['ハナビィ',11,14,60],['キノコン',12,14,40]]};
 person(five,23,19,'花を育てる人',25,['カラットタウンまで 花の道が続くよ。','季節ごとに 違う色が咲くんだ。']);sign(five,4,12,['５番道路 ― 花の小道','東：カラットタウン']);
 link(M.marine,39,18,five,0,10,'marine:passed');
 path(town,0,18,41,18);path(town,20,0,20,33);path(town,5,29,34,29);
 town.spawn={x:2,y:18};link(five,63,18,town,0,18);
 home(town,5,10,'hospital','ガオンびょういん',18);home(town,29,10,'shop','ショップ',18);home(town,6,22,'rodsHome','花職人の家',29);home(town,29,22,'karatSalon','カット屋 ― 髪の長さと色',29);
 const salon=add('karatSalon','カラットタウンのカット屋',16,14,'in');salon.chapter=3;salon.spawn={x:7,y:10};salon.g[12][7]='x';salon.warps.push({x:7,y:12,to:'@back'});
 rect(salon,3,3,10,1,'b');rect(salon,4,5,2,1,'t');rect(salon,10,5,2,1,'t');person(salon,7,5,'カット屋の店主',5,['カット屋へ ようこそ！','髪の長さも 色も 好きなものを選べるよ。'],{salon:true,noRoam:true});
 flowers(town,12,14,6,4);flowers(town,23,14,4,4,'flowersGold');flowers(town,4,3,12,4);flowers(town,25,3,12,4,'flowersGold');flowers(town,14,22,4,6);flowers(town,23,22,4,6,'flowersGold');flowers(town,4,32,12,4,'flowersGold');flowers(town,25,32,12,4);
 for(const [x,y]of [[15,10],[24,10],[15,30],[24,30]])prop(town,'flowerTree',x,y,2,3);
 person(town,17,19,'試験の案内係',5,[],{script:'power:guide',noRoam:true});person(town,9,19,'花職人',25,['花畑の町 カラットタウンへようこそ。']);person(town,31,30,'町の女の子',1,['北には ソーラーパネルが いっぱい。','発電所の電気で 港の船も動くの。']);
 sign(town,22,3,['北：６番道路・ラーデン発電所']);sign(town,37,20,['東：７番道路・カラット港','船で レスレ港へ渡れます。']);
 rect(six,27,0,11,48,'W');path(six,17,0,17,47);path(six,17,35,8,35);path(six,8,35,8,22);path(six,8,22,17,22);
 six.spawn={x:17,y:45};link(town,20,0,six,17,47);link(six,17,0,yard,17,33);
 for(const [x,y]of [[4,5],[11,5],[4,12],[11,12],[20,5],[20,15],[20,25],[20,36],[3,39],[10,39]])prop(six,'solarPanels',x,y,5,3,'R');
 grass(six,3,18,10,3);grass(six,3,26,4,7);grass(six,20,30,6,4);six.enc={rate:19,list:[['ジリジリ',14,17,60],['ハネデン',15,18,40]]};six.battleTerrain='grass';
 person(six,16,24,'発電設備の技師',13,['海風と太陽の光で 発電しているよ。','ジリジリや ハネデンも 電気が好きなんだ。']);sign(six,19,43,['６番道路 ― 太陽と潮風の道','北：ラーデン発電所']);
 rect(yard,30,0,8,34,'W');path(yard,17,33,17,14);path(yard,17,19,27,19);path(yard,27,19,27,10);path(yard,27,10,23,10);
 yard.spawn={x:17,y:31};prop(yard,'powerStation',13,7,9,7,'#');yard.g[13][17]='D';yard.props.at(-1).door={x:17,y:13};
 yard.warps.push({x:17,y:13,to:'radenInside',tx:4,ty:31,requires:'power:director'});
 // This second door is the short exit beside the deepest chest; entry remains the main door.
 prop(yard,'solarPanels',3,7,7,4,'R');prop(yard,'solarPanels',3,17,7,4,'R');grass(yard,23,23,5,6);
 person(yard,17,14,'所長 ジネル',13,[],{script:'power:director',noRoam:true});
 person(yard,25,13,'ライメイ',0,[],{script:'power:storyRaimei',artMon:'ライメイ',artSize:48,noRoam:true});
 person(yard,25,9,'ライメイ',0,[],{script:'power:weeklyRaimei',artMon:'ライメイ',artSize:48,noRoam:true});
 sign(yard,19,25,['ラーデン発電所','所長：ジネル']);sign(yard,28,8,['ライメイの目撃記録','土曜・日曜 9時〜13時','土曜 17時〜18時','会った後は 次の週の同じ時間に。']);
 // Alternating generator banks leave a continuous, serpentine aisle.
 inside.spawn={x:4,y:31};inside.warps.push({x:4,y:33,to:'raden',tx:17,ty:15});inside.g[33][4]='x';
 for(const [y,left,right]of [[26,1,24],[19,7,30],[12,1,24],[5,7,30]]){rect(inside,left,y,right-left+1,3,'R');for(let x=left;x<=right-3;x+=4)inside.props.push({art:['generator','controlBank','transformers','pipePump','turbine'][(Math.floor(x/4)+y)%5],x,y,w:4,h:3});}
 for(const [x,y]of [[11,9],[18,16],[11,23],[18,30]])prop(inside,'transformers',x,y,2,2,'R');
 person(inside,4,3,'制御装置の宝箱',0,[],{script:'power:chest',propArt:'marineChest',noRoam:true});
 inside.g[2][2]='x';inside.warps.push({x:2,y:2,to:'raden',tx:23,ty:10});
 sign(inside,3,2,['非常口 → 外へ','宝箱は この先の制御装置。']);
 inside.enc={rate:14,encAll:true,list:[['プラグン',16,20,49],['ビリタマ',15,19,49],['ピリット',18,21,1],['デンデマリ',18,21,1]]};
 path(seven,0,14,17,14);path(seven,17,14,17,19);path(seven,17,19,39,19);rect(seven,0,23,40,5,'W');seven.spawn={x:2,y:14};flowers(seven,3,4,10,6);flowers(seven,23,8,10,6,'flowersGold');
 link(town,41,18,seven,0,14);link(seven,39,19,port,0,12);
 for(const m of [port,otherPort]){rect(m,0,20,30,10,'W');path(m,0,12,25,12);path(m,14,12,14,19);rect(m,13,19,3,7,'d');rect(m,16,23,1,1,'d');home(m,4,5,'hospital','港のガオンびょういん',12,'marineHouse');home(m,21,5,'shop','港のショップ',12,'marineShop');prop(m,'ferry',17,21,9,5,'W');m.spawn={x:14,y:19};person(m,14,23,'連絡船の船長',12,[],{script:'power:ferry',destination:m===port?'resurePort':'karatPort',noRoam:true});sign(m,17,17,[m.name+' 連絡船のりば','乗船には チケットが必要です。']);}
 person(port,10,15,'港の船乗り',12,['連絡船は レスレ港へ向かう。','試験に合格したら 所長からチケットをもらおう。']);
 // Ferry graph edges also guide the compass. The boarding NPC handles actual travel.
 port.travelLinks=[{to:'resurePort',x:14,y:23}];otherPort.travelLinks=[{to:'karatPort',x:14,y:23}];
 path(otherPort,14,0,14,12);path(eight,15,0,15,35);rect(eight,24,0,8,36,'W');grass(eight,4,7,7,8);grass(eight,4,22,7,7);eight.spawn={x:15,y:33};
 link(otherPort,14,0,eight,15,35);link(eight,15,0,resure,16,29);eight.enc={rate:18,list:[['サカナビ',17,20,50],['ミナモン',18,21,50]]};
 path(resure,16,29,16,6);path(resure,3,17,29,17);resure.spawn={x:16,y:27};home(resure,4,8,'hospital','ガオンびょういん',17);home(resure,23,8,'shop','ショップ',17);flowers(resure,4,22,7,4);flowers(resure,23,22,7,4,'flowersGold');
 person(resure,18,19,'レスレタウンの人',1,['長い船旅 おつかれさま！','レスレタウンへ ようこそ。']);
 for(const m of [five,town,six,yard,seven,port,otherPort,eight,resure]){
  for(let y=1;y<m.g.length-3;y+=4)for(let x=1;x<m.g[0].length-2;x+=3)if(x<4||x>m.g[0].length-6||y<3||y>m.g.length-6){if(!m.warps.some(w=>Math.abs(w.x-x)<3&&Math.abs(w.y-y)<4)&&!m.npcs.some(n=>Math.abs(n.x-x)<3&&Math.abs(n.y-y)<4))tree(m,x,y);}
  m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
 }
}
