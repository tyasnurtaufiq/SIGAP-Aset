<template>
  <div class="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
    <h3 class="font-display font-semibold text-slate-900 mb-4">Sebaran aset per kategori</h3>
    <div class="flex flex-col gap-3">
      <div v-for="cat in sortedCategories" :key="cat.name">
        <div class="flex items-center justify-between text-sm mb-1">
          <span class="text-slate-600">{{ cat.name }}</span>
          <span class="text-slate-400 font-mono text-xs">{{ cat.count }}</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-teal-700 rounded-full transition-all duration-300"
            :style="{ width: (cat.count / maxCount * 100).toFixed(0) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();

const sortedCategories = computed(() => {
  const cats = assetStore.stats.categories || {};
  return Object.keys(cats)
    .sort((a, b) => cats[b] - cats[a])
    .map(key => ({ name: key, count: cats[key] }));
});

const maxCount = computed(() => {
  const counts = sortedCategories.value.map(c => c.count);
  return counts.length ? Math.max(1, ...counts) : 1;
});
</script>
