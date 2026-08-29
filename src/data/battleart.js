// 画像生成で作った バトル専用の絵。
// まだ絵がないガオンは battle.js で従来のドット絵へ戻す。
const FILES = {
  リーフィン: "../../assets/monsters/battle/001-leafin.png",
  リーフォード: "../../assets/monsters/battle/002-leaford.png",
  フォレスタ: "../../assets/monsters/battle/003-foresta.png",
  ヒノコマ: "../../assets/monsters/battle/004-hinokoma.png",
  ボウエン: "../../assets/monsters/battle/005-bowen.png",
  エンブレイズ: "../../assets/monsters/battle/006-emblaze.png",
  アワミィ: "../../assets/monsters/battle/007-awamii.png",
  ウズマリン: "../../assets/monsters/battle/008-uzumarin.png",
  タイダルオ: "../../assets/monsters/battle/009-tidalor.png",
  ネズミン: "../../assets/monsters/battle/010-nezumin.png",
  デカネズ: "../../assets/monsters/battle/011-dekanez.png",
  トリッピ: "../../assets/monsters/battle/012-torippi.png",
  ソラハネ: "../../assets/monsters/battle/013-sorahane.png",
  ムシコロ: "../../assets/monsters/battle/014-mushikoro.png",
  ギガビート: "../../assets/monsters/battle/015-gigabeet.png",
};

const cache = new Map();
for (const name of Object.keys(FILES)) {
  const img = new Image();
  img.decoding = "async";
  img.src = new URL(FILES[name], import.meta.url).href;
  cache.set(name, img);
}

export function battleArt(name) {
  const img = cache.get(name);
  return img && img.complete && img.naturalWidth ? img : null;
}

export const BATTLE_ART_FILES = FILES;
