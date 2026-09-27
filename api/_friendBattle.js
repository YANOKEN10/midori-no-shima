const C=require('./_friendCatalog.json');
const {create193}=require('../src/heldCore193.js');
let logs193=[];
const H=create193({species:n=>C.species[n],maxHp:m=>m.maxHp,rawStat:(m,k)=>stats(m,k),moves:C.moves,random:()=>random193(),log:(m,t)=>logs193.push(m.sp+'：'+t)});
let random193=Math.random;
// Old save names remain accepted without duplicating the 153-species catalog.
for(const[oldName,newName]of Object.entries(C.aliases||{}))if(!C.species[oldName]&&C.species[newName])Object.defineProperty(C.species,oldName,{value:C.species[newName],enumerable:false});
for(const [oldName,newName]of Object.entries(C.moveAliases||{}))if(!C.moves[oldName]&&C.moves[newName])Object.defineProperty(C.moves,oldName,{value:C.moves[newName],enumerable:false});
const clone=x=>JSON.parse(JSON.stringify(x));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,Math.floor(Number(x)||0)));
const stage=n=>[.25,.28,.33,.4,.5,.66,1,1.5,2,2.5,3,3.5,4][clamp(n,-6,6)+6];
function stats(m,key){const sp=C.species[m.sp];let n=Math.floor((2*sp.base[key]+clamp(m.iv?.[key],0,31)+Math.floor(clamp(m.ev?.[key],0,252)/4))*m.lv/100)+(key==='hp'?m.lv+10:5);if(C.items?.[m.heldItem]?.stat===key)n=Math.floor(n*1.1);return Math.floor(n*H.multiplier(m,key));}
function combatMon(input,level){if(!input||!C.species[input.sp])throw Error('ガオンが見つかりません');const m=clone(input);m.sp=C.aliases?.[m.sp]||m.sp;m.lv=level||clamp(m.lv,1,100);m.maxHp=stats(m,'hp');m.hp=m.maxHp;m.status='';m.st={};m.sleep=0;m.leech=false;m.flinch=false;m.moves=(m.moves||[]).map(x=>({...x,name:C.moveAliases?.[x.name]||x.name})).filter(x=>C.moves[x.name]).slice(0,4).map(x=>({name:x.name,pp:C.moves[x.name].pp,max:C.moves[x.name].pp}));if(!m.moves.length){const n=C.species[m.sp].learn[0][1];m.moves=[{name:n,pp:C.moves[n].pp,max:C.moves[n].pp}];}m.st=H.enter(m).st;return m;}
function teamFromSave(save,ids,rule){if(!Array.isArray(ids)||new Set(ids).size!==ids.length)throw Error('ガオンを重複せず選んでください');const party=save.party||[],size=rule==='level50'?3:party.length;if(ids.length!==size||!size)throw Error(rule==='level50'?'3匹を選んでください':'手持ち全員を選んでください');return ids.map(id=>{const m=party.find(x=>x.companionId===id);if(!m)throw Error('手持ちのガオンを選んでください');return combatMon(m,rule==='level50'?50:undefined)});}
function begin(sides,coop=false){return {sides:clone(sides).map((s,i)=>({...s,group:s.group??i,active:0})),field193:{},turn:1,pending:{},logs:['バトル開始！'],finished:false,winner:null,coop};}
function current(side){return side.team[side.active]}
function submit(b,actor,action,turn,random=Math.random){if(b.finished)throw Error('バトルは終了しました');if(turn!==b.turn)throw Error('ターンが更新されました');const side=b.sides.find(s=>s.id===actor);if(!side||side.ai)throw Error('このバトルには参加していません');if(b.pending[actor])throw Error('選択済みです');const mon=current(side);if(action.kind==='switch'){if(!Number.isInteger(action.index)||!side.team[action.index]?.hp||action.index===side.active)throw Error('交代できません');}else if(action.kind==='move'){if(mon.moves.some(m=>m.pp>0)){if(!Number.isInteger(action.index)||!mon.moves[action.index]?.pp||!H.allowed(mon,mon.moves[action.index].name))throw Error('その技は使えません');}}else throw Error('行動を選んでください');b.pending[actor]=clone(action);const humans=b.sides.filter(s=>!s.ai&&s.team.some(m=>m.hp>0));if(humans.every(s=>b.pending[s.id]))resolve(b,random);return b;}

