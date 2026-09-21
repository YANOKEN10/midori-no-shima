import {GOODS82} from './shopCatalog82.mjs';
export const GIFT_ITEMS111=GOODS82.map(g=>g.name);
export const protectedNpc111=n=>!!n&&!!(n.script||n.fixedDialogue||n.healAll||n.heal||n.shop||n.clothes||n.salon||n.destination||n.eden||n.trainer?.leader||n.trainer?.major||n.trainer?.champ);
export const validGift111=g=>!!g&&typeof g==='object'&&!Array.isArray(g)&&GIFT_ITEMS111.includes(g.item)&&Number.isInteger(g.count)&&g.count>=0&&g.count<=99&&Object.keys(g).every(k=>['item','count'].includes(k));
export function claimNpcGift111(save,mapId,n){if(!validGift111(n.editorGift111)||n.editorGift111.count===0||!n.editorActorId111||protectedNpc111(n)||n.artMon)return null;const key='npcGift111:'+mapId+':'+n.editorActorId111;if(save.flags?.[key])return null;save.flags??={};save.bag??={};const g=n.editorGift111;save.bag[g.item]=(save.bag[g.item]||0)+g.count;save.flags[key]=true;return {...g};}
