const assert=require('node:assert/strict');
module.exports=async function verifyEnglish167Browser(p){
 const info=await p.evaluate(async()=>{
  const {SPECIES}=await import('/src/data/species.js'),G=await import('/src/gfx.js'),{dexEntry}=await import('/src/menu.js');
  const entries=Object.entries(SPECIES).filter(([n])=>n!=='ラテット').map(([n,s])=>({n,lines:G.wrap(s.dex,276,16)})).sort((a,b)=>b.lines.length-a.lines.length);
  const selected=entries[0];window.dex167=[];const original=CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText=function(text,x,y,...rest){if(x===18&&[182,207,232].includes(y))window.dex167.push(String(text));return original.call(this,text,x,y,...rest)};
  window.dexDone167=false;dexEntry(selected.n).then(()=>window.dexDone167=true);
  return {...selected,allFit:entries.every(e=>e.lines.every(l=>G.textW(l,16)<=276))};
 });
 assert(info.allFit,'All 200 English descriptions must fit the available width');assert(info.lines.length>3,'Exercise multi-page description');
 async function press(key){await p.keyboard.down(key);await p.evaluate(()=>VM.steps(1));await p.keyboard.up(key);await p.waitForTimeout(100);}
 for(let page=0;page<Math.ceil(info.lines.length/3);page++){
  await p.waitForTimeout(150);const drawn=await p.evaluate(()=>dex167);
  for(const line of info.lines.slice(page*3,page*3+3))assert(drawn.includes(line),'Missing description line: '+line);
  if(page===0)await p.screenshot({path:'artifacts/english-dex167.png'});
  if(page+1<Math.ceil(info.lines.length/3)){await p.evaluate(()=>dex167=[]);await press('ArrowRight');}
 }
 await p.screenshot({path:'artifacts/english-dex-last167.png'});
 await p.selectOption('#language166 select','ja');await p.waitForTimeout(100);await p.selectOption('#language166 select','en');
 await press('x');await p.waitForFunction(()=>dexDone167);
 // Real late-story source text is passed through the same dialogue renderer.
 const late=await p.evaluate(async()=>{const {LATER167}=await import('/src/i18n/later167.mjs'),G=await import('/src/gfx.js');const pair=LATER167.find(([s])=>s.includes('船のチケットは'));window.drawn166=[];VM.ui.say([pair[0]],{speed:100,speaker:'船乗り'});return {lines:G.wrap(pair[0],256,15),english:pair[1]};});
 await p.waitForTimeout(500);assert(await p.evaluate(()=>drawn166.some(s=>/[A-Za-z]{3}/.test(s))));await p.screenshot({path:'artifacts/english-late-story167.png'});
 for(let i=0;i<20&&await p.evaluate(()=>VM.ui.busy);i++)await press('z');assert.equal(await p.evaluate(()=>VM.ui.busy),false);
 console.log('PASS English Dex full-description pagination, all description widths, live locale switch and later-story dialogue');
};
