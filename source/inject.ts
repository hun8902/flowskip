export {ref,watch,toRaw,computed,nextTick,reactive} from 'vue';
export {useBrowserSyncStorage,useBrowserLocalStorage} from './storage';
export {defaultSettings} from './defaults';
export const browser=globalThis.browser||globalThis.chrome;
