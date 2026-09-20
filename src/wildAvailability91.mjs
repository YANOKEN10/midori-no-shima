import {canonicalName} from './data/redesignV47.js';
export function wildWindow91(name){return canonicalName(name)==='カエデリア'?'18:00〜翌6:00（日本時間）':null;}
export function wildAvailable91(name,now=new Date()){if(!wildWindow91(name))return true;const hour=new Date(now.getTime()+9*3600000).getUTCHours();return hour>=18||hour<6;}
export const filterWild91=(list,now=new Date())=>list.filter(e=>wildAvailable91(e[0],now));
