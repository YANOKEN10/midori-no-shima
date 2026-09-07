import { ui } from './ui.js';
import { G as State, flag, setFlag, addItem, hasItem, seeMon } from './state.js';
import { saveLocal, saveCloud } from './save.js';
import { cloud } from './cloud.js';
import { beep } from './audio.js';
import { wait } from './battle.js?v=20260907-chapter1';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
export async function chapterNpc(world,n){
 if(n.script==='v5:witness'){
  if(flag('v5:latettSeen')){await ui.say(['ラテットに 会えたんだね！','けんきゅうしせつの スイスはかせにも','教えてあげて！']);return;}
  await ui.say(['山おくで 伝説のガオン','「ラテット」を 見たの！','村の北の道から 山おくへ行けるよ。']);
  setFlag('v5:heardLatett');await persist();return;
 }
 if(n.script==='v5:latett'){
  if(flag('v5:latettSeen'))return;
  await ui.say(['あっ！ 伝説のガオン ラテットだ！']);beep('ok');
  for(let i=0;i<12;i++){n.x+=.25;await wait(55);}n.gone=true;
  seeMon('ラテット');setFlag('v5:latettSeen');await persist();
  await ui.say(['ラテットは すぐに 逃げてしまった。','ネイチャータウンに 戻って','スイスはかせに 知らせよう！']);return;
 }
 if(n.script==='v5:professor'){
  if(!flag('v5:latettSeen')){await ui.say(['わしは スイスはかせ。','村の女の子が ラテットを見たそうじゃ。','話を聞いて 山おくを たずねてごらん。']);return;}
  if(!flag('v5:netGift')){
   await ui.say(['山おくで ラテットに会ったのか！','すぐに 逃げてしまったのじゃな。','ガオンを もっと調べてみないか？','ラグネットを 15個 わたそう。']);
   addItem('ラグネット',15);setFlag('v5:netGift');setFlag('gotNet');beep('levelup');await persist();
   await ui.say(['ラグネットを 15個 もらった！','これで 野生のガオンを つかまえられる。','まずは 1ばんどうろを抜けて','となりの ロッズタウンへ 行ってごらん。']);return;
  }
  await ui.say(['1ばんどうろの草むらで ガオンを','つかまえて ロッズタウンへ行こう。','仲間がいれば バトルで戦えるぞ。']);return;
 }
 if(n.script==='v5:dex'){
  if(!flag('v5:netGift')){await ui.say(['ぼくは ヤノケン！','まずは スイスはかせに 会ってきてね。']);return;}
  if(!flag('v5:dex')){await ui.say(['ぼくは ヤノケン！','この ガオンずかんを あげるよ。']);if(!hasItem('ガオンずかん'))addItem('ガオンずかん');setFlag('v5:dex');beep('levelup');await persist();await ui.say(['ガオンずかんを もらった！','目標は 全部のガオンを 仲間にして','図鑑を 完成させること！','2ばんどうろの先には','ネイチャーのもりが あるよ。']);return;}
  await ui.say(['道路や森で 会えるガオンはちがうよ。','全部の場所を歩いて 図鑑を完成させよう！']);
 }
}
export function chapterObjective(){if(!flag('v5:heardLatett'))return '村の女の子に 話を聞こう';if(!flag('v5:latettSeen'))return '北の山おくで ラテットをさがそう';if(!flag('v5:netGift'))return '研究施設の スイスはかせに報告';if(!flag('v5:dex'))return '1ばんどうろを抜け ロッズタウンへ';return '2ばんどうろと森で 図鑑をふやそう';}
