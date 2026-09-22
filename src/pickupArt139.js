const image=new Image();image.src=new URL('../assets/ghosts-v139/pickup-sparkle.png',import.meta.url).href;
// The renderer deliberately takes no item name: every drop looks identical.
export function drawPickup139(c,x,y,tick=0){if(!image.complete||!image.naturalWidth)return;c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=.65+.35*(.5+.5*Math.sin(tick/230));c.drawImage(image,Math.round(x),Math.round(y),32,32);c.restore();}
