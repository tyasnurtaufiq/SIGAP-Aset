<template>
  <div>
    <!-- Top Action & Filter Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <!-- Search Input -->
      <div class="relative flex-1 md:max-w-xs">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama barang, merk, lokasi..."
          class="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
        />
      </div>

      <!-- Action Buttons Group (Admin Only) -->
      <div v-if="isAdmin" class="flex flex-wrap items-center gap-2">
        <!-- Export Dropdown -->
        <div class="relative inline-block text-left" @click.stop>
          <button
            @click="isExportMenuOpen = !isExportMenuOpen"
            class="inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#1E252D] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full transition-all duration-200 shadow-sm"
            title="Unduh data aset (CSV, Excel, PDF)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Ekspor Data</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          <div v-if="isExportMenuOpen" class="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-48 bg-white dark:bg-[#1E252D] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-40 fade-in text-left">
            <button @click="assetStore.exportCsv(filteredAssets); isExportMenuOpen = false" class="w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#00B368] flex items-center justify-center text-[10px] font-bold">CSV</span>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Format CSV (.csv)</p>
                <p class="text-[10px] text-slate-400">File data mentah (terfilter)</p>
              </div>
            </button>
            <button @click="assetStore.exportExcel(filteredAssets); isExportMenuOpen = false" class="w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <span class="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 flex items-center justify-center text-[10px] font-bold">XLS</span>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Format Excel (.xlsx)</p>
                <p class="text-[10px] text-slate-400">Berkas berborder & foto</p>
              </div>
            </button>
            <button @click="assetStore.exportPdf(filteredAssets); isExportMenuOpen = false" class="w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <span class="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center text-[10px] font-bold">PDF</span>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Format PDF (.pdf)</p>
                <p class="text-[10px] text-slate-400">Dokumen siap cetak resmi</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Import CSV (Admin) -->
        <button
          @click="openImportModal"
          class="inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#1E252D] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full transition-all duration-200 shadow-sm"
          title="Upload file CSV untuk menambah data barang sekaligus"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Impor CSV</span>
        </button>

        <!-- Sync Google Sheets (Admin) -->
        <button
          @click="handleSyncGoogleSheets"
          :disabled="isSyncingSheets"
          class="inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#1E252D] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full transition-all duration-200 shadow-sm disabled:opacity-50"
          title="Sinkronisasikan seluruh data ke Google Sheets"
        >
          <svg v-if="isSyncingSheets" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Sync Sheets</span>
        </button>

        <!-- Add Asset Button -->
        <button
          @click="assetStore.openFormModal()"
          class="inline-flex items-center justify-center gap-1.5 bg-[#00B368] hover:bg-[#009E5B] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-md shadow-emerald-500/20 transition-all duration-200 whitespace-nowrap"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Barang
        </button>
      </div>
    </div>

    <!-- Filters Dropdowns (Lengkap: Tahun, Kategori, Kondisi, Asal Usul, Reset) -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <!-- Filter Tahun -->
      <select
        v-model="filters.tahun"
        class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
      >
        <option value="">Semua Tahun</option>
        <option v-for="t in assetStore.tahunOptions" :key="t" :value="t">Tahun {{ t }}</option>
      </select>

      <!-- Filter Kategori / Bahan -->
      <select
        v-model="filters.kategori"
        class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
      >
        <option value="">Semua Kategori/Bahan</option>
        <option v-for="c in assetStore.kategoriOptions" :key="c" :value="c">{{ c }}</option>
      </select>

      <!-- Filter Kondisi -->
      <select
        v-model="filters.kondisi"
        class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
      >
        <option value="">Semua Kondisi</option>
        <option v-for="k in assetStore.kondisiOptions" :key="k" :value="k">{{ k }}</option>
      </select>

      <!-- Filter Asal Usul -->
      <select
        v-model="filters.asalUsul"
        class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B368]"
      >
        <option value="">Semua Asal Usul</option>
        <option v-for="a in assetStore.asalUsulOptions" :key="a" :value="a">{{ a }}</option>
      </select>

      <!-- Tombol Reset Filter -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
        title="Bersihkan semua filter pencarian"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span>Reset Filter</span>
      </button>

      <!-- Ringkasan Filter Info -->
      <span v-if="hasActiveFilters" class="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
        Menampilkan <strong>{{ filteredAssets.length }}</strong> dari {{ assetStore.assets.length }} barang
      </span>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-x-auto min-h-[220px] max-h-[calc(100vh-230px)] overflow-y-auto pb-8">
      <table class="w-full text-sm min-w-[1000px]">
        <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-[#1E252D] shadow-xs">
          <tr class="border-b border-slate-100 dark:border-slate-800 text-left text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
            <th class="px-4 py-3 font-semibold">No</th>
            <th class="px-4 py-3 font-semibold">Nama Barang</th>
            <th class="px-4 py-3 font-semibold">Merk/Type</th>
            <th class="px-4 py-3 font-semibold">Kondisi</th>
            <th class="px-4 py-3 font-semibold">Jumlah</th>
            <th v-if="isAdmin" class="px-4 py-3 font-semibold">Harga</th>
            <th class="px-4 py-3 font-semibold">Lokasi</th>
            <th v-if="!isAdmin" class="px-4 py-3 font-semibold">Asal Usul</th>
            <th v-if="isAdmin" class="px-4 py-3 font-semibold">Petugas PIC</th>
            <th v-if="isAdmin" class="px-4 py-3 font-semibold">Terakhir Diubah</th>
            <th class="px-4 py-3 font-semibold text-right">{{ isAdmin ? 'Aksi' : 'Peta' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(a, idx) in paginatedAssets"
            :key="a.id"
            class="border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <td class="px-4 py-3 font-mono text-xs text-slate-400">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
            <td class="px-4 py-3 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{{ a.NamaBarang }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ a.MerkType || '-' }}</td>
            <td class="px-4 py-3">
              <span :class="['inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full', condBadgeClass(a.Kondisi)]">{{ a.Kondisi }}</span>
            </td>
            <td class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{{ a.JmlBarang }} {{ a.Satuan }}</td>
            <td v-if="isAdmin" class="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{{ formatRupiah(a.HargaBarang) }}</td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">{{ a.Lokasi }}</td>
            <td v-if="!isAdmin" class="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs font-medium">{{ a.AsalUsul || '-' }}</td>
            <td v-if="isAdmin" class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ a.InputBy }}</td>
            <td v-if="isAdmin" class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ formatDateTime(a.TglInput) }}</td>
            <td class="px-4 py-3 text-right">
              <template v-if="isAdmin">
                <div class="relative inline-block text-left">
                  <button
                    @click.stop="toggleMenu(a, $event)"
                    class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                    aria-label="Menu Opsi"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center justify-end gap-2">
                  <button @click="assetStore.openDetailModal(a)" class="text-xs font-medium text-[#00B368] hover:underline">Detail</button>
                  <button @click="handleViewOnMap(a)" class="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    Peta
                  </button>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredAssets.length === 0" class="text-center text-sm text-slate-400 dark:text-slate-500 py-10">Tidak ada barang yang cocok dengan pencarian.</p>
    </div>

    <!-- Pagination Controls Bar -->
    <div v-if="filteredAssets.length > 0" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 px-2">
      <!-- Items per page & info -->
      <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <div class="flex items-center gap-2">
          <span class="font-medium text-slate-700 dark:text-slate-300">Tampilkan:</span>
          <select v-model.number="itemsPerPage" class="border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B368] bg-white dark:bg-[#1E252D] text-slate-800 dark:text-slate-100">
            <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">{{ opt }} per halaman</option>
          </select>
        </div>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <span>Menampilkan <strong class="text-slate-800 dark:text-white">{{ paginationInfo.start }}</strong> - <strong class="text-slate-800 dark:text-white">{{ paginationInfo.end }}</strong> dari <strong class="text-slate-800 dark:text-white">{{ paginationInfo.total }}</strong> barang</span>
      </div>

      <!-- Page Number Navigation Buttons -->
      <div v-if="totalPages > 1" class="flex items-center gap-1.5 self-center sm:self-auto">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="p in visiblePageNumbers"
            :key="p"
            @click="goToPage(p)"
            :class="[
              'w-8 h-8 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center',
              p === currentPage ? 'bg-[#00B368] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            {{ p }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Modal Impor CSV -->
    <div v-if="isImportModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="closeImportModal"></div>
      <div class="relative bg-white dark:bg-[#1E252D] rounded-[24px] shadow-2xl w-full max-w-xl p-6 fade-in border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 class="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>Impor Data Aset dari File CSV</span>
          </h3>
          <button @click="closeImportModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Pilih file <code>.csv</code> berisi rincian barang. Kolom minimal yang dibutuhkan adalah <strong>Nama Barang</strong> dan <strong>Lokasi</strong>.
          </p>

          <!-- File Upload Zone -->
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#00B368] dark:hover:border-[#00B368] rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/40" @click="triggerFileInput">
            <input ref="fileInputRef" type="file" accept=".csv,text/csv" class="hidden" @change="handleFileChange" />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="mx-auto text-[#00B368] mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Klik di sini untuk memilih file CSV</p>
            <p class="text-xs text-slate-400 mt-1">Format dukungan: .csv (UTF-8)</p>
          </div>

          <!-- Preview Table -->
          <div v-if="parsedPreviewItems.length > 0" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Pratinjau Data ({{ parsedPreviewItems.length }} barang)</span>
              <span class="text-[11px] text-[#00B368] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">Siap diimpor</span>
            </div>
            <div class="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th class="px-3 py-2">Nama Barang</th>
                    <th class="px-3 py-2">Lokasi</th>
                    <th class="px-3 py-2">Kondisi</th>
                    <th class="px-3 py-2">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in parsedPreviewItems.slice(0, 20)" :key="idx" class="border-t border-slate-200">
                    <td class="px-3 py-1.5 font-medium text-slate-800">{{ item.NamaBarang }}</td>
                    <td class="px-3 py-1.5 text-slate-600">{{ item.Lokasi }}</td>
                    <td class="px-3 py-1.5 text-slate-600">{{ item.Kondisi || 'Baik' }}</td>
                    <td class="px-3 py-1.5 text-slate-600">{{ formatRupiah(item.HargaBarang) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="parsedPreviewItems.length > 20" class="text-[11px] text-slate-400 mt-1 italic">* Menampilkan 20 barang pertama dari total {{ parsedPreviewItems.length }} barang.</p>
          </div>

          <p v-if="importError" class="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{{ importError }}</p>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" @click="closeImportModal" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              Batal
            </button>
            <button
              type="button"
              @click="submitImport"
              :disabled="parsedPreviewItems.length === 0 || isSubmittingImport"
              class="px-5 py-2 text-sm font-bold text-white bg-[#00B368] hover:bg-[#009E5B] rounded-full shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg v-if="isSubmittingImport" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
              <span>Simpan ke Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Floating Action Menu (Teleported to body to eliminate any overflow/card clipping) -->
    <Teleport to="body">
      <div
        v-if="activeMenuId && selectedAsset"
        class="fixed w-44 bg-white dark:bg-[#1E252D] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-[9999] text-left fade-in"
        :style="{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }"
        @click.stop
      >
        <button
          @click="assetStore.openDetailModal(selectedAsset); closeMenu()"
          class="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
        >
          Detail Barang
        </button>
        <button
          @click="handleViewOnMap(selectedAsset); closeMenu()"
          class="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
        >
          Lihat di Peta
        </button>
        <button
          @click="assetStore.openFormModal(selectedAsset); closeMenu()"
          class="w-full px-4 py-2 text-xs font-medium text-[#00B368] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 transition-colors"
        >
          Edit Data
        </button>
        <button
          @click="assetStore.openConfirmDelete('asset', selectedAsset.id, selectedAsset.NamaBarang); closeMenu()"
          class="w-full px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 transition-colors"
        >
          Hapus Barang
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAssetStore } from '../stores/asset';

const props = defineProps({ isAdmin: { type: Boolean, default: false } });
const emit = defineEmits(['view-on-map', 'view-on-map-dash']);

function handleViewOnMap(asset) {
  emit('view-on-map', asset);
  emit('view-on-map-dash', asset);
}
const authStore = useAuthStore();
const assetStore = useAssetStore();
const activeMenuId = ref(null);
const selectedAsset = ref(null);
const menuPos = ref({ top: 0, left: 0 });
const isExportMenuOpen = ref(false);
const filters = reactive({
  search: '',
  tahun: '',
  kategori: '',
  kondisi: '',
  asalUsul: ''
});

const hasActiveFilters = computed(() => {
  return !!(filters.search.trim() || filters.tahun || filters.kategori || filters.kondisi || filters.asalUsul);
});

function resetFilters() {
  filters.search = '';
  filters.tahun = '';
  filters.kategori = '';
  filters.kondisi = '';
  filters.asalUsul = '';
}

// Pagination States
const currentPage = ref(1);
const itemsPerPage = ref(5);
const itemsPerPageOptions = [5, 10, 25, 50];

// Import & Sync States
const isSyncingSheets = ref(false);
const isImportModalOpen = ref(false);
const fileInputRef = ref(null);
const parsedPreviewItems = ref([]);
const importError = ref('');
const isSubmittingImport = ref(false);

function closeMenu() {
  activeMenuId.value = null;
  selectedAsset.value = null;
}

function toggleMenu(a, event) {
  if (activeMenuId.value === a.id) {
    closeMenu();
    return;
  }
  activeMenuId.value = a.id;
  selectedAsset.value = a;

  if (event && event.currentTarget) {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 145;
    const menuWidth = 176;

    let left = rect.right - menuWidth;
    if (left < 10) left = 10;

    const spaceBelow = window.innerHeight - rect.bottom;
    let top = rect.bottom + 4;
    if (spaceBelow < menuHeight + 10 && rect.top > menuHeight + 10) {
      top = rect.top - menuHeight - 4;
    }

    menuPos.value = { top, left };
  }
}

function handleGlobalClick() {
  closeMenu();
  isExportMenuOpen.value = false;
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
  window.addEventListener('scroll', handleGlobalClick, true);
  window.addEventListener('resize', handleGlobalClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
  window.removeEventListener('scroll', handleGlobalClick, true);
  window.removeEventListener('resize', handleGlobalClick);
});

const filteredAssets = computed(() => {
  const s = filters.search.trim().toLowerCase();
  return assetStore.assets.filter(a => {
    const matchSearch = !s ||
      (a.NamaBarang || '').toLowerCase().includes(s) ||
      (a.MerkType || '').toLowerCase().includes(s) ||
      (a.Lokasi || '').toLowerCase().includes(s) ||
      (a.NoPolisi || '').toLowerCase().includes(s) ||
      (a.Pengguna || '').toLowerCase().includes(s);
    const matchTahun = !filters.tahun ||
      String(a.ThnPerolehan) === String(filters.tahun) ||
      String(a.ThnPembuatan) === String(filters.tahun);
    const matchKategori = !filters.kategori ||
      (a.Bahan && a.Bahan.toLowerCase().includes(filters.kategori.toLowerCase()));
    const matchKondisi = !filters.kondisi || a.Kondisi === filters.kondisi;
    const matchAsal = !filters.asalUsul || a.AsalUsul === filters.asalUsul;
    return matchSearch && matchTahun && matchKategori && matchKondisi && matchAsal;
  });
});

// Reset currentPage when filters or itemsPerPage change
watch([() => filters.search, () => filters.tahun, () => filters.kategori, () => filters.kondisi, () => filters.asalUsul, itemsPerPage], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.ceil(filteredAssets.value.length / itemsPerPage.value) || 1);

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredAssets.value.slice(start, start + itemsPerPage.value);
});

