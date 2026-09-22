const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/src/main.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.route('**/usage-tracker.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.goto((process.env.CHECK_URL||'http://127.0.0.1:5182')+'/',{waitUntil:'domcontentloaded'});
  await p.evaluate(async()=>{
   window.test126={};for(const [k,path]of Object.entries({I:'itemArt.js',A:'chapterArt.js',S:'state.js',W:'world.js',R:'recoveryPoint126.mjs',E:'editorModel72.mjs',M:'data/maps.js?v=20260913-fashion-v50',B:'data/chapterOne.js',C:'styleCatalog105.mjs'}))test126[k]=await import('/src/'+path);
  });
  await p.waitForFunction(async()=>{const st=await import('/src/styleArt105.js');return st.styleReady105()&&test126.I.ITEM_NAMES.every(n=>test126.I.drawItem(document.createElement('canvas').getContext('2d'),n,0,0));},{},{timeout:60000});
  const art=await p.evaluate(async()=>{
   const {I,A,C}=test126,canvas=()=>{const c=document.createElement('canvas');c.width=192;c.height=128;return c;},bytes=c=>[...c.getContext('2d').getImageData(0,0,c.width,c.height).data];
   const failures=[];for(const [name,file]of Object.entries(I.ITEM_ART126)){
    const im=new Image();im.src='/assets/items-v13/'+file;await im.decode();const a=canvas(),b=canvas();I.drawItem(a.getContext('2d'),name,0,0,80);const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(im,0,0,80,80);if(JSON.stringify(bytes(a))!==JSON.stringify(bytes(b)))failures.push(name);
   }
   // All seasonal grass variants, original and added placements, tinted/rotated,
   // mixed tile boundaries and a nonzero camera offset must match the map pixels.
   const variants=C.STYLE105.filter(p=>/nature73-grass|snowGrass|ashGrass/.test(p.key)).map(p=>p.key);
   const cases=[];
   for(const key of variants)for(const added of [false,true])for(const tint of [undefined,'#d756b0']){
    const prop={art:key,walkable:true,group:'grass',tile:'"',x:1,y:1,w:1,h:1,color115:tint};
    cases.push({name:key+' '+added+' '+tint,props:added?[]:[prop],editorAddedProps72:added?[prop]:[]});
   }
   cases.push({name:'rotated',props:[{art:variants[0],walkable:true,group:'grass',tile:'"',x:1,y:1,w:1,h:2,originalW81:2,originalH81:1,turn81:1,color115:'#cb7a39'}],editorAddedProps72:[]});
   cases.push({name:'adjacent',props:[{art:variants[0],walkable:true,group:'grass',x:1,y:1,w:1,h:1,color115:'#de418e'}],editorAddedProps72:[{art:variants[0],walkable:true,group:'grass',x:2,y:1,w:1,h:1,color115:'#56b6e1'}]});
   const samples=[];
   for(const item of cases){
    const map={...item,rows:['......','.""...','."....','......'],id:'art-test',kind:'out'},x=item.name==='adjacent'?48:32,y=44,camX=7,camY=9;
    const actual=canvas(),expected=canvas(),ac=actual.getContext('2d'),ec=expected.getContext('2d');
    A.drawGrassFeet(ac,map,x,y,camX,camY);
    ec.save();ec.beginPath();ec.rect(x-camX,y+8-camY,32,12);ec.clip();ec.translate(-camX,-camY);for(const prop of [...map.props,...map.editorAddedProps72])A.drawEditorProp72(ec,prop,map);ec.restore();
    if(JSON.stringify(bytes(actual))!==JSON.stringify(bytes(expected)))failures.push('grass: '+item.name);
    if(!bytes(actual).some((v,i)=>i%4===3&&v>0))failures.push('empty grass: '+item.name);
    if(samples.length<4&&item.name.includes('true #'))samples.push(actual.toDataURL());
   }
   const sheet=document.createElement('canvas');sheet.width=640;sheet.height=360;const sc=sheet.getContext('2d');sc.fillStyle='#20383d';sc.fillRect(0,0,640,360);sc.fillStyle='#fff';sc.font='14px sans-serif';I.ITEM_NAMES.filter(n=>I.ITEM_ART126[n]).forEach((n,i)=>{I.drawItem(sc,n,6+(i%8)*80,12+Math.floor(i/8)*88,56);sc.fillText(n,3+(i%8)*80,83+Math.floor(i/8)*88,76);});
   return {failures,grassCases:cases.length,items:Object.keys(I.ITEM_ART126).length,allItems:I.ITEM_NAMES.length,sheet:sheet.toDataURL()};
  });
  fs.mkdirSync('artifacts/verify126',{recursive:true});fs.writeFileSync('artifacts/verify126/items.png',Buffer.from(art.sheet.split(',')[1],'base64'));delete art.sheet;assert.deepEqual(art.failures,[]);console.log('Art:',art);
  const behavior=await p.evaluate(async()=>{
   const {W,S,R,E,B}=test126;S.loadInto(S.newGame('確認'));const base=B.buildChapterOne(),cat=E.catalog(base,[]),doc=E.initial(base.village);
   const clinic=base.village.props.findIndex(p=>p.door&&base.village.warps.some(w=>w.x===p.door.x&&w.y===p.door.y&&w.to==='hospital'));
   const o=doc.objects.find(o=>o.id==='p:'+clinic);o.x+=4;o.y+=5;
   const moved=E.applyEdit(base.village,doc,cat),maps={...base,village:moved};const door=moved.warps.find(w=>w.to==='hospital'),old=base.village.warps.find(w=>w.to==='hospital').back;
   const recovery=[R.recoveryPoint126(maps,old),R.recoveryPoint126(maps,null),R.recoveryPoint126(maps,{...old,editorDoorId72:'p:'+clinic,interior126:'hospital'})];
   const expected={map:'village',x:door.back.x,y:door.back.y,dir:'down'};
   const map={id:'test',kind:'out',rows:Array(9).fill('.........'),warps:[],npcs:[],props:[]};let talks=0;
   const n={idx:0,x:2,y:2,dir:'down',trainer:{},ox:0,oy:0};const w={...W.world,mapId:'test',map,x:2,y:6,npcs:[n],busy:false,runNpc:async()=>{talks++;}};
   S.G.save.party=[];const none=w.spotter();await w.trainerSpot(n);const idle={x:n.x,y:n.y,talks,busy:w.busy};
   S.G.save.party=[S.makeMon('トリッピ',4)];const found=w.spotter()===n;
   const samples=[],timer=setInterval(()=>samples.push({x:n.x*32+n.ox,y:n.y*32+n.oy,moving:n.moving,frame:n.walkFrame}),8);
   try{await w.trainerSpot(n);}finally{clearInterval(timer);}
   const end={x:n.x,y:n.y,talks,busy:w.busy};
   n.y=2;w.npcs.push({x:2,y:4});const blocked=w.spotter();w.npcs.pop();
   S.G.save.party[0].hp=0;const fainted=w.spotter();
   // Exercise the actual blackout entry point without a battle or server mutation.
   const {MAPS}=test126.M,{ui}=await import('/src/ui.js');const original=MAPS.village,oldSay=ui.say;MAPS.village=moved;ui.say=async()=>{};let entered;
   try{S.G.save.lastCenter=old;S.G.save.money=100;await W.world.blackout.call({enter:(...v)=>{entered=v;}});}finally{MAPS.village=original;ui.say=oldSay;}
   return {recovery,expected,none,idle,found,end,blocked,fainted,entered,money:S.G.save.money,healed:S.G.save.party[0].hp>0,samples};
  });
  for(const point of behavior.recovery)assert.deepEqual(point,behavior.expected);
  assert.equal(behavior.none,null);assert.deepEqual(behavior.idle,{x:2,y:2,talks:0,busy:false});assert.equal(behavior.found,true);assert.deepEqual(behavior.end,{x:2,y:5,talks:1,busy:false});assert.equal(behavior.blocked,null);assert.equal(behavior.fainted,null);
  assert.deepEqual(behavior.entered,[behavior.expected.map,behavior.expected.x,behavior.expected.y,'down']);assert.equal(behavior.money,50);assert.equal(behavior.healed,true);
  assert(behavior.samples.filter(s=>s.moving).length>30);assert(new Set(behavior.samples.filter(s=>s.moving).map(s=>s.y)).size>25);assert(new Set(behavior.samples.filter(s=>s.moving).map(s=>s.frame)).size>=3);
  let maxDelta=0;for(let i=1;i<behavior.samples.length;i++)maxDelta=Math.max(maxDelta,Math.abs(behavior.samples[i].y-behavior.samples[i-1].y));assert(maxDelta<8,'teleport: '+maxDelta);
  const follower=await p.evaluate(async()=>{
   const {FollowerTrail}=await import('/src/followerTrail.js'),In=await import('/src/input.js'),{facingFollower121}=await import('/src/followerBond121.mjs');
   In.initInput();document.activeElement?.blur();
   const trail=new FollowerTrail();trail.distance=1;trail.reset(4,4,'up');trail.face(4,4,'up');const initial={x:trail.pose.x,y:trail.pose.y};
   // Facing and sprite-size changes while standing must never relocate the follower.
   for(const dir of ['down','left','right','up','down'])for(let i=0;i<20;i++){trail.distance=dir==='left'?1.4:1;trail.record(4,4,dir);}
   const stationary={x:trail.pose.x,y:trail.pose.y},canTalk=facingFollower121(4,4,'down',trail.pose,trail.distance);
   const map={id:'test',kind:'out',tileWorld:true,rows:Array(10).fill('..........'),warps:[],npcs:[],props:[],items:[],signs:[],objects:[]};
   let talked=false;const w={...test126.W.world,map,mapId:'test',x:4,y:4,fx:4,fy:4,dir:'up',moving:false,busy:false,npcs:[],tick:0,showName:0,followerTrail:trail,talkFollower121:()=>{talked=true;}};
   const key=(type,code)=>dispatchEvent(new KeyboardEvent(type,{code,bubbles:true}));
   key('keydown','ArrowDown');w.update(16);In.endFrame();trail.record(w.x+w.ox/32,w.y+w.oy/32,w.dir);key('keyup','ArrowDown');w.update(16);In.endFrame();
   const turned={dir:w.dir,x:w.x,y:w.y,moving:w.moving};
   key('keydown','KeyZ');w.update(16);key('keyup','KeyZ');In.endFrame();
   key('keydown','ArrowUp');for(let i=0;i<13;i++){w.update(16);In.endFrame();}key('keyup','ArrowUp');const heldMoves=w.moving;
   w.moving=false;w.x=w.fx=4;w.y=w.fy=4;w.dir='up';w.map={...map,freeMove:true};
   key('keydown','ArrowRight');w.updateFree(16);key('keyup','ArrowRight');const freeTurn={x:w.x,y:w.y,dir:w.dir,moving:w.moving};
   // A small step toward the follower must not delete it and re-seed it behind us.
   trail.record(4,4.1,'down');const staysVisible=!!trail.pose;
   return {initial,stationary,canTalk,turned,talked,heldMoves,freeTurn,staysVisible};
  });
  assert.deepEqual(follower.stationary,follower.initial);assert.equal(follower.canTalk,true);assert.deepEqual(follower.turned,{dir:'down',x:4,y:4,moving:false});assert.equal(follower.talked,true);assert.equal(follower.heldMoves,true);assert.deepEqual(follower.freeTurn,{x:4,y:4,dir:'right',moving:false});assert.equal(follower.staysVisible,true);console.log('PASS: tap to face follower, A opens conversation, held direction walks, free-move tap, stable follower position');
  const gift=await p.evaluate(async()=>{
   const {chapterNpc}=await import('/src/chapterStory.js'),{ui}=await import('/src/ui.js'),S=test126.S;S.loadInto(S.newGame('テスト'));S.G.save.bag={};S.G.save.flags['v5:heardLatett']=true;S.G.save.flags['v5:latettSeen']=true;
   const oldSay=ui.say,lines=[],counts=[];ui.say=async text=>{lines.push(text.join(''));counts.push(S.G.save.bag['ラグネット']||0);};
   try{await chapterNpc({}, {script:'v5:professor'});const first=S.G.save.bag['ラグネット'];await chapterNpc({}, {script:'v5:professor'});return {lines,counts,first,second:S.G.save.bag['ラグネット']};}finally{ui.say=oldSay;}
  });
  assert.deepEqual(gift.lines.slice(1,6),['ガオンをもっと調べてみないか？','ガオンを調べるためには つかまえて そだててみないと わからないもんじゃ。','ガオンをつかまえるために ひつような どうぐを あげよう。','あまり かずは あげられないが 大切につかうんじゃぞ。','テストは ラグネットを１５こ もらった！']);assert.deepEqual(gift.counts.slice(0,6),[0,0,0,0,0,15]);assert.equal(gift.first,15);assert.equal(gift.second,15);console.log('PASS: professor dialogue advances in separate messages, named receipt, exactly 15 nets once');
  assert.deepEqual(errors,[]);console.log('PASS: no-party and fainted sight guards, continuous trainer walking, blocked sight, edited clinic legacy/new return and blackout. Max sampled movement:',maxDelta);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
