// One-cell stamps using the existing yellow-road art, not a new visual style.
export const PATH_FLOORS175=[['sand175-center','黄色い道・中央（地面）','.'],...['上ふち','右ふち','下ふち','左ふち'].map((name,i)=>['sand175-edge-'+i,'黄色い道・'+name,'.']),...['左上外角','右上外角','右下外角','左下外角'].map((name,i)=>['sand175-corner-'+i,'黄色い道・'+name,'.']),...['左上内角','右上内角','右下内角','左下内角'].map((name,i)=>['sand175-inner-'+i,'黄色い道・'+name,'.'])];

PATH_FLOORS175.push(['grass-path175-center','草道・中央（茶色の地面）',',']);
PATH_FLOORS175.push(['grass175-center','草地・中央（緑の地面）',',']);
