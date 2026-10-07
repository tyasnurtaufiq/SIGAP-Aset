<template>
  <div id="toastContainer" class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
    <div
      v-for="toast in assetStore.toasts"
      :key="toast.id"
      class="toast bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();
</script>
