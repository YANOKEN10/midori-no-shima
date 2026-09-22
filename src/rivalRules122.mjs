export const RIVAL_APPEARANCE122={name:'ライバル',variant:110,look:'boy'};
export const RIVAL_EVENTS122={
 lab:{talk:['久しぶりだな！{name}！','ガオンの中には 伝説とよばれるすごい ガオンがいるらしいぜ！','おれも もうすぐ、最強のガオンを さがすたびに 出るさ！']},
 rods:{team:[['ニヤゴ',5]],talk:['とりあえずガオンつかまえたみたいだな！','勝負しようぜ！待ったは ナシさ！'],win:['この先はなんとかの森ってところさ！めずらしいガオンもいるみたいだし、修行してくるぜ！']},
 marine:{team:[['ハナビィ',8],['ガルウィング',10],['ニヤゴ',12]],talk:['マリンタウンっていい町だな！','どうだ？ちょっとは強くなっただろ？','バトルしようぜ！'],win:['おれはこう見えて 負けを受け入れるタイプでね。','努力が足りなかったってことさ！','またな！{name}！']},
 raden:{team:[['ガルウィング',22],['ライウィル',24],['ドリルモグ',23],['ワルニール',28]],talk:['いたのか…','ちょっと考えごとをしててな。','{name}には この前 負けたからな。','勝負してくれ！'],win:['やっぱり負けか…','まよった心じゃ 勝てるわけないよな！','次は勝つ！']},
 resure:{team:[['ドリルモグ',35],['ライウィル',32],['ヒョウガン',33],['ワルニール',35]],talk:['久しぶりだな！{name}！','…お願いできるか？','イヤなんて言うなよな！'],win:['くやしいぜ！','全力で ぶつかったのに！','また会えるのを楽しみにしてるぜ！']},
 blizzard:{talk:['{name}！','これより先はすごく険しいぜ！','今日はバトルなしだ！'],win:['またな！']},
 galaxy:{team:[['ドリルモグ',40],['ヴォルティア',36],['グレンケン',38],['ヒョウガン',43],['ワルヴェイン',45]],talk:['ついにこの街まで来たな！','最強のトレーナーになるにはここでチャンピオンになるしかない！','その前にしょうぶだ！'],win:['ギャラクシータウンからはなれて、ちょっと修行してくるわ！','また会おうな！']},
 weekly:{team:[['ドリルモグ',61],['ヴォルティア',58],['グレンケン',60],['ヒョウガン',64],['ヴァルディオ',66],['ワルヴェイン',70]],talk:['バトルしようぜ！'],win:['おれはいつでもここにいるぜ！','またバトルしたくなったら声かけてくれ！']}
};
export const rivalLines122=(lines,s)=>lines.map(l=>l.replaceAll('{name}',s.name||'きみ'));
export const won122=(s,id)=>!!s.flags?.['rival122:'+id];
export function sunday122(now=new Date()){const d=new Date(now.getTime()+9*3600000);d.setUTCDate(d.getUTCDate()-d.getUTCDay());return d.toISOString().slice(0,10);}
export const weeklyReady122=(s,now=new Date())=>s.flags?.['rival122:week']!==sunday122(now);
export function captured122(s){return s.captureCount122===undefined?Object.values(s.dexOwn||{}).some(Boolean):s.captureCount122>0;}
export function available122(s,id){if(id==='lab')return !won122(s,'rods');if(id==='weekly')return won122(s,'galaxy');if(won122(s,id))return false;return id==='rods'?captured122(s):won122(s,({marine:'rods',raden:'marine',resure:'raden',blizzard:'resure',galaxy:'resure'})[id]);}
export function towerRival122(){return {rivalBattle129:'tower',name:'ライバル',fixedLevels122:true,appearance79:{...RIVAL_APPEARANCE122},party:[['ヒョウガン',50,{iv:{hp:31,atk:31,def:31,spc:31,sdef:31,spd:31},ev:{hp:252,def:4,spc:252}}],['ヴァルディオ',50,{iv:{hp:31,atk:31,def:31,spc:31,sdef:31,spd:31},ev:{hp:252,atk:252,sdef:4}}],['ワルヴェイン',50,{iv:{hp:31,atk:31,def:31,spc:31,sdef:31,spd:31},ev:{hp:4,spc:252,spd:252}}]]};}
const walls=new Set('TRMW#rwSX=cbtKV PsL'.replaceAll(' ',''));
function open(m,x,y){return m.rows[y]?.[x]!==undefined&&!walls.has(m.rows[y][x])&&!(m.npcs||[]).some(n=>n.x===x&&n.y===y)&&!(m.warps||[]).some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2)&&!(m.props||[]).some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);}
export function addRivalResidents122(maps){const marineExits=new Set();for(const[id,m]of Object.entries(maps))if(m.kind!=='in'&&id!=='marine'&&((m.warps||[]).some(w=>w.to==='marine')||(maps.marine?.warps||[]).some(w=>w.to===id)))marineExits.add(id);
 const specs=[['lab','lab',5,9],['rods','rods',16,19],...Array.from(marineExits,id=>[id,'marine',maps[id].spawn.x,maps[id].spawn.y-5]),['raden','raden',28,19],['resure','resure',20,23],['blizzard','blizzard',20,90],['galaxy','galaxy',18,23],['leafTown','weekly',23,12]];
 for(const[id,event,x,y]of specs){const old=maps[id];if(!old||old.npcs.some(n=>n.script==='rival122:'+event))continue;const m=maps[id]={...old,npcs:[...old.npcs]},spots=[];for(let yy=1;yy<m.rows.length-1;yy++)for(let xx=1;xx<m.rows[yy].length-1;xx++)if(open(m,xx,yy))spots.push({x:xx,y:yy,d:Math.hypot(xx-x,yy-y)});spots.sort((a,b)=>a.d-b.d);if(!spots.length)throw Error('No rival position '+id);const p=spots[0];m.npcs.push({...RIVAL_APPEARANCE122,x:p.x,y:p.y,dir:event==='raden'?'right':'down',script:'rival122:'+event,noRoam:true,managed120:true,rival122:true,talk:RIVAL_EVENTS122[event].talk});}return maps;
}
// Breadth-first paths use the same terrain/prop collision predicate as the world.
export function route122(start,goal,canStand,limit=16000){const q=[start],prev=new Map([[start.x+','+start.y,null]]);for(let i=0;i<q.length&&i<limit;i++){const p=q[i],key=p.x+','+p.y;if(goal(p)){const path=[];let k=key;while(prev.get(k)!==null){const[x,y]=k.split(',').map(Number);path.push({x,y});k=prev.get(k);}return path.reverse();}for(const[dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const n={x:p.x+dx,y:p.y+dy},k=n.x+','+n.y;if(!prev.has(k)&&canStand(n.x,n.y)){prev.set(k,key);q.push(n);}}}return null;}
