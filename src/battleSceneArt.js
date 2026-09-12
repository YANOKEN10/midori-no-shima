const scene=new Image(),trainers=new Image();scene.src=new URL('../assets/world-v19/battle.png',import.meta.url).href;trainers.src=new URL('../assets/world-v19/trainers.png',import.meta.url).href;
export const readyBattleArt=()=>scene.complete&&scene.naturalWidth&&trainers.complete&&trainers.naturalWidth;
export {drawBattleBackground as drawBattleScene} from './battleBackgrounds.js';
export function drawBattlePanel(c,x=0,y=208,w=320,h=80){c.imageSmoothingEnabled=false;if(scene.complete&&scene.naturalWidth)c.drawImage(scene,0,208,320,80,x,y,w,h);else{c.fillStyle='#294f62';c.fillRect(x,y,w,h);}}
const cache=new Map();
export function drawTrainerBack(c,look={},x=28,y=120){
 if(!trainers.complete||!trainers.naturalWidth)return;const key=JSON.stringify(look);let cv=cache.get(key);
 if(!cv){cv=document.createElement('canvas');cv.width=80;cv.height=88;const cx=cv.getContext('2d');cx.drawImage(trainers,look.gender==='girl'?80:0,0,80,88,0,0,80,88);const im=cx.getImageData(0,0,80,88),rgb=h=>/^#[0-9a-f]{6}$/i.test(h||'')?[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)):null,hair=rgb(look.hair),shirt=rgb(look.shirt);for(let i=0;i<im.data.length;i+=4){const r=im.data[i],g=im.data[i+1],b=im.data[i+2],py=Math.floor(i/4/80);let color=null,f=1;if(py<53&&hair&&r>g*1.18&&g>b*1.15&&r>45){color=hair;f=(r+g+b)/260;}else if(shirt&&b>r*1.4&&b>g*1.12&&b>50){color=shirt;f=b/180;}if(color)for(let j=0;j<3;j++)im.data[i+j]=Math.min(255,Math.round(color[j]*f));}cx.putImageData(im,0,0);cache.set(key,cv);}
 c.drawImage(cv,Math.round(x),y);
}
