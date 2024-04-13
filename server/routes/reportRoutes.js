// reportRoutes.js
import express from 'express';
import {
  getMostOrderedPlates,
  getPeakOrderTime,
  getComplaintsByDish,
  getAverageEatingTime,
  getComplaintsByPersonnel,
  getWaiterEfficiency
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/most-ordered-plates', getMostOrderedPlates);
router.get('/complaints-by-dish', getComplaintsByDish);
router.get('/average-eating-time', getAverageEatingTime);
router.get('/peak-order-time', getPeakOrderTime);
router.get('/complain-by-personnel', getComplaintsByPersonnel);
router.get('/waiter-efficiency', getWaiterEfficiency);


export default router;
