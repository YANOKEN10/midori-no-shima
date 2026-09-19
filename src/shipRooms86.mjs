// Rebuild stock ship rooms before applying user edits. Preserve trainer IDs/scripts.
export function addShipRooms86(maps){
 if(!maps.shipDeck||maps.shipDeck.shipInterior86)return;
 const make=(id,name,w,h)=>maps[id]={id,name,kind:'in',chapter:3,tileWorld:true,shipRoom:true,biome:'ship',rows:Array.from({length:h},()=>''.padEnd(w,'f')),props:[],npcs:[],signs:[],items:[],objects:[],warps:[],spawn:{x:Math.floor(w/2),y:h-3}};
 make('shipCaptain86','連絡船・船長室',14,14);make('shipGalley86','連絡船・食堂と厨房',22,18);
 const furniture={
 shipDeck:[['ship-chair85',8,6,1,1],['ship-chair85',11,6,1,1],['ship-table85',9,5,2,2],['ship-chair85',21,6,1,1],['ship-chair85',24,6,1,1],['ship-table85',22,5,2,2],['ship-chair85',7,16,1,1],['ship-chair85',24,16,1,1]],
 shipLounge:[['sofa-h84',6,4,3,2],['sofa-h84',22,4,3,2],['ship-table85',7,7,2,2],['ship-table85',23,7,2,2],['ship-table85',7,15,2,2],['ship-table85',23,15,2,2],['ship-chair85',6,15,1,1],['ship-chair85',25,15,1,1],['lab-bookshelf86',4,2,2,2],['wall-clock86',15,0,1,1]],
 shipCabins:[['ship-bed86',4,3,1,2],['ship-bed86',20,3,1,2],['ship-bed86',4,16,1,2],['ship-bed86',20,17,1,2],['ship-desk85',7,3,3,2],['ship-desk85',23,3,3,2],['ship-table85',6,17,2,2],['ship-table85',23,18,2,2],['ship-chair85',8,5,1,1],['ship-chair85',24,5,1,1]],
 shipCaptain86:[['ship-desk85',3,5,3,2],['ship-chair85',4,3,1,1],['lab-bookshelf86',10,2,2,2],['wall-frame86',8,0,1,1],['plant84',10,9,1,2]],
 shipGalley86:[['ship-galley86',3,3,3,1],['ship-galley86',9,3,3,1],['ship-galley86',15,3,3,1],['ship-galley86',3,6,3,1],['ship-galley86',9,6,3,1],['ship-galley86',15,6,3,1],['ship-table85',4,10,2,2],['ship-table85',10,10,2,2],['ship-table85',16,10,2,2],['ship-chair85',3,10,1,1],['ship-chair85',6,10,1,1],['ship-chair85',9,10,1,1],['ship-chair85',12,10,1,1],['ship-chair85',15,10,1,1],['ship-chair85',18,10,1,1]]};
 const lounge=maps.shipLounge;
 lounge.warps.push({x:16,y:2,to:'shipCaptain86',tx:7,ty:11},{x:2,y:11,to:'shipGalley86',tx:11,ty:15});
 maps.shipCaptain86.warps=[{x:7,y:13,to:'shipLounge',tx:16,ty:3}];maps.shipGalley86.warps=[{x:11,y:17,to:'shipLounge',tx:3,ty:11}];
 maps.shipCaptain86.npcs=[{x:7,y:5,dir:'down',variant:12,name:'船長',noRoam:true,talk:['ようこそ、船長室へ。','船旅を ゆっくり楽しんでいってね。']}];
 maps.shipGalley86.npcs=[{x:8,y:5,dir:'down',variant:12,name:'船の料理人',noRoam:true,talk:['船の食堂へ ようこそ！']}];
 for(const[id,list]of Object.entries(furniture)){const m=maps[id],w=m.rows[0].length,h=m.rows.length,grid=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?'X':'f'));m.shipInterior86=true;m.props=[];m.room={theme:'home',bounds:[1,1,w-2,h-2],rug:[0,0,0,0],windows:[],furniture:list};
 if(id==='shipCabins'){for(let y=1;y<h-1;y++)if(y<10||y>12)grid[y][15]='X';for(let x=1;x<15;x++)if(x!==8&&x!==9)grid[8][x]='X';for(let x=16;x<w-1;x++)if(x!==23&&x!==24)grid[15][x]='X';}
 for(const[k,x,y,fw,fh]of list)if(!k.startsWith('wall-'))for(let j=y;j<y+fh;j++)for(let i=x;i<x+fw;i++)grid[j][i]='t';
 for(const wp of m.warps){grid[wp.y][wp.x]='x';if(grid[wp.y+1]&&wp.y+1<h-1)grid[wp.y+1][wp.x]='f';}
 for(const n of m.npcs)grid[n.y][n.x]='f';m.rows=grid.map(r=>r.join(''));
 }
 return maps;
}
