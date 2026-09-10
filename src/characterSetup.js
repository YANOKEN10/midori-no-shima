import { showForm } from './gate.js';
import { HAIR_COLORS, SHIRT_BASIC, SHIRT_FANCY } from './data/looks.js';
import { heroFrame } from './revampArt.js?v=20260910-forest-battle-v19';

export function chooseAppearance() {
  return showForm({title:'きみの みためは？',sub:'すきな みためを えらんでね。',fields:[],submit:'この すがたで はじめる',mount(host){
    const look={gender:'boy',appearanceVersion:1,hair:'#6b4a2b',shirt:'#2f6fd0'};
    host.id='character-setup';
    host.innerHTML=`<style>
      #character-setup canvas{display:block;width:100%;height:120px;image-rendering:pixelated;background:#dcefe6;border-radius:12px;margin:10px 0}
      #character-setup fieldset{border:0;padding:0;margin:14px 0}
      #character-setup legend{font-size:14px;color:#d9f5ff;margin-bottom:8px}
      #character-setup .options{display:flex;gap:8px;flex-wrap:wrap}
      #character-setup button{min-width:44px;min-height:44px;border:2px solid #50788b;border-radius:9px;background:#123247;color:#eaf8ff;font-family:inherit;font-size:14px;cursor:pointer}
      #character-setup button[aria-pressed=true]{border-color:#ffc451;box-shadow:0 0 0 2px #ffc451;color:#fff}
      #character-setup button:focus-visible{outline:3px solid white;outline-offset:3px}
      #character-setup .swatch{width:44px;position:relative}
      #character-setup .swatch[aria-pressed=true]::after{content:'✓';color:white;text-shadow:0 1px 3px #000,1px 0 #000;font-size:23px}
      #character-setup .selection{font-size:12px;color:#b9d6e3;margin:7px 0 0}
      #gate:has(#character-setup){align-items:safe center}
    </style><canvas width="320" height="120" role="img" aria-label="主人公の見た目のプレビュー"></canvas>`;
    const cv=host.querySelector('canvas'),ctx=cv.getContext('2d');
    const groups=[];
    function group(key,title,choices){
      const field=document.createElement('fieldset'),legend=document.createElement('legend'),buttons=document.createElement('div'),caption=document.createElement('p');
      legend.textContent=title;buttons.className='options';caption.className='selection';caption.setAttribute('aria-live','polite');
      field.append(legend,buttons,caption);host.append(field);
      const entries=choices.map(choice=>{const button=document.createElement('button');button.type='button';button.dataset.value=choice.value;button.setAttribute('aria-label',choice.name);button.title=choice.name;
        if(choice.color){button.className='swatch';button.style.background=choice.color;}else{button.textContent=choice.name;button.style.flex='1';}
        button.addEventListener('click',()=>{look[key]=choice.value;refresh();});buttons.append(button);return {button,choice};});
      groups.push({key,entries,caption});
    }
    group('gender','せいべつ',[{name:'おとこのこ',value:'boy'},{name:'おんなのこ',value:'girl'}]);
    group('hair','かみの いろ',HAIR_COLORS.map(c=>({...c,value:c.color})));
    group('shirt','ふくの いろ',[...SHIRT_BASIC,...SHIRT_FANCY.slice(0,3)].map(c=>({...c,value:c.color})));
    function refresh(){for(const g of groups){for(const e of g.entries)e.button.setAttribute('aria-pressed',String(look[g.key]===e.choice.value));g.caption.textContent=g.entries.find(e=>look[g.key]===e.choice.value)?.choice.name||'';}}
    let alive=true,raf;function draw(t){if(!alive)return;ctx.clearRect(0,0,320,120);ctx.imageSmoothingEnabled=false;['left','down','up'].forEach((dir,i)=>{const frame=heroFrame(dir,[0,1,2,1][Math.floor(t/180)%4],look);if(frame)ctx.drawImage(frame,22+i*100,12,64,96);});raf=requestAnimationFrame(draw);}
    refresh();raf=requestAnimationFrame(draw);
    return {read:()=>({look:{...look}}),dispose(){alive=false;cancelAnimationFrame(raf);}};
  }});
}
