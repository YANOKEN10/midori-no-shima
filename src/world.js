import {servicePeople136} from './serviceLayouts136.mjs';
import {talkCells135} from './counterTalk135.mjs';
import {recoveryPoint126} from './recoveryPoint126.mjs';
import {enterRival122,refreshRival122,tickRival122,runRivalEvent122} from './rivalStory122.js';
import {walkWithFollower121,followerMood121,takeFollowerFind121,facingFollower121} from './followerBond121.mjs';
import {homeSignText117} from './homeSign117.mjs';
import {claimNpcGift111} from './npcSettings111.mjs';
import {tutorialNpc100} from './tutorial100.mjs';
import {landscape98} from './landscapeLayers98.mjs';
import {deenaReady94,deenaGuide94,recordDeenaVisit94} from './deenaQuest94.mjs';
import {openMoveReminder92} from './moveLearning92.mjs';
import {isTree83} from './treeFootprint83.mjs';
import {drawResources80} from './resource80.js';
import {economyMap79,drawLot79,miningTarget79,miningMenu79,ownShop79} from './economy79.js';
import {canTraverse75,climbAt75} from './elevation75.mjs';
import {drawRealtimeEnvironment,drawClockWeather} from './realtimeEnvironment68.js';
import {filterWild91,wildAvailable91} from './wildAvailability91.mjs';
import {waterEncounters,scheduledBattleOptions} from './scheduledEncounters62.js';
import {postgameCleared,refreshPostgame} from './postgame62.js';
import {areaBgm,musicArea} from './musicPolicy.js';
import {drawRoomStaff} from './roomAssets.js';
import {endNpc,refreshEnd,tickEnd,endStep} from './endgameStory.js';
import {endGate} from './endgameRules.js';
import {drawBoat,drawEden,drawEndWeather} from './endgameArt.js';
import {frontierNpc,refreshFrontier,tickFrontier} from './frontierStory.js';
import {frontierGate,rematchAvailable,markRematch,recordBirth} from './frontierRules.js';
import {drawFrontierWeather} from './frontierArt.js';
import {npcDialogue} from './npcDialogue.js';
import {daycareResidents,drawDaycareLabels} from './daycareResidents.js';
import {voyageNpc,refreshVoyageNpcs,tickVoyage} from './voyageStory.js';
import {drawVoyageOverlay,drawVoyageStatus} from './voyageArt.js';
import {playThunder} from './audio.js';
import {powerNpc,refreshPowerNpcs} from './powerStory.js';
import {powerGate,powerOutage} from './powerRules.js';
import {drawPowerAtmosphere} from './powerArt.js';
import {marineNpc,refreshMarineNpcs} from './marineStory.js';
import {marineGate} from './marineRules.js';
import {drawMarineAsset,drawMarineAtmosphere} from './marineArt.js';
import {drawItem} from './itemArt.js';
import {FollowerTrail} from './followerTrail.js';
import {drawFollower,followerDistance} from './followerArt.js';
import { ordinaryEncounters, rollRareEncounter, rareAreasUnlocked } from './rareEncounters.js';
import { drawNpc } from './npcArt.js?v=20260913-fashion-v50';
import { drawChapterMap, drawGrassFeet, drawEditorProp72 } from "./chapterArt.js";
import { chapterNpc, chapterTravelHint } from "./chapterStory.js";
// ============================================================
//  フィールド（まちや どうろを あるく ところ）
// ============================================================
import * as G from "./gfx.js";
import * as In from "./input.js";
import { ui } from "./ui.js";
import { beep, playBgm } from "./audio.js";
import { tileFor, solid } from "./tiles.js";
import { environmentTile } from "./environmentArt.js";
import { findHouses, houseImage } from "./props.js";
import { treeImage, TREE_W, TREE_UP } from "./trees.js";
import { MAPS } from "./data/maps.js?v=20260913-fashion-v50";
import { personFrames, personFramesRaw, LOOKS, styleOf } from "./data/charart.js";
import { playerColors, darker } from "./data/looks.js";
import { MONART } from "./data/monart.js";
import {
  G as State, followingMon, makeMon, species, monName, maxHp, healFull, healParty,
  addItem, addToParty, ownMon, setFlag, flag, rnd, chance, hasItem, useItem,
} from "./state.js";
import { startBattle, popEvolution, wait } from "./battle.js";
import { setMenuWorld, openMenu, shopMenu, showStatus, reportMenu, clothesShop, hairSalon } from "./menu.js";
import { saveLocal, saveCloud } from "./save.js";
import { cloud } from "./cloud.js";
import { compassEnabled, compassWaypoint } from "./compass.js";
import { drawTerrain, drawHero, drawRevampObject, drawRevampTree, drawTileDetail, drawWorldBackdrop } from "./revampArt.js?v=20260914-hero-v55";

const SPEED = 4;            // 1フレームに すすむ ドット
const T = G.TILE;

const charCache = new Map();
const npcScaleCache = new WeakMap();
let rawFrames = null;

// Remove transparent padding from NPC art and normalize the visible body to
// the same 30 x 46 content box used by buildHeroFrame().
function matchedNpcFrame(img) {
  if (npcScaleCache.has(img)) return npcScaleCache.get(img);
  const sw = img.naturalWidth || img.width, sh = img.naturalHeight || img.height;
  if (!sw || !sh) return img;
  const source = document.createElement("canvas"); source.width = sw; source.height = sh;
  const sc = source.getContext("2d", { willReadFrequently:true }); sc.drawImage(img, 0, 0);
  const pixels = sc.getImageData(0, 0, sw, sh).data;
  let minX=sw,minY=sh,maxX=-1,maxY=-1;
  for (let y=0;y<sh;y++) for (let x=0;x<sw;x++) {
    if (pixels[(y*sw+x)*4+3] > 8) { minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y); }
  }
  if (maxX < minX) return img;
  const bw=maxX-minX+1,bh=maxY-minY+1,scale=Math.min(30/bw,46/bh);
  const dw=Math.max(1,Math.round(bw*scale)),dh=Math.max(1,Math.round(bh*scale));
  const out=document.createElement("canvas");out.width=32;out.height=48;
  const oc=out.getContext("2d");oc.imageSmoothingEnabled=false;
  oc.drawImage(source,minX,minY,bw,bh,Math.floor((32-dw)/2),48-dh,dw,dh);
  npcScaleCache.set(img,out); return out;
}
function playerStyle() {
  const L = State.save.look || {};
  return { hair: L.hat || L.style || "short", bangs: L.bangs == null ? "seven" : L.bangs,
           skirt: Boolean(L.skirt), face: L.gender || (L.skirt ? "girl" : "boy") };
}
function playerFrames() { return personFramesRaw(playerStyle()); }
function framesFor(look) {
  if (!charCache.has(look)) charCache.set(look, personFrames(LOOKS[look] || LOOKS.boy, styleOf(look)));
  return charCache.get(look);
}
// NPC ごとの かみがた（地図で していが あれば それを つかう）
function npcStyle(n) {
  const base = styleOf(n.look);
  return {
    hair: n.hair || base.hair,
    bangs: n.bangs == null ? base.bangs : n.bangs,
    skirt: n.skirt == null ? base.skirt : Boolean(n.skirt),
    coat: base.coat, face: base.face,
  };
}
function npcKey(n) { const s = npcStyle(n); return s.hair + s.bangs + (s.skirt ? "s" : ""); }

// ひとの いろ（かげの 色も 作る）
const lookColorCache = new Map();
function colorsFor(look) {
  if (lookColorCache.has(look)) return lookColorCache.get(look);
  const pal = G.resolve(look) || G.resolve("boy");
  const L = LOOKS[look] || LOOKS.boy;
  const c = {
    K: pal[L.K], S: pal[L.S], P: pal[L.P], H: pal[L.H], "3": pal[3], w: "#ffffff", T: "#e3c281", C: "#f4f6f8",
    k: darker(pal[L.K], 0.18), s: darker(pal[L.S]), p: darker(pal[L.P]), h: darker(pal[L.H], 0.32), t: darker("#e3c281"), c: "#ccd3da",
  };
  lookColorCache.set(look, c);
  return c;
}
G.onPaletteChange(() => lookColorCache.clear());

