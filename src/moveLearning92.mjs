import {SPECIES} from './data/species.js';
import {MOVES,canonicalMoveName,newMove} from './data/moves.js';

// Earlier evolutionary stages remain eligible; future levels never do.
export function recallableMoves92(mon, catalog=SPECIES) {
  const current=catalog[mon.sp];
  if(!current)return [];
  const family=new Set([current]);
  let changed=true;
  while(changed){changed=false;for(const sp of Object.values(catalog))if(sp.evo&&family.has(catalog[sp.evo.to])&&!family.has(sp)){family.add(sp);changed=true;}}
  const known=new Set(mon.moves.map(m=>canonicalMoveName(m.name))), available=new Map();
  for(const sp of family)for(const [level,raw] of sp.learn){const name=canonicalMoveName(raw);if(level<=mon.lv&&MOVES[name]&&!known.has(name))available.set(name,Math.min(level,available.get(name)??Infinity));}
  return [...available].map(([name,level])=>({name,level})).sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name,'ja'));
}

export async function teachMove92(mon,raw,ui,onChanged=()=>{}) {
  const name=canonicalMoveName(raw), move=MOVES[name];
  if(!move||mon.moves.some(m=>canonicalMoveName(m.name)===name))return false;
  await ui.say([name+'を おぼえられます。',move.type+' / '+(move.cat==='phys'?'ぶつり':move.cat==='spec'?'とくしゅ':'へんか')+' / 威力 '+(move.pow||'—')+' / PP '+move.pp,move.desc||'']);
  let slot=mon.moves.length;
  if(slot>=4){
    await ui.say(['わざは４つまで。','入れ替えるわざを 選んでください。']);
    slot=await ui.choice([...mon.moves.map(m=>m.name),'おぼえない'],{x:8,y:20,w:304,rows:5});
    if(slot<0||slot>=4)return false;
    if(!await ui.ask([mon.moves[slot].name+'を忘れて',name+'を おぼえますか？']))return false;
  }else if(!await ui.ask([name+'を おぼえますか？']))return false;
  const old=mon.moves[slot]?.name;
  mon.moves[slot]=newMove(name);onChanged();
  await ui.say([old?old+'を忘れて…':(mon.nick||mon.sp)+'は',name+'を おぼえた！']);
  return true;
}

export async function openMoveReminder92(save,ui,onChanged=()=>{}) {
  await ui.say(['思い出し屋の レミです。','今のレベルまでに覚えられる技を 無料で思い出せます。','進化前の技も おまかせください。']);
  if(!save.party.length){await ui.say(['ガオンを連れて また来てくださいね。']);return;}
  while(true){
    const i=await ui.choice([...save.party.map(m=>(m.nick||m.sp)+' Lv.'+m.lv),'やめる'],{x:8,y:20,w:304,rows:6});
    if(i<0||i>=save.party.length)return;
    const mon=save.party[i];
    while(true){
      const list=recallableMoves92(mon);
      if(!list.length){await ui.say(['今 思い出せる技は ありません。']);break;}
      const j=await ui.choice([...list.map(m=>m.name),'ガオンを選びなおす'],{x:8,y:20,w:304,rows:6});
      if(j<0||j>=list.length)break;
      await teachMove92(mon,list[j].name,ui,onChanged);
    }
  }
}
