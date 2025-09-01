import express from 'express';
import adminAuth from '../middleware/adminAuth.js';

import {
  placeOrder,
  allOrders,
  userOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();
// ONLY ADMIN TERRITORY
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateOrderStatus);

// USER PAISA WASOOL
orderRouter.post('/placeOrder', authUser, placeOrder);

// USER TERRITORY

orderRouter.post('/userOrders', authUser, userOrders);

export default orderRouter;
