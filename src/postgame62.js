import {deenaReady94} from './deenaQuest94.mjs';
export const postgameCleared=s=>!!(s.flags?.['end:clear']||s.flags?.champion);
export const trainerLevel=(lv,s)=>postgameCleared(s)?Math.min(100,Math.max(60,lv+25)):lv;
export function refreshPostgame(w,s){for(const n of w.npcs)if(n.script==='post:deena')n.gone=!deenaReady94(s);else if(n.script==='post:deenaGuide94')n.gone=!postgameCleared(s);}
