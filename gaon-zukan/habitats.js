import {habitatText} from '/src/habitats.js';
for(const card of document.querySelectorAll('article')){
 const name=card.querySelector('b')?.textContent.trim();if(!name)continue;
 const p=document.createElement('p');p.className='habitat-map';p.textContent='生息地：'+habitatText(name);
 card.querySelector('b').nextElementSibling.after(p);
}
// Include habitats when an existing search is restored by the browser.
document.querySelector('#search')?.dispatchEvent(new Event('input'));
