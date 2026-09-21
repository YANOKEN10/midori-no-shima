// Tint only the material's pixels; preserve transparent gaps and its shading.
const pool=[];
export function tintMaterial115(c,color,x,y,w,h,paint){
 const pair=pool.pop()||[document.createElement('canvas'),document.createElement('canvas')];
 const [layer,mask]=pair;layer.width=mask.width=Math.ceil(w);layer.height=mask.height=Math.ceil(h);
 const l=layer.getContext('2d'),m=mask.getContext('2d');l.imageSmoothingEnabled=false;
 l.save();l.translate(-x,-y);paint(l);l.restore();m.drawImage(layer,0,0);
 l.globalCompositeOperation='color';l.fillStyle=color;l.fillRect(0,0,w,h);
 l.globalCompositeOperation='destination-in';l.drawImage(mask,0,0);
 c.imageSmoothingEnabled=false;c.drawImage(layer,x,y);pool.push(pair);return true;
}
