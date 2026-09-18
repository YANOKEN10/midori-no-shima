// Height is an optional map layer. Original maps retain their previous movement.
export const height75=(m,x,y)=>m.elevationIndex75?.[Math.floor(x)+','+Math.floor(y)]||0;
export function canTraverse75(m,ax,ay,bx,by){ax=Math.floor(ax);ay=Math.floor(ay);bx=Math.floor(bx);by=Math.floor(by);if(height75(m,ax,ay)===height75(m,bx,by))return true;if(ax!==bx||Math.abs(ay-by)!==1||Math.abs(height75(m,ax,ay)-height75(m,bx,by))!==1)return false;return (m.climbs75||[]).some(l=>l.x===ax&&l.y===Math.max(ay,by));}
export function climbAt75(m,x,y){x=Math.floor(x);y=Math.floor(y);return (m.climbs75||[]).find(l=>l.x===x&&(l.y===y||l.y-1===y));}
