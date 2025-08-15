import { Router } from 'express';
import authRouter from './auth/auth.route';
import businessAuthRouter from './business-auth/business-auth.route';
import crmCustomerRouter from './crm/customer.route';
import appointmentsRouter from './schedule/appointments.route';
import incomeRouter from './finance/income.route';
import expenseRouter from './finance/expense.route';
import currentAccountRouter from './finance/current-account.route';
import listingsRouter from './listings/listings.route';
import analyticsRouter from './analytics/analytics.route';
import statisticsRouter from './analytics/statistics.route';
import settingsRouter from './settings/settings.route';
import whatsappRouter from './messaging/whatsapp.route';
import homeRouter from './home/home.route';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/business-auth', businessAuthRouter);
router.use('/api/crm/customers', crmCustomerRouter);
router.use('/api/schedule/appointments', appointmentsRouter);
router.use('/api/finance/incomes', incomeRouter);
router.use('/api/finance/expenses', expenseRouter);
router.use('/api/finance/current-accounts', currentAccountRouter);
router.use('/api/listings/properties', listingsRouter);
router.use('/api/analytics/properties', analyticsRouter);
router.use('/api/analytics', statisticsRouter);
router.use('/api/dashboard', statisticsRouter);
router.use('/api/settings', settingsRouter);
router.use('/api/messaging/whatsapp', whatsappRouter);
router.use('/api/home', homeRouter);

export default router;


