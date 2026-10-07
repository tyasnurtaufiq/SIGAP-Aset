<template>
  <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
    <!-- Chart Header with View Toggles and Legend -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
            Statistik Kondisi & Kategori Aset
          </h3>
          <span class="text-[10px] font-semibold text-[#00B368] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            Live Database
          </span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Perbandingan aset kondisi baik vs perbaikan berdasarkan {{ viewModeLabel }}
        </p>
      </div>

      <!-- Controls: View Filter + Legend -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- View Mode Pills Toggle -->
        <div class="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
          <button
            @click="viewMode = 'kategori'"
            :class="[
              'px-2 py-0.5 rounded-lg transition-all',
              viewMode === 'kategori'
                ? 'bg-white dark:bg-[#28323D] text-[#00B368] shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            ]"
          >
            Kategori
          </button>
          <button
            @click="viewMode = 'tahun'"
            :class="[
              'px-2 py-0.5 rounded-lg transition-all',
              viewMode === 'tahun'
                ? 'bg-white dark:bg-[#28323D] text-[#00B368] shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            ]"
          >
            Tahun
          </button>
          <button
            @click="viewMode = 'bulan'"
            :class="[
              'px-2 py-0.5 rounded-lg transition-all',
              viewMode === 'bulan'
                ? 'bg-white dark:bg-[#28323D] text-[#00B368] shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            ]"
          >
            Bulan
          </button>
        </div>

        <!-- Legend (Green & Amber) -->
        <div class="flex items-center gap-2.5 text-[11px] font-medium shrink-0">
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full bg-[#00B368]"></span>
            <span>Baik</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            <span>Perlu Perbaikan</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Canvas Area -->
    <div class="relative w-full h-44 sm:h-52 flex flex-col justify-end pt-2 pb-1">
      <!-- Background Horizontal Grid Lines & Dynamic Y-Axis Scale -->
      <div class="absolute inset-x-0 inset-y-2 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 dark:text-slate-500">
        <div v-for="(tick, idx) in yTicks" :key="idx" class="flex items-center w-full">
          <span class="w-6 text-right pr-2 font-mono font-medium text-[9px]">{{ tick }}</span>
          <div
            class="flex-1 border-b"
            :class="idx === yTicks.length - 1 ? 'border-slate-200 dark:border-slate-700' : 'border-dashed border-slate-150 dark:border-slate-800/80'"
          ></div>
        </div>
      </div>

      <!-- Bars Container with explicitly flex-1 and h-full -->
      <div class="relative z-10 flex items-end justify-between pl-7 pr-2 h-36 sm:h-40 w-full">
        <div
          v-for="(item, idx) in chartData"
          :key="idx"
          class="flex flex-col justify-end items-center h-full group relative cursor-pointer flex-1 px-0.5 sm:px-1"
        >
          <!-- Hover Tooltip -->
          <div class="absolute -top-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-slate-900/95 text-white text-[10px] py-1 px-2 rounded-xl shadow-xl z-30 whitespace-nowrap border border-slate-700/60">
            <p class="font-bold text-slate-200">{{ item.fullLabel || item.label }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[#00B368] font-semibold">Baik: {{ item.baik }} unit</span>
              <span class="text-slate-400">•</span>
              <span class="text-amber-400 font-semibold">Perbaikan: {{ item.rusak }} unit</span>
            </div>
            <p class="text-[9px] text-slate-400 mt-0.5">Total: {{ item.baik + item.rusak }} unit</p>
          </div>

          <!-- Dual Side-by-Side Bars (Green & Amber) -->
          <div class="flex items-end justify-center gap-1 sm:gap-1.5 h-28 sm:h-32 w-full pb-0.5">
            <!-- Green Bar (Kondisi Baik) -->
            <div
              class="w-2 sm:w-2.5 rounded-t-md bg-[#00B368] hover:brightness-110 transition-all duration-500 origin-bottom shadow-xs flex flex-col justify-start items-center relative group/bar"
              :style="{ height: getBarHeight(item.baik) }"
            >
              <span v-if="item.baik > 0" class="hidden group-hover/bar:block text-[8px] text-white font-bold -mt-3.5 bg-[#00B368] px-1 rounded shadow-xs">
                {{ item.baik }}
              </span>
            </div>

            <!-- Amber Bar (Perlu Perbaikan) -->
            <div
              class="w-2 sm:w-2.5 rounded-t-md bg-[#F59E0B] hover:brightness-110 transition-all duration-500 origin-bottom shadow-xs flex flex-col justify-start items-center relative group/bar"
              :style="{ height: getBarHeight(item.rusak) }"
            >
              <span v-if="item.rusak > 0" class="hidden group-hover/bar:block text-[8px] text-white font-bold -mt-3.5 bg-[#F59E0B] px-1 rounded shadow-xs">
                {{ item.rusak }}
              </span>
            </div>
          </div>

          <!-- X-Axis Label -->
          <span
            class="mt-2 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[42px] sm:max-w-none text-center"
            :title="item.fullLabel || item.label"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();
const viewMode = ref('kategori'); // 'kategori' | 'tahun' | 'bulan'

const viewModeLabel = computed(() => {
  if (viewMode.value === 'kategori') return 'kategori asal-usul anggaran aset';
  if (viewMode.value === 'tahun') return 'tahun perolehan aset';
  return 'distribusi bulan input inventaris';
});

// Calculate live data grouped by selected mode
const chartData = computed(() => {
  const assets = assetStore.assets || [];

  if (viewMode.value === 'kategori') {
    // Collect distinct AsalUsul, default to main ones if empty
    const predefined = ['APBD', 'DANAIS', 'HIBAH', 'Pengadaan'];
    const found = new Set(predefined);
    assets.forEach(a => {
      if (a.AsalUsul && a.AsalUsul.trim()) {
        found.add(a.AsalUsul.trim());
      }
    });

    const categories = Array.from(found);

    return categories.map(cat => {
      const catAssets = assets.filter(a => (a.AsalUsul || '').trim().toUpperCase() === cat.toUpperCase());
      const baik = catAssets
        .filter(a => a.Kondisi === 'Baik')
        .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);
      const rusak = catAssets
        .filter(a => a.Kondisi !== 'Baik')
        .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);

      return {
        label: cat,
        fullLabel: `Kategori ${cat}`,
        baik,
        rusak
      };
    });
  }

  if (viewMode.value === 'tahun') {
    // Collect years from ThnPerolehan or fallback to recent years
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
    
    // Also include any explicit ThnPerolehan found in database
    assets.forEach(a => {
      const y = parseInt(a.ThnPerolehan, 10);
      if (y && !years.includes(y)) {
        years.push(y);
      }
    });
    years.sort((a, b) => a - b);

    return years.map(yr => {
      const yrAssets = assets.filter(a => parseInt(a.ThnPerolehan, 10) === yr);
      const baik = yrAssets
        .filter(a => a.Kondisi === 'Baik')
        .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);
      const rusak = yrAssets
        .filter(a => a.Kondisi !== 'Baik')
        .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);

      return {
        label: `${yr}`,
        fullLabel: `Tahun Perolehan ${yr}`,
        baik,
        rusak
      };
    });
  }

  // viewMode === 'bulan'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return months.map((m, idx) => {
    // Filter assets whose TglInput or TglBAST matches month idx
    const mAssets = assets.filter(a => {
      const dateStr = a.TglInput || a.TglBAST;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d.getMonth() === idx;
    });

    const baik = mAssets
      .filter(a => a.Kondisi === 'Baik')
      .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);
    const rusak = mAssets
      .filter(a => a.Kondisi !== 'Baik')
      .reduce((sum, a) => sum + (parseInt(a.JmlBarang, 10) || 1), 0);

    return {
      label: m,
      fullLabel: `Bulan ${m}`,
      baik,
      rusak
    };
  });
});

// Dynamic Max Value and Y-Axis Ticks based on real live data
const maxVal = computed(() => {
  let highest = 0;
  chartData.value.forEach(item => {
    if (item.baik > highest) highest = item.baik;
    if (item.rusak > highest) highest = item.rusak;
  });

  if (highest === 0) return 20; // fallback scale
  // Round up to nice interval (multiple of 5, 10, or 20)
  if (highest <= 10) return 10;
  if (highest <= 25) return 25;
  if (highest <= 50) return 50;
  if (highest <= 100) return 100;
  return Math.ceil(highest / 50) * 50;
});

// 5 Y-axis tick values from maxVal down to 0
const yTicks = computed(() => {
  const max = maxVal.value;
  return [
    max,
    Math.round(max * 0.75),
    Math.round(max * 0.5),
    Math.round(max * 0.25),
    0
  ];
});

function getBarHeight(val) {
  if (!val || val <= 0) return '3px'; // subtle base indicator
  const percent = (val / maxVal.value) * 100;
  // Ensure visible minimum height when count > 0
  const clamped = Math.max(8, Math.min(100, percent));
  return `${clamped}%`;
}
</script>
