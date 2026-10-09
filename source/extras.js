// Scene enhancements for Netflix gestures absent from the upstream Netflix module.
(()=>{
 const api=globalThis.browser||globalThis.chrome;
 let settings,enabled=true;
 const load=async()=>{const d=await api.storage.local.get(['settings','sceneEnabled']);settings=d.settings;enabled=d.sceneEnabled!==false;};load();
 api.storage.onChanged.addListener((c,area)=>{if(area==='local'&&(c.settings||c.sceneEnabled))load();});
 if(/(^|\.)netflix\./.test(location.hostname))document.addEventListener('dblclick',event=>{
  if(!enabled||settings?.Video?.doubleClick===false||event.target.closest?.('input,button,a,[role="button"]'))return;
  const player=event.target.closest?.('.watch-video');if(!player)return;
  const button=player.querySelector('[data-uia="control-fullscreen-enter"],[data-uia="control-fullscreen-exit"]');
  if(button)button.click();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else player.requestFullscreen?.().catch(()=>{});
 });
 api.runtime.onMessage.addListener((m,s,reply)=>{if(m.type==='sceneStatus')reply({enabled,host:location.hostname});});
})();
