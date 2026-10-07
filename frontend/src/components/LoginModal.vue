<template>
  <div v-if="assetStore.isLoginModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="close"></div>
    <div class="relative bg-white dark:bg-[#1E252D] rounded-[28px] shadow-2xl w-full max-w-sm p-7 fade-in border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      <button @click="close" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Tutup">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <div class="w-11 h-11 rounded-2xl bg-[#00B368] text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>

      <h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">Masuk ke SIGAP ASET</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">Kelola data inventaris melalui dashboard resmi.</p>

      <form @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-3.5">
        <div>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Nama pengguna</label>
          <input
            v-model="user"
            type="text"
            :class="['w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B368]', userError ? 'input-error' : 'border-slate-200 dark:border-slate-700']"
            placeholder="admin"
            @input="userError = ''; loginError = ''"
          />
          <p v-if="userError" class="field-error-msg text-xs text-red-600 mt-1.5">
            <svg class="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ userError }}</span>
          </p>
        </div>

        <div>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Kata sandi</label>
          <input
            v-model="pass"
            type="password"
            :class="['w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B368]', passError ? 'input-error' : 'border-slate-200 dark:border-slate-700']"
            placeholder="••••••••"
            @input="passError = ''; loginError = ''"
          />
          <p v-if="passError" class="field-error-msg text-xs text-red-600 mt-1.5">
            <svg class="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ passError }}</span>
          </p>
        </div>

        <p v-if="loginError" class="field-error-msg text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl px-3 py-2 border border-red-200 dark:border-red-800">
          <svg class="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ loginError }}</span>
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="mt-2 bg-[#00B368] hover:bg-[#009E5B] text-white text-sm font-bold py-2.5 rounded-full shadow-md shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50"
        >
          {{ authStore.loading ? 'Memproses...' : 'Masuk Sesi' }}
        </button>
      </form>

      <p class="text-xs text-slate-400 mt-4 text-center">Demo: admin / admin123</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const router = useRouter();
const authStore = useAuthStore();
const assetStore = useAssetStore();

const user = ref('');
const pass = ref('');
const userError = ref('');
const passError = ref('');
const loginError = ref('');

function close() {
  assetStore.isLoginModalOpen = false;
  user.value = '';
  pass.value = '';
  userError.value = '';
  passError.value = '';
  loginError.value = '';
}

async function handleSubmit() {
  userError.value = '';
  passError.value = '';
  loginError.value = '';

  let valid = true;
  if (!user.value.trim()) {
    userError.value = 'Nama pengguna wajib diisi. Contoh: admin';
    valid = false;
  }
  if (!pass.value.trim()) {
    passError.value = 'Kata sandi wajib diisi. Contoh: admin123';
    valid = false;
  } else if (pass.value.length < 6) {
    passError.value = 'Kata sandi minimal 6 karakter. Contoh: admin123';
    valid = false;
  }

  if (!valid) return;

  const result = await authStore.login(user.value.trim(), pass.value.trim());
  if (result.success) {
    close();
    router.push('/dashboard');
  } else {
    loginError.value = result.message || 'Nama pengguna atau kata sandi salah. Coba: admin / admin123';
    userError.value = ' ';
    passError.value = ' ';
  }
}
</script>
