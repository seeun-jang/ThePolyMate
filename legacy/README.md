# The Poly-Mate (Warm AI Life Agent)

**한국폴리텍대학 서울정수캠퍼스**  
**인공지능소프트웨어학과 2601110299 장세은**  

[The Poly-Mate 웹페이지](https://seeun-jang.github.io/ThePolyMate/)

---
<img width="2559" height="1382" alt="스크린샷 2026-05-13 210908" src="https://github.com/user-attachments/assets/4427f606-bb90-47d7-a4d2-71c75ef121d7" /><img width="2559" height="1384" alt="스크린샷 2026-05-13 210953" src="https://github.com/user-attachments/assets/dd42294e-e6a3-4b5a-92cf-0b9d8d1ac19c" />  

## 1. 프로젝트 개요
사용자의 일상과 성장을 돕는 '초개인화 AI 에이전트'  
HTML5, CSS3, JavaScript를 활용하여 정적 화면 구조에서 동적 인터랙티브 웹페이지로 전환하였습니다.  
사용자 입력에 실시간 반응하며, 브라우저 로컬스토리지를 활용해 사용자 설정과 데이터가 지속적으로 유지됩니다.

## 2. 사용 기술
* **언어:** HTML5, CSS3, JavaScript (Vanilla JS, No Framework)  
* **상태 관리:** localStorage API (클라이언트 영속성)  
* **배포:** GitHub Pages  
* **아키텍처:** 이벤트 기반 DOM 조작  

## 3. JavaScript 구현 기능

### 로그인 시스템 (`scripts/login.js`)
- 입력 필드 검증 (아이디/비밀번호 공백 체크)
- localStorage에 사용자명 저장
- 성공 시 메인 페이지로 자동 이동
- 실시간 오류/성공 메시지 표시

### 테마 시스템 (`scripts/theme.js` + CSS)
- **3가지 테마 선택:** 기본(집), 여행(드라이브), 우주(스페이스)
- **동적 UI 변환:** body[data-theme] 속성으로 페이지 전체 스타일 즉시 적용
- **상태 지속성:** 선택한 테마가 모든 페이지에서 유지
- **CSS 선택자 기반:** 각 테마별 배경이미지, 색상, 그림자 최적화

### 일정 관리 (`scripts/main.js`)
- 모달 형식의 일정 입력 UI (CRUD 기능)
- 최대 12개까지 일정 저장 가능
- 삭제 버튼으로 개별 항목 제거
- localStorage 기반 데이터 지속성 (페이지 새로고침 후에도 유지)

### 일일 기록 (`scripts/main.js`)
- 일과를 기록하는 prompt-bar 입력창
- 타임스탬프와 함께 저장 (ISO 8601 형식)
- 최대 20개 기록 유지 (오래된 것부터 자동 삭제)
- 시간대별 동적 placeholder 메시지 (아침/오후/저녁)

### 학습/건강 채팅 인터페이스 (`scripts/learning.js`)
- **토픽 기반 라우팅:** URL 파라미터(?topic=study/health)로 모드 전환
- **학습 모드:**
  - C# 프로그래밍 관련 키워드 응답
  - 시험 준비 팁, 코드 문법 설명
  - 진행률 추적 (Progress Bar)
  
- **건강 모드:**
  - 식단 추천, 운동 조언, 수면 관리 조언
  - 영양소 정보 제공
  - 건강 데이터 시각화
  
- **실시간 채팅:**
  - 사용자 입력 → 즉시 버블 생성
  - 250ms 후 AI 응답 버블 추가 (로딩 감 제공)
  - 키워드 기반 스마트 응답 로직

- **추천 버튼:** 토픽별 맞춤형 질문 자동 입력

### 카드 등장 애니메이션
- 순차적 지연 효과 (90ms씩 각 카드 순차 진입)
- CSS 트랜지션으로 부드러운 opacity & transform 효과
- 페이지 로드 시 시각적 생동감 제공

## 4. 핵심 디자인 (Cozy Tech & 6대 위젯 UI)
기존 AI의 차가운 느낌과 차별화.  
파스텔 톤 컬러와 둥근 모서리를 활용하여 눈이 편안한 UI를 구성함.  
또한 사용자의 성향에 따라 테마를 구성하여 집, 여행, 우주라는 컨셉을 잡음.  

### [6대 시각화 위젯 구성]
* **학습:** 학습 진행률 데이터를 백분율 기반 막대 그래프(Progress Bar)로 시각화한 UI  
* **일정:** 시간순(Timeline) 데이터 배열을 적용한 카드형(Card) 컴포넌트 UI  
* **건강:** 영양소 섭취 비율 및 통계 데이터를 반영한 그래프 시각화 UI  
* **영감:** 이미지 자료를 격자형(Grid)으로 배치한 갤러리 레이아웃 UI  
* **여행:** 출도착 시간 및 운임 데이터를 구조화한 정보 블록(Block) UI  
* **다이어리:** 텍스트 기록 및 이미지 데이터를 정렬하는 게시판형 레이아웃 UI

## 5. 향후 발전 방향 (Future Goals)
현재는 정적인 UI/UX 설계에 집중하였으나, 추후 실제 AI 기술을 연동하여 다음 기능을 구현하는 것이 최종 목표.

* **초개인화 상호작용:** 사용자 데이터를 분석하여 상황에 맞는 질문과 대답을 스스로 생성하는 지능형 에이전트 구현.
* **자가 치유(Self-Healing) 시스템:** 대화 맥락이나 데이터 매칭 중 발생하는 오류를 시스템이 스스로 인지하고 교정하여, 끊김 없고 자연스러운 사용자 경험(UX) 제공.

## 🔗 Design Resource Attribution
본 프로젝트의 아이콘은 저작권 규정에 따라 **Flaticon**의 리소스를 활용하였습니다.
* Puppy/Settings/Message/Book/Agenda/Salad/Knowledge/Travel icons by **Freepik**
* Theme icons by **Lizel Arina**
* Isometric icons by **vectorsmarket15**
