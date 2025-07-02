import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';
import { requireAuth, requireStaffOrAdmin } from '../middleware/authMiddleware';
const router = Router();
router.get('/', requireAuth, requireStaffOrAdmin, getCustomers);
router.get('/:id', requireAuth, requireStaffOrAdmin, getCustomerById);
router.post('/', requireAuth, requireStaffOrAdmin, createCustomer);
router.put('/:id', requireAuth, requireStaffOrAdmin, updateCustomer);
router.delete('/:id', requireAuth, requireStaffOrAdmin, deleteCustomer);
export default router; 