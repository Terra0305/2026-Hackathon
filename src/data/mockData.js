import { reactive } from 'vue';

export const availableBadges = [
  { id: 'badge1', name: 'First Commit', icon: '🌱', description: '첫 번째 커밋을 완료했습니다.' },
  { id: 'badge2', name: 'Bug Hunter', icon: '🐛', description: '버그를 5개 이상 해결했습니다.' },
  { id: 'badge3', name: 'Top Builder', icon: '🏆', description: '랭킹 Top 10에 진입했습니다.' },
  { id: 'badge4', name: 'Night Owl', icon: '🌙', description: '새벽 시간에 기여 활동을 했습니다.' },
  { id: 'badge5', name: 'Swift Master', icon: '🍎', description: 'iOS 앱 개발 분야 전문가' },
  { id: 'badge6', name: 'Web Architect', icon: '🏗️', description: '복잡한 웹 아키텍처 설계' },
  { id: 'badge7', name: 'AI Researcher', icon: '🧠', description: 'LLM 및 딥러닝 모델 연구' },
  { id: 'badge8', name: 'Security Expert', icon: '🛡️', description: '시스템 보안 인프라 구축' },
  { id: 'badge_premium', name: 'Premium Builder', icon: '💎', description: '포인트 상점에서 획득한 프리미엄 배지' }
]

export const mockHackathons = reactive([
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
    contactEmail: "contact@aihackathon.com",
    scoringCriteria: [
      { name: "기술 실용성", weight: 40 },
      { name: "창의성", weight: 30 },
      { name: "파급 효과", weight: 30 }
    ]
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
    contactEmail: "fintech@korea.com",
    scoringCriteria: [
      { name: "기술적 완성도", weight: 40 },
      { name: "디자인 및 UX", weight: 30 },
      { name: "기획 및 혁신성", weight: 30 }
    ]
  }
]);

