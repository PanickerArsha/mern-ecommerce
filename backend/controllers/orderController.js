import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

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

export const createRazorpayOrder = async (req,res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({userId}).populate("items.productId");

    if (!cart) {
      return res.json({message: "Cart empty",});
    }

    const totalAmount = cart.items.reduce((total, item) =>total +item.productId.price *item.quantity,0);

    const razorpayOrder =await razorpay.orders.create({
        amount:
        totalAmount * 100,
        currency: "INR",
      });

    res.json({
      success: true,
      orderId:razorpayOrder.id,
      amount:razorpayOrder.amount,
      currency:razorpayOrder.currency,
      key:process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.json({message:"Order creation failed"});
  }
};

export const verifyPayment =
  async (req, res) => {
    try {
      const {razorpay_order_id,razorpay_payment_id,razorpay_signature,userId,address} = req.body;
//to verify the payment, we generate a signature using the order ID and payment ID received from Razorpay. We then compare this generated signature with the signature sent by Razorpay. If they match, it confirms that the payment is valid and has not been tampered with. If they do not match, it indicates a potential issue with the payment verification process.
      const generatedSignature =
        crypto
          .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest("hex");

      if (generatedSignature !==razorpay_signature) {
        return res.status(400).json({
          message:"Payment verification failed",
        });
      }

      const cart =await Cart.findOne({userId,}).populate("items.productId");

      const orderItems = cart.items.map((item) => ({
            productId:item.productId._id,
            quantity:item.quantity,
            price:item.productId.price,
          })
        );

      const totalAmount =orderItems.reduce((total, item) =>total +item.price *item.quantity,0);

      const order =await Order.create({
          user: userId,
          items: orderItems,
          address,
          totalAmount,
          paymentMethod:"Razorpay",
          paymentStatus:"Paid",
          razorpayOrderId:razorpay_order_id,
          razorpayPaymentId:razorpay_payment_id,
        });

      for (let item of cart.items) {
        await Product.findByIdAndUpdate(
          item.productId._id,
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      await Cart.findOneAndUpdate({ userId },{ items: [] });

      res.json({success: true,order});
    } catch (error) {
      console.log(error);
    }
  };


