<template>
  <div v-if="assetStore.confirmDelete.isOpen" class="fixed inset-0 z-[1150] flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="assetStore.closeConfirmDelete()"></div>
    
    <div class="relative bg-white dark:bg-[#1E252D] rounded-[28px] shadow-2xl w-full max-w-sm p-7 fade-in text-center border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16zM10 11v6M14 11v6"/>
        </svg>
      </div>

      <h2 class="font-display font-bold text-lg text-slate-900 dark:text-white">
        {{ (assetStore.confirmDelete.type === 'asset' || assetStore.confirmDelete.type === 'soft') ? 'Hapus aset ini?' : 'Hapus log permanen?' }}
      </h2>

      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
        <template v-if="assetStore.confirmDelete.type === 'asset' || assetStore.confirmDelete.type === 'soft'">
          Aset <span class="font-bold text-slate-900 dark:text-white">"{{ assetStore.confirmDelete.name }}"</span> akan dipindahkan ke log aset terhapus dan tidak lagi tampil di data aset.
        </template>
        <template v-else>
          Riwayat aset <span class="font-bold text-slate-900 dark:text-white">"{{ assetStore.confirmDelete.name }}"</span> akan dihapus permanen dari log dan tidak dapat dikembalikan.
        </template>
      </p>

      <div class="flex items-center gap-3 mt-6">
        <button
          @click="assetStore.closeConfirmDelete()"
          class="flex-1 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Batal
        </button>

        <button
          @click="handleConfirm"
          class="flex-1 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-500/20 transition-all duration-200"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();

async function handleConfirm() {
  const { type, id } = assetStore.confirmDelete;
  if (type === 'asset' || type === 'soft') {
    await assetStore.deleteAsset(id);
  } else if (type === 'log') {
    await assetStore.hardDeleteLog(id);
  }
  assetStore.closeConfirmDelete();
}
</script>
