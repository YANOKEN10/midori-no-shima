import {drawStyle105} from './styleArt105.js';
// Generated single-object sprites; readiness is included in the map cache guard.
const images={};for(const[key,file]of [['alpineCheese65','cheese-workshop.png'],['alpineGazebo65','lakeside-gazebo.png']]){const im=new Image();im.src=new URL('../assets/routes-v65/'+file,import.meta.url).href;images[key]=im;}
export function alpineReady65(map){return !map.alpineRoute65||map.props.every(p=>!images[p.art]||(images[p.art].complete&&images[p.art].naturalWidth>0));}
export function drawAlpineProp65(c,p,map,material){if(drawStyle105(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32))return true;
 if(!map.alpineRoute65)return false;
 if(p.art==='fir'){material(c,'fir',p.x*32,p.y*32,p.w*32,p.h*32);return true;}
 const im=images[p.art];if(!im)return false;
 if(im.complete&&im.naturalWidth){const width=p.w*32,height=p.h*32,scale=Math.min(width/im.width,height/im.height),dw=im.width*scale,dh=im.height*scale;c.imageSmoothingEnabled=false;c.drawImage(im,Math.round(p.x*32+(width-dw)/2),Math.round(p.y*32+height-dh),Math.round(dw),Math.round(dh));}return true;
}
