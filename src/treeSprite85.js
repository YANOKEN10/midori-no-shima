// Fit artwork uniformly; collision cells never define the image's aspect ratio.
export function fitSprite85(c,image,x,y,w,h,rect){
 const [sx,sy,sw,sh]=rect||[0,0,image.naturalWidth||image.width,image.naturalHeight||image.height];
 if(!sw||!sh)return false;
 const scale=Math.min(w/sw,h/sh),dw=sw*scale,dh=sh*scale;
 c.imageSmoothingEnabled=false;c.drawImage(image,sx,sy,sw,sh,x+(w-dw)/2,y+h-dh,dw,dh);return true;
}
export const treeArt85=key=>/tree|fir|conifer|broadleaf|palm/i.test(key||'');
