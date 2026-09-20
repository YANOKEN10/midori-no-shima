import {canonicalName} from './data/redesignV47.js';
export const WILD_ADDITIONS94={
 natureforest:[['コノハギ',8,12,8],['リーフィン',5,8,8],['チョウマユ',6,10,12]],
 volcanicDepths:[['ボウエン',23,28,10]],
 route3:[['ピピピット',7,10,12]],
 radenInside:[['ビリボール',16,20,15]],
 remoteLake:[['シズリィ',8,12,14]],
 mossSanctuary:[['キラル',10,14,12]],
 gaonPark:[['フクモッチ',21,25,10]],
 kageri:[['クモッコ',20,24,1]],
 merire:[['フェニクス',50,55,1]]
};
export function addWildPools94(list,mapId){
 const pool=(list||[]).map(e=>[canonicalName(e[0]),...e.slice(1)]);
 for(const entry of WILD_ADDITIONS94[mapId]||[])if(!pool.some(e=>e[0]===entry[0]))pool.push([...entry]);return pool;
}
export function balanceWildPools94(pool,mapId){
 const target=mapId==='merire'?['フェニクス',.01]:mapId==='kageri'?['クモッコ',.4]:null;if(!target)return pool;
 const total=pool.filter(e=>e[0]!==target[0]).reduce((s,e)=>s+e[3],0);if(!total)return pool;
 const [own,other]=mapId==='merire'?[1,99]:[2,3];return pool.map(e=>[...e.slice(0,3),e[0]===target[0]?total*own:e[3]*other]);
}

// New families enter the ordinary pools; user-authored pools remain explicit.
for(const [map,name,lv] of [["route14","ユラポン",30],["forgottenRuins","カケラル",18],["route8","コロベル",18],["kageri","ネムリフ",18],["shadowDepths","スミル",18],["ashRoad","ホノラン",18],["resureBeach","ミズマリ",18],["radenInside","サビット",18],["sunValley","タネフル",18],["forgottenRuins","ジオポル",18],["route16","ピリゼル",35],["gaonPark","ホシモチ",18],["merire","クウロム",45],["mountain","ソラコ",8],["radenInside","コギア",12],["kageri","ヨイコネ",12]]){(WILD_ADDITIONS94[map]??=[]).push([name,lv,lv+4,10]);}
