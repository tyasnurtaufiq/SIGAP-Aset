<template>
  <div v-if="assetStore.selectedAssetZoom" class="fixed inset-0 z-[1100] flex items-center justify-center px-4 py-8">
    <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" @click="assetStore.closeZoomModal()"></div>
    
    <div class="relative w-full max-w-3xl max-h-[90vh] flex flex-col items-center justify-center fade-in">
      <button
        @click="assetStore.closeZoomModal()"
        class="absolute -top-12 right-0 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-colors"
        aria-label="Tutup"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <div class="w-full bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-4 sm:p-6">
        <div v-if="asset.Foto" class="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40">
          <img :src="asset.Foto" :alt="asset.NamaBarang" class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg" />
        </div>

        <div v-else class="py-16 px-6 text-center flex flex-col items-center gap-3">
          <div class="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>
          </div>
          <p class="text-white/60 text-sm font-medium">Foto barang belum diunggah</p>
        </div>

        <div class="mt-4 text-center">
          <h4 class="text-white font-display font-semibold text-lg">{{ asset.NamaBarang }}</h4>
          <p class="text-teal-400 text-xs font-medium mt-1">{{ asset.MerkType || '-' }} &bull; {{ asset.Lokasi }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();
const asset = computed(() => assetStore.selectedAssetZoom);
</script>
