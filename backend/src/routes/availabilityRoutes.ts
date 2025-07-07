import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import {
  getAllStaffAvailability,
  getStaffAvailability,
  createAvailability,
  bulkCreateAvailability,
  updateAvailability,
  deleteAvailability
} from '../controllers/availabilityController';

const router = Router();

// Tüm personellerin müsaitlik durumları (randevu alma için)
router.get('/all', getAllStaffAvailability);

// Müsaitlik kayıtları listesi/filtreleme
router.get('/', getStaffAvailability);

// Yeni müsaitlik kaydı oluştur (admin)
router.post('/', requireAdmin, createAvailability);

// Toplu müsaitlik kaydı oluştur (admin)
router.post('/bulk', requireAdmin, bulkCreateAvailability);

// Müsaitlik kaydı güncelle (admin)
router.put('/:id', requireAdmin, updateAvailability);

// Müsaitlik kaydı sil (admin)
router.delete('/:id', requireAdmin, deleteAvailability);

export default router; 