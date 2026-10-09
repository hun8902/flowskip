(function(root){
 const clone=v=>JSON.parse(JSON.stringify(v));
 const safe=k=>typeof k==='string'&&!['__proto__','constructor','prototype'].includes(k);
 function merge(d,v){if(Array.isArray(d))return Array.isArray(v)?clone(v):clone(d);if(d&&typeof d==='object')return Object.fromEntries(Object.entries(d).map(([k,x])=>[k,merge(x,v?.[k])]));return v!==null&&typeof v===typeof d?v:d;}
 function normalize(input){const s=merge(SceneDefaults,input);s.Video.userAgent=false;for(const group of ['Netflix','Amazon','Disney','HBO','Paramount'])if(s[group].watchCredits)s[group].skipCredits=false;
 for(const k of ['sliderMin','sliderMax','sliderSteps']){const n=s.General[k];s.General[k]=Number.isFinite(n)?Math.max(k==='sliderSteps'?0.5:1,Math.min(k==='sliderSteps'?10:160,n)):SceneDefaults.General[k];}
 s.General.sliderMax=Math.max(s.General.sliderMin,s.General.sliderMax);s.General.Crunchyroll_skipTimeout=Math.max(0,Math.min(30,Number(s.General.Crunchyroll_skipTimeout)||0));
 s.General.RatingThresholds=s.General.RatingThresholds.filter(x=>x&&Number.isFinite(x.value)&&typeof x.color==='string'&&/^(#[\da-f]{3,8}|[a-z]+|rgba?\([\d\s,.%]+\))$/i.test(x.color)).slice(0,10).map(x=>({value:Math.min(10,Math.max(0,x.value)),color:x.color})).sort((a,b)=>a.value-b.value);
 if(!s.General.RatingThresholds.length)s.General.RatingThresholds=clone(SceneDefaults.General.RatingThresholds);
 for(const key in s.Statistics)s.Statistics[key]=Math.max(0,Number.isFinite(s.Statistics[key])?s.Statistics[key]:0);return s;}
 function patch(object,p){if(!Array.isArray(p.path)||!p.path.length||p.path.length>4||!p.path.every(safe))throw Error('잘못된 설정 경로');let o=object;for(const k of p.path.slice(0,-1)){if(!o[k]||typeof o[k]!=='object')o[k]={};o=o[k];}o[p.path.at(-1)]=clone(p.value);}
 function cleanHidden(h){return Object.fromEntries(Object.entries(h||{}).filter(([k,v])=>safe(k)&&k.length<=300&&v&&typeof v==='object').slice(0,3000).map(([k,v])=>[k,{platform:String(v.platform||'Unknown').slice(0,40),mediaType:['movie','tv'].includes(v.mediaType)?v.mediaType:null,posterPath:typeof v.posterPath==='string'&&/^\/[a-zA-Z0-9_.-]+$/.test(v.posterPath)?v.posterPath:null,dateAdded:typeof v.dateAdded==='string'?v.dateAdded.slice(0,10):''}]));}
 function backup(d){const settings=normalize(d.settings);settings.General.profileName='';settings.General.profilePicture='';settings.General.Crunchyroll_profilePicture='';return {app:'FlowSkip',version:1,settings,hiddenTitles:cleanHidden(d.hiddenTitles)};}
 function restore(d){if(['Scene Full','FlowSkip'].includes(d?.app)&&d.version===1&&d.settings)return backup(d);if(d?.Netflix&&d?.General)return {app:'FlowSkip',version:1,settings:normalize(d),hiddenTitles:{}};throw Error('FlowSkip 또는 원본 Streaming enhanced 설정 파일을 선택해 주세요.');}
 root.SceneModel={clone,safe,merge,normalize,patch,cleanHidden,backup,restore};
})(globalThis);
