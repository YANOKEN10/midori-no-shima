import {canonicalTrainingItem125} from './training122.mjs';
import {ITEMS} from './data/items.js';
export const ITEM_NAMES=Object.keys(ITEMS);
// Atlas filenames are permanent IDs, independent of inventory order and new items.
export const ITEM_ART126=Object.freeze({
  "ラグネット": "00.png",
  "スーパーラグ": "01.png",
  "ハイパーラグ": "02.png",
  "マスターラグ": "03.png",
  "ガオンのくすり": "04.png",
  "ハイヒール": "05.png",
  "スーパーヒール": "06.png",
  "フルヒール": "07.png",
  "げどくそう": "08.png",
  "ひやしそう": "09.png",
  "しびれどめ": "10.png",
  "めざましそう": "11.png",
  "オールキュア": "12.png",
  "リカバーのみ": "13.png",
  "ぬけみちいし": "14.png",
  "ガオンずかん": "15.png",
  "リーフ・コンパス": "16.png",
  "湖風エンブレム": "17.png",
  "陽刻エンブレム": "18.png",
  "森響エンブレム": "19.png",
  "石笛エンブレム": "20.png",
  "水鏡エンブレム": "21.png",
  "雪翼エンブレム": "22.png",
  "夕映エンブレム": "23.png",
  "たいかいパス": "24.png"
});
const images=new Map(Object.entries(ITEM_ART126).map(([name,file])=>{const im=new Image();im.src=new URL('../assets/items-v13/'+file,import.meta.url).href;return [name,im];}));
const mining171=new Image();mining171.src=new URL('../assets/items-v171/mining-kit.png',import.meta.url).href;images.set('採掘セット',mining171);
// Preserve atlas indices for saved items; the Marine Emblem shares the water emblem art.
images.set('マリンエンブレム',images.get('湖風エンブレム'));
images.set('カラット・エンブレム',images.get('陽刻エンブレム'));
images.set('船のチケット',images.get('たいかいパス'));
images.set('レスレ・エンブレム',images.get('森響エンブレム'));
images.set('マニケレオ・エンブレム',images.get('石笛エンブレム'));
export function drawItem(ctx,name,x,y,size=40){name=canonicalTrainingItem125(name);if(ITEMS[name]?.kind==='evBoost')name='リカバーのみ';if(ITEMS[name]?.kind==='evReduce')name='リカバーのみ';if(ITEMS[name]?.kind==='treasure'){drawTreasure171(ctx,name,x,y,size);return true;}if(ITEMS[name]?.kind==='ore'){ctx.save();ctx.translate(x,y);ctx.scale(size/40,size/40);ctx.fillStyle=({'こいし':'#969fa5','てっこうせき':'#647381','どうこうせき':'#b46b43','きんこうせき':'#e4b83e','ひかりのけっしょう':'#8bd9ef'})[name]||'#936243';if(['もくざい','じゅし','かたいもくざい'].includes(name)){ctx.fillStyle=name==='じゅし'?'#d9a332':'#97643d';ctx.fillRect(7,10,27,22);ctx.fillStyle='#e5bd7f';ctx.fillRect(8,14,5,14);ctx.fillRect(19,17,12,2);}else{ctx.beginPath();ctx.moveTo(6,27);ctx.lineTo(9,12);ctx.lineTo(24,5);ctx.lineTo(34,16);ctx.lineTo(30,33);ctx.lineTo(15,36);ctx.closePath();ctx.fill();ctx.fillStyle='#ffffff88';ctx.fillRect(13,12,8,5);}ctx.restore();return true;}if(ITEMS[name]?.kind==='held'){ctx.save();ctx.translate(x,y);ctx.scale(size/40,size/40);ctx.fillStyle='#263e47';if(name==='パワーバンド'){ctx.fillRect(8,8,24,24);ctx.fillStyle='#c76c43';ctx.fillRect(10,10,20,20);ctx.fillStyle='#263e47';ctx.fillRect(15,15,10,10);ctx.fillStyle='#f0ce6d';ctx.fillRect(24,16,8,8);}else if(name==='まもりのおまもり'){ctx.strokeStyle='#8b774b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(20,13,8,Math.PI,0);ctx.stroke();ctx.fillRect(10,13,20,22);ctx.fillStyle='#529779';ctx.fillRect(12,15,16,18);ctx.fillStyle='#f0db8b';ctx.fillRect(17,20,6,7);}else{ctx.beginPath();ctx.moveTo(20,5);ctx.lineTo(32,15);ctx.lineTo(27,33);ctx.lineTo(12,34);ctx.lineTo(7,17);ctx.closePath();ctx.fill();ctx.fillStyle='#a799df';ctx.beginPath();ctx.moveTo(20,8);ctx.lineTo(29,17);ctx.lineTo(25,30);ctx.lineTo(12,30);ctx.lineTo(10,17);ctx.closePath();ctx.fill();ctx.fillStyle='#e0daff';ctx.fillRect(16,13,5,13);}ctx.restore();return true;}const im=images.get(name);if(!im?.complete||!im.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x,y,size,size);return true;}

images.set('小型ボート',images.get('船のチケット'));
images.set('レベルの実',images.get('ガオンのくすり'));
images.set('クリア・エンブレム',images.get('雪翼エンブレム'));
images.set('ハイラス・エンブレム',images.get('水鏡エンブレム'));
images.set('ダーク・エンブレム',images.get('夕映エンブレム'));
images.set('マスター・エンブレム',images.get('たいかいパス'));

// Shared by the guide so canvas icons render only after their source images are ready.
export function itemArtReady(){return Promise.all([...new Set(images.values())].map(im=>im.complete?Promise.resolve():new Promise(resolve=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',resolve,{once:true});})));}

function drawTreasure171(ctx,name,x,y,size){
 const coin=name==='古代のきんか',star=name==='ほしの宝石';
 const rows=coin?['     ######     ','   ##aaaaaa##   ','  #aabbbbbbaa#  ',' #aabbaccbbaa#  ',' #abbaccccbba#  ',' #abbaccccbba#  ',' #aabbaccbbaa#  ','  #aabbbbbbaa#  ','   ##aaaaaa##   ','     ######     ']:['       ##       ','      #aa#      ','    ##abba##    ','   #abbbbbba#   ','  #abbccbbbba#  ',' #abbccccbbbba# ','  #abbccbbbba#  ','   #abbbbbba#   ','    ##abba##    ','      ####      '];
 const pal={'#':'#382d43',a:star?'#687dcc':'#b47724',b:star?'#96d6ec':'#efbb49',c:'#fff2c0'};
 ctx.save();for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<16;xx++)if(pal[rows[yy][xx]]){ctx.fillStyle=pal[rows[yy][xx]];const l=Math.round(x+xx*size/16),t=Math.round(y+(yy+3)*size/16);ctx.fillRect(l,t,Math.round(x+(xx+1)*size/16)-l,Math.round(y+(yy+4)*size/16)-t);}ctx.restore();
}
