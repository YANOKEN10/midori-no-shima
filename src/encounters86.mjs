import {editorSpeciesName98} from './editorSpeciesAliases98.mjs';
// Shared whitelist validation for editor-created wild encounters.
export function validEncounters86(value,species){
 if(value===null)return true;
 return !!value&&Number.isInteger(value.rate)&&value.rate>=1&&value.rate<=100&&Array.isArray(value.list)&&value.list.length>=1&&value.list.length<=30&&new Set(value.list.map(e=>editorSpeciesName98(e?.[0]))).size===value.list.length&&value.list.every(e=>Array.isArray(e)&&e.length===4&&typeof e[0]==='string'&&e[0].length<=60&&(!species||species.includes(editorSpeciesName98(e[0])))&&e.slice(1).every(Number.isInteger)&&e[1]>=1&&e[2]>=e[1]&&e[2]<=100&&e[3]>=1&&e[3]<=100);
}
