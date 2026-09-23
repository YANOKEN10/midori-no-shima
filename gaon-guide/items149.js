import {ITEMS} from '../src/data/items.js';
import {drawItem,itemArtReady} from '../src/itemArt.js';
const categories={ball:'つかまえる',heal:'体力回復',cure:'状態回復',revive:'復活',held:'持たせる道具',evReduce:'育成',level:'育成',escape:'冒険の道具',key:'大切なもの',ore:'素材'};
const list=document.querySelector('#item-list'),search=document.querySelector('#item-search'),select=document.querySelector('#item-kind'),count=document.querySelector('#item-count');
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
for(const label of [...new Set(Object.values(categories))]){const o=node('option',label);o.value=label;select.append(o);}
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).replace(/\s/g,'');
let ready=false;
function render(){const query=normalize(search.value),entries=Object.entries(ITEMS).filter(([name,item])=>(!select.value||categories[item.kind]===select.value)&&normalize(name+item.desc).includes(query));list.replaceChildren();count.textContent=entries.length+'件 / 全'+Object.keys(ITEMS).length+'件';
for(const [name,item]of entries){const card=node('article',undefined,'item-card'),icon=node('canvas');icon.width=80;icon.height=80;icon.setAttribute('role','img');icon.setAttribute('aria-label',name+'の画像');if(ready&&!drawItem(icon.getContext('2d'),name,0,0,80)){icon.hidden=true;card.append(node('span','画像を読み込めませんでした','small'));}const body=node('div');body.append(node('span',categories[item.kind]||'道具','item-category'),node('h3',name),node('p',item.desc),node('p','価格：'+(item.price>0?item.price.toLocaleString('ja-JP'):'—'),'item-price'));card.append(icon,body);list.append(card);}
if(!entries.length)list.append(node('p','該当するアイテムがありません。名前や種類を変えて探してみてください。','empty'));}
search.addEventListener('input',render);select.addEventListener('change',render);render();await itemArtReady();ready=true;render();list.dataset.ready='true';
