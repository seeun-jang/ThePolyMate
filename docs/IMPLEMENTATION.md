# Poly-Mate · React 기말 프로젝트

배움과 일상에 다정함을 더하는 나만의 메이트. 1학기 제작한 ThePolyMate의 시작, 로그인, 메인, 학습 상세, 테마 선택 5페이지를 React 함수형 컴포넌트로 재구현했습니다.

- 원본 및 메인 개발 저장소: https://github.com/seeun-jang/ThePolyMate
- 웹프로그래밍활용 수업 및 제출 저장소: https://github.com/seeun-jang/Web2Projects
- 기반 원본 커밋: `e9a7821bb4f98620fcbaf94d4eb0a6cd53217c67`

## 실행

Node.js 22.12 이상이 필요합니다. Node.js 26.13.1에서 검증했습니다.

```bash
npm ci
npm run dev
```

터미널에 표시되는 주소로 접속합니다. 기본 주소는 http://127.0.0.1:5173 입니다.

Windows에서는 `preview.cmd`를 실행해 의존성 설치와 미리보기를 시작할 수도 있습니다.

```bash
npm test
npm run build
npm run preview
```

`build` 결과는 `dist/`에 생성됩니다. `dist/index.html`을 파일로 직접 여는 대신 HTTP 서버에서 실행하세요.

수업 저장소에 `term-project/polymate-react/` 폴더로 넣었다면, 그 폴더 안에서 위 명령을 실행합니다. 수업 저장소 루트의 기존 Create React App과 별도로 실행하는 프로젝트입니다.

## 페이지와 원본 대응

| 원본                         | React 함수형 페이지   | 주소                      |
| ---------------------------- | --------------------- | ------------------------- |
| `index.html`                 | `StartPage`           | `#/`                      |
| `login.html`                 | `LoginPage`           | `#/login`                 |
| `main.html`                  | `DashboardPage`       | `#/dashboard`             |
| `learning.html`              | `LearningPage`        | `#/learning?topic=study`  |
| 같은 학습 페이지의 건강 모드 | `LearningPage` 재사용 | `#/learning?topic=health` |
| `theme.html`                 | `ThemePage`           | `#/themes`                |

학습과 건강은 하나의 페이지 컴포넌트를 재사용하는 두 가지 모드입니다. 대표 페이지 수는 5개로 설명합니다.

## 핵심 기능

- 로그인 시연: 이름·비밀번호 공백 검사, 비밀번호 표시 전환, 사용자명 저장, 게스트 접속.
- 일정: 날짜·시간 입력, 추가·조회·수정·완료 전환·삭제, 미완료 우선 및 날짜순 정렬. 12개 제한을 초과하면 안내하고 기존 일정을 보존합니다.
- 다이어리: 기분 선택, 일일 기록 저장·조회·수정·삭제, JSON 내려받기. 최대 20개를 보관합니다.
- 학습: 기본 계획 3개, 계획 추가·삭제·완료 처리. 실제 완료된 계획 비율로 성취도를 계산합니다.
- 건강: 물 마시기·움직임·휴식 체크, 당일 체크 유지, 날짜 변경 시 초기화.
- 대화: 학습·건강별 키워드 예시 응답, 추천 질문, 답변 대기 표시, 최근 메시지 60개 저장, 대화 초기화.
- 테마: 포근한 집·기분 좋은 여행·고요한 우주, 모든 페이지에서 공유 및 새로고침 후 유지.
- 영감·여행: 아이디어와 여행 소망 보관함의 추가·조회·수정·삭제, JSON 내려받기.
- 반응형: 데스크톱 사이드바와 3열 카드, 태블릿 2열, 모바일 하단 메뉴와 2열 카드, 학습 상세의 세로 배치.
- 접근성: 입력 레이블, 오류·저장 알림, 키보드 포커스 표시, 모달 포커스 순환·Escape 닫기·포커스 복귀, 배경 inert 처리, 모션 감소 설정 대응.

## React 변환의 핵심

기존 `getElementById`, `createElement`, `innerHTML` 중심의 직접 DOM 조작을 상태와 JSX 렌더링으로 바꿨습니다. `useState`는 데이터·입력·창 열림 상태, `useEffect`는 저장소 동기화와 타이머 정리, `useRef`는 입력 포커스와 채팅 스크롤에 사용합니다. `useRoute`, `useClock`은 공통 동작을 분리한 사용자 정의 Hook입니다.

변경할 수 있는 목록은 고유 ID를 `key`로 사용하고, 배열을 직접 수정하지 않습니다. 테마·기록·일정은 `App`에서 소유하고 하위 컴포넌트에 props와 상태 변경 함수를 전달합니다.

## 파일 구조

