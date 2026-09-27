// Exact owner-specified base stats, applied after automatic balance176.
export const BASE189={
  "コケゴロ": {
    "hp": 130,
    "atk": 135,
    "def": 110,
    "spc": 30,
    "sdef": 110,
    "spd": 50
  },
  "ハナカガリ": {
    "hp": 79,
    "atk": 55,
    "def": 70,
    "spc": 135,
    "sdef": 120,
    "spd": 121
  },
  "カガルディ": {
    "hp": 85,
    "atk": 60,
    "def": 95,
    "spc": 120,
    "sdef": 110,
    "spd": 100
  },
  "カルデリオン": {
    "hp": 90,
    "atk": 100,
    "def": 85,
    "spc": 125,
    "sdef": 90,
    "spd": 100
  },
  "リュウグウ": {
    "spd": 100
  },
  "ガルウィング": {
    "hp": 74,
    "atk": 95,
    "def": 87,
    "spc": 26,
    "sdef": 70,
    "spd": 100
  },
  "ガルシザー": {
    "hp": 77,
    "atk": 126,
    "def": 75,
    "spc": 52,
    "sdef": 68,
    "spd": 102
  },
  "ルミセリス": {
    "hp": 95,
    "atk": 57,
    "def": 97,
    "spc": 114,
    "sdef": 112,
    "spd": 95
  },
  "ルミナイト": {
    "hp": 87,
    "atk": 63,
    "def": 77,
    "spc": 125,
    "sdef": 100,
    "spd": 100
  },
  "カゲナギ": {
    "hp": 70,
    "atk": 115,
    "def": 75,
    "spc": 120,
    "sdef": 70,
    "spd": 150
  },
  "コウエンラ": {
    "hp": 78,
    "atk": 105,
    "def": 70,
    "spc": 83,
    "sdef": 70,
    "spd": 110
  },
  "ヴァルディオ": {
    "hp": 90,
    "atk": 130,
    "def": 85,
    "spc": 110,
    "sdef": 75,
    "spd": 100
  },
  "ソラリュウ": {
    "hp": 100,
    "atk": 135,
    "def": 85,
    "spc": 90,
    "sdef": 90,
    "spd": 100
  },
  "ソラハタリ": {
    "hp": 95,
    "atk": 60,
    "def": 99,
    "spc": 125,
    "sdef": 110,
    "spd": 105
  },
  "ホシモチ": {
    "hp": 100,
    "atk": 100,
    "def": 100,
    "spc": 100,
    "sdef": 100,
    "spd": 100
  },
  "ミチオボエ": {
    "hp": 100,
    "atk": 100,
    "def": 100,
    "spc": 100,
    "sdef": 100,
    "spd": 100
  }
};
export function applyBalance189(species){const before={};for(const[name,base]of Object.entries(BASE189)){if(!species[name])throw Error('Unknown species '+name);before[name]={...species[name].base};species[name].base={...before[name],...base};}return {before};}
export function migrateBalanceHp189(mon,before,after){if(mon.balanceVersion189===1)return mon;if(before&&after&&Number.isFinite(mon.hp)&&mon.lv>0){const max=b=>Math.floor((2*b.hp+(mon.iv?.hp||0)+Math.floor((mon.ev?.hp||0)/4))*mon.lv/100)+mon.lv+10;const old=max(before),next=max(after);mon.hp=mon.hp<=0?0:Math.max(1,Math.min(next,Math.round(Math.min(mon.hp,old)*next/old)));}mon.balanceVersion189=1;return mon;}
