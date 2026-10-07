<template>
  <div id="app-root">
    <router-view />

    <!-- Global Modals & Toasts -->
    <LoginModal />
    <AssetDetailModal />
    <AssetFormModal />
    <ConfirmDeleteModal />
    <MaintenanceModal />
    <ImageZoomModal />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import LoginModal from './components/LoginModal.vue';
import AssetDetailModal from './components/AssetDetailModal.vue';
import AssetFormModal from './components/AssetFormModal.vue';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue';
import MaintenanceModal from './components/MaintenanceModal.vue';
import ImageZoomModal from './components/ImageZoomModal.vue';
import ToastContainer from './components/ToastContainer.vue';
import { useAuthStore } from './stores/auth';
import { useAssetStore } from './stores/asset';
import { useThemeStore } from './stores/theme';

const authStore = useAuthStore();
const assetStore = useAssetStore();
const themeStore = useThemeStore();

onMounted(async () => {
  themeStore.initTheme();
  await authStore.checkAuth();
  await assetStore.refreshAll();
});
</script>
