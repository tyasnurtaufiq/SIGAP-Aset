import { query, isPgConnected, memoryStore } from '../db/index.js';
import { syncAllToGoogleSheets, appendAssetToGoogleSheets } from '../services/googleSheets.js';

// Column list for SELECT
const BARANG_COLUMNS = `id, "NamaBarang", "Bahan", "ThnPerolehan", "HargaBarang", "Warna", "NoPabrik", "NoMesin", "Ukuran", "ThnPembuatan", "JmlBarang", "Satuan", "Kondisi", "MerkType", "NoPolisi", "NoRangka", "BPKB", "Pengguna", "NoBAST", "TglBAST", "NoKontrak", "TglKontrak", "AsalUsul", "Lokasi", "Keterangan", "Foto", "InputBy", "TglInput", "lat", "lng", "is_deleted", "deleted_at"`;

function formatRow(row) {
  return {
    id: row.id,
    NamaBarang: row.NamaBarang,
    Bahan: row.Bahan || '-',
    ThnPerolehan: row.ThnPerolehan,
    HargaBarang: parseFloat(row.HargaBarang) || 0,
    Warna: row.Warna || '-',
    NoPabrik: row.NoPabrik || '-',
    NoMesin: row.NoMesin || '-',
    Ukuran: row.Ukuran || '-',
    ThnPembuatan: row.ThnPembuatan,
    JmlBarang: row.JmlBarang || 1,
    Satuan: row.Satuan || 'Unit',
    Kondisi: row.Kondisi || 'Baik',
    MerkType: row.MerkType || '-',
    NoPolisi: row.NoPolisi || '-',
    NoRangka: row.NoRangka || '-',
    BPKB: row.BPKB || '-',
    Pengguna: row.Pengguna || '-',
    NoBAST: row.NoBAST || '-',
    TglBAST: row.TglBAST,
    NoKontrak: row.NoKontrak || '-',
    TglKontrak: row.TglKontrak,
    AsalUsul: row.AsalUsul || 'Pengadaan',
    Lokasi: row.Lokasi,
    Keterangan: row.Keterangan || '',
    Foto: row.Foto || '',
    InputBy: row.InputBy || '-',
    TglInput: row.TglInput,
    lat: parseFloat(row.lat) || -7.7825,
    lng: parseFloat(row.lng) || 110.3685,
    is_deleted: row.is_deleted || false,
    deleted_at: row.deleted_at
  };
}

// GET /api/assets
export async function getAssets(req, res) {
  try {
    const { search, kondisi, asalUsul } = req.query;

    if (isPgConnected()) {
      let sql = `SELECT ${BARANG_COLUMNS} FROM barang WHERE "is_deleted" = false`;
      const params = [];
      let idx = 1;

      if (search) {
        sql += ` AND (LOWER("NamaBarang") LIKE $${idx} OR LOWER("MerkType") LIKE $${idx} OR LOWER("Lokasi") LIKE $${idx})`;
        params.push(`%${search.toLowerCase()}%`);
        idx++;
      }
      if (kondisi) {
        sql += ` AND "Kondisi" = $${idx}`;
        params.push(kondisi);
        idx++;
      }
      if (asalUsul) {
        sql += ` AND "AsalUsul" = $${idx}`;
        params.push(asalUsul);
        idx++;
      }

      sql += ' ORDER BY id DESC';
      const result = await query(sql, params);
      const data = result.rows.map(formatRow);
      return res.json({ success: true, data, total: data.length });
    } else {
      let data = memoryStore.barang.filter(b => !b.is_deleted);
      if (search) {
        const s = search.toLowerCase();
        data = data.filter(b => b.NamaBarang.toLowerCase().includes(s) || (b.MerkType || '').toLowerCase().includes(s) || (b.Lokasi || '').toLowerCase().includes(s));
      }
      if (kondisi) data = data.filter(b => b.Kondisi === kondisi);
      if (asalUsul) data = data.filter(b => b.AsalUsul === asalUsul);
      return res.json({ success: true, data, total: data.length });
    }
  } catch (err) {
    console.error('getAssets error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data barang' });
  }
}

