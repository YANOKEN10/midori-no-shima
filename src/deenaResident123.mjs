// Pure map placement shared by the browser and map-editor API.
export function addDeenaGuide94(maps){
 const m=maps.leafTown;if(!m||m.editor72||m.npcs.some(n=>n.script==='post:deenaGuide94'))return;
 const open=(x,y)=>['.',','].includes(m.rows[y]?.[x])&&![...m.npcs,...m.warps,...m.signs,...m.items||[]].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2)&&![...m.props||[],...m.editorAddedProps72||[]].some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y-1&&y<p.y+p.h+1);
 const choices=[];for(let y=3;y<m.rows.length-3;y++)for(let x=3;x<m.rows[y].length-3;x++)if(open(x,y)&&open(x,y+1))choices.push({x,y});
 choices.sort((a,b)=>Math.abs(a.x-m.spawn.x)+Math.abs(a.y-m.spawn.y)-Math.abs(b.x-m.spawn.x)-Math.abs(b.y-m.spawn.y));
 if(!choices.length)return;
 m.npcs.push({...choices[0],name:'虹の研究員 セイ',variant:33,dir:'down',noRoam:true,script:'post:deenaGuide94',talk:['虹の共鳴を 調べているんだ。']});
}