export const mockUsers = reactive([
  {
    id: 1,
    nickname: "건축가_Kim",
    realName: "김철수",
    role: "Digital Craftsman & Full-stack Architect",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kim",
    points: 11250,
    walletPoints: 11250,
    monthlyPoints: 3400,
    rank: 1,
    status: "up",
    selectedBadges: ["badge1", "badge5", "badge6"],
    githubConnected: true,
    techStack: ["Vue.js", "Node.js", "PostgreSQL", "TailwindCSS"],
    githubCommits: 432,
    isTimelinePublic: true,
    email: "architect.kim@sync.com",
    phone: "010-1234-5678",
    ownedItems: ["neon"],
    pointHistory: [
      { id: 1, type: "earn", amount: 5000, detail: "해커톤 기획 가이드 작성 보상", date: "2026.04.01" },
      { id: 2, type: "earn", amount: 2000, detail: "데일리 출석 체크 (7일 연속)", date: "2026.04.02" },
      { id: 3, type: "spend", amount: 2000, detail: "상점 구매: 네온 시안 테두리", date: "2026.04.03" },
      { id: 4, type: "earn", amount: 4250, detail: "오픈소스 프로젝트 기여 보너스", date: "2026.04.04" }
    ]
  },
  {
    id: 2,
    nickname: "Alex_Dev",
    realName: "이영희",
    role: "Full-stack Dev",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver",
    points: 8420,
    walletPoints: 8420,
    monthlyPoints: 4100,
    rank: 2,
    status: "up",
    email: "alex.dev@sync.com",
    phone: "010-2345-6789",
    githubConnected: true,
    techStack: ["React", "Node.js", "TypeScript"],
    githubCommits: 452,
    profileBorder: "gold",
    selectedBadges: ["badge3", "badge1", "badge6"],
    isTimelinePublic: true,
    ownedItems: ["gold"],
    pointHistory: [
      { id: 1, type: "earn", amount: 4100, detail: "월간 우수 활동가 보상", date: "2026.04.01" }
    ]
  },
  {
    id: 3,
    nickname: "Web3_Ninja",
    role: "Smart Contract Eng",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mia",
    points: 7890,
    walletPoints: 7890,
    monthlyPoints: 2150,
    rank: 3,
    status: "down",
    selectedBadges: ["badge4"],
    email: "web3ninja@sync.com",
    phone: "010-3456-7890",
    githubConnected: true,
    techStack: ["Solidity", "Web3.js", "Rust"],
    githubCommits: 193,
    isTimelinePublic: false,
    ownedItems: ["chroma"],
    pointHistory: [
      { id: 1, type: "earn", amount: 5000, detail: "Web3 보안 컨설팅 기여", date: "2026.03.20" },
      { id: 2, type: "spend", amount: 3500, detail: "상점 구매: 크로마 펄스 테두리", date: "2026.03.21" }
    ]
  },
  {
    id: 4,
    nickname: "Infra_God",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Leo",
    points: 7120,
    walletPoints: 7120,
    monthlyPoints: 2800,
    rank: 4,
    status: "up",
    selectedBadges: ["badge5"],
    email: "infragod@sync.com",
    phone: "010-4567-8901",
    githubConnected: true,
    techStack: ["Kubernetes", "Terraform", "Go"],
    githubCommits: 341,
    isTimelinePublic: true,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 5,
    nickname: "Design_Master",
    role: "UX/UI Designer & Developer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nora",
    points: 6850,
    walletPoints: 6850,
    monthlyPoints: 3200,
    rank: 5,
    status: "up",
    selectedBadges: ["badge6"],
    email: "design.master@sync.com",
    phone: "010-5678-9012",
    githubConnected: true,
    techStack: ["Figma", "Vue.js", "CSS"],
    githubCommits: 124,
    isTimelinePublic: true,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 6,
    nickname: "Front_End_Wizard",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rudy",
    points: 6400,
    walletPoints: 6400,
    monthlyPoints: 1950,
    rank: 6,
    status: "down",
    selectedBadges: ["badge1", "badge3"],
    email: "frontend.wiz@sync.com",
    phone: "010-6789-0123",
    githubConnected: true,
    techStack: ["React", "Next.js", "TailwindCSS"],
    githubCommits: 215,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 7,
    nickname: "Data_Guru",
    role: "Data Scientist",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Finn",
    points: 5900,
    walletPoints: 5900,
    monthlyPoints: 2200,
    rank: 7,
    status: "up",
    selectedBadges: ["badge2", "badge3"],
    email: "data.guru@sync.com",
    phone: "010-7890-1234",
    githubConnected: true,
    techStack: ["Python", "PyTorch", "Pandas"],
    githubCommits: 178,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 8,
    nickname: "Mobile_King",
    role: "iOS/Android Developer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Chloe",
    points: 5400,
    walletPoints: 5400,
    monthlyPoints: 1700,
    rank: 8,
    status: "down",
    selectedBadges: ["badge4"],
    email: "mobile.king@sync.com",
    phone: "010-8901-2345",
    githubConnected: true,
    techStack: ["Swift", "Kotlin", "Flutter"],
    githubCommits: 156,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 9,
    nickname: "Game_Dev_Pro",
    role: "Game Engine Developer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Oscar",
    points: 4800,
    walletPoints: 4800,
    monthlyPoints: 2600,
    rank: 9,
    status: "up",
    selectedBadges: ["badge1", "badge2"],
    githubConnected: true,
    techStack: ["C++", "Unity", "Unreal"],
    githubCommits: 302,
    ownedItems: [],
    pointHistory: []
  },
  {
    id: 10,
    nickname: "Security_Ninja",
    realName: "최민수",
    role: "Security Researcher",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ivy",
    points: 4200,
    walletPoints: 4200,
    monthlyPoints: 950,
    rank: 10,
    status: "down",
    selectedBadges: ["badge4", "badge5"],
    githubConnected: true,
    techStack: ["Python", "C", "Assembly"],
    githubCommits: 89,
    isTimelinePublic: true,
    ownedItems: [],
    pointHistory: []
  }
]);

