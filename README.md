# OGQ GRAFOLIO 모바일 MVP

## (필독!!) 편집 전 깔아야 할 것들

### 1. Git 설치
- Cursor 화면에서 왼쪽 상단 'Terminal' 클릭, New Terminal 클릭
- 열린 창에 명령어 `git --version` 입력
- 에러 뜬다면 아래 링크 접속해 다운받고, cursor 껐다가 켜고 다시 터미널에 `git --version` 입력
- 설치 링크: https://git-scm.com/install/windows
- 에러 안뜨고 버전 정보 잘 뜬다면 설치 건너뛰어도 됨

### 2. Node.js
- 사이트 접속 후 다운로드 (꼭 LTS 버전으로 받아야 함! 다운 페이지 접속 시 보이는 버전 정보에 괄호 속 LTS 적혀있으면 됨. 기본값으로 두면 LTS로 되어 있을거야)
- 설치 링크: https://nodejs.org/en/download
- 마찬가지로 다운 후 Cursor 껐다가 터미녈 켜고 아래 명령어 입력해보고 반응 확인 (버전 정보 뜨면 잘 설치된거)
- 각 명령어는 따로따로 한번씩 실행해야 함!
- 명령어: `node -v`
- 명령어: `npm -v`
- 혹시나 오류 생긴다면 터미널 창의 에러 메세지 캡쳐해서 chatgpt한테 넘기기 ^-^

---

## (필독!!) GitHub에서 가져와서 편집 후 올리는 방법

### 1. 저장소 복제
- 딱 처음 한 번만 하면 됨!!
- Cursor에서 Terminal 열기
- 명령어 입력:  
  `git clone https://github.com/k0eeeee/OGQ_MVP.git`
- 그 다음 Terminal에 명령어 입력:  
  `cd grafolio-mvp`

### 2. 작업 시작할 때
- Terminal에 명령어 입력:  
  `git pull`
- 작업 시작 전에 무조건 해야 다른 사람이 수정한 버전으로 가져올 수 있음

### 3. 수정 후 다시 올릴 때
- Terminal에 아래 명령어들 순서대로 하나씩 입력
- 명령어 1: `git add .`
- 명령어 2: `git commit -m "수정한 내용 입력"`
- 명령어 3: `git push`

안되는거 있으면 GPT한테 물어보기~

---

이미지와 같은 구성의 5페이지 모바일 MVP 웹사이트입니다.

## 페이지 구성

1. **홈 (index.html)** – 로고, 제목·설명, 초록 버튼, 작가 카드 3종(무운, 므메미무, 에케호모)
2. **무운 (mouun.html)** – 첫 번째 카드 클릭 시, 대표 일러스트 3종
3. **므메미무 (meememimu.html)** – 두 번째 카드 클릭 시, 대표 일러스트 3종
4. **에케호모 (ekkehomo.html)** – 세 번째 카드 클릭 시, 대표 일러스트 3종
5. **의뢰 (request.html)** – 각 작가 페이지의 일러스트 클릭 시, 선택 이미지 + 폼 + 커미션 의뢰하기

## 이미지 저장 폴더

이미지는 **`assets/images/`** 아래에 두면 됩니다. 자세한 구조는 아래를 참고하세요.

```
assets/images/
├── home/           # 홈 작가 카드 3종
│   ├── artist1.png   (무운)
│   ├── artist2.png   (므메미무)
│   └── artist3.png   (에케호모)
├── mouun/          # 무운 대표 일러스트 3종
│   ├── illu1.png, illu2.png, illu3.png
├── meememimu/
│   ├── illu1.png, illu2.png, illu3.png
└── ekkehomo/
    ├── illu1.png, illu2.png, illu3.png
```

- `png` / `jpg` / `jpeg` 모두 사용 가능합니다. (의뢰 페이지 선택 이미지는 `png` → `jpg` → `jpeg` 순으로 시도합니다.)
- 이미지를 넣기 전에는 회색 플레이스홀더가 보입니다.

자세한 설명은 **`assets/images/README.md`** 를 참고하세요.

## 실행 방법

### 1) 로컬 서버로 실행 (권장 – 엑셀 기록 사용 시)

엑셀(CSV) 기록과 외부 설문지 이동을 쓰려면 반드시 서버를 띄워야 합니다.

```bash
cd grafolio-mvp
npm run server
```

이후 브라우저에서 **http://localhost:3000** 으로 접속합니다.

- **엑셀 기록 파일:** `data/commission_records.csv`  
  - `커미션 의뢰하기` 클릭 시, 선택한 옵션과 요청사항이 여기에 한 줄씩 추가됩니다.  
  - Excel에서 `data/commission_records.csv` 를 열어 확인할 수 있습니다.

### 2) 정적 파일만 사용

`index.html` 을 더블클릭하거나, 별도 웹 서버로 `grafolio-mvp` 폴더를 serving 하면 5페이지 이동과 폼 입력까지 확인할 수 있습니다.  
단, `file://` 로 열면 **엑셀 기록 API**(`/api/record`)는 동작하지 않고, **외부 설문지로 이동**만 됩니다.

## 설정

- **외부 설문지 URL**  
  `js/config.js` 에서 `EXTERNAL_SURVEY_URL` 을 실제 설문지 주소(예: Google 폼)로 바꾸세요.  
  `커미션 의뢰하기` 클릭 시 이 주소로 이동합니다.

- **API 주소**  
  기본값 `API_BASE = ''` 이면 같은 호스트의 `/api/record` 를 사용합니다.  
  다른 도메인에 API를 두었다면 `API_BASE` 에 해당 서버 주소를 넣으면 됩니다.

## 디자인

- 글씨체: **Inter**
- 배경: **#ffffff**
- 제목: **#000000**
- 설명: **#9F9F9F**
- 초록 버튼 배경·선택지 외곽선: **#00B57F**
>>>>>>> 62f8093 (첫 틀 만들기)
