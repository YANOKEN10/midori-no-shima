import {createCastle78} from './castle78.mjs';
import { buildChapterOne } from "./chapterOne.js";
export const MAPS = buildChapterOne();
export const START = { map: "hut", x: 7, y: 10, dir: "up" };

import {loadPublishedMaps} from '../mapRuntime72.js';
const adminHome=JSON.parse(JSON.stringify(MAPS.hut));adminHome.id='adminHouse72';adminHome.name='追加した家（共通室内）';adminHome.npcs=[];adminHome.items=[];adminHome.signs=[];adminHome.objects=[];adminHome.warps=[{x:7,y:11,to:'@back'}];MAPS.adminHouse72=adminHome;
MAPS.adminCastle78=createCastle78();
await loadPublishedMaps(MAPS);
