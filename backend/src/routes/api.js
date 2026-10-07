import express from 'express';
import * as authController from '../controllers/authController.js';
import * as assetController from '../controllers/assetController.js';
import * as userController from '../controllers/userController.js';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { authenticateToken, optionalAuthenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Auth & Profile Routes
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.me);
router.post('/auth/logout', authController.logout);
router.put('/auth/profile', authenticateToken, userController.updateProfile);

// User Management Routes (Super Admin Only)
router.get('/users', authenticateToken, requireSuperAdmin, userController.getUsers);
router.post('/users', authenticateToken, requireSuperAdmin, userController.createUser);
router.put('/users/:id', authenticateToken, requireSuperAdmin, userController.updateUser);
router.delete('/users/:id', authenticateToken, requireSuperAdmin, userController.deleteUser);

// Assets Routes
router.get('/assets/export/csv', optionalAuthenticateToken, assetController.exportAssetsCsv);
router.post('/assets/import/csv', authenticateToken, assetController.importAssetsCsv);
router.post('/assets/sync-sheets', authenticateToken, assetController.syncGoogleSheetsController);
router.get('/assets', optionalAuthenticateToken, assetController.getAssets);
router.get('/assets/:id', optionalAuthenticateToken, assetController.getAssetById);
router.post('/assets', authenticateToken, assetController.createAsset);
router.put('/assets/:id', authenticateToken, assetController.updateAsset);
router.delete('/assets/:id', authenticateToken, requireSuperAdmin, assetController.deleteAsset);

// Deleted Log Routes (Super Admin Only for Restore and Hard Delete)
router.get('/deleted-log', authenticateToken, requireSuperAdmin, assetController.getDeletedLog);
router.post('/deleted-log/:id/restore', authenticateToken, requireSuperAdmin, assetController.restoreDeletedLog);
router.delete('/deleted-log/:id', authenticateToken, requireSuperAdmin, assetController.hardDeleteLog);

// Maintenance Calendar Routes
router.get('/maintenance', optionalAuthenticateToken, maintenanceController.getMaintenance);
router.post('/maintenance', authenticateToken, maintenanceController.createMaintenance);
router.put('/maintenance/:id', authenticateToken, maintenanceController.updateMaintenance);
router.delete('/maintenance/:id', authenticateToken, maintenanceController.deleteMaintenance);

// Stats Route
router.get('/stats', optionalAuthenticateToken, assetController.getStats);

export default router;