```text
src/
  App.jsx                  공통 상태·저장·페이지 연결
  main.jsx                 React 진입점
  styles.css               반응형 레이아웃·3개 테마
  pages/                   5개 함수형 페이지
  components/
    Layout.jsx             사이드바·모바일 메뉴·날짜
    UI.jsx                 공통 버튼·모달·성취도 링·출처
    Collections.jsx        일정·기록·영감·여행 보관함
  lib/
    model.js               데이터 검증·원본 데이터 이전·정렬·예시 응답
    hooks.js               페이지 이동·날짜 갱신
tests/model.test.js         데이터 동작 검증
public/images/             원본 프로젝트의 아이콘
```

## 데이터와 구현 범위

데이터는 브라우저의 `localStorage` 중 `polymate.react.v1`에 저장됩니다. 같은 출처에서 기존 `polyUserName`, `polyTheme`, `polySchedules`, `polyDiaryEntries`를 발견하면 새 구조로 가져옵니다. 기존 키를 삭제하지 않습니다. 출처나 브라우저가 다르면 기존 기록은 공유되지 않습니다. 손상된 데이터·저장 공간 부족·저장 접근 제한을 처리하고 안내합니다.

로그인은 **실제 인증이 아닌 시연 기능**입니다. 비밀번호는 저장·전송하지 않으며 실제 비밀번호를 입력할 필요가 없습니다. 대화는 **외부 AI API를 호출하지 않는 키워드 기반 데모**입니다. 진행률은 실제 학습 계획 체크의 비율이며, 학업 능력이나 건강 상태를 평가하는 수치는 아닙니다. 건강 기능은 생활 습관 기록용입니다. 영감은 개인 메모, 여행은 위시리스트이며 실시간 정보 검색·예약 기능이 아닙니다.

기록은 같은 브라우저를 사용하는 사람이 함께 볼 수 있습니다. 브라우저 데이터를 삭제하면 기록도 삭제될 수 있으므로 보관함의 내려받기를 이용할 수 있습니다. 가져오기 기능은 제공하지 않습니다. 외부 글꼴이 연결되지 않아도 시스템 글꼴로 실행됩니다.

## 저장소 운영과 제출

1. ThePolyMate를 메인 개발 저장소로 유지합니다. React 변경은 별도 브랜치에서 검토합니다.
2. 기존 정적 사이트는 `legacy/`에 보존했습니다. 메인 개발 저장소에는 React 버전을 루트에 배치하며, 로컬 개발 서버의 `/legacy/index.html`과 배포 사이트의 `/legacy/`에서 원본을 열 수 있습니다.
3. 제출 시 검증한 동일 소스를 Web2Projects의 `term-project/polymate-react/`에 복사합니다. `node_modules`, `dist`, `.git`은 복사하지 않습니다.
4. 수업 저장소에 `★ 기말고사과제 ★`가 포함된 커밋을 만들고 GitHub에 반영됐는지 확인합니다.
5. 보고서는 PDF로 제출합니다. 표지에 제목·GitHub 주소·교과목명·담당교수·학과명·학번·성명을 넣고 **날짜는 넣지 않습니다**.
6. 마감은 제공된 공지 기준 **2026년 12월 10일 23:59**입니다.

보고서에는 메인 개발 주소와 제출 주소의 역할을 함께 기재하고, 주제 선정 이유, 실제 구현 화면 캡처, React 기술, UI 편의성, 동작 확인 결과를 설명합니다. 구현하지 않은 계정 인증·생성형 AI 연결을 완료한 기능처럼 기술하지 않습니다.

## 배포

Vite의 `base: './'`와 해시 주소를 사용하므로 저장소 하위 경로에서도 정적 배포할 수 있습니다. `.github/workflows/deploy-pages.yml`은 `main` 푸시 시 테스트와 빌드를 실행하고, `legacy/`를 빌드 결과에 함께 복사해 GitHub Pages에 배포합니다. 기존 HTML 주소는 `public/`의 연결 페이지를 통해 React 화면으로 이동합니다.

## 참고 및 리소스

- 기존 홈페이지·이미지: [ThePolyMate](https://github.com/seeun-jang/ThePolyMate)
- 코기·기존 아이콘: [Freepik / Flaticon](https://www.flaticon.com/authors/freepik)
- 원본 테마 아이콘: Lizel Arina / Flaticon
- 원본 Isometric 아이콘: vectorsmarket15 / Flaticon
- 선 아이콘: [Lucide](https://lucide.dev), ISC License
- 글꼴: Noto Sans KR, DM Sans / Google Fonts (SIL Open Font License)
- [React 공식 가이드](https://react.dev/learn/thinking-in-react), [Vite 정적 배포 문서](https://vite.dev/guide/static-deploy)
