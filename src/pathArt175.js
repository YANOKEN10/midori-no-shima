import{drawNature73,natureReady73}from'./natureArt73.js';
import{drawRoad,roadReady}from'./roadArt.js';
const fullRoad={id:'village',kind:'out',rows:['...','...','...']};
export const pathReady175=()=>roadReady(fullRoad)&&natureReady73({editorGround72:[{material:'garden75-grass-center'}]});
export function drawPath175(c,key,x,y,material){
 if(key==='grass-path175-center'){c.save();c.fillStyle='#8d805d';c.fillRect(x,y,32,32);drawNature73(c,'garden75-grass-center',x,y,32,32);c.restore();return true;}
 if(!key.startsWith('sand175-'))return false;
 c.save();c.translate(x,y);material(c,'grass',0,0,32,32);
 const kind=key.split('-')[1],turn=Number(key.split('-')[2]||0);
 c.save();c.translate(16,16);c.rotate(turn*Math.PI/2);c.translate(-16,-16);c.beginPath();
 if(kind==='inner'){c.rect(0,0,32,32);c.rect(0,0,4,4);c.rect(4,0,2,2);c.rect(0,4,2,2);c.clip('evenodd');}
 else{for(let row=0;row<32;row+=2){const inset=[2,4,2,2,4,2,4,2][(row/2)%8],left=kind==='corner'?inset:0,top=kind==='center'?0:2;if(row>=top)c.rect(left,row,32-left,2);}c.clip();}
 c.translate(-32,-32);drawRoad(c,fullRoad,1,1);c.restore();c.restore();return true;
}
