// Shared 50-color palette and persistent, town-specific clothing collections.
const names=['くろ','すみいろ','チャコール','グレー','ぎん','しろ','アイボリー','クリーム','ベージュ','キャメル','ちゃいろ','チョコ','こげちゃ','あか','えんじ','ワイン','コーラル','サーモン','ピンク','さくら','ローズ','マゼンタ','オレンジ','あんず','きいろ','ゴールド','レモン','ライム','わかくさ','みどり','もり','オリーブ','ミント','ひすい','エメラルド','ターコイズ','みずいろ','そらいろ','あお','ロイヤルブルー','こん','あいいろ','ラベンダー','すみれ','むらさき','プラム','ライラック','モーヴ','モカ','くるみ'];
const hex=['241d1a','231a14','363b46','808a99','cfd6dd','f2f2f2','fff4dd','f5e3b3','d8be98','b98550','6b4a2b','70402e','442b26','d94b3a','a52c3d','8f2440','ed8068','f3a38b','f07ab0','ffd0e1','d34273','c543a3','f08a2e','ffbf80','e8bf2e','c99b32','f5ea79','b8cf43','8db868','37a05a','1f7a4f','747c39','63d9a8','4c9d89','21977b','159faa','46c8e0','84bde9','2f6fd0','344cbe','23306b','40598c','b29ce7','8063c7','8a4fd0','63355f','d5b5ec','a37599','997f73','a48a66'];
export const APPEARANCE_COLORS=names.map((name,i)=>({name,color:'#'+hex[i]}));
export const FASHION_TOWNS={
 village:['ネイチャー','#47875b','#dfc88c',0],rods:['ロッズ','#ad6946','#ecd4ac',1],marine:['マリン','#247cab','#eef6f7',2],karat:['カラット','#9c5ca1','#f2c4da',3],resure:['リシュレ','#d87a56','#f4d18a',4],manikereo:['マニケレオ','#44616f','#80d6bf',5],galaxy:['ギャラクシー','#494994','#89d7f0',6],clearTown:['クリア','#76acbc','#f5f5e9',7],belerio:['ベレリオ','#c9903c','#f0d9a5',8],leafTown:['リーフ','#43815d','#aed387',9]
};
const designs={hat:[['キャップ','cap'],['ベレー','beret'],['ニットぼう','beanie'],['サファリぼう','safari']],shirt:[['ベスト','vest'],['ボーダー','stripe'],['ジャケット','jacket'],['セーラー','sailor'],['チュニック','tunic']],pants:[['カーゴ','cargo'],['ラインパンツ','stripe'],['ショートパンツ','shorts'],['ロールアップ','cuff']],shoes:[['ブーツ','boots'],['スニーカー','sneakers'],['サンダル','sandals'],['レースシューズ','dress']]};
export const FASHION_ITEMS=Object.entries(FASHION_TOWNS).flatMap(([town,[label,color,accent,n]])=>Object.entries(designs).flatMap(([slot,list],s)=>[0,1].map(v=>{const[name,style]=list[(n+v+s)%list.length];return {id:town+'-'+slot+'-'+v,town,slot,name:label+name+(v?'・ライト':''),style,color:v?accent:color,accent:v?color:accent,price:350+s*120+n*35+v*80};})));
export const fashionStock=town=>FASHION_ITEMS.filter(i=>i.town===town);
export function itemLook(look,item){const next={...look};next[item.slot]=item.slot==='hat'?item.style:item.color;next[item.slot+'Style']=item.style;next[item.slot+'Accent']=item.accent;if(item.slot==='hat')next.hatColor=item.color;if(item.slot==='pants')next.skirt=false;return next;}
export function equipFashion(save,id,{buy=false}={}){
 const item=FASHION_ITEMS.find(i=>i.id===id);if(!item)return {ok:false,reason:'item'};
 const owned=Array.isArray(save.wardrobe)?save.wardrobe:[];
 if(!owned.includes(id)){if(!buy)return {ok:false,reason:'owned'};if(!Number.isFinite(save.money)||save.money<item.price)return {ok:false,reason:'money'};save.money-=item.price;save.wardrobe=[...owned,id];}
 save.startingLook||={...save.look};save.look=itemLook(save.look||{},item);save.equippedClothes={...save.equippedClothes,[item.slot]:id};return {ok:true,item};
}
