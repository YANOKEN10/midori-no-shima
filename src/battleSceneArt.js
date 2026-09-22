import {drawWindow123} from './windowArt123.js';
import {heroBattle119} from './peopleArt119.js';
import {boyHairPortrait} from './revampArt.js';
const scene=new Image(),trainers=new Image();scene.src=new URL('../assets/world-v19/battle.png',import.meta.url).href;trainers.src=new URL('../assets/world-v19/trainers.png',import.meta.url).href;
export const readyBattleArt=()=>scene.complete&&scene.naturalWidth&&trainers.complete&&trainers.naturalWidth;
export {drawBattleBackground as drawBattleScene} from './battleBackgrounds.js';
export function drawBattlePanel(c,x=0,y=208,w=320,h=80){drawWindow123(c,x,y,w,h,true);}
export function drawTrainerBack(c,look={},x=28,y=120){const hero=heroBattle119(look,'back');if(!hero)return;c.imageSmoothingEnabled=false;c.drawImage(hero,Math.round(x),Math.round(y)-32,80,120);}
