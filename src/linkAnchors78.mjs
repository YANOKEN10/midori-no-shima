const objectId=/^(p|f):\d+$|^a:[\w-]{1,60}$/;
export const validAnchor78=a=>a===undefined||!!a&&typeof a==='object'&&typeof a.objectId==='string'&&objectId.test(a.objectId)&&Number.isInteger(a.dx)&&Number.isInteger(a.dy)&&a.dx>=0&&a.dy>=0&&a.dx<=32&&a.dy<=32;
export function linkObjects78(map){return map?.editorObjects78||(map?.props||[]).map((p,i)=>({...p,id:'p:'+i}));}
export function findAnchor78(map,x,y){const p=linkObjects78(map).find(p=>(p.door||p.building||p.mask||/gate/i.test(p.art||''))&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<=p.y+p.h);return p?{objectId:p.id,dx:x-p.x,dy:y-p.y}:undefined;}
export function anchoredPoint78(map,a){if(!a)return null;const p=linkObjects78(map).find(p=>p.id===a.objectId);if(!p||a.dx>=p.w||a.dy>p.h)return null;return{x:p.x+a.dx,y:p.y+a.dy};}
export function attachLinkAnchors78(doc,source,maps){for(const l of doc.links||[]){if(!l.sourceAnchor)l.sourceAnchor=findAnchor78(source,l.x,l.y);if(!l.targetAnchor)l.targetAnchor=findAnchor78(maps[l.to],l.tx,l.ty);}return doc;}
export function resolveLinks78(maps){const errors=[];for(const m of Object.values(maps))for(const l of m.editorLinks75||[]){for(const [a,map,kx,ky]of [[l.sourceAnchor,m,'x','y'],[l.targetAnchor,maps[l.to],'tx','ty']])if(a){const p=anchoredPoint78(map,a);if(!p)errors.push('接続した門・建物が見つかりません。接続先を変更するか接続を削除してください。');else{l[kx]=p.x;l[ky]=p.y;}}}return [...new Set(errors)];}
