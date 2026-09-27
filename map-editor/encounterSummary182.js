import {ordinaryEncounters,RARE_RULES} from '/src/rareEncounters.js';
import {filterWild91,wildWindow91} from '/src/wildAvailability91.mjs';
import {scheduleForMap} from '/src/scheduledEncounters62.js';
export function encounterSummary182(base,doc){
 const configured=doc.encounters86!==undefined,enc=configured?doc.encounters86:base.enc,now=new Date(),list=enc?.rate>0?(configured?filterWild91(enc.list||[],now,base.id,true):ordinaryEncounters(enc.list||[],base.id,now,'active')):[],scheduled=scheduleForMap(base.id);
 const entries=list.filter(e=>e[3]>0).map(([name,min,max])=>({name,min,max,note:wildWindow91(name)||(!configured&&scheduled?.name===name?scheduled.label:'')}));
 if(!configured)for(const r of RARE_RULES.filter(r=>r.map===base.id))entries.push({name:r.name,min:r.min,max:r.max,note:'特定マス・解放後'});
 return {name:base.name,area:base.kind==='cave'||enc?.encAll||enc?.terrain150==='land'||base.encAll?'ダンジョン・地上':'草むら',entries};
}
export function renderEncounterSummary182(host,base,doc){const data=encounterSummary182(base,doc),signature=JSON.stringify(data);if(host.dataset.summary===signature)return;host.dataset.summary=signature;host.replaceChildren();const title=document.createElement('strong');title.textContent=data.name+'｜出現ガオン（'+data.area+'）';host.append(title);const list=document.createElement('div');list.className='encounter-chips182';if(!data.entries.length)list.textContent='出現するガオンはありません';for(const e of data.entries){const chip=document.createElement('span');chip.className='encounter-chip182';const name=document.createElement('b');name.textContent=e.name;const lv=document.createElement('span');lv.textContent='Lv.'+e.min+'～Lv.'+e.max;chip.append(name,lv);if(e.note){const note=document.createElement('small');note.textContent=e.note;chip.append(note);}list.append(chip);}host.append(list);}
