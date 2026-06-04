import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
     },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the Product model
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

export default mongoose.model('Cart', cartSchema);