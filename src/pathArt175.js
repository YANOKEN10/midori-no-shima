import{drawRoad,roadReady}from'./roadArt.js';
const centerImage=new Image();centerImage.src=new URL('../assets/garden-v75/grass-center.png',import.meta.url).href;
const fullRoad={id:'village',kind:'out',rows:['...','...','...']};
export const pathReady175=()=>roadReady(fullRoad)&&centerImage.complete&&centerImage.naturalWidth>0;
export function drawPath175(c,key,x,y,material){
 if(key==='grass-path175-center'){c.save();c.fillStyle='#8d805d';c.fillRect(x,y,32,32);if(centerImage.complete&&centerImage.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(centerImage,x,y,32,32);}c.restore();return true;}
 if(!key.startsWith('sand175-'))return false;
 c.save();c.translate(x,y);material(c,'grass',0,0,32,32);
 const kind=key.split('-')[1],turn=Number(key.split('-')[2]||0);
 c.save();c.translate(16,16);c.rotate(turn*Math.PI/2);c.translate(-16,-16);c.beginPath();
 if(kind==='inner'){c.rect(0,0,32,32);c.rect(0,0,4,4);c.rect(4,0,2,2);c.rect(0,4,2,2);c.clip('evenodd');}
 else{for(let row=0;row<32;row+=2){const inset=[2,4,2,2,4,2,4,2][(row/2)%8],left=kind==='corner'?inset:0,top=kind==='center'?0:2;if(row>=top)c.rect(left,row,32-left,2);}c.clip();}
 c.translate(-32,-32);drawRoad(c,fullRoad,1,1);c.restore();c.restore();return true;
}
