
import mongoose from "mongoose";
// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    seatNumber: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// const Order = mongoose.model('Order', orderSchema);

// module.exports = {Order};

export default mongoose.model("Order", orderSchema);
