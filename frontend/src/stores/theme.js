import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = localStorage.getItem('sigap_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = ref(savedTheme ? savedTheme === 'dark' : prefersDark);

  function applyTheme(dark) {
    isDark.value = dark;
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sigap_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sigap_theme', 'light');
    }
  }

  function toggleTheme() {
    applyTheme(!isDark.value);
  }

  function initTheme() {
    applyTheme(isDark.value);
  }

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initTheme
  };
});
