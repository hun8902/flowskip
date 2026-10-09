// Apply reviewed Safari fixes to the copied GPL engine. Idempotent.
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'engine');
const services={netflix:'Netflix',amazon:'Amazon',disney:'Disney',crunchyroll:'Crunchyroll',max:'HBO',paramount:'Paramount'};
for(const [file,group]of Object.entries(services)){
 const p=path.join(root,file+'.ts');let s=fs.readFileSync(p,'utf8');
 const marker='// Scene: respect disabled settings and text entry.';
 if(!s.includes(marker))s=s.replaceAll('document.addEventListener("keydown", (event: KeyboardEvent) => {',`document.addEventListener("keydown", (event: KeyboardEvent) => {\n\t\t${marker}\n\t\tif (!settings.value.${group}?.speedSlider || event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement)?.closest?.('input,textarea,select,[contenteditable="true"]')) return;`);
 if(!s.includes('if (!settings.value.Video.doubleClick) return;'))s=s.replaceAll('document.ondblclick = function () {','document.ondblclick = function () {\n\t\tif (!settings.value.Video.doubleClick) return;');
 s=s.replace('const isFirefox = typeof browser !== "undefined"','const isFirefox = /Firefox\\//.test(navigator.userAgent)');
 s=s.replace('if (sliderChildren.length > 2)', 'if (sliderChildren && sliderChildren.length > 2)');
 if(file==='paramount')s=s.replace('if (adTime > 0 && !lastAdTimeText)', 'if (video && adTime > 0 && !lastAdTimeText)');
 if(file==='amazon'){
  s=s.replace('document.addEventListener("scroll", () => {\n\t\tdocument.body.style.pointerEvents = "none"\n\t})','document.addEventListener("scroll", () => {\n\t\tif (!settings.value.Amazon.improveUI) return;\n\t\tdocument.body.style.pointerEvents = "none";\n\t\tclearTimeout(timer);\n\t\ttimer = setTimeout(() => { document.body.style.pointerEvents = "auto" }, 450);\n\t})');
 }
 fs.writeFileSync(p,s);
}
