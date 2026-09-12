import {PARK_SPECIES} from '../frontierRules.js';
export function extendFrontierChapter(M,h){
 const{add,rect,path,prop,tree,npc,sign,link}=h;
 const make=(id,name,w,ht,theme='ranch',kind='out')=>{const m=add(id,name,w,ht,kind);m.chapter=4;m.frontierTheme=theme;m.spawn={x:Math.floor(w/2),y:ht-3};return m;};
 const person=(m,x,y,name,script,extra={})=>npc(m,x,y,name,'hiker',[],{script,variant:6,noRoam:true,...extra});
 const road=(id,name,w,ht,theme,level,pool,count)=>{const m=make(id,name,w,ht,theme),cx=Math.floor(w/2);const pts=[[cx,ht-1],[cx,ht-10],[6,ht-18],[6,Math.floor(ht/2)],[w-8,Math.floor(ht/2)],[w-8,12],[cx,12],[cx,0]];for(let i=1;i<pts.length;i++)path(m,...pts[i-1],...pts[i],2);
  for(let y=4;y<ht-4;y++)for(let x=3;x<w-3;x++)if(m.g[y][x]===','&&(x+y)%13<8)m.g[y][x]='"';
  m.enc={rate:18,list:pool.map((n,i)=>[n,level,level+3,Math.floor(100/pool.length)])};
  for(let i=0;i<count;i++){const y=6+Math.floor(i*(ht-14)/Math.max(1,count-1)),x=m.g[y].findIndex(c=>c==='.');if(x<0)continue;person(m,x,y,'トレーナー '+(i+1),null,{trainer:{party:[[pool[i%pool.length],level+2],[pool[(i+1)%pool.length],level+4]],money:level*30},talk:['仲間と しょうぶしよう！'],win:['見事な しょうぶだった！'],after:['また腕をみがいて 待っているよ。'],dir:'right',...(theme==='snow'?{winterVariant:i%4}:{} )});}
  for(let y=3;y<ht-3;y+=5)for(const x of [2,w-4])if(m.g[y][x]===',')prop(m,theme==='snow'?'snowFir':theme==='ash'?'ashTree':'tree',x,y,2,3);
  return m;};
 const home=(m,x,y,art,to,label)=>{prop(m,art,x,y,5,5,'#');const dx=x+2,dy=y+4;m.g[dy][dx]='D';m.props.at(-1).door={x:dx,y:dy};m.warps.push({x:dx,y:dy,to,tx:7,ty:10,back:{map:m.id,x:dx,y:dy+1}});path(m,dx,dy+1,dx,24,1);sign(m,x,dy+2,[label]);};
 // Keep the established daycare, outdoor parents and south port connection.
 const town=M.resure;town.frontierTheme='ranch';delete town.biome;town.npcs.find(n=>n.name==='レスレタウンの人').fixedDialogue=true;
 path(town,16,19,33,19,2);path(town,16,21,0,21,2);path(town,29,19,29,0,2);
 prop(town,'ranchBarn',2,2,6,5,'#');person(town,29,20,'町長 タカラダ','frontier:takara',{variant:3,noRoam:false});
 sign(town,27,23,['レスレ・エンブレムの試験','パークで10種類捕獲 ＋ 育て屋で１匹誕生']);
 // A walk-through park gate leads to a separate reserve.
 town.g[5][29]='D';town.warps.push({x:29,y:5,to:'gaonPark',tx:20,ty:46});prop(town,'parkGate',28,2,4,3,'R');path(town,29,5,29,19,1);
 const park=make('gaonPark','ガオンパーク',42,48);path(park,20,47,20,3,2);path(park,4,24,36,24,2);rect(park,3,3,14,17,'"');rect(park,25,3,13,17,'"');rect(park,3,29,14,15,'"');rect(park,25,29,13,15,'"');prop(park,'ranchBarn',4,20,5,4,'#');rect(park,28,20,8,4,'W');park.enc={rate:23,list:PARK_SPECIES.map(n=>[n,21,25,10])};park.warps.push({x:20,y:47,to:'resure',tx:29,ty:6});park.g[47][20]='.';person(park,22,44,'パークの案内係','frontier:park',{variant:26});
 const nine=road('route9','９番道路',32,48,'ranch',23,['フラワン','マイタケン'],4),flowers=make('flowerPark','フラワーパーク',42,42,'flowers');path(flowers,20,41,20,3,2);path(flowers,4,20,36,20,2);
 for(let y=4;y<36;y+=7)for(let x=4;x<36;x+=8){if(Math.abs(x-20)<5||Math.abs(y-20)<4)continue;prop(flowers,'flowersPink',x,y,4,3,'F');}
 for(let i=0;i<10;i++)person(flowers, i<5?18:23,5+(i%5)*7,'花のトレーナー '+(i+1),'frontier:daily',{dailyId:'flower-'+i,dailyTeam:[['フラワン',24+i%3],['ハナビィ',26+i%3]],variant:[25,1,27,28][i%4]});
 const ten=road('route10','１０番道路',34,52,'coast',32,['ハサミガニ','スイスイオ'],6),beach=make('resureBeach','レスレビーチ',38,44,'coast');path(beach,18,43,18,0,2);rect(beach,25,0,13,44,'W');rect(beach,3,6,10,30,'"');beach.enc={rate:18,list:[['ハサミガニ',33,36,50],['ラゲドン',33,36,50]]};
 const twelve=road('route12','１２番道路',38,84,'coast',34,['ラゲドン','ガンセキ','スイスイオ'],10);
 const city=make('manikereo','マニケレオタウン',44,40,'rail');path(city,22,39,22,0,2);path(city,2,24,41,24,2);home(city,4,10,'flowerHouse','hospital','ガオンびょういん');home(city,32,10,'flowerHouse','shop','ショップ');
 prop(city,'station',15,4,12,7,'#');city.g[10][21]='D';path(city,21,11,21,24,2);city.warps.push({x:21,y:10,to:'manikereoStation',tx:16,ty:21});person(city,19,23,'町長 イサナ','frontier:briefing',{variant:3});
 const station=make('manikereoStation','マニケレオ駅',34,26,'rail','in');station.g[24][16]='x';station.warps.push({x:16,y:24,to:'manikereo',tx:21,ty:11});rect(station,2,3,30,3,'R');prop(station,'train',6,2,20,4,'R');person(station,7,12,'駅のショップ','frontier:heldShop',{variant:5});person(station,16,8,'駅員','frontier:train',{variant:17});station.travelLinks=[{to:'galaxy',x:16,y:8}];prop(station,'shopCounter',4,10,6,2,'R');prop(station,'shipSeats',22,11,7,3,'R');prop(station,'shipSeats',22,17,7,3,'R');sign(station,5,14,['駅のショップ','ガオンに持たせる道具を 販売しています。']);
 const eleven=road('route11','１１番道路',32,48,'ranch',35,['ガンセキ','ミナモン'],4),galaxy=make('galaxy','ギャラクシータウン',38,34,'rail');path(galaxy,18,33,18,3,2);path(galaxy,4,22,33,22,2);home(galaxy,4,5,'station','hospital','ガオンびょういん');person(galaxy,19,18,'駅員','frontier:returnTrain',{variant:17});galaxy.travelLinks=[{to:'manikereoStation',x:19,y:18}];person(town,28,1,'警備員','frontier:guard',{variant:28});person(town,31,1,'警備員','frontier:guard',{variant:28});
 const snow=road('route13','１３番道路',38,80,'snow',36,['コオリン','ヒョウガン','モコヒツジ'],10),clear=make('clearTown','クリアタウン',42,40,'snow');path(clear,20,39,20,4,2);path(clear,3,24,38,24,2);home(clear,4,7,'snowHouse','hospital','ガオンびょういん');home(clear,31,7,'snowHouse','shop','ショップ');prop(clear,'snowHall',15,4,11,8,'#');prop(clear,'holidayTree',16,17,4,6,'R');for(const[x,y]of [[3,21],[11,21],[26,21],[36,21]])prop(clear,'snowLamp',x,y,1,3,'R');for(let i=0;i<4;i++)person(clear,8+i*7,28,'雪の町の住民 '+(i+1),null,{winterVariant:i,noRoam:false,talk:[['雪の上の足音が きれいに響くね。','窓の明かりを見ると ほっとするよ。'],['イルミネーションが とてもきれい！'],['あたたかい服で 町を歩こう。'],['木にも屋根にも 雪が積もったよ。']][i]});
 const ash=road('ashRoad','灰が舞う道',34,54,'ash',29,['スミビン','ツチマル','マグマゴ'],4);
 const floors=[];for(let i=0;i<3;i++){const m=road('volcano'+(i+1),'ヨウガン山・'+(i+1)+'合目',36,46,'ash',30+i,['ボヤッコ','マグマゴ','イワッコ','スミビン'],2);m.kind='cave';m.enc.encAll=true;for(let y=8;y<38;y+=12)for(const x of [10,26])if(m.g[y][x]!=='.')prop(m,'lavaRock',x,y,3,4,'R');floors.push(m);}
 const summit=make('volcanoSummit','ヨウガン山・頂上',38,36,'ash');path(summit,18,35,18,8,2);for(const[x,y]of [[5,7],[28,7],[4,20],[29,20]])prop(summit,'lavaRock',x,y,4,6,'R');person(summit,18,8,'ヨウガンヌシ','frontier:volcano',{artMon:'ヨウガンヌシ',artSize:64});person(floors[2],16,7,'ヤノケン','frontier:yanoken',{variant:0});
 person(M.village,10,19,'町長 ミノリ','frontier:report',{variant:3});

 // Snow-lined neighbourhoods, meadow trees and volcanic switchbacks.
 const safeProp=(m,art,x,y,w,h,ch='T')=>{if(y+h>=m.g.length||x+w>=m.g[0].length)return;if(m.npcs.some(n=>n.x>=x&&n.x<x+w&&n.y>=y&&n.y<y+h))return;if(m.g.slice(y,y+h).every(r=>r.slice(x,x+w).every(c=>c===',')))prop(m,art,x,y,w,h,ch);};
 for(const m of [town,park,flowers,city,clear,galaxy])for(let y=2;y<m.g.length-4;y+=5)for(let x=2;x<m.g[0].length-3;x+=5){if((x+y)%3===0)continue;safeProp(m,m.frontierTheme==='snow'?'snowFir':'tree',x,y,2,3);}
 for(let y=3;y<74;y+=5)for(const x of [1,4,31,34]){if(snow.g.slice(y,y+3).every(r=>r.slice(x,x+2).every(c=>c!=='.'&&c!=='R')))prop(snow,'snowFir',x,y,2,3);}
 for(const m of floors){m.props=m.props.filter(p=>p.art!=='ashTree');for(let y=1;y<m.g.length-1;y++)for(let x=1;x<m.g[0].length-1;x++){if(m.g[y][x]==='T')m.g[y][x]=',';if(m.g[y][x]==='"')m.g[y][x]=',';}
  // Off-corridor lava channels and walls make the winding route the actual climb.
  for(let y=2;y<m.g.length-2;y++)for(let x=2;x<m.g[0].length-2;x++){if(m.g[y][x]!==','||m.npcs.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<=1))continue;let near=false;for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)if(m.g[y+yy]?.[x+xx]==='.')near=true;if(!near)m.g[y][x]=(x%9<3&&y%12<9)?'W':'R';}
  m.props=m.props.filter(p=>p.art==='lavaRock');
 }
 for(const m of [town,clear]){for(let x=1;x<m.g[0].length-3;x+=3){safeProp(m,m===clear?'snowFir':'tree',x,m.g.length-5,2,3);}}

 for(const[x,y]of [[2,14],[25,3],[24,17],[11,23],[20,26]])safeProp(town,'tree',x,y,2,3);
 for(const[x,y]of [[1,2],[30,6],[1,24],[30,25]])safeProp(town,'mountainCrag',x,y,3,3,'R');
 // Railway paving leads from the station platform into the town streets.
 sign(city,24,12,['マニケレオ駅','列車は エンブレム７個で乗車できます。']);
 // All graph links use matching border openings and valid landing tiles.
 link(town,0,21,nine,16,47);link(nine,16,0,flowers,20,41);link(town,33,19,ten,17,51);link(ten,17,0,beach,18,43);link(beach,18,0,twelve,19,83);link(twelve,19,0,city,22,39);link(town,29,0,eleven,16,47,'frontier:five');link(eleven,16,0,galaxy,18,33);link(city,22,0,snow,19,79,'frontier:snow');link(snow,19,0,clear,20,39);
 path(M.mountain,14,3,14,0,1);link(M.mountain,14,0,ash,17,53,'frontier:volcano');link(ash,17,0,floors[0],18,45);link(floors[0],18,0,floors[1],18,45);link(floors[1],18,0,floors[2],18,45);link(floors[2],18,0,summit,18,35);
 for(const m of Object.values(M)){m.props=m.props.filter(p=>{if(!m.frontierTheme&&m.id!=='mountain')return true;if(!['tree','fir'].includes(p.art))return true;let crosses=false;for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)if(m.g[y]?.[x]==='.')crosses=true;if(!crosses)return true;for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)if(m.g[y]?.[x]==='T')m.g[y][x]=',';return false;});}
 // Preserve park-only wild species, and move Yogannushi's sole wild habitat to the summit.
 for(const m of Object.values(M)){if(m.id!=='gaonPark'&&m.enc)m.enc.list=m.enc.list.filter(e=>!PARK_SPECIES.includes(e[0])&&e[0]!=='ヨウガンヌシ');if(m.frontierTheme){for(let x=0;x<m.g[0].length;x++){if(m.g[0][x]==='X')m.g[0][x]='R';if(m.g.at(-1)[x]==='X')m.g.at(-1)[x]='R';}for(let y=0;y<m.g.length;y++){if(m.g[y][0]==='X')m.g[y][0]='R';if(m.g[y].at(-1)==='X')m.g[y][m.g[y].length-1]='R';}m.props.sort((a,b)=>a.y+a.h-b.y-b.h);}}
}
