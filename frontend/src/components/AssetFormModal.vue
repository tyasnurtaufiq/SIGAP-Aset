<template>
  <div v-if="assetStore.assetForm.isOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="assetStore.closeFormModal()"></div>

    <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col fade-in border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-3 border-b border-slate-150 dark:border-slate-800/90 bg-white dark:bg-[#1E252D]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#00B368] flex items-center justify-center font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h2 class="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
              {{ assetStore.assetForm.isEdit ? 'Ubah Data Aset' : 'Tambah Aset Baru' }}
            </h2>
            <p class="text-[11px] text-slate-400 dark:text-slate-400">SIGAP ASET — Seluruh data terintegrasi ke sistem inventaris</p>
          </div>
        </div>

        <button @click="assetStore.closeFormModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- FORM CONTENT (3 COLUMNS COMPACT LAYOUT) -->
      <form @submit.prevent="handleSubmit" novalidate class="p-4 sm:p-5 flex-1 overflow-y-auto lg:overflow-visible">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- KOLOM 1: INFORMASI UTAMA & NILAI -->
          <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div class="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#00B368] flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>
                1. Informasi Utama & Nilai
              </span>
              <span class="text-[10px] text-slate-400 font-medium">* Wajib</span>
            </div>

            <div>
              <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Nama Barang *</label>
              <input v-model="form.NamaBarang" type="text" :class="inputClass(errors.NamaBarang)" placeholder="Contoh: Laptop Dell Latitude 5420" @input="errors.NamaBarang = ''" />
              <p v-if="errors.NamaBarang" class="text-[10px] text-red-500 mt-0.5">{{ errors.NamaBarang }}</p>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Merk / Tipe</label>
                <input v-model="form.MerkType" type="text" :class="inputClass()" placeholder="Dell Latitude 5420" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Bahan</label>
                <input v-model="form.Bahan" type="text" :class="inputClass()" placeholder="Plastik/Logam" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Warna</label>
                <input v-model="form.Warna" type="text" :class="inputClass()" placeholder="Hitam" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Ukuran</label>
                <input v-model="form.Ukuran" type="text" :class="inputClass()" placeholder="14 Inchi" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Kondisi *</label>
                <select v-model="form.Kondisi" :class="inputClass()">
                  <option v-for="k in assetStore.kondisiOptions" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Jumlah</label>
                <input v-model="form.JmlBarang" type="number" min="1" :class="inputClass()" placeholder="1" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Satuan</label>
                <select v-model="form.Satuan" :class="inputClass()">
                  <option v-for="s in assetStore.satuanOptions" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Harga (Rp) *</label>
                <input v-model="form.HargaBarang" type="number" :class="inputClass(errors.HargaBarang)" placeholder="0" @input="errors.HargaBarang = ''" />
                <p v-if="errors.HargaBarang" class="text-[10px] text-red-500 mt-0.5">{{ errors.HargaBarang }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Asal Usul</label>
                <select v-model="form.AsalUsul" :class="inputClass()">
                  <option v-for="a in assetStore.asalUsulOptions" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Thn Perolehan</label>
                <input v-model="form.ThnPerolehan" type="number" :class="inputClass()" />
              </div>
            </div>
          </div>

          <!-- KOLOM 2: IDENTITAS MESIN, BAST & KONTRAK -->
          <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div class="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#00B368] flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                2. Mesin, BAST & Legalitas
              </span>
              <span class="text-[10px] text-slate-400 font-medium">Dokumen</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. Pabrik</label>
                <input v-model="form.NoPabrik" type="text" :class="inputClass()" placeholder="-" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. Mesin</label>
                <input v-model="form.NoMesin" type="text" :class="inputClass()" placeholder="-" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. Polisi</label>
                <input v-model="form.NoPolisi" type="text" :class="inputClass()" placeholder="-" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. Rangka</label>
                <input v-model="form.NoRangka" type="text" :class="inputClass()" placeholder="-" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">BPKB</label>
                <input v-model="form.BPKB" type="text" :class="inputClass()" placeholder="-" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Thn Pembuatan</label>
                <input v-model="form.ThnPembuatan" type="number" :class="inputClass()" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. BAST</label>
                <input v-model="form.NoBAST" type="text" :class="inputClass()" placeholder="BAST-2026-..." />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Tgl. BAST</label>
                <input v-model="form.TglBAST" type="date" :class="inputClass()" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">No. Kontrak</label>
                <input v-model="form.NoKontrak" type="text" :class="inputClass()" placeholder="KTR-2026-..." />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Tgl. Kontrak</label>
                <input v-model="form.TglKontrak" type="date" :class="inputClass()" />
              </div>
            </div>
          </div>

          <!-- KOLOM 3: LOKASI, FOTO & KETERANGAN -->
          <div class="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div class="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#00B368] flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                3. Lokasi, Foto & Catatan
              </span>
              <span class="text-[10px] text-slate-400 font-medium">Geospasial</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Lokasi Penempatan *</label>
                <input v-model="form.Lokasi" type="text" :class="inputClass(errors.Lokasi)" placeholder="Ruang / Area Parkir" @input="errors.Lokasi = ''" />
                <p v-if="errors.Lokasi" class="text-[10px] text-red-500 mt-0.5">{{ errors.Lokasi }}</p>
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Unit Pengguna / PIC</label>
                <input v-model="form.Pengguna" type="text" :class="inputClass()" placeholder="Bagian Umum" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Latitude (GPS)</label>
                <input v-model="form.lat" type="number" step="any" :class="inputClass()" placeholder="-7.7825" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Longitude (GPS)</label>
                <input v-model="form.lng" type="number" step="any" :class="inputClass()" placeholder="110.3685" />
              </div>
            </div>

            <!-- Foto Barang: Compact File Upload + URL + Thumbnail -->
            <div>
              <div class="flex items-center justify-between mb-0.5">
                <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Foto Fisik Barang</label>
                <span class="text-[10px] text-slate-400">Kompresi Cerdas &bull; Maks 10 MB</span>
              </div>
              <div class="flex items-center gap-2">
                <label class="flex-1 cursor-pointer border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00B368] bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors truncate">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  <span class="truncate">Pilih Foto (Auto-Compress)</span>
                  <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                </label>
                <input v-model="form.Foto" type="text" :class="inputClass()" class="flex-1 text-[11px] py-1.5 truncate" placeholder="Atau tempel URL..." />
                
                <!-- Mini Thumbnail Preview -->
                <div v-if="form.Foto" class="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0 group">
                  <img :src="form.Foto" alt="Foto" class="w-full h-full object-cover" />
                  <button type="button" @click="clearPhoto" class="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Foto">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <!-- Indikator Efisiensi Ukuran Foto -->
              <div v-if="photoMeta" class="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Foto teroptimasi: <strong>{{ photoMeta.compressedKb }} KB</strong> ({{ photoMeta.resolution }}) &bull; Menghemat {{ photoMeta.savedPercent }}% memori server</span>
              </div>
              <div v-else-if="form.Foto && form.Foto.startsWith('http')" class="mt-1 flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                <span>URL Eksternal &bull; 0 KB beban database (Sangat efisien untuk ratusan ribu aset)</span>
              </div>
            </div>

            <!-- Keterangan -->
            <div class="flex-1 flex flex-col">
              <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5 block">Keterangan / Catatan Tambahan</label>
              <textarea v-model="form.Keterangan" rows="2" class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs resize-none focus:ring-1.5 focus:ring-[#00B368] focus:outline-none flex-1" placeholder="Catatan kondisi, penanggung jawab, dll."></textarea>
            </div>
          </div>

        </div>

        <!-- FOOTER BAR (SLIM, INTEGRATED) -->
        <div class="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#00B368]"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Semua isian aset langsung disinkronkan ke database inventaris.</span>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button type="button" @click="assetStore.closeFormModal()" class="flex-1 sm:flex-initial px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 sm:flex-initial bg-[#00B368] hover:bg-[#009E5B] text-white text-xs font-bold px-7 py-2 rounded-full shadow-md shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>{{ assetStore.assetForm.isEdit ? 'Perbarui Aset' : 'Simpan Barang' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useAssetStore } from '../stores/asset';

const assetStore = useAssetStore();
const photoMeta = ref(null);

const defaultForm = () => ({
  id: null,
  NamaBarang: '', Bahan: '', ThnPerolehan: new Date().getFullYear(), HargaBarang: '',
  Warna: '', NoPabrik: '', NoMesin: '', Ukuran: '', ThnPembuatan: new Date().getFullYear(),
  JmlBarang: 1, Satuan: 'Unit', Kondisi: 'Baik', MerkType: '',
  NoPolisi: '', NoRangka: '', BPKB: '', Pengguna: '',
  NoBAST: '', TglBAST: '', NoKontrak: '', TglKontrak: '',
  AsalUsul: 'APBD', Lokasi: '', Keterangan: '', Foto: '',
  lat: -7.7825, lng: 110.3685
});

const form = reactive(defaultForm());
const errors = reactive({ NamaBarang: '', HargaBarang: '', Lokasi: '' });

function inputClass(err) {
  return [
    'w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-[#00B368] transition-all',
    err ? 'border-red-500 ring-1 ring-red-500/30' : 'border-slate-200 dark:border-slate-700'
  ];
}

function clearPhoto() {
  form.Foto = '';
  photoMeta.value = null;
}

watch(() => assetStore.assetForm, (val) => {
  errors.NamaBarang = ''; errors.HargaBarang = ''; errors.Lokasi = '';
  photoMeta.value = null;
  if (val.isOpen && val.data) {
    Object.assign(form, val.data);
    // format dates for input[type=date]
    if (form.TglBAST) form.TglBAST = String(form.TglBAST).split('T')[0];
    if (form.TglKontrak) form.TglKontrak = String(form.TglKontrak).split('T')[0];
  } else if (val.isOpen) {
    Object.assign(form, defaultForm());
  }
}, { deep: true, immediate: true });

function validate() {
  errors.NamaBarang = ''; errors.HargaBarang = ''; errors.Lokasi = '';
  let valid = true;
  if (!form.NamaBarang.trim()) { errors.NamaBarang = 'Nama barang wajib diisi'; valid = false; }
  if (!form.Lokasi.trim()) { errors.Lokasi = 'Lokasi wajib diisi'; valid = false; }
  if (form.HargaBarang === '' || form.HargaBarang === null) { errors.HargaBarang = 'Harga wajib diisi'; valid = false; }
  return valid;
}

function handleFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    alert('Ukuran file foto maksimal 10 MB. Silakan pilih berkas yang lebih kecil.');
    return;
  }

  const originalSizeKb = Math.round(file.size / 1024);
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Resolusi maksimal 800px mempertahankan rasio asli (aspek rasio tetap presisi, ukuran memori ~40-70 KB)
      const maxDim = 800;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Kompresi JPEG dengan kualitas 0.75 (sangat jernih, memotong beban database hingga 98%)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
      form.Foto = compressedBase64;

      const compressedKb = Math.round((compressedBase64.length * 3) / 4 / 1024);
      photoMeta.value = {
        originalKb: originalSizeKb,
        compressedKb,
        resolution: `${width}×${height}px`,
        savedPercent: Math.max(0, Math.round(((originalSizeKb - compressedKb) / originalSizeKb) * 100))
      };
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function handleSubmit() {
  if (!validate()) return;
  const res = await assetStore.saveAsset({ ...form });
  if (res.success) assetStore.closeFormModal();
}
</script>
