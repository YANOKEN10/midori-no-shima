export function colorControls115(el,item,apply){
 const box=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='素材の色';box.append(legend);
 const label=document.createElement('label');label.textContent='変更する色';const input=document.createElement('input');input.type='color';input.id='materialColor115';input.value=item.color115||'#bd915e';label.append(input);box.append(label);
 const set=document.createElement('button');set.type='button';set.textContent='この色に変更';set.onclick=()=>apply(input.value);box.append(set);
 const reset=document.createElement('button');reset.type='button';reset.textContent='元の色に戻す';reset.disabled=!item.color115;reset.onclick=()=>apply(null);box.append(reset);
 const note=document.createElement('p');note.className='muted';note.textContent='選んだ素材だけの色を変更します。明暗と透明な部分は保ちます。';box.append(note);el.append(box);
}
