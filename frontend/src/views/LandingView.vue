<template>
  <div id="view-landing" class="min-h-screen flex flex-col bg-white dark:bg-[#131920] text-slate-800 dark:text-slate-100 transition-colors">
    <!-- Header -->
    <HeaderNavbar />

    <!-- Hero Section -->
    <section id="beranda" class="relative overflow-hidden bg-gradient-to-br from-[#0C2B29] via-[#0F3D38] to-[#0C2B29]">
      <div class="absolute inset-0 opacity-[0.15]" style="background-image: radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 22px 22px;"></div>
      <div class="absolute -top-24 -right-16 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -left-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-28 md:pb-32 text-center">
        <!-- Logo Badge -->
        <div class="inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-300 bg-white/10 backdrop-blur-sm ring-1 ring-white/15 px-3.5 py-1.5 rounded-full mb-6">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>DINAS PERHUBUNGAN DIY</span>
        </div>

        <!-- SIGAP ASET Big Header from Image -->
        <div class="mb-5">
          <h1 class="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase drop-shadow-sm flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <span class="text-white">SIGAP</span>
            <span class="text-[#00B368]">ASET</span>
          </h1>
          <!-- Orange Accent Line like the image -->
          <div class="mx-auto w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-[#00B368] to-transparent my-3 rounded-full opacity-90"></div>
          <p class="font-display font-bold text-xs sm:text-sm md:text-base text-amber-300 tracking-wider uppercase">
            (SISTEM INFORMASI GEOSPASIAL DAN PENGELOLAAN ASET)
          </p>
          <p class="mt-1 text-xs sm:text-sm font-semibold tracking-wide text-teal-100/90 uppercase max-w-2xl mx-auto">
            INTEGRASI PENGELOLAAN ASET PERLENGKAPAN JALAN SECARA DIGITAL PADA DINAS PERHUBUNGAN DIY
          </p>
        </div>

        <p class="mt-4 text-teal-100/80 text-sm md:text-base max-w-xl mx-auto">
          Pantau posisi, kondisi, dan riwayat setiap aset instansi secara real-time. Klik titik pada peta untuk melihat detail lengkap layaknya peta digital.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#peta"
            class="inline-flex items-center gap-2 bg-[#00B368] hover:bg-[#009E5B] text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all duration-200"
          >
            Lihat Peta Aset
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>

          <button
            v-if="authStore.isLoggedIn"
            @click="router.push('/dashboard')"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 ring-1 ring-white/25 text-white text-sm font-medium px-6 py-3 rounded-full backdrop-blur-sm transition-colors"
          >
            Masuk ke Dashboard
          </button>
          <button
            v-else
            @click="assetStore.isLoginModalOpen = true"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 ring-1 ring-white/25 text-white text-sm font-medium px-6 py-3 rounded-full backdrop-blur-sm transition-colors"
          >
            Masuk ke Dashboard
          </button>
        </div>
      </div>
    </section>

    <!-- Floating Stat Cards -->
    <section class="max-w-6xl mx-auto px-5 md:px-8 -mt-14 md:-mt-16 relative z-10 pb-4 w-full">
      <StatCards />
    </section>

    <!-- Map Section -->
    <section id="peta" class="max-w-7xl mx-auto px-5 md:px-8 py-6 w-full">
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">Peta lokasi aset</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Klik salah satu tag pada peta untuk melihat detail aset.</p>
        </div>
        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>Baik</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>Rusak ringan</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Rusak berat</span>
        </div>
      </div>

      <div class="h-[520px] w-full">
        <AssetMap ref="landingMapRef" :show-tooltip="true" />
      </div>
    </section>

    <!-- Public Data Table Section -->
    <section id="data" class="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20 w-full">
      <div class="max-w-xl mb-8">
        <span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00B368] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full mb-3">DATA ASET</span>
        <h2 class="font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">Data aset terdaftar</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Daftar seluruh aset yang tercatat dalam sistem. Cari atau saring berdasarkan kategori dan kondisi.</p>
      </div>

      <AssetTable :is-admin="false" @view-on-map="handleViewOnMap" @view-on-map-dash="handleViewOnMap" />
    </section>

    <!-- Footer -->
    <FooterSection class="mt-auto" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderNavbar from '../components/HeaderNavbar.vue';
import FooterSection from '../components/FooterSection.vue';
import StatCards from '../components/StatCards.vue';
import AssetMap from '../components/AssetMap.vue';
import AssetTable from '../components/AssetTable.vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const router = useRouter();
const authStore = useAuthStore();
const assetStore = useAssetStore();
const landingMapRef = ref(null);

function handleViewOnMap(asset) {
  if (landingMapRef.value) {
    landingMapRef.value.filterByAssetName(asset.NamaBarang);
    landingMapRef.value.invalidateMapSize();
  }
  const el = document.getElementById('peta');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  setTimeout(() => {
    landingMapRef.value?.invalidateMapSize();
  }, 450);
}

onMounted(() => {
  assetStore.refreshAll();
});
</script>
