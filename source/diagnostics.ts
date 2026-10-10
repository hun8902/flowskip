// Local, bounded diagnostics. Never collect URLs, titles, account data or raw DOM text.
const api = globalThis.browser || globalThis.chrome;
const session = crypto.randomUUID();
const started = performance.now();
let pending: any[] = [];
let sending = false;
const ids = new WeakMap<HTMLVideoElement, number>();
let nextId = 1;
export function diagnose(event: string, details: Record<string, number | boolean> = {}) {
 const video = document.querySelector('video');
 const finite = (value: number) => Number.isFinite(value) ? Math.round(value * 1000) / 1000 : -1;
 if (video && !ids.has(video)) ids.set(video, nextId++);
 pending.push({session, event, ms: Math.round(performance.now() - started),
  videoId: video ? ids.get(video) : 0, time: video ? finite(video.currentTime) : -1,
  rate: video ? finite(video.playbackRate) : -1, muted: video?.muted ?? false,
  paused: video?.paused ?? true, seeking: video?.seeking ?? false,
  ready: video?.readyState ?? 0, ...details});
 pending = pending.slice(-200);
}
async function flush() {
 if (sending || !pending.length) return;
 sending = true;
 const batch = pending.splice(0, 100);
 try {
  const result = await api.runtime.sendMessage({type:'diagnosticAppend', rows:batch});
  if (!result?.ok) pending = [...batch, ...pending].slice(-200);
 } catch { pending = [...batch, ...pending].slice(-200); }
 finally { sending = false; }
}
diagnose('start');
for (const name of ['ratechange','volumechange','seeking','seeked','pause','playing','ended','emptied','loadedmetadata']) {
 document.addEventListener(name, event => {
  if (!(event.target instanceof HTMLVideoElement)) return;
  diagnose(name, {targetIsSelected: event.target === document.querySelector('video')});
  void flush();
 }, true);
}
setInterval(() => { diagnose('sample'); void flush(); }, 1000);
addEventListener('pagehide', () => { diagnose('pagehide'); void flush(); });
