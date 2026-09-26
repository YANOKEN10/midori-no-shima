import {MATERIAL_ITEMS172} from './materials172.mjs';
import {ITEMS171,ITEM_PATTERNS171} from './i18n/items171.mjs';
import {SCHEDULE167} from './i18n/schedule167.mjs';
import {RUNTIME167} from './i18n/runtime167.mjs';
import {UI167} from './i18n/ui167.mjs';
import {DESCS167} from './i18n/descs167.mjs';
import {MAP_TEXT167} from './i18n/mapText167.mjs';
import {PATTERNS167} from './i18n/patterns167.mjs';
import {RESIDENTS167} from './i18n/residents167.mjs';
import {DEX167} from './i18n/dex167.mjs';
import {LATER167} from './i18n/later167.mjs';
import {PLACES166} from './i18n/places166.mjs';
import {MOVE_NAMES166} from './i18n/moves166.mjs';
import {EXTRA166,EXTRA_PATTERNS166} from './i18n/extra166.mjs';
import {NAMES166} from './i18n/names166.mjs';
import {EN166,PATTERNS166} from './i18n/en166.mjs';
import {STORY166} from './i18n/story166.mjs';
const KEY='gaon:language';
let locale='ja',revision=0;
try{const saved=globalThis.localStorage?.getItem(KEY);if(saved==='en')locale='en';}catch{}
const normalize=s=>String(s).normalize('NFKC').replace(/[\s\u3000]+/g,'');
const dictionary=new Map([["ライバルの なまえは？","What is your rival's name?"],["ライバルの なまえを 決めてね。（8文字まで）","Choose your rival's name (up to 8 characters)."],["ライバルの なまえ","Rival's name"],["レイジ","Reiji"],...MATERIAL_ITEMS172.flatMap(d=>[[d.name,d.english],[d.desc,d.kind==='heal'?'A harvest item that restores '+d.amount+' HP.':'A mineral that sells for '+(d.price/2)+' at shops.']]),...ITEMS171,...SCHEDULE167,...RUNTIME167,...UI167,...DESCS167,...MAP_TEXT167,...RESIDENTS167,...DEX167,...LATER167,...EN166,...STORY166,...EXTRA166,...PLACES166,...NAMES166,...MOVE_NAMES166].map(([ja,en])=>[normalize(ja),en]));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const patterns=[...ITEM_PATTERNS171,...PATTERNS167,...EXTRA_PATTERNS166,...PATTERNS166].map(([ja,en])=>{
 const parts=ja.normalize('NFKC').split(/(\{\d+\})/);
 return {en,re:new RegExp('^\\s*'+parts.map(p=>/^\{\d+\}$/.test(p)?'(.+?)':Array.from(p.replace(/\s/g,'')).map(escape).join('\\s*')).join('\\s*')+'\\s*$')};
});
const cache=new Map();
export const language166=()=>locale;
export const languageRevision166=()=>revision;
export function setLanguage166(next){if(!['ja','en'].includes(next))return false;if(next===locale)return true;locale=next;revision++;cache.clear();try{globalThis.localStorage?.setItem(KEY,next);}catch{}if(typeof window!=='undefined')window.dispatchEvent(new Event('gaon:language'));return true;}
export function registerNames166(pairs){for(const [ja,en]of pairs)dictionary.set(normalize(ja),en);cache.clear();}
export function t166(value,depth=0){
 const source=String(value??'');if(locale!=='en'||!/[\u3040-\u30ff\u3400-\u9fff]/.test(source))return source;
 if(cache.has(source))return cache.get(source);
 const key=normalize(source);let result=dictionary.get(key);
 if(!result&&depth<3){for(const p of patterns){const m=source.normalize('NFKC').match(p.re);if(m){const candidate=p.en.replace(/\{(\d+)\}/g,(_,i)=>t166(m[+i+1].trim(),depth+1));if(p.en!=='{0} used {1}!'||dictionary.has(normalize(m[2]))){result=candidate;break;}}}}
 // Translate joined labels only when every component is known; never rewrite canonical data.
 if(!result&&source.includes('・')){const parts=source.split('・'),translated=parts.map(x=>t166(x,depth+1));if(translated.every(x=>!/[\u3040-\u30ff\u3400-\u9fff]/.test(x)))result=translated.join(' / ');}
 // Party and move lists retain their canonical keys and numeric suffixes.
 if(!result){const m=source.match(/^(.+?)(\s+Lv\s*\d+.*|\s+[\d／/]+\s*PP.*)$/);if(m&&dictionary.has(normalize(m[1])))result=dictionary.get(normalize(m[1]))+m[2];}
 result??=source;if(cache.size>4000)cache.clear();cache.set(source,result);return result;
}
