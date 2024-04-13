import express from 'express';
import { createOrder, printOrder, closeOrder, kitchenDisplay, barDisplay } from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/print/:orderId', printOrder);
router.post('/close', closeOrder);
router.get('/kitchen', kitchenDisplay);
router.get('/bar', barDisplay);

export default router;
