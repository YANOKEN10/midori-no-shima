export const FURNITURE123=[
 ['tower-counter123','タワー受付',4,2],['tower-trophy123','金の優勝杯',2,3],['tower-seats123','タワー待合席',3,2],['tower-lamp123','タワー照明',1,2],
 ['galaxy-counter123','ギャラクシー受付',4,2],['galaxy-trophy123','星のクリスタル',2,3],['galaxy-seats123','ギャラクシー待合席',3,2],['galaxy-lamp123','星の照明',1,2],
 ['ruin-table123','廃墟の食卓',4,2],['ruin-books123','廃墟の本棚',2,3],['ruin-tv123','廃墟のテレビ',2,2],['ruin-bed123','廃墟のベッド',2,3]
];
function hash(m){let n=2166136261;for(const c of JSON.stringify(m.npcs?.some(n=>n.managed120)?{...m,npcs:m.npcs.filter(n=>!n.managed120)}:m)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return(n>>>0).toString(16);}
const npc=(name,script,x,y,variant=5)=>({name,script,x,y,variant,look:'hiker',dir:'down',noRoam:true,talk:[]});
function finish(m,grid,furniture){for(const[,x,y,w,h]of furniture)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy]?.[xx]!==undefined)grid[yy][xx]='t';for(const n of m.npcs)grid[n.y][n.x]='f';for(const p of m.warps)grid[p.y][p.x]='f';m.rows=grid.map(r=>r.join(''));m.room.furniture=furniture;return m;}
function hall(old,mode,arena=false){const id=arena?mode+'Battle123':old.id,w=26,h=24,grid=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>1&&x<24&&y>2&&y<23?'f':'X')),prefix=mode==='tower'?'tower':'galaxy';
 const m={...old,id,name:(mode==='tower'?'チャンピオンタワー':'ギャラクシービル')+(arena?'・対戦フロア':'・エントランス'),kind:'in',tileWorld:true,freeMove:false,props:[],enc:null,items:[],signs:[],spawn:{x:12,y:19},interior123:arena?'arena':'lobby',facility123:mode,explorationDesign:true,room:{theme:'lab',bounds:[2,3,22,20],windows:[4,20],rug:arena?[7,9,12,8]:[10,16,6,5],furniture:[]}};
 if(!arena){m.legacyHash123=hash(old);m.legacyObjects123=(old.props||[]).map((p,i)=>({id:'p:'+i,template:p.art}));m.legacyActors123=old.npcs.map(n=>({x:n.x,y:n.y}));m.npcs=old.npcs.map((n,i)=>i?{...n}:({...n,x:12,y:9}));m.warps=old.warps.map(p=>({...p}));}
 else{delete m.legacyHash123;delete m.legacyObjects123;delete m.legacyActors123;m.npcs=[npc('対戦相手','facility123:battle',12,8,6),npc('休憩係','facility123:pause',6,14,5)];m.warps=[{x:12,y:23,to:old.id,tx:12,ty:15}];}
 const f=arena?[[prefix+'-lamp123',7,8,1,2],[prefix+'-lamp123',18,8,1,2],[prefix+'-lamp123',7,18,1,2],[prefix+'-lamp123',18,18,1,2],[prefix+'-trophy123',3,4,2,3],[prefix+'-trophy123',21,4,2,3]]:[[prefix+'-counter123',10,10,4,2],[prefix+'-counter123',6,10,4,2],[prefix+'-counter123',14,10,4,2],[prefix+'-trophy123',3,4,2,3],[prefix+'-trophy123',21,4,2,3],[prefix+'-seats123',3,16,3,2],[prefix+'-seats123',20,16,3,2],['plant',3,20,1,1],['plant',22,20,1,1]];
 // A clear central lane connects the saved entrance and reception.
 grid[23][12]='f';return finish(m,grid,f);
}
function ruin(old){const w=old.rows[0].length,h=old.rows.length,g=Array.from({length:h},()=>Array(w).fill('X')),m={...old,kind:'in',tileWorld:true,freeMove:false,interior123:'ruin',explorationDesign:true,legacyHash123:hash(old),legacyObjects123:(old.props||[]).map((p,i)=>({id:'p:'+i,template:p.art})),legacyActors123:old.npcs.map(n=>({x:n.x,y:n.y})),props:[],room:{theme:'cottage',bounds:[2,3,w-4,h-4],windows:[],rug:[0,0,0,0],furniture:[]}};
 const floor=(x,y,ww,hh)=>{for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)if(g[yy]?.[xx]!==undefined)g[yy][xx]='f';};
 // Central corridor, connected dining halls, and four pairs of abandoned rooms.
 floor(18,0,7,h);const f=[];
 for(let y=5;y<h-10;y+=14){floor(3,y,15,10);floor(25,y,14,10);floor(16,y+7,11,3);f.push(['ruin-books123',4,y+1,2,3],['ruin-table123',8,y+3,4,2],['chair',8,y+6,1,1],['chair',11,y+6,1,1],['ruin-bed123',35,y+2,2,3],['ruin-tv123',27,y+1,2,2]);}
 for(const n of m.npcs){floor(Math.max(2,n.x-1),Math.max(1,n.y-1),3,3);floor(Math.min(n.x,20),n.y,Math.abs(n.x-20)+1,1);}
 return finish(m,g,f);
}
export function addInteriors123(maps){for(const[id,mode]of[['championTower','tower'],['galaxyArena','galaxy']]){const old=maps[id];if(!old||old.interior123)continue;maps[id]=hall(old,mode);maps[mode+'Battle123']=hall(old,mode,true);}for(const id of ['dark1','dark2','dark3','dark4'])if(maps[id]&&!maps[id].interior123)maps[id]=ruin(maps[id]);return maps;}
// Preserve user-added objects and actor customization when upgrading older layouts.
export function upgradeInteriors123(base,d){if(!base.interior123||d.interiors123)return d;const removed=new Set((base.legacyObjects123||[]).map(o=>o.id)),objects=d.objects.filter(o=>!removed.has(o.id)).flatMap(o=>{if(!o.id.startsWith('g:')||base.interior123!=='ruin')return[o];const k=Number(o.id.slice(2)),w=base.rows[0].length;if(o.x===k%w&&o.y===Math.floor(k/w)&&!o.turn81&&!o.color115)return[];return[{...o,id:'a:legacy123-'+o.id.replace(':','-')}];});
 for(const[f,a]of base.room.furniture.entries())if(!objects.some(o=>o.id==='f:'+f))objects.push({id:'f:'+f,type:'furniture',template:a[0],x:a[1],y:a[2]});
 const actors=d.actors.map(a=>{const i=Number(a.id.slice(2)),old=base.legacyActors123?.[i],n=base.npcs[i];return old&&n&&a.x===old.x&&a.y===old.y?{...a,x:n.x,y:n.y}:a;});return{...d,interiors123:true,objects,actors,rug:base.room.rug};}
