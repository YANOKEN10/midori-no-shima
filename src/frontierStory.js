import {G as State,makeMon,addToParty,ownMon,healParty} from './state.js';
import {ui} from './ui.js';
import {startBattle,wait} from './battle.js';
import {saveLocal,saveCloud} from './save.js';
import {cloud} from './cloud.js';
import {beep} from './audio.js';
import {solid} from './tiles.js';
import {ITEMS} from './data/items.js';
import {RESURE_EMBLEM,VOLCANO_EMBLEM,VOLCANO_BATTLE,parkCount,resureReady,recordBirth,volcanoAvailable,markVolcano,rematchAvailable,markRematch} from './frontierRules.js';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
async function finish(w,result){if(result==='lose')await w.blackout();else await w.checkEvolution();await persist();w.resumeBgm();}
async function ready(){if(State.save.party.some(m=>m.hp>0))return true;await ui.say(['元気なガオンを 連れてきてね。']);return false;}
export function refreshFrontier(w){recordBirth(State.save);for(const n of w.npcs)if(n.script==='frontier:volcano')n.gone=State.save.flags['frontier:volcanoWon']&&!volcanoAvailable(State.save);}
async function walk(w,n,target,adjacent=true){const blocked=(x,y)=>solid(w.map.rows[y]?.[x])||w.map.rows[y]?.[x]==null||w.npcs.some(p=>p!==n&&!p.gone&&Math.round(p.x)===x&&Math.round(p.y)===y)||Math.round(w.x)===x&&Math.round(w.y)===y;const start=[Math.round(n.x),Math.round(n.y)],q=[start],prev=new Map([[start.join(','),null]]);let end;
 for(let i=0;i<q.length;i++){const[x,y]=q[i];if(Math.abs(x-target.x)+Math.abs(y-target.y)<=(adjacent?1:0)){end=x+','+y;break;}for(const[dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const a=x+dx,b=y+dy,k=a+','+b;if(!prev.has(k)&&!blocked(a,b)){prev.set(k,x+','+y);q.push([a,b]);}}}
 if(!end)return;const steps=[];while(prev.get(end)){steps.push(end.split(',').map(Number));end=prev.get(end);}n.noRoam=true;for(const[x,y]of steps.reverse()){n.dir=x>n.x?'right':x<n.x?'left':y>n.y?'down':'up';n.moving=true;for(let px=8;px<=32;px+=8){n.ox=(x-n.x)*px;n.oy=(y-n.y)*px;await wait(22);}n.x=x;n.y=y;n.ox=n.oy=0;}n.moving=false;
}
export function tickFrontier(w){if(w.busy||ui.busy||w.moving)return false;const s=State.save;recordBirth(s);let n;
 if(w.mapId==='resure'&&resureReady(s)&&!s.flags['frontier:takaraMet']&&!s.flags['frontier:resureWon'])n=w.npcs.find(n=>n.script==='frontier:takara');
 if(w.mapId==='volcano3'&&!s.flags['frontier:yanokenMet'])n=w.npcs.find(n=>n.script==='frontier:yanoken'&&Math.abs(n.x-w.x)+Math.abs(n.y-w.y)<=9);
 if(!n)return false;w.busy=true;(async()=>{await walk(w,n,{x:w.x,y:w.y});s.flags[n.script==='frontier:takara'?'frontier:takaraMet':'frontier:yanokenMet']=true;await persist();await frontierNpc(w,n);})().catch(e=>console.error('Frontier event',e)).finally(()=>{w.busy=false;});return true;}
export async function frontierNpc(w,n){const s=State.save,f=s.flags;
 if(n.script==='frontier:park'){await ui.say(['ここでしか捕まえられない ガオンが10種類いるよ。','パーク内で捕まえた種類：'+parkCount(s)+'／10','試験には 育て屋で１匹の誕生も必要だよ。']);return;}
 if(n.script==='frontier:takara'){
  if(f['frontier:resureWon']){await ui.say(['レスレの自然とガオンを 大切にしてね。']);return;}
  if(!resureReady(s)){await ui.say(['私は 町長のタカラダです。','パークで10種類捕まえて 育て屋で１匹誕生させよう。','パーク：'+parkCount(s)+'／10　誕生：'+(s.daycareBirths||0)+'匹']);return;}
  f['frontier:takaraMet']=true;await persist();if(!await ready())return;
  if(!await ui.ask(['２つの課題を 達成したね！','最後は 私とバトルをしよう。'])){await walk(w,n,{x:29,y:20},false);n.noRoam=false;n.homeX=29;n.homeY=20;return;}
  const result=await startBattle({trainer:{name:'町長 タカラダ',major:true,party:[['ウリボン',26],['タヌポン',27],['フワクジ',28]],money:1800}});
  if(result==='win'){f['frontier:resureWon']=true;if(!s.badges.includes(RESURE_EMBLEM))s.badges.push(RESURE_EMBLEM);s.bag[RESURE_EMBLEM]=1;await persist();await ui.say(['レスレ・エンブレムを 手に入れた！']);}await finish(w,result);return;
 }
 if(n.script==='frontier:daily'){
  const key=n.dailyId;if(!rematchAvailable(s,key,true)){await ui.say(['今日の勝負は 終わったね。','また明日 バトルしよう！']);return;}
  if(!await ready()||!await ui.ask(['もう一度 バトルしない？','ここでは 毎日１回 勝負できるよ。']))return;markRematch(s,key,true);await persist();const r=await startBattle({trainer:{name:n.name,party:n.dailyTeam,money:650}});await finish(w,r);return;
 }
 if(n.script==='frontier:guard'){await ui.say(new Set(s.badges).size>=5?['エンブレム５個を確認しました。','ギャラクシータウンへ どうぞ。']:['１１番道路は 通行止めです。','エンブレムを５個 集めてください。']);return;}
 if(n.script==='frontier:briefing'){f['frontier:briefed']=true;await persist();await ui.say(f['frontier:volcanoWon']?['ヨウガン山での勝利 おめでとう！','１３番道路から クリアタウンを目指そう。']:['マニケレオの試験は ヨウガン山だ。','ネイチャータウンへ戻り 山おくのさらに奥へ。','灰が舞う道を抜け 山頂のヨウガンヌシに勝とう。','勝ったら ネイチャータウンの町長に報告してね。']);return;}
 if(n.script==='frontier:report'){if(!f['frontier:volcanoWon']){await ui.say(['山おくの先には 灰が舞う道があるよ。','マニケレオの町長から 話を聞いておいで。']);return;}if(!f['frontier:reported']){f['frontier:reported']=true;if(!s.badges.includes(VOLCANO_EMBLEM))s.badges.push(VOLCANO_EMBLEM);s.bag[VOLCANO_EMBLEM]=1;await persist();await ui.say(['山頂のヨウガンヌシに 勝ったんだね！','マニケレオの町長から 預かっていた証だ。','マニケレオ・エンブレムを 手に入れた！']);}else await ui.say(['マニケレオタウンから １３番道路へ進もう。']);return;}
 if(n.script==='frontier:yanoken'){
  if(f['frontier:yanokenWon']){await ui.say(['アワミィを 大切にしてくれよな！']);return;}
  if(!await ready()||!await ui.ask(['また会えたね！ ヤノケンだよ！','ここまで育てたガオンで 再戦しようぜ！']))return;
  const r=await startBattle({trainer:{name:'ヤノケン',party:[['コケゴロ',32],['アワミィ',30],['ヨルネコ',33]],money:2000}});
  if(r==='win'){f['frontier:yanokenWon']=true;const child=makeMon('アワミィ',5);const dest=addToParty(child);ownMon(child.sp);await persist();await ui.say(['僕が育てていたアワミィから 生まれた子なんだ！','アワミィ Lv.5を キミに託すよ！',dest==='box'?'手持ちがいっぱいなので ボックスに送った。':'仲間に加わった！']);}await finish(w,r);return;
 }
 if(n.script==='frontier:volcano'){
  const first=!f['frontier:volcanoWon'];if(!first&&!volcanoAvailable(s)||!await ready())return;
  if(!first){markVolcano(s);await persist();}
  const r=await startBattle({wild:makeMon('ヨウガンヌシ',35),...VOLCANO_BATTLE,captureDisabled:first,emblemTest:first});
  if(first&&r==='win'){f['frontier:volcanoWon']=true;markVolcano(s);await persist();await ui.say(['ヨウガンヌシに 勝った！','町長に報告しに ネイチャータウンに戻ろう。']);if(await ui.ask(['ネイチャータウンに ここから一気に戻りますか？']))w.enter('village',16,19,'down');}
  await finish(w,r);refreshFrontier(w);return;
 }
 if(n.script==='frontier:heldShop'){
  for(;;){const names=['パワーバンド','まもりのおまもり','ひらめきの石'];const i=await ui.choice([...names.map(x=>x+'　'+ITEMS[x].price+'円'),'もどる'],{rows:4});if(i<0||i===3)return;const name=names[i],d=ITEMS[name];if(!await ui.ask([d.desc,'買いますか？']))continue;if(s.money<d.price){await ui.say(['お金が 足りません。']);continue;}s.money-=d.price;s.bag[name]=(s.bag[name]||0)+1;await persist();await ui.say(['どうぐから選んで ガオンに持たせよう。']);}
 }
 if(n.script==='frontier:train'||n.script==='frontier:returnTrain'){if(new Set(s.badges).size<7){await ui.say(['列車に乗るには エンブレム７個が必要です。']);return;}if(await ui.ask(['列車に乗りますか？'])){w.enter(n.script==='frontier:train'?'galaxy':'manikereoStation',n.script==='frontier:train'?18:16,n.script==='frontier:train'?19:10,'down');await persist();}}
}