export const mockShopItems = {
  gifticons: [
    { id: 1, name: 'CGV 영화 관람권 1인', price: 15000, icon: '🍿', color: 'from-red-500 to-rose-400', brand: 'CGV' },
    { id: 2, name: '스타벅스 아메리카노 L', price: 4500, icon: '☕', color: 'from-green-500 to-emerald-400', brand: 'Starbucks' },
    { id: 3, name: 'BHC 후라이드 + 콜라', price: 22000, icon: '🍗', color: 'from-yellow-500 to-orange-400', brand: 'BHC' },
    { id: 4, name: 'CU 5,000원 상품권', price: 5000, icon: '🏪', color: 'from-purple-500 to-indigo-400', brand: 'CU' },
    { id: 5, name: '구글 기프트카드 1만원', price: 10000, icon: '🃏', color: 'from-blue-500 to-cyan-400', brand: 'Google' }
  ],
  decorations: [
    { id: 'neon', name: '네온 시안 테두리', price: 2000, icon: '✨', color: 'from-cyan-400 to-blue-500', class: 'profile-border-neon', type: 'border' },
    { id: 'gold', name: '로열 골드 테두리', price: 5000, icon: '🏆', color: 'from-amber-300 to-orange-500', class: 'profile-border-gold', type: 'border' },
    { id: 'chroma', name: '크로마 펄스 테두리', price: 3500, icon: '🌈', color: 'from-purple-500 via-blue-500 to-teal-400', class: 'profile-border-chroma', type: 'border' },
    { id: 'badge_premium', name: 'Premium Builder 뱃지', price: 1000, icon: '💎', color: 'from-blue-400 to-indigo-500', type: 'badge' }
  ]
};

export const mockTeams = reactive([
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
    members: ["건축가_Kim", "Alex_Dev", "Web3_Ninja", "Infra_God"],
    leaderId: 1,
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
    members: ["Security_Ninja", "Mobile_King"],
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
    members: ["건축가_Kim", "Design_Master", "Front_End_Wizard"],
    theme: "from-orange-400 to-red-500",
    icon: "🚀"
  }
]);

export const mockMyHackathons = reactive([
  { id: 1, hackathonId: 1, title: "2026 글로벌 AI 해커톤", role: "프론트엔드", teamName: "Team Nexus", status: "진행 중", appliedDate: "2026.04.15" },
  { id: 2, hackathonId: 2, title: "차세대 보안 아키텍처 챌린지", role: "개인 참가 (팀 매칭 대기)", teamName: null, status: "매칭 중", appliedDate: "2026.05.20" },
  { id: 3, hackathonId: 3, title: "Sync Web3 넥서스", role: "풀스택", teamName: "Fin-Wizard", status: "참여 대기", appliedDate: "2026.03.15" }
]);

export const mockMySubmissions = reactive([
  {
    id: 1,
    hackathonTitle: "Sync Web3 넥서스",
    projectName: "Decentralized Escrow Protocol",
    description: "스마트 컨트랙트를 활용한 안전한 DAO 간 에스크로 결제 시스템 프로토타입",
    date: "2026.03.22",
    award: "Innovation (3위)",
    awardColor: "from-orange-500 to-red-500",
    link: "https://github.com/sync-web3/escrow",
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=Crypto",
    historyDocs: [
      { title: '서비스 기획서 (Draft)', type: '기획', date: '2026.03.20' },
      { title: '최종 발표 덱 (PT)', type: '발표자료', date: '2026.03.22' }
    ]
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
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=Code",
    historyDocs: [
      { title: '아키텍처 설계도', type: '기획', date: '2025.10.12' },
      { title: '최종 결과 보고서.pdf', type: '보고서', date: '2025.11.08' }
    ]
  }
]);

