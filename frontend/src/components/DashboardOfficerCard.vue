<template>
  <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center relative overflow-hidden h-full">
    
    <!-- Header: Ucapan Selamat Datang di Sistem SIGAP ASET -->
    <div class="w-full text-center">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#00B368] dark:text-emerald-400 text-[10px] font-bold tracking-wide uppercase mb-0.5 shadow-xs">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00B368] animate-pulse"></span>
        Selamat Datang
      </div>
      <h3 class="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-white leading-tight">
        Sistem SIGAP ASET
      </h3>
      <p class="text-[10px] text-[#00B368] dark:text-emerald-400 font-semibold tracking-wide">
        Dinas Perhubungan DIY
      </p>
    </div>

    <!-- Foto User yang Sedang Login -->
    <div class="relative my-1.5 flex items-center justify-center">
      <div 
        @click="authStore.isProfileModalOpen = true" 
        class="relative cursor-pointer group"
        title="Klik untuk melihat atau mengedit profil"
      >
        <!-- Ring Gradient Container -->
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-[#00B368] via-emerald-400 to-teal-200 shadow-md group-hover:scale-105 transition-transform duration-300">
          <img
            :src="userAvatar"
            :alt="userName"
            class="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-slate-800"
            @error="handleAvatarError"
          />
        </div>

        <!-- Online Status Indicator -->
        <span class="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#00B368] border-2 border-white dark:border-[#1E252D] shadow-sm" title="Online / Sesi Aktif"></span>

        <!-- Hover Overlay to edit -->
        <div class="absolute inset-0.5 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-semibold backdrop-blur-[1px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span class="mt-0.5">Profil</span>
        </div>
      </div>
    </div>

    <!-- User Information -->
    <div class="w-full">
      <h4 class="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate px-1" :title="userName">
        {{ userName }}
      </h4>
      <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
        {{ userRoleText }}
      </p>

      <div class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B368] dark:text-emerald-400 text-[9px] font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00B368]"></span>
        Sesi Aktif
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const avatarError = ref(false);

const userName = computed(() => {
  return authStore.user?.nama_lengkap || authStore.user?.username || 'Super Admin Utama';
});

const userRoleText = computed(() => {
  if (authStore.isSuperAdmin) {
    return 'Super Admin — Pengelola Sistem';
  }
  return 'Petugas Inventaris & Aset BMD';
});

const userAvatar = computed(() => {
  if (avatarError.value) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=00B368&color=fff&bold=true&size=200`;
  }
  if (authStore.user?.avatar) return authStore.user.avatar;
  if (authStore.user?.foto) return authStore.user.foto;

  // Foto potret default profesional
  if (authStore.user?.username === 'admin') {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80';
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=00B368&color=fff&bold=true&size=200`;
});

function handleAvatarError() {
  avatarError.value = true;
}
</script>
