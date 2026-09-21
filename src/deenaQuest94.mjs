import {SPECIES} from './data/species.js';
export const DEENA_STEPS94=[
 {map:'remoteLake',name:'はなれの湖',type:'みず',flag:'post:deenaWater94'},
 {map:'radenInside',name:'ラーデン発電所・機械室',type:'でんき',flag:'post:deenaSpark94'},
 {map:'mossSanctuary',name:'森の聖域',type:'ひかり',flag:'post:deenaLight94'}
];
const cleared=s=>!!(s.flags?.['end:clear']||s.flags?.champion);
export const deenaReady94=s=>cleared(s)&&!!s.flags?.['post:deenaAwakened94']&&!s.flags?.['post:deenaCaught'];
export function recordDeenaVisit94(save,mapId){
 if(!cleared(save)||!save.flags?.['post:deenaQuest94']||save.flags['post:deenaAwakened94'])return null;
 const step=DEENA_STEPS94.find(s=>s.map===mapId&&!save.flags[s.flag]);
 if(!step||!save.party.some(m=>SPECIES[m.sp]?.types.includes(step.type)))return null;
 save.flags[step.flag]=true;return step;
}
export async function deenaGuide94(save,ui,onChanged){
 if(!cleared(save)){await ui.say(['旅を終えたら 虹の調査を手伝ってね。']);return;}
 if(save.flags['post:deenaCaught']){await ui.say(['ディーナが 君の仲間になったんだね。','虹の調査を 手伝ってくれてありがとう！']);return;}
 if(save.flags['post:deenaAwakened94']){await ui.say(['３つの共鳴で ディーナが目覚めたよ！','リーフタウンの広場で 君を待っている。']);return;}
 if(!save.flags['post:deenaQuest94']){
  await ui.say(['私は虹の研究員 セイ。','ディーナを呼ぶには 水・雷・光の３つの共鳴が必要なんだ。']);
  if(!await ui.ask(['３つの場所を調べてくれる？']))return;
  save.flags['post:deenaQuest94']=true;onChanged();
 }
 if(DEENA_STEPS94.every(s=>save.flags[s.flag])){
  await ui.say(['水・雷・光が そろった！','３色の光が 空でひとつになった…','リーフタウンに ディーナが現れた！']);
  save.flags['post:deenaAwakened94']=true;onChanged();return;
 }
 await ui.say(['次のタイプのガオンを 手持ちに入れて、その場所へ行ってね。',...DEENA_STEPS94.map(s=>(save.flags[s.flag]?'調査済み：':'未調査：')+s.name+'／'+s.type+'タイプ'),'３つそろったら 私のところへ戻ってきて。']);
}
export function addDeenaGuide94(maps){
 const m=maps.leafTown;if(!m||m.editor72||m.npcs.some(n=>n.script==='post:deenaGuide94'))return;
 const open=(x,y)=>['.',','].includes(m.rows[y]?.[x])&&![...m.npcs,...m.warps,...m.signs,...m.items||[]].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2)&&![...m.props||[],...m.editorAddedProps72||[]].some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y-1&&y<p.y+p.h+1);
 const choices=[];for(let y=3;y<m.rows.length-3;y++)for(let x=3;x<m.rows[y].length-3;x++)if(open(x,y)&&open(x,y+1))choices.push({x,y});
 choices.sort((a,b)=>Math.abs(a.x-m.spawn.x)+Math.abs(a.y-m.spawn.y)-Math.abs(b.x-m.spawn.x)-Math.abs(b.y-m.spawn.y));
 if(!choices.length)return;
 m.npcs.push({...choices[0],name:'虹の研究員 セイ',variant:33,dir:'down',noRoam:true,script:'post:deenaGuide94',talk:['虹の共鳴を 調べているんだ。']});
}
