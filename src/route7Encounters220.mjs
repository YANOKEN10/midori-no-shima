export const ROUTE7_ENCOUNTERS220={rate:20,terrain150:'grass',percent139:true,list:[['ハナビィ',16,19,30],['コガネム',16,20,30],['トリッピ',17,20,25],['シオネ',18,21,15]]};
export function upgradeRoute7220(base,doc){return base.id!=='route7'||doc.route7Encounters220?doc:{...doc,route7Encounters220:true,encounters86:structuredClone(ROUTE7_ENCOUNTERS220)};}
