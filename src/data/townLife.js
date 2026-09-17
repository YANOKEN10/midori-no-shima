const names=['ハル','ソウタ','ミオ','レン','ユイ','カナ','アオイ','ナギ','フウカ','リク','ユズ','サキ','ヒナ','トウマ','シオン','ツバサ','コハル','ナオ','マキ','セイ'];
export function addTownLife(maps){let index=0;for(const m of Object.values(maps)){
 for(const n of m.npcs){if(n.artMon||n.itemArt||n.propArt)continue;const personal=names[index++%names.length];n.displayName=!n.name?personal:/人|ひと|町長|船長|おじさん|おばさん|研究員|少年|少女|女の子|男の子|おばあ|おじい|店員|スタッフ|ガイド|受付|住民/.test(n.name)?personal+'（'+n.name+'）':n.name;}
 if(m.kind!=='out'||!(/タウン|村/.test(m.name)||['village','rods'].includes(m.id)))continue;
 const safe=(x,y)=>[',','F'].includes(m.g[y]?.[x])&&[...m.warps,...m.signs,...m.npcs].every(n=>Math.abs(n.x-x)+Math.abs(n.y-y)>2)&&[[1,0],[-1,0],[0,1],[0,-1]].every(([dx,dy])=>[',','F','.'].includes(m.g[y+dy]?.[x+dx]));
 const spots=[];for(let y=4;y<m.g.length-4;y++)for(let x=4;x<m.g[y].length-4;x++)if(safe(x,y)&&spots.every(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)>6))spots.push([x,y]);
 for(const [i,[x,y]]of spots.slice(0,2).entries()){const sp=['リーフィン','トリッピ'][i];m.npcs.push({x,y,name:sp,displayName:sp,artMon:sp,residentPet:true,roamMon:true,dir:'down',talk:[sp+'は ごきげんに 過ごしている。']});}
 const owner=m.npcs.findIndex(n=>!n.artMon&&!n.trainer&&!n.noRoam&&n.displayName);if(owner>=0){const o=m.npcs[owner],near=[];for(let y=2;y<m.g.length-2;y++)for(let x=2;x<m.g[y].length-2;x++)if(safe(x,y))near.push({x,y,d:Math.hypot(x-o.x,y-o.y)});near.sort((a,b)=>a.d-b.d);if(near[0])m.npcs.push({x:near[0].x,y:near[0].y,name:'リーフィン',displayName:'リーフィン',artMon:'リーフィン',residentPet:true,roamMon:true,followOwner:owner,dir:'down',talk:['リーフィンは 飼い主のあとを ついて歩いている。']});}
}}
