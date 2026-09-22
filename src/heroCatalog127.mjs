export const HAIRSTYLES127={
 boy:[['default','いつもの髪型'],['short','ショート'],['center','センター分け'],['undercut','ツーブロック'],['fauxhawk','ソフトモヒカン'],['buzz','おしゃれ坊主'],['long','ロング']],
 girl:[['default','いつもの髪型'],['bob','ボブ'],['twintail','ツインテール'],['center','センター分け'],['short','ショート'],['long','ロング']]
};
export const OUTFITS127=[['default','いつもの色'],['red','あか'],['green','みどり'],['cream','クリーム'],['purple','ラベンダー']];
export function heroSelection127(look={}){
 const gender=look.gender==='girl'?'girl':'boy';
 let hair=look.hairMap119||'default';
 if(!HAIRSTYLES127[gender].some(([id])=>id===hair))hair=({'crop':'short','buzz':'short','ear-short':'short','side-bob':'bob','blunt-bob':'bob','ponytail':'default','wave':'center'}[hair]||'default');
 const outfit=OUTFITS127.some(([id])=>id===look.outfit119)?look.outfit119:'default';
 return {gender,hair,outfit};
}
