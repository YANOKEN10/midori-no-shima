import {language166,setLanguage166,t166} from './i18n166.mjs';
// Opt-in language is a device preference, never a change to game/save identifiers.
const style=document.createElement('style');style.textContent='#language166{position:fixed;top:max(6px,env(safe-area-inset-top));left:8px;z-index:1001;font:13px sans-serif;color:#eaf9ef;background:#163c42;border:1px solid #89bdb2;border-radius:7px;padding:6px;max-width:150px}#language166 select{color:inherit;background:#163c42;font:inherit;border:0;max-width:135px}';document.head.append(style);
function picker(){const label=document.createElement('label');label.id='language166';label.dataset.noTranslate166='';const select=document.createElement('select');select.setAttribute('aria-label','Language / 言語');select.append(new Option('日本語','ja'),new Option('English (Beta)','en'));select.value=language166();select.addEventListener('pointerdown',e=>e.stopPropagation());select.addEventListener('keydown',e=>e.stopPropagation());select.onchange=()=>{setLanguage166(select.value);select.blur();};label.append(select);return label;}
const control=picker();document.body.append(control);
const sources=new WeakMap(),attributes=new WeakMap();
function localize(root){
 if(root.nodeType===3){if(root.parentElement?.closest('script,style,textarea,input,[contenteditable],#language166,[data-i18n166]'))return;const before=sources.get(root);const source=before&&root.data===before.shown?before.source:root.data;const shown=t166(source);sources.set(root,{source,shown});if(root.data!==shown)root.data=shown;return;}
 if(root.nodeType!==1||root.matches('script,style,[contenteditable],#language166'))return;
 const attrs=attributes.get(root)||{};for(const key of ['aria-label','placeholder','title']){if(!root.hasAttribute(key))continue;const current=root.getAttribute(key),old=attrs[key],source=old&&current===old.shown?old.source:current,shown=t166(source);attrs[key]={source,shown};if(current!==shown)root.setAttribute(key,shown);}attributes.set(root,attrs);
 if(root.matches('textarea,input'))return;
 if(root.hasAttribute('data-i18n166')){const shown=t166(root.dataset.i18n166);if(language166()==='en'||sources.has(root)){if(root.textContent!==shown)root.textContent=shown;sources.set(root,true);}return;}
 for(const child of root.childNodes)localize(child);
}
function refresh(){document.documentElement.lang=language166();document.title=language166()==='en'?'Gaon World':'ガオン・ワールド';control.querySelector('select').value=language166();localize(document.body);const modal=document.querySelector('dialog[open]');if(modal)modal.prepend(control);else document.body.append(control);}
let queued=false;const observer=new MutationObserver(records=>{for(const r of records)if(r.type==='characterData'||r.type==='attributes')localize(r.target);else for(const n of r.addedNodes)localize(n);if(!queued){queued=true;queueMicrotask(()=>{queued=false;const modal=document.querySelector('dialog[open]'),parent=modal||document.body;if(control.parentNode!==parent)parent.prepend(control);});}});
observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title']});window.addEventListener('gaon:language',refresh);refresh();
