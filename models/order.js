const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: Number,
    orderId: { type: String, required: true, unique: true },
    officePlace: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    fromWhere: { type: String, required: true },
    toWhere: { type: String, required: true },
    products: { type: String, required: true },
    quantity: { type: Number, required: true },
    estimatedDelivery: Date,
    isShipment: { type: Boolean, required: true },
    isPayment: { type: Boolean, required: true },
    shipmentMethod: String,
    adminNote: String,
    status: [{
        date: Date,
        movementPlace: String,
        movementDesc: String,
    }],
    orderState: { type: Number, default: 0 },
    isFinished: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);