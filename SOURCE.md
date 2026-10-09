# Source and license

FlowSkip 0.4.1 derives from Streaming enhanced / Netflix-Prime-Auto-Skip by Dreamlinerm (Marvin Krebber) and contributors, under GPL-3.0. Earlier local versions were named Scene.

- Upstream: https://github.com/Dreamlinerm/Netflix-Prime-Auto-Skip
- Version: 1.1.108
- Commit: 12c9d1a9b7e8cf4300f903ad1da1ae115596bb4f
- License: see LICENSE.

## Corresponding source

source/engine contains the six service engines and shared engine derived from upstream src/content-script. source/defaults.ts derives from src/stores/storeTypes.ts. source/ko.json and source/en.json retain upstream translations.

The extension UI, local storage adapter, runtime bridge, background request handling, hidden-title library, build scripts and documentation are FlowSkip changes. Internal Scene-prefixed identifiers and storage keys remain for compatibility; the public product name is FlowSkip.

## Modifications

- Korean settings and popup UI with service grouping, search, light/dark appearance and backup management.
- Safari local storage adapter, serialized setting writes and runtime messaging.
- Personal optional TMDB/MAL authentication; upstream private authentication values are not redistributed.
- Safer keyboard shortcut/text-entry handling, guarded controls and Prime Video scroll recovery.
- Netflix fullscreen gesture, ad state restoration, seeking guards, 16x-first ad acceleration and transition observation.
- macOS does not apply the upstream Firefox Android user-agent override.
- Screenshot-based installation/manual documentation, static homepage, packaging and contributor files.

## Building

Use Node.js 22.12+ and npm: `npm ci`, `npm run build`. On macOS, `npm run package` uses the system zip utility to create a ready-to-load archive. These commands do not run tests. Optional fixtures are in tests/; they do not establish live service compatibility.

Vue and esbuild are MIT-licensed; notices are in THIRD-PARTY-NOTICES.txt. Dependency versions are locked in package-lock.json. Source archives exclude node_modules and include the build instructions and corresponding editable source.

Redistribution must preserve the GPL license, upstream credit and access to corresponding source. FlowSkip is not affiliated with Apple, Netflix, Amazon, Disney, Crunchyroll, HBO, Paramount, TMDB or MyAnimeList.
