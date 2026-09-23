// Shared with the original dungeon renderer: one tile is exactly 32 pixels.
export const DUNGEON_WALL165=[
 ['ruins-wall-top165','忘れられた遺跡・壁の上面（1マス）','X'],
 ['ruins-wall-front165','忘れられた遺跡・壁の手前（1マス）','X'],
 ['shadow-wall-top165','深闇の洞窟・壁の上面（1マス）','X'],
 ['shadow-wall-front165','深闇の洞窟・壁の手前（1マス）','X']
];
export function drawDungeonWall165(c,ruin,dx,dy,{front=false,left=false,right=false}={}){
 c.fillStyle=ruin?'#6b6878':'#344252';c.fillRect(dx,dy,32,32);
 c.fillStyle=ruin?'#858293':'#435267';
 for(let yy=0;yy<32;yy+=16){c.fillRect(dx+1,dy+yy+1,30,2);c.fillRect(dx+(yy/16%2?8:23),dy+yy+3,1,12);}
 if(front){c.fillStyle=ruin?'#343342':'#19232f';c.fillRect(dx,dy+21,32,11);c.fillStyle=ruin?'#a09aab':'#647083';c.fillRect(dx,dy+20,32,2);}
 if(left){c.fillStyle='#242d36';c.fillRect(dx,dy,2,32);}
 if(right){c.fillStyle='#242d36';c.fillRect(dx+30,dy,2,32);}
}
export function drawDungeonMaterial165(c,key,x,y){
 if(!DUNGEON_WALL165.some(p=>p[0]===key))return false;
 drawDungeonWall165(c,key.startsWith('ruins-'),x,y,{front:key.includes('-front')});return true;
}
