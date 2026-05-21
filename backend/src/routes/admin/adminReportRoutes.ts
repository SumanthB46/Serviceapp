import express from 'express';
import { getReports, createReport, deleteReport, getDashboardStats, getAnalyticsStats } from '../../controllers/admin/adminReportController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalyticsStats);

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .delete(deleteReport);

export default router;



