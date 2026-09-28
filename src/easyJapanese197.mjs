import {ITEM_NAMES197} from './itemNames197.mjs';
import {SCHOOL_KANJI197,READINGS197} from './readingData197.mjs';
import {SIMPLE_WORDS197} from './simpleWords197.mjs';
const aliases=Object.entries(ITEM_NAMES197).sort((a,b)=>b[0].length-a[0].length);
const low=new Set(SCHOOL_KANJI197),han=/[一-龠々]/,root={},cache=new Map();
for(const [word,reading]of Object.entries(READINGS197)){let n=root;for(const c of word)n=n[c]??={};n.$=reading;}
export function simple197(value){let s=String(value??'');for(const[from,to]of aliases)s=s.split(from).join(to);for(const[from,to]of SIMPLE_WORDS197)s=s.split(from).join(to);return s;}
export function parts197(value){const source=String(value??'');if(cache.has(source))return cache.get(source);const s=simple197(source),out=[];for(let i=0;i<s.length;){if(s[i]==='日'&&/[0-9]/.test(s[i-1]||'')){out.push({text:'日',ruby:'にち'});i++;continue;}const count=/^[0-9]+人/.exec(s.slice(i));if(count){const text=count[0],n=Number(text.slice(0,-1));if(n===1||n===2)out.push({text,ruby:n===1?'ひとり':'ふたり'});else out.push(...[...text.slice(0,-1)].map(text=>({text})),{text:'人',ruby:'にん'});i+=text.length;continue;}let n=root,best=null;for(let j=i;j<s.length&&n[s[j]];j++){n=n[s[j]];if(n.$)best={end:j+1,r:n.$};}if(!best){const text=String.fromCodePoint(s.codePointAt(i));out.push({text});i+=text.length;continue;}const word=s.slice(i,best.end),r=best.r;i=best.end;if([...word].some(c=>han.test(c)&&!low.has(c))){out.push(...[...r].map(text=>({text})));continue;}let stem=word,reading=r,suffix='';while(stem&&reading&&/[ぁ-ゖー]/.test(stem.at(-1))&&stem.at(-1)===reading.at(-1)){suffix=stem.at(-1)+suffix;stem=stem.slice(0,-1);reading=reading.slice(0,-1);}if(stem)out.push({text:stem,...(han.test(stem)?{ruby:reading}:{})});out.push(...[...suffix].map(text=>({text})));}if(cache.size>=3000)cache.clear();cache.set(source,out);return out;}
export const plain197=value=>parts197(value).map(p=>p.text).join('');
export const allowedKanji197=c=>low.has(c);
