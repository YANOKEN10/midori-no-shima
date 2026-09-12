const fs=require('fs'),path=require('path');
const endpoint=process.env.FRIEND_GATEWAY_URL||'https://tiaygrsdewehgkablzlv.supabase.co/functions/v1/friend-gateway';
const enabled=()=>Boolean(process.env.FRIEND_GATEWAY_SECRET)||!process.env.VERCEL;
const localFile=path.join(__dirname,'..','.devdata','friends-documents.json');
let tail=Promise.resolve();
async function call(action,args){if(process.env.FRIEND_GATEWAY_SECRET){for(let attempt=0;;attempt++){try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXlncnNkZXdlaGdrYWJsemx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTQ3MzgsImV4cCI6MjEwNDc5MDczOH0.SJo4yqf5dk9i6PKEpDxBz94CfMzJXPK5AQo7anTA0yw','x-friend-secret':process.env.FRIEND_GATEWAY_SECRET},body:JSON.stringify({action,...args}),signal:AbortSignal.timeout(action==='read'?3500:10000)});if(!r.ok){console.error('friend gateway unavailable',{action,status:r.status});throw Error('gateway');}return await r.json();}catch(e){if(action==='read'&&attempt<2){await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));continue;}const error=Error('通信サーバーに接続できません。再接続をお待ちください');error.statusCode=503;throw error;}}}if(process.env.VERCEL)throw Error('通信の準備中です');
 const run=tail.then(()=>{let all={};try{all=JSON.parse(fs.readFileSync(localFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;}
 if(action==='read')return Object.fromEntries(args.keys.filter(k=>all[k]).map(k=>[k,all[k]]));
 for(const[k,v]of Object.entries(args.expected))if((all[k]?.version||0)!==v)return false;
 for(const[k,data]of Object.entries(args.writes)){if(!(k in args.expected))throw Error('missing version');all[k]={version:(all[k]?.version||0)+1,data};}
 fs.mkdirSync(path.dirname(localFile),{recursive:true});fs.writeFileSync(localFile+'.tmp',JSON.stringify(all));fs.renameSync(localFile+'.tmp',localFile);return true;});tail=run.catch(()=>{});return run;
}
const read=keys=>call('read',{keys}),commit=(expected,writes)=>call('commit',{expected,writes});
const userKey=id=>'user:'+id;
function cleanUser(u){const n={...u};delete n._friendVersion;return n;}
async function readUser(id,legacy){const key=userKey(id);for(let i=0;i<4;i++){const d=(await read([key]))[key];if(d)return d.data?{...d.data,_friendVersion:d.version}:null;const old=await legacy();if(!old)return null;if(await commit({[key]:0},{[key]:cleanUser(old)}))return {...old,_friendVersion:1};}throw Error('もう一度お試しください');}
async function writeUser(u){const key=userKey(u.id),d=(await read([key]))[key],version=d?.version||0;if(version!==(u._friendVersion||0))throw Error('記録が更新されました。読み込み直してください');if(d?.data?._activeRoom)throw Error('通信ルームを退出してから保存してください');if(u.payload&&(d?.data?.payload?.friendEpoch||0)!==(u.payload?.friendEpoch||0))throw Error('通信後の記録を読み込んでください');if(!await commit({[key]:version},{[key]:cleanUser(u)}))throw Error('記録が更新されました');u._friendVersion=version+1;}
async function deleteUser(u){const key=userKey(u.id);if(u._activeRoom)throw Error('通信ルームを退出してください');if(!await commit({[key]:u._friendVersion},{[key]:null}))throw Error('記録が更新されました');}
module.exports={enabled,read,commit,userKey,readUser,writeUser,deleteUser,cleanUser};
