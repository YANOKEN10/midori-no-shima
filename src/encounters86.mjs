import {editorSpeciesName98} from './editorSpeciesAliases98.mjs';
// Shared whitelist validation for editor-created wild encounters.
export function validEncounters86(value,species){
 if(value===null)return true;
 return !!value&&Number.isInteger(value.rate)&&value.rate>=0&&value.rate<=100&&(value.percent139===undefined||value.percent139===true)&&Array.isArray(value.list)&&value.list.length>=1&&value.list.length<=30&&(!value.percent139||value.list.reduce((s,e)=>s+(Array.isArray(e)?e[3]:NaN),0)===100)&&new Set(value.list.map(e=>editorSpeciesName98(e?.[0]))).size===value.list.length&&value.list.every(e=>Array.isArray(e)&&e.length===4&&typeof e[0]==='string'&&e[0].length<=60&&(!species||species.includes(editorSpeciesName98(e[0])))&&e.slice(1).every(Number.isInteger)&&e[1]>=1&&e[2]>=e[1]&&e[2]<=100&&e[3]>=(value.percent139?0:1)&&e[3]<=100);
}