const SOLID_LANDMARKS = new Set([
  "alpineCabin","alpineLodge","alpineBoathouse","alpineWorkshop","alpineHerbalist",
  "alpineSnowChalet","alpineRailStation","alpineObservatory"
]);
function landmarkBlocked(map, x, y) {
  if (map.fullArt) return false; // 一枚絵は専用衝突マスクのみを使う。
  if ((map.warps || []).some((w) => w.x === x && w.y === y)) return false;
  return (map.landmarks || []).some((lm) => {
    if (!SOLID_LANDMARKS.has(lm.art)) return false;
    const w=lm.w||4,h=lm.h||4;
    if (x < lm.x || x >= lm.x+w || y < lm.y || y >= lm.y+h) return false;
    return !(y === lm.y+h-1 && x === lm.x+Math.floor(w/2));
  });
}
export const world = {
  mapId: "", map: null,
  x: 0, y: 0, dir: "down",
  ox: 0, oy: 0, moving: false, mx: 0, my: 0,
  walkFrame: 0, walkTimer: 0, hop: 0,
  busy: false, steps: 0, tick: 0,
  npcs: [], followerTrail: new FollowerTrail(), humanTrail: new FollowerTrail(),

  enter(mapId, x, y, dir) {
    const rivalFrom122=this.mapId;
    this.facilityEntry123=false;this.turnWait126=0;
    setMenuWorld(this);
    // しらない ばしょ（ふるい きろく など）なら むらへ もどす
    if (!MAPS[mapId]) { mapId = "village"; x = 7; y = 6; }
    this.cameraFocus = null;
    this.coldMs=0;
    if(!(State.save.boating&&State.save.where?.map===mapId&&MAPS[mapId]?.boatWater&&MAPS[mapId]?.rows[y]?.[x]==="W"))State.save.boating=false;
    State.save.bgmArea = musicArea(MAPS,mapId,State.save);
    this.mapId = mapId;
    this.map = servicePeople136(MAPS[mapId],State.save.backTo?.map||'village');
    this.map=economyMap79(this.map,State.save);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      x = this.map.spawn?.x ?? 1; y = this.map.spawn?.y ?? 1;
    }
    if (this.map.freeMove && (tileAt(this.map, Math.floor(x), Math.floor(y)) == null || solid(tileAt(this.map, Math.floor(x), Math.floor(y))))) {
      x = this.map.spawn.x; y = this.map.spawn.y;
    }
    // ばんのため：とおれない マスに 出ないよう、ちかくの あるける マスへ
    if ((solid(tileAt(this.map, x, y)) && !(State.save.boating&&this.map.boatWater&&tileAt(this.map,x,y)==="W")) || tileAt(this.map, x, y) === null || landmarkBlocked(this.map, x, y)) {
      let found = null;
      for (let r = 1; r <= 4 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            const c = tileAt(this.map, x + dx, y + dy);
            if (c !== null && !solid(c) && c !== "L" && !landmarkBlocked(this.map, x + dx, y + dy)) found = [x + dx, y + dy];
          }
        }
      }
      // Redesigned rooms may cover an old save position with a wide wall.
      if(!found&&this.map.explorationDesign){let distance=Infinity;for(let yy=0;yy<this.map.rows.length;yy++)for(let xx=0;xx<this.map.rows[yy].length;xx++){const c=tileAt(this.map,xx,yy),d=Math.abs(xx-x)+Math.abs(yy-y);if(d<distance&&c!==null&&!solid(c)&&c!=='L'&&!landmarkBlocked(this.map,xx,yy)&&!this.map.npcs.some(n=>n.x===xx&&n.y===yy)){found=[xx,yy];distance=d;}}}
      if (found) { x = found[0]; y = found[1]; }
    }
    if (this.map.tileWorld) { x=Math.round(x); y=Math.round(y); }
    this.x = x; this.y = y;
    this.fx = x; this.fy = y;
    this.freeCellX = Math.floor(x); this.freeCellY = Math.floor(y);
    if (dir) this.dir = dir;
    this.ox = this.oy = 0;
    this.moving = false;
    this.npcs = (this.map.npcs || []).map((n, i) => Object.assign({}, n, {
      idx: i, gone: Boolean(n.hideFlag && flag(n.hideFlag)), ox: 0, oy: 0, homeX: n.x, homeY: n.y,
      roamWait: 900 + i * 370, moving: false, walkFrame: 0,
    }));
    refreshMarineNpcs(this);refreshPowerNpcs(this);refreshVoyageNpcs(this);refreshFrontier(this);refreshEnd(this);refreshPostgame(this,State.save);
    // Saved tile origins can overlap a wall with the walking footprint.
    // Validate using exactly the same collision test as movement, including NPCs.
    if (this.map.freeMove && !this.canFreeStand(x, y)) {
      const candidates = [];
      for (let cy = 0; cy < this.map.rows.length; cy++) {
        for (let cx = 0; cx < this.map.rows[cy].length; cx++) {
          const sx = cx + .5, sy = cy + .5;
          if (this.canFreeStand(sx, sy)) candidates.push({ x: sx, y: sy, d: Math.hypot(sx - x, sy - y) });
        }
      }
      candidates.sort((a, b) => a.d - b.d);
      if (candidates.length) {
        x = candidates[0].x; y = candidates[0].y;
        this.x = this.fx = x; this.y = this.fy = y;
        this.freeCellX = Math.floor(x); this.freeCellY = Math.floor(y);
      }
    }
    this.followerTrail.reset(x,y,this.dir);this.humanTrail.reset(x,y,this.dir);
    State.save.where = { map: mapId, x: x, y: y, dir: this.dir };
    this.showName = this.map.kind === "in" ? 0 : 2200;
    enterRival122(this,rivalFrom122);
    playBgm(bgmFor(mapId));
  },

  rivalCanStand122(x,y,n){return tileAt(this.map,x,y)!=null&&!solid(tileAt(this.map,x,y))&&!landmarkBlocked(this.map,x,y)&&!this.npcs.some(p=>p!==n&&!p.gone&&Math.hypot(p.x-x,p.y-y)<.8);},
  resumeBgm(){playBgm(bgmFor(this.mapId));},

  update(dt) {
    this.tick += dt;
    if(!this.busy&&!ui.busy){const step94=recordDeenaVisit94(State.save,this.mapId);if(step94){State.dirty=true;saveLocal();this.busy=true;ui.say([step94.name+'に '+step94.type+'の光が共鳴した！','虹の調査が ひとつ進んだ。']).finally(()=>{this.busy=false;});}}
    if(!this.busy){refreshMarineNpcs(this);refreshPowerNpcs(this);refreshVoyageNpcs(this);refreshFrontier(this);refreshEnd(this);refreshPostgame(this,State.save);}
    if(this.mapId==='raden'&&powerOutage(State.save)&&this.tick-(this.lastThunder||0)>7300){this.lastThunder=this.tick;playThunder();}
    if (this.showName > 0) this.showName -= dt;
    ui.update(dt);
    if(!this.busy)refreshRival122(this);
    if(tickRival122(this)||tickEnd(this,dt))return;
    if ((this.map.freeMove || this.map.tileWorld) && !ui.busy && !this.busy) this.updateNpcRoam(dt);
    if (ui.busy || this.busy) return;
    if(tickFrontier(this)||tickVoyage(this))return;

    if (In.hit("start")) { this.busy = true; openMenu().then(() => { this.busy = false; }); return; }

    if (this.map.freeMove) {
      if (In.hit("a")) { this.interact(); return; }
      this.updateFree(dt); return;
    }

    if (this.moving) {
      const sp = SPEED * Math.min(dt,50)/(1000/60) * (this.mapId==="blizzard"?.35+.65*this.y/this.map.rows.length:1) * (this.hop ? 1.5 : 1);
      if (this.dir === "left") this.ox -= sp;
      if (this.dir === "right") this.ox += sp;
      if (this.dir === "up") this.oy -= sp;
      if (this.dir === "down") this.oy += sp;
      this.walkTimer += dt;
      if (this.walkTimer > 110) { this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 4; }

      const goalX = (this.mx - this.x) * T, goalY = (this.my - this.y) * T;
      if (Math.abs(this.ox) >= Math.abs(goalX) && Math.abs(this.oy) >= Math.abs(goalY)) {
        this.x = this.mx; this.y = this.my;
        this.ox = this.oy = 0;
        this.moving = false;
        this.hop = 0;
        const stepMap=this.mapId;
        this.afterStep().then(()=>{if(this.busy||ui.busy||this.mapId!==stepMap)return;const d=['up','down','left','right'].find(d=>In.isDown(d));if(d&&d===this.dir)this.tryStep(d);});
      }
      return;
    }

    if (In.hit("a")) { this.interact(); return; }

    const d = In.isDown("up") ? "up" : In.isDown("down") ? "down" : In.isDown("left") ? "left" : In.isDown("right") ? "right" : "";
    if (d) {
      if (this.dir !== d) { this.dir = d; this.walkTimer = 0; this.walkFrame=0;this.turnWait126=140;return; }
      if(this.turnWait126>0){this.turnWait126-=dt;return;}
      this.tryStep(d);
    } else {
      this.turnWait126=0;this.walkFrame = 0;
    }
  },

  updateFree(dt) {
    const move = In.movementVector();
    if (!move.x && !move.y) { this.moving = false; this.walkFrame = 0;this.turnWait126=0; return; }
    const length = Math.hypot(move.x, move.y) || 1;
    const vx = move.x / length, vy = move.y / length;
    const distance = Math.min(0.18, dt * (climbAt75(this.map,this.fx,this.fy)?.kind==='ladder'?0.0032:0.0062));
    const nextDir=Math.abs(vx)>Math.abs(vy)?(vx<0?'left':'right'):(vy<0?'up':'down');
    if(this.dir!==nextDir){this.dir=nextDir;this.moving=false;this.walkFrame=0;this.turnWait126=140;return;}
    if(this.turnWait126>0){this.turnWait126-=dt;this.moving=false;return;}

    const oldFx121=this.fx,oldFy121=this.fy;
    let nx = this.fx + vx * distance, ny = this.fy + vy * distance;
    // 壁沿いで止まり過ぎないよう、X/Yを分離して滑らせる。
    if (canTraverse75(this.map,this.fx,this.fy,nx,this.fy)&&this.canFreeStand(nx, this.fy)) this.fx = nx;
    if (canTraverse75(this.map,this.fx,this.fy,this.fx,ny)&&this.canFreeStand(this.fx, ny)) this.fy = ny;
    this.x = this.fx; this.y = this.fy;
    if(!State.save.boating&&walkWithFollower121(followingMon(),Math.hypot(this.fx-oldFx121,this.fy-oldFy121))){State.dirty=true;saveLocal();}
    this.ox = this.oy = 0;
    this.moving = true;
    this.walkTimer += dt;
    if (this.walkTimer > 110) { this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 4; }
    State.save.where = { map: this.mapId, x: this.x, y: this.y, dir: this.dir };

    const wp = (this.map.warps || []).find((w) => Math.abs(w.x - this.fx) < 0.38 && Math.abs(w.y - this.fy) < 0.38);
    if (wp && !this.busy) { this.busy = true; this.doWarp(wp).finally(() => { this.busy = false; }); return; }

    const cellX = Math.floor(this.fx), cellY = Math.floor(this.fy);
    if (cellX !== this.freeCellX || cellY !== this.freeCellY) {
      this.freeCellX = cellX; this.freeCellY = cellY;
      State.save.steps = (State.save.steps || 0) + 1;
    recordBirth(State.save);
      if(State.save.daycare)saveLocal();
      const ch = tileAt(this.map, cellX, cellY);
      // 野生ガオンは「濃い草むら (")」に足を踏み入れた時だけ出現する。
      if (ch === '"' && this.map.enc && chance(this.map.enc.rate / 100) && !this.busy) {
        this.wildBattle();
      }
    }
  },

  updateNpcRoam(dt) {
    const dirs = [[0,-1,"up"],[0,1,"down"],[-1,0,"left"],[1,0,"right"]];
    for (const n of this.npcs) {
      if (n.gone || n.noRoam || (n.artMon&&!n.roamMon)) continue;
      if (n.moving) {
        n.roamProgress = Math.min(1, n.roamProgress + dt / 650);
        n.ox = (n.toX - n.x) * T * n.roamProgress;
        n.oy = (n.toY - n.y) * T * n.roamProgress;
        n.walkFrame = Math.floor(n.roamProgress * 4) % 4;
        if (n.roamProgress >= 1) {
          n.x=n.toX; n.y=n.toY; n.ox=n.oy=0; n.moving=false;
          n.roamWait=900+Math.random()*2600;
        }
        continue;
      }
      n.roamWait -= dt;
      if (n.roamWait > 0) continue;
      n.roamWait=700+Math.random()*2000;
      if (Math.random()<.3) continue;
      const owner=n.followOwner!==undefined?this.npcs[n.followOwner]:null;
      if(owner&&Math.hypot(owner.x-n.x,owner.y-n.y)<=2.2)continue;
      let nextDirection=null;
      if(owner){const queue=[{x:n.x,y:n.y,first:null}],seen=new Set([n.x+','+n.y]);for(let i=0;i<queue.length&&!nextDirection;i++){const at=queue[i];if(at.first&&Math.hypot(at.x-owner.x,at.y-owner.y)<=2.2){nextDirection=at.first;break;}for(const d of dirs){const x=at.x+d[0],y=at.y+d[1],key=x+','+y,ch=tileAt(this.map,x,y);if(!canTraverse75(this.map,at.x,at.y,x,y)||seen.has(key)||ch==null||solid(ch)||ch==='L'||landmarkBlocked(this.map,x,y)||this.npcs.some(o=>o!==n&&!o.gone&&((o.x===x&&o.y===y)||(o.moving&&o.toX===x&&o.toY===y)))||Math.hypot(this.x-x,this.y-y)<.85||(this.map.warps||[]).some(w=>Math.abs(w.x-x)+Math.abs(w.y-y)<=1))continue;seen.add(key);queue.push({x,y,first:at.first||d});}}if(!nextDirection)continue;}
      const d=nextDirection||dirs[Math.floor(Math.random()*dirs.length)];
      const tx=n.x+d[0],ty=n.y+d[1],ch=tileAt(this.map,tx,ty);
      n.dir=d[2];
      const occupied=this.npcs.some(o=>o!==n&&!o.gone&&((o.x===tx&&o.y===ty)||(o.moving&&o.toX===tx&&o.toY===ty)));
      const player=Math.hypot(this.x+(this.ox||0)/T-tx,this.y+(this.oy||0)/T-ty)<.85||(this.moving&&this.mx===tx&&this.my===ty);
      const special=[...(this.map.warps||[]),...(this.map.signs||[])].some(o=>Math.abs(o.x-tx)+Math.abs(o.y-ty)<=1);
      const outsideBounds=n.roamBounds&&(tx<n.roamBounds[0]||ty<n.roamBounds[1]||tx>n.roamBounds[2]||ty>n.roamBounds[3]);
      if (!canTraverse75(this.map,n.x,n.y,tx,ty) || outsideBounds || (!owner&&Math.hypot(tx-n.homeX,ty-n.homeY)>2) || player || occupied || special || ch==null || solid(ch) || ch==='L' || landmarkBlocked(this.map,tx,ty)) continue;
      n.toX=tx;n.toY=ty;n.roamProgress=0;n.moving=true;
    }
  },

  canFreeStand(x, y) {
    const foot = [[0,0],[-.22,-.08],[.22,-.08],[-.2,.18],[.2,.18]];
    for (const [ox, oy] of foot) {
      const ch = tileAt(this.map, Math.floor(x + ox), Math.floor(y + oy));
      if (ch == null || solid(ch) || ch === "L") return false;
    }
    return !this.npcs.some((n) => !n.gone && (Math.hypot(n.x+(n.ox||0)/T-x,n.y+(n.oy||0)/T-y)<.72||(n.moving&&Math.hypot(n.toX-x,n.toY-y)<.72)));
  },

  /* --- あるく ------------------------------------------------- */
  tryStep(d) {
    const dx = d === "left" ? -1 : d === "right" ? 1 : 0;
    const dy = d === "up" ? -1 : d === "down" ? 1 : 0;
    const nx = this.x + dx, ny = this.y + dy;
    const ch = tileAt(this.map, nx, ny);

    if (ch === null||!canTraverse75(this.map,this.x,this.y,nx,ny)) return;
    // がけは 下へ とびおりるだけ
    if (ch === "L") {
      if (d !== "down") return;
      this.mx = nx; this.my = ny + 1;
      this.moving = true; this.hop = 1;
      beep("blip");
      return;
    }
    if ((solid(ch)&&!(State.save.boating&&this.map.boatWater&&ch==="W")) || landmarkBlocked(this.map, nx, ny)) return;
    if (this.npcAt(nx, ny)) return;
    this.previousTile={x:this.x,y:this.y};
    this.mx = nx; this.my = ny;
    this.moving = true;
  },

  npcAt(x, y) {
    return this.npcs.find((n) => !n.gone && !(n.eden&&State.save.flags["end:eden"]) && (this.map.freeMove
      ? (Math.hypot(n.x+(n.ox||0)/T-x,n.y+(n.oy||0)/T-y)<.72||(n.moving&&Math.hypot(n.toX-x,n.toY-y)<.72))
      : (n.x === x && n.y === y) || (n.moving && n.toX === x && n.toY === y)));
  },

  async afterStep() {
    if(!State.save.boating&&walkWithFollower121(followingMon(),1)){State.dirty=true;saveLocal();}
    endStep(this,this.previousTile);
    State.save.where = { map: this.mapId, x: this.x, y: this.y, dir: this.dir };
    State.save.steps = (State.save.steps || 0) + 1;
    recordBirth(State.save);
    if(State.save.daycare)saveLocal();

    // ワープ
    const wp = (this.map.warps || []).find((w) => w.x === this.x && w.y === this.y);
    if (wp) { await this.doWarp(wp); return; }

    if (this.map.tileWorld) {
      const legend=this.npcs.find(n=>n.script==="v5:latett"&&!n.gone);
      if(legend&&flag("v5:heardLatett")&&Math.abs(this.x-legend.x)+Math.abs(this.y-legend.y)<=3){this.busy=true;try{await chapterNpc(this,legend);}finally{this.busy=false;}return;}
    }
    // トレーナーに 見つかる
    const t = this.spotter();
    if (t) { await this.trainerSpot(t); return; }

    // The rare tile roll is direct (1% / 3%), independent of ordinary grass odds.
    const rare=this.map.encountersConfigured86?null:rollRareEncounter(State.save,this.mapId,this.x,this.y);
    if(rare){await this.wildBattle(rare);return;}
    // やせいの モンスター
    const ch = tileAt(this.map, this.x, this.y);
    const enc = this.map.enc;
    if ((State.save.boating&&ch==='W') || enc && (ch === '"' || enc.encAll || (this.map.kind === "cave" && ch === "C"))) {
      if (chance((enc?.rate||18) / 100)) await this.wildBattle();
    }
  },

  async doWarp(wp) {
    this.busy = true;
    if(wp.requires==="v11:forestCleared"&&rareAreasUnlocked(State.save))setFlag("v11:forestCleared");
    const marineLock=endGate(wp,State.save)||frontierGate(wp,State.save)||marineGate(wp,State.save)||powerGate(wp,State.save);
    if(marineLock){await ui.say(marineLock);this.busy=false;return;}
    if(wp.requires&&!wp.requires.startsWith("marine:")&&!wp.requires.startsWith("power:")&&!wp.requires.startsWith("frontier:")&&!wp.requires.startsWith("end:")&&!flag(wp.requires)){
      const lines=wp.requires==="v11:forestCleared"?["森の3人の トレーナーに 勝ってから", "この先の 聖域を 探索しよう。"]:chapterTravelHint();
      await ui.say(lines);this.busy=false;return;
    }
    beep("warp");
    const enteringBuilding = this.map && this.map.kind === "out" && this.map.freeMove && !wp.edge && wp.to !== "@back";
    if (enteringBuilding) {
      // 玄関の奥へ歩き、戸口に隠れてから暗転する。
      this.dir = "up"; this.moving = true;
      for (let i = 1; i <= 7; i++) {
        this.fy -= 0.055;
        this.y = this.fy;
        this.walkFrame = i % 4;
        this.doorFade = Math.max(0, (i - 3) / 4);
        await wait(36);
      }
    } else {
      this.doorFade = 1;
      await wait(150);
    }
    if (wp.to === "@back") {
      let b = State.save.backTo || { map: "village", x: 7, y: 6 };
      if(MAPS[b.map]?.editor72){const entrances=MAPS[b.map].warps.filter(w=>w.to===this.mapId&&w.back);const entry=entrances.find(w=>b.editorDoorId72&&w.back.editorDoorId72===b.editorDoorId72)||(entrances.length===1?entrances[0]:null);if(entry)b=entry.back;}
      this.enter(b.map, b.x, b.y, "down");
    } else {
      if (wp.back) State.save.backTo = wp.back;
      this.enter(wp.to, wp.tx, wp.ty, wp.arrivalDir || (wp.edge ? this.dir : "down"));
    }
    for (let i = 5; i >= 0; i--) {
      this.doorFade = i / 5;
      await wait(32);
    }
    this.doorFade = 0;
    saveLocal();
    this.busy = false;
  },

  // 4マス さきまで 見ている トレーナー
  spotter() {
    if (!State.save.party?.some(m=>m&&m.hp>0)) return null;
    for (const n of this.npcs) {
      if (!n.trainer || n.gone || n.moving) continue;
      if (flag("beat:" + this.mapId + ":" + n.idx)) continue;
      const dx = this.x - n.x, dy = this.y - n.y;
      const face = n.dir;
      let ok = false, dist = 0;
      if (face === "down" && dx === 0 && dy > 0 && dy <= 4) { ok = true; dist = dy; }
      if (face === "up" && dx === 0 && dy < 0 && dy >= -4) { ok = true; dist = -dy; }
      if (face === "right" && dy === 0 && dx > 0 && dx <= 4) { ok = true; dist = dx; }
      if (face === "left" && dy === 0 && dx < 0 && dx >= -4) { ok = true; dist = -dx; }
      if (!ok) continue;
      // あいだに かべが ないか
      let clear = true;
      for (let i = 1; i < dist; i++) {
        const cx = n.x + (face === "right" ? i : face === "left" ? -i : 0);
        const cy = n.y + (face === "down" ? i : face === "up" ? -i : 0);
        if (!this.trainerCanStep126(n,cx,cy,cx-(face==='right'?1:face==='left'?-1:0),cy-(face==='down'?1:face==='up'?-1:0))) { clear = false; break; }
      }
      if (clear) return n;
    }
    return null;
  },

  trainerCanStep126(n,x,y,fromX=n.x,fromY=n.y) {
    const ch=tileAt(this.map,x,y);
    return ch!==null&&!solid(ch)&&ch!=='L'&&!landmarkBlocked(this.map,x,y)
      &&canTraverse75(this.map,fromX,fromY,x,y)
      &&!this.npcs.some(o=>o!==n&&!o.gone&&((o.x===x&&o.y===y)||(o.moving&&o.toX===x&&o.toY===y)));
  },

  async trainerSpot(n) {
    if(this.busy||!State.save.party?.some(m=>m&&m.hp>0))return;
    const map=this.map;
    this.busy=true;
    try {
      n.alert=900;beep('ok');await wait(700);n.alert=0;
      const [dx,dy]=({down:[0,1],up:[0,-1],right:[1,0],left:[-1,0]})[n.dir];
      while(Math.abs(this.x-n.x)+Math.abs(this.y-n.y)>1){
        if(this.map!==map||!State.save.party?.some(m=>m&&m.hp>0))return;
        const tx=n.x+dx,ty=n.y+dy;
        if(!this.trainerCanStep126(n,tx,ty))return;
        n.toX=tx;n.toY=ty;n.moving=true;
        // Animate offsets while dialogue/input is paused; commit only a completed step.
        for(let frame=1;frame<=24;frame++){
          await wait(16);
          if(this.map!==map)return;
          n.roamProgress=frame/24;n.ox=dx*T*frame/24;n.oy=dy*T*frame/24;
          n.walkFrame=Math.floor(frame/6)%4;
        }
        n.x=tx;n.y=ty;n.ox=n.oy=0;
      }
      n.moving=false;n.walkFrame=0;
      if(this.map===map&&State.save.party?.some(m=>m&&m.hp>0))await this.runNpc(n);
    } finally {
      n.alert=0;n.moving=false;n.ox=n.oy=0;n.walkFrame=0;n.roamProgress=0;n.roamWait=2200;
      this.busy=false;
    }
  },

  /* --- はなす・しらべる --------------------------------------- */
  interact() {
    const facing=({up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]})[this.dir];
    const companion=this.npcs.find(n=>n.eden&&!n.gone&&Math.hypot(n.x-this.x-facing[0],n.y-this.y-facing[1])<.8);
    if(companion&&State.save.flags["end:eden"]){this.busy=true;endNpc(this,companion).finally(()=>this.busy=false);return;}
    const dx = this.dir === "left" ? -1 : this.dir === "right" ? 1 : 0;
    const dy = this.dir === "up" ? -1 : this.dir === "down" ? 1 : 0;
    const tx = Math.round(this.x + dx), ty = Math.round(this.y + dy);

    if(this.mapId==='playerShop79'&&ty<=7){this.busy=true;ownShop79(State.save.backTo?.map).finally(()=>this.busy=false);return;}
    const mine=miningTarget79(this.map,tx,ty);if(mine){this.busy=true;miningMenu79(this,mine).finally(()=>this.busy=false);return;}
    const n = talkCells135(this.map,Math.round(this.x),Math.round(this.y),dx,dy).map(([x,y])=>this.npcAt(x,y)).find(Boolean);
    if (n) { n.moving=false;n.ox=n.oy=0;n.roamWait=2200;n.dir=({up:"down",down:"up",left:"right",right:"left"})[this.dir];this.busy = true; this.runNpc(n).then(() => { this.busy = false; }); return; }

    const it = (this.map.items || []).find((i) => i.x === tx && i.y === ty && !flag(i.flag));
    if (it) { this.busy = true; this.pickItem(it).then(() => { this.busy = false; }); return; }

    const sg = (this.map.signs || []).find((s) => s.x === tx && s.y === ty);
    if (sg) { this.busy = true; ui.say(homeSignText117(sg,State.save.name)).then(() => { this.busy = false; }); return; }

    const ob = (this.map.objects || []).find((o) => o.x === tx && o.y === ty);
    if (ob) {
      this.busy = true;
      (async () => {
        await ui.say(ob.text);
        if (ob.pc) await reportMenu();
      })().then(() => { this.busy = false; });
      return;
    }
    const follower121=followingMon(),pose121=this.followerTrail.pose;
    if(!State.save.boating&&follower121&&facingFollower121(this.x,this.y,this.dir,pose121,this.followerTrail.distance)){
      const clear=[.25,.5,.75].every(t=>{const x=this.x+(pose121.x-this.x)*t,y=this.y+(pose121.y-this.y)*t;return !solid(tileAt(this.map,Math.round(x),Math.round(y)))&&!landmarkBlocked(this.map,Math.round(x),Math.round(y));});
      if(clear){this.talkFollower121(follower121);return;}
    }
  },

  async talkFollower121(mon){
    this.busy=true;this.followerChat121=true;const pose=this.followerTrail.pose;if(pose){pose.dir=({up:'down',down:'up',left:'right',right:'left'})[this.dir];pose.moving=false;}
    try{const mood=followerMood121(mon,maxHp(mon));this.followerJoy121=mood.happy?this.tick+2400:0;await ui.say(mood.lines);const found=takeFollowerFind121(mon,State.save.bag);if(found){State.dirty=true;saveLocal();beep('ok');await ui.say([monName(mon)+'が 何かを くわえている！',found+'を 1個 もらった！']);}State.dirty=true;saveLocal();}finally{this.followerChat121=false;this.busy=false;}
  },

  async pickItem(it) {
    beep("ok");
    addItem(it.item);
    setFlag(it.flag);
    await ui.say([State.save.name + "は " + it.item + "を みつけた！"]);
    saveLocal();
  },

  async runNpc(n) {const old=ui.speaker;ui.speaker=n.displayName||n.name||null;try{const result=await this.runNpcContent(n);if(!n.trainer||flag('beat:'+this.mapId+':'+n.idx)){const gift=claimNpcGift111(State.save,this.mapId,n);if(gift){State.dirty=true;saveLocal();if(cloud.signedIn)saveCloud(true);await ui.say([gift.item+'を '+gift.count+'個 もらった！']);}}return result;}finally{ui.speaker=old;}},
  async runNpcContent(n) {
    if(n.script?.startsWith('facility123:'))return endNpc(this,n);
    if(n.script?.startsWith('rival122:')){await runRivalEvent122(this,n);return;}
    if(await tutorialNpc100(n,State.save,ui,()=>{State.dirty=true;saveLocal();}))return;
    if(n.script==='post:deenaGuide94'){await deenaGuide94(State.save,ui,()=>{State.dirty=true;saveLocal();});return;}
    if(n.script==='move:reminder92'){await openMoveReminder92(State.save,ui,()=>{State.dirty=true;saveLocal();});return;}
    if(n.script==='post:deena'){
      if(!deenaReady94(State.save))return;
      if(!await ui.ask(['Lv.80の ディーナに 挑みますか？']))return;
      const result=await startBattle({wild:makeMon('ディーナ',80)});
      if(result==='caught'){setFlag('post:deenaCaught');n.gone=true;}
      if(result==='lose'){await this.blackout();return;}
      await this.checkEvolution();playBgm(bgmFor(this.mapId));saveLocal();return;
    }
    if(n.script?.startsWith("end:")){await endNpc(this,n);return;}
    if(n.script==="v5:professor"&&State.save.dexOwn["ラテット"]){await endNpc(this,{...n,script:"end:professor"});return;}
    // むきを こちらへ
    if (!n.trainer) {
      if (this.dir === "up") n.dir = "down";
      else if (this.dir === "down") n.dir = "up";
      else if (this.dir === "left") n.dir = "right";
      else n.dir = "left";
    }

    const beatKey = "beat:" + this.mapId + ":" + n.idx;

    /* --- ものがたりの イベント --- */
    if(n.script?.startsWith("frontier:")){await frontierNpc(this,n);return;}
    if(n.script?.startsWith("voyage:")){await voyageNpc(this,n);return;}
    if(n.script?.startsWith("power:")){await powerNpc(this,n);return;}
    if(n.script?.startsWith("marine:")){await marineNpc(this,n);return;}
    if (n.script?.startsWith("v5:")) { await chapterNpc(this,n); return; }
    if (n.script === "mother") { await this.motherEvent(n); return; }
    if (n.script === "elder") { await this.elderEvent(n); return; }
    if (n.script === "latette") { await this.latetteEvent(n); return; }
    if (n.script === "gate") { await this.gateEvent(n); return; }
    if (n.script === "legend") { await this.legendEvent(n); return; }
    if (n.script === "entry") { await this.entryEvent(n); return; }
    if (n.script === "tournament") { await this.tournamentEvent(n); return; }

    const ordinary=n.trainer&&!n.trainer.leader&&!n.trainer.major&&!n.trainer.champ;
    let rematch=false;
    if(ordinary&&flag(beatKey)&&rematchAvailable(State.save,beatKey))rematch=await ui.ask([npcDialogue(State.save,this.mapId,n,"after",n.after||["また会えたね！"])[0],"もう一度 バトルしない？"]);
    if (n.trainer && (!flag(beatKey)||rematch)) {
      if(!State.save.party.length){await ui.say(["まずは 草むらで ガオンをつかまえよう。","仲間ができたら しょうぶしよう！"]);return;}
      State.save.battleTerrain="grass";
      await ui.say(npcDialogue(State.save,this.mapId,n,"talk",n.talk || ["しょうぶだ！"]));
      const res = await startBattle({ trainer: Object.assign({}, n.trainer, { name: n.displayName||n.name, originalName80:n.name, appearance79:{name:n.name,variant:n.variant,look:n.look,script:n.script} }) });
      if (res === "lose") { await this.blackout(); return; }
      setFlag(beatKey);
      if(ordinary)markRematch(State.save,beatKey);
      await ui.say(npcDialogue(State.save,this.mapId,n,"win",n.win || ["やるな！"]));
      if (n.trainer.leader) {
        const em = n.trainer.leader;
        if (State.save.badges.indexOf(em) < 0) State.save.badges.push(em);
        addItem(em);
        beep("levelup");
        await ui.say([State.save.name + "は " + em + "を てにいれた！",
                      "エンブレム " + State.save.badges.length + "こめ！"]);
      }
      if (n.after) await ui.say(npcDialogue(State.save,this.mapId,n,"after",n.after));
      await this.checkEvolution();
      saveLocal();
      if (cloud.signedIn) saveCloud(true);
      playBgm(bgmFor(this.mapId));
      return;
    }

    if (n.healAll) {
      await ui.say(n.talk);
      const yes = await ui.ask(["ガオンを やすませますか？"]);
      if (yes) {
        beep("heal");
        await ui.say(["…おやすみなさい。"], { speed: 6 });
        healParty();
        await wait(600);
        await ui.say(["おまたせしました！", "みんな げんきに なりました。"]);
        const b = State.save.backTo;
        if (b && !n.restStop) State.save.lastCenter = { ...b, interior126:this.mapId };
        saveLocal();
        if (cloud.signedIn) saveCloud(true);
      }
      return;
    }

    if (n.shop) {
      await ui.say(n.talk);
      await shopMenu(this.map.shopItems82??MAPS[State.save.backTo?.map]?.shopItems82);
      return;
    }

    if (n.clothes) {
      await ui.say(n.talk);
      await clothesShop(n.clothes);
      return;
    }

    if (n.salon) {
      await ui.say(n.talk);
      await hairSalon();
      return;
    }

    if (n.heal) {
      await ui.say(n.talk);
      const yes = await ui.ask(["ゆっくり やすんでいく？"]);
      if (yes) {
        healParty();
        beep("heal");
        await ui.say(["…すっきりした！", "ガオンたちも げんきに なった。"]);
        saveLocal();
      }
      return;
    }

    await ui.say(npcDialogue(State.save,this.mapId,n,(flag(beatKey) && n.after) ? "after" : "talk",(flag(beatKey) && n.after) ? n.after : n.talk));
  },

  /* ============================================================
     ものがたり
  ============================================================ */

  // 母からの旅立ちの贈り物。既存の記録でも、この贈り物は一度だけ受け取れる。
  async motherEvent(n) {
    if (!flag("motherNetGift")) {
      await ui.say([
        "ミレナ「旅に出る前に、これを持っていってね。",
        "ラグネットを15個、用意しておいたわ。",
      ]);
      addItem("ラグネット", 15);
      setFlag("motherNetGift");
      setFlag("gotNet");
      saveLocal();
      beep("levelup");
      await ui.say([
        State.save.name + "は お母さんから",
        "ラグネットを15個 もらった！",
        "野生のガオンに出会ったら、ネットで捕まえてみてね。",
        "仲間になったガオンと、次のバトルで戦えるわ。",
        "バトル中も「どうぐ」から、ラグネットを使えるのよ。",
        "谷守のオルドが、共同ロッジで待っているわ。",
      ]);
      return;
    }
    await ui.say(["ミレナ「おかえり。みんな元気？"]);
    if (await ui.ask(["家で ゆっくり休んでいく？"])) {
      healParty();
      beep("heal");
      saveLocal();
      await ui.say(["ガオンたちも 元気になった！"]);
    }
  },

  // 谷守は図鑑を渡す。ネットの贈り物とは独立して進行する。
  async elderEvent(n) {
    if (!hasItem("ガオンずかん")) {
      await ui.say([
        "オルド「よく きた、" + State.save.name + "。",
        "　今朝、谷をぬける風から 音が消えた。",
        "　ガオンたちも 雪峰のほうを 見つめている。",
        "　山の奥で なにかが 目をさましたのだ。",
      ]);
      addItem("ガオンずかん");
      beep("levelup");
      await ui.say([
        State.save.name + "は「ガオンずかん」を うけとった！",
        "出会ったガオンと、仲間になったガオンを記録できる。",
      ]);
      await ui.say([
        "オルド「これは 谷の生き物を記す 観察帳だ。",
        "　戦うためだけでなく、声を聞くために 使ってほしい。",
        "　雲を生む森をぬけ、山の奥へ 行ってくれ。",
        "　古い伝承が本当なら、リーフ・コンパスが",
        "　異変の源へ おまえを 導くだろう。",
      ]);
      saveLocal();
      return;
    }
    if (!flag("gotCompass")) {
      await ui.say([
        "オルド「北の モミ林を ぬけ、雪どけの泉へ。",
        "　ガオンが 近づいてきたら、まず ようすを見ろ。",
        "　心を通わせた 仲間なら、山の気配を",
        "　おまえより 早く感じてくれる。",
      ]);
      return;
    }
    if (!flag("elderOK")) {
      setFlag("elderOK");
      beep("levelup");
      await ui.say([
        "オルド「その葉脈の光… コンパスが おまえを選んだか。",
        "　ラテットは 山を守る者を 見きわめたのだろう。",
        "　谷の外でも、土地ごとの声を 聞いてきてほしい。",
      ]);
      await ui.say([
        "オルド「山々には 七つの谷があり、それぞれに",
        "　人とガオンの暮らしを守る『谷守』がいる。",
        "　七つの エンブレムは、土地の声を聞いた証。",
        "　集めれば 星環の都で、山脈会議への道が開くだろう。",
      ]);
      saveLocal();
      if (cloud.signedIn) saveCloud(true);
      return;
    }
    await ui.say([
      "オルド「よい風が おまえの背を押すように。",
      "　ガオンたちと、まだ名のない道を ゆけ。",
    ]);
  },

  // やまの おくち：ラテットに であい、リーフ・コンパスを 手に入れる
  async latetteEvent(n) {
    if (flag("gotCompass")) {
      if (flag("champion") && !flag("latetteBack")) {
        await ui.say(["やまの おくちに、また あの きんいろの かげが…！"]);
        setFlag("latetteBack");
        const res = await startBattle({ wild: makeMon("ラテット", 50) });
        if (res === "lose") { await this.blackout(); return; }
        await this.checkEvolution();
        playBgm(bgmFor(this.mapId));
        saveLocal();
        return;
      }
      await ui.say(["しずかな いずみ。", "あの ガオンの すがたは もう ない。"]);
      return;
    }
    n.gone = true;
    beep("levelup");
    await ui.say([
      "いずみの ほとりに、金の たてがみの ガオンが いた。",
      "……「ラテット」。やまの ぬしと よばれる でんせつの ガオン。",
    ]);
    await wait(400);
    await ui.say([
      "ラテットは " + State.save.name + "を じっと 見つめ、",
      "かぜの ように はしり去っていった。",
    ]);
    addItem("リーフ・コンパス");
    setFlag("gotCompass");
    beep("catch");
    await ui.say([
      "ラテットが いた ばしょに、",
      "「リーフ・コンパス」が おちていた！",
      "STARTの「どうぐ」から 見ると、つぎの土地が わかる。",
      "風鳴り谷へ もどって オルドに 見せよう。",
    ]);
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  },

  // やまの でぐち：コンパスが ないと とおれない
  async gateEvent(n) {
    if (!flag("elderOK")) {
      await ui.say([
        "みはり「ここから さきは やまの そとだ。",
        "　ぞくちょうさまに みとめられたのか？",
        "　…まだ みたいだな。もどりな。",
      ]);
      return;
    }
    if (!flag("gateOpen")) {
      setFlag("gateOpen");
      n.x = 4; n.dir = "down";
      await ui.say([
        "みはり「その コンパス…！ みとめられたんだな。",
        "　いってこい。せかいは ひろいぞ。",
      ]);
      saveLocal();
      return;
    }
    await ui.say(["みはり「きを つけてな。"]);
  },

  // でんせつの ガオン（メロロン・ディーナ）
  async legendEvent(n) {
    const L = n.legend;
    if (flag("legend:" + L.name)) {
      await ui.say(["…あの ガオンの すがたは もう ない。"]);
      return;
    }
    await ui.say(n.talk);
    setFlag("legend:" + L.name);
    n.gone = true;
    const res = await startBattle({ wild: makeMon(L.name, L.lv) });
    if (res === "lose") { await this.blackout(); return; }
    await this.checkEvolution();
    playBgm(bgmFor(this.mapId));
    saveLocal();
    if (cloud.signedIn) saveCloud(true);
  },

  // 大会の うけつけ：エンブレム 7つで しゅつじょう
  async entryEvent(n) {
    const have = State.save.badges.length;
    if (flag("champion")) {
      await ui.say(["うけつけ「ゆうしょうしゃの " + State.save.name + "さん！",
                    "　また いつでも ちょうせんしに きてくださいね。"]);
      return;
    }
    if (have < 7) {
      await ui.say([
        "案内人「七つの谷が集う 山脈祭へ ようこそ。",
        "　中央のバトル会議へは 7つの証が ひつようです。",
        "　いまは " + have + "こ。まだ声を聞いていない谷があります。",
      ]);
      return;
    }
    if (!hasItem("たいかいパス")) {
      addItem("たいかいパス");
      beep("levelup");
      await ui.say([
        "案内人「七つの谷の証、たしかに。",
        "　山脈会議の「たいかいパス」を おわたしします。",
        "　北の木造ホールで、谷の代表たちが待っています。",
      ]);
      saveLocal();
      return;
    }
    await ui.say(["案内人「木造ホールは 北です。", "　あなたの旅の答えを 見せてください。"]);
  },

  // ガオンバトル大会
  async tournamentEvent(n) {
    if (flag("champion")) {
      await ui.say(["しんこう「ゆうしょうしゃの おでましだ！",
                    "　ことしも みごとな たたかいだった。"]);
      return;
    }
    if (!hasItem("たいかいパス")) {
      await ui.say([
        "進行役「ここは 七つの谷の バトル会議場。",
        "　参加には 山脈祭の「たいかいパス」が ひつようだ。",
      ]);
      return;
    }
    const yes = await ui.ask([
      "進行役「" + State.save.name + "、旅の答えを 見せる準備はいいか？",
      "　七つの谷の代表と、つづけて 声を重ねてもらう。",
    ], "たたかう", "まだ まつ");
    if (!yes) return;

    const rounds = [
      { name: "1かいせん　ガオンつかい リク", look: "boy",
        party: [["デカネズ", 44], ["ソラハネ", 45], ["ガンセキ", 45]], money: 3000,
        talk: ["リク「1かいせん、いくぞ！"], win: ["リク「つよい…！"] },
      { name: "2かいせん　ガオンつかい ミオ", look: "girl",
        party: [["ミナモン", 46], ["キノガミ", 46], ["ラゲドン", 47]], money: 4000,
        talk: ["ミオ「ここからは かんたんには いかないわ。"], win: ["ミオ「みごとね。"] },
      { name: "じゅんけっしょう　ガオンつかい ゴウ", look: "hiker",
        party: [["ガンゴレム", 47], ["ドリルモグ", 48], ["オオカブト", 48]], money: 5000,
        talk: ["ゴウ「かたい ガオンで うけとめる！"], win: ["ゴウ「くずされたか…！"] },
    ];

    for (let i = 0; i < rounds.length; i++) {
      const r = rounds[i];
      await ui.say(["しんこう「" + r.name + "！"]);
      await ui.say(r.talk);
      const res = await startBattle({ tournament:true, trainer: { party: r.party, money: r.money, name: r.name, leader: null, champ: true } });
      if (res === "lose") { await this.tournamentLose(); return; }
      await ui.say(r.win);
      await this.checkEvolution();
      healParty();
      await ui.say(["しんこう「かいふくの じかんだ。", "　ガオンたちが げんきに なった！"]);
      saveLocal();
    }

    // けっしょう：フィロア
    await ui.say([
      "進行役「最後に 地図を閉じる一戦！",
      "　相手は…湖のむこうから来た 測量士フィロア！",
    ]);
    await ui.say([
      "フィロア「やっぱり 最後の線は きみと引くんだね、" + State.save.name + "！",
      "　おれの地図には、道だけじゃなく 出会った声も描いてある。",
      "　七つの谷を歩いた全部で、しょうぶだ！",
    ]);
    const res = await startBattle({
      tournament:true,
      trainer: {
        name: "フィロア",
        party: [["スイスイオ", 48], ["ライボルト", 48], ["オオハサミ", 50], ["リュウグウ", 52]],
        money: 8000, champ: true,
      },
    });
    if (res === "lose") { await this.tournamentLose(); return; }

    setFlag("champion");
    beep("levelup");
    await ui.say([
      "フィロア「…つよいなあ。おれの まけだ！",
      "　でも つぎは ぜったい かつからな！",
    ]);
    await this.checkEvolution();
    await this.ending();
  },

  async tournamentLose() {
    await ui.say([
      "しんこう「しょうぶ あり！",
      "　" + State.save.name + "せんしゅ、ここで だいかいだ。",
      "　また ちょうせんしに きてくれ。",
    ]);
    healParty();
    this.enter("galaxy", 8, 4, "down");
    saveLocal();
  },

  /* --- やせいの ガオン ---------------------------------------- */
  async wildBattle(rare = null) {
    if(this.map.tileWorld&&!flag("v5:netGift"))return;
    this.busy = true;
    State.save.battleTerrain=State.save.boating?"water":this.map.battleTerrain||"grass";
    const now91=new Date();if(rare&&!wildAvailable91(rare.name,now91,this.mapId)){this.busy=false;return;}const list=filterWild91(State.save.boating?waterEncounters(this.mapId,now91):(this.map.encountersConfigured86?(this.map.enc?.list||[]):ordinaryEncounters(this.map.enc?.list,this.mapId,now91)),now91,this.mapId);
    if(!rare&&!list.length){this.busy=false;return;}
    let chosen=rare?[rare.name,rare.min,rare.max,1]:list[0];
    if(!rare){let r=rnd(list.reduce((sum,e)=>sum+e[3],0));for(const e of list){r-=e[3];if(r<0){chosen=e;break;}}}
    const lv = chosen[1] + rnd(chosen[2] - chosen[1] + 1);
    const mon = makeMon(chosen[0], lv);
    const res = await startBattle({ wild: mon, ...scheduledBattleOptions(mon.sp) });
    if (res === "lose") { await this.blackout(); this.busy = false; return; }
    await this.checkEvolution();
    playBgm(bgmFor(this.mapId));
    saveLocal();
    this.busy = false;
  },

  async checkEvolution() {
    let e = popEvolution();
    while (e) {
      const from = e.mon.sp;
      await ui.say(["おや…？", from + "の ようすが…！"]);
      e.mon.sp = e.to;
      ownMon(e.to);
      beep("levelup");
      await ui.say(["おめでとう！ " + from + "は", e.to + "に しんかした！"]);
      e = popEvolution();
    }
  },

  async blackout() {
    await ui.say([State.save.name + "は めのまえが まっくらに なった…"]);
    const lost = Math.floor(State.save.money / 2);
    State.save.money -= lost;
    healParty();
    const c = recoveryPoint126(MAPS,State.save.lastCenter);
    this.enter(c.map, c.x, c.y, c.dir);
    await ui.say(["おかねを " + lost + "円 おとしてしまった…", "ガオンびょういんで 手当てをうけた。"]);
    saveLocal();
  },

  async ending() {
    await ui.say([
      "…………",
      State.save.name + "の旅が、七つの谷をつなぐ 新しい道として認められた！",
      "風鳴り谷の人々も、きっと 風の音で知っただろう。",
      "山の奥地の ラテットも、",
      "葉脈の光を どこかで見ていたのかもしれない——",
      "ここまで あそんでくれて ありがとう！",
    ]);
    saveLocal();
    if (cloud.signedIn) await saveCloud(true);
  },

  /* --- えがく ------------------------------------------------- */
  draw() {
    const map = this.map;
    const mw = map.rows[0].length, mh = map.rows.length;
    const px = this.x * T + this.ox, py = this.y * T + this.oy;
    // メッセージわくの ぶんだけ 下に よぶんに スクロールできるように する
    //（そうしないと まちの はしで 主人公が わくに かくれてしまう）
    const EXTRA = map.tileWorld ? 0 : 96;
    const focusX=this.cameraFocus?this.cameraFocus.x*T:px,focusY=this.cameraFocus?this.cameraFocus.y*T:py;
    let camX = focusX - (G.W - T) / 2, camY = focusY - (G.H - T) / 2 - 24;
    camX = Math.max(0, Math.min(mw * T - G.W, camX));
    camY = Math.max(0, Math.min(mh * T - G.H + EXTRA, camY));
    if (mw * T < G.W) camX = (mw * T - G.W) / 2;
    if (mh * T + EXTRA < G.H) camY = (mh * T - G.H) / 2;

    // Interiors use the same player-following camera as the surrounding maps.

    // そとの すきま（地図の むこう）は そのばしょに あう 色で うめる
    G.use(map.kind === "cave" ? "cave" : map.kind === "in" ? "floor" : "grass");
    G.clear(map.kind === "cave" ? 3 : map.kind === "in" ? 3 : 2);

    const frame = Math.floor(this.tick / 500) % 2;
    const x0 = Math.floor(camX / T), y0 = Math.floor(camY / T);
    const fullBackdrop = map.tileWorld ? drawChapterMap(G.ctx,map,camX,camY) : map.fullArt && drawWorldBackdrop(G.ctx, map.fullArt, camX, camY, mw * T, mh * T);
    drawResources80(G.ctx,map,State.save,camX,camY);
    drawMarineAtmosphere(G.ctx,map,camX,camY,this.tick,State.save);
    drawVoyageOverlay(G.ctx,map,camX,camY,State.save,this.tick);
    if (map.fullArt && !fullBackdrop) {
      // 衝突用 X マスクや旧ランドマークを風景として表示しない。
      G.ctx.fillStyle = "#092438";
      G.ctx.fillRect(0, 0, G.W, G.H);
      G.ctx.fillStyle = "#ffffff";
      G.ctx.font = "18px sans-serif";
      G.ctx.textAlign = "center";
      G.ctx.fillText("地図を読み込んでいます…", G.W / 2, G.H / 2);
      G.ctx.textAlign = "start";
      return;
    }
    for (let ty = y0; ty <= y0 + Math.ceil(G.H / T); ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        if (fullBackdrop) continue;
        // 地図の そとは いちばん はしの マスを つづけて えがく
        const ch = edgeTile(map, tx, ty);
        if (ch === null) continue;
        const gg = group(ch);
        // まわり 8マスを 見る（ななめも 見て、かどを まるく できるように）
        let mask = 0;
        if (group(edgeTile(map, tx, ty - 1)) === gg) mask |= 1;
        if (group(edgeTile(map, tx + 1, ty)) === gg) mask |= 2;
        if (group(edgeTile(map, tx, ty + 1)) === gg) mask |= 4;
        if (group(edgeTile(map, tx - 1, ty)) === gg) mask |= 8;
        if (group(edgeTile(map, tx + 1, ty - 1)) === gg) mask |= 16;
        if (group(edgeTile(map, tx + 1, ty + 1)) === gg) mask |= 32;
        if (group(edgeTile(map, tx - 1, ty + 1)) === gg) mask |= 64;
        if (group(edgeTile(map, tx - 1, ty - 1)) === gg) mask |= 128;
        const vr = ((tx * 7 + ty * 13 + tx * ty) >>> 0) % 16;
        // がけの 下の じめんには かげが おちる
        const up = edgeTile(map, tx, ty - 1);
        const sh = up === "M" && GROUND.has(ch) ? 1 : 0;   // がけ だけ かげを おとす
        // き の ところは まず じめんだけ えがく（木は あとで かさねる）
        const hiddenBuilding = map.hideTileHouses && (ch === "r" || ch === "#" || ch === "w" || ch === "D");
        const draw = hiddenBuilding ? "," : (ch === "T") ? ((map.sets && map.sets.T2) || ",") : ch;
        const tileX = tx * T - camX, tileY = ty * T - camY;
        const newGround = !sh && drawTerrain(G.ctx, draw, map, tileX, tileY, T, tx, ty);
        if (!newGround) G.draw(tileFor(draw, frame, map.sets, draw === ch ? mask : 255, vr, sh, tx, ty), tileX, tileY);
        if(newGround) drawTileDetail(G.ctx,ch,tileX,tileY,T);
      }
    }

    // き（1本ずつ かさねて もりに 見せる）
    for (let ty = y0 - 1; ty <= y0 + Math.ceil(G.H / T) + 1; ty++) {
      for (let tx = x0; tx <= x0 + Math.ceil(G.W / T); tx++) {
        if (fullBackdrop || edgeTile(map, tx, ty) !== "T") continue;
        const kind = ((tx * 5 + ty * 11 + tx * ty) >>> 0) % 4;
        const foot = edgeTile(map, tx, ty + 1) !== "T";     // 下に 木が なければ みきを 出す
        const winterTree = map.sets && map.sets[","] === "snow";
        const treeX=tx*T-camX, treeY=ty*T-camY;
        if(!G.isColor() || !drawRevampTree(G.ctx,treeX,treeY)) {
          G.draw(treeImage(kind, foot, winterTree),
                 treeX - (TREE_W - T) / 2, treeY - TREE_UP);
        }
      }
    }

    // たてもの（何マスかに またがる 1まいの え）
    for (const hs of fullBackdrop || map.hideTileHouses ? [] : findHouses(map)) {
      const sx = hs.x * T - camX, sy = hs.y * T - camY;
      if (sx > G.W || sy > G.H || sx + hs.w * T < 0 || sy + hs.h * T < 0) continue;
      G.draw(houseImage(hs), sx, sy);
    }

    // 山岳世界の大型建築・橋・崖。複数マスをまたぐ高密度画像で奥行きを出す。
    for (const lm of fullBackdrop ? [] : (map.landmarks || [])) {
      const sx = lm.x * T - camX, sy = lm.y * T - camY;
      const w = (lm.w || 4) * T, h = (lm.h || 4) * T;
      if (sx > G.W || sy > G.H || sx + w < 0 || sy + h < 0) continue;
      if(!G.isColor() || !drawRevampObject(G.ctx,lm.art,sx,sy,w,h)) {
        const img = environmentTile(lm.art);
        if (img) G.drawScaled(img, sx, sy, w, h);
      }
    }

    // おちている どうぐ
    for (const it of map.items || []) {
      if (flag(it.flag)) continue;
      if(!drawItem(G.ctx,it.item,it.x*T-camX,it.y*T-camY,32))drawBall(it.x*T-camX,it.y*T-camY);
    }

    // ひとたち（うしろに いる人から）
    this.humanTrail.record(this.x+this.ox/T,this.y+this.oy/T,this.dir);
    const trailingMon=followingMon();this.followerTrail.distance=Math.max(State.save.flags["end:eden"]&&!State.save.flags["end:momiWon"]?2:.7,trailingMon?followerDistance(trailingMon.sp,this.dir):1);
    const ep=this.humanTrail.pose,en=this.npcs.find(n=>n.eden&&!n.gone);
    if(en&&ep&&State.save.flags["end:eden"]&&!State.save.flags["end:momiWon"]&&!this.busy){Object.assign(en,{x:ep.x,y:ep.y,dir:ep.dir,moving:this.moving});}
    const people = this.npcs.filter((n) => !n.gone).map((n) => ({ n: n, y: n.y + (n.oy || 0) / T }));
    if(!this.followerTrail.pose&&!(State.save.flags['end:eden']&&!State.save.flags['end:momiWon']))this.followerTrail.face(this.x+this.ox/T,this.y+this.oy/T,this.dir,(x,y)=>this.canFreeStand(x,y));
    if(!this.followerChat121)this.followerTrail.record(this.x+this.ox/T,this.y+this.oy/T,this.dir);
    const follower=followingMon(),pose=this.followerTrail.pose;
    if(G.isColor()&&follower&&pose&&!State.save.boating)people.push({follower,pose,x:pose.x,y:pose.y});
    people.push(...daycareResidents(map,State.save,this.tick));
    people.push({me:true,y:this.y+this.oy/T});
    people.push(...[...map.props||[],...map.editorAddedProps72||[]].filter(p=>(isTree83(p)||map.editor72&&landscape98(p))&&!p.turn81).map(tree=>({tree,y:tree.y+tree.h-.5})));
    people.sort((a, b) => a.y - b.y);
    for (const p of people) {
      if(p.tree){G.ctx.save();G.ctx.translate(-camX,-camY);drawEditorProp72(G.ctx,p.tree,map);G.ctx.restore();continue;}if (p.follower) {
        drawFollower(G.ctx,p.follower,p.pose,this.tick,p.x*T+16-camX,p.y*T+20-camY-(this.followerJoy121>this.tick?Math.round(Math.abs(Math.sin(this.tick/150))*5):0));
        if(map.tileWorld)drawGrassFeet(G.ctx,map,p.x*T,p.y*T,camX,camY);
      } else if (p.me) {
        const fi = this.moving ? this.walkFrame : 0;
        const hopY = this.hop ? -Math.abs(Math.sin((this.oy / T) * Math.PI)) * 14 : 0;
        const heroX = px - camX, heroY = py - camY - 28 + hopY;
        if (State.save.boating&&drawBoat(G.ctx,this.dir,heroX,heroY,this.tick)) { } else if (!G.isColor() || !drawHero(G.ctx, this.dir, this.moving, this.tick, heroX, heroY, State.save.look)) {
          let img;
          const f = playerFrames()[this.dir][fi];
          if (G.isColor()) img = G.makeColorArt(f, 1, "pc" + this.dir + fi, playerColors(State.save.look));
          else img = G.makeArt(framesFor("player")[this.dir][fi], 1, "p" + this.dir + fi, "player");
          G.draw(img, px - camX, py - camY - 12 + hopY);
        }
      } else {
        const n = p.n;
        if(n.doorMarker)continue;
        if(n.artMon){drawFollower(G.ctx,{sp:n.artMon},{dir:n.dir||'down',moving:n.moving},this.tick,n.x*T+(n.ox||0)+16-camX,n.y*T+(n.oy||0)+28-camY);continue;}
        if(n.itemArt){drawItem(G.ctx,n.itemArt,n.x*T-camX,n.y*T-camY,32);continue;}
        if(n.propArt){drawMarineAsset(G.ctx,n.propArt,n.x*T-camX,n.y*T-camY,32,32);continue;}
        const dirn = n.dir || "down";
        const newPerson = G.isColor() && (drawRoomStaff(G.ctx,this.map,n,n.x*T-camX+(n.ox||0),n.y*T-camY-28+(n.oy||0))||drawEden(G.ctx,n,this.tick,n.x*T-camX+(n.ox||0),n.y*T-camY-28+(n.oy||0))||drawNpc(G.ctx,n,this.tick,n.x*T-camX+(n.ox||0),n.y*T-camY-28+(n.oy||0)));
        const nfi = n.moving ? n.walkFrame : 0;
        const img2 = (G.isColor()
          ? G.makeColorArt(personFramesRaw(npcStyle(n))[dirn][nfi], 1, "nc" + n.look + npcKey(n) + dirn + nfi, colorsFor(n.look))
          : G.makeArt(framesFor(n.look)[dirn][nfi], 1, "n" + n.look + dirn + nfi, n.look));
        // NPCs use the same 32 x 48 on-screen frame and foot anchor as the hero.
        // Generated NPC sources are 32 x 40 after AS scaling, which made every
        // character visibly smaller than the player on the field.
        if (!newPerson) G.drawScaled(matchedNpcFrame(img2), n.x * T - camX+(n.ox||0), n.y * T - camY - 28+(n.oy||0), 32, 48);
        if (n.alert) {
          G.use("ui");
          G.window9(n.x * T - camX + 6, n.y * T - camY - 34, 22, 26);
          G.text("！", n.x * T - camX + 11, n.y * T - camY - 30, 3, 16);
        }
      }
    }

    if(map.tileWorld){drawGrassFeet(G.ctx,map,px,py,camX,camY);}
    drawLot79(G.ctx,map,camX,camY);
    const environmentNow=new Date(),environmentOptions={storyStorm:map.id==='raden'&&powerOutage(State.save)};
    drawRealtimeEnvironment(G.ctx,map,this.tick,environmentNow,{...environmentOptions,camX,camY});
    drawPowerAtmosphere(G.ctx,map,this.tick,State.save);
    if(map.kind==='out'&&map.frontierTheme==='ash')drawFrontierWeather(G.ctx,map,this.tick);drawEndWeather(G.ctx,this);
    {drawClockWeather(G.ctx,map,environmentNow,environmentOptions);drawVoyageStatus(G.ctx,map,State.save);}
    // まちの なまえ（はいってすぐ）
    G.use("ui");

    if (compassEnabled()) drawCompassArrow(this.mapId, this.x, this.y, camX, camY, this.tick);
    if (this.doorFade > 0) {
      G.ctx.fillStyle = `rgba(3, 12, 23, ${Math.min(1, this.doorFade)})`;
      G.ctx.fillRect(0, 0, G.W, G.H);
    }
    ui.draw();
  },
};

