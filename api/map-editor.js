const L=require('./_lib'),F=require('./_friendStore');
const base=require('../assets/editor-v72/base-maps.json'),species=require('../assets/editor-v72/species.json');
const model=import('../src/editorModel72.mjs');
const PUB='maps72:published';
// Pinned to the existing account record, not a self-assigned display name or client flag.
const isAdmin=u=>!!u&&u.id==='ヤノケン'&&Number(u.created)===1789724902905;
module.exports=async(req,res)=>{L.cors(req,res);if(req.method==='OPTIONS')return res.status(204).end();try{
 const b=L.body(req);if(req.method==='GET'){const doc=(await F.read([PUB]))[PUB];return res.status(200).json({revision:doc?.version||0,maps:doc?.data?.maps||{}});}
 if(req.method!=='POST')return res.status(405).json({message:'未対応の操作です。'});
 const auth=L.readToken(L.bearer(req));if(!auth)return res.status(401).json({message:'ゲームのアカウントでログインしてください。'});const user=await L.readUser(auth.id);if(!isAdmin(user))return res.status(403).json({message:'このアカウントにはマップの管理権限がありません。'});
 if(b.action==='session')return res.status(200).json({admin:true,name:user.display||user.id});
 if(typeof b.map!=='string'||!Object.hasOwn(base,b.map))return res.status(400).json({message:'マップが見つかりません。'});
 const key='maps72:draft:'+b.map,history='maps72:previous:'+b.map,docs=await F.read([key,PUB,history]),draft=docs[key],published=docs[PUB],previous=docs[history];
 if(b.action==='read')return res.status(200).json({draft:draft?.data?.edit||null,draftRevision:draft?.version||0,published:published?.data?.maps?.[b.map]||null,publicRevision:published?.version||0,hasPrevious:!!previous?.data});
 if(!['save','publish','rollback'].includes(b.action))return res.status(400).json({message:'未対応の操作です。'});
 if(!Number.isInteger(b.revision)||b.revision!==(draft?.version||0))return res.status(409).json({message:'別の画面で下書きが更新されました。再読み込みしてください。'});
 if(b.action!=='save'&&b.publicRevision!==(published?.version||0))return res.status(409).json({message:'公開状態が更新されています。再読み込みしてください。'});
 const m=await model,cat=m.catalog(base,species);let edit=b.action==='rollback'?previous?.data?.edit:b.edit;if(b.action==='rollback'&&!previous?.data)return res.status(400).json({message:'戻せる履歴がありません。'});
 if(edit===undefined)return res.status(400).json({message:'編集データがありません。'});if(edit!==null){if(JSON.stringify(edit).length>250000)return res.status(413).json({message:'編集データが大きすぎます。'});const errors=m.validateEdit(base[b.map],edit,cat);if(errors.length)return res.status(400).json({message:errors.join('\n'),errors});edit=JSON.parse(JSON.stringify(edit));}else if(b.action!=='rollback')return res.status(400).json({message:'編集データがありません。'});
 const expected={[key]:draft?.version||0},writes={[key]:{edit,by:user.id,at:Date.now()}};
 if(b.action!=='save'){const maps={...published?.data?.maps};const old=maps[b.map]||null;if(edit)maps[b.map]=edit;else delete maps[b.map];if(JSON.stringify(maps).length>1400000)return res.status(413).json({message:'公開データの上限です。不要な床の変更を減らしてください。'});expected[PUB]=published?.version||0;expected[history]=previous?.version||0;writes[PUB]={maps,at:Date.now()};writes[history]={edit:old,at:Date.now()};}
 if(!await F.commit(expected,writes))return res.status(409).json({message:'編集が競合しました。再読み込みしてください。'});
 return res.status(200).json({ok:true,draftRevision:expected[key]+1,publicRevision:b.action==='save'?published?.version||0:expected[PUB]+1,hasPrevious:b.action!=='save'||!!previous?.data});
 }catch(e){console.error('map editor:',e.message);return res.status(503).json({message:'保存サーバーに接続できません。下書きを端末に書き出し、再度お試しください。'});}};
