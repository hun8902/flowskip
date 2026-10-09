import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
const plugins=[{name:'source-alias',setup(build){build.onResolve({filter:/^@\/content-script\//},args=>({path:path.join(root,'source/engine',args.path.split('/').at(-1)+'.ts')}));build.onResolve({filter:/^webext-bridge\/content-script$/},()=>({path:path.join(root,'source/bridge.ts')}));}}];
await esbuild.build({absWorkingDir:root,entryPoints:['source/defaults.ts'],outfile:'source/defaults.cjs',bundle:true,platform:'node',format:'cjs'});
const {defaultSettings}=await import('./source/defaults.cjs');
fs.writeFileSync('extension/defaults.js','globalThis.SceneDefaults='+JSON.stringify(defaultSettings,null,2)+';');
for(const name of ['netflix','amazon','disney','crunchyroll','max','paramount']){
 await esbuild.build({absWorkingDir:root,entryPoints:[`source/engine/${name}.ts`],outfile:`extension/engine/${name}.js`,bundle:true,format:'iife',target:'safari17',plugins,inject:['source/inject.ts'],define:{'process.env.NODE_ENV':'"production"'},banner:{js:'/* FlowSkip · engine derived from Streaming enhanced 1.1.108 · GPL-3.0. See LICENSE and SOURCE.md. */'},footer:{js:''}});
 const file=`extension/engine/${name}.js`;const code=fs.readFileSync(file,'utf8');fs.writeFileSync(file,`(async()=>{const api=globalThis.browser||globalThis.chrome;const d=await api.storage.local.get('sceneEnabled');if(d.sceneEnabled===false)return;\n${code}\n})();`);
}
fs.copyFileSync('source/extras.js','extension/extras.js');
console.log('Built all six streaming engines.');

for (const name of ['LICENSE','SOURCE.md','THIRD-PARTY-NOTICES.txt']) fs.copyFileSync(name, 'extension/'+name);
