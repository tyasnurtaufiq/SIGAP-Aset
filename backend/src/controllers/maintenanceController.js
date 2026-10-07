import { query, isPgConnected, memoryStore } from '../db/index.js';

// Pastikan in-memory store memiliki struktur awal
if (!memoryStore.maintenance) {
  memoryStore.maintenance = [
    {
      id: 1,
      judul: 'Inspeksi APILL Simpang Tugu',
      kategori: 'Inspeksi',
      tanggal: '2026-09-22',
      waktu: '09:00',
      lokasi: 'Simpang Tugu Yogyakarta',
      aset_id: null,
      nama_barang: 'Fasilitas Lalu Lintas',
      petugas: 'Bambang Triatmojo',
      status: 'Terjadwal',
      keterangan: 'Pengecekan siklus lampu APILL dan kabel bawah tanah',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      judul: 'Uji KIR & Servis Berkala Mobil Dinas',
      kategori: 'Uji KIR',
      tanggal: '2026-09-25',
      waktu: '08:30',
      lokasi: 'Balai Pengujian Kendaraan Dishub',
      aset_id: 4,
      nama_barang: 'Mobil Dinas Toyota Avanza',
      petugas: 'Bagian Umum',
      status: 'Terjadwal',
      keterangan: 'Uji emisi berkala dan servis 10.000 KM',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      judul: 'Pemeliharaan Proyektor Ruang A101',
      kategori: 'Perbaikan',
      tanggal: '2026-09-15',
      waktu: '10:00',
      lokasi: 'Ruang Kuliah A101',
      aset_id: 2,
      nama_barang: 'Proyektor Epson EB-X41',
      petugas: 'Tim IT',
      status: 'Selesai',
      keterangan: 'Penggantian lampu optik proyektor',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      judul: 'Kalibrasi Rambu & Marka Jalan',
      kategori: 'Inspeksi',
      tanggal: '2026-09-28',
      waktu: '08:00',
      lokasi: 'Ruas Jalan Malioboro',
      aset_id: null,
      nama_barang: 'Rambu Lalu Lintas',
      petugas: 'Dra. Monica Sari',
      status: 'Terjadwal',
      keterangan: 'Pembersihan dan pengecatan ulang marka',
      created_at: new Date().toISOString()
    }
  ];
}

async function ensureMaintenanceTable() {
  if (isPgConnected()) {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS maintenance_schedules (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          kategori VARCHAR(100) DEFAULT 'Inspeksi',
          tanggal DATE NOT NULL,
          waktu VARCHAR(20) DEFAULT '08:00',
          lokasi VARCHAR(255) DEFAULT '-',
          aset_id INT,
          nama_barang VARCHAR(255) DEFAULT '-',
          petugas VARCHAR(100) DEFAULT '-',
          status VARCHAR(50) DEFAULT 'Terjadwal',
          keterangan TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed if empty
      const countRes = await query('SELECT COUNT(*) FROM maintenance_schedules');
      if (parseInt(countRes.rows[0].count) === 0) {
        await query(`
          INSERT INTO maintenance_schedules (judul, kategori, tanggal, waktu, lokasi, aset_id, nama_barang, petugas, status, keterangan)
          VALUES 
          ('Inspeksi APILL Simpang Tugu', 'Inspeksi', '2026-09-22', '09:00', 'Simpang Tugu Yogyakarta', NULL, 'Fasilitas Lalu Lintas', 'Bambang Triatmojo', 'Terjadwal', 'Pengecekan siklus lampu APILL'),
          ('Uji KIR & Servis Berkala Mobil Dinas', 'Uji KIR', '2026-09-25', '08:30', 'Balai Pengujian Kendaraan Dishub', 4, 'Mobil Dinas Toyota Avanza', 'Bagian Umum', 'Terjadwal', 'Uji emisi berkala dan servis 10.000 KM'),
          ('Pemeliharaan Proyektor Ruang A101', 'Perbaikan', '2026-09-15', '10:00', 'Ruang Kuliah A101', 2, 'Proyektor Epson EB-X41', 'Tim IT', 'Selesai', 'Penggantian lampu optik proyektor'),
          ('Kalibrasi Rambu & Marka Jalan', 'Inspeksi', '2026-09-28', '08:00', 'Ruas Jalan Malioboro', NULL, 'Rambu Lalu Lintas', 'Dra. Monica Sari', 'Terjadwal', 'Pembersihan dan pengecatan ulang marka');
        `);
      }

      await query(`
        UPDATE maintenance_schedules SET tanggal = '2026-09-22' WHERE id = 1;
        UPDATE maintenance_schedules SET tanggal = '2026-09-25' WHERE id = 2;
        UPDATE maintenance_schedules SET tanggal = '2026-09-15' WHERE id = 3;
        UPDATE maintenance_schedules SET tanggal = '2026-09-28' WHERE id = 4;
      `);
    } catch (e) {
      console.warn('ensureMaintenanceTable warning:', e.message);
    }
  }
}

