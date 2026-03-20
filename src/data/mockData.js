export const mockHackathons = [
  {
    id: 1,
    title: "2026 글로벌 AI 해커톤",
    type: "AI · MACHINE LEARNING",
    status: "진행 중",
    statusColor: "teal",
    startDate: "2026.05.01",
    endDate: "2026.05.07",
    participants: 128,
    bgGradient: "from-[#77B5AE] to-[#609993]",
    heroText: "AI HACKATHON",
    subText: "MINIMAL DATA SET WORK",
    description: "생성형 AI 컴퓨팅 프레임워크를 활용하여 실생활의 불편함을 해결하는 혁신적인 웹 서비스를 개발합니다. 글로벌 빅테크 기업(Google, MS, OpenAI 등)의 현직자 멘토링이 포함된 프리미엄 해커톤입니다. 참가자 전원에게 클라우드 크레딧이 제공됩니다.",
    prizes: [
      { rank: "Grand Prize (1팀)", reward: "₩ 10,000,000 + 실리콘밸리 연수" },
      { rank: "Excellence (2팀)", reward: "₩ 5,000,000" },
      { rank: "Innovation (3팀)", reward: "₩ 2,000,000" }
    ],
    timeline: [
      { step: "참가팀 서류 접수", date: "2026.04.01 - 04.30" },
      { step: "오리엔테이션 및 팀 빌딩", date: "2026.05.01" },
      { step: "본선 해커톤 (무박 2일)", date: "2026.05.06 - 05.07" },
      { step: "작품 심사 및 시상식", date: "2026.05.08" }
    ],
    rules: [
      "팀은 최소 3인에서 최대 5인으로 구성해야 합니다.",
      "기존 상용화된 프로젝트 코드를 재사용하는 것은 엄격히 금지됩니다.",
      "결과물은 반드시 지정된 클라우드 인터페이스를 통해 배포 가능해야 합니다.",
      "오픈소스 모델 가중치를 사용할 경우 라이선스 규정을 준수하십시오."
    ],
    organizer: "재단법인 AI Innovation Korea",
    contactEmail: "contact@aihackathon.com"
  },
  {
    id: 2,
    title: "차세대 보안 아키텍처 챌린지",
    type: "SECURITY · CLOUD",
    status: "진행 중",
    statusColor: "teal",
    startDate: "2026.06.12",
    endDate: "2026.06.15",
    participants: 84,
    bgGradient: "from-[#215E65] to-[#12363A]",
    heroText: "CYBERSECURITY",
    subText: "SAFE INFRASTRUCTURE WORK",
    description: "차세대 클라우드 네이티브 환경에서 발생하는 보안 취약점을 차단하고 무결성을 유지하는 보안 아키텍처를 설계하는 챌린지입니다. 네트워크 계층 방어 시뮬레이션 환경이 제공됩니다.",
    prizes: [
      { rank: "1등 (대상)", reward: "₩ 8,000,000" },
      { rank: "2등 (최우수상)", reward: "₩ 4,000,000" },
      { rank: "3등 (우수상)", reward: "₩ 1,000,000" }
    ],
    timeline: [
      { step: "접수 및 자격 심사", date: "2026.05.15 - 06.01" },
      { step: "보안 특강", date: "2026.06.12" },
      { step: "해커톤 및 공격 방어 시나리오", date: "2026.06.13 - 06.14" },
      { step: "최종 심사", date: "2026.06.15" }
    ],
    rules: [
      "제공되는 격리된 샌드박스 망 내에서만 작업을 진행해야 합니다.",
      "취약점 패치 리포트를 필수로 제출해야 합니다.",
      "팀당 최소 2인 구성"
    ],
    organizer: "국가보안기술연구혁신원",
    contactEmail: "support@cybersec.tech"
  },
  {
    id: 3,
    title: "Sync Web3 넥서스",
    type: "WEB3 · NFT",
    status: "종료",
    statusColor: "gray",
    startDate: "2026.03.20",
    endDate: "2026.03.22",
    participants: 215,
    bgGradient: "from-[#1F2C3D] to-[#111A24]",
    heroText: "wb33",
    subText: "NATURAL HACKATHON",
    description: "탈중앙화 데이터베이스와 NFT 경제 구조를 융합하여 혁신적인 디파이(DeFi) 모델을 제시하는 글로벌 WEB3 컨퍼런스 겸 해커톤이었습니다.",
    prizes: [
      { rank: "Grand Prize", reward: "50,000 USDC" },
      { rank: "Excellence", reward: "20,000 USDC" },
      { rank: "Innovation", reward: "5,000 USDC" }
    ],
    timeline: [
      { step: "참가팀 서류 접수", date: "2026.02.01 - 02.28" },
      { step: "해커톤 (무박 3일)", date: "2026.03.20 - 03.22" },
      { step: "시상식", date: "2026.03.22" }
    ],
    rules: ["이미 종료된 대회입니다."],
    organizer: "Sync Web3 DAO",
    contactEmail: "dao@syncweb3.io"
  },
  {
    id: 4,
    title: "백엔드 시스템 아키텍처 공모전",
    type: "BACKEND · INFRA",
    status: "예정",
    statusColor: "blue",
    startDate: "2026.07.15",
    endDate: "2026.07.25",
    participants: 42,
    bgGradient: "from-[#3FB9AE] to-[#25827A]",
    heroText: "DEVELOPER CONF",
    subText: "Quality products require networks",
     description: "수천만 건의 트래픽을 효율적으로 라우팅하고 MSA(Microservices Architecture) 환경에서 병목 지점을 최소화하는 엔터프라이즈급 API를 설계하세요. 가장 높은 TPS를 보장하는 설계가 우승합니다.",
    prizes: [
      { rank: "대상", reward: "₩ 15,000,000" },
      { rank: "최우수상", reward: "₩ 5,000,000" },
      { rank: "특별상", reward: "백엔드 개발 환경 풀세트" }
    ],
    timeline: [
      { step: "얼리버드 모집", date: "2026.06.01 - 06.30" },
      { step: "일반 접수", date: "2026.07.01 - 07.10" },
      { step: "본선 진행 (10일 간)", date: "2026.07.15 - 07.25" },
      { step: "코드 심사 및 발표", date: "2026.08.01" }
    ],
    rules: [
      "자유로운 프로그래밍 언어의 사용이 가능합니다 (Rust, Go, Java, Node.js 등).",
      "TPS 및 Latency 벤치마크 테스트 코드를 필수로 제공해야 합니다.",
      "오픈소스 라이브러리의 적극 활용을 권장합니다."
    ],
    organizer: "DevOps Global",
    contactEmail: "admin@devopsglobal.com"
  },
  {
    id: 5,
    title: "글로벌 핀테크 이노베이션",
    type: "FINANCE · BLOCKCHAIN",
    status: "진행 중",
    statusColor: "teal",
    startDate: "2026.08.01",
    endDate: "2026.08.10",
    participants: 350,
    bgGradient: "from-[#5D3FD3] to-[#3B258F]",
    heroText: "FINTECH",
    subText: "FUTURE OF MONEY",
    description: "블록체인 분산 원장 기반의 스마트 계약 결제 시스템과 전통적인 핀테크 API를 결합한 송금/결제 플랫폼 개발 해커톤입니다. 금융 위원회의 가이드라인을 지키며 가장 빠른 송금을 구현하세요.",
    prizes: [
      { rank: "1등 (금융위원장상)", reward: "₩ 20,000,000" },
      { rank: "2등 (혁신상)", reward: "₩ 10,000,000" },
      { rank: "3등 (참여상)", reward: "₩ 3,000,000" }
    ],
    timeline: [
      { step: "기획안 제출", date: "2026.07.01 - 07.25" },
      { step: "개발 기간", date: "2026.08.01 - 08.08" },
      { step: "오프라인 발표 및 PT", date: "2026.08.10" }
    ],
    rules: [
      "테스트넷에서 동작하는 MVP 모델을 필수 지참해야 합니다.",
      "실제 금융 API (제공됨) 연동이 1개 이상 포함되어야 합니다."
    ],
    organizer: "한국 핀테크 지원센터",
    contactEmail: "fintech@korea.com"
  }
];

