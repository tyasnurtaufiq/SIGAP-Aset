import { query, isPgConnected, memoryStore } from '../db/index.js';

// GET /api/users (Super Admin only)
export async function getUsers(req, res) {
  try {
    if (isPgConnected()) {
      const result = await query('SELECT id, username, password, nama_lengkap, role, foto, created_at FROM users ORDER BY id ASC');
      return res.json({ success: true, data: result.rows });
    } else {
      const users = memoryStore.users.map(u => ({
        id: u.id,
        username: u.username,
        password: u.password,
        nama_lengkap: u.nama_lengkap,
        role: u.role,
        foto: u.foto || '',
        created_at: u.created_at || new Date().toISOString()
      }));
      return res.json({ success: true, data: users });
    }
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna' });
  }
}

// POST /api/users (Super Admin only)
export async function createUser(req, res) {
  try {
    const { username, password, nama_lengkap, role } = req.body;

    if (!username || !password || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'Username, password, dan nama lengkap wajib diisi' });
    }

    const userRole = role === 'superadmin' ? 'superadmin' : 'user';

    if (isPgConnected()) {
      const check = await query('SELECT id FROM users WHERE username = $1', [username.trim()]);
      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
      }

      const result = await query(
        `INSERT INTO users (username, password, nama_lengkap, role) VALUES ($1, $2, $3, $4) RETURNING id, username, nama_lengkap, role, created_at`,
        [username.trim(), password, nama_lengkap.trim(), userRole]
      );
      return res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan', data: result.rows[0] });
    } else {
      const exists = memoryStore.users.some(u => u.username === username.trim());
      if (exists) return res.status(400).json({ success: false, message: 'Username sudah digunakan' });

      const newId = memoryStore.users.length > 0 ? Math.max(...memoryStore.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        username: username.trim(),
        password,
        nama_lengkap: nama_lengkap.trim(),
        role: userRole,
        created_at: new Date().toISOString()
      };
      memoryStore.users.push(newUser);
      return res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan', data: newUser });
    }
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna' });
  }
}

// PUT /api/users/:id (Super Admin only)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, password, nama_lengkap, role } = req.body;

    if (!username || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'Username dan nama lengkap wajib diisi' });
    }

    if (isPgConnected()) {
      // Check username duplicate for other users
      const check = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username.trim(), id]);
      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain' });
      }

      let sql = 'UPDATE users SET username = $1, nama_lengkap = $2, role = $3';
      const params = [username.trim(), nama_lengkap.trim(), role || 'user'];
      let paramIdx = 4;

      if (password && password.trim().length > 0) {
        sql += `, password = $${paramIdx}`;
        params.push(password);
        paramIdx++;
      }

      sql += ` WHERE id = $${paramIdx} RETURNING id, username, nama_lengkap, role, created_at`;
      params.push(id);

      const result = await query(sql, params);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });

      return res.json({ success: true, message: 'Data pengguna berhasil diperbarui', data: result.rows[0] });
    } else {
      const idx = memoryStore.users.findIndex(u => u.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });

      memoryStore.users[idx].username = username.trim();
      memoryStore.users[idx].nama_lengkap = nama_lengkap.trim();
      if (role) memoryStore.users[idx].role = role;
      if (password && password.trim().length > 0) memoryStore.users[idx].password = password;

      return res.json({ success: true, message: 'Data pengguna berhasil diperbarui', data: memoryStore.users[idx] });
    }
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna' });
  }
}

// DELETE /api/users/:id (Super Admin only)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri' });
    }

    if (isPgConnected()) {
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
      return res.json({ success: true, message: 'Pengguna berhasil dihapus' });
    } else {
      const idx = memoryStore.users.findIndex(u => u.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
      memoryStore.users.splice(idx, 1);
      return res.json({ success: true, message: 'Pengguna berhasil dihapus' });
    }
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pengguna' });
  }
}

// PUT /api/auth/profile (All authenticated users - self update)
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { nama_lengkap, username, new_password, avatar, foto } = req.body;
    const userFoto = foto !== undefined ? foto : (avatar !== undefined ? avatar : null);

    if (!nama_lengkap || !username) {
      return res.status(400).json({ success: false, message: 'Nama lengkap dan username wajib diisi' });
    }

    // Limitasi ukuran foto profil (Maksimal ~200 KB base64 string)
    if (userFoto && typeof userFoto === 'string' && userFoto.length > 250 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Ukuran foto profil melebihi batas server (maksimal 200 KB). Foto otomatis dikompresi oleh sistem.'
      });
    }

    if (isPgConnected()) {
      // Check username duplicate for other users
      const check = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username.trim(), userId]);
      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain' });
      }

      let sql = 'UPDATE users SET nama_lengkap = $1, username = $2';
      const params = [nama_lengkap.trim(), username.trim()];
      let pIdx = 3;

      if (userFoto !== null) {
        sql += `, foto = $${pIdx}`;
        params.push(userFoto);
        pIdx++;
      }

      if (new_password && new_password.trim().length >= 6) {
        sql += `, password = $${pIdx}`;
        params.push(new_password.trim());
        pIdx++;
      }

      sql += ` WHERE id = $${pIdx} RETURNING id, username, nama_lengkap, role, foto, created_at`;
      params.push(userId);

      const result = await query(sql, params);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });

      const updatedUser = {
        ...result.rows[0],
        foto: result.rows[0].foto || '',
        avatar: result.rows[0].foto || ''
      };
      return res.json({ success: true, message: 'Profil dan foto berhasil diperbarui', user: updatedUser });
    } else {
      const idx = memoryStore.users.findIndex(u => u.id === userId);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });

      memoryStore.users[idx].nama_lengkap = nama_lengkap.trim();
      memoryStore.users[idx].username = username.trim();
      if (userFoto !== null) {
        memoryStore.users[idx].foto = userFoto;
      }
      if (new_password && new_password.trim().length >= 6) {
        memoryStore.users[idx].password = new_password.trim();
      }

      const updatedUser = {
        id: memoryStore.users[idx].id,
        username: memoryStore.users[idx].username,
        nama_lengkap: memoryStore.users[idx].nama_lengkap,
        role: memoryStore.users[idx].role,
        foto: memoryStore.users[idx].foto || '',
        avatar: memoryStore.users[idx].foto || ''
      };
      return res.json({ success: true, message: 'Profil dan foto berhasil diperbarui', user: updatedUser });
    }
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui profil' });
  }
}
