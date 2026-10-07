<template>
  <div v-if="maintenanceStore.isModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="maintenanceStore.closeModal()"></div>

    <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-xl max-h-[94vh] flex flex-col fade-in border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
      
      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-3.5 border-b border-slate-150 dark:border-slate-800/90 bg-white dark:bg-[#1E252D]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#00B368] flex items-center justify-center font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h3 class="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
              {{ maintenanceStore.editingSchedule ? 'Ubah Agenda Perawatan' : 'Tambah Agenda Perawatan Baru' }}
            </h3>
            <p class="text-[11px] text-slate-400">Kalender Pemeliharaan Aset & Inventaris</p>
          </div>
        </div>

        <button @click="maintenanceStore.closeModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- FORM CONTENT -->
      <form @submit.prevent="handleSave" class="p-5 overflow-y-auto space-y-3.5 text-xs">
        <!-- Judul Agenda -->
        <div>
          <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Judul Kegiatan / Perawatan *</label>
          <input
            v-model="form.judul"
            type="text"
            required
            class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
            placeholder="Contoh: Servis Berkala Mobil Dinas / Inspeksi Lampu APILL"
          />
        </div>

        <!-- Pilih Aset Terkait (Dropdown dari data aset) -->
        <div>
          <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Pilih Aset Terkait (Opsional)</label>
          <select
            v-model="form.aset_id"
            @change="handleAssetSelect"
            class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
          >
            <option :value="null">-- Tidak Terkait Aset Spesifik (Fasilitas Umum) --</option>
            <option v-for="ast in assetStore.assets" :key="ast.id" :value="ast.id">
              {{ ast.NamaBarang }} ({{ ast.MerkType || '-' }}) — {{ ast.Lokasi }}
            </option>
          </select>
        </div>

        <!-- Grid 2 Kolom: Kategori & Status -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Kategori Pemeliharaan</label>
            <select
              v-model="form.kategori"
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
            >
              <option value="Inspeksi">Inspeksi Lapangan</option>
              <option value="Servis Rutin">Servis Berkala / Rutin</option>
              <option value="Perbaikan">Perbaikan Kerusakan</option>
              <option value="Uji KIR">Uji KIR Kendaraan</option>
              <option value="Penggantian Komponen">Penggantian Komponen</option>
              <option value="Kalibrasi">Kalibrasi & Pengujian</option>
            </select>
          </div>

          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Status Pelaksanaan</label>
            <select
              v-model="form.status"
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
            >
              <option value="Terjadwal">Terjadwal</option>
              <option value="Selesai">Selesai Dikerjakan</option>
              <option value="Tertunda">Tertunda / Ditunda</option>
            </select>
          </div>
        </div>

        <!-- Grid 2 Kolom: Tanggal & Waktu -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tanggal Pelaksanaan *</label>
            <input
              v-model="form.tanggal"
              type="date"
              required
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Waktu / Jam (WIB)</label>
            <input
              v-model="form.waktu"
              type="text"
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none font-mono"
              placeholder="08:30"
            />
          </div>
        </div>

        <!-- Grid 2 Kolom: Lokasi & Petugas PIC -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Lokasi Pelaksanaan</label>
            <input
              v-model="form.lokasi"
              type="text"
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
              placeholder="Contoh: Ruang Rapat / Simpang Tugu"
            />
          </div>

          <div>
            <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Petugas PIC / Pelaksana</label>
            <input
              v-model="form.petugas"
              type="text"
              class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none"
              placeholder="Nama Petugas / Teknisi"
            />
          </div>
        </div>

        <!-- Keterangan / Catatan -->
        <div>
          <label class="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Catatan Tambahan (Opsional)</label>
          <textarea
            v-model="form.keterangan"
            rows="2"
            class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-1.5 focus:ring-[#00B368] focus:outline-none resize-none"
            placeholder="Kebutuhan spare part, kontak bengkel, instruksi teknis..."
          ></textarea>
        </div>

        <!-- Error Message -->
        <p v-if="errorMsg" class="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900">
          {{ errorMsg }}
        </p>

        <!-- FOOTER ACTIONS -->
        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-150 dark:border-slate-800">
          <button
            type="button"
            @click="maintenanceStore.closeModal()"
            class="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 rounded-full bg-[#00B368] hover:bg-[#009E5B] text-white font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{{ maintenanceStore.editingSchedule ? 'Simpan Perubahan' : 'Jadwalkan Perawatan' }}</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useMaintenanceStore } from '../stores/maintenance';
import { useAssetStore } from '../stores/asset';
import { useAuthStore } from '../stores/auth';

const maintenanceStore = useMaintenanceStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const errorMsg = ref('');

const form = reactive({
  judul: '',
  kategori: 'Inspeksi',
  tanggal: '',
  waktu: '08:30',
  lokasi: '',
  aset_id: null,
  nama_barang: '-',
  petugas: '',
  status: 'Terjadwal',
  keterangan: ''
});

function handleAssetSelect() {
  if (!form.aset_id) {
    form.nama_barang = '-';
    return;
  }
  const selected = assetStore.assets.find(a => a.id === form.aset_id);
  if (selected) {
    form.nama_barang = selected.NamaBarang;
    if (!form.lokasi) form.lokasi = selected.Lokasi;
    if (!form.judul) form.judul = `Perawatan ${selected.NamaBarang}`;
  }
}

watch(() => maintenanceStore.isModalOpen, (isOpen) => {
  if (isOpen) {
    errorMsg.value = '';
    if (maintenanceStore.editingSchedule) {
      Object.assign(form, maintenanceStore.editingSchedule);
    } else {
      // Set default date from selectedDate
      let defaultDateStr = '2026-09-20';
      if (maintenanceStore.selectedDate) {
        const y = maintenanceStore.selectedDate.getFullYear();
        const m = String(maintenanceStore.selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(maintenanceStore.selectedDate.getDate()).padStart(2, '0');
        defaultDateStr = `${y}-${m}-${d}`;
      }

      Object.assign(form, {
        judul: '',
        kategori: 'Inspeksi',
        tanggal: defaultDateStr,
        waktu: '08:30',
        lokasi: '',
        aset_id: null,
        nama_barang: '-',
        petugas: authStore.user?.nama_lengkap || 'Petugas Dishub',
        status: 'Terjadwal',
        keterangan: ''
      });
    }
  }
});

async function handleSave() {
  if (!form.judul.trim()) {
    errorMsg.value = 'Judul kegiatan wajib diisi';
    return;
  }
  if (!form.tanggal) {
    errorMsg.value = 'Tanggal pelaksanaan wajib diisi';
    return;
  }

  isSubmitting.value = true;
  errorMsg.value = '';

  const res = await maintenanceStore.saveSchedule({ ...form });
  isSubmitting.value = false;

  if (res.success) {
    assetStore.showToast(res.message);
  } else {
    errorMsg.value = res.message;
  }
}
</script>
