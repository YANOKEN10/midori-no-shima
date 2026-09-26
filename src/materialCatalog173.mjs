export const CLIFFS173=Object.entries({grass:'草地',sand:'砂地',snow:'雪',ice:'氷',volcano:'火山岩',ruins:'遺跡'}).flatMap(([theme,label])=>Object.entries({down:'下向き',up:'上向き',left:'左向き',right:'右向き'}).map(([direction,dir])=>({key:'cliff173-'+theme+'-'+direction,art:'cliff173-'+theme+'-'+direction,label:label+'の崖・'+dir+'（1マス）',w:1,h:1,group:'cliff',placement83:'props',walkable:false,tile:'X',source:'village'})));
// Native 16px terrain, rendered at exactly 2x.
export const MATERIALS173=[
 ...[['top','落ち口','W'],['flow','流れ落ちる水','R'],['base','滝つぼの泡','W'],['rock-left','左の岩壁','X'],['rock-right','右の岩壁','X']].map(([key,label,ch])=>['waterfall-'+key+'173','滝・'+label,ch]),
 ...CLIFFS173.map(p=>[p.key,p.label,p.tile]),
 ...[['n',1,'北岸'],['e',2,'東岸'],['s',4,'南岸'],['w',8,'西岸'],['ne',3,'北東の外角'],['se',6,'南東の外角'],['sw',12,'南西の外角'],['nw',9,'北西の外角'],['inner-nw',16,'北西の内角'],['inner-ne',32,'北東の内角'],['inner-se',64,'南東の内角'],['inner-sw',128,'南西の内角']].map(([key,mask,label])=>['bank-'+key+'173','段差のある水際・'+label,'W']),
 ['cave-floor173','深闇・青灰色の岩床','C'],['volcano-floor173','火山・冷えた玄武岩','C'],['ruins-floor173','遺跡・苔むした石床','C'],['lava173','火山・マグマ（通行不可）','R'],['water173','洞窟・地底湖','W'],
 ['cave-wall173','深闇・岩壁の上面','X'],['cave-front173','深闇・岩壁の正面','X'],['volcano-wall173','火山・岩壁の上面','X'],['volcano-front173','火山・岩壁の正面','X'],['ruins-wall173','遺跡・石壁の上面','X'],['ruins-front173','遺跡・石壁の正面','X'],
 ['wood-floor173','家・オークの床','f'],['kitchen-floor173','台所・翡翠のタイル','f'],['home-wall173','家・木枠の漆喰壁','X'],['home-front173','家・木枠の壁の正面','X'],['clinic-wall173','病院・白い壁','X'],['clinic-front173','病院・白い壁の正面','X'],
 ['stairs173','石の階段','H'],['bridge173','木の橋の床','d'],['stone-bridge173','石の橋の床','d'],['rug173','家・藍色のじゅうたん','f'],['rug-red173','家・赤いじゅうたん','f'],['void173','室内の外側','X'],['snow-floor173','雪原・積雪の地面',','],['snow-grass173','雪原・枯れ草の草むら','"'],['snow-path173','雪原・踏み固めた雪','.'],['ice-floor173','氷河・青い氷の地面',','],['snow-wall173','雪山・崖の上面','X'],['snow-front173','雪山・雪をかぶった崖の正面','X'],['ice-wall173','氷河・氷壁の上面','X'],['ice-front173','氷河・氷壁の正面','X'],['snow-corner173','雪山・崖の角','X'],['ice-corner173','氷河・氷壁の角','X'],['snow-stairs173','雪山・雪の石段','H'],['ice-water173','氷河・凍らない水面','W']
];
export const DUNGEONS173=['shadowDepths','volcanicDepths','forgottenRuins','volcano1','volcano2','volcano3','volcanoSummit'];
export const SNOW173=['clearTown','route13','route14','route15','route16','glacier','blizzard'];
export const target173=m=>m.id==='merire'||SNOW173.includes(m.id)||DUNGEONS173.includes(m.id)||m.kind==='in'&&(['hut','rodsHome','adminHouse72','clearElder','marineHall','hospital','lab','karatSalon','shipCabins','shipLounge'].includes(m.id)||/の家/.test(m.name)&&!m.interior123);