export const mockUsers = [
  {
    id: 1,
    nickname: "건축가_Kim",
    role: "Digital Craftsman & Full-stack Architect",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kim",
    points: 11250,
    rank: 1,
    status: "up",
    badges: ["✨", "🚀", "👑"]
  },
  {
    id: 2,
    nickname: "Alex_Dev",
    role: "Full-stack Dev",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver",
    points: 8420,
    rank: 2,
    status: "up",
    badges: ["💻", "🧠"]
  },
  {
    id: 3,
    nickname: "Web3_Ninja",
    role: "Smart Contract Eng",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mia",
    points: 7890,
    rank: 3,
    status: "down",
    badges: ["⛓️", "🛡️"]
  },
  {
    id: 4,
    nickname: "Infra_God",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Leo",
    points: 7120,
    rank: 4,
    status: "up",
    badges: ["☁️", "🛡️"]
  }
];

export const mockTeams = [
  {
    id: 1,
    teamName: "Team Nexus",
    hackathonId: 1,
    hackathonTitle: "2026 글로벌 AI 해커톤",
    status: "모집 중",
    description: "생성형 AI 컴퓨팅 프레임워크를 활용하여 실무형 챗봇 도우미를 기획 중입니다! OpenAI 및 기타 오픈소스 모델 사용 경험이 분들을 애타게 찾고 있습니다.",
    roles: [
      { name: "백엔드", current: 1, total: 2 },
      { name: "프론트엔드", current: 0, total: 1 }
    ],
    members: ["A", "B", "C"],
    theme: "from-purple-500 to-indigo-500",
    icon: "✨"
  },
  {
    id: 2,
    teamName: "Sync Guard",
    hackathonId: 2,
    hackathonTitle: "차세대 보안 아키텍처 챌린지",
    status: "모집 중",
    description: "새로운 Cloud-native 환경에서의 제로 트러스트 보안 인프라를 설계하려고 합니다. 네트워크 보안 방어 시나리오를 주로 해본 엔지니어가 절실합니다.",
    roles: [
      { name: "DevOps", current: 0, total: 2 },
      { name: "백엔드", current: 1, total: 1 }
    ],
    members: ["L", "M"],
    theme: "from-teal-500 to-emerald-500",
    icon: "🛡️"
  },
  {
    id: 3,
    teamName: "Fin-Wizard",
    hackathonId: 5,
    hackathonTitle: "글로벌 핀테크 이노베이션",
    status: "마감",
    description: "블록체인 분산 원장을 접목한 글로벌 원클릭 결제 모듈을 구축하는 팀입니다. 현재 모든 역할의 팀원의 모집이 무사히 완료되었습니다! 감사합니다.",
    roles: [
      { name: "기획자", current: 1, total: 1 },
      { name: "풀스택", current: 2, total: 2 }
    ],
    members: ["D", "E"],
    theme: "from-orange-400 to-red-500",
    icon: "🚀"
  }
];

