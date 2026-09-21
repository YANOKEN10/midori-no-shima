import {showSummary124} from './summary124.js';
import {statOf} from './state.js';
import {SPECIES} from './data/species.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
export function tradeView124(parent,{room,viewerId,save,button,card,api,busy,connectionLost}){
 const offers=el('div',null,'friend-offers trade-offers124');
 for(const p of room.players){const c=el('section',null,'friend-offer');c.append(el('h3',p.id===viewerId?'じぶんのガオン':p.name+'のガオン'));const mon=room.offers?.[p.id]?.mon;
 if(mon){c.append(card(mon));c.append(button('くわしく つよさをみる',()=>showSummary124(mon,{readOnly:true})));}else c.append(el('p','ガオンを選んでいます…'));if(room.confirmations.includes(p.id))c.append(el('b','こうかん OK！'));offers.append(c);}parent.append(offers);
 const pick=el('details',null,'trade-picker124');pick.open=!room.offers?.[viewerId];pick.append(el('summary',room.offers?.[viewerId]?'ガオンを選びなおす':'交換するガオンを選ぶ'));
 for(const place of ['party','box']){const section=el('section');section.append(el('h3',place==='party'?'手持ち':'ボックス'));const list=el('div',null,'friend-team');for(const[m,index]of (save[place]||[]).map((m,i)=>[m,i])){const b=button('',()=>api('offer',{ref:{place,index}}),'friend-select');b.append(card(m));b.setAttribute('aria-label',(place==='party'?'手持ち':'ボックス')+' '+(m.nick||m.sp)+' Lv.'+m.lv+'を交換に出す');b.disabled=busy||connectionLost;list.append(b);}section.append(list);if(!list.children.length)section.append(el('p','ガオンはいません。'));pick.append(section);}parent.append(pick);
 const ready=room.players.length===2&&Object.keys(room.offers||{}).length===2,own=room.confirmations.includes(viewerId);if(ready){const other=room.players.find(p=>p.id!==viewerId),a=room.offers[viewerId].mon,b=room.offers[other.id].mon;parent.append(el('p',(a.nick||a.sp)+'と '+other.name+'の '+(b.nick||b.sp)+'を こうかんしますか？','trade-question124'));}
 const confirm=button(own?'友だちの OK を待っています':'この2匹を こうかんする',()=>api('confirm',{offerRevision:room.offerRevision}),'primary');confirm.disabled=busy||connectionLost||!ready||own;parent.append(confirm,el('small','2人が OK すると交換します。選びなおすと、2人とも確認しなおしになります。'));
}
export function tradeResult124(parent,{room,viewerId,card}){const other=room.players.find(p=>p.id!==viewerId),incoming=room.offers?.[other?.id]?.mon,outgoing=room.offers?.[viewerId]?.mon;if(!incoming||!outgoing)return;const stage=el('div',null,'trade-stage124');stage.setAttribute('aria-label','2匹のガオンが行き交う交換演出');const a=el('div',null,'trade-traveler124 outgoing'),b=el('div',null,'trade-traveler124 incoming');a.append(card(outgoing));b.append(card(incoming));stage.append(a,b);parent.append(stage,el('p',other.name+'から '+(incoming.nick||incoming.sp)+'が おくられてきた！','trade-question124'),el('p','大切に 育ててね！'));}
