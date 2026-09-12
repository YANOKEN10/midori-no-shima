import {G as State,makeMon,healParty,ownMon} from './state.js';
import {newMove} from './data/moves.js';
import {ui} from './ui.js';
import {startBattle,wait} from './battle.js';
import {saveLocal,saveCloud} from './save.js';
import {cloud} from './cloud.js';
import {beep} from './audio.js';
import {SHIP_TICKET,SHIP_MAPS,VOYAGE_MS,boardingOpen,registeredCount,canReceiveTicket,hasShipTicket,voyageDocked,voyageRemaining,trainerAvailable,markTrainer,daycareRemaining,eligiblePairs,checkParents,eggMoves,depositParents,reclaimDaycare} from './voyageRules.js';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
export function refreshVoyageNpcs(world){
 const s=State.save,away=!!s.flags['power:passed']&&!hasShipTicket(s);
 for(const n of world.npcs){
  if(n.script==='v5:professor')n.gone=away;
  if(n.script==='v5:dex')n.gone=!!s.flags['power:passed'];
  if(n.script==='voyage:professor'){n.gone=!away;if(!n.voyagePlaced){n.x=31;n.y=s.flags['voyage:professorMet']?16:14;n.homeX=31;n.homeY=16;n.voyagePlaced=true;}n.noRoam=!s.flags['voyage:professorMet'];}
 }
}
async function professor(world,n){
 const s=State.save;if(!s.flags['power:passed']||hasShipTicket(s))return;
 await ui.say(['おお！ カラット・エンブレムを 手に入れたのじゃな。','図鑑を 見せてもらおう。','仲間にしたガオン：'+registeredCount(s)+'種類']);
 if(canReceiveTicket(s)){s.bag[SHIP_TICKET]=1;s.flags['voyage:ticket']=true;await persist();beep('levelup');await ui.say(['15種類以上 登録できておる！','船のチケットを あげよう。','カラット港で 毎日12時から17時に乗れるぞ。','わしは ネイチャータウンの研究施設へ戻る。']);n.gone=true;}
 else await ui.say(['船のチケットは 15種類を仲間にしたら渡そう。','あと'+Math.max(0,15-registeredCount(s))+'種類じゃ。','それまでは この町を歩いておるよ。']);
}
export function tickVoyage(world){
 if(world.busy||ui.busy||world.moving)return false;
 const s=State.save;
 let task=null;
 if(world.mapId==='karat'&&s.flags['power:passed']&&!hasShipTicket(s)&&!s.flags['voyage:professorMet'])task=async()=>{
  const n=world.npcs.find(n=>n.script==='voyage:professor');s.flags['voyage:professorMet']=true;n.noRoam=true;n.dir='down';n.gone=false;world.cameraFocus={x:31,y:15};world.showName=0;
  for(let step=0;step<2;step++){n.moving=true;for(let px=4;px<=32;px+=4){n.oy=px;n.roamProgress=px/32;await wait(30);}n.y++;n.oy=0;}n.moving=false;n.homeX=n.x;n.homeY=n.y;n.noRoam=false;await persist();await professor(world,n);
 };
 else if(SHIP_MAPS.includes(world.mapId)&&voyageDocked(s)&&!s.voyage.arrivalAnnounced)task=async()=>{s.voyage.arrivalAnnounced=true;await persist();beep('ok');await ui.say([s.voyage.to==='resurePort'?'レスレ港に 到着しました。':'カラット港に 到着しました。','デッキの添乗員に話しかけると 下船できます。','船内のバトルを 続けてもかまいません。']);};
 else if(s.daycare&&!daycareRemaining(s)&&!s.daycare.notified)task=async()=>{s.daycare.notified=true;await persist();beep('levelup');await ui.say(['育て屋に預けてから 2000歩歩いた！','マリオのところへ 会いに行こう。']);};
 if(!task)return false;world.busy=true;task().catch(e=>console.error('Voyage event:',e)).finally(()=>{world.cameraFocus=null;world.busy=false;});return true;
}
async function finish(world,result){
 if(result==='lose'){
  if(SHIP_MAPS.includes(world.mapId)){healParty();world.enter('shipLounge',16,9,'up');await ui.say(['船の看護師が ガオンを回復してくれた。']);}
  else await world.blackout();
 }else await world.checkEvolution();await persist();world.resumeBgm();
}
async function ready(){if(State.save.party.some(m=>m.hp>0))return true;await ui.say(['戦えるガオンを 連れてきてね。']);return false;}
export async function voyageNpc(world,n){
 const s=State.save,f=s.flags;
 if(n.script==='voyage:professor'){await professor(world,n);return;}
 if(n.script==='voyage:board'){
  if(!hasShipTicket(s)){await ui.say(['船のチケットを 見せてください。','カラット・エンブレム取得後、','図鑑に15種類 仲間を登録して','カラットタウンのスイスはかせに会いましょう。']);return;}
  if(!boardingOpen()){await ui.say(['今は 船が港にいません。','毎日12時から17時に お越しください。']);return;}
  if(!await ui.ask(['船のチケットを 確認しました。','到着までは 実際の時間で３分です。','乗船しますか？']))return;
  const now=Date.now();s.voyage={from:world.mapId,to:n.destination,departAt:now,arriveAt:now+VOYAGE_MS,arrivalAnnounced:false};
  world.enter('shipDeck',16,20,'up');s.where={map:'shipDeck',x:16,y:20,dir:'up'};f['power:sailed']=true;await persist();await ui.say(['連絡船 出航！','船内には 10人のトレーナーがいます。','ラウンジや客室も 探検してみましょう。']);return;
 }
 if(n.script==='voyage:disembark'){
  if(!s.voyage){await ui.say(['添乗員が 航路を確認している。']);return;}
  if(!voyageDocked(s)){await ui.say(['まだ 航海中です。','到着まで あと'+Math.ceil(voyageRemaining(s)/1000)+'秒です。']);return;}
  const to=s.voyage.to;s.voyage=null;world.enter(to,14,21,'up');s.where={map:to,x:14,y:21,dir:'up'};await persist();await ui.say([to==='resurePort'?'レスレ港へ ようこそ！':'カラット港へ おかえりなさい！',to==='resurePort'?'北の８番道路から レスレタウンへ進めます。':'またの ご乗船をお待ちしています。']);return;
 }
 if(n.script==='voyage:heal'){healParty();await persist();beep('heal');await ui.say(['ガオンを 元気にしておいたわ。','船旅を 楽しんでね。']);return;}
 if(n.script==='voyage:trainer'){
  if(!trainerAvailable(s,n.dailyId)){await ui.say(['今日のバトルは 終わったね。','また明日 勝負しよう！']);return;}
  if(!await ready()||!await ui.ask(['船旅の仲間と バトルしよう！','わたしとは １日１回 勝負できるよ。']))return;
  markTrainer(s,n.dailyId);await persist();const result=await startBattle({trainer:{name:n.name,party:n.dailyTeam,money:420}});await finish(world,result);return;
 }
 if(n.script==='voyage:yanoken'){
  if(f['voyage:yanokenWon']){await ui.say(['いいバトルだったね！','また新しい町で 会えるといいね。']);return;}
  const count=f['voyage:yanokenTalks']=Math.min(3,(f['voyage:yanokenTalks']||0)+1);await persist();
  if(count===1){await ui.say(['久しぶり！ ヤノケンだよ！','あげた図鑑は 役に立っているかな？']);return;}
  if(count===2){await ui.say(['ぼくも 新しいガオンを 仲間にしたんだ。','船に乗って 旅をしているところだよ。']);return;}
  if(!await ready()||!await ui.ask(['お互いのガオンで バトルしてみよう！']))return;
  const result=await startBattle({trainer:{name:'ヤノケン',party:[['コケゴロ',22],['アワミィ',20],['ヨルネコ',24]],money:900}});if(result==='win')f['voyage:yanokenWon']=true;await finish(world,result);return;
 }
 if(n.script==='voyage:daycare'){await daycare(world);}
}
async function daycare(world){
 const s=State.save;
 if(s.daycare){const remaining=daycareRemaining(s);const ready=remaining===0;await ui.say(ready?['同じ種類のガオンが 生まれたよ！','レベル１で 特別な技を覚えているよ。']:['元気に お世話しているよ。','生まれるまで あと'+remaining+'歩だよ。']);
  const action=await ui.choice([ready?'３匹を受け取る':'親２匹を引き取る','戻る'],{rows:2});if(action!==0)return;
  if(!ready&&!await ui.ask(['まだ 赤ちゃんは生まれていないよ。','引き取ると 今回の歩数はリセットされる。','それでも 引き取る？']))return;
  const returned=reclaimDaycare(s,ready);if(!returned)return;
  if(ready){const baby=returned.at(-1);ownMon(baby.sp);await persist();beep('levelup');await ui.say([baby.sp+' Lv.1を 受け取った！','特別な技：'+baby.eggMove,'親２匹も お返ししたよ。','手持ちに入らないガオンは ボックスに送ったよ。']);}else{await persist();await ui.say(['親２匹を お返ししたよ。']);}return;
 }
 await ui.say(['ぼくは 育て屋のマリオ。','同じ種類のガオンを ２匹預けてね。','2000歩歩くと 同じ種類のLv.1が生まれるよ。','普段のレベルアップでは 覚えない技を覚えるよ。']);
 const groups=eligiblePairs(s);if(!groups.length){await ui.say(['手持ちかボックスに 同じ種類を２匹用意してね。']);return;}
 const chosen=await ui.choice([...groups.map(([sp])=>sp),'戻る'],{rows:6});if(chosen<0||chosen>=groups.length)return;
 let available=groups[chosen][1],refs=[];for(let i=0;i<2;i++){const ix=await ui.choice(available.map(r=>(r.collection==='party'?'手持ち ':'ボックス ')+(r.mon.nick||r.mon.sp)+' Lv.'+r.mon.lv),{rows:6});if(ix<0)return;refs.push(available[ix]);available=available.filter((_,j)=>j!==ix);}
 const error=checkParents(s,refs);if(error){await ui.say([error]);return;}
 if(!await ui.ask([refs.map(r=>(r.mon.nick||r.mon.sp)+' Lv.'+r.mon.lv).join(' と '),'この２匹を 預けますか？']))return;
 const baby=makeMon(refs[0].mon.sp,1),pool=eggMoves(baby.sp),extra=pool[Math.floor(Math.random()*pool.length)];baby.moves=baby.moves.slice(0,3);baby.moves.push(newMove(extra));baby.eggMove=extra;
 const failed=depositParents(s,refs,baby);if(failed){await ui.say([failed]);return;}await persist();await ui.say(['大切に 預かるよ。','2000歩歩いたら また来てね。']);
}
