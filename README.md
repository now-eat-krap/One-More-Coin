<a href="https://one-more-coin.com"  target="_blank">
<img src="https://github.com/user-attachments/assets/102c4bf4-c91e-4d33-b2a6-3a609774f32a" alt="배너" width="100%"/>
</a>

- 배포 URL : [https://one-more-coin.com](https://one-more-coin.com)

<br/>
<br/>

## 팀 문서 & 자료 링크
- 🗂️ [팀 노션](https://placid-cyclamen-a90.notion.site/201bccba6df980c6bda6dc08abe0b892)
- 📄 [개발 문서](https://placid-cyclamen-a90.notion.site/208bccba6df980dd9853ca5de8807e79)

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: One-More-Coin
- 프로젝트 설명: 자신의 투자 전략을 쉽고 간편하게 백테스팅 할 수 있는 사이트 개발.

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 박태원 |
|:------:|
| 이미지 추가 예정 |
| PL |
| [GitHub](https://github.com/now-eat-krap) |

<br/>
<br/>

# 3. Key Features (주요 기능)
## 1. 다양한 투자 전략 백테스팅
- 이동평균선, RSI, 캔들패턴 등 여러 가지 투자 전략을 직접 선택하여 과거 데이터로 손쉽게 백테스트할 수 있습니다.
![조건](https://github.com/user-attachments/assets/4ac804a1-3392-47d1-a0ad-cd82fc76f579)
- 사용자는 원하는 전략을 조합하여 자신만의 전략을 실험할 수 있습니다.
![조건저장](https://github.com/user-attachments/assets/0f538f0d-55e7-4558-9902-12b7d42d3b21)

## 2. 실시간 차트 및 결과 시각화
- 백테스트 결과를 직관적인 차트와 그래프로 시각화하여, 수익률, 매수/매도 시점 등 핵심 정보를 한눈에 확인할 수 있습니다.
- 실시간으로 데이터가 반영되어, 전략의 효과를 즉시 파악할 수 있습니다.
![실시간차트](https://github.com/user-attachments/assets/fa3d4b31-7d3e-421a-a035-98b37d5ca9cf)

## 3. 전략별 상세 분석
- 각 전략별로 거래 내역, 수익률, 최대 낙폭 등 상세한 분석 리포트를 제공합니다.
- 전략의 강점과 약점을 구체적으로 파악할 수 있습니다.
![상세분석](https://github.com/user-attachments/assets/fd877af1-9cf2-4dec-9ed7-0c141357d450)

## 4. 홈서버 구축
- 미니 PC와 DDNS를 활용해 직접 홈서버를 구축하여, 언제 어디서나 서비스에 접속할 수 있습니다.
- 저비용으로 안정적인 서버 운영이 가능하며, 네트워크 환경에 구애받지 않습니다.
[홈서버 구축 문서](https://placid-cyclamen-a90.notion.site/222bccba6df9807cb941f95f6d9cd161)

## 5. GitHub Actions + Docker를 이용한 자동 무중단 배포
- GitHub Actions와 Docker를 활용해 코드가 변경될 때마다 자동으로 빌드 및 무중단 배포가 이루어집니다.
- 개발-배포-운영의 전 과정을 자동화하여, 서비스의 안정성과 효율성을 높였습니다.
[github actions 문서](https://placid-cyclamen-a90.notion.site/Github-Actions-221bccba6df9803681a9f011ac60a126)

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
|-----------------|-----------------|-----------------|
| 박태원    |  사진추가예정 | <ul><li>전체 프로젝트 총괄</li></ul>    |


<br/>
<br/>

# 5. Technology Stack (기술 스택)
| 분류 | 기술 스택 |
|------|-----------|
| **Frontend** | [![My Skills](https://skillicons.dev/icons?i=vue,vite,tailwind,js)](https://skillicons.dev) |
| **Backend** | [![My Skills](https://skillicons.dev/icons?i=java,spring,fastapi)](https://skillicons.dev)  |
| **DB / Infra** | [![My Skills](https://skillicons.dev/icons?i=postgres,redis)](https://skillicons.dev) |
| **배포** | [![My Skills](https://skillicons.dev/icons?i=githubactions,docker)](https://skillicons.dev) |
| **협업** | [![My Skills](https://skillicons.dev/icons?i=git,github,notion)](https://skillicons.dev) |

<br/>
<br/>

# 6. Project Structure (프로젝트 구조)
```plaintext
One-More-Coin/
  ├─ backend-java/      # Spring Boot 백엔드
  ├─ backend-python/    # FastAPI 백엔드
  ├─ frontend/          # Vue3 프론트엔드
  ├─ docker-compose.yml # 배포용 도커 컴포즈 설정
  ├─ docker-compose.dev.yml # 개발용 도커 컴포즈 설정
  └─ README.md
```

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)
우리의 브랜치 전략은 Git Flow를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.

- Main Branch
  - 배포 가능한 상태의 코드를 유지합니다.
  - 모든 배포는 이 브랜치에서 이루어집니다.
  
- {name} Branch
  - 팀원 각자의 개발 브랜치입니다.
  - 모든 기능 개발은 이 브랜치에서 이루어집니다.

<br/>
<br/>

# 8. 커밋 컨벤션
## 기본 구조
```
type : subject
```

<br/>

## type 종류
```
feat : 새로운 기능 추가
fix : 버그 수정
docs : 문서 수정
design : CSS 등 사용자 UI 디자인 변경
style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
refactor : 코드 리펙토링
test : 테스트 코드, 리펙토링 테스트 코드 추가
chore : 빌드 업무 수정, 패키지 매니저 수정
```

<br/>

## 커밋 예시
```
== ex1
Feat: "회원 가입 기능 구현"
== ex2
chore: styled-components 라이브러리 설치
```

<br/>
<br/>
