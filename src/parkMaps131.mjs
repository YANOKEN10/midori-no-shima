export const PARK_AREAS131=[
 ['gaonPark','草原',['ウリボン','タヌポン']],
 ['gaonParkWoods','林',['カマキリン','ネコデン']],
 ['gaonParkWetland','水辺',['シオマント','ドロヌマ']],
 ['gaonParkFlowers','花畑',['ハナヤリ','ワンヒノ']],
 ['gaonParkHill','丘',['スナボンネ','フワクジ']]
];
export const isGaonPark131=id=>PARK_AREAS131.some(p=>p[0]===id);
const cp=v=>JSON.parse(JSON.stringify(v));
export function expandParks131(maps){
 const first=maps.gaonPark;if(first&&!first.parkArea131){
 const original=cp(first);first.layoutBefore131=original;first.parkArea131=true;first.name='ガオンパーク・草原';first.enc={rate:23,list:PARK_AREAS131[0][2].map(n=>[n,21,25,50])};
 for(const [i,[id,label,pool]]of PARK_AREAS131.entries()){if(!i)continue;const w=42,h=48,g=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>!x||!y||x===w-1||y===h-1?'R':','));const props=[],signs=[];
 for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++)if(x<17||x>24)g[y][x]='"';
 for(let y=0;y<h;y++)for(let x=19;x<=21;x++)g[y][x]='.';for(let x=2;x<w-2;x++)for(let y=23;y<=25;y++)g[y][x]='.';
 const add=(art,x,y,ww,hh,tile)=>{props.push({art,x,y,w:ww,h:hh});for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)g[yy][xx]=tile;};
 for(const[x,y]of [[3,3],[11,9],[29,5],[35,14],[4,31],[12,39],[27,33],[35,40]])add(i===1?'fir':'tree',x,y,2,3,'T');
 if(i===2)for(let y=8;y<18;y++)for(let x=26;x<37;x++)g[y][x]='W';
 if(i===3)for(const[x,y]of [[4,7],[10,17],[27,7],[33,17],[4,35],[27,39]])add('flowersPink',x,y,3,2,'F');
 if(i===4)for(const[x,y]of [[5,13],[29,17],[6,33],[30,35]])add('rock',x,y,2,2,'R');
 signs.push({x:23,y:44,text:[label+'エリア',pool.join('・')+'が暮らしている。']});g[44][23]='S';
 maps[id]={id,name:'ガオンパーク・'+label,kind:'out',chapter:4,tileWorld:true,frontierTheme:'ranch',parkArea131:true,rows:g.map(r=>r.join('')),props,npcs:[],signs,items:[],objects:[],spawn:{x:20,y:45},warps:[],enc:{rate:23,list:pool.map(n=>[n,21,25,50])}};
 }
 for(let i=0;i<PARK_AREAS131.length;i++){const m=maps[PARK_AREAS131[i][0]],g=m.rows.map(r=>[...r]);if(i){m.warps.push({x:20,y:47,to:PARK_AREAS131[i-1][0],tx:20,ty:1});g[47][20]='.';}if(i<4){m.warps.push({x:20,y:0,to:PARK_AREAS131[i+1][0],tx:20,ty:46});for(let y=0;y<=3;y++)g[y][20]='.';}else g[0][20]='R';m.rows=g.map(r=>r.join(''));}
 }
 const flower=maps.flowerPark;if(flower&&!flower.widePark131){flower.layoutBefore131=cp(flower);flower.widePark131=true;const oldW=flower.rows[0].length,h=flower.rows.length,w=oldW*2,g=flower.rows.map((r,y)=>[...r,...Array.from({length:oldW},(_,x)=>!y||y===h-1||x===oldW-1?'R':',')]);
 for(let y=1;y<h-1;y++)g[y][oldW-1]=',';
 for(let y=19;y<=21;y++)for(let x=oldW-8;x<w-3;x++)g[y][x]='.';for(let y=3;y<h-3;y++)for(let x=oldW+19;x<=oldW+21;x++)g[y][x]='.';
 for(let y=4;y<h-5;y+=7)for(let x=oldW+4;x<w-5;x+=8){if(Math.abs(x-(oldW+20))<5||Math.abs(y-20)<4)continue;flower.props.push({art:(x+y)%2?'flowersGold':'flowersPink',x,y,w:4,h:3});for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+4;xx++)g[yy][xx]='F';}
 flower.signs.push({x:oldW+2,y:18,text:['フラワーパーク・東の花園','西の花園へは この道をまっすぐ。']});g[18][oldW+2]='S';flower.rows=g.map(r=>r.join(''));}
 const port=maps.belerioPort;if(port&&!port.portWater131){port.layoutBefore131=cp(port);port.portWater131=true;const g=port.rows.map(r=>[...r]);
 for(const p of port.props)if(p.art==='eShip'){p.tile='W';for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)g[y][x]='W';}
 const home=maps.belerioPortHome131=cp(maps.hut);home.id='belerioPortHome131';home.name='ベレリオ港の家';home.npcs=[{x:9,y:7,name:'港の住人',variant:8,dir:'down',noRoam:true,talk:['ようこそ ベレリオ港へ。','船は 桟橋の先から乗れるよ。ショップで旅の準備もしていってね。']}];home.items=[];home.objects=[];home.signs=[];home.warps=[{x:7,y:11,to:'@back'}];
 for(const[art,x,y,to,label]of [['chalet',5,7,home.id,'港の家'],['harborShop',29,7,'shop','ショップ']]){const door={x:x+2,y:y+4};port.props.push({art,x,y,w:5,h:5,door});for(let yy=y;yy<y+5;yy++)for(let xx=x;xx<x+5;xx++)g[yy][xx]='#';g[door.y][door.x]='D';for(let yy=door.y+1;yy<=20;yy++)g[yy][door.x]='.';port.warps.push({...door,to,tx:7,ty:10,back:{map:port.id,x:door.x,y:door.y+1}});port.signs.push({x:x-1,y:y+5,text:[label]});g[y+5][x-1]='S';}
 for(let x=5;x<=33;x++)for(let y=19;y<=20;y++)g[y][x]='.';
port.rows=g.map(r=>r.join(''));}
 return maps;
}
