import {UI_FONT200,uiFont200} from './typography200.mjs';
import {parts197} from './easyJapanese197.mjs';
import {t166,language166} from './i18n166.mjs';
const family=UI_FONT200;
const getParts=s=>language166()==='ja'?parts197(s):[...t166(s)].map(text=>({text}));
function measure(c,parts,size){const rubySize=Math.max(7,Math.round(size*.54));return parts.map(p=>{c.font=uiFont200(size);const base=c.measureText(p.text).width;c.font='600 '+rubySize+'px '+family;const rw=p.ruby?c.measureText(p.ruby).width:0;return {...p,width:Math.max(base,rw)+ (p.ruby?1:0),base,rubySize};});}
export function width197(c,s,size=15){c.save();const w=measure(c,getParts(s),size).reduce((n,p)=>n+p.width,0);c.restore();return w;}
export function wrap197(c,s,maxWidth,size=15){
 c.save();const lines=[],tokens=measure(c,getParts(s),size);let line=[],width=0;
 const closing=/^[、。，．！？!?：:；;）)」』】〉》]+$/;
 const flush=()=>{while(line.at(-1)?.text===' ')line.pop();lines.push({parts:line,text:line.map(p=>p.text).join('')});line=[];width=0;};
 for(let i=0;i<tokens.length;i++){const p=tokens[i];if(p.text==='\n'){flush();continue;}if(!line.length&&/^\s+$/.test(p.text))continue;
 let reserve=0;for(let j=i+1;j<tokens.length&&closing.test(tokens[j].text);j++)reserve+=tokens[j].width;
 if(width+p.width+reserve>maxWidth&&line.length&&!closing.test(p.text))flush();
 if(p.width>maxWidth){for(const q of measure(c,[...(p.ruby||p.text)].map(text=>({text})),size)){if(width+q.width>maxWidth&&line.length)flush();line.push(q);width+=q.width;}}else{line.push(p);width+=p.width;}
 }if(line.length||!lines.length)flush();c.restore();return lines;
}
export function drawLine197(c,line,x,y,size=15,color='#244844',shown=Infinity){c.save();c.textBaseline='top';c.textAlign='left';c.fillStyle=color;for(const p of line.parts){if(shown<=0)break;const text=p.text.slice(0,shown);c.font=uiFont200(size);c.fillText(text,x+(p.width-p.base)/2,y);if(p.ruby&&shown>=p.text.length){c.font='600 '+p.rubySize+'px '+family;const rw=c.measureText(p.ruby).width;c.fillText(p.ruby,x+(p.width-rw)/2,y-p.rubySize-1);}shown-=p.text.length;x+=p.width;}c.restore();}
export function fit197(c,s,x,y,maxWidth,size=13,color='#244844'){c.save();let parts=measure(c,getParts(s),size),width=parts.reduce((n,p)=>n+p.width,0);if(width>maxWidth){const dot=measure(c,[{text:'…'}],size)[0];while(parts.length&&width+dot.width>maxWidth)width-=parts.pop().width;parts.push(dot);}drawLine197(c,{parts},x,y,size,color);c.restore();}
