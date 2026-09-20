import {EXTRA_MOVES92,MOVE_FORMS92} from './moves92.mjs';
// Anatomical profiles use stable species numbers so renamed saves share the same rules.
const GROUPS=[
[[166,167,168],"floating cloud rings","wing mist rain voice","でんき"],
[[169,170,171],"living stained glass","blade spike beam","でんき"],
[[172,173,174],"resonance and bells","voice fist beam","じめん"],
[[175,176,177],"folded dreams","mist drain voice","くさ"],
[[178,179,180],"ink and negative space","thread mist drain breath","ほのお"],
[[181,182,183],"living folded lanterns","blade spike roll thread","じめん"],
[[184,185,186],"liquid orbits","wing spike tail mist","でんき"],
[[187,188,189],"weathered clockwork space","fist blade spike roll","ひかり"],
[[190,191,192],"floating seed architecture","spike breath thread drain","みず"],
[[193,194,195],"levitating ancient geometry","horn fist stomp breath","ひかり"],
[[196,197,198],"contained aurora energy","blade spike beam fist","やみ"],
[[199],"soft orbit confection","roll voice mist","くさ みず"],
[[200],"folded pocket of space","blade breath mist drain","みず"],
 [[1,2,3], '芽と葉で光を集める', 'tail claw', 'ひかり'],
 [[4,5,6,51,52,53], '炎をまとう鳥の翼と鋭い足', 'wing claw kick tail', 'ひかり'],
 [[7,8,9,56,57,58,59,60,61,71,150,152], '水を操る体と泳ぐヒレ', 'tail wing breath', 'ひかり みず'],
 [[10,11,164], '金色の毛と力強い手足をもつ炎の猿', 'fist kick tail claw', 'ほのお ひかり'],
 [[12,13,78,79,80], '翼で風や砂を巻き上げる鳥', 'wing claw kick tail', 'じめん ひかり'],
 [[14,107,134], '糸と繭で身を守る虫', 'thread roll', 'くさ やみ'],
 [[15,104,105,106], '角と刃のような腕をもつ甲虫', 'horn blade claw kick spike', 'じめん ひかり'],
 [[16,17,75,76,77,85], '電気を帯びる獣の爪と牙', 'claw fang tail kick', 'やみ ひかり'],
 [[18,19,97,98], '地面を掘る爪とドリル', 'claw horn', 'やみ'],
 [[20,149], '滑空する飛膜と長い尾', 'wing tail claw', 'やみ ひかり'],
 [[21,22,131,132,163], '夜を駆ける小獣の爪と尾', 'claw fang tail kick', 'ひかり'],
 [[23], '沼で暮らす大きなカエルの足と声', 'kick stomp voice', 'じめん'],
 [[24,25,26], '巻き殻と水分を蓄えるつる', 'thread roll drain', 'みず じめん'],
 [[27,28,29,37], '花と蜜を使い光や水を蓄える', 'drain mist rain', 'ひかり みず'],
 [[30,31,32,39], '森の木陰で眠りの粉を出す', 'mist drain', 'やみ'],
 [[33,34], '雪をかき分ける牙と厚い体', 'fang horn stomp', 'じめん みず'],
 [[35,36], '苔をまとう岩の体', 'stomp fist roll', 'じめん くさ'],
 [[38,108,109,115,116,158], '光る葉や花のような羽と鱗粉', 'wing mist thread', 'ひかり くさ'],
 [[40,41,42,46,47,48,133], '闇を照らす浮遊する炎', 'mist drain', 'やみ ひかり'],
 [[43,44,45], '炎の獣の牙としっぽ', 'fang claw tail stomp', 'やみ じめん'],
 [[49,50,54,55], '灼熱の岩や溶岩をまとう体', 'stomp fist horn', 'じめん ほのお'],
 [[62,63,64], '岩も砕くハサミと硬い甲羅', 'blade claw', 'むし じめん'],
 [[65,66], 'しびれる触手と発光する体', 'thread drain mist', 'でんき ひかり'],
 [[67,68], '冷たい体から吐く凍える息', 'breath mist', 'ひかり'],
 [[69], '貝殻の盾と潮のマント', 'fist stomp', 'じめん ひかり'],
 [[70], '泳ぐリスのリボン状の尾', 'tail claw kick', 'くさ ひかり'],
 [[72,73,74,81,82,86], '電気を蓄える丸い体や導線', 'roll thread', 'ひかり'],
 [[83,84], '電気を蓄えて鳴らす虫の羽', 'wing voice', 'むし ひかり'],
 [[87], '夜空に雷鳴を響かせる', 'voice wing', 'やみ ひかり'],
 [[88,89,90], '指と足と尾で振動を伝える', 'fist stomp tail voice', 'ひかり'],
 [[91,92,93,102,103], '重い岩の甲冑とこぶし', 'fist stomp roll', 'ひかり'],
 [[94,95,96], '砂を掘る甲羅の虫', 'claw horn spike', 'むし じめん'],
 [[99,100], '古代の骨と硬い化石の体', 'fang claw horn', 'やみ'],
 [[101], '湿った泥と沼の力', 'mist drain', 'みず くさ'],
 [[110,111,112], '暗がりに張る糸と蜘蛛の脚', 'thread fang spike', 'やみ'],
 [[113,114,157], '真珠色の体と花びら状の尾びれ', 'tail wing mist', 'みず ひかり'],
 [[117,142,143,144,159,160], '竜の翼と尾と力強い息', 'wing tail claw horn breath', 'ほのお ひかり'],
 [[118,154,155], '葉のような腕と身軽な脚', 'blade kick', 'くさ やみ'],
 [[119,161,162], '金属の四肢と電気の動力', 'stomp claw', 'でんき じめん'],
 [[120,121,122,123,124,125,129,130,135,156], '影に潜む体と不思議な炎', 'mist drain fist', 'ほのお ひかり'],
 [[126,127,128], '夜空を静かに飛ぶ鳥', 'wing claw voice', 'ひかり'],
 [[136,137,138], '丸い体と柔らかな毛', 'roll fist stomp', 'くさ'],
 [[139,140,141], '月明かりを映す毛と跳ぶ後ろ足', 'kick claw tail', 'やみ'],
 [[145,146,165], '研ぎ澄ました腕のヒレと刃', 'blade wing tail kick', 'みず むし'],
 [[147,148,151], '仲間を守る獣の牙と前足', 'fang claw tail stomp', 'じめん'],
 [[153], '虹色の角と森を守る力', 'horn stomp', 'くさ ひかり']
];
export const APPEARANCE_PROFILES92=Object.fromEntries(GROUPS.flatMap(([ids,reason,forms,cross])=>ids.map(id=>[id,{reason,forms:['body','orb','beam','aura','voice','rain','mist','drain',...forms.split(' ')],cross:cross.split(' ')}])));
export const LEARNSET_NOTES92={};
export function expandLearnsets92(species,moves){
 const usage=new Map();
 for(const [name,sp] of Object.entries(species).sort((a,b)=>a[1].no-b[1].no)){
  const profile=APPEARANCE_PROFILES92[sp.no];if(!profile)throw Error('Missing appearance profile '+name);
  const seen=new Set(),old=[...sp.learn].sort((a,b)=>a[0]-b[0]).filter(([,n])=>!seen.has(n)&&seen.add(n));
  const additions=[],physical=sp.base.atk>=sp.base.spc;
  const candidates=Object.keys(EXTRA_MOVES92).filter(n=>profile.forms.includes(MOVE_FORMS92[n]));
  function choose(cross){
   const options=candidates.filter(n=>!seen.has(n)&&(cross? !sp.types.includes(moves[n].type)&&profile.cross.includes(moves[n].type):sp.types.includes(moves[n].type)));
   options.sort((a,b)=>(usage.get(a)||0)-(usage.get(b)||0)+((moves[a].cat==='phys')!==physical?0.4:0)-((moves[b].cat==='phys')!==physical?0.4:0)||a.localeCompare(b,'ja'));
   const n=options[0];if(!n)return false;
   seen.add(n);usage.set(n,(usage.get(n)||0)+1);additions.push(n);return true;
  }
  for(let i=0;i<4;i++)choose(true);
  while(old.length+additions.length<20)if(!choose(false)&&!choose(true))throw Error('Insufficient matching moves '+name);
  additions.sort((a,b)=>moves[a].pow-moves[b].pow||a.localeCompare(b,'ja'));
  sp.learn=[...old,...additions.map((n,i)=>[Math.max(6+Math.round(i*54/Math.max(1,additions.length-1)),moves[n].pow>=100?60:moves[n].pow>=80?35:moves[n].pow>=60?18:6),n])].sort((a,b)=>a[0]-b[0]);
  LEARNSET_NOTES92[name]={reason:profile.reason,added:additions,offType:additions.filter(n=>!sp.types.includes(moves[n].type))};
 }
}
