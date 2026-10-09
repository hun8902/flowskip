import { ref, watch, nextTick, toRaw } from 'vue';
import { defaultSettings } from './defaults';
const api=globalThis.browser||globalThis.chrome;
const clone=(v:any)=>JSON.parse(JSON.stringify(v));
export function merge(defaults:any,value:any):any {
 if(Array.isArray(defaults))return Array.isArray(value)?clone(value):clone(defaults);
 if(defaults&&typeof defaults==='object')return Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,merge(v,value?.[k])]));
 return typeof value===typeof defaults&&value!==null?value:defaults;
}
function differences(a:any,b:any,path:string[]=[],out:any[]=[]){
 if(JSON.stringify(a)===JSON.stringify(b))return out;
 if(b&&typeof b==='object'&&!Array.isArray(b)){for(const key of Object.keys(b))differences(a?.[key],b[key],[...path,key],out);}
 else out.push({path,value:b,delta:path[0]==='Statistics'?Number(b)-Number(a||0):undefined});
 return out;
}
export function useBrowserSyncStorage<T>(key:string,defaults:T,mergeValue=true){return useBrowserLocalStorage(key,defaults,mergeValue);}
export function useBrowserLocalStorage<T>(key:string,defaults:T,mergeValue=true){
 const data=ref(clone(defaults));let previous:any=clone(defaults),updating=true;
 const mask=(value:any,enabled:boolean)=>{
  if(key!=='settings'||enabled)return value;
  const result=clone(value);for(const group of Object.values(result))if(group&&typeof group==='object')for(const k of Object.keys(group))if(typeof group[k]==='boolean')group[k]=false;return result;
 };
 const promise=(async()=>{const stored=await api.storage.local.get([key,'sceneEnabled']);data.value=mask(mergeValue?merge(defaults,stored[key]):stored[key]??clone(defaults),stored.sceneEnabled!==false);previous=clone(data.value);await nextTick();updating=false;})();
 watch(data,async value=>{if(updating)return;const next=clone(toRaw(value));const patches=differences(previous,next);previous=next;if(!patches.length)return;try{const r=await api.runtime.sendMessage({type:'engineWrite',key,patches});if(!r?.ok)console.warn('Scene: could not save changes');}catch(e){console.warn('Scene storage',e);}},{deep:true,flush:'post'});
 api.storage.onChanged.addListener(async(changes,area)=>{if(area!=='local'||(!changes[key]&&!changes.sceneEnabled))return;updating=true;const stored=await api.storage.local.get([key,'sceneEnabled']);data.value=mask(mergeValue?merge(defaults,stored[key]):stored[key]??clone(defaults),stored.sceneEnabled!==false);previous=clone(data.value);await nextTick();updating=false;});
 return {data,promise};
}
