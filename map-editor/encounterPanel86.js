export function encounterPanel86(host,value,species,onchange){
 host.replaceChildren();
 const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;host.append(b);return b;};
 const note=document.createElement('p');note.className='muted';note.textContent='配置した草むらに出現します。ガオン・レベル・出やすさを設定して、マップを公開してください。';host.append(note);
 if(!value){note.textContent='草むらの通常出現は未設定です。設定後、草むらを配置してください。';button('＋ 出現するガオンを設定',()=>onchange({rate:18,list:[[species[0],3,5,10]]}));return;}
 const number=(parent,label,n,min,max,fn)=>{const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.value=n;input.required=true;input.onchange=()=>fn(Number(input.value));l.append(input);parent.append(l);};
 const update=fn=>{const next=structuredClone(value);fn(next);onchange(next);};
 number(host,'草むらで1歩ごとの出現率（%）',value.rate,1,100,n=>update(v=>v.rate=n));
 value.list.forEach((entry,i)=>{const row=document.createElement('fieldset');row.className='encounter-row86';const legend=document.createElement('legend');legend.textContent=(i+1)+'体目';row.append(legend);const label=document.createElement('label');label.textContent='ガオン';const select=document.createElement('select');select.setAttribute('aria-label',(i+1)+'体目の出現ガオン');for(const name of species)select.add(new Option(name,name));select.value=entry[0];select.onchange=()=>update(v=>v.list[i][0]=select.value);label.append(select);row.append(label);number(row,'最低レベル',entry[1],1,100,n=>update(v=>v.list[i][1]=n));number(row,'最高レベル',entry[2],1,100,n=>update(v=>v.list[i][2]=n));number(row,'出やすさ（大きいほど多く出現）',entry[3],1,100,n=>update(v=>v.list[i][3]=n));const remove=document.createElement('button');remove.type='button';remove.textContent='このガオンを外す';remove.onclick=()=>onchange(value.list.length===1?null:{...value,list:value.list.filter((_,j)=>j!==i)});row.append(remove);host.append(row);});
 if(value.list.length<30&&species.some(n=>!value.list.some(e=>e[0]===n)))button('＋ ガオンを追加',()=>update(v=>v.list.push([species.find(n=>!v.list.some(e=>e[0]===n)),3,5,10])));
 button('通常の草むら出現をなしにする',()=>onchange(null));
}