// GET /api/assets/:id
export async function getAssetById(req, res) {
  try {
    if (isPgConnected()) {
      const result = await query(`SELECT ${BARANG_COLUMNS} FROM barang WHERE id = $1`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      return res.json({ success: true, data: formatRow(result.rows[0]) });
    } else {
      const item = memoryStore.barang.find(b => b.id === parseInt(req.params.id));
      if (!item) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      return res.json({ success: true, data: item });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail barang' });
  }
}

// POST /api/assets
export async function createAsset(req, res) {
  try {
    const d = req.body;
    const inputBy = req.user?.nama_lengkap || req.user?.username || 'admin';

    if (!d.NamaBarang || !d.Lokasi) {
      return res.status(400).json({ success: false, message: 'NamaBarang dan Lokasi wajib diisi' });
    }

    // Limitasi ukuran foto aset (Maksimal ~300 KB base64 string untuk efisiensi ratusan ribu aset)
    if (d.Foto && typeof d.Foto === 'string' && d.Foto.length > 400 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Ukuran foto aset terlalu besar (maksimal 300 KB). Sistem otomatis mengompresi foto saat diunggah.'
      });
    }

    let createdItem = null;

    if (isPgConnected()) {
      const result = await query(`
        INSERT INTO barang (
          "NamaBarang", "Bahan", "ThnPerolehan", "HargaBarang", "Warna",
          "NoPabrik", "NoMesin", "Ukuran", "ThnPembuatan", "JmlBarang", "Satuan",
          "Kondisi", "MerkType", "NoPolisi", "NoRangka", "BPKB", "Pengguna",
          "NoBAST", "TglBAST", "NoKontrak", "TglKontrak", "AsalUsul", "Lokasi",
          "Keterangan", "Foto", "InputBy", "TglInput", "lat", "lng"
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,NOW(),$27,$28)
        RETURNING ${BARANG_COLUMNS}
      `, [
        d.NamaBarang, d.Bahan || '-', d.ThnPerolehan || new Date().getFullYear(), d.HargaBarang || 0, d.Warna || '-',
        d.NoPabrik || '-', d.NoMesin || '-', d.Ukuran || '-', d.ThnPembuatan || new Date().getFullYear(), d.JmlBarang || 1, d.Satuan || 'Unit',
        d.Kondisi || 'Baik', d.MerkType || '-', d.NoPolisi || '-', d.NoRangka || '-', d.BPKB || '-', d.Pengguna || '-',
        d.NoBAST || '-', d.TglBAST || null, d.NoKontrak || '-', d.TglKontrak || null, d.AsalUsul || 'Pengadaan', d.Lokasi,
        d.Keterangan || '', d.Foto || '', inputBy, d.lat || -7.7825, d.lng || 110.3685
      ]);
      createdItem = formatRow(result.rows[0]);
    } else {
      const newId = memoryStore.barang.length > 0 ? Math.max(...memoryStore.barang.map(b => b.id)) + 1 : 1;
      const newItem = {
        id: newId,
        NamaBarang: d.NamaBarang, Bahan: d.Bahan || '-', ThnPerolehan: d.ThnPerolehan || new Date().getFullYear(),
        HargaBarang: d.HargaBarang || 0, Warna: d.Warna || '-', NoPabrik: d.NoPabrik || '-', NoMesin: d.NoMesin || '-',
        Ukuran: d.Ukuran || '-', ThnPembuatan: d.ThnPembuatan || new Date().getFullYear(), JmlBarang: d.JmlBarang || 1,
        Satuan: d.Satuan || 'Unit', Kondisi: d.Kondisi || 'Baik', MerkType: d.MerkType || '-', NoPolisi: d.NoPolisi || '-',
        NoRangka: d.NoRangka || '-', BPKB: d.BPKB || '-', Pengguna: d.Pengguna || '-', NoBAST: d.NoBAST || '-',
        TglBAST: d.TglBAST || null, NoKontrak: d.NoKontrak || '-', TglKontrak: d.TglKontrak || null,
        AsalUsul: d.AsalUsul || 'Pengadaan', Lokasi: d.Lokasi, Keterangan: d.Keterangan || '',
        Foto: d.Foto || '', InputBy: inputBy, TglInput: new Date().toISOString(),
        lat: d.lat || -7.7825, lng: d.lng || 110.3685, is_deleted: false, deleted_at: null
      };
      memoryStore.barang.push(newItem);
      createdItem = newItem;
    }

    // Trigger async append to Google Sheets (non-blocking)
    appendAssetToGoogleSheets(createdItem).catch(() => {});

    return res.status(201).json({ success: true, message: 'Barang berhasil ditambahkan', data: createdItem });
  } catch (err) {
    console.error('createAsset error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan barang' });
  }
}

