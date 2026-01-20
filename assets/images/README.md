# OGQ GRAFOLIO MVP - 이미지 저장 폴더

이 폴더에 다음 경로에 맞춰 이미지 파일을 배치해주세요.

## 경로 구조

```
assets/images/
├── home/                    # 첫 페이지(홈) - 나란히 등장하는 세 가지 이미지
│   ├── artist1.png         # 무운mouun (첫 번째)
│   ├── artist2.png         # 므메미무 (두 번째)
│   └── artist3.png         # 에케호모 (세 번째)
├── mouun/                   # 무운 작가 페이지 - 대표 일러스트 3종
│   ├── illu1.png           # 대표 일러스트 1
│   ├── illu2.png           # 대표 일러스트 2
│   └── illu3.png           # 대표 일러스트 3
├── meememimu/               # 므메미무 작가 페이지 - 대표 일러스트 3종
│   ├── illu1.png
│   ├── illu2.png
│   └── illu3.png
└── ekkehomo/                # 에케호모 작가 페이지 - 대표 일러스트 3종
    ├── illu1.png
    ├── illu2.png
    └── illu3.png
```

## 파일 형식

- 홈·작가 상세 페이지: 코드에서 `.png`를 사용합니다. `.jpg`를 쓰려면 해당 HTML의 `src` 확장자를 `.jpg`로 바꾸거나, 파일을 `.png`로 저장하세요.
- 의뢰 페이지의「선택한 이미지」: `.png` → `.jpg` → `.jpeg` 순으로 시도하므로, 이 세 확장자면 그대로 사용할 수 있습니다.

## HTML에서 사용하는 경로

- 홈 작가 카드: `assets/images/home/artist1.png`, `artist2.png`, `artist3.png`
- 무운: `assets/images/mouun/illu1.png`, `illu2.png`, `illu3.png`
- 므메미무: `assets/images/meememimu/illu1.png`, `illu2.png`, `illu3.png`
- 에케호모: `assets/images/ekkehomo/illu1.png`, `illu2.png`, `illu3.png`

이미지를 넣기 전에는 회색 플레이스홀더가 표시됩니다.
