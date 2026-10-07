<template>
  <div class="h-full flex flex-col min-h-0">
    <div class="flex flex-col sm:flex-row gap-2 mb-2 shrink-0">
      <div class="relative flex-1 sm:max-w-xs">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama barang di peta..."
          class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full pl-9 pr-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        />
      </div>

      <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        <select
          v-model="filters.kondisi"
          class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        >
          <option value="">Semua kondisi</option>
          <option v-for="k in assetStore.kondisiOptions" :key="k" :value="k">{{ k }}</option>
        </select>
        <select
          v-model="filters.asalUsul"
          class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        >
          <option value="">Semua asal usul</option>
          <option v-for="a in assetStore.asalUsulOptions" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </div>

    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 px-1 shrink-0">
      <span>
        {{ isFilterActive ? `${filteredAssets.length} dari ${assetStore.assets.length} barang ditampilkan` : `Menampilkan seluruh ${assetStore.assets.length} titik aset` }}
      </span>
      <span class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        OpenStreetMap
      </span>
    </div>

    <div class="relative isolate w-full flex-1 min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div ref="mapContainer" class="w-full h-full min-h-[360px]"></div>
      <div
        v-if="filteredAssets.length === 0"
        class="absolute inset-0 z-[400] bg-white/90 dark:bg-[#1E252D]/90 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-300 gap-2"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        Tidak ada barang yang cocok dengan pencarian atau filter.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import { useAssetStore } from '../stores/asset';

const props = defineProps({
  showTooltip: { type: Boolean, default: false }
});

const assetStore = useAssetStore();
const mapContainer = ref(null);
let map = null;
let tileLayer = null;
let markersLayer = null;
let resizeObserver = null;
const CENTER = [-7.7825, 110.3685];

const filters = reactive({ search: '', kondisi: '', asalUsul: '' });

const isFilterActive = computed(() => !!(filters.search.trim() || filters.kondisi || filters.asalUsul));

const filteredAssets = computed(() => {
  const s = filters.search.trim().toLowerCase();
  return assetStore.assets.filter(a => {
    const matchSearch = !s || a.NamaBarang.toLowerCase().includes(s) || (a.MerkType || '').toLowerCase().includes(s);
    const matchKondisi = !filters.kondisi || a.Kondisi === filters.kondisi;
    const matchAsal = !filters.asalUsul || a.AsalUsul === filters.asalUsul;
    return matchSearch && matchKondisi && matchAsal;
  });
});

function condClass(k) {
  if (k === 'Baik') return 'cond-baik';
  if (k === 'Rusak Ringan') return 'cond-ringan';
  return 'cond-berat';
}

function buildTagIcon(a) {
  return L.divIcon({
    className: 'asset-tag-marker',
    html: `<div class="tag-pin ${condClass(a.Kondisi)}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 30]
  });
}

function updateTileLayer() {
  if (!map) return;
  if (!tileLayer) {
    // Gunakan OpenStreetMap standar (terang, jelas, dan bebas kuota/API key)
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
  }
}

function renderMarkers() {
  if (!map || !markersLayer) return;
  markersLayer.clearLayers();
  const list = filteredAssets.value;
  list.forEach(a => {
    if (!a.lat || !a.lng) return;
    const marker = L.marker([a.lat, a.lng], { icon: buildTagIcon(a) });
    if (props.showTooltip) marker.bindTooltip(`${a.NamaBarang}`, { direction: 'top', offset: [0, -28] });
    marker.on('click', () => assetStore.openDetailModal(a));
    marker.addTo(markersLayer);
  });

  if (list.length === 0) { /* keep */ }
  else if (isFilterActive.value) {
    if (list.length === 1) map.flyTo([list[0].lat, list[0].lng], 18, { duration: 0.6 });
    else map.flyToBounds(L.latLngBounds(list.map(a => [a.lat, a.lng])), { padding: [40, 40], maxZoom: 18, duration: 0.6 });
  } else {
    map.flyTo(CENTER, 16, { duration: 0.6 });
  }
}

function filterByAssetName(name) {
  filters.search = name;
  filters.kondisi = '';
  filters.asalUsul = '';
}

function invalidateMapSize() {
  map?.invalidateSize();
}

defineExpose({ filterByAssetName, invalidateMapSize });

onMounted(() => {
  if (!mapContainer.value) return;
  map = L.map(mapContainer.value, { scrollWheelZoom: false }).setView(CENTER, 16);
  updateTileLayer();
  markersLayer = L.layerGroup().addTo(map);
  renderMarkers();

  if (window.ResizeObserver && mapContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      map?.invalidateSize();
    });
    resizeObserver.observe(mapContainer.value);
  }

  setTimeout(() => map?.invalidateSize(), 150);
  setTimeout(() => map?.invalidateSize(), 500);
});

watch([filteredAssets, isFilterActive], () => renderMarkers());

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
