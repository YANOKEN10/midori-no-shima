// Only explicitly authored residents and ordinary trainers may vary their dialogue.
// Quest actors, services and unclassified information providers keep their original text.
const residents={
 'village:庭しごとの人':[['今朝は 花だんの土を ほぐしたの。','根っこも 気持ちよさそうね。'],['ガオンが 花のにおいを かいでいたの。','気に入った花が あるのかしら。'],['水やりのあとの 土のにおいが好き。'],['花がひとつ咲くと 庭が明るくなるね。']],
 'village:村の少年':[['ガオンと かけっこをしたんだ。','ぼくより ずっと速かったよ！'],['木の葉で 小さな船を作ったんだ。'],['おやつの時間になると','ガオンも そわそわするんだよ。'],['いつか 町の外も 旅してみたいな。']],
 'village:散歩中のおばあさん':[['木かげで休むと 風が心地よいねえ。'],['昔から この村の緑が 大好きなの。'],['散歩の途中で 小さな花を見つけたよ。'],['急がず歩くと いろんな音が聞こえるね。']],
 'rods:買い物帰りの人':[['買い物のあとは 少し寄り道するの。'],['荷物を詰めるのって むずかしいね。','つい あれもこれも持ちたくなるの。'],['家に帰ったら ガオンとひと休みよ。']],
 'rods:町の女の子':[['旅の話を聞くのが 大好きなの。'],['今日は どんなガオンに会った？'],['ガオンと歩くと いつもの町も楽しいね。'],['窓から 町を眺めるのが好きなんだ。']],
 'rods:花を育てるおじいさん':[['つぼみが 少しふくらんできたぞ。'],['花の世話は 毎日の楽しみなんじゃ。'],['ガオンが 庭で昼寝をしておった。','起こさぬように そっと歩いたよ。']],
 'rods:旅支度の女の子':[['旅の荷物を 何度も確認しちゃうの。'],['知らない町へ行くのは わくわくするね。'],['仲間と一緒なら 道中も楽しいよね。']],
 'marine:船乗り':[['潮風を感じると 落ち着くんだ。'],['桟橋に 波が当たる音を聞いてごらん。'],['船のロープを 結び直してきたところさ。'],['海の色は 眺めるたびに違って見えるな。']],
 'karat:花職人':[['花の色を組み合わせるのが 楽しいの。'],['花びらを 傷めないように お世話するよ。'],['ガオンも 花畑を気に入っているみたい。'],['小さなつぼみを見つけると うれしくなるね。']],
 'karat:町の女の子':[['お気に入りの花を 眺めていたんだ。'],['この町は 散歩するのが楽しいね。'],['花畑の色を 絵に描いてみたいな。']],
 'resure:レスレタウンの人':[['旅の荷物をおろして ひと息ついてね。'],['知らない町の話を聞くのは 楽しいね。'],['ガオンと歩いている姿って いいものだね。'],['今日は ゆっくり町を歩いてみようかな。']]
};
const histories=new WeakMap();
function choose(save,key,choices){
 let memory=histories.get(save);if(!memory){memory=new Map();histories.set(save,memory);}
 let state=memory.get(key);if(!state){state={bag:[],last:-1,first:true};memory.set(key,state);}
 if(state.first){state.first=false;state.last=0;return [...choices[0]];}
 if(!state.bag.length){state.bag=choices.map((_,i)=>i).filter(i=>i!==state.last);for(let i=state.bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.bag[i],state.bag[j]]=[state.bag[j],state.bag[i]];}}
 const index=state.bag.pop();state.last=index;return [...choices[index]];
}
export function npcDialogue(save,mapId,n,phase='talk',fallback=n[phase]){
 const base=fallback||['こんにちは。'];
 if(n.fixedDialogue||n.healAll||n.heal||n.shop||n.clothes||n.salon||n.trainer?.leader||n.trainer?.champ||n.trainer?.major)return base;
 if(n.script&&n.script!=='voyage:trainer')return base;
 let alternatives;
 if(n.trainer||n.script==='voyage:trainer'){
  const species=(n.trainer?.party||n.dailyTeam)?.[0]?.[0]||'ガオン';
  if(phase==='talk')alternatives=[['仲間との息は ぴったりだよ！','さあ 勝負しよう！'],[species+'と 一緒に練習してきたよ。','その成果を 見せるね！'],['きみのガオンは 強そうだね。','ぼくたちも 負けないよ！']];
  if(phase==='win')alternatives=[['いい動きだったね！','ぼくたちも もっと練習しよう。'],['仲間を信じているのが 伝わったよ。'],['最後まで わくわくする勝負だったね！']];
  if(phase==='after')alternatives=[['さっきの勝負を 思い返していたんだ。','次の練習で 試したいことができたよ。'],[species+'と 少し休憩しているよ。'],['技を出すタイミングって 大切だね。'],[mapId.startsWith('ship')?'船旅で いろんな相手に会えて楽しいよ。':mapId==='natureforest'?'森の木かげは 休むのにぴったりだね。':'旅の途中の勝負は 良い思い出になるね。']];
 }else alternatives=residents[mapId+':'+n.name];
 if(!alternatives?.length)return base;
 return choose(save,mapId+':'+(n.dailyId??n.idx??n.name)+':'+phase,[base,...alternatives]);
}

// Explicit exception requested for Yanoken after his fixed introduction.
export function yanokenGreeting(save){
 return choose(save,'yanoken:greeting',[
  ['オッス！元気？'],['また会えたね！'],['今日はいい日になるさ！'],
  ['ガオンたちは元気にしてる？'],['キミと話すと、僕も元気が出るよ！'],
  ['僕もガオンの研究をがんばっているよ！']
 ]);
}