function drawCompassArrow(mapId, x, y, camX, camY, tick) {
  const wp = compassWaypoint(mapId);
  if (!wp || wp.done || wp.x == null) return;
  const targetX = wp.x * T + T / 2 - camX;
  const targetY = wp.y * T + T / 2 - camY;
  const playerX = x * T + T / 2 - camX;
  const playerY = y * T + T / 2 - camY;
  const angle = Math.atan2(targetY - playerY, targetX - playerX);
  const c = G.ctx;

  // 画面右上の常時見えるコンパス。進行方向へ針が回る。
  c.save();
  c.translate(286, 28);
  c.fillStyle = "rgba(12,35,56,0.86)";
  c.strokeStyle = "#fff1b8";
  c.lineWidth = 2;
  c.beginPath(); c.arc(0, 0, 19, 0, Math.PI * 2); c.fill(); c.stroke();
  c.rotate(angle + Math.PI / 2);
  const bob = Math.sin(tick / 180) * 2;
  c.translate(0, bob);
  c.fillStyle = "#5dd7ff";
  c.strokeStyle = "#092e66";
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, -14); c.lineTo(9, 8); c.lineTo(0, 4); c.lineTo(-9, 8); c.closePath();
  c.fill(); c.stroke();
  c.restore();

  // 目的地点が画面内に入ったら、場所そのものにも葉形の印を出す。
  if (targetX > 14 && targetX < G.W - 14 && targetY > 22 && targetY < G.H - 28) {
    c.save();
    c.translate(targetX, targetY - 18 + Math.sin(tick / 160) * 3);
    c.rotate(-0.35);
    c.fillStyle = "#8ee85b";
    c.strokeStyle = "#173d24";
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, -11); c.bezierCurveTo(12, -6, 10, 8, 0, 12);
    c.bezierCurveTo(-10, 6, -10, -5, 0, -11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(0, -7); c.lineTo(0, 9); c.stroke();
    c.restore();
  }
}

