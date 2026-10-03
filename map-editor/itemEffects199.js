import {MOVES} from '../src/data/moves.js';
import {item} from '../src/data/items.js';
import {itemLabel197} from '../src/itemNames197.mjs';
import {plain197} from '../src/easyJapanese197.mjs';
let tip, owner;
export function moveStats204(name){const it=item(name),move=it.kind==='moveScroll'?MOVES[it.move]:null;if(!move)return '';return 'タイプ：'+move.type+' ／ いりょく：'+(move.cat==='stat'?'—':move.pow>0?move.pow:'わざによる');}
export const itemEffect199=name=>{const desc=plain197(item(name).desc||'使い方は、ゲームのどうぐ画面で確認できます。'),stats=moveStats204(name);return stats?stats+'。 '+desc:desc;};
export function hideItemEffect199(){if(tip)tip.hidden=true;if(owner){owner.removeAttribute('aria-describedby');owner=null;}}
function show(element,name){
 if(!tip){tip=document.createElement('div');tip.id='item-effect199';tip.setAttribute('role','tooltip');Object.assign(tip.style,{position:'fixed',zIndex:10000,maxWidth:'300px',padding:'12px 16px',border:'1px solid #95b7a7',borderRadius:'10px',background:'#fffdf3',color:'#174e50',boxShadow:'0 4px 18px #12352e30',pointerEvents:'none',fontSize:'14px',lineHeight:'1.6',boxSizing:'border-box'});document.body.append(tip);document.addEventListener('scroll',hideItemEffect199,true);window.addEventListener('resize',hideItemEffect199);document.addEventListener('keydown',e=>{if(e.key==='Escape')hideItemEffect199();});}
 hideItemEffect199();owner=element;const title=document.createElement('strong'),desc=document.createElement('div');title.textContent=itemLabel197(name);desc.textContent=itemEffect199(name);tip.replaceChildren(title,desc);tip.style.maxWidth=Math.min(300,window.innerWidth-16)+'px';tip.hidden=false;const a=element.getBoundingClientRect(),b=tip.getBoundingClientRect();let x=a.right+10;if(x+b.width>innerWidth-8)x=a.left-b.width-10;tip.style.left=Math.max(8,Math.min(x,innerWidth-b.width-8))+'px';tip.style.top=Math.max(8,Math.min(a.top,innerHeight-b.height-8))+'px';element.setAttribute('aria-describedby',tip.id);
}
export function bindItemEffect199(element,name){element.removeAttribute('title');element.addEventListener('pointerenter',()=>show(element,name));element.addEventListener('pointerleave',()=>{if(owner===element)hideItemEffect199();});element.addEventListener('focusin',()=>show(element,name));element.addEventListener('focusout',()=>{if(owner===element)hideItemEffect199();});}
