// One editable cell per material; all are walkable ground, never solid props.
const directions=['上','右','下','左'],corners=['左上','右上','右下','左下'];
export const REFERENCE_GROUND182=[
 ['ref182-road-center','黄土色の道・中央'],['ref182-road-vertical','黄土色の道・縦（両側ふち）'],['ref182-road-horizontal','黄土色の道・横（両側ふち）'],
 ['ref182-soil-center','粒のある土・中央'],['ref182-soil-soft','粒のある土・草まじり'],['ref182-soil-pebbles','粒のある土・小石まじり'],['ref182-grass','土に合わせる深緑の草地'],
 ...directions.map((d,i)=>['ref182-soil-edge-'+i,'粒のある土・'+d+'ふち']),...corners.map((d,i)=>['ref182-soil-corner-'+i,'粒のある土・'+d+'外角']),...corners.map((d,i)=>['ref182-soil-inner-'+i,'粒のある土・'+d+'内角']),...directions.map((d,i)=>['ref182-soil-cap-'+i,'粒のある土・'+d+'の丸い端']),['ref182-soil-vertical','粒のある土・細道（縦）'],['ref182-soil-horizontal','粒のある土・細道（横）'],['ref182-soil-island','粒のある土・小さな丸地面']
].map(([key,label])=>[key,label+'（1マス）',',']);
