import { Router } from "express";
import CustomerController from "./customer.controller";
import CustomerService from "./customer.service";
import CustomerRepository from "./customer.repository";
import { requireBusinessOrAdmin, applyBusinessContext } from "../../middleware/businessAuthMiddleware";

/**
 * Müşteri modülü için route tanımlamaları
 */

// Dependency Injection
const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const router = Router();

// Routes (Business context gerektirir)
router.get('/', requireBusinessOrAdmin, applyBusinessContext, customerController.getAllCustomers.bind(customerController));
router.get('/:id', requireBusinessOrAdmin, applyBusinessContext, customerController.getCustomerById.bind(customerController));
router.post('/', requireBusinessOrAdmin, applyBusinessContext, customerController.createCustomer.bind(customerController));
router.put('/:id', requireBusinessOrAdmin, applyBusinessContext, customerController.updateCustomer.bind(customerController));
router.delete('/:id', requireBusinessOrAdmin, applyBusinessContext, customerController.deleteCustomer.bind(customerController));

export default router; 