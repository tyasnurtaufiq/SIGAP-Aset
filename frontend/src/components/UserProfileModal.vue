<template>
  <div v-if="authStore.isProfileModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="close"></div>
    <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-md p-6 fade-in border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <h3 class="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Pengaturan Akun & Foto Profil
        </h3>
        <button @click="close" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Foto Profil Avatar Selector -->
        <div class="flex items-center gap-3.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div class="relative w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#00B368] to-teal-200 shrink-0 shadow-sm">
            <img :src="avatarPreview" alt="Avatar" class="w-full h-full rounded-full object-cover bg-white dark:bg-slate-700" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Foto Profil Anda</p>
            <div class="flex items-center gap-2">
              <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-[#00B368] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                <span>Upload Foto</span>
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
              <button v-if="form.avatar" type="button" @click="resetAvatar" class="text-[11px] text-red-500 hover:underline">
                Reset
              </button>
            </div>
            <!-- Indikator Efisiensi Foto Profil -->
            <div v-if="profilePhotoMeta" class="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Teroptimasi: <strong>{{ profilePhotoMeta.compressedKb }} KB</strong> ({{ profilePhotoMeta.resolution }}) &bull; Hemat {{ profilePhotoMeta.savedPercent }}%</span>
            </div>
            <p v-else class="text-[10px] text-slate-400 mt-1">Maks 5 MB &bull; Auto-kompresi ke 320×320 px.</p>
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Nama Lengkap *</label>
          <input v-model="form.nama_lengkap" type="text" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none" placeholder="Nama Lengkap" required />
        </div>

        <div>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Username *</label>
          <input v-model="form.username" type="text" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-[#00B368] focus:outline-none" placeholder="username" required />
        </div>

        <div class="border-t border-slate-100 dark:border-slate-800 pt-3">
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Kata Sandi Baru (Opsional)</label>
          <input v-model="form.new_password" type="password" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none" placeholder="Minimal 6 karakter" />
          <p class="text-[11px] text-slate-400 mt-1">Biarkan kosong jika tidak ingin mengganti kata sandi.</p>
        </div>

        <p v-if="msg" :class="['text-xs p-2.5 rounded-lg border', isSuccess ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B368] border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800']">{{ msg }}</p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" @click="close" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            Tutup
          </button>
          <button type="submit" class="px-5 py-2 text-sm font-bold text-white bg-[#00B368] hover:bg-[#009E5B] rounded-full shadow-md shadow-emerald-500/20">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const authStore = useAuthStore();
const assetStore = useAssetStore();

const msg = ref('');
const isSuccess = ref(false);
const profilePhotoMeta = ref(null);

const form = reactive({
  nama_lengkap: '',
  username: '',
  new_password: '',
  avatar: ''
});

const avatarPreview = computed(() => {
  if (form.avatar) return form.avatar;
  if (authStore.user?.avatar) return authStore.user.avatar;
  if (authStore.user?.foto) return authStore.user.foto;
  if (authStore.user?.username === 'admin') {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80';
  }
  const name = form.nama_lengkap || authStore.user?.nama_lengkap || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00B368&color=fff&bold=true&size=128`;
});

function resetAvatar() {
  form.avatar = '';
  profilePhotoMeta.value = null;
}

function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file foto profil maksimal 5 MB. Silakan pilih berkas yang lebih kecil.');
    return;
  }

  const originalKb = Math.round(file.size / 1024);
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Foto profil cukup 320×320 px (sangat tajam untuk avatar lingkaran, ukuran hanya ~15-25 KB)
      const maxDim = 320;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.80);
      form.avatar = compressed;

      const compressedKb = Math.round((compressed.length * 3) / 4 / 1024);
      profilePhotoMeta.value = {
        originalKb,
        compressedKb,
        resolution: `${width}×${height}px`,
        savedPercent: Math.max(0, Math.round(((originalKb - compressedKb) / originalKb) * 100))
      };
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

watch(() => authStore.isProfileModalOpen, (isOpen) => {
  if (isOpen && authStore.user) {
    form.nama_lengkap = authStore.user.nama_lengkap || '';
    form.username = authStore.user.username || '';
    form.new_password = '';
    form.avatar = authStore.user.avatar || authStore.user.foto || '';
    profilePhotoMeta.value = null;
    msg.value = '';
  }
});

function close() {
  authStore.isProfileModalOpen = false;
}

async function handleSubmit() {
  msg.value = '';
  const res = await authStore.updateProfile({
    nama_lengkap: form.nama_lengkap,
    username: form.username,
    new_password: form.new_password,
    avatar: form.avatar,
    foto: form.avatar
  });
  if (res.success) {
    isSuccess.value = true;
    msg.value = res.message;
    assetStore.showToast('Profil & foto berhasil diperbarui');
    setTimeout(() => {
      close();
    }, 1200);
  } else {
    isSuccess.value = false;
    msg.value = res.message;
  }
}
</script>
