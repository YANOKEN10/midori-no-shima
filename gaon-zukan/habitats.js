import {habitatEntries,habitatRateLabel} from '/src/habitats.js';
for(const card of document.querySelectorAll('article')){
 const name=card.querySelector('b')?.textContent.trim();if(!name)continue;
 const p=document.createElement('p');p.className='habitat-map';p.append('生息地・出現率');
 const entries=habitatEntries(name);
 if(!entries.length)p.append(document.createElement('br'),'野生の出現場所なし');
 for(const entry of entries)p.append(document.createElement('br'),entry.mapName+'：'+habitatRateLabel(entry));
 card.querySelector('b').nextElementSibling.after(p);
}
const note=document.createElement('p');note.className='encounter-note';note.textContent='通常・水上の％は、野生のガオンとの遭遇が発生したときの割合です。1歩ごとの確率ではありません。レア出現は解放後の特定マスでの判定、イベントはそれぞれの出現条件に従います。';
document.querySelector('main').prepend(note);
document.querySelector('#search')?.dispatchEvent(new Event('input'));
