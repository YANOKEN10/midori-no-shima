const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
let media=[],contexts=[],timers=new Map(),id=0,reject=false,allowContext=true;
class Media{constructor(){this.paused=true;this.src='';this.handlers={};this.plays=0;media.push(this);}addEventListener(n,f){this.handlers[n]=f;}play(){this.plays++;if(reject){return Promise.reject(new Error('NotAllowedError'));}this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
class Context{constructor(){if(!allowContext)throw Error('unavailable');this.state='suspended';contexts.push(this);}createGain(){return {gain:{value:0},connect(){}};}resume(){this.state='running';return Promise.resolve();}}
const sandbox={Audio:Media,window:{AudioContext:Context},URL,setInterval:f=>{timers.set(++id,f);return id;},clearInterval:i=>timers.delete(i)};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('src/audio.js','utf8').replaceAll('import.meta.url',JSON.stringify('https://example.com/src/audio.js')).replaceAll('export ',''),sandbox);
const run=s=>vm.runInContext(s,sandbox);
(async()=>{
allowContext=false;run("playBgm('town')");assert.equal(timers.size,0);allowContext=true;run('resumeAudio(true)');assert.equal(timers.size,1);assert.equal(contexts[0].state,'running');assert.equal(media.length,1);await Promise.resolve();
reject=true;run("playBgm('natureTown')");await Promise.resolve();assert(media[0].paused);const attempts=media[0].plays;
reject=false;run('resumeAudio(true)');assert(!media[0].paused);assert(media[0].plays>attempts);assert.equal(timers.size,0);
run("playBgm('battle');playBgm('marineTown')");assert.equal(media.length,1);assert(media[0].src.includes('marine-whispering'));
media[0].pause();run("playBgm('marineTown')");assert(!media[0].paused);
contexts[0].state='interrupted';media[0].pause();run('setMuted(true);resumeAudio()');assert.equal(contexts[0].state,'running');assert(media[0].muted);
run('setMuted(false);stopBgm();resumeAudio()');assert(media[0].paused);assert.equal(run('currentBgm()'),'');assert.equal(timers.size,0);
console.log('PASS: delayed init, rejected playback recovery, one reusable player, repeated BGM, interruption, mute and stop');
})().catch(e=>{console.error(e);process.exitCode=1});
