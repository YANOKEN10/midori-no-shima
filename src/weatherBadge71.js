const iconKeys=['clear','cloud','rain','snow','storm','ash','blizzard','dawn','morning','day','evening','night'];
const icons=Object.fromEntries(iconKeys.map(key=>{const image=new Image();image.src=new URL('../assets/weather-v71/'+key+'.png',import.meta.url).href;return[key,image];}));
export const weatherIconsReady=Promise.all(Object.values(icons).map(image=>image.decode().catch(()=>{})));
const periods={'夜明け':'dawn','朝':'morning','昼':'day','夕方':'evening','夜':'night'};
export function clockWeatherPresentation(light,weather,storyStorm=false){return {time:light.label,period:periods[light.period],weather:storyStorm?'storm':weather.mix<.5?weather.previous:weather.current};}
function pill(c,x,y,w,h,r,fill){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();}
export function drawWeatherBadge(c,state){
 c.save();c.textBaseline='middle';c.textAlign='center';
 pill(c,7,9,119,32,10,'rgba(9,38,48,.24)');
 pill(c,6,7,119,32,10,'#437a86');pill(c,7,8,117,29,9,'#fff5d7');
 pill(c,9,10,72,25,7,'#e5f4ec');
 c.font='bold 17px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
 c.lineJoin='round';c.lineWidth=2.5;c.strokeStyle='#ffffff';c.strokeText(state.time,45,23);c.fillStyle='#315d6d';c.fillText(state.time,45,23);
 for(const[key,x]of [[state.period,82],[state.weather,103]]){const image=icons[key];if(image?.complete&&image.naturalWidth)c.drawImage(image,x,13,20,20);else{c.font='10px sans-serif';c.fillStyle='#315d6d';c.fillText(key===state.period?'時':'天',x+10,23);}}
 c.restore();
}
