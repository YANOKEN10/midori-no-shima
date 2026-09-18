import * as G from './gfx.js';
const files={'ひかり':'light','くさ':'grass','ほのお':'fire','みず':'water','でんき':'electric','じめん':'ground','むし':'bug','やみ':'dark'},images=new Map();
export function drawTypeIcon77(type,x,y,size=20){const file=files[type];if(!file)return;let im=images.get(type);if(!im){im=new Image();im.src=new URL('../assets/types-v77/'+file+'.png',import.meta.url).href;images.set(type,im);}if(im.complete&&im.naturalWidth)G.drawScaled(im,x,y,size,size);}
