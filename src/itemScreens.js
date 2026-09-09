import * as G from './gfx.js';
import {item} from './data/items.js';
import {drawItem} from './itemArt.js';
export const POCKETS=['かいふく','ラグネット','たいせつなもの'];
export function pocket(name){const k=item(name).kind;return k==='key'?2:k==='ball'?1:0;}
export function visibleItems(w){return w.pockets?w.items.filter(e=>pocket(e.name)===w.category):w.items;}
export function drawItemList(w){
 const list=visibleItems(w),selected=list[w.i],shop=w.mode==='buy',sell=w.mode==='sell';G.use('ui');G.clear(1);
 G.window9(4,4,94,190);G.window9(100,4,216,190);G.window9(4,196,312,88);
 if(shop||sell){G.textCenter(shop?'おかいもの':'うる どうぐ',51,17,3,12);G.textCenter('おこづかい',51,44,3,11);G.textFit(w.money+'円',13,64,78,3,13);}
 else{G.textCenter('どうぐ',51,17,3,16);G.textFit(POCKETS[w.category],12,46,78,3,11);G.textCenter('◀     ▶',51,70,3,14);}
 if(selected){drawItem(G.ctx,selected.name,21,96,60);G.textCenter('もっている',51,164,3,10);G.textCenter((selected.n||0)+'こ',51,179,3,11);}
 if(!list.length)G.text('ありません',120,28,3,14);
 const top=Math.max(0,Math.min(w.i-5,list.length-6));
 list.slice(top,top+6).forEach((e,row)=>{const y=18+row*27,chosen=top+row===w.i;G.ctx.fillStyle=chosen?'#d7ede4':'#eaf3e9';G.ctx.fillRect(108,y-3,199,25);if(chosen)G.text('▶',108,y,3,11);G.textFit(e.name,123,y,shop||sell?125:139,3,13);const suffix=shop?item(e.name).price+'円':sell?Math.floor(item(e.name).price/2)+'円':'×'+(e.n||1);G.textRight(suffix,305,y+13,3,10);});
 if(top>0)G.text('▲',293,9,3,9);if(top+6<list.length)G.text('▼',293,180,3,9);
 if(selected){drawItem(G.ctx,selected.name,12,208,42);const lines=G.wrap(item(selected.name).desc,244,12);lines.slice(0,3).forEach((s,i)=>G.text(s,62,208+i*18,3,12));}
 G.text('A えらぶ   B もどる'+(w.pockets?'   ← → ポケット':''),17,268,3,10);
}
