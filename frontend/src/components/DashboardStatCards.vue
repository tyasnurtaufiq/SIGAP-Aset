<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 h-full">
    <!-- Card 1: Total Aset -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-lg sm:text-2xl text-slate-900 dark:text-white leading-tight">
          {{ assetStore.stats.total || 0 }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Total Aset
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Terdaftar di SIGAP
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      </div>
    </div>

    <!-- Card 2: Total Nilai Aset -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-base sm:text-lg text-[#00B368] leading-tight truncate max-w-[110px] sm:max-w-none">
          {{ formatCompactRupiah(assetStore.stats.totalNilai) }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Nilai Aset
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Nilai Perolehan BMD
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
    </div>

     <!-- Card 3: Petugas Terdaftar -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-lg sm:text-2xl text-slate-900 dark:text-white leading-tight">
          {{ authStore.users?.length || 11 }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Petugas PIC
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Akses Terverifikasi
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
    </div>

    <!-- Card 4: Kondisi Baik -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-lg sm:text-2xl text-[#00B368] leading-tight">
          {{ assetStore.stats.baik || 0 }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Kondisi Baik
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Siap Operasional
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
    </div>

    <!-- Card 5: Rusak Ringan -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-lg sm:text-2xl text-amber-500 leading-tight">
          {{ assetStore.stats.ringan || 0 }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Rusak Ringan
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Perlu Perawatan
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      </div>
    </div>

    <!-- Card 6: Rusak Berat -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div>
        <p class="font-display font-bold text-lg sm:text-2xl text-red-500 leading-tight">
          {{ assetStore.stats.berat || 0 }}
        </p>
        <p class="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
          Rusak Berat
        </p>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Usulan Hapus/Lelang
        </p>
      </div>
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00B368]/10 text-[#00B368] flex items-center justify-center shrink-0">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAssetStore } from '../stores/asset';
import { useAuthStore } from '../stores/auth';

const assetStore = useAssetStore();
const authStore = useAuthStore();

function formatCompactRupiah(val) {
  const num = Number(val) || 0;
  if (num >= 1000000000) {
    return 'Rp ' + (num / 1000000000).toFixed(1).replace('.', ',') + ' M';
  } else if (num >= 1000000) {
    return 'Rp ' + (num / 1000000).toFixed(1).replace('.', ',') + ' Jt';
  } else if (num >= 1000) {
    return 'Rp ' + (num / 1000).toFixed(0) + ' Rb';
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
</script>
