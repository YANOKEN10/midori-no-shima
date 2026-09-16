import {V63_DESIGNS,V63_ALIASES,V63_DESCRIPTIONS} from './redesignV63.js';
import {V51_DESIGNS,V51_ALIASES,V51_DESCRIPTIONS} from './redesignV51.js';
// Design changes retain original species numbers, battle data and save compatibility.
export const REDESIGNS = [
  {
    "id": 13,
    "name": "ソラハネ",
    "oldName": "ソラハネ"
  },
  {
    "id": 137,
    "name": "マルモコ",
    "oldName": "マルモコ"
  },
  {
    "id": 138,
    "name": "マルガンテ",
    "oldName": "マルガンテ"
  },
  {
    "id": 127,
    "name": "ヨイバネ",
    "oldName": "ミミズク"
  },
  {
    "id": 10,
    "name": "ウロコロ",
    "oldName": "ネズミン"
  },
  {
    "id": 11,
    "name": "ヨロイガル",
    "oldName": "デカネズ"
  },
  {
    "id": 111,
    "name": "アミグモ",
    "oldName": "アミグモ"
  },
  {
    "id": 113,
    "name": "ツノコロ",
    "oldName": "アリンコ"
  },
  {
    "id": 114,
    "name": "ギリザント",
    "oldName": "アリガタ"
  },
  {
    "id": 115,
    "name": "キラル",
    "oldName": "ホタリン"
  },
  {
    "id": 116,
    "name": "ルミナイト",
    "oldName": "ホタルオー"
  },
  {
    "id": 106,
    "name": "オオカブト",
    "oldName": "オオカブト"
  },
  {
    "id": 98,
    "name": "モグドリル",
    "oldName": "モグドリル"
  },
  {
    "id": 94,
    "name": "スナムシ",
    "oldName": "スナムシ"
  },
  {
    "id": 95,
    "name": "サバクムシ",
    "oldName": "サバクムシ"
  },
  {
    "id": 96,
    "name": "サンドキング",
    "oldName": "サンドキング"
  },
  {
    "id": 78,
    "name": "チルスパ",
    "oldName": "ハネデン"
  },
  {
    "id": 79,
    "name": "ライウィル",
    "oldName": "ソラデン"
  },
  {
    "id": 80,
    "name": "ヴォルティア",
    "oldName": "カミナリオ"
  },
  {
    "id": 75,
    "name": "ネコデン",
    "oldName": "ネコデン"
  },
  {
    "id": 76,
    "name": "デンネコ",
    "oldName": "デンネコ"
  },
  {
    "id": 77,
    "name": "ライガミ",
    "oldName": "ライガミ"
  },
  {
    "id": 64,
    "name": "オオハサミ",
    "oldName": "オオハサミ"
  },
  {
    "id": 9,
    "name": "タイダルオ",
    "oldName": "タイダルオ"
  },
  {
    "id": 43,
    "name": "ワンヒノ",
    "oldName": "ワンヒノ"
  },
  {
    "id": 44,
    "name": "ホノワン",
    "oldName": "ホノワン"
  },
  {
    "id": 45,
    "name": "グレンケン",
    "oldName": "グレンケン"
  },
  {
    "id": 38,
    "name": "カエデリア",
    "oldName": "リボネム"
  },
  {
    "id": 33,
    "name": "ウリボン",
    "oldName": "ウリボン"
  },
  {
    "id": 34,
    "name": "ドスウリ",
    "oldName": "ドスウリ"
  },
  {
    "id": 139,
    "name": "ミルピョン",
    "oldName": "ウサポン"
  },
  {
    "id": 140,
    "name": "ラピシア",
    "oldName": "ダッシュサ"
  },
  {
    "id": 141,
    "name": "セレピオン",
    "oldName": "ソニックウサ"
  },
  {
    "id": 142,
    "name": "ドラコル",
    "oldName": "ヒツジン"
  },
  {
    "id": 143,
    "name": "ガルドラン",
    "oldName": "モコヒツジ"
  },
  {
    "id": 144,
    "name": "ヴァルディオ",
    "oldName": "オオモコ"
  },
  {
    "id": 145,
    "name": "アオルカ",
    "oldName": "タヌポン"
  },
  {
    "id": 146,
    "name": "レイザルト",
    "oldName": "バケダヌキ"
  },
  {
    "id": 129,
    "name": "ニヤゴ",
    "oldName": "ドクロン"
  },
  {
    "id": 130,
    "name": "ワルニール",
    "oldName": "ドクロガミ"
  },
  {
    "id": 119,
    "name": "クロムギア",
    "oldName": "クルミグル"
  },
  {
    "id": 118,
    "name": "カゲナギ",
    "oldName": "ハナヤリ"
  },
  {
    "id": 20,
    "name": "ザンガルド",
    "oldName": "スナコロネ"
  }
];
export const SPECIES_RENAMES = {
  "ミミズク": "ヨイバネ",
  "ネズミン": "ウロコロ",
  "デカネズ": "ヨロイガル",
  "アリンコ": "ツノコロ",
  "アリガタ": "ギリザント",
  "ホタリン": "キラル",
  "ホタルオー": "ルミナイト",
  "ハネデン": "チルスパ",
  "ソラデン": "ライウィル",
  "カミナリオ": "ヴォルティア",
  "リボネム": "カエデリア",
  "ウサポン": "ミルピョン",
  "ダッシュサ": "ラピシア",
  "ソニックウサ": "セレピオン",
  "ヒツジン": "ドラコル",
  "モコヒツジ": "ガルドラン",
  "オオモコ": "ヴァルディオ",
  "タヌポン": "アオルカ",
  "バケダヌキ": "レイザルト",
  "ドクロン": "ニヤゴ",
  "ドクロガミ": "ワルニール",
  "クルミグル": "クロムギア",
  "ハナヤリ": "カゲナギ",
  "スナコロネ": "ザンガルド",
  "ライボルト": "ピピピット"
};
for(const row of V51_DESIGNS){const at=REDESIGNS.findIndex(s=>s.id===row.id);if(at<0)REDESIGNS.push(row);else Object.assign(REDESIGNS[at],row);if(row.oldName!==row.name)SPECIES_RENAMES[row.oldName]=row.name;}
Object.assign(SPECIES_RENAMES,V51_ALIASES);
for(const row of V63_DESIGNS){const at=REDESIGNS.findIndex(s=>s.id===row.id);if(at<0)REDESIGNS.push({...row,revision63:true});else Object.assign(REDESIGNS[at],row,{revision63:true});if(row.oldName!==row.name)SPECIES_RENAMES[row.oldName]=row.name;}
Object.assign(SPECIES_RENAMES,V63_ALIASES);
for(const key of Object.keys(SPECIES_RENAMES)){let n=SPECIES_RENAMES[key],seen=new Set([key]);while(SPECIES_RENAMES[n]&&!seen.has(n)){seen.add(n);n=SPECIES_RENAMES[n];}SPECIES_RENAMES[key]=n;}
export const canonicalName = name => SPECIES_RENAMES[name] || name;
const OLD_NAMES=Object.fromEntries(REDESIGNS.map(s=>[s.name,s.oldName]));
export const legacyName = name => OLD_NAMES[name] || name;
export const REVISED_IDS = new Set(REDESIGNS.map(s=>s.id));
export function applySpeciesRedesign(S){
 for(const [oldName,newName] of Object.entries(SPECIES_RENAMES)){
  const value=S[oldName]||S[newName];if(!value)throw Error("Invalid redesign name: "+oldName);
  S[newName]=value;delete S[oldName];
  Object.defineProperty(S,oldName,{value,enumerable:false,configurable:true});
 }
 for(const s of Object.values(S))if(s.evo)s.evo.to=canonicalName(s.evo.to);
 for(const[name,text]of Object.entries({...REDESIGN_DESCRIPTIONS,...V51_DESCRIPTIONS,...V63_DESCRIPTIONS}))if(S[canonicalName(name)])S[canonicalName(name)].dex=text;
 Object.assign(S['カゲナギ'].base,{atk:120,hp:80});
 Object.assign(S['ワルニール'].base,{spc:130,atk:74,spd:100,sdef:74});
}
export function applyArtRedesign(files,view){
 for(const row of REDESIGNS){const url="../../assets/monsters/"+(row.revision63?"redesign-v63/":row.redesign?"redesign-v51/":"redesign-v47/")+view+"/"+String(row.id).padStart(3,"0")+".png";files[row.name]=url;if(row.oldName!==row.name){delete files[row.oldName];Object.defineProperty(files,row.oldName,{value:url,enumerable:false});}}
 for(const[oldName,newName]of Object.entries(SPECIES_RENAMES)){if(!files[newName]&&files[oldName])files[newName]=files[oldName];if(!files[oldName]&&files[newName])Object.defineProperty(files,oldName,{value:files[newName],enumerable:false});}
}

