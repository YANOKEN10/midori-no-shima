// Follow the traversed path with enough space for the visible sprite, including corners.
export class FollowerTrail {
 reset(x,y,dir='down'){this.points=[{x,y,dir}];this.pose=null;this.last=null;}
 face(x,y,dir,canStand=()=>true){
  if(this.points?.length>1&&this.points.at(-1).dir===dir)return;
  const [dx,dy]=({up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]})[dir]||[0,1],d=this.distance||1;
  const bx=x-dx*d,by=y-dy*d;
  if(!canStand(bx,by))return;
  this.points=[{x:bx,y:by,dir},{x,y,dir}];this.pose={x:bx,y:by,dir,moving:false};
 }
 record(x,y,dir){const end=this.points.at(-1);if(!end){this.reset(x,y,dir);return;}if(Math.hypot(x-end.x,y-end.y)>2.1){this.reset(x,y,dir);return;}if(Math.hypot(x-end.x,y-end.y)>.0001)this.points.push({x,y,dir});
 const distance=this.distance||1;let traversed=0,pose=null;
 for(let i=this.points.length-1;i>0;i--){const b=this.points[i],a=this.points[i-1],d=Math.hypot(b.x-a.x,b.y-a.y);if(!d)continue;
 if(traversed+d>=distance){const t=Math.max(0,Math.min(1,(traversed+d-distance)/d)),candidate={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,dir:b.dir};
 if(Math.hypot(candidate.x-x,candidate.y-y)>=distance*.95){pose=candidate;break;}
 if(Math.hypot(a.x-x,a.y-y)>=distance*.95){pose={...a,dir:b.dir};break;}}
 traversed+=d;}
 if(pose){pose.moving=!!this.pose&&Math.hypot(pose.x-this.pose.x,pose.y-this.pose.y)>.0001;this.pose=pose;}else if(this.pose&&Math.hypot(this.pose.x-x,this.pose.y-y)<distance*.95)this.pose=null;
 // Keep a short history for switchbacks; a corner must not bring the follower inside the hero.
 let length=0;for(let i=this.points.length-1;i>0;i--){length+=Math.hypot(this.points[i].x-this.points[i-1].x,this.points[i].y-this.points[i-1].y);if(length>Math.max(8,distance*4)){this.points.splice(0,i-1);break;}}
 }
}
