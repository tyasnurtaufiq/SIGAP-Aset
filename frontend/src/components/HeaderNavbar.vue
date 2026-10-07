<template>
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-[#1E252D]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <div class="w-10 h-10 rounded-2xl bg-[#00B368] flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="font-display font-black text-xl tracking-tight leading-none flex items-center gap-1.5">
            <span class="text-slate-900 dark:text-white">SIGAP</span>
            <span class="text-[#00B368]">ASET</span>
          </div>
          <span class="text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-0.5">DISHUB DIY</span>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <a href="#beranda" class="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Beranda</a>
        <a href="#peta" class="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Peta Aset</a>
        <a href="#data" class="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Data Aset</a>
      </nav>

      <!-- Right: Light/Dark Mode Switcher & Login/Dashboard Button -->
      <div class="flex items-center gap-3">
        <!-- Light / Dark Mode Toggle Pill -->
        <button
          @click="themeStore.toggleTheme"
          class="relative inline-flex items-center h-8 rounded-full p-1 w-14 transition-colors duration-300 focus:outline-none shadow-inner"
          :class="themeStore.isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200 border border-slate-300'"
          title="Ganti Mode Terang / Gelap"
          aria-label="Toggle Light/Dark Mode"
        >
          <span
            class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#00B368] text-slate-800 dark:text-white shadow-md transform transition-transform duration-300"
            :class="themeStore.isDark ? 'translate-x-6' : 'translate-x-0'"
          >
            <svg v-if="!themeStore.isDark" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
        </button>

        <template v-if="authStore.isLoggedIn">
          <button
            @click="router.push('/dashboard')"
            class="inline-flex items-center gap-1.5 bg-[#00B368] hover:bg-[#009E5B] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-emerald-500/20 transition-all duration-200"
          >
            Dashboard Admin
          </button>
        </template>
        <template v-else>
          <button
            @click="assetStore.isLoginModalOpen = true"
            class="inline-flex items-center gap-1.5 bg-[#00B368] hover:bg-[#009E5B] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-emerald-500/20 transition-all duration-200"
          >
            Masuk Petugas
          </button>
        </template>
        
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E252D] px-5 py-4 flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xl"
    >
      <a href="#beranda" @click="isMobileMenuOpen = false" class="py-2">Beranda</a>
      <a href="#peta" @click="isMobileMenuOpen = false" class="py-2">Peta Aset</a>
      <a href="#data" @click="isMobileMenuOpen = false" class="py-2">Data Aset</a>
      
      <button
        v-if="authStore.isLoggedIn"
        @click="router.push('/dashboard'); isMobileMenuOpen = false"
        class="mt-2 bg-[#00B368] text-white text-xs font-bold px-5 py-2.5 rounded-full text-center"
      >
        Dashboard Admin
      </button>
      <button
        v-else
        @click="assetStore.isLoginModalOpen = true; isMobileMenuOpen = false"
        class="mt-2 bg-[#00B368] text-white text-xs font-bold px-5 py-2.5 rounded-full text-center"
      >
        Masuk Petugas
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';
import { useThemeStore } from '../stores/theme';

const router = useRouter();
const authStore = useAuthStore();
const assetStore = useAssetStore();
const themeStore = useThemeStore();
const isMobileMenuOpen = ref(false);
</script>
