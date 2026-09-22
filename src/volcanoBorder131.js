import {drawStyle105} from './styleArt105.js';
export function volcanoBorder131(c,m,x,y){
 if(!/^volcano(?:[123]|Summit)$/.test(m.id))return false;const w=m.rows[0].length,h=m.rows.length;
 if(x>1&&y>1&&x<w-2&&y<h-2)return false;if(!['R','X','T','#'].includes(m.rows[y]?.[x])||m.warps.some(p=>p.x===x&&p.y===y))return false;
 const left=x<2,right=x>=w-2,top=y<2,bottom=y>=h-2;
 const key=left&&(top||bottom)?'cliff118-corner-left':right&&(top||bottom)?'cliff118-corner-right':left?'cliff118-left':right?'cliff118-right':'cliff118-h';
 c.fillStyle='#66503b';c.fillRect(x*32,y*32,32,32);drawStyle105(c,key,x*32,y*32,32,32);return true;
}
