/**
 * 2026 해커톤 플랫폼 핵심 비즈니스 로직 V2 (Controllers)
 * 명세서 요구사항에 맞게 완벽하게 보완된 비즈니스 로직입니다.
 */

// 1. 해커톤 내 팀 목록 조회 (누락되었던 함수 추가)
async function getHackathonTeams(hackathonId) {
    // 수락(accepted)된 팀 멤버들만 함께 조회합니다.
    const { data, error } = await db.from('teams')
        .select(`
            id, name, intro, is_open, looking_for, contact_url,
            team_members!inner(user_id, role, status, profiles(nickname))
        `)
        .eq('hackathon_id', hackathonId)
        .eq('team_members.status', 'accepted');
        
    if (error) throw error;
    return data;
}

// 2. 해커톤 상세 조회 (7대 필수 섹션, 미제출자 표기 로직 완벽 포함)
async function getHackathonDetail(slug) {
    try {
        const hackathon = await db.from('hackathons').select('*').eq('slug', slug).single();
        if (!hackathon) throw new Error('데이터 없음');

        // 참여 중인 전체 팀을 기준으로 제출물을 LEFT JOIN 하여 리더보드/제출 현황을 구성합니다.
        const { data: teamsData, error: lbError } = await db.from('teams')
            .select(`
                id, name,
                submissions (score, submitted_at)
            `)
            .eq('hackathon_id', hackathon.id);

        if (lbError) throw lbError;

        // 미제출자 데이터 처리: submission이 배열로 들어오거나 null 일 수 있음 (Supabase JS 기준)
        const Leaderboard = teamsData.map(team => {
            const submission = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;
            return {
                team_id: team.id,
                team_name: team.name,
                score: submission ? submission.score : 0,
                status: submission ? '제출 완료' : '미제출'
            };
        }).sort((a, b) => b.score - a.score);

        return {
            status: 'success',
            data: {
                Overview: hackathon.evaluation_criteria,
                Eval: hackathon.evaluation_criteria?.scoring_rules,
                Schedule: hackathon.schedule,
                Prize: hackathon.prize_info,
                Teams: await getHackathonTeams(hackathon.id), // 승인된 팀 목록 표출
                Submit: { guide: "파일은 zip, pdf, csv 형식을 지원합니다." },
                Leaderboard: Leaderboard // 미제출팀 포함 랭킹
            }
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// 3. 팀 참여 요청 (초대/수락/거절 플로우 1단계: 요청)
async function requestJoinTeam(teamId, userId) {
    try {
        const team = await db.from('teams').select('is_open').eq('id', teamId).single();
        if (!team.is_open) throw new Error('모집이 마감된 팀입니다.');

        // pending 상태로 등록하여 수락 대기
        const { error } = await db.from('team_members').insert({
            team_id: teamId,
            user_id: userId,
            role: 'member',
            status: 'pending'
        });

        // (선택) 여기에 팀 리더에게 messages 테이블을 통한 알림 로직 추가
        if (error) throw error;
        return { status: 'success', message: '팀 합류 요청이 전송되었습니다. 리더의 수락을 기다려주세요.' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// 4. 팀 참여 요청 처리 (초대/수락/거절 플로우 2단계: 수락/거절 - 리더 전용)
async function respondToTeamRequest(teamId, targetUserId, approverId, action) {
    try {
        // approverId가 실제로 리더 권한인지 확인
        const leaderCheck = await db.from('team_members')
            .select('role')
            .eq('team_id', teamId).eq('user_id', approverId).single();
            
        if (!leaderCheck || leaderCheck.role !== 'leader') {
            throw new Error('팀 리더만 수락/거절할 수 있습니다.');
        }

        const newStatus = action === 'accept' ? 'accepted' : 'rejected';

        const { error } = await db.from('team_members')
            .update({ status: newStatus })
            .eq('team_id', teamId)
            .eq('user_id', targetUserId);

        if (error) throw error;
        return { status: 'success', message: `가입 요청이 ${newStatus} 처리되었습니다.` };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// 5. 제출 로직
async function submitProject(hackathonId, teamId, submissionData) {
    try {
        const { note, fileUrl } = submissionData;
        const { data, error } = await db.from('submissions').upsert({
            hackathon_id: hackathonId,
            team_id: teamId,
            note: note,
            file_url: fileUrl,
            submitted_at: new Date().toISOString()
        });
        if (error) throw error;
        return { status: 'success', data };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// 6. 기간별 랭킹 로직 (point_history를 활용한 완벽한 7일/30일/전체 기간 필터링)
async function getGlobalRankings(period = 'all') {
    try {
        let query = db.from('point_history').select('user_id, points_earned, profiles(nickname, avatar_url)');
        
        // 획득일자(earned_at) 기준으로 완벽한 기간 필터 적용
        if (period === '7d') {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            query = query.filter('earned_at', 'gte', sevenDaysAgo);
        } else if (period === '30d') {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            query = query.filter('earned_at', 'gte', thirtyDaysAgo);
        }

        const { data, error } = await query;
        if (error) throw error;

        // 기간 내 획득한 점수를 유저별로 합산하여 랭킹 도출 (JavaScript 레벨 맵리듀스)
        // (트래픽 규모에 따라 DB View나 Stored Procedure로 전환 가능)
        const rankingMap = {};
        data.forEach(row => {
            if (!rankingMap[row.user_id]) {
                rankingMap[row.user_id] = { nickname: row.profiles.nickname, points: 0 };
            }
            rankingMap[row.user_id].points += row.points_earned;
        });

        const sortedRankings = Object.values(rankingMap)
            .sort((a, b) => b.points - a.points)
            .map((user, index) => ({ rank: index + 1, ...user }));
        
        return sortedRankings.length > 0 ? { status: 'success', data: sortedRankings } : { status: 'empty' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

// 7. 팀 모집(Camp) 필터링
async function getCampTeams(hackathonSlug = null) {
    try {
        // 독립적인 캠프 리스트(특정 해커톤 전용 여부는 쿼리 스트링으로 필터)
        let query = db.from('teams').select('*, hackathons(slug)');
        if (hackathonSlug) query = query.eq('hackathons.slug', hackathonSlug);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data.length > 0 ? { status: 'success', data } : { status: 'empty' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}
