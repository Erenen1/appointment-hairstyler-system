import { Router } from "express";
import CustomerController from "./customer.controller";
import CustomerService from "./customer.service";
import CustomerRepository from "./customer.repository";
import { requireAdmin } from "../../middleware/authMiddleware";

/**
 * Müşteri modülü için route tanımlamaları
 */

// Dependency Injection
const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const router = Router();

// Routes
router.get('/', requireAdmin, customerController.getAllCustomers.bind(customerController));
router.get('/:id', requireAdmin, customerController.getCustomerById.bind(customerController));
router.post('/', requireAdmin, customerController.createCustomer.bind(customerController));
router.put('/:id', requireAdmin, customerController.updateCustomer.bind(customerController));
router.delete('/:id', requireAdmin, customerController.deleteCustomer.bind(customerController));

export default router; 