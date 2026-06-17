import express from 'express';
import {placeOrder, verifyPayment,createRazorpayOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place-order', placeOrder);
router.post("/create-razorpay-order",createRazorpayOrder);
router.post("/verify-payment",verifyPayment);

export default router;