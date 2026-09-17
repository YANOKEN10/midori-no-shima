// Alpine coastal walks. Existing map IDs, exits, encounter tables and NPC indices stay stable.
export function refineAlpineRoutes65(M){
 const rect=(m,x,y,w,h,ch)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(m.g[yy]?.[xx]!==undefined)m.g[yy][xx]=ch;};
 const walk=(m,points,width=2)=>{for(let i=1;i<points.length;i++){const[a,b]=points[i-1],[x,y]=points[i];if(a!==x&&b!==y)throw Error('Alpine paths must be orthogonal');rect(m,Math.min(a,x),Math.min(b,y),Math.abs(a-x)+width,Math.abs(b-y)+width,'.');}};
 const prop=(m,art,x,y,w,h,ch='T')=>{if(art==='fir'){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(m.g[yy]?.[xx]!==',')return;if([...m.npcs,...m.signs,...m.warps,m.spawn].some(p=>p.x>=x-1&&p.x<=x+w&&p.y>=y-1&&p.y<=y+h))return;}rect(m,x,y,w,h,ch);m.props.push({art,x,y,w,h});};
 const grass=(m,x,y,w,h)=>{rect(m,x,y,w,h,'"');m.grassPlots.push({x,y,w,h});};
 const flowers=(m,x,y,w,h)=>rect(m,x,y,w,h,'F');
 const sign=(m,x,y,text)=>{const ground=m.g[y][x];m.g[y][x]='S';m.signs.push({x,y,ground,text});};
 const npc=(m,x,y,name,variant,talk,extra={})=>m.npcs.push({x,y,name,displayName:name,variant,look:'boy',dir:'down',noRoam:true,talk,...extra});
 const trainer=(m,x,y,name,variant,dir,party,talk)=>npc(m,x,y,name,variant,[talk],{dir,trainer:{party,money:120+party[0][1]*35},win:['いい しょうぶだったね！'],after:['景色を楽しみながら 旅を続けよう。']});
 const reset=m=>{const h=m.g.length,w=m.g[0].length;m.g=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>!x||!y||x===w-1||y===h-1?'X':','));m.props=[];m.signs=[];m.grassPlots=[];delete m.townGardens;m.alpineRoute65=true;m.explorationDesign=true;};
 const coast=M.route3;reset(coast);
 rect(coast,0,22,40,6,'W');
 walk(coast,[[0,14],[7,14],[7,10],[16,10],[16,17],[28,17],[28,12],[35,12],[35,14],[39,14]]);
 // Northern flower walk, an open workshop forecourt, and a southern waterfront loop.
 walk(coast,[[16,10],[16,4],[26,4],[26,12],[28,12]]);
 walk(coast,[[16,13],[28,13]]);
 walk(coast,[[7,14],[7,20],[28,20],[28,17]]);
 rect(coast,18,22,3,3,'d');walk(coast,[[19,20],[19,21]]);
 prop(coast,'alpineCheese65',19,7,6,5,'#');
 flowers(coast,19,5,5,1);flowers(coast,30,8,5,2);flowers(coast,3,17,2,3);
 grass(coast,3,4,7,4);grass(coast,10,15,4,4);grass(coast,30,3,6,4);grass(coast,31,17,5,3);
 // Keep the old sailor first so saved NPC progress is not reassigned.
 coast.npcs[0].x=21;coast.npcs[0].y=21;coast.npcs[0].noRoam=true;coast.npcs[0].talk=['海沿いの道も 花畑の道も マリンタウンへ続いているぞ。','工房の前では ガオンも ひと休みできる。'];
 npc(coast,22,12,'チーズ職人 エミール',13,['山のミルクで チーズを作っているんだ。','ひと休みしていこう。ガオンたちも 元気にしてあげるよ。'],{healAll:true,restStop:true});
 trainer(coast,10,10,'花をめぐる リゼ',27,'left',[['ハナビィ',8],['トリッピ',8]],'花畑の風に乗って しょうぶしよう！');
 trainer(coast,29,18,'海辺のトレーナー ニコ',12,'left',[['サカナビ',9],['クラゲミ',8]],'潮風みたいに 元気いっぱいだよ！');
 trainer(coast,26,7,'散策家 ルカ',6,'down',[['カブトン',9]],'寄り道で見つけた 仲間を見てくれ！');
 sign(coast,5,13,['３番道路 ― 花とチーズの散策路','西：ネイチャーの森　東：マリンタウン','北：チーズ工房　南：海辺の桟橋']);
 sign(coast,24,12,['アルプのチーズ工房','エミールに話しかけると ガオンが休めます。']);
 for(const[x,y]of [[1,1],[4,1],[7,1],[11,3],[12,6],[1,8],[3,9],[10,11],[12,11],[1,18],[37,2],[37,5],[37,8],[37,18],[28,1],[22,1],[18,1]])prop(coast,'fir',x,y,2,3);
 for(const[x,y]of [[3,21],[12,20],[33,21]])prop(coast,'shoreRock',x,y,1,1,'R');
 // The lake road bends around fir stands, with a separate lakeside loop and pier.
 const four=M.route4;reset(four);rect(four,22,5,7,20,'W');
 walk(four,[[14,31],[14,27],[7,27],[7,20],[15,20],[15,14],[8,14],[8,8],[14,8],[14,0]]);
 walk(four,[[15,20],[19,20],[19,8],[14,8]]);
 walk(four,[[8,8],[5,8],[5,6]]);rect(four,20,14,4,2,'d');
 prop(four,'alpineGazebo65',3,2,5,4,'#');
 flowers(four,3,7,2,2);flowers(four,17,3,3,2);flowers(four,17,25,3,2);
 grass(four,3,10,4,4);grass(four,3,22,3,3);grass(four,10,22,4,3);grass(four,10,3,3,3);grass(four,16,10,3,3);
 four.npcs[0].x=20;four.npcs[0].y=17;four.npcs[0].noRoam=true;
 npc(four,6,6,'湖畔の案内人 クララ',23,['モミの林を抜けると はなれの湖だよ。','東屋と湖の桟橋は 散歩の休憩にぴったり。']);
 trainer(four,7,23,'山歩きの フェリクス',6,'right',[['モグポン',10],['トリッピ',9]],'曲がり道も 山歩きの楽しみだ！');
 trainer(four,11,14,'湖を旅する ミラ',25,'right',[['シズクン',10],['ミナモン',10]],'湖の仲間と しょうぶしましょう。');
 trainer(four,19,10,'釣り好きの レオン',11,'down',[['サカナビ',10],['ミナモン',11]],'湖畔の寄り道へ ようこそ！');
 sign(four,12,29,['４番道路 ― モミの湖畔道','北：はなれの湖　南：マリンタウン','西：東屋　東：湖畔の桟橋']);
 for(const[x,y]of [[1,1],[9,1],[17,1],[25,1],[1,6],[1,10],[1,14],[3,16],[5,16],[10,17],[12,17],[10,10],[12,10],[16,6],[18,22],[1,26],[3,27],[9,29],[18,28],[22,27],[25,27]])prop(four,'fir',x,y,2,3);
 // Restore exact entry lanes and arrival cells after decoration. NPC positions stay walkable.
 for(const m of [coast,four]){
  const arrivals=Object.values(M).flatMap(a=>a.warps.filter(w=>w.to===m.id).map(w=>({x:w.tx,y:w.ty})));
  for(const p of [...m.warps,...arrivals,m.spawn,...m.npcs])if(Number.isFinite(p.x)&&Number.isFinite(p.y))m.g[p.y][p.x]='.';
  m.props.sort((a,b)=>(a.y+a.h)-(b.y+b.h));
 }
}
