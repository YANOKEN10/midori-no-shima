// Explicit rival identity survives display-name changes and facility saves.
export function battleMusic129(opts){
 const t=opts.trainer;
 if(t?.rivalBattle129==='tower')return 'towerRivalBattle';
 if(t?.rivalBattle129==='regular')return 'rivalBattle';
 return opts.tournament?'tournament':t&&(t.originalName80||t.name)==='ヤノケン'?'yanokenBattle':opts.emblemTest||t&&(t.leader||t.champ||t.major)?'boss':'battle';
}
