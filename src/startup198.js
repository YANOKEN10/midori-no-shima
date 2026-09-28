import {showStart169,failStart198} from './start169.js';
const params=new URLSearchParams(location.search);
if(!params.has('editorPreview72')&&!(/^(localhost|127.0.0.1)$/.test(location.hostname)&&params.has('v4test')))showStart169({loading:true});
import('./main.js').catch(error=>{console.error('[startup] failed to load game',error);failStart198();});
