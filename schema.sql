-- 2026 해커톤 플랫폼 데이터베이스 스키마 V2 (완벽 보완 적용)

-- 1. 유저 프로필 및 글로벌 랭킹 누적점수
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname TEXT UNIQUE NOT NULL,
    points INTEGER DEFAULT 0, -- 누적 총합 (최적화를 위해 유지)
    rank INTEGER,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 포인트 획득 히스토리 (기간별 랭킹 필터링용)
CREATE TABLE point_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hackathon_id UUID, -- 어떤 해커톤에서 얻은 점수인지
    points_earned INTEGER NOT NULL,
    reason TEXT, -- 예: "해커톤 수상", "제출 보너스"
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 해커톤 정보
CREATE TABLE hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT CHECK (status IN ('진행 중', '종료', '예정')) DEFAULT '예정',
    description TEXT,
    evaluation_criteria JSONB, -- 평가 기준 (Overview 섹션 등)
    schedule JSONB, -- 전체 타임라인 (Schedule 섹션)
    prize_info JSONB, -- 시상 내역 및 혜택 (Prize 섹션)
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    participant_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 팀 모집 (Camp)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    intro TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    looking_for TEXT[], -- 모집 대상 포지션 배열
    contact_url TEXT,
    hackathon_id UUID REFERENCES hackathons(id), -- 특정 해커톤 전용일 경우 연동
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 팀 멤버 관리 (초대/수락/거절 플로우 포함)
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- leader, member
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- 6. 제출물 관리
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    note TEXT,
    file_url TEXT, -- zip, pdf, csv 등 업로드 경로
    score NUMERIC DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 메시지/알림 (팀 빌딩 초대 등)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES profiles(id),
    receiver_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general', -- general, invitation, system
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
