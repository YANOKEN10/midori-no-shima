export const STAT_LABELS122={hp:'HP',atk:'アタック',def:'ブロック',spc:'マジック',sdef:'バリア',spd:'スピード'};
export const EV_ITEMS122=Object.entries(STAT_LABELS122).map(([stat,label])=>({name:label+'リセットの実',kind:'evReduce',stat,amount:10,price:500,desc:label+'の努力値を10減らす。0より下にはならない。'}));
export function reduceEffort122(mon,stat){if(!Object.hasOwn(STAT_LABELS122,stat))return 0;mon.ev||={};const current=Math.max(0,Number(mon.ev[stat])||0),amount=Math.min(10,current);mon.ev[stat]=current-amount;return amount;}
export function participationRewards122(party,participants,winner,gain){return party.filter(m=>m===winner||participants.has(m)).map(mon=>({mon,amount:mon===winner?gain:Math.floor(gain/2)})).filter(r=>r.amount>0);}
export const effortText122=sp=>Object.entries(STAT_LABELS122).filter(([key])=>(sp.evYield?.[key]||0)>0).map(([key,label])=>label+' +'+sp.evYield[key]).join('・')||'なし';

export const EV_ITEM_ALIASES125={"こうげきリセットの実":"アタックリセットの実","ぼうぎょリセットの実":"ブロックリセットの実","とくこうリセットの実":"マジックリセットの実","とくぼうリセットの実":"バリアリセットの実","すばやさリセットの実":"スピードリセットの実"};
export const canonicalTrainingItem125=name=>EV_ITEM_ALIASES125[name]||name;