const paginationInfo = computed(() => {
  const total = filteredAssets.value.length;
  if (total === 0) return { start: 0, end: 0, total: 0 };
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, total);
  return { start, end, total };
});

const visiblePageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}



async function handleSyncGoogleSheets() {
  isSyncingSheets.value = true;
  try {
    const res = await assetStore.syncGoogleSheets();
    if (!res.success) {
      alert(res.message);
    }
  } finally {
    isSyncingSheets.value = false;
  }
}

function openImportModal() {
  parsedPreviewItems.value = [];
  importError.value = '';
  isImportModalOpen.value = true;
}

function closeImportModal() {
  isImportModalOpen.value = false;
}

function triggerFileInput() {
  if (fileInputRef.value) fileInputRef.value.click();
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  importError.value = '';
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const text = event.target.result;
      parseCsvContent(text);
    } catch (err) {
      importError.value = 'Gagal membaca format file CSV: ' + err.message;
    }
  };
  reader.readAsText(file);
}

function parseCsvContent(csvText) {
  // Strip BOM if present
  const content = csvText.startsWith('\uFEFF') ? csvText.slice(1) : csvText;
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    importError.value = 'File CSV kosong atau tidak memiliki baris data';
    return;
  }

  const parseRow = (rowStr) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (inQuotes && rowStr[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  // Find index of essential columns
  const idxNama = headers.findIndex(h => h.includes('nama') || h.includes('barang'));
  const idxLokasi = headers.findIndex(h => h.includes('lokasi'));
  const idxKondisi = headers.findIndex(h => h.includes('kondisi'));
  const idxHarga = headers.findIndex(h => h.includes('harga'));
  const idxBahan = headers.findIndex(h => h.includes('bahan'));
  const idxMerk = headers.findIndex(h => h.includes('merk') || h.includes('type'));
  const idxJml = headers.findIndex(h => h.includes('jumlah') || h.includes('jml'));
  const idxSatuan = headers.findIndex(h => h.includes('satuan'));

  const items = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const nama = idxNama !== -1 ? cols[idxNama] : cols[1] || cols[0];
    const lokasi = idxLokasi !== -1 ? cols[idxLokasi] : cols[23] || 'Gedung Utama';

    if (!nama || nama.toLowerCase() === 'id' || nama.toLowerCase() === 'namabarang') continue;

    items.push({
      NamaBarang: nama,
      Lokasi: lokasi || 'Gedung Utama',
      Kondisi: (idxKondisi !== -1 ? cols[idxKondisi] : 'Baik') || 'Baik',
      HargaBarang: parseFloat(idxHarga !== -1 ? cols[idxHarga] : 0) || 0,
      Bahan: (idxBahan !== -1 ? cols[idxBahan] : '-') || '-',
      MerkType: (idxMerk !== -1 ? cols[idxMerk] : '-') || '-',
      JmlBarang: parseInt(idxJml !== -1 ? cols[idxJml] : 1) || 1,
      Satuan: (idxSatuan !== -1 ? cols[idxSatuan] : 'Unit') || 'Unit'
    });
  }

  if (items.length === 0) {
    importError.value = 'Tidak ada baris barang valid yang berhasil dibaca dari CSV';
    return;
  }

  parsedPreviewItems.value = items;
}

async function submitImport() {
  if (parsedPreviewItems.value.length === 0) return;
  isSubmittingImport.value = true;
  importError.value = '';
  try {
    const res = await assetStore.importCsv(parsedPreviewItems.value);
    if (res.success) {
      closeImportModal();
    } else {
      importError.value = res.message;
    }
  } finally {
    isSubmittingImport.value = false;
  }
}

function condBadgeClass(k) {
  if (k === 'Baik') return 'badge-baik';
  if (k === 'Rusak Ringan') return 'badge-ringan';
  return 'badge-berat';
}
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(num) || 0);
}
function formatDateTime(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>
