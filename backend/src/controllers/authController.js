import jwt from 'jsonwebtoken';
import { query, isPgConnected, memoryStore } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sigap-aset-super-secret-key-2026';

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Nama pengguna dan kata sandi wajib diisi' });
  }

  let foundUser = null;

  if (isPgConnected()) {
    try {
      const result = await query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
      if (result.rows.length > 0) {
        foundUser = result.rows[0];
      }
    } catch (err) {
      console.error('Login query error:', err.message);
    }
  } else {
    foundUser = memoryStore.users.find(u => u.username === username && u.password === password);
  }

  if (foundUser) {
    const user = {
      id: foundUser.id,
      username: foundUser.username,
      nama_lengkap: foundUser.nama_lengkap,
      role: foundUser.role,
      foto: foundUser.foto || '',
      avatar: foundUser.foto || ''
    };
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, message: 'Login berhasil', token, user });
  }

  return res.status(401).json({
    success: false,
    message: 'Nama pengguna atau kata sandi salah'
  });
}

export async function me(req, res) {
  if (req.user) {
    try {
      if (isPgConnected()) {
        const result = await query('SELECT id, username, nama_lengkap, role, foto FROM users WHERE id = $1', [req.user.id]);
        if (result && result.rows.length > 0) {
          const u = result.rows[0];
          return res.json({
            success: true,
            user: {
              id: u.id,
              username: u.username,
              nama_lengkap: u.nama_lengkap,
              role: u.role,
              foto: u.foto || '',
              avatar: u.foto || ''
            }
          });
        }
      } else {
        const u = memoryStore.users.find(item => item.id === req.user.id);
        if (u) {
          return res.json({
            success: true,
            user: {
              id: u.id,
              username: u.username,
              nama_lengkap: u.nama_lengkap,
              role: u.role,
              foto: u.foto || '',
              avatar: u.foto || ''
            }
          });
        }
      }
    } catch (e) {
      console.error('me fetch error:', e);
    }
    return res.json({ success: true, user: req.user });
  }
  return res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
}

export function logout(req, res) {
  return res.json({ success: true, message: 'Logout berhasil' });
}
