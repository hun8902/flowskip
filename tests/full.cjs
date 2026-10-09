const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require(process.env.SCENE_JSDOM||'jsdom');const root=path.join(__dirname,'../extension');const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const context={};vm.createContext(context);for(const f of ['defaults.js','schema.js','model.js'])vm.runInContext(read(f),context);const {SceneDefaults:D,SceneSchema:S,SceneModel:M}=context;
const services=['Netflix','Amazon','Disney','Crunchyroll','HBO','Paramount','Video'];
test('Every upstream service setting has a declared UI control',()=>{for(const g of services)for(const k of Object.keys(D[g]))assert.ok(S.some(x=>x.group===g&&x.key===k),g+'.'+k);assert.equal(S.filter(x=>x.unsupported).length,1);});
test('Normalization enforces mutually exclusive credits, finite numbers and excludes prototypes',()=>{const d=M.clone(D);d.Netflix.skipCredits=true;d.Netflix.watchCredits=true;d.General.sliderMin=30;d.General.sliderMax=10;d.Statistics.SegmentsSkipped=NaN;const r=M.normalize(d);assert.equal(r.Netflix.skipCredits,false);assert.equal(r.General.sliderMax,30);assert.equal(r.Statistics.SegmentsSkipped,0);assert.throws(()=>M.patch({}, {path:['__proto__','x'],value:1}));});
test('Original settings backup imports without losing service values',()=>{const d=M.clone(D);d.Amazon.xray=false;d.Crunchyroll.dubLanguage='Japanese';const restored=M.restore(d);assert.equal(restored.settings.Amazon.xray,false);assert.equal(restored.settings.Crunchyroll.dubLanguage,'Japanese');const exported=M.backup({settings:restored.settings,hiddenTitles:{X:{platform:'Netflix'}}});assert.equal(exported.settings.General.profileName,'');assert.ok(exported.hiddenTitles.X);assert.throws(()=>M.restore({app:'wrong'}));});
for(const service of services.concat('General'))test(service+' UI renders all settings and saves changes',async()=>{
 const dom=new JSDOM(read('options.html'),{url:'https://scene.test/options.html?preview=1#'+service,runScripts:'outside-only'});const w=dom.window;w.structuredClone=structuredClone;
 for(const f of ['defaults.js','schema.js','model.js','hidden-ui.js','ui.js'])w.eval(read(f));await new Promise(r=>setImmediate(r));
 for(const setting of S.filter(x=>x.group===service))assert.ok(w.document.querySelector(setting.key==='RatingThresholds'?'[data-threshold]':`[data-group="${service}"][data-key="${setting.key}"]`),service+'.'+setting.key);
 const input=w.document.querySelector('input[type="checkbox"][data-key]:not(:disabled)');if(input){const prev=input.checked;input.click();await new Promise(r=>setImmediate(r));assert.equal(input.checked,!prev);}
 w.close();
});
for(const [file,host]of Object.entries({netflix:'www.netflix.com',amazon:'www.primevideo.com',disney:'www.disneyplus.com',crunchyroll:'www.crunchyroll.com',max:'play.max.com',paramount:'www.paramountplus.com'}))test(file+' compiled engine initializes against a blank page',async()=>{
 const dom=new JSDOM('<html><head><title>Video</title></head><body></body></html>',{url:'https://'+host+'/browse',runScripts:'outside-only'});const w=dom.window;w.console={log(){},warn(){},error(){}};w.HTMLElement.prototype.checkVisibility=function(){return true;};
 const storage={settings:M.clone(D),sceneEnabled:true};w.browser={storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,storage[k]])),set:async v=>Object.assign(storage,v)},onChanged:{addListener(){}}},runtime:{sendMessage:async()=>({ok:true,value:{results:[],data:[]}}),onMessage:{addListener(){}}}};
 w.MutationObserver=class{observe(){}disconnect(){}};w.setInterval=()=>1;w.setTimeout=()=>1;
 w.eval(read('engine/'+file+'.js'));await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));w.close();
});
test('Background merges concurrent statistic updates and rejects external callers and credential reads',async()=>{
 const store={};let listener;const c={...context,URL,console,AbortSignal,fetch:async()=>{throw Error('network should not run');},importScripts(){},browser:{runtime:{getURL:()=> 'safari-web-extension://scene/',onMessage:{addListener:f=>listener=f}},storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,store[k]])),set:async v=>{await new Promise(r=>setImmediate(r));Object.assign(store,structuredClone(v));}}},action:{setBadgeText:async()=>{}}}};vm.runInNewContext(read('background.js'),c);
 const sender={url:'https://www.netflix.com/watch/1'},send=(m,s=sender)=>new Promise(r=>listener(m,s,r));
 await Promise.all(Array.from({length:12},()=>send({type:'engineWrite',key:'settings',patches:[{path:['Statistics','SegmentsSkipped'],value:1,delta:1}]})));assert.equal(store.settings.Statistics.SegmentsSkipped,12);
 assert.equal((await send({type:'credentials',key:'tmdbToken',value:'secret'})).ok,false);assert.equal((await send({type:'state'},{url:'https://netflix.com.evil.test'})).ok,false);
 store.tmdbToken='private';assert.ok(!JSON.stringify(await send({type:'state'})).includes('private'));
});