// PUT /api/assets/:id
export async function updateAsset(req, res) {
  try {
    const d = req.body;
    const id = req.params.id;
    const updatedBy = req.user?.nama_lengkap || req.user?.username || 'admin';

    // Limitasi ukuran foto aset (Maksimal ~300 KB base64 string untuk efisiensi ratusan ribu aset)
    if (d.Foto && typeof d.Foto === 'string' && d.Foto.length > 400 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Ukuran foto aset terlalu besar (maksimal 300 KB). Sistem otomatis mengompresi foto saat diunggah.'
      });
    }

    if (isPgConnected()) {
      const result = await query(`
        UPDATE barang SET
          "NamaBarang" = COALESCE($1, "NamaBarang"),
          "Bahan" = COALESCE($2, "Bahan"),
          "ThnPerolehan" = COALESCE($3, "ThnPerolehan"),
          "HargaBarang" = COALESCE($4, "HargaBarang"),
          "Warna" = COALESCE($5, "Warna"),
          "NoPabrik" = COALESCE($6, "NoPabrik"),
          "NoMesin" = COALESCE($7, "NoMesin"),
          "Ukuran" = COALESCE($8, "Ukuran"),
          "ThnPembuatan" = COALESCE($9, "ThnPembuatan"),
          "JmlBarang" = COALESCE($10, "JmlBarang"),
          "Satuan" = COALESCE($11, "Satuan"),
          "Kondisi" = COALESCE($12, "Kondisi"),
          "MerkType" = COALESCE($13, "MerkType"),
          "NoPolisi" = COALESCE($14, "NoPolisi"),
          "NoRangka" = COALESCE($15, "NoRangka"),
          "BPKB" = COALESCE($16, "BPKB"),
          "Pengguna" = COALESCE($17, "Pengguna"),
          "NoBAST" = COALESCE($18, "NoBAST"),
          "TglBAST" = $19,
          "NoKontrak" = COALESCE($20, "NoKontrak"),
          "TglKontrak" = $21,
          "AsalUsul" = COALESCE($22, "AsalUsul"),
          "Lokasi" = COALESCE($23, "Lokasi"),
          "Keterangan" = COALESCE($24, "Keterangan"),
          "Foto" = COALESCE($25, "Foto"),
          "lat" = COALESCE($26, "lat"),
          "lng" = COALESCE($27, "lng"),
          "InputBy" = $28,
          "TglInput" = NOW()
        WHERE id = $29
        RETURNING ${BARANG_COLUMNS}
      `, [
        d.NamaBarang, d.Bahan, d.ThnPerolehan, d.HargaBarang, d.Warna,
        d.NoPabrik, d.NoMesin, d.Ukuran, d.ThnPembuatan, d.JmlBarang, d.Satuan,
        d.Kondisi, d.MerkType, d.NoPolisi, d.NoRangka, d.BPKB, d.Pengguna,
        d.NoBAST, d.TglBAST || null, d.NoKontrak, d.TglKontrak || null, d.AsalUsul, d.Lokasi,
        d.Keterangan, d.Foto, d.lat, d.lng, updatedBy, id
      ]);

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      return res.json({ success: true, message: 'Barang berhasil diperbarui', data: formatRow(result.rows[0]) });
    } else {
      const idx = memoryStore.barang.findIndex(b => b.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      memoryStore.barang[idx] = { 
        ...memoryStore.barang[idx], 
        ...d, 
        InputBy: updatedBy, 
        TglInput: new Date().toISOString() 
      };
      return res.json({ success: true, message: 'Barang berhasil diperbarui', data: memoryStore.barang[idx] });
    }
  } catch (err) {
    console.error('updateAsset error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui barang' });
  }
}

