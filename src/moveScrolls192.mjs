import {MOVES} from './data/moves.js';
export const MOVE_SCROLLS192=Object.entries(MOVES).map(([move,m])=>({name:'わざじゅもん：'+move,kind:'moveScroll',move,price:Math.max(1000,(m.pow||40)*50),desc:move+'を覚える巻物。習得すると1個消費。能力に合う攻撃技と変化技を覚えられる。'}));
