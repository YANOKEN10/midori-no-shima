import {ITEMS} from './data/items.js';
export const ITEM_NAMES=Object.keys(ITEMS);
const images=new Map(ITEM_NAMES.filter(name=>ITEMS[name]?.kind!=='ore'&&name!=='採掘セット'&&!['小型ボート','レベルの実','クリア・エンブレム','ハイラス・エンブレム','ダーク・エンブレム','マスター・エンブレム','マリンエンブレム','カラット・エンブレム','船のチケット','パワーバンド','まもりのおまもり','ひらめきの石','レスレ・エンブレム','マニケレオ・エンブレム'].includes(name)).map((name,i)=>{const im=new Image();im.src=new URL('../assets/items-v13/'+String(i).padStart(2,'0')+'.png',import.meta.url).href;return [name,im];}));
// Preserve atlas indices for saved items; the Marine Emblem shares the water emblem art.
images.set('マリンエンブレム',images.get('湖風エンブレム'));
images.set('カラット・エンブレム',images.get('陽刻エンブレム'));
images.set('船のチケット',images.get('たいかいパス'));
images.set('レスレ・エンブレム',images.get('森響エンブレム'));
images.set('マニケレオ・エンブレム',images.get('石笛エンブレム'));
export function drawItem(ctx,name,x,y,size=40){if(ITEMS[name]?.kind==='ore'||name==='採掘セット'){ctx.save();ctx.translate(x,y);ctx.scale(size/40,size/40);ctx.fillStyle=({'こいし':'#969fa5','てっこうせき':'#647381','どうこうせき':'#b46b43','きんこうせき':'#e4b83e','ひかりのけっしょう':'#8bd9ef'})[name]||'#936243';if(name==='採掘セット'){ctx.strokeStyle='#526b75';ctx.lineWidth=4;ctx.strokeRect(13,8,14,10);ctx.fillStyle='#b58447';ctx.fillRect(4,15,32,22);ctx.fillStyle='#f5d071';ctx.fillRect(17,20,6,7);}else if(['もくざい','じゅし','かたいもくざい'].includes(name)){ctx.fillStyle=name==='じゅし'?'#d9a332':'#97643d';ctx.fillRect(7,10,27,22);ctx.fillStyle='#e5bd7f';ctx.fillRect(8,14,5,14);ctx.fillRect(19,17,12,2);}else{ctx.beginPath();ctx.moveTo(6,27);ctx.lineTo(9,12);ctx.lineTo(24,5);ctx.lineTo(34,16);ctx.lineTo(30,33);ctx.lineTo(15,36);ctx.closePath();ctx.fill();ctx.fillStyle='#ffffff88';ctx.fillRect(13,12,8,5);}ctx.restore();return true;}if(ITEMS[name]?.kind==='held'){ctx.save();ctx.translate(x,y);ctx.scale(size/40,size/40);ctx.fillStyle='#263e47';if(name==='パワーバンド'){ctx.fillRect(8,8,24,24);ctx.fillStyle='#c76c43';ctx.fillRect(10,10,20,20);ctx.fillStyle='#263e47';ctx.fillRect(15,15,10,10);ctx.fillStyle='#f0ce6d';ctx.fillRect(24,16,8,8);}else if(name==='まもりのおまもり'){ctx.strokeStyle='#8b774b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(20,13,8,Math.PI,0);ctx.stroke();ctx.fillRect(10,13,20,22);ctx.fillStyle='#529779';ctx.fillRect(12,15,16,18);ctx.fillStyle='#f0db8b';ctx.fillRect(17,20,6,7);}else{ctx.beginPath();ctx.moveTo(20,5);ctx.lineTo(32,15);ctx.lineTo(27,33);ctx.lineTo(12,34);ctx.lineTo(7,17);ctx.closePath();ctx.fill();ctx.fillStyle='#a799df';ctx.beginPath();ctx.moveTo(20,8);ctx.lineTo(29,17);ctx.lineTo(25,30);ctx.lineTo(12,30);ctx.lineTo(10,17);ctx.closePath();ctx.fill();ctx.fillStyle='#e0daff';ctx.fillRect(16,13,5,13);}ctx.restore();return true;}const im=images.get(name);if(!im?.complete||!im.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x,y,size,size);return true;}

images.set('小型ボート',images.get('船のチケット'));
images.set('レベルの実',images.get('ガオンのくすり'));
images.set('クリア・エンブレム',images.get('雪翼エンブレム'));
images.set('ハイラス・エンブレム',images.get('水鏡エンブレム'));
images.set('ダーク・エンブレム',images.get('夕映エンブレム'));
images.set('マスター・エンブレム',images.get('たいかいパス'));
