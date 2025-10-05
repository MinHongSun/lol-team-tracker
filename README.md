# 🧩 LOL Team Tracker

LOL Team Tracker는 팀원들의 **최근 경기 요약**, **티어**, **주 라인**, **주 챔피언** 등을 자동으로 불러와 시각적으로 확인할 수 있는 대시보드입니다.  
특히 **커스텀 게임**을 중심으로 플레이하는 팀을 위해 설계된 프로젝트로,  
팀 전체의 경기 데이터를 한눈에 볼 수 있도록 통합 관리합니다.

---

## 🚀 주요 기능

### 👥 사용자 관리
- Firebase Authentication을 이용한 이메일 로그인 기능  
- Riot 계정(Riot ID) 등록 및 수정  
- 사용자별 Firestore 데이터 연동 (`users` 컬렉션)

### 📊 팀 대시보드
- Firestore에 등록된 모든 유저의 데이터 불러오기  
- Riot API를 통해 각 유저의 **최근 20경기** 데이터 분석  
- 주요 통계 자동 계산:
  - 현재 **티어**
  - 가장 많이 플레이한 **라인**
  - 상위 3개 **챔피언**
- **“갱신하기” 버튼**으로 실시간 Riot 데이터 재분석 후 `teamData` 컬렉션 업데이트  

### ⚙️ Riot API 연동
- `Riot Account`, `Match`, `League`, `Champion Mastery` API 사용  
- 429 Too Many Requests 에러 발생 시 → **2분 대기 후 자동 재시도**  
- 커스텀 분석 로직(`analyzeRecentMatches`)으로 라인·챔피언 빈도 집계  

---

## 🧠 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React (Vite/CRA) |
| 인증 | Firebase Auth |
| 데이터베이스 | Firebase Firestore |
| API | Riot Games API |
| 배포 | Vercel |
| 버전 관리 | Git & GitHub |

---

## 📂 폴더 구조
src/
├── api/
│ └── riotApi.js # Riot API 연동 및 분석 로직
├── pages/
│ ├── DashboardPage.js # 로그인 후 사용자 메인 화면
│ ├── RiotRegisterPage.js # Riot 계정 등록 및 수정
│ └── TeamDashboardPage.js # 팀 전체 통계 대시보드
├── utils/
│ └── lolMaps.js # 라인/챔피언 이름 변환 맵
├── firebaseConfig.js # Firebase 초기화
└── App.js # 라우팅 구성


