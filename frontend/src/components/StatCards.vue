<template>
  <div class="bg-white dark:bg-[#1E252D] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 transition-colors">
    <div class="flex items-center gap-3 md:flex-col md:items-start md:gap-2 p-2 md:p-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 text-[#00B368]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>
      </div>
      <div>
        <p class="font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white">{{ assetStore.stats.total }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Total aset terdaftar</p>
      </div>
    </div>

    <div class="flex items-center gap-3 md:flex-col md:items-start md:gap-2 p-2 md:p-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </div>
      <div>
        <p class="font-display font-semibold text-xl md:text-2xl text-emerald-600">{{ assetStore.stats.baik }}</p>
        <p class="text-xs text-slate-500">Kondisi baik</p>
      </div>
    </div>

    <div class="flex items-center gap-3 md:flex-col md:items-start md:gap-2 p-2 md:p-3">
      <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div>
        <p class="font-display font-semibold text-xl md:text-2xl text-amber-500">{{ assetStore.stats.ringan }}</p>
        <p class="text-xs text-slate-500">Rusak ringan</p>
      </div>
    </div>

    <div class="flex items-center gap-3 md:flex-col md:items-start md:gap-2 p-2 md:p-3">
      <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div>
        <p class="font-display font-semibold text-xl md:text-2xl text-red-500">{{ assetStore.stats.berat }}</p>
        <p class="text-xs text-slate-500">Rusak berat</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAssetStore } from '../stores/asset';
const assetStore = useAssetStore();
</script>
