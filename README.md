# Image Transform Studio

이미지를 캔버스 위에서 원근 변형(perspective warp), 크롭, 분할, 프레임 적용까지 실시간으로 처리하는 데스크톱 앱. React + Konva로 캔버스를 그리고, Electron과 Tauri 두 가지 방식으로 데스크톱 빌드를 만든다.

## 개요

### 기능

- **원근 변형**: 이미지의 네 꼭짓점을 드래그해서 원하는 사다리꼴 형태로 왜곡
- **크롭**: 프레임 미리보기를 보면서 자르기 영역 지정, 다운로드
- **분할(Split) 모드**: 이미지를 여러 조각으로 나눠 ZIP으로 일괄 다운로드
- **프레임**: 다양한 색상/선 스타일의 프레임을 합성
- WebP로 변환해 다운로드, 미리보기는 저품질로 렌더링해 반응성 확보

### 기술 스택

- React + TypeScript + Vite
- `react-konva` — 캔버스 렌더링
- Jotai — 변형/프레임/분할 모드 상태 관리
- Electron, Tauri(Rust) — 듀얼 데스크톱 빌드

### 실행

```bash
npm install
npm run dev       # Vite dev 서버
```

## 폴더 구조

```
image-transform/
├── src/
│   ├── pages/
│   │   ├── home/
│   │   ├── image-processor/     # 원근 변형, 크롭, 프레임
│   │   └── image-split/         # 분할 후 ZIP 다운로드
│   ├── widgets/
│   │   └── image-processor/     # PerspectiveTransformImage 등 캔버스 위젯
│   ├── features/
│   │   ├── image-upload/        # react-dropzone 업로드
│   │   └── free-transform/      # 자유 변형 핸들
│   └── shared/
│       ├── stores/              # Jotai atom (변형/프레임/분할 상태)
│       ├── lib/                 # warpImagePerspective 등 이미지 연산
│       ├── utils/               # WebP 변환, 리사이즈
│       ├── ui/                  # 공용 컴포넌트
│       ├── config/
│       └── types/
├── electron/                    # Electron 메인 프로세스
├── src-tauri/                   # Tauri(Rust) 셸
└── vite.config.ts
```

## 데스크톱 빌드

Electron과 Tauri 두 가지 방식을 모두 지원한다.

### Electron

```bash
npm run electron:dev      # Vite dev 서버 + Electron 동시 실행
npm run electron:build    # electron-builder로 패키징
```

### Tauri

Rust 툴체인이 설치되어 있어야 한다.

```bash
npm run tauri:dev
npm run tauri:build
```

### 웹 빌드

```bash
npm run build
npm run preview
npm run lint
```

## 트러블슈팅

1. **원근 변형 핸들을 드래그할 때마다 미리보기가 버벅임** — 매 프레임마다 풀사이즈 원본 이미지로 워프 연산을 다시 계산해서 느렸다.
2. **프레임 설정을 사이드바에서 바꿔도 캔버스 미리보기에 바로 반영되지 않는 경우가 있었음.**
3. **캔버스가 리렌더링될 때마다 다시 생성되는 문제가 있었음(`fix: canvas 최초생성 한번망 사용`).**

## 원인분석

1. `PerspectiveTransformImage` 컴포넌트가 이미지가 바뀔 때마다 원본 해상도 그대로 `warpImagePerspective`를 호출하고 있었다. 드래그 중에는 매 마우스 이동마다 이 연산이 실행되니 큰 이미지일수록 렉이 심했다.
2. 프레임 파이프라인과 사이드바 컨트롤의 상태 갱신 타이밍이 어긋나서, 컨트롤 값은 바뀌었는데 변형 함수가 이전 값을 참조하는 클로저 문제가 있었다.
3. 캔버스 엘리먼트를 컴포넌트 렌더링 로직 안에서 매번 새로 만들고 있어서, 리렌더링될 때마다 캔버스 컨텍스트가 초기화됐다.

## 해결

1. `useCallback` + `useRef`로 변형 함수를 감싸고 150ms 디바운스를 적용해서 드래그가 멈춘 뒤에만 실제 연산이 돌도록 했다. 미리보기용으로는 최대 800px로 리사이즈한 이미지를 WebP 품질 0.5로 렌더링해서 계산량을 줄였다(`src/widgets/image-processor/components/PerspectiveTransformImage.tsx`, 커밋 `f042295`).
2. 프레임 파이프라인과 사이드바 컨트롤이 같은 소스(Jotai atom)를 구독하도록 동기화해서 상태 불일치를 없앴다(커밋 `1e749f4`, fix: sync frame pipeline and sidebar controls).
3. 캔버스를 컴포넌트 최초 마운트 시 한 번만 생성하고 이후에는 재사용하도록 고쳤다(커밋 `107d032`).