export const REDESIGN_DESCRIPTIONS = {
  "ウロコロ": "うろこの しっぽで 体を つつむ。じょうぶな つめで 木の根もとを ほる。",
  "ヨロイガル": "かさなった うろこで なかまを まもる。大きな つめで かたい 土を きりひらく。",
  "ヨイバネ": "白い 顔のもようが ひろがりはじめた。はね音を たてずに 夜の森を わたる。",
  "ツノコロ": "ながい しょっかくで 木の中の 音を さぐる。小さな あごで かたい 枝を かじる。",
  "ギリザント": "しまもようの しょっかくを ひろげる。つよい あごで 森に 道を つくる。",
  "キラル": "夜になると はねの しずくもようが 光る。小さな 電気を ためこんでいる。",
  "ルミナイト": "はねの 金色の すじに 電気が ながれる。夜空を ゆうがに とびまわる。",
  "チルスパ": "ふわふわの 羽に 電気を ためる。元気に はばたくと 小さな 火花が ちる。",
  "ライウィル": "二またの 尾で 風を とらえる。青い羽を ひろげて 空を すばやく かける。",
  "ヴォルティア": "金色の 冠羽が 雷雲の 電気を とらえる。大きな 青い翼で 空を わたる。",
  "カエデリア": "かえでの種に 似た羽で 風にのる。葉のすじから 森の光を たくわえる。",
  "ミルピョン": "まるい 後ろ足で ぴょんと はねる。銀色の 毛は 月明かりで やわらかく 光る。",
  "ラピシア": "長い耳で 風の流れを よみとる。しなやかな 足で 岩場も かけぬける。",
  "セレピオン": "銀白の たてがみを なびかせる。力強い 後ろ足で 夜の野原を 一息に こえる。",
  "ドラコル": "まだ小さな 翼の芽を もつ。青い うろこの下に 大きな力を たくわえる。",
  "ガルドラン": "銀色の こうらの下で 翼が そだつ。じょうぶな 足で 進化の日を まつ。",
  "ヴァルディオ": "赤銅色の 大きな翼で 空を わたる。銀色の うろこを もつ 誇り高い りゅう。",
  "アオルカ": "青い 腕のひれを といでいる。小さな体でも 勇気を もって 仲間を まもる。",
  "レイザルト": "青白く すんだ 腕の刃を ひろげる。むだのない 動きで 仲間を 守りぬく。",
  "ニヤゴ": "にやりと 笑って かくれる。びっくりした 顔を 見るのが 大すき。",
  "ワルニール": "いたずらが せいこうすると 大きく 笑う。つよがるけれど 仲間思いの ゴースト。",
  "クロムギア": "四本の 金属の足で 大地を とらえる。青い 装甲の中で 動力が ひびく。",
  "カゲナギ": "木かげから 音もなく とびだす。青緑の 腕で すばやく 相手の動きを とめる。",
  "ザンガルド": "赤黒い 装甲と 大きなハサミを もつ。じょうぶな 六本の足で 大地を とらえる。",
  "ウリボン": "厚い 白い毛が 雪山の寒さを ふせぐ。短い牙で 雪の下の 根を さがす。",
  "ドスウリ": "氷のような目と 大きな牙を もつ。ふかい 雪を 力強く かきわけて 進む。",
  "スナムシ": "青緑の こうらで 砂の熱を ふせぐ。小さな前足で 砂を ほりすすむ。",
  "サバクムシ": "赤銅色の ふちを もつ こうらが かさなる。力強い 前足で 砂に もぐる。",
  "サンドキング": "大きな こうらと 王冠のような角を もつ。砂の流れを よんで 地中を すすむ。",
  "ネコデン": "青い 耳の毛に 電気を ためる。小さなしっぽが ぴんと立つと 元気な あかし。",
  "デンネコ": "青白い しまもように 電気が はしる。しなやかな足で 木々を かけぬける。",
  "ライガミ": "雷を 思わせる たてがみを もつ。大きな前足で 仲間を 守る 誇り高い ガオン。",
  "マルモコ": "まるい耳と ふわふわの えり毛を もつ。大きくなっても 人なつこい。",
  "マルガンテ": "大きな体を やわらかな毛が つつむ。まるい耳で 仲間の声を 聞きわける。"
};
