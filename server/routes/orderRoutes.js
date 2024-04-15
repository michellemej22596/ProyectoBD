import express from 'express';
import {printOrder, 
    closeOrder, 
    kitchenDisplay, 
    barDisplay,
    getDrinks, 
    getPlates, 
    takeOrder, 
    getOrderDetailsByTable, 
    updateOrderToPrepared, 
    updateFoodPrepared,
    updateDrinksPrepared, 
    closeAccountByTable, 
    getLatestOrderForTable } from '../controllers/orderController.js';

const router = express.Router();

router.get('/print/:orderId', printOrder);
router.post('/close', closeOrder);
router.get('/kitchen', kitchenDisplay);
router.get('/bar', barDisplay);
router.get('/plates', getPlates);
router.get('/drinks', getDrinks);
router.patch('/order/:orderId/status', closeOrder);
router.post('/takeOrder', takeOrder);
router.get('/printOrder/:orderId', printOrder);
router.get('/table/:tableNumber', getOrderDetailsByTable);

router.patch('/order/:orderId/preparedFood', updateFoodPrepared);
router.patch('/order/:orderId/preparedDrinks', updateDrinksPrepared);

router.patch('order/:orderId/prepared', updateOrderToPrepared);
router.patch('/orders/close/:tableNumber', closeAccountByTable);
router.get('/orders/latest/:tableNumber', getLatestOrderForTable);




export default router;
