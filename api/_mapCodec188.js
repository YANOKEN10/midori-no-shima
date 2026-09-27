// Lossless storage codec; the HTTP schema and optimistic version checks stay unchanged.
const {gzipSync,gunzipSync}=require('node:zlib');
function packPublished188(data){return {codec188:'gzip-json-v1',payload188:gzipSync(Buffer.from(JSON.stringify(data)),{level:6}).toString('base64')};}
function unpackPublished188(data){if(data?.codec188!=='gzip-json-v1')return data;return JSON.parse(gunzipSync(Buffer.from(data.payload188,'base64'),{maxOutputLength:64*1024*1024}).toString('utf8'));}
module.exports={packPublished188,unpackPublished188};
