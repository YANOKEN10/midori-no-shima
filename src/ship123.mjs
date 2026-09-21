function hash123(m){let n=2166136261;for(const c of JSON.stringify(m)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return(n>>>0).toString(16);}
const ids=['shipDeck','shipLounge','shipCabins','shipCaptain86','shipGalley86'];
export const EXTRA_SHIP123=['shipCorridor123',...Array.from({length:6},(_,i)=>'shipRoom123-'+(i+1))];
export function addShip123(maps){if(!maps.shipDeck||maps.shipDeck.interior123)return maps;
 for(const id of ids){const m=maps[id];m.legacyHash123=hash123(m);m.interior123=id==='shipDeck'?'deck':'ship';m.shipStyle123=true;}
 const make=(id,name,w,h)=>({id,name,kind:'in',chapter:3,tileWorld:true,shipRoom:true,biome:'ship',interior123:'ship',shipStyle123:true,rows:Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x&&y&&x<w-1&&y<h-1?'f':'X').join('')),props:[],npcs:[],signs:[],items:[],objects:[],warps:[],spawn:{x:Math.floor(w/2),y:h-3},room:{theme:'home',bounds:[1,1,w-2,h-2],rug:[0,0,0,0],windows:[],furniture:[]}});
 const corridor=maps.shipCorridor123=make('shipCorridor123','連絡船・客室廊下',30,10);corridor.warps.push({x:15,y:9,to:'shipCabins',tx:15,ty:11});maps.shipCabins.warps.push({x:15,y:10,to:corridor.id,tx:15,ty:8});
 for(let i=1;i<=6;i++){const m=maps['shipRoom123-'+i]=make('shipRoom123-'+i,'連絡船・客室 '+i,12,12),x=3+(i-1)*4;m.cabin123=true;m.warps=[{x:6,y:11,to:corridor.id,tx:x,ty:2}];corridor.warps.push({x,y:1,to:m.id,tx:6,ty:10});m.room.furniture=[['ship-bed86',8,3,1,2],['ship-desk85',2,3,3,2],['ship-chair85',3,6,1,1],['plant84',9,8,1,2]];m.npcs=[{x:6,y:5,dir:'down',variant:[8,14,20,23,27,31][i-1],name:'船の乗客',noRoam:true,talk:[['海の上の旅って 気持ちいいね。','甲板から 海を眺めてきたよ。','食堂は ラウンジの左側だよ。','船長室は ラウンジの奥にあるよ。','この船には いろんな町の人が乗っているね。','客室で 少し休んでいるんだ。'][i-1]]}];}
 for(const id of EXTRA_SHIP123){const m=maps[id],g=m.rows.map(r=>r.split(''));for(const[,x,y,w,h]of m.room.furniture)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)g[yy][xx]='t';for(const wp of m.warps)g[wp.y][wp.x]='f';m.rows=g.map(r=>r.join(''));}return maps;
}
