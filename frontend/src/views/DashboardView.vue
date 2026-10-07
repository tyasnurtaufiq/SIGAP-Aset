<template>
  <div class="h-screen w-screen overflow-hidden flex bg-[#F4F7FB] dark:bg-[#131920] text-slate-800 dark:text-slate-100 transition-colors duration-200">
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden lg:flex w-64 shrink-0 flex-col h-full transition-colors duration-200 shadow-lg z-20 overflow-hidden',
        themeStore.isDark
          ? 'bg-[#1E252D] text-slate-200 border-r border-[#28323D]'
          : 'bg-[#00B368] text-white'
      ]"
    >
      <!-- Brand Logo Header -->
      <div
        class="h-16 shrink-0 flex items-center gap-3 px-5 border-b cursor-pointer transition-opacity hover:opacity-95"
        :class="themeStore.isDark ? 'border-slate-800' : 'border-white/15'"
        @click="router.push('/')"
      >
        <!-- Heartbeat / Geo Wave Pulse Emblem from Mockup -->
        <div
          class="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
          :class="themeStore.isDark ? 'bg-[#00B368]/20 text-[#00B368]' : 'bg-white/20 text-white'"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-black text-lg tracking-wider uppercase leading-none">
            SIGAP <span :class="themeStore.isDark ? 'text-[#00B368]' : 'text-amber-300'">ASET</span>
          </span>
          <span class="text-[9px] font-semibold tracking-widest uppercase opacity-75 mt-1">
            DISHUB DIY
          </span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5 text-sm overflow-y-auto">
        <p
          class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider"
          :class="themeStore.isDark ? 'text-slate-500' : 'text-white/60'"
        >
          Menu Utama
        </p>

        <!-- 1. Ringkasan (Dashboard) -->
        <button
          @click="activeTab = 'ringkasan'"
          :class="[
            'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
            activeTab === 'ringkasan'
              ? (themeStore.isDark
                  ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                  : 'bg-white text-[#00A859] shadow-md font-bold')
              : (themeStore.isDark
                  ? 'text-slate-300 hover:bg-slate-800/60'
                  : 'text-white/90 hover:bg-white/10')
          ]"
        >
          <div class="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
            <span>Ringkasan</span>
          </div>
          <svg v-if="activeTab !== 'ringkasan'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <!-- 2. Data Aset -->
        <button
          @click="activeTab = 'data'"
          :class="[
            'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
            activeTab === 'data'
              ? (themeStore.isDark
                  ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                  : 'bg-white text-[#00A859] shadow-md font-bold')
              : (themeStore.isDark
                  ? 'text-slate-300 hover:bg-slate-800/60'
                  : 'text-white/90 hover:bg-white/10')
          ]"
        >
          <div class="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>
            <span>Data Aset</span>
          </div>
          <svg v-if="activeTab !== 'data'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <!-- 3. Peta Geospasial -->
        <button
          @click="activeTab = 'peta'"
          :class="[
            'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
            activeTab === 'peta'
              ? (themeStore.isDark
                  ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                  : 'bg-white text-[#00A859] shadow-md font-bold')
              : (themeStore.isDark
                  ? 'text-slate-300 hover:bg-slate-800/60'
                  : 'text-white/90 hover:bg-white/10')
          ]"
        >
          <div class="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>Peta Aset</span>
          </div>
          <svg v-if="activeTab !== 'peta'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <!-- 4. Laporan & Ekspor -->
        <button
          @click="activeTab = 'laporan'"
          :class="[
            'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
            activeTab === 'laporan'
              ? (themeStore.isDark
                  ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                  : 'bg-white text-[#00A859] shadow-md font-bold')
              : (themeStore.isDark
                  ? 'text-slate-300 hover:bg-slate-800/60'
                  : 'text-white/90 hover:bg-white/10')
          ]"
        >
          <div class="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Laporan & Ekspor</span>
          </div>
          <svg v-if="activeTab !== 'laporan'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <!-- Super Admin Only Menus -->
        <template v-if="authStore.isSuperAdmin">
          <p
            class="px-3 mt-4 mb-2 text-[10px] font-bold uppercase tracking-wider"
            :class="themeStore.isDark ? 'text-slate-500' : 'text-white/60'"
          >
            Administrasi
          </p>

          <!-- 5. Manajemen Akun -->
          <button
            @click="activeTab = 'users'"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
              activeTab === 'users'
                ? (themeStore.isDark
                    ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                    : 'bg-white text-[#00A859] shadow-md font-bold')
                : (themeStore.isDark
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-white/90 hover:bg-white/10')
            ]"
          >
            <div class="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Manajemen Akun</span>
            </div>
            <svg v-if="activeTab !== 'users'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <!-- 6. Log Dihapus -->
          <button
            @click="activeTab = 'log'"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200',
              activeTab === 'log'
                ? (themeStore.isDark
                    ? 'bg-[#293440] text-[#00B368] shadow-sm border border-[#00B368]/40'
                    : 'bg-white text-[#00A859] shadow-md font-bold')
                : (themeStore.isDark
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-white/90 hover:bg-white/10')
            ]"
          >
            <div class="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Log Dihapus</span>
            </div>
            <span
              v-if="assetStore.deletedLog.length > 0"
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="themeStore.isDark ? 'bg-red-900/60 text-red-400' : 'bg-white text-red-600'"
            >
              {{ assetStore.deletedLog.length }}
            </span>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </template>
      </nav>

      <!-- Sidebar Bottom Actions -->
      <div
        class="p-4 border-t space-y-1.5"
        :class="themeStore.isDark ? 'border-slate-800' : 'border-white/15'"
      >
        <button
          @click="authStore.isProfileModalOpen = true"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors"
          :class="themeStore.isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-white/80 hover:bg-white/10 hover:text-white'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Profil / Ubah Sandi</span>
        </button>

        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors"
          :class="themeStore.isDark ? 'text-rose-400 hover:bg-rose-950/30' : 'text-red-100 hover:bg-white/10 hover:text-white'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <!-- Top Navbar (Matching Mockup with Search, Mode Switch, User Profile) -->
      <header
        class="h-16 shrink-0 bg-white dark:bg-[#1E252D] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-200"
      >
        <!-- Left: Mobile Menu & Search Input -->
        <div class="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
          <button
            @click="isMobileSidebarOpen = true"
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            aria-label="Buka Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          <!-- Search Bar from Mockup -->
          <!-- <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleQuickSearch"
              placeholder="Search / Cari aset..."
              class="w-full bg-[#F4F7FB] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B368] transition-all"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div> -->
        </div>

        <!-- Right: Badge, Light/Dark Mode Switcher, Profile -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Instansi Badge -->
          <div class="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full bg-[#00B368]"></span>
            <span>DISHUB DIY</span>
          </div>

          <!-- Light & Dark Mode Toggle Switch (Prominent pill matching user prompt!) -->
          <button
            @click="themeStore.toggleTheme"
            class="relative inline-flex items-center h-9 rounded-full p-1 w-16 transition-colors duration-300 focus:outline-none shadow-inner"
            :class="themeStore.isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200 border border-slate-300'"
            title="Ganti Mode Terang / Gelap"
            aria-label="Toggle Light/Dark Mode"
          >
            <!-- Sliding knob -->
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#00B368] text-slate-800 dark:text-white shadow-md transform transition-transform duration-300"
              :class="themeStore.isDark ? 'translate-x-7' : 'translate-x-0'"
            >
              <!-- Sun Icon in Light Mode -->
              <svg v-if="!themeStore.isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <!-- Moon Icon in Dark Mode -->
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </button>

          <!-- User Profile Dropdown / Trigger -->
          <div class="relative">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-colors"
            >
              <!-- Avatar -->
              <div class="w-9 h-9 rounded-full bg-[#00B368] text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-400/30 overflow-hidden shrink-0">
                <img v-if="userAvatarPhoto" :src="userAvatarPhoto" :alt="authStore.user?.nama_lengkap" class="w-full h-full object-cover" />
                <span v-else>{{ userInitials }}</span>
              </div>
              <!-- Text -->
              <div class="hidden sm:flex flex-col text-left">
                <span class="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                  {{ authStore.user?.nama_lengkap || authStore.user?.username || 'Super Admin' }}
                </span>
                <span class="text-[10px] text-[#00B368] font-semibold">
                  {{ authStore.isSuperAdmin ? 'Super Admin' : 'Petugas' }}
                </span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-400"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E252D] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 fade-in text-xs font-medium"
            >
              <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p class="font-bold text-slate-800 dark:text-white truncate">{{ authStore.user?.nama_lengkap || 'Admin' }}</p>
                <p class="text-[10px] text-slate-400">{{ authStore.user?.username }}</p>
              </div>
              <button
                @click="authStore.isProfileModalOpen = true; isUserMenuOpen = false"
                class="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Ubah Profil & Sandi
              </button>
              <button
                @click="handleLogout(); isUserMenuOpen = false"
                class="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Sidebar Drawer -->
      <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-0 z-[900]">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="isMobileSidebarOpen = false"></div>
        <div
          class="absolute left-0 top-0 h-full w-72 flex flex-col fade-in shadow-2xl transition-colors"
          :class="themeStore.isDark ? 'bg-[#1E252D] text-slate-200 border-r border-[#28323D]' : 'bg-[#00B368] text-white'"
        >
          <div class="h-20 flex items-center justify-between px-6 border-b" :class="themeStore.isDark ? 'border-slate-800' : 'border-white/15'">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-2xl flex items-center justify-center" :class="themeStore.isDark ? 'bg-[#00B368]/20 text-[#00B368]' : 'bg-white/20 text-white'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span class="font-display font-black text-lg">SIGAP <span :class="themeStore.isDark ? 'text-[#00B368]' : 'text-amber-300'">ASET</span></span>
            </div>
            <button @click="isMobileSidebarOpen = false" class="p-1 rounded-lg hover:bg-black/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <nav class="flex-1 px-4 py-6 flex flex-col gap-1 text-sm overflow-y-auto">
            <button @click="activeTab = 'ringkasan'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Ringkasan</button>
            <button @click="activeTab = 'data'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Data Aset</button>
            <button @click="activeTab = 'peta'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Peta Aset</button>
            <button @click="activeTab = 'laporan'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Laporan & Ekspor</button>
            <button v-if="authStore.isSuperAdmin" @click="activeTab = 'users'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Manajemen Akun</button>
            <button v-if="authStore.isSuperAdmin" @click="activeTab = 'log'; isMobileSidebarOpen = false" class="px-4 py-3 rounded-2xl text-left font-semibold">Log Dihapus</button>
          </nav>
        </div>
      </div>

      <!-- Main Workspace Container -->
      <main class="flex-1 p-3 sm:p-3.5 lg:p-4 overflow-y-auto min-h-0 flex flex-col">
        <!-- =================== TAB 1: RINGKASAN (DASHBOARD MATCHING MOCKUP) =================== -->
        <div v-if="activeTab === 'ringkasan'" class="h-full flex flex-col justify-between gap-2.5 sm:gap-3 min-h-0">
          <!-- TOP ROW: Spotlight Card (Left) + 6-Card KPI Grid (Right) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 shrink-0">
            <!-- Spotlight Officer Card (~30% / 4 cols on desktop) -->
            <div class="lg:col-span-4 xl:col-span-3">
              <DashboardOfficerCard />
            </div>

            <!-- 6 Metric Cards Grid (~70% / 8-9 cols on desktop) -->
            <div class="lg:col-span-8 xl:col-span-9">
              <DashboardStatCards />
            </div>
          </div>

          <!-- BOTTOM ROW: Main Survey/Dist Chart (Left) + Calendar (Right) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 flex-1 min-h-0">
            <!-- Hospital Survey style Dual-Bar Chart (~65% / 8 cols) -->
            <div class="lg:col-span-8 h-full min-h-0">
              <DashboardSurveyChart />
            </div>

            <!-- Calendar Widget (~35% / 4 cols) -->
            <div class="lg:col-span-4 h-full min-h-0">
              <DashboardCalendar />
            </div>
          </div>
        </div>

        <!-- =================== TAB 2: DATA ASET =================== -->
        <div v-if="activeTab === 'data'" class="flex-1 flex flex-col space-y-3 min-h-0">
          <div class="shrink-0">
            <h2 class="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              Daftar Inventaris Barang & Aset
            </h2>
          </div>

          <!-- Asset Table -->
          <div class="flex-1 min-h-0">
            <AssetTable :is-admin="true" @view-on-map-dash="handleViewOnMapDash" />
          </div>
        </div>

        <!-- =================== TAB 3: PETA ASET =================== -->
        <div v-if="activeTab === 'peta'" class="flex-1 flex flex-col space-y-2 min-h-0">
          <div class="flex items-center justify-between shrink-0">
            <div>
              <h2 class="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Peta Sebaran Aset Geospasial
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Peta interaktif titik aset perlengkapan jalan di Daerah Istimewa Yogyakarta
              </p>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1E252D] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex-1 min-h-[500px] flex flex-col">
            <AssetMap ref="dashMapRef" :show-tooltip="true" />
          </div>
        </div>

        <!-- =================== TAB 4: LAPORAN & EKSPOR =================== -->
        <div v-if="activeTab === 'laporan'" class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">
                Pusat Pelaporan & Rekapitulasi Data
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Tentukan kriteria filter data sebelum mengunduh atau mencetak berkas inventaris aset resmi
              </p>
            </div>
          </div>

          <!-- 1. PANEL FILTER KRITERIA EKSPOR -->
          <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00B368] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </div>
                <div>
                  <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white">Filter Data yang Ingin Diekspor</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Pilih tahun, jenis kategori, kondisi, atau asal usul untuk memfilter isi berkas</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="hasActiveExportFilters"
                  @click="resetExportFilters"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Reset Filter</span>
                </button>
              </div>
            </div>

            <!-- Grid 5 Pilihan Filter -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <!-- Filter Kata Kunci -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Cari Kata Kunci</label>
                <div class="relative">
                  <input
                    v-model="exportFilters.search"
                    type="text"
                    placeholder="Nama, merk, lokasi..."
                    class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B368]"
                  />
                  <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                </div>
              </div>

              <!-- Filter Tahun Perolehan -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Tahun Perolehan</label>
                <select
                  v-model="exportFilters.tahun"
                  class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B368]"
                >
                  <option value="">Semua Tahun</option>
                  <option v-for="t in assetStore.tahunOptions" :key="t" :value="t">Tahun {{ t }}</option>
                </select>
              </div>

              <!-- Filter Kategori / Bahan -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Kategori / Bahan</label>
                <select
                  v-model="exportFilters.kategori"
                  class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B368]"
                >
                  <option value="">Semua Kategori/Bahan</option>
                  <option v-for="c in assetStore.kategoriOptions" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <!-- Filter Kondisi -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Kondisi Barang</label>
                <select
                  v-model="exportFilters.kondisi"
                  class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B368]"
                >
                  <option value="">Semua Kondisi</option>
                  <option v-for="k in assetStore.kondisiOptions" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>

              <!-- Filter Asal Usul -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Asal Usul Anggaran</label>
                <select
                  v-model="exportFilters.asalUsul"
                  class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B368]"
                >
                  <option value="">Semua Asal Usul</option>
                  <option v-for="a in assetStore.asalUsulOptions" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
            </div>

            <!-- Banner Ringkasan Hasil Filter -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#00B368] font-bold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ filteredExportAssets.length }} Barang Siap Diekspor
                </span>
                <span class="text-slate-500 dark:text-slate-400 font-medium">({{ totalExportUnit }} Total Unit Fisik)</span>
              </div>
              <div class="text-slate-700 dark:text-slate-200 font-semibold">
                Akumulasi Nilai Terfilter: <span class="text-[#00B368] font-bold text-sm">Rp {{ totalExportNilai.toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </div>

          <!-- 2. KARTU METODE EKSPOR -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Ekspor CSV Card -->
            <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00B368] flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white">Ekspor CSV (Excel)</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Unduh {{ filteredExportAssets.length }} data terfilter ke file CSV mentah berformat UTF-8 BOM.</p>
              </div>
              <button
                @click="assetStore.exportCsv(filteredExportAssets)"
                :disabled="filteredExportAssets.length === 0"
                class="mt-4 w-full py-2.5 rounded-xl bg-[#00B368] hover:bg-[#009E5B] text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Unduh Berkas CSV ({{ filteredExportAssets.length }})
              </button>
            </div>

            <!-- Ekspor Excel Card -->
            <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h18"/></svg>
                </div>
                <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white">Ekspor Excel (.xlsx)</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Berkas resmi berborder rapi, foto fisik disematkan, lengkap dengan formula rekapitulasi.</p>
              </div>
              <button
                @click="assetStore.exportExcel(filteredExportAssets)"
                :disabled="filteredExportAssets.length === 0"
                class="mt-4 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Unduh Berkas Excel ({{ filteredExportAssets.length }})
              </button>
            </div>

            <!-- Cetak PDF Card -->
            <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                </div>
                <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white">Cetak Laporan PDF</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Laporan rekapitulasi landscape siap cetak dengan kop dinas DIY dan kolom tanda tangan.</p>
              </div>
              <button
                @click="assetStore.exportPdf(filteredExportAssets)"
                :disabled="filteredExportAssets.length === 0"
                class="mt-4 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cetak / Simpan PDF ({{ filteredExportAssets.length }})
              </button>
            </div>

            <!-- Google Sheets Sync Card -->
            <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 3v6h-6l2.5-2.5A6.97 6.97 0 0 0 12 5a7 7 0 1 0 7 7h2z"/></svg>
                </div>
                <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white">Google Sheets API</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Sinkronisasi langsung seluruh database aset ke spreadsheet Google Sheets Anda.</p>
              </div>
              <button
                @click="handleSyncGoogleSheets"
                :disabled="isSyncingSheets"
                class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {{ isSyncingSheets ? 'Menyinkronkan...' : 'Sinkron Sekarang' }}
              </button>
            </div>
          </div>

          <!-- 3. TABEL PRATINJAU DATA SIAP EKSPOR -->
          <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pratinjau Data yang Akan Masuk Berkas ({{ filteredExportAssets.length }} Barang)</span>
              </h3>
              <span class="text-xs text-slate-400 dark:text-slate-500">
                Menampilkan maksimal 10 baris teratas sebagai sampel
              </span>
            </div>

            <div v-if="filteredExportAssets.length === 0" class="py-8 text-center text-slate-400 text-xs">
              Tidak ada data barang yang cocok dengan kriteria filter di atas. Coba sesuaikan kembali filter Anda.
            </div>

            <div v-else class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
              <table class="w-full text-xs text-left min-w-[700px]">
                <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th class="px-3 py-2.5 text-center w-10">No</th>
                    <th class="px-3 py-2.5 w-14 text-center">Foto</th>
                    <th class="px-3 py-2.5">Nama Barang</th>
                    <th class="px-3 py-2.5">Merk/Type</th>
                    <th class="px-3 py-2.5 text-center">Tahun</th>
                    <th class="px-3 py-2.5 text-center">Kondisi</th>
                    <th class="px-3 py-2.5 text-center">Jumlah</th>
                    <th class="px-3 py-2.5 text-right">Harga</th>
                    <th class="px-3 py-2.5">Lokasi</th>
                    <th class="px-3 py-2.5">Asal Usul</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr v-for="(a, idx) in filteredExportAssets.slice(0, 10)" :key="a.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="px-3 py-2 text-center text-slate-400 font-mono">{{ idx + 1 }}</td>
                    <td class="px-3 py-2 text-center">
                      <img v-if="a.Foto" :src="a.Foto" class="w-7 h-7 rounded object-cover mx-auto border border-slate-200 dark:border-slate-700" alt="Foto" />
                      <span v-else class="text-[10px] text-slate-400">-</span>
                    </td>
                    <td class="px-3 py-2 font-bold text-slate-900 dark:text-white">{{ a.NamaBarang }}</td>
                    <td class="px-3 py-2 text-slate-500 dark:text-slate-400">{{ a.MerkType || '-' }}</td>
                    <td class="px-3 py-2 text-center text-slate-600 dark:text-slate-300">{{ a.ThnPerolehan || '-' }}</td>
                    <td class="px-3 py-2 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[10px] font-bold inline-block',
                          a.Kondisi === 'Baik' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00B368]' :
                          a.Kondisi === 'Rusak Ringan' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600' :
                          'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                        ]"
                      >
                        {{ a.Kondisi }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-center text-slate-700 dark:text-slate-300 font-medium">{{ a.JmlBarang }} {{ a.Satuan }}</td>
                    <td class="px-3 py-2 text-right font-semibold text-slate-800 dark:text-slate-200">{{ formatRupiah(a.HargaBarang) }}</td>
                    <td class="px-3 py-2 text-slate-500 dark:text-slate-400">{{ a.Lokasi }}</td>
                    <td class="px-3 py-2 text-slate-500 dark:text-slate-400">{{ a.AsalUsul || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =================== TAB 5: MANAJEMEN AKUN (SUPER ADMIN ONLY) =================== -->
        <div v-if="activeTab === 'users' && authStore.isSuperAdmin" class="space-y-4">
          <UserManagementTable />
        </div>

        <!-- =================== TAB 6: LOG DIHAPUS (SUPER ADMIN ONLY) =================== -->
        <div v-if="activeTab === 'log' && authStore.isSuperAdmin" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">
                Log Riwayat Penghapusan Aset
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Aset yang dihapus dapat dipulihkan kembali ke data aktif atau dibersihkan permanen
              </p>
            </div>
          </div>
          <DeletedLogTable />
        </div>
      </main>
    </div>

    <!-- Global User Profile Modal -->
    <UserProfileModal />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';
import { useThemeStore } from '../stores/theme';
import api from '../services/api';

import DashboardOfficerCard from '../components/DashboardOfficerCard.vue';
import DashboardStatCards from '../components/DashboardStatCards.vue';
import DashboardSurveyChart from '../components/DashboardSurveyChart.vue';
import DashboardCalendar from '../components/DashboardCalendar.vue';
import AssetTable from '../components/AssetTable.vue';
import DeletedLogTable from '../components/DeletedLogTable.vue';
import AssetMap from '../components/AssetMap.vue';
import UserManagementTable from '../components/UserManagementTable.vue';
import UserProfileModal from '../components/UserProfileModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const assetStore = useAssetStore();
const themeStore = useThemeStore();

const activeTab = ref('ringkasan');
const isMobileSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);
const searchQuery = ref('');
const dashMapRef = ref(null);
const isSyncingSheets = ref(false);

// Export Filters State
const exportFilters = reactive({
  search: '',
  tahun: '',
  kategori: '',
  kondisi: '',
  asalUsul: ''
});

const hasActiveExportFilters = computed(() => {
  return !!(exportFilters.search.trim() || exportFilters.tahun || exportFilters.kategori || exportFilters.kondisi || exportFilters.asalUsul);
});

function resetExportFilters() {
  exportFilters.search = '';
  exportFilters.tahun = '';
  exportFilters.kategori = '';
  exportFilters.kondisi = '';
  exportFilters.asalUsul = '';
}

const filteredExportAssets = computed(() => {
  const s = exportFilters.search.trim().toLowerCase();
  return assetStore.assets.filter(a => {
    if (a.is_deleted) return false;
    const matchSearch = !s ||
      (a.NamaBarang || '').toLowerCase().includes(s) ||
      (a.MerkType || '').toLowerCase().includes(s) ||
      (a.Lokasi || '').toLowerCase().includes(s) ||
      (a.NoPolisi || '').toLowerCase().includes(s) ||
      (a.Pengguna || '').toLowerCase().includes(s);
    const matchTahun = !exportFilters.tahun ||
      String(a.ThnPerolehan) === String(exportFilters.tahun) ||
      String(a.ThnPembuatan) === String(exportFilters.tahun);
    const matchKategori = !exportFilters.kategori ||
      (a.Bahan && a.Bahan.toLowerCase().includes(exportFilters.kategori.toLowerCase()));
    const matchKondisi = !exportFilters.kondisi || a.Kondisi === exportFilters.kondisi;
    const matchAsal = !exportFilters.asalUsul || a.AsalUsul === exportFilters.asalUsul;
    return matchSearch && matchTahun && matchKategori && matchKondisi && matchAsal;
  });
});

const totalExportNilai = computed(() => {
  return filteredExportAssets.value.reduce((sum, a) => sum + (Number(a.HargaBarang) || 0), 0);
});

const totalExportUnit = computed(() => {
  return filteredExportAssets.value.reduce((sum, a) => sum + (Number(a.JmlBarang) || 1), 0);
});

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(num) || 0);
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function handleQuickSearch() {
  if (activeTab.value !== 'data') {
    activeTab.value = 'data';
  }
}

function handleViewOnMapDash(asset) {
  activeTab.value = 'peta';
  setTimeout(() => {
    if (dashMapRef.value) {
      dashMapRef.value.filterByAssetName(asset.NamaBarang);
    }
    setTimeout(() => {
      assetStore.openDetailModal(asset);
    }, 450);
  }, 100);
}

async function handleSyncGoogleSheets() {
  isSyncingSheets.value = true;
  try {
    const res = await api.post('/assets/sync-sheets');
    if (res.data.success) {
      assetStore.showToast(res.data.message || 'Berhasil menyinkronkan dengan Google Sheets!');
    } else {
      assetStore.showToast(res.data.message || 'Gagal sinkronisasi Google Sheets');
    }
  } catch (err) {
    assetStore.showToast(err.response?.data?.message || 'Koneksi Google Sheets belum dikonfigurasi di .env');
  } finally {
    isSyncingSheets.value = false;
  }
}

const userInitials = computed(() => {
  const name = authStore.user?.nama_lengkap || authStore.user?.username || 'Admin';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

const userAvatarPhoto = computed(() => {
  if (authStore.user?.avatar) return authStore.user.avatar;
  if (authStore.user?.foto) return authStore.user.foto;
  if (authStore.user?.username === 'admin') {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80';
  }
  return null;
});

onMounted(() => {
  themeStore.initTheme();
  assetStore.refreshAll();
  if (authStore.isSuperAdmin) {
    authStore.fetchUsers();
  }
});
</script>
