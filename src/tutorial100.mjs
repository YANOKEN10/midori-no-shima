export const LESSONS100={
 walk:{title:'歩く・人と話す',lines:['スマホは 左の丸いボタンを 動かすと歩けるよ。','人の方を向いて Aをおすと お話できるよ。','パソコンは 矢印キーで歩こう。','Enterか Zで話す。Xか Escでもどるよ。','まずは ネイチャータウンの女の子に 話を聞いてみよう！']},
 catch:{title:'ガオンをつかまえる',lines:['まずは 山おくでラテットに会って、 はかせに知らせよう。','はかせから ラグネットを15個もらえるよ。','草むらで 野生のガオンに会ったら どうぐから ラグネットを使おう。','たいりょくを少なくすると つかまえやすくなるよ。','倒してしまう前に ラグネットを使ってね。','人のガオンや 試験の相手は つかまえられないよ。']},
 heal:{title:'たいりょくを回復する',lines:['HPは たいりょくのこと。 少なくなったら ひと休み！','ガオン病院で なかまを回復してもらおう。','自分の家のお母さんにも 休ませてもらえるよ。','外で困ったときは くすりが役に立つよ。','つぎのバトルの前に なかまのHPを見てあげよう。']},
 battle:{title:'バトルとタイプ',lines:['なかまのわざをえらんで バトルしよう。','たとえば ほのおのわざは くさタイプに強いよ。','みずのわざは ほのおタイプに強いよ。','ちがうタイプの なかまを連れると 得意な相手がふえるね。','PPは わざを使える残りの回数だよ。']},
 moves:{title:'新しいわざをおぼえる',lines:['レベルが上がると 新しいわざを おぼえることがあるよ。','１種類のガオンが 約20個のわざを学べるよ。','バトルで使えるわざは ４つまで。','４つあるときは 今のわざを１つ忘れて 新しいわざにできるよ。','忘れたわざは 黄色い屋根の思い出し屋で！','ロッズタウンのレミが 思い出すのを手伝ってくれるよ。']},
 menu:{title:'メニューと図鑑',lines:['スマホは START、パソコンは Eでメニューをひらこう。','なかまや どうぐをたしかめられるよ。','ロッズタウンのヤノケンから ガオンずかんをもらおう。','同じ場所でも 曜日や時間で 会えるガオンが変わるよ。','わからなくなったら また話しかけてね！']}
};
export async function tutorialNpc100(n,save,ui,onChanged=()=>{}){
 const mother=n.script==='v5:mother',key=mother?'walk':n.script?.replace('tutorial100:','');
 if(!mother&&!n.script?.startsWith('tutorial100:'))return false;
 if(!LESSONS100[key])return false;
 save.flags||={};
 if(mother){if(save.flags['tutorial100:walk']||save.flags['v5:dex'])return false;const answer=await ui.choice(['そうさを教えて','あとで聞く']);if(answer!==0)return false;await ui.say(LESSONS100.walk.lines);save.flags['tutorial100:walk']=true;onChanged();return false;}
 const lesson=LESSONS100[key];await ui.say(['私は '+n.name+'。','「'+lesson.title+'」 を教えるよ。']);
 const choice=await ui.choice(['教えて！','ほかのことを聞く','またあとで']);let chosen=key;
 if(choice===1){const keys=Object.keys(LESSONS100),i=await ui.choice([...keys.map(k=>LESSONS100[k].title),'もどる']);if(i<0||i>=keys.length)return true;chosen=keys[i];}else if(choice!==0)return true;
 await ui.say(LESSONS100[chosen].lines);save.flags['tutorial100:'+chosen]=true;onChanged();await ui.say(['いつでも もう一度聞いていいよ！']);return true;
}
export function addTutorialPeople100(maps){
 const guides=[['village','walk','道あんないの ミチ',30],['village','heal','おくすりの ハナ',31],['route1','catch','草むらあんないの ソウ',32],['rods','battle','バトル先生の コウ',33],['rods','moves','わざ先生の ワカ',18],['rods','menu','図鑑あんないの シル',22]];
 for(const [id,key,name,variant]of guides){const m=maps[id];if(!m||m.editor72||m.npcs.some(n=>n.script==='tutorial100:'+key))continue;const open=(x,y)=>['.',',','f'].includes(m.rows[y]?.[x])&&![...m.props||[],...m.editorAddedProps72||[]].some(p=>!p.walkable&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);const reachable=new Set(),queue=[[m.spawn.x,m.spawn.y]];for(let i=0;i<queue.length;i++){const[x,y]=queue[i],k=x+','+y;if(reachable.has(k)||!['.',',','f','F','D','"'].includes(m.rows[y]?.[x]))continue;reachable.add(k);for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,y+dy]);}
 const reserved=[m.spawn,...m.npcs,...m.warps,...m.signs,...m.items||[]],spots=[];
 for(let y=2;y<m.rows.length-2;y++)for(let x=2;x<m.rows[y].length-2;x++){if(!reachable.has(x+','+y)||reserved.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<3))continue;let clear=true;for(let yy=y-1;yy<=y+1;yy++)for(let xx=x-1;xx<=x+1;xx++)if(!open(xx,yy))clear=false;if(clear)spots.push({x,y});}
 spots.sort((a,b)=>Math.abs(a.x-m.spawn.x)+Math.abs(a.y-m.spawn.y)-Math.abs(b.x-m.spawn.x)-Math.abs(b.y-m.spawn.y));if(!spots.length)continue;
 m.npcs.push({...spots[0],name,variant,dir:'down',noRoam:true,script:'tutorial100:'+key,talk:['わからないことは 私に聞いてね！']});
 }
}
