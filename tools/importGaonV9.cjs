const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/voraz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const rows = JSON.parse(fs.readFileSync('docs/gaon-redesign-v9.json', 'utf8'));
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5179/gaon-zukan/');
    let count = 0;
    for (const row of rows) {
      if (!fs.existsSync(`work/redesign-v9-source/${row.index}.png`)) continue;
      const pair = await page.evaluate(async index => {
        const image = new Image();
        image.src = `/work/redesign-v9-source/${index}.png?t=${Date.now()}`;
        await image.decode();
        const results = [];
        for (let view = 0; view < 2; view++) {
          const c = document.createElement('canvas');
          c.width = Math.floor(image.width / 2); c.height = image.height;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(image, -view * c.width, 0);
          const data = ctx.getImageData(0, 0, c.width, c.height);
          const pixels = data.data;
          // Generated opaque sheets use a white matte; true alpha is retained.
          const opaqueMatte = pixels[3] === 255;
          if (opaqueMatte && index !== 22) {
            for(let i=0;i<pixels.length;i+=4){
              const min=Math.min(pixels[i],pixels[i+1],pixels[i+2]),max=Math.max(pixels[i],pixels[i+1],pixels[i+2]);
              if(min>237&&max-min<18)pixels[i+3]=0;
            }
          }
          if (opaqueMatte && index === 22) {
            const seen=new Uint8Array(c.width*c.height),queue=[];
            const add=(x,y)=>{
              const k=y*c.width+x,i=k*4;
              if(seen[k])return;
              const min=Math.min(pixels[i],pixels[i+1],pixels[i+2]);
              const max=Math.max(pixels[i],pixels[i+1],pixels[i+2]);
              if(min<=237||max-min>=18)return;
              seen[k]=1;queue.push(k);
            };
            for(let x=0;x<c.width;x++){add(x,0);add(x,c.height-1);}
            for(let y=0;y<c.height;y++){add(0,y);add(c.width-1,y);}
            for(let q=0;q<queue.length;q++){
              const k=queue[q],x=k%c.width,y=Math.floor(k/c.width);pixels[k*4+3]=0;
              if(x>0)add(x-1,y);if(x<c.width-1)add(x+1,y);
              if(y>0)add(x,y-1);if(y<c.height-1)add(x,y+1);
            }
          }
          let x0=c.width, y0=c.height, x1=-1, y1=-1;
          for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
            const i=(y*c.width+x)*4;
            if(pixels[i+3]<128){pixels[i+3]=0;continue;}
            pixels[i+3]=255;
            x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
          }
          if(x1<x0)throw Error('Empty sprite '+index);
          ctx.putImageData(data,0,0);
          const out=document.createElement('canvas');out.width=out.height=80;
          const oc=out.getContext('2d');oc.imageSmoothingEnabled=false;
          const w=x1-x0+1,h=y1-y0+1,scale=Math.min(74/w,74/h),dw=Math.round(w*scale),dh=Math.round(h*scale);
          oc.drawImage(c,x0,y0,w,h,Math.floor((80-dw)/2),77-dh,dw,dh);
          const target=oc.getImageData(0,0,80,80);
          for(let i=0;i<target.data.length;i+=4)if(target.data[i+3]){
            target.data[i+3]=255;
            for(let k=0;k<3;k++)target.data[i+k]=Math.min(255,Math.round(target.data[i+k]/12)*12);
          }
          oc.putImageData(target,0,0);
          results.push(out.toDataURL('image/png').split(',')[1]);
        }
        return results;
      }, row.index);
      pair.forEach((base64, view) => {
        const folder = `assets/monsters/redesign-v9/${view?'back':'front'}`;
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(path.join(folder, path.basename(row.files[view])), Buffer.from(base64, 'base64'));
        count++;
      });
    }
    console.log(`Imported ${count} transparent 80x80 front/back sprites`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
