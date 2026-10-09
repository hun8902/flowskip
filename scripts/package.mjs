import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
const destination = path.join(root, 'downloads', `FlowSkip-Safari-${manifest.version}.zip`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
// Remove only this generated archive so deleted files cannot linger in an older ZIP.
fs.rmSync(destination, { force: true });
const result = spawnSync('zip', ['-q', '-r', destination, '.', '-x', '*.DS_Store'], {
  cwd: path.join(root, 'extension'), stdio: 'inherit'
});
if (result.error) throw new Error('The macOS zip command is required: ' + result.error.message);
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Created ${path.relative(root, destination)}`);
