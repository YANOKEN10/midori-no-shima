import {GOODS82} from './shopCatalog82.mjs';
// Stable placement IDs survive moves, storage and republishing; copies get new IDs.
export const PICKUPS138=GOODS82.map(({name})=>({key:'pickup138-'+[...name].map(c=>c.codePointAt(0).toString(16)).join('-'),art:'pickup138',label:name,pickup138:name,group:'pickup138',w:1,h:1,walkable:true}));
export const pickupFlag138=(map,id)=>'pickup138:'+map+':'+id;
export const pickupCount138=o=>o.count138===undefined?1:o.count138;
export const validPickupCount138=o=>Number.isInteger(pickupCount138(o))&&pickupCount138(o)>=1&&pickupCount138(o)<=99;
