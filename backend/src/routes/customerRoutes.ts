import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';
import { requireAdmin } from '../middleware/authMiddleware';
const router = Router();

router.get('/', requireAdmin, getCustomers);
router.get('/:id', requireAdmin, getCustomerById);
router.post('/', requireAdmin, createCustomer);
router.put('/:id', requireAdmin, updateCustomer);
router.delete('/:id', requireAdmin, deleteCustomer);
export default router; 