import {seaFloor140} from './seaFloor140.mjs';
const cache203=new WeakMap();
// Painted sea can cover a retained, non-visible boundary collision tile.
// Shore decoration follows that visible sea, without changing map collisions.
export function shoreRows203(map){const rows=map.editorVisualRows73||map.rows,tiles=map.editorGround72||[];const old=cache203.get(map);if(old?.rows===rows&&old.tiles===tiles)return old.result;const water=tiles.filter(t=>seaFloor140(t.material)||['river','water173'].includes(t.material));const result=water.length?rows.map(r=>[...r]):rows;for(const t of water)if(result[t.y]?.[t.x]!==undefined)result[t.y][t.x]='W';const visible=water.length?result.map(r=>r.join('')):result;cache203.set(map,{rows,tiles,result:visible});return visible;}
