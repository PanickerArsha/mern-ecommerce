import Cart from "../models/Cart.js";
import mongoose from 'mongoose';

// Add a product to the cart 
export const addToCart = async (req, res) => {
    try {
        console.log('addToCart called with body:', req.body);
        // Extract userId and productId from the request body
        const { userId, productId } = req.body;

        // Basic validation
        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid userId or productId format' });
        }

        // Ensure DB connection is ready
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        let cart = await Cart.findOne({ userId }); // Find the cart for the user
        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
        } else {
            // If cart exists, check if the product is already in the cart
            const item = cart.items.find(item => item.productId.toString() === productId);
            if (item) {
                // If the product is already in the cart, increment the quantity
                item.quantity += 1;
            } else {
                // If the product is not in the cart, add it to the cart
                cart.items.push({ productId, quantity: 1 });
            }
        }
        await cart.save(); // Save the cart to the database
        res.json({
            message: 'Product added to cart successfully',
            cart
            }); // Return the updated cart
    }
    catch (error) {
        console.error('addToCart error:', error);
        res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
    }   
};

// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid userId or productId format' });
        }
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        const cart = await Cart.findOne({ userId }); // Find the cart for the user
        if (!cart) {
            return res.json({ message: 'Cart not found' });
        }
        // Find the index of the product in the cart
        const item= cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.json({ message: 'Product not found in cart' });
        }
        // If the product is found, remove it from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save(); // Save the updated cart to the database
        res.json({
            message: 'Product removed from cart successfully',
            cart
        }); // Return the updated cart      

    }
    catch (error) {
        console.error('removeFromCart error:', error);
        res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
    }
}
 

//update the quantity of a product in the cart
export const updateQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || typeof quantity === 'undefined') {
            return res.status(400).json({ message: 'userId, productId and quantity are required' });
        }
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid userId or productId format' });
        }
        if (!Number.isFinite(Number(quantity)) || Number(quantity) < 0) {
            return res.status(400).json({ message: 'quantity must be a non-negative number' });
        }
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        const cart = await Cart.findOne({ userId }); // Find the cart for the user
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Find the index of the product in the cart
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.json({ message: 'Product not found in cart' });
        }
        // If the product is found, update the quantity
        item.quantity = quantity;
        await cart.save(); // Save the updated cart to the database
        res.json({
            message: 'Product quantity updated successfully',
            cart
        }); // Return the updated cart

    }    catch (error) {
        console.error('updateQuantity error:', error);
        res.status(500).json({ message: 'Failed to update product quantity', error: error.message });
    }
}

// Get the cart for a user
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        //populate will bring productid from the item and replace it with the actual product details from the product collection in the database
        const cart = await Cart.findOne({ userId }).populate('items.productId'); // Find the cart for the user and populate the product details
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart); // Return the cart
    }    catch (error) {
        console.error('getCart error:', error);
        res.status(500).json({ message: 'Failed to get cart', error: error.message });
    }
}