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

router.get('/mostOrderedPlates', getMostOrderedPlates);
router.get('/complaintsByDish', getComplaintsByDish);
router.get('/averageEatingTime', getAverageEatingTime);
router.get('/peakOrderTime', getPeakOrderTime);
router.get('/complaintsByPersonnel', getComplaintsByPersonnel);
router.get('/waiterEfficiency', getWaiterEfficiency);


export default router;
