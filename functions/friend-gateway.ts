// Platform JWT verification is mandatory; the server secret is an additional check.
// The deployment script replaces this marker in memory; never commit a gateway secret.
const secret = '__FRIEND_GATEWAY_SECRET__';
Deno.serve(async req => {
 const provided=req.headers.get('x-friend-secret')||'';
 const enc=new TextEncoder(),hash=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)));
 const [a,b]=await Promise.all([hash(secret),hash(provided)]);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
 if(diff||!provided)return new Response('Unauthorized',{status:401});
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 try{
 const raw=await req.text();if(raw.length>2000000)return new Response('Too large',{status:413});const data=JSON.parse(raw);
 const name=data.action==='read'?'gaon_friends_read':data.action==='commit'?'gaon_friends_commit':null;
 if(!name)return new Response('Invalid action',{status:400});
 const args=data.action==='read'?{p_keys:data.keys}:{p_expected:data.expected,p_writes:data.writes};
 const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const result=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:'Bearer '+key},body:JSON.stringify(args)});
 if(!result.ok)return new Response(JSON.stringify({error:'database'}),{status:503,headers:{'Content-Type':'application/json'}});
 return new Response(await result.text(),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 }catch{return new Response('Invalid request',{status:400})}
});
