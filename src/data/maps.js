import {addMoveReminder92} from '../reminderPlacement92.mjs';
import {createCastle78} from './castle78.mjs';
import { buildChapterOne } from "./chapterOne.js";
export const MAPS = buildChapterOne();
export const START = { map: "hut", x: 7, y: 10, dir: "up" };

import {loadPublishedMaps} from '../mapRuntime72.js';
const adminHome=JSON.parse(JSON.stringify(MAPS.hut));adminHome.id='adminHouse72';adminHome.name='追加した家（共通室内）';adminHome.npcs=[];adminHome.items=[];adminHome.signs=[];adminHome.objects=[];adminHome.warps=[{x:7,y:11,to:'@back'}];MAPS.adminHouse72=adminHome;
MAPS.adminCastle78=createCastle78();
await loadPublishedMaps(MAPS);
const playerShop=JSON.parse(JSON.stringify(MAPS.adminHouse72));playerShop.id='playerShop79';playerShop.name='あなたのお店';playerShop.room.theme='shop';playerShop.npcs=[];playerShop.items=[];playerShop.signs=[];playerShop.editorAddedProps72=[];playerShop.editorAddedFurniture72=[];const shopGrid79=playerShop.rows.map(r=>[...r]);for(const [k,x,y,w,h]of playerShop.room.furniture)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)shopGrid79[yy][xx]='f';for(let xx=5;xx<10;xx++)shopGrid79[5][xx]='t';playerShop.rows=shopGrid79.map(r=>r.join(''));playerShop.editorVisualRows73=undefined;playerShop.room.furniture=[['counter',5,5,5,1],['shelf',3,4,2,1],['shelf',10,4,2,1]];MAPS.playerShop79=playerShop;
addMoveReminder92(MAPS);
