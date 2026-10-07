<template>
  <div v-if="assetStore.selectedAssetDetail" class="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="assetStore.closeDetailModal()"></div>

    <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-5xl max-h-[96vh] flex flex-col fade-in border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
      
      <!-- TOP HEADER BAR -->
      <div class="flex items-center justify-between px-6 py-3 border-b border-slate-150 dark:border-slate-800/90 bg-white dark:bg-[#1E252D]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#00B368] flex items-center justify-center font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>
          </div>
          <div>
            <h2 class="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
              Detail Informasi Aset
            </h2>
            <p class="text-[11px] text-slate-400 dark:text-slate-400">Kode & Spesifikasi Lengkap Inventaris SIGAP ASET</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button v-if="authStore.isLoggedIn" @click="handleEditFromDetail" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#00B368] hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Ubah</span>
          </button>
          <button @click="assetStore.closeDetailModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Tutup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- MAIN CONTENT: 2 COLUMNS (WIDE & COMPACT) -->
      <div class="p-4 sm:p-5 flex-1 overflow-y-auto lg:overflow-visible flex flex-col justify-between">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

          <!-- SISI KIRI (FOTO, KONDISI, LOKASI, AUDIT) - 4 COLS -->
          <div class="lg:col-span-4 flex flex-col gap-3">
            <!-- Foto Card -->
            <div class="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-[190px] flex items-center justify-center group shadow-sm">
              <img v-if="asset.Foto" :src="asset.Foto" :alt="asset.NamaBarang" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div v-if="asset.Foto" @click="assetStore.openZoomModal(asset)" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer backdrop-blur-[1px]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                Perbesar Foto
              </div>
              <div v-else class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5 p-4 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="text-[11px] font-medium">Foto fisik belum diunggah</span>
              </div>

              <!-- Floating Kondisi Badge on Photo -->
              <div class="absolute top-2.5 left-2.5">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md" :class="kondisiBadgeClass">
                  <span :class="['w-2 h-2 rounded-full', dotColor]"></span>
                  {{ asset.Kondisi }}
                </span>
              </div>
            </div>

            <!-- Quick Info: Nilai Perolehan & Lokasi -->
            <div class="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
              <div v-if="authStore.isLoggedIn" class="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Nilai Perolehan</span>
                <span class="font-display text-sm font-bold text-[#00B368] dark:text-emerald-400">{{ formatRupiah(asset.HargaBarang) }}</span>
              </div>

              <div class="flex items-start gap-2 text-xs">
                <svg class="mt-0.5 shrink-0 text-[#00B368]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">{{ asset.Lokasi }}</p>
                  <p class="text-[10px] text-slate-400 font-mono mt-0.5">GPS: {{ asset.lat || '-' }}, {{ asset.lng || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Audit Trail (Perekam Data) -->
            <div class="rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 px-3 py-2 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Dicatat oleh: <strong class="text-slate-700 dark:text-slate-300 font-medium">{{ asset.InputBy || '-' }}</strong></span>
              <span class="text-slate-400 font-mono text-[10px]">{{ formatDateTime(asset.TglInput) }}</span>
            </div>
          </div>

          <!-- SISI KANAN (DETAIL LENGKAP 3 PANEL) - 8 COLS -->
          <div class="lg:col-span-8 flex flex-col gap-3">
            
            <!-- Judul & Identitas Utama -->
            <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <h3 class="font-display font-bold text-lg text-slate-900 dark:text-white leading-snug">
                    {{ asset.NamaBarang }}
                  </h3>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="font-mono text-xs font-semibold text-[#00B368] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                      {{ asset.MerkType || '-' }}
                    </span>
                    <span class="text-xs text-slate-400">•</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">
                      Pengguna: <strong class="text-slate-700 dark:text-slate-200">{{ asset.Pengguna || '-' }}</strong>
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-center">
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">Jumlah</p>
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ asset.JmlBarang || 1 }} {{ asset.Satuan || 'Unit' }}</p>
                  </div>
                  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-center">
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">Tahun</p>
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ asset.ThnPerolehan || '-' }}</p>
                  </div>
                  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-center">
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">Asal Usul</p>
                    <p class="text-xs font-bold text-[#00B368]">{{ asset.AsalUsul || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabel Data Grid Spesifikasi & Legalitas -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <!-- Sub-panel 1: Fisik & Mesin -->
              <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#00B368] flex items-center gap-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Spesifikasi Fisik & Mesin
                </p>
                <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  <span class="text-slate-400 text-[11px]">Bahan:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-medium truncate">{{ asset.Bahan || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">Warna:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-medium truncate">{{ asset.Warna || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">Ukuran:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-medium truncate">{{ asset.Ukuran || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">Thn Pembuatan:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-medium">{{ asset.ThnPembuatan || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">No. Pabrik:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoPabrik || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">No. Mesin:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoMesin || '-' }}</span>
                </div>
              </div>

              <!-- Sub-panel 2: Dokumen, Kendaraan & Kontrak -->
              <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#00B368] flex items-center gap-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Identitas Surat & Kontrak
                </p>
                <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  <span class="text-slate-400 text-[11px]">No. Polisi:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoPolisi || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">No. Rangka:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoRangka || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">BPKB:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.BPKB || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">No. BAST:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoBAST || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">Tgl. BAST:</span>
                  <span class="text-slate-700 dark:text-slate-200 text-[11px] truncate">{{ formatDate(asset.TglBAST) }}</span>

                  <span class="text-slate-400 text-[11px]">No. Kontrak:</span>
                  <span class="text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">{{ asset.NoKontrak || '-' }}</span>

                  <span class="text-slate-400 text-[11px]">Tgl. Kontrak:</span>
                  <span class="text-slate-700 dark:text-slate-200 text-[11px] truncate">{{ formatDate(asset.TglKontrak) }}</span>
                </div>
              </div>

            </div>

            <!-- Keterangan Tambahan -->
            <div class="rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 p-2.5 text-xs flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400 mt-0.5 shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <div class="flex-1 min-w-0">
                <span class="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">Catatan / Keterangan: </span>
                <span class="text-slate-500 dark:text-slate-400 text-[11px]">{{ asset.Keterangan || 'Tidak ada catatan khusus untuk barang ini.' }}</span>
              </div>
            </div>

          </div>

        </div>

        <!-- FOOTER BAR -->
        <div class="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#00B368]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Data aset terverifikasi dalam sistem SIGAP ASET Dinas Perhubungan DIY
          </span>
          <button @click="assetStore.closeDetailModal()" class="px-6 py-1.5 rounded-full bg-[#00B368] hover:bg-[#009E5B] text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-500/20">
            Tutup
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const authStore = useAuthStore();
const assetStore = useAssetStore();
const asset = computed(() => assetStore.selectedAssetDetail);

const dotColor = computed(() => {
  if (!asset.value) return '';
  return asset.value.Kondisi === 'Baik' ? 'bg-[#00B368]' : asset.value.Kondisi === 'Rusak Ringan' ? 'bg-amber-400' : 'bg-red-500';
});

const kondisiBadgeClass = computed(() => {
  if (!asset.value) return '';
  return asset.value.Kondisi === 'Baik'
    ? 'bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/60'
    : asset.value.Kondisi === 'Rusak Ringan'
    ? 'bg-white/95 dark:bg-slate-900/90 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/60'
    : 'bg-white/95 dark:bg-slate-900/90 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-700/60';
});

function handleEditFromDetail() {
  if (!asset.value) return;
  const itemToEdit = { ...asset.value };
  assetStore.closeDetailModal();
  assetStore.openEditModal(itemToEdit);
}

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(num) || 0);
}
function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d)) return val;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateTime(val) {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d)) return val;
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>
