import { defineStore } from 'pinia';
import api from '../services/api';
import ExcelJS from 'exceljs';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assets: [],
    deletedLog: [],
    stats: {
      total: 0,
      baik: 0,
      ringan: 0,
      berat: 0,
      totalNilai: 0,
      categories: {},
      kondisiDist: {},
      deletedCount: 0
    },
    loading: false,

    // Modals state
    isLoginModalOpen: false,
    selectedAssetDetail: null,
    selectedAssetZoom: null,
    assetForm: {
      isOpen: false,
      isEdit: false,
      data: null
    },
    confirmDelete: {
      isOpen: false,
      type: null,
      id: null,
      name: ''
    },

    // Toasts
    toasts: []
  }),
  getters: {
    kondisiOptions: () => ['Baik', 'Rusak Ringan', 'Rusak Berat'],
    asalUsulOptions: (state) => {
      const predefined = ['APBD', 'DANAIS', 'HIBAH', 'Pengadaan', 'Bantuan'];
      const set = new Set(predefined);
      state.assets.forEach(a => {
        if (a.AsalUsul && a.AsalUsul.trim()) set.add(a.AsalUsul.trim());
      });
      return Array.from(set);
    },
    tahunOptions: (state) => {
      const set = new Set();
      state.assets.forEach(a => {
        if (a.ThnPerolehan) set.add(String(a.ThnPerolehan));
        if (a.ThnPembuatan) set.add(String(a.ThnPembuatan));
      });
      const currentYear = new Date().getFullYear();
      for (let y = currentYear; y >= currentYear - 5; y--) {
        set.add(String(y));
      }
      return Array.from(set).sort((a, b) => Number(b) - Number(a));
    },
    kategoriOptions: (state) => {
      const set = new Set();
      state.assets.forEach(a => {
        if (a.Bahan && a.Bahan.trim() && a.Bahan !== '-') set.add(a.Bahan.trim());
      });
      if (set.size === 0) {
        ['Elektronik', 'Kendaraan', 'Mebel / Kayu', 'Logam / Baja', 'Plastik'].forEach(k => set.add(k));
      }
      return Array.from(set);
    },
    lokasiOptions: (state) => {
      const set = new Set();
      state.assets.forEach(a => {
        if (a.Lokasi && a.Lokasi.trim() && a.Lokasi !== '-') set.add(a.Lokasi.trim());
      });
      return Array.from(set);
    },
    satuanOptions: () => ['Unit', 'Set', 'Buah', 'Lembar', 'Pasang', 'Batang', 'Meter', 'Rim', 'Liter', 'Kg'],
  },
  actions: {
    showToast(message) {
      const id = Date.now();
      this.toasts.push({ id, message });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 2800);
    },

    async fetchAssets(filters = {}) {
      this.loading = true;
      try {
        const res = await api.get('/assets', { params: filters });
        if (res.data.success) {
          this.assets = res.data.data;
        }
      } catch (err) {
        console.error('Error fetching assets:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const res = await api.get('/stats');
        if (res.data.success) {
          this.stats = res.data.data;
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    },

    async fetchDeletedLog(params = {}) {
      try {
        const res = await api.get('/deleted-log', { params });
        if (res.data.success) {
          this.deletedLog = res.data.data;
        }
      } catch (err) {
        console.error('Error fetching deleted log:', err);
      }
    },

    async saveAsset(assetData) {
      try {
        if (assetData.id) {
          const res = await api.put(`/assets/${assetData.id}`, assetData);
          if (res.data.success) {
            this.showToast('Barang diperbarui');
            await this.refreshAll();
            return { success: true };
          }
        } else {
          const res = await api.post('/assets', assetData);
          if (res.data.success) {
            this.showToast('Barang ditambahkan');
            await this.refreshAll();
            return { success: true };
          }
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal menyimpan barang';
        return { success: false, message };
      }
    },

    async deleteAsset(id) {
      try {
        const res = await api.delete(`/assets/${id}`);
        if (res.data.success) {
          this.showToast('Barang dihapus dan dicatat di log');
          await this.refreshAll();
          return { success: true };
        }
      } catch (err) {
        this.showToast('Gagal menghapus barang');
        return { success: false };
      }
    },

    async restoreAsset(id) {
      try {
        const res = await api.post(`/deleted-log/${id}/restore`);
        if (res.data.success) {
          this.showToast('Barang dipulihkan ke data aktif');
          await this.refreshAll();
          return { success: true };
        }
      } catch (err) {
        this.showToast('Gagal memulihkan barang');
        return { success: false };
      }
    },

    async hardDeleteLog(id) {
      try {
        const res = await api.delete(`/deleted-log/${id}`);
        if (res.data.success) {
          this.showToast('Riwayat log dihapus permanen');
          await this.refreshAll();
          return { success: true };
        }
      } catch (err) {
        this.showToast('Gagal menghapus log');
        return { success: false };
      }
    },

    async refreshAll() {
      await Promise.all([
        this.fetchAssets(),
        this.fetchStats(),
        this.fetchDeletedLog()
      ]);
    },

    async exportCsv(customAssets = null) {
      try {
        const assets = (customAssets || this.assets).filter(b => !b.is_deleted);
        const headers = [
          'ID', 'Foto Aset', 'Nama Barang', 'Merk/Type', 'Bahan', 'Ukuran', 'No Pabrik', 'No Mesin',
          'No Rangka', 'No Polisi', 'BPKB', 'Tahun Pembuatan', 'Tahun Perolehan', 'Warna',
          'Kondisi', 'Jumlah', 'Satuan', 'Harga Barang (IDR)',
          'Pengguna', 'Lokasi', 'Asal Usul', 'Latitude', 'Longitude',
          'No BAST', 'Tgl BAST', 'No Kontrak', 'Tgl Kontrak', 'Keterangan',
          'Terakhir Diubah Oleh', 'Terakhir Diubah'
        ];

        const escapeCsv = (val) => {
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        };

        const rows = assets.map(a => [
          a.id, a.Foto || '', a.NamaBarang, a.MerkType || '-', a.Bahan || '-', a.Ukuran || '-', a.NoPabrik || '-', a.NoMesin || '-',
          a.NoRangka || '-', a.NoPolisi || '-', a.BPKB || '-', a.ThnPembuatan || '-', a.ThnPerolehan || '-', a.Warna || '-',
          a.Kondisi || 'Baik', a.JmlBarang || 1, a.Satuan || 'Unit', a.HargaBarang || 0,
          a.Pengguna || '-', a.Lokasi || '-', a.AsalUsul || 'Pengadaan', a.lat || '', a.lng || '',
          a.NoBAST || '-', a.TglBAST || '', a.NoKontrak || '-', a.TglKontrak || '', a.Keterangan || '',
          a.InputBy || '-', a.TglInput || ''
        ].map(escapeCsv).join(','));

        const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SIGAP_Aset_Data_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.showToast(`Data aset (${assets.length} item) berhasil diunduh ke CSV`);
        return { success: true };
      } catch (err) {
        console.error('exportCsv error:', err);
        this.showToast('Gagal mengunduh file CSV');
        return { success: false };
      }
    },

    async exportExcel(customAssets = null) {
      try {
        this.showToast('Menyiapkan berkas Excel dan memproses foto aset...');
        const assets = (customAssets || this.assets).filter(b => !b.is_deleted);
        const wb = new ExcelJS.Workbook();
        wb.creator = 'SIGAP ASET — Dinas Perhubungan DIY';
        wb.created = new Date();

        const ws = wb.addWorksheet('Rekapitulasi Aset Lengkap', {
          views: [{ showGridLines: true }]
        });

        // Helper Konversi Foto ke Base64 untuk ExcelJS
        const getImageData = async (urlOrBase64) => {
          if (!urlOrBase64 || typeof urlOrBase64 !== 'string') return null;
          if (urlOrBase64.startsWith('data:image/')) {
            const parts = urlOrBase64.split(';base64,');
            if (parts.length === 2) {
              let ext = 'png';
              if (parts[0].includes('jpeg') || parts[0].includes('jpg')) ext = 'jpeg';
              else if (parts[0].includes('gif')) ext = 'gif';
              return { base64: parts[1], extension: ext };
            }
          }
          try {
            const res = await fetch(urlOrBase64);
            if (!res.ok) return null;
            const blob = await res.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const resUrl = reader.result;
                if (typeof resUrl === 'string' && resUrl.startsWith('data:image/')) {
                  const p = resUrl.split(';base64,');
                  if (p.length === 2) {
                    let ext = 'png';
                    if (p[0].includes('jpeg') || p[0].includes('jpg')) ext = 'jpeg';
                    resolve({ base64: p[1], extension: ext });
                    return;
                  }
                }
                resolve(null);
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(blob);
            });
          } catch {
            return null;
          }
        };

        const formatDate = (val) => {
          if (!val) return '-';
          try {
            const d = new Date(val);
            return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
          } catch {
            return String(val);
          }
        };

        const totalNilai = assets.reduce((sum, a) => sum + (Number(a.HargaBarang) || 0), 0);
        const totalUnit = assets.reduce((sum, a) => sum + (Number(a.JmlBarang) || 1), 0);

        // Lebar kolom terstruktur (Total 31 Kolom: A s/d AE)
        ws.columns = [
          { key: 'no', width: 6 },
          { key: 'foto', width: 14 },
          { key: 'id', width: 8 },
          { key: 'nama', width: 32 },
          { key: 'merk', width: 22 },
          { key: 'bahan', width: 16 },
          { key: 'ukuran', width: 18 },
          { key: 'pabrik', width: 16 },
          { key: 'rangka', width: 18 },
          { key: 'mesin', width: 18 },
          { key: 'polisi', width: 14 },
          { key: 'bpkb', width: 16 },
          { key: 'thn_buat', width: 14 },
          { key: 'thn_oleh', width: 14 },
          { key: 'warna', width: 14 },
          { key: 'kondisi', width: 16 },
          { key: 'jml', width: 10 },
          { key: 'satuan', width: 10 },
          { key: 'harga', width: 22 },
          { key: 'total', width: 24 },
          { key: 'lokasi', width: 30 },
          { key: 'asal', width: 18 },
          { key: 'pengguna', width: 26 },
          { key: 'koordinat', width: 24 },
          { key: 'bast_no', width: 18 },
          { key: 'bast_tgl', width: 15 },
          { key: 'kontrak_no', width: 18 },
          { key: 'kontrak_tgl', width: 15 },
          { key: 'ket', width: 26 },
          { key: 'pic', width: 20 },
          { key: 'tgl_input', width: 18 }
        ];

        // 1. KOP SURAT LAPORAN RESMI (Baris 1 - 3)
        ws.mergeCells('A1:AE1');
        const r1 = ws.getCell('A1');
        r1.value = 'PEMERINTAH DAERAH ISTIMEWA YOGYAKARTA';
        r1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        r1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F3D2E' } };
        r1.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(1).height = 28;

        ws.mergeCells('A2:AE2');
        const r2 = ws.getCell('A2');
        r2.value = 'DINAS PERHUBUNGAN — SIGAP ASET (SISTEM INFORMASI GEOSPASIAL & PENGELOLAAN ASET)';
        r2.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFD1FAE5' } };
        r2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F3D2E' } };
        r2.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(2).height = 22;

        ws.mergeCells('A3:AE3');
        const r3 = ws.getCell('A3');
        r3.value = 'BUKU INDUK REKAPITULASI INVENTARIS BARANG & ASET DAERAH LENGKAP';
        r3.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        r3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF134E39' } };
        r3.alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(3).height = 24;

        ws.getRow(4).height = 8;

        // 2. METADATA SUMMARY CARDS (Baris 5)
        ws.mergeCells('A5:F5');
        const card1 = ws.getCell('A5');
        card1.value = `📅 Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        card1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF334155' } };
        card1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        card1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

        ws.mergeCells('G5:L5');
        const card2 = ws.getCell('G5');
        card2.value = `📦 Total Inventaris: ${assets.length} Jenis (${totalUnit} Unit)`;
        card2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF065F46' } };
        card2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
        card2.alignment = { horizontal: 'center', vertical: 'middle' };

        ws.mergeCells('M5:T5');
        const card3 = ws.getCell('M5');
        card3.value = `💰 Total Nilai Aset: Rp ${totalNilai.toLocaleString('id-ID')}`;
        card3.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
        card3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
        card3.alignment = { horizontal: 'center', vertical: 'middle' };

        ws.getRow(5).height = 24;
        for (let col = 1; col <= 20; col++) {
          ws.getRow(5).getCell(col).border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
          };
        }

        ws.getRow(6).height = 10;

        // 3. TABLE HEADER (Baris 7)
        const headers = [
          'No', 'Foto Fisik', 'ID', 'Nama Barang', 'Merk / Type', 'Bahan', 'Ukuran / Konstruksi',
          'No. Pabrik', 'No. Rangka', 'No. Mesin', 'No. Polisi', 'BPKB',
          'Tahun Buat', 'Tahun Peroleh', 'Warna', 'Kondisi', 'Jumlah', 'Satuan',
          'Harga Satuan (Rp)', 'Total Nilai (Rp)', 'Lokasi / Ruangan', 'Asal Usul',
          'Pengguna / PIC', 'Koordinat Peta', 'No. BAST', 'Tgl BAST', 'No. Kontrak', 'Tgl Kontrak',
          'Keterangan', 'Petugas PIC', 'Tanggal Input'
        ];
        const headerRow = ws.getRow(7);
        headerRow.values = headers;
        headerRow.height = 32;
        headerRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B368' } };
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF008E53' } },
            bottom: { style: 'medium', color: { argb: 'FF005733' } },
            left: { style: 'thin', color: { argb: 'FF008E53' } },
            right: { style: 'thin', color: { argb: 'FF008E53' } }
          };
        });

        // 4. DATA ROWS (Baris 8 dst)
        let currentRowIndex = 8;
        for (let i = 0; i < assets.length; i++) {
          const a = assets[i];
          const jml = Number(a.JmlBarang) || 1;
          const harga = Number(a.HargaBarang) || 0;
          const totalHarga = jml * harga;
          const koordinat = (a.lat && a.lng) ? `${a.lat}, ${a.lng}` : '-';

          const row = ws.getRow(currentRowIndex);
          row.values = [
            i + 1,
            '', // Kolom Foto Fisik
            a.id,
            a.NamaBarang || '-',
            a.MerkType || '-',
            a.Bahan || '-',
            a.Ukuran || '-',
            a.NoPabrik || '-',
            a.NoRangka || '-',
            a.NoMesin || '-',
            a.NoPolisi || '-',
            a.BPKB || '-',
            a.ThnPembuatan || '-',
            a.ThnPerolehan || '-',
            a.Warna || '-',
            a.Kondisi || 'Baik',
            jml,
            a.Satuan || 'Unit',
            harga,
            totalHarga,
            a.Lokasi || '-',
            a.AsalUsul || 'Pengadaan',
            a.Pengguna || a.InputBy || '-',
            koordinat,
            a.NoBAST || '-',
            formatDate(a.TglBAST),
            a.NoKontrak || '-',
            formatDate(a.TglKontrak),
            a.Keterangan || '-',
            a.InputBy || '-',
            formatDate(a.TglInput)
          ];
          row.height = 54;

          const isEven = (i % 2 === 0);
          const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
            cell.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF1E293B' } };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
            cell.alignment = { vertical: 'middle', wrapText: true };

            // Perataan kolom
            if ([1, 2, 3, 13, 14, 16, 17, 18, 24, 26, 28, 31].includes(colNumber)) {
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
            } else if ([19, 20].includes(colNumber)) {
              cell.alignment = { horizontal: 'right', vertical: 'middle' };
              cell.numFmt = '"Rp "#,##0';
            }

            // Highlight Badge Kondisi
            if (colNumber === 16) {
              if (a.Kondisi === 'Baik') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
                cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF166534' } };
              } else if (a.Kondisi === 'Rusak Ringan') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
              } else if (a.Kondisi === 'Rusak Berat') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
              }
            }
          });

          // Sisipkan Foto Fisik ke Kolom 2 (Col B)
          if (a.Foto) {
            const imgData = await getImageData(a.Foto);
            if (imgData) {
              try {
                const imageId = wb.addImage({
                  base64: imgData.base64,
                  extension: imgData.extension || 'jpeg'
                });
                ws.addImage(imageId, {
                  tl: { col: 1.12, row: currentRowIndex - 1 + 0.08 },
                  ext: { width: 56, height: 48 },
                  editAs: 'oneCell'
                });
              } catch (e) {
                row.getCell(2).value = '(Gambar)';
              }
            } else {
              row.getCell(2).value = '(Ada Foto)';
            }
          } else {
            row.getCell(2).value = '-';
            row.getCell(2).font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
          }

          currentRowIndex++;
        }

        // 5. BARIS REKAPITULASI TOTAL
        const totalRow = ws.getRow(currentRowIndex);
        totalRow.values = [
          '', '', '', 'TOTAL REKAPITULASI KESELURUHAN',
          '', '', '', '', '', '', '', '', '', '', '', '',
          totalUnit, 'Unit', '', totalNilai,
          '', '', '', '', '', '', '', '', '', '', ''
        ];
        totalRow.height = 28;

        ws.mergeCells(`D${currentRowIndex}:P${currentRowIndex}`);
        totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF64748B' } },
            bottom: { style: 'double', color: { argb: 'FF0F172A' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
          };
          cell.alignment = { vertical: 'middle' };
          if (colNumber === 4) cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
          if (colNumber === 17 || colNumber === 18) cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if (colNumber === 20) {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
            cell.numFmt = '"Rp "#,##0';
          }
        });

        // 6. UNDUH FILE EXCEL RESMI
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SIGAP_Aset_Lengkap_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.showToast('Data aset berhasil diunduh ke Excel (.xlsx) dengan tampilan rapi & foto');
        return { success: true };
      } catch (err) {
        console.error('exportExcel error:', err);
        this.showToast('Gagal mengunduh file Excel');
        return { success: false };
      }
    },

    exportPdf(customAssets = null) {
      try {
        const assets = (customAssets || this.assets).filter(b => !b.is_deleted);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          this.showToast('Pop-up terblokir. Izinkan pop-up browser untuk mencetak / simpan PDF.');
          return { success: false };
        }

        const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(num) || 0);
        const formatDate = (val) => {
          if (!val) return '-';
          try {
            const d = new Date(val);
            return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
          } catch {
            return String(val);
          }
        };

        const totalNilai = assets.reduce((sum, a) => sum + (Number(a.HargaBarang) || 0), 0);
        const totalUnit = assets.reduce((sum, a) => sum + (Number(a.JmlBarang) || 1), 0);

        const rowsHtml = assets.map((a, i) => {
          const jml = Number(a.JmlBarang) || 1;
          const harga = Number(a.HargaBarang) || 0;
          const totalHarga = jml * harga;
          const koordinat = (a.lat && a.lng) ? `${a.lat}, ${a.lng}` : '-';

          const fotoHtml = a.Foto
            ? `<img src="${escapeHtml(a.Foto)}" alt="Foto" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; display: block; margin: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" />`
            : `<span style="font-size: 8px; color: #94a3b8; font-style: italic; display: block; text-align: center;">-</span>`;

          const kondisiBadgeClass = a.Kondisi === 'Baik' ? 'badge-baik' : a.Kondisi === 'Rusak Ringan' ? 'badge-ringan' : 'badge-berat';

          return `
            <tr>
              <td style="text-align: center; font-weight: 600;">${i + 1}</td>
              <td style="text-align: center; padding: 4px;">${fotoHtml}</td>
              <td style="text-align: center; font-weight: 600; color: #0f766e;">#${a.id}</td>
              <td><strong>${escapeHtml(a.NamaBarang)}</strong></td>
              <td>${escapeHtml(a.MerkType || '-')}</td>
              <td>${escapeHtml(a.Bahan || '-')}</td>
              <td>${escapeHtml(a.Ukuran || '-')}</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoPabrik || '-')}</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoRangka || '-')}</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoMesin || '-')}</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoPolisi || '-')}</td>
              <td style="font-size: 8px;">${escapeHtml(a.BPKB || '-')}</td>
              <td style="text-align: center;">${a.ThnPembuatan || '-'}</td>
              <td style="text-align: center;">${a.ThnPerolehan || '-'}</td>
              <td>${escapeHtml(a.Warna || '-')}</td>
              <td style="text-align: center;"><span class="badge ${kondisiBadgeClass}">${escapeHtml(a.Kondisi || 'Baik')}</span></td>
              <td style="text-align: center; font-weight: 600;">${jml} ${escapeHtml(a.Satuan || 'Unit')}</td>
              <td style="text-align: right; white-space: nowrap;">${formatRupiah(harga)}</td>
              <td style="text-align: right; font-weight: 600; white-space: nowrap; color: #065f46;">${formatRupiah(totalHarga)}</td>
              <td>${escapeHtml(a.Lokasi || '-')}</td>
              <td>${escapeHtml(a.AsalUsul || '-')}</td>
              <td>${escapeHtml(a.Pengguna || a.InputBy || '-')}</td>
              <td style="font-size: 8px; font-family: monospace;">${escapeHtml(koordinat)}</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoBAST || '-')} (${formatDate(a.TglBAST)})</td>
              <td style="font-size: 8px;">${escapeHtml(a.NoKontrak || '-')} (${formatDate(a.TglKontrak)})</td>
              <td>${escapeHtml(a.Keterangan || '-')}</td>
              <td>${escapeHtml(a.InputBy || '-')}</td>
              <td style="text-align: center; font-size: 8.5px; white-space: nowrap;">${formatDate(a.TglInput)}</td>
            </tr>
          `;
        }).join('');

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Laporan Lengkap Inventaris Barang & Aset — SIGAP ASET (Dishub DIY)</title>
            <meta charset="utf-8" />
            <style>
              @page {
                size: landscape;
                margin: 8mm;
              }
              body {
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
                margin: 0;
                padding: 10px;
                color: #0f172a;
                font-size: 9px;
                line-height: 1.3;
              }
              .header-box {
                border-bottom: 3px solid #00B368;
                padding-bottom: 10px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .header-left h1 {
                margin: 0;
                color: #0a3a2a;
                font-size: 16px;
                font-weight: 800;
                letter-spacing: -0.3px;
              }
              .header-left h2 {
                margin: 2px 0 0 0;
                color: #00B368;
                font-size: 12px;
                font-weight: 700;
              }
              .header-left p {
                margin: 2px 0 0 0;
                color: #64748b;
                font-size: 9.5px;
              }
              .stats-container {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
              }
              .stat-card {
                flex: 1;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 6px 12px;
              }
              .stat-card .label { font-size: 8px; color: #64748b; text-transform: uppercase; font-weight: 600; }
              .stat-card .value { font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 1px; }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
                font-size: 8.5px;
              }
              th {
                background-color: #00B368;
                color: #ffffff;
                text-align: center;
                padding: 6px 4px;
                border: 1px solid #008e53;
                font-weight: 700;
                white-space: nowrap;
                font-size: 8.5px;
              }
              td {
                padding: 5px 4px;
                border: 1px solid #cbd5e1;
                vertical-align: middle;
              }
              tr:nth-child(even) {
                background-color: #f8fafc;
              }
              .badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 7.5px;
                font-weight: 700;
                white-space: nowrap;
              }
              .badge-baik { background: #dcfce7; color: #166534; }
              .badge-ringan { background: #fef3c7; color: #92400e; }
              .badge-berat { background: #fee2e2; color: #991b1b; }

              .total-row td {
                background: #e2e8f0 !important;
                font-weight: 700;
                color: #0f172a;
                border-top: 2px solid #64748b;
                border-bottom: 2px solid #0f172a;
              }

              .footer-box {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-size: 9px;
                color: #64748b;
                page-break-inside: avoid;
              }
              .signature-box {
                text-align: center;
                width: 220px;
              }
              .signature-space {
                height: 50px;
              }

              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header-box">
              <div class="header-left">
                <h1>PEMERINTAH DAERAH ISTIMEWA YOGYAKARTA</h1>
                <h2>DINAS PERHUBUNGAN — SIGAP ASET</h2>
                <p>Buku Induk Rekapitulasi Lengkap Inventaris Barang & Aset Daerah</p>
              </div>
              <div style="text-align: right; font-size: 9px; color: #475569;">
                <div>Dokumen Resmi Penatausahaan Aset Daerah</div>
                <div style="font-weight: 600; color: #00B368;">Sistem Terintegrasi SIGAP-Aset DIY</div>
              </div>
            </div>

            <div class="stats-container">
              <div class="stat-card">
                <div class="label">Tanggal Cetak</div>
                <div class="value">${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div class="stat-card">
                <div class="label">Total Aset Tercatat</div>
                <div class="value">${assets.length} Jenis Barang (${totalUnit} Unit)</div>
              </div>
              <div class="stat-card">
                <div class="label">Akumulasi Nilai Aset</div>
                <div class="value" style="color: #065f46;">${formatRupiah(totalNilai)}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 22px;">No</th>
                  <th style="width: 48px;">Foto Fisik</th>
                  <th style="width: 28px;">ID</th>
                  <th>Nama Barang</th>
                  <th>Merk / Type</th>
                  <th>Bahan</th>
                  <th>Ukuran</th>
                  <th>No. Pabrik</th>
                  <th>No. Rangka</th>
                  <th>No. Mesin</th>
                  <th>No. Polisi</th>
                  <th>BPKB</th>
                  <th>Thn Buat</th>
                  <th>Thn Oleh</th>
                  <th>Warna</th>
                  <th>Kondisi</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan</th>
                  <th>Total Harga</th>
                  <th>Lokasi / Ruangan</th>
                  <th>Asal Usul</th>
                  <th>Pengguna / PIC</th>
                  <th>Koordinat Peta</th>
                  <th>No/Tgl BAST</th>
                  <th>No/Tgl Kontrak</th>
                  <th>Keterangan</th>
                  <th>Petugas PIC</th>
                  <th>Tgl Input</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr class="total-row">
                  <td colspan="16" style="text-align: left; padding-left: 8px;">TOTAL REKAPITULASI KESELURUHAN</td>
                  <td style="text-align: center;">${totalUnit} Unit</td>
                  <td></td>
                  <td style="text-align: right; color: #065f46;">${formatRupiah(totalNilai)}</td>
                  <td colspan="9"></td>
                </tr>
              </tbody>
            </table>

            <div class="footer-box">
              <div>
                <p style="margin: 0;">Dicetak secara otomatis melalui Portal SIGAP ASET — Dinas Perhubungan DIY</p>
                <p style="margin: 2px 0 0 0; font-size: 8px;">Waktu Generate: ${new Date().toLocaleString('id-ID')}</p>
              </div>
              <div class="signature-box">
                <div>Yogyakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style="font-weight: 600; margin-top: 2px;">Pengurus Barang / Pengelola Aset</div>
                <div class="signature-space"></div>
                <div style="border-top: 1px solid #475569; padding-top: 4px; font-weight: 700;">( ..................................................... )</div>
                <div style="font-size: 8px;">NIP. ....................................................</div>
              </div>
            </div>

            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
          </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        this.showToast('Menyiapkan dokumen cetak / simpan PDF lengkap...');
        return { success: true };
      } catch (err) {
        console.error('exportPdf error:', err);
        this.showToast('Gagal mencetak dokumen PDF');
        return { success: false };
      }
    },

    async importCsv(items) {
      try {
        const res = await api.post('/assets/import/csv', { items });
        if (res.data.success) {
          this.showToast(res.data.message);
          await this.refreshAll();
          return { success: true, message: res.data.message };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal mengimpor data CSV';
        return { success: false, message };
      }
    },

    async syncGoogleSheets() {
      try {
        const res = await api.post('/assets/sync-sheets');
        if (res.data.success) {
          this.showToast(res.data.message);
          return { success: true, message: res.data.message };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal sinkronisasi Google Sheets';
        return { success: false, message };
      }
    },

    openDetailModal(asset) { this.selectedAssetDetail = asset; },
    closeDetailModal() { this.selectedAssetDetail = null; },
    openZoomModal(asset) { this.selectedAssetZoom = asset; },
    closeZoomModal() { this.selectedAssetZoom = null; },
    openFormModal(asset = null) {
      this.assetForm = { isOpen: true, isEdit: !!asset, data: asset ? { ...asset } : null };
    },
    closeFormModal() { this.assetForm.isOpen = false; this.assetForm.data = null; },
    openConfirmDelete(type, id, name) {
      this.confirmDelete = { isOpen: true, type, id, name };
    },
    closeConfirmDelete() { this.confirmDelete.isOpen = false; this.confirmDelete.id = null; }
  }
});
