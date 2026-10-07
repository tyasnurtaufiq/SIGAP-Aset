<template>
  <div class="bg-white dark:bg-[#1E252D] border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
    <!-- Header with Add Schedule Button -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-1.5">
        <h3 class="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
          Kalender Aset
        </h3>
        <span class="text-[10px] font-semibold text-[#00B368] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          Perawatan
        </span>
      </div>

      <!-- Add Button -->
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00B368] hover:bg-[#009E5B] text-white shadow-xs transition-all"
        title="Jadwalkan Perawatan Baru"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Tambah</span>
      </button>
    </div>

    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 px-1">
      <button
        @click="prevMonth"
        class="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        title="Bulan sebelumnya"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <span class="text-xs font-bold font-display tracking-wide text-[#00B368]">
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </span>

      <button
        @click="nextMonth"
        class="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        title="Bulan berikutnya"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>

    <!-- Week Days Header -->
    <div class="grid grid-cols-7 text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
      <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">{{ d }}</span>
    </div>

    <!-- Days Grid -->
    <div class="grid grid-cols-7 gap-y-0.5 text-center text-xs">
      <div
        v-for="(day, idx) in calendarDays"
        :key="idx"
        class="flex flex-col items-center justify-center py-0.5"
      >
        <button
          @click="selectDay(day)"
          :class="[
            'w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all text-[11px] font-medium relative',
            day.isSelected
              ? 'bg-[#00B368] text-white shadow-md font-bold'
              : day.isCurrentMonth
                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-300 dark:text-slate-600 opacity-50'
          ]"
        >
          {{ day.date }}
          <!-- Event Indicator Dot -->
          <span
            v-if="day.hasEvent && !day.isSelected"
            class="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#00B368] animate-pulse"
          ></span>
        </button>
      </div>
    </div>

    <!-- Selected Date Agenda List -->
    <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-between">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">
          Agenda: {{ selectedDateFormatted }}
        </span>
        <span class="text-[9px] text-slate-400">
          {{ displaySchedules.length }} kegiatan
        </span>
      </div>

      <!-- Schedule Items List -->
      <div class="space-y-1 max-h-[65px] sm:max-h-[75px] overflow-y-auto pr-1">
        <div
          v-for="item in displaySchedules"
          :key="item.id"
          class="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] group"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :class="getCategoryColor(item.kategori)"
            ></span>
            <div class="min-w-0 truncate">
              <p class="font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                {{ item.judul }}
              </p>
              <p class="text-[10px] text-slate-400 truncate">
                {{ item.waktu || '08:30' }} • {{ item.nama_barang !== '-' ? item.nama_barang : item.lokasi }}
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons on Hover -->
          <div class="flex items-center gap-1 shrink-0 ml-2">
            <span
              class="text-[9px] px-1.5 py-0.5 rounded font-semibold group-hover:hidden"
              :class="item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ item.status }}
            </span>
            <button
              @click="editSchedule(item)"
              class="hidden group-hover:flex p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300"
              title="Ubah Agenda"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button
              @click="deleteSchedule(item.id)"
              class="hidden group-hover:flex p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-500"
              title="Hapus Agenda"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div v-if="displaySchedules.length === 0" class="text-center py-2 text-slate-400 text-[11px] flex flex-col items-center">
          <span>Tidak ada agenda perawatan pada tanggal ini.</span>
          <button
            @click="openAddModal"
            class="text-[#00B368] hover:underline font-semibold mt-1 text-[10px]"
          >
            + Tambah Agenda
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMaintenanceStore } from '../stores/maintenance';
import { useAssetStore } from '../stores/asset';

const maintenanceStore = useMaintenanceStore();
const assetStore = useAssetStore();

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const currentMonth = ref(8); // September (0-indexed)
const currentYear = ref(2026);
const selectedDate = ref(20);

onMounted(() => {
  maintenanceStore.fetchSchedules();
});

const selectedDateFormatted = computed(() => {
  return `${selectedDate.value} ${monthNames[currentMonth.value]} ${currentYear.value}`;
});

// Event dates map for current visible month
const eventDatesInMonth = computed(() => {
  const events = maintenanceStore.getEventsForMonth(currentYear.value, currentMonth.value);
  const days = new Set();
  events.forEach(e => {
    if (e.tanggalYMD) {
      const parts = e.tanggalYMD.split('-');
      if (parts.length === 3) {
        days.add(parseInt(parts[2], 10));
      }
    }
  });
  return days;
});

// Calendar grid days
const calendarDays = computed(() => {
  const days = [];
  const firstDayIndex = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const prevMonthLastDate = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const currentMonthLastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

  // Prev month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDate - i,
      isCurrentMonth: false,
      isSelected: false,
      hasEvent: false
    });
  }

  // Current month days
  for (let i = 1; i <= currentMonthLastDate; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isSelected: i === selectedDate.value,
      hasEvent: eventDatesInMonth.value.has(i)
    });
  }

  // Next month leading days to fill 35 or 42 grid cells
  const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isSelected: false,
      hasEvent: false
    });
  }

  return days;
});

// Schedules to show
const displaySchedules = computed(() => {
  const m = String(currentMonth.value + 1).padStart(2, '0');
  const d = String(selectedDate.value).padStart(2, '0');
  const targetYMD = `${currentYear.value}-${m}-${d}`;
  
  const forSelected = maintenanceStore.normalizedSchedules.filter(s => s.tanggalYMD === targetYMD);
  if (forSelected.length > 0) return forSelected;

  // If no schedules on selected day, show up to 3 upcoming schedules this month
  const monthPrefix = `${currentYear.value}-${m}`;
  return maintenanceStore.normalizedSchedules
    .filter(s => s.tanggalYMD && s.tanggalYMD.startsWith(monthPrefix))
    .slice(0, 3);
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDay(day) {
  if (day.isCurrentMonth) {
    selectedDate.value = day.date;
    maintenanceStore.selectedDate = new Date(currentYear.value, currentMonth.value, day.date);
  }
}

function openAddModal() {
  const targetDate = new Date(currentYear.value, currentMonth.value, selectedDate.value);
  maintenanceStore.openModal(null, targetDate);
}

function editSchedule(schedule) {
  maintenanceStore.openModal(schedule);
}

async function deleteSchedule(id) {
  if (confirm('Hapus agenda perawatan ini?')) {
    const res = await maintenanceStore.deleteSchedule(id);
    assetStore.showToast(res.message);
  }
}

function getCategoryColor(cat) {
  switch (cat) {
    case 'Inspeksi': return 'bg-[#00B368]';
    case 'Uji KIR': return 'bg-[#F59E0B]';
    case 'Perbaikan': return 'bg-red-500';
    case 'Servis Rutin': return 'bg-blue-500';
    default: return 'bg-teal-500';
  }
}
</script>
