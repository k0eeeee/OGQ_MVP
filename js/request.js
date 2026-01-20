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
      var name = (blocks[i].querySelector('.options') || {}).getAttribute('data-name');
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

  // 서버에 기록 (엑셀 저장용) — 서버 미사용 시 실패해도 진행
  function recordToServer(data) {
    var base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : '';
    return fetch(base + '/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(function () {});
  }

  // 제출: 기록 후 외부 설문지로 이동
  function bindSubmit() {
    var btn = document.getElementById('submitBtn');
    var surveyUrl = (typeof EXTERNAL_SURVEY_URL !== 'undefined' && EXTERNAL_SURVEY_URL)
      ? EXTERNAL_SURVEY_URL
      : '#';

    btn.addEventListener('click', function () {
      var data = collectFormData();
      btn.disabled = true;
      btn.textContent = '처리 중...';

      recordToServer(data).finally(function () {
        window.location.href = surveyUrl;
      });
    });
  }

  // 초기화
  initSelectedImage();
  bindOptionButtons();
  bindSubmit();
})();
