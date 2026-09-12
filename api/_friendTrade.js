const crypto=require('crypto');
const clone=x=>JSON.parse(JSON.stringify(x));
function slot(payload,ref){if(!ref||!['party','box'].includes(ref.place)||!Number.isInteger(ref.index)||ref.index<0)throw Error('手持ちかボックスから選んでください');const mon=payload?.[ref.place]?.[ref.index];if(!mon?.companionId)throw Error('ガオンが見つかりません');return mon;}
function digest(mon){return crypto.createHash('sha256').update(JSON.stringify(mon)).digest('hex');}
function offer(room,actor,payload,ref){if(room.phase!=='lobby'||!room.players.some(p=>p.id===actor))throw Error('交換できません');const mon=slot(payload,ref);room.offers ||= {};room.offers[actor]={ref:clone(ref),id:mon.companionId,digest:digest(mon),mon:clone(mon)};room.offerRevision=(room.offerRevision||0)+1;room.confirmations={};return room;}
function confirm(room,actor,revision,users){if(room.phase!=='lobby'||!room.players.some(p=>p.id===actor)||revision!==room.offerRevision)throw Error('提示が変わりました。もう一度確認してください');if(room.players.length!==2||room.players.some(p=>!room.offers?.[p.id]))throw Error('2人ともガオンを選んでください');room.confirmations ||= {};room.confirmations[actor]=revision;if(!room.players.every(p=>room.confirmations[p.id]===revision))return null;
 const updated=Object.fromEntries(room.players.map(p=>[p.id,clone(users[p.id])]));
 const [a,b]=room.players.map(p=>p.id),oa=room.offers[a],ob=room.offers[b];
 for(const id of [a,b]){const o=room.offers[id],m=slot(updated[id].payload,o.ref);if(m.companionId!==o.id||digest(m)!==o.digest)throw Error('ガオンの状態が変わりました。選び直してください');}
 if(oa.id===ob.id)throw Error('同じガオンは交換できません');
 for(const[owner,incoming]of [[a,ob],[b,oa]]){const u=updated[owner],outgoing=room.offers[owner],p=u.payload;const all=[...(p.party||[]),...(p.box||[])];if(all.some(m=>m.companionId===incoming.id))throw Error('そのガオンはすでに持っています');p[outgoing.ref.place][outgoing.ref.index]=clone(incoming.mon);p.dexSeen ||= {};p.dexOwn ||= {};p.dexSeen[incoming.mon.sp]=true;p.dexOwn[incoming.mon.sp]=true;p.friendEpoch=(p.friendEpoch||0)+1;p.savedAt=Date.now();u.savedAt=p.savedAt;u.rev=(u.rev||0)+1;}
 room.phase='complete';room.result='交換が完了しました';room.completedAt=Date.now();return updated;
}
function checkSaveEpoch(current,incoming){if((current?.friendEpoch||0)!==(incoming?.friendEpoch||0))throw Error('交換後の新しい記録を読み込んでください');}
module.exports={slot,offer,confirm,checkSaveEpoch};
