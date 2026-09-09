const THEMES={home:['#d9b47d','#b58257','#f2d8a3','#9e514e'],cottage:['#c1ae89','#947458','#e3d9b6','#467c73'],lab:['#d2dce1','#9eaeb9','#e9f3e5','#49808d'],hospital:['#e5e9df','#b1bfb6','#f7eee7','#c87779'],shop:['#d6bd8e','#ac865c','#e7dcc1','#4b8194']};
export function paintInterior(c,map){const r=map.room;if(!r)return;const [floor,line,wall,accent]=THEMES[r.theme];const box=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 box(0,0,512,448,'#172d36');box(90,90,332,270,'#654d3e');box(96,96,320,256,floor);
 for(let y=128;y<352;y+=16){box(96,y,320,1,line);for(let x=96+(y%32?24:0);x<416;x+=48)box(x,y,1,16,line);}
 if(['lab','hospital'].includes(r.theme)){for(let y=128;y<352;y+=32)for(let x=96;x<416;x+=32){box(x,y,31,31,(x+y)%64?floor:'#ecf1e8');box(x+1,y+1,29,1,'#f7fbf5');}}
 box(96,96,320,32,wall);box(96,121,320,7,line);box(96,126,320,2,'#6c6559');for(let x=100;x<414;x+=16)box(x,99,1,20,'#ffffff22');
 const [rx,ry,rw,rh]=r.rug;box(rx*32,ry*32,rw*32,rh*32,accent);box(rx*32+3,ry*32+3,rw*32-6,rh*32-6,'#e3ca94');box(rx*32+5,ry*32+5,rw*32-10,rh*32-10,accent);for(let x=rx*32+12;x<(rx+rw)*32;x+=16){box(x,ry*32+8,4,2,'#e3ca94');box(x,(ry+rh)*32-10,4,2,'#e3ca94');}
 for(const x of r.windows){box(x*32,98,43,25,'#796c53');box(x*32+3,100,37,20,'#82c7d3');box(x*32+5,102,14,5,'#d7f1db');box(x*32+21,100,2,21,'#eee4b8');box(x*32+3,110,37,2,'#eee4b8');box(x*32-3,96,6,25,accent);box(x*32+41,96,6,25,accent);box(x*32-2,122,48,3,'#f3dfad');}
 // A wall clock and framed botanical print make each room feel lived in.
 box(246,99,15,18,'#775640');box(248,101,11,12,'#f4edce');box(253,103,1,5,'#364449');box(253,108,4,1,'#364449');
 for(const [kind,tx,ty,tw,th]of r.furniture){const x=tx*32,y=ty*32,w=tw*32,h=th*32;box(x+3,y+6,w-2,h-3,'#00000022');
 const panel=(color)=>{box(x+2,y+2,w-4,h-4,'#524638');box(x+4,y+3,w-8,h-8,color);box(x+5,y+4,w-10,2,'#ffffff60');};
 if(['books','shelf'].includes(kind)){panel('#9e6b49');for(let yy=y+7;yy<y+h-6;yy+=18){box(x+6,yy,w-12,13,'#54463c');for(let xx=x+8;xx<x+w-10;xx+=9){const colors=kind==='books'?['#607c85','#c99b56','#be7268','#738754']:['#73b8ad','#dc846f','#cfb874','#809bc1'];box(xx,yy+2,6,10,colors[Math.floor((xx+yy)/9)%4]);box(xx+1,yy+3,3,2,'#f0dfbd');}box(x+5,yy+14,w-10,3,'#d4ad78');}}
 else if(kind==='bed'){panel('#94704d');box(x+7,y+7,w-14,h-14,'#f3eccf');box(x+9,y+10,w-18,14,'#fffbea');box(x+7,y+29,w-14,h-35,accent);box(x+10,y+32,w-20,3,'#e8c79b');box(x+5,y+h-8,w-10,5,'#73553d');}
 else if(kind==='plant'){box(x+10,y+20,14,h-22,'#b87750');box(x+7,y+17,20,6,'#e1a771');box(x+15,y+6,3,14,'#596e3f');for(const [dx,dy]of [[5,7],[15,2],[19,9],[9,12]]){box(x+dx,y+dy,9,8,'#3f7852');box(x+dx+2,y+dy,5,3,'#87ad5d');}}
 else if(kind==='sofa'){panel(accent);box(x+8,y+8,w-16,8,'#ffffff44');box(x+8,y+19,w-16,h-29,'#ffffff22');box(x+5,y+12,6,h-18,accent);box(x+w-11,y+12,6,h-18,accent);box(x+w/2,y+18,1,h-26,'#324f57');}
 else if(kind==='chair'){panel('#956742');box(x+6,y+4,w-12,8,'#c89b63');box(x+6,y+17,w-12,9,accent);}
 else if(['computer','tv'].includes(kind)){panel('#a2b1b0');box(x+8,y+5,w-16,h-15,'#384c58');box(x+10,y+7,w-20,h-20,'#63a9b6');box(x+13,y+9,10,2,'#b5e4c6');box(x+9,y+h-9,w-18,4,'#e7e0be');for(let xx=x+12;xx<x+w-10;xx+=6)box(xx,y+h-8,3,1,'#556a74');}
 else if(kind==='tank'||kind==='machine'||kind==='healer'){panel('#aababb');box(x+7,y+8,w-14,h-19,'#516d82');box(x+10,y+10,w-20,h-24,kind==='healer'?'#cd8190':'#6db9ba');box(x+12,y+12,5,h-29,'#c3e8d6');if(kind==='tank'){box(x+22,y+h-25,18,6,'#6b8c67');box(x+29,y+h-33,7,9,'#d3d287');}else{for(let xx=x+19;xx<x+w-16;xx+=19){box(xx,y+15,11,13,'#e8e4d2');box(xx+3,y+18,5,7,'#b66c83');}}for(let xx=x+10;xx<x+w-12;xx+=12)box(xx,y+h-8,4,3,'#eac774');}
 else{panel(kind==='kitchen'?'#b8c3b7':'#b98f5d');box(x+6,y+h-10,w-12,5,'#775b46');for(let xx=x+14;xx<x+w-10;xx+=24)box(xx,y+h-8,5,2,'#e9d79f');if(kind==='kitchen'){box(x+7,y+6,20,14,'#5d7478');box(x+9,y+8,16,10,'#acd0ca');box(x+w-29,y+7,17,12,'#474f51');}if(kind==='labtable'){box(x+10,y+7,9,13,'#b9dfcf');box(x+12,y+4,5,4,'#74958a');box(x+29,y+9,17,9,'#d6c989');}if(kind==='table'){box(x+10,y+10,15,12,'#e2d6ba');box(x+31,y+12,8,8,'#5d9194');}}
 }
 box(224,352,32,10,accent);box(224,362,32,4,'#d7c393');
}
