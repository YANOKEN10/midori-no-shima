import {sceneKey86} from './sceneCatalog86.mjs';

// Pane coordinates use the source sprite, not the collision box or door tile.
// Keeping them with the drawing transform also supports rotated editor copies.
const D={
 chalet:{panes:[[.458,.383,.085,.08],[.255,.712,.078,.055],[.665,.712,.078,.055]]},
 chaletClinic:{offset:[13/160,-7/160],panes:[[.365,.36,.13,.065],[.24,.685,.12,.06],[.50,.685,.12,.06]]},
 chaletStone:{panes:[[.37,.42,.08,.09],[.58,.42,.08,.09],[.61,.68,.08,.075]]},
 chaletBalcony:{panes:[[.335,.355,.065,.105],[.55,.355,.065,.105],[.395,.69,.115,.085]]},
 snowChalet:{panes:[[.335,.43,.06,.07],[.45,.43,.06,.07],[.225,.72,.105,.09],[.671,.72,.105,.09]]},
 harborShop:{panes:[[.355,.363,.087,.066],[.682,.597,.08,.086]]},
 fashionShop74:{fashion:true,panes:[[.367,.371,.077,.064],[.728,.619,.083,.067]]},
 marineHouse:{panes:[[.47,.407,.062,.08],[.16,.635,.07,.057],[.84,.635,.052,.06]]},
 marineShop:{panes:[[.50,.322,.05,.071],[.316,.705,.05,.06],[.777,.705,.05,.06]]},
 marineHall:{panes:[[.207,.32,.04,.052],[.891,.32,.028,.048],[.21,.674,.05,.09],[.88,.668,.04,.105]]},
 flowerHouse:{panes:[[.466,.38,.061,.073],[.208,.671,.076,.06],[.755,.671,.065,.06]]},
 snowHouse:{panes:[[.348,.54,.035,.035],[.464,.522,.074,.068],[.64,.54,.035,.035],[.284,.725,.063,.063],[.638,.725,.063,.063]]},
 ranchBarn:{panes:[[.44,.51,.043,.037],[.19,.758,.047,.037],[.66,.758,.048,.037]]},
 daycareHouse:{panes:[[.46,.29,.071,.061],[.198,.529,.084,.068]]},
 eHouse:{fit:1,panes:[[.196,.69,.051,.064],[.269,.69,.038,.064],[.73,.689,.045,.07],[.796,.689,.038,.07]]},
 'lamp86':{fit:0,kind:'lamp',panes:[[.24,.257,.21,.06],[.53,.257,.2,.06],[.24,.347,.21,.06],[.53,.347,.2,.06]]},
 'snow-lamp86':{fit:0,kind:'lamp',panes:[[.36,.25,.27,.08],[.36,.35,.22,.025]]},
 'decor-lamp86':{fit:0,kind:'lamp',color:[202,175,255],panes:[[.35,.235,.28,.12]]},
 'canalHouse86':{fit:1,panes:[[.186,.251,.045,.065],[.464,.271,.055,.075],[.73,.251,.044,.065],[.234,.452,.081,.097],[.466,.452,.081,.097],[.697,.452,.081,.097],[.231,.733,.076,.058],[.704,.733,.073,.058]]},
 'snow-hall86':{fit:0,panes:[[.47,.58,.06,.049],[.19,.657,.046,.049],[.783,.657,.046,.049],[.18,.81,.055,.051],[.785,.81,.051,.051]]},
 'cityApartment86':{fit:0,panes:[[.18,.38,.145,.055],[.43,.38,.145,.055],[.69,.38,.145,.055],[.18,.55,.145,.055],[.43,.55,.145,.055],[.69,.55,.145,.055],[.18,.73,.145,.055],[.69,.73,.145,.055]]},
 'cityOffice86':{fit:1,panes:[[.28,.537,.12,.07],[.44,.537,.12,.07],[.60,.537,.12,.07],[.28,.638,.12,.06],[.44,.638,.12,.06],[.60,.638,.12,.06],[.285,.754,.07,.06],[.66,.754,.06,.06]]},
 'festiveCityHouse86':{fit:1,panes:[[.17,.29,.04,.064],[.784,.29,.04,.064],[.14,.495,.065,.05],[.462,.495,.065,.05],[.767,.495,.065,.05],[.185,.762,.047,.035],[.783,.762,.047,.035]]},
};
// Filled from the actual source sizes at build time; no night-only image fetch.
const ASPECT95={"lamp86":0.34375,"snow-lamp86":0.3541666666666667,"decor-lamp86":0.3046875,"canalHouse86":0.8880208333333334,"snow-hall86":0.9973958333333334,"cityApartment86":1.2673267326732673,"cityOffice86":1.0185676392572944,"festiveCityHouse86":1};
for(const [k,v]of Object.entries(ASPECT95))if(D[k])D[k].fit=v;
const LEGACY_ASPECT95={"chalet":1,"chaletStone":1,"chaletBalcony":1,"snowChalet":1,"harborShop":1,"marineHouse":1,"marineShop":1,"marineHall":1,"flowerHouse":1,"daycareHouse":1.3333333333333333,"snowHouse":1,"ranchBarn":1.2};
const legacyDefs95=Object.fromEntries(Object.entries(LEGACY_ASPECT95).filter(([k])=>D[k]).map(([k,fit])=>[k,{...D[k],fit}]));
legacyDefs95.harborShop={...legacyDefs95.harborShop,panes:[[.34,.36,.087,.065],[.70,.61,.08,.10]]};
export function nightAmount95(hours){
 if(!Number.isFinite(hours))return 0;
 const h=((hours%24)+24)%24;
 if(h>=6&&h<18)return 0;
 return h>=18?Math.min(1,.65+(h-18)*.35):h<5?1:1-(h-5)*.65;
}
export function lightDefinition95(p){
 const key=p.fashionShop?'fashionShop74':sceneKey86(p.art);
 if(!p.fashionShop&&p.art?.startsWith('legacy73-')&&key===p.art.slice(9)&&key!=='chaletClinic')return legacyDefs95[key]||D[key]||null;
 return D[key]||null;
}
export function propLightGeometry95(p){
 const d=lightDefinition95(p);if(!d)return null;
 const turn=((p.turn81||0)%4+4)%4,sw=(turn?p.originalW81:p.w)*32,sh=(turn?p.originalH81:p.h)*32;
 if(![p.x,p.y,p.w,p.h,sw,sh].every(Number.isFinite)||sw<=0||sh<=0)return null;
 let width=sw,height=sh,x=-sw/2,y=-sh/2;
 if(d.fashion){width=160*241/256;height=160*222/256;x=-sw/2+sw*.375-width*90/243;y=sh/2-160+160*9/256;}
 else if(d.fit){width=Math.min(sw,sh*d.fit);height=width/d.fit;x=-width/2;y=sh/2-height;}
 if(d.offset){x+=sw*d.offset[0];y+=sh*d.offset[1];}
 return {d,turn,cx:(p.x+p.w/2)*32,cy:(p.y+p.h/2)*32,x,y,width,height};
}
export function drawNightLights95(c,map,hours,{camX=0,camY=0}={}){
 const amount=nightAmount95(hours);if(!amount||map.kind!=='out')return;
 c.save();c.globalCompositeOperation='screen';c.imageSmoothingEnabled=false;
 for(const p of [...map.props||[],...map.editorAddedProps72||[]]){
  const g=propLightGeometry95(p);if(!g)continue;
  const {d,turn,x,y,width,height}=g,cx=g.cx-camX,cy=g.cy-camY,margin=Math.max(width,height)/2+40;
  if(cx+margin<0||cy+margin<0||cx-margin>c.canvas.width||cy-margin>c.canvas.height)continue;
  c.save();c.translate(cx,cy);c.rotate(turn*Math.PI/2);
  const rgb=d.color||[255,207,101],color=alpha=>`rgba(${rgb.join(',')},${alpha*amount})`;
  for(const [u,v,pw,ph]of d.panes){
   const left=x+u*width,top=y+v*height,w=pw*width,h=ph*height,mx=left+w/2,my=top+h/2;
   const radius=d.kind==='lamp'?30:Math.min(19,Math.max(9,w*1.4));
   const glow=c.createRadialGradient(mx,my,0,mx,my,radius);glow.addColorStop(0,color(d.kind==='lamp'?.16:.2));glow.addColorStop(1,color(0));c.fillStyle=glow;c.fillRect(mx-radius,my-radius,radius*2,radius*2);
   c.fillStyle=color(.77);c.fillRect(Math.round(left),Math.round(top),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));
  }
  c.restore();
 }
 c.restore();
}