function drawBall(x, y) {
  const pal = G.resolve("flower");
  G.ctx.fillStyle = G.resolve("ui")[3];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 9, 0, Math.PI * 2); G.ctx.fill();
  G.ctx.fillStyle = pal[0];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 7, 0, Math.PI * 2); G.ctx.fill();
  G.ctx.fillStyle = pal[2];
  G.ctx.beginPath(); G.ctx.arc(x + 16, y + 18, 7, Math.PI, 0); G.ctx.fill();
  G.ctx.fillStyle = G.resolve("ui")[3];
  G.ctx.fillRect(x + 9, y + 17, 14, 2);
}

export function tileAt(map, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  x = Math.floor(x); y = Math.floor(y);
  if (y < 0 || y >= map.rows.length) return null;
  const row = map.rows[y];
  if (x < 0 || x >= row.length) return null;
  return row[x];
}

// つなげて えがく ときの「なかま」わけ
// がけの かげが おちる じめん
const GROUND = new Set([",", ".", '"', "~", "F", "m", "d", "W", "H", "S", "s"]);

const GROUP = {
  ",": "g", '"': "g", F: "g", S: "g", "=": "g",
  ".": "p", s: "p", m: "p",
  "~": "n", W: "w", T: "t", R: "r", M: "cliff", X: "x", C: "c", d: "d",
  r: "roof", "#": "wall", w: "wall", D: "wall",
};
function group(ch) { return ch == null ? "" : (GROUP[ch] || ch); }

// えがく ときだけ つかう：地図の そとは はしの マスを くりかえす
function edgeTile(map, x, y) {
  const ty = Math.max(0, Math.min(map.rows.length - 1, y));
  const row = map.rows[ty];
  const tx = Math.max(0, Math.min(row.length - 1, x));
  return row[tx];
}

export function bgmFor(mapId) {
  return areaBgm(MAPS,mapId,State.save);
}
