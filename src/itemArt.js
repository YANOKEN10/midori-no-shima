import {ITEMS} from './data/items.js';
export const ITEM_NAMES=Object.keys(ITEMS);
const images=new Map(ITEM_NAMES.filter(name=>name!=='マリンエンブレム').map((name,i)=>{const im=new Image();im.src=new URL('../assets/items-v13/'+String(i).padStart(2,'0')+'.png',import.meta.url).href;return [name,im];}));
// Preserve atlas indices for saved items; the Marine Emblem shares the water emblem art.
images.set('マリンエンブレム',images.get('湖風エンブレム'));
export function drawItem(ctx,name,x,y,size=40){const im=images.get(name);if(!im?.complete||!im.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x,y,size,size);return true;}
