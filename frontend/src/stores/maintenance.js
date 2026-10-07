import { defineStore } from 'pinia';
import api from '../services/api';

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    schedules: [],
    loading: false,
    selectedDate: new Date(2026, 8, 20), // default Sep 20, 2026
    isModalOpen: false,
    editingSchedule: null
  }),

  getters: {
    // Return all events formatted with standardized YYYY-MM-DD
    normalizedSchedules: (state) => {
      return state.schedules.map(item => {
        let ymd = '';
        if (item.tanggal) {
          const str = String(item.tanggal).trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            ymd = str;
          } else {
            const d = new Date(str);
            if (!isNaN(d.getTime())) {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              ymd = `${y}-${m}-${day}`;
            } else {
              // fallback regex for Sep 25 2026
              const match = str.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\s+(\d{4})/i);
              if (match) {
                const monthMap = { jan:'01', feb:'02', mar:'03', apr:'04', may:'05', jun:'06', jul:'07', aug:'08', sep:'09', oct:'10', nov:'11', dec:'12' };
                const mon = monthMap[match[1].toLowerCase().slice(0, 3)] || '09';
                const day = match[2].padStart(2, '0');
                const year = match[3];
                ymd = `${year}-${mon}-${day}`;
              }
            }
          }
        }
        return {
          ...item,
          tanggalYMD: ymd
        };
      });
    },

    // Get event days for a specific year and month (0-indexed month)
    getEventsForMonth: (state) => (year, month) => {
      const monthStr = String(month + 1).padStart(2, '0');
      const prefix = `${year}-${monthStr}`;
      return state.normalizedSchedules.filter(s => s.tanggalYMD && s.tanggalYMD.startsWith(prefix));
    },

    // Get list of events for selected day
    schedulesForSelectedDate: (state) => {
      if (!state.selectedDate) return [];
      const y = state.selectedDate.getFullYear();
      const m = String(state.selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(state.selectedDate.getDate()).padStart(2, '0');
      const targetYMD = `${y}-${m}-${d}`;
      return state.normalizedSchedules.filter(s => s.tanggalYMD === targetYMD);
    }
  },

  actions: {
    async fetchSchedules() {
      this.loading = true;
      try {
        const res = await api.get('/maintenance');
        if (res.data.success) {
          this.schedules = res.data.data;
        }
      } catch (err) {
        console.error('fetchSchedules error:', err);
      } finally {
        this.loading = false;
      }
    },

    openModal(schedule = null, defaultDate = null) {
      this.editingSchedule = schedule ? { ...schedule } : null;
      if (defaultDate) {
        this.selectedDate = defaultDate;
      }
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.editingSchedule = null;
    },

    async saveSchedule(formData) {
      try {
        if (this.editingSchedule && this.editingSchedule.id) {
          const res = await api.put(`/maintenance/${this.editingSchedule.id}`, formData);
          if (res.data.success) {
            await this.fetchSchedules();
            this.closeModal();
            return { success: true, message: 'Jadwal berhasil diperbarui' };
          }
        } else {
          const res = await api.post('/maintenance', formData);
          if (res.data.success) {
            await this.fetchSchedules();
            this.closeModal();
            return { success: true, message: 'Jadwal baru berhasil ditambahkan' };
          }
        }
        return { success: false, message: 'Gagal menyimpan jadwal' };
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal menyimpan jadwal perawatan';
        return { success: false, message };
      }
    },

    async deleteSchedule(id) {
      try {
        const res = await api.delete(`/maintenance/${id}`);
        if (res.data.success) {
          await this.fetchSchedules();
          return { success: true, message: 'Jadwal berhasil dihapus' };
        }
        return { success: false, message: 'Gagal menghapus jadwal' };
      } catch (err) {
        return { success: false, message: 'Gagal menghapus jadwal' };
      }
    }
  }
});
