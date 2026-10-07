import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'store.json');

const SEED_ASSETS = [
  { id:'1', kode:'AST-0001', nama:'Laptop Dell Latitude 5420', kategori:'Elektronik', kondisi:'Baik', lokasi:'Gedung Rektorat Lt. 2', lat:-7.7822, lng:110.3705, tanggal:'2023-02-10', asalAset:'Pengadaan', tahunAnggaran:2023, harga:14500000, deskripsi:'Digunakan untuk operasional bagian keuangan.' },
  { id:'2', kode:'AST-0002', nama:'Proyektor Epson EB-X41', kategori:'Elektronik', kondisi:'Rusak Ringan', lokasi:'Ruang Kuliah A101', lat:-7.7815, lng:110.3688, tanggal:'2022-08-05', asalAset:'Pengadaan', tahunAnggaran:2022, harga:6200000, deskripsi:'Lampu proyektor mulai redup, perlu penggantian.' },
  { id:'3', kode:'AST-0003', nama:'Kursi Kuliah Lipat', kategori:'Furnitur', kondisi:'Baik', lokasi:'Ruang Kuliah B203', lat:-7.7830, lng:110.3660, tanggal:'2021-06-01', asalAset:'Pengadaan', tahunAnggaran:2021, harga:8800000, deskripsi:'Satu set 40 unit kursi kuliah.' },
  { id:'4', kode:'AST-0004', nama:'Mobil Dinas Toyota Avanza', kategori:'Kendaraan', kondisi:'Baik', lokasi:'Area Parkir Utama', lat:-7.7845, lng:110.3695, tanggal:'2020-11-20', asalAset:'Pengadaan', tahunAnggaran:2020, harga:235000000, deskripsi:'Kendaraan operasional pimpinan.' },
  { id:'5', kode:'AST-0005', nama:'Mikroskop Olympus CX23', kategori:'Peralatan Lab', kondisi:'Baik', lokasi:'Lab Biologi Lt. 1', lat:-7.7808, lng:110.3670, tanggal:'2023-01-15', asalAset:'Hibah', tahunAnggaran:2023, harga:18750000, deskripsi:'Digunakan untuk praktikum mahasiswa semester 3.' },
  { id:'6', kode:'AST-0006', nama:'AC Split Daikin 1.5PK', kategori:'Elektronik', kondisi:'Rusak Berat', lokasi:'Ruang Server', lat:-7.7838, lng:110.3712, tanggal:'2019-09-12', asalAset:'Pengadaan', tahunAnggaran:2019, harga:5400000, deskripsi:'Kompresor tidak berfungsi, menunggu perbaikan teknisi.' },
  { id:'7', kode:'AST-0007', nama:'Meja Dosen Kayu Jati', kategori:'Furnitur', kondisi:'Baik', lokasi:'Ruang Dosen 12', lat:-7.7825, lng:110.3648, tanggal:'2021-03-18', asalAset:'Pengadaan', tahunAnggaran:2021, harga:3200000, deskripsi:'' },
  { id:'8', kode:'AST-0008', nama:'Genset Cummins 50kVA', kategori:'Utilitas', kondisi:'Baik', lokasi:'Gedung Utilitas', lat:-7.7850, lng:110.3665, tanggal:'2022-05-09', asalAset:'Hibah', tahunAnggaran:2022, harga:187000000, deskripsi:'Cadangan daya untuk seluruh gedung utama.' },
  { id:'9', kode:'AST-0009', nama:'Printer Canon iR2625', kategori:'Elektronik', kondisi:'Rusak Ringan', lokasi:'Ruang Tata Usaha', lat:-7.7818, lng:110.3720, tanggal:'2022-02-27', asalAset:'Pengadaan', tahunAnggaran:2022, harga:9600000, deskripsi:'Sensor kertas kadang macet.' },
  { id:'10', kode:'AST-0010', nama:'Sepeda Motor Dinas Honda Beat', kategori:'Kendaraan', kondisi:'Baik', lokasi:'Pos Satpam', lat:-7.7800, lng:110.3690, tanggal:'2023-07-03', asalAset:'Pengadaan', tahunAnggaran:2023, harga:19500000, deskripsi:'Digunakan untuk keperluan surat-menyurat antar gedung.' },
  { id:'11', kode:'AST-0011', nama:'Lemari Arsip Besi', kategori:'Furnitur', kondisi:'Rusak Ringan', lokasi:'Ruang Arsip', lat:-7.7833, lng:110.3680, tanggal:'2018-10-22', asalAset:'Hibah', tahunAnggaran:2018, harga:2100000, deskripsi:'Engsel pintu mulai longgar.' },
  { id:'12', kode:'AST-0012', nama:'Gedung Aula Serbaguna', kategori:'Bangunan', kondisi:'Baik', lokasi:'Kompleks Aula', lat:-7.7812, lng:110.3655, tanggal:'2015-01-01', asalAset:'Hibah', tahunAnggaran:2015, harga:4200000000, deskripsi:'Kapasitas 500 orang, digunakan untuk wisuda dan seminar.' }
];

function initStore() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      assets: SEED_ASSETS,
      deletedLog: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  } else {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading store file, resetting to default seed data:', e);
      const defaultData = { assets: SEED_ASSETS, deletedLog: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
  }
}

export function getStore() {
  return initStore();
}

export function saveStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save store file:', e);
  }
}
