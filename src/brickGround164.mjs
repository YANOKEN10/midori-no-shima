// One 32px cell, staggered 16x8px bricks; identical edges repeat without seams.
export const BRICK164=[['gray-brick-floor164','灰色レンガの床（1マス）','f'],['gray-brick-wall164','灰色レンガの壁（1マス）','X']];
export function drawBrick164(c,key,x,y){if(!BRICK164.some(p=>p[0]===key))return false;c.fillStyle='#696574';c.fillRect(x,y,32,32);for(let row=0;row<4;row++){const yy=y+row*8;c.fillStyle=row%2?'#6d6978':'#666271';c.fillRect(x,yy,32,8);c.fillStyle='#888391';c.fillRect(x,yy,32,1);c.fillStyle='#777281';const shift=row%2?8:0;for(let xx=shift;xx<32;xx+=16)c.fillRect(x+xx,yy+1,1,7);}return true;}
