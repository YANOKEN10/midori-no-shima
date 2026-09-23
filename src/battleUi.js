import {t166} from './i18n166.mjs';
// Canvas labels share a visual centre, independent of font ascender spacing.
export function battleLabel(c,text,x,cy,{size=14,color='#f2f9ff',align='left',numeric=false,maxWidth}={}){
 text=t166(text);c.save();c.font='700 '+size+'px '+(numeric?'"Consolas", "Courier New", monospace':'"M PLUS Rounded 1c", "DotGothic16", sans-serif');
 c.textBaseline='alphabetic';c.textAlign=align;c.fillStyle=color;
 const m=c.measureText(text),a=m.actualBoundingBoxAscent||size*.8,d=m.actualBoundingBoxDescent||size*.2;
 if(maxWidth)c.fillText(text,x,Math.round(cy+(a-d)/2),maxWidth);else c.fillText(text,x,Math.round(cy+(a-d)/2));c.restore();
}
export function battleCells(b){const inset=12,gap=8,h=26,rowGap=6,w=(b.w-inset*2-gap)/2;return Array.from({length:4},(_,i)=>({x:b.x+inset+i%2*(w+gap),y:b.y+11+Math.floor(i/2)*(h+rowGap),w,h}));}
