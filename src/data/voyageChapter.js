export function extendVoyageChapter(M,h){
 const {add,rect,path,prop,npc,sign}=h;
 const person=(m,x,y,name,variant,script,extra={})=>npc(m,x,y,name,'boy',[],{variant,script,noRoam:true,...extra});
 person(M.karat,31,14,'スイスはかせ',2,'voyage:professor');
 for(const id of ['karatPort','resurePort']){const m=M[id];m.sailingPort=true;const n=m.npcs.find(n=>n.script==='power:ferry');n.script='voyage:board';n.name='船の添乗員';m.signs.find(s=>s.x===17&&s.y===17).text=[m.name+' 連絡船のりば','毎日12時〜17時に 乗船できます。','船のチケットは 何度でも使えます。'];for(const n of m.npcs)if(n.name==='港の船乗り')n.talk=['船のチケットは スイスはかせから。','図鑑に 15種類 仲間を登録しよう。'];}
 const make=(id,name)=>{const m=add(id,name,32,24,'in');m.chapter=3;m.biome='ship';m.shipRoom=true;m.spawn={x:16,y:20};return m;};
 const deck=make('shipDeck','連絡船・デッキ'),lounge=make('shipLounge','連絡船・ラウンジ'),cabins=make('shipCabins','連絡船・客室');
 deck.openDeck=true;person(deck,14,20,'船の添乗員',12,'voyage:disembark');
 deck.travelLinks=[{to:'karatPort',x:14,y:20},{to:'resurePort',x:14,y:20}];
 const door=(a,x,y,b,tx,ty)=>{a.g[y][x]='x';a.warps.push({x,y,to:b.id,tx,ty});};
 door(deck,16,2,lounge,16,20);door(lounge,16,21,deck,16,3);door(lounge,29,11,cabins,3,11);door(cabins,2,11,lounge,28,11);
 for(const [x,y]of [[8,5],[20,5],[8,14],[20,14]])prop(deck,'shipSeats',x,y,5,3,'R');
 for(const [x,y]of [[7,5],[20,5],[7,14],[20,14]])prop(lounge,'shipSeats',x,y,6,3,'R');prop(lounge,'shipHelm',13,3,6,3,'R');
 rect(cabins,15,2,1,19,'X');rect(cabins,15,10,1,3,'f');rect(cabins,3,7,12,1,'X');rect(cabins,17,15,12,1,'X');rect(cabins,8,7,2,1,'f');rect(cabins,23,15,2,1,'f');
 for(const [x,y]of [[4,3],[20,3],[4,15],[20,17]])prop(cabins,'shipSeats',x,y,5,3,'R');
 const teams=[[['ミナモン',18],['カニポン',20]],[['ハナビィ',19],['キノコン',21]],[['ジリジリ',19],['ハネデン',21]],[['ビリタマ',20],['プラグン',21]],[['サカナビ',19],['クラゲミ',22]],[['シズクン',20],['ミナモリス',22]],[['ヨルネコ',21]],[['コケゴロ',20]],[['アワミィ',21]],[['ビリボール',22]]];
 const spots=[[deck,10,9],[deck,21,18],[deck,10,18],[lounge,10,8],[lounge,21,11],[lounge,11,17],[cabins,11,4],[cabins,25,10],[cabins,10,19],[cabins,27,19]];
 const variants=[27,9,20,6,28,12,22,1,18,26];spots.forEach(([m,x,y],i)=>person(m,x,y,'船のトレーナー'+(i+1),variants[i],'voyage:trainer',{dailyId:'ship-'+i,dailyTeam:teams[i]}));
 person(lounge,19,18,'ヤノケン',0,'voyage:yanoken');person(lounge,16,8,'船の看護師',4,'voyage:heal');
 sign(deck,18,3,['北：ラウンジ・客室','南：下船の案内']);sign(lounge,26,10,['東：客室　南：デッキ','船内の10人とは １日１回バトルできる。']);
 const town=M.resure;prop(town,'daycareHouse',12,3,8,6,'#');town.g[8][16]='D';town.props.at(-1).door={x:16,y:8};path(town,16,9,16,17,1);town.warps.push({x:16,y:8,to:'daycare',tx:10,ty:14,back:{map:'resure',x:16,y:9}});sign(town,20,10,['育て屋 ― マリオ','同じ種類のガオン２匹で 新しい命を育てます。']);
 // Outdoor paddocks leave the central entrance and shop/hospital paths open.
 town.daycarePens=[{x:9,y:10,w:6,h:7},{x:18,y:11,w:5,h:6}];
 for(const pen of town.daycarePens){const{x,y,w,h}=pen;rect(town,x,y,w,h,',');rect(town,x,y,w,1,'=');rect(town,x,y+h-1,w,1,'=');rect(town,x,y,1,h,'=');rect(town,x+w-1,y,1,h,'=');}
 const nursery=add('daycare','マリオの育て屋',22,18,'in');nursery.chapter=3;nursery.biome='nursery';nursery.shipRoom=true;nursery.spawn={x:10,y:14};nursery.g[16][10]='x';nursery.warps.push({x:10,y:16,to:'@back'});
 prop(nursery,'nurseryPen',3,3,6,5,'R');prop(nursery,'nurseryPen',13,3,6,5,'R');prop(nursery,'shipSeats',3,11,5,3,'R');person(nursery,10,8,'マリオ',26,'voyage:daycare');
 town.npcs.find(n=>n.name==='レスレタウンの人').talk=['この町には マリオの育て屋があるよ。','同じ種類を２匹預けて 2000歩歩いてみよう。'];
}
