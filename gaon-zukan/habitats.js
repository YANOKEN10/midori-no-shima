import {habitatEntries,habitatRateLabel} from '/src/habitats.js';
for(const card of document.querySelectorAll('article')){
 const name=card.querySelector('b')?.textContent.trim();if(!name)continue;
 const entries=habitatEntries(name),details=document.createElement('details');details.className='habitat-map';
 const summary=document.createElement('summary');summary.textContent=entries.length?'出会える場所（'+entries.length+'か所）':'出会える場所';details.append(summary);
 const panel=document.createElement('div');panel.className='detail-scroll';panel.tabIndex=0;panel.setAttribute('role','region');panel.setAttribute('aria-label',name+'の生息地');
 if(!entries.length){const p=document.createElement('p');p.textContent='野生の出現場所なし';panel.append(p);}
 else{const list=document.createElement('ul');for(const entry of entries){const item=document.createElement('li'),map=document.createElement('strong'),rate=document.createElement('span');map.textContent=entry.mapName;rate.textContent=habitatRateLabel(entry);item.append(map,rate);list.append(item);}panel.append(list);}
 details.append(panel);card.append(details);
}
const note=document.createElement('p');note.className='encounter-note';note.textContent='「出会える場所」を開くと、生息地や出現率を見られます。通常・水上の％は、野生のガオンに出会ったときの割合です。レア出現やイベントには、それぞれ条件があります。';document.querySelector('main').prepend(note);
document.querySelector('#search')?.dispatchEvent(new Event('input'));
