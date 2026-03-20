<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col gap-8 pb-24">
    <div class="flex items-end justify-between border-b border-white/5 pb-4">
      <h1 class="text-4xl font-outfit font-bold text-white tracking-tight">Explore</h1>
      <p class="text-sm text-sync-muted">128 Hackathons found</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-64 flex flex-col gap-6 flex-shrink-0">
        <!-- Status Filter -->
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-5">
          <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest mb-4">STATUS</h3>
          <div class="flex flex-col gap-2">
            <button class="w-full text-left px-4 py-2.5 rounded-lg bg-sync-primary text-white font-medium text-sm transition-colors shadow-[0_4px_12px_rgba(50,132,255,0.2)]">전체</button>
            <button class="w-full text-left px-4 py-2.5 rounded-lg text-sync-muted hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">진행 중</button>
            <button class="w-full text-left px-4 py-2.5 rounded-lg text-sync-muted hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">종료</button>
          </div>
        </div>

        <!-- Categories Filter -->
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-5">
          <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest mb-4">CATEGORIES</h3>
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-transparent group-hover:border-white/40 transition-colors"></div>
              <span class="text-sm text-sync-muted group-hover:text-white transition-colors">AI</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-transparent group-hover:border-white/40 transition-colors"></div>
              <span class="text-sm text-sync-muted group-hover:text-white transition-colors">웹</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-transparent group-hover:border-white/40 transition-colors"></div>
              <span class="text-sm text-sync-muted group-hover:text-white transition-colors">모바일</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Main Grid -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card 1 -->
        <RouterLink to="/hackathons/1" class="bg-[#181A20] rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 hover:border-white/10 transition-all shadow-sm flex flex-col">
          <div class="h-[200px] w-full bg-gradient-to-br from-[#77B5AE] to-[#609993] flex items-center justify-center relative overflow-hidden">
            <div class="text-center">
              <h2 class="text-3xl font-outfit font-light text-white/90 tracking-widest mb-1">AI HACKATHON</h2>
              <p class="text-[10px] text-white/60 tracking-[0.3em] uppercase">MINIMAL DATA SET WORK</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded">진행 중</span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">AI · MACHINE LEARNING</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-sync-primary transition-colors">2026 글로벌 AI 해커톤</h3>
            </div>
            <div class="flex flex-col gap-2 text-xs text-sync-muted mt-2">
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 2026.05.01 ~ 2026.05.07</span>
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 참가자 128명</span>
            </div>
          </div>
        </RouterLink>

        <!-- Card 2 -->
        <RouterLink to="/hackathons/2" class="bg-[#181A20] rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 hover:border-white/10 transition-all shadow-sm flex flex-col">
          <div class="h-[200px] w-full bg-gradient-to-br from-[#215E65] to-[#12363A] flex items-center justify-center relative overflow-hidden">
             <!-- abstract network lines background hint -->
             <div class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iI2ZmZiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
             <div class="text-center z-10">
              <h2 class="text-2xl font-outfit font-bold text-[#6DF0E2] tracking-widest mb-1 drop-shadow-lg">CYBERSECURITY</h2>
              <h3 class="text-xl font-outfit font-bold text-white tracking-widest mb-2">HACKATHON</h3>
              <p class="text-[9px] text-white/50 tracking-[0.2em] uppercase">SAFE INFRASTRUCTURE WORK</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded">진행 중</span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">SECURITY · CLOUD</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-sync-primary transition-colors">차세대 보안 아키텍처 챌린지</h3>
            </div>
            <div class="flex flex-col gap-2 text-xs text-sync-muted mt-2">
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 2026.06.12 ~ 2026.06.15</span>
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 참가자 84명</span>
            </div>
          </div>
        </RouterLink>

        <!-- Card 3 -->
        <RouterLink to="/hackathons/3" class="bg-[#181A20] rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 hover:border-white/10 transition-all shadow-sm flex flex-col">
          <div class="h-[200px] w-full bg-[#1F2C3D] flex items-center justify-center relative overflow-hidden">
            <div class="text-center relative z-10 w-full px-8">
              <h2 class="text-[40px] font-bold text-white tracking-widest mb-4">wb33</h2>
              <div class="w-full flex justify-between items-center text-[9px] text-white/50 tracking-[0.2em] uppercase">
                <span>NATURAL HACKATHON</span>
                <span>SAFE YOUR WORK</span>
              </div>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded border border-white/5">종료</span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">WEB3 · NFT</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-sync-primary transition-colors">Sync Web3 넥서스</h3>
            </div>
            <div class="flex flex-col gap-2 text-xs text-sync-muted mt-2">
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 2026.03.20 ~ 2026.03.22</span>
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 참가자 215명</span>
            </div>
          </div>
        </RouterLink>

        <!-- Card 4 -->
        <RouterLink to="/hackathons/4" class="bg-[#181A20] rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 hover:border-white/10 transition-all shadow-sm flex flex-col">
          <div class="h-[200px] w-full bg-white flex items-center justify-center relative overflow-hidden p-6">
            <div class="w-full h-full bg-[#3FB9AE] flex flex-col items-center justify-center text-center">
               <h2 class="text-2xl font-outfit font-light text-white tracking-widest mb-2">DEVELOPER CONFERENCE</h2>
               <p class="text-[7px] text-white/70 tracking-widest max-w-[80%] uppercase">Quality products require excellent education networks where background basics discover paths</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded">예정</span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">BACKEND · INFRA</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-sync-primary transition-colors">백엔드 시스템 아키텍처 공모전</h3>
            </div>
            <div class="flex flex-col gap-2 text-xs text-sync-muted mt-2">
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 2026.07.15 ~ 2026.07.25</span>
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 참가자 42명 신청중</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
