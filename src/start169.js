let pending198,ready198=false,requested198=false,finish198,root198;
function language198(){try{return localStorage.getItem('gaon:language')==='en'?'en':'ja';}catch{return 'ja';}}
export function showStart169({loading=false}={}){
 if(!loading){ready198=true;performance.mark('gaon:engine-ready');if(requested198)finish198?.();}
 if(pending198)return pending198;
 pending198=new Promise(resolve=>{
  const root=root198=document.createElement('dialog');root.id='start169';
  root.innerHTML=`<img class="start-art169" src="/assets/start-v190/ensemble.webp" fetchpriority="high" alt=""><div class="start-shade169"></div><div class="start-logo169"><p class="start-kicker169">GAON WORLD</p><h1></h1><p class="start-tag169"></p></div><div class="start-actions169"><button type="button" autofocus></button><p class="start-hint169" role="status" aria-live="polite"></p></div>`;
  const title=root.querySelector('h1'),tag=root.querySelector('.start-tag169'),button=root.querySelector('button'),hint=root.querySelector('.start-hint169');
  const render=()=>{const en=language198()==='en';title.textContent=en?'GAON WORLD':'ガオン・ワールド';tag.textContent=en?'A world of companions. An adventure of your own.':'ガオンと出会う、きみだけの冒険。';button.textContent=requested198&&!ready198?(en?'LOADING…':'よみこみ中…'):(en?'START ADVENTURE':'タップして はじめる');hint.textContent=requested198&&!ready198?(en?'Preparing your adventure':'ぼうけんの じゅんびをしています'):'TAP / ENTER';root.setAttribute('aria-label',en?'Gaon World start screen':'ガオン・ワールド スタート画面');};
  let done=false;finish198=()=>{if(done)return;requested198=true;if(!ready198){render();return;}done=true;window.removeEventListener('gaon:language',render);root.close();root.remove();resolve();};
  root.addEventListener('cancel',e=>e.preventDefault());
  root.addEventListener('click',e=>{if(!e.target.closest('#language166')){e.stopPropagation();finish198();}});
  root.addEventListener('keydown',e=>{if(e.target.closest('#language166'))return;e.stopPropagation();if(['Enter',' ','z','Z'].includes(e.key)){e.preventDefault();finish198();}});
  render();window.addEventListener('gaon:language',render);document.body.append(root);root.showModal();button.focus();performance.mark('gaon:start-visible');
 });return pending198;
}
export function failStart198(){if(!root198?.isConnected)return;const en=language198()==='en';root198.querySelector('button').textContent=en?'RETRY':'もう一度 よみこむ';root198.querySelector('.start-hint169').textContent=en?'Could not load. Please retry.':'よみこめませんでした。もう一度 おしてください。';finish198=()=>location.reload();}
