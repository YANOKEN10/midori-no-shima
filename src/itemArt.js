import {ITEMS} from './data/items.js';
export const ITEM_NAMES=Object.keys(ITEMS);
const images=new Map(ITEM_NAMES.filter(name=>!['マリンエンブレム','カラット・エンブレム','船のチケット','パワーバンド','まもりのおまもり','ひらめきの石','レスレ・エンブレム','マニケレオ・エンブレム'].includes(name)).map((name,i)=>{const im=new Image();im.src=new URL('../assets/items-v13/'+String(i).padStart(2,'0')+'.png',import.meta.url).href;return [name,im];}));
// Preserve atlas indices for saved items; the Marine Emblem shares the water emblem art.
images.set('マリンエンブレム',images.get('湖風エンブレム'));
images.set('カラット・エンブレム',images.get('陽刻エンブレム'));
images.set('船のチケット',images.get('たいかいパス'));
images.set('レスレ・エンブレム',images.get('森響エンブレム'));
images.set('マニケレオ・エンブレム',images.get('石笛エンブレム'));
export function drawItem(ctx,name,x,y,size=40){if(ITEMS[name]?.kind==='held'){ctx.save();ctx.translate(x,y);ctx.scale(size/40,size/40);ctx.fillStyle='#263e47';if(name==='パワーバンド'){ctx.fillRect(8,8,24,24);ctx.fillStyle='#c76c43';ctx.fillRect(10,10,20,20);ctx.fillStyle='#263e47';ctx.fillRect(15,15,10,10);ctx.fillStyle='#f0ce6d';ctx.fillRect(24,16,8,8);}else if(name==='まもりのおまもり'){ctx.strokeStyle='#8b774b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(20,13,8,Math.PI,0);ctx.stroke();ctx.fillRect(10,13,20,22);ctx.fillStyle='#529779';ctx.fillRect(12,15,16,18);ctx.fillStyle='#f0db8b';ctx.fillRect(17,20,6,7);}else{ctx.beginPath();ctx.moveTo(20,5);ctx.lineTo(32,15);ctx.lineTo(27,33);ctx.lineTo(12,34);ctx.lineTo(7,17);ctx.closePath();ctx.fill();ctx.fillStyle='#a799df';ctx.beginPath();ctx.moveTo(20,8);ctx.lineTo(29,17);ctx.lineTo(25,30);ctx.lineTo(12,30);ctx.lineTo(10,17);ctx.closePath();ctx.fill();ctx.fillStyle='#e0daff';ctx.fillRect(16,13,5,13);}ctx.restore();return true;}const im=images.get(name);if(!im?.complete||!im.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x,y,size,size);return true;}
