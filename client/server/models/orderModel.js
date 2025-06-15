import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'shipped', 'delivered'],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;