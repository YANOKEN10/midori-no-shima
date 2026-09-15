const image=new Image();let bounds=null;
image.onload=()=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height).data;let l=c.width,t=c.height,r=0,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>128){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}if(r>=l)bounds=[l,t,r-l+1,b-t+1];};
image.src=new URL('../assets/sign-v59/sign.png',import.meta.url).href;
export const signReady=()=>!!bounds;
export function drawSign(ctx,x,y,w,h){if(!bounds)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(image,...bounds,x+2*w/32,y+2*h/32,w*28/32,h*28/32);return true;}
