# Google 스프레드시트 실시간 기록 설정

배포(Netlify, Vercel, GitHub Pages 등) 후에는 서버가 없어 **CSV 파일 저장이 불가**합니다.  
대신 **Google Apps Script**로 선택 항목을 **구글 스프레드시트에 실시간 기록**할 수 있습니다.

- '커미션 의뢰하기' 클릭 → 선택 항목이 시트에 바로 한 줄 추가 → 설문지(Google Form)로 이동

---

## 1. Google 스프레드시트 만들기

1. [Google 스프레드시트](https://sheets.google.com)에서 **새 스프레드시트** 생성
2. 첫 번째 시트 이름을 `커미션 의뢰` 등 원하는 이름으로 지정 (그대로 둬도 됨)

---

## 2. Apps Script 프로젝트 만들기

1. 스프레드시트 메뉴에서 **확장 프로그램** → **Apps Script** 선택
2. 기본 `function myFunction() {}` 코드는 **전부 지우고**, 아래 코드를 **그대로 붙여넣기**

```javascript
var SHEET_HEADER = ['timestamp', 'artist', 'artistName', 'img', 'assetType', 'clientCount', 'exclusiveUse', 'requestNote'];

function doOptions() {
  return createCorsResponse('');
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    // text/plain 또는 application/json 모두 동일하게 JSON 문자열로 전달됨
    var params = JSON.parse(raw);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, SHEET_HEADER.length).setValues([SHEET_HEADER]);
    }

    sheet.appendRow([
      params.timestamp || '',
      params.artist || '',
      params.artistName || '',
      params.img || '',
      params.assetType || '',
      params.clientCount || '',
      params.exclusiveUse || '',
      (params.requestNote || '').replace(/\r?\n/g, ' ')
    ]);

    return createCorsResponse(JSON.stringify({ ok: true }));
  } catch (err) {
    return createCorsResponse(JSON.stringify({ ok: false, error: String(err) }));
  }
}

function createCorsResponse(body) {
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

3. **저장** (Ctrl+S / Cmd+S)

---

## 3. Web App으로 배포

1. 상단 **배포** → **새 배포**
2. **유형 선택** 옆 연필 아이콘 → **웹 앱** 선택
3. 설정:
   - **설명**: `커미션 의뢰 기록` 등 (아무거나)
   - **다음 사용자로 실행**: **나**
   - **액세스 권한**: **모든 사용자** (중요: 이렇게 해야 외부 사이트에서 전송 가능)
4. **배포** 클릭
5. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfy.../exec`)

---

## 4. 프로젝트 설정에 URL 넣기

`js/config.js`를 열고, `GOOGLE_SHEET_WEB_APP_URL`에 방금 복사한 URL을 넣습니다.

```javascript
var GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```

배포 후에는 이 값만 설정하면, **CSV 없이** 구글 스프레드시트에만 기록됩니다.

---

## 5. 로컬에서 테스트

- **CSV(로컬 서버)만 쓰려면**: `GOOGLE_SHEET_WEB_APP_URL`를 **빈 문자열** `''`로 두고, `npm run server` 실행 후 **http://localhost:3000**으로 접속해 사용.
- **구글 시트만 쓰려면**: `GOOGLE_SHEET_WEB_APP_URL`에 위 Web App URL을 넣으면, 로컬에서 파일만 열어도(또는 배포 사이트에서도) 구글 시트에 기록됩니다.

---

## 6. 링크/CSV가 안 될 때 (로컬)

- **설문지 링크**: `config.js`의 `EXTERNAL_SURVEY_URL`이 올바른 Google Form 주소인지 확인.
- **CSV 미생성**: `GOOGLE_SHEET_WEB_APP_URL`이 비어 있을 때, **반드시 `node server.js`(또는 `npm run server`)로 서버를 띄우고**, 브라우저에서 **http://localhost:3000/request.html?...** 으로 접속해야 ` /api/record`가 동작합니다.  
  - `request.html`을 `file://`로 열면 `/api/record` 호출이 실패해 CSV가 생성되지 않습니다.
