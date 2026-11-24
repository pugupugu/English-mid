# Wordwise · 중학 영어 어휘 학습

중학교 **중급 500 + 고급 500 = 1,000단어**를 *단어 풀이(쉬운 설명·어근·뉘앙스) → 예문 4개(번역·발음 듣기) → 확인 문제* 순서로 익히는 정적 웹 서비스입니다.
구조는 [말결(국어 어휘)](https://pugupugu.github.io/korean/)과 동일합니다.

- 순수 HTML/CSS/JS (빌드 없음). `index.html`을 열면 동작합니다.
- 단어 데이터: `data/*.js` (`window.WORDS`). 예문의 `[[ ]]` 안이 학습 대상 단어입니다. 작성 규칙은 `tools/SPEC.md`.
- 퀴즈 12유형 + 종합, 오답 노트, 발음 듣기(브라우저 음성합성).
- 학습 기록(학습 완료·오답)은 브라우저 localStorage에만 저장됩니다.
- 검증: `node tools/check_all.js` (총 개수·중복 확인), `node tools/validate.js <파일> <레벨> <개수> <알파벳>`.
