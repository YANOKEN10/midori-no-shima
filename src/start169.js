import {language166} from './i18n166.mjs';
export function showStart169(){
 return new Promise(resolve=>{
  const root=document.createElement('dialog');root.id='start169';
  root.innerHTML=`<img class="start-art169" src="/assets/start-v169/ensemble.webp" alt=""><div class="start-shade169"></div><div class="start-logo169"><p class="start-kicker169">GAON WORLD</p><h1></h1><p class="start-tag169"></p></div><div class="start-actions169"><button type="button" autofocus></button><p class="start-hint169"></p></div>`;
  const title=root.querySelector('h1'),tag=root.querySelector('.start-tag169'),button=root.querySelector('button'),hint=root.querySelector('.start-hint169');
  const render=()=>{const en=language166()==='en';title.textContent=en?'GAON WORLD':'ガオン・ワールド';tag.textContent=en?'A world of companions. An adventure of your own.':'ガオンと出会う、きみだけの冒険。';button.textContent=en?'START ADVENTURE':'タップして はじめる';hint.textContent=en?'TAP / ENTER':'TAP / ENTER';root.setAttribute('aria-label',en?'Gaon World start screen':'ガオン・ワールド スタート画面');};
  let done=false;const finish=()=>{if(done)return;done=true;window.removeEventListener('gaon:language',render);root.close();root.remove();resolve();};
  root.addEventListener('cancel',e=>e.preventDefault());
  root.addEventListener('click',e=>{if(!e.target.closest('#language166')){e.stopPropagation();finish();}});
  root.addEventListener('keydown',e=>{if(e.target.closest('#language166'))return;e.stopPropagation();if(['Enter',' ','z','Z'].includes(e.key)){e.preventDefault();finish();}});
  render();window.addEventListener('gaon:language',render);document.body.append(root);root.showModal();button.focus();
 });
}