// DELETE /api/assets/:id (Soft Delete)
export async function deleteAsset(req, res) {
  try {
    const id = req.params.id;

    if (isPgConnected()) {
      const result = await query(`
        UPDATE barang SET "is_deleted" = true, "deleted_at" = NOW()
        WHERE id = $1 AND "is_deleted" = false
        RETURNING ${BARANG_COLUMNS}
      `, [id]);

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      return res.json({ success: true, message: 'Barang dipindahkan ke log terhapus', data: formatRow(result.rows[0]) });
    } else {
      const idx = memoryStore.barang.findIndex(b => b.id === parseInt(id) && !b.is_deleted);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
      memoryStore.barang[idx].is_deleted = true;
      memoryStore.barang[idx].deleted_at = new Date().toISOString();
      return res.json({ success: true, message: 'Barang dipindahkan ke log terhapus', data: memoryStore.barang[idx] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus barang' });
  }
}

// GET /api/assets/export/csv
export async function exportAssetsCsv(req, res) {
  try {
    let assets = [];
    if (isPgConnected()) {
      const result = await query(`SELECT ${BARANG_COLUMNS} FROM barang WHERE "is_deleted" = false ORDER BY id ASC`);
      assets = result.rows.map(formatRow);
    } else {
      assets = memoryStore.barang.filter(b => !b.is_deleted);
    }

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

    // UTF-8 BOM \uFEFF ensures Excel/Sheets handles Indonesian/Unicode characters correctly
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="SIGAP_Aset_Data_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('exportAssetsCsv error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengunduh file CSV' });
  }
}

// POST /api/assets/import/csv
export async function importAssetsCsv(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data barang yang dikirim dalam array items' });
    }

    const inputBy = req.user?.nama_lengkap || req.user?.username || 'admin';
    let insertedCount = 0;

    for (const d of items) {
      if (!d.NamaBarang || !d.Lokasi) continue;

      if (isPgConnected()) {
        await query(`
          INSERT INTO barang (
            "NamaBarang", "Bahan", "ThnPerolehan", "HargaBarang", "Warna",
            "NoPabrik", "NoMesin", "Ukuran", "ThnPembuatan", "JmlBarang", "Satuan",
            "Kondisi", "MerkType", "NoPolisi", "NoRangka", "BPKB", "Pengguna",
            "NoBAST", "TglBAST", "NoKontrak", "TglKontrak", "AsalUsul", "Lokasi",
            "Keterangan", "Foto", "InputBy", "TglInput", "lat", "lng"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,NOW(),$27,$28)
        `, [
          d.NamaBarang, d.Bahan || '-', d.ThnPerolehan || new Date().getFullYear(), parseFloat(d.HargaBarang) || 0, d.Warna || '-',
          d.NoPabrik || '-', d.NoMesin || '-', d.Ukuran || '-', d.ThnPembuatan || new Date().getFullYear(), parseInt(d.JmlBarang) || 1, d.Satuan || 'Unit',
          d.Kondisi || 'Baik', d.MerkType || '-', d.NoPolisi || '-', d.NoRangka || '-', d.BPKB || '-', d.Pengguna || '-',
          d.NoBAST || '-', d.TglBAST || null, d.NoKontrak || '-', d.TglKontrak || null, d.AsalUsul || 'Pengadaan', d.Lokasi,
          d.Keterangan || '', d.Foto || '', inputBy, parseFloat(d.lat) || -7.7825, parseFloat(d.lng) || 110.3685
        ]);
        insertedCount++;
      } else {
        const newId = memoryStore.barang.length > 0 ? Math.max(...memoryStore.barang.map(b => b.id)) + 1 : 1;
        memoryStore.barang.push({
          id: newId,
          NamaBarang: d.NamaBarang, Bahan: d.Bahan || '-', ThnPerolehan: parseInt(d.ThnPerolehan) || new Date().getFullYear(),
          HargaBarang: parseFloat(d.HargaBarang) || 0, Warna: d.Warna || '-', NoPabrik: d.NoPabrik || '-', NoMesin: d.NoMesin || '-',
          Ukuran: d.Ukuran || '-', ThnPembuatan: parseInt(d.ThnPembuatan) || new Date().getFullYear(), JmlBarang: parseInt(d.JmlBarang) || 1,
          Satuan: d.Satuan || 'Unit', Kondisi: d.Kondisi || 'Baik', MerkType: d.MerkType || '-', NoPolisi: d.NoPolisi || '-',
          NoRangka: d.NoRangka || '-', BPKB: d.BPKB || '-', Pengguna: d.Pengguna || '-', NoBAST: d.NoBAST || '-',
          TglBAST: d.TglBAST || null, NoKontrak: d.NoKontrak || '-', TglKontrak: d.TglKontrak || null,
          AsalUsul: d.AsalUsul || 'Pengadaan', Lokasi: d.Lokasi, Keterangan: d.Keterangan || '',
          Foto: d.Foto || '', InputBy: inputBy, TglInput: new Date().toISOString(),
          lat: parseFloat(d.lat) || -7.7825, lng: parseFloat(d.lng) || 110.3685, is_deleted: false, deleted_at: null
        });
        insertedCount++;
      }
    }

    return res.json({ success: true, message: `Berhasil mengimpor ${insertedCount} data aset ke database` });
  } catch (err) {
    console.error('importAssetsCsv error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengimpor data CSV' });
  }
}

