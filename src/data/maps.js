import {addDeenaGuide94} from '../deenaQuest94.mjs';
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
// Additional trainers keep existing NPC indices unchanged.
for(const [mapId,variant,name,sp]of [['route1',30,'山歩きの ダイチ','コケゴロ'],['rods',31,'おばあさんの ハナ','ラテット'],['route2',32,'こどもの ソラ','アワミィ'],['karat',33,'おじいさんの ゲン','コケゴロ']]){const m=MAPS[mapId];if(!m||m.editor72)continue;let spot;for(let y=4;y<m.rows.length-4&&!spot;y++)for(let x=4;x<m.rows[0].length-4;x++)if(['.',','].includes(m.rows[y][x])&&['.',','].includes(m.rows[y+1][x])&&![...m.npcs,...m.warps,...m.signs,...m.items||[]].some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3)&&!m.props.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y-1&&y<p.y+p.h+1)){spot={x,y};break;}if(spot)m.npcs.push({...spot,name,variant,dir:'down',noRoam:true,trainer:{party:[[sp,5]],money:350},talk:['ガオンといっしょに 勝負しよう！'],after:['また しょうぶしようね！']});}

addMoveReminder92(MAPS);

addDeenaGuide94(MAPS);

import {addTutorialPeople100} from '../tutorial100.mjs';
addTutorialPeople100(MAPS);
