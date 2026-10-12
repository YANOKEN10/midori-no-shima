// The Galaxy rail stop has its own interior; town hospital and routes remain intact.
export function addGalaxyStation236(maps){
 if(maps.galaxyStation236||!maps.manikereoStation)return maps;
 const source=maps.manikereoStation,w=34,h=26;
 maps.galaxyStation236={...structuredClone(source),id:'galaxyStation236',name:'ギャラクシータウンの駅',spawn:{x:16,y:23},rows:Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>y>=24&&[16,17].includes(x)?'f':y===25?' ':x===0||x===w-1||y===0||y===24?'X':'f').join('')),props:[],items:[],signs:[],objects:[],npcs:source.npcs.map(n=>({...structuredClone(n),script:n.script==='frontier:train'?'frontier:returnTrain':n.script})),warps:[16,17].map(x=>({x,y:25,to:'galaxy',tx:18,ty:16})),enc:[]};
 return maps;
}
