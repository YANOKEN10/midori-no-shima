import {powerTarget} from './powerRules.js';
import {G as State,makeMon} from './state.js';
import {ui} from './ui.js';
import {startBattle} from './battle.js';
import {saveLocal,saveCloud} from './save.js';
import {cloud} from './cloud.js';
import {playBgm,beep} from './audio.js';
import {MARINE_EMBLEM,MERORON_BATTLE,trialCount,meroronAvailable,markMeroronDay,marineVisible} from './marineRules.js';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
export function refreshMarineNpcs(world){for(const n of world.npcs)if(n.script?.startsWith('marine:'))n.gone=!marineVisible(n,State.save);}
export async function marineNpc(world,n){
 const s=State.save,f=s.flags;
 if(n.script==='marine:guide'){
  await ui.say(f['marine:passed']?['マリンエンブレムは 君の実力の証だ。','５番道路の工事も 終わったよ。','カラットタウンへ 進んでみよう。']:['エンブレムは 全部で７つと いわれている。','優れたガオンのトレーナーに 贈られる証だ。','北の４番道路から はなれの湖へ行こう。','西岸の桟橋を渡り 中央の島へ。','木のそばの宝箱を開けると 試験が始まる。']);return;
 }
 if(n.script==='marine:works'){await ui.say(['５番道路は 工事中だ。','エンブレム・テストに 合格する頃には','カラットタウンへの道を 開けておくよ。']);return;}
 if(n.script==='marine:chest'){
  if(f['marine:passed']){await ui.say(['試験を乗り越えた 証が刻まれている。','マリンエンブレムは 君のものだ。']);return;}
  if(!f['marine:started']){f['marine:started']=true;await persist();await ui.say(['宝箱の中に 試験の巻物がある。','湖の四隅にいる カニポン４体に勝とう。','４体とも レベル８だ。','倒したら この島に戻ってくること。']);}
  else await ui.say(['カニポンに勝った数：'+trialCount(s)+'／４',trialCount(s)===4?'村長エビゲルが 島で待っている。':'湖の四隅の草むらの近くを さがそう。']);
  refreshMarineNpcs(world);return;
 }
 if(n.script==='marine:crab'){
  if(!f['marine:started']){await ui.say(['カニポンは 草むらのそばを歩いている。','まずは 島の宝箱を調べよう。']);return;}
  if(f['marine:crab:'+n.crab])return;
  if(!s.party.some(m=>m.hp>0)){await ui.say(['戦えるガオンを 連れてこよう。']);return;}
  await ui.say(['試験のカニポンが 向かってきた！']);s.battleTerrain='river';
  const result=await startBattle({wild:makeMon('カニポン',8),captureDisabled:true});
  if(result==='win'){f['marine:crab:'+n.crab]=true;await persist();refreshMarineNpcs(world);await ui.say(['カニポンに 勝った！ '+trialCount(s)+'／４',trialCount(s)===4?'中央の島へ 戻ろう。':'残りのカニポンを さがそう。']);}
  if(result==='lose'){await world.blackout();return;}await world.checkEvolution();await persist();playBgm('town');return;
 }
 if(n.script==='marine:elder'){
  if(f['marine:passed']){await ui.say(['君は 立派なガオンのトレーナーだ！','５番道路から 次の町へ進もう。']);return;}
  if(trialCount(s)!==4)return;
  if(!s.party.some(m=>m.hp>0)){await ui.say(['仲間を 回復させておいで。']);return;}
  await ui.say(['わしは マリンタウンの村長 エビゲル。','４体に勝ったようだな。','最後は わしとのガオンバトルだ！']);s.battleTerrain='river';
  const result=await startBattle({trainer:{name:'村長 エビゲル',party:[['カニポン',8],['サカナビ',10],['ミナモリス',12]],money:720,leader:MARINE_EMBLEM}});
  if(result==='win'){f['marine:passed']=true;if(!s.badges.includes(MARINE_EMBLEM))s.badges.push(MARINE_EMBLEM);s.bag[MARINE_EMBLEM]=1;await persist();beep('levelup');await ui.say(['エンブレム・テスト 合格！','マリンエンブレムを 手に入れた！','５番道路の工事が 終わった。','カラットタウンへ 進めるようになった！']);}
  if(result==='lose'){await world.blackout();return;}await world.checkEvolution();await persist();playBgm('town');return;
 }
 if(n.script==='marine:meroron'){
  if(!meroronAvailable(s))return;
  markMeroronDay(s);await persist(); // Consume the visit before battle, including reloads and losses.
  s.battleTerrain='grass';const result=await startBattle({wild:makeMon('メロロン',30),...MERORON_BATTLE});
  markMeroronDay(s);await persist();refreshMarineNpcs(world);
  if(result==='lose'){await world.blackout();return;}await world.checkEvolution();await persist();playBgm('town');
  if(result!=='caught')await ui.say(['メロロンは 森の奥に姿を消した。','また明日の夕方に 会えるかもしれない。']);
 }
}
export function marineObjective(save){
 if(save.flags?.['marine:passed'])return powerTarget(save).name;
 if(!save.flags?.['marine:started'])return 'マリンタウンから 湖の中央島へ';
 const n=trialCount(save);return n<4?'湖のカニポンに勝とう '+n+'／４':'中央の島で エビゲルに挑もう';
}
