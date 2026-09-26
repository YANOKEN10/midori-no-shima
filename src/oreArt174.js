// Native 16px item sprites, matching one Gaon map cell at 2x scale.
// Palette indices are explicit pixels: no antialiased paths or fractional strokes.
const wood={o:'#423329',s:'#65432f',b:'#895332',m:'#ad7040',l:'#ca9254',h:'#e5b873',c:'#f2d393',r:'#795037',d:'#302c28'};
const rock={o:'#303944',s:'#424d59',b:'#56636b',m:'#748389',l:'#95a1a0',h:'#bcc7bc',c:'#dbe0c9',v:'#343d45',d:'#252f38'};
const amber={o:'#68422f',s:'#8b4d29',b:'#ae642b',m:'#d98b32',l:'#ecb342',h:'#f5d077',c:'#fff0ae',r:'#b37129',d:'#50392a'};
const crystal={o:'#31495e',s:'#35697f',b:'#438ca3',m:'#63b9c8',l:'#96dfe0',h:'#c8f2e6',c:'#f3ffe9',v:'#355466',d:'#293b50'};
const sprites={
 'もくざい':{palette:wood,rows:[
 '................','................','......oooooo....','....oobmllmso...','...ohclmmlmbso..','..ohrrhlmmlmso..','..olrlhmmmbsso..','...ollmbsssoo...','..oooooooomso...','.ohclmmlmmbso...','ohrrhllmmbssso..','olrlhmmbssssoo..','ohllmssssooo....','.osbsoooo.......','..ddddd.........','................']},
 'じゅし':{palette:amber,rows:[
 '................','.......oo.......','......ohlo......','.....ohclmo.....','.....ohlmbo.....','....ohllmbso....','....olmmmbso....','....ommmbrso....','.....obbrso.....','..ooo.osso.oo...','.ohclo.oo.ohmo..','.ollmbo..olmbso.','.ommbso..ombbso.','..osso....osso..','...dd......dd...','................']},
 'かたいもくざい':{palette:{...wood,o:'#352e2a',s:'#4e3830',b:'#68432f',m:'#875936',l:'#ab7748',h:'#cda05f',c:'#e4c081',r:'#62432c'},rows:[
 '................','........oooo....','......oolmlso...','....oolmmmbso...','..oohclmmbbso...','.ohrrhlmmbsso...','.olcrhlmmbso....','.ohrrlmbssoo....','..olllbsoo......','...osso.oooo....','.....oolmlmso...','....ohlmmbbso...','....ommmbsso....','.....osssoo.....','......dddd......','................']},
 'こいし':{palette:rock,rows:[
 '................','................','......oooo......','....oohlmlso....','...ohhllmmbso...','..ohllmmmbbso...','..ollmlmbbsso...','..ommmbbvbsso...','...obbbvssso....','....ossssoo.....','..ooo.ddd.ooo...','.ohlmo...ohlmso.','.ommbso..ommbso.','..osso....osso..','...dd......dd...','................']},
 'てっこうせき':{palette:{...rock,a:'#a8adb0',f:'#d5d8cf',g:'#717a82'},rows:[
 '................','......oooo......','....oohllmso....','...ohllammbso...','..ohllaffmbsso..','..olmaagmmbbso..','.ohlmagmbbbvso..','.olmmmmbbvvbso..','.ommagmbvaabso..','..obaffmvgasso..','..obbambbgsso...','...obbbsssso....','....ossssoo.....','.....dddd.......','................','................']},
 'どうこうせき':{palette:{...rock,a:'#bd773c',f:'#efb36b',g:'#81523b'},rows:[
 '................','................','.....ooooo......','...oohllmmso....','..ohllafambso...','..ollafggmbso...','.ohlmaagmmbsso..','.olmmgmbbafgso..','.ommbbvbaffaso..','.obbbvbgagbsso..','..osbbmbbgsso...','...obbbsssso....','....ossssoo.....','.....ddddd......','................','................']},
 'きんこうせき':{palette:{...rock,a:'#d6a442',f:'#f4d677',g:'#94703c',c:'#fff0b0'},rows:[
 '................','.......ooo......','.....oohlmso....','...oohllcfmso...','..ohllafagmbso..','..ollafggmbbso..','.ohlmaagmmvbso..','.olmmggmbvvbso..','.ommbbvbvafaso..','..obbbvgacfgso..','..osbabmgagsso..','...ofagbbsso....','....ossssoo.....','.....dddd.......','................','................']},
 'ひかりのけっしょう':{palette:crystal,rows:[
 '................','.......o........','......ohlo......','......ocmso.....','.....ohcmso.....','..oo.ohlmso.....','.ohlolhlmbso....','.ocmsolhmbso.oo.','.ohmsohlmbsoohlo','..ombsllmbsolmso','..obbsllmbsomso.','...obmlmbblbso..','...obmmmbbbso...','....osssssoo....','.....ddddd......','................']}
};
export const ORE_NAMES174=Object.freeze(Object.keys(sprites));
const cache=new Map();
export function drawOre174(ctx,name,x,y,size=32){
 const sprite=sprites[name];if(!sprite)return false;
 let canvas=cache.get(name);if(!canvas){canvas=document.createElement('canvas');canvas.width=canvas.height=16;const c=canvas.getContext('2d');sprite.rows.forEach((row,py)=>{if(row.length!==16)throw new Error(name+' sprite row '+py+' width '+row.length);[...row].forEach((key,px)=>{if(key!=='.'){if(!sprite.palette[key])throw new Error(name+' palette '+key);c.fillStyle=sprite.palette[key];c.fillRect(px,py,1,1);}});});cache.set(name,canvas);}
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(canvas,Math.round(x),Math.round(y),Math.round(size),Math.round(size));ctx.restore();return true;
}
