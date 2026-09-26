import {drawWaterfallTile173} from './waterfall173.js';
// Every visible waterfall cell is independently editable in Map Workshop.
export function drawWaterfalls84(c,map,camX=0,camY=0,tick=performance.now()){
 const props=[...(map.props||[]),...(map.editorAddedProps72||[])];c.save();c.translate(-camX,-camY);
 for(const t of map.editorGround72||[]){if(!t.material.startsWith('waterfall-')||t.color115||t.material.includes('rock'))continue;if(props.some(p=>t.x>=p.x&&t.x<p.x+p.w&&t.y>=p.y&&t.y<p.y+p.h))continue;if(t.turn81){c.save();c.translate(t.x*32+16,t.y*32+16);c.rotate(t.turn81*Math.PI/2);drawWaterfallTile173(c,t.material,-16,-16,tick);c.restore();}else drawWaterfallTile173(c,t.material,t.x*32,t.y*32,tick);}
 c.restore();}
