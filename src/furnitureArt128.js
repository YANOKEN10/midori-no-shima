import {FURNITURE128} from './furnitureCatalog128.mjs';
const tinted128=new Map();
const images=new Map();
const overrides={books:'books',kitchen:'kitchen','lab-bookshelf86':'lab-bookshelf'};
export function furnitureReady128(){return [...images.values()].every(i=>i.complete&&i.naturalWidth);}
export function drawFurniture128(c,kind,x,y,w,h){
 const spec=FURNITURE128.find(p=>p.key===kind),asset=spec?.asset128||overrides[kind];if(!asset)return false;
 let img=images.get(asset);if(!img){img=new Image();img.src='/assets/furniture-v128/'+asset+'.png';images.set(asset,img);}
 if(!img.complete||!img.naturalWidth)return true;
 let sprite=img;
 if(spec?.tint128){const key=asset+spec.tint128;if(!tinted128.has(key)){const cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;const cx=cv.getContext('2d');cx.drawImage(img,0,0);const data=cx.getImageData(0,0,cv.width,cv.height),rgb=[1,3,5].map(i=>parseInt(spec.tint128.slice(i,i+2),16));for(let i=0;i<data.data.length;i+=4){const hi=Math.max(data.data[i],data.data[i+1],data.data[i+2]);if(!data.data[i+3]||hi<48)continue;const shade=hi/205;for(let j=0;j<3;j++)data.data[i+j]=Math.min(255,Math.round(rgb[j]*shade));}cx.putImageData(data,0,0);tinted128.set(key,cv);}sprite=tinted128.get(key);}
 c.imageSmoothingEnabled=false;c.drawImage(sprite,x,y,w,h);
 return true;
}
