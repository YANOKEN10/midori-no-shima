// Stable numbers and explicit aliases keep existing saves compatible.
export const V63_DESIGNS=[
 {id:10,name:'ヒノマシ',oldName:'ネズミン'}, {id:11,name:'エンラセツ',oldName:'デカネズ'},
 {id:20,name:'ガルウィング',oldName:'スナコロネ'}, {id:117,name:'ソラリュウ',oldName:'カマキリン'},
 {id:104,name:'ムシリン',oldName:'ムシリン'},{id:105,name:'カブトン',oldName:'カブトン'},{id:106,name:'オオカブト',oldName:'オオカブト'},
 {id:154,name:'コノハギ',oldName:'コノハギ'},{id:155,name:'ハヤナギ',oldName:'ハヤナギ'},{id:156,name:'ワルヴェイン',oldName:'ワルヴェイン'}
];
export const V63_IDS=new Set(V63_DESIGNS.map(s=>s.id));
export const V63_ALIASES={'ウロコロ':'ヒノマシ','ヨロイガル':'エンラセツ','アビサージ':'ガルウィング','ザンガルド':'ガルウィング','ヒカリギリ':'ソラリュウ'};
export const V63_DESCRIPTIONS={
 'ヒノマシ':'金色の 頭の毛を 逆立てる。長い尾で 枝につかまり 元気に はねまわる。',
 'エンラセツ':'金色の たてがみを なびかせる。力強い 手足と尾で 仲間を 守る 森の戦士。',
 'ガルウィング':'青緑の 飛膜を ひろげて 滑空する。長い尾で かじをとり 夜の岩場を かけぬける。',
 'ソラリュウ':'やさしい目と 翡翠色の翼を もつ。雲のような 尾をゆらし 迷った旅人を 導く。',
 'コノハギ':'小さな 葉のような腕を ふる。木かげで 静かに 足運びの 練習をする。',
 'ハヤナギ':'伸びた 腕の葉で 風を切る。身軽な動きで 森の枝を すばやく 渡る。',
 'ワルヴェイン':'大きな腕と 青緑の炎を ひろげる。いたずら好きな 笑顔で 仲間の影を 守る。'};
export function addEvolutions63(S){
 const clone=n=>JSON.parse(JSON.stringify(S[n]));
 S['コノハギ']={...clone('カゲナギ'),no:154,base:{hp:42,atk:52,def:35,spc:30,sdef:35,spd:65},catch:190,exp:62,evo:{lv:16,to:'ハヤナギ'},dex:V63_DESCRIPTIONS['コノハギ']};
 S['ハヤナギ']={...clone('カゲナギ'),no:155,base:{hp:60,atk:85,def:48,spc:48,sdef:48,spd:98},catch:90,exp:135,evo:{lv:36,to:'カゲナギ'},dex:V63_DESCRIPTIONS['ハヤナギ']};
 S['ワルヴェイン']={...clone('ワルニール'),no:156,base:{hp:90,atk:85,def:80,spc:150,sdef:90,spd:115},catch:45,exp:240,dex:V63_DESCRIPTIONS['ワルヴェイン']};delete S['ワルヴェイン'].evo;
 S['ワルニール'].evo={lv:42,to:'ワルヴェイン'};
}
