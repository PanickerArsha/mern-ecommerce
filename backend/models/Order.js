import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      fullName: { type: String, required: true },
      addressLine: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "Pending"},
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, default: "Placed"},
    paymentMethod: { type: String, default: "COD" },
    status: { type: String, default: "Placed" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
