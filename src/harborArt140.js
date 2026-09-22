const images=new Map(['dock-floor140','rowboat140','yacht140'].map(key=>{const im=new Image();im.src=new URL('../assets/harbor-v140/'+key+'.png',import.meta.url).href;return[key,im];}));
export const harborReady140=()=>[...images.values()].every(im=>im.complete&&im.naturalWidth>0);
export function drawHarbor140(c,key,x,y,w=32,h=32){const im=images.get(key);if(!im)return false;if(im.complete&&im.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(im,x,y,w,h);}return true;}