export const mockMyActivities = [
  { id: 1, type: "badge", title: "새로운 뱃지 획득!", desc: "'✨ 그랜드 마스터' 뱃지를 획득하셨습니다.", date: "Today, 10:30 AM", icon: "🏆", iconColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { id: 2, type: "points", title: "+500 PTS 적립", desc: "주간 코드 리뷰 우수 기여자로 선정되어 500 포인트를 받았습니다.", date: "Yesterday, 14:15 PM", icon: "⭐", iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { id: 3, type: "team", title: "팀 빌딩 소식", desc: "'차세대 보안 아키텍처 챌린지'의 Sync Guard 팀에 최종 합류가 확정었습니다.", date: "2026.05.20", icon: "🤝", iconColor: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
  { id: 4, type: "submit", title: "프로젝트 제출 인증", desc: "'Sync Web3 넥서스' 최종 결과물을 Github 코드와 함께 제출을 완료했습니다.", date: "2026.03.22", icon: "🚀", iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20" }
];

export const mockGlobalSubmissions = reactive([
  {
    id: 1,
    hackathonId: 1,
    teamId: 1,
    teamName: "Team Nexus",
    projectName: "실무형 AI 챗봇 넥서스",
    description: "OpenAI API를 활용한 업무 지원 챗봇입니다. 사내 문서 기반 RAG 파이프라인과 슬랙/노션 연동까지 구현하여 실제 업무 흐름에 매끄럽게 통합됩니다.",
    submittedAt: "2026.05.06",
    status: "심사 중",
    score: null,
    detailedScores: {},
    award: null,
    review: null,
    reviewedAt: null,
    rewardDistribution: [],
    rewardsApplied: false,
    links: ["https://github.com/team-nexus/chatbot"],
    files: [
      { name: "아키텍처_설계서.pdf", size: "2.4MB", type: "기획서" },
      { name: "최종_발표자료.pptx", size: "8.1MB", type: "발표자료" },
      { name: "데모_영상_링크.txt", size: "1KB", type: "영상" }
    ],
    members: [
      { nickname: "Alex_Dev", role: "팀장 / 백엔드", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex" },
      { nickname: "건축가_Kim", role: "프론트엔드", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kim" },
      { nickname: "Web3_Ninja", role: "AI 엔지니어", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ninja" }
    ],
    tasks: [
      { title: "웹소켓 통신 인터페이스 구축", status: "Done", assignee: "Alex_Dev", priority: "High" },
      { title: "컴포넌트 구조 설계서 작성", status: "Done", assignee: "건축가_Kim", priority: "High" },
      { title: "메인 랜딩페이지 퍼블리싱", status: "Done", assignee: "Web3_Ninja", priority: "Medium" }
    ],
    documents: [
      { name: "서비스 기획 및 요구사항 정의서", type: "기획서", updated: "2026.05.04" },
      { name: "최종 아키텍처 설계 문서", type: "디자인", updated: "2026.05.05" }
    ]
  },
  {
    id: 2,
    hackathonId: 1,
    teamId: 2,
    teamName: "Sync Guard",
    projectName: "제로 트러스트 방어벽",
    description: "클라우드 서비스에 쉽게 부착할 수 있는 보안 스캐너. Kubernetes 환경에서 컨테이너 간 통신을 실시간으로 모니터링하고 이상 트래픽을 즉시 차단합니다.",
    submittedAt: "2026.05.07",
    status: "심사 완료",
    score: 91,
    detailedScores: { "기술 실용성": 95, "창의성": 85, "파급 효과": 92 },
    award: "Innovation (3팀)",
    review: "기술적 완성도가 매우 높습니다. 실제 클라우드 환경 적용 가능성이 인상적이며, 발표 자료도 명확합니다.",
    reviewedAt: "2026.05.08",
    rewardDistribution: [
      {
        userId: 10,
        nickname: "Security_Ninja",
        role: "팀장 / 보안 엔지니어",
        participationReward: 250,
        scoreReward: 500,
        awardReward: 1100,
        total: 1850,
        breakdown: [
          "250 PTS 참가 리워드",
          "500 PTS 우수 심사 성과 보너스",
          "1100 PTS 입상 보너스"
        ]
      },
      {
        userId: 8,
        nickname: "Mobile_King",
        role: "DevOps",
        participationReward: 250,
        scoreReward: 500,
        awardReward: 1100,
        total: 1850,
        breakdown: [
          "250 PTS 참가 리워드",
          "500 PTS 우수 심사 성과 보너스",
          "1100 PTS 입상 보너스"
        ]
      }
    ],
    rewardsApplied: true,
    links: ["https://github.com/sync-guard/scanner"],
    files: [
      { name: "최종_PPT.pdf", size: "5.1MB", type: "발표자료" },
      { name: "보안_설계서.pdf", size: "3.2MB", type: "기획서" }
    ],
    members: [
      { nickname: "Security_Ninja", role: "팀장 / 보안 엔지니어", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ivy" },
      { nickname: "Mobile_King", role: "DevOps", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mia" }
    ],
    tasks: [
      { title: "컨테이너 트래픽 모니터링 모듈", status: "Done", assignee: "Security_Ninja", priority: "High" },
      { title: "관리자 대시보드 UI 구현", status: "Done", assignee: "Mobile_King", priority: "Medium" }
    ],
    documents: [
      { name: "제로 트러스트 아키텍처 설계", type: "기획서", updated: "2026.05.06" }
    ]
  }
]);

export const mockWorkspaceChats = reactive([
  {
    id: 'team-1-group',
    teamId: 1,
    type: 'group',
    name: '팀 전체 채팅',
    participantIds: [1, 2, 3, 4],
    messages: [
      {
        id: 101,
        senderId: 2,
        text: '백엔드 API 스펙 초안 올려뒀어요. docs 탭에서 확인 부탁해요.',
        sentAt: '2026.04.04 18:20',
        readBy: [
          { userId: 2, readAt: '2026.04.04 18:20' },
          { userId: 1, readAt: '2026.04.04 18:24' },
          { userId: 4, readAt: '2026.04.04 18:28' }
        ]
      },
      {
        id: 102,
        senderId: 1,
        text: '확인했습니다. 오늘 밤까지 프론트 요구사항 정리해서 연결할게요.',
        sentAt: '2026.04.04 18:33',
        readBy: [
          { userId: 1, readAt: '2026.04.04 18:33' },
          { userId: 2, readAt: '2026.04.04 18:36' },
          { userId: 3, readAt: '2026.04.04 18:41' }
        ]
      },
      {
        id: 103,
        senderId: 4,
        text: '배포 환경 변수는 제가 정리해둘게요.',
        sentAt: '2026.04.04 19:05',
        readBy: [
          { userId: 4, readAt: '2026.04.04 19:05' }
        ]
      }
    ]
  },
  {
    id: 'team-1-dm-1-2',
    teamId: 1,
    type: 'dm',
    name: '건축가_Kim · Alex_Dev',
    participantIds: [1, 2],
    messages: [
      {
        id: 111,
        senderId: 2,
        text: '내일 오전에 API 응답 포맷만 한 번 맞춰볼까요?',
        sentAt: '2026.04.04 20:12',
        readBy: [
          { userId: 2, readAt: '2026.04.04 20:12' },
          { userId: 1, readAt: '2026.04.04 20:15' }
        ]
      },
      {
        id: 112,
        senderId: 1,
        text: '좋아요. 오전 10시에 워크스페이스에서 보죠.',
        sentAt: '2026.04.04 20:19',
        readBy: [
          { userId: 1, readAt: '2026.04.04 20:19' }
        ]
      }
    ]
  },
  {
    id: 'team-2-group',
    teamId: 2,
    type: 'group',
    name: '팀 전체 채팅',
    participantIds: [8, 10],
    messages: [
      {
        id: 201,
        senderId: 10,
        text: '심사 결과 나왔습니다. 리뷰 코멘트 반영해서 포트폴리오 정리해보죠.',
        sentAt: '2026.05.08 10:10',
        readBy: [
          { userId: 10, readAt: '2026.05.08 10:10' },
          { userId: 8, readAt: '2026.05.08 10:14' }
        ]
      },
      {
        id: 202,
        senderId: 8,
        text: '좋아요. 발표 자료도 업데이트해둘게요.',
        sentAt: '2026.05.08 10:17',
        readBy: [
          { userId: 8, readAt: '2026.05.08 10:17' }
        ]
      }
    ]
  },
  {
    id: 'team-3-group',
    teamId: 3,
    type: 'group',
    name: '팀 전체 채팅',
    participantIds: [1, 5, 6],
    messages: [
      {
        id: 301,
        senderId: 5,
        text: '결제 플로우 시안 v2 업로드했습니다.',
        sentAt: '2026.04.03 15:42',
        readBy: [
          { userId: 5, readAt: '2026.04.03 15:42' },
          { userId: 1, readAt: '2026.04.03 15:50' }
        ]
      },
      {
        id: 302,
        senderId: 6,
        text: '저녁 배포 전에 반응형 체크만 한번 더 하겠습니다.',
        sentAt: '2026.04.03 16:05',
        readBy: [
          { userId: 6, readAt: '2026.04.03 16:05' }
        ]
      }
    ]
  }
]);

export const mockJoinRequests = reactive([
  { id: 1, teamId: 1, userId: 2, nickname: "Alex_Dev", role: "프론트엔드", message: "안녕하세요! Vue3 실무 경험 2년차인 프론트엔드 개발자입니다. 기획하신 AI 챗봇의 UI가 흥미로워서 지원합니다.", status: "pending", createdAt: "2026.04.03" }
]);
