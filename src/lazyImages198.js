// Images are created only when their key is first used. Canvas receives a real Image.
export function lazyImages198(urls){const images={},loaded=new Map();for(const[key,url]of Object.entries(urls))Object.defineProperty(images,key,{enumerable:true,get(){if(!loaded.has(key)){const im=new Image();im.decoding='async';im.src=url;loaded.set(key,im);}return loaded.get(key);}});return images;}
