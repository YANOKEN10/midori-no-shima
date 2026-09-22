const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const {battleMusic129:pick}=await import('../src/battleMusic129.mjs');
 const {towerRival122}=await import('../src/rivalRules122.mjs');
 assert.equal(pick({trainer:{rivalBattle129:'regular',name:'別名'}}),'rivalBattle');
 assert.equal(pick({trainer:towerRival122(),tournament:true}),'towerRivalBattle');
 assert.equal(pick({trainer:{name:'大会トレーナー'},tournament:true}),'tournament');
 assert.equal(pick({trainer:{name:'ヤノケン'}}),'yanokenBattle');
 assert.equal(pick({trainer:{major:true}}),'boss');assert.equal(pick({}),'battle');
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 try{const p=await b.newPage();await p.route('**/src/main.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));await p.route('**/usage-tracker.js*',r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await p.goto(process.env.BASE||'http://127.0.0.1:5182/');
 const result=await p.evaluate(async()=>{const Native=window.Audio;window.Audio=function(...args){const a=new Native(...args);window.testAudio=a;return a;};const m=await import('/src/audio.js');const out=[];
 for(const [key,file]of [['rivalBattle','blaring-brass.mp3'],['towerRivalBattle','arpeggio-froid.mp3']]){m.playBgm(key);const a=window.testAudio;await new Promise((resolve,reject)=>{const end=Date.now()+60000;const tick=()=>{if(a.error)return reject(Error(a.error.message));if(a.currentTime>.05&&!a.paused)return resolve();if(Date.now()>end)return reject(Error('Playback timeout '+key));setTimeout(tick,100);};tick();});if(!a.src.endsWith(file)||!a.loop||!Number.isFinite(a.duration))throw Error('Wrong track '+JSON.stringify({key,src:a.src,loop:a.loop,duration:a.duration,state:a.readyState}));m.setMuted(true);if(!a.muted)throw Error('Mute');m.setMuted(false);out.push({key,duration:a.duration,playing:!a.paused,loop:a.loop});}
 m.stopBgm();if(!window.testAudio.paused||m.currentBgm()!=='')throw Error('Stop');return out;});console.log('PASS routing, playback, loop, mute, stop',result);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});

