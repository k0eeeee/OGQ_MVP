(function () {
  'use strict';

  var ARTIST_NAMES = { mouun: '무운mouun', meememimu: '므메미무', ekkehomo: '에케호모' };

  // URL에서 artist, img 파라미터 읽기
  function getParams() {
    var p = {};
    var q = (window.location.search || '').replace(/^\?/, '').split('&');
    for (var i = 0; i < q.length; i++) {
      var parts = q[i].split('=');
      if (parts[0]) p[decodeURIComponent(parts[0])] = decodeURIComponent((parts[1] || ''));
    }
    return p;
  }

  // 선택 이미지 세팅 (확장자: png → jpg → jpeg 순으로 시도)
  function initSelectedImage() {
    var params = getParams();
    var artist = params.artist;
    var img = params.img;
    var el = document.getElementById('selectedImage');
    var placeholder = document.getElementById('placeholderText');
    var exts = ['png', 'jpg', 'jpeg'];
    var idx = 0;

    if (!artist || !img) {
      el.style.display = 'none';
      placeholder.style.display = 'flex';
      return;
    }

    el.style.display = '';
    placeholder.style.display = 'none';

    function tryNext() {
      if (idx >= exts.length) {
        el.style.display = 'none';
        placeholder.style.display = 'flex';
        return;
      }
      el.src = 'assets/images/' + artist + '/illu' + img + '.' + exts[idx];
      idx += 1;
    }

    el.onerror = tryNext;
    tryNext();
  }

  // 옵션 버튼: 한 그룹당 하나만 선택, '기타' 시 주관식 표시
  function bindOptionButtons() {
    var blocks = document.querySelectorAll('.form-block');
    for (var b = 0; b < blocks.length; b++) {
      var opts = blocks[b].querySelectorAll('.btn-option');
      var otherWrap = blocks[b].querySelector('.other-inline');
      var otherInput = otherWrap ? otherWrap.querySelector('input') : null;

      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener('click', function () {
          var group = this.closest('.options');
          var block = this.closest('.form-block');
          var isOther = this.classList.contains('btn-other');
          var otherId = this.getAttribute('data-other');
          var wrap = block.querySelector('.other-inline');
          var inp = wrap ? wrap.querySelector('input') : null;

          // 같은 그룹 내 선택 토글
          var siblings = group.querySelectorAll('.btn-option');
          for (var s = 0; s < siblings.length; s++) siblings[s].classList.remove('selected');
          this.classList.add('selected');

          // 기타: 주관식 표시/숨김
          if (wrap) {
            if (isOther) {
              wrap.classList.add('visible');
              if (inp) inp.focus();
            } else {
              wrap.classList.remove('visible');
              if (inp) inp.value = '';
            }
          }
        });
      }
    }
  }

  // 폼 값 수집 (클릭한 버튼 값 + 기타 입력값)
  function collectFormData() {
    var params = getParams();
    var data = {
      artist: params.artist || '',
      artistName: params.artist ? (ARTIST_NAMES[params.artist] || params.artist) : '',
      img: params.img || '',
      assetType: '',
      clientCount: '',
      exclusiveUse: '',
      requestNote: (document.getElementById('requestNote') || {}).value || ''
    };

    var blocks = document.querySelectorAll('.form-block');
    for (var i = 0; i < blocks.length; i++) {
      var optsEl = blocks[i].querySelector('.options');
      if (!optsEl) continue;
      var name = optsEl.getAttribute('data-name');
      if (!name) continue;

      var sel = blocks[i].querySelector('.btn-option.selected');
      var val = sel ? sel.getAttribute('data-value') : '';
      var wrap = blocks[i].querySelector('.other-inline.visible');
      var inp = wrap ? wrap.querySelector('input') : null;
      if (val === '기타' && inp && inp.value.trim()) val = inp.value.trim();

      if (name === 'assetType') data.assetType = val;
      else if (name === 'clientCount') data.clientCount = val;
      else if (name === 'exclusiveUse') data.exclusiveUse = val;
    }

    data.timestamp = new Date().toISOString();
    return data;
  }

  // 필수 옵션 선택 확인 (assetType, clientCount, exclusiveUse)
  function validateRequiredOptions() {
    var requiredNames = ['assetType', 'clientCount', 'exclusiveUse'];
    var missingTitles = [];

    for (var i = 0; i < requiredNames.length; i++) {
      var name = requiredNames[i];
      var optionsEl = document.querySelector('.form-block .options[data-name="' + name + '"]');
      if (!optionsEl) continue;

      var selected = optionsEl.querySelector('.btn-option.selected');
      if (!selected) {
        var block = optionsEl.closest('.form-block');
        var titleEl = block ? block.querySelector('.block-title') : null;
        var titleText = titleEl ? titleEl.textContent.trim() : '';
        if (titleText) missingTitles.push(titleText);
        continue;
      }

      // '기타' 선택 시 주관식 입력이 비어있으면 미선택으로 처리
      var isOther = selected.classList.contains('btn-other') || selected.getAttribute('data-value') === '기타';
      if (isOther) {
        var otherId = selected.getAttribute('data-other');
        var otherInput = otherId ? document.getElementById(otherId) : null;
        if (!otherInput || !otherInput.value || !otherInput.value.trim()) {
          var block2 = optionsEl.closest('.form-block');
          var titleEl2 = block2 ? block2.querySelector('.block-title') : null;
          var titleText2 = titleEl2 ? titleEl2.textContent.trim() : '';
          if (titleText2) missingTitles.push(titleText2);
        }
      }
    }

    if (missingTitles.length > 0) {
      return { ok: false, titles: missingTitles };
    }

    return { ok: true, titles: [] };
  }

  // 안내 모달 열기/닫기
  function showAlertModal(message) {
    var modal = document.getElementById('alertModal');
    var msgEl = document.getElementById('alertModalMessage');
    if (!modal || !msgEl) return;

    msgEl.textContent = message;
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideAlertModal() {
    var modal = document.getElementById('alertModal');
    if (!modal) return;
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  // 서버 또는 구글 시트에 기록 (GOOGLE_SHEET_WEB_APP_URL 우선, 없으면 /api/record)
  // sendBeacon 사용: 응답을 기다리지 않고, 페이지 이동(설문 리다이렉트) 시에도 전송이 완료되도록 함
  function recordToServer(data) {
    var url;
    if (typeof GOOGLE_SHEET_WEB_APP_URL !== 'undefined' && GOOGLE_SHEET_WEB_APP_URL) {
      url = GOOGLE_SHEET_WEB_APP_URL;
    } else {
      var base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : '';
      url = base + '/api/record';
    }
    var body = JSON.stringify(data);
    // text/plain: CORS 사전요청(OPTIONS) 없이 전송되어, Google Apps Script 콜드스타트/지연 시에도 설문 이동이 막히지 않음
    var blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).catch(function () {});
    }
  }

  // 제출: 기록 후 외부 설문지로 이동
  function bindSubmit() {
    var btn = document.getElementById('submitBtn');
    var surveyUrl = (typeof EXTERNAL_SURVEY_URL !== 'undefined' && EXTERNAL_SURVEY_URL)
      ? EXTERNAL_SURVEY_URL
      : '#';

    btn.addEventListener('click', function () {
      var validation = validateRequiredOptions();
      if (!validation.ok) {
        var titles = (validation.titles && validation.titles.length)
          ? validation.titles.join(', ')
          : '필수';
        showAlertModal(titles + ' 옵션을 선택해주세요.');
        return;
      }

      var data = collectFormData();
      btn.disabled = true;
      btn.textContent = '처리 중...';

      recordToServer(data);
      window.location.href = surveyUrl;
    });
  }

  // 초기화
  initSelectedImage();
  bindOptionButtons();
  bindSubmit();

  // 모달 확인 버튼 및 배경 클릭으로 닫기
  var modalConfirmBtn = document.getElementById('alertModalConfirmBtn');
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', hideAlertModal);
  }
  var alertModal = document.getElementById('alertModal');
  if (alertModal) {
    alertModal.addEventListener('click', function (e) {
      if (e.target === alertModal) hideAlertModal();
    });
  }
})();
