import {FLOORS,objectSource,actorSource,isSign82,signText82} from '/src/editorModel72.mjs';
import {LEGACY73} from '/src/legacyCatalog73.mjs';
export function selectionInfo90({selection,item,tool,base,rendered,doc,cat,maps,people}){
 const label=key=>FLOORS.find(f=>f[0]===key)?.[1]||[...cat.props,...cat.furniture].find(p=>p.key===key)?.label||key;
 if(!item){if(!tool)return null;const title=tool.category==='people'?(people[Number(tool.key)]||'住人'):tool.category==='pets'?tool.key:label(tool.key);return {title,lines:['選択中の素材。マップをクリックして配置できます。']};}
 const position=`位置：X ${item.x}・Y ${item.y}`;
 if(selection.kind==='ground'){const ch=rendered.rows[item.y]?.[item.x],native=LEGACY73.find(p=>p.key==='legacy73-ground-'+base.id+'-'+ch?.charCodeAt(0));return {title:native?.label||({',':'草地','.':'道','f':'室内の床','W':'水辺','X':'壁','R':'岩壁','T':'木','"':'草むら','D':'入口','S':'看板','F':'花','=':'柵'}[ch]||'地面'),lines:['元からある地面・床',position]};}
 if(selection.kind==='tile')return {title:label(item.material),lines:['地面・床',position,`向き：${(item.turn81||0)*90}°`]};
 if(selection.kind==='link')return {title:'入口・マップ接続',lines:['行き先：'+(maps[item.to]?.name||'未設定'),position]};
 if(selection.kind==='actor'){const n=actorSource(base,item,cat),title=n.displayName||n.name||'住人',lines=[n.artMon?'ガオン：'+n.artMon:'人物：'+(people[n.variant]||'町の人'),position];const owner=doc.actors.find(a=>a.id===item.owner);if(owner){const who=actorSource(base,owner,cat);lines.push('飼い主：'+(who.displayName||who.name||'住人'));}return {title,lines};}
 const src=objectSource(base,item,cat),title=label(item.template),lines=[`大きさ：横 ${src.w} × 縦 ${src.h} マス`,position];
 const actual=[...(rendered.props||[]),...(rendered.editorAddedProps72||[])].find(p=>p.editorObjectId72===item.id||p.x===item.x&&p.y===item.y&&p.art===src.art);
 const door=actual?.door||(src.door?{x:item.x+src.door.x-src.x,y:item.y+src.door.y-src.y}:src.doorOffset?{x:item.x+src.doorOffset[0],y:item.y+src.doorOffset[1]}:null);
 const link=(doc.links||[]).find(l=>l.sourceAnchor?.objectId===item.id||door&&l.x===door.x&&l.y===door.y);
 const warp=door&&(rendered.warps||[]).find(w=>w.x===door.x&&w.y===door.y),to=link?.to||warp?.to||src.building,target=maps[to];
 if(target){lines.unshift('室内・行き先：'+target.name);if(/家|住まい/.test(title)&&(/共通|追加した/.test(target.name)||target.name===base.name+'の家'))lines.push('持ち主の名前は設定されていません。');return {title:/家|屋|病院|ショップ|研究|ホール|納屋|塔|船/.test(target.name)?target.name:title,lines:['素材：'+(/家/.test(title)&&title!==target.name?'家の外観':title),...lines]};}
 if(src.door||src.building)lines.unshift('室内・行き先：未設定');
 if(isSign82(src))lines.push('看板：'+(item.signText82??signText82(base,src)));
 if(actual?.resource89||/^resource83-blue-/.test(src.art||''))lines.unshift('採掘できる素材');
 return {title,lines};
}
export function showSelectionInfo90(el,info){el.replaceChildren();el.hidden=!info&&el.id!=='selectedInfo90';if(!info){if(el.id==='selectedInfo90'){el.textContent='「選択・移動」でマップ上のものをクリックすると、名前や情報を確認できます。';}return;}const title=document.createElement('strong');title.textContent=info.title;el.append(title);const details=document.createElement('span');details.textContent=info.lines.join(' ／ ');el.append(details);}
