// Remove empty margins for the final metal evolution without redrawing its art.
const portraits=new WeakMap();
export function chromePortrait187(image){
 if(!image?.complete||!image.naturalWidth)return image;
 if(portraits.has(image))return portraits.get(image);
 const source=document.createElement('canvas');source.width=image.naturalWidth;source.height=image.naturalHeight;
 const g=source.getContext('2d');g.drawImage(image,0,0);
 const pixels=g.getImageData(0,0,source.width,source.height).data;
 let left=source.width,top=source.height,right=-1,bottom=-1;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(pixels[(y*source.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(right<left)return image;
 const output=document.createElement('canvas');output.width=192;output.height=192;
 const width=right-left+1,height=bottom-top+1,scale=Math.min(184/width,176/height),w=Math.round(width*scale),h=Math.round(height*scale),ctx=output.getContext('2d');
 ctx.imageSmoothingEnabled=false;ctx.drawImage(image,left,top,width,height,Math.floor((192-w)/2),188-h,w,h);
 portraits.set(image,output);return output;
}
