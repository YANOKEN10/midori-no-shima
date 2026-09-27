export const iceCrystal186=p=>['eIce','legacy73-eIce','ice-crystal-small186'].includes(p?.art||p?.key);
export function sizeIceCrystal186(p){
 if(!iceCrystal186(p))return p;
 const small=(p.key||p.art)==='ice-crystal-small186',size=small?1:2;
 return {...p,w:size,h:size,tile:'R',walkable:false,group:'rock',placement83:'props',label:small?'氷の結晶・1×1マス':'氷の結晶・2×2マス'};
}
