importScripts('defaults.js','schema.js','model.js');
const api=globalThis.browser||chrome,M=SceneModel;let queue=Promise.resolve();const badges={};
const serial=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p;};
const serviceHost=host=>/(^|\.)(netflix\.(com|ca|com\.au)|primevideo\.com|amazon\.(com|co\.jp|de|co\.uk)|disneyplus\.com|hotstar\.com|starplus\.com|jiostar\.com|jiocinema\.com|crunchyroll\.com|max\.com|hbomax\.com|paramountplus\.com)$/.test(host);
const trusted=s=>s.url?.startsWith(api.runtime.getURL(''));
const allowed=s=>{try{return trusted(s)||serviceHost(new URL(s.url||s.tab?.url).hostname);}catch{return false;}};
async function state(){const d=await api.storage.local.get(['settings','hiddenTitles','sceneEnabled','appearance','tmdbToken','malClientId']);return {settings:M.normalize(d.settings),hiddenTitles:M.cleanHidden(d.hiddenTitles),sceneEnabled:d.sceneEnabled!==false,appearance:d.appearance||'system',tmdbConnected:!!d.tmdbToken,malConnected:!!d.malClientId};}
async function handle(m,s){if(!allowed(s))throw Error('허용되지 않은 요청');if(m.type==='state')return state();
 if(m.type==='diagnosticAppend'){
  if(!s.tab || !Array.isArray(m.rows) || m.rows.length>100)throw Error('잘못된 진단 요청');
  const fields=['ms','videoId','time','rate','muted','paused','seeking','ready','targetIsSelected','restoreRate','restored','remaining','labelVisible','active','blocked','enabled','end','timelineBusy','beforeRate','requestedRate','budget'];
  const events=new Set(['start','sample','pagehide','ratechange','volumechange','seeking','seeked','pause','playing','ended','emptied','loadedmetadata','restore-start','restore-result','interrupt','ad-decision','ad-start','accelerate','skip-button','transition-seeking','transition-ended','transition-emptied','transition-loadstart','transition-pause']);
  const rows=m.rows.filter(x=>x&&events.has(x.event)&&typeof x.session==='string'&&/^[a-f0-9-]{36}$/.test(x.session)).map(x=>{
   const clean={session:x.session,event:x.event,received:Date.now()};
   for(const key of fields)if(typeof x[key]==='boolean'||(typeof x[key]==='number'&&Number.isFinite(x[key])))clean[key]=x[key];
   return clean;
  });
  const d=await api.storage.local.get('netflixDiagnostics');
  const old=Array.isArray(d.netflixDiagnostics)?d.netflixDiagnostics:[];
  await api.storage.local.set({netflixDiagnostics:[...old,...rows].filter(x=>x.received>Date.now()-86400000).slice(-3000)});return true;
 }
 if(m.type==='engine'){
  if(m.action==='fetch')return remote(m.data);
  if(['increaseBadge','resetBadge','setBadgeText'].includes(m.action)&&s.tab?.id){const id=s.tab.id;badges[id]=m.action==='resetBadge'?0:(badges[id]||0)+1;try{await api.action.setBadgeText({tabId:id,text:badges[id]?String(badges[id]):''});}catch{}return true;}return true;
 }
 if(m.type==='engineWrite'){
  if(!['settings','hiddenTitles','crunchyList'].includes(m.key)||!Array.isArray(m.patches)||m.patches.length>200)throw Error('잘못된 저장 요청');
  const d=await api.storage.local.get(m.key);let value=m.key==='settings'?M.normalize(d.settings):d[m.key]||(m.key==='crunchyList'?[]:{});
  for(const p of m.patches){if(p.path?.[0]==='Statistics'&&m.key==='settings'){const k=p.path[1];if(k in value.Statistics&&Number.isFinite(p.delta))value.Statistics[k]=Math.max(0,value.Statistics[k]+p.delta);}else if(p.path?.length===0&&m.key==='crunchyList'){if(Array.isArray(p.value))value=p.value.slice(0,2000);}else M.patch(value,p);}
  if(m.key==='settings')value=M.normalize(value);if(m.key==='hiddenTitles')value=M.cleanHidden(value);await api.storage.local.set({[m.key]:value});return true;
 }
 if(!trusted(s))throw Error('설정 화면에서만 변경할 수 있습니다.');
 if(m.type==='diagnosticExport'){const d=await api.storage.local.get('netflixDiagnostics');return {format:1,version:api.runtime.getManifest().version,rows:(d.netflixDiagnostics||[]).filter(x=>x.received>Date.now()-86400000)};}
 if(m.type==='diagnosticClear'){await api.storage.local.remove('netflixDiagnostics');return true;}
 if(m.type==='patch'){const d=await state();const item=SceneSchema.find(x=>x.group===m.group&&x.key===m.key);if(!item||item.unsupported)throw Error('지원하지 않는 설정');M.patch(d.settings,{path:[m.group,m.key],value:m.value});if(m.key==='skipCredits'&&m.value)d.settings[m.group].watchCredits=false;if(m.key==='watchCredits'&&m.value)d.settings[m.group].skipCredits=false;await api.storage.local.set({settings:M.normalize(d.settings)});return state();}
 if(m.type==='common'){const d=await state();for(const g of ['Netflix','Amazon','Disney','Crunchyroll','HBO','Paramount'])if(typeof d.settings[g][m.key]==='boolean'){d.settings[g][m.key]=!!m.value;if(m.key==='skipCredits'&&m.value&&'watchCredits'in d.settings[g])d.settings[g].watchCredits=false;}await api.storage.local.set({settings:d.settings});return state();}
 if(m.type==='enabled'){await api.storage.local.set({sceneEnabled:!!m.value});return state();}
 if(m.type==='appearance'){if(!['system','light','dark'].includes(m.value))throw Error('잘못된 화면 모드');await api.storage.local.set({appearance:m.value});return state();}
 if(m.type==='credentials'){if(!['tmdbToken','malClientId'].includes(m.key)||typeof m.value!=='string'||m.value.length>2000)throw Error('연결 값을 확인하세요.');await api.storage.local.set({[m.key]:m.value.trim()});return state();}
 if(m.type==='unhide'){const d=await state();delete d.hiddenTitles[m.title];await api.storage.local.set({hiddenTitles:d.hiddenTitles});return state();}
 if(m.type==='hiddenBatch'){if(!Array.isArray(m.titles))throw Error('목록을 확인하세요.');const d=await state();for(const title of m.titles)delete d.hiddenTitles[title];await api.storage.local.set({hiddenTitles:d.hiddenTitles});return state();}
 if(m.type==='hiddenImport'){if(!m.value||typeof m.value!=='object'||Array.isArray(m.value))throw Error('올바른 작품 목록을 선택하세요.');const d=await state();d.hiddenTitles={...M.cleanHidden(m.value),...d.hiddenTitles};await api.storage.local.set({hiddenTitles:M.cleanHidden(d.hiddenTitles)});return state();}
 if(m.type==='hiddenPosters'){const d=await state();if(!d.tmdbConnected)throw Error('연결 화면에서 TMDB를 연결해 주세요.');const titles=Object.entries(d.hiddenTitles).filter(([,v])=>!v.posterPath).slice(0,60);await Promise.all(titles.map(async([title,v])=>{try{const result=await remote({type:'tmdb',url:'https://api.themoviedb.org/3/search/multi?query='+encodeURIComponent(title)});const match=result.results?.find(x=>x.media_type==='movie'||x.media_type==='tv');if(match){v.posterPath=match.poster_path;v.mediaType=match.media_type;}}catch{}}));await api.storage.local.set({hiddenTitles:M.cleanHidden(d.hiddenTitles)});return state();}
 if(m.type==='restore'){const b=M.restore(m.value);await api.storage.local.set({settings:b.settings,hiddenTitles:b.hiddenTitles});return state();}
 if(m.type==='resetAll'){await api.storage.local.clear();return state();}
 if(m.type==='resetStats'){const d=await state();d.settings.Statistics=M.clone(SceneDefaults.Statistics);await api.storage.local.set({settings:d.settings});return state();}
 if(m.type==='clearProfile'){const d=await state();if(m.group==='Netflix'){d.settings.General.profileName='';d.settings.General.profilePicture='';d.settings.Netflix.profile=false;}else{d.settings.General.Crunchyroll_profilePicture='';d.settings.Crunchyroll.profile=false;}await api.storage.local.set({settings:d.settings});return state();}
 if(m.type==='reload'){const tabs=await api.tabs.query({});let n=0;for(const tab of tabs){try{if(tab.url&&serviceHost(new URL(tab.url).hostname)){await api.tabs.reload(tab.id);n++;}}catch{}}return n;}
 throw Error('알 수 없는 요청');
}
async function remote(data){const d=await api.storage.local.get(['tmdbToken','malClientId']);const u=new URL(data?.url);let headers={accept:'application/json'};
 if(data.type==='tmdb'&&u.origin==='https://api.themoviedb.org'&&u.pathname.startsWith('/3/')){if(!d.tmdbToken)return {results:[],error:'TMDB 연결이 필요합니다.'};headers.Authorization='Bearer '+d.tmdbToken;}
 else if(data.type==='mal'&&u.origin==='https://api.myanimelist.net'&&u.pathname.startsWith('/v2/')){if(!d.malClientId)return {data:[],error:'MyAnimeList 연결이 필요합니다.'};headers['X-MAL-CLIENT-ID']=d.malClientId;}
 else throw Error('허용되지 않은 평점 요청');
 const r=await fetch(u.href,{headers,signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('평점 서버 응답 '+r.status);return r.json();
}
api.runtime.onMessage.addListener((m,s,reply)=>{(m?.type==='engine'&&m.action==='fetch'?handle(m,s):serial(()=>handle(m,s))).then(value=>reply({ok:true,value}),e=>reply({ok:false,error:e.message}));return true;});