function resolve(b,rng){
 random193=rng;logs193=b.logs=[];b.field193||={};const f=b.field193,chance=p=>rng()<p,rand=n=>Math.floor(rng()*n);
 function enter(side,index){side.active=index;const m=current(side);m.st=H.enter(m,{...f,hazard:f.hazards?.[side.id]}).st;m.sleep=0;m.leech=false;m.flinch=false;b.logs.push(m.sp+'が出てきた');}
 function switchEffects(){for(const side of b.sides){const m=current(side),st=H.state(m);if(!m.hp||!st.eject&&!st.forceOut)continue;const target=st.forceOut?b.sides.find(s=>s.group!==side.group&&current(s).hp>0):side;if(target){const candidates=target.team.map((x,i)=>i!==target.active&&x.hp>0?i:-1).filter(i=>i>=0);if(candidates.length){H.consume(m);enter(target,candidates[rand(candidates.length)]);}}delete st.eject;delete st.forceOut;}}
 for(const s of b.sides){const m=current(s);m.flinch=false;delete H.state(m).flinch;if(s.ai){const available=m.moves.map((x,i)=>x.pp&&H.allowed(m,x.name)?i:-1).filter(i=>i>=0);b.pending[s.id]={kind:'move',index:available[rand(available.length)]??-1};}}
 const order=b.sides.filter(s=>s.team.some(m=>m.hp>0)).map(s=>{const a=b.pending[s.id],m=current(s),d=C.moves[m.moves[a?.index]?.name];return {s,a,priority:a?.kind==='switch'?10:d?.pri||0,itemOrder:H.order(m),speed:stats(m,'spd')*stage(m.st.spd||0)*(m.status==='まひ'?.25:1),tie:rng(),original:m};}).sort((a,z)=>z.priority-a.priority||z.itemOrder-a.itemOrder||(f.roomTurns>0?a.speed-z.speed:z.speed-a.speed)||z.tie-a.tie);
 for(const {s,a,original}of order){const m=current(s);if(!m.hp||m!==original)continue;
 if(a.kind==='switch'){if(H.state(m).bind&&!H.item(m).escape){b.logs.push(m.sp+'は拘束されている');continue;}enter(s,a.index);continue;}
 const enemies=b.sides.filter(e=>e.group!==s.group&&current(e).hp>0);if(!enemies.length)break;const enemy=enemies[rand(enemies.length)],dm=current(enemy);
 if(m.status==='ねむり'){if(--m.sleep>0){b.logs.push(m.sp+'は眠っている');continue;}m.status='';}
 if(m.flinch||H.state(m).flinch||m.status==='まひ'&&chance(.25)||H.state(m).charm&&chance(.5)){b.logs.push(m.sp+'は動けない');continue;}
 const charged=H.state(m).charging;let mv=charged?m.moves.find(x=>x.name===charged):m.moves[a.index],d;
 if(!mv||!charged&&(mv.pp<=0||!H.allowed(m,mv.name))){mv={name:'わるあがき'};d={pow:50,cat:'phys',acc:100,type:'ひかり',contact193:true,fx:{recoil:.25}};}else{if(!charged)mv.pp--;d=C.moves[mv.name];}
 if(!H.beginMove(m,mv.name,d))continue;b.logs.push(m.sp+'の '+mv.name+'！');
 if(!chance(d.acc/100*stage(m.st.acc||0)*H.accuracy(m,dm,d))){H.miss(m);b.logs.push('こうげきは はずれた');continue;}
 if(H.immune(m,dm,d)){b.logs.push('持ち物が技を防いだ');continue;}
 const fx=d.fx||{},eff=H.effectiveness(dm,H.types(dm).reduce((n,t)=>n*(C.types[d.type]?.[t]??1),1));if(d.pow&&eff===0){b.logs.push('こうかが ない');continue;}
 let total=0;if(d.pow){const count=fx.multi?H.hits(m,fx.multi):1;for(let i=0;i<count&&dm.hp&&m.hp;i++){const ak=d.cat==='phys'?'atk':'spc',dk=d.cat==='phys'?'def':'sdef',crit=chance(H.crit(m,fx.crit?.125:.0625));let A=stats(m,ak)*(crit?1:stage(m.st[ak]||0)),D=stats(dm,dk)*(crit?1:stage(dm.st[dk]||0));if(!crit&&d.cat==='phys'&&m.status==='やけど')A*=.5;if(f.weather==='snow'&&d.cat==='phys'&&H.types(dm).includes('みず'))D*=1.5;let damage=Math.floor(Math.floor(Math.floor(2*m.lv/5+2)*d.pow*A/Math.max(1,D))/50)+2;if(crit)damage*=2;if(H.types(m).includes(d.type))damage=Math.floor(damage*1.5);damage=Math.max(1,Math.floor(Math.floor(damage*eff*H.power(m,dm,d,eff,f))*(217+rand(39))/255));const dealt=H.damage(dm,damage);dm.hp-=dealt;total+=dealt;H.afterHit(m,dm,d,eff,dealt);}b.logs.push(dm.sp+'に '+total+' ダメージ');}
 if(fx.drain&&m.hp)m.hp=Math.min(m.maxHp,m.hp+Math.max(1,Math.floor(total*fx.drain*(H.item(m).drain||1))));if(fx.recoil)m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(total*fx.recoil)));
 if(fx.self){const raised=H.change(m,fx.self,m);H.copyBoost(m,dm,raised);}
 if(dm.hp){H.effects(m,dm,{...d,fx193:d.fx193?.hazard?{...d.fx193,targetSide:enemy.id}:d.fx193},f);if(!d.pow||!H.item(dm).secondaryGuard){if(fx.foe&&chance(fx.chance??1))H.change(dm,fx.foe,m);if(fx.status&&chance(fx.chance??1)&&H.status(dm,fx.status,f))dm.sleep=1+rand(3);if(fx.leech)dm.leech=s.id;if(fx.flinch&&chance(fx.flinch))dm.flinch=true;}}
 if(fx.heal)m.hp=Math.min(m.maxHp,m.hp+Math.floor(m.maxHp*fx.heal));if(fx.rest){m.hp=m.maxHp;m.status='ねむり';m.sleep=2;}if(fx.reset)for(const side of b.sides)for(const k of Object.keys(current(side).st))current(side).st[k]=0;H.afterAttack(m,dm,d,total);switchEffects();
 }
 for(const s of b.sides){const m=current(s);if(m.hp&&['やけど','どく','もうどく'].includes(m.status)){const factor=m.status==='もうどく'?(H.state(m).toxic=(H.state(m).toxic||0)+1):1;m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(m.maxHp/16))*factor);}if(m.hp&&m.leech){const damage=Math.min(m.hp,Math.max(1,Math.floor(m.maxHp/16)));m.hp-=damage;const other=b.sides.find(x=>x.id===m.leech);if(other&&current(other).hp)current(other).hp=Math.min(current(other).maxHp,current(other).hp+damage);}H.tick(m,f);if(!m.hp){b.logs.push(m.sp+'は倒れた');const next=s.team.findIndex(x=>x.hp>0);if(next>=0)enter(s,next);}}
 H.tickField(f);const groups=[...new Set(b.sides.filter(s=>s.team.some(m=>m.hp>0)).map(s=>s.group))];if(groups.length<=1){b.finished=true;b.winner=groups[0]??null;b.logs.push(groups.length?'バトル終了！':'ひきわけ');}b.turn++;b.pending={};
}

function view(b,actor){const v=clone(b);v.waiting=Object.keys(v.pending);delete v.pending;for(const s of v.sides)if(s.id!==actor)for(const m of s.team){delete m.iv;delete m.ev;delete m.companionId;}return v;}
module.exports={combatMon,teamFromSave,begin,submit,view,stats};
