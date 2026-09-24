import {cleanRivalName168} from './rival168.mjs';
import {t166} from './i18n166.mjs';
import * as G from './gfx.js';
import {ui} from './ui.js';
import {npcFrame} from './npcArt.js';
import {showForm} from './gate.js';
import {chooseAppearance} from './characterSetup.js';

export const INTRO_OPENING=[
 'ここは　ガオン・ワールド！',
 'ガオン　という　いきものと、人がいっしょに　くらしている　世界だ。',
 'キミの　なまえを　おしえてくれるかい？',
];
export const INTRO_FAREWELL=[
 'これから　はじまる　だいぼうけん！',
 'ガオンとの　であいを　たのしみにしてくれ！',
 'それでは　また　あおう！',
];
const professor={name:'スイスはかせ',look:'prof',dir:'down',moving:false};
export const professorIntro={
 update(dt){ui.update(dt);},
 draw(){
  const c=G.ctx;c.save();
  const bg=c.createLinearGradient(0,0,0,G.H);bg.addColorStop(0,'#e9f4e4');bg.addColorStop(1,'#a8cbbf');c.fillStyle=bg;c.fillRect(0,0,G.W,G.H);
  c.fillStyle='rgba(255,255,236,.45)';c.beginPath();c.ellipse(160,95,88,78,0,0,Math.PI*2);c.fill();
  c.fillStyle='rgba(48,86,76,.18)';c.beginPath();c.ellipse(160,155,35,6,0,0,Math.PI*2);c.fill();
  const frame=npcFrame(professor,1);if(frame){c.imageSmoothingEnabled=false;const w=144*frame.width/frame.height;c.drawImage(frame,160-w/2,14,w,144);}
  c.restore();ui.draw();
 }
};
export async function introduceAdventure(){
 ui.setBattleMode(false);
 const say=async lines=>{for(const line of lines)await ui.say([line],{speaker:'スイスはかせ'});};
 await say(INTRO_OPENING);
 const r=await showForm({title:'キミの　なまえは？',sub:'スイスはかせに　なまえを　おしえてね。',fields:[{el:'who',key:'name',label:'なまえ',type:'text',value:'',placeholder:'ポンキチ'}],submit:'この なまえにする'});
 if(!r)return null;
 const name=Array.from(String(r.name||'').trim()).slice(0,8).join('')||'ポンキチ';
 await say(['そうか！　'+name+'というのか！']);
 const rival=await showForm({title:'ライバルの なまえは？',sub:'ライバルの なまえを 決めてね。（8文字まで）',fields:[{el:'who',key:'rivalName',label:'ライバルの なまえ',type:'text',value:'',placeholder:t166('レイジ')}],submit:'この なまえにする'});
 if(!rival)return null;
 const rivalName=cleanRivalName168(rival.rivalName)||t166('レイジ');
 const appearance=await chooseAppearance();if(!appearance)return null;
 await say(INTRO_FAREWELL);
 return {name,rivalName,appearance};
}
