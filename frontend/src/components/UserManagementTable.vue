<template>
  <div class="space-y-4">
    <!-- Top Stats & Search Bar -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <span>Manajemen Akun Pengguna</span>
          <span class="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-semibold px-2.5 py-0.5 rounded-full">Super Admin Only</span>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola seluruh kredensial akun pengguna, kata sandi, dan hak akses sistem SIGAP ASET.</p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button
          @click="toggleShowAllPasswords"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-full transition-colors whitespace-nowrap bg-white dark:bg-[#1E252D]"
        >
          <svg v-if="showAllPasswords" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>{{ showAllPasswords ? 'Sembunyikan Password' : 'Lihat Semua Password' }}</span>
        </button>

        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-1.5 bg-[#00B368] hover:bg-[#009E5B] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-md shadow-emerald-500/20 transition-all duration-200 whitespace-nowrap"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
          Tambah Akun
        </button>
      </div>
    </div>

    <!-- Filter & Search Input -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#1E252D] p-3 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm">
      <div class="relative w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau username..."
          class="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="absolute left-3 top-2.5 text-slate-400">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>

      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 w-full sm:w-auto justify-end">
        <span>Total: <strong class="text-slate-800 dark:text-white font-semibold">{{ filteredUsers.length }}</strong> akun</span>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <span class="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-medium">Super Admin: {{ superAdminCount }}</span>
        <span class="text-[#00B368] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">User Biasa: {{ regularUserCount }}</span>
      </div>
    </div>

    <!-- User Table Card -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[750px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-left text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
              <th class="px-4 py-3 font-semibold w-12 text-center">No</th>
              <th class="px-4 py-3 font-semibold">Nama Lengkap</th>
              <th class="px-4 py-3 font-semibold">Username</th>
              <th class="px-4 py-3 font-semibold">Kata Sandi (Password)</th>
              <th class="px-4 py-3 font-semibold">Role Access</th>
              <th class="px-4 py-3 font-semibold text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0" class="border-b border-slate-100 dark:border-slate-800 text-center text-slate-400 py-8">
              <td colspan="6" class="py-8 text-slate-400">Tidak ada pengguna ditemukan.</td>
            </tr>
            <tr v-for="(u, idx) in filteredUsers" :key="u.id" class="border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td class="px-4 py-3 font-mono text-xs text-slate-400 text-center">{{ idx + 1 }}</td>
              <td class="px-4 py-3">
                <div class="font-bold text-slate-900 dark:text-white">{{ u.nama_lengkap }}</div>
                <div v-if="u.id === authStore.user?.id" class="text-[10px] text-[#00B368] font-semibold">(Akun Anda)</div>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md">@{{ u.username }}</span>
              </td>
              <td class="px-4 py-3 font-mono text-xs">
                <div class="flex items-center gap-2">
                  <span v-if="showPasswords[u.id] || showAllPasswords" class="bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg font-semibold tracking-wider select-all">
                    {{ u.password || '(Tidak Diset)' }}
                  </span>
                  <span v-else class="text-slate-400 tracking-widest bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    ••••••••
                  </span>

                  <button
                    @click="togglePassword(u.id)"
                    class="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-md transition-colors"
                    :title="showPasswords[u.id] ? 'Sembunyikan password' : 'Tampilkan password'"
                  >
                    <svg v-if="showPasswords[u.id] || showAllPasswords" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>

                  <button
                    v-if="u.password"
                    @click="copyToClipboard(u.password)"
                    class="p-1 text-slate-400 hover:text-[#00B368] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                    title="Salin password ke clipboard"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full', (u.role === 'superadmin' || u.role === 'super_admin') ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800']">
                  <span class="w-1.5 h-1.5 rounded-full" :class="(u.role === 'superadmin' || u.role === 'super_admin') ? 'bg-amber-500' : 'bg-[#00B368]'"></span>
                  {{ (u.role === 'superadmin' || u.role === 'super_admin') ? 'Super Admin' : 'User Biasa' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button @click="openEditModal(u)" class="px-2.5 py-1 text-xs font-semibold text-[#00B368] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button v-if="u.id !== authStore.user?.id" @click="handleDelete(u)" class="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Modal (Add/Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-md p-6 fade-in border border-slate-100 dark:border-slate-800">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 class="font-display font-bold text-lg text-slate-900 dark:text-white">
            {{ isEdit ? 'Edit Akun Pengguna' : 'Tambah Akun Baru' }}
          </h3>
          <button @click="closeModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Nama Lengkap *</label>
            <input v-model="form.nama_lengkap" type="text" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none" placeholder="Contoh: Budi Santoso" required />
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Username *</label>
            <input v-model="form.username" type="text" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none font-mono" placeholder="user11" required />
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              {{ isEdit ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi (Password) *' }}
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showFormPassword ? 'text' : 'password'"
                class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none font-mono"
                :placeholder="isEdit ? '•••••••• (Tetap)' : 'Password'"
                :required="!isEdit"
              />
              <button
                type="button"
                @click="showFormPassword = !showFormPassword"
                class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <svg v-if="showFormPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Role Access *</label>
            <select v-model="form.role" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#00B368] focus:outline-none">
              <option value="user">User Biasa (Petugas Input Data Aset)</option>
              <option value="superadmin">Super Admin (Akses Penuh + Manajemen User)</option>
            </select>
          </div>

          <p v-if="errorMsg" class="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-2.5 rounded-xl">{{ errorMsg }}</p>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 text-sm font-bold text-white bg-[#00B368] hover:bg-[#009E5B] rounded-full shadow-md shadow-emerald-500/20">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const authStore = useAuthStore();
const assetStore = useAssetStore();

const isModalOpen = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const errorMsg = ref('');
const searchQuery = ref('');
const showAllPasswords = ref(false);
const showPasswords = ref({});
const showFormPassword = ref(false);

const form = reactive({
  nama_lengkap: '',
  username: '',
  password: '',
  role: 'user'
});

onMounted(() => {
  authStore.fetchUsers();
});

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return authStore.users;
  const q = searchQuery.value.toLowerCase();
  return authStore.users.filter(u =>
    (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(q)) ||
    (u.username && u.username.toLowerCase().includes(q))
  );
});

const superAdminCount = computed(() => {
  return authStore.users.filter(u => u.role === 'superadmin' || u.role === 'super_admin').length;
});

const regularUserCount = computed(() => {
  return authStore.users.filter(u => u.role !== 'superadmin' && u.role !== 'super_admin').length;
});

function togglePassword(userId) {
  showPasswords.value[userId] = !showPasswords.value[userId];
}

function toggleShowAllPasswords() {
  showAllPasswords.value = !showAllPasswords.value;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    assetStore.showToast('Kata sandi berhasil disalin ke clipboard!');
  }).catch(() => {
    alert('Gagal menyalin kata sandi.');
  });
}

function openAddModal() {
  isEdit.value = false;
  editId.value = null;
  form.nama_lengkap = '';
  form.username = '';
  form.password = '';
  form.role = 'user';
  showFormPassword.value = false;
  errorMsg.value = '';
  isModalOpen.value = true;
}

function openEditModal(user) {
  isEdit.value = true;
  editId.value = user.id;
  form.nama_lengkap = user.nama_lengkap;
  form.username = user.username;
  form.password = user.password || '';
  form.role = (user.role === 'super_admin') ? 'superadmin' : user.role;
  showFormPassword.value = false;
  errorMsg.value = '';
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleSubmit() {
  errorMsg.value = '';
  if (isEdit.value) {
    const res = await authStore.updateUser(editId.value, { ...form });
    if (res.success) {
      assetStore.showToast(res.message);
      closeModal();
    } else {
      errorMsg.value = res.message;
    }
  } else {
    const res = await authStore.createUser({ ...form });
    if (res.success) {
      assetStore.showToast(res.message);
      closeModal();
    } else {
      errorMsg.value = res.message;
    }
  }
}

async function handleDelete(user) {
  if (confirm(`Apakah Anda yakin ingin menghapus akun @${user.username} (${user.nama_lengkap})?`)) {
    const res = await authStore.deleteUser(user.id);
    if (res.success) {
      assetStore.showToast(res.message);
    } else {
      alert(res.message);
    }
  }
}
</script>
