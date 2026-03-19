<script setup>
</script>

<template>
  <div class="flex flex-col gap-6 pb-24 max-w-[1200px] mx-auto w-full">
    <!-- Hero Section -->
    <section class="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#101928] to-[#0A0D14] border border-white/5 p-12 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
      
      <div class="relative z-10 flex flex-col items-start gap-6 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-[0.15em] uppercase">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
          LIVE NOW
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-outfit font-bold tracking-tight text-white leading-[1.1]">
          2026 글로벌 AI 해커톤
        </h1>
        
        <p class="text-base text-aelier-muted leading-relaxed max-w-xl">
          차세대 인공지능 모델을 활용한 혁신적인 서비스를 빌드하세요. 전 세계 엔지니어들과 경쟁하며 미래의 디지털 생태계를 설계하는 72시간의 몰입 여정입니다.
        </p>
        
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button class="bg-aelier-primary hover:bg-aelier-primaryHover text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md">
            참가 신청하기
          </button>
          <button class="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            자세히 보기
          </button>
        </div>
      </div>

      <div class="hidden lg:flex relative z-10 w-48 h-48 items-center justify-center">
        <!-- Circular decorative graphic -->
        <div class="absolute inset-0 rounded-full border border-white/5"></div>
        <div class="absolute inset-4 rounded-full border border-white/10"></div>
        <div class="absolute inset-8 rounded-full border border-white/20"></div>
        <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          <span class="text-3xl">✨</span>
        </div>
      </div>
    </section>

    <!-- Progress & Timeline Grid -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      <!-- Progress Card -->
      <div class="lg:col-span-4 bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
        <h3 class="text-sm font-bold text-aelier-muted mb-6">진행률</h3>
        
        <div class="flex flex-col items-center gap-6 flex-1 justify-center">
          <div class="relative w-40 h-40">
            <!-- Circular Progress Bar -->
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" class="stroke-[#22252D]" stroke-width="8"></circle>
              <circle cx="50" cy="50" r="45" fill="none" class="stroke-aelier-primary" stroke-width="8" stroke-dasharray="283" stroke-dashoffset="70.75" stroke-linecap="round"></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-outfit font-bold text-white">75%</span>
              <span class="text-[10px] text-aelier-muted uppercase tracking-widest mt-1">개발 단계</span>
            </div>
          </div>
          
          <p class="text-xs text-center text-aelier-muted">최종 결과 발표까지 <span class="text-white font-medium">3일 14시간</span> 남음</p>
        </div>
      </div>

      <!-- Roadmap Card -->
      <div class="lg:col-span-8 bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-sm font-bold text-aelier-muted">해커톤 로드맵</h3>
          <span class="px-3 py-1 bg-white/5 rounded text-[10px] text-white/50 tracking-widest uppercase">Phase 2</span>
        </div>
        
        <div class="flex-1 flex items-center px-4 py-8">
          <!-- Timeline -->
          <div class="relative w-full flex justify-between items-center">
            <!-- Track Background -->
            <div class="absolute top-[9px] left-0 w-full h-1 bg-[#22252D] rounded-full"></div>
            <!-- Track Progress (75% -> up to 심사) -->
            <div class="absolute top-[9px] left-0 w-[66%] h-1 bg-aelier-primary rounded-full"></div>
            
            <!-- Nodes -->
            <div class="relative flex flex-col items-center gap-3 z-10 w-1/4">
              <div class="w-5 h-5 rounded-full bg-aelier-primary border-4 border-[#181A20] shadow-[0_0_10px_rgba(50,132,255,0.5)]"></div>
              <div class="text-center">
                <div class="text-sm font-bold text-white">접수</div>
                <div class="text-[10px] text-aelier-muted">01.01 - 01.15</div>
              </div>
            </div>
            
            <div class="relative flex flex-col items-center gap-3 z-10 w-1/4">
              <div class="w-5 h-5 rounded-full bg-aelier-primary border-4 border-[#181A20] shadow-[0_0_10px_rgba(50,132,255,0.5)]"></div>
               <div class="text-center">
                <div class="text-sm font-bold text-white">개발</div>
                <div class="text-[10px] text-aelier-muted">01.16 - 01.19</div>
              </div>
            </div>
            
            <div class="relative flex flex-col items-center gap-3 z-10 w-1/4">
              <div class="w-5 h-5 rounded-full bg-[#22252D] border-4 border-[#181A20] flex items-center justify-center">
                 <div class="w-2.5 h-2.5 rounded-full bg-aelier-primary"></div>
              </div>
               <div class="text-center">
                <div class="text-sm font-bold text-white">심사</div>
                <div class="text-[10px] text-aelier-muted">01.20 - 01.22</div>
              </div>
            </div>
            
            <div class="relative flex flex-col items-center gap-3 z-10 w-1/4">
              <div class="w-5 h-5 rounded-full bg-[#323642] border-[4px] border-[#181A20]"></div>
               <div class="text-center">
                <div class="text-sm font-medium text-aelier-muted">발표</div>
                <div class="text-[10px] text-[#555A68]">01.23</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-white/5 pb-0 my-2 overflow-x-auto">
      <button class="px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-t-lg border-b-2 border-white/20">개요</button>
      <button class="px-5 py-2.5 text-aelier-muted hover:text-white text-sm font-medium transition-colors">일정</button>
      <button class="px-5 py-2.5 text-aelier-muted hover:text-white text-sm font-medium transition-colors">팀</button>
      <button class="px-5 py-2.5 text-aelier-muted hover:text-white text-sm font-medium transition-colors">제출</button>
      <button class="px-5 py-2.5 text-aelier-muted hover:text-white text-sm font-medium transition-colors">리더보드</button>
    </div>

    <!-- Bottom Grids -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      <!-- Notices & Team Row -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 h-full flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white">주요 공지사항</h3>
            <button class="text-[10px] text-aelier-muted hover:text-white uppercase tracking-widest font-bold transition-colors">모두 보기</button>
          </div>
          
          <div class="flex flex-col gap-3">
            <div class="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
              <div class="text-blue-400 mt-0.5"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg></div>
              <div class="flex flex-col gap-1">
                <h4 class="text-sm font-bold text-blue-100">API 엔드포인트 업데이트 안내</h4>
                <p class="text-xs text-aelier-muted">2시간 전</p>
              </div>
            </div>
            
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-4">
               <div class="text-teal-400 mt-0.5"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <div class="flex flex-col gap-1">
                <h4 class="text-sm font-bold text-white/80">중간 멘토링 세션 신청 마감 임박</h4>
                <p class="text-xs text-aelier-muted">6시간 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 h-full flex flex-col items-center justify-center text-center">
          <h3 class="text-sm font-bold text-white w-full text-left mb-6">나의 팀 현황</h3>
          
          <div class="flex flex-col items-center gap-4 w-full">
            <div class="flex -space-x-3 mb-2">
              <div class="w-10 h-10 rounded-full border-2 border-[#181A20] bg-gradient-to-tr from-purple-500 to-pink-500 z-30"></div>
              <div class="w-10 h-10 rounded-full border-2 border-[#181A20] bg-gradient-to-tr from-blue-400 to-cyan-400 z-20"></div>
              <div class="w-10 h-10 rounded-full border-2 border-[#181A20] bg-[#22252D] flex items-center justify-center text-[10px] text-white/70 font-bold z-10">+2</div>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="text-base font-bold text-white">Team PixelBenders</h4>
              <p class="text-xs text-aelier-muted">멤버 3/5명 참여 중</p>
            </div>
            
            <button class="w-full mt-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors border border-white/5">
              팀 관리하기
            </button>
          </div>
        </div>
      </div>

      <!-- Submit & Stats Row -->
      <div class="lg:col-span-4">
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 h-full flex flex-col">
          <h3 class="text-sm font-bold text-white mb-6">제출 현황</h3>
          
          <div class="flex flex-col gap-4 mb-6 relative z-10">
            <div class="flex items-center justify-between text-sm">
              <span class="text-aelier-muted">최종 코드</span>
              <span class="flex items-center gap-1.5 text-red-400 font-medium"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 미제출</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-aelier-muted">기획안</span>
              <span class="flex items-center gap-1.5 text-teal-400 font-medium"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> 완료</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-aelier-muted">데모 영상</span>
              <span class="text-white/60 font-medium">준비 중</span>
            </div>
          </div>
          
          <div class="mt-auto relative z-20">
            <button class="w-full py-3 bg-aelier-primary hover:bg-aelier-primaryHover rounded-lg text-sm font-medium text-white transition-colors">
              지금 제출하기
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col justify-center gap-2 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div class="text-[9px] text-aelier-muted uppercase tracking-[0.2em] font-bold">PARTICIPANTS</div>
          <div class="text-2xl md:text-3xl font-outfit font-bold text-white group-hover:text-aelier-primary transition-colors">1,240</div>
        </div>
        
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col justify-center gap-2 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div class="text-[9px] text-aelier-muted uppercase tracking-[0.2em] font-bold">PRIZE POOL</div>
          <div class="text-2xl md:text-3xl font-outfit font-bold text-teal-400 group-hover:text-teal-300 transition-colors">$50k</div>
        </div>
        
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col justify-center gap-2 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div class="text-[9px] text-aelier-muted uppercase tracking-[0.2em] font-bold">TEAMS</div>
          <div class="text-2xl md:text-3xl font-outfit font-bold text-white group-hover:text-aelier-primary transition-colors">312</div>
        </div>
        
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col justify-center gap-2 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div class="text-[9px] text-aelier-muted uppercase tracking-[0.2em] font-bold">DAYS LEFT</div>
          <div class="text-2xl md:text-3xl font-outfit font-bold text-white group-hover:text-aelier-primary transition-colors">03</div>
        </div>
      </div>
    </section>
  </div>
</template>
