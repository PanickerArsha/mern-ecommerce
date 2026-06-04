import express from 'express';
import { addToCart, getCart, removeFromCart,updateQuantity } from '../controllers/cartController.js';

const router = express.Router();

// Route to add a product to the cart
router.post('/add', addToCart);
// Route to remove a product from the cart
router.post('/remove', removeFromCart);
// Route to update the quantity of a product in the cart
router.post('/update', updateQuantity);
// Route to get the cart for a user
router.get('/:userId', getCart);

export default router;
