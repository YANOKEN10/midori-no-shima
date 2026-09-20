export function installPublishFeedback92(){
 const button=document.getElementById('publish'),status=document.createElement('div');
 status.id='publishStatus92';status.hidden=true;status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');document.body.append(status);
 return function update(state,message=''){
  button.dataset.publishState=state;button.setAttribute('aria-busy',String(state==='pending'));
  button.textContent=({pending:'公開中…',success:'✓ 公開しました',error:'公開をやり直す',confirm:'公開内容を確認中'})[state]||'③ 公開する';
  status.dataset.state=state;status.textContent=message;status.hidden=!message;
  if(state==='error')status.setAttribute('role','alert');else status.setAttribute('role','status');
 };
}
