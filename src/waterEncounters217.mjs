// Water-only regional pools; existing explicit workshop settings take precedence.
export const WATER_PROFILES217={
  "village": [
    8,
    12,
    "シズクン",
    "サカナビ",
    "ミズマリ"
  ],
  "rods": [
    10,
    14,
    "カニポン",
    "ミナモン",
    "ツユヒラ"
  ],
  "route2": [
    10,
    14,
    "ツチシミ",
    "シズクン",
    "アマスポ"
  ],
  "shadowDepths": [
    30,
    36,
    "スミル",
    "インクルム",
    "ドロヌマ"
  ],
  "route3": [
    12,
    16,
    "クラゲミ",
    "カニポン",
    "ナミスキ"
  ],
  "marine": [
    14,
    18,
    "シオネ",
    "サカナビ",
    "シオマント"
  ],
  "route4": [
    14,
    18,
    "ミナモン",
    "ミズマリ",
    "ツユヒラ"
  ],
  "remoteLake": [
    16,
    20,
    "ミナモリス",
    "ユラポン",
    "シズクン"
  ],
  "route5": [
    16,
    20,
    "ツチシミ",
    "アマスポ",
    "ミナモン"
  ],
  "route6": [
    18,
    22,
    "シオマント",
    "シオネ",
    "スイスイオ"
  ],
  "raden": [
    18,
    23,
    "ミズマリ",
    "ナミスキ",
    "ラゲドン"
  ],
  "route7": [
    20,
    24,
    "カニポン",
    "シオマント",
    "スキトオラ"
  ],
  "karatPort": [
    20,
    25,
    "ハサミガニ",
    "クラゲミ",
    "シオヒビキ"
  ],
  "resurePort": [
    23,
    28,
    "ラゲドン",
    "スイスイオ",
    "シオユイ"
  ],
  "route8": [
    22,
    27,
    "ミナモン",
    "シミツボ",
    "ツボナミ"
  ],
  "resure": [
    23,
    28,
    "ユラポン",
    "ミナクル",
    "アワムス"
  ],
  "gaonPark": [
    21,
    25,
    "アワムス",
    "カニポン",
    "ツユヒラ"
  ],
  "resureBeach": [
    32,
    38,
    "オオハサミ",
    "ラゲドン",
    "シオコダマ"
  ],
  "belerioPort": [
    36,
    42,
    "スイスイオ",
    "シオヒビキ",
    "ウミムスビ"
  ],
  "belerio": [
    40,
    46,
    "リュウグウ",
    "オオウミオ",
    "タイドリア"
  ],
  "leafTown": [
    40,
    46,
    "アマノスダ",
    "ミナカガミ",
    "ウキリム"
  ],
  "gaonParkWetland": [
    23,
    28,
    "アマスポ",
    "シオユイ",
    "ドロヌマ"
  ],
  "gaonParkHill": [
    24,
    29,
    "ツボナミ",
    "ユキツム",
    "シミツボ"
  ],
  "shadowDepths2": [
    32,
    38,
    "インクルム",
    "ラゲドン",
    "ナミトジ"
  ],
  "shadowDepths3": [
    34,
    40,
    "スミル",
    "ウツロナミ",
    "シミツボ"
  ],
  "shadowDepths4": [
    36,
    42,
    "オボロニカ",
    "ウツワシオ",
    "オオウミオ"
  ],
  "forgottenRuins4": [
    26,
    32,
    "ナミトジ",
    "ドロヌマ",
    "スキトオラ"
  ]
};
const fallback217=['シズクン','サカナビ','カニポン','クラゲミ','シオマント','ミナモン','ミズマリ','ツボナミ','ナミスキ','ツユヒラ','アワムス','シオネ'];
export function defaultWaterPool217(id){let profile=WATER_PROFILES217[id];if(!profile){let hash=0;for(const ch of id||'')hash=(Math.imul(hash,31)+ch.charCodeAt(0))>>>0;profile=[20,25,...[0,1,5].map(n=>fallback217[(hash+n)%fallback217.length])];}const [min,max,...names]=profile;return names.map((name,i)=>[name,min,max,[50,30,20][i]]);}
export const enableBoat217=map=>{if(map.rows?.some(row=>row.includes('W')))map.boatWater=true;return map;};
