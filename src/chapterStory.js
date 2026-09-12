import {frontierTarget} from './frontierRules.js';
import {yanokenGreeting} from './npcDialogue.js';
import {marineObjective} from './marineStory.js';
import { ui } from './ui.js';
import { G as State, flag, setFlag, addItem, hasItem, seeMon, healParty } from './state.js';
import { saveLocal, saveCloud } from './save.js';
import { cloud } from './cloud.js';
import { beep } from './audio.js';
async function persist(){saveLocal();if(cloud.signedIn)await saveCloud(true);}
export async function chapterNpc(world,n){
 if(n.script==='v5:mother'){
  const lines=flag('v5:dex')?['図鑑は どれくらい埋まった？','みんなと 一緒に休んでいってね。']:flag('v5:netGift')?['いよいよ 旅立ちね。','仲間のガオンを 大切にしてね。']:flag('v5:latettSeen')?['おかえり。山おくは どうだった？','見たことを はかせにも 教えてあげて。']:flag('v5:heardLatett')?['山おくへ 行くのね。','気をつけて 行ってらっしゃい。']:['おはよう！ 今日はいい天気ね。','村を歩いて みんなと話してみたら？'];
  await ui.say(lines);if(await ui.ask(['家で ゆっくり休んでいく？'])){healParty();beep('heal');await persist();await ui.say(['ゆっくり休んで 元気になった！']);}return;
 }
 if(n.script==='v5:witness'){
  if(flag('v5:dex')){await ui.say(['ガオンずかんを もらったんだね！','どんなガオンに会ったか また聞かせてね。']);return;}
  if(flag('v5:netGift')){await ui.say(['はかせに 話してきたんだね！','ロッズタウンへの旅 気をつけてね。']);return;}

  if(flag('v5:latettSeen')){await ui.say(['ラテットに 会えたんだね！','けんきゅうしせつの スイスはかせにも','教えてあげて！']);return;}
  await ui.say(['山おくで 伝説のガオン','「ラテット」を 見たの！','村の北の道から 山おくへ行けるよ。']);
  setFlag('v5:heardLatett');await persist();return;
 }
 if(n.script==='v5:latett'){
  if(flag('v5:latettSeen'))return;
  await ui.say(['あっ！ 伝説のガオン ラテットだ！']);beep('ok');
  n.gone=true;
  seeMon('ラテット');setFlag('v5:latettSeen');await persist();
  await ui.say(['ラテットは その場で パッと消えた。','ネイチャータウンに 戻って','スイスはかせに 知らせよう！']);return;
 }
 if(n.script==='v5:professor'){
  if(!flag('v5:heardLatett')){await ui.say(['わしは スイスはかせ。','ここで ガオンの研究を しておる。','村の人たちと 話してごらん。','おもしろい発見が あるかもしれんぞ。']);return;}
  if(!flag('v5:latettSeen')){await ui.say(['女の子から ラテットの話を聞いたのか。','山おくで 会えるとよいのう。','何か分かったら 教えておくれ。']);return;}
  if(!flag('v5:netGift')){
   await ui.say(['山おくで ラテットに会ったのか！','すぐに 逃げてしまったのじゃな。','ガオンを もっと調べてみないか？','ラグネットを 15個 わたそう。']);
   addItem('ラグネット',15);setFlag('v5:netGift');setFlag('gotNet');beep('levelup');await persist();
   await ui.say(['ラグネットを 15個 もらった！','これで 野生のガオンを つかまえられる。','まずは 1ばんどうろを抜けて','となりの ロッズタウンへ 行ってごらん。']);return;
  }
  if(flag('v5:dex')){await ui.say(['図鑑を もらったそうじゃな！','道路や森の いろいろなガオンを','仲間にして 図鑑を完成させよう。']);return;}
  await ui.say(['1ばんどうろの草むらで ガオンを','つかまえて ロッズタウンへ行こう。','仲間がいれば バトルで戦えるぞ。']);return;
 }
 if(n.script==='v5:dex'){
  if(!flag('v5:netGift')){await ui.say(['ぼくは ヤノケン！','まずは スイスはかせに 会ってきてね。']);return;}
  if(!flag('v5:dex')){await ui.say(['はじめまして！僕はヤノケンです！','キミはガオントレーナーかな？','僕もガオンを育てて研究しているトレーナーなんだ！','僕が作ったものがあるんだけど使ってみてくれない？','ガオンずかんっていうんだけど、見つけたり捕まえたりしたガオンを登録することができるんだ！','よかったら使ってみてね！','また会えたら、今度はバトルしようぜ！']);if(!hasItem('ガオンずかん'))addItem('ガオンずかん');setFlag('v5:dex');beep('levelup');await persist();await ui.say(['ガオンずかんを もらった！']);return;}
  await ui.say(yanokenGreeting(State.save));
 }
}
export function chapterObjective(){const next=frontierTarget(State.save);if(next)return next.name;if(!flag('v5:heardLatett'))return '村の女の子に 話を聞こう';if(!flag('v5:latettSeen'))return '北の山おくで ラテットをさがそう';if(!flag('v5:netGift'))return '研究施設の スイスはかせに報告';if(!flag('v5:dex'))return '1ばんどうろを抜け ロッズタウンへ';return marineObjective(State.save);}

export function chapterTravelHint(){
 if(!flag('v5:heardLatett'))return ['遠くへ出かける前に 村を歩いて','みんなに 話しかけてみよう。'];
 if(!flag('v5:latettSeen'))return ['女の子の話では ラテットは山おくに。','まずは 村の北から さがしに行こう。'];
 if(!flag('v5:netGift'))return ['山おくで見たことを 研究施設の','スイスはかせに 報告しよう。'];
 if(!flag('v5:dex'))return ['ロッズタウンの ヤノケンに','話しかけてみよう。'];
 return ['仲間のガオンと 冒険を続けよう。'];
}
