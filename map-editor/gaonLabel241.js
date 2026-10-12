import {SPECIES} from '../src/data/species.js';
export function gaonLabel241(name){
 const no=SPECIES[name]?.no;
 return Number.isInteger(no)?'No.'+String(no).padStart(3,'0')+' '+name:name;
}
