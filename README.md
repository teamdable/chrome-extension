# Dable Chrome Extension

## 사용법

### 개발 모드

1. `npm start`로 개발 모드 시작
2. 크롬 `확장 프로그램 관리` 메뉴에서 `개발자 모드` 켜고 `압축해제된 확장 프로그램 로드`  
  ![load](https://user-images.githubusercontent.com/119575126/205635748-0af610a7-4275-4b6a-8e15-d1c51977b544.png)
3. 프로젝트 루트 폴더의 `dist` 폴더 선택  
  ![dist](https://user-images.githubusercontent.com/119575126/205636107-d68881f0-e96f-48d2-9f50-2bff59fb781f.png)

코드를 변경하면 바로 반영됩니다. 다만 보고있던 페이지를 리프레시할 필요가 있을 수 있습니다.

### 배포

1. `npm run pack`을 실행하여 `.zip` 파일 생성
2. 버전은 `package.json`에 있는 버전 번호를 그대로 따릅니다.
3. 그대로 크롬 웹 스토어에 등록하면 됩니다.

## 구버전(v0.0.18)과 달라진 점

- Vite 번들러를 적용했습니다.
- TypeScript를 사용합니다.
- Preact를 사용했습니다. React와 거의 동일한 느낌으로 개발 가능하지만 번들 용량이 훨씬 작습니다.
- 개발 모드에서는 아이콘이 빨간색으로 변합니다.  
  ![dev_icon](https://user-images.githubusercontent.com/119575126/205636992-ff19fccb-cbfc-47e3-a130-c61f92ad7c4f.png)
- 코드 변경 즉시 반영됩니다.
- 기존 코드보다 빠르게 위젯 갯수를 확인합니다.  
  ![performance](https://user-images.githubusercontent.com/119575126/205639473-5d3e278e-b05e-489c-a338-0c892248705e.gif)
- 더 정확하게 위젯 갯수를 집계합니다. (기존 확장기능은 때때로 중복 집계 - 위 영상 참고)
- 버튼 색상과 아이콘을 적용하여 미미하게 디자인이 나아졌습니다.
- API 주소를 편하게 복사할 수 있습니다. (주소 옆 복사 아이콘 클릭)
- 위젯 위치 확인할 때 더 잘 보이도록 "HERE!"라는 글자가 나타납니다.
- 이 정도 변화면 마이너 버전은 올려도 될 것 같아서 `0.1.1`로 판올림했습니다.

## TODO

- 테스트 코드 추가 (Unit + E2E)
- 버그 보고용 시스템 정보 간편 복사 기능 (클릭하면 관련 정보를 클립보드에)
- Lint, Prettier 등의 표준 도구 적용
