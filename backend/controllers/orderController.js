import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Place an order
export const placeOrder = async (req, res) => {
    try {
        const {userId, address, paymentMethod} = req.body;
        // Fetch cart items for the user
        //populate method is used to replace the specified path in the document (in this case, 'items.productId') with the actual documents from the Product collection. This allows us to access the product details (like price) directly when preparing the order items and calculating the total amount. If the cart is empty, it returns a message indicating that the cart is empty.
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.json({ message: 'Cart is empty' });
        }
        //Prepare order items and calculate total amount
        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));
        const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        //deduct stock quantity for each product in the order
        for (let item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
        }
        //Create order document
        const order = await Order.create({
            user: userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod,
        });
        
        //Clear user's cart after placing order
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.json({ message: 'Order placed successfully', order });
    }
    catch (error) {
        res.json({message: 'Error placing order', error});
    }
};

