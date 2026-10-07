import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const config = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'siap',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'su200497',
};

let pool = null;
let isPostgresConnected = false;

// Fallback in-memory store if postgres server is offline
const memoryStore = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', nama_lengkap: 'Super Admin', role: 'super_admin', foto: '' },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 2,
      username: `user${i + 1}`,
      password: 'user123',
      nama_lengkap: `User Petugas ${i + 1}`,
      role: 'user',
      foto: ''
    }))
  ],
  barang: []
};

async function ensureDatabaseExists() {
  const rootClient = new pg.Client({
    host: config.host,
    port: config.port,
    database: 'postgres',
    user: config.user,
    password: config.password,
  });

  try {
    await rootClient.connect();
    const res = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [config.database]);
    if (res.rowCount === 0) {
      console.log(`Database "${config.database}" tidak ditemukan. Membuat database baru...`);
      await rootClient.query(`CREATE DATABASE "${config.database}"`);
      console.log(`✅ Database "${config.database}" berhasil dibuat!`);
    }
  } catch (err) {
    console.warn(`[PG Init Warning] Tidak dapat membuat database via root client: ${err.message}`);
  } finally {
    try { await rootClient.end(); } catch (e) {}
  }
}

export async function initDb() {
  try {
    await ensureDatabaseExists();

    pool = new Pool(config);
    const client = await pool.connect();
    isPostgresConnected = true;
    console.log(`✅ Terhubung ke PostgreSQL: ${config.user}@${config.host}:${config.port}/${config.database}`);

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama_lengkap VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        foto TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure foto column exists on existing installations
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS foto TEXT DEFAULT '';
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS barang (
        id SERIAL PRIMARY KEY,
        "NamaBarang" VARCHAR(255) NOT NULL,
        "Bahan" VARCHAR(100) DEFAULT '-',
        "ThnPerolehan" INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
        "HargaBarang" NUMERIC(15,2) DEFAULT 0,
        "Warna" VARCHAR(50) DEFAULT '-',
        "NoPabrik" VARCHAR(100) DEFAULT '-',
        "NoMesin" VARCHAR(100) DEFAULT '-',
        "Ukuran" VARCHAR(100) DEFAULT '-',
        "ThnPembuatan" INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
        "JmlBarang" INT DEFAULT 1,
        "Satuan" VARCHAR(50) DEFAULT 'Unit',
        "Kondisi" VARCHAR(50) DEFAULT 'Baik',
        "MerkType" VARCHAR(100) DEFAULT '-',
        "NoPolisi" VARCHAR(50) DEFAULT '-',
        "NoRangka" VARCHAR(100) DEFAULT '-',
        "BPKB" VARCHAR(100) DEFAULT '-',
        "Pengguna" VARCHAR(100) DEFAULT '-',
        "NoBAST" VARCHAR(100) DEFAULT '-',
        "TglBAST" DATE,
        "NoKontrak" VARCHAR(100) DEFAULT '-',
        "TglKontrak" DATE,
        "AsalUsul" VARCHAR(100) DEFAULT 'APBD',
        "Lokasi" VARCHAR(255) NOT NULL,
        "Keterangan" TEXT DEFAULT '',
        "Foto" TEXT DEFAULT '',
        "InputBy" VARCHAR(100) NOT NULL DEFAULT 'admin',
        "TglInput" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "lat" NUMERIC(10,6) DEFAULT -7.782500,
        "lng" NUMERIC(10,6) DEFAULT 110.368500,
        "is_deleted" BOOLEAN DEFAULT FALSE,
        "deleted_at" TIMESTAMP
      );
    `);

    // Performance indexes for scale (handling hundreds of thousands of assets)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_barang_is_deleted ON barang ("is_deleted");
      CREATE INDEX IF NOT EXISTS idx_barang_kondisi ON barang ("Kondisi");
      CREATE INDEX IF NOT EXISTS idx_barang_asalusul ON barang ("AsalUsul");
      CREATE INDEX IF NOT EXISTS idx_barang_thnperolehan ON barang ("ThnPerolehan");
      CREATE INDEX IF NOT EXISTS idx_barang_lokasi ON barang ("Lokasi");
    `);

    // Seed Super Admin & 10 Users if empty
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('Seeding akun Super Admin dan 10 User...');
      await client.query(`
        INSERT INTO users (username, password, nama_lengkap, role) VALUES
        ('admin', 'admin123', 'Super Admin Utama', 'super_admin'),
        ('user1', 'user123', 'User Petugas 1', 'user'),
        ('user2', 'user123', 'User Petugas 2', 'user'),
        ('user3', 'user123', 'User Petugas 3', 'user'),
        ('user4', 'user123', 'User Petugas 4', 'user'),
        ('user5', 'user123', 'User Petugas 5', 'user'),
        ('user6', 'user123', 'User Petugas 6', 'user'),
        ('user7', 'user123', 'User Petugas 7', 'user'),
        ('user8', 'user123', 'User Petugas 8', 'user'),
        ('user9', 'user123', 'User Petugas 9', 'user'),
        ('user10', 'user123', 'User Petugas 10', 'user');
      `);
      console.log('✅ Akun Super Admin (admin) & 10 Users (user1..user10) berhasil dibuat!');
    }

    // Seeding dummy barang dinonaktifkan agar tabel barang tetap kosong sesuai permintaan user

    client.release();
  } catch (err) {
    console.error('⚠️ PostgreSQL Connection Error:', err.message);
    console.warn('⚡ Menggunakan fallback database in-memory untuk memastikan Express API tetap berjalan.');
    isPostgresConnected = false;
  }
}

export async function query(text, params) {
  if (isPostgresConnected && pool) {
    try {
      return await pool.query(text, params);
    } catch (e) {
      console.error('PostgreSQL Query Error:', e.message);
      throw e;
    }
  } else {
    // Return null to signal fallback to memory store
    return null;
  }
}

export function isPgConnected() {
  return isPostgresConnected;
}

export { memoryStore };
