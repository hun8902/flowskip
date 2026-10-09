const api=globalThis.browser||globalThis.chrome;
export async function sendMessage(type:string,data:any,destination?:string){const result=await api.runtime.sendMessage({type:'engine',action:type,data});if(!result?.ok)return {error:result?.error||'Scene 연결 실패'};return result.value;}
