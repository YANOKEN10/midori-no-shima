const images=Object.fromEntries(['mountain','rural'].map(name=>{const im=new Image();im.src=new URL('../assets/grass-v25/'+name+'.png',import.meta.url).href;return[name,im];}));
export const grassTheme=map=>map.id==='mountain'?'mountain':['village','rods','route1','route2','natureforest','mossSanctuary'].includes(map.id)?'rural':null;
export const grassReady=map=>{const theme=grassTheme(map);return !theme||images[theme].complete&&images[theme].naturalWidth>0;};
// Transparent blades overlay each map's own ground, including the feet overlay.
export function drawBiomeGrass(c,map,x,y){const theme=grassTheme(map);if(!theme)return false;const im=images[theme];if(im.complete&&im.naturalWidth)c.drawImage(im,x,y,32,32);return true;}