export const mockMyHackathons = [
  { id: 1, hackathonId: 1, title: "2026 글로벌 AI 해커톤", role: "프론트엔드", teamName: "Team Nexus", status: "진행 중", appliedDate: "2026.04.15" },
  { id: 2, hackathonId: 2, title: "차세대 보안 아키텍처 챌린지", role: "개인 참가 (팀 매칭 대기)", teamName: null, status: "매칭 중", appliedDate: "2026.05.20" }
];

export const mockMySubmissions = [
  {
    id: 1,
    hackathonTitle: "Sync Web3 넥서스",
    projectName: "Decentralized Escrow Protocol",
    description: "스마트 컨트랙트를 활용한 안전한 DAO 간 에스크로 결제 시스템 프로토타입",
    date: "2026.03.22",
    award: "Innovation (3위)",
    awardColor: "from-orange-500 to-red-500",
    link: "https://github.com/sync-web3/escrow",
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=Crypto"
  },
  {
    id: 2,
    hackathonTitle: "2025 전국 대학생 알고리즘 챔피언십",
    projectName: "Opti-Path (최적 경로 탐색기)",
    description: "A* 알고리즘을 튜닝하여 복잡한 도시망에서의 최단/최저비용 경로를 실시간으로 스케줄링하는 라이브러리",
    date: "2025.11.10",
    award: "본선 진출",
    awardColor: "from-slate-400 to-slate-500",
    link: "https://github.com/uni-algo/opti-path",
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=Code"
  }
];

export const mockMyActivities = [
  { id: 1, type: "badge", title: "새로운 뱃지 획득!", desc: "'✨ 그랜드 마스터' 뱃지를 획득하셨습니다.", date: "Today, 10:30 AM", icon: "🏆", iconColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { id: 2, type: "points", title: "+500 PTS 적립", desc: "주간 코드 리뷰 우수 기여자로 선정되어 500 포인트를 받았습니다.", date: "Yesterday, 14:15 PM", icon: "⭐", iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { id: 3, type: "team", title: "팀 빌딩 소식", desc: "'차세대 보안 아키텍처 챌린지'의 Sync Guard 팀에 최종 합류가 확정었습니다.", date: "2026.05.20", icon: "🤝", iconColor: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
  { id: 4, type: "submit", title: "프로젝트 제출 인증", desc: "'Sync Web3 넥서스' 최종 결과물을 Github 코드와 함께 제출을 완료했습니다.", date: "2026.03.22", icon: "🚀", iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20" }
];
