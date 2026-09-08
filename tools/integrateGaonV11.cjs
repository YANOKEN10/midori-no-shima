const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const rows=JSON.parse(fs.readFileSync('docs/gaon-redesign-v11.json','utf8'));
let source=fs.readFileSync('src/data/battleart.js','utf8');
for(const row of rows)for(let view=0;view<2;view++){
  const dest=`assets/monsters/redesign-v11/${view?'back':'front'}/${path.basename(row.files[view])}`;
  if(!fs.existsSync(dest))throw Error('Missing '+dest);
  source=source.replaceAll(row.files[view],dest);
}
fs.writeFileSync('src/data/battleart.js',source);
execFileSync(process.execPath,['tools/buildGaonCatalog.mjs'],{stdio:'inherit'});
const files=Object.fromEntries([...source.matchAll(/\s+([^\s:]+): "\.\.\/\.\.\/(assets\/monsters\/(?:battle|redesign-v\d+\/front)\/[^\"]+)"/g)].map(m=>[m[1],m[2]]));
const privateHtml=fs.readFileSync('artifacts/gaon-catalog/gaon-evolution-catalog.html','utf8');
let publicHtml=fs.readFileSync('gaon-zukan/index.html','utf8');
const sections=[...privateHtml.matchAll(/<section id="type-\d+">[\s\S]*?<\/section>/g)].map(m=>m[0]);
if(sections.length!==9)throw Error('Expected nine type sections');
for(let i=0;i<9;i++){
  const html=sections[i].replace(/<img alt="([^"]+)" src="data:image\/png;base64,[^"]+">/g,(_,name)=>`<img alt="ガオン・${name}" src="/${files[name]}" loading="lazy" decoding="async" width="148" height="124">`);
  publicHtml=publicHtml.replace(new RegExp('<section id="type-'+i+'">[\\s\\S]*?<\\/section>'),html);
}
for(const row of rows)publicHtml=publicHtml.replaceAll('/'+row.files[0],'/assets/monsters/redesign-v11/front/'+path.basename(row.files[0]));
publicHtml=publicHtml.replaceAll('シャチマル','シオマント').replaceAll('タツノコ','ミナモリス');
fs.writeFileSync('gaon-zukan/index.html',publicHtml);
const versionFiles=['index.html',...fs.readdirSync('src').filter(n=>n.endsWith('.js')).map(n=>'src/'+n),...fs.readdirSync('tools').filter(n=>n.startsWith('verify')&&n.endsWith('.cjs')).map(n=>'tools/'+n)];
for(const file of versionFiles){const old=fs.readFileSync(file,'utf8'),next=old.replaceAll('20260908-training-v10','20260908-gaons-v11');if(old!==next)fs.writeFileSync(file,next);}
console.log('Integrated 29 redrawn species; rebuilt 153-entry evolution catalog');
