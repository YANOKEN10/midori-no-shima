export const MOVES193={
 '陽輪のうた':{type:'ほのお',fx193:{weather:'sun'}},'雨紡ぎのうた':{type:'みず',fx193:{weather:'rain'}},'砂巡りのうた':{type:'じめん',fx193:{weather:'sand'}},'雪灯りのうた':{type:'みず',fx193:{weather:'snow'}},
 '雷庭づくり':{type:'でんき',fx193:{terrain:'electric'}},'星庭づくり':{type:'ひかり',fx193:{terrain:'star'}},'霞庭づくり':{type:'みず',fx193:{terrain:'mist'}},'芽庭づくり':{type:'くさ',fx193:{terrain:'grass'}},
 '逆刻のまど':{type:'やみ',fx193:{room:true}},'剛守の幕':{type:'じめん',fx193:{screen:['phys']}},'霊守の幕':{type:'ひかり',fx193:{screen:['spec']}},'双守の幕':{type:'ひかり',fx193:{screen:['phys','spec']}},
 '棘の敷石':{type:'じめん',fx193:{hazard:true}},'心糸の結び':{type:'ひかり',fx193:{mental:'charm'}},'再演のこだま':{type:'ひかり',fx193:{mental:'encore'}},'技封じの霧':{type:'やみ',fx193:{mental:'disabled'}},'挑みの声':{type:'やみ',fx193:{mental:'taunt'}},'反復封じ':{type:'やみ',fx193:{mental:'torment'}},'性質の結びかえ':{type:'ひかり',fx193:{swapAbility:true}},
 '絡根しばり':{type:'くさ',cat:'phys',pow:35,fx193:{bind:true}},'蓄光砲':{type:'ひかり',cat:'spec',pow:120,charge193:true},'重身プレス':{type:'じめん',cat:'phys',pow:60,weight193:true}
};
for(const m of Object.values(MOVES193)){m.cat||='stat';m.pow||=0;m.acc=100;m.pp=15;m.desc=m.fx193?.weather?'天候を5ターン変える。':m.fx193?.terrain?'場を5ターン変える。':m.fx193?.screen?'対応する攻撃のダメージを5ターン半分にする。':m.fx193?.room?'5ターン、同じ優先度なら遅い側が先に動く。':m.fx193?.hazard?'交代して出た相手へ最大HPの1/8のダメージ。':m.fx193?.bind?'相手を4〜5ターン拘束し、毎ターン最大HPの1/8のダメージ。':m.fx193?.swapAbility?'自分と相手の性質を入れ替える。':m.charge193?'1ターンため、次のターンに攻撃する。':m.weight193?'相手より重いほど威力が上がる。':'相手の行動や使える技を3ターン制限する。';}
