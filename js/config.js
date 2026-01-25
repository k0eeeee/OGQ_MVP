/**
 * OGQ GRAFOLIO MVP - 설정
 * 필요에 따라 아래 값을 수정하세요.
 */

// 커미션 의뢰하기 버튼 클릭 시 연결되는 외부 설문지 URL (실제 설문지 링크로 변경)
var EXTERNAL_SURVEY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScJjLM0gVOA8GWg8d-ZS-UDWlQF7s8KrRcWuzX5l-dEIW7MLA/viewform?usp=header';

// [배포 시 필수] Google 스프레드시트 실시간 기록용 Web App URL
// Google Apps Script 배포 후 받은 URL을 입력하세요. (설정 방법: GOOGLE_SHEET_SETUP.md 참고)
// 설정하면 '커미션 의뢰하기' 클릭 시 선택 항목이 구글 시트에 바로 기록된 뒤 설문지로 이동합니다.
// 비워두면 로컬 서버의 /api/record(CSV 저장)를 사용합니다. (배포 환경에서는 CSV 불가 → 반드시 설정 권장)
var GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxWFCL3i5TGaFUYR4vBSQmvrNRnAXg1sDVYLOBW4A76wN96ANhJHL2BYEP_bQKQuMg/exec';

// 엑셀(CSV) 기록 API 베이스. 로컬에서 node server.js 사용 시 빈 문자열, 다른 서버에 띄운 경우 예: 'https://api.example.com'
// ※ 로컬 CSV를 쓰려면 반드시 http://localhost:3000 으로 접속 후 사용하세요. (파일 직접 열기 시 /api/record 미동작)
var API_BASE = '';
