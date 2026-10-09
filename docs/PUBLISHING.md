# GitHub 공개와 홈페이지 배포

이 폴더가 저장소 루트입니다. 새 공개 저장소에 올릴 때 README.md, index.html, docs/, extension/, source/, package.json, package-lock.json, scripts/, 라이선스·고지·정책 파일과 downloads/를 함께 포함하세요. node_modules, 개인 백업, 인증 값은 올리지 마세요.

## 릴리스

1. `npm ci`, `npm run build`, `npm run package`로 배포 ZIP을 만듭니다.
2. GitHub Releases에서 `v0.4.1`을 만들고 **pre-release**로 표시합니다.
3. `downloads/FlowSkip-Safari-0.4.1.zip`을 첨부하고 CHANGELOG의 변경과 베타 제한을 설명합니다.
4. GPL 대응 소스와 LICENSE, SOURCE.md, 의존성 고지가 함께 제공되는지 확인합니다.

README의 상대 다운로드 링크는 저장소에서도 동작합니다. Releases 주소가 정해지면 README와 index.html의 링크를 해당 배포 파일 URL로 변경할 수 있습니다. 미래 버전은 manifest/package의 버전과 홈페이지·문서의 다운로드 파일명도 함께 갱신하세요.

## GitHub Pages

저장소 Settings → Pages → Deploy from a branch → main → /(root) → Save를 선택합니다. 루트의 index.html이 홈페이지가 됩니다. docs/images와 downloads의 상대 링크는 별도 도메인 설정 없이 사용할 수 있습니다. Pages에서 .md 링크는 원문 파일로 열릴 수 있으며 핵심 설치·사용 안내는 index.html 자체에도 들어 있습니다.

저장소 주소와 도메인은 아직 정하지 않았으므로 존재하지 않는 GitHub URL이나 가짜 다운로드 링크를 넣지 않았습니다. 이 패키지는 로컬 공개 준비물이며 자동으로 GitHub에 업로드하지 않습니다.

## 영구 설치 배포

현재 ZIP은 임시 개발 설치용입니다. 일반 사용자에게 영구 설치 앱으로 배포하려면 Apple의 Safari Web Extension 패키징, 서명과 배포 절차를 별도로 진행해야 합니다.

- [Safari Extensions](https://developer.apple.com/safari/extensions/)
- [Running your Safari web extension](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)

서비스별 실제 동작 확인과 피드백 반영 전에는 안정 버전 또는 모든 서비스 완전 지원으로 홍보하지 마세요.