function formatDateYMD(val) {
  if (!val) return '';
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  
  // Try matching month name and day and year like "Fri Sep 25 2026"
  const match = str.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\s+(\d{4})/i);
  if (match) {
    const monthMap = { jan:'01', feb:'02', mar:'03', apr:'04', may:'05', jun:'06', jul:'07', aug:'08', sep:'09', oct:'10', nov:'11', dec:'12' };
    const mon = monthMap[match[1].toLowerCase().slice(0, 3)] || '01';
    const day = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${mon}-${day}`;
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return str.slice(0, 10);
}

// GET /api/maintenance
export async function getMaintenance(req, res) {
  try {
    await ensureMaintenanceTable();

    if (isPgConnected()) {
      const result = await query('SELECT * FROM maintenance_schedules ORDER BY id ASC');
      console.log('DEBUG getMaintenance rows:', result.rows);
      const rows = result.rows.map(r => ({
        ...r,
        tanggal: formatDateYMD(r.tanggal) || '2026-09-20'
      }));
      return res.json({ success: true, data: rows });
    } else {
      const sorted = [...memoryStore.maintenance]
        .map(r => ({ ...r, tanggal: formatDateYMD(r.tanggal) || '2026-09-20' }))
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      return res.json({ success: true, data: sorted });
    }
  } catch (err) {
    console.error('getMaintenance error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil jadwal perawatan' });
  }
}

// POST /api/maintenance
export async function createMaintenance(req, res) {
  try {
    await ensureMaintenanceTable();

    const {
      judul,
      kategori = 'Inspeksi',
      tanggal,
      waktu = '08:00',
      lokasi = '-',
      aset_id = null,
      nama_barang = '-',
      petugas = '-',
      status = 'Terjadwal',
      keterangan = ''
    } = req.body;

    if (!judul || !tanggal) {
      return res.status(400).json({ success: false, message: 'Judul kegiatan dan tanggal wajib diisi' });
    }

    if (isPgConnected()) {
      const result = await query(`
        INSERT INTO maintenance_schedules (
          judul, kategori, tanggal, waktu, lokasi, aset_id, nama_barang, petugas, status, keterangan, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *
      `, [judul, kategori, tanggal, waktu, lokasi, aset_id, nama_barang, petugas, status, keterangan]);

      const created = {
        ...result.rows[0],
        tanggal: String(result.rows[0].tanggal).split('T')[0]
      };
      return res.status(201).json({ success: true, message: 'Jadwal perawatan berhasil ditambahkan', data: created });
    } else {
      const newId = memoryStore.maintenance.length > 0
        ? Math.max(...memoryStore.maintenance.map(m => m.id)) + 1
        : 1;

      const newSchedule = {
        id: newId,
        judul,
        kategori,
        tanggal,
        waktu,
        lokasi,
        aset_id: aset_id || null,
        nama_barang,
        petugas,
        status,
        keterangan,
        created_at: new Date().toISOString()
      };

      memoryStore.maintenance.push(newSchedule);
      return res.status(201).json({ success: true, message: 'Jadwal perawatan berhasil ditambahkan', data: newSchedule });
    }
  } catch (err) {
    console.error('createMaintenance error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan jadwal perawatan' });
  }
}

// PUT /api/maintenance/:id
export async function updateMaintenance(req, res) {
  try {
    await ensureMaintenanceTable();
    const { id } = req.params;
    const {
      judul,
      kategori,
      tanggal,
      waktu,
      lokasi,
      aset_id,
      nama_barang,
      petugas,
      status,
      keterangan
    } = req.body;

    if (isPgConnected()) {
      const result = await query(`
        UPDATE maintenance_schedules SET
          judul = COALESCE($1, judul),
          kategori = COALESCE($2, kategori),
          tanggal = COALESCE($3, tanggal),
          waktu = COALESCE($4, waktu),
          lokasi = COALESCE($5, lokasi),
          aset_id = $6,
          nama_barang = COALESCE($7, nama_barang),
          petugas = COALESCE($8, petugas),
          status = COALESCE($9, status),
          keterangan = COALESCE($10, keterangan)
        WHERE id = $11
        RETURNING *
      `, [judul, kategori, tanggal, waktu, lokasi, aset_id, nama_barang, petugas, status, keterangan, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
      }

      const updated = {
        ...result.rows[0],
        tanggal: String(result.rows[0].tanggal).split('T')[0]
      };
      return res.json({ success: true, message: 'Jadwal berhasil diperbarui', data: updated });
    } else {
      const idx = memoryStore.maintenance.findIndex(m => m.id === parseInt(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
      }

      const current = memoryStore.maintenance[idx];
      memoryStore.maintenance[idx] = {
        ...current,
        judul: judul !== undefined ? judul : current.judul,
        kategori: kategori !== undefined ? kategori : current.kategori,
        tanggal: tanggal !== undefined ? tanggal : current.tanggal,
        waktu: waktu !== undefined ? waktu : current.waktu,
        lokasi: lokasi !== undefined ? lokasi : current.lokasi,
        aset_id: aset_id !== undefined ? aset_id : current.aset_id,
        nama_barang: nama_barang !== undefined ? nama_barang : current.nama_barang,
        petugas: petugas !== undefined ? petugas : current.petugas,
        status: status !== undefined ? status : current.status,
        keterangan: keterangan !== undefined ? keterangan : current.keterangan
      };

      return res.json({ success: true, message: 'Jadwal berhasil diperbarui', data: memoryStore.maintenance[idx] });
    }
  } catch (err) {
    console.error('updateMaintenance error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui jadwal' });
  }
}

// DELETE /api/maintenance/:id
export async function deleteMaintenance(req, res) {
  try {
    await ensureMaintenanceTable();
    const { id } = req.params;

    if (isPgConnected()) {
      const result = await query('DELETE FROM maintenance_schedules WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
      }
      return res.json({ success: true, message: 'Jadwal berhasil dihapus' });
    } else {
      const idx = memoryStore.maintenance.findIndex(m => m.id === parseInt(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
      }
      memoryStore.maintenance.splice(idx, 1);
      return res.json({ success: true, message: 'Jadwal berhasil dihapus' });
    }
  } catch (err) {
    console.error('deleteMaintenance error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus jadwal' });
  }
}
