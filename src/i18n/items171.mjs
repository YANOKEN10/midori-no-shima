import {STAT_LABELS122} from '../training122.mjs';
const en={hp:'HP',atk:'Attack',def:'Block',spc:'Magic',sdef:'Barrier',spd:'Speed'};
export const ITEMS171=[...Object.entries(STAT_LABELS122).flatMap(([k,v])=>[[v+'アップの実',en[k]+' Boost Berry'],[v+'の努力値を10上げる。能力ごと252、合計510まで。','Raises '+en[k]+' effort points by 10, up to 252 per stat and 510 total.']]),
 ['こはくのかけら','Amber Shard'],['古代のきんか','Ancient Gold Coin'],['ほしの宝石','Star Gem'],
 ['黄金色に透き通る化石。ショップで2000円で売れる。','A translucent golden fossil. Sells for 2,000 at shops.'],
 ['古い王国の金貨。ショップで5000円で売れる。','A gold coin from an ancient kingdom. Sells for 5,000 at shops.'],
 ['星のように輝く希少な宝石。ショップで10000円で売れる。','A rare gem that shines like a star. Sells for 10,000 at shops.'],
 ['努力値が上限に達しているので 使えません。','Effort points have reached their limit. This item cannot be used.']];
export const ITEM_PATTERNS171=[['{0}の {1}の努力値が {2} 上がった！',"{0}'s {1} effort points rose by {2}!"]];