// POST /api/assets/sync-sheets
export async function syncGoogleSheetsController(req, res) {
  try {
    let assets = [];
    if (isPgConnected()) {
      const result = await query(`SELECT ${BARANG_COLUMNS} FROM barang WHERE "is_deleted" = false ORDER BY id ASC`);
      assets = result.rows.map(formatRow);
    } else {
      assets = memoryStore.barang.filter(b => !b.is_deleted);
    }

    const syncResult = await syncAllToGoogleSheets(assets);
    if (!syncResult.success) {
      return res.status(400).json({ success: false, message: syncResult.message, configured: syncResult.configured });
    }
    return res.json({ success: true, message: syncResult.message });
  } catch (err) {
    console.error('syncGoogleSheetsController error:', err);
    return res.status(500).json({ success: false, message: 'Gagal melakukan sinkronisasi Google Sheets' });
  }
}

// GET /api/deleted-log
export async function getDeletedLog(req, res) {
  try {
    const { search } = req.query;

    if (isPgConnected()) {
      let sql = `SELECT ${BARANG_COLUMNS} FROM barang WHERE "is_deleted" = true`;
      const params = [];
      if (search) {
        sql += ` AND (LOWER("NamaBarang") LIKE $1 OR LOWER("MerkType") LIKE $1)`;
        params.push(`%${search.toLowerCase()}%`);
      }
      sql += ' ORDER BY "deleted_at" DESC';
      const result = await query(sql, params);
      return res.json({ success: true, data: result.rows.map(formatRow), total: result.rows.length });
    } else {
      let data = memoryStore.barang.filter(b => b.is_deleted);
      if (search) {
        const s = search.toLowerCase();
        data = data.filter(b => b.NamaBarang.toLowerCase().includes(s));
      }
      return res.json({ success: true, data, total: data.length });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil log terhapus' });
  }
}

// POST /api/deleted-log/:id/restore
export async function restoreDeletedLog(req, res) {
  try {
    const id = req.params.id;

    if (isPgConnected()) {
      const result = await query(`
        UPDATE barang SET "is_deleted" = false, "deleted_at" = NULL
        WHERE id = $1 AND "is_deleted" = true
        RETURNING ${BARANG_COLUMNS}
      `, [id]);

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Data log tidak ditemukan' });
      return res.json({ success: true, message: 'Barang berhasil dipulihkan', data: formatRow(result.rows[0]) });
    } else {
      const idx = memoryStore.barang.findIndex(b => b.id === parseInt(id) && b.is_deleted);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Data log tidak ditemukan' });
      memoryStore.barang[idx].is_deleted = false;
      memoryStore.barang[idx].deleted_at = null;
      return res.json({ success: true, message: 'Barang berhasil dipulihkan', data: memoryStore.barang[idx] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memulihkan barang' });
  }
}

// DELETE /api/deleted-log/:id (Hard Delete)
export async function hardDeleteLog(req, res) {
  try {
    const id = req.params.id;

    if (isPgConnected()) {
      const result = await query(`
        DELETE FROM barang WHERE id = $1 AND "is_deleted" = true RETURNING id, "NamaBarang"
      `, [id]);

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Data log tidak ditemukan' });
      return res.json({ success: true, message: 'Barang dihapus permanen' });
    } else {
      const idx = memoryStore.barang.findIndex(b => b.id === parseInt(id) && b.is_deleted);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Data log tidak ditemukan' });
      memoryStore.barang.splice(idx, 1);
      return res.json({ success: true, message: 'Barang dihapus permanen' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus permanen' });
  }
}

// GET /api/stats
export async function getStats(req, res) {
  try {
    if (isPgConnected()) {
      const total = await query('SELECT COUNT(*) FROM barang WHERE "is_deleted" = false');
      const baik = await query(`SELECT COUNT(*) FROM barang WHERE "is_deleted" = false AND "Kondisi" = 'Baik'`);
      const ringan = await query(`SELECT COUNT(*) FROM barang WHERE "is_deleted" = false AND "Kondisi" = 'Rusak Ringan'`);
      const berat = await query(`SELECT COUNT(*) FROM barang WHERE "is_deleted" = false AND "Kondisi" = 'Rusak Berat'`);
      const totalNilai = await query('SELECT COALESCE(SUM("HargaBarang" * "JmlBarang"), 0) as total FROM barang WHERE "is_deleted" = false');
      const deletedCount = await query('SELECT COUNT(*) FROM barang WHERE "is_deleted" = true');

      // Categories
      const catResult = await query(`
        SELECT "AsalUsul", COUNT(*) as count FROM barang WHERE "is_deleted" = false GROUP BY "AsalUsul" ORDER BY count DESC
      `);
      const categories = {};
      catResult.rows.forEach(r => { categories[r.AsalUsul] = parseInt(r.count); });

      // Kondisi distribution
      const kondisiResult = await query(`
        SELECT "Kondisi", COUNT(*) as count FROM barang WHERE "is_deleted" = false GROUP BY "Kondisi"
      `);
      const kondisiDist = {};
      kondisiResult.rows.forEach(r => { kondisiDist[r.Kondisi] = parseInt(r.count); });

      return res.json({
        success: true,
        data: {
          total: parseInt(total.rows[0].count),
          baik: parseInt(baik.rows[0].count),
          ringan: parseInt(ringan.rows[0].count),
          berat: parseInt(berat.rows[0].count),
          totalNilai: parseFloat(totalNilai.rows[0].total),
          categories,
          kondisiDist,
          deletedCount: parseInt(deletedCount.rows[0].count)
        }
      });
    } else {
      const active = memoryStore.barang.filter(b => !b.is_deleted);
      const categories = {};
      active.forEach(b => { categories[b.AsalUsul] = (categories[b.AsalUsul] || 0) + 1; });
      const kondisiDist = {};
      active.forEach(b => { kondisiDist[b.Kondisi] = (kondisiDist[b.Kondisi] || 0) + 1; });

      return res.json({
        success: true,
        data: {
          total: active.length,
          baik: active.filter(b => b.Kondisi === 'Baik').length,
          ringan: active.filter(b => b.Kondisi === 'Rusak Ringan').length,
          berat: active.filter(b => b.Kondisi === 'Rusak Berat').length,
          totalNilai: active.reduce((s, b) => s + (Number(b.HargaBarang) * (b.JmlBarang || 1) || 0), 0),
          categories,
          kondisiDist,
          deletedCount: memoryStore.barang.filter(b => b.is_deleted).length
        }
      });
    }
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
}
