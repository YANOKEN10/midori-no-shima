// Newly designed NPC atlas. Each facing is normalized to the hero's 30 x 46 body box.
const atlas=new Image();atlas.src=new URL('../assets/world-v5/people-v6.png',import.meta.url).href;
const frames=new Map();
const rows=[0,210,402,596,789,983,1175,1350,1536];
export function npcFrame(n){
 if(!atlas.complete||!atlas.naturalWidth)return null;
 const row=n.script==='v5:mother'?7:({boy:0,girl:1,prof:2,oldman:3,nurse:4,clerk:5,hiker:6,sailor:6})[n.look]??0;
 const col=({down:0,left:1,right:2,up:3})[n.dir]??0,key=row+':'+col;
 if(frames.has(key))return frames.get(key);
 const left=[105,325,540,755][col],top=rows[row],w=175,h=rows[row+1]-top;
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,left,top,w,h,0,0,w,h);
 const data=ctx.getImageData(0,0,w,h),p=data.data,seen=new Uint8Array(w*h),q=[];
 const visit=i=>{if(i<0||i>=w*h||seen[i])return;seen[i]=1;const j=i*4,r=p[j],g=p[j+1],b=p[j+2];if(p[j+3]===0||(Math.min(r,g,b)>220&&Math.max(r,g,b)-Math.min(r,g,b)<16)){p[j+3]=0;q.push(i)}};
 for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x)}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1)}
 for(let k=0;k<q.length;k++){const i=q[k];if(i%w)visit(i-1);if(i%w<w-1)visit(i+1);visit(i-w);visit(i+w)}
 let x0=w,y0=h,x1=-1,y1=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>8){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
 ctx.putImageData(data,0,0);const out=document.createElement('canvas');out.width=32;out.height=48;
 const oc=out.getContext('2d');oc.imageSmoothingEnabled=false;
 const bw=x1-x0+1,bh=y1-y0+1,scale=Math.min(30/bw,46/bh),dw=Math.round(bw*scale),dh=Math.round(bh*scale);
 oc.drawImage(c,x0,y0,bw,bh,Math.floor((32-dw)/2),48-dh,dw,dh);frames.set(key,out);return out;
}
export function drawNpc(ctx,n,tick,x,y){
 const f=npcFrame(n);if(!f)return false;
 const step=n.moving?Math.sin(n.roamProgress*Math.PI*4):0;
 ctx.imageSmoothingEnabled=false;
 // Small alternating foot movement and a one-pixel body rise during each step.
 x=Math.round(x);y=Math.round(y-Math.abs(step));
 ctx.drawImage(f,0,0,32,40,x,y,32,40);
 ctx.drawImage(f,0,40,16,8,x,y+40+Math.round(step),16,8);
 ctx.drawImage(f,16,40,16,8,x+16,y+40-Math.round(step),16,8);
 return true;
}
