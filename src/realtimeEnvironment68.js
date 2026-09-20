import {drawNightLights95} from './nightLighting95.mjs';
import {drawWeatherBadge,clockWeatherPresentation} from './weatherBadge71.js';
// Real-world Japan time matches the calendar encounter rules. No saved game clock.
const HOUR=3600000;
export function japanClock(now=new Date()) {
 const j=new Date(now.getTime()+9*HOUR),hour=j.getUTCHours(),minute=j.getUTCMinutes();
 return {hour,minute,month:j.getUTCMonth()+1,day:Math.floor((now.getTime()+9*HOUR)/(24*HOUR)),hours:hour+minute/60+j.getUTCSeconds()/3600,label:String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')};
}
const lightKeys=[[0,8,17,49,.52],[5,8,17,49,.52],[6,246,199,126,.09],[10,255,248,219,0],[16,255,248,219,0],[17,239,143,74,.12],[18,14,25,66,.44],[20,8,17,49,.52],[24,8,17,49,.52]];
export function daylight(now=new Date()) {
 const clock=japanClock(now),h=clock.hours,a=lightKeys.findLast(k=>k[0]<=h),b=lightKeys.find(k=>k[0]>h),t=(h-a[0])/(b[0]-a[0]);
 return {...clock,period:h<5||h>=18?'夜':h<6?'夜明け':h<10?'朝':h<16?'昼':'夕方',tint:a.slice(1).map((v,i)=>v+(b[i+1]-v)*t)};
}
function weatherAt(map,slot,month) {
 if(map.id==='blizzard')return 'blizzard';
 if(map.frontierTheme==='ash')return 'ash';
 const snowy=map.frontierTheme==='snow'||['ice','snow'].includes(map.endTheme);
 // Same broad weather front across adjacent maps. Stable across reloads.
 const day=Math.floor(slot/12),seed=((day*1664525+1013904223)>>>0)%12;
 const sequence=['clear','clear','cloud','rain','cloud','clear','clear','cloud','clear','rain','cloud','clear'];
 const type=sequence[((slot%12)+12+seed)%12];
 return type==='rain'&&(snowy||month===1||month===2)?'snow':type;
}
export function fieldWeather(map,now=new Date()) {
 if(map.kind!=='out')return null;
 const clock=japanClock(now),ms=now.getTime()+9*HOUR,slot=Math.floor(ms/(2*HOUR));
 return {current:weatherAt(map,slot,clock.month),previous:weatherAt(map,slot-1,clock.month),mix:Math.min(1,(ms-slot*2*HOUR)/(10*60000))};
}
const names={clear:'晴れ',cloud:'くもり',rain:'雨',snow:'雪',ash:'火山灰',blizzard:'吹雪'};
function precipitation(c,type,tick,alpha,w,h) {
 if(!alpha||!['rain','snow'].includes(type))return;
 c.save();c.globalAlpha=alpha;c.strokeStyle='rgba(187,220,244,.55)';c.fillStyle='rgba(245,250,255,.8)';c.lineWidth=1;c.beginPath();
 for(let i=0;i<(type==='rain'?45:32);i++){
  const x=(i*73+(type==='rain'?-tick*.025:Math.sin(tick/1700+i)*7)+w*1000)%(w+24)-12;
  const y=(i*47+tick*(type==='rain'?.23:.025))%(h+24)-12;
  if(type==='rain'){c.moveTo(x,y);c.lineTo(x-3,y+9);}else c.fillRect(Math.round(x),Math.round(y),2,2);
 }c.stroke();c.restore();
}
export function drawRealtimeEnvironment(c,map,tick,now=new Date(),{storyStorm=false,camX=0,camY=0}={}) {
 if(map.kind!=='out')return;
 const w=c.canvas.width,h=c.canvas.height,light=daylight(now),weather=fieldWeather(map,now);
 c.save();const [r,g,b,a]=light.tint;c.fillStyle=`rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;c.fillRect(0,0,w,h);
 if(!storyStorm){
  const cloud={clear:0,cloud:.07,rain:.12,snow:.04,ash:0,blizzard:0};
  const shade=cloud[weather.previous]*(1-weather.mix)+cloud[weather.current]*weather.mix;
  c.fillStyle=`rgba(30,49,65,${shade})`;c.fillRect(0,0,w,h);
  precipitation(c,weather.previous,tick,1-weather.mix,w,h);precipitation(c,weather.current,tick,weather.mix,w,h);
 }
 drawNightLights95(c,map,light.hours,{camX,camY});c.restore();
}
export function drawClockWeather(c,map,now=new Date(),{storyStorm=false}={}) {
 if(map.kind!=='out')return;
 drawWeatherBadge(c,clockWeatherPresentation(daylight(now),fieldWeather(map,now),storyStorm));
}
