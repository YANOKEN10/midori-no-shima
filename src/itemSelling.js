import {item} from './data/items.js';

// Unknown items are treated as key items by item(), so new story rewards stay safe.
export function salePrice(name) {
  const data=item(name);
  if(data.kind==='key'||data.unsellable||!Number.isFinite(data.price))return 0;
  return Math.max(0,Math.floor(data.price/2));
}
export function sellableItems(save) {
  return Object.entries(save.bag).filter(([name,n])=>Number.isSafeInteger(n)&&n>0&&salePrice(name)>0).map(([name,n])=>({name,n}));
}
export function sellItem(save,name,count) {
  const price=salePrice(name),owned=save.bag[name],total=price*count;
  if(!price||!Number.isSafeInteger(count)||count<1||!Number.isSafeInteger(owned)||owned<count||!Number.isSafeInteger(total)||!Number.isSafeInteger(save.money)||!Number.isSafeInteger(save.money+total))return false;
  save.bag[name]-=count;
  if(!save.bag[name])delete save.bag[name];
  save.money+=total;
  return true;
}
