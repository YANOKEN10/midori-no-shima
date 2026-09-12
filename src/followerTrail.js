// Follow the actual traversed polyline, one tile behind the player's feet.
export class FollowerTrail {
 reset(x,y,dir='down'){this.points=[{x,y,dir}];this.pose=null;this.last=null;}
 record(x,y,dir){const end=this.points.at(-1);if(!end){this.reset(x,y,dir);return;}if(Math.hypot(x-end.x,y-end.y)>2.1){this.reset(x,y,dir);return;}if(Math.hypot(x-end.x,y-end.y)>0.0001)this.points.push({x,y,dir});
  let left=this.distance||1,pose=null;for(let i=this.points.length-1;i>0;i--){const b=this.points[i],a=this.points[i-1],d=Math.hypot(b.x-a.x,b.y-a.y);if(d>=left){const t=(d-left)/d;pose={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,dir:b.dir};if(i>1)this.points.splice(0,i-1);break;}left-=d;}
  if(pose){pose.moving=!!this.pose&&Math.hypot(pose.x-this.pose.x,pose.y-this.pose.y)>0.0001;this.pose=pose;}
 }
}
