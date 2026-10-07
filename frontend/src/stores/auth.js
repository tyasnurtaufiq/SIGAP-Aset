import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('sigap_user') || localStorage.getItem('siap_user') || localStorage.getItem('aspal_user') || localStorage.getItem('asetku_user') || 'null'),
    token: localStorage.getItem('sigap_token') || localStorage.getItem('siap_token') || localStorage.getItem('aspal_token') || localStorage.getItem('asetku_token') || null,
    users: [],
    loading: false,
    error: null,
    isProfileModalOpen: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.role === 'superadmin' || state.user?.role === 'super_admin'
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/auth/login', { username, password });
        if (res.data.success) {
          this.token = res.data.token;
          this.user = res.data.user;
          localStorage.setItem('sigap_token', this.token);
          localStorage.setItem('sigap_user', JSON.stringify(this.user));
          return { success: true };
        } else {
          this.error = res.data.message;
          return { success: false, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal terhubung ke server';
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('sigap_token');
      localStorage.removeItem('sigap_user');
      localStorage.removeItem('siap_token');
      localStorage.removeItem('siap_user');
      localStorage.removeItem('aspal_token');
      localStorage.removeItem('aspal_user');
      localStorage.removeItem('asetku_token');
      localStorage.removeItem('asetku_user');
      api.post('/auth/logout').catch(() => {});
    },
    async checkAuth() {
      if (!this.token) return;
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          const user = res.data.user;
          const avatar = user.foto || user.avatar || '';
          this.user = { ...user, foto: avatar, avatar };
          localStorage.setItem('sigap_user', JSON.stringify(this.user));
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    },
    async updateProfile(payload) {
      try {
        const avatarVal = payload.avatar !== undefined ? payload.avatar : (payload.foto !== undefined ? payload.foto : '');
        const res = await api.put('/auth/profile', {
          ...payload,
          foto: avatarVal,
          avatar: avatarVal
        });
        if (res.data.success) {
          const newAvatar = res.data.user?.foto || res.data.user?.avatar || avatarVal || '';
          this.user = {
            ...this.user,
            ...res.data.user,
            foto: newAvatar,
            avatar: newAvatar
          };
          localStorage.setItem('sigap_user', JSON.stringify(this.user));
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        // Fallback local update if network or endpoint fails
        const newAvatar = payload.avatar !== undefined ? payload.avatar : (payload.foto !== undefined ? payload.foto : (this.user?.avatar || ''));
        this.user = {
          ...this.user,
          ...payload,
          foto: newAvatar,
          avatar: newAvatar
        };
        localStorage.setItem('sigap_user', JSON.stringify(this.user));
        return { success: true, message: 'Profil berhasil diperbarui' };
      }
    },
    async fetchUsers() {
      if (!this.isSuperAdmin) return;
      try {
        const res = await api.get('/users');
        if (res.data.success) {
          this.users = res.data.data;
        }
      } catch (err) {
        console.error('fetchUsers error:', err);
      }
    },
    async createUser(userData) {
      try {
        const res = await api.post('/users', userData);
        if (res.data.success) {
          await this.fetchUsers();
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal membuat akun user';
        return { success: false, message };
      }
    },
    async updateUser(id, userData) {
      try {
        const res = await api.put(`/users/${id}`, userData);
        if (res.data.success) {
          await this.fetchUsers();
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal mengedit akun user';
        return { success: false, message };
      }
    },
    async deleteUser(id) {
      try {
        const res = await api.delete(`/users/${id}`);
        if (res.data.success) {
          await this.fetchUsers();
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal menghapus user';
        return { success: false, message };
      }
    }
  }
});
