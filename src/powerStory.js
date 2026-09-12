import {G as State,makeMon} from './state.js';
import {ui} from './ui.js';
import {startBattle} from './battle.js';
import {saveLocal,saveCloud} from './save.js';
import {cloud} from './cloud.js';
import {beep} from './audio.js';
import {KARAT_EMBLEM,RAIMEI_BATTLE,powerOutage,powerVisible,raimeiAvailable,markRaimeiVisit} from './powerRules.js';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
export function refreshPowerNpcs(world){for(const n of world.npcs)if(n.script?.startsWith('power:')){n.gone=!powerVisible(n,State.save);if(n.script==='power:director'){n.x=State.save.flags['power:director']?19:17;n.y=14;}}}
async function canBattle(){if(State.save.party.some(m=>m.hp>0))return true;await ui.say(['戦えるガオンを 連れてこよう。']);return false;}
async function finish(world,result){if(result==='lose'){await world.blackout();return;}await world.checkEvolution();await persist();world.resumeBgm();}
export async function powerNpc(world,n){
 const s=State.save,f=s.flags;
 if(n.script==='power:guide'){
  f['power:briefed']=true;await persist();
  await ui.say(f['power:passed']?['カラット・エンブレムを 手に入れたね！','東の７番道路から カラット港へ。','船で レスレ港へ渡れるよ。']:['ここは 花の町 カラットタウン。','次の試験は ラーデン発電所だよ。','北の６番道路を 進んでみよう。','所長のジネルさんが 待っている。','合格したら この町のスイスはかせに 会おう。']);return;
 }
 if(n.script==='power:director'){
  if(f['power:passed']){await ui.say(['電気も戻って 花の町も元気になった。','連絡船で レスレタウンへ進みたまえ。']);return;}
  if(f['power:restored']){f['power:passed']=true;if(!s.badges.includes(KARAT_EMBLEM))s.badges.push(KARAT_EMBLEM);s.bag[KARAT_EMBLEM]=1;await persist();beep('levelup');refreshPowerNpcs(world);await ui.say(['見事な試験だった！','カラット・エンブレムを 手に入れた！','カラットタウンへ 戻ってみたまえ。','スイスはかせが 町に来ているそうだ。']);return;}
  if(f['power:director']){await ui.say(powerOutage(s)?['停電の原因は ライメイのようだ。','外にいる ライメイを倒そう！']:['機械室の奥に 宝箱がある。','そこまで たどり着いてみたまえ。','奥の非常口から すぐ外へ出られる。']);return;}
  if(!await canBattle())return;await ui.say(['私は 発電所の所長 ジネルだ。','中へ入る前に 君の力を見せてくれ！']);
  const result=await startBattle({trainer:{name:'所長 ジネル',major:true,party:[['ビリタマ',16],['ビリボール',18],['コンセン',26]],money:1300}});
  if(result==='win'){f['power:director']=true;f['power:briefed']=true;await persist();refreshPowerNpcs(world);await ui.say(['よし 中へ入っていいぞ。','機械室の奥の宝箱を 調べてみたまえ。']);}await finish(world,result);return;
 }
 if(n.script==='power:chest'){
  if(!f['power:director'])return;
  if(f['power:restored']){await ui.say(['制御装置は 正常に動いている。']);return;}
  if(!f['power:outage']){f['power:outage']=true;await persist();beep('error');await ui.say(['宝箱を 開いた！','突然 電気が消えてしまった……。','外から 激しい雨と 雷の音がする。','すぐ近くの 非常口から 外へ出よう。']);}
  else await ui.say(['発電所は 停電している。','近くの非常口から 外を確かめよう。']);return;
 }
 if(n.script==='power:storyRaimei'){
  if(!powerOutage(s)||!await canBattle())return;
  await ui.say(['激しい雷の中に ライメイがいる！','ライメイの暴走を 止めよう！']);
  const result=await startBattle({wild:makeMon('ライメイ',20),captureDisabled:true,escapeDisabled:true,emblemTest:true});
  if(result==='win'){f['power:restored']=true;await persist();refreshPowerNpcs(world);await ui.say(['ライメイは 空へ去っていった。','電気が戻り 雨もやんだ！','ジネル所長に 報告しよう。']);}await finish(world,result);return;
 }
 if(n.script==='power:weeklyRaimei'){
  if(!raimeiAvailable(s)||!await canBattle())return;
  markRaimeiVisit(s);await persist();
  const result=await startBattle({wild:makeMon('ライメイ',20),...RAIMEI_BATTLE});await persist();refreshPowerNpcs(world);await finish(world,result);
  if(result!=='caught'&&result!=='lose')await ui.say(['ライメイは 空へ姿を消した。','次の週の 同じ時間に また会えるだろう。']);return;
 }

}