for(const [file,group,host,markup] of [
 ['netflix','Netflix','www.netflix.com','<button id="skip" data-uia="player-skip-intro">Skip</button>'],
 ['amazon','Amazon','www.primevideo.com','<div class="dv-player-fullscreen"><video></video></div><button id="skip" class="skipelement">Skip intro</button>'],
 ['max','HBO','play.max.com','<button id="skip" class="SkipButton-test">Skip</button>'],
 ['paramount','Paramount','www.paramountplus.com','<button id="skip" class="skip-button">Skip</button>'],
 ['disney','Disney','www.disneyplus.com','<skip-overlay></skip-overlay>'],
 ['crunchyroll','Crunchyroll','www.crunchyroll.com','<button id="skip" aria-label="Skip intro"><svg data-testid="skip-intro-icon"></svg></button>']
])for(const enabled of [true,false])test(`${file} intro fixture ${enabled?'clicks':'respects disabled switch'}`,async()=>{
 const dom=new JSDOM('<html><head><title>Video</title></head><body><video></video>'+markup+'</body></html>',{url:'https://'+host+'/watch/123',runScripts:'outside-only'}),w=dom.window;
 if(file==='disney'){const a=w.document.querySelector('skip-overlay').attachShadow({mode:'open'});a.innerHTML='<skip-button></skip-button>';a.firstChild.attachShadow({mode:'open'}).innerHTML='<button id="skip">Skip</button>';}
 const button=file==='disney'?w.document.querySelector('skip-overlay').shadowRoot.firstChild.shadowRoot.firstChild:w.document.getElementById('skip');let clicks=0;button.addEventListener('click',()=>clicks++);
 for(const video of w.document.querySelectorAll('video')){video.currentTime=20;Object.defineProperty(video,'paused',{value:false});Object.defineProperty(video,'duration',{value:1200});}
 const settings=M.clone(D);for(const g of services)for(const k in settings[g])if(typeof settings[g][k]==='boolean')settings[g][k]=false;settings[group].skipIntro=enabled;
 const storage={settings,sceneEnabled:true},observers=[],timeouts=[];
 w.console={log(){},warn(){},error(){}};w.HTMLElement.prototype.checkVisibility=()=>true;
 w.browser={storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,storage[k]])),set:async v=>Object.assign(storage,v)},onChanged:{addListener(){}}},runtime:{sendMessage:async()=>({ok:true,value:{results:[],data:[]}})}};
 w.MutationObserver=class{constructor(fn){this.fn=fn;}observe(){observers.push(this.fn);}disconnect(){}};w.setInterval=()=>1;w.setTimeout=(f,t)=>{timeouts.push([f,t]);return timeouts.length;};w.clearTimeout=()=>{};
 w.eval(read('engine/'+file+'.js'));await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));
 for(const fn of [...observers])await fn([],{});if(file==='crunchyroll')for(const [fn,delay] of [...timeouts])if(delay<=1000)await fn();
 assert.equal(clicks,enabled?1:0);w.close();
});
