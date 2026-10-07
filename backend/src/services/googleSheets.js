import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let sheetsClient = null;

function getAuth() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    return null;
  }

  // Check 1: File service-account.json in backend directory
  const keyFilePath = path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(keyFilePath)) {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return { auth, spreadsheetId };
    } catch (e) {
      console.warn('⚠️ Google Sheets Auth File Error:', e.message);
    }
  }

  // Check 2: Environment variables GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

  if (clientEmail && privateKey) {
    try {
      const auth = new google.auth.JWT(
        clientEmail,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      return { auth, spreadsheetId };
    } catch (e) {
      console.warn('⚠️ Google Sheets JWT Auth Error:', e.message);
    }
  }

  return null;
}

/**
 * Header baris data untuk Google Sheets (Semua kolom kecuali Harga dan Foto)
 */
export const SHEET_HEADERS = [
  'ID',
  'Nama Barang',
  'Merk/Type',
  'Bahan',
  'Ukuran/Konstruksi',
  'No Pabrik',
  'No Rangka',
  'No Mesin',
  'No Polisi',
  'BPKB',
  'Tahun Pembuatan',
  'Tahun Perolehan',
  'Warna',
  'Jumlah',
  'Satuan',
  'Kondisi',
  'Asal Usul',
  'Pengguna / Penanggung Jawab',
  'Lokasi / Ruangan',
  'Latitude',
  'Longitude',
  'No BAST',
  'Tgl BAST',
  'No Kontrak',
  'Tgl Kontrak',
  'Keterangan',
  'Petugas PIC',
  'Tgl Input'
];

/**
 * Format asset object menjadi array baris sel Google Sheets
 */
export function formatAssetToRow(item) {
  const formatDate = (val) => {
    if (!val) return '-';
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? String(val) : d.toISOString().split('T')[0];
    } catch {
      return String(val);
    }
  };

  const formatDateTime = (val) => {
    if (!val) return '-';
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? String(val) : d.toLocaleString('id-ID');
    } catch {
      return String(val);
    }
  };

  return [
    item.id || '',
    item.NamaBarang || item.nama_barang || '',
    item.MerkType || item.merk_type || '-',
    item.Bahan || item.bahan || '-',
    item.Ukuran || item.ukuran || '-',
    item.NoPabrik || item.no_pabrik || '-',
    item.NoRangka || item.no_rangka || '-',
    item.NoMesin || item.no_mesin || '-',
    item.NoPolisi || item.no_polisi || '-',
    item.BPKB || item.bpkb || '-',
    item.ThnPembuatan || item.thn_pembuatan || '-',
    item.ThnPerolehan || item.thn_perolehan || '-',
    item.Warna || item.warna || '-',
    item.JmlBarang || item.jml_barang || 1,
    item.Satuan || item.satuan || 'Unit',
    item.Kondisi || item.kondisi || 'Baik',
    item.AsalUsul || item.asal_usul || 'Pengadaan',
    item.Pengguna || item.pengguna || '-',
    item.Lokasi || item.lokasi || '-',
    item.lat !== undefined && item.lat !== null ? item.lat : (item.latitude || ''),
    item.lng !== undefined && item.lng !== null ? item.lng : (item.longitude || ''),
    item.NoBAST || item.no_bast || '-',
    formatDate(item.TglBAST || item.tgl_bast),
    item.NoKontrak || item.no_kontrak || '-',
    formatDate(item.TglKontrak || item.tgl_kontrak),
    item.Keterangan || item.keterangan || '-',
    item.InputBy || item.input_by || '-',
    formatDateTime(item.TglInput || item.tgl_input)
  ];
}

/**
 * Sinkronkan seluruh daftar barang ke Google Sheets (Overwrite & Re-header)
 */
export async function syncAllToGoogleSheets(assetsList) {
  const config = getAuth();
  if (!config) {
    return {
      success: false,
      configured: false,
      message: 'Google Sheets ID atau Credentials belum dikonfigurasi di backend/.env'
    };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: config.auth });

    const rows = [
      SHEET_HEADERS,
      ...assetsList.map(formatAssetToRow)
    ];

    // Clear existing sheet data (range luas agar kolom lama bersih)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: config.spreadsheetId,
      range: 'Sheet1!A1:ZZ5000',
    });

    // Update with fresh data
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: config.spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });

    console.log(`✅ [Google Sheets Sync] Berhasil memperbarui ${rows.length - 1} data barang ke Sheet ID: ${config.spreadsheetId}`);
    return {
      success: true,
      configured: true,
      updatedRows: res.data.updatedRows,
      message: `Berhasil sinkronisasi ${rows.length - 1} data barang ke Google Sheets`
    };
  } catch (err) {
    console.error('❌ [Google Sheets Sync Error]:', err.message);
    return {
      success: false,
      configured: true,
      error: err.message,
      message: `Gagal sinkronisasi ke Google Sheets: ${err.message}`
    };
  }
}

/**
 * Tambahkan 1 baris barang baru ke baris paling bawah Google Sheets
 */
export async function appendAssetToGoogleSheets(assetItem) {
  const config = getAuth();
  if (!config) return;

  try {
    const sheets = google.sheets({ version: 'v4', auth: config.auth });
    const row = formatAssetToRow(assetItem);

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    console.log(`✅ [Google Sheets Append] Berhasil menambahkan barang #${assetItem.id} (${assetItem.NamaBarang}) ke Google Sheets`);
  } catch (err) {
    console.warn('⚠️ [Google Sheets Append Warning]:', err.message);
  }
}
