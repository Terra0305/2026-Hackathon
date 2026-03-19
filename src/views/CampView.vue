<script setup>
</script>

<template>
  <div class="flex flex-col gap-10 pb-24 relative">
    
    <!-- Hero Section -->
    <section class="flex flex-col items-start gap-4">
      <div class="flex items-center gap-2 px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/20 text-[10px] font-bold tracking-widest uppercase text-teal-400">
        LIVE RECRUITMENT <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
      </div>
      
      <h1 class="text-5xl md:text-6xl font-outfit font-bold tracking-tight leading-[1.1] mt-2">
        <span class="text-white">Build the Next.</span><br/>
        <span class="text-aelier-primary">Join the Camp.</span>
      </h1>
      
      <p class="text-aelier-muted leading-relaxed mt-2 max-w-xl">
        혁신적인 아이디어를 현실로 구현할 동료를 찾으세요.<br/>
        AELIER Camp에서 최고의 팀원들과 함께 성장을 시작하세요.
      </p>
    </section>

    <!-- Search & Filters -->
    <section class="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
      <div class="relative w-full md:w-[400px]">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-aelier-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="text" class="w-full bg-[#181A20] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-aelier-muted focus:outline-none focus:border-white/20 transition-colors shadow-sm" placeholder="관심 분야나 팀명을 검색하세요" />
      </div>
      
      <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        <button class="px-5 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors whitespace-nowrap">전체보기</button>
        <button class="px-5 py-2.5 rounded-xl bg-[#181A20] text-aelier-muted hover:text-white text-sm font-medium border border-white/5 hover:border-white/10 transition-colors whitespace-nowrap">개발자</button>
        <button class="px-5 py-2.5 rounded-xl bg-[#181A20] text-aelier-muted hover:text-white text-sm font-medium border border-white/5 hover:border-white/10 transition-colors whitespace-nowrap">디자이너</button>
        <button class="px-5 py-2.5 rounded-xl bg-[#181A20] text-aelier-muted hover:text-white text-sm font-medium border border-white/5 hover:border-white/10 transition-colors whitespace-nowrap">기획자</button>
      </div>
    </section>

    <!-- Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Card 1 -->
      <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600"></div>
          <span class="px-2.5 py-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md">모집 중</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Neural Sparks</h3>
        <p class="text-sm text-aelier-muted leading-relaxed line-clamp-2 mb-6 min-h-[40px]">
          AI 기반 서비스 개발 단체입니다. 인간의 지능을 확장하는 새로운 인터페이스를 탐구합니다.
        </p>
        <div class="flex items-center gap-2 text-xs font-medium text-aelier-muted mt-auto mb-4">
           <span>👥</span> 프론트엔드 · 백엔드 · 디자이너
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-orange-300 z-30"></div>
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-blue-300 z-20"></div>
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-[#22252D] text-[10px] text-white/70 flex items-center justify-center font-bold z-10">+2</div>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex-1 py-3 bg-aelier-primary hover:bg-aelier-primaryHover text-white text-sm font-medium rounded-xl transition-colors">문의하기</button>
            <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-aelier-muted hover:text-white transition-colors border border-white/5">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
           <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-indigo-500"></div>
          <span class="px-2.5 py-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md">모집 중</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Web3 Pioneers</h3>
        <p class="text-sm text-aelier-muted leading-relaxed line-clamp-2 mb-6 min-h-[40px]">
          탈중앙화 금융 솔루션을 구축하고 있습니다. 복잡한 블록체인 경험을 심리스하게 만듭니다.
        </p>
        <div class="flex items-center gap-2 text-xs font-medium text-aelier-muted mt-auto mb-4">
           <span>👥</span> 스마트컨트랙트 개발 · 백엔드
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-pink-300 z-20"></div>
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-teal-300 z-10"></div>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex-1 py-3 bg-aelier-primary hover:bg-aelier-primaryHover text-white text-sm font-medium rounded-xl transition-colors">문의하기</button>
            <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-aelier-muted hover:text-white transition-colors border border-white/5">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
           <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600"></div>
          <span class="px-2.5 py-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md">모집 중</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Zero Gravity</h3>
        <p class="text-sm text-aelier-muted leading-relaxed line-clamp-2 mb-6 min-h-[40px]">
          오프라인 경험을 디지털로 연결하는 O4O 프로젝트입니다. 공간의 제약을 넘는 새로운 가치를 만듭니다.
        </p>
        <div class="flex items-center gap-2 text-xs font-medium text-aelier-muted mt-auto mb-4">
           <span>👥</span> 프론트엔드 · 기획자
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-indigo-300 z-20"></div>
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-[#22252D] text-[10px] text-white/70 flex items-center justify-center font-bold z-10">+1</div>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex-1 py-3 bg-aelier-primary hover:bg-aelier-primaryHover text-white text-sm font-medium rounded-xl transition-colors">문의하기</button>
             <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-aelier-muted hover:text-white transition-colors border border-white/5">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
           <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600"></div>
          <span class="px-2.5 py-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md">모집 중</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">E-Flow</h3>
        <p class="text-sm text-aelier-muted leading-relaxed line-clamp-2 mb-6 min-h-[40px]">
          에너지 소비 최적화를 위한 IoT 대시보드를 제작합니다. 지속 가능한 미래를 위한 데이터 시각화를 합니다.
        </p>
         <div class="flex items-center gap-2 text-xs font-medium text-aelier-muted mt-auto mb-4">
           <span>👥</span> 데이터 분석 · 프론트엔드
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-[#181A20] bg-cyan-300 z-10"></div>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex-1 py-3 bg-aelier-primary hover:bg-aelier-primaryHover text-white text-sm font-medium rounded-xl transition-colors">문의하기</button>
             <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-aelier-muted hover:text-white transition-colors border border-white/5">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Card -->
      <div class="bg-[#181A20]/30 rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center hover:bg-[#181A20]/60 hover:border-white/20 transition-all cursor-pointer min-h-[360px]">
        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-2xl mb-6">
          +
        </div>
        <h3 class="text-lg font-bold text-white mb-2">우리 팀원 구하기</h3>
        <p class="text-xs text-aelier-muted leading-relaxed mb-6 max-w-[200px]">
          함께 프로젝트를 완주할 멋진 팀원을 모집해 보세요.
        </p>
        <button class="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10">
          모집 글 쓰기
        </button>
      </div>

    </section>

    <!-- Floating Action Button -->
    <div class="fixed bottom-8 right-8 z-40">
      <button class="w-14 h-14 bg-aelier-primary hover:bg-aelier-primaryHover text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(50,132,255,0.4)] transition-transform hover:scale-105">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
      </button>
    </div>
  </div>
</template>
