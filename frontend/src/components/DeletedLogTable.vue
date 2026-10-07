<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div class="relative w-full sm:w-72">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama barang terhapus..."
          class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        />
      </div>
      <p class="text-xs text-slate-400">Riwayat barang yang pernah dihapus dari sistem SIGAP ASET</p>
    </div>

    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-x-auto">
      <table class="w-full text-sm min-w-[900px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800 text-left text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide bg-slate-50/50 dark:bg-slate-800/40">
            <th class="px-4 py-3 font-semibold">No</th>
            <th class="px-4 py-3 font-semibold">Nama Barang</th>
            <th class="px-4 py-3 font-semibold">Merk/Type</th>
            <th class="px-4 py-3 font-semibold">Lokasi</th>
            <th class="px-4 py-3 font-semibold">Dihapus pada</th>
            <th class="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(a, idx) in filteredLog"
            :key="a.id"
            class="border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <td class="px-4 py-3 font-mono text-xs text-slate-400">{{ idx + 1 }}</td>
            <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">{{ a.NamaBarang }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ a.MerkType || '-' }}</td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ a.Lokasi }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ formatDateTime(a.deleted_at) }}</td>
            <td class="px-4 py-3 text-right">
              <div v-if="authStore.isSuperAdmin" class="flex items-center justify-end gap-1">
                <button
                  @click="assetStore.restoreAsset(a.id)"
                  class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 dark:text-slate-400 hover:text-[#00B368] transition-colors"
                  title="Pulihkan data aktif"
                  aria-label="Pulihkan barang"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>
                </button>
                <button
                  @click="assetStore.openConfirmDelete('log', a.id, a.NamaBarang)"
                  class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors"
                  title="Hapus permanen"
                  aria-label="Hapus permanen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z"/></svg>
                </button>
              </div>
              <span v-else class="text-xs text-slate-400 italic">Khusus Admin</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredLog.length === 0" class="text-center text-sm text-slate-400 dark:text-slate-500 py-10">Belum ada barang yang dihapus.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const authStore = useAuthStore();
const assetStore = useAssetStore();
const search = ref('');

const filteredLog = computed(() => {
  const s = search.value.trim().toLowerCase();
  return assetStore.deletedLog.filter(a => !s || a.NamaBarang.toLowerCase().includes(s));
});

function formatDateTime(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>
