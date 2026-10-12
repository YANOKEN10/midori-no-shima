export const STATION_FLOORS236=[['hall','駅・待合の青緑タイル','f'],['platform','駅・ホームの明るい床','f'],['edge','駅・ホームの黄色い安全線','f'],['wall','駅・クリームの壁','X'],['track','駅・線路','R'],['barrier','駅・改札の柵','X']].map(([k,n,t])=>['station236-'+k,n,t]);
export const STATION_PROPS236=[
 {key:'station236-exterior',art:'station',label:'ギャラクシータウンの駅（室内つき）',w:8,h:5,building:'galaxyStation236',doorOffset:[4,4],arrival:[16,23]},
 {key:'station236-gates',label:'駅・通り抜ける改札',w:3,h:2,walkable:true,mask:['#.#','#.#']},
 {key:'station236-kiosk',label:'駅・ショップの売店',w:5,h:3,walkable:true,mask:['#####','##.##','##.##'],overhead230:true},
 {key:'station236-bench',label:'駅・３人掛け待合ベンチ',w:3,h:1},
 {key:'station236-board',label:'駅・時計付き案内板',w:6,h:2,wallMount86:true},
 {key:'station236-machine',label:'駅・券売機',w:2,h:2}
].map(p=>({art:p.key,tile:'#',group:'decor',walkable:false,...p}));
